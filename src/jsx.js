
export {JSXFragment,JSXNode}
import { element } from "./builder";
const JSXFragment = (props, ...children) => undefined

const JSXNode = (name, props, ...children) => {
    var el;
    if (typeof name === 'function') {
        el = name(props, ...children);
        if(el === undefined)
        {
            return children
        }
    }
    else
    {
        el = element(name);
    }

    for(const child of children)
    {
        el.$child(child)
    }

    const handlers = {
        style: style=>{
            el.$style(style)
        },
        class: _class => {
            el.className = _class
        },
        css: css =>{
            el.$css(css)
        }
    }

    const extraHandles = {
        "on": (event,callback) =>
        {

            el.$on(event,callback)
        },

    }

    for(var prop in props)
    {
        const splitProp = prop.split(":");
        if(splitProp.length == 2)
        {
            if(extraHandles[splitProp[0]])
            {
                extraHandles[splitProp[0]](splitProp[1],props[prop])
            }
        }
        else
        if(Object.keys(handlers).includes(prop))
        {
            handlers[prop](props[prop])
        }
        else
        {
            el[prop] = props[prop]
        }
    }

    return el;
};