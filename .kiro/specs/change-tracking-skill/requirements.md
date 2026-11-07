# Requirements Document

## Introduction

Change Tracking Skill 是一个自动化变更记录系统，用于在每次代码修改或 Bug 修复完成后，自动生成并持久化一份结构化的变更记录文档。该系统旨在提升团队协作效率，便于问题追溯，并帮助后续开发人员快速了解项目的修改历史。

## Glossary

- **Change_Record**: 变更记录文档，包含一次代码修改的完整信息
- **Change_Tracker**: 变更追踪系统，负责收集、生成和持久化变更记录
- **Code_Change**: 代码变更，包括新功能开发、Bug 修复、重构等对代码库的修改
- **Impact_Analysis**: 影响分析，描述代码变更对系统其他部分的影响
- **Root_Cause**: 根因分析，对 Bug 或问题产生原因的深入分析
- **Pitfall**: 踩坑记录，开发过程中遇到的问题及其解决方案
- **Git_Branch**: 代码修改所基于的 Git 分支名称
- **Git_Commit_Hash**: Git 提交的唯一标识符（SHA-1 哈希值）
- **Commit_Range**: 提交范围，表示一系列连续提交的起始和结束 commit hash
- **Tags**: 自定义标签，用于分类和检索变更记录的关键词集合
- **Change_Type**: 变更类型，对代码修改性质的分类（如 Bug修复、新功能、重构等）
- **Severity**: 严重程度，用于评估 Bug 修复的紧急性和影响级别（high/medium/low）

## Requirements

### Requirement 1: 变更记录触发与生成

**User Story:** As a 开发人员, I want 系统在合适的时机提示或自动生成变更记录, so that 我无需手动编写文档即可保留完整的修改历史

#### Acceptance Criteria

1. WHEN 代码修改工作完成, THE Change_Tracker SHALL 询问用户是否需要生成 Change_Record 文档
2. WHEN 用户明确确认修改成功, THE Change_Tracker SHALL 自动生成 Change_Record 文档
3. WHEN 检测到用户执行 git push 操作, THE Change_Tracker SHALL 自动生成 Change_Record 文档
4. WHEN 用户选择跳过或拒绝生成变更记录, THE Change_Tracker SHALL 终止本次记录生成流程并不再重复询问
5. THE Change_Record SHALL 包含唯一标识符和创建时间戳
6. WHEN 生成 Change_Record 时, THE Change_Tracker SHALL 记录当前 Git_Branch 名称
7. IF 无法获取 Git_Branch 信息, THEN THE Change_Tracker SHALL 在 Change_Record 中标注"分支信息不可用"
8. WHEN 生成 Change_Record 时, THE Change_Tracker SHALL 记录相关的 Git_Commit_Hash
9. WHEN 本次变更涉及多个 commit, THE Change_Tracker SHALL 记录完整的 Commit_Range（起始 commit 到结束 commit）
10. IF 无法获取 Git_Commit_Hash 信息, THEN THE Change_Tracker SHALL 在 Change_Record 中标注"Commit 信息不可用"

### Requirement 2: 变更内容详细记录

**User Story:** As a 开发人员, I want 变更记录详细描述所有修改内容, so that 我和团队成员能够清晰了解每次修改的具体内容

#### Acceptance Criteria

1. THE Change_Record SHALL 包含变更的详细描述，说明本次修改的目的和内容概要
2. THE Change_Record SHALL 列出所有涉及修改的代码文件路径
3. THE Change_Record SHALL 记录每个文件中的具体修改位置（行号或函数名）
4. THE Change_Record SHALL 描述每处修改的具体改动点
5. THE Change_Record SHALL 说明每处修改的原因（为什么要做这个修改）

### Requirement 3: 问题根因分析记录

**User Story:** As a 开发人员, I want 记录 Bug 或问题的根因分析, so that 团队能够从历史问题中学习并避免类似问题再次发生

#### Acceptance Criteria

1. WHERE 本次变更是 Bug 修复, THE Change_Record SHALL 包含 Root_Cause 分析章节
2. WHEN 记录 Root_Cause 时, THE Change_Tracker SHALL 描述问题的表现症状
3. WHEN 记录 Root_Cause 时, THE Change_Tracker SHALL 说明问题产生的根本原因
4. WHERE 本次变更是新功能开发或重构, THE Change_Record SHALL 省略 Root_Cause 章节

### Requirement 4: 踩坑与解决方案记录

**User Story:** As a 开发人员, I want 记录开发过程中遇到的问题和解决方案, so that 后续开发人员能够避免重复踩坑

#### Acceptance Criteria

