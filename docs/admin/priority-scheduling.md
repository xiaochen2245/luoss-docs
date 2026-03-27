# 优先级调度

本文档介绍 LuoSS 平台的优先级调度功能，包括 Kubernetes PriorityClasses 和 Volcano 调度器集成。

<FeatureBadge status="stable" />

## 概述

优先级调度允许平台根据用户优先级分配资源：

| 优先级 | 说明 | 资源访问 |
|--------|------|----------|
| 高优先级 | 关键用户 | 更多资源，可抢占低优先级任务 |
| 低优先级 | 普通用户 | 有限资源，可被抢占 |

## 组件

### Kubernetes PriorityClasses

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 2000000
globalDefault: false
description: "高优先级用户"
preemptionPolicy: PreemptLowerPriority
---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: low-priority
value: 500
globalDefault: true
description: "低优先级用户"
preemptionPolicy: Never
```

### Volcano 调度器

Volcano 提供高级调度功能：

- **队列管理**：不同优先级使用不同队列
- **资源公平共享**：按权重分配资源
- **任务抢占**：高优先级任务可抢占低优先级

## 启用优先级调度

### 部署配置

```bash
DEPLOY_POSTGRESQL=true \
IMAGE_TAG=v5.0.1 \
ENABLE_PRIORITY=true \
ENABLE_VOLCANO=true \
HIGH_PRIORITY_VALUE=2000000 \
LOW_PRIORITY_VALUE=500 \
./deploy.sh
```

### 初始化

```bash
kubectl exec -it deployment/k8s-tenant-platform-backend -n k8s-tenant -- \
  /app/server init-priority
```

## 用户优先级管理

### 设置用户优先级

**通过 API：**

```bash
PUT /api/v1/users/{username}/priority
Content-Type: application/json

{
  "priority": "high"
}
```

**通过管理界面：**

1. 进入 **用户管理** 页面
2. 选择用户
3. 在 **优先级** 下拉框中选择

### 查看用户优先级

```bash
GET /api/v1/users/{username}/priority
```

响应：

```json
{
  "code": 0,
  "data": {
    "username": "alice",
    "priority": "high",
    "priority_class": "high-priority",
    "queue": "high-queue"
  }
}
```

## 队列管理

### 高优先级队列

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: high-queue
spec:
  weight: 3
  capability:
    cpu: "100"
    memory: "200Gi"
    nvidia.com/gpu: "10"
  reclaimable: false
```

### 低优先级队列

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: low-queue
spec:
  weight: 1
  capability:
    cpu: "50"
    memory: "100Gi"
    nvidia.com/gpu: "4"
  reclaimable: true
```

### 队列属性

| 属性 | 说明 |
|------|------|
| `weight` | 权重，决定资源分配比例 |
| `capability` | 最大资源限制 |
| `reclaimable` | 是否可被回收 |

## 资源抢占

### 抢占机制

当高优先级任务需要资源时：

1. 检查可用资源
2. 如果不足，查找低优先级任务
3. 终止低优先级任务
4. 记录抢占事件
5. 调度高优先级任务

### 抢占策略

```yaml
# 高优先级 PriorityClass
preemptionPolicy: PreemptLowerPriority

# 低优先级 PriorityClass
preemptionPolicy: Never
```

### 查看抢占事件

```bash
GET /api/v1/preemption/events
```

响应：

```json
{
  "code": 0,
  "data": {
    "items": [
      {
        "id": 1,
        "preemptor": "high-user-task",
        "preempted": "low-user-task",
        "reason": "Resource shortage",
        "timestamp": "2026-03-20T10:00:00Z"
      }
    ]
  }
}
```

## 配额差异化

### 不同优先级的配额

| 资源 | 高优先级 | 低优先级 |
|------|----------|----------|
| CPU | 8 核 | 4 核 |
| 内存 | 16 Gi | 8 Gi |
| NPU | 4 | 2 |
| 存储 | 100 Gi | 50 Gi |

### 配置配额

```yaml
priorityQuotas:
  high:
    cpu: 8
    memory: 16Gi
    npu: 4
    storage: 100Gi
  low:
    cpu: 4
    memory: 8Gi
    npu: 2
    storage: 50Gi
```

## 使用示例

### 创建高优先级环境

```bash
POST /api/v1/environments
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "prod-env",
  "template": "pytorch",
  "cpu": 4,
  "memory": "8Gi",
  "npu": 2
}
```

如果用户是高优先级，Pod 会自动添加：

```yaml
spec:
  priorityClassName: high-priority
```

### 创建训练任务

```bash
POST /api/v1/training-jobs
Content-Type: application/json

{
  "name": "model-training",
  "image": "pytorch:latest",
  "command": "python train.py",
  "resources": {
    "cpu": 4,
    "memory": "16Gi",
    "npu": 2
  }
}
```

Volcano Job 会自动关联到用户队列：

```yaml
spec:
  queue: high-queue
  priorityClassName: high-priority
```

## 监控

### 优先级分布

查看当前用户优先级分布：

```bash
GET /api/v1/statistics/priority
```

### 队列使用情况

```bash
GET /api/v1/queues/usage
```

响应：

```json
{
  "code": 0,
  "data": {
    "queues": [
      {
        "name": "high-queue",
        "allocated": {
          "cpu": 40,
          "memory": "80Gi",
          "npu": 4
        },
        "total": {
          "cpu": 100,
          "memory": "200Gi",
          "npu": 10
        }
      }
    ]
  }
}
```

## 最佳实践

### 用户分类

1. **核心研发**：高优先级
   - 关键模型训练
   - 生产环境支持

2. **普通研发**：低优先级
   - 日常开发测试
   - 实验性训练

### 资源规划

1. 预留资源给高优先级
2. 低优先级使用可回收资源
3. 监控抢占频率，调整配置

### 故障排查

**问题：高优先级用户仍被限制**

检查：
- PriorityClass 是否正确创建
- 用户是否正确关联优先级
- Pod 是否正确设置 priorityClassName

```bash
kubectl get priorityclasses
kubectl describe pod <pod-name> -n user-<username>
```

**问题：抢占不生效**

检查：
- Volcano 调度器是否正常运行
- 队列配置是否正确
- 查看调度器日志

```bash
kubectl logs -f deployment/volcano-scheduler -n volcano-system
```

## 相关文档

- [队列管理](/admin/queues)
- [队列资源池](/admin/queue-pool)
- [集群监控](/admin/cluster)
