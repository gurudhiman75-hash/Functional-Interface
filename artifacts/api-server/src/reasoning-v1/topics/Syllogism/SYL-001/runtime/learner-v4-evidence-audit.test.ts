import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import { applyDuplicateClustersV4, buildEvidenceRowV4 } from "./learner-v4-evidence-remediated";
import { SYL_QL_REGISTRY } from "./ql-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const rawRows = [];
const stableIds = new Set<string>();
let triplets = 0;
let enabledDiagrams = 0;
let omittedDiagrams = 0;

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    const variants = locales.map((locale) => generateSylQuestionV4(definition.qlId, seed, locale));
    const baseline = variants[0];
    assert(variants.length === 3, `${definition.qlId}/${seed} does not have three language variants.`);

    for (const question of variants) {
      const row = buildEvidenceRowV4(question, baseline);
      const key = row.stableId;
      assert(!stableIds.has(key), `${key} is duplicated.`);
      stableIds.add(key);

      assert(row.automatedAnswerParity === "PASS", `${key} independently derived answer does not match the stored key.`);
      assert(row.independentlyDerivedAnswerKey === row.answerKey, `${key} answer-key evidence is inconsistent.`);
      assert(row.independentlyDerivedSemanticValue === row.answerSemanticValue, `${key} semantic answer evidence is inconsistent.`);
      assert(row.proofElementCoverage === "PASS", `${key} is missing required proof elements: ${row.requiredProofElements.filter((element) => !row.presentProofElements.includes(element)).join(", ")}`);
      assert(row.explanationParity === "PASS", `${key} explanation mode or answer differs across languages.`);
      assert(row.diagramSemanticParity === "PASS", `${key} diagram semantics differ across languages.`);
      assert(row.automatedSvgContract !== "FAIL", `${key} fails the automated SVG contract.`);
      assert(row.expandedLearnerWords >= row.primaryVisibleWords, `${key} expanded learner length is below primary length.`);
      assert(row.totalLearnerWords >= row.expandedLearnerWords, `${key} total learner length is below expanded length.`);
      assert(row.englishLabelLeakCount === 0, `${key} leaks ${row.englishLabelLeakCount} English learner labels.`);
      assert(row.literalMemberPhraseCount === 0, `${key} retains ${row.literalMemberPhraseCount} literal member phrases.`);
      assert(row.duplicatePunctuationCount === 0, `${key} retains duplicate punctuation.`);
      assert(row.unresolvedTemplateFragmentCount === 0, `${key} retains unresolved template fragments.`);
      assert(row.learnerMetadataLeakCount === 0, `${key} leaks internal metadata.`);
      assert(row.nativeEditorial === "NOT_RUN", `${key} overclaims native editorial approval.`);
      assert(row.humanGeometry360 === "NOT_RUN" && row.humanGeometry412 === "NOT_RUN" && row.humanGeometry768 === "NOT_RUN", `${key} overclaims human geometry approval.`);
      assert(row.lifecycleStatus === "REVISE", `${key} is not held at REVISE.`);

      if (question.learnerPresentationV4.diagram.enabled) enabledDiagrams += 1;
      else omittedDiagrams += 1;
      rawRows.push(row);
    }
    triplets += 1;
  }
}

const rows = applyDuplicateClustersV4(rawRows);
const duplicateRows = rows.filter((row) => row.duplicateExplanationCluster !== null);
const duplicateClusters = new Set(duplicateRows.map((row) => row.duplicateExplanationCluster));
const expectedRecords = SYL_QL_REGISTRY.length * 80 * locales.length;
assert(rows.length === expectedRecords, `Expected ${expectedRecords} evidence rows, generated ${rows.length}.`);
assert(triplets === SYL_QL_REGISTRY.length * 80, `Expected ${SYL_QL_REGISTRY.length * 80} language triplets, generated ${triplets}.`);
assert(enabledDiagrams > 0 && omittedDiagrams > 0, "Evidence audit did not cover both rendered and omitted diagrams.");

console.log(JSON.stringify({
  status: "SYL-001 V4 record-level evidence audit passed",
  records: rows.length,
  languageTriplets: triplets,
  independentlyDerivedAnswerParityPassed: rows.filter((row) => row.automatedAnswerParity === "PASS").length,
  proofElementCoveragePassed: rows.filter((row) => row.proofElementCoverage === "PASS").length,
  explanationParityPassed: rows.filter((row) => row.explanationParity === "PASS").length,
  diagramSemanticParityPassed: rows.filter((row) => row.diagramSemanticParity === "PASS").length,
  currentLiteralMemberPhrases: rows.reduce((sum, row) => sum + row.literalMemberPhraseCount, 0),
  currentDuplicatePunctuation: rows.reduce((sum, row) => sum + row.duplicatePunctuationCount, 0),
  currentEnglishLabelLeaks: rows.reduce((sum, row) => sum + row.englishLabelLeakCount, 0),
  enabledDiagrams,
  omittedDiagrams,
  duplicateExplanationClusters: duplicateClusters.size,
  duplicateExplanationRows: duplicateRows.length,
  nativeEditorialStatus: "NOT_RUN",
  humanGeometryStatus: "NOT_RUN",
  lifecycleStatus: "REVISE",
}, null, 2));
