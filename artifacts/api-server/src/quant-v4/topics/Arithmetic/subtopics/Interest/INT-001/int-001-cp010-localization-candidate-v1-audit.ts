import {
  INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES,
} from "./cp010-production-authoring-candidate-v1";
import { generateIntCp010ProductionCandidateV2 } from "./cp010-production-authoring-candidate-v2-realism";
import {
  INT_CP010_LOCALIZATION_CANDIDATE_VERSION,
  INT_CP010_LOCALIZATION_LANGUAGES,
  generateIntCp010LocalizedCandidate,
} from "./cp010-localization-authoring-candidate-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `${current}n` : current);
}

assert(INT_CP010_LOCALIZATION_CANDIDATE_VERSION === "INT-CP-010-HI-PA-AUTHORING-CANDIDATE-v1", "CP010 localization candidate version drifted");
assert(INT_CP010_LOCALIZATION_LANGUAGES.join(",") === "hi,pa", "CP010 localization language set drifted");

let localizedQuestions = 0;
let deterministicChecks = 0;
let parityChecks = 0;
let scriptChecks = 0;
let arithmeticChecks = 0;
let lifecycleChecks = 0;
let terminologyChecks = 0;
const familyCoverage = new Set<string>();
const contextCoverage = new Set<string>();

for (const authorityId of INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES) {
  for (const language of INT_CP010_LOCALIZATION_LANGUAGES) {
    for (let index = 0; index < 500; index += 1) {
      const seed = `cp010:locale-candidate:${authorityId}:${language}:${index}`;
      const en = generateIntCp010ProductionCandidateV2(authorityId, seed) as any;
      const q = generateIntCp010LocalizedCandidate(authorityId, seed, language) as any;
      localizedQuestions += 1;
      familyCoverage.add(`${authorityId}:${language}:${q.stemFamilyId}`);
      contextCoverage.add(`${authorityId}:${language}:${q.context}`);

      if (index % 20 === 0) {
        assert(stable(q) === stable(generateIntCp010LocalizedCandidate(authorityId, seed, language)), `${authorityId}/${language}/${seed}: nondeterministic localization replay`);
        deterministicChecks += 1;
      }

      assert(q.authorityId === en.authorityId && q.sourcePrototypeId === en.sourcePrototypeId, `${authorityId}/${language}/${seed}: authority/prototype changed in localization`);
      assert(q.mathematicalFingerprint === en.mathematicalFingerprint && stable(q.mathematicalState) === stable(en.mathematicalState), `${authorityId}/${language}/${seed}: mathematics changed in localization`);
      assert(stable(q.answer) === stable(en.answer) && q.correctIndex === en.correctIndex && q.correctAnswer === en.correctAnswer, `${authorityId}/${language}/${seed}: answer binding changed in localization`);
      assert(stable(q.options) === stable(en.options), `${authorityId}/${language}/${seed}: options changed in localization`);
      parityChecks += 4;

      const learner = `${q.stem}\n${q.explanation.keyIdea}\n${q.explanation.steps.join("\n")}\n${q.explanation.finalAnswer}`;
      if (language === "hi") {
        assert(/[\u0900-\u097f]/u.test(q.stem), `${authorityId}/${seed}: Hindi script missing from stem`);
        assert(/[\u0900-\u097f]/u.test(q.explanation.keyIdea), `${authorityId}/${seed}: Hindi script missing from key idea`);
      } else {
        assert(/[\u0a00-\u0a7f]/u.test(q.stem), `${authorityId}/${seed}: Punjabi script missing from stem`);
        assert(/[\u0a00-\u0a7f]/u.test(q.explanation.keyIdea), `${authorityId}/${seed}: Punjabi script missing from key idea`);
        assert(!learner.includes("ਚੱਕਰਵੱਧੀ"), `${authorityId}/${seed}: deprecated Punjabi compound-interest term leaked`);
        terminologyChecks += 1;
      }
      assert(!/(?:undefined|null|NaN|after after)/u.test(learner), `${authorityId}/${language}/${seed}: invalid localization token`);
      scriptChecks += 3;

      assert(q.explanation.steps.some((step: string) => step.includes("=")), `${authorityId}/${language}/${seed}: worked arithmetic missing`);
      assert(q.explanation.steps.filter((step: string) => step.includes("=")).length >= q.mathematicalState.periodRatesPercent.length, `${authorityId}/${language}/${seed}: localized recurrence arithmetic incomplete`);
      assert(q.explanation.finalAnswer === q.correctAnswer, `${authorityId}/${language}/${seed}: localized conclusion drifted`);
      arithmeticChecks += 3;

      assert(q.permanentQlId === null && q.permanentIdentityAllocated === false, `${authorityId}/${language}/${seed}: permanent identity leaked`);
      assert(q.lifecycle.questionStudioDiscoverable === false && q.lifecycle.questionBankWritable === false && q.lifecycle.testEligible === false && q.lifecycle.publiclyPublishable === false, `${authorityId}/${language}/${seed}: downstream localization gate leaked`);
      lifecycleChecks += 2;

      assert(Object.isFrozen(q) && Object.isFrozen(q.explanation) && Object.isFrozen(q.mathematicalState), `${authorityId}/${language}/${seed}: localized candidate mutable`);
    }
  }
}

assert(localizedQuestions === 2000, `Expected 2000 localized candidates, got ${localizedQuestions}`);
assert(familyCoverage.size === 32, `Expected 32 authority/language/stem-family combinations, got ${familyCoverage.size}`);
assert(contextCoverage.size === 32, `Expected 32 authority/language/context combinations, got ${contextCoverage.size}`);
assert(terminologyChecks === 1000, `Expected 1000 Punjabi terminology checks, got ${terminologyChecks}`);

console.log(JSON.stringify({
  localizationCandidateVersion: INT_CP010_LOCALIZATION_CANDIDATE_VERSION,
  authorities: INT_CP010_PRODUCTION_CANDIDATE_AUTHORITIES.length,
  languages: INT_CP010_LOCALIZATION_LANGUAGES,
  localizedQuestions,
  deterministicChecks,
  parityChecks,
  scriptChecks,
  arithmeticChecks,
  lifecycleChecks,
  terminologyChecks,
  authorityLanguageStemFamilies: familyCoverage.size,
  authorityLanguageContexts: contextCoverage.size,
  permanentQlCount: 0,
  permanentIdsAllocated: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP010_LOCALIZATION_CANDIDATE_V1_AUDIT");
