export { state }



function state(value){
    const elements = new Set();

    let canUpdate = true
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

    const validator = {
        get(target, key) {
            if (key === '$on') return on;
            if (key === '$subscribe') return subscribe;
            if (key === '$key') return "ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62";
            if (key === '$value') return target;

            if(target[key] == undefined) return undefined
            if(target[key] == null) return null

            if(typeof(target[key]) === "function")
            {
                return (...params) => {
                    var result = target[key].apply(target, params)
                    update()
                    return result
                }
            }
            
            if (typeof target[key] === 'object') 
            {
                return new Proxy(target[key], validator)
            }

            return {
                get $key() {
                    return 'ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62';
                },
                get $value(){
                    return target[key]
                },
                get $subscribe()
                {
                    return subscribe
                },
                set $value(v)
                {
                    target[key] = v
                    update()
                }
            };
        },
        set (target, key, _value) {
            target[key] = _value;
            update()
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
        get $subscribe()
        {
            return subscribe
        },
        get $on()
        {
            return on
        },
        set $value(v)
        {
            value = v
            update()
        }
    }

    function on(callback)
    {
        elements.add({__update:callback})
    }

    function subscribe(callback){
        // console.log('subscribe', callback);
        elements.add(callback);
    }


}