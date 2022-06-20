import { isTruthyString } from '../../typeChecking';


/**
 * Determines if given value looks like a valid attribute/prop name.
 * Accepts `-` as the only allowed punctuation, e.g. `aria-disabled`
 * @param   {any} maybeName
 * @returns {boolean}
 */
export const isValidAttributeName = maybeName => (
  isTruthyString(maybeName)
  && /^[a-z]+[\w-]*\w$/i.test(maybeName)
);
