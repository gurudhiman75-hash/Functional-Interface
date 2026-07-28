import { NUM_CP003_PROTOTYPE_REGISTRY } from "./foundation/registry";
import { generateNumCp003Prototype } from "./foundation/runtime-reviewed";
import { NUM_CP003_PROTOTYPE_IDS } from "./foundation/types";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function assertEqual(actual: unknown, expected: unknown, message = "Values are not equal"): void {
  if (actual !== expected) throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
}

function assertOk(value: unknown, message = "Assertion failed"): void {
  if (!value) throw new Error(message);
}

const rawMathCommand = /(?<!\\)\([^)]*(?<!\\)\b(?:div|lceil|rceil|times)\b[^)]*(?<!\\)\)/u;
const controlCharacter = /[\u0009\u000d]/u;

assertEqual(NUM_CP003_PROTOTYPE_REGISTRY.length, NUM_CP003_PROTOTYPE_IDS.length);
assertEqual(new Set(NUM_CP003_PROTOTYPE_IDS).size, NUM_CP003_PROTOTYPE_IDS.length);

let generated = 0;
const difficulties = new Set<string>();
const semantics = new Set<string>();
const summaries: Record<string, unknown> = {};

for (const prototypeId of NUM_CP003_PROTOTYPE_IDS) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < 120; index += 1) {
    const seed = `proof-${index}`;
    const first = generateNumCp003Prototype(prototypeId, seed);
    const second = generateNumCp003Prototype(prototypeId, seed);
    const mathematicalText = [
      ...first.explanation.steps,
      first.explanation.shortcut,
      first.explanation.verification,
    ];

    assertEqual(stable(first), stable(second), `${prototypeId}/${seed} is not deterministic`);
    assertEqual(first.validation.ok, true, `${prototypeId}/${seed}: ${first.validation.errors.join(" | ")}`);
    assertEqual(first.validation.verifierAnswer, first.answer);
    assertEqual(first.options.length, 4);
    assertEqual(new Set(first.options).size, 4);
    assertEqual(first.options[first.correctIndex], first.answer);
    assertEqual(first.optionAudit[first.correctIndex]?.misconceptionId, "CORRECT");
    assertOk(first.optionAudit.every((row) => row.diagnostic.trim().length >= 16));
    assertEqual(first.permanentQlId, null);
    assertEqual(first.reviewStatus, "UNREVIEWED_DISCOVERY_CANDIDATE");
    assertEqual(first.questionBankStatus, "NOT_STORED");
    assertEqual(first.testEligibility, "INELIGIBLE");
    assertEqual(first.publiclyPublishable, false);
    assertEqual(first.questionStudioDiscoverable, false);
    assertOk(first.stem.endsWith("?"));
    assertOk(first.explanation.steps.length >= 3);
    assertOk(first.explanation.traps.length >= 3);
    assertOk(first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"));
    assertOk(first.difficultyEvidence.length > 0);
    assertOk(!mathematicalText.some((text) => rawMathCommand.test(text)));
    assertOk(!mathematicalText.some((text) => controlCharacter.test(text)));

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    fingerprints.add(first.mathematicalFingerprint);
    answers.add(first.answer);
    difficulties.add(first.difficulty);
    semantics.add(first.answerSemantic);
    generated += 1;
  }

  assertEqual(answerPositions.size, 4, `${prototypeId} lacks all answer positions`);
  assertOk(stems.size >= 70, `${prototypeId} stem diversity too low: ${stems.size}`);
  assertOk(fingerprints.size >= 70, `${prototypeId} fingerprint diversity too low: ${fingerprints.size}`);
  const minimumAnswerDiversity = prototypeId === "NUM-CP003-PROT-SINGLE-MISSING-DIGIT-COUNT" ? 3 : 4;
  assertOk(answers.size >= minimumAnswerDiversity, `${prototypeId} answer diversity too low: ${answers.size}`);

  summaries[prototypeId] = {
    answerPositions: [...answerPositions].sort(),
    distinctStems: stems.size,
    distinctFingerprints: fingerprints.size,
    distinctAnswers: answers.size,
  };
}

assertEqual(difficulties.size, 3, "Expected Easy, Medium and Hard reach");
assertEqual(semantics.size, 5, "Expected five answer semantics");

console.log(JSON.stringify({
  status: "PASS",
  generated,
  prototypeCount: NUM_CP003_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  difficulties: [...difficulties].sort(),
  answerSemantics: [...semantics].sort(),
  summaries,
}, null, 2));
