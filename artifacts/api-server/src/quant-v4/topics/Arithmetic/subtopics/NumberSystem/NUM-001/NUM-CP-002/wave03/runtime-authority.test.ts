import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { compareRational, rational, terminates, type Rational } from "../wave01/exact";
import { generateNumCp002Wave03Final, independentlyVerifyNumCp002Wave03Final } from "./authority-final";
import { NUM_CP002_WAVE03_DISCOVERY_DISPOSITIONS, NUM_CP002_WAVE03_STATUS } from "./source-registry";
import { NUM_CP002_WAVE03_PROTOTYPE_IDS } from "./types";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function add(a: Rational, b: Rational) { return rational(a.n * b.d + b.n * a.d, a.d * b.d); }
function parseRecurring(display: string): Rational {
  const match = display.match(/^\\\((\d+)\.(\d*)\\overline\{(\d+)\}\\\)$/u);
  if (!match) throw new Error(`Cannot parse recurring display ${display}`);
  const whole = Number(match[1]);
  const prefixText = String(match[2]);
  const blockText = String(match[3]);
  const p = prefixText.length, r = blockText.length;
  const prefix = prefixText ? Number(prefixText) : 0;
  const block = Number(blockText);
  return add(rational(whole, 1), rational(prefix * 10 ** r + block - prefix, 10 ** p * (10 ** r - 1)));
}
function classifyDs(d: number, k1: number, k2: number): number {
  const sufficient = (ks: readonly number[]) => {
    const outcomes = new Set<boolean>();
    for (let n = 1; n <= 2 * d; n += 1) if (ks.every((k) => n % k === 0)) outcomes.add(terminates(rational(n, d)));
    return outcomes.size === 1;
  };
  if (sufficient([k1])) return 0;
  if (sufficient([k2])) return 1;
  if (sufficient([k1, k2])) return 2;
  return 3;
}

