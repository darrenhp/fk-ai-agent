---
title: 上下文工程
chapter: "3.1"
order: 1
summary: 通过结构化编排 system prompt、工具描述与 few-shot 示例的优先级，在有限 Context Window 内最大化模型决策质量。
---
# 上下文工程

## 是什么
上下文工程是在 Agent Loop 每次推理前，决定“往 Context Window 里放什么、以什么顺序、放多少”的系统性设计，目标是用最少的 token 换来最高的下游动作正确率。

## 怎么做
**System prompt 区块结构**（从高到低固定排序）：
1. 身份/目标（role + objective）
2. 全局约束（Guardrails、不可违反的规则）
3. 工具使用协议（ReAct 输出格式约定）
4. 领域知识与当前会话元信息
5. 动态注入区（工具结果、Memory 召回、Plan）

**工具描述的信息密度**：每个 Tool 描述只保留三段——做什么、何时用、参数关键约束。把长文档拆到工具自身的 `description` 而非塞进系统提示；冗余描述会稀释注意力。

**few-shot 示例摆放**：放在工具协议之后、动态区之前；数量 1–3 条即可，优先覆盖高频易错路径。示例过多会挤占 Context Window 并诱导模式拷贝。

优先级排序原则：

| 区块 | 优先级 | 取舍 |
|------|--------|------|
| 全局约束/Guidrails | 最高 | 永远满血保留 |
| 当前任务与 Plan | 高 | 压缩而非丢弃 |
| 工具结果 | 中 | 超长则截断/摘要 |
| 历史对话 | 低 | 可被 compaction 替换 |

## 为什么
不做优先级排序，模型会在长会话中被早期低价值信息占据 Context Window，导致后期工具调用退化、约束被遗忘。上下文是有限预算，编排顺序直接决定有效注意力分配。

## 常见误区
- 把全部工具文档堆进 system prompt，造成“描述噪声淹没指令”。
- 用大量 few-shot 教格式，反而让模型忽视动态工具结果。

## 业界实现对照
- Claude Agent SDK：system prompt 与 tool 描述分离，支持动态 context 注入（[docs](https://docs.anthropic.com/en/docs/agents-and-tools/agent-sdk/overview)）。
- LangChain：通过 `SystemMessage` + `MessagesPlaceholder` 控制上下文装配顺序（[docs](https://python.langchain.com/docs/concepts/prompt_templates/)）。

## 延伸阅读
- [Context Window 预算分配](/03-context-memory/context-window)
- [会话状态与恢复](/03-context-memory/session-state)
- [预算控制与限流](/01-agent-basics/budget-control)
- [Agent Loop 基础](/01-agent-basics/agent-loop)

---
*最后核实日期：2026-08-26*
