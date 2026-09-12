import { GEO_RIV_001_CP007_PROJECTED_FACTS_V1 } from "./geo-riv-001-cp007-facts";
import { GEO_RIV_001_CP007_REVIEW_BATCH_V2 } from "./geo-riv-001-cp007-review-batch-v2";
import type { GeoRiv001Cp007ReviewQuestion } from "./geo-riv-001-cp007-review-types";

function valueText(fact: (typeof GEO_RIV_001_CP007_PROJECTED_FACTS_V1)[number]) {
  return fact.value.kind === "entity_ref" ? fact.value.label.en : fact.value.kind === "text" ? fact.value.text.en : String(fact.value.kind === "boolean" ? fact.value.value : "");
}

function cp006Fact(tributary: string, parent: string, bank?: "left" | "right") {
  const relation = bank ? `${bank}_bank_tributary_of` : undefined;
  const fact = GEO_RIV_001_CP007_PROJECTED_FACTS_V1.find((candidate) =>
    candidate.tags.includes("upstream:cp006") &&
    candidate.entity.label.en === tributary &&
    valueText(candidate) === parent &&
    (!relation || candidate.relation === relation),
  );
  if (!fact) throw new Error(`Missing projected CP006 relation: ${tributary} -> ${parent}${bank ? ` (${bank})` : ""}`);
  return fact;
}

function upstreamFactId(fact: (typeof GEO_RIV_001_CP007_PROJECTED_FACTS_V1)[number]) {
  return fact.tags.find((tag) => tag.startsWith("upstream-fact:"))?.slice("upstream-fact:".length) ?? "unknown";
}

function custom(base: GeoRiv001Cp007ReviewQuestion, args: {
  stem: string;
  options: string[];
  answer: string;
  explanation: string;
  fact: (typeof GEO_RIV_001_CP007_PROJECTED_FACTS_V1)[number];
}): GeoRiv001Cp007ReviewQuestion {
  const correctIndex = args.options.indexOf(args.answer);
  if (correctIndex < 0 || new Set(args.options).size !== 4) throw new Error(`Bad CP007 V3 custom options for ${base.qlId}`);
  return {
    ...base,
    questionId: base.questionId.replace("CP007-V1", "CP007-V3"),
    stem: args.stem,
    options: args.options,
    correctIndex,
    canonicalAnswer: args.answer,
    explanation: args.explanation,
    sourceIds: [args.fact.source.sourceId],
    sourceFactIds: [args.fact.factId],
    upstreamFactIds: [upstreamFactId(args.fact)],
  };
}

const tawa = cp006Fact("Tawa", "Narmada", "left");
const purna = cp006Fact("Purna", "Tapi", "left");
const anas = cp006Fact("Anas", "Mahi", "left");
const wakal = cp006Fact("Wakal", "Sabarmati", "left");
const hiran = cp006Fact("Hiran", "Narmada", "right");

const replacements: Record<string, (base: GeoRiv001Cp007ReviewQuestion) => GeoRiv001Cp007ReviewQuestion> = {
  "GEO-RIV-001-QL-055": (base) => custom(base, {
    stem: "River Tawa is a tributary of which river?",
    options: ["River Narmada", "River Tapi", "River Mahi", "River Sabarmati"],
    answer: "River Narmada",
    explanation: "River Tawa is a left-bank tributary of River Narmada.",
    fact: tawa,
  }),
  "GEO-RIV-001-QL-056": (base) => custom(base, {
    stem: "Which of the following is a tributary of River Tapi?",
    options: ["River Purna", "River Tawa", "River Anas", "River Wakal"],
    answer: "River Purna",
    explanation: "River Purna is a left-bank tributary of River Tapi.",
    fact: purna,
  }),
  "GEO-RIV-001-QL-059": (base) => custom(base, {
    stem: "Which of the following is a left-bank tributary of River Mahi?",
    options: ["River Anas", "River Som", "River Hiran", "River Gomai"],
    answer: "River Anas",
    explanation: "River Anas is a left-bank tributary of River Mahi.",
    fact: anas,
  }),
  "GEO-RIV-001-QL-060": (base) => custom(base, {
    stem: "Which of the following tributary–parent river pairs is correctly matched?",
    options: ["River Wakal — River Sabarmati", "River Tawa — River Tapi", "River Purna — River Mahi", "River Hiran — River Sabarmati"],
    answer: "River Wakal — River Sabarmati",
    explanation: "River Wakal is a left-bank tributary of River Sabarmati.",
    fact: wakal,
  }),
  "GEO-RIV-001-QL-061": (base) => custom(base, {
    stem: "Which of the following tributary–parent river pairs is incorrectly matched?",
    options: ["River Hiran — River Tapi", "River Tawa — River Narmada", "River Purna — River Tapi", "River Wakal — River Sabarmati"],
    answer: "River Hiran — River Tapi",
    explanation: "River Hiran is a right-bank tributary of River Narmada, not River Tapi.",
    fact: hiran,
  }),
};

