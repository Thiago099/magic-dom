
export {JSXFragment,JSXNode}
import { element } from "./element";
export * from '../../lib/ref.js'

const JSXFragment = (props, ...children) => undefined
const JSXNode = (name, props, ...children) => {
    let el;
    if (typeof name === 'function') {
        el = name(props, ...children);
        if(el === undefined)
        {
            return children
        }
        return el
    }
    else
    {
        el = element(name);
        for(const child of children)
        {
            el.$child(child)
        }
    }

    const handlers = {
        // parent: container =>{
        //     el.$parent(container)
        // },
        style: style=>{
            el.$style(style)
        },
        class: _class => {
            el.$class(_class)
        },
        scope: _class => {
            el.$scope(_class)
        },
        css: css =>{
            el.$css(css)
        },
        ref: (value) => {
            value.$element = el;
        },
        if: (value) => {
            el.$if(value)
        },
    }

    const extraHandles = {
        "on": (event,callback) =>
        {

            el.$on(event,callback)
        },

    }

    for(let prop in props)
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
            el.$prop(props[prop])
        }
    }

    return el;
};