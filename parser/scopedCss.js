export { transform }
import css from "css"
function transform(code,id)
{
    const parsed = css.parse(code)
    const sheet = parsed.stylesheet.rules

    const matchRule = "[data-css-scope-jdbe=\""+id.substring(0,id.length-7).replace(/[^A-Za-z0-9]+/g,"-")+"\"]";

    for(const rule of sheet)
    {
        for(const index in rule.selectors)
        {
            if(rule.selectors[index].includes(":root"))
            {
                rule.selectors[index] = rule.selectors[index].replace(/:root/g, matchRule)
            }
            else
            {
                rule.selectors[index] = matchRule+" "+rule.selectors[index]
            }
        }
    }
    return css.stringify(parsed)
}