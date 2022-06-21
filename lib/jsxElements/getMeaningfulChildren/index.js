import {isText} from '../../typeChecking';


/**
 * In some cases you need to get all children that are either elements,
 * literals or expressions and ignore all text nodes that are just whitespace.
 * @param   {Node[]} childrenNodes
 * @returns {Node[]}
 */
export const getMeaningfulChildren = childrenNodes => childrenNodes?.filter(
  childNode => {
    const isTextNode = isText(childNode);

    return !isTextNode || (
      isTextNode && Boolean(childNode.value.trim().length)
    )
  }
) || [];
