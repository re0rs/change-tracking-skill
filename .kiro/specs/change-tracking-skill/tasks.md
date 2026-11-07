# Implementation Plan: Change Tracking Skill

## Overview

基于 Kiro Skill 架构实现变更追踪系统，通过 Hook 机制自动化变更记录的生成和持久化。系统采用 TypeScript 实现，使用事件驱动架构，包含 Hook 配置、核心控制器、Git 信息收集、文档生成和持久化存储五个主要模块。

## Tasks

- [x] 1. 项目结构搭建与基础配置
  - [x] 1.1 创建 Skill 目录结构和入口文件
    - 创建 `.kiro/skills/change-tracking/` 目录
    - 创建 `skill.md` 入口文件，定义 Skill 元信息和激活指令
    - 创建 `prompts/` 目录用于存放 Agent 提示模板
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 创建 TypeScript 类型定义文件
    - 创建 `types/` 目录
    - 定义 `ChangeRecord` 接口及相关类型（ChangeType, Severity, ChangedFileDetail 等）
    - 定义 `TriggerContext` 接口
    - 定义 `CommitInfo`, `CommitRange`, `ChangedFile`, `FileDiff` 等 Git 相关类型
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Hook 配置实现
  - [x] 2.1 创建代码修改追踪 Hook 配置
    - 创建 `.kiro/hooks/change-tracking-code-modification.json`
    - 配置 `PostToolUse` 触发器，matcher 匹配 `fs_write|str_replace|fs_append`
    - 配置 agent action，提示询问用户是否生成变更记录
    - _Requirements: 1.1, 1.4_

  - [x] 2.2 创建用户确认追踪 Hook 配置
    - 创建 `.kiro/hooks/change-tracking-user-confirmation.json`
    - 配置 `UserPromptSubmit` 触发器
    - 配置 agent action，检测用户确认意图并自动生成变更记录
    - _Requirements: 1.2_

  - [x] 2.3 创建终端 Git Push 检测 Hook 配置
    - 创建 `.kiro/hooks/change-tracking-git-push.json`
    - 配置 `PostToolUse` 触发器，matcher 匹配 `execute_pwsh|execute_bash`
    - 配置 agent action，检测 git push 命令并触发变更记录生成
    - _Requirements: 1.3_

- [x] 3. Checkpoint - 确保 Hook 配置正确
  - 确保所有 Hook 配置文件格式正确，ask the user if questions arise.

- [x] 4. 核心组件实现 - GitCollector
  - [x] 4.1 实现 GitCollector 模块
    - 创建 `prompts/git-collector.md` Agent 提示文件
    - 实现 `getCurrentBranch()` 逻辑：执行 `git rev-parse --abbrev-ref HEAD`
    - 实现 `getRecentCommits()` 逻辑：执行 `git log --oneline -n {count}`
    - 实现 `getCommitRange()` 逻辑：执行 `git log --oneline {from}..{to}`
    - 实现 `getChangedFiles()` 逻辑：执行 `git diff --name-status {commit}`
    - 实现 `isGitRepository()` 逻辑：执行 `git rev-parse --is-inside-work-tree`
    - 定义错误处理：Git 命令失败时返回 null 或空数组
    - _Requirements: 1.6, 1.7, 1.8, 1.9, 1.10_

  - [ ]* 4.2 编写 GitCollector 单元测试
    - 测试各 Git 命令的正确执行
    - 测试非 Git 目录的错误处理
    - 测试 Git 信息不可用时的降级处理
    - _Requirements: 1.7, 1.10_

- [x] 5. 核心组件实现 - DocumentGenerator
  - [x] 5.1 实现变更记录文档模板
    - 创建 `prompts/document-template.md` 文档模板
    - 包含元信息区域：ID、创建时间、完成时间、分支、Commit、类型、严重程度、标签
    - 包含变更概要章节
    - 包含详细描述章节
    - 包含修改文件列表章节
    - 包含具体改动章节（位置、改动、原因）
    - 包含根因分析章节（仅 Bug 修复）
    - 包含踩坑记录章节
    - 包含影响分析章节
    - 包含代码差异章节
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 5.2 实现 DocumentGenerator Agent 提示
    - 创建 `prompts/document-generator.md` Agent 提示文件
    - 实现 `generate()` 逻辑：基于 ChangeRecord 填充模板生成 Markdown
    - 实现 `extractShortDescription()` 逻辑：从变更概要提取 2-4 个中文词或 3-5 个英文单词
    - 实现 `generateFileName()` 逻辑：格式 YYYY-MM-DD_HHmmss_简短描述.md
    - 实现 `suggestTags()` 逻辑：根据变更内容推荐标签
    - 实现 `assessSeverity()` 逻辑：评估 Bug 严重程度
    - _Requirements: 2.1, 6.2, 6.3, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_

  - [ ]* 5.3 编写 DocumentGenerator 单元测试
    - 测试各种 ChangeRecord 输入生成正确的 Markdown 格式
    - 测试 extractShortDescription 对中英文输入的处理
    - 测试 generateFileName 格式正确性
    - 测试 suggestTags 对不同变更类型的推荐
    - _Requirements: 6.2, 6.3, 8.2_

