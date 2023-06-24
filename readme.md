# Magic dom

Base jsx vite plugin that interacts well with the dom

instalation:
```js
import { defineConfig } from "vite"
import { MagicDomVitePlugin, MagicDomLiteVitePlugin }  from "magic-dom/vite-plugin"
export default defineConfig({
    plugins:[
        MagicDomVitePlugin(),
    ],
```

you can either use the lite or the regular version, after that you can crate a jsx file in your
vite project and use this syntax

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

add a css that is valid to the element and its children
```jsx
div.$css(".class{color:red}")
```

(non lite version only) all variables that are passed to the element retained, so when you call
the update it fetches them again
```jsx
div.$update()
```