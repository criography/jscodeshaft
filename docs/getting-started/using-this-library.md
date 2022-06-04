# Getting started
The best way to practice writing a codemod with jscodeshaft, is by using the sandbox environment.

## Playground
1. First, clone the repository.
1. Copy `/sandbox/transformer.template.js` as `/sandbox/transformer.js` - this will contain your codemod.
1. Create a JS test file in `/sandbox/src/` - this will be the subject you'll process.
1. Run `npm start` - this will use the `transformer.js` to process your test file and print the outcome in the console, without modifying the file.
1. If you want to save the file, alter the following line in the `transformer.js`:
   ```diff
   - console.log(h.astToSource(root));
   + return h.astToSource(root);
   ```

## Hacking AST
AST is nothing more but a deeply nested object containing semantic and stylistic descriptors of your code. In order to modify it, you need to remove, add or alter whole branches or individual properties of said object. The process is nor very complicated or scientific:
1. Get your code into https://astexplorer.net/ and see how AST represents it
1. Try all variants you can think of using your local test file.
1. `console.log(JSON.stringify(ast, null, 2))` often.
1. Don't be afraid to mutate.
1. Accept you will not be able to codemod everything - always assess the effort of writing a codemod VS manual change.
