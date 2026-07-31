import assert from "node:assert/strict";
import { CLS_CP006_PROTOTYPES } from "./alphabet-domain";
import {
  auditClsCp006PresentationQuality,
  generateClsCp006QualityQuestion,
} from "./quality-runtime";

const QUESTIONS_PER_PROTOTYPE = 50;
const explanationFingerprints = new Set<string>();
const fingerprintsByPrototype = new Map<string, Set<string>>();
const stemCountsByKind = new Map<string, Map<string, number>>();
let pairQuestions = 0;
let calculationCompletePairQuestions = 0;
let sameAnswerMultiRuleQuestions = 0;
let singularSignedGapQuestions = 0;

for (const prototype of CLS_CP006_PROTOTYPES) {
  const prototypeFingerprints = new Set<string>();
  fingerprintsByPrototype.set(prototype.prototypeId, prototypeFingerprints);
  const stemCounts = stemCountsByKind.get(prototype.optionKind) ?? new Map<string, number>();
  stemCountsByKind.set(prototype.optionKind, stemCounts);

  for (let seed = 0; seed < QUESTIONS_PER_PROTOTYPE; seed += 1) {
    const optionCount = seed % 2 === 0 ? 4 : 5;
    const question = generateClsCp006QualityQuestion(
      prototype.prototypeId,
      seed + 20_000,
      optionCount,
    );
    const replay = generateClsCp006QualityQuestion(
      prototype.prototypeId,
      seed + 20_000,
      optionCount,
    );
    assert.deepEqual(question, replay);

    const audit = auditClsCp006PresentationQuality(question);
    assert.equal(
      audit.result,
      "PASS",
      `${prototype.prototypeId}/${seed}: ${audit.reasons.join("; ")}`,
    );
    assert.equal(question.evidenceByOption.length, optionCount);
    assert.equal(question.explanation.stepByStep.length, optionCount + 1);
    assert.deepEqual(
      question.explanation.stepByStep.slice(0, optionCount),
      question.evidenceByOption,
    );
    assert.equal(
      question.explanation.stepByStep.at(-1),
      `Therefore, ${question.answer} is the odd one out.`,
    );
    if (optionCount === 5) assert.doesNotMatch(question.stem, /\bThree\b/);
    if (optionCount === 4) assert.doesNotMatch(question.stem, /\bFour\b/);

    const matchingEvidence = question.evidenceByOption.filter((line) =>
      line.includes("matches the common rule"),
    );
    const outlierEvidence = question.evidenceByOption.filter((line) =>
      line.includes("does not match the common rule"),
    );
    assert.equal(matchingEvidence.length, optionCount - 1);
    assert.equal(outlierEvidence.length, 1);
    assert.equal(
      question.evidenceByOption[question.correctIndex],
      outlierEvidence[0],
    );

    question.evidenceByOption.forEach((line, index) => {
      assert.ok(line.startsWith(question.options[index]!));
      assert.ok(line.length >= 45);
      assert.ok(line.length <= 220);
      assert.doesNotMatch(line, /\b1 (?:positions|places)\b/);
    });
    assert.equal(new Set(question.evidenceByOption).size, optionCount);

    if (question.optionKind === "LETTER_PAIR") {
      pairQuestions += 1;
      if (question.intendedRuleId === "PAIR_VOWEL_CONSONANT_COMPOSITION") {
        assert.ok(
          question.evidenceByOption.every((line) =>
            /has a (?:vowel|consonant) followed by a (?:vowel|consonant)/.test(line),
          ),
        );
      } else {
        assert.ok(question.evidenceByOption.every((line) => /\d/.test(line)));
        assert.ok(question.evidenceByOption.every((line) => line.includes("=")));
        assert.ok(
          question.evidenceByOption.every((line, index) =>
            line.indexOf(":") > question.options[index]!.length,
          ),
        );
        calculationCompletePairQuestions += 1;
      }
      if (
        question.intendedRuleId === "PAIR_SIGNED_POSITION_GAP" &&
        question.evidenceByOption.some((line) => /\b1 position (?:after|before)\b/.test(line))
      ) {
        singularSignedGapQuestions += 1;
      }
    }

    assert.match(
      question.explanation.examSpeedShortcut[0]!,
      /^(Add|Check|Label|Mark|Subtract|Use|Write)/,
    );
    assert.ok(question.explanation.commonTrapWarning[0]!.length >= 50);
    assert.ok(question.explanation.coreConcept[0]!.length >= 50);
    assert.ok(question.explanation.coreConcept[0]!.length <= 180);

    const learnerText = [
      question.stem,
      ...question.options,
      question.answer,
      ...question.evidenceByOption,
      ...question.explanation.coreConcept,
      ...question.explanation.stepByStep,
      ...question.explanation.examSpeedShortcut,
      ...question.explanation.commonTrapWarning,
    ].join("\n");
    assert.ok(!/CLS-|PROT-|LETTER_[A-Z_]+|PAIR_[A-Z_]+/i.test(learnerText));
    assert.ok(!/what is the position|find the position|how many letters|move .* places|rearrange/i.test(question.stem));
    assert.doesNotMatch(learnerText, /\b1 (?:positions|places)\b/);

    const explanationFingerprint = JSON.stringify({
      core: question.explanation.coreConcept,
      steps: question.explanation.stepByStep,
      shortcut: question.explanation.examSpeedShortcut,
      trap: question.explanation.commonTrapWarning,
    });
    explanationFingerprints.add(explanationFingerprint);
    prototypeFingerprints.add(explanationFingerprint);
    stemCounts.set(question.stem, (stemCounts.get(question.stem) ?? 0) + 1);
    if (question.ambiguityAudit.candidateSupports.length > 1) {
      sameAnswerMultiRuleQuestions += 1;
    }
  }
}

assert.ok(
  explanationFingerprints.size >= 320,
  `Only ${explanationFingerprints.size}/400 unique explanation fingerprints were generated.`,
);
for (const [prototypeId, fingerprints] of fingerprintsByPrototype) {
  assert.ok(
    fingerprints.size >= 35,
    `${prototypeId} has only ${fingerprints.size}/50 unique explanation fingerprints.`,
  );
}
for (const [kind, counts] of stemCountsByKind) {
  assert.ok(counts.size >= 5, `${kind} exposes only ${counts.size} stem forms.`);
  assert.ok(
    Math.max(...counts.values()) <= Math.ceil([...counts.values()].reduce((sum, count) => sum + count, 0) * 0.3),
    `${kind} has a dominant stem: ${JSON.stringify(Object.fromEntries(counts))}`,
  );
}
assert.ok(pairQuestions > 0);
assert.ok(calculationCompletePairQuestions > 0);
assert.ok(singularSignedGapQuestions > 0, "The editorial corpus did not exercise a one-position signed gap.");

console.log("CLS-CP-006 teacher-style editorial audit passed.", {
  generated: CLS_CP006_PROTOTYPES.length * QUESTIONS_PER_PROTOTYPE,
  uniqueExplanationFingerprints: explanationFingerprints.size,
  minimumPrototypeExplanationFingerprints: Math.min(
    ...[...fingerprintsByPrototype.values()].map((fingerprints) => fingerprints.size),
  ),
  stemFormsByKind: Object.fromEntries(
    [...stemCountsByKind.entries()].map(([kind, counts]) => [kind, counts.size]),
  ),
  pairQuestions,
  calculationCompletePairQuestions,
  singularSignedGapQuestions,
  sameAnswerMultiRuleQuestions,
  permanentQlCount: 0,
});
