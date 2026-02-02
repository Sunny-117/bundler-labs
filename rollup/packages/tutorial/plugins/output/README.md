## Output Generation Hooks 

参考：https://cn.rollupjs.org/plugin-development/#output-generation-hooks

- 输出生成钩子可以提供有关生成的包的信息，并在完成后修改构建
- 输出生成阶段的第一个钩子是 outputOptions ，最后一个钩子要么 generateBundle 是通过成功生成输出
- 或者在输出生成过程中的任何时候发生错误 renderError
- 此外， closeBundle 可以作为最后一个钩子调用，但用户有责任手动调用 bundle.close() 以触发此钩子
