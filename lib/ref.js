export function ref(ref_object = null)
{
    var $element = ref_object

    const proxy = new Proxy({}, {
        get: (target, name) =>{
            if ($element != null) {
                if (typeof $element[name] === 'function') {
                    // check if the nameerty is a function
                    return function(...args) {
                      const result = $element[name].apply($element, args); // call the method on the real element
                      return result; // otherwise, return the original result
                    }.bind(this);
                  } else {
                    return $element[name]; // pass through any other property access
                  }
                }
        },
        set: (target, name, value) => {
            if(name === "$element") $element = value
            if (value != null) {
                $element[name] = value
                return true
            }
            return true;
        }
    })

    return proxy
}