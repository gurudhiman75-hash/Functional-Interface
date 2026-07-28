import { NUM_CP003_RETAINED_TEMPLATE_REGISTRY } from "./template-registry";
import { generateNumCp003RetainedQuestion, NUM_CP003_RETAINED_TEMPLATE_LABELS } from "./runtime";

const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
const ok = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const equal = (actual: unknown, expected: unknown, message: string): void => {
  if (actual !== expected) throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
};

let generated = 0;
const difficulties = new Set<string>();
const semantics = new Set<string>();
const authorities = new Set<string>();
const dsClasses = new Set<string>();
const claimPolarities = new Set<string>();
const extremumDirections = new Set<string>();
const linkedDirections = new Set<string>();
const summaries: Record<string, unknown> = {};

for (const label of NUM_CP003_RETAINED_TEMPLATE_LABELS) {
  const positions = new Set<number>();
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();
  const expectedPositions = label === "NUM-CP003-QLT2-16" ? 5 : 4;

  for (let index = 0; index < 100; index += 1) {
    const seed = `proof-${index}`;
    let first;
    try { first = generateNumCp003RetainedQuestion(label, seed); } catch (error) {
      throw new Error(`${label}/${seed}: ${String(error)}`);
    }
    const second = generateNumCp003RetainedQuestion(label, seed);

    equal(stable(first), stable(second), `${label}/${seed}: non-deterministic output`);
    ok(first.validation.ok, `${label}/${seed}: ${first.validation.errors.join(" | ")}`);
    equal(first.validation.verifierAnswer, first.answer, `${label}/${seed}: verifier mismatch`);
    equal(first.options.length, expectedPositions, `${label}/${seed}: option count`);
    equal(new Set(first.options).size, expectedPositions, `${label}/${seed}: duplicate options`);
    equal(first.options[first.correctIndex], first.answer, `${label}/${seed}: correct-index mismatch`);
    equal(first.optionAudit[first.correctIndex]?.misconceptionId, "CORRECT", `${label}/${seed}: correct label mismatch`);
    ok(first.optionAudit.every((row) => row.diagnostic.trim().length >= 16), `${label}/${seed}: short option diagnostic`);
    ok(first.stem.endsWith("?"), `${label}/${seed}: stem not interrogative`);
    ok(first.explanation.steps.length >= 3, `${label}/${seed}: too few explanation steps`);
    equal(first.explanation.traps.length, 3, `${label}/${seed}: trap count`);
    ok(first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"), `${label}/${seed}: verification node missing`);
    equal(first.permanentQlId, null, `${label}/${seed}: permanent QL leak`);
    equal(first.questionBankStatus, "NOT_STORED", `${label}/${seed}: Question Bank leak`);
    equal(first.testEligibility, "INELIGIBLE", `${label}/${seed}: test eligibility leak`);
    equal(first.publiclyPublishable, false, `${label}/${seed}: public exposure leak`);
    equal(first.questionStudioDiscoverable, false, `${label}/${seed}: Question Studio leak`);

    const state = first.hiddenState;
    if (state.kind === "SINGLE_DIGIT_CANDIDATE_SET" && state.extremumDirection) extremumDirections.add(state.extremumDirection);
    if (state.kind === "DIGIT_BOUND_MULTIPLE") extremumDirections.add(state.direction);
    if (state.kind === "LINKED_ARITHMETIC_DIVISIBILITY") {
      ok(state.arithmeticPairs.length > state.validPairs.length, `${label}/${seed}: divisibility did not filter linked pairs`);
      ok(state.validPairs.length >= 2, `${label}/${seed}: linked extremum lacks multiple valid pairs`);
      linkedDirections.add(state.direction);
    }
    if (state.kind === "DATA_SUFFICIENCY") dsClasses.add(state.sufficiencyClass);
    if (state.kind === "CLAIM_VALIDATION") claimPolarities.add(state.requestedPolarity);
    if (state.kind === "IMPLICIT_REPEATED_NUMERAL") {
      ok(!first.stem.includes(state.number.toString()), `${label}/${seed}: repeated numeral was expanded in the stem`);
    }

    positions.add(first.correctIndex);
    stems.add(first.stem);
    fingerprints.add(first.fingerprint);
    answers.add(first.answer);
    difficulties.add(first.difficulty);
    semantics.add(first.answerSemantic);
    generated += 1;
  }

  equal(positions.size, expectedPositions, `${label}: answer-position reach`);
  ok(stems.size >= 55, `${label}: stem diversity ${stems.size}`);
  ok(fingerprints.size >= 65, `${label}: fingerprint diversity ${fingerprints.size}`);
  const minimumAnswerDiversity = ["NUM-CP003-QLT2-04", "NUM-CP003-QLT2-09", "NUM-CP003-QLT2-11", "NUM-CP003-QLT2-16"].includes(label) ? 3 : 4;
  ok(answers.size >= minimumAnswerDiversity, `${label}: answer diversity ${answers.size}`);
  summaries[label] = {
    positions: [...positions].sort(),
    distinctStems: stems.size,
    distinctFingerprints: fingerprints.size,
    distinctAnswers: answers.size,
  };
}

for (const entry of NUM_CP003_RETAINED_TEMPLATE_REGISTRY) authorities.add(entry.authorityId);
equal(NUM_CP003_RETAINED_TEMPLATE_LABELS.length, 17, "retained template count");
equal(authorities.size, 7, "authority count");
equal(difficulties.size, 3, `difficulty reach ${[...difficulties]}`);
ok(semantics.size >= 9, `answer semantic reach ${[...semantics]}`);
equal(dsClasses.size, 5, `data-sufficiency class reach ${[...dsClasses]}`);
equal(claimPolarities.size, 2, `claim polarity reach ${[...claimPolarities]}`);
ok(extremumDirections.has("LARGEST") && extremumDirections.has("SMALLEST"), `digit extremum directions ${[...extremumDirections]}`);
ok(extremumDirections.has("LEAST") && extremumDirections.has("GREATEST"), `boundary extremum directions ${[...extremumDirections]}`);
equal(linkedDirections.size, 2, `linked directions ${[...linkedDirections]}`);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  templateCount: NUM_CP003_RETAINED_TEMPLATE_LABELS.length,
  authorityCount: authorities.size,
  permanentQlCount: 0,
  difficulties: [...difficulties].sort(),
  answerSemantics: [...semantics].sort(),
  dataSufficiencyClasses: [...dsClasses].sort(),
  claimPolarities: [...claimPolarities].sort(),
  extremumDirections: [...extremumDirections].sort(),
  linkedDirections: [...linkedDirections].sort(),
  summaries,
}, null, 2));
