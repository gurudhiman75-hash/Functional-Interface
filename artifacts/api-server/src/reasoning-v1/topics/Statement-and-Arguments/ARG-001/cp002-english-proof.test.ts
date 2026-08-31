import { ARG_ENGLISH_ARCHETYPE_BY_SCENARIO } from "./cp002-archetype-ledger.ts";
import { ARG_ENGLISH_AUTHORITIES } from "./english-authorities.ts";
import { answerClassForArguments, assertArgumentAuthorityConsistent } from "./strength-model.ts";
import { ARG_QL_IDS, type ArgAnswerClass } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function words(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

assert(ARG_ENGLISH_AUTHORITIES.length === 48, `Expected 48 active English authorities, got ${ARG_ENGLISH_AUTHORITIES.length}`);
assert(Object.keys(ARG_ENGLISH_ARCHETYPE_BY_SCENARIO).length === 48, "Archetype ledger must cover exactly 48 scenario IDs");

const scenarioIds = new Set<string>();
const learnerSurfaces = new Set<string>();
const allWeakDefects = new Set<string>();
const bannedToyPhrases = [
  "attractive colours",
  "favourite colour",
  "named after a fruit",
  "born in january",
  "particular hometown",
  "because it is good",
  "because it is bad",
];

for (const scenario of ARG_ENGLISH_AUTHORITIES) {
  assert(!scenarioIds.has(scenario.id), `${scenario.id}: duplicate active scenario ID`);
  scenarioIds.add(scenario.id);

  assert(scenario.id in ARG_ENGLISH_ARCHETYPE_BY_SCENARIO, `${scenario.id}: missing archetype ledger entry`);
  assert(/^Should\b/.test(scenario.statement), `${scenario.id}: active V1 statement must use exam-facing issue/question form`);
  assert(words(scenario.statement) >= 8, `${scenario.id}: statement too thin for CP002 exam-realness`);

  const surfaceKey = normalized(`${scenario.statement} ${scenario.arguments[0].text} ${scenario.arguments[1].text}`);
  assert(!learnerSurfaces.has(surfaceKey), `${scenario.id}: duplicate learner-visible semantic surface`);
  learnerSurfaces.add(surfaceKey);

  for (const argument of scenario.arguments) {
    assertArgumentAuthorityConsistent(argument);
    assert(words(argument.text) >= 10, `${argument.id}: argument too short/thin for CP002`);
    assert(/^Yes\.|^No\./.test(argument.text), `${argument.id}: expected exam-facing Yes/No argument presentation`);
    for (const phrase of bannedToyPhrases) {
      assert(!argument.text.toLowerCase().includes(phrase), `${argument.id}: toy/calibration phrase survived active CP002 corpus: ${phrase}`);
    }
    for (const defect of argument.weaknessDefects) allWeakDefects.add(defect);
  }

  const actual = answerClassForArguments(scenario.arguments);
  assert(actual === scenario.expectedAnswerClass, `${scenario.id}: semantic classifier says ${actual}, authority says ${scenario.expectedAnswerClass}`);
}

for (const ledgerId of Object.keys(ARG_ENGLISH_ARCHETYPE_BY_SCENARIO)) {
  assert(scenarioIds.has(ledgerId), `${ledgerId}: archetype ledger points to a non-active scenario`);
}

for (const qlId of ARG_QL_IDS) {
  const scenarios = ARG_ENGLISH_AUTHORITIES.filter((entry) => entry.qlId === qlId);
  assert(scenarios.length === 8, `${qlId}: expected 8 active English authorities, got ${scenarios.length}`);

  const archetypes = new Set(
    scenarios.map((entry) => ARG_ENGLISH_ARCHETYPE_BY_SCENARIO[entry.id as keyof typeof ARG_ENGLISH_ARCHETYPE_BY_SCENARIO]),
  );
  assert(archetypes.size === 8, `${qlId}: expected 8 distinct archetypes, got ${archetypes.size}`);

  const answerCounts = new Map<ArgAnswerClass, number>([
    ["ONLY_I", 0], ["ONLY_II", 0], ["BOTH", 0], ["NEITHER", 0],
  ]);
  for (const scenario of scenarios) {
    answerCounts.set(scenario.expectedAnswerClass, (answerCounts.get(scenario.expectedAnswerClass) ?? 0) + 1);
  }
  for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
    assert(answerCounts.get(answerClass) === 2, `${qlId}: expected exactly two ${answerClass} scenarios`);
  }

  const argumentsInQl = scenarios.flatMap((entry) => entry.arguments);
  for (const [stance, strength] of [
    ["SUPPORTS", "STRONG"],
    ["SUPPORTS", "WEAK"],
    ["OPPOSES", "STRONG"],
    ["OPPOSES", "WEAK"],
  ] as const) {
    assert(
      argumentsInQl.some((entry) => entry.stance === stance && entry.expectedStrength === strength),
      `${qlId}: missing ${stance}/${strength}; stance must not predict strength`,
    );
  }

  const bothScenarios = scenarios.filter((entry) => entry.expectedAnswerClass === "BOTH");
  assert(
    bothScenarios.some((entry) => entry.arguments[0].stance !== entry.arguments[1].stance),
    `${qlId}: BOTH class must demonstrate that opposing arguments can both be strong`,
  );

  const domains = new Set(scenarios.map((entry) => entry.domain));
  assert(domains.size >= 4, `${qlId}: context diversity too thin (${domains.size} domains)`);
}

assert(allWeakDefects.size >= 12, `Weak-argument defect coverage too thin: ${allWeakDefects.size}`);
assert(learnerSurfaces.size === 48, "Active English surface uniqueness failed");

console.log(JSON.stringify({
  chapter: "ARG-001",
  checkpoint: "ARG-CP-002",
  activeEnglishAuthorities: ARG_ENGLISH_AUTHORITIES.length,
  authoritiesPerQl: 8,
  distinctArchetypesPerQl: 8,
  answerClassCountPerQl: { ONLY_I: 2, ONLY_II: 2, BOTH: 2, NEITHER: 2 },
  weakDefectFamiliesObserved: allWeakDefects.size,
  stanceStrengthIndependence: "PROVEN_IN_EVERY_QL",
  opposingArgumentsCanBothBeStrong: "PROVEN_IN_EVERY_QL",
  learnerSurfaceUniqueness: learnerSurfaces.size,
  localization: "PENDING_CP004",
  questionStudioRegistration: "CLOSED_UNTIL_CP005",
  learnerRelease: "LOCKED",
}, null, 2));
