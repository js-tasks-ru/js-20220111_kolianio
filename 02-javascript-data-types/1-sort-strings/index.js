/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const result = arr.slice().sort((str1, str2) => {
    return str1.localeCompare(str2, ['ru', 'en'], {caseFirst: 'upper'});
  });
  if (param === 'asc') {
    return result;
  } else if (param === 'desc') {
    return result.reverse();
  }
}
