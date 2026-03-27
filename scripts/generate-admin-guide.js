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
        children: [new TextRun({ text: "LuoSS 管理员指南", size: 20, font: "Microsoft YaHei", color: "666666" })]
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
        children: [new TextRun({ text: "管理员指南", bold: true, size: 48, font: "Microsoft YaHei" })]
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

      // Chapter 1: Cluster Monitoring
      h1("第一章 集群监控"),
      p("集群监控页面展示 Kubernetes 集群的整体状态和资源使用情况。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["节点列表", "查看所有节点状态"], ["资源概览", "集群资源使用情况"], ["节点详情", "单个节点详细信息"]]
      ),

      h2("节点列表"),
      createTable(
        ["字段", "说明"],
        [["节点名称", "Kubernetes 节点名"], ["状态", "Ready/NotReady"], ["CPU", "CPU 分配情况"],
         ["内存", "内存分配情况"], ["NPU", "NPU 分配情况"], ["Pod 数量", "节点上的 Pod 数"]]
      ),

      h2("资源概览"),
      h3("集群资源"),
      createTable(
        ["资源", "说明"],
        [["总 CPU", "集群 CPU 总量"], ["已分配 CPU", "已分配的 CPU"], ["总内存", "集群内存总量"],
         ["已分配内存", "已分配的内存"], ["总 NPU", "集群 NPU 总量"], ["已分配 NPU", "已分配的 NPU"]]
      ),

      h2("节点详情"),
      h3("基本信息"),
      createTable(
        ["信息", "说明"],
        [["节点名称", "节点标识"], ["状态", "运行状态"], ["内核版本", "OS 内核版本"],
         ["容器运行时", "Docker/containerd"], ["kubelet 版本", "Kubelet 版本"]]
      ),

      h3("资源信息"),
      createTable(
        ["资源", "容量", "已分配", "可用"],
        [["CPU", "-", "-", "-"], ["内存", "-", "-", "-"], ["NPU", "-", "-", "-"], ["Pod", "-", "-", "-"]]
      ),

      h2("监控指标"),
      createTable(
        ["指标", "说明", "告警阈值"],
        [["CPU 使用率", "节点 CPU 使用", "> 80%"], ["内存使用率", "节点内存使用", "> 85%"],
         ["磁盘使用率", "节点磁盘使用", "> 85%"], ["Pod 饱和度", "Pod 数/容量", "> 90%"]]
      ),

      h2("最佳实践"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("定期检查节点状态"), normal("：确保所有节点健康")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("关注资源使用"), normal("：及时扩容或释放资源")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("查看异常节点"), normal("：处理 NotReady 节点")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 2: Job History
      h1("第二章 作业历史"),
      p("作业历史页面展示已完成的训练作业历史记录（Completed、Failed、Terminated、Aborted 状态）。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["历史列表", "查看所有历史作业"], ["作业详情", "查看作业详细信息"],
         ["搜索筛选", "搜索和排序功能"], ["统计报表", "作业统计报表"]]
      ),

      h2("历史列表"),
      createTable(
        ["字段", "说明"],
        [["ID", "作业 ID"], ["任务名称", "作业标识"], ["用户", "所属用户"],
         ["命名空间", "K8s 命名空间"], ["NPU", "使用的 NPU 数量"], ["优先级", "任务优先级"],
         ["状态", "最终状态"], ["创建时间", "作业创建时间"]]
      ),

      h2("搜索和筛选"),
      h3("搜索功能"),
      p("在搜索框中输入关键词，支持搜索：任务名称、用户名、命名空间"),
      h3("排序功能"),
      createTable(
        ["列名", "排序方式"],
        [["ID", "数字排序"], ["任务名称", "字母排序"], ["用户", "字母排序"],
         ["命名空间", "字母排序"], ["NPU", "数字排序（支持多任务计算）"],
         ["优先级", "高 > 普通 > 低"], ["创建时间", "时间排序"]]
      ),

      h3("状态筛选"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("已完成 (Completed)"), normal("：成功完成")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("失败 (Failed)"), normal("：执行失败")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("已终止 (Terminated)"), normal("：用户手动终止")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("已中止 (Aborted)"), normal("：系统中止")] }),

      h2("统计报表"),
      createTable(
        ["指标", "说明"],
        [["总作业数", "历史作业总数"], ["已完成", "成功完成的作业数"],
         ["失败", "执行失败的作业数"], ["已终止", "用户终止的作业数"]]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 3: Active Jobs
      h1("第三章 实时作业"),
      p("实时作业页面展示当前正在运行的作业（Pending 和 Running 状态）。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["作业列表", "查看运行中的作业"], ["实时监控", "监控作业状态"],
         ["搜索筛选", "按名称、用户、命名空间搜索"], ["排序", "按各列排序"], ["资源使用", "查看资源消耗"]]
      ),

      h2("作业列表"),
      createTable(
        ["字段", "说明"],
        [["ID", "作业 ID"], ["作业名称", "作业标识"], ["用户", "所属用户"],
         ["命名空间", "K8s 命名空间"], ["镜像", "使用的容器镜像"], ["NPU", "NPU 数量"],
         ["优先级", "任务优先级"], ["状态", "当前状态"], ["创建时间", "作业创建时间"]]
      ),

      h2("实时监控"),
      h3("状态监控"),
      createTable(
        ["状态", "说明"],
        [["Running", "正常运行"], ["Pending", "等待资源"]]
      ),

      h3("资源监控"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("CPU 使用率")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("内存使用率")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("NPU 使用率")] }),

      h2("操作"),
      h3("强制停止"),
      p("如需强制停止作业："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("选择作业")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("停止"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("确认操作")] }),
      p("注意：强制停止可能导致数据丢失。"),

      h3("删除任务"),
      p("对于 Pending 状态的任务，可以删除："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("删除"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("确认操作")] }),

      h2("集群资源"),
      createTable(
        ["资源", "总量", "已用", "可用"],
        [["CPU", "-", "-", "-"], ["内存", "-", "-", "-"], ["NPU", "-", "-", "-"]]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 4: User Management
      h1("第四章 用户管理"),
      p("用户管理页面用于创建、编辑和管理平台用户。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["用户列表", "查看所有用户"], ["创建用户", "添加新用户"], ["编辑用户", "修改用户信息"],
         ["配额管理", "设置用户配额"], ["删除用户", "删除用户账户"]]
      ),

      h2("用户列表"),
      createTable(
        ["字段", "说明"],
        [["用户名", "登录用户名"], ["邮箱", "用户邮箱"], ["角色", "普通用户/管理员"],
         ["状态", "启用/禁用"], ["创建时间", "账户创建时间"]]
      ),

      h2("创建用户"),
      h3("步骤"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("添加用户"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("填写信息：")] }),
      createTable(
        ["字段", "必填", "说明"],
        [["用户名", "是", "唯一标识符"], ["密码", "是", "初始密码"],
         ["邮箱", "否", "用于通知"], ["管理员", "否", "是否为管理员"]]
      ),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("创建")] }),

      h3("命名空间创建"),
      p("创建用户时自动："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("创建 Kubernetes 命名空间 user-{username}")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("创建默认 ResourceQuota")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("初始化用户存储 PVC")] }),

      h2("配额管理"),
      h3("设置配额"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("设置配额")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("配置资源：")] }),
      createTable(
        ["资源", "单位", "说明"],
        [["CPU", "核", "CPU 配额"], ["内存", "Gi", "内存配额"], ["NPU", "卡", "NPU 配额"]]
      ),

      h3("配额模板"),
      createTable(
        ["用户类型", "CPU", "内存", "NPU"],
        [["普通用户", "4", "8 Gi", "0"], ["开发人员", "8", "16 Gi", "2"], ["算法工程师", "16", "32 Gi", "4"]]
      ),

      h2("禁用用户"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("禁用"), normal(" 按钮")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("确认操作")] }),
      p("禁用后：用户无法登录，已运行资源继续运行"),

      h2("删除用户"),
      p("危险操作：删除用户会："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("删除用户数据库记录")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("删除 Kubernetes 命名空间")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("删除所有资源和数据")] }),
      p("操作不可恢复！"),

      h3("删除步骤"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("确认用户已停止所有资源")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("删除")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("输入用户名确认")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("执行删除")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 5: Quota Management
      h1("第五章 配额管理"),
      p("配额管理页面用于设置和管理用户的资源配额。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["配额列表", "查看所有用户配额"], ["设置配额", "修改用户配额"], ["使用统计", "查看配额使用情况"]]
      ),

      h2("配额列表"),
      createTable(
        ["字段", "说明"],
        [["用户名", "用户标识"], ["CPU 配额", "CPU 总配额"], ["CPU 已用", "已使用 CPU"],
         ["内存配额", "内存总配额"], ["内存已用", "已使用内存"],
         ["NPU 配额", "NPU 总配额"], ["NPU 已用", "已使用 NPU"]]
      ),

      h2("设置配额"),
      h3("步骤"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("找到目标用户")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("设置配额")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("修改资源值：")] }),
      createTable(
        ["资源", "单位", "说明"],
        [["CPU", "核", "CPU 配额上限"], ["内存", "Gi", "内存配额上限"], ["NPU", "卡", "NPU 配额上限"]]
      ),

      h3("配额更新"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("增加配额"), normal("：立即生效")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("减少配额"), normal("：仅影响新资源")] }),

      h2("使用统计"),
      createTable(
        ["状态", "颜色", "使用率"],
        [["正常", "绿色", "< 70%"], ["警告", "黄色", "70-90%"], ["紧张", "红色", "> 90%"]]
      ),

      h2("配额策略"),
      h3("推荐配置"),
      createTable(
        ["用户类型", "CPU", "内存", "NPU"],
        [["普通用户", "4", "8", "0"], ["开发人员", "8", "16", "2"], ["算法工程师", "16", "32", "4-8"]]
      ),

      h3("动态调整"),
      p("根据使用情况动态调整："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("定期检查使用率")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("为活跃用户增加配额")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("回收长期不用的配额")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 6: Storage Management
      h1("第六章 存储管理"),
      p("存储管理页面用于管理用户的存储配额和使用情况。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["存储列表", "查看所有用户存储"], ["配额管理", "设置存储配额"], ["使用统计", "存储使用情况"]]
      ),

      h2("存储列表"),
      createTable(
        ["字段", "说明"],
        [["用户名", "用户标识"], ["PVC 名称", "持久卷声明名称"], ["配额", "存储配额"],
         ["已用", "已使用空间"], ["使用率", "使用百分比"], ["状态", "存储状态"]]
      ),

      h2("存储配额"),
      h3("设置配额"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("选择用户")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("设置配额")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("输入存储大小（Gi）")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("保存设置")] }),

      h3("配额调整"),
      createTable(
        ["操作", "说明"],
        [["增加配额", "需存储类支持扩容"], ["减少配额", "不支持，需删除重建"]]
      ),

      h2("使用统计"),
      createTable(
        ["指标", "说明"],
        [["总存储", "集群存储总量"], ["已分配", "已分配存储"], ["可用", "可用存储"]]
      ),

      h2("存储操作"),
      h3("清理存储"),
      p("如需清理用户存储："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("选择用户")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("清理")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("确认操作")] }),
      p("警告：清理操作会删除存储中的所有数据，不可恢复。"),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 7: Statistics
      h1("第七章 统计分析"),
      p("统计分析页面展示平台的整体使用统计和分析报表。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["使用概览", "整体使用情况"], ["趋势分析", "使用趋势图表"],
         ["用户排名", "用户使用排名"], ["报表导出", "导出统计报表"]]
      ),

      h2("使用概览"),
      h3("资源统计"),
      createTable(
        ["资源", "总量", "已用", "使用率"],
        [["CPU", "-", "-", "-"], ["内存", "-", "-", "-"], ["NPU", "-", "-", "-"], ["存储", "-", "-", "-"]]
      ),

      h3("用户统计"),
      createTable(
        ["指标", "数量"],
        [["总用户数", "-"], ["活跃用户", "-"], ["管理员数", "-"]]
      ),

      h3("作业统计"),
      createTable(
        ["指标", "数量"],
        [["总作业数", "-"], ["运行中", "-"], ["已完成", "-"], ["失败", "-"]]
      ),

      h2("趋势分析"),
      h3("时间范围"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("今日")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("近 7 天")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("近 30 天")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("自定义")] }),

      h3("趋势图表"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("CPU 使用趋势")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("内存使用趋势")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("NPU 使用趋势")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("作业数量趋势")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("用户活跃度趋势")] }),

      h2("报表导出"),
      h3("导出选项"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("选择时间范围")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("选择报表类型")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("选择格式（CSV/Excel）")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("点击 "), bold("导出")] }),

      h3("报表类型"),
      createTable(
        ["报表", "说明"],
        [["资源使用报表", "各资源使用详情"], ["作业统计报表", "作业执行统计"], ["用户活跃报表", "用户活跃度统计"]]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 8: Audit Log
      h1("第八章 审计日志"),
      p("审计日志页面记录平台的所有操作日志。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["日志列表", "查看所有操作日志"], ["日志搜索", "搜索特定操作"], ["日志导出", "导出日志文件"]]
      ),

      h2("日志列表"),
      createTable(
        ["字段", "说明"],
        [["时间", "操作时间"], ["用户", "操作用户"], ["操作", "操作类型"],
         ["资源", "操作的资源"], ["结果", "操作结果"], ["IP", "操作来源 IP"]]
      ),

      h2("操作类型"),
      createTable(
        ["类型", "说明"],
        [["登录", "用户登录"], ["登出", "用户登出"], ["创建", "创建资源"],
         ["更新", "更新资源"], ["删除", "删除资源"], ["启动", "启动资源"], ["停止", "停止资源"]]
      ),

      h2("筛选和搜索"),
      h3("筛选条件"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("时间范围"), normal("：选择时间段")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("用户"), normal("：按用户筛选")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("操作类型"), normal("：按操作筛选")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [bold("结果"), normal("：成功/失败")] }),

      h2("日志详情"),
      p("点击日志条目可查看详细信息："),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("操作时间")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("操作用户")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("操作详情")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("请求参数")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("响应结果")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 9: Queue Management
      h1("第九章 队列管理"),
      p("队列管理页面用于管理 Volcano 调度队列。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["队列列表", "查看所有队列"], ["队列详情", "查看队列配置"],
         ["创建/编辑", "创建和编辑队列"], ["删除队列", "删除不需要的队列"]]
      ),

      h2("队列列表"),
      createTable(
        ["字段", "说明"],
        [["队列名称", "队列标识"], ["状态", "队列状态"], ["权重", "调度权重"],
         ["能力", "资源能力"], ["已分配", "已分配资源"]]
      ),

      h2("队列详情"),
      h3("基本信息"),
      createTable(
        ["信息", "说明"],
        [["名称", "队列名称"], ["状态", "Open/Closed"], ["权重", "调度权重"], ["优先级", "队列优先级"]]
      ),

      h3("资源配置"),
      createTable(
        ["资源", "配置"],
        [["CPU", "可用 CPU"], ["内存", "可用内存"], ["NPU", "可用 NPU"]]
      ),

      h2("队列层级关系"),
      p("系统支持层级队列管理："),
      p("root"),
      p("├── debug (调试池)"),
      p("│   └── debug-sub"),
      p("└── compute (计算池)"),
      p("    ├── user-alice-compute"),
      p("    ├── user-bob-compute"),
      p("    └── ..."),

      h3("父子队列约束"),
      p("重要约束："),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("子队列资源不能超过父队列"), normal("：子队列的 Deserved 和 Capability 不能超过父队列的限制")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("所有子队列资源总和不能超过父队列"), normal("：多个子队列的资源配额总和不能超过父队列的配额")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [bold("父队列必须存在"), normal("：设置父队列前，请确保父队列已创建")] }),

      h2("创建/编辑队列"),
      h3("基础配置"),
      createTable(
        ["字段", "说明", "限制"],
        [["队列名称", "队列唯一标识", "创建后不可修改"],
         ["父队列", "父队列名称", "创建后不可修改"],
         ["权重", "调度权重", "1-65535"],
         ["优先级", "队列优先级", "0-1000000"],
         ["可回收", "资源是否可被回收", "开启/关闭"]]
      ),

      h3("资源配额"),
      createTable(
        ["资源", "格式", "示例"],
        [["CPU", "核数", "8, 16, 32"], ["内存", "Gi", "32Gi, 64Gi"], ["NPU", "数量", "8, 16, 32"]]
      ),

      h2("常见错误"),
      h3("队列配置冲突"),
      createTable(
        ["错误原因", "解决方法"],
        [["子队列资源超过父队列", "降低子队列资源配额，或增加父队列配额"],
         ["所有子队列总和超过父队列", "重新分配各子队列的资源配额"],
         ["父队列不存在", "先创建父队列，再创建子队列"]]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 10: Preemption Events
      h1("第十章 抢占事件"),
      p("抢占事件页面记录任务被抢占的历史事件。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["事件列表", "查看抢占事件"], ["事件详情", "查看事件详情"], ["统计分析", "抢占统计"]]
      ),

      h2("事件列表"),
      createTable(
        ["字段", "说明"],
        [["时间", "事件时间"], ["被抢占任务", "被抢占的任务"], ["抢占者", "发起抢占的任务"],
         ["原因", "抢占原因"], ["资源", "涉及的资源"]]
      ),

      h2("抢占原因"),
      createTable(
        ["原因", "说明"],
        [["优先级抢占", "高优先级任务抢占"], ["资源不足", "集群资源不足"], ["配额限制", "超出配额限制"]]
      ),

      h2("统计分析"),
      h3("抢占趋势"),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("抢占事件数量趋势")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("按用户统计")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("按队列统计")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 11: Queue Pool
      h1("第十一章 队列资源池"),
      p("队列资源池页面用于管理队列的资源分配。"),
      h2("功能概述"),
      createTable(
        ["功能", "说明"],
        [["资源池概览", "查看资源池状态"], ["资源分配", "管理资源分配"], ["容量管理", "调整队列容量"]]
      ),

      h2("资源池概览"),
      h3("总资源"),
      createTable(
        ["资源", "总量", "已分配", "可用"],
        [["CPU", "-", "-", "-"], ["内存", "-", "-", "-"], ["NPU", "-", "-", "-"]]
      ),

      h3("队列分配"),
      createTable(
        ["队列", "CPU", "内存", "NPU", "比例"],
        [["high", "-", "-", "-", "-"], ["default", "-", "-", "-", "-"], ["low", "-", "-", "-", "-"]]
      ),

      h2("资源分配"),
      h3("调整分配"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("选择队列")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("修改资源配额")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("保存更改")] }),

      h3("分配策略"),
      createTable(
        ["策略", "说明"],
        [["固定分配", "固定资源量"], ["按比例", "按百分比分配"], ["动态调整", "根据负载调整"]]
      ),

      h2("容量管理"),
      h3("容量限制"),
      createTable(
        ["队列", "最小", "最大", "当前"],
        [["high", "-", "-", "-"], ["default", "-", "-", "-"], ["low", "-", "-", "-"]]
      ),

      h3("超配设置"),
      p("允许队列超配以提高资源利用率："),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("超配比例设置")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 },
        children: [normal("超配警告阈值")] }),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 12: Deployment
      h1("第十二章 部署安装"),
      p("本文档介绍平台的部署和安装。"),
      h2("系统要求"),
      h3("Kubernetes 集群"),
      createTable(
        ["要求", "说明"],
        [["Kubernetes 版本", "1.24+"], ["节点数量", "至少 3 个工作节点"], ["存储类", "支持动态 Provisioning"]]
      ),

      h3("硬件要求"),
      createTable(
        ["组件", "最低要求", "推荐配置"],
        [["CPU", "4 核", "8+ 核"], ["内存", "8 Gi", "16+ Gi"], ["存储", "100 Gi", "500+ Gi"]]
      ),

      h2("快速部署"),
      p("cd backend/deploy/helm/k8s-tenant-platform"),
      p("DEPLOY_POSTGRESQL=true \\"),
      p("IMAGE_TAG=v5.0.1 \\"),
      p("./deploy.sh"),

      h2("验证部署"),
      p("kubectl get pods -n k8s-tenant"),

      h2("升级指南"),
      p("重要：切勿使用 helm uninstall，这会删除 PVC 导致数据丢失！"),
      p("IMAGE_TAG=v5.0.2 ./deploy.sh"),

      h2("数据备份"),
      p("./backend/scripts/backup_postgresql.sh"),
      new Paragraph({ children: [new PageBreak()] }),

      // Chapter 13: Troubleshooting
      h1("第十三章 故障排查"),
      p("本文档提供常见问题的诊断和解决方案。"),
      h2("诊断工具"),
      p("# PostgreSQL 持久化诊断"),
      p("./backend/scripts/diagnose_postgresql_persistence.sh"),
      p("# 指标收集诊断"),
      p("./backend/scripts/diagnose_metrics.sh"),
      p("# 自动停止功能诊断"),
      p("./backend/scripts/diagnose_autostop.sh"),

      h2("常见问题"),
      h3("用户无法登录"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("检查用户状态是否被禁用")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("检查后端日志")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("检查数据库连接")] }),

      h3("环境启动失败"),
      p("kubectl get pods -n user-<username>"),
      p("kubectl describe pod codeserver-<env-id> -n user-<username>"),
      createTable(
        ["原因", "解决方案"],
        [["资源不足", "增加配额或释放资源"], ["镜像拉取失败", "检查镜像地址"], ["存储挂载失败", "检查 PVC"]]
      ),

      h3("任务一直 Pending"),
      p("kubectl describe vcjob <job-name> -n user-<username>"),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("检查集群资源")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("检查任务优先级")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 },
        children: [normal("检查 NPU 资源")] }),

      h3("存储挂载失败"),
      p("kubectl get pvc -n user-<username>"),
      p("kubectl get pv"),

      h2("日志查看"),
      p("# 后端日志"),
      p("kubectl logs deployment/k8s-tenant-platform-backend -n k8s-tenant"),
      p("# PostgreSQL 日志"),
      p("kubectl logs statefulset/k8s-tenant-postgresql -n k8s-tenant"),

      h2("数据恢复"),
      p("./backend/scripts/restore_postgresql.sh ./backups/k8s_tenant_backup.sql.gz"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/root/k8s-client/docs-site/output/LuoSS-管理员指南.docx', buffer);
  console.log('管理员指南已生成: /root/k8s-client/docs-site/output/LuoSS-管理员指南.docx');
});