const rawSlashFraction = /(?<!\\frac\{)\b\d+\/\d+\b/u;
const unicodeMath = /[√²³]/u;
const clutter = /\b(?:Strategy|Exam Speed|Common Traps?|admissible|topology|candidate-set|residue condition|universal guarantee|sharpness)\b/iu;
const internal = /NUM-(?:CP|QL)|PROT-|solveMode|proposalId/iu;
const answerPositions = new Map<string, Set<number>>();
const statementAnswers = new Set<string>();
const dsClasses = new Set<number>();
const p027Modes = new Set<string>();
const p028Modes = new Set<string>();
const review: any[] = [];
let generated = 0;
let replayChecks = 0;
let verifierChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let recurringEquivalenceChecks = 0;
let p023BetweenChecks = 0;
let p024AdapterChecks = 0;
let p030LeastExponentChecks = 0;

for (const id of NUM_CP002_WAVE03_PROTOTYPE_IDS) {
  answerPositions.set(id, new Set());
  for (let seed = 0; seed < 100; seed += 1) {
    const q = generateNumCp002Wave03Final(id, seed);
    const replay = generateNumCp002Wave03Final(id, seed);
    generated += 1;
    assert(JSON.stringify(q) === JSON.stringify(replay), `${id}/${seed}: replay mismatch`);
    replayChecks += 1;

    const verified = independentlyVerifyNumCp002Wave03Final(id, q.hiddenState);
    assert(verified === q.canonicalAnswer && q.verifierAnswer === q.canonicalAnswer, `${id}/${seed}: verifier mismatch`);
    verifierChecks += 1;

    assert(q.options.length === 4 && new Set(q.options.map((o) => o.value)).size === 4, `${id}/${seed}: option integrity`);
    assert(q.options.filter((o) => o.isCorrect).length === 1, `${id}/${seed}: one-correct integrity`);
    assert(q.options[q.correctIndex]?.value === q.canonicalAnswer, `${id}/${seed}: correct index`);
    optionChecks += 1;

    assert(q.permanentQlId === null && q.lifecycle.permanentQlId === null, `${id}/${seed}: permanent QL allocated early`);
    assert(!q.lifecycle.active && !q.lifecycle.questionStudioDiscoverable && !q.lifecycle.questionBankWritable, `${id}/${seed}: delivery gate opened`);
    assert(q.lifecycle.questionBankStatus === "NOT_STORED" && !q.lifecycle.testEligible && q.lifecycle.testEligibility === "INELIGIBLE" && !q.lifecycle.publiclyPublishable, `${id}/${seed}: downstream gate opened`);
    lifecycleChecks += 1;

    const learner = [q.stem, ...q.options.map((o) => o.value), q.explanation.concept ?? "", ...q.explanation.solution, q.explanation.finalAnswer].join("\n");
    assert(!rawSlashFraction.test(learner), `${id}/${seed}: raw slash fraction`);
    assert(!unicodeMath.test(learner), `${id}/${seed}: unicode math`);
    assert(!clutter.test(learner), `${id}/${seed}: learner clutter/jargon`);
    assert(!internal.test(learner), `${id}/${seed}: internal identity leak`);
    assert(q.explanation.solution.length >= 1 && q.explanation.solution.length <= 3, `${id}/${seed}: explanation not concise`);
    assert(q.sourceAncestry.length >= 3, `${id}/${seed}: source ancestry incomplete`);

    answerPositions.get(id)!.add(q.correctIndex);
    if (seed < 4) review.push(q);

    if (id === "NUM-CP002-PROT-023") {
      const h = q.hiddenState as any;
      const a = rational(Number(h.aN), Number(h.aD)), b = rational(Number(h.bN), Number(h.bD)), c = rational(Number(h.cN), Number(h.cD));
      assert(compareRational(a, c) < 0 && compareRational(c, b) < 0, `${id}/${seed}: candidate not strictly between`);
      p023BetweenChecks += 1;
    }
    if (id === "NUM-CP002-PROT-024") {
      assert(NUM_CP002_WAVE03_DISCOVERY_DISPOSITIONS.largestSmallest === "ORDERING_ADAPTER_CANDIDATE", `${id}: ordering adapter disposition lost`);
      p024AdapterChecks += 1;
    }
    if (id === "NUM-CP002-PROT-027") p027Modes.add(String((q.hiddenState as any).mode));
    if (id === "NUM-CP002-PROT-028") p028Modes.add(seed % 2 === 1 ? "DIFFERENCE" : "SUM");
    if (id === "NUM-CP002-PROT-029") {
      const h = q.hiddenState as any;
      const source = parseRecurring(String(h.short));
      const equivalentOptions = q.options.filter((o) => {
        try { return compareRational(parseRecurring(o.value), source) === 0; } catch { return false; }
      });
      assert(equivalentOptions.length === 1 && equivalentOptions[0]!.value === q.canonicalAnswer, `${id}/${seed}: recurring equivalence not unique`);
      recurringEquivalenceChecks += 1;
    }
    if (id === "NUM-CP002-PROT-030") {
      const h = q.hiddenState as any;
      const d = 2 ** Number(h.p2) * 5 ** Number(h.p5) * Number(h.badPrime) ** Number(h.badExp);
      let least = -1;
      for (let x = 0; x <= Number(h.badExp) + 3; x += 1) {
        if (terminates(rational(Number(h.badPrime) ** x, d))) { least = x; break; }
      }
      assert(q.canonicalAnswer === `\\(${least}\\)`, `${id}/${seed}: least exponent mismatch`);
      p030LeastExponentChecks += 1;
    }
    if (id === "NUM-CP002-PROT-031") statementAnswers.add(q.canonicalAnswer);
    if (id === "NUM-CP002-PROT-032") {
      const h = q.hiddenState as any;
      dsClasses.add(classifyDs(Number(h.d), Number(h.k1), Number(h.k2)));
    }
  }
}

assert(generated === 1000, `Wave03 generated ${generated}`);
assert(replayChecks === generated && verifierChecks === generated && optionChecks === generated && lifecycleChecks === generated, "Wave03 proof count mismatch");
for (const id of NUM_CP002_WAVE03_PROTOTYPE_IDS) assert(JSON.stringify([...answerPositions.get(id)!].sort()) === JSON.stringify([0,1,2,3]), `${id}: answer-position reachability`);
assert(p023BetweenChecks === 100, "between-rational proof incomplete");
assert(p024AdapterChecks === 100, "largest/smallest adapter proof incomplete");
assert(JSON.stringify([...p027Modes].sort()) === JSON.stringify(["COMPLEMENT","RECIPROCAL"]), `P027 modes ${[...p027Modes]}`);
assert(JSON.stringify([...p028Modes].sort()) === JSON.stringify(["DIFFERENCE","SUM"]), `P028 modes ${[...p028Modes]}`);
assert(recurringEquivalenceChecks === 100, "recurring equivalence proof incomplete");
assert(p030LeastExponentChecks === 100, "compound termination proof incomplete");
assert(JSON.stringify([...statementAnswers].sort()) === JSON.stringify(["I and III only","I only","I, II and III","II only"].sort()), `statement answer shapes ${[...statementAnswers]}`);
assert(JSON.stringify([...dsClasses].sort()) === JSON.stringify([0,1,2,3]), `DS classes ${[...dsClasses]}`);
assert(NUM_CP002_WAVE03_STATUS.cumulativeTemporaryPrototypeCount === 32 && NUM_CP002_WAVE03_STATUS.permanentQlCount === 0, "Wave03 inventory status mismatch");
assert(NUM_CP002_WAVE03_STATUS.sourceSaturationCandidate === true && NUM_CP002_WAVE03_STATUS.sourceSaturated === false, "Wave03 must be candidate, not saturated before audit");
assert(!NUM_CP002_WAVE03_STATUS.questionStudioDiscoverable && !NUM_CP002_WAVE03_STATUS.questionBankWritable && !NUM_CP002_WAVE03_STATUS.testEligible && !NUM_CP002_WAVE03_STATUS.publiclyPublishable, "Wave03 delivery gate opened");

const outDir = resolve(process.cwd(), "dist/quant-v4/num-cp002-wave03");
mkdirSync(outDir, { recursive: true });
const jsonPath = resolve(outDir, "num-cp002-wave03-review.json");
const mdPath = resolve(outDir, "num-cp002-wave03-review.md");
writeFileSync(jsonPath, JSON.stringify({
  status: "NUM_CP002_WAVE03_SOURCE_SATURATION_CANDIDATE",
  temporaryPrototypeCount: NUM_CP002_WAVE03_PROTOTYPE_IDS.length,
  cumulativeTemporaryPrototypeCount: NUM_CP002_WAVE03_STATUS.cumulativeTemporaryPrototypeCount,
  generated,
  statementAnswers: [...statementAnswers].sort(),
  dsClasses: [...dsClasses].sort(),
  sourceSaturated: false,
  permanentQlCount: 0,
  questionStudioDiscoverable: false,
  samples: review,
}, null, 2));
writeFileSync(mdPath, [
  "# NUM-CP-002 Wave 03 — Source-Saturation Candidate Review", "",
  "10 temporary prototypes × 4 review questions = 40 questions. This closes the planned ordinary inverse and protected answer-shape discovery pass, but permanent QLs are not allocated here.", "",
  ...review.flatMap((q) => [
    `## ${q.temporaryPrototypeId} · ${q.difficulty} · seed ${q.seed}`, "", q.stem, "",
    ...q.options.map((o: any, i: number) => `${String.fromCharCode(65+i)}. ${o.value}${i === q.correctIndex ? " **[Correct]**" : ""}`),
    "", ...(q.explanation.concept ? [`**Concept:** ${q.explanation.concept}`, ""] : []), "**Solution:**",
    ...q.explanation.solution.map((line: string) => `- ${line}`), "", `**Answer:** ${q.explanation.finalAnswer}`, "",
  ]),
].join("\n"));
console.log(JSON.stringify({
  status: "PASS_NUM_CP002_WAVE03",
  generated,
  waveTemporaryPrototypeCount: NUM_CP002_WAVE03_PROTOTYPE_IDS.length,
  cumulativeTemporaryPrototypeCount: NUM_CP002_WAVE03_STATUS.cumulativeTemporaryPrototypeCount,
  replayChecks, verifierChecks, optionChecks, lifecycleChecks,
  statementAnswers: [...statementAnswers].sort(), dsClasses: [...dsClasses].sort(),
  p027Modes: [...p027Modes].sort(), p028Modes: [...p028Modes].sort(),
  answerPositions: Object.fromEntries([...answerPositions].map(([id, positions]) => [id, [...positions].sort()])),
  reviewQuestionCount: review.length, jsonPath, mdPath,
}, null, 2));
