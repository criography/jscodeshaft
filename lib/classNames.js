import {
  createStringLiteral,
  createTemplateLiteral,
  createTemplateElement,
} from './createNode';
import { createAttr } from './attributes';
import {
  isLiteral,
  isTruthyString,
  isExpression,
  isTemplateLiteral,
} from './typeChecking';

// @TODO add: remove class
// @TODO add: replace class


/**
 * Determines whether given className attribute's is an expression,
 * following the syntax of (for example):
 * classNames={whatever} or classNames={whatever()}, etc
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
export const isClassNameExpression = (classNameAttr) => (
  isExpression(classNameAttr.value)
  && Boolean(classNameAttr.value.expression)
);


/**
 * Determines whether given className attribute's is a CSS Module,
 * following the syntax of: classNames={style.banana}
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
export const isCssModule = (classNameAttr) => (
  classNameAttr.value.expression.type === 'MemberExpression'
  && Boolean(
    classNameAttr.value.expression.object
    && /^styles?$/.test(classNameAttr.value.expression.object.name)
    && classNameAttr.value.expression.property
    && classNameAttr.value.expression.property.name
  )
)


/**
 * Determines whether given className attribute's uses classnames library,
 * following one of the syntaxes:
 * classNames={cx(...)}
 * classNames={classnames(...)}
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
export const isClassNamesLib = (classNameAttr) => (
  classNameAttr.value.expression.type === 'CallExpression'
  && ['classnames', 'cx'].includes(classNameAttr.value.expression.callee.name)
)


/**
 * Determines whether given className attribute's uses a string literal,
 * following the syntax:
 * classNames="banana"
 * @param   {Node}    classNameAttr
 * @param   {object}  [classNameAttr.value]
 * @returns {boolean}
 */
export const isLiteralClassName = ({value}) => (
  isLiteral(value)
  && isTruthyString(value.value)
)


/**
 * Determines whether given className attribute's uses a JSX string expression,
 * following the syntax:
 * classNames={"banana"}
 * @param   {Node}    classNameAttr
 * @param   {object}  [classNameAttr.value]
 * @returns {boolean}
 */
const isLiteralExpression = ({value}) => (
  isExpression(value)
  && isLiteral(value.expression)
  && Boolean(value.expression.value)
)

/**
 * Determines whether given className attribute's uses a JSX template literal expression,
 * following the syntax:
 * classNames={`banana ${orange}`}
 * @param   {Node}    classNameAttr
 * @param   {object}  [classNameAttr.value]
 * @returns {boolean}
 */
const isTemplateLiteralExpression = ({value}) => (
  isExpression(value)
  && isTemplateLiteral(value.expression)
  && value.expression.quasis.length > 0
)


/**
 * @typedef {function}            newClassArgs
 * @param   {node}                elNode
 * @param   {string}              classNames
 * @param   {'append'|'prepend'}  [mode='append']
 * @returns {Node}
 *//**
 * Mutate given node by updating or creating className attribute,
 * respecting all its existing values. This method supports the
 * following transformations:
 * 1. className="old"             > className="old new"
 * 2. className={"old"}           > className="old new"
 * 3. className={style.old}       > className={`${style.old} new`}
 * 4. className={cx('old', ...)}  > className={cx('old', ..., 'new')}
 *    Both `cx` and `classnames` names are supported.
 * You can also prepend the new classes rather than append.
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(newClassArgs): Node}
 */
export const resolveAndSetClassNameAttr = (j) => (elNode, classNames, mode='append') => {
  const attributes = elNode.openingElement.attributes || [];
  const classNameAttr = attributes.find(
    ({name}) => Boolean(name && name.name === 'className')
  );
  let newLiteralValue;


  const setNewLiteralValue = () => {
    if(!newLiteralValue){
      let existingClassName = '';

      if(classNameAttr.value.value){
        existingClassName = classNameAttr.value.value;
      }else if(classNameAttr.value.expression && classNameAttr.value.expression.value){
        existingClassName = classNameAttr.value.expression.value;
      }

      newLiteralValue = [existingClassName, classNames]
        .sort(() => mode === 'append' ? 1 : -1)
        .join(' ');
    }

    return newLiteralValue.trim();
  }


  const setLiteralClassName = () => {
    classNameAttr.value = createStringLiteral(j)(setNewLiteralValue());
  }


  const setTemplateLiteral = () => {
    classNameAttr.value.expression = createTemplateLiteral(j)(
      mode === 'append' ? ['', ' ' + classNames] : [classNames + ' ', ''],
      [ classNameAttr.value.expression]
    );
  }


  const extendTemplateLiteral = () => {
    const quasis = classNameAttr.value.expression.quasis;

    if(mode === 'append'){
      const quasiIndex = quasis.length - 1;
      const lastQuasi = quasis[quasiIndex];

      quasis[quasiIndex] = createTemplateElement(j)(
        [lastQuasi.value.raw, classNames].join(' '),
        true
      );
    }else{
      const firstQuasi = quasis[0];
      quasis[0] = createTemplateElement(j)(
        [classNames, firstQuasi.value.raw].join(' '),
        firstQuasi.tail
      );
    }
  }


  if (classNameAttr) {
    // process `className` with a literal value
    if (isLiteralClassName(classNameAttr)) {
      setLiteralClassName()

    // process `className` with an expression value
    } else if (classNameAttr.value.expression) {
      // Simple case: `={"class"}` will be auto-fixed to a string literal
      if (isLiteralExpression(classNameAttr)) {
        setLiteralClassName();

      // Template literal will be injected with the new bit
      }else if(isTemplateLiteralExpression(classNameAttr)){
        extendTemplateLiteral();

      // classnames library
      } else if (isClassNamesLib(classNameAttr)) {
        classNameAttr.value.expression.arguments[mode === 'append' ? 'push' : 'unshift'](
          createStringLiteral(j)(classNames)
        )

      // Other expressions `={style.banana}` or `={getClasses()}`, etc
      } else if (isClassNameExpression(classNameAttr)) {
        setTemplateLiteral();
      }
    }

  // add a new className attribute if it's absent
  } else {
    if(classNames){
      elNode.openingElement.attributes.push(
        createAttr(j)('className', classNames),
      );
    }
  }
}
