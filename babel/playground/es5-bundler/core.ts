import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, transformSync } from '@swc/core';
import type { ImportDeclaration } from '@swc/core';
import fs from 'fs-extra';

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
async function collectDependencies(
  entryFile: string,
  graph: DependencyGraph = {}
): Promise<DependencyGraph> {
  // 避免重复处理：解决循环依赖
  if (graph[entryFile]) {
    console.warn('循环依赖', entryFile);
    return graph;
  }

  // 读取文件内容
  const code = await fs.readFile(entryFile, 'utf-8');

  // transform 到 es5
  const transformedCode = transformSync(code, {
    jsc: {
      target: 'es5',
    },
    module: {
        type: 'commonjs',
    },
  }).code;

  // 初始化模块信息
  graph[entryFile] = {
    deps: [],
    code: transformedCode
  };

  try {
    // 使用SWC解析为AST
    const ast = await parse(code, {
      syntax: 'typescript',
      tsx: true, // 支持TSX
      dynamicImport: true,
      script: false,
      target: 'es5',
    });

    // 收集所有导入依赖
    const importDeclarations = ast.body.filter(
      (node): node is ImportDeclaration => node.type === 'ImportDeclaration'
    );

    // 处理所有依赖
    await Promise.all(
      importDeclarations.map(async (importNode) => {
        const depPath = importNode.source.value;
        const depAbsolutePath = path.resolve(path.dirname(entryFile), depPath);
        
        // 添加依赖
        graph[entryFile].deps.push(depAbsolutePath);

        // 递归处理依赖并等待完成
        await collectDependencies(depAbsolutePath, graph);
      })
    );
  } catch (error) {
    console.error(`Error parsing ${entryFile}:`, error);
  }

  return graph;
}

/**
 * 从入口文件开始分析依赖
 * @param entryPath 入口文件路径
 */
export async function bundle(entryPath: string) {
  const absoluteEntryPath = path.resolve(__dirname, entryPath);
  const graph = await collectDependencies(absoluteEntryPath);
  
  console.log('Dependency Graph:', graph);
  // 生成最终产物
  generateBundle(graph);
  return graph;
}

/**
 * 生成最终的bundle
 * @param graph 依赖关系图
 */
function generateBundle(graph: DependencyGraph) {

  let bundle = '';

  // 遍历所有模块
  for (const [entryFile, moduleInfo] of Object.entries(graph)) {
    // 添加模块代码
    bundle += `
      // ${entryFile}
      ${moduleInfo.code}
    `;
  }
  // 利用fs-extra，不存在则创建
  fs.ensureDir('./dist');
  // 直接写入dist
  fs.writeFile('./dist/bundle.txt', bundle);
}