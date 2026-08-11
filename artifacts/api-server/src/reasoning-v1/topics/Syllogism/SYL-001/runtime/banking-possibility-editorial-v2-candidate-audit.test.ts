import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateBankingPossibilityEditorialV2Candidate } from "./banking-possibility-editorial-v2-candidate";
import { generateBankingPossibilityReviewQuestionV2Corrected } from "./banking-possibility-review-question-v2-corrected";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

let records = 0;
let explanationLines = 0;
let changedExplanationRecords = 0;
const dispositions: Record<string, number> = {};
const possibilityForms: Record<string, number> = {};
const ordinaryClasses: Record<string, number> = {};
const geometrySources: Record<string, number> = {};
const answerStatuses: Record<string, number> = {};
const localeCounts: Record<string, number> = {};

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

function assertNoInternalJargon(line: string): void {
  assert.doesNotMatch(
    line,
    /canBeTrue|canBeFalse|UNDETERMINED|ENTAILED|CONTRADICTED|OPEN_POSSIBILITY|ALREADY_DEFINITE|IMPOSSIBLE|classification/u,
  );
}

for (const seed of seeds) {
  const localeQuestions = locales.map((locale) => {
    const base = generateBankingPossibilityReviewQuestionV2Corrected(seed, locale);
    const candidate = generateBankingPossibilityEditorialV2Candidate(seed, locale);
    const { explanation: baseExplanation, ...baseInvariant } = base;
    const { explanation: candidateExplanation, ...candidateInvariant } = candidate;

    // Editorial V2 is presentation-only: everything except explanation is immutable.
    assert.deepEqual(candidateInvariant, baseInvariant);
    assert.notDeepEqual(candidateExplanation, baseExplanation);
    changedExplanationRecords += 1;

    records += 1;
    explanationLines += candidateExplanation.length;
    assert.equal(candidateExplanation.length, 2);
    assert.match(candidateExplanation[0], /^I:/u);
    assert.match(candidateExplanation[1], /^II:/u);
    candidateExplanation.forEach(assertNoInternalJargon);

    assert.equal(candidate.metadata.possibilitySemanticProfile, "BANKING_EXAM_POSSIBILITY_V2");
    assert.equal(candidate.metadata.legacyQlChanged, false);
    assert.equal(candidate.metadata.registeredQlCreated, false);
    assert.equal(candidate.metadata.connectedToProfilePlanner, false);
    assert.equal(candidate.metadata.questionStudioVisible, false);
    assert.equal(candidate.metadata.questionBankWritable, false);
    assert.equal(candidate.metadata.testEligible, false);
    assert.equal(candidate.metadata.publiclyPublishable, false);
    assert.equal(candidate.diagram.enabled, true);
    assert.equal(candidate.diagram.premiseOnly, true);
    assert.equal(candidate.diagram.diagramCount, 1);

    candidate.conclusions.forEach((conclusion, index) => {
      const line = candidateExplanation[index];
      assert.ok(line);
      if (locale === "en-IN") {
        assert.match(line, /Conclusion (I|II) (follows|does not follow)\.$/u);
      } else if (locale === "hi-IN") {
        assert.match(line, /इसलिए निष्कर्ष (I|II) (अनुसरण करता है|अनुसरण नहीं करता)।$/u);
      } else {
        assert.match(line, /ਇਸ ਲਈ ਨਤੀਜਾ (I|II) (ਸਹੀ ਹੈ|ਸਹੀ ਨਹੀਂ ਹੈ)।$/u);
      }

      if (conclusion.mode === "POSSIBILITY") {
        assert.ok(conclusion.possibilityDisposition);
        increment(dispositions, conclusion.possibilityDisposition);
        increment(possibilityForms, conclusion.canonicalConclusion.form);

        if (conclusion.possibilityDisposition === "OPEN_POSSIBILITY") {
          assert.equal(conclusion.follows, true);
          if (locale === "en-IN") assert.match(line, /open possibility/u);
          if (locale === "hi-IN") assert.match(line, /खुली संभावना/u);
          if (locale === "pa-IN") assert.match(line, /ਖੁੱਲ੍ਹੀ ਸੰਭਾਵਨਾ/u);
        } else if (conclusion.possibilityDisposition === "ALREADY_DEFINITE") {
          assert.equal(conclusion.follows, false);
          if (locale === "en-IN") assert.match(line, /already make|already definite/u);
          if (locale === "hi-IN") assert.match(line, /पहले से निश्चित/u);
          if (locale === "pa-IN") assert.match(line, /ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ/u);
        } else {
          assert.equal(conclusion.follows, false);
          if (locale === "en-IN") assert.match(line, /impossible/u);
          if (locale === "hi-IN") assert.match(line, /असंभव/u);
          if (locale === "pa-IN") assert.match(line, /ਅਸੰਭਵ/u);
        }

        if (conclusion.canonicalConclusion.form === "ALL") {
          if (locale === "en-IN") assert.match(line, /whole|all/u);
          if (locale === "hi-IN") assert.match(line, /सभी|पूरे/u);
          if (locale === "pa-IN") assert.match(line, /ਸਾਰੇ|ਪੂਰੇ/u);
        }
      } else {
        increment(ordinaryClasses, conclusion.classification);
        assert.equal(conclusion.follows, conclusion.classification === "ENTAILED");
        if (conclusion.classification === "UNDETERMINED") {
          if (locale === "en-IN") assert.match(line, /Mere possibility is not enough/u);
          if (locale === "hi-IN") assert.match(line, /केवल संभावना पर्याप्त नहीं/u);
          if (locale === "pa-IN") assert.match(line, /ਸਿਰਫ਼ ਸੰਭਾਵਨਾ ਕਾਫ਼ੀ ਨਹੀਂ/u);
        }
      }
    });

    increment(geometrySources, candidate.diagram.geometrySource);
    increment(answerStatuses, candidate.semanticAnswer);
    increment(localeCounts, candidate.locale);
    return candidate;
  });

  const canonical = localeQuestions[0];
  for (const question of localeQuestions.slice(1)) {
    assert.equal(question.scenarioId, canonical.scenarioId);
    assert.equal(question.sourcePatternId, canonical.sourcePatternId);
    assert.equal(question.semanticAnswer, canonical.semanticAnswer);
    assert.equal(question.correctIndex, canonical.correctIndex);
    assert.deepEqual(
      question.conclusions.map((entry) => ({
        mode: entry.mode,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        possibilityDisposition: entry.possibilityDisposition,
      })),
      canonical.conclusions.map((entry) => ({
        mode: entry.mode,
        canonicalConclusion: entry.canonicalConclusion,
        follows: entry.follows,
        classification: entry.classification,
        canBeTrue: entry.canBeTrue,
        canBeFalse: entry.canBeFalse,
        possibilityDisposition: entry.possibilityDisposition,
      })),
    );
  }
}

