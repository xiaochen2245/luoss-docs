const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat, TableOfContents
} = require('docx');
const fs = require('fs');

// Table border style
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

// Helper function to create a simple table
function createTable(headers, rows) {
  const colCount = headers.length;
  const colWidth = Math.floor(9360 / colCount);
  const columnWidths = Array(colCount).fill(colWidth);

  const tableRows = [
    // Header row
    new TableRow({
      children: headers.map(h => new TableCell({
        borders,
        width: { size: colWidth, type: WidthType.DXA },
        shading: { fill: "E8F4FC", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text: h, bold: true, size: 22, font: "Microsoft YaHei" })]
        })]
      }))
    }),
    // Data rows
    ...rows.map(row => new TableRow({
      children: row.map(cell => new TableCell({
        borders,
        width: { size: colWidth, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text: cell, size: 22, font: "Microsoft YaHei" })]
        })]
      }))
    }))
  ];

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths,
    rows: tableRows
  });
}

// Helper to create heading
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 32, font: "Microsoft YaHei" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 28, font: "Microsoft YaHei" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, size: 24, font: "Microsoft YaHei" })]
  });
}

function p(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Microsoft YaHei" })]
  });
}

function bold(text) {
  return new TextRun({ text, bold: true, size: 22, font: "Microsoft YaHei" });
}

