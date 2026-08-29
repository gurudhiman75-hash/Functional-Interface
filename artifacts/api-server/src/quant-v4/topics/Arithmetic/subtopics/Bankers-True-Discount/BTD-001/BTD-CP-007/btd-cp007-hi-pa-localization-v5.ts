import { createHash } from "node:crypto";

import { buildBtdDiscoveryQuestionV6 } from "../btd-cp001-breadth-remediation-v6";
import { BTD_PERMANENT_QL_REGISTRY, type BtdPermanentQlId } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdCp002CandidateQuestion } from "../BTD-CP-002/btd-cp002-source-saturation-v2";
import {
  BTD_CP007_LANGUAGES_V4,
  BTD_CP007_LOCALIZATION_BOUNDARY_V4,
  buildBtdLocalizedQuestionV4,
  type BtdCp007LanguageV4,
} from "./btd-cp007-hi-pa-localization-v4";

export const BTD_CP007_LOCALIZATION_V5 = "BTD-001-CP007-HI-PA-LOCALIZATION-v5" as const;
export const BTD_CP007_LANGUAGES_V5 = BTD_CP007_LANGUAGES_V4;
export type BtdCp007LanguageV5 = BtdCp007LanguageV4;

export const BTD_CP007_LOCALIZATION_BOUNDARY_V5 = Object.freeze({
  ...BTD_CP007_LOCALIZATION_BOUNDARY_V4,
  localizationStatus: "HI_PA_REVIEW_CANDIDATE" as const,
  multilingualFrozen: false as const,
  questionStudioDiscoverable: false as const,
  questionStudioGenerationEnabled: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

type AnyRecord = Record<string, any>;

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
  }
  if (typeof value === "bigint") return JSON.stringify(value.toString());
  return JSON.stringify(value);
}

