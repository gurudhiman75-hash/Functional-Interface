export function isPrime(value: number) {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let factor = 3; factor * factor <= value; factor += 2) {
    if (value % factor === 0) return false;
  }
  return true;
}

export function primesBetween(lowerBound: number, upperBound: number) {
  const primes: number[] = [];
  for (let value = Math.max(2, lowerBound); value <= upperBound; value += 1) {
    if (isPrime(value)) primes.push(value);
  }
  return primes;
}

export function nextPrimeAfter(number: number) {
  let candidate = number + 1;
  while (!isPrime(candidate)) candidate += 1;
  return candidate;
}

export function previousPrimeBefore(number: number) {
  for (let candidate = number - 1; candidate >= 2; candidate -= 1) {
    if (isPrime(candidate)) return candidate;
  }
  throw new Error(`No previous prime exists before ${number}.`);
}

export function nthPrime(position: number) {
  if (!Number.isInteger(position) || position < 1) throw new Error(`Invalid prime position: ${position}`);
  let count = 0;
  let candidate = 1;
  while (count < position) {
    candidate += 1;
    if (isPrime(candidate)) count += 1;
  }
  return candidate;
}
