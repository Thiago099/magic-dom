export { transform }
import css from "css"
function transform(code,id)
{
    const parsed = css.parse(code)
    const sheet = parsed.stylesheet.rules

    const matchRule = "[data-css-scope-jdbe=\""+id.substring(0,id.length-7).replace(/[^A-Za-z0-9]+/g,"-")+"\"]";

    loop(sheet)
    function loop(sheet)
    {
        for(const rule of sheet)
        {
            if(rule.type != "rule" && rule.rules != null)
            {
                loop(rule.rules)
                continue
            }
            for(const index in rule.selectors)
            {
                if(rule.selectors[index].includes(":scope"))
                {
                    rule.selectors[index] = rule.selectors[index].replace(/:scope/g, matchRule)
                }
                else
                {
                    rule.selectors[index] = matchRule+" "+rule.selectors[index]
                }
            }
        }
    }
    return css.stringify(parsed)
}