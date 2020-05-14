'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// this can be easily determined from https://astexplorer.net

const getType = node => node && node.type;


const isElement = node => getType(node) === 'JSXElement' && node.openingElement;
const isFragment = node => getType(node) === 'JSXFragment';
const isFunction = node => getType(node) === 'FunctionDeclaration';
const isExpression = node => getType(node) === 'JSXExpressionContainer';
const isReturn = node => getType(node) === 'ReturnStatement';
const isLiteral = node => getType(node) === 'Literal';
const isArrow = node => getType(node) === 'ArrowFunctionExpression';
const isAttribute = node => getType(node) === 'JSXAttribute';

const isValidAttrValue = node => (
  typeof node === 'undefined'
  || isArrow(node)
  || isLiteral(node)
  || isExpression(node)
);

const isTruthyString = val => val && typeof val === 'string';

const isPrimitive = val => (
  val === null
  || ['string', 'number', 'boolean'].includes(typeof val)
);

/**
 * @typedef {function}  elementArgs
 * @param   {string}    name        New element name
 * @param   {Node[]}    [children]  Element children nodes
 * @returns {Node}
 *//**
 * Create new element node
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(elementArgs): Node}
 */
const createElement = (j) => (name, children) => j.jsxElement(
  j.jsxOpeningElement(j.jsxIdentifier(name)),
  j.jsxClosingElement(j.jsxIdentifier(name)),
  children,
);


/**
 * @typedef {function}  specifierArgs
 * @param   {string}    name          Imported module name
 * @param   {string}    [alias]       Optional imported module alias
 * @returns {Node}
 *//**
 * Create new import specifier node
 * @TODO add support for default imports
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(specifierArgs): Node}
 */
const createImportSpecifier = j => (name, alias) => (
  j.importSpecifier(
    j.identifier(name),
    alias ? j.identifier(alias) : undefined,
  )
);




/**
 * @typedef {function}  createLiteralOrLiteralExpressionArgs
 * @param   {string}    val   Literal value
 * @returns {Node}
 *//**
 * Creates a literal value, which can be 1 of the following:
 * string | boolean | null | number | RegExp of type Literal.
 * @TODO add support for regex
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createLiteralOrLiteralExpressionArgs): (Node|null)}
 */
const createLiteralOrLiteralExpression = j => val => {
  let output;
  if(typeof val === 'string') {
    output = j.literal(val);
  }else if(['number', 'boolean'].includes(typeof val) || val === null){
    output = j.jsxExpressionContainer(j.literal(val));
  }

  return output
};



const createStringLiteral = j => val => j.stringLiteral(val);



/**
 * @typedef {function}  templateArgs
 * @param   {string[]}  quasis        Collection of quasis (literal fragments)
 * @param   {*[]}       expressions   Collection of literal nodes for primitives OR
 *                                    expressions containers for anything else.
 * @returns {Node}
 *//**
 * Create String Template Literal.
 * the order of composition will be always like this:
 * Q1 E1 Q2 E2 ... En Qn
 *
 * @TODO Accept primitives directly
 *
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(templateArgs): Node}
 * @see https://vramana.github.io/blog/2015/12/21/codemod-tutorial/
 * @see https://github.com/cpojer/js-codemod/blob/master/transforms/template-literals.js
 */
const createTemplateLiteral = j => (quasis, expressions) => (
  Array.isArray(quasis) && Array.isArray(expressions)
  ? j.templateLiteral(
    quasis.map((val, index) => (
      j.templateElement(
        {cooked: val, raw: val},
        (index === quasis.length - 1),
      )
    )), expressions,
  )
  : undefined
);

/**
 * Ensures the input is 1 or more of truthy strings and expressed as array.
 * @param   {(string|string[])} input
 * @returns {string[]}
 */
const _toTruthyStringArray = (input) => {
  const output = [];

  if(isTruthyString(input)){
    output.push(input);
  }else if(Array.isArray(input) && input.length > 0){
    output.push(...input.filter(item => isTruthyString(item)));
  }

  return output;
};


/**
 * Retrieves attribute nodes or their literal values from a given element path
 * @param   {object}            node            Valid element node
 * @param   {(string|string[])} [wantedAttrs]   One or more attribute names to match
 * @returns {any[]|null}
 */
