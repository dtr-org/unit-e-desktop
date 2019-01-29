const MAX_ROUNDING_DIGITS = 8;

const AMOUNT_REGEX = /^(-?)(\d+)(?:\.(\d+))?$/;

type Sign = (-1 | 1);


/**
 * Encodes a Unit-e monetary amount (0.00000001 to 2718281828) as an array of
 * digits (0-9) representing the amount in Satoshi. The digits are stored in
 * reverse order (least significant one first).
 */
export class Amount {

  static ZERO: Amount  = Amount.fromString('0');

  private digits: number[];

  private sign: Sign;

  static fromNumber(value: number): Amount {
    return Amount.fromString(value.toString());
  }

  static fromString(value: string): Amount {
    const matches = value.trim().match(AMOUNT_REGEX);
    if (matches.length < 2) {
      throw new Error(`Argument '${value} does not look like a number!`);
    }
    if (matches[3]) {
      matches[3] = matches[3].substr(0, MAX_ROUNDING_DIGITS);
    }

    const digits = makeSatoshiBignum(matches[2], matches[3] || '');
    const sign = (matches[1].length > 0) ? -1 : 1;
    return new Amount(digits, sign);
  }

  private constructor(digits: number[], sign?: Sign) {
    this.digits = digits;
    this.sign = sign;
  }

  public toString() {
    const parts = [
      this.getIntegerPart(), this.dot(), this.getFractionalPart()
    ];
    return parts.join('');
  }

  public getAmountWithFee(fee: Amount): Amount {
    return this.add(fee);
  }

  /**
   * Returns the integer part for display purposes.
   * e.g:
   * -25.9 -> '-25', 25 -> '25', 25.9 -> '25'
   */
  public getIntegerPart(): string {
    const parts: any[] = [(this.sign < 0) ? '-' : ''];
    parts.push(...this.digits.slice(8).reverse());
    return parts.join('');
  }

  /**
   * Returns the fractional part for display purposes.
   * e.g:
   * -25.9 -> '9', 25 -> '0', 25.9 -> '9'
   */
  public getFractionalPart(maxDigits: number = 8): string {
    if (!this.hasDot()) {
      return '';
    }
    return this.digits.slice(0, 8).reverse().join('')
      .replace(/0+$/, '').substr(0, maxDigits);
  }

  /**
   * Returns a dot only when it exists in the number.
   * e.g:
   * -25.9 -> '.', 25 -> '', 25.9 -> '.'
   */
  dot(): string {
    return this.hasDot() ? '.' : '';
  }

  hasDot(): boolean {
    for (let i = 0; i < 8; i++) {
      if (0 < this.digits[i]) {
        return true;
      }
    }
    return false;
  }

  negate(): Amount {
    return new Amount(this.digits, -this.sign as Sign);
  }

  add(other: Amount): Amount {
    if (this.sign === other.sign) {
      const newAmount = addBignums(this.digits, other.digits);
      return new Amount(newAmount, this.sign);
    } else if (bignumLessOrEqualTo(other.digits, this.digits)) {
      const newAmount = subBignums(this.digits, other.digits);
      return new Amount(newAmount, this.sign);
    } else {
      const newAmount = subBignums(other.digits, this.digits);
      return new Amount(newAmount, other.sign);
    }
  }

  sub(other: Amount): Amount {
    return this.add(other.negate());
  }

  lessOrEqualTo(other: Amount): boolean {
    return (this.sign > 0 && other.sign < 0) ||
           (this.sign > 0 && other.sign > 0 && bignumLessOrEqualTo(this.digits, other.digits)) ||
           (this.sign < 0 && other.sign < 0 && bignumLessOrEqualTo(other.digits, this.digits));
  }
}


/**
 * Splits a string representation of a number into an array of digits (little-endian).
 */
function makeSatoshiBignum(integerPart: string, fractionalPart: string): number[] {
    const chars = integerPart.split('');
    chars.reverse();

    const digits = new Array(chars.length + 8);
    for (let i = 0; i < chars.length; i++) {
      digits[i + 8] = parseInt(chars[i], 10);
    }

    for (let i = 0; i < 8; i++) {
      digits[7 - i] = (i < fractionalPart.length) ? parseInt(fractionalPart[i], 10) : 0;
    }

    return digits;
}


// Unsigned arithmetic on bignums (arrays of decimal digits, least significant
// digit first).

/**
 * Adds two bignums, returns a newly allocated one as the result.
 */
function addBignums(a: number[], b: number[]): number[] {
  const result = [];
  let carry = 0;
  let i = 0;

  for (; i < Math.max(a.length, b.length); i++) {
    const newValue = (a[i] || 0) + (b[i] || 0) + carry;
    carry = (newValue > 9) ? 1 : 0;
    result.push(newValue % 10);
  }

  if (carry > 0) {
    result.push(carry);
  }

  return result;
}


/**
 * Subtracts the second number from the first. Caller must ensure that the
 * first number is greater in absolute magnitude.
 */
function subBignums(a: number[], b: number[]): number[] {
  const result = [];
  let borrow = 0;
  let i = 0;

  for (; i < Math.max(a.length, b.length); i++) {
    let newValue = (a[i] || 0) - (b[i] || 0) - borrow;
    if (newValue < 0) {
      newValue += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    result.push(newValue);
  }

  return result;
}


function bignumLessOrEqualTo(a: number[], b: number[]): boolean {
  for (let i = Math.max(a.length, b.length) - 1; i >= 0; i--) {
    const x = a[i] || 0;
    const y = b[i] || 0;

    if (x > y) {
      return false;
    }
    if (x < y) {
      return true;
    }
  }

  return true;
}
