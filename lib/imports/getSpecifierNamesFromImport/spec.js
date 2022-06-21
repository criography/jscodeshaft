// helpers
const {initHelpers, toAst, printType, NON_NODES} = require('../../../helpers/tests');

// this
const {getSpecifierNamesFromImport: spec} = require('../');

// prep
const {getProcessorScaffold} = initHelpers(__dirname);

const SOURCE_DEFAULT = `
import Theme from 'design-system';
const Component = () => null;
`;
const SOURCE_NAMED = `
import {Link, Button, Icon} from 'design-system';
const Component = () => null;
`;
const SOURCE_ALIASED = `
import {Card as Box} from 'design-system';
const Component = () => null;
`;
const SOURCE_MIXED = `
import Theme, {Link, Button, Icon, Card as Box} from 'design-system';
const Component = () => null;
`;
const SPECIFIERS_DEFAULT = {
  'Theme': {
    'alias': 'Theme',
    'type': 'ImportDefaultSpecifier',
  },
};
const SPECIFIERS_NAMED = {
  'Icon': {
    'alias': 'Icon',
    'type': 'ImportSpecifier',
  },
  'Button': {
    'alias': 'Button',
    'type': 'ImportSpecifier',
  },
  'Link': {
    'alias': 'Link',
    'type': 'ImportSpecifier',
  },
};
const SPECIFIERS_ALIASED = {
  'Card': {
    'alias': 'Box',
    'type': 'ImportSpecifier',
  },
};


const getAst = (source, specifierType) => {
  const processor = (fileInfo, api) => {
    const {root, j} = getProcessorScaffold(fileInfo, api);

    const importNode = root
      .find(j.ImportDeclaration)
      .nodes()
      .at(0);

    return spec(importNode, specifierType);
  };

  return toAst(
    processor,
    {parser: 'flow'},
    {source},
  );
};


describe('imports::getSpecifierNamesFromImport()', () => {
  describe('no or invalid nodes', () => {
    NON_NODES.forEach(node => {
      it(`should return null on: ${printType(node)}`, () => {
        const processor = () => {
          return spec(node);
        };

        const ast = toAst(
          processor,
          {parser: 'flow'},
          {source: ''},
        );

        expect(ast).toBeNull();
      });
    });


    it('should return null on: non-import node', () => {
      const processor = (fileInfo, api) => {
        const {root, j} = getProcessorScaffold(fileInfo, api);

        const nonElementNode = root
          // finds the const declaration instead of JSX Element
          .find(j.VariableDeclaration)
          .nodes()
          .at(0);

        return spec(nonElementNode);
      };

      const ast = toAst(
        processor,
        {parser: 'flow'},
        {source: SOURCE_DEFAULT},
      );

      expect(ast).toBeNull();
    });
  });


  describe('default matching', () => {
    it('should work with default imports', () => {
      expect(getAst(SOURCE_DEFAULT)).toStrictEqual(SPECIFIERS_DEFAULT);
    });


    it('should work with named imports', () => {
      expect(getAst(SOURCE_NAMED)).toStrictEqual(SPECIFIERS_NAMED);
    });


    it('should work with mixed imports', () => {
      expect(getAst(SOURCE_MIXED)).toStrictEqual({
        ...SPECIFIERS_DEFAULT,
        ...SPECIFIERS_NAMED,
        ...SPECIFIERS_ALIASED,
      });
    });


    it('should work with aliases', () => {
      expect(getAst(SOURCE_ALIASED)).toStrictEqual(SPECIFIERS_ALIASED);
    });
  });


  describe('specifierType', () => {
    describe('default imports', () => {
      it('should return empty object for named import', () => {
        expect(
          getAst(SOURCE_NAMED, 'ImportDefaultSpecifier'),
        ).toStrictEqual({});
      });


      it('should return specifiers for default import', () => {
        expect(
          getAst(SOURCE_DEFAULT, 'ImportDefaultSpecifier'),
        ).toStrictEqual(SPECIFIERS_DEFAULT);
      });


      it('should return specifiers for mixed import', () => {
        expect(
          getAst(SOURCE_MIXED, 'ImportDefaultSpecifier'),
        ).toStrictEqual(SPECIFIERS_DEFAULT);
      });
    });


    describe('named imports', () => {
      it('should return empty object for default import', () => {
        expect(
          getAst(SOURCE_DEFAULT, 'ImportSpecifier'),
        ).toStrictEqual({});
      });


      it('should return specifiers for named import', () => {
        expect(
          getAst(SOURCE_NAMED, 'ImportSpecifier'),
        ).toStrictEqual(SPECIFIERS_NAMED);
      });


      it('should return specifiers for mixed import', () => {
        expect(
          getAst(SOURCE_MIXED, 'ImportSpecifier'),
        ).toStrictEqual({
          ...SPECIFIERS_NAMED,
          ...SPECIFIERS_ALIASED,
        });
      });
    });
  });
});
