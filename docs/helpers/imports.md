# Import

These helpers allow you to determine details, add, remove or alter import declarations


## isImportedFromSource
Determine if `{specifierName}` has been imported from a specific `{importSource}`, which can be either a path or package name.
This is useful if, for example, your codebase has multiple components with the same name (internal or external) and you want to confirm you're processing the right one.

### Attributes
| arguments | type      | description             |
|-----------|-----------|-------------------------|
| `root`    | _Program_ | AST-ified file contents |

| arguments       | type    | description |
|-----------------|---------|----------|
| `specifierName` | _string\|RegExp_ | Name of the item imported |
| `importSource`  | _string\|RegExp_ | File path or package name |

### Returns
| value   | description |
|---------|-------------|
| `true`  | a match has been found. |
| `false` | no match found <br/>or invalid arguments passed <br/>or no import declarations present |


### Examples
```jsx
// source.js
import {IconCar, IconBike, Theme} from '@company/design-system';
import Button, {Link, Notification} from '../../components';
import {Box as Card} from '../../../pdf-renderer/components';
```
```js
// codemod
import {astToSource, isImportedFromSource} from 'jscodeshaft';

const processor = (fileInfo, api) => {
  const root = api.jscodeshift(fileInfo.source);
  
  const usesMaterialIcons = isImportedFromSource(root)(/^Icon/, '@company/design-system');  
  const usesInternalButton = isImportedFromSource(root)('Button', './components');  
  const usesPdfRendererCard = isImportedFromSource(root)('Card', /pdf-renderer/);

  if(usesMaterialIcon || usesInternalButton){
    // conditionally process things here
  }
  
  if(usesPdfRendererCard){
    // conditionally process things here
  }

  return astToSource(root);
};
```
