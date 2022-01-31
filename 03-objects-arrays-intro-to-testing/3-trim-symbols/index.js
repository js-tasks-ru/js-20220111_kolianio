/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === '') {return '';}
  else if (size === 0) {return '';}
  else if (!size) {return string;}
  else {
    let counter = 0;
    const letters = string.split('');
    let lastSymbol = letters[0];
    let result = [];

    for (let prop of letters) {
      if (prop === lastSymbol) {
        if (counter < size) {
          result.push(prop);
          counter++;
        }
      } else {
        result.push(prop);
        lastSymbol = prop;
        counter = 1;
      }
    }

    return result.join('');
  }

}
