import UseCSS from "../../lib/css"
export { element }

class builder
{
    $css(css)
    {
        UseCSS(css, this).Add();
    }

    $child(element)
    {
        if(!(element instanceof HTMLElement))
        {
            element = document.createTextNode(element)
        }

        this.appendChild(element)

        return this
    }

    $on(event, callback)
    {
        this.addEventListener(event, callback)
        return this
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
        var newClassesSplit = newClasses.split(" ")
        for(const newClass of newClassesSplit)
        {
            this.classList.add(newClass)
        }
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
}

var builderInstance = new builder()

function element(name)
{
    let result

    result = document.createElement(name);

    for(const item of getFunctionsFromClass(builder))
    {
        result[item] = (...params) => {
            builderInstance[item].apply(result, params)
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

  

  