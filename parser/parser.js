import * as acorn from "acorn";
import * as escodegen from "escodegen";

import { addFunctionReactivity, addJSXReactivity } from "./reactivity.js";

export { transform }

function transform(code, id)
{
    if(code == null) return code;
    const parsed = acorn.parse(code, {
        ecmaVersion: "latest",
        sourceType: "module",
        locations: true,    
        sourceFile: id
    });

    // console.log(JSON.stringify(parsed,null,4))
    addFunctionReactivity(parsed)
    addJSXReactivity(parsed)
    return escodegen.generate(parsed,{
        sourceMap: true, // Setting sourceFile in Acorn's options already
        sourceMapWithCode: true // Get both code and source map
    })

}