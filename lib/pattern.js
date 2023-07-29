export { findPattern, matchPattern, findMutiPatternShallow }

function findPattern(object, pattern)
{
    const found = [];
    _findPattern(object);
    return found;
    function _findPattern(input)
    {
        if(Array.isArray(input))
        {
            for(const item of input)
            {
                _findPattern(item);
            }
        }
        else if(input && typeof input === "object")
        {
            if(matchPattern(input, pattern)) found.push(input)
            for(const item of Object.values(input))
            {
                _findPattern(item);
            }
        }
    }
}

function findMutiPatternShallow(object, patterns)
{
    const found = [];
    _findPattern(object);
    return found;
    function _findPattern(input)
    {
        if(Array.isArray(input))
        {
            for(const item of input)
            {
                _findPattern(item);
            }
        }
        else if(input && typeof input === "object")
        {
            for(const {pattern, callback} of patterns)
            {
                if(matchPattern(input, pattern)){
                    const result = callback(input)
                    if(result != null)
                    {
                        found.push(result)
                        return
                    }
                } 
                for(const item of Object.values(input))
                {
                    _findPattern(item);
                }

            }
        }
    }
}

function matchPattern(input, pattern)
{
    if(pattern instanceof RegExp)
    {
        return pattern.test(input)
    }
    else if(typeof pattern === "object")
    {
        if(!input || typeof input !== "object") return false
        for(const [key,item] of Object.entries(pattern))
        {
            if(!input.hasOwnProperty(key)) return false
            if(!matchPattern(input[key], item)) return false
        }
    }
    else
    {
        if(input !== pattern) return false
    }
    return true;
}