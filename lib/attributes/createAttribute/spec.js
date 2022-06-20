// libs
import {faker} from '@faker-js/faker';

 // helpers
import {printType, initHelpers, toAst} from '../../../helpers/tests';
import {isAttribute, isTemplateLiteral} from '../../typeChecking';
import {createTemplateLiteral} from '../../createNode';

// this
const {createAttribute} = require('./');

// prep
const {getProcessorScaffold} = initHelpers(__dirname);
const tryGetAttributeAst = (name, value) => {
  const processor = (fileInfo, api) => {
    const {j} = getProcessorScaffold(fileInfo, api);
    return createAttribute(j)(name, value);
  };

  return toAst(processor);
}


describe('attributes::createAttribute()', () => {
  it('should not create attribute on no jscodeshift instance', () => {
    expect(createAttribute()('test')).toBeNull();
  });


  describe('attribute name', () => {
    [
      null,
      undefined,
      '',
      0,
      false,
      jest.fn(),
      [],
      {},
    ].forEach(name => {
      it(`should return 'false' on: ${printType(name)}`, () => {
        expect(
          isAttribute(tryGetAttributeAst(name))
        ).toBeFalse();
      });
    })


    it('should not create an attribute on: attribute name starting with a digit', () => {
      expect(
        isAttribute(tryGetAttributeAst('0attribute'))
      ).toBeFalse();
    });


    it('should not create an attribute on: attribute name starting with a dash', () => {
      expect(
        isAttribute(tryGetAttributeAst('-attribute'))
      ).toBeFalse();
    });



    it('should not create an attribute on: attribute name including punctuation other than a dash', () => {
      expect(
        isAttribute(tryGetAttributeAst('att:ribute'))
      ).toBeFalse();
    });


    it('should not create an attribute on: attribute name ending with a dash', () => {
      expect(
        isAttribute(tryGetAttributeAst('attribute-'))
      ).toBeFalse();
    });


    it('should create an attribute on: attribute name including but not starting with a number ', () => {
      const attributeName = 'attribute5';
      const attribute = tryGetAttributeAst(attributeName);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.name.name).toBe(attributeName);

    });


    it('should create an attribute on: attribute name including but not starting with a dash ', () => {
      const attributeName = 'att-ribute';
      const attribute = tryGetAttributeAst(attributeName);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.name.name).toBe(attributeName);
    });


    it('should create an attribute on: string literals', () => {
      const attributeName = `attribute${3 + 7}`;
      const attribute = tryGetAttributeAst(attributeName);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.name.name).toBe(attributeName);
    });

  });


  describe('values', () => {
    const ATTRIBUTE_NAME = 'myAttribute';


    it('should return value-less attribute on "true"', () => {
      const attribute = tryGetAttributeAst(ATTRIBUTE_NAME, true);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.value).toBeNull();
    });


    it('should automatically create the value node for: false', () => {
      const attribute = tryGetAttributeAst(ATTRIBUTE_NAME, false);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.value.expression.value).toBe(false);
    });


    it('should automatically create the value node for: string', () => {
      const value = faker.lorem.word();
      const attribute = tryGetAttributeAst(ATTRIBUTE_NAME, value);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.value.value).toBe(value);
    });


    it('should automatically create the value node for: number', () => {
      const value = Math.random();
      const attribute = tryGetAttributeAst(ATTRIBUTE_NAME, value);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.value.expression.value).toBe(value);
    });


    it('should automatically create the value node for: null', () => {
      const attribute = tryGetAttributeAst(ATTRIBUTE_NAME, null);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.value.expression.value).toBe(null);
    });


    it(`should automatically create the value node for: template literal expression`, () => {
      const processor = (fileInfo, api) => {
        const {j} = getProcessorScaffold(fileInfo, api);

        return createAttribute(j)(
          ATTRIBUTE_NAME,
          createTemplateLiteral(j)(
            ['1', '3'],
            [j.jsxExpressionContainer(j.literal(2))]
          )
        );
      };

      const attribute = toAst(processor);

      expect(isAttribute(attribute)).toBeTrue();
      expect(isTemplateLiteral(attribute.value.expression)).toBeTrue();
    });


    it(`should automatically create the value node for : undefined`, () => {
      const attribute = tryGetAttributeAst(ATTRIBUTE_NAME, undefined);
      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.name.name).toBe(ATTRIBUTE_NAME);
      expect(attribute.value.expression).toBeTruthy();
      expect(attribute.value.expression.value).toBeUndefined();
    });


    it('should pass expression value node', () => {
      const value = Math.random();
      const processor = (fileInfo, api) => {
        const {j} = getProcessorScaffold(fileInfo, api);

        return createAttribute(j)(
          ATTRIBUTE_NAME,
          j.jsxExpressionContainer(j.literal(value))
        );
      };

      const attribute = toAst(processor);

      expect(isAttribute(attribute)).toBeTrue();
      expect(attribute.value.expression.value).toBe(value);
    });


    [
      {},
      {a:1 },
      [],
      [1,2,4],
      jest.fn(),
      new Date(),
      new RegExp('bana.*?')
    ].forEach(value => {
      it(`should ignore unsupported value : ${printType(value)}`, () => {
        const attribute = tryGetAttributeAst(ATTRIBUTE_NAME, value);
        expect(isAttribute(attribute)).toBeTrue();
        expect(attribute.name.name).toBe(ATTRIBUTE_NAME);
        expect(attribute.value).toBeNull();
      });
    });
  });
});
