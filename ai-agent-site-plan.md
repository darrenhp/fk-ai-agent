# AI Agent 入门资料站 — 建设计划

> 本文档是给执行 Agent（如 Claude Code）的**建站计划**，不是最终内容本身。目标读者是**有多年经验、数学/算法/CS 功底扎实的程序员**，因此内容要"去水分"：不解释基础 CS 概念，直奔工程要点。

---

## 一、目标与定位

- **产出物**：一个静态文档站，系统覆盖 AI Agent 工程的核心主题。
- **受众**：资深工程师。默认读者懂分布式系统、懂基本 ML/LLM 概念，**不需要**解释"什么是 API"“什么是向量”，只需要讲清 Agent 领域特有的设计决策。
- **风格**：每个知识点用统一三段式讲清楚：
  1. **是什么**（1-2 句定义/问题域）
  2. **怎么做**（关键技术选择 + 最小可用实现思路，可含伪代码/图示）
  3. **为什么**（不这么做会有什么问题，权衡是什么）
- **篇幅**：单页 300–600 字为宜，宁可少而准，不做教程式啰嗦。
- **广度优先**：先保证覆盖全（sidebar 完整），再逐页深挖。

---

## 二、信息架构（内容大纲）

按"从内到外"的工程分层组织为 6 章，共 24 个主题页 + 1 个术语表。**执行 Agent 需先按此大纲把 sidebar 骨架全部建出来**，再分批填内容。

### 第一章：Agent 基础架构
| 页面 | 覆盖要点 |
|---|---|
| 1.1 Agent Loop | 感知-思考-行动循环、ReAct（Reason+Act）、function-calling loop 的实现结构；System/Tool/User 消息如何在 loop 中滚动 |
| 1.2 工具抽象 | Tool 的 JSON Schema 设计、输入输出契约、幂等性/副作用标注、工具注册表（registry）模式 |
| 1.3 结构化输出与函数调用 | tool_choice 强制/自动模式、并行调用（parallel tool calls）、输出 schema 校验与重试 |
| 1.4 终止条件与预算控制 | max_steps、token/cost budget guard、超时与死循环检测（重复调用检测） |
| 1.5 并发与竞态 | 工具并行调用的顺序保证、副作用工具（写文件/发邮件）能否并行、乱序返回结果的对齐策略 |

### 第二章：能力扩展机制
| 页面 | 覆盖要点 |
|---|---|
| 2.1 Skill 加载与管理 | Skill 的发现（filesystem scan / registry）、懒加载 vs 预加载、命名空间与版本冲突处理 |
| 2.2 MCP 加载与扩展 | MCP 的 client-server 架构、stdio/SSE/HTTP transport、Tools/Resources/Prompts 三种原语、动态 server 连接生命周期 |
| 2.3 权限与沙箱 | 最小权限原则、工具级权限声明、执行环境隔离（容器/进程沙箱）、危险操作的人工审批门 |
| 2.4 多 Agent 编排与子 Agent 委派 | Orchestrator-Worker 模式、任务拆分与结果聚合、子 Agent 上下文隔离的取舍；Agent 间通信（A2A）：任务委派协议、结果格式约定，区别于 MCP 解决的 Agent-Tool 通信 |

### 第三章：上下文与记忆
| 页面 | 覆盖要点 |
|---|---|
| 3.1 上下文工程 | System prompt 结构设计、工具描述的信息密度、few-shot 示例摆放位置与数量、上下文各区块的优先级排序 |
| 3.2 上下文窗口管理 | token 预算分配、滑动窗口/裁剪策略、中间结果摘要压缩（compaction）、何时触发压缩 |
| 3.3 长期记忆管理 | 本地文件（append-only log / 结构化 md）vs 向量库 vs mem0 的选型对比；情景记忆/语义记忆/程序性记忆三分类 |
| 3.4 状态与会话持久化 | Session store 设计、多轮对话/多次运行的状态恢复、checkpoint 粒度、中断/取消语义与可恢复状态保留 |
| 3.5 RAG 检索增强 | chunking 策略、embedding 模型选择、检索（dense/sparse/hybrid）、rerank、与 Agent Loop 的集成点 |

### 第四章：规划与执行
| 页面 | 覆盖要点 |
|---|---|
| 4.1 Plan-and-Execute 模式切换 | ReAct（走一步看一步）vs Plan-and-Execute（先规划后执行）的适用场景对比、混合模式（plan + 动态重规划） |
| 4.2 任务列表管理 | TodoList 数据结构、任务状态机（pending/in_progress/done/blocked）、动态插入/重排 |
| 4.3 错误处理与自我修正 | 重试策略、Reflection/Self-critique 模式、失败后的 fallback 路径设计 |
| 4.4 模型路由与多模型编排 | 按任务复杂度路由到不同模型、成本/延迟/质量三角权衡、fallback 链 |

