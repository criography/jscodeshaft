// this can be easily determined from https://astexplorer.net

export const getType = node => node && node.type;


export const isElement = node => getType(node) === 'JSXElement' && Boolean(node.openingElement);
export const isHtmlElement = node => (
  isElement(node)
  && node.openingElement.name
  && node.openingElement.name.name
  && /[a-z]/.test(node.openingElement.name.name[0])
);
export const isFragment = node => getType(node) === 'JSXFragment';
export const isText = node => getType(node) === 'JSXText';
export const isFunction = node => getType(node) === 'FunctionDeclaration';
export const isExpression = node => getType(node) === 'JSXExpressionContainer';
export const isReturn = node => getType(node) === 'ReturnStatement';
export const isLiteral = node => getType(node) === 'Literal';
export const isTemplateLiteral = node => getType(node) === 'TemplateLiteral';
export const isArrow = node => getType(node) === 'ArrowFunctionExpression';
export const isAttribute = node => getType(node) === 'JSXAttribute';
export const isObject = node => getType(node) === 'ObjectExpression';
export const isValidImportSpecifier = node => ['ImportSpecifier', 'ImportDefaultSpecifier'].includes(getType(node));
export const isImport = node => getType(node) === 'ImportDeclaration';
export const isFunctionCall = (node) => Boolean(
  getType(node) === 'CallExpression'
  && node.callee
  && node.callee.name
)
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


export const isReactElement = node => path.value.openingElement.name.name;
