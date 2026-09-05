export const BTD_001_DISCOVERY_VERSION = "BTD-001-CP001-SOURCE-BOUND-DISCOVERY-v1" as const;
export const BTD_001_CHAPTER_ID = "BTD-001" as const;
export const BTD_001_CHECKPOINT_ID = "BTD-CP-001" as const;

export const BTD_001_PROTOTYPE_IDS = Object.freeze([
  "BTD-PROT-001",
  "BTD-PROT-002",
  "BTD-PROT-003",
  "BTD-PROT-004",
  "BTD-PROT-005",
  "BTD-PROT-006",
  "BTD-PROT-007",
  "BTD-PROT-008",
] as const);
export type BtdPrototypeId = (typeof BTD_001_PROTOTYPE_IDS)[number];

export const BTD_001_SOURCE_BOUNDARY = Object.freeze({
  topic: "Banker's Discount, True Discount, Present Worth and Banker's Gain" as const,
  mustRemainSeparateFromInterestChapter: "INT-001" as const,
  legacyRecoveryEvidence: Object.freeze({
    familyFile: "artifacts/api-server/src/quant-v2/canonical/interest-motif-factories.ts" as const,
    independentSolverFile: "artifacts/api-server/src/quant-v2/validators/interest-independent-solver.ts" as const,
    recoveredFamilies: Object.freeze([
      "int_true_discount",
      "int_present_worth",
      "int_bankers_discount",
      "int_bankers_gain",
      "int_bd_td_difference",
      "int_bill_due_after_time",
    ] as const),
  }),
  externalExamPracticeEvidence: Object.freeze([
    Object.freeze({
      authorityId: "EXT-TESTBOOK-TRUE-DISCOUNT-PUNJAB-POLICE-2026",
      url: "https://testbook.com/question-answer/the-true-discount-on-%E2%82%B91980-due-after-a-ce--69e0d214ecad557080766408",
      evidence: "True-discount inverse time question plus PW/TD/BD/BG formula relationships.",
      provenanceClass: "THIRD_PARTY_EXAM_PREP_NOT_OFFICIAL_PAPER" as const,
    }),
    Object.freeze({
      authorityId: "EXT-EDUREV-SSC-CGL-BANKERS-DISCOUNT",
      url: "https://edurev.in/ssc-cgl-exam/questions/tier-2-study-material-online-tests-previous-year-5435/discount-44454",
      evidence: "BD↔TD, BG↔PW, rate/time inverse, face-value inverse and bill-date/unexpired-time variants.",
      provenanceClass: "THIRD_PARTY_EXAM_PREP_NOT_OFFICIAL_PAPER" as const,
    }),
  ] as const),
  officialPaperProvenanceRecovered: false as const,
  permanentQlAllocationAuthorized: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

export const BTD_001_PROTOTYPE_CONTRACTS = Object.freeze({
  "BTD-PROT-001": Object.freeze({ title: "Present worth from face value, rate and unexpired time", unknown: "PRESENT_WORTH" as const }),
  "BTD-PROT-002": Object.freeze({ title: "True discount from face value, rate and unexpired time", unknown: "TRUE_DISCOUNT" as const }),
  "BTD-PROT-003": Object.freeze({ title: "Banker's discount from face value, rate and unexpired time", unknown: "BANKERS_DISCOUNT" as const }),
  "BTD-PROT-004": Object.freeze({ title: "Banker's gain from face value, rate and unexpired time", unknown: "BANKERS_GAIN" as const }),
  "BTD-PROT-005": Object.freeze({ title: "Banker's discount from face value and true discount", unknown: "BANKERS_DISCOUNT" as const }),
  "BTD-PROT-006": Object.freeze({ title: "Annual rate from BD:TD ratio and unexpired time", unknown: "ANNUAL_RATE_PERCENT" as const }),
  "BTD-PROT-007": Object.freeze({ title: "Present worth from banker's gain, rate and unexpired time", unknown: "PRESENT_WORTH" as const }),
  "BTD-PROT-008": Object.freeze({ title: "Banker's discount from bill dates including three days of grace", unknown: "BANKERS_DISCOUNT" as const }),
} as const);

export type Rational = Readonly<{ n: bigint; d: bigint }>;
function abs(value: bigint) { return value < 0n ? -value : value; }
function gcd(left: bigint, right: bigint): bigint {
  let a = abs(left); let b = abs(right);
  while (b) { const next = a % b; a = b; b = next; }
  return a || 1n;
}
function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n); let denominator = BigInt(d);
  if (denominator === 0n) throw new Error("BTD rational denominator cannot be zero");
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ n: numerator / divisor, d: denominator / divisor });
}
function add(a: Rational, b: Rational) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
function mul(a: Rational, b: Rational) { return rat(a.n * b.n, a.d * b.d); }
function div(a: Rational, b: Rational) { if (b.n === 0n) throw new Error("BTD division by zero"); return rat(a.n * b.d, a.d * b.n); }
function eq(a: Rational, b: Rational) { return a.n === b.n && a.d === b.d; }
function square(a: Rational) { return mul(a, a); }

