import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

// Import custom components
import FeatureBadge from '../components/FeatureBadge.vue'
import VersionBadge from '../components/VersionBadge.vue'
import ApiExample from '../components/ApiExample.vue'
import ArchitectureDiagram from '../components/ArchitectureDiagram.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // Custom layout slots can be added here
    })
  },
  enhanceApp({ app }) {
    // Register global components
    app.component('FeatureBadge', FeatureBadge)
    app.component('VersionBadge', VersionBadge)
    app.component('ApiExample', ApiExample)
    app.component('ArchitectureDiagram', ArchitectureDiagram)
  },
} satisfies Theme
