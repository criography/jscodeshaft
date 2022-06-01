import {
  getType,
  isElement,
  isTruthyString,
  isValidAttrValue,
  isPrimitive,
  isAttribute,
  isExpression,
  isObject,
} from '../typeChecking';
import {createLiteralOrLiteralExpression} from '../createNode';


/**
 * Ensures the input is 1 or more of truthy strings and expressed as array.
 * @param   {(string|string[])} input
 * @returns {string[]}
 */
const toTruthyStringArray = (input) => {
  const output = [];

  if (isTruthyString(input)) {
    output.push(input);
  } else if (Array.isArray(input) && input.length > 0) {
    output.push(...input.filter(item => isTruthyString(item)));
  }

  return output;
};


/**
 * Retrieves all attribute nodes from a given JSX Element path.
 * Can be optionally customised via options - if filtered by name
 * using `wantedAttributes` parameter and no matches are found,
 * no attributes will be returned. To make it return all attributes
 * instead, override with `emptyOnNoMatch=false`.
 * @param   {Node}            node
 * @param   {string|string[]} [wantedAttributes]
 * @param   {boolean}         [emptyOnNoMatch=true]
 * @returns {Node[]|undefined}
 */
export const getAttributes = (node, {
  wantedAttributes,
  emptyOnNoMatch = true,
} = {}) => {
  let output;

  if (isElement(node)) {
    output = node.openingElement.attributes;

    if (output && Array.isArray(output) && output.length > 0) {
      const wantedAttributesAsArray = toTruthyStringArray(wantedAttributes);

      if (wantedAttributesAsArray.length > 0) {
        const filteredAttrs = [];

        output.forEach(attr => {
          if (wantedAttributesAsArray.includes(attr.name.name)) {
            filteredAttrs.push(attr);
          }
        });

        console.log({filteredAttrs, emptyOnNoMatch});

        if (filteredAttrs.length > 0 || (filteredAttrs.length === 0 && emptyOnNoMatch)) {
          output = filteredAttrs;
        }
      }
    }
  }

  return output;
};


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
    } else if (Boolean(val && val.quasis)) {
      value = j.jsxExpressionContainer(val);

      // all other expressions [WIP]
    } else if (getType(val) && (val.expression || val.value)) {
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
 */
/**
 * Removes 1 or more traversal by name
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to manipulate
 * @returns {function(removeAttrsParams): Node[]}
 */
export const removeAttrs = (j, node) => attrNames => {
  let attrs = getAttributes(node);

  if (j && isElement(node) && (Array.isArray(attrNames) || isTruthyString(attrNames))) {
    const toRemove = toTruthyStringArray(attrNames);
    const filteredAttrs = attrs.filter(({name, type}) => (
      type === 'JSXSpreadAttribute'
      || (name && name.name && !toRemove.includes(name.name))
    ));

    node.openingElement.attributes = filteredAttrs;
  }

  return getAttributes(node);
};


/**
 * @typedef {function}    addAttrsParams
 * @param   {Node|Node[]} attributes       1 or more attribute nodes
 * @returns {Node[]}      Mutated collection of attribute nodes
 */
/**
 * Adds 1 pr more traversal to the given element node
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
    const attrs = getAttributes(node);
    if (isArray) {
      attrs.push(
        ...attributes.filter(attr => isAttribute(attr)),
      );
    } else {
      attrs.push(attributes);
    }
  }

  return getAttributes(node);
};


/**
 * @typedef {function}  renameAttrParams
 * @param   {string}    oldName   Existing attribute name
 * @param   {string}    newName   Wanted attribute name
 * @returns {array}     Mutated collection of attribute nodes
 */
/**
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
    const attr = getAttributes(node).find(
      ({name}) => name.name === oldName,
    );

    attr.name.name = newName;
  }

  return getAttributes(node);
};


/**
 * @typedef {function}  setAttrValueParams
 * @param   {string}    attrName   Existing attribute name
 * @param   {string}    newValue   New attribute value
 * @returns {array}     Mutated collection of attribute nodes
 */
/**
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
      const attr = getAttributes(node).find(
        ({name}) => name.name === attrName,
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

  return getAttributes(node);
};


/**
 * @typedef {function}  swapAttrParams
 * @param   {string}    name   Existing attribute name
 * @param   {string}    attr   Attribute node to swap with
 * @returns {array}     Mutated collection of attribute nodes
 */
/**
 * Swaps attribute by name with a new attribute node on a given element node
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to mutate
 * @returns {function(swapAttrParams): Node[]}
 */
export const swapAttr = (j, node) => (name, newAttr) => {
  const attrs = getAttributes(node);
  const targetIndex = attrs.findIndex(attr => attr.name.name === name);

  if (targetIndex >= 0) {
    attrs.splice(targetIndex, 1, newAttr);
  }

  return attrs;
};


/**
 * @typedef {function}  spreadObjectPropParams
 * @param   {object}    prop                Object prop
 * @param   {object}    [options]           Options
 * @param   {boolean}   [options.cleanup]   If true the source prop will be removed
 * @returns {void}
 */
/**
 * Consumes a prop node which contains an collection of other props
 * and flattens/inlines all those sub-props directly on the given
 * Element node, while (optionally) removing the input prop.
 *
 * @TODO add option for handling duplicates [ignore, replace]
 *
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to mutate
 * @returns {function(spreadObjectPropParams): Node[]}
 */
export const spreadObjectProp = (j, node) => (prop, {cleanup = false} = {}) => {
  const formatPropNames = name => ({
                                     'for': 'htmlFor',
                                     'class': 'className',
                                   }[name] || name);

  if (
    isElement(node)
    && isExpression(prop.value)
    && isObject(prop.value.expression)
    && Array.isArray(prop.value.expression.properties)
    && prop.value.expression.properties.length
  ) {
    const extractedProps = [];

    // Create an attribute from individual object properties
    prop.value.expression.properties.forEach(individual => {
      let propName;
      let propValue;


      if (individual.key.name) {
        propName = formatPropNames(individual.key.name);
      } else if (individual.key.raw) {
        propName = formatPropNames(individual.key.value);
      }


      if (individual.value) {
        if (individual.value.raw) {
          propValue = individual.value.value;
        } else {
          propValue = j.jsxExpressionContainer(individual.value);
        }
      }

      extractedProps.push(createAttr(j)(propName, propValue));
    });


    // add them all in
    if (extractedProps.length) {
      addAttrs(j, node)(extractedProps);
    }


    // remove the source prop
    if (cleanup) {
      removeAttrs(j, node)(prop.name.name);
    }
  }
};