function hash(text: string) {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}
function pick<T>(values: readonly T[], seed: string, salt: string): T {
  return values[hash(`${seed}:${salt}`) % values.length]!;
}
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}

const FACE_VALUES = Object.freeze([1200n, 1500n, 1800n, 1980n, 2160n, 2400n, 3000n, 3600n, 4500n, 5000n, 6000n, 7200n, 9000n] as const);
const RATES = Object.freeze([5, 6, 8, 10, 12, 15] as const);
const MONTHS = Object.freeze([3, 4, 5, 6, 8, 9, 12, 15, 18, 24, 30, 36] as const);
const BILL_CONTEXTS = Object.freeze(["bill of exchange", "trade bill", "promissory note", "merchant bill", "invoice"] as const);

function interestFactor(ratePercent: number, months: number): Rational {
  return rat(BigInt(ratePercent * months), 1200n);
}
function presentWorth(faceValue: Rational, x: Rational): Rational { return div(faceValue, add(rat(1), x)); }
function trueDiscount(faceValue: Rational, x: Rational): Rational { return sub(faceValue, presentWorth(faceValue, x)); }
function bankersDiscount(faceValue: Rational, x: Rational): Rational { return mul(faceValue, x); }
function bankersGain(faceValue: Rational, x: Rational): Rational { return sub(bankersDiscount(faceValue, x), trueDiscount(faceValue, x)); }

