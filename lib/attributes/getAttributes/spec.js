// libs
import {faker} from '@faker-js/faker';

// helpers
const {NON_NODES, printType, initHelpers, toAst} = require('../../../helpers/tests');

// this
const {getAttributes} = require('./');

// prep
const {getProcessorScaffold} = initHelpers(__dirname);
const SOURCE_NO_PROPS = `const Component = () => <NoProps />`;
const SOURCE_PROPS = `const Component = () => (
  <WithProps
    one="one"
    two
    three={3}
    four={() => 'four'}
  />
);`;


describe('attributes::getAttributes()', () => {
  describe('no or invalid nodes', () => {
    NON_NODES.forEach(node => {
      it(`should return undefined on: ${printType(node)}`, () => {
        const processor = () => getAttributes(node);

        const ast = toAst(
          processor,
          {parser: 'flow'},
          {source: ''},
        );

        expect(ast).toBeUndefined();
      });
    });


    it('should return undefined on: non-element node', () => {
      const processor = (fileInfo, api) => {
        const {root, j} = getProcessorScaffold(fileInfo, api);

        const nonElementNode = root
          // finds the const declaration instead of JSX Element
          .find(j.VariableDeclaration)
          .nodes()
          .at(0);

        return getAttributes(nonElementNode);
      };

      const ast = toAst(
        processor,
        {parser: 'flow'},
        {source: SOURCE_NO_PROPS},
      );

      expect(ast).toBeUndefined();
    });
  });


  describe('attributes', () => {
    const SET_PROPS = ['one', 'two', 'three', 'four'];


    it('should return empty array on no arguments', () => {
      const processor = (fileInfo, api) => {
        const {root} = getProcessorScaffold(fileInfo, api);

        const noPropsElement = root
          .findJSXElements('NoProps')
          .nodes()
          .at(0);

        return getAttributes(noPropsElement);
      };

      const ast = toAst(
        processor,
        {parser: 'flow'},
        {source: SOURCE_NO_PROPS},
      );

      expect(ast).toBeArrayOfSize(0);
    });


    it('should return all attributes', () => {
      const processor = (fileInfo, api) => {
        const {root} = getProcessorScaffold(fileInfo, api);

        const noPropsElement = root
          .findJSXElements('WithProps')
          .nodes()
          .at(0);

        return getAttributes(noPropsElement);
      };

      const ast = toAst(
        processor,
        {parser: 'flow'},
        {source: SOURCE_PROPS},
      );

      expect(ast).toBeArrayOfSize(SET_PROPS.length);

      ast.forEach(propNode => {
        expect(SET_PROPS.includes(propNode.name.name));
      });
    });


    describe('wantedAttributes', () => {
      it('should respect a matched attribute name string', () => {
        const selectedProp = faker.helpers.arrayElement(SET_PROPS);

        const processor = (fileInfo, api) => {
          const {root} = getProcessorScaffold(fileInfo, api);

          const noPropsElement = root
            .findJSXElements('WithProps')
            .nodes()
            .at(0);

          return getAttributes(noPropsElement, {wantedAttributes: selectedProp});
        };

        const ast = toAst(
          processor,
          {parser: 'flow'},
          {source: SOURCE_PROPS},
        );

        expect(ast).toBeArrayOfSize(1);
        expect(ast[0].name.name).toBe(selectedProp);
      });


      it('should respect matched attribute names and ignore all others', () => {
        const selectedProps = faker.helpers.arrayElements(SET_PROPS);

        const processor = (fileInfo, api) => {
          const {root} = getProcessorScaffold(fileInfo, api);

          const noPropsElement = root
            .findJSXElements('WithProps')
            .nodes()
            .at(0);

          return getAttributes(noPropsElement, {wantedAttributes: selectedProps});
        };

        const ast = toAst(
          processor,
          {parser: 'flow'},
          {source: SOURCE_PROPS},
        );

        expect(ast).toBeArrayOfSize(selectedProps.length);
        ast.forEach(propNode => {
          expect(selectedProps.includes(propNode.name.name)).toBeTrue();
        });
      });
    });


    describe('allOnNoMatch=true', () => {
      it('attribute string: should return empty array on no match', () => {
        const absentProp = 'five';

        const processor = (fileInfo, api) => {
          const {root} = getProcessorScaffold(fileInfo, api);

          const noPropsElement = root
            .findJSXElements('WithProps')
            .nodes()
            .at(0);

          return getAttributes(noPropsElement, {wantedAttributes: absentProp});
        };

        const ast = toAst(
          processor,
          {parser: 'flow'},
          {source: SOURCE_PROPS},
        );

        expect(ast).toBeArrayOfSize(0);
      });


      it('attribute array: should return empty array on no match', () => {
        const absentProps = ['five', 'six'];

        const processor = (fileInfo, api) => {
          const {root} = getProcessorScaffold(fileInfo, api);

          const noPropsElement = root
            .findJSXElements('WithProps')
            .nodes()
            .at(0);

          return getAttributes(noPropsElement, {wantedAttributes: absentProps});
        };

        const ast = toAst(
          processor,
          {parser: 'flow'},
          {source: SOURCE_PROPS},
        );

        expect(ast).toBeArrayOfSize(0);
      });
    });


    describe('allOnNoMatch', () => {
      it('attribute string: should return all attributes array on no match', () => {
        const absentProp = 'five';

        const processor = (fileInfo, api) => {
          const {root} = getProcessorScaffold(fileInfo, api);

          const noPropsElement = root
            .findJSXElements('WithProps')
            .nodes()
            .at(0);

          return getAttributes(noPropsElement, {
            wantedAttributes: absentProp,
            allOnNoMatch: true,
          });
        };

        const ast = toAst(
          processor,
          {parser: 'flow'},
          {source: SOURCE_PROPS},
        );

        expect(ast).toBeArrayOfSize(SET_PROPS.length);

        ast.forEach(propNode => {
          expect(SET_PROPS.includes(propNode.name.name));
        });
      });


      it('attribute array: should return empty array on no match', () => {
        const absentProps = ['five', 'six'];

        const processor = (fileInfo, api) => {
          const {root} = getProcessorScaffold(fileInfo, api);

          const noPropsElement = root
            .findJSXElements('WithProps')
            .nodes()
            .at(0);

          return getAttributes(noPropsElement, {
            wantedAttributes: absentProps,
            allOnNoMatch: true,
          });
        };

        const ast = toAst(
          processor,
          {parser: 'flow'},
          {source: SOURCE_PROPS},
        );

        expect(ast).toBeArrayOfSize(SET_PROPS.length);

        ast.forEach(propNode => {
          expect(SET_PROPS.includes(propNode.name.name));
        });
      });
    });
  });
});
