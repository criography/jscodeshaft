/**
 * Performs a partial match, testing whether {input} includes {matcher}
 * @param   {string}                input
 * @param   {string|number|RegExp}  matcher
 * @returns {boolean}
 */
export const isStringMatching = (input, matcher) => {
  let output = false;

  if(input && matcher){
    if(['string', 'number'].includes(typeof matcher)){
      output = Boolean(input.includes(matcher))
    }else if(matcher instanceof RegExp){
      output = Boolean(matcher.test(input))
    }
  }

  return output;
};
