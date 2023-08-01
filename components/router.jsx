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

console.log(router.getRoute()) //current path

router.go("route2") // navigate to the router path


// person.jsx

function Person({id})
{
    return <div>{id}</div>
}

*/

export { Router }



const asyncConstructor =  (async () => {}).constructor

function Router(routes, main=null)
{
    const patterns = Object.keys(routes).map(buildPattern).sort((a,b)=> b.length - a.length)
    const container = <div style="width:100%"></div>

    let currentPath  = cleanUp(window.location.pathname);
    let current = {data:null,route:null,path:null}

    let backRoutes = []

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
                current = {
                    data: result,
                    route: route,
                    path: currentPath
                }
                routes[route]()
                .then(module => {

                    if(module.default instanceof asyncConstructor)
                    {
                        module.default({navigate, navigateBack,...result})
                        .then(x=>{
                            container.innerHTML = ""
                            x.$parent(container)
                        })
                    }
                    else
                    {
                        container.innerHTML = ""
                        module.default({navigate, navigateBack,...result}).$parent(container)
                    }
                })
                // .catch(() => {
                //     container.innerHTML = "500"
                // })
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
            // .catch(() => {
            //     container.innerHTML = "500"
            // })
        }
        else
        {
            container.innerHTML = "404"
        }

    }

    function getRoute()
    {
        return current
    }

    function navigate(path)
    {
        backRoutes.push(currentPath)
        __navigate(path)
    }
    function navigateBack(fallback)
    {
        __navigate(backRoutes.pop() ?? fallback)
    }
    function __navigate(path)
    {
        path = cleanUp(path)
        window.history.pushState({}, "", window.location.origin + ("/" + path).replace(/\/+/g,"/"));
        currentPath = path
        updatePageContainer()
    }
    return {container, navigate, getRoute, navigateBack}
}

function cleanUp(str)
{
    return str.replace(/(^(\/| )+)|((\/| )+$)/g,"")
}

function buildPattern(pattern)
{
    const groups = []
    const patternString = "^"+cleanUp(pattern).replace(/{.*?}/g,group=>{
        groups.push(group.replace(/({|})/g,""))
        return "(.*?)"
    })+"$"
    const regex = new RegExp(patternString)
    function match(data)
    {
        let match = data.match(regex)
        
        if(match)
        {
            match = match.slice(1)
            let result = {}
            for(let i = 0; i < match.length;i++)
            {
                result[groups[i]] = match[i]
            }
            return result
        }

        return false
    }

    return {match, route:pattern, get length(){return patternString.length}}
}
