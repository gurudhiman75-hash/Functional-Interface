import { generateNumCp003Wave04 } from "./runtime";
import { NUM_CP003_WAVE04_IDS } from "./types";

const stable = (value: unknown): string => JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
const ok = (value: unknown, message: string): void => { if (!value) throw new Error(message); };

let generated = 0;
const difficulties = new Set<string>();
const semantics = new Set<string>();
const ruleIds = new Set<string>();
const solutionClasses = new Set<string>();
const summaries: Record<string, unknown> = {};

for (const id of NUM_CP003_WAVE04_IDS) {
  const positions = new Set<number>();
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < 100; index += 1) {
    const seed = `proof-${index}`;
    let first;
    try { first = generateNumCp003Wave04(id, seed); } catch (error) { throw new Error(`${id}/${seed}: ${String(error)}`); }
    const second = generateNumCp003Wave04(id, seed);

    ok(stable(first) === stable(second), `${id}/${seed}: non-deterministic`);
    ok(first.validation.ok, `${id}/${seed}: ${first.validation.errors.join(" | ")}`);
    ok(first.validation.verifierAnswer === first.answer, `${id}/${seed}: verifier mismatch`);
    ok(first.options.length === 4 && new Set(first.options).size === 4, `${id}/${seed}: option failure`);
    ok(first.options[first.correctIndex] === first.answer, `${id}/${seed}: correct-index failure`);
    ok(first.optionAudit[first.correctIndex]?.misconceptionId === "CORRECT", `${id}/${seed}: correct-label failure`);
    ok(first.optionAudit.every((row) => row.diagnostic.length >= 16), `${id}/${seed}: diagnostic failure`);
    ok(first.explanation.steps.length >= 3 && first.explanation.traps.length === 3, `${id}/${seed}: explanation failure`);
    ok(first.reasoningGraph.nodes.some((node) => node.kind === "VERIFICATION"), `${id}/${seed}: verification node missing`);
    ok(first.permanentQlId === null && !first.publiclyPublishable && !first.questionStudioDiscoverable, `${id}/${seed}: lifecycle leak`);

    if (first.hiddenState.kind === "RULE_RECOGNITION") ruleIds.add(first.hiddenState.ruleId);
    if (first.hiddenState.kind === "TWO_DIGIT_SOLUTION_CLASS") solutionClasses.add(first.hiddenState.solutionClass);
    positions.add(first.correctIndex);
    stems.add(first.stem);
    fingerprints.add(first.fingerprint);
    answers.add(first.answer);
    difficulties.add(first.difficulty);
    semantics.add(first.answerSemantic);
    generated += 1;
  }

  ok(positions.size === 4, `${id}: answer positions missing`);
  const minimumStemDiversity = id.includes("RULE") ? 8 : id.includes("REPEATED-BLOCK") ? 3 : 65;
  const minimumFingerprintDiversity = id.includes("RULE") ? 8 : id.includes("REPEATED-BLOCK") ? 12 : 65;
  ok(stems.size >= minimumStemDiversity, `${id}: stem diversity ${stems.size}`);
  ok(fingerprints.size >= minimumFingerprintDiversity, `${id}: fingerprint diversity ${fingerprints.size}`);
  const minimumAnswerDiversity = id.includes("RULE") ? 8 : id.includes("SOLUTION-CLASS") ? 3 : id.includes("EACH-STATEMENT") ? 1 : id.includes("REPEATED-BLOCK") ? 5 : 4;
  ok(answers.size >= minimumAnswerDiversity, `${id}: answer diversity ${answers.size}`);
  summaries[id] = { positions: [...positions].sort(), stems: stems.size, fingerprints: fingerprints.size, answers: answers.size };
}

ok(difficulties.size === 3, `difficulty reach ${[...difficulties]}`);
ok(semantics.size === 6, `semantic reach ${[...semantics]}`);
ok(ruleIds.size === 8, `rule coverage ${[...ruleIds]}`);
ok(solutionClasses.size === 3, `solution-class coverage ${[...solutionClasses]}`);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  prototypeCount: NUM_CP003_WAVE04_IDS.length,
  permanentQlCount: 0,
  difficulties: [...difficulties].sort(),
  semantics: [...semantics].sort(),
  ruleIds: [...ruleIds].sort(),
  solutionClasses: [...solutionClasses].sort(),
  summaries,
}, null, 2));
