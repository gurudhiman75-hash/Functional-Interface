import { STC_FIVE_WAY_EITHER_AUTHORITIES } from "./five-way-either-authorities.ts";
import { STC_FIVE_WAY_EITHER_EXPANSION_V1 } from "./five-way-either-expansion-v1.ts";
import { generateStcFiveWayQuestion } from "./five-way-profile.ts";
import { stcEntails, stcExclusiveEither } from "./truth-model-solver.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const EITHER_AUTHORITIES = [...STC_FIVE_WAY_EITHER_AUTHORITIES, ...STC_FIVE_WAY_EITHER_EXPANSION_V1] as const;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(STC_FIVE_WAY_EITHER_AUTHORITIES.length === 3, "historical five-way baseline must remain 3 authorities");
assert(STC_FIVE_WAY_EITHER_EXPANSION_V1.length === 6, "five-way expansion must contain 6 authorities");
assert(EITHER_AUTHORITIES.length === 9, "current five-way authority pool must contain 9 authorities");

for (const scenario of EITHER_AUTHORITIES) {
  const first = scenario.candidates[0];
  const second = scenario.candidates[1];
  assert(!stcEntails(scenario.premises, first.expression), `${scenario.id}: first conclusion must not follow individually`);
  assert(!stcEntails(scenario.premises, second.expression), `${scenario.id}: second conclusion must not follow individually`);
  assert(stcExclusiveEither(scenario.premises, first.expression, second.expression), `${scenario.id}: conclusions must be exclusive/exhaustive`);
}

for (const qlId of STC_QL_IDS) {
  const classes = new Set<string>();
  const eitherScenarioIds = new Set<string>();
  for (let seed = 0; seed < 4096; seed += 1) {
    const en = generateStcFiveWayQuestion({ qlId, locale: "en-IN", seed });
    const again = generateStcFiveWayQuestion({ qlId, locale: "en-IN", seed });
    assert(JSON.stringify(en) === JSON.stringify(again), `${qlId}/${seed}: nondeterministic five-way output`);
    assert(en.presentationProfile === "FIVE_WAY_EITHER", `${qlId}/${seed}: profile drift`);
    assert(en.options.length === 5 && new Set(en.options).size === 5, `${qlId}/${seed}: five unique options required`);
    assert(en.correctIndex >= 0 && en.correctIndex < 5, `${qlId}/${seed}: invalid five-way answer index`);
    if (en.answerClass === "EITHER") {
      assert(en.correctIndex === 2, `${qlId}/${seed}: either index drift`);
      eitherScenarioIds.add(en.scenarioId);
    }
    assert(en.metadata.reviewOnly, `${qlId}/${seed}: review-only lock missing`);
    assert(!en.metadata.questionBankWritable && !en.metadata.testEligible && !en.metadata.mockEligible && !en.metadata.publicEligible, `${qlId}/${seed}: delivery gate opened`);
    classes.add(en.answerClass);

    for (const locale of LOCALES) {
      const localized = generateStcFiveWayQuestion({ qlId, locale, seed });
      assert(localized.scenarioId === en.scenarioId, `${qlId}/${seed}/${locale}: scenario parity`);
      assert(localized.answerClass === en.answerClass, `${qlId}/${seed}/${locale}: answer class parity`);
      assert(localized.correctIndex === en.correctIndex, `${qlId}/${seed}/${locale}: answer index parity`);
      assert(localized.options.length === 5, `${qlId}/${seed}/${locale}: option count parity`);
    }
  }
  if (qlId === "STC-QL-002") {
    assert(classes.has("EITHER"), "STC-QL-002 five-way profile must reach EITHER");
    assert(classes.size === 5, `STC-QL-002 must reach all five classes, got ${[...classes].join(",")}`);
    assert(eitherScenarioIds.size === 9, `STC-QL-002 must reach all 9 five-way either authorities, got ${eitherScenarioIds.size}`);
    for (const scenario of EITHER_AUTHORITIES) assert(eitherScenarioIds.has(scenario.id), `${scenario.id}: dedicated five-way authority unreachable`);
  } else {
    assert(!classes.has("EITHER"), `${qlId}: either-or must not be manufactured outside the validated authority family`);
    assert(classes.size === 4, `${qlId}: four ordinary classes must remain reachable`);
  }
}

console.log(`STC five-way profile proof passed: ${EITHER_AUTHORITIES.length} exclusive either authorities (3 historical + 6 expansion) and all 6 QLs.`);
