/**
 * Create a cached version of fn that given an input string returns a
 * cached return value mapped from the string, regardless if fn is a new function every time.
 * created.
 * @param {*} fn The function call to be cached
 * @void
 */
// TODO Replace this with a proper memo(fn) based on args per function.
export function cached(fn) {
  const cache = Object.create(null);
  return function (str) {
    const key = isPrimitive(str) ? str : JSON.stringify(str);
    const hit = cache[key];
    return hit || (cache[key] = fn(str));
  };
}

/**
 * Hyphenate a camelCase string.
 */
export const hyphenate = cached(str => {
  return str.replace(/([A-Z])/g, m => '-' + m.toLowerCase());
});

/**
 * Check if value is primitive
 * @param {*} value Checks if a value is primitive
 * @returns {value is string | number} Result of the check
 */
export function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number';
}

/**
 * Performs no operation.
 * @void
 */
export function noop() {}

/**
 * Check if value is function
 * @param {*} obj Any javascript object
 * @returns {obj is Function} True if the passed-in value is a function
 */
export function isFn(obj) {
  return typeof obj === 'function';
}

/**
 * Check if url is external
 * @param {String} string  url
 * @returns {Boolean} True if the passed-in url is external
 */
export function isExternal(url) {
  const match = url.match(
    /^([^:/?#]+:)?(?:\/{2,}([^/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/,
  );

  if (
    typeof match[1] === 'string' &&
    match[1].length > 0 &&
    match[1].toLowerCase() !== location.protocol
  ) {
    return true;
  }
  if (
    typeof match[2] === 'string' &&
    match[2].length > 0 &&
    match[2].replace(
      new RegExp(
        ':(' + { 'http:': 80, 'https:': 443 }[location.protocol] + ')?$',
      ),
      '',
    ) !== location.host
  ) {
    return true;
  }
  if (/^\/\\/.test(url)) {
    return true;
  }
  return false;
}

/**
 * Converts RGB color value to HSL
 * @param {String} rgbStr RGB or RGBA string
 * @returns {Array} Array of HSL values
 */
export function rgbToHsl(rgbStr) {
  if (!rgbStr.startsWith('rgb')) {
    throw new Error(`rgbToHsl(): Invalid RGB string ${rgbStr}`);
  }

  const [r, g, b] = rgbStr.match(/\d+/g);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = Math.floor((max + min) / ((0xff * 2) / 100));

  if (max === min) {
    return [0, 0, l];
  }

  const d = max - min;
  const s = Math.floor((d / (l > 50 ? 0xff * 2 - max - min : max + min)) * 100);

  if (max === r) {
    return [Math.floor(((g - b) / d + (g < b && 6)) * 60), s, l];
  }

  return max === g
    ? [Math.floor(((b - r) / d + 2) * 60), s, l]
    : [Math.floor(((r - g) / d + 4) * 60), s, l];
}
