import { bundle } from './core';

async function main() {
  try {
    const graph = await bundle('./test/index.js');
    console.log('Final dependency graph:');
    console.dir(graph, { depth: null });
  } catch (error) {
    console.error('Dependency analysis failed:', error);
  }
}

main();