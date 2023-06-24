
import { findPattern, matchPattern } from "./pattern.js";

export { replace_function_reactivity,replace_jsx_reactivity }

export const jsx_pattern = {
    "type": "CallExpression",
    "callee": {
        "name": "JSXNode"
    }
}

export const function_pattern = {
    "type": "CallExpression",
    "callee": {
        "type":"MemberExpression",
        "property":{
            "type":"Identifier",
            "name": /\$.*/
        }
    }
}
function replace_function_reactivity(parsed)
{
    const outside_calls = findPattern(parsed,function_pattern);
    
    for(const outside_call of outside_calls)
    {
        for(const index in outside_call.arguments)
        {
            outside_call.arguments[index] = replace_reactive(outside_call.arguments[index]);
        }
    }
}

function replace_jsx_reactivity(parsed)
{
    const elements = findPattern(parsed,jsx_pattern);

    for(const element of elements)
    {
        var properties = element.arguments[1].properties;
        if(properties)
        {
            for(const property of properties)
            {

                if(property.key.type == "Identifier")
                {
                    property.value = replace_reactive(property.value);
                }
                else if (property.key.type == "Literal")
                {
                    property.value = replace_reactive(property.value);
                }
            }
        }
        for(var i = 2; i < element.arguments.length; i++)
        {
            element.arguments[i] = replace_reactive(element.arguments[i]);
        }
    }
}


function replace_reactive(input)
{
  if(isStatic(input)) return input
  return addArrowFunction(input)
}

function addArrowFunction(input)
{
    if(input.type == "ArrowFunctionExpression") return input
    return {
        "type": "ArrowFunctionExpression",      
        "expression": true,
        "generator": false,
        "async": false,
        "params": [],
        "body": input
    }
}

function isStatic(input)
{
  if(input.type == "ArrayExpression") return input.elements.every(x => isStatic(x))
  if(input.type == "ObjectExpression") return input.properties.every(x => isStatic(x.value))
  if(input.type == "Literal") return true
  if(matchPattern(input, jsx_pattern)) return true
  return false
}

