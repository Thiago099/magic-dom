

export { Router }


function Router(routes)
{
    var container = <div></div>
    var currentPath = trim(window.location.pathname);
    navigatePath()
    //on popstate
    window.onpopstate = function(event) {
        navigatePath()
    };
    function navigatePath()
    {
        currentPath = trim(window.location.pathname);
        var path = currentPath.split('/').filter(x => x !== "")
        container.innerHTML = ""

        for(var route in routes)
        {
            var routePath = trim(route).split('/').filter(x => x !== "")
            var parameters = {go}
            if(routePath.length === path.length)
            {
                var match = true
                for(var i = 0; i < routePath.length; i++)
                {
                    if(routePath[i].startsWith('{') && routePath[i].endsWith('}'))
                    {
                        parameters[routePath[i].replace('{','').replace('}','')] = path[i]
                        continue
                    }
                    else if(routePath[i] !== path[i])
                    {
                        match = false
                        break
                    }
                }
                if(match)
                {
                    routes[route]()
                    .then(module => {
                        module.default(parameters).$parent(container)
                    })
                    return
                }
            }
        }
        if(routes["404"] !== undefined) 
        {
            routes["404"]()
            .then(module => {
                module.default().$parent(container)
            })
        }

    }

    function path()
    {
        return currentPath
    }

    function go(path)
    {
        path = trim(path)
        if(trim(currentPath) === path) return
        if(path === "") path = "/"
        window.history.pushState({}, path, path);
        currentPath = path
        navigatePath()
    }
    return {container, go, path}
}

function trim(str)
{
    return str.replace(/(^(\/| )+)|((\/| )+$)/g,"")
}