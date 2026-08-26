---
title: 成本与延迟优化
chapter: "6.4"
order: 4
summary: Prompt caching、批处理、投机执行与上下文精简对 Agent 单位成本的工程影响。
---
# 成本与延迟优化

## 是什么
Agent 的单位成本 = 每次 LLM/检索调用的 token 数 × 单价，再乘以 Agent Loop 的步数。本页解决“如何在保持任务达成率的前提下，把单 run 的 token 与往返次数压到最低”。

## 怎么做
- **Prompt Caching**：把系统提示、Tool schema、稳定前缀标记为缓存段，命中后仅计缓存读取价（约为输入价的 1/10）。模板化 Prompt 是前提（见 6.1）。
- **批处理**：对非实时步骤（多候选评估、批量嵌入）走 batch API，折扣且削峰。
- **投机执行（speculative tool calls）**：在 LLM 输出首个 tool 调用意图时，并行预执行无副作用的只读 Tool（如检索、只读查询），缩短关键路径——需保证回滚与幂等。
- **上下文精简**：用 Context Window 预算调度，压缩历史、只回写必要 observation，避免重复喂入整段长文（见 3.2）。

| 手段 | 主要降本来源 | 风险 |
| --- | --- | --- |
| Prompt Caching | 复用稳定前缀 | 前缀变化即失效 |
| 批处理 | 离峰折扣 | 增加延迟 |
| 投机执行 | 缩短关键路径 | 冗余调用、副作用 |
| 上下文精简 | 减少 input token | 丢上下文致失败 |

```python
# 最小：缓存标记 + 投机只读
cache_control = {"type": "ephemeral"}   # 稳定前缀
speculate(read_only_tools, on=first_tool_intent)
```

## 为什么
不做成本工程，Agent 在长程任务上会凭空膨胀：每步都把整段对话塞回 Context Window，token 随步数线性增长，单 run 成本可能在 10 步内翻 3 倍。缓存 + 精简把增长从线性压到边际常量。

## 常见误区
- 投机执行对写操作也预跑，造成重复副作用（发两封邮件）。
- 只看 avg 延迟，忽视 p95——尾部延迟由超长上下文触发。

## 业界实现对照
- **Anthropic Prompt Caching**（https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching）。
- **OpenAI Batch API**（https://platform.openai.com/docs/guides/batch）。
- **Langfuse 成本看板**（https://langfuse.com/docs）。

## 延伸阅读
- [/03-context-memory/context-window](/03-context-memory/context-window)
- [/04-planning-execution/model-routing](/04-planning-execution/model-routing)
- [/06-engineering-ops/prompt-management](/06-engineering-ops/prompt-management)
- [/03-context-memory/rag](/03-context-memory/rag)

---
*最后核实日期：2026-08-26*
