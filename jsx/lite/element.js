import UseCSS from "../../lib/css"
export { element }

class builder
{
    $css(css)
    {
        UseCSS(css, this).Add();
        return this
    }

    $child(el)
    {
        if(Array.isArray(el))
        {
            for(const item of el)
            {
                this.$child(item)
            }
        }
        else
        {
            if(!(el instanceof HTMLElement))
            {
                el = document.createTextNode(el)
            }
            this.appendChild(el)
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

    $getComputedStyle(name)
    {
        return window.getComputedStyle(this).getPropertyValue(name)
    }

    $parent(element)
    {
        if(element.$child)
        {
            element.$child(this)
        }
        else
        {
            element.appendChild(this)
        }

        return this
    }

    
    $class(newClasses)
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
            this.classList.add(newClass)
        }
        return this
    }

    $style(new_style)
    {
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
        return this
    }
    
    $if(condition)
    {
        if(!condition)
        {
            this.style.display = "none"
        }
    }
}

const builderInstance = new builder()

function element(name)
{
    let result

    result = document.createElement(name);

    for(const item of getFunctionsFromClass(builder))
    {
        result[item] = (...params) => {
            return builderInstance[item].apply(result, params)
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

  

  