/**
 * In some cases you need to get all children that are either elements,
 * literals or expressions and ignore all text nodes that are just whitespace.
 * @param   {array} childrenNodes
 * @returns {array}
 */
const getMeaningfulChildren = childrenNodes => childrenNodes.filter(
  child => !(child.type === 'JSXText' && !child.value.trim())
);


/**
 * Checks if given path is has a JSX Element or Fragment as a parent.
 * Alternatives include: 'ReturnStatement', 'ArrowFunctionExpression',
 * 'LogicalExpression', etc.
 * @param   {object}  path
 * @param   {object}  [options]
 * @param   {object}  [options.allowFragment=true]
 * @returns {boolean}
 */
const isParentJsxElement = (path, {allowFragment = true} = {}) => (
  path.parentPath
  && Array.isArray(path.parentPath.value)
  && path.parentPath.parentPath
  && path.parentPath.parentPath.value
  && (
    path.parentPath.parentPath.value.type === 'JSXElement'
    || (allowFragment && path.parentPath.parentPath.value.type === 'JSXFragment')
  )
)


module.exports = {
  getMeaningfulChildren,
  isParentJsxElement,
};
