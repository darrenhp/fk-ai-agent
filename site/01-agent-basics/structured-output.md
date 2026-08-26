---
title: 结构化输出
chapter: "1.3"
order: 3
summary: 通过 tool_choice 与并行调用约束模型产出，并以 schema 校验+重试保证下游可消费。
---
# 结构化输出

## 是什么
结构化输出解决模型「自由文本不可靠解析」问题，把产物约束成 Tool 调用或 JSON，供程序确定性消费。

## 怎么做
- **tool_choice 模式**：`auto` 允许模型自决是否调用；`required` 强制至少一次调用；`{"name": x}` 锁死单一工具，常用于抽取/分类。
- **并行调用**：模型一轮可返回多个 tool_calls，运行时并发执行（无副作用工具，见 /01-agent-basics/concurrency）。
- **schema 校验与重试**：对工具入参或 JSON 输出用 JSON Schema 校验，失败则把错误作为反馈回填并限制重试次数。

```python
resp = client.chat.completions.create(
    model="x",
    messages=msgs,
    tools=tools,
    tool_choice="required",   # 强制结构化
)
for call in resp.choices[0].message.tool_calls:
    args = json.loads(call.function.arguments)
    validate(args, schema)     # 失败抛 ValidationError
```

| 策略 | 适用 | 风险 |
| --- | --- | --- |
| auto | 开放式对话 | 可能不调用 |
| required | 必须产出结构 | 模型硬凑 |
| 指定 name | 抽取/路由 | 失去灵活性 |

## 为什么
不约束输出，下游只能靠脆弱的正则解析，任一格式漂移即报错；但过度 `required` 会逼模型捏造结构，需结合校验与有限重试。

## 常见误区
- 无限重试校验失败，既烧 token 又可能陷入死循环（配合 /01-agent-basics/budget-control）。
- 把并行调用结果顺序当输入顺序，未用 `tool_call_id` 对齐。

## 业界实现对照
- OpenAI：tool_choice 支持 auto/required/指定；parallel_tool_calls 可关闭。https://platform.openai.com/docs/guides/function-calling
- LangChain：with_structured_output 封装 Pydantic→schema→解析重试。https://python.langchain.com/docs/concepts/structured_outputs/

## 延伸阅读
- /01-agent-basics/agent-loop
- /01-agent-basics/tool-abstraction
- /01-agent-basics/concurrency
- /04-planning-execution/model-routing

---
*最后核实日期：2026-08-26*
