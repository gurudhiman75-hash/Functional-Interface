import { createHash } from "node:crypto";

export type BtdCp002Rational = Readonly<{ n: bigint; d: bigint }>;
export type BtdCp002CandidateId =
  | "BTD-CAND-010"
  | "BTD-CAND-011"
  | "BTD-CAND-012"
  | "BTD-CAND-013"
  | "BTD-CAND-014"
  | "BTD-CAND-015"
  | "BTD-CAND-016"
  | "BTD-CAND-017"
  | "BTD-CAND-018"
  | "BTD-CAND-019"
  | "BTD-CAND-020";

export const BTD_CP002_SOURCE_SATURATION_VERSION = "BTD-CP002-SOURCE-SATURATION-v1" as const;
export const BTD_CP002_CANDIDATE_IDS: readonly BtdCp002CandidateId[] = Object.freeze([
  "BTD-CAND-010", "BTD-CAND-011", "BTD-CAND-012", "BTD-CAND-013", "BTD-CAND-014", "BTD-CAND-015",
  "BTD-CAND-016", "BTD-CAND-017", "BTD-CAND-018", "BTD-CAND-019", "BTD-CAND-020",
]);

export type BtdCp002SourceEvidence = Readonly<{
  evidenceId: string;
  candidateIds: readonly BtdCp002CandidateId[];
  provenanceClass: "OFFICIAL_GOVERNMENT_EXAM" | "EXAM_PREP_CORPUS" | "PAST_PAPER_REPRODUCTION";
  examFamily: string;
  sourceUrl: string;
  sourceSemantic: string;
  fixedFixture?: Readonly<Record<string, string | number>>;
}>;

export const BTD_CP002_SOURCE_EVIDENCE: readonly BtdCp002SourceEvidence[] = Object.freeze([
  Object.freeze({
    evidenceId: "GPSC-804-Q43-PW-BG-TO-TD",
    candidateIds: Object.freeze(["BTD-CAND-010"]),
    provenanceClass: "OFFICIAL_GOVERNMENT_EXAM",
    examFamily: "Goa Public Service Commission",
    sourceUrl: "https://gpsc.goa.gov.in/wp-content/uploads/QuestionPaper/804.pdf",
    sourceSemantic: "present worth + banker's gain -> true discount",
    fixedFixture: Object.freeze({ presentWorth: 576, bankersGain: 16, trueDiscount: 96 }),
  }),
  Object.freeze({
    evidenceId: "GPSC-2026-Q33-TWO-BILL-WEIGHTED-BD",
    candidateIds: Object.freeze(["BTD-CAND-011"]),
    provenanceClass: "OFFICIAL_GOVERNMENT_EXAM",
    examFamily: "Goa Public Service Commission",
    sourceUrl: "https://gpsc.goa.gov.in/wp-content/uploads/2026/06/QP_GPSC092025011.pdf",
    sourceSemantic: "two bills with total face value, different maturities, common rate and total BD -> face-value difference",
    fixedFixture: Object.freeze({ totalFaceValue: 17200, firstMonths: 3, secondMonths: 6, ratePercent: 10, totalBankersDiscount: 610, faceValueDifference: 2800 }),
  }),
  Object.freeze({
    evidenceId: "MERITNOTES-BD-TD-INVERSE-CORPUS",
    candidateIds: Object.freeze(["BTD-CAND-012", "BTD-CAND-015", "BTD-CAND-016", "BTD-CAND-017", "BTD-CAND-018"]),
    provenanceClass: "EXAM_PREP_CORPUS",
    examFamily: "Banking / quantitative aptitude",
    sourceUrl: "https://meritnotes.com/aptitude/bankers-discount-questions/1-78075/",
    sourceSemantic: "sum due from BD+TD; BG+rate+time inverse; PW+TD outputs; cross-face BD=TD time inverse",
  }),
  Object.freeze({
    evidenceId: "NUMERICAL-APTITUDE-BANKERS-DISCOUNT-CHAPTER",
    candidateIds: Object.freeze(["BTD-CAND-013", "BTD-CAND-018", "BTD-CAND-019", "BTD-CAND-020"]),
    provenanceClass: "EXAM_PREP_CORPUS",
    examFamily: "SSC / banking numerical aptitude",
    sourceUrl: "https://imsspace2.ams3.digitaloceanspaces.com/imsspace2/imsspace2/media/chapters/Numerical_Aptitude.pdf",
    sourceSemantic: "TD+rate+time -> BD; cross-face equality -> time; BD+TD+time -> rate and sum",
  }),
  Object.freeze({
    evidenceId: "INDIABIX-PW-TD-DERIVED-OUTPUTS",
    candidateIds: Object.freeze(["BTD-CAND-012", "BTD-CAND-016", "BTD-CAND-017"]),
    provenanceClass: "EXAM_PREP_CORPUS",
    examFamily: "Competitive aptitude",
    sourceUrl: "https://indbix.in/exercise/aptitude/bankers-discount/bankers-discount-general-questions.html",
    sourceSemantic: "BD+TD -> face value; PW+TD -> BD/BG",
  }),
  Object.freeze({
    evidenceId: "TESTBOOK-INDIAN-NAVY-CROSS-FACE-TIME",
    candidateIds: Object.freeze(["BTD-CAND-018"]),
    provenanceClass: "PAST_PAPER_REPRODUCTION",
    examFamily: "Indian Navy INCET Official Paper, 03 Feb 2024 Set 3",
    sourceUrl: "https://testbook.com/question-answer/the-bankers-discount-on-rs-1600-at-15-per-a--68a387164ee1169aac51faa4",
    sourceSemantic: "BD on one face equals TD on another at same rate/time -> time",
    fixedFixture: Object.freeze({ bankersDiscountFace: 1600, trueDiscountFace: 1680, ratePercent: 15, timeMonths: 4 }),
  }),
  Object.freeze({
    evidenceId: "BANKERS-DISCOUNT-RATIO-INVERSE-CORPUS",
    candidateIds: Object.freeze(["BTD-CAND-014"]),
    provenanceClass: "EXAM_PREP_CORPUS",
    examFamily: "IBPS / bank aptitude",
    sourceUrl: "https://gopract.com/studpracticetest.aspx?marks=10&sid=78",
    sourceSemantic: "BD:TD ratio + annual rate -> time",
  }),
]);

