import { parse } from "./parser/parser.js"

export { MagicDomVitePlugin, MagicDomLiteVitePlugin }

function MagicDomLiteVitePlugin()
{
    return Plugin(`import { JSXNode, JSXFragment, ref } from "magic-dom/jsx/lite/index.js"`)
}
function MagicDomVitePlugin()
{
    return Plugin(`import { JSXNode, JSXFragment, ref, state } from "magic-dom/jsx/regular/index.js"`)
}

function Plugin(config)
{
    return {
        name: 'dom-builder',
        config: () => ({
            esbuild: {
                jsxFactory: 'JSXNode',
                jsxFragment: 'JSXFragment',
                jsxInject: config,
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