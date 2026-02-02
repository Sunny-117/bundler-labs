module.exports = function ({ types: t }) {
  return {
    // babel插件的执行是通过vistitor设计模式执行的
    visitor: {
      Identifier(path) { // 遇到标识符就会触发：Identifier
        // console.log('=======', path.node.name, '=======')
        const parentNodeIsIfStatement = t.isIfStatement(path.parent);

        /**
         * https://www.babeljs.cn/docs/babel-types#ifstatement
         */
        const isDebug = path.node.name === "DEBUG";
        /**
         * 名字是DEBUG  父级是 isIfStatement(if语句) 则满足
         */
        if (isDebug && parentNodeIsIfStatement) {
          // 把 Identifier 转成 String(stringLiteral)
          const stringNode = t.stringLiteral("DEBUG");
          path.replaceWith(stringNode);
        }
      },

      /**
       * 以上，就实现了把`const a = 10;const b = 20;if(DEBUG){console.log("heihei")}`
       * 替换成了`const a = 10;const b = 20;if("DEBUG"){console.log("heihei")}`
       */


      StringLiteral(path, state) {

        // console.log('————————————————————————', state, '————————————————————————')// opts: {},可以让外部用户来控制，不需要写在插件内部了
        const parentNodeIsIfStatement = t.isIfStatement(path.parent);
        const isDebug = path.node.value === "DEBUG";

        if (isDebug && parentNodeIsIfStatement) {
          if (process.env.NODE_ENV === "production") {
            path.parentPath.remove();
          }
        }
      },
    },
  };
};
