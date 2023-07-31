# Magic dom

## Explanation

This is a frontend library that allow you to use jsx syntax. This library has two setup options, a simple version that does not track your variables, and a complete version with reactivity.

The result of a jsx element creation, is a dom element, with added extra functionality.

example:

```jsx
let myDiv = <div></div>
```

myDiv return a dom element, with the added functionality listed below

## instalation:

```
npm create magic-dom@latest my-project-name
cd my-project-name
npm i
```

## dev server
```
npm run dev
```

## build for production

```
npm run build
```

## configure

if you are not interested in reactivity you can opt for the lite version, just replace
the plugin import to `MagicDomLiteVitePlugin` in the `vite.config.js`

```jsx
import { MagicDomVitePlugin, MagicDomLiteVitePlugin }  from "magic-dom/vite-plugin"

export default defineConfig({
    plugins:[
        MagicDomLiteVitePlugin(), // <--
    ],
    //...
})
```

## Usage

create the element
```jsx
const div = <div class="class1 class1" style="key1:value1;key2:value2"></div>
```
or
```jsx
const div = <div class={{class1:true, class1:true}} style={{key1:value1, key2:value2}}></div>
```


sets inline style to the element
```jsx
div.$style("background-color:red")
```

adds a event listener to the element
```jsx
div.$on("click",()=>{
    console.log("hello")
})
```

add the element as child to another element
```jsx
div.$parent(document.body)
```

add children to the element
```jsx
div.$child(<div></div>)
```

add a class to the element
```jsx
div.$class("class1 class2")
```

you can add style using css syntax, however it will only update when the element updates
```jsx
div.$css(".class{color:red}")
```

you can acess your object trough ref, most vanilla dom functions and all functions added by this library should work,
if they don't just use myRef.$element instead
```jsx
myRef = ref()

let element =
<div>
    <button ref={myRef}>Test</button>
</div>

myRef.$on("click",()=>{
    console.log("clicked")
})
```

you can create function components

```jsx
function Component({text},child1, child2)
{
    return <div>{text} {child1} {child2}</div>;
}

const instance = <Component text="hello world">content</Component>
```

## non lite version only

all letiables that are passed to the element(both trough jsx and the $ methods) retained, so when you call
the update it fetches them again or use state that will fetch them automatically

 note that in the complete version you might want to use for(const item of data), for(let item of data) instead of for(var item of data) as it fetches the letiables again from the context
```jsx
div.$update()
```

State will automatically update when it is changed
```jsx
let name = state("");
let myDiv = <div>{"hello " + name.value}</div>
name.value = "thiago"
```

you can pass a object and or array trough the state
```jsx
let myState = state({myProperty:"hello"});
let myDiv = <div>{myState.myProperty}</div>
myState.myProperty = "world"
```

you can use the if to hide elements

```jsx
const condition = state(false)
let myDiv = <div if={condition.value}>conditional display</div>
```
or
```jsx
const condition = state(false)
let myDiv = <div>conditional display</div>
myDiv.$if(condition.value)
```

You can use the model keyword to sync a state with a input value
```jsx
const myState = state({myProperty:"myText"})
let myInput = <input model={myState.$myProperty}/>
myState.myProperty = "newText"

```
or 
```jsx
const myState = state("myText")
let myInput = <input model={myState}/>
myState.value = "newText"
```


