import {
  MAL_CP001_CANDIDATE_CONTRACT_IDS,
  MAL_CP001_DISCOVERY_CLASSIFICATION,
} from "./foundation/cp001-discovery-classification";
import {
  MAL_CP001_GAP_CANDIDATE_CONTRACT_IDS,
  MAL_CP001_GAP_DISCOVERY_CLASSIFICATION,
} from "./foundation/cp001-gap-classification";
import {
  MAL_CP001_DISCOVERY_PROTOTYPE_IDS,
  MAL_CP001_GAP_PROTOTYPE_REGISTRY,
} from "./foundation/cp001-gap-registry";
import { MAL_CP001_PROTOTYPE_REGISTRY } from "./foundation/cp001-registry";
import { generateMalCp001DiscoveryPrototype } from "./foundation/cp001-discovery-pipeline";
import type { Rational } from "./foundation/types";

function fail(message: string): never {
  throw new Error(message);
}

function displayedRationals(result: any): Rational[] {
  switch (result.kind) {
    case "COMPONENT_RATIO":
      return [result.firstPart, result.secondPart];
    case "COMPONENT_QUANTITY_PAIR":
      return [result.firstQuantity, result.secondQuantity];
    case "COMPONENT_QUANTITY":
      return [result.quantity];
    case "MEAN_VALUE":
    case "SOURCE_VALUE":
      return [result.value];
    default:
      fail(`Unknown displayed result kind: ${String(result.kind)}`);
  }
}

const forbiddenOwnershipTerms = /\b(?:speed|distance|partnership|capital labour|gst|tax bracket|false weight|short measure|density matrix|vessel equalisation|successive replacement)\b/iu;
const genericExplanationShell = /\b(?:apply the formula|substitute the values|solve for the answer|required value is)\b/iu;
const awkwardStemGrammar = /\b(?:leaves|beans|grades) is valued\b|\b(?:leaves|beans) is worth\b|\bHow much .+ was added\?|^\d+\s+(?:kg|litres)\b.+\bis blended\b|\bFind [^?]+\?/iu;

const allClassifications = [
  ...MAL_CP001_DISCOVERY_CLASSIFICATION,
  ...MAL_CP001_GAP_DISCOVERY_CLASSIFICATION,
];
const classifiedIds = allClassifications.map((entry) => entry.prototypeId);
if (classifiedIds.length !== MAL_CP001_DISCOVERY_PROTOTYPE_IDS.length) {
  fail("Every discovery prototype must have exactly one classification row.");
}
if (new Set(classifiedIds).size !== classifiedIds.length) {
  fail("Discovery classification contains a duplicate prototype row.");
}
for (const prototypeId of MAL_CP001_DISCOVERY_PROTOTYPE_IDS) {
  if (!classifiedIds.includes(prototypeId as never)) {
    fail(`Missing discovery classification for ${prototypeId}.`);
  }
}

const representedContracts = new Set(
  allClassifications.map((entry) => entry.candidateContractId),
);
const expectedContracts = new Set([
  ...MAL_CP001_CANDIDATE_CONTRACT_IDS,
  ...MAL_CP001_GAP_CANDIDATE_CONTRACT_IDS,
]);
if (representedContracts.size !== expectedContracts.size) {
  fail(
    `Candidate contract count mismatch: ${representedContracts.size} represented versus ${expectedContracts.size} expected.`,
  );
}
for (const contractId of expectedContracts) {
  if (!representedContracts.has(contractId)) {
    fail(`Missing candidate contract representation for ${contractId}.`);
  }
}

const dispositionCounts = new Map<string, number>();
for (const classification of allClassifications) {
  dispositionCounts.set(
    classification.disposition,
    (dispositionCounts.get(classification.disposition) ?? 0) + 1,
  );
}

const openingCounts = new Map<string, number>();
const contextCoverage = new Map<string, Set<string>>();
const misconceptionCoverage = new Set<string>();
const difficultyCounts = new Map<string, number>();
const semanticCounts = new Map<string, number>();
let generated = 0;
let fractionalAnswerCount = 0;

