import { createHash } from "node:crypto";
import { buildBtdDiscoveryQuestionV6 } from "../btd-cp001-breadth-remediation-v6";
import { buildBtdCp002CandidateQuestion } from "../BTD-CP-002/btd-cp002-source-saturation-v2";
import {
  BTD_PERMANENT_ALLOCATION_BOUNDARY,
  BTD_PERMANENT_QL_REGISTRY,
  type BtdPermanentQlId,
} from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";

export const BTD_CP003_PERMANENT_GENERATOR_VERSION = "BTD-001-CP003-PERMANENT-GENERATOR-v1" as const;
export const BTD_CP003_QL_IDS = Object.freeze(BTD_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId));

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}
function fingerprint(value: unknown) {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}
function numeric(value: any) {
  if (value && typeof value === "object" && "n" in value && "d" in value) return Number(value.n) / Number(value.d);
  return Number(value);
}
function numberText(value: number, digits = 2) {
  return value.toFixed(digits).replace(/\.00$/u, "").replace(/(\.\d)0$/u, "$1");
}
function money(value: any) { return `₹${numberText(numeric(value))}`; }
function ratio(value: any) { return `${String(value.n)}:${String(value.d)}`; }
function months(value: any) { const n = numeric(value); return `${numberText(n)} month${n === 1 ? "" : "s"}`; }
function rate(value: any) { return `${numberText(numeric(value))}%`; }
function yearOrMonths(monthCount: number) { return monthCount % 12 === 0 ? `${monthCount / 12} year${monthCount === 12 ? "" : "s"}` : `${monthCount} months`; }
function dateText(iso: string) {
  const date = new Date(`${iso}T00:00:00.000Z`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function givenSummary(sourceAuthorityId: string, state: any): string {
  switch (sourceAuthorityId) {
    case "BTD-PROT-001": case "BTD-PROT-002": case "BTD-PROT-003": case "BTD-PROT-004":
      return `Face value ${money(state.faceValue)}, annual rate ${state.ratePercent}%, and unexpired time ${yearOrMonths(state.months)} are given.`;
    case "BTD-PROT-005": return `Face value ${money(state.faceValue)} and true discount ${money(state.trueDiscount)} are given.`;
    case "BTD-PROT-006": return `The ratio BD:TD is ${ratio(state.bdToTdRatio)} and the unexpired time is ${yearOrMonths(state.months)}.`;
    case "BTD-PROT-007": return `Banker's gain ${money(state.bankersGain)}, annual rate ${state.ratePercent}%, and time ${yearOrMonths(state.months)} are given.`;
    case "BTD-PROT-008": return `Face value ${money(state.faceValue)}, bill date ${dateText(state.drawDateIso)}, term ${state.termMonths} months, discount date ${dateText(state.discountDateIso)}, and rate ${state.ratePercent}% are given; 3 grace days apply.`;
    case "BTD-PROT-009": return `BD:TD = ${ratio(state.bdToTdRatio)} and the annual rate is numerically ${state.rateEqualsYearsMultiplier} times the term in years.`;
    case "BTD-CAND-010": return `Present worth ${money(state.presentWorth)} and banker's gain ${money(state.bankersGain)} are given.`;
    case "BTD-CAND-011": return `Two bills have total face value ${money(state.totalFaceValue)}, terms ${state.firstMonths} and ${state.secondMonths} months, common rate ${state.ratePercent}%, and total banker's discount ${money(state.totalBankersDiscount)}.`;
    case "BTD-CAND-012": return `Banker's discount ${money(state.bankersDiscount)} and true discount ${money(state.trueDiscount)} are given.`;
    case "BTD-CAND-013": return `Banker's discount ${money(state.bankersDiscount)}, annual rate ${state.ratePercent}%, and time ${state.months} months are given.`;
    case "BTD-CAND-014": return `BD:TD = ${ratio(state.bdToTdRatio)} and the annual rate is ${state.ratePercent}%.`;
    case "BTD-CAND-015": return `Banker's gain ${money(state.bankersGain)}, annual rate ${state.ratePercent}%, and time ${state.months} months are given.`;
    case "BTD-CAND-016": case "BTD-CAND-017": return `Present worth ${money(state.presentWorth)} and true discount ${money(state.trueDiscount)} are given.`;
    case "BTD-CAND-018": return `At ${state.ratePercent}% p.a., banker's discount on ${money(state.bankersDiscountFace)} equals true discount on ${money(state.trueDiscountFace)} for the same time.`;
    case "BTD-CAND-019": return `Banker's discount ${money(state.bankersDiscount)}, true discount ${money(state.trueDiscount)}, and time ${state.months} months are given.`;
    case "BTD-CAND-020": return `True discount ${money(state.trueDiscount)}, annual rate ${state.ratePercent}%, and time ${state.months} months are given.`;
    default: throw new Error(`Unknown BTD source authority ${sourceAuthorityId}`);
  }
}

function cp002Explanation(sourceAuthorityId: string, state: any, correctAnswer: string) {
  switch (sourceAuthorityId) {
    case "BTD-CAND-010":
      return { whatAsked: "Find the true discount.", keyIdea: "For the same bill, banker's gain equals TD² divided by present worth.", steps: [`Use BG = TD²/PW, so TD = √(PW × BG).`, `TD = √(${money(state.presentWorth)} × ${money(state.bankersGain)}) = ${correctAnswer}.`] };
    case "BTD-CAND-011": {
      const total = numeric(state.totalFaceValue); const d = numeric(state.totalBankersDiscount); const x1 = state.ratePercent * state.firstMonths / 1200; const x2 = state.ratePercent * state.secondMonths / 1200;
      const first = (d - total * x2) / (x1 - x2); const second = total - first;
      return { whatAsked: "Find the difference between the two face values.", keyIdea: "Use the total face value as one equation and total banker's discount as the second weighted equation.", steps: [`Let the first face value be F₁ and the second be F₂. Then F₁ + F₂ = ${money(state.totalFaceValue)}.`, `Total BD gives ${numberText(x1 * 100)}% of F₁ + ${numberText(x2 * 100)}% of F₂ = ${money(state.totalBankersDiscount)}.`, `Solving gives face values ${money(first)} and ${money(second)}; their difference is ${correctAnswer}.`] };
    }
    case "BTD-CAND-012": return { whatAsked: "Find the face value.", keyIdea: "Since BG = BD − TD and BG = BD×TD/Face, face value can be recovered directly from BD and TD.", steps: [`BG = ${money(state.bankersDiscount)} − ${money(state.trueDiscount)} = ${money(numeric(state.bankersDiscount) - numeric(state.trueDiscount))}.`, `Face = BD × TD / (BD − TD) = ${correctAnswer}.`] };
    case "BTD-CAND-013": { const x = state.ratePercent * state.months / 1200; return { whatAsked: "Find the true discount.", keyIdea: "BD/TD = 1 + RT, so with rate and time known TD follows directly from BD.", steps: [`RT = ${state.ratePercent} × ${state.months}/1200 = ${numberText(x)}.`, `TD = BD/(1+RT) = ${money(state.bankersDiscount)}/(1+${numberText(x)}) = ${correctAnswer}.`] }; }
    case "BTD-CAND-014": return { whatAsked: "Find the unexpired time.", keyIdea: "For one bill, BD/TD = 1 + RT/100.", steps: [`From BD:TD = ${ratio(state.bdToTdRatio)}, RT/100 = ${numberText(numeric(state.bdToTdRatio) - 1, 4)}.`, `Time in months = (BD/TD − 1) × 1200/rate = ${correctAnswer}.`] };
    case "BTD-CAND-015": { const x = state.ratePercent * state.months / 1200; return { whatAsked: "Find the true discount.", keyIdea: "Banker's gain = TD × RT for the same bill.", steps: [`RT = ${state.ratePercent} × ${state.months}/1200 = ${numberText(x)}.`, `TD = BG/RT = ${money(state.bankersGain)}/${numberText(x)} = ${correctAnswer}.`] }; }
    case "BTD-CAND-016": return { whatAsked: "Find the banker's discount.", keyIdea: "Face value = PW + TD and BD/TD = Face/PW.", steps: [`Face value = ${money(state.presentWorth)} + ${money(state.trueDiscount)} = ${money(numeric(state.presentWorth) + numeric(state.trueDiscount))}.`, `BD = TD × Face/PW = ${correctAnswer}.`] };
    case "BTD-CAND-017": return { whatAsked: "Find the banker's gain.", keyIdea: "Banker's gain equals TD² divided by present worth.", steps: [`Use BG = TD²/PW.`, `BG = ${money(state.trueDiscount)}² / ${money(state.presentWorth)} = ${correctAnswer}.`] };
    case "BTD-CAND-018": return { whatAsked: "Find the common time.", keyIdea: "Equating BD on the first face and TD on the second gives 1 + RT = second face/first face.", steps: [`1 + RT = ${money(state.trueDiscountFace)}/${money(state.bankersDiscountFace)} = ${numberText(numeric(state.trueDiscountFace) / numeric(state.bankersDiscountFace), 4)}.`, `Time in months = RT × 1200/${state.ratePercent} = ${correctAnswer}.`] };
    case "BTD-CAND-019": return { whatAsked: "Find the annual rate.", keyIdea: "BD/TD = 1 + RT, so BD and TD reveal the interest factor RT.", steps: [`RT = BD/TD − 1 = ${money(state.bankersDiscount)}/${money(state.trueDiscount)} − 1.`, `Rate = RT × 1200/${state.months} = ${correctAnswer}.`] };
    case "BTD-CAND-020": { const x = state.ratePercent * state.months / 1200; return { whatAsked: "Find the banker's discount.", keyIdea: "BD/TD = 1 + RT for the same face value and unexpired time.", steps: [`RT = ${state.ratePercent} × ${state.months}/1200 = ${numberText(x)}.`, `BD = TD(1+RT) = ${money(state.trueDiscount)} × (1+${numberText(x)}) = ${correctAnswer}.`] }; }
    default: throw new Error(`No CP002 production explanation for ${sourceAuthorityId}`);
  }
}

function productionExplanation(sourceAuthorityId: string, state: any, baseExplanation: any, correctAnswer: string) {
  const specific = sourceAuthorityId.startsWith("BTD-CAND-") ? cp002Explanation(sourceAuthorityId, state, correctAnswer) : baseExplanation;
  return Object.freeze({
    whatGiven: givenSummary(sourceAuthorityId, state),
    whatAsked: specific.whatAsked,
    keyIdea: specific.keyIdea,
    steps: Object.freeze([...specific.steps]),
    finalAnswer: specific.finalAnswer ?? `Therefore, the required answer is ${correctAnswer}.`,
  });
}

function lookupQl(qlId: BtdPermanentQlId) {
  const entry = BTD_PERMANENT_QL_REGISTRY.find((item) => item.qlId === qlId);
  if (!entry) throw new Error(`${qlId}: not allocated in BTD permanent registry`);
  return entry;
}

export function buildBtdPermanentQuestionV1(qlId: BtdPermanentQlId, seed: string) {
  const entry = lookupQl(qlId);
  const base: any = entry.origin === "BTD-CP-001"
    ? buildBtdDiscoveryQuestionV6(entry.sourceAuthorityId as any, seed)
    : buildBtdCp002CandidateQuestion(entry.sourceAuthorityId as any, seed);

  const options = Object.freeze(base.options.map((option: any) => Object.freeze({
    text: String(option.text),
    isCorrect: Boolean(option.isCorrect),
    misconceptionId: option.misconceptionId ? String(option.misconceptionId) : undefined,
  })));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${qlId}/${seed}: invalid answer ownership`);
  const correctAnswer = options[correctIndex]!.text;

  return Object.freeze({
    chapterId: "BTD-001" as const,
    checkpointId: "BTD-CP-003" as const,
    productionVersion: BTD_CP003_PERMANENT_GENERATOR_VERSION,
    qlId,
    semanticSignature: entry.semanticSignature,
    answerSemantic: entry.answerSemantic,
    sourceAuthorityId: entry.sourceAuthorityId,
    sourceOriginCheckpoint: entry.origin,
    sourceStateFingerprint: fingerprint(base.state),
    seed,
    presentation: Object.freeze({ stemFamilyId: String(base.presentation.stemFamilyId), stem: String(base.presentation.stem) }),
    options,
    correctIndex,
    correctAnswer,
    explanation: productionExplanation(entry.sourceAuthorityId, base.state, base.explanation, correctAnswer),
    lifecycle: Object.freeze({
      permanentQlAllocated: true as const,
      productionCandidate: true as const,
      contentFreezeStatus: BTD_PERMANENT_ALLOCATION_BOUNDARY.contentFreezeStatus,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}
