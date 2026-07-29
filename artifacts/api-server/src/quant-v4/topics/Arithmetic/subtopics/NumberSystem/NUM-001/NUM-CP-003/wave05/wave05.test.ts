import { generateNumCp003Wave05 } from "./runtime";
import { NUM_CP003_WAVE05_IDS } from "./types";

const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
const ok = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

let generated = 0;
const difficulties = new Set<string>();
const semantics = new Set<string>();
const targets = new Set<string>();
const linkedDirections = new Set<string>();
const summaries: Record<string, unknown> = {};

for (const id of NUM_CP003_WAVE05_IDS) {
  const positions = new Set<number>();
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < 100; index += 1) {
    const seed = `proof-${index}`;
    const first = generateNumCp003Wave05(id, seed);
    const second = generateNumCp003Wave05(id, seed);

    ok(stable(first) === stable(second), `${id}/${seed}: non-deterministic`);
    ok(first.validation.ok, `${id}/${seed}: ${first.validation.errors.join(" | ")}`);
    ok(first.validation.verifierAnswer === first.answer, `${id}/${seed}: verifier mismatch`);
    ok(first.options.length === 4 && new Set(first.options).size === 4, `${id}/${seed}: option failure`);
    ok(first.options[first.correctIndex] === first.answer, `${id}/${seed}: correct-index failure`);
    ok(first.optionAudit[first.correctIndex]?.misconceptionId === "CORRECT", `${id}/${seed}: correct-label failure`);
    ok(first.optionAudit.every((row) => row.diagnostic.trim().length >= 16), `${id}/${seed}: diagnostic failure`);
    ok(first.explanation.steps.length >= 3 && first.explanation.traps.length === 3, `${id}/${seed}: explanation failure`);
    ok(first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"), `${id}/${seed}: verification node missing`);
    ok(first.permanentQlId === null, `${id}/${seed}: permanent identity must remain null`);
    ok(first.questionBankStatus === "NOT_STORED" && first.testEligibility === "INELIGIBLE", `${id}/${seed}: lifecycle failure`);
    ok(!first.publiclyPublishable && !first.questionStudioDiscoverable, `${id}/${seed}: exposure failure`);

    if (first.hiddenState.kind === "SINGLE_DIGIT_CANDIDATE_SET") {
      ok(first.hiddenState.validDigits.length >= 2, `${id}/${seed}: expected multi-candidate set`);
      targets.add(first.hiddenState.target);
    } else {
      ok(first.hiddenState.arithmeticPairs.length > first.hiddenState.validPairs.length, `${id}/${seed}: divisibility must reduce candidates`);
      ok(first.hiddenState.validPairs.length >= 2, `${id}/${seed}: linked extremum lacks choice`);
      linkedDirections.add(first.hiddenState.targetDirection);
    }

    positions.add(first.correctIndex);
    stems.add(first.stem);
    fingerprints.add(first.fingerprint);
    answers.add(first.answer);
    difficulties.add(first.difficulty);
    semantics.add(first.answerSemantic);
    generated += 1;
  }

  ok(positions.size === 4, `${id}: answer positions missing`);
  ok(stems.size >= 65, `${id}: stem diversity ${stems.size}`);
  ok(fingerprints.size >= 70, `${id}: fingerprint diversity ${fingerprints.size}`);
  const minimumAnswerDiversity = id.includes("COMPLETED-NUMBER") ? 70 : id.includes("SUM-VALID") ? 8 : 3;
  ok(answers.size >= minimumAnswerDiversity, `${id}: answer diversity ${answers.size}`);
  summaries[id] = { positions: [...positions].sort(), stems: stems.size, fingerprints: fingerprints.size, answers: answers.size };
}

ok(difficulties.size === 3, `difficulty reach ${[...difficulties]}`);
ok(semantics.size === 3, `semantic reach ${[...semantics]}`);
ok(targets.size === 5, `single-digit target coverage ${[...targets]}`);
ok(linkedDirections.size === 2, `linked extremum directions ${[...linkedDirections]}`);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  prototypeCount: NUM_CP003_WAVE05_IDS.length,
  permanentQlCount: 0,
  difficulties: [...difficulties].sort(),
  semantics: [...semantics].sort(),
  targets: [...targets].sort(),
  linkedDirections: [...linkedDirections].sort(),
  summaries,
}, null, 2));
