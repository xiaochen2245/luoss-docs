<script setup lang="ts">
/**
 * VersionBadge - 版本兼容标签组件
 *
 * 用于显示功能支持的版本信息
 *
 * @example
 * <VersionBadge version="v5.0+" />
 * <VersionBadge version="v4.0+" deprecated />
 */

interface Props {
  version: string
  deprecated?: boolean
  added?: string
}

defineProps<Props>()
</script>

<template>
  <span :class="['version-badge', { deprecated }]">
    <svg
      class="version-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
    >
      <path
        v-if="deprecated"
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"
      />
      <path
        v-else
        fill="currentColor"
        d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z"
      />
    </svg>
    <span class="version-text">
      <template v-if="added">新增于 {{ added }}</template>
      <template v-else>{{ version }}</template>
    </span>
    <span v-if="deprecated" class="deprecated-label">已弃用</span>
  </span>
</template>

<style scoped>
.version-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.version-icon {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
}

.version-badge.deprecated {
  background-color: rgba(245, 108, 108, 0.1);
  border-color: rgba(245, 108, 108, 0.3);
  color: #f56c6c;
}

.deprecated .version-icon {
  color: #f56c6c;
}

.deprecated-label {
  margin-left: 0.25rem;
  font-size: 0.625rem;
  text-transform: uppercase;
  opacity: 0.8;
}

.dark .version-badge {
  background-color: var(--vp-c-bg-soft);
}

.dark .version-badge.deprecated {
  background-color: rgba(245, 108, 108, 0.15);
}
</style>
