export { state }



function state(value){
    const elements = new Set();
    let canUpdate = true


    const validator = {
        get(target, key) {
            if (key === '$on') return on;
            if (key === '$update') return update;
            if (key === '$subscribe') return subscribe;
            if (key === '$unsubscribe') return unsubscribe;
            if (key === '$key') return "ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62";
            if (key === '$content') return target;
            if (key === '$value') return target;

            if(typeof(key) === "string" && key.startsWith("$"))
            {
                key = key.substring(1)
                return {
                    get $key() {
                        return 'ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62';
                    },
                    get $value(){
                        return target[key]
                    },
                    get $content(){
                        return target[key]
                    },
                    get $subscribe()
                    {
                        return subscribe
                    },
                    get $update()
                    {
                        return update
                    },
                    get $on()
                    {
                        return on
                    },
                    set $value(v)
                    {
                        if(target[key] != v)
                        {
                            target[key] = v
                            update()
                        }
                    },
                    set $content(v)
                    {
                        target[key] = v
                    }
                }
            }


            if(typeof(target[key]) === "function")
            {
                return (...params) => {
                    let result = target[key].apply(target, params)
                    update()
                    return result
                }
            }
            
            if ( target[key] != null && typeof target[key] === 'object') 
            {
                return new Proxy(target[key], validator)
            }

            return target[key]
        },
        set (target, key, _value) {
            if(target[key] != _value)
            {
                target[key] = _value;
                update()
            }
          return true
        }
      }

    if(typeof(value) == "object")
    {
        return new Proxy(value, validator);
    }

    return {
        get $key() {
            return 'ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62';
        },
        get $value(){
            return value
        },
        get $content(){
            return value
        },
        get $subscribe()
        {
            return subscribe
        },
        get $unsubscribe()
        {
            return unsubscribe
        },
        get $on()
        {
            return on
        },
        get $update()
        {
            return update
        },
        set $value(v)
        {
            value = v
            update()
        },
        set $content(v)
        {
            value = v
        }
    }

    function on(item)
    {
        elements.add({__update:item})
    }

    function subscribe(item){
        item.__state.push(this)
        elements.add(item);
    }
    function unsubscribe(item){
        elements.delete(item);
    }
    function update()
    {
        if(!canUpdate) return

        canUpdate = false

        try
        {
            for(const element of elements){
                element.__update();
            }
        }
        finally
        {
            canUpdate = true
        }

    }


}