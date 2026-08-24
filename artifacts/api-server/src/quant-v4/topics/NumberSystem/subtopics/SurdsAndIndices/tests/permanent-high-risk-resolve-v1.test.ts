import { strict as assert } from "node:assert";
import { SRI_CHAPTER_MANIFEST, assertSriReleaseLocks } from "../chapter-manifest";
import {
  SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1,
  generateSriPermanentEnglishReviewQuestionV1,
} from "../permanent-english-review-v1";

const SEEDS_PER_CANDIDATE = 32;
const HIGH_RISK_CANDIDATES = [
  "C002-I", "C002-J", "C002-K",
  "C005-F",
  "C010-C", "C010-D", "C010-E", "C010-F",
  "C011-C", "C011-D", "C011-E", "C011-F", "C011-G", "C011-H", "C011-J",
  "C012-B", "C012-D", "C012-E",
] as const;

const memberByCandidate = new Map(SRI_PERMANENT_ENGLISH_REVIEW_MEMBERS_V1.map((member) => [member.memberCandidateId, member] as const));
let generated = 0;
const qlsCovered = new Set<string>();

for (const candidateId of HIGH_RISK_CANDIDATES) {
  const member = memberByCandidate.get(candidateId);
  assert.ok(member, `${candidateId} is high-risk but is not represented by a permanent QL`);
  qlsCovered.add(member.qlId);

  for (let seedIndex = 0; seedIndex < SEEDS_PER_CANDIDATE; seedIndex += 1) {
    const question = generateSriPermanentEnglishReviewQuestionV1(member, seedIndex);
    const expectedKey = independentlyResolve(candidateId, question.state);
    generated += 1;
    assert.equal(
      question.answer.canonicalKey,
      expectedKey,
      `${member.qlId}/${candidateId}/seed ${seedIndex}: independent primitive re-solve disagrees with generated answer`,
    );
  }
}

assert.equal(generated, HIGH_RISK_CANDIDATES.length * SEEDS_PER_CANDIDATE);
assert.ok(qlsCovered.size >= 15, `high-risk audit collapsed onto too few permanent QLs: ${qlsCovered.size}`);
assert.equal(SRI_CHAPTER_MANIFEST.permanentQlCount, 58);
assert.equal(SRI_CHAPTER_MANIFEST.frozenSolveModeCount, 0);
assert.equal(SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen, false);
assertSriReleaseLocks();

console.log(JSON.stringify({
  status: "PASS_SRI_PERMANENT_HIGH_RISK_RESOLVE_V1",
  candidates: HIGH_RISK_CANDIDATES.length,
  permanentQlsCovered: qlsCovered.size,
  seedsPerCandidate: SEEDS_PER_CANDIDATE,
  independentlyResolvedQuestions: generated,
  frozenSolveModeCount: SRI_CHAPTER_MANIFEST.frozenSolveModeCount,
  englishFrozen: SRI_CHAPTER_MANIFEST.lifecycle.englishFrozen,
}, null, 2));

