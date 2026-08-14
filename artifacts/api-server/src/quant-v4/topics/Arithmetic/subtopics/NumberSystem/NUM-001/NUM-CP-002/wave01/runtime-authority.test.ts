import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NUM_CP002_WAVE01_PROTOTYPE_IDS } from "./types";
import { generateNumCp002Wave01Authority } from "./authority";
import { independentlyVerifyNumCp002Wave01 } from "./runtime";
import { NUM_CP002_LEGACY_OWNERSHIP_DISPOSITION, NUM_CP002_WAVE01_DISCOVERY_STATUS } from "./source-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const mathOpen = /\\\(/u;
const rawFraction = /(?<!\\frac\{)\b\d+\/\d+\b/u;
const unicodeMath = /[√²³]/u;
const bannedClutter = /\b(?:Strategy|Exam Speed|Common Traps?|admissible|topology|candidate-set|residue condition)\b/iu;
const answerPositions = new Map<string, Set<number>>();
const difficultyReach = new Map<string, Set<string>>();
const review: any[] = [];
const fingerprints = new Set<string>();
let generated = 0;
let verifierChecks = 0;
let replayChecks = 0;
let optionChecks = 0;
let lifecycleChecks = 0;
let repeatingNinesSeen = 0;
let reductionBeforeTerminationSeen = 0;

for (const prototypeId of NUM_CP002_WAVE01_PROTOTYPE_IDS) {
  answerPositions.set(prototypeId, new Set());
  difficultyReach.set(prototypeId, new Set());
  for (let seed = 0; seed < 120; seed += 1) {
    const q = generateNumCp002Wave01Authority(prototypeId, seed);
    const replay = generateNumCp002Wave01Authority(prototypeId, seed);
    generated += 1;
    assert(JSON.stringify(q) === JSON.stringify(replay), `${prototypeId}/${seed}: deterministic replay`);
    replayChecks += 1;

    const verifier = independentlyVerifyNumCp002Wave01(prototypeId, q.hiddenState);
    assert(verifier === q.canonicalAnswer && q.verifierAnswer === q.canonicalAnswer, `${prototypeId}/${seed}: verifier disagreement`);
    verifierChecks += 1;

    assert(q.options.length === 4, `${prototypeId}/${seed}: option count`);
    assert(new Set(q.options.map((x) => x.value)).size === 4, `${prototypeId}/${seed}: duplicate option`);
    assert(q.options.filter((x) => x.isCorrect).length === 1, `${prototypeId}/${seed}: correct-option cardinality`);
    assert(q.options[q.correctIndex]?.value === q.canonicalAnswer, `${prototypeId}/${seed}: answer index`);
    optionChecks += 1;

    assert(q.permanentQlId === null && q.lifecycle.permanentQlId === null, `${prototypeId}/${seed}: premature QL allocation`);
    assert(q.lifecycle.active === false && q.lifecycle.questionStudioDiscoverable === false, `${prototypeId}/${seed}: Question Studio lifecycle opened`);
    assert(q.lifecycle.questionBankWritable === false && q.lifecycle.questionBankStatus === "NOT_STORED", `${prototypeId}/${seed}: bank lifecycle opened`);
    assert(q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${prototypeId}/${seed}: downstream lifecycle opened`);
    lifecycleChecks += 1;

    const learner = [q.stem, ...q.options.map((x) => x.value), q.explanation.concept ?? "", ...q.explanation.solution, q.explanation.finalAnswer].join("\n");
    assert(!rawFraction.test(learner), `${prototypeId}/${seed}: raw slash fraction`);
    assert(!unicodeMath.test(learner), `${prototypeId}/${seed}: unicode math`);
    assert(!bannedClutter.test(learner), `${prototypeId}/${seed}: learner jargon/clutter`);
    assert((q.explanation.solution?.length ?? 0) >= 1 && q.explanation.solution.length <= 3, `${prototypeId}/${seed}: explanation length`);
    if (/\\frac|\\overline|[<>=]/u.test(learner)) assert(mathOpen.test(learner), `${prototypeId}/${seed}: mathematical surface missing LaTeX wrapper`);

    assert(q.sourceAncestry.length >= 2, `${prototypeId}/${seed}: missing source ancestry`);
    answerPositions.get(prototypeId)!.add(q.correctIndex);
    difficultyReach.get(prototypeId)!.add(q.difficulty);
    fingerprints.add(q.mathematicalFingerprint);

    if (prototypeId === "NUM-CP002-PROT-005" && Number((q.hiddenState as any).block) === 9) {
      assert(q.canonicalAnswer === "\\(1\\)", `${prototypeId}/${seed}: repeating nines equivalence`);
      repeatingNinesSeen += 1;
    }
    if (prototypeId === "NUM-CP002-PROT-011") {
      const s = q.hiddenState as any;
      const g = (() => { let a = Math.abs(Number(s.n)), b = Math.abs(Number(s.d)); while (b) [a, b] = [b, a % b]; return a || 1; })();
      if (g > 1) reductionBeforeTerminationSeen += 1;
    }

    if (seed < 4) review.push(q);
  }
}

assert(generated === 1440, `generated count ${generated}`);
assert(verifierChecks === generated && replayChecks === generated && optionChecks === generated && lifecycleChecks === generated, "proof count mismatch");
assert(repeatingNinesSeen > 0, "repeating nines edge not reached");
assert(reductionBeforeTerminationSeen > 0, "reduction-before-termination edge not reached");
assert(NUM_CP002_WAVE01_DISCOVERY_STATUS.sourceSaturated === false, "Wave01 must not claim source saturation");
assert(NUM_CP002_WAVE01_DISCOVERY_STATUS.permanentQlIdsAllocated === false, "Wave01 must not allocate QLs");
assert(NUM_CP002_LEGACY_OWNERSHIP_DISPOSITION.some((x) => x.disposition === "REASSIGN_SIMPLIFICATION"), "Simplification ownership disposition missing");
assert(NUM_CP002_LEGACY_OWNERSHIP_DISPOSITION.some((x) => x.disposition === "REASSIGN_NUM_CP006"), "CP006 ownership disposition missing");

for (const prototypeId of NUM_CP002_WAVE01_PROTOTYPE_IDS) {
  assert(JSON.stringify([...answerPositions.get(prototypeId)!].sort()) === JSON.stringify([0, 1, 2, 3]), `${prototypeId}: answer-position reachability`);
  assert(["EASY", "MEDIUM", "HARD"].every((x) => difficultyReach.get(prototypeId)!.has(x)), `${prototypeId}: difficulty reachability`);
}

const outDir = resolve(process.cwd(), "dist/quant-v4/num-cp002-wave01");
mkdirSync(outDir, { recursive: true });
const jsonPath = resolve(outDir, "num-cp002-wave01-review.json");
const mdPath = resolve(outDir, "num-cp002-wave01-review.md");
writeFileSync(jsonPath, JSON.stringify({
  status: "NUM_CP002_WAVE01_EXECUTABLE_DISCOVERY_PROOF",
  temporaryPrototypeCount: NUM_CP002_WAVE01_PROTOTYPE_IDS.length,
  generated,
  reviewQuestionCount: review.length,
  sourceSaturated: false,
  permanentQlCount: 0,
  questionStudioDiscoverable: false,
  samples: review,
}, null, 2));
writeFileSync(mdPath, [
  "# NUM-CP-002 Wave 01 — Executable Discovery Review", "",
  "12 temporary prototypes × 4 learner samples = 48 questions. This is discovery evidence only; no permanent QLs or delivery surfaces are enabled.", "",
  ...review.flatMap((q) => [
    `## ${q.temporaryPrototypeId} · ${q.difficulty} · seed ${q.seed}`, "",
    q.stem, "",
    ...q.options.map((o: any, i: number) => `${String.fromCharCode(65 + i)}. ${o.value}${i === q.correctIndex ? " **[Correct]**" : ""}`),
    "", ...(q.explanation.concept ? [`**Concept:** ${q.explanation.concept}`, ""] : []),
    "**Solution:**", ...q.explanation.solution.map((line: string) => `- ${line}`), "",
    `**Answer:** ${q.explanation.finalAnswer}`, "",
  ]),
].join("\n"));

console.log(JSON.stringify({
  status: "PASS_NUM_CP002_WAVE01",
  temporaryPrototypeCount: NUM_CP002_WAVE01_PROTOTYPE_IDS.length,
  generated,
  verifierChecks,
  replayChecks,
  optionChecks,
  lifecycleChecks,
  uniqueFingerprints: fingerprints.size,
  repeatingNinesSeen,
  reductionBeforeTerminationSeen,
  answerPositions: Object.fromEntries([...answerPositions].map(([k, v]) => [k, [...v].sort()])),
  difficultyReach: Object.fromEntries([...difficultyReach].map(([k, v]) => [k, [...v].sort()])),
  reviewQuestionCount: review.length,
  jsonPath,
  mdPath,
}, null, 2));
