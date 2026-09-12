import { deterministicPick } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import { GEO_RIV_001_CP007_PROJECTED_FACTS_V1 } from "./geo-riv-001-cp007-facts";
import { generateGeoRiv001Cp007ReviewV1 } from "./geo-riv-001-cp007-review-generator-v1";
import type { GeoRiv001Cp007ReviewQuestion } from "./geo-riv-001-cp007-review-types";

const BASIC_PARENT_RELATIONS = new Set([
  "main_tributary_of",
  "tributary_of",
  "principal_tributary_of",
  "tributary_of_brahmaputra_system",
  "headstream_of",
  "source_stream_of",
]);

function valueText(fact: (typeof GEO_RIV_001_CP007_PROJECTED_FACTS_V1)[number]) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  return "";
}

const validParentsByRiver = new Map<string, Set<string>>();
const parentLabels = new Set<string>();
for (const fact of GEO_RIV_001_CP007_PROJECTED_FACTS_V1) {
  if (!BASIC_PARENT_RELATIONS.has(fact.relation) || fact.value.kind !== "entity_ref") continue;
  const river = fact.entity.label.en;
  const parent = valueText(fact);
  const set = validParentsByRiver.get(river) ?? new Set<string>();
  set.add(parent);
  validParentsByRiver.set(river, set);
  parentLabels.add(parent);
}

function normalizeFormationText(text: string) {
  return text.replace(/the confluence of the Chandra and Bhaga rivers/gi, "Chandra and Bhaga");
}

function normalizePlaceGrammar(text: string) {
  return text
    .replace(/ joins the ([^.\n]+) at near ([^.\n]+)/g, " joins the $1 near $2")
    .replace(/ joins the ([^.\n]+) at below ([^.\n]+)/g, " joins the $1 below $2")
    .replace(/ joins the ([^.\n]+) at west of ([^.\n]+)/g, " joins the $1 west of $2")
    .replace(/ joins the ([^.\n]+) at east of ([^.\n]+)/g, " joins the $1 east of $2")
    .replace(/ joins the ([^.\n]+) at north of ([^.\n]+)/g, " joins the $1 north of $2")
    .replace(/ joins the ([^.\n]+) at south of ([^.\n]+)/g, " joins the $1 south of $2");
}

function repairSelfPairOptions(question: GeoRiv001Cp007ReviewQuestion, options: string[]) {
  if (question.qlId !== "GEO-RIV-001-QL-060" && question.qlId !== "GEO-RIV-001-QL-061") return options;
  const result = [...options];
  for (let index = 0; index < result.length; index += 1) {
    const parts = result[index].split(" — ");
    if (parts.length !== 2 || parts[0] !== parts[1]) continue;
    const river = parts[0];
    const validParents = validParentsByRiver.get(river) ?? new Set<string>();
    const candidates = [...parentLabels].filter((parent) => {
      if (parent === river || validParents.has(parent)) return false;
      const pair = `${river} — ${parent}`;
      return !result.includes(pair);
    });
    if (!candidates.length) throw new Error(`CP007 V2 cannot repair self-pair distractor ${result[index]}`);
    const replacement = deterministicPick(candidates, `${question.questionId}:repair-self-pair:${index}`);
    result[index] = `${river} — ${replacement}`;
  }
  return result;
}

function calibratedDifficulty(qlId: string): GeoRiv001Cp007ReviewQuestion["difficulty"] {
  if (qlId === "GEO-RIV-001-QL-055" || qlId === "GEO-RIV-001-QL-056") return "Easy";
  if (qlId === "GEO-RIV-001-QL-062" || qlId === "GEO-RIV-001-QL-064") return "Hard";
  return "Medium";
}

export function reviseGeoRiv001Cp007QuestionV2(question: GeoRiv001Cp007ReviewQuestion): GeoRiv001Cp007ReviewQuestion {
  const stem = normalizePlaceGrammar(normalizeFormationText(question.stem));
  const explanation = normalizePlaceGrammar(normalizeFormationText(question.explanation));
  const canonicalAnswer = normalizeFormationText(question.canonicalAnswer);
  let options = question.options.map(normalizeFormationText);
  options = repairSelfPairOptions(question, options);
  const correctIndex = options.findIndex((option) => option === canonicalAnswer);
  if (correctIndex < 0) throw new Error(`CP007 V2 lost canonical answer for ${question.questionId}`);

  assertKnowledgeQuestionValid({ stem, explanation, options, correctIndex, canonicalAnswer });

  return {
    ...question,
    questionId: question.questionId.replace("CP007-V1", "CP007-V2"),
    stem,
    explanation,
    options,
    correctIndex,
    canonicalAnswer,
    difficulty: calibratedDifficulty(question.qlId),
  };
}

export function generateGeoRiv001Cp007ReviewV2(qlId: string, seed: string) {
  return reviseGeoRiv001Cp007QuestionV2(generateGeoRiv001Cp007ReviewV1(qlId, seed));
}
