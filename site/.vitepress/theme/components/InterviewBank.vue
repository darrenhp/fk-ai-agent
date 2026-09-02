<script setup>
import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'fk-ai-agent:interview:show-answers'

// ---------- 数据加载 ----------
const bank = ref(null)
const loadError = ref('')

// ---------- 答案显隐状态 ----------
// globalShow: 全局默认（持久化到 localStorage）
// overrides: 单题覆盖 { [id]: boolean }，全局开关切换时清空
const globalShow = ref(false)
const overrides = ref({})

const questions = computed(() => bank.value?.questions ?? [])

// ---------- 搜索与分组 ----------
const keyword = ref('')
const collapsed = ref({})

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return questions.value
  return questions.value.filter(
    (q) =>
      q.question.toLowerCase().includes(kw) ||
      (q.question_en || '').toLowerCase().includes(kw) ||
      q.category.toLowerCase().includes(kw),
  )
})

const groups = computed(() => {
  const out = []
  const index = new Map()
  questions.value.forEach((q, i) => index.set(q.id, i + 1))
  for (const q of filtered.value) {
    let g = out[out.length - 1]
    if (!g || g.category !== q.category) {
      g = { category: q.category, categoryEn: q.category_en || '', items: [] }
      out.push(g)
    }
    g.items.push({ ...q, no: index.get(q.id) ?? 0 })
  }
  return out
})

const searching = computed(() => keyword.value.trim() !== '')

function isCollapsed(category) {
  if (searching.value) return false
  // 默认展开第一组，其余折叠
  if (!(category in collapsed.value)) {
    return groups.value.length > 0 && groups.value[0].category !== category
  }
  return !!collapsed.value[category]
}

function toggleGroup(category) {
  collapsed.value = { ...collapsed.value, [category]: !isCollapsed(category) }
}

// ---------- 显隐逻辑 ----------
function answerVisible(q) {
  return q.id in overrides.value ? overrides.value[q.id] : globalShow.value
}

function toggleAnswer(q) {
  overrides.value = { ...overrides.value, [q.id]: !answerVisible(q) }
}

function toggleGlobal() {
  globalShow.value = !globalShow.value
  overrides.value = {}
  persistGlobal()
}

function persistGlobal() {
  try {
    localStorage.setItem(STORAGE_KEY, String(globalShow.value))
  } catch {
    /* localStorage 不可用时静默降级为会话内生效 */
  }
}

onMounted(async () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) globalShow.value = saved === 'true'
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch(import.meta.env.BASE_URL.replace(/\/?$/, '/') + 'questions.json')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    bank.value = await res.json()
  } catch (e) {
    loadError.value = '题库加载失败：' + (e && e.message ? e.message : e)
  }
})

// ---------- 轻量 Markdown 渲染（先转义后转换，可安全 v-html） ----------
function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineMd(s) {
  let t = esc(s)
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  return t
}

function mdToHtml(src) {
  const lines = String(src).split('\n')
  const out = []
  let i = 0
  let listTag = null
  const closeList = () => {
    if (listTag) {
      out.push('</' + listTag + '>')
      listTag = null
    }
  }
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      closeList()
      const lang = line.slice(3).trim()
      const buf = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(lines[i])
        i++
      }
      i++
      out.push(
        '<pre class="ib-code"><code' +
          (lang ? ' class="language-' + esc(lang) + '"' : '') +
          '>' +
          esc(buf.join('\n')) +
          '</code></pre>',
      )
      continue
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      closeList()
      const level = Math.min(h[1].length + 2, 6)
      out.push('<h' + level + ' class="ib-md-h">' + inlineMd(h[2]) + '</h' + level + '>')
      i++
      continue
    }
    const ul = line.match(/^\s*[-*]\s+(.*)$/)
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (ul || ol) {
      const tag = ul ? 'ul' : 'ol'
      if (listTag !== tag) {
        closeList()
        out.push('<' + tag + ' class="ib-md-list">')
        listTag = tag
      }
      out.push('<li>' + inlineMd(ul ? ul[1] : ol[1]) + '</li>')
      i++
      continue
    }
    if (!line.trim()) {
      closeList()
      i++
      continue
    }
    closeList()
    const buf = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('```') &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^\s*([-*]|\d+[.)])\s/.test(lines[i])
    ) {
      buf.push(lines[i])
      i++
    }
    out.push('<p>' + inlineMd(buf.join(' ')) + '</p>')
  }
  closeList()
  return out.join('\n')
}
</script>

