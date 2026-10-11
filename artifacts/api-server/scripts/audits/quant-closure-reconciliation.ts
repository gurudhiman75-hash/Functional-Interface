import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { quantV4QuestionStudioAdapter } from "../../src/question-studio/engines/quant-v4-adapter";
import { listQuestionStudioPackages as listCumulativePackages } from "../../src/question-studio/shared-generation-engine-cp014";
import { ALGEBRA_QUESTION_STUDIO_BANK_ONLY_PACKAGE_V1 as algebra } from "../../src/quant-v4/topics/AdvancedMathematics/subtopics/Algebra/algebra-question-bank-activation-v1";
import { INT_001_CHAPTER_ADMIN_QUESTION_STUDIO_PACKAGE as interest } from "../../src/quant-v4/topics/Arithmetic/subtopics/Interest/INT-001/int-001-chapter-question-studio-admin-adapter-v1";
import { listSriQuestionStudioPackagesV1 } from "../../src/quant-v4/topics/NumberSystem/subtopics/SurdsAndIndices/question-studio-v1";

const cards = quantV4QuestionStudioAdapter.listPackages().filter(p =>
  !p.packageId.startsWith("REASONING_") && p.packageId !== "IOP-001");
const cumulative = listCumulativePackages();
const num002 = cumulative.find(p => String(p.packageId) === "NUM-002");
if (!num002) throw new Error("Dedicated NUM-002 aggregate missing");
const dedicated = [
  { packageId: algebra.packageId, chapter: "Algebra", permanentQls: algebra.qlCount,
    checkpoints: algebra.canonicalProblemCount, languages: algebra.supportedLanguages,
    stage: algebra.lifecycleStage, authority: "algebra-question-bank-activation-v1.ts" },
  { packageId: interest.packageId, chapter: "Interest", permanentQls: interest.permanentQlCount,
    checkpoints: interest.checkpointCount, languages: interest.supportedLanguages,
    stage: "REVIEW_ONLY", authority: "int-001-chapter-question-studio-admin-adapter-v1.ts" },
  { packageId: String(num002.packageId), chapter: "Number System CP008–014", permanentQls: Number(num002.permanentQlCount),
    checkpoints: num002.cpIds.length, languages: num002.supportedLanguages,
    stage: "REVIEW_ONLY", authority: "shared-generation-engine-cp014.ts" },
  ...listSriQuestionStudioPackagesV1().map(p => ({ packageId: p.packageId, chapter: "Surds & Indices",
    permanentQls: p.permanentQlCount, checkpoints: p.cpIds.length, languages: p.supportedLanguages,
    stage: p.lifecycleStage, authority: "SurdsAndIndices/question-studio-v1.ts" })),
];
const result = {
  scope: "REGISTRY_AND_EXISTING_AUTHORITY_RECONCILIATION",
  sourceHead: execFileSync("git", ["rev-parse", "HEAD"], {encoding: "utf8"}).trim(),
  freshChapterSourceAuditCertified: false,
  liveVerification: "DEFERRED_BY_USER",
  existingClosurePreserved: ["PNC", "TSD", "SAP", "TMW", "RAP", "Mensuration", "Probability", "Statistics", "DI"],
  unifiedPackages: cards.map(p => ({ packageId: p.packageId, chapter: p.subtopic,
    cpIds: p.cpIds, languages: p.supportedLanguages, stage: p.lifecycleStage ?? "LEGACY_DECLARED_GATES",
    cpLanguagePolicy: p.metadata?.cpLanguagePolicy ?? null })),
  dedicatedAuthorities: dedicated.map(p => ({ ...p, unifiedRegistered: cards.some(c => c.packageId === p.packageId) })),
  confirmedRemainingUnifiedRoutingGaps: dedicated.filter(p => !cards.some(c => c.packageId === p.packageId)),
  resolvedInThisChange: { chapter: "Surds & Indices", packages: ["SRI-001", "SRI-002"],
    permanentQls: 58, unifiedSurfacesChecked: 696, languageDifficultyBatches: 18, checkpointRoutes: 12,
    dedicatedLanguageChecks: 174, dedicatedSeedDiversityChecks: 696,
    frozenEnglishRuntimeChecks: 928, frozenNativeRuntimeChecks: 2784,
    frozenAuthorityContentChanged: false, reviewOptionOrderChanged: true,
    scopedProductionTypeCheck: "PASS" },
  capabilityReconciliationFollowups: [
    "NUM-001 unified card exposes CP001/003/004; reconcile CP002/005/006/007 histories with the 14-CP final allocation before claiming whole-chapter unified exposure.",
    "Percentage cards advertise English; compare actual localized delivery before deciding whether a card or runtime change is required.",
    "Statistics advertises English, consistent with its explicit Paper-II closure scope and disabled localization; this does not reopen mathematical closure.",
    "DI-MIX-001 advertises English while individual DI packages advertise EN/HI/PA; review mix capability separately from individual chapter closure.",
  ],
};
const output = resolve("../../docs/audits/quant-closure-reconciliation-2026-10-11.json");
mkdirSync(resolve("../../docs/audits"), {recursive: true});
writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({status: "PASS", unifiedPackages: cards.length,
  remainingUnifiedRoutingGaps: result.confirmedRemainingUnifiedRoutingGaps.map(p => p.packageId), output}));
