---
title: 离线评估：SWE-bench 与 Agent 基准选型
chapter: "6.3"
order: 3
summary: 选型 SWE-bench 系列与 AgentBench/tau-bench 等基准，设计指标、回归集并与 CI 集成。
---
# 离线评估：SWE-bench 与 Agent 基准选型

## 是什么
Agent 的行为是随机的、长程的、跨工具的，单点测试无法刻画能力。本页解决“如何用可复现、抗污染、可归因的基准衡量 Agent 的真实任务达成率”。

## 怎么做
**基准选型**（按能力维度切分，勿混为一谈）：

| 基准 | 测什么 | 形态（2026） |
| --- | --- | --- |
| SWE-bench Verified | 真实 GitHub Issue 修复 | 500 任务，12 Python 仓；FAIL_TO_PASS/PASS_TO_PASS 评分 |
| SWE-bench Pro | 抗污染软工 | Scale AI 2026，1,865 任务，41 仓，多语言 |
| AgentBench | 多环境综合 | 8 环境（OS/DB/卡牌等），清华 THUDM 维护 |
| tau-bench | 工具调用可靠性 | 客服场景，测 N 次重复一致性 |
| WebArena / GAIA | 网页导航 / 通用助手 | 812 / 466 任务 |

注意：SWE-bench Verified 已被 OpenAI 于 2026-02-23 因污染与测试缺陷弃用于前沿评测，但仍作 sanity check 与教学基准；公共榜已饱和（Verified 顶尖 ~87.6%，均值 63.4%）。

**指标设计**：除单跑 resolve rate，必须报 N-run 可靠性（同任务跑 5–10 次，temperature>0）、p95 延迟、单任务成本、工具调用成功率。单跑 90% 可能只是运气。

**回归测试集建设**：从生产 trace 抽取失败/边界 case 标注为 golden dataset；按难度分层，固定为 held-out 集防污染。

**与 CI 集成**：每次模型/Prompt 变更跑回归集，门槛失败阻断合并；结果存观测平台做版本对比。

```yaml
# 最小 CI 步骤
- run: agent-eval --dataset regression --model ${{env.MODEL}} --n 5
- run: assert resolve_rate >= 0.80 && p95_latency <= 30s
```

## 为什么
只盯公共榜会“教给测试”——训练数据泄漏让高分失真，且与你的真实任务弱相关（“90% on SWE-bench” 对客服 Agent 无意义）。自有 held-out 回归集才是产品决策依据；缺它，模型升级即盲飞。

## 常见误区
- 用单跑准确率当可靠性；Agent 随机，缺 N-run 复测会掩盖 10–30 点方差。
- 把不同 SWE-bench 变体分数横向比：Verified 与 Pro 差距常 40+ 点。

## 业界实现对照
- **SWE-bench 官方**（https://www.swebench.com/）。
- **SWE-bench Pro / Live**（https://swe-bench-live.github.io/）。
- **Inspect Evals swe_bench**（https://ukgovernmentbeis.github.io/inspect_evals/evals/swe_bench）。

## 延伸阅读
- [/06-engineering-ops/deployment-scaling](/06-engineering-ops/deployment-scaling)
- [/06-engineering-ops/observability-otel-langfuse](/06-engineering-ops/observability-otel-langfuse)
- [/04-planning-execution/error-recovery](/04-planning-execution/error-recovery)
- [/04-planning-execution/model-routing](/04-planning-execution/model-routing)

---
*最后核实日期：2026-08-26*
