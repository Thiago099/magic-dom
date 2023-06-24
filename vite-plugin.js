import { parse } from "./parser/parser.js"
export default () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'JSXNode',
            jsxFragment: 'Fragment',
            jsxInject: `import { JSXNode, JSXFragment } from "magic-dom"`,
        }
    }),
    transform(code, id, options) {
        if (id.endsWith('.jsx')) {
            code = parse(code);
        }
        return code;
      }
})
  