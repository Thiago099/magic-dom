/*

//usage:


import { Router } from "magic-dom/components/router.jsx"

const router = Router({
    "/": () => import("path/to/page.jsx")
    "route2": () => import("path/to/page2.jsx")
    "person/{id}": () => import("path/to/page3.jsx")
    "404": () => import("path/to/404-page.jsx")
    "loading": loadingPage()
},"route")// main route if there is no / route

router.container.$parent(document.body)

console.log(router.getPath()) //current path

router.go("route2") // navigate to the router path


// person.jsx

function Person({id})
{
    return <div>{id}</div>
}

*/

export { Router }





function Router(routes, main=null)
{
    const patterns = Object.keys(routes).map(buildPattern)
    const container = <div style="width:100%"></div>

    let currentPath  = cleanUp(window.location.pathname);
    if(!routes["/"] && currentPath == "")
    {
        navigate(main ??Object.keys(routes)[0])
    }
    else
    {
        updatePageContainer()
    }
    
    //on popstate
    window.addEventListener("popstate", function(event) {
        currentPath = cleanUp(window.location.pathname);
        updatePageContainer()
    })
    function updatePageContainer()
    {
        container.innerHTML = ""
        if(routes["loading"] !== undefined) 
        {
            routes["loading"].$parent(container)
        }
        for(const {match, route} of patterns)
        {
            const result = match(currentPath)
            if(result)
            {
            
                routes[route]()
                .then(module => {
                    container.innerHTML = ""
                    module.default({navigate,...result}).$parent(container)
                })
                .catch(() => {
                    container.innerHTML = ""
                })
                return
            }
        }
        if(routes["404"] !== undefined) 
        {
            currentPath = "404"
            routes["404"]()
            .then(module => {
                container.innerHTML = ""
                module.default().$parent(container)
            })
            .catch(() => {
                container.innerHTML = ""
            })
        }
        else
        {
            container.innerHTML = ""
        }

    }

    function getPath()
    {
        return currentPath
    }

    function navigate(path)
    {
        path = cleanUp(path)
        if(currentPath === path) return
        window.history.pushState({}, "", window.location.origin + ("/" + path).replace(/\/+/g,"/"));
        currentPath = path
        updatePageContainer()
    }
    return {container, navigate, getPath}
}

function cleanUp(str)
{
    return str.replace(/(^(\/| )+)|((\/| )+$)/g,"")
}

function buildPattern(pattern)
{
    var groups = []
    var regex = new RegExp("^"+cleanUp(pattern).replace(/{.*?}/g,group=>{
        groups.push(group.replace(/({|})/g,""))
        return "(.*?)"
    })+"$")
    function match(data)
    {
        var match = data.match(regex)
        
        if(match)
        {
            match = match.slice(1)
            var result = {}
            for(var i = 0; i < match.length;i++)
            {
                result[groups[i]] = match[i]
            }
            return result
        }

        return false
    }

    return {match,route:pattern}
}