function isPaiseSafe(value: Rational) { return (value.n * 100n) % value.d === 0n; }
function isRateSafe(value: Rational) { return (value.n * 100n) % value.d === 0n; }
function indianInteger(value: bigint) {
  const sign = value < 0n ? "-" : "";
  const digits = abs(value).toString();
  if (digits.length <= 3) return `${sign}${digits}`;
  const tail = digits.slice(-3);
  let head = digits.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function decimal(value: Rational) {
  if (!isPaiseSafe(value)) throw new Error(`BTD non-paise-safe value ${value.n}/${value.d}`);
  const paise = value.n * 100n / value.d;
  const whole = paise / 100n;
  const fraction = abs(paise % 100n);
  const wholeText = indianInteger(whole);
  if (fraction === 0n) return wholeText;
  if (fraction % 10n === 0n) return `${wholeText}.${fraction / 10n}`;
  return `${wholeText}.${fraction.toString().padStart(2, "0")}`;
}
function money(value: Rational) { return `₹${decimal(value)}`; }
function percent(value: Rational) { return `${decimal(value)}%`; }
function monthText(months: number) { return months === 12 ? "1 year" : months % 12 === 0 ? `${months / 12} years` : `${months} months`; }
function ratioText(value: Rational) { return `${value.n}:${value.d}`; }

function utcDate(year: number, month: number, day: number) { return new Date(Date.UTC(year, month - 1, day)); }
function addMonthsUtc(date: Date, months: number) {
  const year = date.getUTCFullYear(); const month = date.getUTCMonth(); const day = date.getUTCDate();
  const target = new Date(Date.UTC(year, month + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target;
}
function addDaysUtc(date: Date, days: number) { return new Date(date.getTime() + days * 86_400_000); }
function daysBetweenUtc(earlier: Date, later: Date) { return Math.round((later.getTime() - earlier.getTime()) / 86_400_000); }
function dateText(date: Date) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

type DirectState = Readonly<{
  prototypeId: "BTD-PROT-001" | "BTD-PROT-002" | "BTD-PROT-003" | "BTD-PROT-004";
  context: string;
  faceValue: Rational;
  ratePercent: number;
  months: number;
}>;
type BdFromTdState = Readonly<{
  prototypeId: "BTD-PROT-005";
  context: string;
  faceValue: Rational;
  trueDiscount: Rational;
}>;
type RateFromRatioState = Readonly<{
  prototypeId: "BTD-PROT-006";
  context: string;
  bdToTdRatio: Rational;
  months: number;
}>;
type PwFromBgState = Readonly<{
  prototypeId: "BTD-PROT-007";
  context: string;
  bankersGain: Rational;
  ratePercent: number;
  months: number;
}>;
type BillDateState = Readonly<{
  prototypeId: "BTD-PROT-008";
  context: "bill of exchange";
  faceValue: Rational;
  ratePercent: number;
  drawDateIso: string;
  termMonths: number;
  discountDateIso: string;
  legalDueDateIso: string;
  graceDays: 3;
}>;
export type BtdDiscoveryState = DirectState | BdFromTdState | RateFromRatioState | PwFromBgState | BillDateState;

function baseState(seed: string) {
  const faceValue = rat(pick(FACE_VALUES, seed, "face"));
  const ratePercent = pick(RATES, seed, "rate");
  const months = pick(MONTHS, seed, "months");
  const x = interestFactor(ratePercent, months);
  return { faceValue, ratePercent, months, x, context: pick(BILL_CONTEXTS, seed, "context") };
}
function safeBase(seed: string) {
  for (let attempt = 0; attempt < 128; attempt += 1) {
    const candidateSeed = attempt === 0 ? seed : `${seed}:safe:${attempt}`;
    const base = baseState(candidateSeed);
    const pw = presentWorth(base.faceValue, base.x);
    const td = trueDiscount(base.faceValue, base.x);
    const bd = bankersDiscount(base.faceValue, base.x);
    const bg = bankersGain(base.faceValue, base.x);
    if ([pw, td, bd, bg].every(isPaiseSafe)) return { ...base, effectiveSeed: candidateSeed };
  }
  throw new Error(`${seed}: unable to construct paise-safe BTD discovery state`);
}

const DRAW_DATES = Object.freeze([
  Object.freeze({ y: 2025, m: 1, d: 14 }), Object.freeze({ y: 2025, m: 3, d: 5 }),
  Object.freeze({ y: 2025, m: 4, d: 28 }), Object.freeze({ y: 2025, m: 7, d: 14 }),
  Object.freeze({ y: 2025, m: 8, d: 31 }), Object.freeze({ y: 2025, m: 10, d: 9 }),
] as const);
const BILL_TERMS = Object.freeze([3, 4, 5, 6] as const);
const UNEXPIRED_DAYS = Object.freeze([45, 60, 73, 90, 120] as const);

export function constructBtdDiscoveryState(prototypeId: BtdPrototypeId, seed: string): BtdDiscoveryState {
  if (prototypeId === "BTD-PROT-008") {
    for (let attempt = 0; attempt < 128; attempt += 1) {
      const candidateSeed = attempt === 0 ? seed : `${seed}:date:${attempt}`;
      const faceValue = rat(pick(FACE_VALUES, candidateSeed, "date-face"));
      const ratePercent = pick(RATES, candidateSeed, "date-rate");
      const draw = pick(DRAW_DATES, candidateSeed, "draw");
      const termMonths = pick(BILL_TERMS, candidateSeed, "term");
      const drawDate = utcDate(draw.y, draw.m, draw.d);
      const legalDueDate = addDaysUtc(addMonthsUtc(drawDate, termMonths), 3);
      const desiredDays = pick(UNEXPIRED_DAYS, candidateSeed, "unexpired");
      const discountDate = addDaysUtc(legalDueDate, -desiredDays);
      if (discountDate <= drawDate) continue;
      const x = rat(BigInt(ratePercent * desiredDays), 36_500n);
      const bd = bankersDiscount(faceValue, x);
      if (!isPaiseSafe(bd)) continue;
      return deepFreeze({ prototypeId, context: "bill of exchange", faceValue, ratePercent, drawDateIso: drawDate.toISOString().slice(0, 10), termMonths, discountDateIso: discountDate.toISOString().slice(0, 10), legalDueDateIso: legalDueDate.toISOString().slice(0, 10), graceDays: 3 });
    }
    throw new Error(`${prototypeId}/${seed}: unable to construct safe bill-date state`);
  }

  const base = safeBase(seed);
  if (prototypeId === "BTD-PROT-001" || prototypeId === "BTD-PROT-002" || prototypeId === "BTD-PROT-003" || prototypeId === "BTD-PROT-004") {
    return deepFreeze({ prototypeId, context: base.context, faceValue: base.faceValue, ratePercent: base.ratePercent, months: base.months });
  }
  if (prototypeId === "BTD-PROT-005") {
    return deepFreeze({ prototypeId, context: base.context, faceValue: base.faceValue, trueDiscount: trueDiscount(base.faceValue, base.x) });
  }
  if (prototypeId === "BTD-PROT-006") {
    const pw = presentWorth(base.faceValue, base.x);
    const ratio = div(base.faceValue, pw);
    const answer = div(mul(sub(ratio, rat(1)), rat(1200)), rat(base.months));
    if (!isRateSafe(answer)) return constructBtdDiscoveryState(prototypeId, `${seed}:rate-safe`);
    return deepFreeze({ prototypeId, context: base.context, bdToTdRatio: ratio, months: base.months });
  }
  return deepFreeze({ prototypeId, context: base.context, bankersGain: bankersGain(base.faceValue, base.x), ratePercent: base.ratePercent, months: base.months });
}

export function solveBtdDiscovery(state: BtdDiscoveryState): Rational {
  switch (state.prototypeId) {
    case "BTD-PROT-001": return presentWorth(state.faceValue, interestFactor(state.ratePercent, state.months));
    case "BTD-PROT-002": return trueDiscount(state.faceValue, interestFactor(state.ratePercent, state.months));
    case "BTD-PROT-003": return bankersDiscount(state.faceValue, interestFactor(state.ratePercent, state.months));
    case "BTD-PROT-004": return bankersGain(state.faceValue, interestFactor(state.ratePercent, state.months));
    case "BTD-PROT-005": {
      const pw = sub(state.faceValue, state.trueDiscount);
      const x = div(state.trueDiscount, pw);
      return mul(state.faceValue, x);
    }
    case "BTD-PROT-006": return div(mul(sub(state.bdToTdRatio, rat(1)), rat(1200)), rat(state.months));
    case "BTD-PROT-007": {
      const x = interestFactor(state.ratePercent, state.months);
      return div(state.bankersGain, square(x));
    }
    case "BTD-PROT-008": {
      const discountDate = new Date(`${state.discountDateIso}T00:00:00.000Z`);
      const legalDueDate = new Date(`${state.legalDueDateIso}T00:00:00.000Z`);
      const days = daysBetweenUtc(discountDate, legalDueDate);
      return bankersDiscount(state.faceValue, rat(BigInt(state.ratePercent * days), 36_500n));
    }
  }
}

export function verifyBtdDiscovery(state: BtdDiscoveryState, candidate: Rational): boolean {
  switch (state.prototypeId) {
    case "BTD-PROT-001": {
      const x = interestFactor(state.ratePercent, state.months);
      return eq(mul(candidate, add(rat(1), x)), state.faceValue);
    }
    case "BTD-PROT-002": {
      const pw = sub(state.faceValue, candidate);
      return pw.n > 0n && eq(mul(pw, interestFactor(state.ratePercent, state.months)), candidate);
    }
    case "BTD-PROT-003": return eq(candidate, mul(state.faceValue, interestFactor(state.ratePercent, state.months)));
    case "BTD-PROT-004": {
      const x = interestFactor(state.ratePercent, state.months);
      const pw = presentWorth(state.faceValue, x);
      return eq(candidate, mul(pw, square(x)));
    }
    case "BTD-PROT-005": {
      const pw = sub(state.faceValue, state.trueDiscount);
      return eq(mul(candidate, pw), mul(state.faceValue, state.trueDiscount));
    }
    case "BTD-PROT-006": return eq(add(rat(1), interestFactor(Number(candidate.n) / Number(candidate.d), state.months)), state.bdToTdRatio);
    case "BTD-PROT-007": {
      const x = interestFactor(state.ratePercent, state.months);
      return eq(mul(candidate, square(x)), state.bankersGain);
    }
    case "BTD-PROT-008": {
      const discountDate = new Date(`${state.discountDateIso}T00:00:00.000Z`);
      const dueDateWithoutGrace = addMonthsUtc(new Date(`${state.drawDateIso}T00:00:00.000Z`), state.termMonths);
      const legalDueDate = addDaysUtc(dueDateWithoutGrace, state.graceDays);
      if (legalDueDate.toISOString().slice(0, 10) !== state.legalDueDateIso) return false;
      const days = daysBetweenUtc(discountDate, legalDueDate);
      return eq(candidate, bankersDiscount(state.faceValue, rat(BigInt(state.ratePercent * days), 36_500n)));
    }
  }
}

export type BtdDiscoveryOption = Readonly<{ text: string; value: Rational; misconceptionId: string; isCorrect: boolean }>;
function answerKind(prototypeId: BtdPrototypeId): "MONEY" | "RATE_PERCENT" { return prototypeId === "BTD-PROT-006" ? "RATE_PERCENT" : "MONEY"; }
function renderAnswer(prototypeId: BtdPrototypeId, value: Rational) { return answerKind(prototypeId) === "MONEY" ? money(value) : percent(value); }

function wrongCandidates(state: BtdDiscoveryState, answer: Rational): readonly Readonly<{ value: Rational; misconceptionId: string }>[] {
  const scaled = (numerator: number, denominator: number, misconceptionId: string) => Object.freeze({ value: mul(answer, rat(numerator, denominator)), misconceptionId });
  switch (state.prototypeId) {
    case "BTD-PROT-001": {
      const x = interestFactor(state.ratePercent, state.months);
      return Object.freeze([
        { value: sub(state.faceValue, bankersDiscount(state.faceValue, x)), misconceptionId: "SUBTRACT_BANKERS_DISCOUNT_FROM_FACE" },
        { value: state.faceValue, misconceptionId: "TREAT_FACE_VALUE_AS_PRESENT_WORTH" },
        scaled(11, 10, "INVERT_PRESENT_WORTH_FACTOR"),
      ]);
    }
    case "BTD-PROT-002": {
      const x = interestFactor(state.ratePercent, state.months);
      return Object.freeze([
        { value: bankersDiscount(state.faceValue, x), misconceptionId: "USE_BANKERS_DISCOUNT_INSTEAD" },
        { value: bankersGain(state.faceValue, x), misconceptionId: "USE_BANKERS_GAIN_INSTEAD" },
        scaled(9, 10, "UNDERSTATE_TRUE_DISCOUNT"),
      ]);
    }
    case "BTD-PROT-003": {
      const x = interestFactor(state.ratePercent, state.months);
      return Object.freeze([
        { value: trueDiscount(state.faceValue, x), misconceptionId: "USE_TRUE_DISCOUNT_INSTEAD" },
        { value: bankersGain(state.faceValue, x), misconceptionId: "USE_BANKERS_GAIN_INSTEAD" },
        scaled(11, 10, "COMPOUND_THE_DISCOUNT_RATE"),
      ]);
    }
    case "BTD-PROT-004": {
      const x = interestFactor(state.ratePercent, state.months);
      return Object.freeze([
        { value: trueDiscount(state.faceValue, x), misconceptionId: "REPORT_TRUE_DISCOUNT" },
        { value: bankersDiscount(state.faceValue, x), misconceptionId: "REPORT_BANKERS_DISCOUNT" },
        scaled(2, 1, "DOUBLE_THE_GAIN"),
      ]);
    }
    case "BTD-PROT-005": return Object.freeze([
      { value: state.trueDiscount, misconceptionId: "REPORT_TRUE_DISCOUNT" },
      scaled(9, 10, "APPLY_TD_TO_FACE_VALUE_DIRECTLY"),
      scaled(11, 10, "OVERSTATE_BD_TD_RATIO"),
    ]);
    case "BTD-PROT-006": return Object.freeze([
      scaled(1, 2, "FORGET_TIME_CONVERSION"),
      scaled(2, 1, "DOUBLE_RATE_FROM_RATIO"),
      scaled(12, 10, "USE_MONTHS_AS_YEARS"),
    ]);
    case "BTD-PROT-007": return Object.freeze([
      { value: div(state.bankersGain, interestFactor(state.ratePercent, state.months)), misconceptionId: "USE_BG_EQUALS_PW_X" },
      scaled(1, 2, "HALVE_PRESENT_WORTH"),
      scaled(2, 1, "DOUBLE_PRESENT_WORTH"),
    ]);
    case "BTD-PROT-008": {
      const discountDate = new Date(`${state.discountDateIso}T00:00:00.000Z`);
      const nominalDue = addMonthsUtc(new Date(`${state.drawDateIso}T00:00:00.000Z`), state.termMonths);
      const daysWithoutGrace = daysBetweenUtc(discountDate, nominalDue);
      return Object.freeze([
        { value: bankersDiscount(state.faceValue, rat(BigInt(state.ratePercent * daysWithoutGrace), 36_500n)), misconceptionId: "IGNORE_THREE_DAYS_GRACE" },
        scaled(365, 360, "USE_360_DAY_YEAR"),
        scaled(9, 10, "UNDERCOUNT_UNEXPIRED_TIME"),
      ]);
    }
  }
}
function optionsFor(state: BtdDiscoveryState, answer: Rational, seed: string): readonly BtdDiscoveryOption[] {
  const candidates = wrongCandidates(state, answer);
  const selected: Readonly<{ value: Rational; misconceptionId: string }>[] = [];
  const seen = new Set([`${answer.n}/${answer.d}`]);
  for (const candidate of candidates) {
    if (candidate.value.n <= 0n) continue;
    if (answerKind(state.prototypeId) === "MONEY" && !isPaiseSafe(candidate.value)) continue;
    if (answerKind(state.prototypeId) === "RATE_PERCENT" && !isRateSafe(candidate.value)) continue;
    const key = `${candidate.value.n}/${candidate.value.d}`;
    if (seen.has(key) || verifyBtdDiscovery(state, candidate.value)) continue;
    seen.add(key); selected.push(candidate);
  }
  for (const [n, d, id] of [[9, 10, "FALLBACK_LOW"], [11, 10, "FALLBACK_HIGH"], [6, 5, "FALLBACK_HIGHER"]] as const) {
    if (selected.length >= 3) break;
    const value = mul(answer, rat(n, d));
    if (answerKind(state.prototypeId) === "MONEY" && !isPaiseSafe(value)) continue;
    if (answerKind(state.prototypeId) === "RATE_PERCENT" && !isRateSafe(value)) continue;
    const key = `${value.n}/${value.d}`;
    if (seen.has(key) || verifyBtdDiscovery(state, value)) continue;
    seen.add(key); selected.push({ value, misconceptionId: id });
  }
  if (selected.length < 3) throw new Error(`${state.prototypeId}/${seed}: insufficient distinct exam-safe distractors`);
  const correctIndex = hash(`${seed}:correct-position`) % 4;
  const arranged = [...selected.slice(0, 3)];
  arranged.splice(correctIndex, 0, { value: answer, misconceptionId: "CORRECT" });
  return Object.freeze(arranged.map((candidate) => deepFreeze({ text: renderAnswer(state.prototypeId, candidate.value), value: candidate.value, misconceptionId: candidate.misconceptionId, isCorrect: eq(candidate.value, answer) })));
}

function presentationFor(state: BtdDiscoveryState, seed: string) {
  const family = hash(`${seed}:stem-family`) % 3;
  const contract = BTD_001_PROTOTYPE_CONTRACTS[state.prototypeId];
  if (state.prototypeId === "BTD-PROT-005") {
    const stems = [
      `The face value of a ${state.context} is ${money(state.faceValue)} and its true discount is ${money(state.trueDiscount)}. Find the banker's discount.`,
      `A ${state.context} has amount due ${money(state.faceValue)}. If the true discount is ${money(state.trueDiscount)}, what is the corresponding banker's discount?`,
      `For a ${state.context}, face value = ${money(state.faceValue)} and true discount = ${money(state.trueDiscount)}. Determine the banker's discount.`
    ];
    return Object.freeze({ stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: stems[family]!, contract });
  }
  if (state.prototypeId === "BTD-PROT-006") {
    const stems = [
      `For the same bill and unexpired period, banker's discount : true discount = ${ratioText(state.bdToTdRatio)}. If the bill is due after ${monthText(state.months)}, find the annual simple-interest rate.`,
      `The ratio BD:TD on a bill is ${ratioText(state.bdToTdRatio)} for an unexpired time of ${monthText(state.months)}. What annual rate is being used?`,
      `A banker finds that banker's discount is ${ratioText(state.bdToTdRatio)} of true discount in ratio form BD:TD. The unexpired time is ${monthText(state.months)}. Find the rate per annum.`
    ];
    return Object.freeze({ stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: stems[family]!, contract });
  }
  if (state.prototypeId === "BTD-PROT-007") {
    const stems = [
      `The banker's gain on a ${state.context} is ${money(state.bankersGain)} at ${state.ratePercent}% per annum for ${monthText(state.months)}. Find its present worth.`,
      `For ${monthText(state.months)} at ${state.ratePercent}% p.a., a ${state.context} gives a banker's gain of ${money(state.bankersGain)}. What is the present worth?`,
      `Banker's gain = ${money(state.bankersGain)} for a ${state.context} discounted ${monthText(state.months)} before due date at ${state.ratePercent}% p.a. Determine present worth.`
    ];
    return Object.freeze({ stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: stems[family]!, contract });
  }
  if (state.prototypeId === "BTD-PROT-008") {
    const drawDate = new Date(`${state.drawDateIso}T00:00:00.000Z`);
    const discountDate = new Date(`${state.discountDateIso}T00:00:00.000Z`);
    const stems = [
      `A bill for ${money(state.faceValue)} is drawn on ${dateText(drawDate)} for ${state.termMonths} months. It is discounted on ${dateText(discountDate)} at ${state.ratePercent}% p.a. Allowing the usual 3 days of grace, find the banker's discount.`,
      `A ${state.termMonths}-month bill of ${money(state.faceValue)} dated ${dateText(drawDate)} is discounted by a bank on ${dateText(discountDate)} at ${state.ratePercent}% p.a. Find the banker's discount after including 3 days of grace in the due date.`,
      `Face value ${money(state.faceValue)}; bill date ${dateText(drawDate)}; term ${state.termMonths} months; bank discount date ${dateText(discountDate)}; rate ${state.ratePercent}% p.a. What banker's discount is charged if 3 grace days are included?`
    ];
    return Object.freeze({ stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: stems[family]!, contract });
  }
  const metric = state.prototypeId === "BTD-PROT-001" ? "present worth" : state.prototypeId === "BTD-PROT-002" ? "true discount" : state.prototypeId === "BTD-PROT-003" ? "banker's discount" : "banker's gain";
  const stems = [
    `A ${state.context} of ${money(state.faceValue)} is due after ${monthText(state.months)} at ${state.ratePercent}% per annum simple interest. Find the ${metric}.`,
    `The face value of a ${state.context} is ${money(state.faceValue)}. With ${monthText(state.months)} unexpired at ${state.ratePercent}% p.a., what is the ${metric}?`,
    `For a ${state.context}, amount due = ${money(state.faceValue)}, rate = ${state.ratePercent}% p.a. and unexpired time = ${monthText(state.months)}. Determine the ${metric}.`
  ];
  return Object.freeze({ stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: stems[family]!, contract });
}

function explanationFor(state: BtdDiscoveryState, answer: Rational) {
  switch (state.prototypeId) {
    case "BTD-PROT-001": {
      const x = interestFactor(state.ratePercent, state.months);
      return Object.freeze({ whatAsked: "Present worth of the future amount.", keyIdea: "Present worth is the principal which becomes the face value by simple interest over the unexpired time.", steps: Object.freeze([`Unexpired-time interest factor = ${state.ratePercent} × ${state.months}/1200 = ${x.n}/${x.d}.`, `PW = Face value ÷ (1 + factor) = ${money(state.faceValue)} ÷ (${add(rat(1), x).n}/${add(rat(1), x).d}) = ${money(answer)}.`]), finalAnswer: money(answer) });
    }
    case "BTD-PROT-002": {
      const pw = presentWorth(state.faceValue, interestFactor(state.ratePercent, state.months));
      return Object.freeze({ whatAsked: "True discount.", keyIdea: "True discount is face value minus present worth; equivalently it is simple interest on present worth.", steps: Object.freeze([`Present worth = ${money(pw)}.`, `TD = ${money(state.faceValue)} − ${money(pw)} = ${money(answer)}.`]), finalAnswer: money(answer) });
    }
    case "BTD-PROT-003": return Object.freeze({ whatAsked: "Banker's discount.", keyIdea: "Banker's discount is simple interest on the face value for the unexpired time.", steps: Object.freeze([`BD = Face value × rate × time / 100.`, `BD = ${money(state.faceValue)} × ${state.ratePercent} × ${state.months}/1200 = ${money(answer)}.`]), finalAnswer: money(answer) });
    case "BTD-PROT-004": {
      const x = interestFactor(state.ratePercent, state.months); const td = trueDiscount(state.faceValue, x); const bd = bankersDiscount(state.faceValue, x);
      return Object.freeze({ whatAsked: "Banker's gain.", keyIdea: "Banker's gain is the excess of banker's discount over true discount.", steps: Object.freeze([`BD = ${money(bd)} and TD = ${money(td)}.`, `BG = BD − TD = ${money(bd)} − ${money(td)} = ${money(answer)}.`]), finalAnswer: money(answer) });
    }
    case "BTD-PROT-005": {
      const pw = sub(state.faceValue, state.trueDiscount);
      return Object.freeze({ whatAsked: "Banker's discount from face value and true discount.", keyIdea: "TD is simple interest on PW, while BD is simple interest on face value for the same rate and time; therefore BD/TD = Face/PW.", steps: Object.freeze([`PW = ${money(state.faceValue)} − ${money(state.trueDiscount)} = ${money(pw)}.`, `BD = TD × Face/PW = ${money(state.trueDiscount)} × ${money(state.faceValue)}/${money(pw)} = ${money(answer)}.`]), finalAnswer: money(answer) });
    }
    case "BTD-PROT-006": {
      const x = sub(state.bdToTdRatio, rat(1));
      return Object.freeze({ whatAsked: "Annual rate from BD:TD and time.", keyIdea: "BD/TD = Face/PW = 1 + RT, where T is in years.", steps: Object.freeze([`Interest factor RT = ${ratioText(state.bdToTdRatio)} − 1 = ${x.n}/${x.d}.`, `Rate = RT × 1200/months = (${x.n}/${x.d}) × 1200/${state.months} = ${percent(answer)}.`]), finalAnswer: percent(answer) });
    }
    case "BTD-PROT-007": {
      const x = interestFactor(state.ratePercent, state.months);
      return Object.freeze({ whatAsked: "Present worth from banker's gain.", keyIdea: "Because TD = PW·x and BD = PW(1+x)x, banker's gain = PW·x².", steps: Object.freeze([`x = ${state.ratePercent} × ${state.months}/1200 = ${x.n}/${x.d}.`, `PW = BG/x² = ${money(state.bankersGain)} ÷ (${square(x).n}/${square(x).d}) = ${money(answer)}.`]), finalAnswer: money(answer) });
    }
    case "BTD-PROT-008": {
      const discountDate = new Date(`${state.discountDateIso}T00:00:00.000Z`); const legalDueDate = new Date(`${state.legalDueDateIso}T00:00:00.000Z`); const days = daysBetweenUtc(discountDate, legalDueDate);
      return Object.freeze({ whatAsked: "Banker's discount using the bill's actual unexpired time.", keyIdea: "First find the legal due date by adding the bill term and 3 grace days; then take simple interest on face value for the unexpired days.", steps: Object.freeze([`Legal due date = nominal due date + 3 days = ${dateText(legalDueDate)}.`, `Unexpired time from ${dateText(discountDate)} to ${dateText(legalDueDate)} = ${days} days.`, `BD = ${money(state.faceValue)} × ${state.ratePercent} × ${days}/36500 = ${money(answer)}.`]), finalAnswer: money(answer) });
    }
  }
}

export function buildBtdDiscoveryQuestion(prototypeId: BtdPrototypeId, seed: string) {
  const state = constructBtdDiscoveryState(prototypeId, seed);
  const answer = solveBtdDiscovery(state);
  if (!verifyBtdDiscovery(state, answer)) throw new Error(`${prototypeId}/${seed}: independent BTD verifier rejected canonical answer`);
  if (answerKind(prototypeId) === "MONEY" && !isPaiseSafe(answer)) throw new Error(`${prototypeId}/${seed}: answer is not paise-safe`);
  if (answerKind(prototypeId) === "RATE_PERCENT" && !isRateSafe(answer)) throw new Error(`${prototypeId}/${seed}: rate answer is not exam-safe`);
  const presentation = presentationFor(state, seed);
  const options = optionsFor(state, answer, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${prototypeId}/${seed}: invalid correct-option ownership`);
  const explanation = explanationFor(state, answer);
  return deepFreeze({
    chapterId: BTD_001_CHAPTER_ID,
    checkpointId: BTD_001_CHECKPOINT_ID,
    discoveryVersion: BTD_001_DISCOVERY_VERSION,
    prototypeId,
    sourceBoundary: BTD_001_SOURCE_BOUNDARY,
    contract: BTD_001_PROTOTYPE_CONTRACTS[prototypeId],
    seed,
    state,
    answerKind: answerKind(prototypeId),
    answer,
    presentation,
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation,
    lifecycle: Object.freeze({
      discoveryOnly: true as const,
      permanentQlAllocated: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}
