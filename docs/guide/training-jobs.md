# 训练任务

训练任务功能支持创建和管理机器学习训练任务，支持单机和分布式训练，以及昇腾 NPU 专用训练。

<FeatureBadge status="stable" />

## 功能概述

| 功能 | 说明 |
|------|------|
| **创建任务** | 配置资源和命令创建训练任务 |
| **监控任务** | 查看任务状态、日志和事件 |
| **管理任务** | 停止、删除任务 |
| **分布式训练** | 支持多节点分布式训练 |
| **昇腾训练** | 支持华为昇腾 NPU 专用训练（ACJob） |
| **框架选择** | 支持 PyTorch、TensorFlow、MindSpore |
| **运行时长限制** | 设置任务最大运行时间 |
| **搜索排序** | 按任务名、队列、状态快速检索和排序 |
| **Checkpoint** | 支持训练断点保存和恢复 |

## 任务列表

进入 **训练任务** 页面，可以看到所有任务列表：

| 字段 | 说明 |
|------|------|
| 名称 | 任务名称 |
| 状态 | 当前运行状态 |
| 资源 | CPU/内存/NPU 配置 |
| 副本数 | Pod 数量 |
| 创建时间 | 任务创建时间 |

### 搜索和排序
- 支持按**任务名称**、**任务 ID 名称**、**队列**、**状态**搜索
- 支持按**任务名称**、**状态**、**队列**、**创建时间**排序
- 状态筛选支持与搜索分页联动

## 创建任务

### 步骤
1. 点击 **创建任务** 按钮
2. 填写基本信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| 任务名称 | 显示名称 | `模型微调-v1` |
| 镜像地址 | 容器镜像 | `pytorch/pytorch:2.0` |

3. 配置资源：

| 资源 | 单位 | 说明 | 限制 |
|------|------|------|------|
| CPU | 核 | CPU 核数 | 无限制 |
| 内存 | Gi | 内存大小 | 无限制 |
| NPU | 卡 | 单 Pod NPU 数量 | **最大 16** |

::: warning NPU 限制
单 Pod NPU 数量最大为 **16**，这是硬件限制。如需更多 NPU，请使用多 Pod 分布式训练。
:::

::: warning 活跃 NPU 总量限制
每位用户所有 **Pending + Running** 状态的训练任务 NPU 总和有上限（默认 64 张）。超过上限时新任务会被拒绝。请合理规划任务规模。
:::

4. 配置并行度：

| 字段 | 说明 |
|------|------|
| 副本数 | 总 Pod 数量 |

## 队列选择与用户角色

创建训练任务时，可用队列取决于用户角色：

| 用户角色 | 队列 | 说明 |
|----------|------|------|
| 学生用户 | `user-{username}-compute` | 个人专属队列，有资源保障 |
| 普通用户 | `normal-queue`（固定） | 共享队列，无法选择其他队列 |

::: info 项目编号自动关联
当您选择项目队列提交训练任务时，系统会自动将该项目编号关联到您的训练任务中。管理员可以通过项目编号快速定位某个项目的所有任务。
:::

::: warning 普通用户限制
普通用户创建训练任务时，队列和优先级层级选择器被锁定，固定使用 `normal-queue`。
:::

## 训练命令

### 单机训练

```bash
# 简单训练命令
python train.py --epochs 100 --batch_size 32

# 使用配置文件
python train.py --config config.yaml
```

### 分布式训练

```bash
# 使用 torchrun
torchrun --nproc_per_node=4 train.py

# 使用 deepspeed
deepspeed train.py --deepspeed_config ds_config.json
```

## 分布式训练

### 作业类型

平台支持两种作业类型：

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| **Volcano Job (vcjob)** | 标准 Volcano 调度作业 | GPU 和通用训练 |
| **Ascend Job (acjob)** | 昇腾 NPU 专用作业 | 华为昇腾 NPU 训练 |

::: tip 昇腾 NPU 训练
使用昇腾 NPU 时，系统会自动创建 Ascend Job（acjob），包含昇腾特有的调度配置和设备管理。
:::

### 框架选择

创建训练任务时可选择训练框架：

| 框架 | 说明 |
|------|------|
| PyTorch | PyTorch 深度学习框架 |
| TensorFlow | TensorFlow 深度学习框架 |
| MindSpore | 华为昇思深度学习框架 |

### 运行时长限制

可以为训练任务设置最大运行时间：

