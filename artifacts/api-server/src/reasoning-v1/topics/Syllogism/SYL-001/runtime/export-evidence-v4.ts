import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV4 } from "./generator-v4";
import {
  applyDuplicateClustersV4,
  buildEvidenceRowV4,
  legacyLocalizationDefectsV4,
  type SylLearnerEvidenceRowV4,
} from "./learner-v4-evidence-remediated";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = [0, 1, 2, 3, 4, 5] as const;
const questions = SYL_QL_REGISTRY.flatMap((definition) =>
  seeds.flatMap((seed) => locales.map((locale) => generateSylQuestionV4(definition.qlId, seed, locale))));

const rows = applyDuplicateClustersV4(SYL_QL_REGISTRY.flatMap((definition) =>
  seeds.flatMap((seed) => {
    const variants = locales.map((locale) => generateSylQuestionV4(definition.qlId, seed, locale));
    return variants.map((question) => buildEvidenceRowV4(question, variants[0]));
  })));

function average(values: readonly number[]): number {
  return Number((values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1)).toFixed(1));
}

function countBy(values: readonly SylLearnerEvidenceRowV4[], field: keyof SylLearnerEvidenceRowV4): Readonly<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const value of values) {
    const key = String(value[field]);
    result[key] = (result[key] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

const legacy = questions.map(legacyLocalizationDefectsV4);
const legacyLiteral = legacy.reduce((sum, entry) => sum + entry.literalMemberPhraseCount, 0);
const legacyPunctuation = legacy.reduce((sum, entry) => sum + entry.duplicatePunctuationCount, 0);
const currentLiteral = rows.reduce((sum, row) => sum + row.literalMemberPhraseCount, 0);
const currentPunctuation = rows.reduce((sum, row) => sum + row.duplicatePunctuationCount, 0);
const currentEnglishLeaks = rows.reduce((sum, row) => sum + row.englishLabelLeakCount, 0);
const duplicateRows = rows.filter((row) => row.duplicateExplanationCluster !== null);
const duplicateClusters = new Set(duplicateRows.map((row) => row.duplicateExplanationCluster));
const enabledRows = rows.filter((row) => row.automatedSvgContract !== "NOT_APPLICABLE");

const summary = {
  authority: "SYL_001_LEARNER_EXPLANATION_V4",
  schemaVersion: "syl-learner-v4-evidence-v1",
  evidenceBoundary: {
    automatedEvidence: "Generated from normalized conclusion classifications, task semantics, structured proof objects and SVG contracts.",
    independentHumanLogicReview: "NOT_RUN",
    nativeEditorialReview: "NOT_RUN",
    humanViewportReview: "NOT_RUN",
  },
  records: rows.length,
  logicalLanguageTriplets: rows.length / 3,
  languages: countBy(rows, "language"),
  breakdowns: {
    ql: countBy(rows, "qlId"),
    difficulty: countBy(rows, "difficulty"),
    taskKind: countBy(rows, "taskKind"),
    proofMode: countBy(rows, "proofMode"),
    diagramMode: countBy(rows, "diagramMode"),
  },
  automatedLogicEvidence: {
    independentlyDerivedAnswerParity: {
      pass: rows.filter((row) => row.automatedAnswerParity === "PASS").length,
      fail: rows.filter((row) => row.automatedAnswerParity === "FAIL").length,
      method: "Correct option re-derived without reading correctIndex/isCorrect, using conclusion classifications plus task, mask, modality and pair semantics.",
      limitation: "This is a second derivation from runtime semantic output, not external human logic approval.",
    },
    proofElementCoverage: {
      pass: rows.filter((row) => row.proofElementCoverage === "PASS").length,
      fail: rows.filter((row) => row.proofElementCoverage === "FAIL").length,
    },
    explanationParity: {
      pass: rows.filter((row) => row.explanationParity === "PASS").length,
      fail: rows.filter((row) => row.explanationParity === "FAIL").length,
    },
    diagramSemanticParity: {
      pass: rows.filter((row) => row.diagramSemanticParity === "PASS").length,
      fail: rows.filter((row) => row.diagramSemanticParity === "FAIL").length,
    },
  },
  learnerLengthEvidence: {
    averagePrimaryVisibleWords: average(rows.map((row) => row.primaryVisibleWords)),
    averageExpandedLearnerWords: average(rows.map((row) => row.expandedLearnerWords)),
    averageDiagramLabelWords: average(rows.map((row) => row.diagramLabelWords)),
    averageTotalLearnerWords: average(rows.map((row) => row.totalLearnerWords)),
    shortestPrimaryVisibleWords: Math.min(...rows.map((row) => row.primaryVisibleWords)),
    longestPrimaryVisibleWords: Math.max(...rows.map((row) => row.primaryVisibleWords)),
  },
  localizationDefects: {
    literalMemberPhrase: {
      foundInLegacyProofSurface: legacyLiteral,
      fixedInV4LearnerSurface: Math.max(legacyLiteral - currentLiteral, 0),
      remainingInV4LearnerSurface: currentLiteral,
    },
    duplicatePunctuation: {
      foundInLegacyProofSurface: legacyPunctuation,
      fixedInV4LearnerSurface: Math.max(legacyPunctuation - currentPunctuation, 0),
      remainingInV4LearnerSurface: currentPunctuation,
    },
    englishLearnerLabelLeak: {
      remainingInHindiPunjabiLearnerSurface: currentEnglishLeaks,
    },
    unresolvedTemplateFragments: rows.reduce((sum, row) => sum + row.unresolvedTemplateFragmentCount, 0),
    learnerMetadataLeaks: rows.reduce((sum, row) => sum + row.learnerMetadataLeakCount, 0),
  },
  duplicateExplanationAudit: {
    normalizedDuplicateClusters: duplicateClusters.size,
    recordsInsideDuplicateClusters: duplicateRows.length,
    status: duplicateClusters.size === 0 ? "PASS" : "REVIEW_REQUIRED",
  },
  diagramEvidence: {
    enabledRecords: enabledRows.length,
    omittedRecords: rows.length - enabledRows.length,
    automatedSvgContractPass: rows.filter((row) => row.automatedSvgContract === "PASS").length,
    automatedSvgContractFail: rows.filter((row) => row.automatedSvgContract === "FAIL").length,
    humanGeometry360: "NOT_RUN",
    humanGeometry412: "NOT_RUN",
    humanGeometry768: "NOT_RUN",
  },
  lifecycle: {
    reviewStatus: "REVISE",
    nativeEditorialStatus: "NOT_RUN",
    independentHumanLogicParity: "NOT_RUN",
    humanMobileGeometry: "NOT_RUN",
    public: false,
    questionStudioEnabled: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
  },
  remainingManualReviewBlockers: [
    "Native English editorial review",
    "Native Hindi editorial review",
    "Native Punjabi editorial review",
    "Independent human logic parity review",
    "Human screenshot/viewport review at 360 px, 412 px and 768 px",
    "Source-profile and final QL merge/split sign-off",
  ],
};

const tableRows = rows.map((row) => `<tr>
  <td>${escapeHtml(row.stableId)}</td>
  <td>${escapeHtml(row.language)}</td>
  <td>${escapeHtml(row.proofMode)}</td>
  <td>${escapeHtml(row.diagramMode)}</td>
  <td>${row.answerKey}</td>
  <td>${escapeHtml(row.automatedAnswerParity)}</td>
  <td>${escapeHtml(row.proofElementCoverage)}</td>
  <td>${row.primaryVisibleWords}</td>
  <td>${row.expandedLearnerWords}</td>
  <td>${row.totalLearnerWords}</td>
  <td>${escapeHtml(row.automatedSvgContract)}</td>
  <td>${escapeHtml(row.nativeEditorial)}</td>
  <td>${escapeHtml(row.lifecycleStatus)}</td>
</tr>`).join("\n");

const html = `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SYL-001 V4 Record-Level Evidence</title><style>body{font-family:system-ui;margin:0;background:#eef2f7;color:#0f172a}.page{max-width:1500px;margin:auto;padding:18px}.hero{background:#0f172a;color:#fff;padding:20px;border-radius:14px}.hero p{color:#cbd5e1}.warning{margin:12px 0;padding:12px;border:1px solid #f59e0b;background:#fffbeb;border-radius:10px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px;margin:12px 0}.metric{background:#fff;border:1px solid #cbd5e1;padding:12px;border-radius:10px}.metric strong{display:block;font-size:1.35rem}.table{overflow:auto;background:#fff;border:1px solid #cbd5e1;border-radius:10px}table{border-collapse:collapse;width:100%;font-size:.82rem}th,td{padding:8px;border-bottom:1px solid #e2e8f0;text-align:left;white-space:nowrap}th{position:sticky;top:0;background:#f8fafc}</style></head><body><main class="page"><section class="hero"><h1>SYL-001 V4 Record-Level Evidence</h1><p>${rows.length} localized records forming ${rows.length / 3} English–Hindi–Punjabi triplets.</p></section><section class="warning"><strong>Release boundary:</strong> automated evidence is not native editorial, independent human logic review or human viewport approval. Lifecycle remains REVISE.</section><section class="grid"><div class="metric"><strong>${summary.automatedLogicEvidence.independentlyDerivedAnswerParity.pass}/${rows.length}</strong><span>Automated answer parity</span></div><div class="metric"><strong>${summary.automatedLogicEvidence.proofElementCoverage.pass}/${rows.length}</strong><span>Proof-element coverage</span></div><div class="metric"><strong>${summary.localizationDefects.literalMemberPhrase.remainingInV4LearnerSurface}</strong><span>Literal member phrases remaining</span></div><div class="metric"><strong>${summary.localizationDefects.duplicatePunctuation.remainingInV4LearnerSurface}</strong><span>Duplicate punctuation remaining</span></div><div class="metric"><strong>${summary.learnerLengthEvidence.averagePrimaryVisibleWords}</strong><span>Average primary words</span></div><div class="metric"><strong>${summary.learnerLengthEvidence.averageExpandedLearnerWords}</strong><span>Average expanded learner words</span></div><div class="metric"><strong>${summary.duplicateExplanationAudit.normalizedDuplicateClusters}</strong><span>Duplicate explanation clusters</span></div><div class="metric"><strong>REVISE</strong><span>Lifecycle status</span></div></section><div class="table"><table><thead><tr><th>Stable ID</th><th>Language</th><th>Proof mode</th><th>Diagram</th><th>Key</th><th>Answer parity</th><th>Proof coverage</th><th>Primary words</th><th>Expanded words</th><th>Total words</th><th>SVG contract</th><th>Native review</th><th>Status</th></tr></thead><tbody>${tableRows}</tbody></table></div></main></body></html>`;

const outputDir = process.env.SYL_REVIEW_V4_DIR
  ? resolve(process.env.SYL_REVIEW_V4_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-review-v4");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "syl-001-v4-record-evidence.jsonl"), `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
writeFileSync(resolve(outputDir, "syl-001-v4-evidence-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
writeFileSync(resolve(outputDir, "SYL-001-V4-Record-Level-Evidence.html"), html, "utf8");

console.log(JSON.stringify({
  status: "SYL-001 V4 record-level evidence exported",
  outputDir,
  records: rows.length,
  logicalLanguageTriplets: rows.length / 3,
  answerParityPass: summary.automatedLogicEvidence.independentlyDerivedAnswerParity.pass,
  proofCoveragePass: summary.automatedLogicEvidence.proofElementCoverage.pass,
  literalMemberPhraseRemaining: currentLiteral,
  duplicatePunctuationRemaining: currentPunctuation,
  nativeEditorialStatus: "NOT_RUN",
  humanGeometryStatus: "NOT_RUN",
  lifecycleStatus: "REVISE",
}, null, 2));
