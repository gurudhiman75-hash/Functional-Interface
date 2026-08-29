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

export const BTD_CP002_SOURCE_SATURATION_VERSION = "BTD-CP002-SOURCE-SATURATION-v2" as const;
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
}>;

export const BTD_CP002_SOURCE_EVIDENCE: readonly BtdCp002SourceEvidence[] = Object.freeze([
  Object.freeze({ evidenceId: "GPSC-804-Q43-PW-BG-TO-TD", candidateIds: Object.freeze(["BTD-CAND-010"]), provenanceClass: "OFFICIAL_GOVERNMENT_EXAM", examFamily: "Goa Public Service Commission", sourceUrl: "https://gpsc.goa.gov.in/wp-content/uploads/QuestionPaper/804.pdf", sourceSemantic: "present worth + banker's gain -> true discount" }),
  Object.freeze({ evidenceId: "GPSC-2026-Q33-TWO-BILL-WEIGHTED-BD", candidateIds: Object.freeze(["BTD-CAND-011"]), provenanceClass: "OFFICIAL_GOVERNMENT_EXAM", examFamily: "Goa Public Service Commission", sourceUrl: "https://gpsc.goa.gov.in/wp-content/uploads/2026/06/QP_GPSC092025011.pdf", sourceSemantic: "two bills with total face value, different maturities, common rate and total BD -> face-value difference" }),
  Object.freeze({ evidenceId: "MERITNOTES-BD-TD-INVERSE-CORPUS", candidateIds: Object.freeze(["BTD-CAND-012", "BTD-CAND-015", "BTD-CAND-016", "BTD-CAND-017", "BTD-CAND-018"]), provenanceClass: "EXAM_PREP_CORPUS", examFamily: "Banking / quantitative aptitude", sourceUrl: "https://meritnotes.com/aptitude/bankers-discount-questions/1-78075/", sourceSemantic: "inverse banker/true-discount relations" }),
  Object.freeze({ evidenceId: "NUMERICAL-APTITUDE-BANKERS-DISCOUNT-CHAPTER", candidateIds: Object.freeze(["BTD-CAND-013", "BTD-CAND-018", "BTD-CAND-019", "BTD-CAND-020"]), provenanceClass: "EXAM_PREP_CORPUS", examFamily: "SSC / banking numerical aptitude", sourceUrl: "https://imsspace2.ams3.digitaloceanspaces.com/imsspace2/imsspace2/media/chapters/Numerical_Aptitude.pdf", sourceSemantic: "TD/BD/rate/time inverse contracts" }),
  Object.freeze({ evidenceId: "INDIABIX-PW-TD-DERIVED-OUTPUTS", candidateIds: Object.freeze(["BTD-CAND-012", "BTD-CAND-016", "BTD-CAND-017"]), provenanceClass: "EXAM_PREP_CORPUS", examFamily: "Competitive aptitude", sourceUrl: "https://indbix.in/exercise/aptitude/bankers-discount/bankers-discount-general-questions.html", sourceSemantic: "BD+TD and PW+TD derived outputs" }),
  Object.freeze({ evidenceId: "TESTBOOK-INDIAN-NAVY-CROSS-FACE-TIME", candidateIds: Object.freeze(["BTD-CAND-018"]), provenanceClass: "PAST_PAPER_REPRODUCTION", examFamily: "Indian Navy INCET", sourceUrl: "https://testbook.com/question-answer/the-bankers-discount-on-rs-1600-at-15-per-a--68a387164ee1169aac51faa4", sourceSemantic: "BD on one face equals TD on another at same rate/time -> time" }),
  Object.freeze({ evidenceId: "BANKERS-DISCOUNT-RATIO-INVERSE-CORPUS", candidateIds: Object.freeze(["BTD-CAND-014"]), provenanceClass: "EXAM_PREP_CORPUS", examFamily: "IBPS / bank aptitude", sourceUrl: "https://gopract.com/studpracticetest.aspx?marks=10&sid=78", sourceSemantic: "BD:TD ratio + annual rate -> time" }),
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
function interestFactor(ratePercent: number, months: number) { return btdRat(ratePercent * months, 1200); }
function presentWorth(face: BtdCp002Rational, x: BtdCp002Rational) { return div(face, add(btdRat(1), x)); }
function trueDiscount(face: BtdCp002Rational, x: BtdCp002Rational) { return mul(presentWorth(face, x), x); }
function bankersDiscount(face: BtdCp002Rational, x: BtdCp002Rational) { return mul(face, x); }
function stableHash(seed: string) { return createHash("sha256").update(seed).digest().readUInt32BE(0); }
function stableIndex(seed: string, size: number) { return stableHash(seed) % size; }
function isPaiseSafe(value: BtdCp002Rational) { return (value.n * 100n) % value.d === 0n; }
function bigintSqrt(value: bigint): bigint { if (value < 0n) throw new Error("negative sqrt"); if (value < 2n) return value; let x0 = value; let x1 = (x0 + value / x0) >> 1n; while (x1 < x0) { x0 = x1; x1 = (x0 + value / x0) >> 1n; } if (x0 * x0 !== value) throw new Error(`non-square bigint ${value}`); return x0; }
function sqrtRat(value: BtdCp002Rational) { return btdRat(bigintSqrt(value.n), bigintSqrt(value.d)); }
function decimal(value: BtdCp002Rational) { const scaled = value.n * 100n; if (scaled % value.d === 0n) { const h = scaled / value.d; const sign = h < 0n ? "-" : ""; const positive = absBig(h); const whole = positive / 100n; const fraction = positive % 100n; if (fraction === 0n) return `${sign}${whole}`; if (fraction % 10n === 0n) return `${sign}${whole}.${fraction / 10n}`; return `${sign}${whole}.${fraction.toString().padStart(2, "0")}`; } return (Number(value.n) / Number(value.d)).toFixed(2).replace(/\.?0+$/u, ""); }
function money(value: BtdCp002Rational) { return `₹${decimal(value)}`; }
function percent(value: BtdCp002Rational) { return `${decimal(value)}%`; }
function monthsText(value: BtdCp002Rational) { return `${decimal(value)} month${eq(value, btdRat(1)) ? "" : "s"}`; }

const CONTEXTS = Object.freeze(["bill of exchange", "trade bill", "promissory note", "merchant bill", "bank-discount bill"] as const);
const FACE_VALUES = Object.freeze([1200, 1500, 1800, 2000, 2400, 3000, 3600, 4200, 4800, 5400, 6000, 7200, 8000, 9000, 10000, 12000, 14400, 16000] as const);
const PRESENT_VALUES = Object.freeze([400, 500, 576, 625, 720, 800, 900, 1024, 1200, 1440, 1600, 1800, 2025, 2400, 2500, 3200] as const);
const RATE_MONTH_PAIRS = Object.freeze([
  [4, 6], [5, 3], [5, 6], [5, 9], [6, 4], [6, 8], [6, 12], [8, 3], [8, 6], [8, 9], [8, 12], [10, 3], [10, 5], [10, 6], [10, 9], [10, 12],
  [12, 3], [12, 4], [12, 6], [12, 8], [12, 10], [12, 12], [15, 2], [15, 4], [15, 6], [15, 8], [15, 12], [18, 2], [18, 4], [18, 6], [20, 3], [20, 6], [20, 9], [24, 2], [24, 4], [24, 6],
] as const);
const X_VALUES = Object.freeze([btdRat(1, 40), btdRat(1, 30), btdRat(1, 25), btdRat(1, 20), btdRat(3, 50), btdRat(1, 15), btdRat(2, 25), btdRat(1, 10), btdRat(1, 8), btdRat(3, 20), btdRat(1, 5), btdRat(1, 4)] as const);

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

function buildPool010(): readonly State010[] {
  return PRESENT_VALUES.flatMap((pw) => X_VALUES.flatMap((x) => CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-010" as const, context, presentWorth: btdRat(pw), bankersGain: mul(btdRat(pw), square(x)) })).filter((state) => isPaiseSafe(state.bankersGain))));
}
function buildPool011(): readonly State011[] {
  const timePairs = [[2, 5], [3, 6], [3, 9], [4, 8], [5, 10], [6, 12]] as const;
  const rates = [8, 10, 12, 15, 18] as const;
  const states: State011[] = [];
  for (const [firstMonths, secondMonths] of timePairs) for (const ratePercent of rates) for (const firstFace of FACE_VALUES.slice(2, 14)) for (const secondFace of FACE_VALUES.slice(1, 13)) {
    if (firstFace === secondFace) continue;
    const totalBankersDiscount = add(bankersDiscount(btdRat(firstFace), interestFactor(ratePercent, firstMonths)), bankersDiscount(btdRat(secondFace), interestFactor(ratePercent, secondMonths)));
    if (!isPaiseSafe(totalBankersDiscount)) continue;
    for (const context of CONTEXTS.slice(0, 3)) states.push({ candidateId: "BTD-CAND-011", context, totalFaceValue: btdRat(firstFace + secondFace), firstMonths, secondMonths, ratePercent, totalBankersDiscount });
  }
  return states;
}
function buildPool012(): readonly State012[] { return FACE_VALUES.flatMap((face) => X_VALUES.flatMap((x) => CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-012" as const, context, bankersDiscount: bankersDiscount(btdRat(face), x), trueDiscount: trueDiscount(btdRat(face), x) })).filter((state) => isPaiseSafe(state.bankersDiscount) && isPaiseSafe(state.trueDiscount)))); }
function buildPool013(): readonly State013[] { return FACE_VALUES.flatMap((face) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-013" as const, context, bankersDiscount: bankersDiscount(btdRat(face), interestFactor(ratePercent, months)), ratePercent, months })).filter((state) => isPaiseSafe(state.bankersDiscount)))); }
function buildPool014(): readonly State014[] { return RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-014" as const, context, bdToTdRatio: add(btdRat(1), interestFactor(ratePercent, months)), ratePercent }))); }
function buildPool015(): readonly State015[] { return PRESENT_VALUES.flatMap((pw) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => { const x = interestFactor(ratePercent, months); return CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-015" as const, context, bankersGain: mul(btdRat(pw), square(x)), ratePercent, months })).filter((state) => isPaiseSafe(state.bankersGain)); })); }
function buildPool016(): readonly State016[] { return PRESENT_VALUES.flatMap((pw) => X_VALUES.flatMap((x) => CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-016" as const, context, presentWorth: btdRat(pw), trueDiscount: mul(btdRat(pw), x) })).filter((state) => isPaiseSafe(state.trueDiscount)))); }
function buildPool017(): readonly State017[] { return buildPool016().map((state) => ({ candidateId: "BTD-CAND-017", context: state.context, presentWorth: state.presentWorth, trueDiscount: state.trueDiscount })); }
function buildPool018(): readonly State018[] { return FACE_VALUES.flatMap((firstFace) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => { const secondFace = mul(btdRat(firstFace), add(btdRat(1), interestFactor(ratePercent, months))); if (!isPaiseSafe(secondFace)) return []; return CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-018" as const, context, bankersDiscountFace: btdRat(firstFace), trueDiscountFace: secondFace, ratePercent })); })); }
function buildPool019(): readonly State019[] { return FACE_VALUES.flatMap((face) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => { const x = interestFactor(ratePercent, months); const bd = bankersDiscount(btdRat(face), x); const td = trueDiscount(btdRat(face), x); if (!isPaiseSafe(bd) || !isPaiseSafe(td)) return []; return CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-019" as const, context, bankersDiscount: bd, trueDiscount: td, months })); })); }
function buildPool020(): readonly State020[] { return FACE_VALUES.flatMap((face) => RATE_MONTH_PAIRS.flatMap(([ratePercent, months]) => { const td = trueDiscount(btdRat(face), interestFactor(ratePercent, months)); if (!isPaiseSafe(td)) return []; return CONTEXTS.map((context) => ({ candidateId: "BTD-CAND-020" as const, context, trueDiscount: td, ratePercent, months })); })); }

const POOLS: Readonly<Record<BtdCp002CandidateId, readonly BtdCp002State[]>> = Object.freeze({
  "BTD-CAND-010": Object.freeze(buildPool010()), "BTD-CAND-011": Object.freeze(buildPool011()), "BTD-CAND-012": Object.freeze(buildPool012()),
  "BTD-CAND-013": Object.freeze(buildPool013()), "BTD-CAND-014": Object.freeze(buildPool014()), "BTD-CAND-015": Object.freeze(buildPool015()),
  "BTD-CAND-016": Object.freeze(buildPool016()), "BTD-CAND-017": Object.freeze(buildPool017()), "BTD-CAND-018": Object.freeze(buildPool018()),
  "BTD-CAND-019": Object.freeze(buildPool019()), "BTD-CAND-020": Object.freeze(buildPool020()),
});

export function constructBtdCp002State(candidateId: BtdCp002CandidateId, seed: string): BtdCp002State { const pool = POOLS[candidateId]; if (!pool.length) throw new Error(`${candidateId}: empty CP002 source pool`); return pool[stableIndex(`${candidateId}:${seed}`, pool.length)]!; }

export function solveBtdCp002(state: BtdCp002State): BtdCp002Rational {
  switch (state.candidateId) {
    case "BTD-CAND-010": return sqrtRat(mul(state.presentWorth, state.bankersGain));
    case "BTD-CAND-011": { const x1 = interestFactor(state.ratePercent, state.firstMonths); const x2 = interestFactor(state.ratePercent, state.secondMonths); const firstFace = div(sub(state.totalBankersDiscount, mul(state.totalFaceValue, x2)), sub(x1, x2)); const secondFace = sub(state.totalFaceValue, firstFace); return firstFace.n * secondFace.d >= secondFace.n * firstFace.d ? sub(firstFace, secondFace) : sub(secondFace, firstFace); }
    case "BTD-CAND-012": return div(mul(state.bankersDiscount, state.trueDiscount), sub(state.bankersDiscount, state.trueDiscount));
    case "BTD-CAND-013": return div(state.bankersDiscount, add(btdRat(1), interestFactor(state.ratePercent, state.months)));
    case "BTD-CAND-014": return div(mul(sub(state.bdToTdRatio, btdRat(1)), btdRat(1200)), btdRat(state.ratePercent));
    case "BTD-CAND-015": return div(state.bankersGain, interestFactor(state.ratePercent, state.months));
    case "BTD-CAND-016": return div(mul(state.trueDiscount, add(state.presentWorth, state.trueDiscount)), state.presentWorth);
    case "BTD-CAND-017": return div(square(state.trueDiscount), state.presentWorth);
    case "BTD-CAND-018": return div(mul(sub(div(state.trueDiscountFace, state.bankersDiscountFace), btdRat(1)), btdRat(1200)), btdRat(state.ratePercent));
    case "BTD-CAND-019": return div(mul(sub(div(state.bankersDiscount, state.trueDiscount), btdRat(1)), btdRat(1200)), btdRat(state.months));
    case "BTD-CAND-020": return mul(state.trueDiscount, add(btdRat(1), interestFactor(state.ratePercent, state.months)));
  }
}

export function verifyBtdCp002(state: BtdCp002State, answer: BtdCp002Rational) { return eq(solveBtdCp002(state), answer); }

function semanticFormat(candidateId: BtdCp002CandidateId, value: BtdCp002Rational) { const semantic = BTD_CP002_CANDIDATE_CONTRACTS[candidateId].answerSemantic; if (semantic === "RATE_PERCENT") return percent(value); if (semantic === "TIME_MONTHS") return monthsText(value); return money(value); }
function distractors(answer: BtdCp002Rational): readonly BtdCp002Rational[] { const factors = [btdRat(4, 5), btdRat(9, 10), btdRat(11, 10), btdRat(6, 5), btdRat(5, 4)] as const; const out: BtdCp002Rational[] = []; for (const factor of factors) { const value = mul(answer, factor); if (!eq(value, answer) && !out.some((item) => eq(item, value))) out.push(value); if (out.length === 3) break; } return out; }

function stemFor(state: BtdCp002State, family: number): string {
  const c = state.context;
  switch (state.candidateId) {
    case "BTD-CAND-010": return family === 0 ? `For a ${c}, the present worth is ${money(state.presentWorth)} and the banker's gain is ${money(state.bankersGain)}. Find the true discount.` : family === 1 ? `A ${c} has present worth ${money(state.presentWorth)} while its banker's gain is ${money(state.bankersGain)}. What is the true discount?` : `In discounting a ${c}, PW = ${money(state.presentWorth)} and BG = ${money(state.bankersGain)}. Determine TD.`;
    case "BTD-CAND-011": return family === 0 ? `Two ${c}s have total face value ${money(state.totalFaceValue)} and mature in ${state.firstMonths} and ${state.secondMonths} months. At ${state.ratePercent}% p.a., their total banker's discount is ${money(state.totalBankersDiscount)}. Find the difference between their face values.` : family === 1 ? `The combined face value of two ${c}s is ${money(state.totalFaceValue)}. Their terms are ${state.firstMonths} months and ${state.secondMonths} months at ${state.ratePercent}% p.a.; total BD is ${money(state.totalBankersDiscount)}. Find the face-value difference.` : `A pair of ${c}s totals ${money(state.totalFaceValue)} in face value. With maturities ${state.firstMonths} and ${state.secondMonths} months at ${state.ratePercent}% p.a., total banker's discount equals ${money(state.totalBankersDiscount)}. Determine the difference in face values.`;
    case "BTD-CAND-012": return family === 0 ? `For a ${c}, banker's discount is ${money(state.bankersDiscount)} and true discount is ${money(state.trueDiscount)}. Find the face value.` : family === 1 ? `A ${c} has BD ${money(state.bankersDiscount)} and TD ${money(state.trueDiscount)}. What sum is due at maturity?` : `If the banker's discount and true discount on a ${c} are ${money(state.bankersDiscount)} and ${money(state.trueDiscount)}, determine its face value.`;
    case "BTD-CAND-013": return family === 0 ? `The banker's discount on a ${c} is ${money(state.bankersDiscount)} at ${state.ratePercent}% p.a. for ${state.months} months. Find the true discount.` : family === 1 ? `A ${c} discounted for ${state.months} months at ${state.ratePercent}% gives BD ${money(state.bankersDiscount)}. Determine TD.` : `For a ${c}, BD = ${money(state.bankersDiscount)}, rate = ${state.ratePercent}% p.a., and time = ${state.months} months. What is the true discount?`;
    case "BTD-CAND-014": return family === 0 ? `For a ${c}, the ratio BD:TD is ${state.bdToTdRatio.n}:${state.bdToTdRatio.d} at ${state.ratePercent}% p.a. Find the unexpired time.` : family === 1 ? `A ${c} has banker's discount to true discount ratio ${state.bdToTdRatio.n}:${state.bdToTdRatio.d}. If the rate is ${state.ratePercent}% p.a., determine the term.` : `Given BD/TD = ${decimal(state.bdToTdRatio)} for a ${c} at ${state.ratePercent}% p.a., find the time in months.`;
    case "BTD-CAND-015": return family === 0 ? `The banker's gain on a ${c} is ${money(state.bankersGain)} at ${state.ratePercent}% p.a. for ${state.months} months. Find the true discount.` : family === 1 ? `A ${c} yields banker's gain ${money(state.bankersGain)} over ${state.months} months at ${state.ratePercent}% p.a. Determine TD.` : `For a ${c}, BG = ${money(state.bankersGain)}, rate = ${state.ratePercent}% and term = ${state.months} months. What is the true discount?`;
    case "BTD-CAND-016": return family === 0 ? `A ${c} has present worth ${money(state.presentWorth)} and true discount ${money(state.trueDiscount)}. Find the banker's discount.` : family === 1 ? `For a ${c}, PW is ${money(state.presentWorth)} and TD is ${money(state.trueDiscount)}. Determine BD.` : `The present worth and true discount of a ${c} are ${money(state.presentWorth)} and ${money(state.trueDiscount)} respectively. What is the banker's discount?`;
    case "BTD-CAND-017": return family === 0 ? `A ${c} has present worth ${money(state.presentWorth)} and true discount ${money(state.trueDiscount)}. Find the banker's gain.` : family === 1 ? `For a ${c}, PW = ${money(state.presentWorth)} and TD = ${money(state.trueDiscount)}. Determine banker's gain.` : `The present worth of a ${c} is ${money(state.presentWorth)} and its true discount is ${money(state.trueDiscount)}. What is BG?`;
    case "BTD-CAND-018": return family === 0 ? `At ${state.ratePercent}% p.a., the banker's discount on ${money(state.bankersDiscountFace)} equals the true discount on ${money(state.trueDiscountFace)} for the same term. Find the term in months.` : family === 1 ? `A ${c} is such that BD on ${money(state.bankersDiscountFace)} is equal to TD on ${money(state.trueDiscountFace)} at ${state.ratePercent}% p.a. Determine the common time.` : `For the same duration at ${state.ratePercent}% p.a., BD of ${money(state.bankersDiscountFace)} equals TD of ${money(state.trueDiscountFace)}. Find that duration in months.`;
    case "BTD-CAND-019": return family === 0 ? `For a ${c}, banker's discount is ${money(state.bankersDiscount)} and true discount is ${money(state.trueDiscount)} for ${state.months} months. Find the annual rate.` : family === 1 ? `A ${c} has BD ${money(state.bankersDiscount)} and TD ${money(state.trueDiscount)} over ${state.months} months. Determine the rate percent per annum.` : `Given BD = ${money(state.bankersDiscount)}, TD = ${money(state.trueDiscount)}, and time = ${state.months} months for a ${c}, find the annual rate.`;
    case "BTD-CAND-020": return family === 0 ? `The true discount on a ${c} is ${money(state.trueDiscount)} at ${state.ratePercent}% p.a. for ${state.months} months. Find the banker's discount.` : family === 1 ? `A ${c} has TD ${money(state.trueDiscount)} for ${state.months} months at ${state.ratePercent}% p.a. Determine BD.` : `For a ${c}, true discount = ${money(state.trueDiscount)}, rate = ${state.ratePercent}% and time = ${state.months} months. What is the banker's discount?`;
  }
}

export function buildBtdCp002CandidateQuestion(candidateId: BtdCp002CandidateId, seed: string) {
  const state = constructBtdCp002State(candidateId, seed);
  const answer = solveBtdCp002(state);
  const wrong = distractors(answer);
  if (wrong.length !== 3) throw new Error(`${candidateId}: distractor exhaustion`);
  const correctIndex = stableHash(`${candidateId}:${seed}:correct`) % 4;
  const optionValues = [...wrong]; optionValues.splice(correctIndex, 0, answer);
  const stemFamily = stableHash(`${candidateId}:${seed}:stem`) % 3;
  const sourceEvidenceIds = BTD_CP002_SOURCE_EVIDENCE.filter((item) => item.candidateIds.includes(candidateId)).map((item) => item.evidenceId);
  const correctAnswer = semanticFormat(candidateId, answer);
  return Object.freeze({
    chapterId: "BTD-001" as const,
    checkpointId: "BTD-CP-002" as const,
    saturationVersion: BTD_CP002_SOURCE_SATURATION_VERSION,
    candidateId,
    sourceEvidenceIds: Object.freeze(sourceEvidenceIds),
    state,
    answer,
    correctAnswer,
    correctIndex,
    options: Object.freeze(optionValues.map((value, index) => Object.freeze({ text: semanticFormat(candidateId, value), isCorrect: index === correctIndex }))),
    presentation: Object.freeze({ stemFamilyId: `BTD-CP002-STEM-${stemFamily + 1}`, stem: stemFor(state, stemFamily) }),
    explanation: Object.freeze({
      whatAsked: `We need the ${BTD_CP002_CANDIDATE_CONTRACTS[candidateId].answerSemantic.toLowerCase().replaceAll("_", " ")}.`,
      keyIdea: "Use the exact banker/true-discount identity for the given quantities, solve the requested inverse, then keep the result in exact rational form until final formatting.",
      steps: Object.freeze(["Translate the given BD, TD, PW, BG, rate or time relation into the standard discount identities.", "Solve the resulting one-variable relation exactly and verify it by substitution into the original quantities."]),
      finalAnswer: `Therefore, the required answer is ${correctAnswer}.`,
    }),
    lifecycle: Object.freeze({ discoveryOnly: true, permanentQlAllocated: false, questionStudioDiscoverable: false, questionBankWritable: false, testEligible: false, mockTestEligible: false, publiclyPublishable: false }),
  });
}