### 第五章：安全与治理
| 页面 | 覆盖要点 |
|---|---|
| 5.1 Prompt 防注入 | 威胁模型（间接注入、工具返回内容投毒）、输入/输出隔离、权限分离（数据 vs 指令）、防御分层 |
| 5.2 审计和回滚 | 操作日志（结构化 trace）、checkpoint/snapshot、undo 机制设计、Human-in-the-loop 审批点选择 |
| 5.3 安全护栏与内容审核 | Guardrails 分类（输入过滤/输出过滤/行为限制）、高风险操作的拦截清单 |
| 5.4 紧急停止机制 | 全局 kill switch / circuit breaker 设计，与"审计回滚"的区别（回滚是事后纠错，kill switch 是运行时熔断） |

### 第六章：工程化与运维
| 页面 | 覆盖要点 |
|---|---|
| 6.1 Prompt 管理 | Prompt 模板化、版本控制（与代码同仓 vs 独立管理）、A/B 测试与灰度 |
| 6.2 可观测性（OTEL + Langfuse） | Trace/Span 建模（一次 Agent run = 一个 trace，每个 LLM/tool 调用 = 一个 span）、OTEL 标准化埋点 + Langfuse 做 LLM 专属可视化 |
| 6.3 可评估性（SWE-bench 等） | 离线评估基准选型（SWE-bench/AgentBench 等）、评估指标设计、回归测试集建设、评估与 CI 的集成 |
| 6.4 成本与延迟优化 | Prompt caching、批处理、投机执行（speculative tool calls）、上下文精简对成本的影响 |
| 6.5 部署与扩展性 | 并发模型（多 Agent 实例隔离）、多租户资源隔离、CI/CD 与灰度发布 |

### 附录
- **术语表**：全站统一术语中英对照（Agent Loop、Tool、Skill、MCP、RAG、Checkpoint 等），避免各页各说各话。
- **架构决策矩阵**：汇总全站关键选型对照表的速查页，例如"ReAct vs Plan-and-Execute 怎么选”“本地文件 vs 向量库 vs mem0 怎么选”“何时接 MCP vs 自建 Skill”等，供读完全站后快速检索，不重复各页正文，只做索引式汇总 + 跳转链接。

---

## 三、内容撰写规范（给执行 Agent 的写作 SOP）

每个主题页 Markdown 模板：

```markdown
---
title: <主题名>
chapter: <章节号>
order: <页内排序>
summary: <一句话摘要，用于 sidebar tooltip 和搜索结果>
---

# <主题名>

## 是什么
<1-2 句，直接定义问题域，不铺垫>

## 怎么做
<关键设计决策要点，可用列表 / 对比表 / 伪代码 / mermaid 图>
<给出一个最小实现思路，不追求教程式完整代码>

## 为什么
<不这样做的后果，或与替代方案的权衡（trade-off），1 段即可>

## 常见误区（可选）
<看起来对但会踩坑的做法，1-3 条要点式列出即可，无内容则省略此节>

## 业界实现对照（可选）
<该主题在 LangGraph / Claude Agent SDK / OpenAI Agents SDK / AutoGPT 等实现中的对应设计，1-3 条链接+一句话说明，帮读者把抽象概念锚定到具体代码>

## 延伸阅读
<2-4 个站内相关页面链接 + 可选的外部权威链接（论文/官方文档）>

---
*最后核实日期：<YYYY-MM-DD>*
```

**硬性要求**：
- 禁止解释读者已知的基础概念（如"什么是 JSON”“什么是 HTTP”）。
- 涉及对比场景（如 ReAct vs Plan-Execute，本地文件 vs mem0）一律用表格，不用大段文字。
- 架构/流程类内容优先用 **Mermaid 图**（flowchart/sequence/state diagram），代码只给关键片段（伪代码可接受，标注语言）。
- 每页末尾必须有"延伸阅读"做站内互链，形成知识图谱而非孤岛页面。
- 全站术语必须与"术语表"一致，写作时遇到新术语先查/补术语表。
- **涉及具体协议/规范/基准版本的页面**（如 2.2 MCP、6.2 OTEL+Langfuse、6.3 SWE-bench 等），撰写前**必须先 web search 核实当前版本号、字段名、API 形态**，禁止凭训练记忆直接写出可能已过时的接口细节；核实后在页面底部填写"最后核实日期"。

---

## 四、站点结构与导航设计

- **顶部 Banner**：站点 Logo/标题、全局搜索框、章节级快捷入口（1-6 章横向 tab 或下拉）、GitHub 链接、深色模式切换。
- **左侧 Sidebar**：按六章折叠展开的完整目录树，当前页高亮，支持展开/收起章节。
- **主内容区**：面包屑（章 > 页）+ 正文；右侧可选"本页目录”(on-this-page mini-toc，按 h2 生成)。
- **响应式**：移动端 sidebar 收起为汉堡菜单。
- **搜索**：本地全文搜索（构建期索引，如 Pagefind），无需外部服务依赖。

