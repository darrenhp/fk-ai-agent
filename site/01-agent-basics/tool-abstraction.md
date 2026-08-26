---
title: Tool 抽象
chapter: "1.2"
order: 2
summary: Tool 抽象以 JSON Schema 描述输入契约，配合注册表实现与模型解耦的能力接入。
---
# Tool 抽象

## 是什么
Tool 抽象是把「可被模型调用的外部能力」统一建模为带 schema 的接口，使模型无需理解实现细节即可规划调用。

## 怎么做
每个 Tool 至少包含 `name`、`description`、`input_schema`（JSON Schema）。核心是把自然语言语义收敛成强类型契约，并对副作用显式标注。

```json
{
  "name": "write_file",
  "description": "将内容写入指定路径，覆盖已存在文件",
  "input_schema": {
    "type": "object",
    "required": ["path", "content"],
    "properties": {
      "path": {"type": "string", "description": "绝对路径"},
      "content": {"type": "string"}
    }
  },
  "annotations": {
    "idempotent": false,
    "destructive": true,
    "side_effect": true
  }
}
```

运行时维护一个 Tool Registry：按 name 索引可调用实现，loop 收到 `tool_calls` 时查表分发。Registry 支持静态注册与动态加载（见 /02-capability-extension/skill-management）。

| 维度 | 要求 |
| --- | --- |
| 命名 | 全局唯一、动词优先、stable |
| 描述 | 写「何时用」而非「如何实现」 |
| 副作用标注 | 驱动权限与并发策略（见 /01-agent-basics/concurrency） |

## 为什么
缺乏统一契约时，模型只能靠自由文本拼参数，解析失败率高；语义与实现耦合则无法热插拔能力。明确副作用标注是后续并行与权限沙箱（/02-capability-extension/permission-sandbox）的前提。

## 常见误区
- description 写成实现说明，模型检索时匹配不到正确工具。
- 忽略幂等标注，重试机制对写操作重复生效造成数据破坏。

## 业界实现对照
- Anthropic Claude Agent SDK：Tool 用 input_schema 定义，annotations 含 read_only/destructive 提示。https://docs.anthropic.com/en/docs/agents-and-tools/tool-use
- OpenAI Agents SDK：function_tool 装饰器自动由类型推导 schema。https://openai.github.io/openai-agents-python/

## 延伸阅读
- /01-agent-basics/agent-loop
- /01-agent-basics/structured-output
- /02-capability-extension/mcp
- /02-capability-extension/permission-sandbox

---
*最后核实日期：2026-08-26*