function fingerprint(value: unknown) {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function numeric(value: any) {
  return value && typeof value === "object" && "n" in value && "d" in value
    ? Number(value.n) / Number(value.d)
    : Number(value);
}

function numberText(value: number, digits = 2) {
  return value.toFixed(digits).replace(/\.00$/u, "").replace(/(\.\d)0$/u, "$1");
}

function indianNumber(value: number) {
  const fixed = numberText(value);
  const [wholeRaw, fraction] = fixed.split(".");
  const negative = wholeRaw.startsWith("-");
  const whole = negative ? wholeRaw.slice(1) : wholeRaw;
  const tail = whole.length > 3 ? whole.slice(-3) : whole;
  let head = whole.length > 3 ? whole.slice(0, -3) : "";
  const groups: string[] = [];
  while (head.length > 2) { groups.unshift(head.slice(-2)); head = head.slice(0, -2); }
  if (head) groups.unshift(head);
  return `${negative ? "-" : ""}${groups.length ? `${groups.join(",")},` : ""}${tail}${fraction ? `.${fraction}` : ""}`;
}

function money(value: any) { return `₹${indianNumber(numeric(value))}`; }
function fractionParts(value: any) { return { n: Number(value.n), d: Number(value.d) }; }
function calculationLabel(language: BtdCp007LanguageV5) { return language === "hi" ? "गणना:" : "ਗਣਨਾ:"; }
function thereforeLabel(language: BtdCp007LanguageV5) { return language === "hi" ? "अतः" : "ਇਸ ਲਈ"; }
function rateLabel(language: BtdCp007LanguageV5) { return language === "hi" ? "दर" : "ਦਰ"; }
function timeLabel(language: BtdCp007LanguageV5) { return language === "hi" ? "अवधि" : "ਮਿਆਦ"; }

function rawAuthority(entry: (typeof BTD_PERMANENT_QL_REGISTRY)[number], seed: string): AnyRecord {
  return entry.origin === "BTD-CP-001"
    ? buildBtdDiscoveryQuestionV6(entry.sourceAuthorityId as any, seed) as AnyRecord
    : buildBtdCp002CandidateQuestion(entry.sourceAuthorityId as any, seed) as AnyRecord;
}

function exactSteps(
  sourceId: string,
  state: AnyRecord,
  localizedAnswer: string,
  currentSteps: readonly string[],
  language: BtdCp007LanguageV5,
): readonly string[] {
  const c = calculationLabel(language);
  const therefore = thereforeLabel(language);
  switch (sourceId) {
    case "BTD-PROT-001":
      return [
        `${c} x = ${state.ratePercent} × ${state.months}/1200।`,
        `${c} PW = ${money(state.faceValue)}/(1 + ${state.ratePercent}×${state.months}/1200) = ${localizedAnswer}।`,
      ];
    case "BTD-PROT-002": {
      const x = state.ratePercent * state.months / 1200;
      const pw = numeric(state.faceValue) / (1 + x);
      return [
        `${c} PW = ${money(state.faceValue)}/(1 + ${state.ratePercent}×${state.months}/1200) = ${money(pw)}।`,
        `${c} TD = ${money(state.faceValue)} − ${money(pw)} = ${localizedAnswer}।`,
      ];
    }
    case "BTD-PROT-006": {
      const { n, d } = fractionParts(state.bdToTdRatio);
      return [
        `${c} x = BD/TD − 1 = ${n}/${d} − 1 = ${n - d}/${d}।`,
        `${c} ${rateLabel(language)} = (${n - d}/${d}) × 1200/${state.months} = ${localizedAnswer}।`,
      ];
    }
    case "BTD-PROT-007":
      return [
        `${c} x = ${state.ratePercent} × ${state.months}/1200।`,
        `${c} PW = ${money(state.bankersGain)}/(${state.ratePercent}×${state.months}/1200)² = ${localizedAnswer}।`,
      ];
    case "BTD-PROT-009": {
      const { n, d } = fractionParts(state.bdToTdRatio);
      return [
        `${c} BD/TD − 1 = ${n}/${d} − 1 = ${n - d}/${d}।`,
        `${c} R² = 100 × ${state.rateEqualsYearsMultiplier} × (${n - d}/${d}); R = ${localizedAnswer}।`,
      ];
    }
    case "BTD-CAND-011":
      return [
        `${c} F₁ + F₂ = ${money(state.totalFaceValue)}; (${state.ratePercent}×${state.firstMonths}/1200)F₁ + (${state.ratePercent}×${state.secondMonths}/1200)F₂ = ${money(state.totalBankersDiscount)}।`,
        currentSteps[1]!,
      ];
    case "BTD-CAND-013":
      return [
        `${c} x = ${state.ratePercent} × ${state.months}/1200।`,
        `${c} TD = ${money(state.bankersDiscount)}/(1 + ${state.ratePercent}×${state.months}/1200) = ${localizedAnswer}।`,
      ];
    case "BTD-CAND-014": {
      const { n, d } = fractionParts(state.bdToTdRatio);
      return [
        `${c} x = BD/TD − 1 = ${n}/${d} − 1 = ${n - d}/${d}।`,
        `${c} ${timeLabel(language)} = (${n - d}/${d}) × 1200/${state.ratePercent} = ${localizedAnswer}।`,
      ];
    }
    case "BTD-CAND-015":
      return [
        `${c} x = ${state.ratePercent} × ${state.months}/1200।`,
        `${c} TD = ${money(state.bankersGain)}/(${state.ratePercent}×${state.months}/1200) = ${localizedAnswer}।`,
      ];
    case "BTD-CAND-018":
      return [
        `${c} 1 + x = ${money(state.trueDiscountFace)}/${money(state.bankersDiscountFace)}।`,
        `${c} ${timeLabel(language)} = (${money(state.trueDiscountFace)}/${money(state.bankersDiscountFace)} − 1) × 1200/${state.ratePercent} = ${localizedAnswer}।`,
      ];
    case "BTD-CAND-019":
      return [
        `${c} x = ${money(state.bankersDiscount)}/${money(state.trueDiscount)} − 1।`,
        `${c} ${rateLabel(language)} = (${money(state.bankersDiscount)}/${money(state.trueDiscount)} − 1) × 1200/${state.months} = ${localizedAnswer}।`,
      ];
    case "BTD-CAND-020":
      return [
        `${c} x = ${state.ratePercent} × ${state.months}/1200।`,
        `${c} BD = ${money(state.trueDiscount)} × (1 + ${state.ratePercent}×${state.months}/1200) = ${localizedAnswer}।`,
      ];
    default:
      return currentSteps;
  }
}

export function buildBtdLocalizedQuestionV5(
  qlId: BtdPermanentQlId,
  seed: string,
  language: BtdCp007LanguageV5,
) {
  const v4 = buildBtdLocalizedQuestionV4(qlId, seed, language) as any;
  const entry = BTD_PERMANENT_QL_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`${qlId}: unknown BTD permanent QL`);
  const authority = rawAuthority(entry, seed);
  const steps = Object.freeze(exactSteps(entry.sourceAuthorityId, authority.state, v4.correctAnswer, v4.explanation.steps, language));
  const explanation = Object.freeze({
    ...v4.explanation,
    steps,
    finalAnswer: v4.explanation.finalAnswer,
  });

  const payload = Object.freeze({
    qlId: v4.qlId,
    language: v4.language,
    semanticSignature: v4.semanticSignature,
    answerSemantic: v4.answerSemantic,
    sourceStateFingerprint: v4.sourceStateFingerprint,
    englishContentFingerprint: v4.englishContentFingerprint,
    presentation: v4.presentation,
    options: v4.options,
    correctIndex: v4.correctIndex,
    correctAnswer: v4.correctAnswer,
    explanation,
  });

  return Object.freeze({
    ...v4,
    localizationVersion: BTD_CP007_LOCALIZATION_V5,
    explanation,
    localizationFingerprint: fingerprint(payload),
    lifecycle: BTD_CP007_LOCALIZATION_BOUNDARY_V5,
  });
}
