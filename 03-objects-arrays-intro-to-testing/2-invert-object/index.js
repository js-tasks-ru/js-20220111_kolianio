/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (typeof obj === 'object') {
    let originEntries = Object.entries(obj);
    let result = [];
    for (let [key, value] of originEntries) {
      result.push([value, key]);
    }
    return Object.fromEntries(result);
  }
}
