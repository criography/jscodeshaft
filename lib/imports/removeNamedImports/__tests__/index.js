// helpers
const {astToSource} = require('../../../general');

// this
const {removeNamedImports} = require('../../');
const {initHelpers} = require('../../../../helpers/tests');

// prep
const {
  runSnapshotTest,
  getProcessorScaffold,
} = initHelpers(__dirname);


const setup = ({
  title,
  sourceFileName,
  moduleName,
  importPath
}) => {
  runSnapshotTest({
    title,
    moduleName: `${sourceFileName}.js`,
    processor: (fileInfo, api) => {
      const {root} = getProcessorScaffold(fileInfo, api);
      removeNamedImports(api.jscodeshift, root)(moduleName, importPath);
      return astToSource(root);
    },
  });
}


describe('traversal::getMeaningfulChildren()', () => {
  setup({
    title: 'Should remove specific named export',
    sourceFileName: 'multiple-named-only',
    moduleName: 'Potato',
  });

  setup({
    title: 'Should remove import declaration',
    sourceFileName: 'single-named-only',
    moduleName: 'Spoon',
  });

  setup({
    title: 'Should remove specific named exports, and leave the remaining ones',
    sourceFileName: 'mixed-multiple-named',
    moduleName: 'Banana',
  });

  setup({
    title: 'Should remove named export including curly braces, and leave the default one',
    sourceFileName: 'mixed-single-named',
    moduleName: 'Hobbit',
  });

  setup({
    title: 'Should respect `moduleName` as regex',
    sourceFileName: 'moduleName-regex',
    moduleName: /Apple$/i,
  });

  setup({
    title: 'Should respect falsy `moduleName`',
    sourceFileName: 'moduleName-falsy',
    importPath: 'fruits'
  });

  setup({
    title: 'Should respect `importPath` as string',
    sourceFileName: 'importPath-string',
    moduleName: 'Apple',
    importPath: '../fruits'
  });

  setup({
    title: 'Should respect `importPath` as regex',
    sourceFileName: 'importPath-regex',
    importPath: /\/cars\//
  });

  setup({
    title: 'Should remove all named exports',
    sourceFileName: 'moduleName-and-importPath-falsy'
  });
});
