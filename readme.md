# Magic dom

## Explanation

This is a frontend library that allow you to use jsx syntax. This library has two setup options, a lite weight version that does not track your variables, and a complete version that allow you to call a update function that fetches all the variables again. note that it access them again so you might want to use for(const item of data) instead of for(let item of data) 

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
## non lite version only

all variables that are passed to the element(both trough jsx and the $ methods) retained, so when you call
the update it fetches them again
```jsx
div.$update()
```

State will automatically update when it is changed
```jsx
var myState = state("hello");
var myDiv = <div>{myState}</div>
myState.$value = "world"
```

you can pass a object and or array trough the state
```jsx
var myState = state({myProperty:"hello"});
var myDiv = <div>{myState.myProperty}</div>
myState.myProperty.$value = "world"
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