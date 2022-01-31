/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (obj) {
    let propNames = path.split('.');
    return propNames.reduce((previous, current) =>
      (previous && previous[current] || undefined), obj);
  };
}
