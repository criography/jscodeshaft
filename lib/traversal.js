const {extractStringPropValue} = require('./general');


/**
 * In some cases you need to get all children that are either elements,
 * literals or expressions and ignore all text nodes that are just whitespace.
 * @param   {array} childrenNodes
 * @returns {array}
 */
const getMeaningfulChildren = childrenNodes => childrenNodes.filter(
  child => !(child.type === 'JSXText' && !child.value.trim())
);




module.exports = {
  getMeaningfulChildren,
};
