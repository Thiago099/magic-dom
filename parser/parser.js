import * as acorn from "acorn";
import * as escodegen from "escodegen";

import { addFunctionReactivity,addJSXReactivity } from "./reactivity.js";
export {parse}

function parse(code)
{
    const parsed = acorn.parse(code, {ecmaVersion: "latest",sourceType: "module"});

    addFunctionReactivity(parsed)
    addJSXReactivity(parsed)

    return escodegen.generate(parsed)
}