export const BTD_CP002_BOUNDARY = Object.freeze({
  chapterId: "BTD-001" as const,
  checkpointId: "BTD-CP-002" as const,
  parentDiscoveryCheckpoint: "BTD-CP-001" as const,
  sourceBackedCandidates: BTD_CP002_CANDIDATE_IDS,
  permanentQlAllocationAuthorized: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  rejectUnsourcedAlgebraicPermutationExplosion: true as const,
});

export const BTD_CP002_CANDIDATE_CONTRACTS = Object.freeze({
  "BTD-CAND-010": Object.freeze({ signature: "GIVEN_PW_BG__ASK_TD", answerSemantic: "TRUE_DISCOUNT", sourceStrength: "OFFICIAL" }),
  "BTD-CAND-011": Object.freeze({ signature: "TWO_BILLS_TOTAL_FACE_TIMES_RATE_TOTAL_BD__ASK_FACE_DIFFERENCE", answerSemantic: "FACE_VALUE_DIFFERENCE", sourceStrength: "OFFICIAL" }),
  "BTD-CAND-012": Object.freeze({ signature: "GIVEN_BD_TD__ASK_FACE_VALUE", answerSemantic: "FACE_VALUE", sourceStrength: "CORPUS" }),
  "BTD-CAND-013": Object.freeze({ signature: "GIVEN_BD_RATE_TIME__ASK_TD", answerSemantic: "TRUE_DISCOUNT", sourceStrength: "CORPUS" }),
  "BTD-CAND-014": Object.freeze({ signature: "GIVEN_BD_TD_RATIO_RATE__ASK_TIME", answerSemantic: "TIME_MONTHS", sourceStrength: "CORPUS" }),
  "BTD-CAND-015": Object.freeze({ signature: "GIVEN_BG_RATE_TIME__ASK_TD", answerSemantic: "TRUE_DISCOUNT", sourceStrength: "CORPUS" }),
  "BTD-CAND-016": Object.freeze({ signature: "GIVEN_PW_TD__ASK_BD", answerSemantic: "BANKERS_DISCOUNT", sourceStrength: "CORPUS" }),
  "BTD-CAND-017": Object.freeze({ signature: "GIVEN_PW_TD__ASK_BG", answerSemantic: "BANKERS_GAIN", sourceStrength: "CORPUS" }),
  "BTD-CAND-018": Object.freeze({ signature: "EQUAL_BD_FACE1_TD_FACE2_SAME_RATE_TIME__ASK_TIME", answerSemantic: "TIME_MONTHS", sourceStrength: "PAST_PAPER" }),
  "BTD-CAND-019": Object.freeze({ signature: "GIVEN_BD_TD_TIME__ASK_RATE", answerSemantic: "RATE_PERCENT", sourceStrength: "CORPUS" }),
  "BTD-CAND-020": Object.freeze({ signature: "GIVEN_TD_RATE_TIME__ASK_BD", answerSemantic: "BANKERS_DISCOUNT", sourceStrength: "CORPUS" }),
} as const);

