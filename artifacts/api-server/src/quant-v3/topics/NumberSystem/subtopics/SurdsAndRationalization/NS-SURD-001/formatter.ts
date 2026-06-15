export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b > 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function simplifySurd(n: number, index: number): { coeff: number; radicand: number } {
  if (n === 0) return { coeff: 0, radicand: 0 };
  let coeff = 1;
  let rem = n;
  for (let i = 2; Math.pow(i, index) <= rem; i++) {
    while (rem % Math.pow(i, index) === 0) {
      coeff *= i;
      rem /= Math.pow(i, index);
    }
  }
  return { coeff, radicand: rem };
}

export function formatSurd(coeff: number, rad: number, index: number = 2): string {
  if (coeff === 0 || rad === 0) return "0";
  if (rad === 1) return coeff.toString();

  const radStr = index === 3 ? `\\sqrt[3]{${rad}}` : `\\sqrt{${rad}}`;
  if (coeff === 1) return radStr;
  if (coeff === -1) return `-${radStr}`;
  return `${coeff}${radStr}`;
}

export function formatFraction(numCoeff: number, numRad: number, den: number, index: number = 2): string {
  if (numCoeff === 0) return "0";
  let g = gcd(numCoeff, den);
  let c = numCoeff / g;
  let d = den / g;

  if (d < 0) {
    c = -c;
    d = -d;
  }

  const top = formatSurd(c, numRad, index);
  if (d === 1) return top;
  return `\\frac{${top}}{${d}}`;
}

export function formatSum(terms: string[]): string {
  const filtered = terms.filter(t => t !== "0");
  if (filtered.length === 0) return "0";

  let res = filtered[0];
  for (let i = 1; i < filtered.length; i++) {
    if (filtered[i].startsWith("-")) {
      res += ` - ${filtered[i].substring(1)}`;
    } else {
      res += ` + ${filtered[i]}`;
    }
  }
  return res;
}
