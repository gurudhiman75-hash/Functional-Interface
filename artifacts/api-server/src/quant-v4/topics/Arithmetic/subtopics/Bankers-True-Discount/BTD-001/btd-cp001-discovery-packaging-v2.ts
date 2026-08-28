import {
  BTD_001_CHAPTER_ID,
  BTD_001_CHECKPOINT_ID,
  BTD_001_DISCOVERY_VERSION,
  BTD_001_PROTOTYPE_CONTRACTS,
  BTD_001_PROTOTYPE_IDS,
  BTD_001_SOURCE_BOUNDARY,
  constructBtdDiscoveryState,
  solveBtdDiscovery,
  verifyBtdDiscovery,
  type BtdDiscoveryState,
  type BtdPrototypeId,
  type Rational,
} from "./btd-cp001-source-bound-foundation-v1";

export const BTD_001_DISCOVERY_PACKAGING_V2 = "BTD-001-CP001-DISCOVERY-PACKAGING-v2" as const;
export { BTD_001_PROTOTYPE_IDS };
export type { BtdPrototypeId };

function abs(value: bigint) { return value < 0n ? -value : value; }
function gcd(left: bigint, right: bigint): bigint {
  let a = abs(left); let b = abs(right);
  while (b) { const next = a % b; a = b; b = next; }
  return a || 1n;
}
function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n); let denominator = BigInt(d);
  if (denominator === 0n) throw new Error("BTD v2 rational denominator cannot be zero");
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ n: numerator / divisor, d: denominator / divisor });
}
function add(a: Rational, b: Rational) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
function mul(a: Rational, b: Rational) { return rat(a.n * b.n, a.d * b.d); }
function div(a: Rational, b: Rational) { if (b.n === 0n) throw new Error("BTD v2 division by zero"); return rat(a.n * b.d, a.d * b.n); }
function eq(a: Rational, b: Rational) { return a.n === b.n && a.d === b.d; }
function square(a: Rational) { return mul(a, a); }
function hash(text: string) {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) { value ^= text.charCodeAt(index); value = Math.imul(value, 16777619); }
  return value >>> 0;
}
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}
function interestFactor(ratePercent: number, months: number) { return rat(BigInt(ratePercent * months), 1200n); }
function isHundredthSafe(value: Rational) { return (value.n * 100n) % value.d === 0n; }
function indianInteger(value: bigint) {
  const sign = value < 0n ? "-" : "";
  const digits = abs(value).toString();
  if (digits.length <= 3) return `${sign}${digits}`;
  const tail = digits.slice(-3); let head = digits.slice(0, -3); const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${sign}${groups.join(",")},${tail}`;
}
function decimal(value: Rational) {
  if (!isHundredthSafe(value)) throw new Error(`BTD v2 value is not hundredth-safe: ${value.n}/${value.d}`);
  const hundredths = value.n * 100n / value.d;
  const whole = hundredths / 100n;
  const fraction = abs(hundredths % 100n);
  if (fraction === 0n) return indianInteger(whole);
  if (fraction % 10n === 0n) return `${indianInteger(whole)}.${fraction / 10n}`;
  return `${indianInteger(whole)}.${fraction.toString().padStart(2, "0")}`;
}
function money(value: Rational) { return `₹${decimal(value)}`; }
function percent(value: Rational) { return `${decimal(value)}%`; }
function ratioText(value: Rational) { return `${value.n}:${value.d}`; }
function monthText(months: number) { return months === 12 ? "1 year" : months % 12 === 0 ? `${months / 12} years` : `${months} months`; }
function dateText(iso: string) {
  const date = new Date(`${iso}T00:00:00.000Z`);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
function daysBetween(earlierIso: string, laterIso: string) {
  return Math.round((new Date(`${laterIso}T00:00:00.000Z`).getTime() - new Date(`${earlierIso}T00:00:00.000Z`).getTime()) / 86_400_000);
}
function answerKind(prototypeId: BtdPrototypeId): "MONEY" | "RATE_PERCENT" { return prototypeId === "BTD-PROT-006" ? "RATE_PERCENT" : "MONEY"; }
function render(prototypeId: BtdPrototypeId, value: Rational) { return answerKind(prototypeId) === "RATE_PERCENT" ? percent(value) : money(value); }

function exactDerived(state: BtdDiscoveryState) {
  if (!("faceValue" in state) || !("ratePercent" in state) || !("months" in state)) return null;
  const x = interestFactor(state.ratePercent, state.months);
  const pw = div(state.faceValue, add(rat(1), x));
  const td = sub(state.faceValue, pw);
  const bd = mul(state.faceValue, x);
  const bg = sub(bd, td);
  return { x, pw, td, bd, bg };
}

function stemFor(state: BtdDiscoveryState, seed: string) {
  const family = hash(`${seed}:btd-v2-stem`) % 3;
  if (state.prototypeId === "BTD-PROT-005") {
    const choices = [
      `The face value of a ${state.context} is ${money(state.faceValue)} and its true discount is ${money(state.trueDiscount)}. Find the banker's discount.`,
      `A ${state.context} has amount due ${money(state.faceValue)}. If the true discount is ${money(state.trueDiscount)}, what banker's discount corresponds to the same unexpired period?`,
      `For one ${state.context}, face value = ${money(state.faceValue)} and true discount = ${money(state.trueDiscount)}. Determine the banker's discount.`,
    ];
    return { stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: choices[family]! };
  }
  if (state.prototypeId === "BTD-PROT-006") {
    const choices = [
      `For the same bill and unexpired period, banker's discount : true discount = ${ratioText(state.bdToTdRatio)}. If the unexpired time is ${monthText(state.months)}, find the annual simple-interest rate.`,
      `A bill has BD:TD = ${ratioText(state.bdToTdRatio)} for ${monthText(state.months)}. What annual rate is being used?`,
      `The ratio of banker's discount to true discount is ${ratioText(state.bdToTdRatio)} and the unexpired time is ${monthText(state.months)}. Find the rate per annum.`,
    ];
    return { stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: choices[family]! };
  }
  if (state.prototypeId === "BTD-PROT-007") {
    const choices = [
      `The banker's gain on a ${state.context} is ${money(state.bankersGain)} at ${state.ratePercent}% per annum for ${monthText(state.months)}. Find the present worth.`,
      `For ${monthText(state.months)} at ${state.ratePercent}% p.a., a ${state.context} gives banker's gain ${money(state.bankersGain)}. What is its present worth?`,
      `Banker's gain is ${money(state.bankersGain)} when a ${state.context} is discounted ${monthText(state.months)} before due date at ${state.ratePercent}% p.a. Determine present worth.`,
    ];
    return { stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: choices[family]! };
  }
  if (state.prototypeId === "BTD-PROT-008") {
    const choices = [
      `A bill for ${money(state.faceValue)} is drawn on ${dateText(state.drawDateIso)} for ${state.termMonths} months. It is discounted on ${dateText(state.discountDateIso)} at ${state.ratePercent}% p.a. Allowing 3 days of grace, find the banker's discount.`,
      `A ${state.termMonths}-month bill of ${money(state.faceValue)} dated ${dateText(state.drawDateIso)} is discounted on ${dateText(state.discountDateIso)} at ${state.ratePercent}% p.a. Find the banker's discount after including 3 grace days in the legal due date.`,
      `Face value ${money(state.faceValue)}; bill date ${dateText(state.drawDateIso)}; term ${state.termMonths} months; discount date ${dateText(state.discountDateIso)}; rate ${state.ratePercent}% p.a. What banker's discount is charged when 3 grace days are included?`,
    ];
    return { stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: choices[family]! };
  }
  const metric = state.prototypeId === "BTD-PROT-001" ? "present worth" : state.prototypeId === "BTD-PROT-002" ? "true discount" : state.prototypeId === "BTD-PROT-003" ? "banker's discount" : "banker's gain";
  const choices = [
    `A ${state.context} of ${money(state.faceValue)} is due after ${monthText(state.months)} at ${state.ratePercent}% per annum simple interest. Find the ${metric}.`,
    `The face value of a ${state.context} is ${money(state.faceValue)}. With ${monthText(state.months)} unexpired at ${state.ratePercent}% p.a., what is the ${metric}?`,
    `For a ${state.context}, amount due = ${money(state.faceValue)}, rate = ${state.ratePercent}% p.a. and unexpired time = ${monthText(state.months)}. Determine the ${metric}.`,
  ];
  return { stemFamilyId: `${state.prototypeId}-T${family + 1}`, stem: choices[family]! };
}