function absBig(value: bigint) { return value < 0n ? -value : value; }
function gcd(left: bigint, right: bigint): bigint { let a = absBig(left); let b = absBig(right); while (b) { const next = a % b; a = b; b = next; } return a || 1n; }
export function btdRat(n: bigint | number, d: bigint | number = 1n): BtdCp002Rational { let a = BigInt(n); let b = BigInt(d); if (b === 0n) throw new Error("BTD CP002 zero denominator"); if (b < 0n) { a = -a; b = -b; } const g = gcd(a, b); return Object.freeze({ n: a / g, d: b / g }); }
function add(a: BtdCp002Rational, b: BtdCp002Rational) { return btdRat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: BtdCp002Rational, b: BtdCp002Rational) { return btdRat(a.n * b.d - b.n * a.d, a.d * b.d); }
function mul(a: BtdCp002Rational, b: BtdCp002Rational) { return btdRat(a.n * b.n, a.d * b.d); }
function div(a: BtdCp002Rational, b: BtdCp002Rational) { return btdRat(a.n * b.d, a.d * b.n); }
function eq(a: BtdCp002Rational, b: BtdCp002Rational) { return a.n === b.n && a.d === b.d; }
function square(a: BtdCp002Rational) { return mul(a, a); }
function absRat(a: BtdCp002Rational) { return a.n < 0n ? btdRat(-a.n, a.d) : a; }
function interestFactor(ratePercent: number, months: number) { return btdRat(ratePercent * months, 1200); }
function presentWorth(face: BtdCp002Rational, x: BtdCp002Rational) { return div(face, add(btdRat(1), x)); }
function trueDiscount(face: BtdCp002Rational, x: BtdCp002Rational) { return mul(presentWorth(face, x), x); }
function bankersDiscount(face: BtdCp002Rational, x: BtdCp002Rational) { return mul(face, x); }
function bankersGain(face: BtdCp002Rational, x: BtdCp002Rational) { return mul(presentWorth(face, x), square(x)); }
function stableIndex(seed: string, size: number) { return createHash("sha256").update(seed).digest().readUInt32BE(0) % size; }
function stableHash(seed: string) { return createHash("sha256").update(seed).digest().readUInt32BE(0); }
function key(value: BtdCp002Rational) { return `${value.n}/${value.d}`; }
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T { if (!value || typeof value !== "object") return value; const objectValue = value as object; if (seen.has(objectValue)) return value; seen.add(objectValue); for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen); return Object.freeze(value); }
function isPaiseSafe(value: BtdCp002Rational) { return (value.n * 100n) % value.d === 0n; }
function decimal(value: BtdCp002Rational) { const scaled = value.n * 100n; if (scaled % value.d !== 0n) return (Number(value.n) / Number(value.d)).toFixed(2).replace(/\.?0+$/u, ""); const h = scaled / value.d; const sign = h < 0n ? "-" : ""; const positive = absBig(h); const whole = positive / 100n; const fraction = positive % 100n; if (fraction === 0n) return `${sign}${whole}`; if (fraction % 10n === 0n) return `${sign}${whole}.${fraction / 10n}`; return `${sign}${whole}.${fraction.toString().padStart(2, "0")}`; }
function money(value: BtdCp002Rational) { return `₹${decimal(value)}`; }
function percent(value: BtdCp002Rational) { return `${decimal(value)}%`; }
function monthsText(value: BtdCp002Rational) { return `${decimal(value)} month${eq(value, btdRat(1)) ? "" : "s"}`; }
function bigintSqrt(value: bigint): bigint { if (value < 0n) throw new Error("negative sqrt"); if (value < 2n) return value; let x0 = value; let x1 = (x0 + value / x0) >> 1n; while (x1 < x0) { x0 = x1; x1 = (x0 + value / x0) >> 1n; } if (x0 * x0 !== value) throw new Error(`non-square bigint ${value}`); return x0; }
function sqrtRat(value: BtdCp002Rational) { return btdRat(bigintSqrt(value.n), bigintSqrt(value.d)); }

const CONTEXTS = Object.freeze(["bill of exchange", "trade bill", "promissory note", "merchant bill", "bank-discount bill"] as const);
const FACE_VALUES = Object.freeze([1200, 1500, 1800, 2000, 2400, 3000, 3600, 4800, 6000, 7200, 8000, 9000, 10000, 12000, 14400, 16000] as const);
const PRESENT_VALUES = Object.freeze([400, 576, 625, 800, 900, 1024, 1200, 1440, 1600, 1800, 2025, 2400, 2500] as const);
const RATE_MONTH_PAIRS = Object.freeze([
  [5, 6], [6, 8], [8, 6], [8, 9], [10, 3], [10, 6], [10, 9], [10, 12], [12, 4], [12, 6], [12, 8], [12, 10], [15, 4], [15, 6], [15, 8], [18, 4], [20, 3], [20, 6],
] as const);
const X_VALUES = Object.freeze([btdRat(1, 40), btdRat(1, 30), btdRat(1, 25), btdRat(1, 20), btdRat(3, 50), btdRat(2, 25), btdRat(1, 10), btdRat(1, 8), btdRat(3, 20), btdRat(1, 5)] as const);

