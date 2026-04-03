# 部署安装

本文档介绍平台的部署和安装。

<FeatureBadge status="stable" />

## 系统要求

### Kubernetes 集群

| 要求 | 说明 |
|------|------|
| Kubernetes 版本 | 1.24+ |
| 节点数量 | 至少 3 个工作节点 |
| 存储类 | 支持动态 Provisioning |
| 网络 | 支持 NetworkPolicy |

### 硬件要求

| 组件 | 最低要求 | 推荐配置 |
|------|----------|----------|
| CPU | 4 核 | 8+ 核 |
| 内存 | 8 Gi | 16+ Gi |
| 存储 | 100 Gi | 500+ Gi |

### 网络要求

| 端口 | 说明 |
|------|------|
| 31617 | 前端 NodePort |
| 31618 | 后端 NodePort |
| 31619 | Grafana NodePort |
| 5432 | PostgreSQL（内部） |

## 快速部署

### 基础部署

```bash
cd backend/deploy/helm/k8s-tenant-platform

FRONTEND_TAG=v5.5.265 \
BACKEND_TAG=v5.5.265 \
./blue-green-deploy.sh full
```

### 带优先级调度部署

```bash
FRONTEND_TAG=v5.5.265 \
BACKEND_TAG=v5.5.265 \
ENABLE_PRIORITY=true \
ENABLE_VOLCANO=true \
./blue-green-deploy.sh full
```

### 自定义配置

```bash
# 使用自定义 values 文件
helm upgrade --install k8s-tenant-platform ./helm/k8s-tenant-platform \
  -n k8s-tenant \
  --create-namespace \
  -f custom-values.yaml
```

## 高可用配置

### 多副本部署

```yaml
# values.yaml
replicaCount: 3

backend:
  replicaCount: 3
  
frontend:
  replicaCount: 2
```

### Pod 反亲和性

```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: k8s-tenant-platform
          topologyKey: kubernetes.io/hostname
```

### 节点选择器

```yaml
nodeSelector:
  node-role.kubernetes.io/worker: "true"

tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "platform"
    effect: "NoSchedule"
```

### 资源限制

```yaml
resources:
  limits:
    cpu: 2
    memory: 4Gi
  requests:
    cpu: 500m
    memory: 1Gi
```

## 外部数据库配置

### 使用外部 PostgreSQL

```bash
# 禁用内部 PostgreSQL
DEPLOY_POSTGRESQL=false \
DB_HOST=postgres.example.com \
DB_PORT=5432 \
DB_USER=luoss \
DB_PASSWORD=your-password \
DB_NAME=k8s_tenant \
./deploy.sh
```

### 数据库配置

```yaml
# values.yaml
postgresql:
  enabled: false

externalDatabase:
  host: postgres.example.com
  port: 5432
  user: luoss
  password: your-password
  database: k8s_tenant
```

## 验证部署

### 检查 Pod 状态

```bash
kubectl get pods -n k8s-tenant
```

预期输出：

```
NAME                                          READY   STATUS    RESTARTS   AGE
k8s-tenant-platform-backend-xxx               1/1     Running   0          5m
k8s-tenant-platform-frontend-xxx              1/1     Running   0          5m
k8s-tenant-platform-postgresql-0              1/1     Running   0          5m
```

### 检查服务状态

```bash
kubectl get svc -n k8s-tenant
```

### 检查日志

```bash
kubectl logs -f deployment/k8s-tenant-platform-backend -n k8s-tenant
```

### 健康检查

```bash
# 后端健康检查
curl http://<node-ip>:31618/health

# 前端访问
curl http://<node-ip>:31617/
```

## Ingress 配置

### 启用 Ingress

```yaml
# values.yaml
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: tenant.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: luoss-tls
      hosts:
        - tenant.example.com
```

### Code Server 子域名

```yaml
ingress:
  enabled: true
  hosts:
    - host: tenant.example.com
      paths:
        - path: /
          pathType: Prefix
    - host: "*.env.tenant.example.com"
      paths:
        - path: /
          pathType: Prefix
```

## 故障排查

### 常见问题

#### Pod 无法启动

```bash
# 检查 Pod 事件
kubectl describe pod <pod-name> -n k8s-tenant

# 检查日志
kubectl logs <pod-name> -n k8s-tenant
```

#### 数据库连接失败

```bash
# 检查数据库状态
kubectl get pods -l app.kubernetes.io/name=postgresql -n k8s-tenant

# 测试连接
kubectl exec -it deployment/k8s-tenant-platform-backend -n k8s-tenant -- nc -zv postgresql 5432
```

#### 服务无法访问

```bash
# 检查 Service
kubectl get endpoints -n k8s-tenant

# 检查 NodePort
kubectl get svc -n k8s-tenant -o wide
```

## 相关文档

- [故障排查](/admin/troubleshooting)
- [用户管理](/admin/users)
- [集群监控](/admin/cluster)
- [优先级调度](/admin/priority-scheduling)
