import fs from "node:fs";
import path from "node:path";
import {
  INT_CP007_ENGLISH_VERSION,
  INT_CP007_ENGLISH_V2_SUPERSEDES,
  generateIntCp007EnglishQuestion,
} from "./cp007-scheme-equivalence-english-v2";
import { INT_CP007_QL_CONTRACTS, INT_CP007_QL_IDS, type IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

function findSeeds(qlId: IntCp007QlId): readonly string[] {
  const byFamily = new Map<string, string>();
  let extra: string | undefined;
  for (let index = 0; index < 10000; index += 1) {
    const seed = `int-cp007-en-v2-review-${qlId}-${index}`;
    const question = generateIntCp007EnglishQuestion(qlId, seed);
    if (!byFamily.has(question.presentation.stemFamilyId)) byFamily.set(question.presentation.stemFamilyId, seed);
    else if (!extra && question.presentation.stemFamilyId === `${qlId}-T1`) extra = seed;
    if (byFamily.size === 3 && extra) break;
  }
  const seeds = [`${qlId}-T1`, `${qlId}-T2`, `${qlId}-T3`].map((family) => byFamily.get(family));
  if (seeds.some((seed) => !seed) || !extra) throw new Error(`${qlId}: failed to collect complete V2 review seed set`);
  return Object.freeze([seeds[0]!, seeds[1]!, seeds[2]!, extra]);
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
output.push("# INT-CP-007 — English Product Review V2");
output.push("");
output.push(`Current English candidate: **${INT_CP007_ENGLISH_VERSION}**`);
output.push(`Supersedes failed candidate: **${INT_CP007_ENGLISH_V2_SUPERSEDES}**.`);
output.push("");
output.push("V2 preserves all permanent mathematics and learner wording from V1 except the QL113 distractor construction. QL113 now uses three guaranteed-distinct misconceptions that independently fail the permanent verifier.");
output.push("");
output.push("Permanent QLs: **INT-QL-109..INT-QL-115 (7 contracts)**. The file samples all three authored stem families for every QL plus one additional deterministic state, for **28 complete learner-facing questions**.");
output.push("");
output.push("Explanations show what is asked, what is given, the accumulation/equality relation, numerical substitution, arithmetic and the final conclusion.");
output.push("");
output.push("Status: **PRODUCT REVIEW ONLY**. Permanent QL identity is frozen, but English learner content is not frozen. Hindi/Punjabi localization, Question Studio activation, registration, Question Bank storage, test eligibility and public delivery remain closed.");
output.push("");

let reviewQuestions = 0;
for (const qlId of INT_CP007_QL_IDS) {
  const contract = INT_CP007_QL_CONTRACTS[qlId];
  output.push(`## ${qlId} — ${contract.title}`);
  output.push("");
  output.push(`Contract: ${contract.givenUnknown}`);
  output.push("");
  const seeds = findSeeds(qlId);
  seeds.forEach((seed, index) => {
    output.push(renderQuestion(qlId, seed, index + 1));
    reviewQuestions += 1;
  });
}

const outputDirectory = path.resolve(process.cwd(), "dist/quant-v4");
fs.mkdirSync(outputDirectory, { recursive: true });
const outputPath = path.join(outputDirectory, "INT-CP-007-ENGLISH-V2-REVIEW.md");
fs.writeFileSync(outputPath, `${output.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, qls: INT_CP007_QL_IDS.length, reviewQuestions }, null, 2));
console.log("PASS_INT_CP007_ENGLISH_V2_REVIEW_EXPORT");
