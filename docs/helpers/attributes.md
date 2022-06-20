# Attributes

These helpers allow you to work with most JX element attributes (props). Some more specific logic for selected attributes, e.g. CSS classes, is handled by separate helper groups.


## getAttributes
Retrieves all attribute nodes from a given JSX Element path.

Can be optionally customised via options - if filtered by name
using `wantedAttributes` parameter, and no matches are found,
no attributes will be returned. To make it return all attributes
instead, override with `allOnNoMatch`.

### Attributes
| arguments | type     | description      |
|-----------|----------|------------------|
| `node`    | _Node_   | JSX Element node |
| `options` | _Object_ | Optional config  |

| option | type | default | description |
|--------|------|---------|-------------|
| `wantedAttributes` | _String\|String[]_ | N/A   | One or more attributes to find |
| `allOnNoMatch`     | _Boolean_          | false | If set, it will return all attributes on no match |

### Returns
| value    | description                     |
|----------|---------------------------------|
| `Node[]` | A collection of attribute nodes |


### Examples
```jsx
// source.js
const StatementLink = ({href, id}) => (
  <a href={href} id={id} download>
    Download statement
  </a>
);
```
```js
// codemod
import {astToSource, isImportedFromSource} from 'jscodeshaft';

const processor = (fileInfo, api) => {
  const root = api.jscodeshift(fileInfo.source);

  const firstLinkElement = root
    .findJSXElements('WithProps')
    .nodes()
    .at(0);
  
  // collection of 3 attribute nodes – `href`, `id` and `download`
  const allAttributes = getAttributes(firstLinkElement);  
  
  // collection of 1 attribute node – `download`
  const wantedAttribute = getAttributes(firstLinkElement, {
    wantedAttributes: 'download',
  });  
  
  // collection of 2 attribute nodes – `id` and `href`
  const wantedAttributes = getAttributes(firstLinkElement, {
    wantedAttributes: ['id', 'href'],
  });  
  
  // no match: empty collection
  const mismatchedAttributes = getAttributes(firstLinkElement, {
    wantedAttributes: ['onClick', 'className'],
  });  
  
  // no match: all 3 attribute nodes – `href`, `id` and `download`
  const mismatchedAttributesWithFallback = getAttributes(firstLinkElement, {
    wantedAttributes: ['onClick', 'className'],
    allOnNoMatch: true
  });
  
  // process your file here

  return astToSource(root);
};
```



## createAttribute
Creates a new attribute.
`null`, `undefined`, `boolean`, `number` and `string` literals can be passed directly, while all other types, including template and regex literals must be passed as AST expression nodes.   
All attribute `name`s that are not following the HTML and React requirements will be disregarded, e.g. if they start with anything but letters, contain any punctuation but dashes or end with any punctuation.   
All `value`s that are not one of the specified primitives or are not AST expression, will be also ignored.
If value is `true`, it will be added to the code as boolean attribute (without `={true}`).

### Attributes
| arguments | type          | description             |
|-----------|---------------|-------------------------|
| `j`       | _JSCodeShift_ | JSCodeShift instance    |

| arguments       | type        | description |
|-----------------|-------------|----------|
| `name`          | _string_    | Name of the attribute to be created |
| `value`         | _any\|Node_ | Expression node or one of the supported primitives |

### Returns
| value       | description |
|-------------|-------------|
| `null|Node` | Attribute node on success, `null` on failure |


### Examples
```js
// codemod
import {astToSource, isImportedFromSource} from 'jscodeshaft';

const processor = (fileInfo, api) => {
  const j = api.jscodeshift;

  console.log(
    createAttribute(j)()
  );
  // null

  console.log(
    createAttribute(j)('--invalidAttribute--')
  );
  // null
  
  console.log(
    createAttribute(j)('1234')
  );
  // null

  console.log(
    createAttribute(j)('disabled')
  );
  // { 
  //   name: { name: 'disabled', ...}, 
  //   value: { expression: { name: 'undefined' }, ...}, 
  //   ... 
  // }
  
  console.log(
    createAttribute(j)('id', 'banana')
  );
  // { 
  //   name: { name: 'id', ...}, 
  //   value: { value: 'banana', ...}, 
  //   ... 
  // }  
  
  console.log(
    createAttribute(j)('id', true)
  );
  // { 
  //   name: { name: 'id', ...}, 
  //   value: null, 
  //   ... 
  // }

  console.log(
    createAttribute(j)('matcher', /bana.*?/i)
  );
  // { 
  //   name: { name: 'matcher', ...}, 
  //   value: null, 
  //   ... 
  // }

  console.log(
    createAttribute(j)('matcher', j.regExpLiteral('bana.*?', 'i'))
  );
  // { 
  //   name: { name: 'matcher', ... },
  //   value: { pattern: 'bana.*?', flags: 'i', ...},
  //   ... 
  // }
  // ...
};
```
