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

