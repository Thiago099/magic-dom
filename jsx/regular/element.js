import UseCSS from "../../lib/css"
export { element }
import { dig } from "./utils"
class builder
{
    $css(css)
    {
        return (old) =>
        {
            if(old)
            {
                old.Remove()
            }

            const current = UseCSS(css, this)

            current.Add()
            
            return current
        }
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
        function remove()
        {
            this.removeEventListener(event,capture)
        }

        function capture(e)
        {
            callback(e, remove)
        }

        this.addEventListener(event, capture)
        
        return this
    }

    $style(new_style)
    {
        return (old) => {

            if(old)
            {
                for(const key of old)
                {
                    this.style.setProperty(key, null);
                }
            }

            const applied = []

            if(typeof new_style === "object")
            {
                for(const key in new_style)
                {
                    applied.push(key)
                    this.style.setProperty(key, new_style[key]);
                }
            }
            else
            {
                const styles = new_style.split(';').filter((style) => style.length > 0);
                for(const style of styles) {
                    const [key, value] = style.split(':');
                    applied.push(key)
                    this.style.setProperty(key,value);
                }
            }

            return applied
        }
    }

    $class(newClasses)
    {
        return (old) => {

            if(old)
            {
                for(const oldClass of old)
                {
                    this.classList.remove(oldClass)
                }
            }

            let newClassesSplit
            if(typeof newClasses == "object")
            {
                newClassesSplit = Object.keys(newClasses).filter(x=>newClasses[x])
            }
            else
            {
                newClassesSplit = newClasses.split(" ").filter(x => x != "")
            }
            for(const newClass of newClassesSplit)
            {
                this.classList.add(newClass)
            }
            return newClassesSplit
        }
        
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

    $model(element)
    {
        return (old) => {
            this.value = element.$value
            if(!old)
            {
                this.$on("input",()=>{
                    element.$value = this.value
                })
            }
            return true
        }
    }

    $child(el)
    {
        return (old) => {
            let sample = old

            if(Array.isArray(sample))
            {
                sample = sample[0]
            }

            if(Array.isArray(el))
            {
                el = el.map(x => {
                    if(!(x instanceof HTMLElement))
                    {
                        return document.createTextNode(x)
                    }
                    return x
                })
                if(sample)
                {
                    for(const item of el)
                    {
                        this.insertBefore(item, sample)
                    }
                }
                else
                {
                    for(const item of el)
                    {
                        this.appendChild(item)
                    }
                }

                if(old)
                {
                    if(Array.isArray(old))
                    {
                        for(const item of old)
                        {
                            item.remove()
                        }
                    }
                    else
                    {
                        old.remove()
                    }
                }
            }
            else
            {
                if(!(el instanceof HTMLElement))
                {
                    el = document.createTextNode(el)
                }

                if(sample)
                {
                    sample.replaceWith(el)
                }
                else
                {
                    this.appendChild(el)
                }
            }
            return el
        }
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
                let old;

                function event()
                {
                    old = builderInstance[item].apply(result, getParameters(item, params))(old)
                    return result
                }

                result.__events.push(event)
                old = builderInstance[item].apply(result, initializeParameters(item, params, result))()
                return result
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

  function getParameters(item, params)
  {
    var parameters = []
    for(const parameter of params)
    {
        const {element, properties} = dig(parameter)
        if(element?.$key == "ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62" && item != "$model")
        {
            parameters.push(element.$value)
        }
        else
        {
            parameters.push(element)
        }
    }
    return parameters
  }

  function initializeParameters(item, params, result)
  {
    var parameters = []
    for(const parameter of params)
    {
        const {element, properties} = dig(parameter)
        for(const item of properties)
        {
            if(item?.$key == "ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62" )
            {
                item.$subscribe(result)
            }
        }
        if(element?.$key == "ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62" )
        {
            if(item == "$model")
            {
                parameters.push(element)
            }
            else
            {
                parameters.push(element.$value)
            }
        }
        else
        {
            parameters.push(element)
        }
    }
    return parameters
  }