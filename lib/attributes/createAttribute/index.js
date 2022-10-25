import { getType, isPrimitive } from '../../typeChecking';
import {
  createLiteralOrLiteralExpression,
  createUndefinedExpression
} from '../../createNode';
import { isValidAttributeName } from '../isValidAttributeName'


/**
 * @typedef {function}  createAttributeParams
 * @param   {string}    name    Attribute name
 * @param   {any}       value   Attribute literal value
 * @returns {(Node|null)}
 *//**
 * Creates a new attribute.
 * Null, Undefined, boolean, number and string literals can be passed directly
 * While all other types, including template and regex literals
 * must be passed as predefined nodes.
 *
 * @see createNode::createTemplateLiteral
 *
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createAttributeParams): (Node|boolean)}
 */
export const createAttribute = (j) => (name, value) => {
  let output = null;

  if (j && isValidAttributeName(name)) {
    let valueNode;

    // false, string, number, null
    if (isPrimitive(value) && value !== true) {
      valueNode = createLiteralOrLiteralExpression(j)(value);

    // undefined
    }else if(value === undefined){
      valueNode = createUndefinedExpression(j);

    // template literal
    } else if (Boolean(value && value.quasis)) {
      valueNode = j.jsxExpressionContainer(value);

    // all other expressions [WIP]
    } else if (getType(value) && (value.expression || value.value)) {
      valueNode = value;
    }

    // this caters for boolean props set to true, and
    // renders them value-less instead of `={true}`
    output = (
      valueNode
      ? j.jsxAttribute(
        j.jsxIdentifier(name),
        valueNode,
      )
      : j.jsxAttribute(
        j.jsxIdentifier(name),
      )
    );
  }

  return output;
};
