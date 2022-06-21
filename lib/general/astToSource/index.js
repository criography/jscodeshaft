/**
 * Transform AST back to the source code.
 * `toSource` method accepts Recast's options.
 * Wrapping is disabled as it should be governed by our eslint.
 * @see https://github.com/benjamn/recast/blob/master/lib/options.ts
 *
 * @param   {object}  root    AST-ified file content
 * @returns {string}
 */
export const astToSource = (root) => (
  root.toSource({
    tabWidth: 2,
    wrapColumn: 9999,
  })
);
