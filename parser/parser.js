import * as acorn from "acorn";
import * as escodegen from "escodegen";

import { addFunctionReactivity, addJSXReactivity } from "./reactivity.js";

export { transform }

function transform(code)
{
    const parsed = acorn.parse(code, {ecmaVersion: "latest",sourceType: "module"});

    // console.log(JSON.stringify(parsed,null,4))
    addFunctionReactivity(parsed)
    addJSXReactivity(parsed)

    return escodegen.generate(parsed)
}