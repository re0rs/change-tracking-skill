#!/usr/bin/env node
/**
 * 检查终端命令是否为 git push
 * 
 * 用于 change-tracking hook 的前置判断
 * - 如果是 git push 且成功：输出 agent prompt，exit 0
 * - 如果不是 git push 或失败：静默退出，exit 0（不阻塞）
 */

let inputData = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  try {
    const context = JSON.parse(inputData);
    const toolInput = context.tool_input || {};
    const toolResponse = context.tool_response || '';
    const command = toolInput.command || '';
    
    // 检查是否是 git push 命令
    const isGitPush = /\bgit\s+push\b/i.test(command);
    
    if (!isGitPush) {
      // 不是 git push，静默退出
      process.exit(0);
    }
    
    // 检查是否执行成功（Exit Code: 0）
    const isSuccess = /Exit Code:\s*0/i.test(toolResponse);
    
    if (!isSuccess) {
      // push 失败，不生成变更记录
      process.exit(0);
    }
    
    // 是 git push 且成功，输出 agent prompt
    const prompt = `检测到 git push 操作已成功完成。

请自动开始生成变更记录（留痕文档）：
1. 收集 Git 信息（分支、commit hash、push 的 commit 范围）
2. 整理本次修改的文件列表和具体改动
3. 分析修改原因和影响
4. 记录开发过程中的踩坑经历（如有误判误改）
5. 生成 Markdown 格式的变更记录文档
6. 保存到 docs/change-logs/ 目录`;

    console.log(prompt);
    process.exit(0);
    
  } catch (error) {
    // 解析失败，静默退出
    process.exit(0);
  }
});