function explanationFor(state: BtdDiscoveryState, answer: Rational) {
  if (state.prototypeId === "BTD-PROT-005") {
    const pw = sub(state.faceValue, state.trueDiscount);
    return { whatAsked: "Find the banker's discount.", keyIdea: "For the same rate and time, TD is simple interest on present worth while BD is simple interest on face value.", steps: [`Present worth = ${money(state.faceValue)} − ${money(state.trueDiscount)} = ${money(pw)}.`, `BD/TD = Face value/Present worth.`, `BD = ${money(state.trueDiscount)} × ${money(state.faceValue)}/${money(pw)} = ${money(answer)}.`], finalAnswer: money(answer) };
  }
  if (state.prototypeId === "BTD-PROT-006") {
    const x = sub(state.bdToTdRatio, rat(1));
    return { whatAsked: "Find the annual rate.", keyIdea: "BD/TD = Face/PW = 1 + RT, where T is the unexpired time in years.", steps: [`RT = ${ratioText(state.bdToTdRatio)} − 1 = ${x.n}/${x.d}.`, `Rate = RT × 1200/months = (${x.n}/${x.d}) × 1200/${state.months} = ${percent(answer)}.`], finalAnswer: percent(answer) };
  }
  if (state.prototypeId === "BTD-PROT-007") {
    const x = interestFactor(state.ratePercent, state.months);
    return { whatAsked: "Find the present worth.", keyIdea: "If x = RT, then TD = PW·x and BD = PW(1+x)x, so banker's gain = PW·x².", steps: [`x = ${state.ratePercent} × ${state.months}/1200 = ${x.n}/${x.d}.`, `PW = BG/x² = ${money(state.bankersGain)} ÷ (${square(x).n}/${square(x).d}) = ${money(answer)}.`], finalAnswer: money(answer) };
  }
  if (state.prototypeId === "BTD-PROT-008") {
    const days = daysBetween(state.discountDateIso, state.legalDueDateIso);
    return { whatAsked: "Find the banker's discount from the bill dates.", keyIdea: "Use the legal due date including 3 days of grace, then calculate simple interest on the face value for the unexpired days.", steps: [`Legal due date = nominal due date + 3 days = ${dateText(state.legalDueDateIso)}.`, `Unexpired time = ${days} days.`, `BD = ${money(state.faceValue)} × ${state.ratePercent} × ${days}/36500 = ${money(answer)}.`], finalAnswer: money(answer) };
  }
  const derived = exactDerived(state)!;
  if (state.prototypeId === "BTD-PROT-001") return { whatAsked: "Find present worth.", keyIdea: "Present worth is the principal that becomes the face value under simple interest during the unexpired time.", steps: [`Interest factor x = ${state.ratePercent} × ${state.months}/1200 = ${derived.x.n}/${derived.x.d}.`, `PW = Face/(1+x) = ${money(state.faceValue)} ÷ (${add(rat(1), derived.x).n}/${add(rat(1), derived.x).d}) = ${money(answer)}.`], finalAnswer: money(answer) };
  if (state.prototypeId === "BTD-PROT-002") return { whatAsked: "Find true discount.", keyIdea: "True discount is face value minus present worth, and equals simple interest on the present worth.", steps: [`PW = ${money(derived.pw)}.`, `TD = ${money(state.faceValue)} − ${money(derived.pw)} = ${money(answer)}.`], finalAnswer: money(answer) };
  if (state.prototypeId === "BTD-PROT-003") return { whatAsked: "Find banker's discount.", keyIdea: "Banker's discount is simple interest on the face value for the unexpired time.", steps: [`BD = Face × rate × time/100.`, `BD = ${money(state.faceValue)} × ${state.ratePercent} × ${state.months}/1200 = ${money(answer)}.`], finalAnswer: money(answer) };
  return { whatAsked: "Find banker's gain.", keyIdea: "Banker's gain is the excess of banker's discount over true discount.", steps: [`BD = ${money(derived.bd)}; TD = ${money(derived.td)}.`, `BG = BD − TD = ${money(derived.bd)} − ${money(derived.td)} = ${money(answer)}.`], finalAnswer: money(answer) };
}

