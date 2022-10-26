import {
  createStringLiteral,
  createTemplateLiteral,
  createTemplateElement,
} from '../../createNode';
import { createAttribute } from '../../attributes';

import { isLiteralClassName } from '../isLiteralClassName';
import { isLiteralExpression } from '../isLiteralExpression';
import { isTemplateLiteralExpression } from '../isTemplateLiteralExpression';
import { isClassNamesLib } from '../isClassNamesLib';
import { isClassNameExpression } from '../isClassNameExpression';


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
        createAttribute(j)('className', classNames),
      );
    }
  }
}