type State010 = Readonly<{ candidateId: "BTD-CAND-010"; context: string; presentWorth: BtdCp002Rational; bankersGain: BtdCp002Rational }>;
type State011 = Readonly<{ candidateId: "BTD-CAND-011"; context: string; totalFaceValue: BtdCp002Rational; firstMonths: number; secondMonths: number; ratePercent: number; totalBankersDiscount: BtdCp002Rational }>;
type State012 = Readonly<{ candidateId: "BTD-CAND-012"; context: string; bankersDiscount: BtdCp002Rational; trueDiscount: BtdCp002Rational }>;
type State013 = Readonly<{ candidateId: "BTD-CAND-013"; context: string; bankersDiscount: BtdCp002Rational; ratePercent: number; months: number }>;
type State014 = Readonly<{ candidateId: "BTD-CAND-014"; context: string; bdToTdRatio: BtdCp002Rational; ratePercent: number }>;
type State015 = Readonly<{ candidateId: "BTD-CAND-015"; context: string; bankersGain: BtdCp002Rational; ratePercent: number; months: number }>;
type State016 = Readonly<{ candidateId: "BTD-CAND-016"; context: string; presentWorth: BtdCp002Rational; trueDiscount: BtdCp002Rational }>;
type State017 = Readonly<{ candidateId: "BTD-CAND-017"; context: string; presentWorth: BtdCp002Rational; trueDiscount: BtdCp002Rational }>;
type State018 = Readonly<{ candidateId: "BTD-CAND-018"; context: string; bankersDiscountFace: BtdCp002Rational; trueDiscountFace: BtdCp002Rational; ratePercent: number }>;
type State019 = Readonly<{ candidateId: "BTD-CAND-019"; context: string; bankersDiscount: BtdCp002Rational; trueDiscount: BtdCp002Rational; months: number }>;
type State020 = Readonly<{ candidateId: "BTD-CAND-020"; context: string; trueDiscount: BtdCp002Rational; ratePercent: number; months: number }>;
export type BtdCp002State = State010 | State011 | State012 | State013 | State014 | State015 | State016 | State017 | State018 | State019 | State020;

