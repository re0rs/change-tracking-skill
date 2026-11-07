/**
 * Change Tracking Skill - 类型定义
 * 
 * 本文件定义了变更追踪系统中使用的所有 TypeScript 类型
 */

// ============ 变更类型枚举 ============

/**
 * 变更类型
 */
export type ChangeType = 
  | "Bug修复"
  | "新功能"
  | "重构"
  | "性能优化"
  | "配置变更"
  | "文档更新"
  | "依赖升级";

/**
 * 严重程度（仅 Bug 修复时使用）
 */
export type Severity = "high" | "medium" | "low";

// ============ Git 相关类型 ============

/**
 * Commit 信息
 */
export interface CommitInfo {
  /** 完整 hash */
  hash: string;
  /** 短 hash（7位） */
  shortHash: string;
  /** 提交信息 */
  message: string;
  /** 作者 */
  author: string;
  /** 提交日期 */
  date: Date;
}

/**
 * Commit 范围（多 commit 时使用）
 */
export interface CommitRange {
  /** 起始 commit hash */
  from: string;
  /** 结束 commit hash */
  to: string;
  /** 范围内的 commits */
  commits: CommitInfo[];
}

/**
 * 文件变更状态
 */
export type FileStatus = "added" | "modified" | "deleted" | "renamed";

/**
 * 变更的文件
 */
export interface ChangedFile {
  /** 文件路径 */
  path: string;
  /** 变更状态 */
  status: FileStatus;
  /** 新增行数 */
  additions: number;
  /** 删除行数 */
  deletions: number;
  /** 原路径（仅 renamed 时有值） */
  oldPath?: string;
}

/**
 * Diff 行类型
 */
export type DiffLineType = "context" | "addition" | "deletion";

/**
 * Diff 行
 */
export interface DiffLine {
  /** 行类型 */
  type: DiffLineType;
  /** 行内容 */
  content: string;
  /** 旧文件行号 */
  oldLineNumber?: number;
  /** 新文件行号 */
  newLineNumber?: number;
}

/**
 * Diff 块
 */
export interface DiffHunk {
  /** 旧文件起始行 */
  oldStart: number;
  /** 旧文件行数 */
  oldCount: number;
  /** 新文件起始行 */
  newStart: number;
  /** 新文件行数 */
  newCount: number;
  /** 行内容 */
  lines: DiffLine[];
}

/**
 * 文件 Diff
 */
export interface FileDiff {
  /** 文件路径 */
  filePath: string;
  /** Diff 块列表 */
  hunks: DiffHunk[];
}

// ============ 触发上下文类型 ============

/**
 * 触发类型
 */
export type TriggerType = 
  | "PostToolUse"
  | "UserPromptSubmit"
  | "PreToolUse"
  | "PostTaskExec"
  | "PostFileSave";

/**
 * 触发上下文
 */
export interface TriggerContext {
  /** 触发类型 */
  triggerType: TriggerType;
  /** 触发的工具名称 */
  toolName?: string;
  /** 涉及的文件路径 */
  filePaths?: string[];
  /** 用户消息（用于判断确认意图） */
  userMessage?: string;
  /** 任务 ID */
  taskId?: string;
  /** 终端执行的命令内容 */
  terminalCommand?: string;
  /** 终端命令输出 */
  terminalOutput?: string;
}

/**
 * 用户确认结果
 */
export interface UserConfirmation {
  /** 是否确认生成 */
  confirmed: boolean;
  /** 是否跳过 */
  skipped: boolean;
  /** 用户提供的额外信息 */
  additionalInfo?: string;
}

// ============ 变更记录核心类型 ============

/**
 * 文件修改详情
 */
export interface FileModification {
  /** 修改位置（行号范围或函数名） */
  location: string;
  /** 具体改动描述 */
  change: string;
  /** 修改原因 */
  reason: string;
}

/**
 * 修改文件详情
 */
export interface ChangedFileDetail {
  /** 文件路径 */
  filePath: string;
  /** 变更状态 */
  status: FileStatus;
  /** 修改详情列表 */
  modifications: FileModification[];
}

/**
 * 根因分析（仅 Bug 修复）
 */
export interface RootCauseAnalysis {
  /** 问题表现症状 */
  symptom: string;
  /** 根本原因 */
  cause: string;
}

/**
 * 踩坑类型
 */
export type PitfallType = "blocking" | "misjudgment" | "mismodification";

