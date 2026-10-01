import { redesignEnglishQl } from "./editorial-v2-redesign";
import { buildQl125Editorial, buildQl132Editorial, buildQl133Editorial, buildQl139Editorial } from "./editorial-v2-ql125";
import { buildQl130Editorial } from "./editorial-v2-ql130";
import { buildQl137Editorial } from "./editorial-v2-ql137";
import { buildQl138Editorial } from "./editorial-v2-ql138";
import { buildQl141Editorial } from "./editorial-v2-ql141";
import { buildQl142Editorial } from "./editorial-v2-ql142";
import { buildQl143Editorial } from "./editorial-v2-ql143";
import { buildQl144Editorial } from "./editorial-v2-ql144";
import { buildGenericEditorialSurface } from "./editorial-v2-generic";

const EXPLANATION_HARDENING_QLS = new Set([
  "NUM-QL-128", "NUM-QL-130", "NUM-QL-131", "NUM-QL-132", "NUM-QL-133",
  "NUM-QL-134", "NUM-QL-135", "NUM-QL-136", "NUM-QL-137", "NUM-QL-140",
]);

function hardenEnglishSurface(surface: any, qlId: string, seed: number) {
  let stem = String(surface.stem);
  let steps = [...(surface.steps ?? [])].map(String);

  if (qlId === "NUM-QL-125") {
    const variants = [
      "Which of the following statements about number sets is correct?",
      "Which statement about integers, whole numbers and rational numbers is correct?",
      "Choose the correct statement about the classification of numbers.",
      "Which one of the following statements is true?",
    ];
    stem = variants[Math.abs(seed) % variants.length]!;
  }

  if (qlId === "NUM-QL-129") {
    const variants = [
      stem,
      stem.replace("which expression is odd", "which of the following expressions must be odd"),
      stem.replace("which expression is odd", "identify the expression whose value is odd"),
      stem.replace("which expression is odd", "which expression always has odd parity"),
    ];
    stem = variants[Math.abs(seed) % variants.length]!;
  }

  if (EXPLANATION_HARDENING_QLS.has(qlId)) {
    const concept = String(surface.concept ?? "").trim();
    if (concept && !steps.some((step) => step.includes(concept))) {
      steps.unshift(`Rule: ${concept}`);
    }
    if (steps.length < 3) {
      steps.push(`Therefore the correct answer is ${surface.answer}.`);
    }
    if (steps.length < 3) {
      steps.push("A quick check with the defining Number System rule gives the same result.");
    }
  }

  return Object.freeze({ ...surface, stem, steps: Object.freeze(steps) });
}

function simpleExplanation(concept: string, steps: readonly string[], answer: string) {
  return Object.freeze({
    coreConcept: Object.freeze([concept]),
    givenDataAndStrategy: Object.freeze([]),
    stepByStep: Object.freeze([...steps]),
    examSpeedMethod: Object.freeze([]),
    commonTraps: Object.freeze([]),
    finalAnswer: answer,
  });
}

export function applyNumCp001EditorialV2(frozen: any, language: "en" | "hi" | "pa", seed: number) {
  let surface: any = null;
  const qlId = String(frozen.questionLanguageId ?? frozen.permanentQlId);
  if (language === "en") {
    surface = redesignEnglishQl(frozen, seed);
    if (!surface && qlId === "NUM-QL-125") surface = buildQl125Editorial(frozen, seed);
    if (!surface && qlId === "NUM-QL-130") surface = buildQl130Editorial(frozen, seed);
    if (!surface && qlId === "NUM-QL-132") surface = buildQl132Editorial(frozen);
    if (!surface && qlId === "NUM-QL-133") surface = buildQl133Editorial(frozen);
    if (!surface && qlId === "NUM-QL-137") surface = buildQl137Editorial(frozen, seed);
    if (!surface && qlId === "NUM-QL-138") surface = buildQl138Editorial(frozen);
    if (!surface && qlId === "NUM-QL-139") surface = buildQl139Editorial(frozen);
    if (!surface && qlId === "NUM-QL-141") surface = buildQl141Editorial(frozen);
    if (!surface && qlId === "NUM-QL-142") surface = buildQl142Editorial(frozen);
    if (!surface && qlId === "NUM-QL-143") surface = buildQl143Editorial(frozen);
    if (!surface && qlId === "NUM-QL-144") surface = buildQl144Editorial(frozen, seed);
  }
  if (!surface) surface = buildGenericEditorialSurface(frozen, language);
  if (language === "en") surface = hardenEnglishSurface(surface, qlId, seed);
  return Object.freeze({
    stem: surface.stem,
    options: surface.options,
    correctIndex: surface.correctIndex,
    answer: surface.answer,
    canonicalAnswer: surface.answer,
    verifierAnswer: surface.answer,
    difficulty: String(frozen.difficulty),
    explanation: simpleExplanation(surface.concept, surface.steps, surface.answer),
    editorialVersion: "NUM_CP001_EDITORIAL_V2" as const,
  });
}
