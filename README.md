# LuoSS 文档

LuoSS 络书算衡 - 企业级 Kubernetes 多租户管理平台文档网站。

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Mermaid](https://mermaid.js.org/) - 图表支持

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览构建结果
npm run docs:preview
```

## 目录结构

```
docs/
├── guide/          # 用户指南
├── admin/          # 管理员指南
├── quickstart/     # 快速开始
├── public/         # 静态资源
└── .vitepress/     # VitePress 配置
    └── config.mts  # 主配置文件
```

## License

MIT
