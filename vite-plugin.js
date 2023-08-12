import { transform as transformJSX } from "./parser/parser.js"
import { transform  as transformCSS } from "./parser/scopedCss.js"
import path from "path"
export { MagicDomVitePlugin, MagicDomLiteVitePlugin }

function MagicDomLiteVitePlugin()
{
    return Plugin({
        name:"lite",
        inject:`import { JSXNode, JSXFragment, ref } from "magic-dom/jsx/lite/index.js"`})
}
function MagicDomVitePlugin()
{
    return Plugin({
        name:"regular",
        inject:`import { JSXNode, JSXFragment, ref, state } from "magic-dom/jsx/regular/index.js"`
    })
}

function Plugin(config)
{
    return {
        name: 'dom-builder',
        config: () => ({
            esbuild: {
                jsxFactory: 'JSXNode',
                jsxFragment: 'JSXFragment',
                jsxInject: config.inject,
            }
        }),
        transform(code, id, options) {
            if(config.name == "regular")
            {
                if (id.endsWith('.jsx')) {
                    code = transformJSX(code);
                    // console.log(code)
                }
            }
            if(id.endsWith('.scoped.css'))
            {
                code = transformCSS(code, path.parse(id).name)
            }
            return code;
        }
    }
}