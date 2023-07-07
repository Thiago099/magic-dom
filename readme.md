# Magic dom

## Explanation

This is a frontend library that allow you to use jsx syntax. This library has two setup options, a lite weight version that does not track your variables, and a complete version with reactivity. note that in the complete version you might want to use for(const item of data) instead of for(let item of data) as it fetches the variables again from the context

The result of a jsx element creation, is a dom element, with added extra functionality.

example:

```jsx
var myDiv = <div></div>
```

myDiv return a dom element, with the added functionality listed below

## instalation:

run
```
npm create vite
chose vanilla
cd to your project folder
npm install
```
create a vite.config.js with the following code:

you can either use the lite or the regular version, after that you can create a jsx file in your
vite project and use this syntax

```js
import { defineConfig } from "vite"
import { MagicDomVitePlugin, MagicDomLiteVitePlugin }  from "magic-dom/vite-plugin"
export default defineConfig({
    plugins:[
        MagicDomVitePlugin(),
    ],
})
```

alternatively you can clone this repository where i've already done this for you:

```
git clone https://github.com/Thiago099/magic-dom-vite-example your-project-name
```

## Usage

create the element
```jsx
const div = <div></div>
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

add a css to the element and its children
```jsx
div.$css(".class{color:red}")
```

you can acess your object trough ref, most vanilla dom functions and all functions added by this library should work,
if they don't just use myRef.$element instead
```jsx
myRef = ref()

var element =
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

all variables that are passed to the element(both trough jsx and the $ methods) retained, so when you call
the update it fetches them again or use state that will fetch them automatically
```jsx
div.$update()
```

State will automatically update when it is changed
```jsx
var myState = state("hello");
var myDiv = <div>{myState}</div>
myState.value = "world"
```

when calculating something with the state, the library will not be able
to get the state from the operation, which can be mitigated trough the subscribe
```jsx
var myState = state("hello");
var myDiv = <div state={myState}>{myState.value + " world"}</div>
myState.value = "hi"
```
or
```jsx
var myState = state("hello");
var myDiv = <div>{myState.value + " world"}</div>
myDiv.$state(myState)
myState.value = "hi"
```

you can pass a object and or array trough the state
```jsx
var myState = state({myProperty:"hello"});
var myDiv = <div>{myState.myProperty}</div>
myState.myProperty.value = "world"
```

You can use the model keyword to sync a state with a input value
```jsx
var myInput = <input model={myState}/>
```
or 
```jsx
var myInput = <input/>
myInput.$model(myState)
```


non static parameters will be passed as a function, that can either be used in
the elements, or read by calling it

```jsx
function Component({text},child1,child2)
{
    console.log(text())
    return <div>{text} {child1} {child2}</div>;
}
var text = "hi"
const instance = <Component text={text}>content</Component>
```

