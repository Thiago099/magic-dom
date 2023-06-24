import applyCSSInline from "../../lib/css"
export { element }

class builder
{
    $css(css)
    {
        if(Array.isArray(css))
        {
            for(const item of css)
            {
                this.$css(item)
            }
        }
        else
        {
            this.__css.push(css)
            applyCSSInline(css, this)
        }
        return this
    }

    $child(element)
    {
        if(element instanceof HTMLElement)
        {

            if(element.$css)
            {
                element.$css(this.__css)
            }
        }
        else if(typeof(element) == "string")
        {
            var text = document.createTextNode(element)
            element = text
        }

        this.appendChild(element)

        return this
    }

    $on(event, callback)
    {
        document.addEventListener(event, callback)
        return this
    }

    $parent(element)
    {
        if(element.$child)
        {
            element.$child(this)
            this.$css(element.__css)
        }
        else
        {
            element.appendChild(this)
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
}

var builderInstance = new builder()

function element(name)
{
    let result

    result = document.createElement(name);

    result.__css = []
    result.__events = []

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

  

  