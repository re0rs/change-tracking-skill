# GitCollector - Git 信息收集器

## 职责

负责从 Git 仓库收集变更相关信息，包括分支、commit、文件差异等。

## 收集流程

### 1. 检查 Git 仓库

首先执行以下命令确认当前目录是 Git 仓库：

```bash
git rev-parse --is-inside-work-tree
```

- 如果返回 `true`，继续收集信息
- 如果失败或返回其他值，标记 Git 信息不可用

### 2. 获取当前分支

```bash
git rev-parse --abbrev-ref HEAD
```

- 成功：记录分支名称
- 失败：标记"分支信息不可用"

### 3. 获取最近的 Commit 信息

获取最近的 commit（用于单 commit 场景）：

```bash
git log -1 --format="%H|%h|%s|%an|%ai"
```

输出格式：`完整hash|短hash|提交信息|作者|日期`

获取最近 N 个 commits（用于多 commit 场景）：

```bash
git log -n {count} --format="%H|%h|%s|%an|%ai"
```

### 4. 获取 Commit 范围

当变更涉及多个 commit 时，获取 commit 范围：

```bash
git log --oneline {from_hash}..{to_hash}
```

### 5. 获取修改的文件列表

获取指定 commit 的修改文件：

```bash
git diff --name-status {commit_hash}^..{commit_hash}
```

或获取未提交的修改：

```bash
git diff --name-status HEAD
```

输出格式说明：
- `A` - 新增文件
- `M` - 修改文件
- `D` - 删除文件
- `R` - 重命名文件（后跟原路径和新路径）

### 6. 获取文件差异详情

获取指定 commit 的差异：

```bash
git diff {commit_hash}^..{commit_hash} -- {file_path}
```

或获取未提交的差异：

```bash
git diff HEAD -- {file_path}
```

## 错误处理

### Git 命令失败

当 Git 命令执行失败时：

1. 记录错误信息（用于调试）
2. 对应字段设置为 `null` 或空数组
3. 继续执行后续收集步骤
4. 不中断整体流程

### 常见错误场景

| 错误 | 处理方式 |
|------|---------|
| 不在 Git 仓库内 | 所有 Git 信息标记为不可用 |
| 没有任何 commit | commit 信息标记为不可用 |
| 分支处于 detached HEAD | 分支名记录为 "HEAD detached" |
| 文件已删除 | 只记录删除状态，无法获取差异 |

## 输出格式

收集完成后，输出以下信息供后续组件使用：

```typescript
{
  // 分支信息
  branch: string | null,
  
  // 最近的 commit
  latestCommit: {
    hash: string,
    shortHash: string,
    message: string,
    author: string,
    date: string
  } | null,
  
  // Commit 范围（多 commit 时）
  commitRange: {
    from: string,
    to: string,
    count: number
  } | null,
  
  // 修改的文件列表
  changedFiles: Array<{
    path: string,
    status: "added" | "modified" | "deleted" | "renamed",
    oldPath?: string  // 重命名时
  }>,
  
  // 是否在 Git 仓库内
  isGitRepo: boolean
}
```

## 使用示例

当需要收集 Git 信息时，按顺序执行上述步骤，并将结果汇总。

**示例输出：**

```
Git 信息收集完成：
- 分支：feature/user-auth
- 最新 Commit：a1b2c3d "修复登录验证逻辑"
- 修改文件：
  - M src/auth/login.ts
  - A src/auth/validate.ts
  - D src/auth/old-login.ts
```
