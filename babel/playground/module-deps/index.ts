import { collectDependencies } from './core-swc';

async function main() {
  try {
    const graph = await collectDependencies('./test/index.js');
    console.log('Final dependency graph:');
    console.dir(graph, { depth: null });
  } catch (error) {
    console.error('Dependency analysis failed:', error);
  }
}

main();