// @TODO add undefined ?
export const isPrimitive = val => (
  val === null
  || ['string', 'number', 'boolean'].includes(typeof val)
);
