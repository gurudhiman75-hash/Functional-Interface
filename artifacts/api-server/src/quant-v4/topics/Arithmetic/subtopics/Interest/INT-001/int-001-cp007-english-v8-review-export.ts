import fs from "node:fs";
import path from "node:path";
import {
  INT_CP007_ENGLISH_VERSION,
  INT_CP007_ENGLISH_V8_SUPERSEDES,
  generateIntCp007EnglishQuestion,
} from "./cp007-scheme-equivalence-english-v8";
import { INT_CP007_QL_CONTRACTS, INT_CP007_QL_IDS, type IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

function learnerContentKey(question: ReturnType<typeof generateIntCp007EnglishQuestion>): string {
  return JSON.stringify({
    stem: question.presentation.markdown,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  });
}

function findSeeds(qlId: IntCp007QlId): readonly string[] {
  const byFamily = new Map<string, string>();
  for (let index = 0; index < 10000 && byFamily.size < 3; index += 1) {
    const seed = `int-cp007-en-v8-review-${qlId}-${index}`;
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    if (!byFamily.has(question.presentation.stemFamilyId)) byFamily.set(question.presentation.stemFamilyId, seed);
  }

  const primary = [`${qlId}-T1`, `${qlId}-T2`, `${qlId}-T3`].map((family) => byFamily.get(family));
  if (primary.some((seed) => !seed)) throw new Error(`${qlId}: failed to collect all three V8 stem families`);

  const selected = primary.map((seed) => seed!);
  const selectedKeys = new Set(selected.map((seed) => learnerContentKey(generateIntCp007EnglishQuestion(qlId, seed))));
  let extra: string | undefined;
  for (let index = 0; index < 20000; index += 1) {
    const seed = `int-cp007-en-v8-review-${qlId}-${index}`;
    if (selected.includes(seed)) continue;
    const key = learnerContentKey(generateIntCp007EnglishQuestion(qlId, seed));
    if (!selectedKeys.has(key)) {
      extra = seed;
      break;
    }
  }
  if (!extra) throw new Error(`${qlId}: failed to find a fourth meaningfully distinct V8 learner surface`);
  return Object.freeze([...selected, extra]);
}

function renderQuestion(qlId: IntCp007QlId, seed: string, reviewNumber: number): string {
  const question = generateIntCp007EnglishQuestion(qlId, seed);
  const lines: string[] = [];
  lines.push(`### Review ${reviewNumber} — ${question.presentation.stemFamilyId} — seed \`${seed}\``);
  lines.push("");
  lines.push(`**Question:** ${question.presentation.markdown}`);
  lines.push("");
  lines.push("**Options:**");
  question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option.text}${index === question.correctIndex ? " **✓**" : ""}`));
  lines.push("");
  lines.push(`**Correct answer:** ${question.correctAnswer}`);
  lines.push("");
  lines.push(`**Approach:** ${question.explanation.keyIdea}`);
  lines.push("");
  lines.push("**Calculation:**");
  question.explanation.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
  lines.push("");
  lines.push(`**Final answer:** ${question.explanation.finalAnswer}`);
  lines.push("");
  lines.push(`**Common mistake:** ${question.explanation.commonMistake}`);
  lines.push("");
  return lines.join("\n");
}

const output: string[] = [];
output.push("# INT-CP-007 — English Product Review V8 — Exam Editorial Polish");
output.push("");
output.push(`Current English candidate: **${INT_CP007_ENGLISH_VERSION}**`);
output.push(`Supersedes: **${INT_CP007_ENGLISH_V8_SUPERSEDES}**.`);
output.push("");
output.push("V8 is a prose-only exam-readiness overlay over V7. It keeps every mathematical state, option, answer, LaTeX segment and lifecycle field unchanged while replacing repeated technical/generated phrasing with concise candidate-facing English.");
output.push("");
output.push("Permanent QLs: **INT-QL-109..INT-QL-115 (7 contracts)**. The review includes all three authored stem families for every QL plus one additional meaningfully distinct learner-content surface, for **28 complete review questions**.");
output.push("");
output.push("Status: **PRODUCT REVIEW ONLY**. Permanent QL identity is frozen, but English learner content is not frozen. Hindi/Punjabi localization, Question Studio activation, registration, Question Bank storage, test eligibility and public delivery remain closed.");
output.push("");

let reviewQuestions = 0;
const globalSurfaces = new Set<string>();
for (const qlId of INT_CP007_QL_IDS) {
  const contract = INT_CP007_QL_CONTRACTS[qlId];
  output.push(`## ${qlId} — ${contract.title}`);
  output.push("");
  output.push(`Contract: ${contract.givenUnknown}`);
  output.push("");
  const seeds = findSeeds(qlId);
  seeds.forEach((seed, index) => {
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    const key = learnerContentKey(question);
    if (globalSurfaces.has(key)) throw new Error(`${qlId}/${seed}: duplicate meaningful learner surface entered V8 review`);
    globalSurfaces.add(key);
    output.push(renderQuestion(qlId, seed, index + 1));
    reviewQuestions += 1;
  });
}

if (reviewQuestions !== 28 || globalSurfaces.size !== 28) {
  throw new Error(`expected 28 meaningfully distinct V8 review surfaces, got questions=${reviewQuestions}, unique=${globalSurfaces.size}`);
}

const outputDirectory = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDirectory, { recursive: true });
const outputPath = path.join(outputDirectory, "INT-CP-007-ENGLISH-V8-EXAM-EDITORIAL-REVIEW.md");
fs.writeFileSync(outputPath, `${output.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, qls: INT_CP007_QL_IDS.length, reviewQuestions, uniqueSurfaces: globalSurfaces.size }, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V8_EXAM_EDITORIAL_REVIEW_EXPORT");
