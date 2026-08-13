import { generateMalCp006Wave02ChainLearner } from "./cp006-wave02-chain-learner";
import { generateMalCp006Wave02InverseLearner, type MalCp006Wave02LearnerQuestion } from "./cp006-wave02-inverse-learner";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";

export const MAL_CP006_WAVE02_LEARNER_AUTHORITY_ID = "MAL-CP006-EN-WAVE02-LEARNER-AUTHORITY-V1" as const;

function polish(text: string): string {
  return text
    .replace("litres of pure milk is kept", "litres of pure milk are kept")
    .replace("The x litres returned from B contains", "The x litres returned from B contain")
    .replace(". Find x.", ". What is x?")
    .replace(". Find the transferred quantity.", ". What quantity was transferred?")
    .replace(". Find the milk left in B.", ". How much milk is left in B?");
}

export function generateMalCp006Wave02LearnerAuthority(prototypeId: MalCp006Wave02PrototypeId, seed: string): MalCp006Wave02LearnerQuestion {
  const raw = prototypeId === "MAL-CP006-PROT-INVERSE-TRANSFER-RETURN-TARGET-RATIO"
    ? generateMalCp006Wave02InverseLearner(seed)
    : generateMalCp006Wave02ChainLearner(seed);
  const stem = polish(raw.stem);
  const options = raw.options.map(polish);
  const answer = polish(raw.answer);
  const explanation = raw.explanation.map(polish);
  const commonMistake = polish(raw.commonMistake);
  const errors = [...raw.validation.errors];
  if (!stem.endsWith("?")) errors.push("stem is not interrogative");
  if (explanation.length !== 4) errors.push("explanation line count");
  if (new Set(options).size !== 4) errors.push("option uniqueness");
  if (options[raw.correctIndex] !== answer) errors.push("answer-option mapping");
  const text = [stem, ...options, ...explanation, commonMistake].join(" ");
  if (text.includes("state key") || text.includes("component load") || text.includes("current fraction")) errors.push("internal terminology");
  if (text.includes("→")) errors.push("arrow shorthand");
  if (raw.permanentQlId !== null || raw.permanentSolveModeId !== null) errors.push("permanent allocation");
  if (raw.active || raw.publiclyPublishable || raw.questionStudioDiscoverable || raw.questionBankWritable || raw.testEligible) errors.push("lifecycle lock");
  return { ...raw, stem, options, answer, explanation, commonMistake, validation: { ok: errors.length === 0, errors } };
}
