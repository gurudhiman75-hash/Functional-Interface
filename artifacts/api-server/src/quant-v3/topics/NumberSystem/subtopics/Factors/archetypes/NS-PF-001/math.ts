import type { NsPf001Factorization, NsPf001FactorTerm } from "./types";

export function isPrime(value: number) {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let factor = 3; factor * factor <= value; factor += 2) {
    if (value % factor === 0) return false;
  }
  return true;
}

export function primeFactorize(number: number): NsPf001Factorization {
  if (!Number.isInteger(number) || number < 2) {
    throw new Error(`NS-PF-001 number must be an integer greater than 1: ${number}`);
  }

  let remainder = number;
  const terms: NsPf001FactorTerm[] = [];

  for (let factor = 2; factor * factor <= remainder; factor += factor === 2 ? 1 : 2) {
    if (remainder % factor !== 0) continue;
    let exponent = 0;
    let power = 1;
    while (remainder % factor === 0) {
      remainder /= factor;
      exponent += 1;
      power *= factor;
    }
    terms.push({ prime: factor, exponent, power });
  }

  if (remainder > 1) {
    terms.push({ prime: remainder, exponent: 1, power: remainder });
  }

  const orderedPrimeBases = terms.map((term) => term.prime);
  const exponentsByPrime = Object.fromEntries(terms.map((term) => [String(term.prime), term.exponent]));
  const repeatedPrimeFactors = terms.flatMap((term) => Array.from({ length: term.exponent }, () => term.prime));
  const totalPrimeFactorCount = repeatedPrimeFactors.length;
  const distinctPrimeFactorCount = terms.length;
  const factorizationText = `${number} = ${terms.map(formatTermText).join(" x ")}`;
  const factorizationLatex = `${number} = ${terms.map(formatTermLatex).join(" \\times ")}`;

  return {
    number,
    terms,
    orderedPrimeBases,
    exponentsByPrime,
    repeatedPrimeFactors,
    totalPrimeFactorCount,
    distinctPrimeFactorCount,
    smallestPrimeFactor: terms[0].prime,
    largestPrimeFactor: terms[terms.length - 1].prime,
    factorizationText,
    factorizationLatex,
  };
}

export function formatFactorizationAnswer(factorization: NsPf001Factorization) {
  return factorization.terms.map(formatTermText).join(" x ");
}

export function validateFactorizationProduct(factorization: NsPf001Factorization) {
  return factorization.terms.reduce((product, term) => product * term.power, 1) === factorization.number;
}

export function exponentOfPrime(factorization: NsPf001Factorization, prime: number) {
  return factorization.exponentsByPrime[String(prime)] ?? 0;
}

export function primePower(prime: number, exponent: number) {
  return prime ** exponent;
}

export function classifyInput(number: number) {
  return isPrime(number) ? "Prime" : "Composite";
}

export function numberShape(factorization: NsPf001Factorization) {
  if (isPrime(factorization.number)) return "prime_input";
  if (factorization.distinctPrimeFactorCount >= 2) return "mixed_prime";
  if (factorization.terms.some((term) => term.exponent > 1)) return "repeated_prime";
  return "composite_input";
}

export function hasRepeatedPrime(factorization: NsPf001Factorization) {
  return factorization.terms.some((term) => term.exponent > 1);
}

export function hasPrimePower(factorization: NsPf001Factorization) {
  return factorization.terms.some((term) => term.exponent >= 2);
}

export function hasMixedPrimes(factorization: NsPf001Factorization) {
  return factorization.distinctPrimeFactorCount >= 2;
}

function formatTermText(term: NsPf001FactorTerm) {
  return term.exponent === 1 ? String(term.prime) : `${term.prime}^${term.exponent}`;
}

function formatTermLatex(term: NsPf001FactorTerm) {
  return term.exponent === 1 ? String(term.prime) : `${term.prime}^{${term.exponent}}`;
}
