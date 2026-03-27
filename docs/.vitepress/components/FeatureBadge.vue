<script setup lang="ts">
/**
 * FeatureBadge - 功能状态标签组件
 *
 * 用于显示功能的稳定状态：stable, beta, alpha, experimental
 *
 * @example
 * <FeatureBadge status="stable" />
 * <FeatureBadge status="beta" text="预览版" />
 */

interface Props {
  status: 'stable' | 'beta' | 'alpha' | 'experimental'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: undefined
})

const statusText: Record<string, string> = {
  stable: '稳定版',
  beta: 'Beta',
  alpha: 'Alpha',
  experimental: '实验性'
}

const displayText = props.text || statusText[props.status]
</script>

<template>
  <span :class="['feature-badge', status]">
    <svg
      v-if="status === 'stable'"
      class="badge-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
    >
      <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
    <svg
      v-else-if="status === 'beta'"
      class="badge-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
    >
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
    <svg
      v-else-if="status === 'alpha'"
      class="badge-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
    >
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
    <svg
      v-else
      class="badge-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
    >
      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
    <span class="badge-text">{{ displayText }}</span>
  </span>
</template>

<style scoped>
.feature-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-icon {
  flex-shrink: 0;
}

.badge-text {
  line-height: 1;
}

/* Status variants */
.feature-badge.stable {
  background-color: rgba(103, 194, 58, 0.15);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.feature-badge.beta {
  background-color: rgba(230, 162, 60, 0.15);
  color: #e6a23c;
  border: 1px solid rgba(230, 162, 60, 0.3);
}

.feature-badge.alpha {
  background-color: rgba(245, 108, 108, 0.15);
  color: #f56c6c;
  border: 1px solid rgba(245, 108, 108, 0.3);
}

.feature-badge.experimental {
  background-color: rgba(144, 147, 153, 0.15);
  color: #909399;
  border: 1px solid rgba(144, 147, 153, 0.3);
}

/* Dark mode */
.dark .feature-badge.stable {
  background-color: rgba(103, 194, 58, 0.2);
}

.dark .feature-badge.beta {
  background-color: rgba(230, 162, 60, 0.2);
}

.dark .feature-badge.alpha {
  background-color: rgba(245, 108, 108, 0.2);
}

.dark .feature-badge.experimental {
  background-color: rgba(144, 147, 153, 0.2);
}
</style>
