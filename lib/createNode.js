/**
 * @typedef {function}  elementArgs
 * @param   {string}    name        New element name
 * @param   {Node[]}    [children]  Element children nodes
 * @returns {Node}
 *//**
 * Create new element node
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(elementArgs): Node}
 */
const createElement = (j) => (name, children) => j.jsxElement(
  j.jsxOpeningElement(j.jsxIdentifier(name)),
  j.jsxClosingElement(j.jsxIdentifier(name)),
  children,
);


/**
 * @typedef {function}  specifierArgs
 * @param   {string}    name          Imported module name
 * @param   {string}    [alias]       Optional imported module alias
 * @returns {Node}
 *//**
 * Create new import specifier node
 * @TODO add support for default imports
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(specifierArgs): Node}
 */
const createImportSpecifier = j => (name, alias) => (
  j.importSpecifier(
    j.identifier(name),
    alias ? j.identifier(alias) : undefined,
  )
);




/**
 * @typedef {function}  createLiteralOrLiteralExpressionArgs
 * @param   {string}    val   Literal value
 * @returns {Node}
 *//**
 * Creates a literal value, which can be 1 of the following:
 * string | boolean | null | number | RegExp of type Literal.
 * @TODO add support for regex
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createLiteralOrLiteralExpressionArgs): (Node|null)}
 */
const createLiteralOrLiteralExpression = j => val => {
  let output;
  if(typeof val === 'string') {
    output = j.literal(val);
  }else if(['number', 'boolean'].includes(typeof val) || val === null){
    output = j.jsxExpressionContainer(j.literal(val));
  }

  return output
}



const createStringLiteral = j => val => j.stringLiteral(val)



/**
 * @typedef {function}  templateArgs
 * @param   {string[]}  quasis        Collection of quasis (literal fragments)
 * @param   {*[]}       expressions   Collection of literal nodes for primitives OR
 *                                    expressions containers for anything else.
 * @returns {Node}
 *//**
 * Create String Template Literal.
 * the order of composition will be always like this:
 * Q1 E1 Q2 E2 ... En Qn
 *
 * @TODO Accept primitives directly
 *
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(templateArgs): Node}
 * @see https://vramana.github.io/blog/2015/12/21/codemod-tutorial/
 * @see https://github.com/cpojer/js-codemod/blob/master/transforms/template-literals.js
 */
const createTemplateLiteral = j => (quasis, expressions) => (
  Array.isArray(quasis) && Array.isArray(expressions)
  ? j.templateLiteral(
    quasis.map((val, index) => (
      j.templateElement(
        {cooked: val, raw: val},
        (index === quasis.length - 1),
      )
    )), expressions,
  )
  : undefined
);


module.exports = {
  createElement,
  createStringLiteral,
  createImportSpecifier,
  createTemplateLiteral,
  createLiteralOrLiteralExpression
};
