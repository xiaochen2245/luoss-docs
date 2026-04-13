# NPU 监控

NPU 监控模块提供华为昇腾 NPU 节点的实时健康状态监控、设备级指标查询和历史趋势分析功能。

## 概述

NPU 监控系统通过 ClusterD 服务和 Prometheus 采集多层级监控数据：

| 监控项 | 说明 |
|--------|------|
| 节点状态 | NPU 节点的健康/不健康状态 |
| 芯片可用性 | 每个 NPU 芯片的可用/不可用状态 |
| 设备指标 | 利用率、显存、温度、功耗 |
| 历史趋势 | 单设备时序数据（利用率、显存、温度） |
| 故障检测 | 芯片硬件故障和网络故障检测 |
| 故障隔离 | 自动或手动隔离故障芯片 |

## 设备监控页面

管理员可通过 **NPU 监控** 页面（`/admin/npu-monitor`）查看集群中所有 NPU 设备的实时状态。

### 汇总统计

页面顶部展示集群 NPU 汇总信息：

| 指标 | 说明 |
|------|------|
| NPU 总数 / 正常 | 集群 NPU 设备总数和正常数量 |
| 平均利用率 | 所有 NPU 的平均计算利用率 |
| 已占用 | 正在被任务使用的 NPU 数量 |
| 空闲 | 可用于调度的 NPU 数量 |

### 设备列表

| 字段 | 说明 |
|------|------|
| 设备 ID | 格式为 `节点名-芯片ID`（如 `atlas-37-3`） |
| 节点 | 设备所在 Kubernetes 节点 |
| 利用率 | NPU 计算利用率百分比 |
| 显存 | HBM 使用量 / 总量 |
| 占用 | 已占用 / 空闲 |
| 状态 | 正常 / 异常（基于节点 Ready 状态推导） |

### 设备历史趋势

点击设备 ID 可查看该设备的时序历史数据，包括：

- **利用率 (%)** — NPU 计算利用率
- **显存使用 (%)** — HBM 显存使用率
- **温度 (°C)** — 芯片温度

默认展示最近 60 分钟数据，每 30 秒自动刷新。

## 节点状态监控

### 节点健康状态

| 状态 | 说明 |
|------|------|
| Healthy | 节点所有 NPU 芯片正常 |
| UnHealthy | 节点存在故障或不可用的 NPU 芯片 |

### 节点详情

每个 NPU 节点显示以下信息：

| 字段 | 说明 |
|------|------|
| 节点名称 | Kubernetes 节点名 |
| 节点状态 | Healthy / UnHealthy |
| 可用芯片 | 正常可用的 NPU 芯片列表 |
| 不可用芯片 | 故障或不可用的芯片列表 |
| 网络异常芯片 | 网络连接异常的芯片 |
| 最后更新 | 状态更新时间 |

## API 接口

NPU 监控数据通过以下 API 获取：

### 集群 NPU 总览

```bash
GET /api/v1/cluster/npu/overview
Authorization: Bearer <admin-token>
```

返回所有 NPU 设备的节点、ID、占用状态、利用率和 Owner 信息。

### 节点及 NPU 状态

```bash
GET /api/v1/cluster/nodes
Authorization: Bearer <admin-token>
```

返回每个节点的 NPU 列表，包含 HBM 利用率、显存使用等详细数据。

### 单设备历史数据

```bash
GET /api/v1/cluster/npu/{device_id}/history?duration=60
Authorization: Bearer <admin-token>
```

查询指定 NPU 设备的时序历史数据。

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `device_id` | NPU 设备数字 ID（路径参数） | 必填 |
| `duration` | 查询时间范围（分钟） | 60 |

响应示例：

```json
{
  "device_id": 3,
  "node_name": "atlas-37",
  "duration": 60,
  "points": [
    {
      "timestamp": 1712976000,
      "utilization": 85.2,
      "memory_usage": 72.1,
      "temperature": 62.5
    }
  ]
}
```

### NPU 拓扑（普通用户可访问）

```bash
GET /api/v1/cluster/npu/topology
Authorization: Bearer <token>
```

