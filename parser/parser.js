import * as acorn from "acorn";
import * as escodegen from "escodegen";

import { replace_function_reactivity,replace_jsx_reactivity } from "./reactivity.js";
export {parse}

function parse(code)
{
    const parsed = acorn.parse(code, {ecmaVersion: "latest",sourceType: "module"});

    replace_function_reactivity(parsed)
    replace_jsx_reactivity(parsed)

    return escodegen.generate(parsed)
}