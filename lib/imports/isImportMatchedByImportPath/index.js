import {isStringMatching} from '../../general';


/**
 * Determines if given importNode matches against given importPathMatcher.
 * Returns false on unsupported values.
 * @param   {RegExp|string}   importPathMatcher
 * @param   {Node}            importNode
 * @returns {boolean}
 */
export const isImportMatchedByImportPath = (importPathMatcher, importNode) => {
  const pathString = importNode?.source?.value;

  return (
    importNode
    ? isStringMatching(pathString, importPathMatcher)
    : false
  );
};
