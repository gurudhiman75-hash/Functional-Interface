import type {
  StemAuditRecord,
  StemProvenanceStatus,
} from "./stem-audit";

export interface StemAuditReport {
  reportId: "STEM-AUDIT-001";
  target: "PCT-001/percentOfKnownNumber";
  totalQuestionsAudited: number;
  approvedProvenanceCount: number;
  partialProvenanceCount: number;
  fallbackCount: number;
  unknownCount: number;
  provenanceReconstructionRate: number;
  questionLanguageAssetUsedForFinalWording: false;
  stemFamiliesExpandedUsed: false;
  approvedArchetypeUsedForWording: false;
  csvExportBypassedNormalLanguagePipeline: true;
  disconnectedAssets: readonly string[];
  unusedStemFamilies: readonly string[];
  fallbackSources: readonly {
    sourceFile: string;
    functionName: string;
    questions: number;
  }[];
  mostCommonStemIds: readonly {
    stemId: string;
    questions: number;
  }[];
  mostCommonTemplatePatterns: readonly {
    pattern: string;
    questions: number;
  }[];
  answers: {
    questionLanguageJson: string;
    stemFamiliesExpanded: string;
    approvedArchetypes: string;
    fallbackTemplates: string;
    actualWordingSource: string;
    disconnectedHumanLibraries: string;
    normalLanguagePipelineBypassed: string;
  };
  successTarget: {
    completeReconstruction: boolean;
    zeroUnknown: boolean;
    humanAssetsDominate: boolean;
    fallbackRare: boolean;
    passed: boolean;
  };
}

function countBy<T>(
  values: readonly T[],
  selector: (value: T) => string,
): readonly { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = selector(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([value, count]) => ({ value, count }));
}

function provenanceCount(
  records: readonly StemAuditRecord[],
  status: StemProvenanceStatus,
): number {
  return records.filter((record) => record.provenanceStatus === status).length;
}

export function buildStemAuditReport(
  records: readonly StemAuditRecord[],
): StemAuditReport {
  const approved = provenanceCount(records, "APPROVED");
  const partial = provenanceCount(records, "PARTIAL");
  const fallback = provenanceCount(records, "FALLBACK");
  const unknown = provenanceCount(records, "UNKNOWN");
  const reconstructed = records.length - unknown;
  const humanProvenance = approved + partial;
  const completeReconstruction =
    records.length > 0 && reconstructed === records.length;
  const zeroUnknown = unknown === 0;
  const humanAssetsDominate =
    records.length > 0 && humanProvenance / records.length > 0.5;
  const fallbackRare =
    records.length > 0 && fallback / records.length <= 0.05;

  return {
    reportId: "STEM-AUDIT-001",
    target: "PCT-001/percentOfKnownNumber",
    totalQuestionsAudited: records.length,
    approvedProvenanceCount: approved,
    partialProvenanceCount: partial,
    fallbackCount: fallback,
    unknownCount: unknown,
    provenanceReconstructionRate:
      records.length === 0 ? 0 : reconstructed / records.length,
    questionLanguageAssetUsedForFinalWording: false,
    stemFamiliesExpandedUsed: false,
    approvedArchetypeUsedForWording: false,
    csvExportBypassedNormalLanguagePipeline: true,
    disconnectedAssets: [
      "PCT-001/question-language.en.json",
      "PCT-001/question-language.hi.json",
      "PCT-001/question-language.pa.json",
      "PCT-001/pipeline.ts:getQuestionEntry(...).template -> renderTemplate(...)",
    ],
    unusedStemFamilies: [
      "No stem-families-expanded.library.json exists in PCT-001.",
      "The workspace stem-families-expanded.library.json belongs to Quant V3 NS-DIV-001 and is unrelated to this target.",
    ],
    fallbackSources: [
      {
        sourceFile:
          "PCT-001/eev2/percent-of-known-number/qualification/csv-pilot.ts",
        functionName: "questionFor",
        questions: fallback,
      },
    ],
    mostCommonStemIds: countBy(records, (record) => record.stemId).map(
      ({ value, count }) => ({ stemId: value, questions: count }),
    ),
    mostCommonTemplatePatterns: countBy(
      records,
      (record) => record.templatePattern,
    ).map(({ value, count }) => ({ pattern: value, questions: count })),
    answers: {
      questionLanguageJson:
        "The parameter generator consulted question-language.en.json for question metadata, but CSV-001 did not use its template to produce the exported wording.",
      stemFamiliesExpanded:
        "No. PCT-001 has no connected stem-families-expanded library, and CSV-001 imports none.",
      approvedArchetypes:
        "The generated parameters retained archetype ID PCT-001, but archetype.md supplied no wording and was not a stem source.",
      fallbackTemplates:
        "Yes. Every exported stem came from five inline templates inside csv-pilot.ts::questionFor().",
      actualWordingSource:
        "csv-pilot.ts lines 236-260 produced the complete wording; context labels, values, rates, and units were also selected inside csv-pilot.ts.",
      disconnectedHumanLibraries:
        "The PCT-001 question-language files and the normal pipeline stem-rendering call were disconnected from CSV-001 final stem construction.",
      normalLanguagePipelineBypassed:
        "Yes. CSV-001 called generatePct001Parameters(), then constructed questionText separately with questionFor() instead of calling getQuestionEntry(...).template and renderTemplate(...).",
    },
    successTarget: {
      completeReconstruction,
      zeroUnknown,
      humanAssetsDominate,
      fallbackRare,
      passed:
        completeReconstruction &&
        zeroUnknown &&
        humanAssetsDominate &&
        fallbackRare,
    },
  };
}

