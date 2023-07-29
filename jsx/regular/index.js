
export {JSXFragment,JSXNode}
export * from '../../lib/ref.js'
export * from './state.js'

import { element } from "./element";
import { dig, callArray, callObject } from './utils.js';


const JSXFragment = (props, ...children) => undefined
const JSXNode = (name, props, ...children) => {
    var el;
    if (typeof name === 'function') {
        el = name(callObject(props), ...callArray(children));
        if(el === undefined)
        {
            return children
        }
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
        css: css =>{
            el.$css(css)
        },
        ref: (value) => {
            value.$element = el;
        },
        state: (value) =>{
            el.$state(value)
        },
        model: css =>{
            el.$model(css)
        },
        "grid-area": data =>{
            el.$style(`grid-area:${data}`)
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
            el[prop] = dig(props[prop])
        }
    }

    return el;
};