| 参数 | 说明 |
|------|------|
| 最大运行时长（分钟） | 任务运行超过此时间后自动终止 |
| 默认值 | 1440 分钟（24 小时） |
| 有效最大时长 | 考虑队列策略后的实际限制 |

::: warning 超时终止
任务超时后会被自动终止，终止原因为 `RuntimeLimitExceeded`。请确保训练代码支持 Checkpoint 保存。
:::

### 启用多任务模式
1. 在任务模式选择 **多任务模式**
2. 添加多个 Task（如 master、worker）

### Task 配置
每个 Task 可以配置：
- 名称（如 worker、master）
- 副本数
- CPU/内存/NPU
- 启动命令

### 环境变量
分布式训练自动注入：

| 变量 | 说明 |
|------|------|
| `LOCAL_RANK` | 本地设备序号 |
| `RANK` | 全局进程序号 |
| `WORLD_SIZE` | 总进程数 |
| `MASTER_ADDR` | 主节点地址 |
| `MASTER_PORT` | 主节点端口 |

### 分布式训练示例

```python
import torch
import torch.distributed as dist
import os

def setup_distributed():
    dist.init_process_group(backend='nccl')
    local_rank = int(os.environ.get('LOCAL_RANK', 0))
    torch.cuda.set_device(local_rank)
    return local_rank

def main():
    local_rank = setup_distributed()
    
    # 模型和数据加载
    model = MyModel().cuda()
    model = torch.nn.parallel.DistributedDataParallel(model, device_ids=[local_rank])
    
    # 训练循环
    for epoch in range(100):
        train_one_epoch(model, train_loader)

if __name__ == '__main__':
    main()
```

## 断点续训（Fault Tolerance）

断点续训功能可在训练任务异常中断后自动恢复，避免从头开始训练。

<FeatureBadge status="stable" />

### 单机训练（vcjob）

单机训练任务支持简单断点续训配置：

| 参数 | 说明 | 可选值 |
|------|------|--------|
| **故障调度策略** | Pod 被驱逐时的处理方式 | `force`（强制重启）、`grace`（优雅重启）、`off`（关闭） |
| **最大重试次数** | 任务失败后的最大重试次数 | 默认 3 次 |
| **优雅终止等待时间** | grace 模式下 Pod 优雅退出的等待秒数 | 默认 900 秒 |

::: tip 故障调度策略说明
- **force**：Pod 被驱逐时立即重启整个任务，适合无状态训练
- **grace**：Pod 被驱逐时优雅等待当前 checkpoint 保存完成后再重启，适合需要保存进度的长时训练
- **off**：不启用断点续训
:::

### 分布式训练（acjob）

分布式训练（Ascend Job）支持完整的断点续训功能：

#### 简单模式

| 参数 | 说明 |
|------|------|
| **故障调度策略** | force / grace |
| **最大重试次数** | 任务失败后最大重试次数 |
| **恢复策略** | 训练恢复策略（详见下方说明） |

#### 恢复策略

| 策略 | 说明 |
|------|------|
| `observer` | 观察模式，仅记录故障 |
| `restart-task` | 重启整个任务 |
| `restart-replace` | 替换故障 Pod 并恢复训练 |
| `elastic-training` | 弹性训练，自动调整训练规模 |
| `dump-restart` | 转储后重启 |
| `exit` | 直接退出 |

#### 高级模式

高级模式支持额外的容错能力：

| 参数 | 说明 |
|------|------|
| **MindIO TFT** | 启用 MindIO Transparent Fault Tolerance，加速故障恢复 |
| **MindIO ACP** | 启用 MindIO Async Checkpoint Persistence，异步保存 checkpoint |

::: warning 断点续训前提条件
断点续训需要训练代码配合，确保：
1. 训练代码支持 **定期保存 checkpoint**（模型参数、优化器状态、epoch 等完整状态）
2. 训练代码支持 **从 checkpoint 恢复**，能正确加载并继续训练
3. checkpoint 保存在持久化存储路径（如 `/models/checkpoints`）
:::

## 测试版本

创建训练任务时可以开启 **测试版本** 开关，系统会自动填充官方 MindCluster 训练启动脚本模板：

```bash
bash /models/share/scripts/train_start.sh /models /models/output main.py
```

该脚本由华为 MindCluster 提供，内置以下功能：
- 自动检测 NPU 设备和训练环境
- 自动生成分布式训练配置（rank table 等）
- 支持断点续训的自动恢复
- 训练日志和错误信息收集