1. THE Change_Record SHALL 包含 Pitfall 记录章节
2. WHEN 开发过程中遇到阻塞性问题, THE Change_Tracker SHALL 记录问题描述
3. WHEN 开发过程中遇到阻塞性问题, THE Change_Tracker SHALL 记录对应的解决方案
4. WHEN 开发过程中发生误判（错误的问题定位或判断）, THE Change_Tracker SHALL 记录误判的具体内容
5. WHEN 开发过程中发生误改（错误的修改尝试）, THE Change_Tracker SHALL 记录误改的具体操作
6. WHEN 记录误判或误改时, THE Change_Tracker SHALL 说明导致误判或误改的原因分析
7. IF 开发过程中未遇到特殊问题、误判或误改, THEN THE Change_Record SHALL 在 Pitfall 章节标注"无"

### Requirement 5: 影响分析记录

**User Story:** As a 开发人员, I want 记录代码变更的影响范围和关键代码改动, so that 团队能够评估变更风险、快速理解核心修改并按需查看完整差异

#### Acceptance Criteria

1. THE Change_Record SHALL 包含 Impact_Analysis 章节
2. WHEN 变更涉及接口契约改变, THE Change_Tracker SHALL 详细描述接口变更内容
3. WHEN 变更涉及数据结构改变, THE Change_Tracker SHALL 描述数据结构的前后差异
4. WHEN 变更可能影响其他模块, THE Change_Tracker SHALL 列出受影响的模块名称
5. 经过严格检查之后，IF 变更不涉及外部影响, THEN THE Change_Record SHALL 在 Impact_Analysis 章节标注"无外部影响"
6. THE Change_Record SHALL 包含 Code_Diff 代码差异章节
7. THE Code_Diff SHALL 仅记录关键代码片段，包括核心逻辑修改、接口变更和关键算法调整
8. THE Code_Diff SHALL 使用代码块格式清晰展示修改前（before）和修改后（after）的关键代码内容
9. WHEN 存在大量同类改动（如批量重命名、批量格式化、批量导入调整）, THE Change_Tracker SHALL 使用摘要统计描述（如"重命名 20 个文件"、"调整 15 处导入语句"）
10. THE Change_Record SHALL 提供相关 Git_Commit_Hash 链接，供读者按需查看完整 diff
11. THE Code_Diff SHALL 为每个关键代码片段标注所属文件路径和行号范围

### Requirement 6: 变更记录持久化存储

**User Story:** As a 项目管理者, I want 变更记录被可靠地持久化存储, so that 历史记录不会丢失且便于检索

#### Acceptance Criteria

1. WHEN Change_Record 生成完成, THE Change_Tracker SHALL 将文档持久化到项目根目录的 docs/change-logs/ 目录
2. THE Change_Tracker SHALL 使用文件名格式 YYYY-MM-DD_HHmmss_简短描述.md 存储 Change_Record
3. WHEN 生成文件名时, THE Change_Tracker SHALL 从变更概要中提取简短描述作为文件名后缀
4. THE Change_Record SHALL 使用 Markdown 格式存储，便于阅读和版本控制
5. IF docs/change-logs/ 目录不存在, THEN THE Change_Tracker SHALL 自动创建该目录
6. IF 持久化存储失败, THEN THE Change_Tracker SHALL 向用户显示错误信息并保留文档内容

### Requirement 7: 变更记录结构化格式

**User Story:** As a 开发人员, I want 变更记录采用统一的结构化格式, so that 文档易于阅读和信息检索

#### Acceptance Criteria

1. THE Change_Record SHALL 包含以下章节：标题、时间信息、分支信息、变更概要、修改文件列表、具体改动、根因分析（如适用）、踩坑记录、影响分析
2. THE Change_Record SHALL 在文档开头显示创建时间戳（格式：YYYY-MM-DD HH:mm:ss）
3. THE Change_Record SHALL 在文档开头显示完成时间戳（格式：YYYY-MM-DD HH:mm:ss）
4. THE Change_Record SHALL 使用清晰的 Markdown 标题层级组织内容

### Requirement 8: 关键词与标签分类

**User Story:** As a 开发人员, I want 变更记录包含关键词标签和分类信息, so that 我能够快速检索和筛选历史变更记录

#### Acceptance Criteria

1. THE Change_Record SHALL 包含 Tags 标签字段，支持多个自定义标签
2. WHEN 生成 Change_Record 时, THE Change_Tracker SHALL 根据变更内容自动推荐相关 Tags（如性能优化、数据库、缓存、安全、UI等）
3. THE Change_Record SHALL 包含 Change_Type 变更类型字段
4. THE Change_Type SHALL 为以下类型之一：Bug修复、新功能、重构、性能优化、配置变更、文档更新、依赖升级
5. WHERE 本次变更是 Bug 修复, THE Change_Record SHALL 包含 Severity 严重程度字段
6. THE Severity SHALL 为以下级别之一：high（高）、medium（中）、low（低）
7. WHEN 记录 Severity 时, THE Change_Tracker SHALL 根据 Bug 对系统的影响程度进行评估
8. WHERE 本次变更不是 Bug 修复, THE Change_Record SHALL 省略 Severity 字段
9. THE Change_Record SHALL 在文档元信息区域集中显示 Tags、Change_Type 和 Severity（如适用）