---

## 五、技术选型与项目结构

**推荐技术栈：VitePress**（Markdown 驱动，开箱即支持"顶部 nav + 左侧 sidebar"的文档站布局，构建快，内置搜索方案可接 Pagefind/本地 search，支持 Mermaid 插件）。

理由：
- 内容以 Markdown 为主，VitePress 让"写文档"和"发布"合一，执行 Agent 只需批量生成 `.md` 文件 + 维护一份 `config.ts`（自动生成 sidebar/nav）。
- 若需要更强的自定义交互组件（如可运行的 Agent Loop 演示），VitePress 支持内嵌 Vue 组件，不需要换框架。
- 备选：Docusaurus（React 生态，若执行 Agent 更熟悉 React 可选此项，效果等价）。

推荐目录结构：

```
site/
  .vitepress/
    config.ts          # 顶部nav + 侧边栏（按第二节大纲自动映射）+ mermaid插件配置
  index.md              # 首页（站点介绍 + 快速入口卡片）
  glossary.md           # 术语表
  decision-matrix.md    # 架构决策矩阵（速查页）
  01-agent-basics/
    agent-loop.md
    tool-abstraction.md
    structured-output.md
    budget-control.md
    concurrency.md
  02-capability-extension/
    skill-management.md
    mcp.md
    permission-sandbox.md
    multi-agent.md
  03-context-memory/
    context-engineering.md
    context-window.md
    long-term-memory.md
    session-state.md
    rag.md
  04-planning-execution/
    plan-and-execute.md
    todo-management.md
    error-recovery.md
    model-routing.md
  05-safety-governance/
    prompt-injection.md
    audit-rollback.md
    guardrails.md
    kill-switch.md
  06-engineering-ops/
    prompt-management.md
    observability-otel-langfuse.md
    evaluation-swebench.md
    cost-latency.md
    deployment-scaling.md
```

---

## 六、执行阶段划分（执行 Agent 按此顺序推进）

1. **Phase 0 — 脚手架**：初始化 VitePress 项目，配置 `config.ts` 使顶部 nav 与左侧 sidebar 完全反映第二节的 24 页大纲；跑通本地构建，确认路由和空页面可访问。
2. **Phase 1 — 骨架落地**：为每个主题页创建 `.md` 文件，写好 frontmatter 和四个小节标题（是什么/怎么做/为什么/延伸阅读），内容留 TODO；对照第二节表格逐条勾选，确保 24 页 + 术语表全部建出且无遗漏。
3. **Phase 2 — 分章填内容**：按第 1→6 章顺序逐章撰写正文，遵循第三节规范；每写完一章，先补齐该章内的互链，再进入下一章。
4. **Phase 3 — 互链与术语统一**：通读全站，补全"延伸阅读"链接，抽取全部专有名词汇入术语表，检查术语一致性（如统一用"上下文窗口"还是"上下文窗口/context window"其中一种写法）。
5. **Phase 4 — 可用性**：接入 Pagefind 本地搜索、检查移动端 sidebar 折叠、深色模式、Mermaid 图渲染是否正常。
6. **Phase 5 — 审校发布**：技术准确性自查（对照第七节清单逐页检查）、构建产物（`vitepress build`）、部署（GitHub Pages / Vercel / 静态托管任选）。

---

## 七、质量检查清单（逐页过一遍）

- [ ] 是否严格三段式（是什么/怎么做/为什么），无冗余寒暄
- [ ] 是否假设读者已具备 CS/算法/数学背景，未解释基础概念
- [ ] 对比类内容是否用表格呈现
- [ ] 架构/流程是否配 Mermaid 图（而非纯文字描述状态机）
- [ ] 代码/伪代码是否语法正确、标注语言
- [ ] 术语是否与术语表一致
- [ ] 是否有至少 2 条"延伸阅读"站内链接
- [ ] 篇幅是否控制在 300–600 字（超出需拆分或精简）
- [ ] 涉及协议/规范/基准版本的内容是否已 web search 核实，并标注"最后核实日期”
- [ ] 是否适用"常见误区"或"业界实现对照"，如适用是否已补充

---

## 八、后续可选扩展（非本期范围）

- 交互式 Demo：如用嵌入式 Vue 组件演示 Agent Loop 单步执行、Context 压缩前后 token 对比。
- 中英双语切换。
- 版本化文档（跟随 MCP/Claude 等协议版本演进）。
- 读者反馈机制（每页"是否有帮助"打点，接可观测性章节讲的 OTEL 方案自举）。
