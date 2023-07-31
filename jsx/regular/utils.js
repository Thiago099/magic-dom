export {callArray,callObject,dig}

function callArray(x)
{
    return x.map(y=>dig(y).element)
}
function callObject(x)
{
    const result = {}
    for(const item in x)
    {
        result[item] = dig(x[item]).element
    }
    return result
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