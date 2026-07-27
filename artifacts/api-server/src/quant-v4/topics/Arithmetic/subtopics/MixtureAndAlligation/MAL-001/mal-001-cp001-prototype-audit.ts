import { MAL_CP001_PROTOTYPE_REGISTRY } from "./foundation/cp001-registry";
import { generateMalCp001Prototype } from "./foundation/pipeline";
import { MAL_CP001_PROTOTYPE_IDS } from "./foundation/types";

function fail(message: string): never {
  throw new Error(message);
}

const forbiddenOwnershipTerms = /\b(?:speed|distance|partnership|capital labour|gst|tax bracket|false weight|short measure|density matrix)\b/iu;
const genericExplanationShell = /\b(?:apply the formula|substitute the values|solve for the answer|required value is)\b/iu;
const openingCounts = new Map<string, number>();
const contextCoverage = new Map<string, Set<string>>();
const misconceptionCoverage = new Set<string>();
const difficultyCounts = new Map<string, number>();
const semanticCounts = new Map<string, number>();
let generated = 0;
let diagramCount = 0;
let fractionalAnswerCount = 0;

for (const prototypeId of MAL_CP001_PROTOTYPE_IDS) {
  const contexts = new Set<string>();
  const stemFingerprints = new Set<string>();
  const answerFingerprints = new Set<string>();
  for (let index = 0; index < 80; index += 1) {
    const question = generateMalCp001Prototype(prototypeId, `audit-${index}`);
    generated += 1;
    contexts.add(question.parameters.context.scenarioId);
    stemFingerprints.add(question.stem.toLowerCase().replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/gu, "#"));
    answerFingerprints.add(question.mathematicalFingerprint);
    difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) ?? 0) + 1);
    semanticCounts.set(question.answerSemantic, (semanticCounts.get(question.answerSemantic) ?? 0) + 1);
    for (const option of question.optionAudit) misconceptionCoverage.add(option.misconceptionId);
    if (question.diagram) diagramCount += 1;
    const opening = question.stem.split(/\s+/u).slice(0, 5).join(" ");
    openingCounts.set(opening, (openingCounts.get(opening) ?? 0) + 1);

    if (!question.validation.ok) fail(`${prototypeId}/${index}: ${question.validation.errors.join(" | ")}`);
    if (forbiddenOwnershipTerms.test(question.stem)) fail(`${prototypeId}/${index}: ownership leakage in stem`);
    const explanation = [question.explanation.opening, ...question.explanation.steps, question.explanation.verification].join(" ");
    if (genericExplanationShell.test(explanation)) fail(`${prototypeId}/${index}: generic explanation shell`);
    if (!question.explanation.verification.includes("\\(")) fail(`${prototypeId}/${index}: verification lacks exact mathematics`);
    if (question.options.some((option) => option.length === 0)) fail(`${prototypeId}/${index}: blank option`);
    if (question.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) {
      fail(`${prototypeId}/${index}: option package does not contain exactly one correct label`);
    }
    const answer = question.optionAudit[question.correctIndex].result;
    const rationals = answer.kind === "COMPONENT_RATIO"
      ? [answer.firstPart, answer.secondPart]
      : answer.kind === "COMPONENT_QUANTITY_PAIR"
        ? [answer.firstQuantity, answer.secondQuantity]
        : answer.kind === "COMPONENT_QUANTITY"
          ? [answer.quantity]
          : [answer.value];
    if (rationals.some((value) => value.denominator !== 1n)) fractionalAnswerCount += 1;
  }
  if (contexts.size !== 5) fail(`${prototypeId}: not all approved context domains are reachable (${contexts.size}/5)`);
  if (stemFingerprints.size < 16) fail(`${prototypeId}: low structural stem diversity (${stemFingerprints.size})`);
  if (answerFingerprints.size < 75) fail(`${prototypeId}: low mathematical fingerprint diversity (${answerFingerprints.size})`);
  contextCoverage.set(prototypeId, contexts);
}

if (MAL_CP001_PROTOTYPE_REGISTRY.some((entry) => entry.permanentQlId !== null)) {
  fail("A permanent QL ID was assigned during executable discovery.");
}
if (!misconceptionCoverage.has("RATIO_REVERSED") || !misconceptionCoverage.has("SIMPLE_AVERAGE_USED")) {
  fail("Core misconception coverage is incomplete.");
}
if (!["Easy", "Medium", "Hard"].every((difficulty) => difficultyCounts.has(difficulty))) {
  fail("Instance-based difficulty does not reach all three bands.");
}
const maxOpeningRepeat = Math.max(...openingCounts.values());
if (maxOpeningRepeat > 80) fail(`One five-word opening repeats ${maxOpeningRepeat} times.`);

console.log(JSON.stringify({
  status: "PASS",
  generated,
  prototypeCount: MAL_CP001_PROTOTYPE_IDS.length,
  permanentQlCount: 0,
  diagramCount,
  fractionalAnswerCount,
  maxOpeningRepeat,
  difficultyCounts: Object.fromEntries([...difficultyCounts.entries()].sort()),
  semanticCounts: Object.fromEntries([...semanticCounts.entries()].sort()),
  misconceptionCoverage: [...misconceptionCoverage].sort(),
  contextCoverage: Object.fromEntries([...contextCoverage.entries()].map(([key, value]) => [key, [...value].sort()])),
}, null, 2));
