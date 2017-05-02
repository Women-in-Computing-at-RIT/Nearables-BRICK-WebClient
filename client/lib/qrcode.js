
import pathToRegexp from 'path-to-regexp';

const prefix = 'brickapp://';

/**
 * @param {RegExp} re
 * @param {string} path
 * @returns {[?string]}
 */
const parseQrCodePath = (re, path) => re.exec(path).slice(1);

/**
 * @param {string} path
 * @returns {string}
 */
const stripPrefix = (path) => path.startsWith(prefix) ? path.substr(prefix.length) : path;

/**
 * @param {string} pathRe Path string convertible to RegExp using pathToRegexp
 * @returns {function(string): [?string]}
 */
const makeParser = (pathRe) => {
  const re = pathToRegexp(pathRe);
  return (path) => parseQrCodePath(re, stripPrefix(path));
}

/**
 * @param {string} pathRe Path string convertible to RegExp using pathToRegexp
 * @returns {function(object): string}
 */
const makeFormatter = (pathRe) => {
  const compiler = pathToRegexp.compile(pathRe);
  return (params) => `${prefix}${compiler(params)}`;
};

/**
 * @enum {{ format: function(object):string, parse: function(string): [?string], create: Function<string> }}
 */
export const QRCodes = {
  event: {
    format: makeFormatter('event/:eventId'),
    parse: makeParser('event/:eventId'),
    create: (eventId) => QRCodes.event.format({ eventId }),
  },
};
