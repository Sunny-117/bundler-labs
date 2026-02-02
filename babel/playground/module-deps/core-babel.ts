import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
// @ts-expect-error
import t from '@babel/traverse';
import type { ImportDeclaration } from '@babel/types';

const traverse = t.default;
// 当前模块路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 定义类型
interface ModuleInfo {
  deps: string[];
  code: string;
}

type DependencyGraph = Record<string, ModuleInfo>;

/**
 * 收集模块依赖关系
 * @param entryFile 入口文件路径
 * @param graph 依赖关系图
 */
export async function collectDependencies(
  entryFile: string,
  graph: DependencyGraph = {}
): Promise<DependencyGraph> {
  // 避免重复处理
  if (graph[entryFile]) {
    return graph;
  }

  // 读取文件内容
  const code = await fs.readFile(entryFile, 'utf-8');
  
  // 初始化模块信息
  graph[entryFile] = {
    deps: [],
    code
  };

  try {
    // 解析为AST
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'] // 支持TS和JSX
    });

    // 遍历AST寻找import声明
    traverse(ast, {
      ImportDeclaration({ node }: { node: ImportDeclaration }) {
        const depPath = node.source.value;
        const depAbsolutePath = path.resolve(path.dirname(entryFile), depPath);
        
        // 添加依赖
        graph[entryFile].deps.push(depAbsolutePath);
        
        // 递归处理依赖
        collectDependencies(depAbsolutePath, graph);
      }
    });
  } catch (error) {
    console.error(`Error parsing ${entryFile}:`, error);
  }

  return graph;
}

/**
 * 从入口文件开始分析依赖
 * @param entryPath 入口文件路径
 */
export async function analyzeDependencies(entryPath: string) {
  const absoluteEntryPath = path.resolve(__dirname, entryPath);
  const graph = await collectDependencies(absoluteEntryPath);
  
  console.log('Dependency Graph:', graph);
  return graph;
}