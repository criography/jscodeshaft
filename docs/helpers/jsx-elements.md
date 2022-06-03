# JSX elements

These helpers deal with direct manipulation of renderable nodes (Elements or otherwise).


## getMeaningfulChildren
In some cases you need to get all direct children that are either elements, literals or expressions and ignore all text nodes that are just whitespace.

### Attributes
| arguments | type | description         |
|-----------|------|---------------------|
| `childrenNodes` | _Node[]_ | Collection of Nodes |

### Returns
| value    | description                     |
|----------|---------------------------------|
| `Node[]` | Collection of Nodes excluding whitespace text |

### Example
```jsx
// source.js
const MyComponent = ({name}) => (
  <section>
    <h1>Hello</h1>
    
    <p>This the most amazing paragraph of text in the world</p>
    
    {name}
  </section>
);
```
```js
// codemod
import {astToSource, getMeaningfulChildren} from 'jscodeshaft';

const processor = (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  const parentNode = root
    .findJSXElements('section')
    .nodes()
    .at(0);

  parentNode.children = getMeaningfulChildren(parentNode.children);

  return astToSource(root);
};
```
```jsx
// result
const MyComponent = ({name}) => (
  <section><h1>Hello</h1><p>This the most amazing paragraph of text in the world</p>{name}</section>
);
```
