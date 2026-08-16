import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingPossibilityEditorialV3,
  SYL_BANKING_POSSIBILITY_EDITORIAL_V3,
} from "./banking-possibility-editorial-v3";
import { generateBankingPossibilityShellV2 } from "./banking-possibility-shell-v2";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);

let records = 0;
let semanticParity = 0;
let termSpecificLines = 0;
let diagrams = 0;
let omittedDiagrams = 0;
let genericEnglishLines = 0;
let nonEnglishEnglishConventionLeaks = 0;
const schemaCounts: Record<string, number> = {};
const geometryCounts: Record<string, number> = {};

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

for (const seed of seeds) {
  for (const locale of locales) {
    records += 1;
    const shell = generateBankingPossibilityShellV2(seed, locale);
    const editorial = generateBankingPossibilityEditorialV3(seed, locale);

    assert.equal(editorial.authority, shell.authority);
    assert.equal(editorial.editorialAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3");
    assert.equal(editorial.semanticAuthority, "SYL_001_BANKING_POSSIBILITY_SHELL_V2");
    assert.deepEqual(editorial.statements, shell.statements);
    assert.deepEqual(editorial.conclusions, shell.conclusions);
    assert.deepEqual(editorial.options, shell.options);
    assert.equal(editorial.correctIndex, shell.correctIndex);
    assert.equal(editorial.semanticAnswer, shell.semanticAnswer);
    assert.deepEqual(editorial.metadata, shell.metadata);
    semanticParity += 1;

    assert.equal(editorial.explanation.length, 2);
    assert.equal(editorial.visualPolicy.stemDiagram, "NONE");
    assert.equal(editorial.visualPolicy.solutionDiagram, "ONE_COMBINED_PREMISE_DIAGRAM");
    assert.equal(editorial.visualPolicy.disclosure, "AFTER_ATTEMPT");
    assert.equal(editorial.visualPolicy.separateConclusionDiagrams, false);
    assert.equal(editorial.visualPolicy.counterexampleSupplement, "TEXT_ONLY_WHEN_NEEDED_V3");

    const scenario = scenariosForGroup(editorial.scenarioGroup).find((entry) => entry.scenarioId === editorial.scenarioId);
    assert.ok(scenario, `${editorial.scenarioId}: missing scenario in Editorial V3 audit`);
    const assignment = assignTerms("SYL-QL-005", seed, analyzeScenario(scenario!).termOrder);

    editorial.conclusions.forEach((conclusion, index) => {
      const subject = assignment[conclusion.canonicalConclusion.subject]?.labels[locale];
      const predicate = assignment[conclusion.canonicalConclusion.predicate]?.labels[locale];
      assert.ok(subject);
      assert.ok(predicate);
      const line = editorial.explanation[index];
      assert.ok(line.includes(subject!), `${seed}/${locale}/${index}: explanation must name subject term`);
      assert.ok(line.includes(predicate!), `${seed}/${locale}/${index}: explanation must name predicate term`);
      termSpecificLines += 1;
      if (locale === "en-IN" && /The relation is|The ordinary conclusion/u.test(line)) genericEnglishLines += 1;
      if (locale !== "en-IN" && /Banking possibility convention/u.test(line)) nonEnglishEnglishConventionLeaks += 1;
    });

    const diagram = editorial.diagram;
    increment(schemaCounts, diagram.schemaVersion);
    increment(geometryCounts, diagram.geometrySource);
    assert.equal(diagram.premiseOnly, true);
    assert.equal(diagram.mobileViewBoxWidth, 340);
    assert.equal(diagram.diagramCount, 1);
    assert.equal(diagram.enabled, true);
    assert.ok(diagram.svg);
    assert.ok(diagram.caption);
    assert.ok(diagram.accessibleDescription);
    assert.ok(diagram.svg?.includes('data-premise-only="true"'));
    if (diagram.enabled && diagram.diagramCount === 1 && diagram.svg) diagrams += 1;
    else omittedDiagrams += 1;

    assert.equal(editorial.metadata.legacyQlChanged, false);
    assert.equal(editorial.metadata.registeredQlCreated, false);
    assert.equal(editorial.metadata.connectedToProfilePlanner, false);
    assert.equal(editorial.metadata.questionStudioVisible, false);
    assert.equal(editorial.metadata.questionBankWritable, false);
    assert.equal(editorial.metadata.testEligible, false);
    assert.equal(editorial.metadata.publiclyPublishable, false);
  }
}

assert.equal(records, 240);
assert.equal(semanticParity, 240);
assert.equal(termSpecificLines, 480);
assert.equal(diagrams, 240);
assert.equal(omittedDiagrams, 0);
assert.equal(genericEnglishLines, 0);
assert.equal(nonEnglishEnglishConventionLeaks, 0);
assert.equal(SYL_BANKING_POSSIBILITY_EDITORIAL_V3.registeredQlCreated, false);
assert.equal(SYL_BANKING_POSSIBILITY_EDITORIAL_V3.connectedToProductionGenerator, false);
assert.equal(SYL_BANKING_POSSIBILITY_EDITORIAL_V3.questionStudioVisible, false);
assert.equal(SYL_BANKING_POSSIBILITY_EDITORIAL_V3.questionBankWritable, false);
assert.equal(SYL_BANKING_POSSIBILITY_EDITORIAL_V3.testEligible, false);
assert.equal(SYL_BANKING_POSSIBILITY_EDITORIAL_V3.publiclyPublishable, false);
assert.equal(SYL_BANKING_POSSIBILITY_EDITORIAL_V3.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3",
  records,
  semanticParityWithShellV2: semanticParity === records,
  termSpecificExplanationLines: termSpecificLines,
  genericEnglishLines,
  nonEnglishEnglishConventionLeaks,
  diagrams,
  omittedDiagrams,
  schemaCounts,
  geometryCounts,
  diagramPolicy: SYL_BANKING_POSSIBILITY_EDITORIAL_V3.diagramPolicy,
  explanationPolicy: SYL_BANKING_POSSIBILITY_EDITORIAL_V3.explanationPolicy,
  humanEditorialStatus: "PENDING",
  humanLocalizationStatus: "PENDING",
  humanExamAuthenticityStatus: "PENDING",
  humanDiagramStatus: "PENDING",
  registeredQlCreated: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
}, null, 2));
