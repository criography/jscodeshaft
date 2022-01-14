# JSCodeShaft
A collection of simple, often deliberately primitive [JSCodeShift](https://github.com/facebook/jscodeshift) helpers and abstractions to ease the pain of upgrading/migrating and deprecating certain aspects of your codebases. The primary focus here are React-based design systems, but fair amount of code here may work in other envs too. 

> `shaft` *noun [C]*   
> a rod forming part of a machine such as an engine, that turns in order to pass power on to the machine.  

<br />
<h3>NB: this project is at its very early stages. Use with general suspicion.</h3>
<br />



### Prerequisites
A parent project including `jscodeshift@0.13.1` or newer.



### Contributing
Whatever you do, familiarise yourself with how AST works. Preferably bookmark https://astexplorer.net/ and while you're at it, set the `Transform` to `jscodeshift` and the parser to whatever understands JSX, e.g. `babel-eslint` or `flow`.

In order to achieve anything, you will have to traverse a lot of nodes, so don't be afraid to abstract even small pieces of logic in helpers for future reuse.
 
Also, mutation is fine. In fact, it seems it's expected. Don't over-complicate your life trying to avoid it.

Please, please, please be verbose in your comments (obviously within reason) – there are many not entirely obvious cases you'll have to handle, and nobody wants to guess what you had in mind 3 months from now. 


### TODOs
- [ ] ensure the package is consumable as expected
- [ ] cleanup all helpers and their categories
- [ ] sort out a roadmap
- [ ] add a proper documentation on AST, JSCodeShift and this.


### Various resources
1. https://github.com/sejoker/awesome-jscodeshift
1. https://github.com/rajasegar/awesome-codemods
1. https://github.com/cowchimp/awesome-ast
1. https://github.com/facebook/jscodeshift/tree/master/src/collections
1. https://github.com/cpojer/js-codemod
1. https://gist.github.com/ptbrowne/4fab98301c8bcffeaf3af215025d5b2c
1. https://vramana.github.io/blog/2015/12/21/codemod-tutorial/
1. https://skovy.dev/jscodeshift-custom-transform/
1. https://github.com/cpojer/js-codemod/blob/master/transforms/template-literals.js
1. https://www.npmjs.com/package/jscodeshift-helper
1. https://katilius.dev/writing-js-codemods/
