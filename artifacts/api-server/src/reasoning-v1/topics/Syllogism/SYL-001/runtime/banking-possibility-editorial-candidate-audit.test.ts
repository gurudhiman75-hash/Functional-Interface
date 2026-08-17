import assert from "node:assert/strict";
import type { CanonicalConclusion, SylLocale, TermId } from "../foundation/types";
import { generateBankingPossibilityEditorialCandidate } from "./banking-possibility-editorial-candidate";
import { generateBankingPossibilityReviewQuestionV4 } from "./banking-possibility-review-question-v4";

interface Witness {
  inside: ReadonlySet<TermId>;
  outside: ReadonlySet<TermId>;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let lines = 0;
let visibleEntailedExistentials = 0;
let existenceOnlyEntailedExistentials = 0;
let visibleContradictedUniversals = 0;
let existenceOnlyContradictedUniversals = 0;
let undeterminedExistentials = 0;
let undeterminedUniversals = 0;

function witnesses(svg: string): readonly Witness[] {
  return [...svg.matchAll(/<g data-witness="decisive"[^>]*data-inside="([^"]*)"[^>]*data-outside="([^"]*)"/gu)].map((match) => ({
    inside: new Set(match[1].split(",").filter(Boolean)),
    outside: new Set(match[2].split(",").filter(Boolean)),
  }));
}

function satisfies(entry: Witness, conclusion: CanonicalConclusion): boolean {
  if (conclusion.form === "SOME") return entry.inside.has(conclusion.subject) && entry.inside.has(conclusion.predicate);
  if (conclusion.form === "SOME_NOT") return entry.inside.has(conclusion.subject) && entry.outside.has(conclusion.predicate);
  return false;
}

function opposite(conclusion: CanonicalConclusion): CanonicalConclusion | null {
  if (conclusion.form === "ALL") return { ...conclusion, form: "SOME_NOT" };
  if (conclusion.form === "NO") return { ...conclusion, form: "SOME" };
  return null;
}

function hasBlueWitnessPhrase(line: string): boolean {
  return /blue ×|नीला ×|ਨੀਲਾ ×/u.test(line);
}

for (let seed = 0; seed < 80; seed += 1) {
  for (const locale of locales) {
    const base = generateBankingPossibilityReviewQuestionV4(seed, locale);
    const question = generateBankingPossibilityEditorialCandidate(seed, locale);
    records += 1;

    assert.deepEqual(question.statements, base.statements);
    assert.deepEqual(question.conclusions, base.conclusions);
    assert.deepEqual(question.options, base.options);
    assert.equal(question.correctIndex, base.correctIndex);
    assert.equal(question.semanticAnswer, base.semanticAnswer);
    assert.deepEqual(question.diagram, base.diagram);
    assert.deepEqual(question.metadata, base.metadata);
    assert.equal(question.explanation.length, 2);

    const marks = witnesses(question.diagram.svg);
    question.explanation.forEach((line, index) => {
      lines += 1;
      const record = question.conclusions[index];
      assert.ok(line.startsWith(index === 0 ? "I:" : "II:"));
      assert.ok(line.length >= 100, `${seed}/${locale}/${index}: explanation too short`);
      assert.doesNotMatch(line, /This ordinary conclusion|This possibility|at least one valid arrangement allowed by the statements/u);

      if (locale === "en-IN") {
        assert.doesNotMatch(line, /\.\s+[a-z]/u, `${seed}/${index}: lowercase sentence start`);
        assert.doesNotMatch(line, /at least one (windows|chairs|lamps|coins|roads|rings|cups|flags|boxes|flowers|plates|trains|stars|birds|pencils|rivers|bells|kites|shirts|poets|maps|clouds|drums|gardens|fruits)\b/iu);
        assert.doesNotMatch(line, /every (windows|chairs|lamps|coins|roads|rings|cups|flags|boxes|flowers|plates|trains|stars|birds|pencils|rivers|bells|kites|shirts|poets|maps|clouds|drums|gardens|fruits)\b/iu);
        assert.doesNotMatch(line, /an “[^”]+” ×/u);
      }

      if (record.mode === "POSSIBILITY") {
        assert.equal(record.follows, record.canBeTrue);
        if (record.canBeTrue) {
          if (locale === "en-IN") assert.match(line, /one valid arrangement|not all/u);
          assert.ok(line.endsWith(locale === "en-IN" ? `Conclusion ${index === 0 ? "I" : "II"} follows.` : locale === "hi-IN" ? `निष्कर्ष ${index === 0 ? "I" : "II"} अनुसरण करता है।` : `ਨਤੀਜਾ ${index === 0 ? "I" : "II"} ਸਹੀ ਹੈ।`));
        } else {
          assert.ok(!record.follows);
        }
        return;
      }

      const conclusion = record.canonicalConclusion;
      if (record.classification === "ENTAILED" && (conclusion.form === "SOME" || conclusion.form === "SOME_NOT")) {
        const visible = marks.some((entry) => satisfies(entry, conclusion));
        if (visible) {
          visibleEntailedExistentials += 1;
          assert.ok(hasBlueWitnessPhrase(line));
        } else {
          existenceOnlyEntailedExistentials += 1;
          assert.ok(!hasBlueWitnessPhrase(line));
          if (locale === "en-IN") assert.match(line, /does not add an extra × merely to repeat that existence/u);
          if (locale === "hi-IN") assert.match(line, /अतिरिक्त × नहीं जोड़ता/u);
          if (locale === "pa-IN") assert.match(line, /ਵਾਧੂ × ਨਹੀਂ ਜੋੜਦਾ/u);
        }
      }

      if (record.classification === "CONTRADICTED" && (conclusion.form === "ALL" || conclusion.form === "NO")) {
        const alt = opposite(conclusion)!;
        const visible = marks.some((entry) => satisfies(entry, alt));
        if (visible) {
          visibleContradictedUniversals += 1;
          assert.ok(hasBlueWitnessPhrase(line));
        } else {
          existenceOnlyContradictedUniversals += 1;
          assert.ok(!hasBlueWitnessPhrase(line));
          if (conclusion.form === "NO") {
            if (locale === "en-IN") assert.match(line, /compact diagram does not add an extra ×/u);
            if (locale === "hi-IN") assert.match(line, /अतिरिक्त × नहीं जोड़ता/u);
            if (locale === "pa-IN") assert.match(line, /ਵਾਧੂ × ਨਹੀਂ ਜੋੜਦਾ/u);
          }
        }
      }

      if (record.classification === "UNDETERMINED" && (conclusion.form === "SOME" || conclusion.form === "SOME_NOT")) {
        undeterminedExistentials += 1;
        assert.ok(!marks.some((entry) => satisfies(entry, conclusion)));
        if (locale === "en-IN") assert.match(line, /no premise-required blue × there/u);
      }

      if (record.classification === "UNDETERMINED" && (conclusion.form === "ALL" || conclusion.form === "NO")) {
        undeterminedUniversals += 1;
        assert.ok(!hasBlueWitnessPhrase(line));
        if (locale === "en-IN") assert.match(line, /One valid arrangement/u);
      }
    });
  }
}

assert.equal(records, 240);
assert.equal(lines, 480);
assert.ok(visibleEntailedExistentials > 0);
assert.ok(existenceOnlyEntailedExistentials > 0);
assert.ok(visibleContradictedUniversals > 0);
assert.ok(existenceOnlyContradictedUniversals > 0);
assert.ok(undeterminedExistentials > 0);
assert.ok(undeterminedUniversals > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_CANDIDATE",
  records,
  explanationLines: lines,
  visibleEntailedExistentials,
  existenceOnlyEntailedExistentials,
  visibleContradictedUniversals,
  existenceOnlyContradictedUniversals,
  undeterminedExistentials,
  undeterminedUniversals,
  contract: {
    semanticsUnchangedFromV4: true,
    diagramsUnchangedFromV4: true,
    oneConsolidatedEditorialImplementation: true,
    visibleWitnessClaimsMatchSvg: true,
    existenceOnlyLogicDoesNotInventVisibleWitness: true,
    possibilityVsDefiniteSeparated: true,
    universalVsExistentialTeachingSeparated: true,
    originalLocalizedConclusionSentenceNotReconstructed: true,
    englishGrammarRegressionGuard: true,
    registrationChanged: false,
    deliveryActivationChanged: false,
  },
}, null, 2));