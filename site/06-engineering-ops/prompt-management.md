---
title: Prompt 模板化与版本控制
chapter: "6.1"
order: 1
summary: Prompt 与代码同仓管理的取舍、模板化抽象与 A/B 灰度发布工程实践。
---
# Prompt 模板化与版本控制

## 是什么
Prompt 是 Agent 行为的“软代码”：随模型迭代频繁变更，却不像代码那样被编译器约束。本页解决的是“如何把提示词当作可版本化、可灰度、可回滚的产物来管理”。

## 怎么做
- **模板化**：用变量占位（如 `{{tool_schema}}`、`{{user_query}}`）抽离稳定骨架与动态上下文，避免在 Agent Loop 里拼接原始字符串。
- **版本控制**：与代码同仓 vs 独立管理对比：

| 维度 | 与代码同仓 | 独立管理（如 Prompt Registry） |
| --- | --- | --- |
| 回滚 | git revert 即可 | 平台 label 切换，免发版 |
| 评审 | PR + code review | UI 协作 + 评分对比 |
| 运行时热更 | 需重新部署 | 拉取最新 label，秒级生效 |
| 代价 | Prompt 与逻辑耦合 | 引入外部依赖、需鉴权 |

- **A/B 与灰度**：用 label（prod/canary）分流，按 `user_id` 取模分桶；实验组挂 evaluation，对照成本/质量指标再全量。

```python
# 最小实现：模板 + label 路由
prompt = registry.get("system_prompt", label="canary" if is_canary(uid) else "prod")
```

## 为什么
不版本化的 Prompt 是线上事故的隐形来源：一次措辞改动可能让 Tool 调用参数格式漂移、触发 Prompt Injection 防护失效，且无法定位“上周还好好的”到底改了哪句。模板化 + 版本化把不可见的提示词变成可 diff、可回滚的一等公民。

## 常见误区
- 把整段系统提示写死在业务代码里，模型升级时被迫改代码发版。
- 灰度只看成功率，忽略成本与延迟——劣质 Prompt 可能更贵。

## 业界实现对照
- **Langfuse Prompt Management**：版本控制 + label 部署 + Playground（https://langfuse.com/docs/prompts）。
- **Anthropic Prompt Caching**：模板复用配合缓存降低重复前缀成本（https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching）。

## 延伸阅读
- [/06-engineering-ops/observability-otel-langfuse](/06-engineering-ops/observability-otel-langfuse)
- [/06-engineering-ops/cost-latency](/06-engineering-ops/cost-latency)
- [/01-agent-basics/agent-loop](/01-agent-basics/agent-loop)
- [/03-context-memory/context-engineering](/03-context-memory/context-engineering)

---
*最后核实日期：2026-08-26*
