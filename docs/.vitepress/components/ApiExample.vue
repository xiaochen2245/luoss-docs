<script setup lang="ts">
/**
 * ApiExample - API 代码示例组件
 *
 * 用于显示带有方法标签的 API 示例
 *
 * @example
 * <ApiExample method="GET" path="/api/v1/environments" />
 * <ApiExample method="POST" path="/api/v1/environments" :body="{ name: 'test' }" />
 */

interface Props {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  title?: string
  body?: Record<string, unknown>
  response?: Record<string, unknown>
  baseUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  body: undefined,
  response: undefined,
  baseUrl: 'http://<server>:31618'
})

const methodColors: Record<string, string> = {
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  DELETE: '#f93e3e',
  PATCH: '#50e3c2'
}

const curlCommand = computed(() => {
  let cmd = `curl -X ${props.method} ${props.baseUrl}${props.path}`

  if (props.body) {
    cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer <token>" \\\n  -d '${JSON.stringify(props.body, null, 2)}'`
  } else {
    cmd += ` \\\n  -H "Authorization: Bearer <token>"`
  }

  return cmd
})

const defaultResponse = {
  code: 0,
  message: 'success',
  data: {}
}

import { computed } from 'vue'
</script>

<template>
  <div class="api-example">
    <div class="api-example-header">
      <span
        class="api-method"
        :style="{ backgroundColor: methodColors[method] }"
      >
        {{ method }}
      </span>
      <code class="api-path">{{ path }}</code>
      <span v-if="title" class="api-example-title">{{ title }}</span>
    </div>

    <div class="api-example-body">
      <div class="code-section">
        <h4>请求示例</h4>
        <pre><code class="language-bash">{{ curlCommand }}</code></pre>
      </div>

      <div v-if="body" class="code-section">
        <h4>请求体</h4>
        <pre><code class="language-json">{{ JSON.stringify(body, null, 2) }}</code></pre>
      </div>

      <div class="code-section">
        <h4>响应示例</h4>
        <pre><code class="language-json">{{ JSON.stringify(response || defaultResponse, null, 2) }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-example {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
}

.api-example-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.api-method {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
}

.api-path {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
}

.api-example-title {
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-left: auto;
}

.api-example-body {
  padding: 1rem;
}

.code-section {
  margin-bottom: 1rem;
}

.code-section:last-child {
  margin-bottom: 0;
}

.code-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem 0;
}

.code-section pre {
  margin: 0;
  padding: 1rem;
  background-color: var(--vp-code-block-bg);
  border-radius: 6px;
  overflow-x: auto;
}

.code-section code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8rem;
  line-height: 1.5;
}

/* Dark mode */
.dark .api-example {
  background-color: var(--vp-c-bg-soft);
}

.dark .api-example-header {
  background-color: var(--vp-c-bg);
}
</style>
