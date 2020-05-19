import { h, Component, Fragment as F,  } from 'preact';
import { useEffect } from 'preact/hooks';
import cx from 'classnames';
import Prism from 'prismjs';

import style from './style.scss';

// props
const defaultProps = {
};
const propTypes = {
};

/**
 *
 *
 * @param   {object}        props           Props
 * @returns {ReactElement}
 **/
const Attributes = () =>{
  useEffect(() => {
    Prism.highlightAll();
  }, []);


  return (
    <F>
      <section className={cx(style.section, style.single)}>
        <div className="padded text">
          <h2>
            Page title
          </h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias cum dicta et rerum vitae! Debitis facilis inventore quibusdam repellat voluptas? Alias aspernatur assumenda debitis dignissimos eum, officia quo sunt temporibus.</p>
        </div>
      </section>

      <section className={cx(style.section, style.dual)}>
        <div className="padded text">
          <h3>getAttrs</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid delectus doloribus hic laboriosam natus. Architecto aspernatur, cupiditate deleniti dicta doloribus enim nemo nulla odit perferendis perspiciatis, temporibus ullam, velit.</p>
        </div>
        <div className={cx(style.srcWrapper, 'dark')}>
          <pre className={cx(style.src, 'line-numbers')}>
            <code className="language-js" dangerouslySetInnerHTML={{ __html: `export const isCssModule = (classNameAttr) => (
  classNameAttr.value.expression.type === 'MemberExpression'
  && Boolean(
    classNameAttr.value.expression.object
    && /^styles?$/.test(classNameAttr.value.expression.object.name)
    && classNameAttr.value.expression.property
    && classNameAttr.value.expression.property.name
  )
)`}}>
            </code>
          </pre>
        </div>
      </section>


      <section className={cx(style.section, style.dual)}>
        <div className="padded text">
          <h3>getAttrs</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid delectus doloribus hic laboriosam natus. Architecto aspernatur, cupiditate deleniti dicta doloribus enim nemo nulla odit perferendis perspiciatis, temporibus ullam, velit.</p>
        </div>
        <div className={cx(style.srcWrapper, 'dark')}>
          <code>
            <pre>
export const isCssModule = (classNameAttr) => (
  classNameAttr.value.expression.type === 'MemberExpression'
  && Boolean(
    classNameAttr.value.expression.object
    && /^styles?$/.test(classNameAttr.value.expression.object.name)
    && classNameAttr.value.expression.property
    && classNameAttr.value.expression.property.name
  )
)
            </pre>
          </code>
        </div>
      </section>
    </F>
)};


Attributes.defaultProps = defaultProps;
Attributes.propTypes = propTypes;

export default Attributes;
