/**
 * @typedef {function}  attributeArgs
 * @param   {string}  name      Attribute name
 * @param   {string}  [val]     Attribute string literal value
 * @returns {Node}
 *//**
 * Create new element attribute attribute
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(attributeArgs): Node}
 */
const createLiteralAttr = (j) => (name, val) => (
  j.jsxAttribute(
    j.jsxIdentifier(name),
    val ? j.stringLiteral(val) : undefined,
  )
);


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
const createElement = (j) => (name, children) => (
  j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier(name)),
    j.jsxClosingElement(j.jsxIdentifier(name)),
    children,
  )
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



const createStringLiteral = j => val => j.stringLiteral(val)



/**
 * @typedef {function}    templateArgs
 * @param   {string[]}    quasis          Collection of quasis (literal fragments)
 * @param   {*[]}         expressions     Collection of expressions
 * @returns {Node}
 *//**
 * Create String Template Literal.
 * the order of composition will be always like this:
 * Q1 E1 Q2 E2 ... En Qn
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
    )), expressions
  )
  : undefined
);


module.exports = {
  createStringLiteral,
  createLiteralAttr,
  createElement,
  createImportSpecifier,
  createTemplateLiteral,
};