返回 NPU 拓扑信息，不含 Owner 信息，所有登录用户可访问。

### NPU 可用性（普通用户可访问）

```bash
GET /api/v1/cluster/npu/availability
Authorization: Bearer <token>
```

返回计算池和开发池的 NPU 可用数量和利用率。

## 故障检测

### 故障类型

| 故障类型 | 说明 | 严重性 |
|----------|------|--------|
| CardUnhealthy | NPU 芯片硬件故障 | 高 |
| CardNetworkUnhealthy | NPU 芯片间网络故障 | 高 |

### 故障处理

ClusterD 检测到故障后会自动处理：

| 处理方式 | 说明 |
|----------|------|
| SeparateNPU | 隔离故障芯片，不再调度到该芯片 |
| PreSeparateNPU | 预隔离状态，等待进一步确认 |
| RestartNPU | 尝试重启芯片恢复 |

### 故障影响

- 故障芯片上的任务会被重新调度
- 新任务不会被调度到故障芯片
- 可能导致集群可用 NPU 数量减少

## 调度异常

### 异常报告

当任务调度失败时，系统会生成调度异常报告：

| 字段 | 说明 |
|------|------|
| 作业名称 | 调度失败的作业名 |
| 作业类型 | vcjob / acjob |
| 命名空间 | 作业所在命名空间 |
| 状态 | 调度状态 |
| 原因 | 调度失败原因 |
| 详细信息 | 详细描述信息 |

### 常见调度异常原因

| 原因 | 说明 |
|------|------|
| NotEnoughResources | 集群资源不足 |
| NodePredicateFailed | 节点调度谓词检查失败 |
| InsufficientNPU | NPU 资源不足 |

## 数据采集

### ClusterD ConfigMap

NPU 监控数据通过 ClusterD 服务的 ConfigMap 采集：

- **采集周期**：每 60 秒扫描一次
- **数据来源**：`cluster-info-device` ConfigMap
- **状态变更**：检测到节点状态变化时记录事件

### Prometheus 指标

设备级指标通过 Prometheus `npu-exporter` 采集：

| 指标 | PromQL | 说明 |
|------|--------|------|
| NPU 利用率 | `npu_chip_info_utilization` | 芯片计算利用率 |
| HBM 利用率 | `npu_chip_info_hbm_utilization` | 显存使用率 |
| 芯片温度 | `npu_chip_info_temperature` | 设备温度（°C） |
| 芯片功耗 | `npu_chip_info_power` | 功耗（W） |

### 查看故障数据

```bash
GET /api/v1/scheduling/clusterd/faults
Authorization: Bearer <admin-token>
```

响应包含故障概览：

| 字段 | 说明 |
|------|------|
| 总节点数 | 集群 NPU 节点总数 |
| 健康节点数 | 正常的节点数 |
| 不健康节点数 | 故障节点数 |
| 故障芯片总数 | 不可用的 NPU 芯片总数 |
| 手动隔离数 | 被手动隔离的芯片数 |

### 自动化监控组件

| 组件 | 说明 |
|------|------|
| ClusterD 故障监控器 | 检测节点 Healthy→UnHealthy 状态变化，自动通知管理员 |
| 调度指标采集器 | 从 ClusterD ConfigMap 采集调度统计数据 |
| 集群事件监控 | 监控 kube-system 事件，检测 NodeNotReady、OOM 等异常 |

::: info Prometheus 告警
NPU 相关告警规则会自动触发管理员通知，详见 [调度仪表盘](/guide/scheduling-dashboard)。
:::

## 最佳实践

1. **定期检查节点状态**：关注不健康节点和故障芯片数量
2. **及时处理硬件故障**：故障芯片应尽快维修或更换
3. **规划资源冗余**：预留足够的冗余 NPU 应对节点故障
4. **关注调度异常**：频繁调度异常可能表明硬件问题
5. **利用历史趋势**：通过设备历史数据识别性能瓶颈和异常模式

## 相关文档

- [调度仪表盘](/guide/scheduling-dashboard)
- [集群监控](/admin/cluster)
- [集群拓扑](/guide/cluster-topology)
- [故障排查](/admin/troubleshooting)