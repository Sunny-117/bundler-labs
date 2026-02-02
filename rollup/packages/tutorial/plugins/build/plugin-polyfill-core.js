//我们在polyfill id前面加上\0，告诉其他插件不要尝试加载或转换它
const POLYFILL_ID = '\0polyfill';
const PROXY_SUFFIX = '?inject-polyfill-proxy';

// 入口模块的话，插件自动引入 import 'polyfill'
export default function injectPolyfillPlugin() {
  return {
    name: 'inject-polyfill',
    async resolveId(source, importer, options) {
      console.log({source, importer, isEntry: options.isEntry})
      if (source === POLYFILL_ID) {
        //重要的是，对于polyfills，应始终考虑副作用
        //否则，使用`treeshake.moduleSideEffects:false`可能会阻止包含polyfill
        return { id: POLYFILL_ID, moduleSideEffects: true };
      }
      if (options.isEntry) {
        // 默认rollup只认识相对,绝对路径，不认识第三方node_modules路径
        //确定实际的入口是什么。我们需要skipSelf来避免无限循环。
        const resolution = await this.resolve(source, importer, { skipSelf: true, ...options });
        //如果它无法解决或是外部的，只需返回它，这样Rollup就可以显示错误
        if (!resolution || resolution.external) return resolution;
        //在代理的加载钩子中，我们需要知道入口是否有默认导出
        //然而，在那里，我们不再有完整的“解析”对象，它可能包含来自其他插件的元数据，这些插件只在第一次加载时添加
        //仅在第一次加载时添加。因此我们在这里触发加载。
        const moduleInfo = await this.load(resolution); // 此处的load内部会调用下面的load钩子，两者不完全一样
        //我们需要确保即使对于treeshake来说，原始入口点的副作用也得到了考虑。moduleSideEffects:false。所以调用load方法，此处不写也行
        //moduleSideEffects是ModuleInfo上的一个可写属性
        moduleInfo.moduleSideEffects = true;
        //重要的是，新入口不能以\0开头，并且与原始入口具有相同的目录，以免扰乱相对外部导入的生成
        //此外，保留名称并在末尾添加一个“？查询”可以确保preserveModules将为该条目生成原始条目名称
        return `${resolution.id}${PROXY_SUFFIX}`;
      }
      return null;
    },
    load(id) {
      console.log(id, '-----------------------')
      if (id === POLYFILL_ID) {
        // 替换为实际的polyfill import '@babel/polyfill'
        return "import '@babel/polyfill'";
      }
      if (id.endsWith(PROXY_SUFFIX)) {
        const entryId = id.slice(0, -PROXY_SUFFIX.length);
        //我们知道ModuleInfo.hasDefaultExport是可靠的，因为我们在等待在resolveId中的this.load
        // We know ModuleInfo.hasDefaultExport is reliable because we awaited this.load in resolveId
        const { hasDefaultExport } = this.getModuleInfo(entryId);
        let code =
          `import ${JSON.stringify(POLYFILL_ID)};` + `export * from ${JSON.stringify(entryId)};`;
        //命名空间重新导出不会重新导出默认值，因此我们需要在这里进行特殊处理
        if (hasDefaultExport) {
          code += `export { default } from ${JSON.stringify(entryId)};`;
        }
        console.log("code=", code)
        // 如果load钩子又返回值了，就不走后面的load钩子了。类似webpack loader pitch
        return code;
      }
      return null;
    }
  };
}

// resolve原理：拿到source所在目录，然后拼接上importer
/**

function resolve(source, importer, options) {
  const plugins =[{resolveId: ()=>'xxx'}, {resolveId: ()=>'yyy'}]
  let resolution;
  for (let i = 0; i < plugins.length; i++) {
  if(options.skipSelf&&plugins[i].name==='plugin1') continue;
    const resolveId = plugins[i].resolveId;
    if(resolveId) {
      resolution = resolveId(source, importer, options);
      if(resolution){
        return resolution
      }
    }
  }
  return {id: path.resolve(path.dirname(importer), source)}
}

 */
