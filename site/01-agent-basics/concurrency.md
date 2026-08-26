---
title: 并发与顺序
chapter: "1.5"
order: 5
summary: 并发以 tool_call_id 对齐乱序结果，按副作用决定是否可并行，保证可复现。
---
# 并发与顺序

## 是什么
并发处理模型一轮返回的多个 tool_calls：在提升吞吐的同时，必须保证结果能正确回填且不破坏副作用语义。

## 怎么做
- **顺序保证**：tool_calls 内的相对顺序不代表执行顺序；回填时一律用 `tool_call_id` 配对，而非数组下标。
- **副作用工具**：写文件、发邮件、支付等不可并行，需按依赖串行或加锁，否则产生竞态与重复副作用。
- **乱序对齐**：并行执行后结果乱序到达，收集齐全再统一追加 `role: tool` 消息，避免上下文错位。

| 工具类型 | 能否并行 | 策略 | 风险 |
| --- | --- | --- | --- |
| 只读/无副作用（搜索、计算） | 是 | 并发 + 聚合 | 低 |
| 幂等写（缓存写入） | 谨慎 | 可并行 | 中 |
| 非幂等写（发邮件、支付） | 否 | 串行/锁 | 高 |

```python
results = await asyncio.gather(*(run(c) for c in calls if safe(c)))
for c in calls:
    msg = results_by_id[c.id] if c.id in results_by_id else await run(c)
    history.append(tool_msg(c.id, msg))   # 以 id 对齐
```

## 为什么
盲目并行非幂等工具会造成重复发信、重复扣款；仅按数组顺序回填则结果与请求错配，模型后续推理基于错误上下文。

## 常见误区
- 用返回顺序索引回填消息，忽略异步乱序，导致 tool 结果错位。
- 把「看起来独立」的写操作直接并行，未检查幂等标注（见 /01-agent-basics/tool-abstraction）。

## 业界实现对照
- OpenAI Agents SDK：默认并行执行 tool_calls，结果按 id 回填。https://openai.github.io/openai-agents-python/
- LangGraph：可用 Send 在节点间并行分发，依赖显式编排。https://langchain-ai.github.io/langgraph/

## 延伸阅读
- /01-agent-basics/tool-abstraction
- /01-agent-basics/structured-output
- /01-agent-basics/budget-control
- /02-capability-extension/permission-sandbox

---
*最后核实日期：2026-08-26*
