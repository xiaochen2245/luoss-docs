/**
 * Generate Word documents from VitePress markdown files
 * 生成用户指南和管理员指南两个 Word 文档
 */

const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, List, ListItem, LevelFormat } = require('docx');
const fs = require('fs');
const path = require('path');

// 用户指南章节配置
const userGuideOutline = [
  {
    title: '开始使用',
    items: [
      { text: '概述', file: 'docs/guide/overview.md' },
      { text: '快速开始', file: 'docs/guide/getting-started.md' },
    ],
  },
  {
    title: '功能指南',
    items: [
      { text: '仪表盘', file: 'docs/guide/dashboard.md' },
      { text: '开发环境', file: 'docs/guide/environments.md' },
      { text: '训练任务', file: 'docs/guide/training-jobs.md' },
      { text: '数据存储', file: 'docs/guide/model-manager.md' },
      { text: '镜像存储', file: 'docs/guide/image-storage.md' },
      { text: '我的作业', file: 'docs/guide/volcano-jobs.md' },
      { text: '使用统计', file: 'docs/guide/my-usage.md' },
      { text: '设置', file: 'docs/guide/settings.md' },
    ],
  },
  {
    title: '帮助',
    items: [
      { text: '常见问题', file: 'docs/guide/faq.md' },
    ],
  },
];

// 管理员指南章节配置
const adminGuideOutline = [
  {
    title: '管理指南',
    items: [
      { text: '集群监控', file: 'docs/admin/cluster.md' },
      { text: '作业历史', file: 'docs/admin/job-history.md' },
      { text: '实时作业', file: 'docs/admin/job-active.md' },
      { text: '用户管理', file: 'docs/admin/users.md' },
      { text: '配额管理', file: 'docs/admin/quotas.md' },
      { text: '存储管理', file: 'docs/admin/storage.md' },
      { text: '统计分析', file: 'docs/admin/statistics.md' },
      { text: '审计日志', file: 'docs/admin/audit.md' },
      { text: '队列管理', file: 'docs/admin/queues.md' },
      { text: '抢占事件', file: 'docs/admin/preemption.md' },
      { text: '队列资源池', file: 'docs/admin/queue-pool.md' },
    ],
  },
  {
    title: '运维指南',
    items: [
      { text: '故障排查', file: 'docs/admin/troubleshooting.md' },
    ],
  },
];

/**
 * 解析 Markdown 内容为文档元素
 */