function semanticMoneyDistractors(state: BtdDiscoveryState, answer: Rational) {
  const derived = exactDerived(state);
  const candidates: { value: Rational; misconceptionId: string }[] = [];
  if (derived) {
    if (!eq(derived.pw, answer)) candidates.push({ value: derived.pw, misconceptionId: "CONFUSE_PRESENT_WORTH" });
    if (!eq(derived.td, answer)) candidates.push({ value: derived.td, misconceptionId: "CONFUSE_TRUE_DISCOUNT" });
    if (!eq(derived.bd, answer)) candidates.push({ value: derived.bd, misconceptionId: "CONFUSE_BANKERS_DISCOUNT" });
    if (!eq(derived.bg, answer)) candidates.push({ value: derived.bg, misconceptionId: "CONFUSE_BANKERS_GAIN" });
  }
  if (state.prototypeId === "BTD-PROT-005" && !eq(state.trueDiscount, answer)) candidates.push({ value: state.trueDiscount, misconceptionId: "REPORT_TRUE_DISCOUNT" });
  if (state.prototypeId === "BTD-PROT-007" && !eq(state.bankersGain, answer)) candidates.push({ value: state.bankersGain, misconceptionId: "REPORT_BANKERS_GAIN" });
  if (state.prototypeId === "BTD-PROT-008") {
    const days = daysBetween(state.discountDateIso, state.legalDueDateIso);
    const noGrace = Math.max(1, days - 3);
    candidates.push({ value: mul(state.faceValue, rat(BigInt(state.ratePercent * noGrace), 36_500n)), misconceptionId: "IGNORE_THREE_DAYS_GRACE" });
  }
  candidates.push({ value: mul(answer, rat(9, 10)), misconceptionId: "TEN_PERCENT_LOW" });
  candidates.push({ value: mul(answer, rat(11, 10)), misconceptionId: "TEN_PERCENT_HIGH" });
  candidates.push({ value: mul(answer, rat(6, 5)), misconceptionId: "TWENTY_PERCENT_HIGH" });
  return candidates;
}