::: tip 使用建议
测试版本适用于快速验证 NPU 训练环境和脚本配置。生产训练建议根据实际需求编写自定义训练脚本。
:::

## 训练镜像制作要求

使用昇腾 NPU 进行训练时，镜像需要满足以下要求：

### 基础要求

| 要求 | 说明 |
|------|------|
| **架构** | 必须为 `linux/arm64`（华为鲲鹏 ARM 架构） |
| **基础镜像** | 推荐使用官方昇腾训练镜像（如 `torch:b030`） |
| **驱动依赖** | 不得包含 Ascend 驱动，驱动通过 volume 从宿主机挂载 |

### 自动挂载的宿主机目录

训练 Pod 自动挂载以下宿主机目录，镜像中**不需要**安装这些组件：

| 容器路径 | 宿主机路径 | 说明 |
|-----------|-----------|------|
| `/usr/local/Ascend/driver` | `/usr/local/Ascend/driver` | Ascend 驱动 |
| `/usr/local/Ascend/ascend-toolkit` | `/usr/local/Ascend/ascend-toolkit` | Ascend 工具包 |
| `/usr/local/sbin` | `/usr/local/sbin` | 系统工具 |
| `/usr/local/sbin` | `/usr/local/sbin` | NPU 管理工具 |
| `/dev/shm` | Memory (16Gi) | 共享内存 |
| `/var/log/npu` | `/var/log/npu` | NPU 日志 |

### 环境变量

训练 Pod 自动注入以下环境变量：

| 变量 | 说明 |
|------|------|
| `ASCEND_VISIBLE_DEVICES` | 可见的 NPU 设备 ID |
| `LD_LIBRARY_PATH` | 包含 Ascend 驱动库路径 |
| `framework` | 训练框架名称（如 `PyTorch`） |
| `POD_UID` | Pod 唯一标识 |
| `XDL_IP` | Pod 所在节点 IP |

### 镜像 Dockerfile 示例

```dockerfile
# 示例：构建 PyTorch + Ascend NPU 训练镜像
FROM ubuntu:22.04

# 安装基础依赖
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# 安装训练框架
RUN pip3 install torch torchvision

# 安装训练脚本到工作目录
WORKDIR /job
COPY train.py .

# 注意：不需要安装 Ascend 驱动和工具包
# 这些通过 volume 从宿主机自动挂载
```

::: warning 注意事项
1. **不要**在镜像中安装 Ascend 驱动（`Ascend-driver-*`），驱动由平台通过 hostPath 挂载
2. **不要**设置 `LD_LIBRARY_PATH` 指向 Ascend 驱动路径，平台会自动注入
3. 镜像架构必须是 `linux/arm64`，否则无法在鲲鹏节点上运行
:::

## Checkpoint 管理

### 保存 Checkpoint

```python
import os

def save_checkpoint(model, optimizer, epoch, path='/models/checkpoints'):
    checkpoint = {
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
    }
    
    checkpoint_path = os.path.join(path, f'checkpoint_epoch_{epoch}.pt')
    torch.save(checkpoint, checkpoint_path)
    print(f'Saved checkpoint to {checkpoint_path}')
```

### 恢复 Checkpoint

```python
def load_checkpoint(model, optimizer, checkpoint_path):
    checkpoint = torch.load(checkpoint_path)
    model.load_state_dict(checkpoint['model_state_dict'])
    optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    return checkpoint['epoch']
```

### 定期保存策略

```python
# 每 N 个 epoch 保存一次
if epoch % save_interval == 0:
    save_checkpoint(model, optimizer, epoch)

# 只保留最近 N 个 checkpoint
def cleanup_old_checkpoints(checkpoint_dir, keep=3):
    checkpoints = sorted(glob.glob(os.path.join(checkpoint_dir, 'checkpoint_*.pt')))
    for old_checkpoint in checkpoints[:-keep]:
        os.remove(old_checkpoint)
```

## 存储挂载

训练任务自动挂载用户存储：

| 路径 | 说明 |
|------|------|
| `/models` | 用户存储根目录 |
| `/models/datasets` | 数据集目录 |
| `/models/output` | 输出目录 |
| `/models/checkpoints` | Checkpoint 目录 |

### 使用示例

```python
import os

# 数据路径
data_path = "/models/datasets/train"

# 输出路径
output_path = "/models/output"

# Checkpoint 路径
checkpoint_path = "/models/checkpoints"

# 保存模型
model.save(os.path.join(output_path, "model.pt"))
```