<template>
  <div class="ib">
    <!-- 加载中 / 错误 -->
    <p v-if="loadError" class="ib-error">{{ loadError }}</p>
    <p v-else-if="!bank" class="ib-loading">题库加载中…</p>

    <template v-else>
      <!-- 工具栏：全局答案开关 + 搜索 -->
      <div class="ib-toolbar">
        <button
          class="ib-switch"
          :class="{ on: globalShow }"
          role="switch"
          :aria-checked="globalShow"
          :title="globalShow ? '点击隐藏全部答案' : '点击显示全部答案'"
          @click="toggleGlobal"
        >
          <span class="ib-track"><span class="ib-thumb" /></span>
          <span class="ib-switch-text">
            <strong>{{ globalShow ? '全部答案已显示' : '全部答案已隐藏' }}</strong>
            <small>全局开关 · 设置保存在 localStorage</small>
          </span>
        </button>

        <input
          v-model="keyword"
          class="ib-search"
          type="search"
          placeholder="搜索题目 / 分类…"
          aria-label="搜索题目"
        />
      </div>

      <p class="ib-count">
        共 {{ questions.length }} 题{{ searching ? '，匹配 ' + filtered.length + ' 题' : '' }}
        · 来源：<a
          :href="bank.source"
          target="_blank"
          rel="noopener noreferrer"
          >ai-agent-interview-guide</a
        >（{{ bank.license }}）
      </p>

      <p v-if="searching && !filtered.length" class="ib-empty">没有匹配的题目，换个关键词试试。</p>

      <!-- 分类分组 -->
      <section v-for="g in groups" :key="g.category" class="ib-group">
        <button class="ib-group-head" @click="toggleGroup(g.category)">
          <span class="ib-group-name">{{ g.category }}</span>
          <span class="ib-group-meta">{{ g.items.length }} 题</span>
          <span class="ib-chevron" :class="{ open: !isCollapsed(g.category) }">›</span>
        </button>

        <div v-show="!isCollapsed(g.category)" class="ib-group-body">
          <article v-for="q in g.items" :key="q.id" class="ib-card" :class="{ revealed: answerVisible(q) }">
            <div class="ib-q-head">
              <span class="ib-no">{{ String(q.no).padStart(3, '0') }}</span>
              <h3 class="ib-q-title">{{ q.question }}</h3>
              <button class="ib-btn" :class="{ on: answerVisible(q) }" @click="toggleAnswer(q)">
                {{ answerVisible(q) ? '隐藏答案' : '显示答案' }}
              </button>
            </div>

            <div v-show="answerVisible(q)" class="ib-answer">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="ib-md" v-html="mdToHtml(q.answer)" />
            </div>
          </article>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.ib {
  --ib-border: var(--vp-c-border);
  --ib-bg-soft: var(--vp-c-bg-soft);
  --ib-text-1: var(--vp-c-text-1);
  --ib-text-2: var(--vp-c-text-2);
  --ib-brand: var(--vp-c-brand-1);
  --ib-brand-soft: var(--vp-button-alt-bg, var(--vp-c-default-soft));
  margin-top: 8px;
}

.ib-loading,
.ib-error,
.ib-empty {
  color: var(--ib-text-2);
  padding: 12px 0;
}
.ib-error {
  color: var(--vp-c-danger-1);
}

/* ---------- 工具栏 ---------- */
.ib-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid var(--ib-border);
  border-radius: 10px;
  background: var(--ib-bg-soft);
  position: sticky;
  top: var(--vp-nav-height, 56px);
  z-index: 10;
}

