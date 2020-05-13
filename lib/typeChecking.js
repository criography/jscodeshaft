// this can be easily determined from https://astexplorer.net

export const getType = node => node && node.type;


export const isElement = node => getType(node) === 'JSXElement' && node.openingElement;
export const isFragment = node => getType(node) === 'JSXFragment';
export const isFunction = node => getType(node) === 'FunctionDeclaration';
export const isExpression = node => getType(node) === 'JSXExpressionContainer';
export const isReturn = node => getType(node) === 'ReturnStatement';
export const isLiteral = node => getType(node) === 'Literal';
export const isArrow = node => getType(node) === 'ArrowFunctionExpression';
export const isAttribute = node => getType(node) === 'JSXAttribute';

export const isValidAttrValue = node => (
  typeof node === 'undefined'
  || isArrow(node)
  || isLiteral(node)
  || isExpression(node)
);

export const isTruthyString = val => val && typeof val === 'string';

export const isPrimitive = val => (
  val === null
  || ['string', 'number', 'boolean'].includes(typeof val)
);
