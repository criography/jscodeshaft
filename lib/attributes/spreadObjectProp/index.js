import {
  isElement,
  isExpression,
  isObject,
} from '../../typeChecking';
import { addAttrs } from '../addAttrs';
import { removeAttrs } from '../removeAttrs';

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

      extractedProps.push(createAttribute(j)(propName, propValue));
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
