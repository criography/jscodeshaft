# Import

These helpers allow you to determine details, add, remove or alter import declarations


## getSpecifierNamesFromImport
Extracts all imported names from given import, including their aliases and specifier types (default or named).

### Attributes
| arguments       | type    | description |
|-----------------|---------|----------|
| `importNode`    | _Node_  | Import node |
| `specifierType` | 'ImportDefaultSpecifier'\|'ImportSpecifier' | If set, only specifiers matching it will be returned. |

### Returns
If the `importNode` is not providing actual valid import node, the helper will return `null`.

If a valid node is provided, but `specifierType` filtering returns no values, the helper will return `an empty object`.

If specifiers are found, they will be build an object with all metadata needed as illustrated in the examples below.

### Examples
```jsx
// source.js
import MassamanCurry from 'thai';
import {PastaCarbonara, PastaArrabbiata} from 'italian';
import {Cesar as CesarSalad} from 'salads';
import Juice, {Banana, Avocado as Cardboard} from 'drinks';
```
```js
// codemod
import {astToSource, isImportedFromSource} from 'jscodeshaft';

const processor = (fileInfo, api) => {
  const root = api.jscodeshift(fileInfo.source);

  const importNodes = root
    .find(j.ImportDeclaration)
    .nodes();

  console.log(getSpecifierNamesFromImport(importNodes.at(0)));
  // { MassamanCurry: { alias: 'MassamanCurry', type: 'ImportDefaultSpecifier' } }

  console.log(getSpecifierNamesFromImport(importNodes.at(1)));
  // {
  //   PastaCarbonara: { alias: 'PastaCarbonara', type: 'ImportSpecifier' },
  //   PastaArrabbiata: { alias: 'PastaArrabbiata', type: 'ImportSpecifier' }
  // }

  console.log(getSpecifierNamesFromImport(importNodes.at(2)));
  // { Cesar: { alias: 'CesarSalad', type: 'ImportSpecifier' } }

  console.log(getSpecifierNamesFromImport(importNodes.at(3)));
  // {
  //   Juice: { alias: 'Juice', type: 'ImportDefaultSpecifier' },
  //   Banana: { alias: 'Banana', type: 'ImportSpecifier' },
  //   Avocado: { alias: 'Cardboard', type: 'ImportSpecifier' }
  // }

  console.log(getSpecifierNamesFromImport(importNodes.at(1), 'ImportDefaultSpecifier'));
  // {}  
  
  console.log(getSpecifierNamesFromImport(importNodes.at(3), 'ImportDefaultSpecifier'));
  // { Juice: { alias: 'Juice', type: 'ImportDefaultSpecifier' } }

  console.log(getSpecifierNamesFromImport(importNodes.at(3), 'ImportSpecifier'));
  // {
  //   Banana: { alias: 'Banana', type: 'ImportSpecifier' },
  //   Avocado: { alias: 'Cardboard', type: 'ImportSpecifier' }
  // }

  // ...
};
```


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
