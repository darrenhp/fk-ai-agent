---
title: 长期记忆
chapter: "3.3"
order: 3
summary: 对比本地文件、向量库与 mem0 三类持久化方案，并按情景/语义/程序性记忆分类组织跨会话知识。
---
# 长期记忆

## 是什么
长期记忆解决跨会话、跨运行的知识留存问题，使 Agent 在多日任务中积累经验而非每次从零开始，是 RAG 与 Session State 之外的持久层。

## 怎么做
**存储选型对比**：

| 方案 | 写入成本 | 检索方式 | 适合场景 | 局限 |
|------|----------|----------|----------|------|
| 本地文件（append-only log / 结构化 md） | 极低 | 全文/前缀扫描 | 小规模、可审计、单人 | 规模大后检索慢 |
| 向量库（pgvector / Qdrant） | 中 | 语义近邻 | 大规模非结构化知识 | 需维护 embedding |
| mem0 | 中高 | 自动抽取+语义 | 多 agent 共享、经验沉淀 | 黑盒、外部依赖 |

**三类记忆划分**：
- **情景记忆（episodic）**：具体发生过的事（“上次部署失败了因为端口冲突”）→ 本地 log 或向量库。
- **语义记忆（semantic）**：提炼的事实与偏好（“用户偏好 TypeScript”）→ 结构化 md / mem0。
- **程序性记忆（procedural）**：可复用的操作套路 → Skill 或工具固化，而非纯文本。

最小实现：用 append-only `memory.md`，每次运行结束追加一条结构化记录；检索时按标签 grep，规模上来再迁向量库。

## 为什么
没有长期记忆，Agent 每次会话都是“失忆患者”，重复踩坑、无法个性化。但过早引入重方案（向量库/mem0）会增加运维面——按数据量增长切换即可。

## 常见误区
- 把所有东西塞向量库，却没区分三类记忆，导致检索噪声高。
- 本地文件不 append-only，被后续运行覆盖而丢失历史。

## 业界实现对照
- mem0：显式区分 episodic/semantic/procedural，提供统一 API（[docs](https://docs.mem0.ai/)）。
- LangChain：`VectorStore` + `Memory` 抽象持久化语义记忆（[docs](https://python.langchain.com/docs/integrations/providers/)）。

## 延伸阅读
- [RAG 检索增强](/03-context-memory/rag)
- [会话状态与恢复](/03-context-memory/session-state)
- [上下文工程](/03-context-memory/context-engineering)
- [Skill 管理](/02-capability-extension/skill-management)

---
*最后核实日期：2026-08-26*
