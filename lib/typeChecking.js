// this can be easily determined from https://astexplorer.net

const getType = node => node && node.type;


const isElement = node => getType(node) === 'JSXElement' && node.openingElement;
const isFragment = node => getType(node) === 'JSXFragment';
const isFunction = node => getType(node) === 'FunctionDeclaration';
const isExpression = node => getType(node) === 'JSXExpressionContainer';
const isReturn = node => getType(node) === 'ReturnStatement';
const isLiteral = node => getType(node) === 'Literal';
const isArrow = node => getType(node) === 'ArrowFunctionExpression';
const isAttribute = node => getType(node) === 'JSXAttribute';

const isValidAttrValue = node => (
  typeof node === 'undefined'
  || isArrow(node)
  || isLiteral(node)
  || isExpression(node)
);

const isTruthyString = val => val && typeof val === 'string';

const isPrimitive = val => (
  val === null
  || ['string', 'number', 'boolean'].includes(typeof val)
);

module.exports = {
  getType,
  isElement,
  isFragment,
  isFunction,
  isExpression,
  isReturn,
  isLiteral,
  isTruthyString,
  isValidAttrValue,
  isPrimitive,
  isAttribute
}
