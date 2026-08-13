import { generateBlrCp006LocalizedReviewBank } from "./cp006-localizer";
import { localizedRelationLabel, type BlrCp006TranslatedLocale } from "./cp006-language-pack";

const INTERNAL_DIAGNOSTIC = /\[(?:CORRECT_[A-Z_]+|[A-Z][A-Z_]{3,})\]/;
const EXPECTED_QLS = ["BLR-QL-026", "BLR-QL-027", "BLR-QL-028", "BLR-QL-029", "BLR-QL-030"] as const;

const FORBIDDEN: Record<BlrCp006TranslatedLocale, readonly string[]> = {
  "hi-IN": [
    "परिवार-ग्राफ",
    "खुला हुआ संबंध",
    "खोला गया परिवार",
    "संबंध-किनार",
    "कूटित कथन",
  ],
  "pa-IN": [
    "ਪਰਿਵਾਰਕ ਗ੍ਰਾਫ",
    "ਖੁੱਲ੍ਹਾ ਸੰਬੰਧ",
    "ਖੋਲ੍ਹਿਆ ਗਿਆ ਪਰਿਵਾਰ",
    "ਸੰਬੰਧ-ਕਿਨਾਰ",
    "ਕੋਡਿਤ ਕਥਨ",
  ],
};

function learnerText(record: ReturnType<typeof generateBlrCp006LocalizedReviewBank>[number]): string {
  return [
    record.sharedPrompt,
    record.stem,
    record.answer,
    ...record.options.map((option) => option.text),
    ...record.decodedStatements,
    ...record.explanation.coreConcept,
    ...record.explanation.decodingAudit,
    ...record.explanation.graphAudit,
    record.explanation.conclusion,
    record.explanation.examShortcut,
    ...record.explanation.commonTraps,
    ...record.explanation.optionAnalysis.flatMap((entry) => [entry.optionText, entry.explanation]),
    record.explanation.familyTree.title,
    record.explanation.familyTree.query.answerLabel,
    record.explanation.familyTree.accessibleSummary,
    record.explanation.familyTree.asciiFallback,
  ].join("\n");
}

function expectedLabels(locale: BlrCp006TranslatedLocale) {
  return locale === "hi-IN"
    ? {
        parent: "माता या पिता",
        grandparent: "दादा/दादी/नाना/नानी",
        grandchild: "पोता/पोती/नाती/नातिन",
      }
    : {
        parent: "ਮਾਤਾ ਜਾਂ ਪਿਤਾ",
        grandparent: "ਦਾਦਾ/ਦਾਦੀ/ਨਾਨਾ/ਨਾਨੀ",
        grandchild: "ਪੋਤਾ/ਪੋਤੀ/ਨਾਤੀ/ਨਾਤਿਨ",
      };
}

function auditLocale(locale: BlrCp006TranslatedLocale) {
  const bank = generateBlrCp006LocalizedReviewBank(locale);
  const forbiddenHits: string[] = [];
  const diagnosticLeaks: string[] = [];
  const rawErrorLabelLeaks: string[] = [];
  const qls = new Set<string>();

  for (const record of bank) {
    qls.add(record.qlId);
    const text = learnerText(record);
    for (const phrase of FORBIDDEN[locale]) {
      if (text.includes(phrase)) forbiddenHits.push(`${record.itemId}: ${phrase}`);
    }
    if (INTERNAL_DIAGNOSTIC.test(text)) diagnosticLeaks.push(record.itemId);
    for (const option of record.options) {
      if (option.errorLabel && text.includes(`[${option.errorLabel}]`)) {
        rawErrorLabelLeaks.push(`${record.itemId}: ${option.errorLabel}`);
      }
    }
  }

  const labels = expectedLabels(locale);
  const labelFailures: string[] = [];
  if (localizedRelationLabel("PARENT", locale) !== labels.parent) labelFailures.push("PARENT");
  if (localizedRelationLabel("GRANDPARENT", locale) !== labels.grandparent) labelFailures.push("GRANDPARENT");
  if (localizedRelationLabel("GRANDCHILD", locale) !== labels.grandchild) labelFailures.push("GRANDCHILD");

  const missingQls = EXPECTED_QLS.filter((ql) => !qls.has(ql));
  const samples = EXPECTED_QLS.map((ql) => {
    const record = bank.find((entry) => entry.qlId === ql);
    if (!record) return { ql, missing: true };
    return {
      ql,
      itemId: record.itemId,
      stem: record.stem,
      options: record.options.map((option) => option.text),
      correctAnswer: record.answer,
      coreConcept: record.explanation.coreConcept,
      graphAudit: record.explanation.graphAudit,
      correctOptionExplanation: record.explanation.optionAnalysis.find((entry) => entry.isCorrect)?.explanation,
      firstDistractorExplanation: record.explanation.optionAnalysis.find((entry) => !entry.isCorrect)?.explanation,
      shortcut: record.explanation.examShortcut,
    };
  });

  return {
    locale,
    recordCount: bank.length,
    forbiddenHits,
    diagnosticLeaks,
    rawErrorLabelLeaks,
    labelFailures,
    missingQls,
    samples,
  };
}

const reports = (["hi-IN", "pa-IN"] as const).map(auditLocale);
for (const report of reports) {
  console.log(JSON.stringify({
    locale: report.locale,
    recordCount: report.recordCount,
    forbiddenEditorialPhrases: report.forbiddenHits.length,
    internalDiagnosticLeaks: report.diagnosticLeaks.length,
    rawErrorLabelLeaks: report.rawErrorLabelLeaks.length,
    genericKinshipLabelFailures: report.labelFailures.length,
    missingQlCoverage: report.missingQls.length,
    representativeSamples: report.samples,
  }, null, 2));
}

const failures = reports.flatMap((report) => [
  ...report.forbiddenHits.map((value) => `${report.locale} forbidden editorial phrase ${value}`),
  ...report.diagnosticLeaks.map((itemId) => `${report.locale} internal diagnostic leak ${itemId}`),
  ...report.rawErrorLabelLeaks.map((value) => `${report.locale} raw error-label leak ${value}`),
  ...report.labelFailures.map((value) => `${report.locale} generic kinship label failure ${value}`),
  ...report.missingQls.map((value) => `${report.locale} missing QL coverage ${value}`),
]);

if (failures.length) {
  for (const failure of failures.slice(0, 120)) console.error(`::error::${failure}`);
  throw new Error(`BLR-CP-006 localized editorial audit failed with ${failures.length} issue(s).`);
}

console.log("BLR_CP006_HI_PA_EDITORIAL_QUALITY_PROVED");
