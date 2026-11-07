# Change Tracking Skill

一个 Kiro IDE 留痕技能，在代码修改或 Bug 修复完成后自动生成结构化的变更记录文档，便于追溯和交接。

## ✨ 功能特性

- 🔄 **自动触发**：代码修改后询问、用户确认后自动生成、Git Push 后自动生成
- 📝 **详细记录**：记录修改原因、涉及代码、踩坑经历、影响分析
- 🔍 **误判追踪**：记录每一次误判误改及其原因分析
- 🏷️ **智能标签**：自动推荐标签和变更类型分类
- 📊 **影响分析**：记录接口变更、数据结构变更、受影响模块
- 💾 **持久化存储**：Markdown 格式存储到 `docs/change-logs/`

## 📋 变更记录包含

| 章节 | 内容 |
|------|------|
| 元信息 | ID、时间戳、Git 分支、Commit Hash、变更类型、严重程度、标签 |
| 变更内容 | 概要、详细描述、修改文件列表、具体改动及原因 |
| 根因分析 | 问题症状、根本原因（仅 Bug 修复） |
| 踩坑记录 | 阻塞问题、误判记录、误改记录及原因分析 |
| 影响分析 | 接口变更、数据结构变更、受影响模块 |
| 代码差异 | 关键代码变更、批量变更摘要、Commit 链接 |

## 🚀 快速开始

### 安装

1. 将 `.kiro` 目录复制到你的项目根目录
2. 在 Kiro IDE 中打开项目
3. Skill 会自动激活

### 触发方式

**方式一：代码修改后询问**
- 当你完成代码修改后，系统会询问是否需要生成变更记录

**方式二：用户确认后自动生成**
- 当你在对话中确认"修改完成"、"好的"、"成功了"等，系统会自动生成

**方式三：Git Push 后自动生成**
- 当你通过 AI 执行 `git push` 命令后，系统会自动生成

**方式四：手动触发**
```
请为刚才的修改生成变更记录
```

### 存储位置

变更记录保存在：
```
docs/change-logs/YYYY-MM-DD_HHmmss_简短描述.md
```

## 📁 目录结构

```
.kiro/
├── hooks/                                    # Hook 配置
│   ├── change-tracking-code-modification.json
│   ├── change-tracking-user-confirmation.json
│   └── change-tracking-git-push.json
├── skills/
│   └── change-tracking/                      # Skill 核心
│       ├── skill.md                          # 入口文件
│       ├── types/
│       │   └── index.ts                      # 类型定义
│       └── prompts/                          # Agent 提示
│           ├── change-tracker.md
│           ├── git-collector.md
│           ├── document-generator.md
│           ├── document-template.md
│           └── persistence-service.md
├── steering/
│   └── change-tracking.md                    # 最佳实践指南
└── specs/
    └── change-tracking-skill/                # 需求和设计文档
        ├── requirements.md
        ├── design.md
        └── tasks.md
```

## 📖 文档

- [需求文档](.kiro/specs/change-tracking-skill/requirements.md)
- [技术设计](.kiro/specs/change-tracking-skill/design.md)
- [任务列表](.kiro/specs/change-tracking-skill/tasks.md)
- [最佳实践](.kiro/steering/change-tracking.md)

## 🔧 配置说明

### 变更类型

- Bug修复
- 新功能
- 重构
- 性能优化
- 配置变更
- 文档更新
- 依赖升级

### 严重程度（仅 Bug 修复）

- `high`：系统崩溃、数据丢失、安全漏洞
- `medium`：功能异常但可绕过
- `low`：界面显示问题、边缘情况

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
