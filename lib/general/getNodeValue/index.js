/**
 * Extract either literal or literal-in-expression `{"value"}` prop value.
 * Return full expression node if non-literal value detected, which also
 * applies to regex and template literals.
 * NB: This can be used in few places, e.g. element prop values or object
 * properties but will require unique approach for other constructs.
 * @TODO should it be in traversal.js?
 * @param   {Node}    node
 * @param   {object}  node.type
 * @param   {object}  [node.value]
 * @returns {string}
 */
export const getNodeValue = ({type, value}) => {
  let val;

  if (value) {
    // string
    if (value.value) {
      val = value.value;
    }

    // `{value}` expression
    if (value.expression){
      // simple literal
      if(
        ['number', 'string', 'boolean'].includes(typeof value.expression.value)
        || value.expression.value === null
      ) {
        val = value.expression.value;

      // everything else
      } else if (value.expression.name !== 'undefined'){
        val = value.expression;
      }
    }

  // value-less props
  }else if (type) {
    val = true;
  }

  return val;
};
