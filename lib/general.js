/**
 * Transform AST back to the source code.
 * `toSource` method accepts Recast's options.
 * Wrapping is disabled as it should be governed by our eslint.
 * @see https://github.com/benjamn/recast/blob/master/lib/options.ts
 *
 * @param   {object}  root    AST-ified file content
 * @returns {string}
 */
const astToSource = (root) => (
  root.toSource({
    lineTerminator: '\n',
    tabWidth: 2,
    wrapColumn: 9999,
  })
);


/**
 * Extract either literal or literal-in-expression `{"value"}` prop value.
 * Will not work with anything more complex
 * @param   {Node}    node
 * @param   {object}  node.value
 * @returns {string}
 */
const extractStringPropValue = ({value}) => {
  let val;

  if (value) {
    // string
    if (value.value) {
      val = value.value;
    }

    // `{"value"}` expression,die on anything more complex
    if (value.expression){
      if(typeof value.expression.value === 'string') {
        val = value.expression.value;
      }else{
        throw new Error('Cannot process function expressions')
      }
    }
  }

  return val;
};


module.exports = {
  astToSource,
  extractStringPropValue,
};
