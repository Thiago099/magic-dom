
import { findPattern, matchPattern, findMutiPatternShallow } from "../lib/pattern.js";

export { addFunctionReactivity,addJSXReactivity }


const input_blacklist = [
    "on",
    "ref",
    "parent",
    /on:.+/,
]

export function isOnBlacklist(key)
{
    for(const item of input_blacklist)
    {
        if(typeof item == "string")
        {
            if(item == key) return true
        }
        else if(item instanceof RegExp)
        {
            if(item.test(key)) return true
        }
    }
    return false
}


const jsx_pattern = {
    "type": "CallExpression",
    "callee": {
        "name": "JSXNode"
    }
}

const function_pattern = {
    "type": "CallExpression",
    "callee": {
        "type":"MemberExpression",
        "property":{
            "type":"Identifier",
            "name": /\$.*/
        }
    }
}

const reactivityCandidates = [
    {
        pattern:{
            "type": "MemberExpression",
        },
        callback:  (item) => item.object
    },
    {
        pattern:{
            "type": "CallExpression",
        },
        callback:  (item) => item.callee
    },
    {
        pattern:{
            "type": "Property",
        },
        callback:  (item) => item.value
    },
    {
        pattern:{
            "type": "Identifier",
        },
        callback: (item) => item
    }
]


function addFunctionReactivity(parsed)
{
    const outside_calls = findPattern(parsed,function_pattern);
    
    for(const outside_call of outside_calls)
    {
        for(const index in outside_call.arguments)
        {
            const name = outside_call.callee.property.name;
            if(!isOnBlacklist(name.replace(/\$/,'')))
            {
                outside_call.arguments[index] = addReactivityIfRelevant(outside_call.arguments[index]);
            }
        }
    }
}

function addJSXReactivity(parsed)
{
    const elements = findPattern(parsed,jsx_pattern);

    for(const element of elements)
    {
        let properties = element.arguments[1].properties;
        if(properties)
        {
            for(const property of properties)
            {
                property.shorthand = false;
                if(property.key.type == "Identifier")
                {
                    property.value = addReactivityIfRelevantProp(property.key.name,property.value);
                }
                else if (property.key.type == "Literal")
                {
                    property.value = addReactivityIfRelevantProp(property.key.value,property.value);
                }
            }
        }
        for(let i = 2; i < element.arguments.length; i++)
        {
            element.arguments[i] = addReactivityIfRelevant(element.arguments[i]);
        }
    }
}

export function addReactivityIfRelevantProp(key,input)
{
    if(isOnBlacklist(key)) return input
    return addReactivityIfRelevant(input)
}

function addReactivityIfRelevant(input)
{
  if(isStatic(input)) return input
  if(input.type == "ArrowFunctionExpression") return input
  return addArrowFunction(input)
}

function arrowFunction(input)
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

// function safe(input)
// {
//     return {
//         "type": "ConditionalExpression",
//         "start": 0,
//         "end": 40,
//         "test": {
//             "type": "BinaryExpression",
//             "start": 0,
//             "end": 24,
//             "left": {
//                 "type": "UnaryExpression",
//                 "start": 0,
//                 "end": 9,
//                 "operator": "typeof",
//                 "prefix": true,
//                 "argument": input
//             },
//             "operator": "!=",
//             "right": {
//                 "type": "Literal",
//                 "start": 13,
//                 "end": 24,
//                 "value": "undefined",
//                 "raw": "\"undefined\""
//             }
//         },
//         "consequent": input,
//         "alternate": {
//             "type": "Identifier",
//             "start": 31,
//             "end": 40,
//             "name": "undefined"
//         }
//     }
// }

function addArrowFunction(input)
{
    return {
        "type": "ObjectExpression",
        "properties": [
            {
                "type": "Property",
                "method": false,
                "shorthand": false,
                "computed": false,
                "key": {
                    "type": "Identifier",
                    "name": "action"
                },
                "value": arrowFunction(input),
                "kind": "init"
            },
            {
                "type": "Property",
                "method": false,
                "shorthand": false,
                "computed": false,
                "key": {
                    "type": "Identifier",
                    "start": 27,
                    "end": 36,
                    "name": "properties"
                },
                "value": {
                    "type": "ArrayExpression",
                    "start": 37,
                    "end": 39,
                    "elements": distinct(findMutiPatternShallow(input,reactivityCandidates))//.map(safe)
                },
                "kind": "init"
            },
            {
                "type": "Property",
                "method": false,
                "shorthand": false,
                "computed": false,
                "key": {
                    "type": "Identifier",
                    "name": "$key"
                },
                "value": {
                    "type": "Literal",
                    "value": "471ddd10-6cc3-429b-ba9a-5f4250686d4a",
                    "raw": "\"471ddd10-6cc3-429b-ba9a-5f4250686d4a\""
                },
                "kind": "init"
            }
        ]
    }
}

function distinct(array)
{
    const result = []
    const names = new Set()
    for(const item of array)
    {
        if(!names.has(item.name))
        {
            names.add(item.name)
            result.push(item)
        }
    }
    return result
}

function isStatic(input)
{
  if(input.type == "ArrayExpression") return input.elements.every(x => isStatic(x))
  if(input.type == "ObjectExpression") return input.properties.every(x => isStatic(x.value))
  if(input.type == "Literal") return true
  if(matchPattern(input, jsx_pattern)) return true
  return false
}

