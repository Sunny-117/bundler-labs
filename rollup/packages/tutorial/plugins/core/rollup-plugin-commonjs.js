import { createFilter } from 'rollup-pluginutils'
import MagicString from 'magic-string';
import { walk } from 'estree-walker';
import path from 'path';

export default function (pluginOptions = {}) {
  const defaultExtensions = ['.js', '.jsx']
  const { exclude, include, extensions = defaultExtensions } = pluginOptions;
  const extensionRegExp = new RegExp(
    `(${extensions.join('|')})$`
  )
  const userDefinedFilter = createFilter(include, exclude);
  const filter = id => extensionRegExp.test(id) && userDefinedFilter(id);
  return {
    name: 'commonjs',
    transform(code, id) {
      if (!filter(id)) return null;
      const result = transformAndCheckExports(this.parse, code, id)
      return result;
    }
  }
}
function transformAndCheckExports(parse, code, id) {
  const { isEsModule, ast } = analyzeTopLevelStatements(parse, code, id);
  if (isEsModule) {
    return null;
  }
  return transformCommonjs(code, id, ast)
}
function getKeypath(node) {
  const parts = [];
  while (node.type === 'MemberExpression') {
    parts.unshift(node.property.name);
    node = node.object;
  }
  if (node.type !== 'Identifier') return null;
  const { name } = node;
  parts.unshift(name);
  return { name, keypath: parts.join('.') };
}
function analyzeTopLevelStatements(parse, code) {
  const ast = parse(code);
  let isEsModule = false;
  for (const node of ast.body) {
    switch (node.type) {
      case 'ExportDefaultDeclaration':
        isEsModule = true;
        break;
      case 'ExportNamedDeclaration':
        isEsModule = true;
        break;
      case 'ImportDeclaration':
        isEsModule = true;
        break;
      default:
    }
  }
  return { isEsModule, ast };
}
function transformCommonjs(code, id, ast) {
  const magicString = new MagicString(code);
  const exportDeclarations = [];
  let moduleExportsAssignment;
  walk(ast, {
    enter(node) {
      switch (node.type) {
        case 'AssignmentExpression':
          if (node.left.type === 'MemberExpression') {
            const flattened = getKeypath(node.left);
            if (flattened.keypath === 'module.exports') {
              moduleExportsAssignment = node;
            }
          }
          break;
        default:
          break;
      }
    }
  });
  const { left } = moduleExportsAssignment;
  const exportsName = path.basename(id, path.extname(id));
  magicString.overwrite(left.start, left.end, exportsName);
  magicString.prependRight(left.start, 'var ');
  exportDeclarations.push(`export default ${exportsName};`);
  const exportBlock = `\n\n${exportDeclarations.join('\n')}`;
  magicString.trim().append(exportBlock);
  return {
    code: magicString.toString()
  }
}
