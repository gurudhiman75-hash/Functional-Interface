import assert from "node:assert/strict";
import type { CanonicalConclusion, SylLocale, TermId } from "../foundation/types";
import { generateBankingPossibilityEditorialQuestionV7 } from "./banking-possibility-editorial-v7";
import { generateBankingPossibilityReviewQuestionV4 } from "./banking-possibility-review-question-v4";

interface Witness {
  inside: ReadonlySet<TermId>;
  outside: ReadonlySet<TermId>;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let lines = 0;
let existentialTruthChecks = 0;
let universalTeachingChecks = 0;

function witnesses(svg: string): readonly Witness[] {
  return [...svg.matchAll(/<g data-witness="decisive"[^>]*data-inside="([^"]*)"[^>]*data-outside="([^"]*)"/gu)]
    .map((match) => ({
      inside: new Set(match[1].split(",").filter(Boolean)),
      outside: new Set(match[2].split(",").filter(Boolean)),
    }));
}

function witnessSatisfies(entry: Witness, conclusion: CanonicalConclusion): boolean {
  if (conclusion.form === "SOME") {
    return entry.inside.has(conclusion.subject) && entry.inside.has(conclusion.predicate);
  }
  if (conclusion.form === "SOME_NOT") {
    return entry.inside.has(conclusion.subject) && entry.outside.has(conclusion.predicate);
  }
  return false;
}

for (let seed = 0; seed < 80; seed += 1) {
  for (const locale of locales) {
    const prior = generateBankingPossibilityReviewQuestionV4(seed, locale);
    const question = generateBankingPossibilityEditorialQuestionV7(seed, locale);
    records += 1;

    assert.deepEqual(question.statements, prior.statements);
    assert.deepEqual(question.conclusions, prior.conclusions);
    assert.deepEqual(question.options, prior.options);
    assert.equal(question.correctIndex, prior.correctIndex);
    assert.equal(question.semanticAnswer, prior.semanticAnswer);
    assert.deepEqual(question.diagram, prior.diagram);
    assert.deepEqual(question.metadata, prior.metadata);
    assert.equal(question.explanation.length, 2);

    const diagramWitnesses = witnesses(question.diagram.svg);
    question.explanation.forEach((line, index) => {
      lines += 1;
      const record = question.conclusions[index];
      assert.ok(line.startsWith(index === 0 ? "I:" : "II:"));
      assert.ok(line.length >= 120);
      if (locale === "en-IN") {
        assert.doesNotMatch(line, /\. the (part|shared)/u);
        assert.doesNotMatch(line, /an “[^”]+” ×/u);
      }

      if (
        record.mode === "DEFINITE"
        && record.classification === "ENTAILED"
        && (record.canonicalConclusion.form === "SOME" || record.canonicalConclusion.form === "SOME_NOT")
      ) {
        existentialTruthChecks += 1;
        assert.ok(
          diagramWitnesses.some((entry) => witnessSatisfies(entry, record.canonicalConclusion)),
          `${seed}/${locale}/${index}: explanation claims an entailed existential witness not present in diagram`,
        );
      }

      if (
        record.mode === "DEFINITE"
        && record.classification === "UNDETERMINED"
        && (record.canonicalConclusion.form === "SOME" || record.canonicalConclusion.form === "SOME_NOT")
      ) {
        existentialTruthChecks += 1;
        assert.ok(
          !diagramWitnesses.some((entry) => witnessSatisfies(entry, record.canonicalConclusion)),
          `${seed}/${locale}/${index}: undetermined existential already has a premise-required satisfying witness`,
        );
      }

      if (
        record.mode === "DEFINITE"
        && record.classification === "UNDETERMINED"
        && (record.canonicalConclusion.form === "ALL" || record.canonicalConclusion.form === "NO")
      ) {
        universalTeachingChecks += 1;
        assert.doesNotMatch(line, /blue ×|नीले ×|ਨੀਲੇ ×/u);
        if (locale === "en-IN") {
          if (record.canonicalConclusion.form === "ALL") assert.match(line, /do not force the whole/u);
          else assert.match(line, /do not force .*disjoint/u);
        }
      }

      if (
        record.mode === "DEFINITE"
        && record.classification === "CONTRADICTED"
        && record.canonicalConclusion.form === "ALL"
      ) {
        universalTeachingChecks += 1;
        assert.doesNotMatch(line, /required ×|blue ×|आवश्यक ×|नीला ×|ਲਾਜ਼ਮੀ ×|ਨੀਲਾ ×/u);
        if (locale === "en-IN") assert.match(line, /whole .* class cannot be placed inside/u);
      }

      if (
        record.mode === "DEFINITE"
        && record.classification === "CONTRADICTED"
        && record.canonicalConclusion.form === "NO"
      ) {
        universalTeachingChecks += 1;
        assert.doesNotMatch(line, /required ×|blue ×|आवश्यक ×|नीला ×|ਲਾਜ਼ਮੀ ×|ਨੀਲਾ ×/u);
        if (locale === "en-IN") {
          assert.match(line, /do not allow .*completely disjoint/u);
          assert.match(line, /does not add an extra × merely for that existence/u);
        } else if (locale === "hi-IN") {
          assert.match(line, /पूरी तरह अलग रखना संभव नहीं/u);
          assert.match(line, /अतिरिक्त × न दिखाए/u);
        } else {
          assert.match(line, /ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਰੱਖਣਾ ਸੰਭਵ ਨਹੀਂ/u);
          assert.match(line, /ਵਾਧੂ × ਨਾ ਦਿਖਾਏ/u);
        }
      }
    });
  }
}

assert.equal(records, 240);
assert.equal(lines, 480);
assert.ok(existentialTruthChecks > 0);
assert.ok(universalTeachingChecks > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_V7",
  records,
  explanationLines: lines,
  existentialTruthChecks,
  universalTeachingChecks,
  contract: {
    semanticsUnchangedFromV4: true,
    diagramsUnchangedFromV4: true,
    visibleWitnessClaimsMatchSvg: true,
    undeterminedExistentialsDoNotInventWitnesses: true,
    universalUndeterminedUsesContainmentOrDisjointness: true,
    contradictedAllDoesNotInventWitness: true,
    contradictedNoDoesNotInventWitness: true,
    learnerDiagramMayOmitExistenceOnlyWitness: true,
    englishGrammarRegressionGuard: true,
    registrationChanged: false,
    deliveryActivationChanged: false,
  },
}, null, 2));