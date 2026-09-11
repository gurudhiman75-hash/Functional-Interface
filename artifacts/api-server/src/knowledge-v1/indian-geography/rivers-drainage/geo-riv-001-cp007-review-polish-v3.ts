import { GEO_RIV_001_CP007_PROJECTED_FACTS_V1 } from "./geo-riv-001-cp007-facts";
import { GEO_RIV_001_CP007_REVIEW_BATCH_V3, auditGeoRiv001Cp007ReviewBatchV3 } from "./geo-riv-001-cp007-review-batch-v3";
import type { GeoRiv001Cp007ReviewQuestion } from "./geo-riv-001-cp007-review-types";

const RIVER_VALUE_RELATIONS = new Set([
  "main_tributary_of",
  "tributary_of",
  "principal_tributary_of",
  "tributary_of_brahmaputra_system",
  "headstream_of",
  "source_stream_of",
  "left_bank_tributary_of",
  "right_bank_tributary_of",
  "joins_river",
  "joins_mainstream",
]);

const RIVER_NAMES = [...new Set(GEO_RIV_001_CP007_PROJECTED_FACTS_V1.flatMap((fact) => {
  const names = [fact.entity.label.en];
  if (RIVER_VALUE_RELATIONS.has(fact.relation) && fact.value.kind === "entity_ref") names.push(fact.value.label.en);
  return names;
}))]
  .filter((name) => name && !/^River\s+/i.test(name))
  .sort((a, b) => b.length - a.length);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function polishRiverNames(input: string) {
  let output = input;
  for (const name of RIVER_NAMES) {
    const escaped = escapeRegExp(name);
    const pattern = new RegExp(`(?<!River\\s)(?<![A-Za-z])${escaped}(?![A-Za-z])(?!\\s+(?:river\\s+system|system|Basin|basin))`, "g");
    output = output.replace(pattern, `River ${name}`);
  }
  return output.replace(/\bthe River /g, "River ");
}

function polishQuestion(question: GeoRiv001Cp007ReviewQuestion): GeoRiv001Cp007ReviewQuestion {
  const options = question.options.map(polishRiverNames);
  const canonicalAnswer = polishRiverNames(question.canonicalAnswer);
  return {
    ...question,
    questionId: question.questionId.replace("CP007-V3", "CP007-V3P"),
    stem: polishRiverNames(question.stem),
    options,
    canonicalAnswer,
    explanation: polishRiverNames(question.explanation),
    correctIndex: options.indexOf(canonicalAnswer),
  };
}

export const GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED = Object.freeze(
  GEO_RIV_001_CP007_REVIEW_BATCH_V3.map(polishQuestion),
);

function hasBareRiverName(text: string) {
  for (const name of RIVER_NAMES) {
    const escaped = escapeRegExp(name);
    const clean = text
      .replaceAll(`River ${name}`, "")
      .replaceAll(`${name} river system`, "")
      .replaceAll(`${name} system`, "")
      .replaceAll(`${name} Basin`, "")
      .replaceAll(`${name} basin`, "");
    if (new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`).test(clean)) return name;
  }
  return null;
}

export function auditGeoRiv001Cp007ReviewPolishV3() {
  const base = auditGeoRiv001Cp007ReviewBatchV3();
  const issues = [...base.issues];
  const semantics = new Set<string>();
  const positions = [0, 0, 0, 0];

  for (const q of GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED) {
    if (q.correctIndex < 0 || q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`POLISH_ANSWER:${q.questionId}`);
    if (new Set(q.options).size !== 4) issues.push(`POLISH_OPTIONS:${q.questionId}`);
    semantics.add([q.qlId, q.stem, q.canonicalAnswer].join("|"));
    positions[q.correctIndex] += 1;
    for (const visible of [q.stem, ...q.options, q.explanation]) {
      const bare = hasBareRiverName(visible);
      if (bare) issues.push(`BARE_RIVER_NAME:${q.questionId}:${bare}`);
    }
    if (/associated with|matches the reviewed relation|listed among|joining relation|exam trap|shortcut|both banks|neither bank|at near|at below|at west of/i.test(`${q.stem}\n${q.explanation}`)) {
      issues.push(`POLISH_EDITORIAL:${q.questionId}`);
    }
  }

  if (GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED.length !== 60) issues.push(`POLISH_COUNT:${GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED.length}`);
  if (semantics.size !== 60) issues.push(`POLISH_SEMANTICS:${semantics.size}`);
  if (positions.join(",") !== "15,15,15,15") issues.push(`POLISH_POSITIONS:${positions.join(",")}`);

  return { ...base, valid: issues.length === 0, issues, polishedQuestionCount: GEO_RIV_001_CP007_REVIEW_BATCH_V3_POLISHED.length, polishedSemanticUniqueCount: semantics.size, polishedAnswerPositions: positions };
}