- [x] 6. 核心组件实现 - PersistenceService
  - [x] 6.1 实现 PersistenceService Agent 提示
    - 创建 `prompts/persistence-service.md` Agent 提示文件
    - 实现 `save()` 逻辑：将文档内容写入指定路径
    - 实现 `ensureDirectory()` 逻辑：创建 `docs/change-logs/` 目录
    - 实现 `getStorageDirectory()` 逻辑：返回存储目录路径
    - 定义错误处理：权限不足、磁盘满等情况的处理
    - _Requirements: 6.1, 6.4, 6.5, 6.6_

  - [ ]* 6.2 编写 PersistenceService 单元测试
    - 测试目录创建功能
    - 测试文件写入功能
    - 测试错误处理（权限不足等）
    - _Requirements: 6.5, 6.6_

- [x] 7. Checkpoint - 确保核心组件实现正确
  - 确保所有 Agent 提示文件格式正确，ask the user if questions arise.

- [x] 8. 核心组件实现 - ChangeTracker 控制器
  - [x] 8.1 实现 ChangeTracker 主控制流程
    - 创建 `prompts/change-tracker.md` Agent 提示文件
    - 实现 `shouldTrack()` 逻辑：判断是否应触发变更追踪
    - 实现 `promptForConfirmation()` 逻辑：询问用户是否生成变更记录
    - 实现 `track()` 逻辑：协调 GitCollector、DocumentGenerator、PersistenceService
    - 定义终止条件：用户拒绝或跳过时终止流程
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 8.2 实现变更内容收集逻辑
    - 扩展 `prompts/change-tracker.md`
    - 实现从 Agent 上下文收集修改文件信息
    - 实现变更类型自动识别（Bug修复、新功能、重构等）
    - 实现具体改动点收集（文件路径、修改位置、改动内容、修改原因）
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.3, 8.4_

  - [x] 8.3 实现根因分析与踩坑记录收集
    - 扩展 `prompts/change-tracker.md`
    - 实现 Bug 修复场景的根因分析收集（症状、根本原因）
    - 实现踩坑记录收集（阻塞问题、误判、误改）
    - 实现非 Bug 修复场景省略根因分析章节
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 8.4 实现影响分析与代码差异收集
    - 扩展 `prompts/change-tracker.md`
    - 实现接口变更检测和描述
    - 实现数据结构变更检测和描述
    - 实现受影响模块识别
    - 实现关键代码差异收集（核心逻辑、接口、算法）
    - 实现批量变更摘要统计
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11_

  - [ ]* 8.5 编写 ChangeTracker 单元测试
    - 测试 shouldTrack 对不同 TriggerContext 的判断
    - 测试用户确认/拒绝后的流程控制
    - 测试变更类型识别准确性
    - _Requirements: 1.1, 1.4, 8.4_

- [x] 9. Skill 入口文件整合
  - [x] 9.1 完善 skill.md 入口文件
    - 整合所有 Agent 提示模块
    - 定义 Skill 激活条件和使用说明
    - 定义 Skill 工作流程概述
    - 添加示例用法和常见场景说明
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 9.2 创建 Steering 文件
    - 创建 `.kiro/steering/change-tracking.md` Steering 文件
    - 定义变更追踪的最佳实践指南
    - 定义文档质量标准
    - 定义常见问题处理指南
    - _Requirements: 7.1, 7.4_

- [ ] 10. 集成测试
  - [ ]* 10.1 编写端到端集成测试
    - 测试完整的变更追踪流程：代码修改 → 用户确认 → 文档生成 → 持久化
    - 测试 Git 信息不可用时的降级处理
    - 测试持久化失败时的错误提示
    - 验证生成的文档内容完整性
    - _Requirements: 1.1, 1.2, 1.7, 1.10, 6.6_

  - [ ]* 10.2 编写 Hook 触发测试
    - 测试代码修改 Hook 正确触发
    - 测试用户确认 Hook 正确触发
    - 测试 Git Push 检测 Hook 正确触发
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 11. Final Checkpoint - 确保所有测试通过
  - 确保所有测试通过，ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- 本 Skill 主要通过 Agent 提示文件实现，而非传统的 TypeScript 代码库
- Hook 配置使用 JSON 格式，遵循 Kiro Hook v1 规范
- Git 命令通过 Agent 调用 execute_pwsh/execute_bash 工具执行
- 文档生成和持久化通过 Agent 调用 fs_write 工具执行

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["4.1", "5.1"] },
    { "id": 3, "tasks": ["4.2", "5.2", "6.1"] },
    { "id": 4, "tasks": ["5.3", "6.2"] },
    { "id": 5, "tasks": ["8.1"] },
    { "id": 6, "tasks": ["8.2", "8.3", "8.4"] },
    { "id": 7, "tasks": ["8.5", "9.1", "9.2"] },
    { "id": 8, "tasks": ["10.1", "10.2"] }
  ]
}
```