function optionsFor(state: BtdDiscoveryState, answer: Rational, seed: string) {
  const candidates: { value: Rational; misconceptionId: string }[] = [];
  if (state.prototypeId === "BTD-PROT-006") {
    if (answer.d !== 1n) throw new Error(`${state.prototypeId}/${seed}: v2 requires an integer exam-safe annual rate`);
    const rate = Number(answer.n);
    for (const [delta, id] of [[-2, "RATE_TWO_LOW"], [-1, "RATE_ONE_LOW"], [2, "RATE_TWO_HIGH"], [5, "RATE_FIVE_HIGH"]] as const) {
      if (rate + delta > 0) candidates.push({ value: rat(rate + delta), misconceptionId: id });
    }
  } else candidates.push(...semanticMoneyDistractors(state, answer));
  const selected: { value: Rational; misconceptionId: string }[] = [];
  const seen = new Set([`${answer.n}/${answer.d}`]);
  for (const candidate of candidates) {
    if (candidate.value.n <= 0n || !isHundredthSafe(candidate.value)) continue;
    const key = `${candidate.value.n}/${candidate.value.d}`;
    if (seen.has(key)) continue;
    let acceptedAsWrong = true;
    try { acceptedAsWrong = !verifyBtdDiscovery(state, candidate.value); } catch { acceptedAsWrong = true; }
    if (!acceptedAsWrong) continue;
    seen.add(key); selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) throw new Error(`${state.prototypeId}/${seed}: v2 could not build three distinct exam-safe distractors`);
  const correctIndex = hash(`${seed}:btd-v2-correct-index`) % 4;
  const arranged = [...selected]; arranged.splice(correctIndex, 0, { value: answer, misconceptionId: "CORRECT" });
  return Object.freeze(arranged.map((item) => deepFreeze({ value: item.value, text: render(state.prototypeId, item.value), misconceptionId: item.misconceptionId, isCorrect: eq(item.value, answer) })));
}

export function buildBtdDiscoveryQuestionV2(prototypeId: BtdPrototypeId, seed: string) {
  const state = constructBtdDiscoveryState(prototypeId, seed);
  const answer = solveBtdDiscovery(state);
  if (!verifyBtdDiscovery(state, answer)) throw new Error(`${prototypeId}/${seed}: canonical answer rejected by independent verifier`);
  if (!isHundredthSafe(answer)) throw new Error(`${prototypeId}/${seed}: canonical answer is not exam-safe to two decimal places`);
  const presentation = stemFor(state, seed);
  const options = optionsFor(state, answer, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${prototypeId}/${seed}: correct-option ownership invalid`);
  const explanation = explanationFor(state, answer);
  return deepFreeze({
    chapterId: BTD_001_CHAPTER_ID,
    checkpointId: BTD_001_CHECKPOINT_ID,
    discoveryVersion: BTD_001_DISCOVERY_VERSION,
    packagingVersion: BTD_001_DISCOVERY_PACKAGING_V2,
    prototypeId,
    contract: BTD_001_PROTOTYPE_CONTRACTS[prototypeId],
    sourceBoundary: BTD_001_SOURCE_BOUNDARY,
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