for (const prototypeId of MAL_CP001_DISCOVERY_PROTOTYPE_IDS) {
  const contexts = new Set<string>();
  const stemFingerprints = new Set<string>();
  const answerFingerprints = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const question = generateMalCp001DiscoveryPrototype(
      prototypeId,
      `discovery-audit-${index}`,
    );
    generated += 1;
    contexts.add(question.parameters.context.scenarioId);
    stemFingerprints.add(
      question.stem.toLowerCase().replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/gu, "#"),
    );
    answerFingerprints.add(question.mathematicalFingerprint);
    difficultyCounts.set(
      question.difficulty,
      (difficultyCounts.get(question.difficulty) ?? 0) + 1,
    );
    semanticCounts.set(
      question.answerSemantic,
      (semanticCounts.get(question.answerSemantic) ?? 0) + 1,
    );
    for (const option of question.optionAudit) {
      misconceptionCoverage.add(option.misconceptionId);
    }

    const opening = question.stem.split(/\s+/u).slice(0, 5).join(" ");
    openingCounts.set(opening, (openingCounts.get(opening) ?? 0) + 1);

    if (!question.validation.ok) {
      fail(`${prototypeId}/${index}: ${question.validation.errors.join(" | ")}`);
    }
    if (forbiddenOwnershipTerms.test(question.stem)) {
      fail(`${prototypeId}/${index}: ownership leakage in stem`);
    }
    if (/^[a-z]/u.test(question.stem)) {
      fail(`${prototypeId}/${index}: stem begins with a lower-case letter`);
    }
    if (awkwardStemGrammar.test(question.stem)) {
      fail(`${prototypeId}/${index}: awkward learner-facing grammar`);
    }
    const explanation = [
      question.explanation.opening,
      question.explanation.formula,
      ...question.explanation.steps,
      question.explanation.verification,
      question.explanation.conclusion,
    ].join(" ");
    if (genericExplanationShell.test(explanation)) {
      fail(`${prototypeId}/${index}: generic explanation shell`);
    }
    if (!question.explanation.verification.includes("\\(")) {
      fail(`${prototypeId}/${index}: verification lacks exact mathematics`);
    }
    if (question.options.some((option) => option.length === 0)) {
      fail(`${prototypeId}/${index}: blank option`);
    }
    if (
      question.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1
    ) {
      fail(`${prototypeId}/${index}: option package lacks exactly one correct label`);
    }
    for (const option of question.optionAudit) {
      if (displayedRationals(option.result).some((value) => value.denominator !== 1n)) {
        fail(`${prototypeId}/${index}: fractional displayed option`);
      }
    }
    if (
      displayedRationals(question.optionAudit[question.correctIndex].result)
        .some((value) => value.denominator !== 1n)
    ) {
      fractionalAnswerCount += 1;
    }
  }

  if (contexts.size !== 5) {
    fail(`${prototypeId}: not all approved contexts are reachable (${contexts.size}/5)`);
  }
  if (stemFingerprints.size < 16) {
    fail(`${prototypeId}: low structural stem diversity (${stemFingerprints.size})`);
  }
  if (answerFingerprints.size < 60) {
    fail(`${prototypeId}: low mathematical fingerprint diversity (${answerFingerprints.size})`);
  }
  contextCoverage.set(prototypeId, contexts);
}

if (fractionalAnswerCount !== 0) {
  fail(`Discovery construction produced ${fractionalAnswerCount} fractional answers.`);
}
if (
  MAL_CP001_PROTOTYPE_REGISTRY.some((entry) => entry.permanentQlId !== null) ||
  MAL_CP001_GAP_PROTOTYPE_REGISTRY.some((entry) => entry.permanentQlId !== null)
) {
  fail("A permanent QL ID was assigned during executable discovery.");
}
if (!misconceptionCoverage.has("RATIO_REVERSED")) {
  fail("Core alligation misconception coverage is incomplete.");
}
if (!misconceptionCoverage.has("STAGE_ONE_MEAN_REPORTED")) {
  fail("Two-stage misconception coverage is incomplete.");
}
if (!misconceptionCoverage.has("DIFFERENCE_USED_AS_SCALE")) {
  fail("Difference-based reconstruction misconception coverage is incomplete.");
}
if (!["Easy", "Medium", "Hard"].every((difficulty) => difficultyCounts.has(difficulty))) {
  fail("Instance-based difficulty does not reach all three bands.");
}

const maxOpeningRepeat = Math.max(...openingCounts.values());
if (maxOpeningRepeat > 120) {
  fail(`One five-word opening repeats ${maxOpeningRepeat} times.`);
}

console.log(JSON.stringify({
  status: "PASS",
  generated,
  prototypeCount: MAL_CP001_DISCOVERY_PROTOTYPE_IDS.length,
  candidateContractCount: representedContracts.size,
  candidateContracts: [...representedContracts].sort(),
  dispositionCounts: Object.fromEntries([...dispositionCounts.entries()].sort()),
  permanentQlCount: 0,
  fractionalAnswerCount,
  maxOpeningRepeat,
  difficultyCounts: Object.fromEntries([...difficultyCounts.entries()].sort()),
  semanticCounts: Object.fromEntries([...semanticCounts.entries()].sort()),
  misconceptionCoverage: [...misconceptionCoverage].sort(),
  contextCoverage: Object.fromEntries(
    [...contextCoverage.entries()].map(([key, value]) => [key, [...value].sort()]),
  ),
}, null, 2));