const POOL_010: readonly State010[] = Object.freeze(PRESENT_VALUES.flatMap((pw) => X_VALUES.flatMap((x) => CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-010" as const, context, presentWorth: btdRat(pw), bankersGain: mul(btdRat(pw), square(x)) })))).filter((state) => isPaiseSafe(state.bankersGain) && isPaiseSafe(mul(state.presentWorth, sqrtRat(div(state.bankersGain, state.presentWorth))))));
const POOL_011: readonly State011[] = Object.freeze([[3, 6], [2, 5], [4, 8], [3, 9], [6, 12]].flatMap(([firstMonths, secondMonths]) => [8, 10, 12, 15].flatMap((ratePercent) => FACE_VALUES.slice(2, 12).flatMap((firstFace) => FACE_VALUES.slice(1, 11).filter((secondFace) => secondFace !== firstFace).slice(0, 4).flatMap((secondFace) => CONTEXTS.slice(0, 3).map((context) => deepFreeze({ candidateId: "BTD-CAND-011" as const, context, totalFaceValue: btdRat(firstFace + secondFace), firstMonths, secondMonths, ratePercent, totalBankersDiscount: add(bankersDiscount(btdRat(firstFace), interestFactor(ratePercent, firstMonths)), bankersDiscount(btdRat(secondFace), interestFactor(ratePercent, secondMonths))) }))))))));
const POOL_012: readonly State012[] = Object.freeze(FACE_VALUES.flatMap((face) => X_VALUES.flatMap((x) => CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-012" as const, context, bankersDiscount: bankersDiscount(btdRat(face), x), trueDiscount: trueDiscount(btdRat(face), x) })))).filter((state) => isPaiseSafe(state.bankersDiscount) && isPaiseSafe(state.trueDiscount)));
const POOL_013: readonly State013[] = Object.freeze(FACE_VALUES.flatMap((face) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-013" as const, context, bankersDiscount: bankersDiscount(btdRat(face), interestFactor(ratePercent, months)), ratePercent, months })))).filter((state) => isPaiseSafe(state.bankersDiscount)));
const POOL_014: readonly State014[] = Object.freeze(RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-014" as const, context, bdToTdRatio: add(btdRat(1), interestFactor(ratePercent, months)), ratePercent }))));
const POOL_015: readonly State015[] = Object.freeze(PRESENT_VALUES.flatMap((pw) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => { const x = interestFactor(ratePercent, months); return CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-015" as const, context, bankersGain: mul(btdRat(pw), square(x)), ratePercent, months })); })).filter((state) => isPaiseSafe(state.bankersGain)));
const POOL_016: readonly State016[] = Object.freeze(PRESENT_VALUES.flatMap((pw) => X_VALUES.flatMap((x) => CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-016" as const, context, presentWorth: btdRat(pw), trueDiscount: mul(btdRat(pw), x) })))).filter((state) => isPaiseSafe(state.trueDiscount)));
const POOL_017: readonly State017[] = Object.freeze(POOL_016.map((state) => deepFreeze({ candidateId: "BTD-CAND-017" as const, context: state.context, presentWorth: state.presentWorth, trueDiscount: state.trueDiscount })));
const POOL_018: readonly State018[] = Object.freeze(PRESENT_VALUES.flatMap((firstFace) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => { const x = interestFactor(ratePercent, months); const secondFace = mul(btdRat(firstFace), add(btdRat(1), x)); if (!isPaiseSafe(secondFace)) return []; return CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-018" as const, context, bankersDiscountFace: btdRat(firstFace), trueDiscountFace: secondFace, ratePercent })); })));
const POOL_019: readonly State019[] = Object.freeze(FACE_VALUES.flatMap((face) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => { const x = interestFactor(ratePercent, months); const bd = bankersDiscount(btdRat(face), x); const td = trueDiscount(btdRat(face), x); if (!isPaiseSafe(bd) || !isPaiseSafe(td)) return []; return CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-019" as const, context, bankersDiscount: bd, trueDiscount: td, months })); })));
const POOL_020: readonly State020[] = Object.freeze(FACE_VALUES.flatMap((face) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => { const td = trueDiscount(btdRat(face), interestFactor(ratePercent, months)); if (!isPaiseSafe(td)) return []; return CONTEXTS.map((context) => deepFreeze({ candidateId: "BTD-CAND-020" as const, context, trueDiscount: td, ratePercent, months })); })));

const POOLS: Readonly<Record<BtdCp002CandidateId, readonly BtdCp002State[]>> = Object.freeze({
  "BTD-CAND-010": POOL_010, "BTD-CAND-011": POOL_011, "BTD-CAND-012": POOL_012, "BTD-CAND-013": POOL_013, "BTD-CAND-014": POOL_014,
  "BTD-CAND-015": POOL_015, "BTD-CAND-016": POOL_016, "BTD-CAND-017": POOL_017, "BTD-CAND-018": POOL_018, "BTD-CAND-019": POOL_019, "BTD-CAND-020": POOL_020,
});

export function constructBtdCp002State(candidateId: BtdCp002CandidateId, seed: string): BtdCp002State { const pool = POOLS[candidateId]; if (!pool.length) throw new Error(`${candidateId}: empty CP002 source pool`); return pool[stableIndex(`${candidateId}:${seed}`, pool.length)]!; }

export function solveBtdCp002(state: BtdCp002State): BtdCp002Rational {
  switch (state.candidateId) {
    case "BTD-CAND-010": return sqrtRat(mul(state.presentWorth, state.bankersGain));
    case "BTD-CAND-011": { const x1 = interestFactor(state.ratePercent, state.firstMonths); const x2 = interestFactor(state.ratePercent, state.secondMonths); const first = div(sub(state.totalBankersDiscount, mul(state.totalFaceValue, x2)), sub(x1, x2)); const second = sub(state.totalFaceValue, first); return absRat(sub(first, second)); }
    case "BTD-CAND-012": return div(mul(state.bankersDiscount, state.trueDiscount), sub(state.bankersDiscount, state.trueDiscount));
    case "BTD-CAND-013": return div(state.bankersDiscount, add(btdRat(1), interestFactor(state.ratePercent, state.months)));
    case "BTD-CAND-014": return div(mul(sub(state.bdToTdRatio, btdRat(1)), btdRat(1200)), btdRat(state.ratePercent));
    case "BTD-CAND-015": return div(state.bankersGain, interestFactor(state.ratePercent, state.months));
    case "BTD-CAND-016": { const x = div(state.trueDiscount, state.presentWorth); return mul(state.trueDiscount, add(btdRat(1), x)); }
    case "BTD-CAND-017": return div(square(state.trueDiscount), state.presentWorth);
    case "BTD-CAND-018": return div(mul(sub(div(state.trueDiscountFace, state.bankersDiscountFace), btdRat(1)), btdRat(1200)), btdRat(state.ratePercent));
    case "BTD-CAND-019": return div(mul(sub(div(state.bankersDiscount, state.trueDiscount), btdRat(1)), btdRat(1200)), btdRat(state.months));
    case "BTD-CAND-020": return mul(state.trueDiscount, add(btdRat(1), interestFactor(state.ratePercent, state.months)));
  }
}

export function verifyBtdCp002(state: BtdCp002State, candidate: BtdCp002Rational): boolean {
  switch (state.candidateId) {
    case "BTD-CAND-010": return eq(square(candidate), mul(state.presentWorth, state.bankersGain));
    case "BTD-CAND-011": { const x1 = interestFactor(state.ratePercent, state.firstMonths); const x2 = interestFactor(state.ratePercent, state.secondMonths); const first = div(add(state.totalFaceValue, candidate), btdRat(2)); const second = sub(state.totalFaceValue, first); const reversedFirst = div(sub(state.totalFaceValue, candidate), btdRat(2)); const reversedSecond = sub(state.totalFaceValue, reversedFirst); return eq(add(mul(first, x1), mul(second, x2)), state.totalBankersDiscount) || eq(add(mul(reversedFirst, x1), mul(reversedSecond, x2)), state.totalBankersDiscount); }
    case "BTD-CAND-012": return eq(mul(candidate, sub(state.bankersDiscount, state.trueDiscount)), mul(state.bankersDiscount, state.trueDiscount));
    case "BTD-CAND-013": return eq(mul(candidate, add(btdRat(1), interestFactor(state.ratePercent, state.months))), state.bankersDiscount);
    case "BTD-CAND-014": return eq(add(btdRat(1), btdRat(state.ratePercent * Number(candidate.n), 1200 * Number(candidate.d))), state.bdToTdRatio);
    case "BTD-CAND-015": return eq(mul(candidate, interestFactor(state.ratePercent, state.months)), state.bankersGain);
    case "BTD-CAND-016": { const bg = div(square(state.trueDiscount), state.presentWorth); return eq(candidate, add(state.trueDiscount, bg)); }
    case "BTD-CAND-017": return eq(mul(candidate, state.presentWorth), square(state.trueDiscount));
    case "BTD-CAND-018": return eq(add(btdRat(1), btdRat(state.ratePercent * Number(candidate.n), 1200 * Number(candidate.d))), div(state.trueDiscountFace, state.bankersDiscountFace));
    case "BTD-CAND-019": return eq(add(btdRat(1), btdRat(Number(candidate.n) * state.months, Number(candidate.d) * 1200)), div(state.bankersDiscount, state.trueDiscount));
    case "BTD-CAND-020": return eq(candidate, mul(state.trueDiscount, add(btdRat(1), interestFactor(state.ratePercent, state.months))));
  }
}

function answerKind(candidateId: BtdCp002CandidateId): "MONEY" | "RATE_PERCENT" | "TIME_MONTHS" { if (candidateId === "BTD-CAND-014" || candidateId === "BTD-CAND-018") return "TIME_MONTHS"; if (candidateId === "BTD-CAND-019") return "RATE_PERCENT"; return "MONEY"; }
function renderAnswer(candidateId: BtdCp002CandidateId, value: BtdCp002Rational) { const kind = answerKind(candidateId); return kind === "MONEY" ? money(value) : kind === "RATE_PERCENT" ? percent(value) : monthsText(value); }

function genericWrongAnswers(candidateId: BtdCp002CandidateId, answer: BtdCp002Rational) {
  const offsets = answerKind(candidateId) === "MONEY"
    ? [mul(answer, btdRat(9, 10)), mul(answer, btdRat(11, 10)), mul(answer, btdRat(6, 5)), mul(answer, btdRat(4, 5))]
    : [add(answer, btdRat(1)), add(answer, btdRat(2)), sub(answer, btdRat(1)), mul(answer, btdRat(2))];
  return offsets;
}

function stemAndIdea(state: BtdCp002State, answer: BtdCp002Rational, seed: string) {
  const family = stableHash(`${seed}:stem-family`) % 3;
  const context = state.context;
  switch (state.candidateId) {
    case "BTD-CAND-010": { const stems = [`The present worth of a ${context} is ${money(state.presentWorth)} and the banker's gain is ${money(state.bankersGain)}. Find the true discount.`, `For a ${context}, PW = ${money(state.presentWorth)} and BG = ${money(state.bankersGain)}. What is the true discount?`, `A ${context} has present worth ${money(state.presentWorth)} with banker's gain ${money(state.bankersGain)}. Determine TD.`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "Use BG = TD²/PW, hence TD = √(PW × BG)." }; }
    case "BTD-CAND-011": { const stems = [`Two ${context}s are due in ${state.firstMonths} and ${state.secondMonths} months. Their total face value is ${money(state.totalFaceValue)} and total banker's discount at ${state.ratePercent}% p.a. is ${money(state.totalBankersDiscount)}. Find the difference between their face values.`, `The combined face value of two bills due after ${state.firstMonths} and ${state.secondMonths} months is ${money(state.totalFaceValue)}. At ${state.ratePercent}% p.a. their combined BD is ${money(state.totalBankersDiscount)}. Find the face-value difference.`, `Two bills total ${money(state.totalFaceValue)} in face value. Maturities are ${state.firstMonths} and ${state.secondMonths} months, and total BD at ${state.ratePercent}% is ${money(state.totalBankersDiscount)}. Determine |F₁−F₂|.`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "Use F₁+F₂=S and F₁x₁+F₂x₂=total BD; solve the two linear equations." }; }
    case "BTD-CAND-012": { const stems = [`For a ${context}, banker's discount is ${money(state.bankersDiscount)} and true discount is ${money(state.trueDiscount)}. Find the face value.`, `BD and TD on a ${context} are ${money(state.bankersDiscount)} and ${money(state.trueDiscount)}. What sum is due?`, `A ${context} has BD=${money(state.bankersDiscount)} and TD=${money(state.trueDiscount)}. Determine its face value.`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "Since BG=BD−TD and F = BD×TD/(BD−TD), recover the sum due directly." }; }
    case "BTD-CAND-013": { const stems = [`The banker's discount on a ${context} is ${money(state.bankersDiscount)} at ${state.ratePercent}% p.a. for ${state.months} months. Find the true discount.`, `A ${context} has BD ${money(state.bankersDiscount)} for ${state.months} months at ${state.ratePercent}% p.a. Determine TD.`, `Given BD=${money(state.bankersDiscount)}, R=${state.ratePercent}% and T=${state.months} months for a ${context}, find the true discount.`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "BD/TD = 1+x where x=RT/100, so TD=BD/(1+x)." }; }
    case "BTD-CAND-014": { const stems = [`For a ${context}, the ratio BD:TD is ${state.bdToTdRatio.n}:${state.bdToTdRatio.d}. At ${state.ratePercent}% p.a., find the unexpired time.`, `A ${context} has BD/TD = ${state.bdToTdRatio.n}/${state.bdToTdRatio.d} and annual rate ${state.ratePercent}%. Determine the time in months.`, `The banker's discount to true discount ratio for a ${context} is ${state.bdToTdRatio.n}:${state.bdToTdRatio.d}. If R=${state.ratePercent}%, find T.`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "Use BD/TD=1+RT/100 and convert the resulting time to months." }; }
    case "BTD-CAND-015": { const stems = [`The banker's gain on a ${context} is ${money(state.bankersGain)} for ${state.months} months at ${state.ratePercent}% p.a. Find the true discount.`, `For a ${context}, BG=${money(state.bankersGain)}, R=${state.ratePercent}% and T=${state.months} months. Determine TD.`, `A ${context} yields banker's gain ${money(state.bankersGain)} at ${state.ratePercent}% for ${state.months} months. What is the true discount?`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "BG is simple interest on TD for the unexpired time: BG=TD×x, so TD=BG/x." }; }
    case "BTD-CAND-016": { const stems = [`The present worth of a ${context} is ${money(state.presentWorth)} and its true discount is ${money(state.trueDiscount)}. Find the banker's discount.`, `For a ${context}, PW=${money(state.presentWorth)} and TD=${money(state.trueDiscount)}. Determine BD.`, `A ${context} has present worth ${money(state.presentWorth)} and true discount ${money(state.trueDiscount)}. What is the banker's discount?`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "BG=TD²/PW and BD=TD+BG." }; }
    case "BTD-CAND-017": { const stems = [`The present worth of a ${context} is ${money(state.presentWorth)} and its true discount is ${money(state.trueDiscount)}. Find the banker's gain.`, `For a ${context}, PW=${money(state.presentWorth)} and TD=${money(state.trueDiscount)}. Determine BG.`, `A ${context} has present worth ${money(state.presentWorth)} and true discount ${money(state.trueDiscount)}. What is the banker's gain?`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "Use BG=TD²/PW." }; }
    case "BTD-CAND-018": { const stems = [`At ${state.ratePercent}% p.a., the banker's discount on ${money(state.bankersDiscountFace)} equals the true discount on ${money(state.trueDiscountFace)} for the same time. Find the time.`, `BD on face value ${money(state.bankersDiscountFace)} is equal to TD on face value ${money(state.trueDiscountFace)} at ${state.ratePercent}% for the same term. Determine the term in months.`, `For the same rate ${state.ratePercent}% and time, BD(${money(state.bankersDiscountFace)}) = TD(${money(state.trueDiscountFace)}). Find the time.`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "Equality implies the smaller face value is the present worth of the larger; derive x=F₂/F₁−1 and then T." }; }
    case "BTD-CAND-019": { const stems = [`The banker's discount and true discount on a ${context} are ${money(state.bankersDiscount)} and ${money(state.trueDiscount)} for ${state.months} months. Find the annual rate.`, `For a ${context}, BD=${money(state.bankersDiscount)}, TD=${money(state.trueDiscount)}, T=${state.months} months. Determine R.`, `A ${context} has banker's discount ${money(state.bankersDiscount)} and true discount ${money(state.trueDiscount)} over ${state.months} months. What is the rate percent per annum?`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "Use BD/TD=1+RT/100 and solve for R with T expressed in months." }; }
    case "BTD-CAND-020": { const stems = [`The true discount on a ${context} is ${money(state.trueDiscount)} for ${state.months} months at ${state.ratePercent}% p.a. Find the banker's discount.`, `For a ${context}, TD=${money(state.trueDiscount)}, R=${state.ratePercent}% and T=${state.months} months. Determine BD.`, `A ${context} has true discount ${money(state.trueDiscount)} at ${state.ratePercent}% for ${state.months} months. What is the banker's discount?`]; return { stemFamilyId: `${state.candidateId}-T${family + 1}`, stem: stems[family]!, idea: "BD/TD=1+x where x=RT/100, hence BD=TD(1+x)." }; }
  }
}

export function buildBtdCp002CandidateQuestion(candidateId: BtdCp002CandidateId, seed: string) {
  const state = constructBtdCp002State(candidateId, seed);
  const answer = solveBtdCp002(state);
  if (!verifyBtdCp002(state, answer)) throw new Error(`${candidateId}/${seed}: canonical CP002 answer rejected`);
  const presentation = stemAndIdea(state, answer, seed);
  const wrongs: BtdCp002Rational[] = [];
  const seen = new Set([key(answer)]);
  for (const candidate of genericWrongAnswers(candidateId, answer)) {
    if (candidate.n <= 0n) continue;
    if (answerKind(candidateId) === "MONEY" && !isPaiseSafe(candidate)) continue;
    const candidateKey = key(candidate);
    if (seen.has(candidateKey) || verifyBtdCp002(state, candidate)) continue;
    seen.add(candidateKey); wrongs.push(candidate); if (wrongs.length === 3) break;
  }
  if (wrongs.length < 3) throw new Error(`${candidateId}/${seed}: insufficient CP002 distractors`);
  const correctIndex = stableHash(`${candidateId}:${seed}:correct`) % 4;
  const arranged = [...wrongs.map((value, index) => ({ value, misconceptionId: `SCALED_OR_OFFSET_${index + 1}` }))];
  arranged.splice(correctIndex, 0, { value: answer, misconceptionId: "CORRECT" });
  const options = Object.freeze(arranged.map((item) => deepFreeze({ value: item.value, text: renderAnswer(candidateId, item.value), misconceptionId: item.misconceptionId, isCorrect: eq(item.value, answer) })));
  return deepFreeze({
    chapterId: "BTD-001" as const,
    checkpointId: "BTD-CP-002" as const,
    saturationVersion: BTD_CP002_SOURCE_SATURATION_VERSION,
    candidateId,
    semanticContract: BTD_CP002_CANDIDATE_CONTRACTS[candidateId],
    sourceEvidenceIds: Object.freeze(BTD_CP002_SOURCE_EVIDENCE.filter((evidence) => evidence.candidateIds.includes(candidateId)).map((evidence) => evidence.evidenceId)),
    seed,
    state,
    answerKind: answerKind(candidateId),
    answer,
    presentation: Object.freeze({ stemFamilyId: presentation.stemFamilyId, stem: presentation.stem }),
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation: Object.freeze({
      whatAsked: `Find the required ${BTD_CP002_CANDIDATE_CONTRACTS[candidateId].answerSemantic.toLowerCase().replace(/_/gu, " ")}.`,
      keyIdea: presentation.idea,
      steps: Object.freeze([presentation.idea, `Substituting the given values gives ${renderAnswer(candidateId, answer)}.`]),
      finalAnswer: renderAnswer(candidateId, answer),
    }),
    lifecycle: Object.freeze({ discoveryOnly: true as const, permanentQlAllocated: false as const, questionStudioDiscoverable: false as const, questionBankWritable: false as const, testEligible: false as const, mockTestEligible: false as const, publiclyPublishable: false as const }),
  });
}
