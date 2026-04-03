# 故障排查

本文档提供常见问题的诊断和解决方案。

## 诊断工具

```bash
# PostgreSQL 持久化诊断
./backend/scripts/diagnose_postgresql_persistence.sh

# 指标收集诊断
./backend/scripts/diagnose_metrics.sh

# 自动停止功能诊断
./backend/scripts/diagnose_autostop.sh
```

## 常见问题

### 用户无法登录

1. 检查用户状态是否被禁用
2. 检查后端日志
3. 检查数据库连接

### 环境启动失败

```bash
kubectl get pods -n user-<username>
kubectl describe pod codeserver-<env-id> -n user-<username>
```

| 原因 | 解决方案 |
|------|----------|
| 资源不足 | 增加配额或释放资源 |
| 镜像拉取失败 | 检查镜像地址 |
| 存储挂载失败 | 检查 PVC |

### 任务一直 Pending

```bash
kubectl describe vcjob <job-name> -n user-<username>
```

1. 检查集群资源
2. 检查任务优先级
3. 检查 NPU 资源

### 存储挂载失败

```bash
kubectl get pvc -n user-<username>
kubectl get pv
```

## 日志查看

```bash
# 后端日志
kubectl logs deployment/k8s-tenant-platform-backend -n k8s-tenant

# PostgreSQL 日志
kubectl logs statefulset/k8s-tenant-postgresql -n k8s-tenant
```

## 数据恢复

```bash
./backend/scripts/restore_postgresql.sh ./backups/k8s_tenant_backup.sql.gz
```

## 相关链接

- [队列资源池](/admin/queue-pool)
