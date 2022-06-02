// helpers
const {initHelpers, toAst, printType} = require('../../../helpers/tests');

// this
const {astToSource} = require('../../general');
const {isImportedFromSource} = require('../');
const {faker} = require('@faker-js/faker');

// prep
const {getProcessorScaffold} = initHelpers(__dirname);


const getAst = (
  specifierName,
  importSource,
  source = 'const Component = () => null;'
) => {
  const processor = (fileInfo, api) => {
    const {root} = getProcessorScaffold(fileInfo, api);
    return isImportedFromSource(root)(specifierName, importSource);
  };

  return toAst(
    processor,
    {parser: 'flow'},
    {source},
  );
};


describe('imports::isImportedFromSource()', () => {
  describe('early exit', () => {
    const INVALID_TYPES = [
      null,
      undefined,
      {},
      [],
      faker.finance.amount(0.01),
      0,
      false,
      true,
      new Date(),
      faker.datatype.array(2),
      JSON.parse(faker.datatype.json()),
    ];


    describe('`specifierName` missing or invalid', () => {
      INVALID_TYPES.forEach(invalidValue => {
        it(`should return false on ${printType(invalidValue)}`, () => {
          expect(
            getAst(invalidValue, 'criography')
          ).toBeFalse();
        });
      });
    });


    describe('`importSource` missing or invalid', () => {
      INVALID_TYPES.forEach(invalidValue => {
        it(`should return false on ${printType(invalidValue)}`, () => {
          expect(
            getAst('Button', invalidValue)
          ).toBeFalse();
        });
      });
    });


    it('should return false if no imports are present', () => {
      expect(
        getAst(
          'Button',
          '@criography/jscodeshaft',
          'const Component = () => <Button />;'
        )
      ).toBeFalse();
    });
  });


  describe('no match', () => {
    const SOURCE = `
import {Link} from '@criography/jscodeshaft';
const Component = () => <Button />;
    `;

    it('string: should return false if no match', () => {
      expect(
        getAst('Button', '@criography/jscodeshaft', SOURCE)
      ).toBeFalse();
    });


    it('regex: should return false if no match', () => {
      expect(
        getAst(/Butt/, /criography/, SOURCE)
      ).toBeFalse();
    });
  });


  describe('default export matched', () => {
    const SOURCE = `
import Button from '@criography/jscodeshaft';
const Component = () => <Button />;
    `;

    it('string: should return true', () => {
      expect(
        getAst('Button', '@criography/jscodeshaft', SOURCE)
      ).toBeTrue();
    });


    it('regex: should return true', () => {
      expect(
        getAst(/^Butt.*?/, /jscodeshaft/, SOURCE)
      ).toBeTrue();
    });
  });


  describe('named export matched', () => {
    const SOURCE = `
import {Link, Button, Card as Box} from '@criography/jscodeshaft';
const Component = () => <Button />;
    `;

    it('string: should return true', () => {
      expect(
        getAst('Button', '@criography/jscodeshaft', SOURCE)
      ).toBeTrue();
    });


    it('regex: should return true', () => {
      expect(
        getAst(/^Butt.*?/, /jscodeshaft/, SOURCE)
      ).toBeTrue();
    });


    it('should respect the alias', () => {
      expect(
        getAst('Card', /jscodeshaft/, SOURCE)
      ).toBeFalse();
      expect(
        getAst('Box', /jscodeshaft/, SOURCE)
      ).toBeTrue();
    });
  });


  describe('default export matched in mixed import', () => {
    const SOURCE = `
import Button, {helpers, constants} from '@criography/jscodeshaft';
const Component = () => <Button />;
    `;

    it('string: should return true', () => {
      expect(
        getAst('Button', '@criography/jscodeshaft', SOURCE)
      ).toBeTrue();
    });


    it('regex: should return true', () => {
      expect(
        getAst(/^Butt.*?/, /jscodeshaft/, SOURCE)
      ).toBeTrue();
    });
  });


  describe('named export matched in mixed import', () => {
    const SOURCE = `
import LdsProvider, {Link, Button, Card} from '@criography/jscodeshaft';
const Component = () => <Button />;
    `;

    it('string: should return true', () => {
      expect(
        getAst('Button', '@criography/jscodeshaft', SOURCE)
      ).toBeTrue();
    });


    it('regex: should return true', () => {
      expect(
        getAst(/^Butt.*?/, /jscodeshaft/, SOURCE)
      ).toBeTrue();
    });
  });
});
