# 开发环境

开发环境提供基于 VS Code 的云端开发环境（Code Server），支持在线编写代码、调试和运行程序。

<FeatureBadge status="stable" />

## 功能概述

| 功能 | 说明 |
|------|------|
| **创建环境** | 配置资源创建通用开发环境 |
| **启动/停止** | 控制环境运行状态 |
| **在线编辑** | 通过浏览器访问 Code Server |
| **数据持久化** | 数据自动保存，不会丢失 |
| **搜索排序** | 按名称、状态快速查找和排序 |
| **NPU 访问** | 自动访问所有 NPU 设备 |

## 环境列表

进入 **开发环境** 页面，可以看到所有环境列表：

| 字段 | 说明 |
|------|------|
| 名称 | 环境名称 |
| 状态 | 当前运行状态 |
| 资源 | CPU/内存配置 |
| 自动停止 | 空闲自动停止时间 |
| 操作 | 启动、停止、删除等 |

### 搜索和排序
- 支持按**环境名称**、**状态**搜索
- 支持按**环境名称**、**状态**、**最后访问时间**排序
- 状态筛选支持与搜索组合使用

## 创建环境

### 步骤

1. 点击 **创建环境** 按钮
2. 填写基本信息：

| 字段 | 说明 |
|------|------|
| 环境名称 | 自定义名称（小写字母、数字和连字符） |
| CPU | CPU 核数 |
| 内存 | 内存大小 (Gi) |

3. 点击 **创建**

::: info 通用开发环境
开发环境自动使用统一模板，具有以下特性：
- 已启用特权模式和 Docker 支持
- 可访问所有 NPU 设备（无需手动指定数量）
- 预装常用开发工具
:::

## 环境状态
| 状态 | 说明 |
|------|------|
| **Creating** | 创建中 |
| **Starting** | 启动中 |
| **Running** | 运行中 |
| **Stopping** | 停止中 |
| **Stopped** | 已停止 |
| **Error** | 错误 |

## 使用环境

### 启动环境

1. 找到已停止的环境
2. 点击 **启动** 按钮
3. 等待状态变为 Running

### 打开环境

1. 确认环境状态为 Running
2. 点击 **打开** 按钮
3. 在新标签页中访问 Code Server

### 环境操作

| 操作 | 说明 |
|------|------|
| 启动 | 启动已停止的环境 |
| 停止 | 停止运行中的环境 |
| 删除 | 删除环境（数据保留） |
| 编辑 | 修改资源配置 |

::: info 关于自定义镜像
开发环境使用统一的通用模板。如需使用自定义镜像进行训练或推理，请使用 [训练任务](/guide/training-jobs) 功能。
:::

## 性能调优

### 资源配置建议

| 工作负载 | CPU | 内存 | 说明 |
|----------|-----|------|------|
| 轻量开发 | 1-2 | 4 Gi | 代码编辑、脚本开发 |
| Python 开发 | 2-4 | 8 Gi | 数据处理、模型调试 |
| 深度学习 | 4-8 | 16-32 Gi | 模型训练、推理测试 |
| 大模型开发 | 8+ | 32+ Gi | 大规模模型开发 |

::: tip NPU 访问
开发环境已自动启用对所有 NPU 设备的访问，无需手动配置。如需独占使用特定 NPU，请在代码中通过环境变量或设备 ID 指定。
:::

### VS Code 优化

在 `settings.json` 中添加：

```json
{
  "files.watcherExclude": {
    "**/.git/**": true,
    "**/node_modules/**": true,
    "**/__pycache__/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/venv": true,
    "**/.git": true
  },
  "extensions.autoUpdate": false
}
```

### 终端优化

```json
{
  "terminal.integrated.scrollback": 5000,
  "terminal.integrated.fastScrollSensitivity": 5
}
```

## 扩展安装

### 推荐扩展

#### Python 开发

```bash
code-server --install-extension ms-python.python
code-server --install-extension ms-python.vscode-pylance
code-server --install-extension ms-toolsai.jupyter
```

#### 深度学习

```bash
code-server --install-extension ms-toolsai.tensorboard
```

#### 通用工具

```bash
code-server --install-extension eamodio.gitlens
code-server --install-extension ms-azuretools.vscode-docker
```

## 存储管理

### 查看存储使用

```bash
# 在环境终端中运行
df -h /config/workspace
du -sh /config/workspace/*
```

### 清理空间

```bash
# 清理 pip 缓存
pip cache purge

# 清理 conda 缓存
conda clean --all

# 清理 Docker（如果可用）
docker system prune
```

## SSH 访问

### 配置 SSH

1. 在 **设置** 页面添加 SSH 公钥
2. 使用 SSH 客户端连接：

```bash
ssh coder@<environment-host> -p <port>
```

### SCP 文件传输

```bash
# 上传文件
scp -P <port> local_file.txt coder@<environment-host>:/config/workspace/

# 下载文件
scp -P <port> coder@<environment-host>:/config/workspace/output.txt ./
```

## 故障排查

### 环境无法启动

1. 检查资源配置是否在配额内
2. 检查镜像是否有效
3. 查看环境事件

### 连接超时

1. 检查网络连接
2. 尝试刷新页面
3. 检查环境是否在运行

### 数据丢失

::: danger 注意
环境数据存储在 PVC 中，删除环境不会删除数据。但如果删除用户，数据将被清除。
:::

## 最佳实践

### 1. 合理配置资源
- 根据实际需求配置资源
- 不使用时及时停止环境
- 利用自动停止功能

### 2. 数据管理
- 重要数据定期备份
- 使用版本控制（Git）
- 避免在环境内存储大量数据

### 3. 安全实践
- 不在代码中硬编码密钥
- 使用环境变量存储敏感信息
- 定期更换密码

## 相关文档
- [集群拓扑](/guide/cluster-topology)
- [数据存储](/guide/model-manager)
- [常见问题](/guide/faq)
