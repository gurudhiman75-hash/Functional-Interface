import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { rational, terminatingDecimal } from "../wave01/exact";
import { generateNumCp002Wave02Authority } from "./authority";
import { independentlyVerifyNumCp002Wave02 } from "./runtime";
import { NUM_CP002_WAVE02_PROTOTYPE_IDS } from "./types";
import { NUM_CP002_WAVE02_STATUS } from "./source-registry";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function independentNines(recurring: string): string {
  const match = recurring.match(/^(\d+)\.(\d+)\\overline\{9\}$/u);
  if (!match) throw new Error(`Cannot parse repeating-nine fixture: ${recurring}`);
  const whole = Number(match[1]);
  const prefix = String(match[2]);
  const scale = 10 ** prefix.length;
  const exact = rational(whole * scale + Number(prefix) + 1, scale);
  return `\\(${terminatingDecimal(exact)}\\)`;
}
function verify(id: (typeof NUM_CP002_WAVE02_PROTOTYPE_IDS)[number], hidden: Readonly<Record<string, unknown>>): string {
  if (id === "NUM-CP002-PROT-022") return independentNines(String((hidden as any).recurring));
  return independentlyVerifyNumCp002Wave02(id, hidden);
}

const rawSlashFraction = /(?<!\\frac\{)\b\d+\/\d+\b/u;
const unicodeMath = /[√²³]/u;
const jargon = /\b(?:admissible|topology|candidate-set|residue condition|universal guarantee|sharpness|Strategy|Exam Speed|Common Traps?)\b/iu;
const internal = /NUM-CP|NUM-QL|PROT-|solveMode|proposalId/iu;
const review: any[] = [];
const answerPositions = new Map<string, Set<number>>();
const difficultyCounts = { EASY: 0, MEDIUM: 0, HARD: 0 };
let generated = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let countVsSetDistinct = 0;
let repeatingNineChecks = 0;

for (const id of NUM_CP002_WAVE02_PROTOTYPE_IDS) {
  answerPositions.set(id, new Set());
  for (let seed = 0; seed < 100; seed += 1) {
    const q = generateNumCp002Wave02Authority(id, seed);
    const replay = generateNumCp002Wave02Authority(id, seed);
    generated += 1;
    assert(JSON.stringify(q) === JSON.stringify(replay), `${id}/${seed}: replay mismatch`);
    replayChecks += 1;

    const independentlyVerified = verify(id, q.hiddenState);
    assert(independentlyVerified === q.canonicalAnswer, `${id}/${seed}: independent verifier ${independentlyVerified} != ${q.canonicalAnswer}`);
    assert(q.verifierAnswer === q.canonicalAnswer, `${id}/${seed}: package verifier mismatch`);
    verifierChecks += 1;

    assert(q.options.length === 4 && new Set(q.options.map((o) => o.value)).size === 4, `${id}/${seed}: option integrity`);
    assert(q.options.filter((o) => o.isCorrect).length === 1, `${id}/${seed}: one-correct integrity`);
    assert(q.options[q.correctIndex]?.value === q.canonicalAnswer, `${id}/${seed}: correct index`);
    optionChecks += 1;

    assert(q.permanentQlId === null && q.lifecycle.permanentQlId === null, `${id}/${seed}: premature permanent QL`);
    assert(!q.lifecycle.active && !q.lifecycle.questionStudioDiscoverable && !q.lifecycle.questionBankWritable, `${id}/${seed}: delivery lifecycle opened`);
    assert(q.lifecycle.questionBankStatus === "NOT_STORED" && !q.lifecycle.testEligible && q.lifecycle.testEligibility === "INELIGIBLE" && !q.lifecycle.publiclyPublishable, `${id}/${seed}: downstream lifecycle opened`);
    lifecycleChecks += 1;

    const learner = [q.stem, ...q.options.map((o) => o.value), q.explanation.concept ?? "", ...q.explanation.solution, q.explanation.finalAnswer].join("\n");
    assert(!rawSlashFraction.test(learner), `${id}/${seed}: raw slash fraction`);
    assert(!unicodeMath.test(learner), `${id}/${seed}: unicode math`);
    assert(!jargon.test(learner), `${id}/${seed}: learner jargon/clutter`);
    assert(!internal.test(learner), `${id}/${seed}: internal identity leak`);
    assert(q.explanation.solution.length >= 1 && q.explanation.solution.length <= 3, `${id}/${seed}: explanation not concise`);
    assert(q.sourceAncestry.length >= 3, `${id}/${seed}: source ancestry incomplete`);

    answerPositions.get(id)!.add(q.correctIndex);
    difficultyCounts[q.difficulty] += 1;
    if (seed < 4) review.push(q);

    if (id === "NUM-CP002-PROT-017" || id === "NUM-CP002-PROT-018") countVsSetDistinct += 1;
    if (id === "NUM-CP002-PROT-022") repeatingNineChecks += 1;
  }
}

assert(generated === 1000, `Wave02 generated ${generated}`);
assert(replayChecks === generated && verifierChecks === generated && optionChecks === generated && lifecycleChecks === generated, "Wave02 proof count mismatch");
for (const id of NUM_CP002_WAVE02_PROTOTYPE_IDS) {
  assert(JSON.stringify([...answerPositions.get(id)!].sort()) === JSON.stringify([0,1,2,3]), `${id}: answer positions not fully reachable`);
}
assert(difficultyCounts.EASY > 0 && difficultyCounts.MEDIUM > 0 && difficultyCounts.HARD > 0, `Wave02 difficulty bands missing ${JSON.stringify(difficultyCounts)}`);
assert(countVsSetDistinct === 200, "count/set families not both executed");
assert(repeatingNineChecks === 100, "repeating-nine equivalence not swept");
assert(NUM_CP002_WAVE02_STATUS.sourceSaturated === false && NUM_CP002_WAVE02_STATUS.permanentQlCount === 0, "Wave02 overclaims maturity");
assert(NUM_CP002_WAVE02_STATUS.questionStudioDiscoverable === false, "Wave02 Question Studio opened");

const outDir = resolve(process.cwd(), "dist/quant-v4/num-cp002-wave02");
mkdirSync(outDir, { recursive: true });
const jsonPath = resolve(outDir, "num-cp002-wave02-review.json");
const mdPath = resolve(outDir, "num-cp002-wave02-review.md");
writeFileSync(jsonPath, JSON.stringify({
  status: "NUM_CP002_WAVE02_EXECUTABLE_DISCOVERY_PROOF",
  temporaryPrototypeCount: NUM_CP002_WAVE02_PROTOTYPE_IDS.length,
  cumulativeTemporaryPrototypeCount: NUM_CP002_WAVE02_STATUS.cumulativeTemporaryPrototypeCount,
  generated, difficultyCounts, sourceSaturated: false, permanentQlCount: 0,
  questionStudioDiscoverable: false, samples: review,
}, null, 2));
writeFileSync(mdPath, [
  "# NUM-CP-002 Wave 02 — Inverse/Structure Review", "",
  "10 temporary inverse/structure prototypes × 4 review questions = 40 questions. No permanent QL allocation or delivery registration is authorized.", "",
  ...review.flatMap((q) => [
    `## ${q.temporaryPrototypeId} · ${q.difficulty} · seed ${q.seed}`, "", q.stem, "",
    ...q.options.map((o: any, i: number) => `${String.fromCharCode(65+i)}. ${o.value}${i === q.correctIndex ? " **[Correct]**" : ""}`),
    "", ...(q.explanation.concept ? [`**Concept:** ${q.explanation.concept}`, ""] : []), "**Solution:**",
    ...q.explanation.solution.map((line: string) => `- ${line}`), "", `**Answer:** ${q.explanation.finalAnswer}`, "",
  ]),
].join("\n"));
console.log(JSON.stringify({
  status: "PASS_NUM_CP002_WAVE02", generated, temporaryPrototypeCount: NUM_CP002_WAVE02_PROTOTYPE_IDS.length,
  cumulativeTemporaryPrototypeCount: NUM_CP002_WAVE02_STATUS.cumulativeTemporaryPrototypeCount,
  replayChecks, verifierChecks, optionChecks, lifecycleChecks, difficultyCounts,
  answerPositions: Object.fromEntries([...answerPositions].map(([id, positions]) => [id, [...positions].sort()])),
  reviewQuestionCount: review.length, jsonPath, mdPath,
}, null, 2));
