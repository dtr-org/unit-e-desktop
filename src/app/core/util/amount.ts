// The number of digits after the decimal point in an Amount
const PRECISION_DIGITS = 8;

const AMOUNT_REGEX = /^(-?)(\d+)(?:\.(\d+))?$/;

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Sign = (-1 | 1);

type BigNum = Digit[];

/**
 * Encodes a Unit-e monetary amount (0.00000001 to 2718281828) as an array of
 * digits (0-9) representing the amount in Satoshi. The digits are stored in
 * reverse order (least significant one first).
 */
export class Amount {

  static ZERO: Amount  = Amount.fromString('0');

  private digits: BigNum;

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
      matches[3] = matches[3].substr(0, PRECISION_DIGITS);
    }

    const digits = makeSatoshiBignum(matches[2], matches[3] || '');
    const sign = (matches[1].length > 0) ? -1 : 1;
    return new Amount(digits, sign);
  }

  private constructor(digits: BigNum, sign: Sign) {
    this.digits = digits;
    this.sign = sign;
  }

  public toString() {
    const parts = [
      this.getIntegralPart(), this.dot(), this.getFractionalPart()
    ];
    return parts.join('');
  }

  /**
   * Returns the integer part for display purposes.
   * e.g:
   * -25.9 -> '-25', 25 -> '25', 25.9 -> '25'
   */
  public getIntegralPart(): string {
    const parts: any[] = [(this.sign < 0) ? '-' : ''];
    parts.push(...this.digits.slice(PRECISION_DIGITS).reverse());
    return parts.join('');
  }

  /**
   * Returns the fractional part for display purposes.
   * e.g:
   * -25.9 -> '9', 25 -> '0', 25.9 -> '9'
   */
  public getFractionalPart(maxDigits: number = PRECISION_DIGITS): string {
    if (!this.hasDot()) {
      return '';
    }
    return this.digits.slice(0, PRECISION_DIGITS).reverse().join('')
      .replace(/0+$/, '').substr(0, maxDigits);
  }

  /**
   * Returns a dot only when it exists in the number, for display purposes.
   * e.g:
   * -25.9 -> '.', 25 -> '', 25.9 -> '.'
   */
  dot(): string {
    return this.hasDot() ? '.' : '';
  }

  hasDot(): boolean {
    for (let i = 0; i < PRECISION_DIGITS; i++) {
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
    } else if (bignumLessThanOrEqualTo(other.digits, this.digits)) {
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

  lessThanOrEqualTo(other: Amount): boolean {
    return (this.sign > 0 && other.sign < 0) ||
           (this.sign > 0 && other.sign > 0 && bignumLessThanOrEqualTo(this.digits, other.digits)) ||
           (this.sign < 0 && other.sign < 0 && bignumLessThanOrEqualTo(other.digits, this.digits));
  }
}


/**
 * Splits a string representation of a number into an array of digits (little-endian).
 */
function makeSatoshiBignum(integralPart: string, fractionalPart: string): BigNum {
    const chars = integralPart.split('');
    chars.reverse();

    const digits = new Array(chars.length + PRECISION_DIGITS);
    for (let i = 0; i < chars.length; i++) {
      digits[i + PRECISION_DIGITS] = parseInt(chars[i], 10);
    }

    for (let i = 0; i < PRECISION_DIGITS; i++) {
      digits[PRECISION_DIGITS - i - 1] = (i < fractionalPart.length) ? parseInt(fractionalPart[i], 10) : 0;
    }

    return digits;
}


// Unsigned arithmetic on bignums (arrays of decimal digits, least significant
// digit first).

/**
 * Adds two bignums, returns a newly allocated one as the result.
 */
function addBignums(a: BigNum, b: BigNum): BigNum {
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
function subBignums(a: BigNum, b: BigNum): BigNum {
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


function bignumLessThanOrEqualTo(a: BigNum, b: BigNum): boolean {
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
