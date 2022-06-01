// helpers
const initHelpers = require('../../../../helpers/tests');
const {astToSource} = require('../../../general');

// this
const {getMeaningfulChildren} = require('../../');

// prep
const {
  runSnapshotTest,
  getProcessorScaffold,
} = initHelpers(__dirname);


describe('traversal::getMeaningfulChildren()', () => {
  runSnapshotTest({
    title: 'should trim all whitespace text nodes',
    moduleName: 'full.js',
    processor: (fileInfo, api) => {
      const {root, testWrapperNode} = getProcessorScaffold(fileInfo, api);

      testWrapperNode.children = getMeaningfulChildren(testWrapperNode.children);

      return astToSource(root);
    },
  });
});