## 停止和删除

### 停止任务
1. 点击 **停止** 按钮
2. 确认操作

::: info 数据保留
停止任务不会删除 `/models/output` 中的输出。
:::

### 删除任务
1. 先停止任务
2. 点击 **删除** 按钮

## 任务状态

| 状态 | 说明 |
|------|------|
| **Pending** | 等待调度 |
| **Running** | 运行中 |
| **Completed** | 成功完成 |
| **Failed** | 失败 |
| **Terminated** | 已终止（含超时终止） |

## 查看日志

### 实时日志

1. 点击任务名称进入详情页
2. 查看实时日志输出

### 下载日志

```bash
# 使用 kubectl 下载日志
kubectl logs <pod-name> -n user-<username> > training.log
```

## 性能优化

### 数据加载优化

```python
from torch.utils.data import DataLoader

# 使用多进程数据加载
dataloader = DataLoader(
    dataset,
    batch_size=32,
    num_workers=4,        # 多进程加载
    pin_memory=True,      # 锁页内存
    prefetch_factor=2     # 预取因子
)
```

### 混合精度训练

```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

for data, target in dataloader:
    optimizer.zero_grad()
    
    with autocast():
        output = model(data)
        loss = criterion(output, target)
    
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

### 梯度累积

```python
accumulation_steps = 4

for i, (data, target) in enumerate(dataloader):
    output = model(data)
    loss = criterion(output, target) / accumulation_steps
    loss.backward()
    
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()
```

## 最佳实践

### 资源配置

| 模型规模 | CPU | 内存 | NPU |
|----------|-----|------|-----|
| 小型 (<1B) | 2-4 | 8-16 Gi | 1-2 |
| 中型 (1B-10B) | 4-8 | 16-32 Gi | 4-8 |
| 大型 (>10B) | 8+ | 32+ Gi | 8+ |

### 数据准备
1. 提前将数据上传到 `/models/datasets`
2. 验证数据完整性
3. 使用合适的数据格式

### 输出管理

```python
# 推荐的输出结构
import os
from datetime import datetime

exp_name = f"exp-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
output_dir = f"/models/output/{exp_name}"
os.makedirs(output_dir, exist_ok=True)

# 保存配置、日志、模型
```

## 常见问题

### Q: 任务一直 Pending？
A: 可能是集群资源不足或优先级较低，可降低资源配置或等待资源释放。

### Q: 训练输出在哪里？
A: 所有输出保存在 `/models/output` 目录。

### Q: 如何恢复中断的训练？
A: 从最新的 checkpoint 恢复，需要代码支持 checkpoint 加载逻辑。开启断点续训后，任务异常中断会自动重启并从 checkpoint 继续。

### Q: 断点续训不生效？
A: 检查以下几点：
1. 训练代码是否定期保存 checkpoint（模型参数 + 优化器状态 + epoch）
2. 训练代码是否支持从 checkpoint 路径恢复（`--load` 参数）
3. Checkpoint 保存在持久化路径 `/models/checkpoints`，非容器临时目录
4. 任务配置中故障调度策略未设为 `off`

### Q: 训练镜像在 NPU 节点上无法启动？
A: 常见原因：
1. 镜像架构不是 `linux/arm64`，鲲鹏节点不支持 `amd64` 镜像
2. 镜像中安装了 Ascend 驱动与宿主机驱动冲突
3. 镜像中 `LD_LIBRARY_PATH` 覆盖了平台自动注入的驱动库路径

### Q: 分布式训练节点间通信失败？
A: 检查网络策略是否允许 Pod 间通信。

### Q: 为什么我无法选择队列？
A: 如果您的用户角色为"普通用户"（normal），系统会固定使用 `normal-queue` 共享队列，队列和优先级选项被禁用。请联系管理员了解角色分配。

### Q: 创建任务时提示"NPU总数超限"怎么办？
A: 这表示您当前所有 Pending 和 Running 状态训练任务的 NPU 总和已达到上限。解决方案：
1. 等待现有任务完成或手动停止部分任务
2. 减少新任务的 NPU 请求数量
3. 联系管理员调整限制（`backend.trainingJob.userMaxActiveNPU`）

## 相关文档
- [我的作业](/guide/volcano-jobs)
- [Web 终端](/guide/web-terminal)
- [使用统计](/guide/my-usage)