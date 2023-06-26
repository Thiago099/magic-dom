import UseCSS from "../../lib/css"
export { element }

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
        this.addEventListener(event, callback)
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
        var newClassesSplit = newClasses.split(" ")
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
    }

    $parent(element)
    {
        element.appendChild(this)
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
}

var builderInstance = new builder()

var blacklist = [
    "$on",
    "$update",
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
                builderInstance[item].apply(result, params)
            }
        }
        else
        {
            result[item] = (...params) => {
                params.push({})
                function event()
                {
                    builderInstance[item].apply(result, params.map(p => typeof p === 'function' ? p() : p))
                }
                event()
                result.__events.push(event)
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

  

  