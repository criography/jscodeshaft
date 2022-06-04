# Adding your own helper

Whatever you do, familiarise yourself with how AST works. Preferably bookmark https://astexplorer.net/ and while you're at it, set the `Transform` to `jscodeshift` and the parser to whatever understands JSX, e.g. `babel-eslint` or `flow`.

In order to achieve anything, you will have to traverse a lot of nodes, so don't be afraid to abstract even small pieces of logic in helpers for future reuse.

Also, mutation is fine. In fact, it seems it's expected. Don't over-complicate your life trying to avoid it.

Please, please, please be verbose in your comments (obviously within reason) – there are many not entirely obvious cases you'll have to handle, and nobody wants to guess what you had in mind 3 months from now. 

Currently, helpers are grouped in few collections - please try to respect it, but if your helper doesn't belong in any of those, feel free to create your own.

## Requirements
1. Verbosity and clarity over overly compact, 3746 characters per line code. Please try some linebreaks and indentation.
1. JSDoc
1. Complete test coverage
1. Documentation, including schemas and examples
1. Detailed release notes in PR's description.
