import assert from "node:assert/strict";

function divisorCount(n: number) {
  let count = 0;
  for (let d = 1; d <= n; d += 1) if (n % d === 0) count += 1;
  return count;
}

function isSquare(n: number) {
  const root = Math.floor(Math.sqrt(n));
  return root * root === n;
}

// Classical divisor-pair invariant: τ(n) is odd iff n is a perfect square.
// Therefore an exact odd divisor-count condition already forces the square property,
// while an exact even divisor-count condition makes the square property impossible.
// This pair cannot furnish two independently essential engines for CP014.
let checked = 0;
for (let n = 1; n <= 1000; n += 1) {
  assert.equal(divisorCount(n) % 2 === 1, isSquare(n), `odd-divisor-count square invariant failed at n=${n}`);
  checked += 1;
}

let admitted = 0;
for (let lo = 2; lo <= 250; lo += 5) {
  const hi = lo + 80;
  const domain = Array.from({ length: hi - lo + 1 }, (_, index) => lo + index);
  const squares = domain.filter(isSquare);
  for (const tau of [...new Set(domain.map(divisorCount))]) {
    const tauCandidates = domain.filter((n) => divisorCount(n) === tau);
    const full = tauCandidates.filter((n) => squares.includes(n));
    if (full.length !== 1) continue;
    // CP014 admission would require both ablations to restore ambiguity.
    // But exact odd τ already implies square, so removing the square engine leaves
    // exactly the same τ candidate set with respect to the square property.
    const squareIsIndependent = tauCandidates.some((n) => !isSquare(n));
    if (tauCandidates.length > 1 && squares.length > 1 && squareIsIndependent) admitted += 1;
  }
}

assert.equal(admitted, 0, "divisor-count + perfect-square must never be admitted as an independent CP014 synthesis pair");

console.log(JSON.stringify({
  status: "PASS_NUM_CP014_REDUNDANCY_REJECTION",
  checkedIntegers: checked,
  rejectedPair: "DIVISOR_COUNT_PLUS_PERFECT_SQUARE",
  theorem: "TAU_ODD_IFF_PERFECT_SQUARE",
  admittedStates: admitted,
  ql248Allocated: false,
}, null, 2));
