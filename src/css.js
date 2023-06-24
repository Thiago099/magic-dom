import css from 'css'
export default applyCSSInline
function applyCSSInline(string, self) {
    var parsedCSS = css.parse(string)
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

                                element.style[property] = value;
                            }
                        }
                    }
                }
            }
        }
    }
}