/**
 * 踩坑记录
 */
export interface PitfallRecord {
  /** 问题类型 */
  type: PitfallType;
  /** 问题描述 */
  problem: string;
  /** 解决方案（blocking 类型使用） */
  solution?: string;
  /** 原因分析（misjudgment/mismodification 类型使用） */
  analysis?: string;
}

/**
 * 影响分析
 */
export interface ImpactAnalysis {
  /** 是否有外部影响 */
  hasExternalImpact: boolean;
  /** 接口变更描述 */
  interfaceChanges?: string[];
  /** 数据结构变更描述 */
  dataStructureChanges?: string[];
  /** 受影响的模块列表 */
  affectedModules?: string[];
}

/**
 * 关键代码变更类型
 */
export type KeyChangeType = "core_logic" | "interface" | "algorithm";

/**
 * 关键代码变更
 */
export interface KeyCodeChange {
  /** 文件路径 */
  filePath: string;
  /** 行号范围 */
  lineRange: string;
  /** 变更类型 */
  changeType: KeyChangeType;
  /** 修改前代码 */
  before: string;
  /** 修改后代码 */
  after: string;
  /** 变更说明 */
  description: string;
}

/**
 * 代码差异章节
 */
export interface CodeDiffSection {
  /** 关键代码变更列表 */
  keyChanges: KeyCodeChange[];
  /** 批量变更摘要 */
  bulkChangeSummary?: string[];
  /** commit 链接列表 */
  commitLinks: string[];
}

/**
 * 变更记录（核心数据模型）
 */
export interface ChangeRecord {
  // ---- 元信息 ----
  /** 唯一标识符（UUID） */
  id: string;
  /** 创建时间 */
  createdAt: Date;
  /** 完成时间 */
  completedAt: Date;
  
  // ---- Git 信息 ----
  /** 分支名称，null 表示不可用 */
  branch: string | null;
  /** 单个 commit 的 hash，null 表示不可用 */
  commitHash: string | null;
  /** 多 commit 时的范围 */
  commitRange: CommitRange | null;
  
  // ---- 变更分类 ----
  /** 变更类型 */
  changeType: ChangeType;
  /** 严重程度（仅 Bug 修复时有值） */
  severity: Severity | null;
  /** 标签列表 */
  tags: string[];
  
  // ---- 变更内容 ----
  /** 变更概要 */
  summary: string;
  /** 详细描述 */
  description: string;
  /** 修改的文件列表 */
  changedFiles: ChangedFileDetail[];
  
  // ---- 分析内容 ----
  /** 根因分析（仅 Bug 修复） */
  rootCause: RootCauseAnalysis | null;
  /** 踩坑记录 */
  pitfalls: PitfallRecord[];
  /** 影响分析 */
  impactAnalysis: ImpactAnalysis;
  /** 代码差异 */
  codeDiff: CodeDiffSection;
}

// ============ Hook 配置类型 ============

/**
 * Hook Action 类型
 */
export type HookActionType = "agent" | "command";

/**
 * Hook Action
 */
export interface HookAction {
  /** Action 类型 */
  type: HookActionType;
  /** Agent 提示（agent 类型使用） */
  prompt?: string;
  /** Shell 命令（command 类型使用） */
  command?: string;
}

/**
 * Hook 配置
 */
export interface Hook {
  /** Hook 名称 */
  name: string;
  /** 描述 */
  description?: string;
  /** 触发类型 */
  trigger: TriggerType;
  /** 匹配正则（用于过滤触发事件） */
  matcher?: string;
  /** Action 配置 */
  action: HookAction;
  /** 超时时间（秒） */
  timeout?: number;
  /** 是否启用 */
  enabled?: boolean;
}

/**
 * Hook 配置文件
 */
export interface HookConfig {
  /** 版本 */
  version: "v1";
  /** Hook 列表 */
  hooks: Hook[];
}

// ============ 持久化相关类型 ============

/**
 * 持久化错误代码
 */
export type PersistenceErrorCode = 
  | "PERMISSION_DENIED"
  | "DISK_FULL"
  | "PATH_TOO_LONG"
  | "UNKNOWN";

/**
 * 持久化错误
 */
export interface PersistenceError {
  /** 错误代码 */
  code: PersistenceErrorCode;
  /** 错误信息 */
  message: string;
  /** 原始错误 */
  originalError?: Error;
}
