import {
  getType,
  isElement,
  isTruthyString,
  isValidAttrValue,
  isPrimitive,
  isAttribute,
} from './typeChecking';
import {createLiteralOrLiteralExpression} from './createNode';


/**
 * Ensures the input is 1 or more of truthy strings and expressed as array.
 * @param   {(string|string[])} input
 * @returns {string[]}
 */
const _toTruthyStringArray = (input) => {
  const output = [];

  if(isTruthyString(input)){
    output.push(input)
  }else if(Array.isArray(input) && input.length > 0){
    output.push(...input.filter(item => isTruthyString(item)))
  }

  return output;
}


/**
 * Retrieves attribute nodes from a given element path.
 * If no `wantedAttrs` passed, all attributes will be returned.
 * If element has no attributes, the source node will be returned.
 * @param   {object}            node            Valid element node
 * @param   {(string|string[])} [wantedAttrs]   One or more attribute names to match
 * @returns {any[]}
 */
export const getAttrs = (node, wantedAttrs) => {
  let output;

  if(isElement(node)){
    const filteredAttrs = [];
    output = node.openingElement.attributes;

    // if any attributes exist on element:
    if(output && Array.isArray(output) && output.length > 0){
      const wantedAttrsAsArray = _toTruthyStringArray(wantedAttrs);

      if(wantedAttrsAsArray.length){
        output.forEach(attr => {
          if(wantedAttrsAsArray.includes(attr.name.name)){
            filteredAttrs.push(attr)
          }
        });

        output = filteredAttrs;
      }
    }
  }

  return output;
}


/**
 * @typedef {function}  createPrimitiveAttrParams
 * @param   {string}    name  Attribute name
 * @param   {any}       val   Attribute literal value
 * @returns {(Node|boolean)}
 *//**
 * Creates a new attribute.
 * Boolean, number and string literals can be passed directly
 * While all other types, including template and regex literals
 * must be passed as predefined nodes.
 *
 * @TODO add support for 'undefined'
 * @TODO check support for all other expressions
 * @see createNode::createTemplateLiteral
 *
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createPrimitiveAttrParams): (Node|boolean)}
 */
export const createAttr = (j) => (name, val) => {
  let output = false;

  if (j && isTruthyString(name)) {
    let value;

    // false, string, number, null
    if (isPrimitive(val) && val !== true) {
      value = createLiteralOrLiteralExpression(j)(val);
    // template literal
    } else if(Boolean(val && val.quasis)){
      value = j.jsxExpressionContainer(val)
    // all other expressions [WIP]
    }else if (getType(val) && (val.expression || val.value)){
      value = val;
    }


    output = (
      value
      ? j.jsxAttribute(
          j.jsxIdentifier(name),
          value,
        )
      : j.jsxAttribute(
          j.jsxIdentifier(name),
        )
    );
  }

  return output;
};


/**
 * @typedef {function}            removeAttrsParams
 * @param   {(string|string[])}   attrNames   Attribute name
 * @returns {Node[]}                          Mutated collection of attribute nodes
 *//**
 * Removes 1 or more attributes by name
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to manipulate
 * @returns {function(removeAttrsParams): Node[]}
 */
export const removeAttrs = (j, node) => attrNames => {
  let attrs = getAttrs(node);

  if (j && isElement(node) && (Array.isArray(attrNames) || isTruthyString(attrNames))){
    const toRemove = _toTruthyStringArray(attrNames);
    const filteredAttrs = attrs.filter(({name}) => !toRemove.includes(name.name));

    if(filteredAttrs.length){
      node.openingElement.attributes = filteredAttrs;
    }
  }

  return getAttrs(node);
};


/**
 * @typedef {function}    addAttrsParams
 * @param   {Node|Node[]} attributes       1 or more attribute nodes
 * @returns {Node[]}      Mutated collection of attribute nodes
 */
/**
 * Adds 1 pr more attributes to the given element node
 * @param   {function}  j     JSCodeShift instance
 * @param   {Node}      node  Element node to mutate
 * @returns {function(addAttrsParams)}
 */
export const addAttrs = (j, node) => (attributes) => {
  const isArray = Array.isArray(attributes);

  if (
    j
    && isElement(node)
    && (isAttribute(attributes) || isArray)
  ) {
    const attrs = getAttrs(node);
    if (isArray) {
      attrs.push(
        ...attributes.filter(attr => isAttribute(attr))
      );
    } else {
      attrs.push(attributes);
    }
  }

  return getAttrs(node);
};


/**
 * @typedef {function}  renameAttrParams
 * @param   {string}    oldName   Existing attribute name
 * @param   {string}    newName   Wanted attribute name
 * @returns {array}     Mutated collection of attribute nodes
 *//**
 * Renames attribute on the given element node
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to mutate
 * @returns {function(renameAttrParams): Node[]}
 */
export const renameAttr = (j, node) => (oldName, newName) => {
  if (
    j
    && isElement(node)
    && isTruthyString(oldName)
    && isTruthyString(newName)
  ) {
    const attr = getAttrs(node).find(
      ({name}) => name.name === oldName
    );

    attr.name.name = newName;
  }

  return getAttrs(node);
};


/**
 * @typedef {function}  setAttrValueParams
 * @param   {string}    attrName   Existing attribute name
 * @param   {string}    newValue   New attribute value
 * @returns {array}     Mutated collection of attribute nodes
 *//**
 * Sets given attribute's value on an element node
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to mutate
 * @returns {function(setAttrValueParams): Node[]}
 */
export const setAttrValue = (j, node) => (attrName, newValue) => {
  if (
    j
    && isElement(node)
    && isTruthyString(attrName)
  ) {
    const _isValueNode = isValidAttrValue(newValue);
    const _isPrimitive = isPrimitive(newValue);

    if (_isValueNode || _isPrimitive) {
      let sanitisedValue;
      const attr = getAttrs(node).find(
        ({name}) => name.name === attrName
      );

      if (_isPrimitive) {
        sanitisedValue = createLiteralOrLiteralExpression(j)(newValue);
      }

      if (_isValueNode) {
        sanitisedValue = newValue;
      }

      if (sanitisedValue) {
        if (sanitisedValue.expression && sanitisedValue.expression.value === true) {
          delete attr.value;
        } else {
          attr.value = sanitisedValue;
        }
      }
    }
  }

  return getAttrs(node);
};


/**
 * @typedef {function}  swapAttrParams
 * @param   {string}    name   Existing attribute name
 * @param   {string}    attr   Attribute node to swap with
 * @returns {array}     Mutated collection of attribute nodes
 *//**
 * Swaps attribute by name with a new attribute node on a given element node
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to mutate
 * @returns {function(swapAttrParams): Node[]}
 */
export const swapAttr = (j, node) => (name, newAttr) => {
  const attrs = getAttrs(node);
  const targetIndex = attrs.findIndex(attr => attr.name.name === name);

  if(targetIndex >= 0){
    attrs.splice(targetIndex, 1, newAttr)
  }

  return attrs;
};