assert.equal(records, 240);
assert.equal(explanationLines, 480);
assert.equal(changedExplanationRecords, 240);
for (const disposition of ["OPEN_POSSIBILITY", "ALREADY_DEFINITE", "IMPOSSIBLE"]) {
  assert.ok((dispositions[disposition] ?? 0) > 0, `${disposition} must be represented.`);
}
for (const form of ["ALL", "SOME", "SOME_NOT"]) {
  assert.ok((possibilityForms[form] ?? 0) > 0, `${form} possibility must be represented.`);
}
for (const classification of ["ENTAILED", "UNDETERMINED", "CONTRADICTED"]) {
  assert.ok((ordinaryClasses[classification] ?? 0) > 0, `${classification} ordinary conclusion must be represented.`);
}
for (const status of ["ONLY_FIRST_FOLLOWS", "ONLY_SECOND_FOLLOWS", "BOTH_FOLLOW", "NEITHER_FOLLOWS"]) {
  assert.ok((answerStatuses[status] ?? 0) > 0, `${status} must be represented.`);
}
assert.deepEqual(localeCounts, { "en-IN": 80, "hi-IN": 80, "pa-IN": 80 });

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_V2_CANDIDATE",
  records,
  explanationLines,
  changedExplanationRecords,
  semanticAndDiagramParity: true,
  possibilityDispositions: dispositions,
  possibilityForms,
  ordinaryClasses,
  geometrySources,
  answerStatuses,
  locales: localeCounts,
  learnerRules: {
    openPossibility: "accepted",
    alreadyDefinitePossibility: "rejected under Banking V2 convention",
    impossiblePossibility: "rejected",
    ordinaryConclusion: "must hold in every valid arrangement",
    internalSolverJargonExposed: false,
  },
  locks: {
    legacyQlChanged: false,
    registeredQlCreated: false,
    connectedToProfilePlanner: false,
    questionStudioVisible: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    activationPermitted: false,
  },
}, null, 2));
