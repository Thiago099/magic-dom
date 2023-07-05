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
    while(typeof element == "function")
    {
        element = element()
    }
    return element
}