import UseCSS from "../../lib/css"
export { element }
import { dig } from "./utils"
class builder
{
    $css(css)
    {
        let old;
        const self = this
        function up()
        {
            const current = UseCSS(css, self)
            current.Add()
            old = current
            return self
        }
        function down()
        {
            old.element.Remove()
        }
        return {up, down}
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

    $style(new_style)
    {
        let old;
        const self = this
        function down()
        {
            if(typeof old === "object")
            {
                for(const key in old)
                {
                    self.style.setProperty(key, null);
                }
            }
            else
            {
                const styles = old.split(';').filter((style) => style.length > 0);
                self.style = {}
                for(const style of styles) {
                    const [key, value] = style.split(':');
                    self.style.setProperty(key,null);
                }
            }
        }
        function up()
        {
            if(typeof new_style === "object")
            {
                for(const key in new_style)
                {
                    self.style.setProperty(key, new_style[key]);
                }
            }
            else
            {
                const styles = new_style.split(';').filter((style) => style.length > 0);
                for(const style of styles) {
                    const [key, value] = style.split(':');
                    self.style.setProperty(key,value);
                }
            }
            old = new_style
            return self
        }

        return { up, down }
    }

    $class(newClasses)
    {
        let old;
        const self = this
        function down()
        {
            if(old)
            {
                for(const oldClass of old)
                {
                    self.classList.remove(oldClass)
                }
            }
        }
        function up()
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
            for(const newClass of newClassesSplit)
            {
                self.classList.add(newClass)
            }
            old = newClassesSplit
            return self
        }
        return { up, down }
        
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
        const self = this
        function up(last)
        {
            self.value = element.value
            if(!last)
            {
                self.$on("input",()=>{
                    element.value = self.value
                })
            }
        }
        function down()
        {
            return true;
        }
        return {up, down}
    }

    $child(el)
    {
        const self = this
        let old;
        function down()
        {
            return old
        }
        function up(last)
        {
            if(Array.isArray(el))
            {
                if(last)
                {
                    for(const item of el)
                    {
                        self.insertBefore(item, last[0])
                    }
                    for(const item of last)
                    {
                        item.remove()
                    }
                }
                for(const item of el)
                {
                    self.$child(item)
                }
            }
            else
            {
                if(!(el instanceof HTMLElement))
                {
                    el = document.createTextNode(el)
                }

                if(last)
                {
                    last.replaceWith(el)
                }
                else
                {
                    self.appendChild(el)
                }
            }
            old = el
            return self
        }

        return {up, down}
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
                    const current = builderInstance[item].apply(result, parameters)
                    const res = current.up(old.down())
                    old = current
                    return res
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
                old = builderInstance[item].apply(result, parameters)
                return old.up()
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

  

  