import { isElement, isAttribute } from '../../typeChecking';
import { toTruthyStringArray } from '../../general'


/**
 * Retrieves all attribute nodes from a given JSX Element path.
 * Can be optionally customised via options - if filtered by name
 * using `wantedAttributes` parameter and no matches are found,
 * no attributes will be returned. To make it return all attributes
 * instead, override with `allOnNoMatch`.
 * @param   {Node}            node
 * @param   {string|string[]} [wantedAttributes]
 * @param   {boolean}         [allOnNoMatch]
 * @returns {Node[]|undefined}
 */
export const getAttributes = (node, {
  wantedAttributes,
  allOnNoMatch,
} = {}) => {
  let output;

  if (isElement(node)) {
    output = node.openingElement.attributes;
    if (output && Array.isArray(output) && output.length > 0) {
      const wantedAttributesAsArray = toTruthyStringArray(wantedAttributes);

      if (wantedAttributesAsArray.length > 0) {
        const filteredAttrs = [];
        output.forEach(attribute => {
          if (
            isAttribute(attribute)
            && wantedAttributesAsArray.includes(attribute.name.name)
          ) {
            filteredAttrs.push(attribute);
          }
        });

        if (filteredAttrs.length > 0 || (filteredAttrs.length === 0 && !allOnNoMatch)) {
          output = filteredAttrs;
        }
      }
    }
  }

  return output;
};
