import { redesignEnglishQl } from "./editorial-v2-redesign";
import { buildQl130Editorial } from "./editorial-v2-ql130";
import { buildQl137Editorial } from "./editorial-v2-ql137";
import { buildQl141Editorial } from "./editorial-v2-ql141";
import { buildQl144Editorial } from "./editorial-v2-ql144";
import { buildGenericEditorialSurface } from "./editorial-v2-generic";

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
    if (!surface && qlId === "NUM-QL-130") surface = buildQl130Editorial(frozen, seed);
    if (!surface && qlId === "NUM-QL-137") surface = buildQl137Editorial(frozen, seed);
    if (!surface && qlId === "NUM-QL-141") surface = buildQl141Editorial(frozen);
    if (!surface && qlId === "NUM-QL-144") surface = buildQl144Editorial(frozen, seed);
  }
  if (!surface) surface = buildGenericEditorialSurface(frozen, language);
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
