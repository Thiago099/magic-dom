
export {JSXFragment,JSXNode}
export * from '../../lib/ref.js'
export * from './state.js'
import { element } from "./element";
import { dig, callArray, callObject } from './utils.js';


const JSXFragment = (props, ...children) => undefined
const JSXNode = (name, props, ...children) => {
    let el;
    if (typeof name === 'function') {
        el = name(callObject(props), ...callArray(children));
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
            if(child.$key == "471ddd10-6cc3-429b-ba9a-5f4250686d4a")
            {
                el.$child(child)
            }
            else
            {
                el.__child(child)
            }
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
        if: condition =>{
            el.$if(condition)
        },

        model: css =>{
            el.$model(css)
        },
        "grid-area": data =>{
            el.$style(`grid-area:${data}`)
        }
    }
    const simpleHandles = {
        // parent: container =>{
        //     el.$parent(container)
        // },
        style: style=>{
            el.__style(style)
        },
        if: condition =>{
            el.__if(condition)
        },
        class: _class => {
            el.__class(_class)
        },
        ref: (value) => {
            value.$element = el;
        },
        css: css =>{
            el.__css(css)
        },
        "grid-area": data =>{
            el.__style(`grid-area:${data}`)
        }
    }

    const directList = ["disabled"]

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
        if(Object.keys(handlers).includes(prop) && props[prop].$key == "471ddd10-6cc3-429b-ba9a-5f4250686d4a")
        {
            handlers[prop](props[prop])
        }
        else if(Object.keys(simpleHandles).includes(prop))
        {
            simpleHandles[prop](props[prop])
        }
        else
        {
            el.$prop(prop, props[prop])
        }

    }

    return el;
};
