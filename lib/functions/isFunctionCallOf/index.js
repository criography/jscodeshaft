import {isFunctionCall} from '../../typeChecking';


/**
 * @typedef {function}  isFunctionCallOfArgs
 * @param   {string}    fname    Function name
 * @returns {void}
 *//**
 * Tests whether function call expression matches given fn name
 * @param  {object} node    Call Expression node to test
 * @return {isFunctionCallOfArgs}
 */
export const isFunctionCallOf = ({value}) => fname => (
  isFunctionCall(value)
  && value.callee.name === fname
);
