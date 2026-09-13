import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateStat002Question, STAT002_CONTRACTS } from "./standard-deviation";
import type { Stat002ExamProfile, Stat002Question, Stat002State } from "./types";

const profiles: readonly Stat002ExamProfile[] = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"];
const lines: string[] = [
  "# STAT-002 — Standard Deviation — English Review Pack P0",
  "",
  "Lifecycle: review only. No permanent QLs, Question Studio registration, Question Bank write, test/mock eligibility or publication is authorized by this artifact.",
  "",
];

function normalizeStem(stem: string) {
  return stem
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/(?:#,\s*){2,}#/g, "DATA")
    .replace(/\s+/g, " ")
    .trim();
}

function stateSignature(state: Stat002State) {
  if (state.kind === "RAW_POPULATION_SD") {
    return JSON.stringify({ ...state, values: [...state.values].sort((a, b) => a - b) });
  }
  if (state.kind === "TRANSLATED_DATA") {
    return JSON.stringify({ ...state, values: [...state.values].sort((a, b) => a - b) });
  }
  if (state.kind === "SCALED_DATA") {
    return JSON.stringify({ ...state, values: [...state.values].sort((a, b) => a - b) });
  }
  if (state.kind === "AFFINE_FROM_MOMENTS") {
    return JSON.stringify({
      kind: state.kind,
      mean: state.mean,
      meanOfSquares: state.meanOfSquares,
      multiplier: state.multiplier,
    });
  }
  return JSON.stringify(state);
}

function selectReviewSamples(profile: Stat002ExamProfile, contractId: (typeof STAT002_CONTRACTS)[number]) {
  const selected: Stat002Question[] = [];
  const states = new Set<string>();
  const structures = new Set<string>();
  const answers = new Set<string>();
  for (let candidate = 1; candidate <= 500 && selected.length < 3; candidate += 1) {
    const question = generateStat002Question({
      seed: `STAT-002-REVIEW-${profile}-${contractId}-${candidate}`,
      examProfile: profile,
      contractId,
    });
    const stateKey = stateSignature(question.state);
    const structureKey = normalizeStem(question.stem);
    if (states.has(stateKey) || structures.has(structureKey) || answers.has(question.answer)) continue;
    states.add(stateKey);
    structures.add(structureKey);
    answers.add(question.answer);
    selected.push(question);
  }
  if (selected.length !== 3) {
    throw new Error(`${profile}:${contractId} could not produce three structurally distinct review samples with distinct core states and answers.`);
  }
  return selected;
}

let ordinal = 1;
for (const profile of profiles) {
  lines.push(`## ${profile}`, "");
  for (const contractId of STAT002_CONTRACTS) {
    lines.push(`### ${contractId}`, "");
    for (const question of selectReviewSamples(profile, contractId)) {
      lines.push(`#### Q${ordinal}. ${question.difficulty}`, "");
      lines.push(question.stem, "");
      question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
      lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`, "");
      lines.push(`**Explanation:** ${question.explanation.keyIdea}`, "");
      question.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
      lines.push("");
      ordinal += 1;
    }
  }
}

const outputPath = resolve(process.argv[2] ?? "STAT-002-REVIEW-P0.md");
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_STAT_002_REVIEW_P0", outputPath, questions: ordinal - 1 }));