const getAttrs = (node, wantedAttrs) => {
  let output = null;

  if(isElement(node)){
    const allAttrs = node.openingElement.attributes || [];
    const filteredAttrs = [];

    if(allAttrs.length > 0){
      const wantedAttrsAsArray = _toTruthyStringArray(wantedAttrs);

      if(wantedAttrsAsArray.length){
        allAttrs.forEach(attr => {
          if(wantedAttrsAsArray.includes(attr.name.name)){
            filteredAttrs.push(attr);
          }
        });
      }
    }

    output = filteredAttrs.length ? filteredAttrs : allAttrs;
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
const createAttr = (j) => (name, val) => {
  let output = false;

  if (j && isTruthyString(name)) {
    let value;

    // false, string, number, null
    if (isPrimitive(val) && val !== true) {
      value = createLiteralOrLiteralExpression(j)(val);
    // template literal
    } else if(Boolean(val && val.quasis)){
      value = j.jsxExpressionContainer(val);
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
const removeAttrs = (j, node) => attrNames => {
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
const addAttrs = (j, node) => (attributes) => {
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
const renameAttr = (j, node) => (oldName, newName) => {
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
const setAttrValue = (j, node) => (attrName, newValue) => {
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
const swapAttr = (j, node) => (name, newAttr) => {
  const attrs = getAttrs(node);
  const targetIndex = attrs.findIndex(attr => attr.name.name === name);

  if(targetIndex >= 0){
    attrs.splice(targetIndex, 1, newAttr);
  }

  return attrs;
};

/**
 * @TODO needs support for mixed default and named import declarations
 */


/**
 * Find an import specifier matching the module in question
 * @param   {Node}    importNode
 * @returns {Boolean}
 */
const hasFragment = (importNode) =>  importNode.specifiers.some(
  specifier => (
    specifier.type === 'ImportSpecifier'
    && specifier.imported.name === 'Fragment'
  )
);


/**
 * Ensure that Fragment is imported and exposed as `F`
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {void}
 */
const importFragment = (j, root) => {
  root
    .find('ImportDeclaration')
    .filter(({node}) => (
      node.source.value === 'react'
      && node.importKind === 'value'
      && !hasFragment(node)
    ))
    .forEach(({node}) => {
      node.specifiers.push(
        createImportSpecifier(j)('Fragment', 'F')
      );
    });
};


/**
 * @typedef {function}  namedImportArgs
 * @param   {string}    [module]          Module name. Set to false to ignore
 * @param   {RegExp}    [importPath]      Import path matcher. Set to false to ignore
 * @returns {void}
 *//**
 * Remove named imports
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(namedImportArgs): void}
 */
const removeNamedImports = (j, root) => (moduleName, importPath) => {
  /**
   * Find an import specifier (import name) matching the moduleName in question.
   * If a falsy moduleName argument is passed to the parent fn, this test will
   * be ignored and will return true.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingName = (importNode) => {
    if(!moduleName){
      return true;
    }

    return (
      importNode.specifiers && importNode.specifiers.find(specifier => (
        specifier.type === 'ImportSpecifier'
        && specifier.imported
        && specifier.imported.name === moduleName
      ))
    )
  };


  /**
   * Find an import path matching the importPath in question.
   * If no importPath argument is passed to the parent fn, this
   * test will match against `lendinvest-styleguide`.
   * If importPath argument is set as `false` to the parent,
   * this test will be ignored and will always return true.
   * @TODO remove default to make it platform agnostic
   * @param   {Node}              importNode
   * @param   {(RegExp|Boolean)}  [importPath]
   * @returns {Boolean}
   */
  const isMatchingPath = (importNode, importPath) => {
    if(importPath === false){
      return true;
    }

    return (
      Boolean(importPath)
      && (importPath || /^lendinvest-styleguide/).test(importNode.source.value)
    )
  };


  /**
   * Remove given moduleName from a collection of named imports
   * @param   {Node}  importNode
   * @returns {Node[]}
   */
  const getCleanedUpSpecifiers = importNode => importNode.specifiers.filter(
    specifier => specifier.imported.name !== moduleName
  );


  root
    .find('ImportDeclaration')
    .filter(({node}) => isMatchingName(node) && isMatchingPath(node))
    .forEach((path) => {
      // if multiple modules imported, remove the specifier
      if(path.node.specifiers.length > 1){
        path.node.specifiers = getCleanedUpSpecifiers(path.node);
        // if only 1 moduleName imported, remove whole import
      }else {
        j(path).remove();
      }
    });
};


/**
 * @typedef {function}              defaultImportArgs
 * @param   {string}  [module]      Module name. Set to false to ignore
 * @param   {RegExp}  [importPath]  Import path matcher. Set to false to ignore
 * @returns {void}
 *//**
 * Remove named imports
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(defaultImportArgs): void}
 */
const removeDefaultImports = (j, root) => (moduleName, importPath) => {
  const isExclusivelyDefaultImport = (importNode) => (
    importNode.specifiers.length === 1
    && importNode.specifiers[0].type==='ImportDefaultSpecifier'
  );


  /**
   * Find an import specifier (import name) matching the moduleName in question.
   * If a no moduleName argument is passed to the parent fn, this test will
   * be ignored and will return true.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingName = (importNode) => {
    if(moduleName === false){
      return true
    }

    return importNode.specifiers[0].local.name === moduleName;
  };


  /**
   * Find an import path matching the importPath in question.
   * If no importPath argument is passed to the parent fn, this
   * test will be ignored and will return true.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingPath = (importNode) => {
    if(importPath === false){
      return true
    }

    return importPath.test(importNode.specifiers[0].source.value);
  };


  root
    .find('ImportDeclaration')
    .filter(({node}) => (
      isExclusivelyDefaultImport(node)
      && isMatchingName(node)
      && isMatchingPath(node)
    ))
    .forEach((path) => {
      j(path).remove();
    });
};

/**
 * Transform AST back to the source code.
 * `toSource` method accepts Recast's options.
 * Wrapping is disabled as it should be governed by our eslint.
 * @see https://github.com/benjamn/recast/blob/master/lib/options.ts
 *
 * @param   {object}  root    AST-ified file content
 * @returns {string}
 */
const astToSource = (root) => (
  root.toSource({
    tabWidth: 2,
    wrapColumn: 9999,
  })
);


/**
 * Extract either literal or literal-in-expression `{"value"}` prop value.
 * Return full expression node if non-literal value detected, which also
 * applies to regex and template literals.
 * NB: This can be used in few places, e.g. element prop values or object
 * properties but will require unique approach for other constructs.
 * @TODO should it be in traversal.js?
 * @param   {Node}    node
 * @param   {object}  node.type
 * @param   {object}  [node.value]
 * @returns {string}
 */
const getNodeValue = ({type, value}) => {
  let val;

  if (value) {
    // string
    if (value.value) {
      val = value.value;
    }

    // `{value}` expression
    if (value.expression){
      // simple literal
      if(
        ['number', 'string', 'boolean'].includes(typeof value.expression.value)
        || value.expression.value === null
      ) {
        val = value.expression.value;

      // everything else
      } else if (value.expression.name !== 'undefined'){
        val = value.expression;
      }
    }

  // value-less props
  }else if (type) {
    val = true;
  }

  return val;
};

/**
 * In some cases you need to get all children that are either elements,
 * literals or expressions and ignore all text nodes that are just whitespace.
 * @param   {array} childrenNodes
 * @returns {array}
 */
const getMeaningfulChildren = childrenNodes => childrenNodes.filter(
  child => !(child.type === 'JSXText' && !child.value.trim())
);

exports.addAttrs = addAttrs;
exports.astToSource = astToSource;
exports.createAttr = createAttr;
exports.createElement = createElement;
exports.createImportSpecifier = createImportSpecifier;
exports.createLiteralOrLiteralExpression = createLiteralOrLiteralExpression;
exports.createStringLiteral = createStringLiteral;
exports.createTemplateLiteral = createTemplateLiteral;
exports.getAttrs = getAttrs;
exports.getMeaningfulChildren = getMeaningfulChildren;
exports.getNodeValue = getNodeValue;
exports.getType = getType;
exports.hasFragment = hasFragment;
exports.importFragment = importFragment;
exports.isArrow = isArrow;
exports.isAttribute = isAttribute;
exports.isElement = isElement;
exports.isExpression = isExpression;
exports.isFragment = isFragment;
exports.isFunction = isFunction;
exports.isLiteral = isLiteral;
exports.isPrimitive = isPrimitive;
exports.isReturn = isReturn;
exports.isTruthyString = isTruthyString;
exports.isValidAttrValue = isValidAttrValue;
exports.removeAttrs = removeAttrs;
exports.removeDefaultImports = removeDefaultImports;
exports.removeNamedImports = removeNamedImports;
exports.renameAttr = renameAttr;
exports.setAttrValue = setAttrValue;
exports.swapAttr = swapAttr;
