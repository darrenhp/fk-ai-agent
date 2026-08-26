---
title: 术语表
chapter: "附录"
order: 1
summary: 全站统一术语的中英对照与一句话定义，避免各页各说各话。
---

# 术语表

> 全站统一术语表。新增术语请以本表为准；正文首次出现外文术语时附中文说明。相关页用根相对路径链接。

| 术语 | 中文 | 一句话定义 | 相关页 |
|---|---|---|---|
| Agent Loop | 智能体循环 | 感知-思考-行动（Perceive–Think–Act）的反复执行循环，是 Agent 的运行骨架 | [/01-agent-basics/agent-loop](/01-agent-basics/agent-loop) |
| Tool | 工具 | Agent 可调用的外部能力，以 JSON Schema 描述输入/输出契约 | [/01-agent-basics/tool-abstraction](/01-agent-basics/tool-abstraction) |
| Skill | 技能 | 预置的可复用能力包（提示词/脚本/工作流），区别于 MCP 的协议化远程能力 | [/02-capability-extension/skill-management](/02-capability-extension/skill-management) |
| MCP | Model Context Protocol（模型上下文协议） | Agent 与 Tool/Resource/Prompt 之间的标准化 client-server 通信协议 | [/02-capability-extension/mcp](/02-capability-extension/mcp) |
| RAG | 检索增强生成（Retrieval-Augmented Generation） | 先检索外部知识再生成，缓解模型参数知识过时与幻觉 | [/03-context-memory/rag](/03-context-memory/rag) |
| Checkpoint | 检查点 | 运行中保存的可恢复状态快照，用于会话恢复与回滚 | [/03-context-memory/session-state](/03-context-memory/session-state) |
| Context Window | 上下文窗口 | 单次推理可容纳的 token 上限，决定可注入信息的容量 | [/03-context-memory/context-window](/03-context-memory/context-window) |
| Prompt Injection | 提示注入 | 攻击者通过外部内容把恶意指令混入模型上下文的攻击 | [/05-safety-governance/prompt-injection](/05-safety-governance/prompt-injection) |
| Guardrails | 安全护栏 | 对输入/输出/行为的过滤与拦截层，限制 Agent 越界 | [/05-safety-governance/guardrails](/05-safety-governance/guardrails) |
| Kill Switch | 紧急停止开关 | 运行时熔断机制，立即中止 Agent 执行（区别于事后回滚） | [/05-safety-governance/kill-switch](/05-safety-governance/kill-switch) |
| ReAct | Reason + Act（推理-行动） | 走一步看一步的推理-行动交织范式 | [/01-agent-basics/agent-loop](/01-agent-basics/agent-loop) |
| Plan-and-Execute | 先规划后执行 | 先产出完整计划再逐步执行的范式，区别于 ReAct | [/04-planning-execution/plan-and-execute](/04-planning-execution/plan-and-execute) |
| Orchestrator-Worker | 编排者-工作者 | 主 Agent 拆解任务、委派子 Agent、聚合结果的多 Agent 模式 | [/02-capability-extension/multi-agent](/02-capability-extension/multi-agent) |
| A2A | Agent-to-Agent（智能体间通信） | Agent 之间的任务委派与结果交换协议，区别于 MCP 的 Agent-Tool 通信 | [/02-capability-extension/multi-agent](/02-capability-extension/multi-agent) |
| OTEL | OpenTelemetry（开放遥测） | 厂商无关的可观测性埋点标准，定义 trace/span 等语义约定 | [/06-engineering-ops/observability-otel-langfuse](/06-engineering-ops/observability-otel-langfuse) |
| Langfuse | — | 开源 LLM 可观测平台，OTel-native，提供 trace 可视化与评测 | [/06-engineering-ops/observability-otel-langfuse](/06-engineering-ops/observability-otel-langfuse) |
| SWE-bench | — | 软件工程修复基准（给定 issue + 仓库，要求生成通过测试的补丁） | [/06-engineering-ops/evaluation-swebench](/06-engineering-ops/evaluation-swebench) |
| mem0 | — | 面向 LLM 应用的长期记忆层，提供记忆的增删改查与抽取 | [/03-context-memory/long-term-memory](/03-context-memory/long-term-memory) |
| Compaction | 上下文压缩 | 对过长上下文做摘要/裁剪以适配窗口的过程 | [/03-context-memory/context-window](/03-context-memory/context-window) |
| Human-in-the-loop | 人在回路 | 在关键节点引入人工审批/确认的控制机制 | [/05-safety-governance/audit-rollback](/05-safety-governance/audit-rollback) |
| Fallback | 降级/回退 | 主路径失败或超预算时切换到的备选路径或模型 | [/04-planning-execution/error-recovery](/04-planning-execution/error-recovery) |
| Side-effect Tool | 副作用工具 | 执行会产生外部状态变更的工具（写文件、发邮件、调 API） | [/01-agent-basics/concurrency](/01-agent-basics/concurrency) |
| Idempotent Tool | 幂等工具 | 重复调用产生相同结果、无额外副作用的工具 | [/01-agent-basics/tool-abstraction](/01-agent-basics/tool-abstraction) |

---

*最后核实日期：2026-08-26*
