import { exactKey } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  TRG_001_AUTHORITY_ALIGNED_IDS,
  generateAuthorityAlignedTrg001Question,
} from "./production-authority-runtime";

function hash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function answerKey(answer: any) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

const ALT_STEMS: Record<string, string> = {
  "TRG-001-QL-001": "In right triangle ABC, the right angle is at C. Which side lies opposite ∠A?",
  "TRG-001-QL-002": "Triangle ABC is right-angled at C. Which leg is adjacent to ∠A?",
  "TRG-001-QL-003": "Triangle PQR is right-angled at Q. Identify its hypotenuse.",
  "TRG-001-QL-004": "In right triangle ABC with ∠C=90°, choose the ratio equal to sin A.",
  "TRG-001-QL-032": "Evaluate sec 45° in exact form.",
  "TRG-001-QL-038": "Find the exact value of (sin 30°)².",
  "TRG-001-QL-039": "Find (cos 30°)² in exact form.",
  "TRG-001-QL-040": "Find the exact value of (tan 60°)².",
  "TRG-001-QL-045": "Find the exact value of sin²30° + cos²60° + tan45°.",
  "TRG-001-QL-046": "Find sec60° + cosec30° − tan45° exactly.",
  "TRG-001-QL-119": "For acute θ, solve 2cosθ=1.",
  "TRG-001-QL-120": "For 0°<θ<90°, find θ if tanθ=√3.",
  "TRG-001-QL-134": "Find sin30°·sin60°·tan45° in exact form.",
  "TRG-001-QL-135": "Find the exact product cos30°·cos60°·sec60°.",
  "TRG-001-QL-136": "Find tan30°·tan60° + sin²45° exactly.",
  "TRG-001-QL-137": "Find the exact sum sin²30° + sin²45° + sin²60°.",
  "TRG-001-QL-144": "Which trigonometric function is equivalent to (1−cos2θ)/sin2θ, wherever defined?",
};

function applyAuthorityStemDiversity(question: any) {
  const alternate = ALT_STEMS[question.qlId];
  if (!alternate) return question;
  const variant = hash(`${question.seed}|${question.qlId}|authority-stem`) % 2;
  return variant === 0 ? { ...question, authorityStemVariant: 0 } : { ...question, stem: alternate, authorityStemVariant: 1 };
}

export function generateAuthorityCandidateTrg001Question(qlId: string, seed: string) {
  return applyAuthorityStemDiversity(generateAuthorityAlignedTrg001Question(qlId, seed));
}

export function generateAllAuthorityCandidateTrg001Questions(seed: string) {
  return TRG_001_AUTHORITY_ALIGNED_IDS.map((id) => generateAuthorityCandidateTrg001Question(id, seed));
}

export function authorityCandidateFingerprint(question: any) {
  return [
    question.qlId,
    question.seed,
    question.authorityAlignment.family,
    question.stem,
    question.options.map((option: any) => `${option.label}:${answerKey(option.value)}:${option.isCorrect}`).join("|"),
    question.correctIndex,
    answerKey(question.exactAnswer),
    question.explanation.steps.map((step: any) => `${step.title}:${step.body}`).join("|"),
  ].join("::");
}
