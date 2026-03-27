<script setup lang="ts">
/**
 * ArchitectureDiagram - 架构图组件
 *
 * 使用 SVG 绘制系统架构图
 *
 * @example
 * <ArchitectureDiagram type="overview" />
 * <ArchitectureDiagram type="auth-flow" />
 * <ArchitectureDiagram type="data-flow" />
 */

interface Props {
  type: 'overview' | 'auth-flow' | 'data-flow' | 'user-namespace'
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: undefined
})
</script>

<template>
  <div class="architecture-diagram">
    <h4 v-if="title" class="diagram-title">{{ title }}</h4>

    <!-- Overview Diagram -->
    <svg v-if="type === 'overview'" viewBox="0 0 800 400" class="diagram-svg">
      <!-- Background -->
      <rect x="0" y="0" width="800" height="400" fill="var(--vp-c-bg-soft)" rx="8"/>

      <!-- User Layer -->
      <g transform="translate(350, 30)">
        <rect x="0" y="0" width="100" height="40" fill="#42b983" rx="4"/>
        <text x="50" y="25" text-anchor="middle" fill="white" font-size="14">用户</text>
      </g>

      <!-- Frontend -->
      <g transform="translate(250, 100)">
        <rect x="0" y="0" width="300" height="60" fill="#61affe" rx="4"/>
        <text x="150" y="35" text-anchor="middle" fill="white" font-size="14">前端 (React + Ant Design)</text>
      </g>
      <line x1="400" y1="70" x2="400" y2="100" stroke="#666" stroke-width="2" marker-end="url(#arrow)"/>

      <!-- Backend -->
      <g transform="translate(250, 200)">
        <rect x="0" y="0" width="300" height="60" fill="#fca130" rx="4"/>
        <text x="150" y="35" text-anchor="middle" fill="white" font-size="14">后端 (Go + go-restful)</text>
      </g>
      <line x1="400" y1="160" x2="400" y2="200" stroke="#666" stroke-width="2" marker-end="url(#arrow)"/>

      <!-- Data Layer -->
      <g transform="translate(100, 300)">
        <rect x="0" y="0" width="120" height="50" fill="#e6a23c" rx="4"/>
        <text x="60" y="30" text-anchor="middle" fill="white" font-size="12">PostgreSQL</text>
      </g>
      <g transform="translate(250, 300)">
        <rect x="0" y="0" width="120" height="50" fill="#326ce5" rx="4"/>
        <text x="60" y="30" text-anchor="middle" fill="white" font-size="12">Kubernetes</text>
      </g>
      <g transform="translate(400, 300)">
        <rect x="0" y="0" width="120" height="50" fill="#67c23a" rx="4"/>
        <text x="60" y="30" text-anchor="middle" fill="white" font-size="12">Code Server</text>
      </g>
      <g transform="translate(550, 300)">
        <rect x="0" y="0" width="120" height="50" fill="#f56c6c" rx="4"/>
        <text x="60" y="30" text-anchor="middle" fill="white" font-size="12">Volcano</text>
      </g>

      <!-- Arrows -->
      <line x1="250" y1="260" x2="160" y2="300" stroke="#666" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="400" y1="260" x2="310" y2="300" stroke="#666" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="400" y1="260" x2="460" y2="300" stroke="#666" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="550" y1="260" x2="610" y2="300" stroke="#666" stroke-width="2" marker-end="url(#arrow)"/>

      <!-- Arrow marker -->
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#666"/>
        </marker>
      </defs>
    </svg>

    <!-- Auth Flow Diagram -->
    <svg v-else-if="type === 'auth-flow'" viewBox="0 0 700 350" class="diagram-svg">
      <rect x="0" y="0" width="700" height="350" fill="var(--vp-c-bg-soft)" rx="8"/>

      <!-- User -->
      <g transform="translate(50, 150)">
        <circle cx="30" cy="30" r="30" fill="#42b983"/>
        <text x="30" y="35" text-anchor="middle" fill="white" font-size="12">用户</text>
      </g>

      <!-- Frontend -->
      <g transform="translate(150, 130)">
        <rect x="0" y="0" width="100" height="50" fill="#61affe" rx="4"/>
        <text x="50" y="30" text-anchor="middle" fill="white" font-size="11">前端</text>
      </g>

      <!-- Backend -->
      <g transform="translate(300, 130)">
        <rect x="0" y="0" width="100" height="50" fill="#fca130" rx="4"/>
        <text x="50" y="30" text-anchor="middle" fill="white" font-size="11">后端 API</text>
      </g>

      <!-- OIDC/Dex -->
      <g transform="translate(450, 80)">
        <rect x="0" y="0" width="100" height="50" fill="#e6a23c" rx="4"/>
        <text x="50" y="30" text-anchor="middle" fill="white" font-size="11">Dex (OIDC)</text>
      </g>

      <!-- LDAP -->
      <g transform="translate(450, 180)">
        <rect x="0" y="0" width="100" height="50" fill="#909399" rx="4"/>
        <text x="50" y="30" text-anchor="middle" fill="white" font-size="11">LDAP</text>
      </g>

      <!-- Database -->
      <g transform="translate(300, 250)">
        <rect x="0" y="0" width="100" height="50" fill="#67c23a" rx="4"/>
        <text x="50" y="30" text-anchor="middle" fill="white" font-size="11">PostgreSQL</text>
      </g>

      <!-- Arrows -->
      <defs>
        <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#666"/>
        </marker>
      </defs>

      <line x1="110" y1="180" x2="150" y2="165" stroke="#666" stroke-width="2" marker-end="url(#arrow2)"/>
      <text x="130" y="160" font-size="10" fill="#666">1. 登录</text>

      <line x1="250" y1="155" x2="300" y2="155" stroke="#666" stroke-width="2" marker-end="url(#arrow2)"/>
      <text x="265" y="145" font-size="10" fill="#666">2. 认证</text>

      <line x1="400" y1="140" x2="450" y2="115" stroke="#666" stroke-width="2" marker-end="url(#arrow2)"/>
      <text x="410" y="115" font-size="10" fill="#666">OIDC</text>

      <line x1="400" y1="170" x2="450" y2="195" stroke="#666" stroke-width="2" marker-end="url(#arrow2)"/>
      <text x="410" y="200" font-size="10" fill="#666">LDAP</text>

      <line x1="350" y1="180" x2="350" y2="250" stroke="#666" stroke-width="2" marker-end="url(#arrow2)"/>
      <text x="355" y="220" font-size="10" fill="#666">验证</text>
    </svg>

    <!-- User Namespace Diagram -->
    <svg v-else-if="type === 'user-namespace'" viewBox="0 0 600 300" class="diagram-svg">
      <rect x="0" y="0" width="600" height="300" fill="var(--vp-c-bg-soft)" rx="8"/>

      <!-- Kubernetes Cluster -->
      <rect x="20" y="20" width="560" height="260" fill="none" stroke="#326ce5" stroke-width="2" rx="8"/>
      <text x="40" y="45" font-size="14" fill="#326ce5" font-weight="bold">Kubernetes Cluster</text>

      <!-- Platform Namespace -->
      <rect x="40" y="60" width="200" height="200" fill="rgba(62, 175, 124, 0.1)" stroke="#3eaf7c" stroke-width="1" rx="4"/>
      <text x="50" y="80" font-size="12" fill="#3eaf7c" font-weight="bold">k8s-tenant (平台)</text>
      <g transform="translate(60, 100)">
        <rect x="0" y="0" width="80" height="30" fill="#fca130" rx="2"/>
        <text x="40" y="20" text-anchor="middle" fill="white" font-size="10">Backend</text>
      </g>
      <g transform="translate(150, 100)">
        <rect x="0" y="0" width="80" height="30" fill="#61affe" rx="2"/>
        <text x="40" y="20" text-anchor="middle" fill="white" font-size="10">Frontend</text>
      </g>
      <g transform="translate(60, 150)">
        <rect x="0" y="0" width="80" height="30" fill="#e6a23c" rx="2"/>
        <text x="40" y="20" text-anchor="middle" fill="white" font-size="10">PostgreSQL</text>
      </g>
      <g transform="translate(150, 150)">
        <rect x="0" y="0" width="80" height="30" fill="#67c23a" rx="2"/>
        <text x="40" y="20" text-anchor="middle" fill="white" font-size="10">Redis</text>
      </g>

      <!-- User Namespace -->
      <rect x="260" y="60" width="300" height="200" fill="rgba(66, 185, 131, 0.1)" stroke="#42b983" stroke-width="1" rx="4"/>
      <text x="270" y="80" font-size="12" fill="#42b983" font-weight="bold">user-{username} (租户)</text>

      <!-- User Resources -->
      <g transform="translate(280, 100)">
        <rect x="0" y="0" width="80" height="40" fill="#42b983" rx="2"/>
        <text x="40" y="25" text-anchor="middle" fill="white" font-size="9">Code Server</text>
      </g>
      <g transform="translate(370, 100)">
        <rect x="0" y="0" width="80" height="40" fill="#f56c6c" rx="2"/>
        <text x="40" y="25" text-anchor="middle" fill="white" font-size="9">Training Job</text>
      </g>
      <g transform="translate(460, 100)">
        <rect x="0" y="0" width="80" height="40" fill="#909399" rx="2"/>
        <text x="40" y="25" text-anchor="middle" fill="white" font-size="9">PVC</text>
      </g>

      <!-- Resource Quota -->
      <g transform="translate(280, 170)">
        <rect x="0" y="0" width="260" height="60" fill="rgba(230, 162, 60, 0.2)" stroke="#e6a23c" stroke-width="1" rx="2"/>
        <text x="10" y="20" font-size="10" fill="#e6a23c">ResourceQuota</text>
        <text x="10" y="40" font-size="9" fill="#666">CPU: 4 cores | Memory: 8Gi | NPU: 2</text>
      </g>

      <!-- Network Policy -->
      <g transform="translate(280, 240)">
        <rect x="0" y="0" width="260" height="15" fill="rgba(144, 147, 153, 0.2)" stroke="#909399" stroke-width="1" rx="2"/>
        <text x="130" y="11" text-anchor="middle" font-size="8" fill="#909399">NetworkPolicy (隔离)</text>
      </g>
    </svg>

    <!-- Data Flow Diagram -->
    <svg v-else-if="type === 'data-flow'" viewBox="0 0 700 300" class="diagram-svg">
      <rect x="0" y="0" width="700" height="300" fill="var(--vp-c-bg-soft)" rx="8"/>

      <!-- Storage Classes -->
      <g transform="translate(50, 50)">
        <rect x="0" y="0" width="150" height="200" fill="rgba(66, 185, 131, 0.1)" stroke="#42b983" stroke-width="1" rx="4"/>
        <text x="75" y="25" text-anchor="middle" font-size="12" fill="#42b983" font-weight="bold">持久存储</text>

        <g transform="translate(15, 50)">
          <rect x="0" y="0" width="120" height="40" fill="#67c23a" rx="2"/>
          <text x="60" y="25" text-anchor="middle" fill="white" font-size="10">用户 PVC</text>
        </g>
        <text x="75" y="110" text-anchor="middle" font-size="9" fill="#666">/config/workspace</text>

        <g transform="translate(15, 130)">
          <rect x="0" y="0" width="120" height="40" fill="#e6a23c" rx="2"/>
          <text x="60" y="25" text-anchor="middle" fill="white" font-size="10">模型存储</text>
        </g>
        <text x="75" y="190" text-anchor="middle" font-size="9" fill="#666">/models</text>
      </g>

      <!-- Environments -->
      <g transform="translate(250, 50)">
        <rect x="0" y="0" width="150" height="200" fill="rgba(97, 175, 254, 0.1)" stroke="#61affe" stroke-width="1" rx="4"/>
        <text x="75" y="25" text-anchor="middle" font-size="12" fill="#61affe" font-weight="bold">计算环境</text>

        <g transform="translate(15, 50)">
          <rect x="0" y="0" width="120" height="40" fill="#42b983" rx="2"/>
          <text x="60" y="25" text-anchor="middle" fill="white" font-size="10">Code Server</text>
        </g>

        <g transform="translate(15, 110)">
          <rect x="0" y="0" width="120" height="40" fill="#f56c6c" rx="2"/>
          <text x="60" y="25" text-anchor="middle" fill="white" font-size="10">Training Job</text>
        </g>

        <g transform="translate(15, 170)">
          <rect x="0" y="0" width="120" height="20" fill="#909399" rx="2"/>
          <text x="60" y="14" text-anchor="middle" fill="white" font-size="9">Pod</text>
        </g>
      </g>

      <!-- Registry -->
      <g transform="translate(450, 50)">
        <rect x="0" y="0" width="150" height="200" fill="rgba(252, 161, 48, 0.1)" stroke="#fca130" stroke-width="1" rx="4"/>
        <text x="75" y="25" text-anchor="middle" font-size="12" fill="#fca130" font-weight="bold">镜像仓库</text>

        <g transform="translate(15, 50)">
          <rect x="0" y="0" width="120" height="40" fill="#fca130" rx="2"/>
          <text x="60" y="25" text-anchor="middle" fill="white" font-size="10">基础镜像</text>
        </g>

        <g transform="translate(15, 110)">
          <rect x="0" y="0" width="120" height="40" fill="#e6a23c" rx="2"/>
          <text x="60" y="25" text-anchor="middle" fill="white" font-size="10">自定义镜像</text>
        </g>

        <g transform="translate(15, 170)">
          <rect x="0" y="0" width="120" height="20" fill="#909399" rx="2"/>
          <text x="60" y="14" text-anchor="middle" fill="white" font-size="9">Docker Registry</text>
        </g>
      </g>

      <!-- Arrows -->
      <defs>
        <marker id="arrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#666"/>
        </marker>
      </defs>

      <line x1="200" y1="150" x2="250" y2="150" stroke="#666" stroke-width="2" marker-end="url(#arrow3)"/>
      <text x="210" y="140" font-size="9" fill="#666">挂载</text>

      <line x1="400" y1="100" x2="450" y2="100" stroke="#666" stroke-width="2" marker-end="url(#arrow3)"/>
      <text x="410" y="90" font-size="9" fill="#666">拉取</text>
    </svg>

    <div class="diagram-legend">
      <slot name="legend" />
    </div>
  </div>
</template>

<style scoped>
.architecture-diagram {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  overflow-x: auto;
}

.diagram-title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.diagram-svg {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}

.diagram-legend {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* Dark mode adjustments */
.dark .diagram-svg rect[fill] {
  /* Adjust colors for dark mode if needed */
}

.dark text {
  fill: var(--vp-c-text-1);
}
</style>
