import dedent from 'dedent';

export default function html() {
  return {
    name: 'html',
    generateBundle(options, bundle) {
      let entryName;
      for (let fileName in bundle) {
        let assetOrChunkInfo = bundle[fileName];
        console.log(fileName, assetOrChunkInfo);
        if (assetOrChunkInfo.isEntry) {
          entryName = fileName;
        }
      }
      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: dedent`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>rollup</title>
         </head>
        <body>
          <script src="${entryName}" type="module"></script>
        </body>
        </html>`
      });
    }
  };
}