function parseMarkdown(content, basePath) {
  const elements = [];
  const lines = content.split('\n');

  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';
  let inTable = false;
  let tableRows = [];
  let inList = false;
  let listItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 代码块处理
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        codeContent = '';
      } else {
        inCodeBlock = false;
        if (codeContent.trim()) {
          elements.push(new Paragraph({
            children: [
              new TextRun({
                text: codeContent.trim(),
                font: 'Consolas',
                size: 20,
              }),
            ],
            style: 'Code',
            shading: { fill: 'F5F5F5' },
          }));
        }
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // 表格处理
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      // 跳过分隔行
      if (!line.match(/^\|[-:\s|]+\|$/)) {
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      inTable = false;
      if (tableRows.length > 0) {
        elements.push(createTable(tableRows));
        tableRows = [];
      }
    }

    // 列表处理
    if (line.match(/^(\*|-|\d+\.)\s/)) {
      inList = true;
      const text = line.replace(/^(\*|-|\d+\.)\s/, '').replace(/\*\*(.+?)\*\*/g, '$1');
      listItems.push(text);
      continue;
    } else if (inList && line.trim() === '') {
      inList = false;
      if (listItems.length > 0) {
        listItems.forEach(item => {
          elements.push(new Paragraph({
            children: [
              new TextRun({ text: `• ${item}`, size: 22 }),
            ],
            indent: { left: 360 },
          }));
        });
        listItems = [];
      }
    }

    // 空行
    if (line.trim() === '') {
      elements.push(new Paragraph({ children: [] }));
      continue;
    }

    // 标题处理
    if (line.startsWith('# ')) {
      elements.push(new Paragraph({
        children: [new TextRun({ text: line.slice(2), bold: true, size: 32 })],
        heading: HeadingLevel.HEADING_1,
      }));
    } else if (line.startsWith('## ')) {
      elements.push(new Paragraph({
        children: [new TextRun({ text: line.slice(3), bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
      }));
    } else if (line.startsWith('### ')) {
      elements.push(new Paragraph({
        children: [new TextRun({ text: line.slice(4), bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_3,
      }));
    } else if (line.startsWith('#### ')) {
      elements.push(new Paragraph({
        children: [new TextRun({ text: line.slice(5), bold: true, size: 22 })],
        heading: HeadingLevel.HEADING_4,
      }));
    }
    // 提示框处理
    else if (line.match(/^:::(tip|info|warning|danger)/)) {
      const type = line.match(/:::(\w+)/)[1];
      const labels = { tip: '提示', info: '信息', warning: '警告', danger: '危险' };
      elements.push(new Paragraph({
        children: [new TextRun({ text: `【${labels[type] || type}】`, bold: true, color: type === 'warning' || type === 'danger' ? 'FF0000' : '1890FF' })],
      }));
    } else if (line === ':::') {
      elements.push(new Paragraph({ children: [] }));
    }
    // 普通段落
    else {
      // 移除 Markdown 格式
      let text = line
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1');

      elements.push(new Paragraph({
        children: [new TextRun({ text, size: 22 })],
      }));
    }
  }

  // 处理剩余的表格
  if (inTable && tableRows.length > 0) {
    elements.push(createTable(tableRows));
  }

  // 处理剩余的列表
  if (listItems.length > 0) {
    listItems.forEach(item => {
      elements.push(new Paragraph({
        children: [new TextRun({ text: `• ${item}`, size: 22 })],
        indent: { left: 360 },
      }));
    });
  }

  return elements;
}

/**
 * 创建表格
 */
function createTable(rows) {
  if (rows.length === 0) return new Paragraph({ children: [] });

  const numCols = Math.max(...rows.map(r => r.length));
  const tableRows = rows.map((row, rowIndex) => {
    const cells = Array(numCols).fill('').map((_, colIndex) => {
      const text = row[colIndex] || '';
      return new TableCell({
        children: [new Paragraph({
          children: [new TextRun({
            text,
            bold: rowIndex === 0,
            size: 20,
          })],
        })],
        shading: rowIndex === 0 ? { fill: 'E8E8E8' } : undefined,
      });
    });
    return new TableRow({ children: cells });
  });

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

/**
 * 生成文档
 */
async function generateDocument(title, outline, outputPath) {
  const children = [];

  // 封面标题
  children.push(new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: 56 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
  }));

  // 副标题
  children.push(new Paragraph({
    children: [new TextRun({ text: 'LuoSS 络书算衡 - K8s 租户管理平台', size: 28, color: '666666' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }));

  // 版本信息
  children.push(new Paragraph({
    children: [new TextRun({ text: `版本: ${new Date().toISOString().split('T')[0]}`, size: 22, color: '999999' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
  }));

  // 目录
  children.push(new Paragraph({
    children: [new TextRun({ text: '目录', bold: true, size: 32 })],
    heading: HeadingLevel.HEADING_1,
    spacing: { after: 200 },
  }));

  // 生成目录
  outline.forEach(section => {
    children.push(new Paragraph({
      children: [new TextRun({ text: section.title, bold: true, size: 24 })],
      spacing: { before: 200, after: 100 },
    }));
    section.items.forEach(item => {
      children.push(new Paragraph({
        children: [new TextRun({ text: `  ${item.text}`, size: 22 })],
      }));
    });
  });

  children.push(new Paragraph({ children: [], spacing: { after: 400 } }));
  children.push(new Paragraph({
    children: [new TextRun({ text: '─'.repeat(50), color: 'CCCCCC' })],
    alignment: AlignmentType.CENTER,
  }));
  children.push(new Paragraph({ children: [], spacing: { after: 400 } }));

  // 处理每个章节
  for (const section of outline) {
    // 章节标题
    children.push(new Paragraph({
      children: [new TextRun({ text: section.title, bold: true, size: 32 })],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }));

    for (const item of section.items) {
      const filePath = path.join(__dirname, '..', item.file);
      if (fs.existsSync(filePath)) {
        console.log(`Processing: ${item.file}`);
        const content = fs.readFileSync(filePath, 'utf-8');

        // 添加小节标题
        children.push(new Paragraph({
          children: [new TextRun({ text: item.text, bold: true, size: 28 })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        }));

        // 解析并添加内容
        const elements = parseMarkdown(content, path.dirname(filePath));
        children.push(...elements);

        // 分隔
        children.push(new Paragraph({ children: [], spacing: { after: 200 } }));
      } else {
        console.log(`File not found: ${filePath}`);
        children.push(new Paragraph({
          children: [new TextRun({ text: `[待补充] ${item.text}`, italics: true, color: '999999' })],
          spacing: { after: 100 },
        }));
      }
    }
  }

  // 创建文档
  const doc = new Document({
    sections: [{
      properties: {},
      children,
    }],
  });

  // 生成文件
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

// 主函数
async function main() {
  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating User Guide...');
  await generateDocument(
    '用户指南',
    userGuideOutline,
    path.join(outputDir, 'LuoSS-用户指南.docx')
  );

  console.log('\nGenerating Admin Guide...');
  await generateDocument(
    '管理员指南',
    adminGuideOutline,
    path.join(outputDir, 'LuoSS-管理员指南.docx')
  );

  console.log('\nDone! Files generated in docs-site/output/');
}

main().catch(console.error);
