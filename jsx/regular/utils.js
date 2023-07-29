export {callArray,callObject,dig}

function callArray(x)
{
    return x.map(y=>digShallow(y))
}
function callObject(x)
{
    var result = {}
    for(const item in x)
    {
        result[item] = digShallow(x[item])
    }
    return result
}

function digShallow(element)
{
    let old = element
    while(typeof element == "function")
    {
        old = element
        element = element()
    }
    return old
}
function dig(element)
{
    const properties = []
    while(typeof element == "object" && element.$key == "471ddd10-6cc3-429b-ba9a-5f4250686d4a")
    {
        properties.push(...element.properties.filter(x=>x != undefined))
        element = element.action()
    }
    return {element, properties}
}