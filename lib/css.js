import css from 'css'
export default UseCSS


function UseCSS(string, self)
{
    try
    {
        var parsedCSS = css.parse(string)
    }
    catch
    {
        console.error(`Failed to parse css ${string}`)
        return {Add:()=>{},Remove:()=>{}}
    }
    function Add()
    {
        if (parsedCSS && parsedCSS.stylesheet && parsedCSS.stylesheet.rules) {
            const rules = parsedCSS.stylesheet.rules;
            for (const rule of rules) {
                if (rule.type === 'rule') {
                    const selectors = rule.selectors;
                    const declarations = rule.declarations;
    
                    if (selectors && declarations) {
                        for (const selector of selectors) {
                            const elements = self.querySelectorAll(selector);
                            for (const element of elements) {
                                for (const declaration of declarations) {
                                    const { property, value } = declaration;
                                    element.style.setProperty(property,value);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    function Remove()
    {
        if (parsedCSS && parsedCSS.stylesheet && parsedCSS.stylesheet.rules) {
            const rules = parsedCSS.stylesheet.rules;
            for (const rule of rules) {
                if (rule.type === 'rule') {
                    const selectors = rule.selectors;
                    const declarations = rule.declarations;
    
                    if (selectors && declarations) {
                        for (const selector of selectors) {
                            const elements = self.querySelectorAll(selector);
                            for (const element of elements) {
                                for (const declaration of declarations) {
                                    const { property, value } = declaration;
                                    element.style.setProperty(property,null);
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    return {Add,Remove}
}