const replaced = new Set<string>();
const raw = GEO_RIV_001_CP007_REVIEW_BATCH_V2.map((question) => {
  const make = replacements[question.qlId];
  if (!make || replaced.has(question.qlId)) return { ...question, questionId: question.questionId.replace("CP007-V1", "CP007-V3") };
  replaced.add(question.qlId);
  return make(question);
});

function rebalance(q: GeoRiv001Cp007ReviewQuestion, targetIndex: number): GeoRiv001Cp007ReviewQuestion {
  if (q.correctIndex === targetIndex) return q;
  const options = [...q.options];
  [options[q.correctIndex], options[targetIndex]] = [options[targetIndex], options[q.correctIndex]];
  return { ...q, options, correctIndex: targetIndex };
}

export const GEO_RIV_001_CP007_REVIEW_BATCH_V3: GeoRiv001Cp007ReviewQuestion[] = raw.map((q, index) => rebalance(q, index % 4));

function upstreamTokens(q: GeoRiv001Cp007ReviewQuestion) {
  return [...new Set(q.sourceFactIds.flatMap((id) => {
    const match = id.match(/geo-riv-001-cp007-(cp00[2-6])-/);
    return match ? [match[1]] : [];
  }))];
}

export function auditGeoRiv001Cp007ReviewBatchV3() {
  const issues: string[] = [];
  const qlCounts: Record<string, number> = {};
  const upstreamCounts: Record<string, number> = {};
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const semantics = new Set<string>();
  const banned = /associated with|matches the reviewed relation|listed among|joining relation|exam trap|shortcut|both banks|neither bank|at near|at below|at west of/i;

  for (const q of GEO_RIV_001_CP007_REVIEW_BATCH_V3) {
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    semantics.add([q.qlId, q.stem, q.canonicalAnswer].join("|"));
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push(`BAD_OPTIONS:${q.questionId}`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`ANSWER_MISMATCH:${q.questionId}`);
    if (!q.sourceIds.length || !q.sourceFactIds.length || !q.upstreamFactIds.length || q.upstreamFactIds.includes("unknown")) issues.push(`BAD_PROVENANCE:${q.questionId}`);
    if (banned.test(`${q.stem}\n${q.explanation}`)) issues.push(`EDITORIAL:${q.questionId}`);
    for (const token of upstreamTokens(q)) upstreamCounts[token] = (upstreamCounts[token] ?? 0) + 1;
  }

  if (GEO_RIV_001_CP007_REVIEW_BATCH_V3.length !== 60) issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP007_REVIEW_BATCH_V3.length}`);
  if (semantics.size !== 60) issues.push(`SEMANTIC_UNIQUENESS:${semantics.size}`);
  if (answerPositions.join(",") !== "15,15,15,15") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  for (const token of ["cp002", "cp003", "cp004", "cp005", "cp006"]) if (!upstreamCounts[token]) issues.push(`MISSING_UPSTREAM:${token}`);
  if ((upstreamCounts.cp006 ?? 0) < 5) issues.push(`CP006_REVIEW_COVERAGE:${upstreamCounts.cp006 ?? 0}`);
  for (const [ql, count] of Object.entries({"GEO-RIV-001-QL-055":8,"GEO-RIV-001-QL-056":7,"GEO-RIV-001-QL-057":7,"GEO-RIV-001-QL-058":6,"GEO-RIV-001-QL-059":7,"GEO-RIV-001-QL-060":6,"GEO-RIV-001-QL-061":6,"GEO-RIV-001-QL-062":5,"GEO-RIV-001-QL-063":4,"GEO-RIV-001-QL-064":4})) if (qlCounts[ql] !== count) issues.push(`QL_COUNT:${ql}:${qlCounts[ql] ?? 0}`);
  if (difficultyCounts.Easy !== 15 || difficultyCounts.Medium !== 36 || difficultyCounts.Hard !== 9) issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);

  return { valid: issues.length === 0, issues, questionCount: GEO_RIV_001_CP007_REVIEW_BATCH_V3.length, semanticUniqueCount: semantics.size, qlCounts, difficultyCounts, answerPositions, upstreamCounts };
}
