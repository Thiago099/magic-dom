import { parse } from "./parser/parser.js"

export { MagicDomVitePlugin, MagicDomLiteVitePlugin }

function MagicDomLiteVitePlugin()
{
    return Plugin("lite")
}
function MagicDomVitePlugin()
{
    return Plugin("regular")
}

function Plugin(config)
{
    return {
        name: 'dom-builder',
        config: () => ({
            esbuild: {
                jsxFactory: 'JSXNode',
                jsxFragment: 'Fragment',
                jsxInject: `import { JSXNode, JSXFragment } from "magic-dom/jsx/${config}/index.js"`,
            }
        }),
        transform(code, id, options) {
            if(config == "regular")
            {
                if (id.endsWith('.jsx')) {
                    code = parse(code);
                }
            }
            return code;
        }
    }
}