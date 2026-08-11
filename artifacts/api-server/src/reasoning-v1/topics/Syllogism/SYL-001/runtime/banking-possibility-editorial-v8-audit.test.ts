import assert from "node:assert/strict";
import type { CanonicalConclusion, SylLocale, TermId } from "../foundation/types";
import { generateBankingPossibilityEditorialQuestionV6 } from "./banking-possibility-editorial-v6";
import { generateBankingPossibilityEditorialQuestionV7 } from "./banking-possibility-editorial-v7";
import { generateBankingPossibilityEditorialQuestionV8 } from "./banking-possibility-editorial-v8";

interface Witness {
  inside: ReadonlySet<TermId>;
  outside: ReadonlySet<TermId>;
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
let changedLines = 0;
let visibleContradictions = 0;
let existenceOnlyContradictions = 0;

function witnesses(svg: string): readonly Witness[] {
  return [...svg.matchAll(/<g data-witness="decisive"[^>]*data-inside="([^"]*)"[^>]*data-outside="([^"]*)"/gu)]
    .map((match) => ({
      inside: new Set(match[1].split(",").filter(Boolean)),
      outside: new Set(match[2].split(",").filter(Boolean)),
    }));
}

function satisfies(entry: Witness, conclusion: CanonicalConclusion): boolean {
  if (conclusion.form === "SOME") {
    return entry.inside.has(conclusion.subject) && entry.inside.has(conclusion.predicate);
  }
  if (conclusion.form === "SOME_NOT") {
    return entry.inside.has(conclusion.subject) && entry.outside.has(conclusion.predicate);
  }
  return false;
}

function opposite(conclusion: CanonicalConclusion): CanonicalConclusion | null {
  if (conclusion.form === "ALL") return { ...conclusion, form: "SOME_NOT" };
  if (conclusion.form === "NO") return { ...conclusion, form: "SOME" };
  return null;
}

function normalizeVisibleWitnessLine(line: string, locale: SylLocale): string {
  if (locale === "hi-IN") {
    return line.replace("एक आवश्यक ×", "नीला ×");
  }
  if (locale === "pa-IN") {
    return line.replace("ਇੱਕ ਲਾਜ਼ਮੀ ×", "ਨੀਲਾ ×");
  }
  return line
    .replace(". the part of the ", ". The part of the ")
    .replace(". the shared region of the ", ". The shared region of the ")
    .replaceAll("a required ×", "the blue ×")
    .replace(/an “([^”]+)” × cannot lie outside “([^”]+)”/gu, "a witness for the “$1” class cannot lie outside the “$2” class");
}

for (let seed = 0; seed < 80; seed += 1) {
  for (const locale of locales) {
    const v6 = generateBankingPossibilityEditorialQuestionV6(seed, locale);
    const v7 = generateBankingPossibilityEditorialQuestionV7(seed, locale);
    const v8 = generateBankingPossibilityEditorialQuestionV8(seed, locale);
    records += 1;

    assert.deepEqual(v8.statements, v7.statements);
    assert.deepEqual(v8.conclusions, v7.conclusions);
    assert.deepEqual(v8.options, v7.options);
    assert.equal(v8.correctIndex, v7.correctIndex);
    assert.equal(v8.semanticAnswer, v7.semanticAnswer);
    assert.deepEqual(v8.diagram, v7.diagram);
    assert.deepEqual(v8.metadata, v7.metadata);

    const diagramWitnesses = witnesses(v8.diagram.svg);
    v8.explanation.forEach((line, index) => {
      const record = v8.conclusions[index];
      const alt = record.mode === "DEFINITE" && record.classification === "CONTRADICTED"
        ? opposite(record.canonicalConclusion)
        : null;
      const visible = Boolean(alt && diagramWitnesses.some((entry) => satisfies(entry, alt)));

      if (visible) {
        visibleContradictions += 1;
        changedLines += 1;
        assert.equal(line, normalizeVisibleWitnessLine(v6.explanation[index], locale));
        if (locale === "en-IN") assert.match(line, /blue ×/u);
        else if (locale === "hi-IN") assert.match(line, /नीला ×/u);
        else assert.match(line, /ਨੀਲਾ ×/u);
      } else {
        assert.equal(line, v7.explanation[index]);
        if (alt) {
          existenceOnlyContradictions += 1;
          assert.doesNotMatch(line, /blue ×|नीला ×|ਨੀਲਾ ×/u);
        }
      }

      if (locale === "en-IN") {
        assert.doesNotMatch(line, /\. the (part|shared)/u);
        assert.doesNotMatch(line, /an “[^”]+” ×/u);
      }
    });
  }
}

assert.equal(records, 240);
assert.ok(changedLines > 0);
assert.equal(changedLines, visibleContradictions);
assert.ok(existenceOnlyContradictions > 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_V8",
  records,
  changedLines,
  visibleContradictions,
  existenceOnlyContradictions,
  contract: {
    semanticsUnchangedFromV7: true,
    diagramsUnchangedFromV7: true,
    onlyVisibleContradictedAllNoMayChange: true,
    visibleOppositeWitnessPreferred: true,
    existenceOnlyContradictionKeepsRelationProof: true,
    englishGrammarRegressionGuard: true,
    registrationChanged: false,
    deliveryActivationChanged: false,
  },
}, null, 2));