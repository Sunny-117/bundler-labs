function generation() {
  return {
    name: 'rollup-plugin-generation',
    //这个钩子是同步的，不能加async
    outputOptions(outputOptions) {
      outputOptions.dir = 'dist2'
      console.log('outputOptions', outputOptions);
    },
    renderStart() {
      console.log('renderStart');
    },
    banner() {
      console.log('banner');
    },
    footer() {
      console.log('footer');
    },
    intro() {
      console.log('intro');
    },
    outro() {
      console.log('outro');
    },
    renderDynamicImport() {
      console.log('renderDynamicImport');
    },
    augmentChunkHash() {
      console.log('augmentChunkHash');
    },
    resolveFileUrl() {
      console.log('resolveFileUrl');
    },
    resolveImportMeta() {
      console.log('resolveImportMeta');
    },
    renderChunk() {
      console.log('renderChunk');
    },
    generateBundle() {
      console.log('generateBundle');
    },
    writeBundle() {
      console.log('writeBundle');
    },
    renderError() {
      console.log('renderError');
    },
    closeBundle() {
      console.log('closeBundle');
    }
  }
}
export default generation;
