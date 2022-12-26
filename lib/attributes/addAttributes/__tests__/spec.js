// helpers
import {initHelpers, toAst} from '../../../../helpers/tests';
import {createAttribute} from '../../createAttribute';
import {astToSource} from '../../../general';

// this
const {addAttributes} = require('../');

// prep
const {
  runSnapshotTest,
  getProcessorScaffold,
} = initHelpers(__dirname);


describe('attributes::addAttributes()', () => {
  const SOURCE_2_ATTRIBUTES = `() => <TestComponent id="hello" aria-label="My Label" />`;

  describe('unit tests', () => {
    describe('invalid input', () => {
      it('should return null on invalid node', () => {
        [
          null,
          undefined,
          {},
          [],
          jest.fn(),
          Math.number
        ].forEach(node => {
          const processor = (fileInfo, api) => {
            const {j} = getProcessorScaffold(fileInfo, api);
            return addAttributes(j, node)();
          };

          const attributes = toAst(
            processor,
            {parser: 'flow'},
            {source: ''},
          );

          expect(attributes).toBeNull();
        })
      });


      it('should return null on no nodes matched', () => {
        const processor = (fileInfo, api) => {
          const {j, root} = getProcessorScaffold(fileInfo, api);
          const node = root
            .findJSXElements('MissingElement')
            .nodes()
            .at(0);
          return addAttributes(j, node)();
        };

        const attributes = toAst(
          processor,
          {parser: 'flow'},
          {source: ''},
        );

        expect(attributes).toBeNull();
      });
    });


    it('should return empty array on no existing and extra attributes', () => {
      const processor = (fileInfo, api) => {
        const {j, root} = getProcessorScaffold(fileInfo, api);
        const node = root
          .findJSXElements('TestComponent')
          .nodes()
          .at(0);
        return addAttributes(j, node)();
      };

      const attributes = toAst(
        processor,
        {parser: 'flow'},
        {source: '() => <TestComponent />'},
      );

      expect(Array.isArray(attributes)).toBe(true);
      expect(attributes.length).toBe(0);
    });


    describe('fallback to existing attributes', () => {
      it('should return existing attributes on no new attributes provided', () => {
        [null, undefined, []].forEach(attributes => {
          const processor = (fileInfo, api) => {
            const {j, root} = getProcessorScaffold(fileInfo, api);
            const node = root
              .findJSXElements('TestComponent')
              .nodes()
              .at(0);
            return addAttributes(j, node)();
          };

          const newAttributes =  toAst(
            processor,
            {parser: 'flow'},
            {source: SOURCE_2_ATTRIBUTES},
          );
          expect(newAttributes.length).toBe(2);
          expect(newAttributes[0].name.name).toBe('id');
          expect(newAttributes[1].name.name).toBe('aria-label');
        })
      });


      it('should return existing attributes on invalid new attributes provided', () => {
        [{}, jest.fn(), Math.random(), 'hello'].forEach(attributes => {
          const processor = (fileInfo, api) => {
            const {j, root} = getProcessorScaffold(fileInfo, api);
            const node = root
              .findJSXElements('TestComponent')
              .nodes()
              .at(0);
            return addAttributes(j, node)();
          };

          const newAttributes = toAst(
            processor,
            {parser: 'flow'},
            {source: SOURCE_2_ATTRIBUTES},
          );

          expect(newAttributes.length).toBe(2);
          expect(newAttributes[0].name.name).toBe('id');
          expect(newAttributes[1].name.name).toBe('aria-label');
        });
      });
    });


    describe('return existing and new attributes', () => {
      it('single', () => {
        const processor = (fileInfo, api) => {
          const {j, root} = getProcessorScaffold(fileInfo, api);
          const node = root
            .findJSXElements('TestComponent')
            .nodes()
            .at(0);
          return addAttributes(j, node)(
            createAttribute(j)('prop1', 'value1')
          );
        };

        const newAttributes = toAst(
          processor,
          {parser: 'flow'},
          {
            source: SOURCE_2_ATTRIBUTES,
          },
        );

        expect(newAttributes.length).toBe(3);
        expect(newAttributes[0].name.name).toBe('id');
        expect(newAttributes[1].name.name).toBe('aria-label');
        expect(newAttributes[2].name.name).toBe('prop1');
      });


      it('multiple', () => {
        const processor = (fileInfo, api) => {
          const {j, root} = getProcessorScaffold(fileInfo, api);
          const node = root
            .findJSXElements('TestComponent')
            .nodes()
            .at(0);
          return addAttributes(j, node)([
            createAttribute(j)('prop1', 'value1'),
            createAttribute(j)('prop2', 'value2'),
          ]);
        };

        const newAttributes = toAst(
          processor,
          {parser: 'flow'},
          {
            source: SOURCE_2_ATTRIBUTES,
          },
        );

        expect(newAttributes.length).toBe(4);
        expect(newAttributes[0].name.name).toBe('id');
        expect(newAttributes[1].name.name).toBe('aria-label');
        expect(newAttributes[2].name.name).toBe('prop1');
        expect(newAttributes[3].name.name).toBe('prop2');
      });
    });


    describe('override attributes', () => {
      it('single', () => {
        const processor = (fileInfo, api) => {
          const {j, root} = getProcessorScaffold(fileInfo, api);
          const node = root
            .findJSXElements('TestComponent')
            .nodes()
            .at(0);
          return addAttributes(j, node)(
            createAttribute(j)('id', 'overridden')
          );
        };

        const newAttributes = toAst(
          processor,
          {parser: 'flow'},
          {
            source: SOURCE_2_ATTRIBUTES,
          },
        );

        expect(newAttributes.length).toBe(2);
        expect(newAttributes[0].name.name).toBe('id');
        expect(newAttributes[0].value.value).toBe('overridden');
        expect(newAttributes[1].name.name).toBe('aria-label');
      });


      it('multiple', () => {
        const processor = (fileInfo, api) => {
          const {j, root} = getProcessorScaffold(fileInfo, api);
          const node = root
            .findJSXElements('TestComponent')
            .nodes()
            .at(0);
          return addAttributes(j, node)([
            createAttribute(j)('id', 'overridden'),
            createAttribute(j)('aria-label', 'overridden'),
          ]);
        };

        const newAttributes = toAst(
          processor,
          {parser: 'flow'},
          {
            source: SOURCE_2_ATTRIBUTES,
          },
        );

        expect(newAttributes.length).toBe(2);
        expect(newAttributes[0].name.name).toBe('id');
        expect(newAttributes[0].value.value).toBe('overridden');
        expect(newAttributes[1].name.name).toBe('aria-label');
        expect(newAttributes[1].value.value).toBe('overridden');
      });
    });


    describe('skip attributes', () => {
      it('single', () => {
        const processor = (fileInfo, api) => {
          const {j, root} = getProcessorScaffold(fileInfo, api);
          const node = root
            .findJSXElements('TestComponent')
            .nodes()
            .at(0);
          return addAttributes(j, node)(
            createAttribute(j)('id', 'overridden'),
            {overrideExisting: false}
          );
        };

        const newAttributes = toAst(
          processor,
          {parser: 'flow'},
          {
            source: SOURCE_2_ATTRIBUTES,
          },
        );

        expect(newAttributes.length).toBe(2);
        expect(newAttributes[0].name.name).toBe('id');
        expect(newAttributes[0].value.value).not.toBe('overridden');
        expect(newAttributes[1].name.name).toBe('aria-label');
      });


      it('multiple', () => {
        const processor = (fileInfo, api) => {
          const {j, root} = getProcessorScaffold(fileInfo, api);
          const node = root
            .findJSXElements('TestComponent')
            .nodes()
            .at(0);
          return addAttributes(j, node)(
            [
            createAttribute(j)('id', 'overridden'),
            createAttribute(j)('aria-label', 'overridden'),
            ],
            {overrideExisting: false}
          );
        };

        const newAttributes = toAst(
          processor,
          {parser: 'flow'},
          {
            source: SOURCE_2_ATTRIBUTES,
          },
        );

        expect(newAttributes.length).toBe(2);
        expect(newAttributes[0].name.name).toBe('id');
        expect(newAttributes[0].value.value).not.toBe('overridden');
        expect(newAttributes[1].name.name).toBe('aria-label');
        expect(newAttributes[1].value.value).not.toBe('overridden');
      });
    });
  });



  describe('snapshots', () => {
    describe('adds new attributes', () => {
      runSnapshotTest({
        title: 'single',
        moduleName: 'add-single.js',
        processor: (fileInfo, api) => {
          const {j, root, testWrapperNode} = getProcessorScaffold(fileInfo, api);

          addAttributes(j, testWrapperNode)(
            createAttribute(j)('prop1', 'value1')
          );

          return astToSource(root);
        },
      });


      runSnapshotTest({
        title: 'multi',
        moduleName: 'add-multi.js',
        processor: (fileInfo, api) => {
          const {j, root, testWrapperNode} = getProcessorScaffold(fileInfo, api);

          addAttributes(j, testWrapperNode)([
            createAttribute(j)('prop1', 'value1'),
            createAttribute(j)('prop2', 'value2'),
          ]);

          return astToSource(root);
        },
      });
    });


    describe('overrides existing attributes', () => {
      runSnapshotTest({
        title: 'single',
        moduleName: 'override-single.js',
        processor: (fileInfo, api) => {
          const {j, root, testWrapperNode} = getProcessorScaffold(fileInfo, api);

          addAttributes(j, testWrapperNode)(
            createAttribute(j)('id', 'overridden')
          );

          return astToSource(root);
        },
      });


      runSnapshotTest({
        title: 'multi',
        moduleName: 'override-multi.js',
        processor: (fileInfo, api) => {
          const {j, root, testWrapperNode} = getProcessorScaffold(fileInfo, api);

          addAttributes(j, testWrapperNode)([
            createAttribute(j)('id', 'overridden'),
            createAttribute(j)('aria-label', 'overridden'),
          ]);

          return astToSource(root);
        },
      });
    });


    describe('skips new attributes', () => {
      runSnapshotTest({
        title: 'single',
        moduleName: 'skip-single.js',
        processor: (fileInfo, api) => {
          const {j, root, testWrapperNode} = getProcessorScaffold(fileInfo, api);

          addAttributes(j, testWrapperNode)(
            createAttribute(j)('id', 'overridden'),
            {overrideExisting: false}
          );

          return astToSource(root);
        },
      });


      runSnapshotTest({
        title: 'multi',
        moduleName: 'skip-multi.js',
        processor: (fileInfo, api) => {
          const {j, root, testWrapperNode} = getProcessorScaffold(fileInfo, api);

          addAttributes(j, testWrapperNode)(
            [
              createAttribute(j)('id', 'overridden'),
              createAttribute(j)('aria-label', 'overridden'),
            ],
            {overrideExisting: false}
          );

          return astToSource(root);
        },
      });
    });
  });
});
