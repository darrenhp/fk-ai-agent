---
layout: home

hero:
  name: AI Agent 工程入门
  text: 面向资深工程师的设计资料站
  tagline: 系统覆盖 Agent 工程核心主题 —— 去水分、直奔设计决策、每个知识点用「是什么 / 怎么做 / 为什么」三段式讲清。
  actions:
    - theme: brand
      text: 从 Agent Loop 开始
      link: /01-agent-basics/agent-loop
    - theme: alt
      text: 查看术语表
      link: /glossary

features:
  - icon: 🔁
    title: Agent 基础架构
    details: Agent Loop、工具抽象、结构化输出与函数调用、终止条件与预算控制、并发与竞态。
    link: /01-agent-basics/agent-loop
    linkText: 第一章
  - icon: 🧩
    title: 能力扩展机制
    details: Skill 加载与管理、MCP 加载与扩展、权限与沙箱、多 Agent 编排与子 Agent 委派。
    link: /02-capability-extension/skill-management
    linkText: 第二章
  - icon: 🧠
    title: 上下文与记忆
    details: 上下文工程、上下文窗口管理、长期记忆管理、状态与会话持久化、RAG 检索增强。
    link: /03-context-memory/context-engineering
    linkText: 第三章
  - icon: 🗺️
    title: 规划与执行
    details: Plan-and-Execute 模式切换、任务列表管理、错误处理与自我修正、模型路由与多模型编排。
    link: /04-planning-execution/plan-and-execute
    linkText: 第四章
  - icon: 🛡️
    title: 安全与治理
    details: Prompt 防注入、审计和回滚、安全护栏与内容审核、紧急停止机制。
    link: /05-safety-governance/prompt-injection
    linkText: 第五章
  - icon: ⚙️
    title: 工程化与运维
    details: Prompt 管理、可观测性（OTEL + Langfuse）、可评估性、成本与延迟优化、部署与扩展性。
    link: /06-engineering-ops/prompt-management
    linkText: 第六章
---

## 这个站点是什么

本站是一份**工程向**的 AI Agent 设计资料，面向已有分布式系统、算法与基本 ML/LLM 背景的工程师。不解释「什么是 API」「什么是向量」这类基础概念，只聚焦 Agent 领域特有的设计决策与权衡。

全站按「从内到外」的工程分层组织为 6 章、24 个主题页，外加术语表与架构决策矩阵速查页。建议先按章节顺序通读，再用决策矩阵做索引式回顾。

## 内容规范

每个主题页统一采用三段式：

1. **是什么** —— 1–2 句定义问题域，不铺垫。
2. **怎么做** —— 关键技术选择 + 最小可用实现思路，对比用表格、流程用 Mermaid 图。
3. **为什么** —— 不这样做的后果，或与替代方案的权衡。

涉及协议 / 规范 / 基准版本（如 MCP、OTEL + Langfuse、SWE-bench）的页面已 web search 核实当前版本，并在页底标注「最后核实日期」。
