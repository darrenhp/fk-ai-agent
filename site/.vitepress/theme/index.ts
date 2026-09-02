import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import InterviewBank from './components/InterviewBank.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('InterviewBank', InterviewBank)
  },
} satisfies Theme
