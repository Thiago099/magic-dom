export { state }



function state(value){
    const elements = new Set();

    const validator = {
        get(target, key) {
            if (key === '$subscribe') return subscribe;
            if (key === 'ce800a6b-1ecc-41dd-8ade-fb12cd3cdb62') return true;
            if (
                    typeof target[key] === 'object' &&
                    target[key] !== null
                ) 
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
                        for(const element of elements){
                            element.$update();
                        }
                    }
                };
        },
        set (target, key, _value) {
            target[key] = _value;
            for(const element of elements){
                element.$update();
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
        get $subscribe()
        {
            return subscribe
        },
        set $value(v)
        {
            value = v
            for(const element of elements){
                element.$update();
            }
        }
    }

    function subscribe(callback){
        // console.log('subscribe', callback);
        elements.add(callback);
    }


}