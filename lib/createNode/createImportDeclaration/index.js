import {isValidImportSpecifier} from '../../typeChecking';


/**
 * @typedef {function}  createImportDeclarationArgs
 * @param   {Node[]}    importSpecifiers  Imported module name
 * @param   {string}    importPath        Optional imported module alias
 * @returns {Node}
 *//**
 * Create new import declaration node
 * @TODO add support for default imports
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createImportDeclarationArgs): Node}
 */
export const createImportDeclaration = j => (importSpecifiers, importPath) => {
  if(!Array.isArray(importSpecifiers) || typeof importPath !== 'string'){
    return;
  }

  const validSpecifiers = importSpecifiers.filter(isValidImportSpecifier);

  if(validSpecifiers.length === 0){
    return;
  }

  return j.importDeclaration(
    validSpecifiers,
    j.literal(importPath)
  );
}
