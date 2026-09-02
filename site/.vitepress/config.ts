import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const sidebar = [
  {
    text: '第一章 · Agent 基础架构',
    collapsed: false,
    items: [
      { text: '1.1 Agent Loop', link: '/01-agent-basics/agent-loop' },
      { text: '1.2 工具抽象', link: '/01-agent-basics/tool-abstraction' },
      { text: '1.3 结构化输出与函数调用', link: '/01-agent-basics/structured-output' },
      { text: '1.4 终止条件与预算控制', link: '/01-agent-basics/budget-control' },
      { text: '1.5 并发与竞态', link: '/01-agent-basics/concurrency' },
    ],
  },
  {
    text: '第二章 · 能力扩展机制',
    collapsed: false,
    items: [
      { text: '2.1 Skill 加载与管理', link: '/02-capability-extension/skill-management' },
      { text: '2.2 MCP 加载与扩展', link: '/02-capability-extension/mcp' },
      { text: '2.3 权限与沙箱', link: '/02-capability-extension/permission-sandbox' },
      { text: '2.4 多 Agent 编排与子 Agent 委派', link: '/02-capability-extension/multi-agent' },
    ],
  },
  {
    text: '第三章 · 上下文与记忆',
    collapsed: false,
    items: [
      { text: '3.1 上下文工程', link: '/03-context-memory/context-engineering' },
      { text: '3.2 上下文窗口管理', link: '/03-context-memory/context-window' },
      { text: '3.3 长期记忆管理', link: '/03-context-memory/long-term-memory' },
      { text: '3.4 状态与会话持久化', link: '/03-context-memory/session-state' },
      { text: '3.5 RAG 检索增强', link: '/03-context-memory/rag' },
    ],
  },
  {
    text: '第四章 · 规划与执行',
    collapsed: false,
    items: [
      { text: '4.1 Plan-and-Execute 模式切换', link: '/04-planning-execution/plan-and-execute' },
      { text: '4.2 任务列表管理', link: '/04-planning-execution/todo-management' },
      { text: '4.3 错误处理与自我修正', link: '/04-planning-execution/error-recovery' },
      { text: '4.4 模型路由与多模型编排', link: '/04-planning-execution/model-routing' },
    ],
  },
  {
    text: '第五章 · 安全与治理',
    collapsed: false,
    items: [
      { text: '5.1 Prompt 防注入', link: '/05-safety-governance/prompt-injection' },
      { text: '5.2 审计和回滚', link: '/05-safety-governance/audit-rollback' },
      { text: '5.3 安全护栏与内容审核', link: '/05-safety-governance/guardrails' },
      { text: '5.4 紧急停止机制', link: '/05-safety-governance/kill-switch' },
    ],
  },
  {
    text: '第六章 · 工程化与运维',
    collapsed: false,
    items: [
      { text: '6.1 Prompt 管理', link: '/06-engineering-ops/prompt-management' },
      { text: '6.2 可观测性（OTEL + Langfuse）', link: '/06-engineering-ops/observability-otel-langfuse' },
      { text: '6.3 可评估性（SWE-bench 等）', link: '/06-engineering-ops/evaluation-swebench' },
      { text: '6.4 成本与延迟优化', link: '/06-engineering-ops/cost-latency' },
      { text: '6.5 部署与扩展性', link: '/06-engineering-ops/deployment-scaling' },
    ],
  },
  {
    text: '附录',
    collapsed: false,
    items: [
      { text: '面试题库', link: '/interview' },
      { text: '术语表', link: '/glossary' },
      { text: '架构决策矩阵', link: '/decision-matrix' },
    ],
  },
]

export default withMermaid(
  defineConfig({
    base: '/fk-ai-agent/',
    lang: 'zh-CN',
    title: 'AI Agent 工程入门',
    description: '面向资深工程师的 AI Agent 工程设计资料站：覆盖 Agent 基础架构、能力扩展、上下文与记忆、规划执行、安全治理与工程化运维。',
    lastUpdated: true,
    cleanUrls: true,
    head: [
      ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ],
    themeConfig: {
      nav: [
        { text: '首页', link: '/' },
        {
          text: '章节',
          items: [
            { text: '第一章 · Agent 基础架构', link: '/01-agent-basics/agent-loop' },
            { text: '第二章 · 能力扩展机制', link: '/02-capability-extension/skill-management' },
            { text: '第三章 · 上下文与记忆', link: '/03-context-memory/context-engineering' },
            { text: '第四章 · 规划与执行', link: '/04-planning-execution/plan-and-execute' },
            { text: '第五章 · 安全与治理', link: '/05-safety-governance/prompt-injection' },
            { text: '第六章 · 工程化与运维', link: '/06-engineering-ops/prompt-management' },
          ],
        },
        { text: '术语表', link: '/glossary' },
        { text: '决策矩阵', link: '/decision-matrix' },
        { text: '面试题库', link: '/interview' },
        { text: 'GitHub', link: 'https://github.com/darrenhp/fk-ai-agent', target: '_blank' },
      ],
      sidebar,
      socialLinks: [
        { icon: 'github', link: 'https://github.com/darrenhp/fk-ai-agent' },
      ],
      search: {
        provider: 'local',
        options: {
          translations: {
            button: { buttonText: '搜索', placeholder: '搜索文档' },
            modal: {
              noResultsText: '找不到相关结果',
              resetButtonTitle: '清除查询条件',
              footer: { selectText: '选择', navigateText: '切换' },
            },
          },
        },
      },
      outline: { label: '本页目录', level: [2, 3] },
      docFooter: { prev: true, next: true },
      lastUpdatedText: '最后更新',
      returnToTopLabel: '回到顶部',
      sidebarMenuLabel: '菜单',
      darkModeSwitchLabel: '主题',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
    },
    mermaid: {
      securityLevel: 'loose',
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#3b82f6',
        lineColor: '#64748b',
        fontSize: '14px',
      },
    },
  }),
)
