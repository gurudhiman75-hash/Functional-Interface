export interface Rational { readonly n: number; readonly d: number }

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

export function rational(n: number, d: number): Rational {
  if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) throw new Error("Invalid rational");
  const g = gcd(n, d);
  let nn = n / g;
  let dd = d / g;
  if (dd < 0) { nn = -nn; dd = -dd; }
  return { n: nn, d: dd };
}

export function fractionLatex(value: Rational): string {
  if (value.d === 1) return `\\(${value.n}\\)`;
  return `\\(\\frac{${value.n}}{${value.d}}\\)`;
}

export function fractionBody(value: Rational): string {
  return value.d === 1 ? String(value.n) : `\\frac{${value.n}}{${value.d}}`;
}

export function compareRational(a: Rational, b: Rational): number {
  const left = a.n * b.d;
  const right = b.n * a.d;
  return left === right ? 0 : left < right ? -1 : 1;
}

export function denominatorPrimeProfile(value: Rational): { twos: number; fives: number; rest: number } {
  let d = Math.abs(value.d);
  let twos = 0;
  let fives = 0;
  while (d % 2 === 0) { twos += 1; d /= 2; }
  while (d % 5 === 0) { fives += 1; d /= 5; }
  return { twos, fives, rest: d };
}

export function terminates(value: Rational): boolean {
  return denominatorPrimeProfile(value).rest === 1;
}

export function terminatingPlaces(value: Rational): number | null {
  const p = denominatorPrimeProfile(value);
  return p.rest === 1 ? Math.max(p.twos, p.fives) : null;
}

export function terminatingDecimal(value: Rational): string {
  const places = terminatingPlaces(value);
  if (places === null) throw new Error("Rational does not terminate");
  const negative = value.n < 0;
  const n = Math.abs(value.n);
  const scale = 10 ** places;
  const scaled = n * (scale / value.d);
  const whole = Math.floor(scaled / scale);
  const frac = String(scaled % scale).padStart(places, "0");
  const body = places === 0 ? String(whole) : `${whole}.${frac}`;
  return negative ? `-${body}` : body;
}

export interface DecimalCycle {
  readonly integerPart: number;
  readonly nonRepeating: string;
  readonly repeating: string;
}

export function decimalCycle(value: Rational, maxSteps = 30): DecimalCycle {
  const sign = value.n < 0 ? -1 : 1;
  const n = Math.abs(value.n);
  const integerPart = Math.floor(n / value.d) * sign;
  let rem = n % value.d;
  const seen = new Map<number, number>();
  const digits: number[] = [];
  let repeatStart = -1;
  for (let i = 0; rem !== 0 && i < maxSteps; i += 1) {
    if (seen.has(rem)) { repeatStart = seen.get(rem)!; break; }
    seen.set(rem, i);
    rem *= 10;
    digits.push(Math.floor(rem / value.d));
    rem %= value.d;
  }
  if (rem === 0) return { integerPart, nonRepeating: digits.join(""), repeating: "" };
  if (repeatStart < 0) throw new Error("Recurring cycle exceeded bound");
  return {
    integerPart,
    nonRepeating: digits.slice(0, repeatStart).join(""),
    repeating: digits.slice(repeatStart).join(""),
  };
}

export function recurringLatex(value: Rational): string {
  const cycle = decimalCycle(value);
  if (!cycle.repeating) return `\\(${terminatingDecimal(value)}\\)`;
  const sign = value.n < 0 ? "-" : "";
  const whole = Math.abs(cycle.integerPart);
  return `\\(${sign}${whole}.${cycle.nonRepeating}\\overline{${cycle.repeating}}\\)`;
}

export function pureRecurringToRational(block: number, digits: number): Rational {
  return rational(block, 10 ** digits - 1);
}

export function mixedRecurringToRational(prefix: number, prefixDigits: number, block: number, blockDigits: number): Rational {
  const full = prefix * 10 ** blockDigits + block;
  return rational(full - prefix, 10 ** (prefixDigits + blockDigits) - 10 ** prefixDigits);
}

export function decimalDigitsToRational(whole: number, digits: number, places: number): Rational {
  const sign = whole < 0 ? -1 : 1;
  const absWhole = Math.abs(whole);
  const scale = 10 ** places;
  return rational(sign * (absWhole * scale + digits), scale);
}