function normal(text) {
  return new TextRun({ text, size: 22, font: "Microsoft YaHei" });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Microsoft YaHei", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 120, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "LuoSS 用户指南", size: 20, font: "Microsoft YaHei", color: "666666" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "第 ", size: 20, font: "Microsoft YaHei" }),
                   new TextRun({ children: [PageNumber.CURRENT], size: 20 }),
                   new TextRun({ text: " 页", size: 20, font: "Microsoft YaHei" })]
      })] })
    },
    children: [
      // Title Page
      new Paragraph({ spacing: { before: 2400 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "LuoSS 络书算衡", bold: true, size: 56, font: "Microsoft YaHei" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({ text: "K8s 租户管理平台", size: 36, font: "Microsoft YaHei" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 },
        children: [new TextRun({ text: "用户指南", bold: true, size: 48, font: "Microsoft YaHei" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1200 },
        children: [new TextRun({ text: "版本 v5.0", size: 24, font: "Microsoft YaHei", color: "666666" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 },
        children: [new TextRun({ text: "2026年2月", size: 24, font: "Microsoft YaHei", color: "666666" })]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // TOC
      h1("目录"),
      new TableOfContents("目录", { hyperlink: true, headingStyleRange: "1-3" }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 1: Overview
      h1("第一章 概述"),
      h2("平台简介"),
      p("LuoSS 是一个基于 Kubernetes 的多租户管理平台，提供："),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("云端开发环境"), normal("：基于 Code Server 的在线 IDE")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("训练任务管理"), normal("：支持单机和分布式训练")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("资源配额管理"), normal("：CPU、内存、NPU 资源管理")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("多租户隔离"), normal("：每个用户独立命名空间")] }),

      h2("用户界面"),
      h3("导航菜单"),
      createTable(
        ["菜单", "说明"],
        [
          ["仪表盘", "资源概览和快捷操作"],
          ["开发环境", "管理云端开发环境"],
          ["训练任务", "管理训练任务"],
          ["数据存储", "查看存储使用情况"],
          ["镜像存储", "查看可用镜像"],
          ["我的作业", "查看提交的作业"],
          ["使用统计", "查看资源使用统计"],
          ["设置", "账户设置"]
        ]
      ),

      h2("核心概念"),
      h3("命名空间"),
      p("每个用户有独立的 Kubernetes 命名空间 user-{username}，实现资源隔离。"),
      h3("配额"),
      p("每个用户有资源配额限制："),
      createTable(
        ["资源", "说明"],
        [["CPU", "CPU 核数"], ["内存", "内存大小 (Gi)"], ["NPU", "神经网络处理器数量"]]
      ),
      h3("存储"),
      p("用户存储自动挂载到环境："),
      createTable(
        ["环境", "挂载路径"],
        [["开发环境", "/config/workspace"], ["训练任务", "/models"]]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 2: Quick Start
      h1("第二章 快速开始"),
      h2("前提条件"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("已获得平台账号")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("浏览器支持：Chrome、Firefox、Edge")] }),

      h2("登录平台"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("打开平台网址")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("输入用户名和密码")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("登录")] }),

      h2("创建开发环境"),
      h3("步骤"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击左侧菜单 "), bold("开发环境")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("创建环境"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("填写信息：")] }),
      createTable(
        ["字段", "示例值"],
        [["环境名称", "my-first-env"], ["模板", "MindIE"], ["CPU", "2"], ["内存", "4"], ["NPU", "0"]]
      ),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("创建")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("等待环境创建完成")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("启动")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("状态变为 Running 后点击 "), bold("打开")] }),

      h3("使用 Code Server"),
      p("打开环境后，您可以："),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("编写和编辑代码")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("运行终端命令")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("调试程序")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("管理文件")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 3: Dashboard
      h1("第三章 仪表盘"),
      p("仪表盘是您登录后的首页，展示资源使用概览和重要信息。"),
      h2("功能概述"),
      createTable(
        ["区域", "说明"],
        [
          ["资源概览", "CPU、内存、NPU 配额和使用情况"],
          ["活跃环境", "当前运行中的开发环境"],
          ["活跃任务", "当前运行中的训练任务"],
          ["系统公告", "管理员发布的公告信息"]
        ]
      ),
      h2("资源概览"),
      h3("查看配额"),
      p("资源概览卡片显示："),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("CPU"), normal("：已用/总量，使用率百分比")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("内存"), normal("：已用/总量，使用率百分比")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("NPU"), normal("：已用/总量，使用率百分比")] }),

      h3("配额状态"),
      createTable(
        ["状态", "颜色", "说明"],
        [["正常", "绿色", "使用率 < 70%"], ["警告", "黄色", "使用率 70-90%"], ["紧张", "红色", "使用率 > 90%"]]
      ),

      h2("快捷操作"),
      p("仪表盘提供以下快捷入口："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("创建环境"), normal("：快速创建新的开发环境")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("创建任务"), normal("：快速创建新的训练任务")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("查看详情"), normal("：进入详细的使用统计页面")] }),

      h2("使用建议"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("定期检查配额"), normal("：关注资源使用情况，避免超限")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("及时释放资源"), normal("：停止不使用的环境")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("关注系统公告"), normal("：了解平台动态和维护通知")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 4: Development Environments
      h1("第四章 开发环境"),
      p("开发环境提供基于 VS Code 的云端开发环境（Code Server），支持在线编写代码、调试和运行程序。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [
          ["创建环境", "选择模板和资源配置创建开发环境"],
          ["启动/停止", "控制环境运行状态"],
          ["在线编辑", "通过浏览器访问 Code Server"],
          ["数据持久化", "数据自动保存，不会丢失"]
        ]
      ),

      h2("环境列表"),
      p("进入 开发环境 页面，可以看到所有环境列表："),
      createTable(
        ["字段", "说明"],
        [
          ["名称", "环境名称"],
          ["模板", "使用的环境模板"],
          ["状态", "当前运行状态"],
          ["资源", "CPU/内存/NPU 配置"],
          ["自动停止", "空闲自动停止时间"],
          ["操作", "启动、停止、删除等"]
        ]
      ),

      h2("创建环境"),
      h3("步骤"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("创建环境"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("填写基本信息：")] }),
      createTable(
        ["字段", "说明"],
        [
          ["环境名称", "自定义名称"],
          ["模板", "选择开发模板"],
          ["CPU", "CPU 核数"],
          ["内存", "内存大小 (Gi)"],
          ["NPU", "NPU 数量（可选）"],
          ["自动停止", "空闲多久后自动停止"]
        ]
      ),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("创建")] }),

      h3("模板说明"),
      createTable(
        ["模板", "适用场景"],
        [
          ["MindIE", "华为昇腾推理开发"],
          ["MindSpeed", "LLM 训练和推理"],
          ["vLLM", "高性能 LLM 推理"],
          ["MindSpore", "MindSpore 框架开发"]
        ]
      ),

      h2("环境状态"),
      createTable(
        ["状态", "说明"],
        [["Creating", "创建中"], ["Starting", "启动中"], ["Running", "运行中"],
         ["Stopping", "停止中"], ["Stopped", "已停止"], ["Error", "错误"]]
      ),

      h2("使用环境"),
      h3("启动环境"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("找到已停止的环境")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("启动"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("等待状态变为 Running")] }),

      h3("打开环境"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("确认环境状态为 Running")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("打开"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("在新标签页中打开 Code Server")] }),
      p("提示：Code Server 的访问密码在环境详情页中查看。"),

      h3("停止环境"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("找到运行中的环境")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("停止"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("确认停止操作")] }),

      h2("存储说明"),
      h3("自动挂载"),
      p("开发环境自动挂载用户存储到 /config/workspace："),
      p("/config/workspace/     # 用户工作目录（持久化存储）"),
      p("├── projects/          # 项目代码"),
      p("├── datasets/          # 数据集"),
      p("└── models/            # 模型文件"),

      h3("数据持久化"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("所有数据保存在 /config/workspace 目录")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("停止环境不会删除数据")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("删除环境也不会删除数据")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("不同环境共享同一存储")] }),

      h2("自动停止"),
      p("为节省资源，环境空闲一段时间后会自动停止。"),
      h3("防止自动停止"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("定期点击 "), bold("打开"), normal(" 按钮更新访问时间")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("增加自动停止时间")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("关闭自动停止功能（不推荐）")] }),

      h2("最佳实践"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("按需配置资源"), normal("：根据实际需求选择 CPU 和内存")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("及时停止"), normal("：不使用时及时停止环境")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("合理命名"), normal("：使用有意义的名称便于管理")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("定期清理"), normal("：删除不需要的环境")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 5: Training Jobs
      h1("第五章 训练任务"),
      p("训练任务功能支持创建和管理机器学习训练任务，支持单机和分布式训练。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [
          ["创建任务", "配置资源和命令创建训练任务"],
          ["监控任务", "查看任务状态、日志和事件"],
          ["管理任务", "停止、删除任务"],
          ["分布式训练", "支持多节点分布式训练"]
        ]
      ),

      h2("任务列表"),
      createTable(
        ["字段", "说明"],
        [["名称", "任务名称"], ["状态", "当前运行状态"], ["资源", "CPU/内存/NPU 配置"],
         ["副本数", "Pod 数量"], ["创建时间", "任务创建时间"]]
      ),

      h2("创建任务"),
      h3("步骤"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("创建任务"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("填写基本信息：")] }),
      createTable(
        ["字段", "说明", "示例"],
        [["任务名称", "显示名称", "模型微调-v1"], ["镜像地址", "容器镜像", "pytorch/pytorch:2.0"]]
      ),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("配置资源：")] }),
      createTable(
        ["资源", "单位", "说明", "限制"],
        [["CPU", "核", "CPU 核数", "无限制"], ["内存", "Gi", "内存大小", "无限制"],
         ["NPU", "卡", "单 Pod NPU 数量", "最大 16"]]
      ),
      p("注意：单 Pod NPU 数量最大为 16，这是硬件限制。如需更多 NPU，请使用多 Pod 分布式训练。"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("配置并行度：")] }),
      createTable(
        ["字段", "说明"],
        [["副本数", "总 Pod 数量"], ["最小成员数", "最小可用 Pod 数"]]
      ),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("选择优先级")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("配置启动命令")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("创建")] }),

      h3("优先级说明"),
      createTable(
        ["优先级", "说明", "适用场景"],
        [["Critical", "最高", "紧急任务"], ["Interactive", "交互式", "开发调试"],
         ["Batch-High", "高优先级", "重要训练"], ["Batch", "普通", "日常训练（默认）"],
         ["Best-Effort", "低优先级", "后台任务"]]
      ),

      h2("任务状态"),
      createTable(
        ["状态", "说明"],
        [["Pending", "等待资源调度"], ["Running", "正在运行"], ["Completed", "成功完成"],
         ["Failed", "执行失败"], ["Terminated", "已终止"]]
      ),

      h2("存储挂载"),
      p("训练任务自动挂载用户存储："),
      createTable(
        ["路径", "说明"],
        [["/models", "用户存储根目录"], ["/models/output", "推荐的输出目录"]]
      ),

      h2("分布式训练"),
      h3("启用多任务模式"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("在任务模式选择 "), bold("多任务模式")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("添加多个 Task（如 master, worker）")] }),

      h3("Task 配置"),
      p("每个 Task 可以配置："),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("名称（如 worker, master）")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("副本数")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("CPU/内存/NPU")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("启动命令")] }),

      h3("环境变量"),
      p("分布式训练自动注入："),
      createTable(
        ["变量", "说明"],
        [["LOCAL_RANK", "本地设备序号"], ["RANK", "全局进程序号"],
         ["WORLD_SIZE", "总进程数"], ["MASTER_ADDR", "主节点地址"]]
      ),

      h2("最佳实践"),
      h3("资源配置"),
      createTable(
        ["模型规模", "CPU", "内存", "NPU"],
        [["小型 (<1B)", "2-4", "8-16 Gi", "1-2"], ["中型 (1B-10B)", "4-8", "16-32 Gi", "4-8"],
         ["大型 (>10B)", "8+", "32+ Gi", "8+"]]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 6: Data Storage
      h1("第六章 数据存储"),
      p("数据存储页面展示您的用户存储使用情况。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["存储概览", "查看存储配额和使用情况"], ["文件管理", "浏览和管理存储文件"],
         ["数据上传", "上传数据到存储"]]
      ),

      h2("存储概览"),
      h3("查看配额"),
      createTable(
        ["信息", "说明"],
        [["已用空间", "当前使用的存储空间"], ["总配额", "分配的存储配额"], ["使用率", "已用/总量百分比"]]
      ),

      h3("存储路径"),
      p("用户存储挂载到开发环境和训练任务："),
      createTable(
        ["环境", "挂载路径"],
        [["开发环境", "/config/workspace"], ["训练任务", "/models"]]
      ),
      p("提示：所有环境和任务共享同一个用户存储，数据在不同环境间互通。"),

      h2("目录结构"),
      p("推荐的目录结构："),
      p("/config/workspace/     # 开发环境"),
      p("/models/               # 训练任务"),
      p("├── datasets/          # 数据集"),
      p("│   ├── train/         # 训练数据"),
      p("│   └── val/           # 验证数据"),
      p("├── models/            # 预训练模型"),
      p("│   └── llama-3-8b/"),
      p("├── output/            # 训练输出"),
      p("│   └── exp-001/"),
      p("└── workspace/         # 工作目录"),

      h2("使用建议"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("分类存放"), normal("：按类型组织数据")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("定期清理"), normal("：删除不需要的文件")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("备份重要数据"), normal("：定期下载备份")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 7: Image Storage
      h1("第七章 镜像存储"),
      p("镜像存储页面展示可用的容器镜像列表。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["镜像列表", "查看可用镜像"], ["镜像信息", "查看镜像详情"]]
      ),

      h2("镜像列表"),
      createTable(
        ["信息", "说明"],
        [["镜像名称", "镜像标识"], ["标签", "镜像版本"], ["大小", "镜像大小"], ["描述", "镜像说明"]]
      ),

      h2("常用镜像"),
      createTable(
        ["镜像", "用途"],
        [["pytorch/pytorch:2.0-cuda12", "PyTorch 训练"],
         ["mindspore/mindspore", "MindSpore 训练"],
         ["vllm/vllm", "vLLM 推理"]]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 8: My Jobs
      h1("第八章 我的作业"),
      p("我的作业页面展示您提交的所有 Volcano 作业。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["作业列表", "查看所有作业"], ["作业详情", "查看作业详细信息"], ["状态监控", "监控作业运行状态"]]
      ),

      h2("作业列表"),
      createTable(
        ["字段", "说明"],
        [["名称", "作业名称"], ["命名空间", "所属命名空间"], ["状态", "当前状态"], ["创建时间", "作业创建时间"]]
      ),

      h2("作业状态"),
      createTable(
        ["状态", "说明"],
        [["Pending", "等待调度"], ["Running", "运行中"], ["Completed", "成功完成"],
         ["Failed", "执行失败"], ["Terminated", "已终止"]]
      ),

      h2("筛选和搜索"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("状态筛选"), normal("：按状态筛选作业")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("命名空间筛选"), normal("：按命名空间筛选")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("搜索"), normal("：按名称搜索")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 9: Usage Statistics
      h1("第九章 使用统计"),
      p("使用统计页面展示您的资源使用情况和历史记录。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["配额概览", "当前配额和使用情况"], ["使用趋势", "资源使用趋势图"], ["历史记录", "历史使用明细"]]
      ),

      h2("配额概览"),
      h3("资源配额"),
      createTable(
        ["资源", "说明"],
        [["CPU", "CPU 配额和已用量"], ["内存", "内存配额和已用量"], ["NPU", "NPU 配额和已用量"]]
      ),

      h2("使用趋势"),
      h3("时间范围"),
      p("可选择查看不同时间范围：今日、近 7 天、近 30 天"),
      h3("趋势图"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("CPU 使用趋势")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("内存使用趋势")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("NPU 使用趋势")] }),

      h2("历史记录"),
      createTable(
        ["字段", "说明"],
        [["时间", "使用时间"], ["资源类型", "CPU/内存/NPU"], ["使用量", "使用数量"], ["来源", "环境或任务"]]
      ),

      h2("优化建议"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("关注使用峰值"), normal("：了解资源使用高峰期")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("合理规划"), normal("：根据趋势规划资源需求")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("及时释放"), normal("：释放不使用的资源")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 10: Settings
      h1("第十章 设置"),
      p("设置页面用于管理您的账户信息和偏好设置。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["个人信息", "查看和修改个人信息"], ["修改密码", "更改登录密码"], ["偏好设置", "自定义界面设置"]]
      ),

      h2("个人信息"),
      h3("查看信息"),
      createTable(
        ["字段", "说明"],
        [["用户名", "登录用户名（不可修改）"], ["邮箱", "注册邮箱"],
         ["角色", "用户角色"], ["命名空间", "Kubernetes 命名空间"]]
      ),

      h2("修改密码"),
      h3("步骤"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("修改密码")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("输入旧密码")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("输入新密码")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("确认新密码")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("确认")] }),
      p("安全提示：使用强密码、定期更换密码、不要与他人共享密码"),

      h2("偏好设置"),
      createTable(
        ["设置", "说明"],
        [["主题", "浅色/深色主题"], ["语言", "界面语言"]]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 11: FAQ
      h1("第十一章 常见问题"),
      h2("环境相关"),
      h3("Q: Code Server 打开后显示密码错误？"),
      p("A: 请在环境详情页面查看正确的访问密码。"),

      h3("Q: 环境启动失败怎么办？"),
      p("A: 检查以下内容："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("配额是否充足（查看仪表盘）")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("资源配置是否在允许范围内")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("查看环境详情的错误信息")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("联系管理员获取帮助")] }),

      h3("Q: 环境自动停止了？"),
      p("A: 系统会在环境空闲超过设定时间后自动停止。如需继续使用："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("启动"), normal(" 按钮重新启动")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("考虑增加自动停止时间")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("定期访问环境更新访问时间")] }),

      h3("Q: 删除环境后数据还在吗？"),
      p("A: 是的。用户存储独立于环境，删除环境不会删除存储中的文件。"),

      h2("训练任务相关"),
      h3("Q: 任务一直处于 Pending 状态？"),
      p("A: 可能原因："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("集群资源不足"), normal(" - 等待其他任务释放资源")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("优先级较低"), normal(" - 被高优先级任务抢占")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("NPU 资源不足"), normal(" - 检查 NPU 配额和使用情况")] }),
      p("解决方案：降低资源配置、提高任务优先级、等待资源释放"),

      h3("Q: 训练任务失败如何排查？"),
      p("A: "),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("进入任务详情页")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("查看 "), bold("事件"), normal(" 了解失败原因")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("查看 "), bold("日志"), normal(" 检查运行日志")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("常见错误：")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("OOM（内存不足）：增加内存配置")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("镜像拉取失败：检查镜像地址")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("存储挂载失败：检查存储配额")] }),

      h3("Q: 如何查看训练输出？"),
      p("A: 训练输出保存在 /models/output 目录："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("在开发环境中打开此目录")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("或通过文件管理功能下载")] }),

      h2("存储相关"),
      h3("Q: 存储空间不足怎么办？"),
      p("A: "),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("清理不需要的文件")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("删除旧的模型检查点")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("联系管理员增加配额")] }),

      h3("Q: 如何在不同环境间共享文件？"),
      p("A: 所有环境共享同一个用户存储，直接访问对应路径即可。"),

      h2("配额相关"),
      h3("Q: 如何查看我的配额？"),
      p("A: "),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("查看仪表盘的配额概览")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("进入 "), bold("使用统计"), normal(" 页面查看详情")] }),

      h3("Q: 配额不足怎么办？"),
      p("A: "),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("停止不使用的环境")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("删除已完成的训练任务")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("清理存储空间")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("联系管理员申请增加配额")] }),

      h2("账户相关"),
      h3("Q: 忘记密码怎么办？"),
      p("A: 联系管理员重置密码。"),

      h3("Q: 如何修改密码？"),
      p("A: "),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击左侧菜单 "), bold("设置")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("修改密码")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("输入旧密码和新密码")] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/root/k8s-client/docs-site/output/LuoSS-用户指南.docx', buffer);
  console.log('用户指南已生成: /root/k8s-client/docs-site/output/LuoSS-用户指南.docx');
});
