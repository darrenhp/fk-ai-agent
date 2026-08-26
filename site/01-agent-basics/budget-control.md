---
title: 预算控制
chapter: "1.4"
order: 4
summary: 预算控制以 max_steps、token/cost 护栏与重复检测防止 Agent Loop 失控与烧钱。
---
# 预算控制

## 是什么
预算控制是在 Agent Loop 外设的硬约束，防止任务因死循环、模型抖动或恶意输入无限消耗资源。

## 怎么做
三层护栏叠加：

1. **步数上限 max_steps**：loop 累计轮次超阈即终止，返回部分结果。
2. **token/cost budget**：按请求累计 prompt+completion tokens，逼近预算时提前停止并告警。
3. **超时与死循环检测**：单步超时 kill；用滑动窗口检测「重复 tool_calls 序列」或「输出几乎不变」，判定 stuck 后触发 Kill Switch（/05-safety-governance/kill-switch）。

```text
guard(step_count, token_used, elapsed, last_calls):
  if step_count   > MAX_STEPS:        return STOP("step")
  if token_used   > TOKEN_BUDGET:     return STOP("budget")
  if elapsed      > TIMEOUT:          return STOP("timeout")
  if repeats(last_calls, WINDOW):     return STOP("loop")
  return CONTINUE
```

## 为什么
不做预算，一个 prompt injection 诱导的循环或模型 bug 可在数分钟内烧掉巨额调用费，且占用并发槽拖垮其它任务。护栏是 Agent 上生产的最低门槛。

## 常见误区
- 只设 max_steps 不设 cost budget，长上下文单步 token 暴涨仍会超额。
- 重复检测只看相同输入，忽略「换表述但同效果」的软循环。

## 业界实现对照
- OpenAI Agents SDK：max_turns 限制轮次；Guardrails 可拦截。https://openai.github.io/openai-agents-python/ref/agents/
- LangGraph：checkpointer + interrupt 支持在预算点人工/自动暂停。https://langchain-ai.github.io/langgraph/

## 延伸阅读
- /01-agent-basics/agent-loop
- /01-agent-basics/concurrency
- /05-safety-governance/kill-switch
- /06-engineering-ops/cost-latency

---
*最后核实日期：2026-08-26*
