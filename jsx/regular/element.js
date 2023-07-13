import UseCSS from "../../lib/css"
export { element }
import { dig } from "./utils"
class builder
{
    $css(css, old)
    {
        if(old.element)
        {
            old.element.Remove()
        }
        const current = UseCSS(css, this)
        current.Add()
        old.element = current
        return this
    }
    
    $update()
    {
        var elements = this.querySelectorAll('*');

        for(const item of this.__events)
        {
            item()
        }

        for(const element of elements)
        {
            if(element.__events)
            {
                for(const item of element.__events)
                {
                    item()
                }
            }
        }
        return this
    }

    $on(event, callback)
    {
        const self = this

        function remove()
        {
            self.removeEventListener(event,capture)
        }

        function capture(e)
        {
            callback(e, remove)
        }

        this.addEventListener(event, capture)
        
        return this
    }

    $style(new_style,old)
    {
        if(old.style)
        {
            if(typeof new_style === "object")
            {
                for(const key in new_style)
                {
                    this.style.setProperty(key, null);
                }
            }
            else
            {
                const styles = new_style.split(';').filter((style) => style.length > 0);
                this.style = {}
                for(const style of styles) {
                    const [key, value] = style.split(':');
                    this.style.setProperty(key,null);
                }
            }
        }

        if(typeof new_style === "object")
        {
            for(const key in new_style)
            {
                this.style.setProperty(key, new_style[key]);
            }
        }
        else
        {
            const styles = new_style.split(';').filter((style) => style.length > 0);
            this.style = {}
            for(const style of styles) {
                const [key, value] = style.split(':');
                this.style.setProperty(key,value);
            }
        }
        old.style = new_style

        return this
    }

    $class(newClasses, old)
    {
        let newClassesSplit
        if(typeof newClasses == "object")
        {
            newClassesSplit = Object.keys(newClasses).filter(x=>newClasses[x])
        }
        else
        {
            newClassesSplit = newClasses.split(" ")
        }
        if(old.classesSplit)
        {
            for(const oldClass of old.classesSplit)
            {
                this.classList.remove(oldClass)
            }
        }
        for(const newClass of newClassesSplit)
        {
            this.classList.add(newClass)
        }
        old.classesSplit = newClassesSplit
        return this
    }

    $getComputedStyle(name)
    {
        return window.getComputedStyle(this).getPropertyValue(name)
    }

    $parent(element)
    {
        element.appendChild(this)
        return this
    }

    $model(element, old)
    {
        this.value = element.value
        if(!old.added)
        {
            old.added = true
            this.$on("input",()=>{
                element.value = this.value
            })
        }
        return this
    }

    $child(element, old)
    {
        if(!(element instanceof HTMLElement))
        {
            element = document.createTextNode(element)
        }

        if(old.element)
        {
            old.element.replaceWith(element)
        }
        else
        {
            this.appendChild(element)
        }

        old.element = element;

        return this
    }

    $state(parameter)
    {
        var currentParameter = dig(parameter)
        if(currentParameter?.$key == "ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62" )
        {
            currentParameter.$subscribe(this)
        }

        return this
    }
}

var builderInstance = new builder()

var blacklist = [
    "$on",
    "$update",
    "$parent",
    "$state"
]


function element(name)
{
    let result

    result = document.createElement(name);

    result.__events = []

    for(const item of getFunctionsFromClass(builder))
    {
        if(blacklist.includes(item))
        {
            result[item] = (...params) => {
                return builderInstance[item].apply(result, params)
            }
        }
        else
        {
            result[item] = (...params) => {
                params.push({})
                function event()
                {
                    var parameters = []
                    for(const parameter of params)
                    {
                        var currentParameter = dig(parameter)
                        if(currentParameter?.$key == "ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62" && item != "$model")
                        {
                            parameters.push(currentParameter.value)
                        }
                        else
                        {
                            parameters.push(currentParameter)
                        }
                    }
                    return builderInstance[item].apply(result, parameters)
                }
                var parameters = []
                for(const parameter of params)
                {
                    var currentParameter = dig(parameter)
                    if(currentParameter?.$key == "ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62" )
                    {
                        currentParameter.$subscribe(result)
                        if(item == "$model")
                        {
                            parameters.push(currentParameter)
                        }
                        else
                        {
                            parameters.push(currentParameter.value)
                        }

                    }
                    else
                    {
                        parameters.push(currentParameter)
                    }
                }
                result.__events.push(event)
                return builderInstance[item].apply(result, parameters)
            }
        }


    }
    return result

}
function getFunctionsFromClass(className) {
    const functionNames = [];

    const classObj = new className();
    const prototype = Object.getPrototypeOf(classObj);
    const methodNames = Object.getOwnPropertyNames(prototype);
  
    for (const methodName of methodNames) {
      const method = prototype[methodName];
      if (typeof method === 'function' && methodName != "constructor") {
        functionNames.push(methodName);
      }
    }
  
    return functionNames;
}

  

  