const {
  createLiteralAttr,
  createStringLiteral,
  createTemplateLiteral,
} = require('./createNode')


/**
 * Determines whether given className attribute's is a CSS Module,
 * following the syntax of: classNames={style.banana}
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
const isCssModule = (classNameAttr) => (
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
const isClassNamesLib = (classNameAttr) => (
  classNameAttr.value.expression.type === 'CallExpression'
  && ['classnames', 'cx'].includes(classNameAttr.value.expression.callee.name)
)


/**
 * Determines whether given className attribute's uses a string literal,
 * following the syntax:
 * classNames="banana"
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
const isLiteralClassName = (classNameAttr) => (
  classNameAttr.value.type === 'Literal'
  && Boolean(classNameAttr.value.value)
)


/**
 * Determines whether given className attribute's uses a JSX string expression,
 * following the syntax:
 * classNames={"banana"}
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
const isLiteralExpression = (classNameAttr) => (
  classNameAttr.value.type === 'JSXExpressionContainer'
  && classNameAttr.value.expression.type === 'Literal'
  && Boolean(classNameAttr.value.expression.value)
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
 *    Both `cx` and `classnames` names are supported.\
 * You can also prepend the new classes rather than append.
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(newClassArgs): Node}
 */
const resolveAndSetClassNameAttr = (j) => (elNode, classNames, mode='append') => {
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

    return newLiteralValue;
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


  if (classNameAttr) {
    // process `className` with a literal value
    if (isLiteralClassName(classNameAttr)) {
      setLiteralClassName()

    // process `className` with an expression value
    } else if (classNameAttr.value.expression) {
      // Simple case: `={"class"}` will be auto-fixed to a string literal
      if (isLiteralExpression(classNameAttr)) {
        setLiteralClassName()

      // CSS modules `={style.banana}`
      } else if (isCssModule(classNameAttr)) {
        setTemplateLiteral();

      // classnames library
      } else if (isClassNamesLib(classNameAttr)) {
        classNameAttr.value.expression.arguments[mode === 'append' ? 'push' : 'unshift'](
          createStringLiteral(j)(classNames)
        )
      }
    }

  // add a new className attribute if it's absent
  } else {
    elNode.openingElement.attributes.push(
      createLiteralAttr(j)('className', classNames),
    );
  }
}



module.exports = {
  isCssModule,
  isClassNamesLib,
  isLiteralClassName,
  isLiteralExpression,
  resolveAndSetClassNameAttr,
}
