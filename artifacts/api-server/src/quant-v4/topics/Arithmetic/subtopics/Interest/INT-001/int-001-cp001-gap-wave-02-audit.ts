import { isWholeRational } from "./foundation/rational";
import {
  generateIntCp001Wave2Prototype,
  INT_CP001_WAVE2_PROTOTYPE_IDS,
} from "./gap-wave-02";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item);
}

function fail(message: string): never {
  throw new Error(message);
}

function isMoneySemantic(value: string): boolean {
  return value === "TOTAL_AMOUNT" || value === "PRINCIPAL" || value === "ANNUAL_INTEREST";
}

const difficultyCounts = new Map<string, number>();
const semanticCounts = new Map<string, number>();
const contextCounts = new Map<string, number>();
const misconceptionCounts = new Map<string, number>();
const openingCounts = new Map<string, number>();
const perPrototype: Record<string, unknown> = {};
let generated = 0;
let fractionalMoneyOptions = 0;
let longestStem = 0;
let longestExplanation = 0;

for (const prototypeId of INT_CP001_WAVE2_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  const fingerprints = new Set<string>();
  const contexts = new Set<string>();
  const positions = new Set<number>();
  const misconceptions = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `wave2-audit-${index}`;
    const item = generateIntCp001Wave2Prototype(prototypeId, seed);
    generated += 1;

    if (!item.validation.ok) fail(`${prototypeId}/${seed}: ${item.validation.errors.join(" | ")}`);
    if (item.permanentQlId !== null) fail(`${prototypeId} allocated a permanent QL during discovery.`);
    if (item.publiclyPublishable || item.questionStudioDiscoverable) {
      fail(`${prototypeId} breached publication safety.`);
    }
    if (item.reviewStatus !== "UNREVIEWED"
      || item.questionBankStatus !== "NOT_STORED"
      || item.testEligibility !== "INELIGIBLE") {
      fail(`${prototypeId} breached lifecycle safety.`);
    }

    const explanation = [
      item.explanation.notice,
      item.explanation.relation,
      ...item.explanation.steps,
      item.explanation.verification,
      item.explanation.conclusion,
      item.explanation.commonTrap,
    ].join(" ");
    const combined = `${item.stem}\n${explanation}\n${item.options.join("\n")}`;

    if (/\b(?:undefined|null|NaN|Infinity|TODO|TBD|PLACEHOLDER)\b/u.test(combined)) {
      fail(`${prototypeId}/${seed} contains unresolved or non-finite text.`);
    }
    if (/\{\{[^}]+\}\}/u.test(combined)) fail(`${prototypeId}/${seed} contains a template placeholder.`);
    if (/\b(?:Find|Determine)\b[^.?!]*\?$/u.test(item.stem)) {
      fail(`${prototypeId}/${seed} uses an imperative question fragment.`);
    }
    if (/^[a-z]/u.test(item.stem)) fail(`${prototypeId}/${seed} begins with lowercase text.`);
    if (/ {2,}/u.test(combined)) fail(`${prototypeId}/${seed} contains repeated spaces.`);
    if (/\p{Cc}/u.test(combined.replace(/\n/gu, ""))) {
      fail(`${prototypeId}/${seed} contains a control character.`);
    }
    if (item.explanation.steps.length < 3) fail(`${prototypeId}/${seed} explanation is too shallow.`);
    if (!item.explanation.conclusion.includes(item.options[item.correctIndex]!)) {
      fail(`${prototypeId}/${seed} conclusion does not state the answer.`);
    }
    if (item.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) {
      fail(`${prototypeId}/${seed} option audit has an invalid correct-label count.`);
    }

    if (isMoneySemantic(item.solution.semantic)) {
      if (!isWholeRational(item.solution.value)) fail(`${prototypeId}/${seed} has fractional money answer.`);
      for (const option of item.optionAudit) {
        if (!isWholeRational(option.result.value)) fractionalMoneyOptions += 1;
      }
    }

    stems.add(item.stem);
    fingerprints.add(item.mathematicalFingerprint);
    contexts.add(item.parameters.context.scenarioId);
    positions.add(item.correctIndex);
    for (const option of item.optionAudit) {
      misconceptions.add(option.misconceptionId);
      misconceptionCounts.set(
        option.misconceptionId,
        (misconceptionCounts.get(option.misconceptionId) ?? 0) + 1,
      );
    }

    difficultyCounts.set(item.difficulty, (difficultyCounts.get(item.difficulty) ?? 0) + 1);
    semanticCounts.set(item.answerSemantic, (semanticCounts.get(item.answerSemantic) ?? 0) + 1);
    contextCounts.set(
      item.parameters.context.scenarioId,
      (contextCounts.get(item.parameters.context.scenarioId) ?? 0) + 1,
    );
    const opening = item.stem.split(/\s+/u).slice(0, 6).join(" ").toLowerCase();
    openingCounts.set(opening, (openingCounts.get(opening) ?? 0) + 1);
    longestStem = Math.max(longestStem, item.stem.length);
    longestExplanation = Math.max(longestExplanation, explanation.length);
  }

  if (stems.size < 45) fail(`${prototypeId} has insufficient stem diversity: ${stems.size}.`);
  if (fingerprints.size < 45) fail(`${prototypeId} has insufficient mathematical diversity: ${fingerprints.size}.`);
  if (contexts.size < 5) fail(`${prototypeId} reaches too few contexts: ${contexts.size}.`);
  if (stable([...positions].sort()) !== stable([0, 1, 2, 3])) {
    fail(`${prototypeId} lacks answer-position coverage.`);
  }
  if (misconceptions.size < 4) fail(`${prototypeId} has too few misconception labels: ${misconceptions.size}.`);

  perPrototype[prototypeId] = {
    distinctStems: stems.size,
    distinctFingerprints: fingerprints.size,
    contexts: [...contexts].sort(),
    answerPositions: [...positions].sort(),
    misconceptionLabels: [...misconceptions].sort(),
  };
}

const [mostRepeatedOpening, maximumOpeningRepeat] = [...openingCounts.entries()]
  .sort((left, right) => right[1] - left[1])[0] ?? ["", 0];
if (maximumOpeningRepeat > 70) {
  fail(`Six-word opening "${mostRepeatedOpening}" repeats ${maximumOpeningRepeat} times.`);
}
if (fractionalMoneyOptions !== 0) {
  fail(`Found ${fractionalMoneyOptions} fractional money options.`);
}
if (misconceptionCounts.size < 18) {
  fail(`Chapter-wide misconception coverage is too narrow: ${misconceptionCounts.size}.`);
}

console.log(JSON.stringify({
  status: "PASS",
  generated,
  discoveryWaveId: "INT-CP001-GAP-WAVE-02",
  permanentQlCount: 0,
  prototypeCount: INT_CP001_WAVE2_PROTOTYPE_IDS.length,
  difficultyCounts: Object.fromEntries([...difficultyCounts.entries()].sort()),
  semanticCounts: Object.fromEntries([...semanticCounts.entries()].sort()),
  contextCounts: Object.fromEntries([...contextCounts.entries()].sort()),
  misconceptionCounts: Object.fromEntries([...misconceptionCounts.entries()].sort()),
  mostRepeatedOpening,
  maximumOpeningRepeat,
  fractionalMoneyOptions,
  longestStem,
  longestExplanation,
  perPrototype,
}, null, 2));
