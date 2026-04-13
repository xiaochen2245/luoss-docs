# 镜像存储

镜像存储页面展示和管理可用的容器镜像，支持上传本地镜像、分享镜像给其他用户、使用离线镜像等功能。

## 功能概述

| 功能 | 说明 |
|------|------|
| **镜像列表** | 查看所有可用镜像 |
| **上传镜像** | 上传本地镜像文件 |
| **分享镜像** | 将镜像分享给其他用户 |
| **离线镜像** | 在训练任务中使用离线镜像 |

## 镜像列表

镜像列表显示以下信息：

| 信息 | 说明 |
|------|------|
| 镜像名称 | 镜像标识 |
| 标签 | 镜像版本（如 `v1`, `latest`） |
| 大小 | 镜像文件大小 |
| 描述 | 镜像用途说明 |
| 创建时间 | 镜像上传时间 |

## 公共镜像

**公共镜像** 页面展示平台共享的公共镜像库，所有用户可浏览和使用这些镜像。

### 浏览公共镜像

1. 在侧边栏点击 **公共镜像**
2. 浏览共享镜像列表
3. 点击 **复制** 按钮获取完整镜像地址（包含 Registry URL）

::: tip 提示
公共镜像由管理员通过镜像管理页面上传和维护。
:::

### 使用公共镜像

复制镜像地址后，可在创建训练任务或开发环境时直接使用：

```bash
<registry-address>/shared/pytorch:2.0-cuda12
```

## 上传镜像

### 方式一：网页上传

1. 点击 **上传镜像** 按钮
2. 选择本地镜像文件（支持 `.tar`, `.tar.gz` 格式）
3. 等待上传完成
4. 系统自动导入镜像

::: tip 提示
上传的镜像会自动添加到您的用户命名空间下。
:::

### 方式二：Docker 推送

如果您本地安装了 Docker 环境，可以使用凭证直接推送镜像：

```bash
# 1. 登录仓库
docker login <registry-address> -u <username> -p <password>

# 2. 标记镜像
docker tag my-image:latest <registry-address>/<username>/my-image:latest

# 3. 推送镜像
docker push <registry-address>/<username>/my-image:latest
```

**获取仓库凭证：**

在镜像存储页面点击 **仓库凭证** 按钮，可以查看：
- 仓库地址
- 用户名
- 密码/Token

## 分享镜像

### 复制镜像地址

1. 在镜像列表中找到要分享的镜像
2. 点击 **复制** 按钮获取完整镜像地址（包含 Registry URL）

```bash
# 复制的完整地址
<registry-address>/user-demo1234/yolo_ddp:v1
```

其他用户可以使用此地址拉取镜像：

```bash
docker pull <registry-address>/user-demo1234/yolo_ddp:v1
```

### 使用他人分享的镜像

在创建训练任务时，在 **镜像地址** 字段输入完整的镜像地址即可使用。

## 使用镜像

### 创建开发环境

在创建开发环境时，选择模板会自动选择对应的镜像。

### 创建训练任务

#### 使用在线镜像

在 **镜像地址** 字段输入完整镜像地址：

```bash
# Docker Hub 镜像
pytorch/pytorch:2.0-cuda12

# 其他仓库镜像
<registry-address>/username/image:tag
```

#### 使用离线镜像

1. 勾选 **使用离线镜像** 选项
2. 从下拉列表中选择已上传的镜像

::: warning 注意
离线镜像仅限于当前用户上传的镜像，无法使用其他用户分享的离线镜像。
:::

## 常用镜像

### 深度学习框架

| 镜像 | 用途 | 说明 |
|------|------|------|
| `pytorch/pytorch:2.0-cuda12` | PyTorch 训练 | CUDA 12 支持 |
| `tensorflow/tensorflow:latest-gpu` | TensorFlow 训练 | GPU 支持 |
| `mindspore/mindspore` | MindSpore 训练 | 华为昇腾支持 |

### 推理框架

| 镜像 | 用途 | 说明 |
|------|------|------|
| `vllm/vllm` | vLLM 推理 | 高性能 LLM 推理 |
| `triton-inference-server` | Triton 推理 | 多模型服务 |

### 开发环境

| 镜像 | 用途 | 说明 |
|------|------|------|
| `codercom/code-server` | Code Server | 在线 IDE |
| `jupyter/base-notebook` | Jupyter Notebook | 数据科学环境 |

## 镜像管理最佳实践

### 镜像命名规范

```bash
# 推荐格式
<username>/<project>-<component>:<version>

# 示例
alice/yolo-training:v1.0
bob/llm-inference:latest
```

### 版本管理

- 使用语义化版本号（如 `v1.0.0`）
- 保留 `latest` 标签用于最新版本
- 为重要版本打多个标签

```bash
# 同时打多个标签
docker tag my-image:v1.0.0 my-image:v1.0
docker tag my-image:v1.0.0 my-image:latest
```

### 镜像大小优化

1. **使用多阶段构建**

```dockerfile
# 构建阶段
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --target=/app/deps -r requirements.txt

# 运行阶段
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /app/deps /usr/local/lib/python3.11/site-packages
COPY . .
CMD ["python", "main.py"]
```

2. **使用精简基础镜像**

```dockerfile
# 推荐
FROM python:3.11-slim

# 不推荐
FROM python:3.11
```

3. **清理缓存**

```dockerfile
RUN apt-get update && apt-get install -y \
    package1 \
    package2 \
    && rm -rf /var/lib/apt/lists/*
```

## 故障排查

### 镜像拉取失败

**问题**：`Error: image not found`

**解决方案**：
1. 检查镜像地址是否正确
2. 确认镜像已成功上传
3. 检查是否有访问权限

### 镜像上传失败

**问题**：上传超时或失败

**解决方案**：
1. 检查网络连接
2. 确认镜像文件大小未超限
3. 尝试压缩镜像文件

```bash
# 压缩镜像
docker save my-image:latest | gzip > my-image.tar.gz
```

### 登录失败

**问题**：`Error: authentication required`

**解决方案**：
1. 确认仓库凭证正确
2. 检查密码是否包含特殊字符
3. 尝试重新生成凭证

## 相关文档

- [开发环境](/guide/environments)
- [训练任务](/guide/training-jobs)
- [数据存储](/guide/model-manager)
