import { isElement, isAttribute } from '../../typeChecking';
import { getAttributes } from '../getAttributes';
import {swapAttr} from '../swapAttr';

/**
 * @typedef {function}    addAttrsParams
 * @param   {Node|Node[]} attributes              1 or more attribute nodes
 * @param   {boolean}     [overrideExisting=true] If true, overwrites existing attributes
 *                                                of the same name
 * @returns {Node[]|null}                         Mutated collection of attribute nodes
 *//**
 * Adds 1 or more attribute to the given element node
 * @param   {function}  j     JSCodeShift instance
 * @param   {Node}      node  Element node to mutate
 * @returns {function(addAttrsParams)}
 */
export const addAttributes = (j, node) => (attributes, {overrideExisting = true} = {}) => {
  if(!isElement(node)){
    return null;
  }

  const existingAttributes = getAttributes(node);
  const newAttributes = (
    Array.isArray(attributes) ? attributes : [attributes]
  ).filter(isAttribute);
  const existingAttributeNames = existingAttributes.map(({name}) => name.name);

  newAttributes.forEach(newAttribute => {
    const attributeName = newAttribute.name.name;

    if(existingAttributeNames.includes(attributeName)){
      if(overrideExisting){
        swapAttr(j, node)(attributeName, newAttribute);
      }
    }else{
      existingAttributes.push(newAttribute);
    }
  });

  return getAttributes(node);
};
