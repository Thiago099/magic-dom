
import { findPattern, matchPattern } from "./pattern.js";

export { addFunctionReactivity,addJSXReactivity }

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
function addFunctionReactivity(parsed)
{
    const outside_calls = findPattern(parsed,function_pattern);
    
    for(const outside_call of outside_calls)
    {
        for(const index in outside_call.arguments)
        {
            outside_call.arguments[index] = addReactivityIfRelevant(outside_call.arguments[index]);
        }
    }
}

function addJSXReactivity(parsed)
{
    const elements = findPattern(parsed,jsx_pattern);

    for(const element of elements)
    {
        var properties = element.arguments[1].properties;
        if(properties)
        {
            for(const property of properties)
            {
                property.value = addReactivityIfRelevant(property.value);
            }
        }
        for(var i = 2; i < element.arguments.length; i++)
        {
            element.arguments[i] = addReactivityIfRelevant(element.arguments[i]);
        }
    }
}

function addReactivityIfRelevant(input)
{
  if(isStatic(input)) return input
  if(input.type == "ArrowFunctionExpression") return input
  return addArrowFunction(input)
}

function addArrowFunction(input)
{
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