function independentlyResolve(candidateId: string, state: Readonly<Record<string, string | number | boolean>>): string {
  switch (candidateId) {
    case "C002-I": {
      const base = Number(state.base);
      const exponent = Number(state.exponent);
      assert.equal(base, 0);
      return exponent <= 0 ? "T:UNDEFINED" : "T:DEFINED";
    }
    case "C002-J": {
      const base = Number(state.base);
      const numerator = Number(state.numerator);
      const denominator = Number(state.denominator);
      assert.equal(denominator % 2, 1);
      assert.ok(base < 0);
      const rootMagnitude = exactIntegerRoot(BigInt(-base), denominator);
      const signedRoot = -rootMagnitude;
      const value = signedRoot ** BigInt(numerator);
      return `R:${value}/1`;
    }
    case "C002-K": {
      const base = Number(state.base);
      const denominator = Number(state.denominator);
      return base < 0 && denominator % 2 === 0 ? "T:NOT_REAL" : "T:REAL";
    }
    case "C005-F": {
      const base = BigInt(Number(state.base));
      const sum = BigInt(String(state.sum));
      const product = BigInt(String(state.product));
      const companion = BigInt(String(state.companionRoot));
      assert.equal(product % companion, 0n);
      const powerRoot = product / companion;
      assert.equal(powerRoot + companion, sum);
      assert.equal(powerRoot * companion, product);
      const exponent = exactPowerExponent(base, powerRoot);
      assert.notEqual(exponent, null, "quadratic's admissible root must be an exact power of the base");
      assert.equal(exactPowerExponent(base, companion), null, "quadratic companion root must not be a power of the base");
      return `R:${exponent}/1`;
    }
    case "C010-C": {
      const A = BigInt(String(state.A));
      const B = BigInt(String(state.B));
      const discriminant = A * A - 4n * B;
      assert.equal(discriminant.toString(), String(state.discriminant));
      const root = discriminant >= 0n ? perfectSquareRoot(discriminant) : null;
      const denestable = root !== null && (A + root) % 2n === 0n && (A - root) % 2n === 0n && A >= root;
      return `T:${denestable ? "DENESTABLE" : "NOT_DENESTABLE"}`;
    }
    case "C010-D": {
      const m = BigInt(String(state.m));
      const n = BigInt(String(state.n));
      return `PAIR:${m + n}/1:${m * n}/1`;
    }
    case "C010-E": {
      const A = BigInt(String(state.A));
      const B = BigInt(String(state.B));
      const known = BigInt(String(state.known));
      const hidden = A - known;
      assert.equal(hidden.toString(), String(state.hidden));
      assert.equal(known * hidden, B);
      return `R:${hidden}/1`;
    }
    case "C010-F": {
      const k = BigInt(Number(state.k));
      const x = BigInt(Number(state.positiveRoot));
      assert.ok(x > 0n);
      assert.equal(x * x, x + k);
      return `R:${x}/1`;
    }
    case "C011-C": {
      const i = Number(state.firstIndex);
      const j = Number(state.secondIndex);
      const r = BigInt(String(state.r));
      const s = BigInt(String(state.s));
      const left = r ** BigInt(j);
      const right = s ** BigInt(i);
      return relationKey(left, right);
    }
    case "C011-D": {
      const n = BigInt(String(state.n));
      const lower = BigInt(Number(state.lower));
      assert.ok(lower * lower < n && n < (lower + 1n) * (lower + 1n));
      return `T:INTERVAL:${lower}:${lower + 1n}`;
    }
    case "C011-E": {
      const scale = BigInt(Number(state.scale));
      const n = BigInt(String(state.n));
      const scaled = BigInt(String(state.scaledRadicand));
      assert.equal(scaled, scale * scale * n);
      const lower = integerSqrtFloor(scaled);
      assert.notEqual(lower * lower, scaled, "scaled radical contract must remain irrational in this audit");
      return `T:SCALED:${lower}:${lower + 1n}`;
    }
    case "C011-F": {
      const a = BigInt(Number(state.a));
      const b = BigInt(String(state.b));
      assert.equal(a * a - b, 1n);
      return `R:${4n * a * a - 2n}/1`;
    }
    case "C011-G": {
      const c = BigInt(Number(state.c));
      const d = BigInt(Number(state.d));
      const lower = BigInt(Number(state.lower));
      const upper = BigInt(Number(state.upper));
      const x = d * d - c;
      assert.equal(x.toString(), String(state.x));
      assert.ok(lower <= x && x <= upper);
      assert.ok(x + c >= 0n);
      assert.equal(perfectSquareRoot(x + c), d);
      return `R:${x}/1`;
    }
    case "C011-H": {
      const c = BigInt(Number(state.c));
      const d = BigInt(Number(state.d));
      const extraneous = BigInt(Number(state.extraneous));
      const valid = BigInt(Number(state.valid));
      assert.ok(extraneous + c >= 0n);
      assert.ok(extraneous - d < 0n, "extraneous candidate must violate the principal-root RHS sign condition");
      assert.ok(valid - d >= 0n);
      assert.equal((valid - d) * (valid - d), valid + c);
      return `R:${extraneous}/1`;
    }
    case "C011-J": {
      const a = BigInt(Number(state.a));
      const b = BigInt(Number(state.b));
      const c = BigInt(Number(state.c));
      const d = BigInt(Number(state.d));
      assert.equal(a + b, c + d);
      const firstProduct = a * b;
      const secondProduct = c * d;
      assert.equal(firstProduct.toString(), String(state.firstProduct));
      assert.equal(secondProduct.toString(), String(state.secondProduct));
      return relationKey(firstProduct, secondProduct);
    }
    case "C012-B": {
      const root = BigInt(Number(state.root));
      const visibleBase = BigInt(Number(state.visibleBase));
      const numerator = Number(state.numerator);
      const denominator = Number(state.denominator);
      assert.equal(root ** BigInt(denominator), visibleBase);
      const result = root ** BigInt(numerator);
      return `R:${result}/1`;
    }
    case "C012-D": {
      const base = BigInt(Number(state.base));
      const targetExponent = Number(state.targetExponent);
      const shift = Number(state.shift);
      const target = BigInt(Number(state.target));
      const solution = 2 * targetExponent - shift;
      assert.equal(base ** BigInt(targetExponent), target);
      assert.equal(solution, Number(state.solution));
      return `R:${solution}/1`;
    }
    case "C012-E": {
      const m = BigInt(Number(state.m));
      const r = BigInt(String(state.r));
      const radicand = BigInt(String(state.radicand));
      assert.equal(radicand, m * m * r);
      return `R:1/${m * m}`;
    }
    default:
      throw new Error(`No independent high-risk resolver for ${candidateId}`);
  }
}

function relationKey(left: bigint, right: bigint): string {
  return left > right ? "T:FIRST_GREATER" : left < right ? "T:SECOND_GREATER" : "T:EQUAL";
}

function exactPowerExponent(base: bigint, target: bigint): number | null {
  if (base <= 1n || target < 1n) return null;
  let value = 1n;
  for (let exponent = 0; exponent <= 32; exponent += 1) {
    if (value === target) return exponent;
    if (value > target) return null;
    value *= base;
  }
  return null;
}

function exactIntegerRoot(value: bigint, index: number): bigint {
  for (let candidate = 0n; candidate <= value; candidate += 1n) {
    const power = candidate ** BigInt(index);
    if (power === value) return candidate;
    if (power > value) break;
  }
  throw new Error(`${value} is not an exact ${index}th power`);
}

function perfectSquareRoot(value: bigint): bigint | null {
  if (value < 0n) return null;
  const root = integerSqrtFloor(value);
  return root * root === value ? root : null;
}

function integerSqrtFloor(value: bigint): bigint {
  if (value < 0n) throw new Error("integerSqrtFloor requires non-negative input");
  let low = 0n;
  let high = value + 1n;
  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    if (mid * mid <= value) low = mid;
    else high = mid;
  }
  return low;
}
