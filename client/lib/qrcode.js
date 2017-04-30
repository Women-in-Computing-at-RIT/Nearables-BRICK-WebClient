
const prefix = 'brickapp://';

export const QRCodes = {
  event: (id) => `${prefix}event/${id}`,
};

export class QRCodeData {
  
  /**
   * @param {string} prefix
   * @param {[string]} parts
   * @param {string} data
   * @param {boolean} isValid
   */
  constructor(prefix, parts, data, isValid = true) {
    this.prefix = prefix;
    this.parts = parts;
    this.data = data;
    this.isValid = isValid;
  }
  
  static invalidCode() {
    return new QRCodeData(null, null, null, false);
  }
  
}

/**
 * @param {string} data
 * @returns {QRCodeData}
 */
export function parseQRCode(data) {
  if (!data.startsWith(prefix))
    return QRCodeData.invalidCode();
  
  const pathData = data.slice(prefix.length);
  /** @type {[string]} */
  const parts = pathData.split('/');
  
  if (parts.length <= 1)
    parts.unshift('');
  
  return new QRCodeData(prefix, [...parts], parts.pop());
}