.ib-switch {
  display: flex;
  align-items: center;
  gap: 11px;
  border: 0;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  text-align: left;
}
.ib-switch-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  color: var(--ib-text-1);
  line-height: 1.3;
}
.ib-switch-text small {
  color: var(--ib-text-2);
  font-size: 11px;
  font-weight: 400;
}
.ib-track {
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--vp-c-default-soft, #ccc);
  border: 1px solid var(--ib-border);
  position: relative;
  flex: none;
  transition: background 0.18s ease;
}
.ib-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.18s ease;
}
.ib-switch.on .ib-track {
  background: var(--ib-brand);
}
.ib-switch.on .ib-thumb {
  transform: translateX(18px);
}

.ib-search {
  flex: 1;
  min-width: 180px;
  max-width: 320px;
  padding: 7px 12px;
  border: 1px solid var(--ib-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--ib-text-1);
  font-size: 13px;
}
.ib-search:focus-visible {
  outline: 2px solid var(--ib-brand);
  outline-offset: 1px;
}

.ib-count {
  color: var(--ib-text-2);
  font-size: 13px;
  margin: 14px 2px 4px;
}

/* ---------- 分组 ---------- */
.ib-group {
  margin-top: 18px;
  border: 1px solid var(--ib-border);
  border-radius: 10px;
  overflow: hidden;
}
.ib-group-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 0;
  background: var(--ib-bg-soft);
  color: var(--ib-text-1);
  cursor: pointer;
  font-size: 15px;
}
.ib-group-name {
  font-weight: 600;
}
.ib-group-meta {
  color: var(--ib-text-2);
  font-size: 12px;
}
.ib-chevron {
  margin-left: auto;
  color: var(--ib-text-2);
  transform: rotate(0deg);
  transition: transform 0.15s ease;
}
.ib-chevron.open {
  transform: rotate(90deg);
}

/* ---------- 题目卡片 ---------- */
.ib-card {
  padding: 14px 16px;
  border-top: 1px solid var(--ib-border);
}
.ib-card:first-child {
  border-top: 0;
}
.ib-card.revealed {
  background: var(--ib-bg-soft);
}

.ib-q-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.ib-no {
  flex: none;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 12px;
  color: var(--ib-text-2);
  padding-top: 4px;
}
.ib-q-title {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  font-weight: 600;
  flex: 1;
}

.ib-btn {
  flex: none;
  padding: 5px 12px;
  font-size: 12px;
  border-radius: 7px;
  border: 1px solid var(--ib-border);
  background: var(--vp-c-bg);
  color: var(--ib-text-1);
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.ib-btn:hover {
  border-color: var(--ib-brand);
}
.ib-btn.on {
  border-color: var(--ib-brand);
  color: var(--ib-brand);
}

/* ---------- 答案区 ---------- */
.ib-answer {
  margin-top: 10px;
  margin-left: 34px;
  padding: 12px 14px;
  border-left: 3px solid var(--ib-brand);
  border-radius: 0 8px 8px 0;
  background: var(--vp-c-bg);
}
.ib-md {
  font-size: 14px;
  line-height: 1.7;
  color: var(--ib-text-1);
}
.ib-md :deep(p) {
  margin: 0 0 8px;
}
.ib-md :deep(p:last-child) {
  margin-bottom: 0;
}
.ib-md :deep(.ib-md-h) {
  margin: 12px 0 6px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ib-text-1);
  border: 0;
  padding: 0;
}
.ib-md :deep(.ib-md-h:first-child) {
  margin-top: 0;
}
.ib-md :deep(.ib-md-list) {
  margin: 4px 0 8px;
  padding-left: 20px;
}
.ib-md :deep(.ib-md-list li) {
  margin: 3px 0;
}
.ib-md :deep(code) {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.875em;
  background: var(--vp-c-mute, rgba(127, 127, 127, 0.14));
  padding: 2px 5px;
  border-radius: 4px;
}
.ib-code {
  margin: 8px 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--vp-code-block-bg, #1e1e2e);
  overflow-x: auto;
  line-height: 1.6;
}
.ib-code code {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 12.5px;
  color: var(--vp-code-block-color, #eee);
  display: block;
}

@media (max-width: 640px) {
  .ib-q-head {
    flex-wrap: wrap;
  }
  .ib-answer {
    margin-left: 0;
  }
  .ib-toolbar {
    position: static;
  }
}
</style>
