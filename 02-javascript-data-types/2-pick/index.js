/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let futureObj = [];
  fields.forEach(prop => {
    if (Object.keys(obj).includes(prop)) {
      futureObj.push([prop, obj[prop]]);
    }
  });
  return Object.fromEntries(futureObj);
};
