import {getType} from '../getType';


export const isFunctionCall = (node) => Boolean(
  getType(node) === 'CallExpression'
  && node.callee
  && node.callee.name
)
