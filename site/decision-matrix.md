---
title: 架构决策矩阵
chapter: "附录"
order: 2
summary: 全站关键选型对照速查页，索引式汇总 + 跳转链接，不复述各页正文。
---

# 架构决策矩阵

> 读完全站后的速查页：把反复出现的选型决策集中成对照表，每条附跳转链接。本文不重复各页正文，只做索引式汇总。

## 1. 推理范式：ReAct vs Plan-and-Execute

| 维度 | ReAct（走一步看一步） | Plan-and-Execute（先规划后执行） |
|---|---|---|
| 适用任务 | 探索性强、步骤依赖运行时反馈 | 步骤可预判、规模大、需可控性 |
| 可控性 | 低，易跑偏 | 高，计划可审阅 |
| 重规划 | 每步自然修正 | 需显式触发重规划 |
| 成本 | 单步便宜但可能绕路 | 规划有额外开销但总步数更稳 |

→ 详见 [4.1 Plan-and-Execute 模式切换](/04-planning-execution/plan-and-execute)；混合模式见 [1.1 Agent Loop](/01-agent-basics/agent-loop)。

## 2. 能力扩展：MCP vs 自建 Skill

| 维度 | MCP（协议化远程能力） | 自建 Skill（本地能力包） |
|---|---|---|
| 通信 | 标准 client-server，跨进程/跨语言 | 进程内或脚本，无标准协议 |
| 复用 | 社区/第三方 server 即插即用 | 需自行维护 |
| 隔离 | 天然进程隔离，便于沙箱 | 隔离需额外设计 |
| 成本 | 多一次 transport 开销 | 零通信开销 |

→ 详见 [2.2 MCP 加载与扩展](/02-capability-extension/mcp)、[2.1 Skill 加载与管理](/02-capability-extension/skill-management)。

## 3. 长期记忆：本地文件 vs 向量库 vs mem0

| 维度 | 本地文件（append-only log / md） | 向量库 | mem0 |
|---|---|---|---|
| 语义检索 | 弱（关键词） | 强（dense） | 强 + 自动抽取 |
| 写入复杂度 | 极低 | 中（embedding 管线） | 中（托管/自托管） |
| 适合 | 审计日志、结构化笔记 | 大规模知识检索 | 对话级记忆抽取 |

→ 详见 [3.3 长期记忆管理](/03-context-memory/long-term-memory)；检索集成见 [3.5 RAG](/03-context-memory/rag)。

## 4. 工具并发：有副作用 vs 无副作用

| 维度 | 无副作用工具（查询/计算） | 有副作用工具（写文件/发邮件） |
|---|---|---|
| 能否并行 | 可以 | 谨慎，需顺序或显式同步 |
| 结果对齐 | 乱序返回按 call_id 对齐 | 需保证顺序与幂等 |
| 风险 | 低 | 重复执行、状态冲突 |

→ 详见 [1.5 并发与竞态](/01-agent-basics/concurrency)、[1.2 工具抽象](/01-agent-basics/tool-abstraction)。

## 5. 安全控制：Kill Switch vs 审计回滚

| 维度 | Kill Switch（紧急停止） | 审计回滚（Audit & Rollback） |
|---|---|---|
| 时序 | 运行时熔断 | 事后纠错 |
| 目标 | 立刻止损 | 恢复到已知良好状态 |
| 依赖 | 全局中断信号/断路器 | 结构化 trace + checkpoint |

→ 详见 [5.4 紧急停止机制](/05-safety-governance/kill-switch)、[5.2 审计和回滚](/05-safety-governance/audit-rollback)。

## 6. Prompt 版本管理：同仓 vs 独立

| 维度 | 与代码同仓 | 独立管理（Prompt 平台） |
|---|---|---|
| 评审 | 走代码 PR | 走平台工作流 |
| A/B 与灰度 | 需自建 | 平台内置 |
| 门槛 | 低 | 需额外系统 |

→ 详见 [6.1 Prompt 管理](/06-engineering-ops/prompt-management)。

## 7. 模型编排：路由与 fallback

| 维度 | 单模型 | 多模型路由 + fallback |
|---|---|---|
| 成本 | 固定 | 简单任务走低廉模型 |
| 质量 | 取决于单模型天花板 | 复杂任务升级强模型 |
| 复杂度 | 低 | 需路由策略与链 |

→ 详见 [4.4 模型路由与多模型编排](/04-planning-execution/model-routing)、[6.4 成本与延迟优化](/06-engineering-ops/cost-latency)。

---

*最后核实日期：2026-08-26*
