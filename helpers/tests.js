// libs
const fs = require('fs');
const path = require('path');
const {faker} = require('@faker-js/faker');
const {toMatchFile} = require('jest-file-snapshot');
const {applyTransform} = require('jscodeshift/dist/testUtils');

// prep
expect.extend({toMatchFile});


/**
 * A simple wrapper for the snapshot testing boilerplate, which helps
 * determine the correct paths, read the files and perform the matching.
 * @param   {string}  dirname
 * @returns {{
 *   runSnapshotTest: function,
 *   readSource: (function(*): string),
 *   getProcessorScaffold: (function(*, *): {testWrapperNode: *, root: *, j: *})
 * }}
 */
exports.initHelpers = (dirname) => {
  const sourceDir = path.join(dirname, 'sources');
  const snapshotDir = path.join(dirname, 'snapshots');


  const getPath = (fileName, mode) => (
    path.join(
      (mode === 'source' ? sourceDir : snapshotDir),
      fileName,
    )
  );


  const readSource = (moduleName) => fs.readFileSync(
    getPath(moduleName, 'source'),
    'utf8',
  );


  const runSnapshotTest = ({title, moduleName, processor}) => {
    it(title, () => {
      const source = readSource(moduleName);
      const output = applyTransform(
        processor,
        {parser: 'flow'},
        {source},
      );

      // For some reason, something adds an extra line break at the
      // end of the file. This is obviously a hack, but it doesn't
      // affect the actual transformation. In production, teams would
      // follow the codemod with some sort of ESLint run anyway, so
      // these things would get polished.
      expect(output + "\n").toMatchFile(
        getPath(moduleName),
      );
    });
  };


  const getProcessorScaffold = (fileInfo, api) => {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);

    const testWrapperNode = root
      .findJSXElements('TestWrapper')
      .nodes()
      .at(0);

    return {j, root, testWrapperNode};
  };


  return {
    readSource,
    runSnapshotTest,
    getProcessorScaffold,
  };
};


/**
 * This is a direct copy of jscodeshift's `applyTransform` function
 * with the only exception of it returning an AST rather than a string
 * @param   {function}  processor
 * @param   {object}  options
 * @param   {object}  input
 * @param   {object}  testOptions
 * @returns {*}
 */
exports.toAst = (
  processor,
  options = {parser: 'flow'},
  input = {source: ''},
  testOptions = {}
) => {
  // Handle ES6 modules using default export for the transform
  const transform = processor.default ? processor.default : processor;

  // Jest resets the processor registry after each test, so we need to always get
  // a fresh copy of jscodeshift on every test run.
  let jscodeshift = require('jscodeshift/dist/core');
  if (testOptions.parser || processor.parser) {
    jscodeshift = jscodeshift.withParser(testOptions.parser || processor.parser);
  }

  return transform(
    input,
    {
      jscodeshift,
      stats: () => {},
    },
    options || {},
  );
};


/**
 * Simple collection of values that are not AST Nodes
 * @type {*[]}
 */
exports.NON_NODES = [
  null,
  undefined,
  faker.datatype.uuid(),
  0,
  faker.finance.amount(0.01),
  [],
  {},
  /regex/s,
  new Date(),
  faker.datatype.array(2),
  JSON.parse(faker.datatype.json()),
];


/**
 * Simple helper to print out different human-readable values or types.
 * To be used for labelling tests.
 * @param   {*}       value
 * @returns {string}
 */
exports.printType = value => {
  if (value instanceof Date && !isNaN(value)) {
    return 'Date object';
  } else if (value instanceof RegExp) {
    return 'RegExp';
  } else if (typeof value === 'string') {
    return value.length ? 'string' : 'empty string';
  } else if (typeof value === 'number' && !Number.isNaN(value)) {
    return value === 0 ? 'zero' : 'truthy number';
  } else if (Array.isArray(value) && value.length > 0) {
    return 'populated array';
  } else if (
    value !== null
    && typeof value === 'object'
    && Object.keys(value).length > 0
  ) {
    return 'populated object';
  }

  return JSON.stringify(value);
};
