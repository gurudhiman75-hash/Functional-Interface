import fs from "node:fs";
import path from "node:path";
import { toQuestionStudioPreview } from "../../../../generation-engine";
import { getQuestionLanguageIds as getRap001QuestionLanguageIds } from "./RAP-001/library";
import { runRap001Pipeline } from "./RAP-001/pipeline";
import { RAP_001_CP_IDS } from "./RAP-001/types";
import { getRap002QuestionLanguageIds } from "./RAP-002/library";
import { runRap002Pipeline } from "./RAP-002/pipeline";
import { RAP_002_CP_IDS } from "./RAP-002/types";
import { getRap003QuestionLanguageIds } from "./RAP-003/library";
import { runRap003Pipeline } from "./RAP-003/pipeline";
import { RAP_003_CP_IDS } from "./RAP-003/types";

const basePath = "src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion";
const languages = ["hi", "pa"] as const;
type ReviewLanguage = (typeof languages)[number];
type PackageId = "RAP-001" | "RAP-002" | "RAP-003";

const header = [
  "packageId", "language", "cpId", "qlId", "taskKind", "difficulty", "questionId", "seed",
  "variablesJson", "englishStem", "localizedStem", "englishOptions", "localizedOptions", "correctIndex",
  "correctAnswer", "englishExplanation", "localizedExplanation", "runtimeValidation", "stemAccuracy",
  "languageNaturalness", "explanationClarity", "reviewStatus", "reviewNotes",
];

function csv(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function optionText(options: unknown[]) {
  return options.map((option, index) => `${String.fromCharCode(65 + index)}. ${String(option ?? "")}`).join("\n");
}

function packageRows(
  packageId: PackageId,
  language: ReviewLanguage,
  cpIds: readonly string[],
  qlIds: (cpId: string) => string[],
  run: (cpId: string, qlId: string, language: "en" | ReviewLanguage, seed: string) => any,
) {
  const rows: string[] = [];
  for (const cpId of cpIds) {
    for (const qlId of qlIds(cpId)) {
      const seed = `rap-localization-review:${packageId}:${qlId}:0`;
      const englishPackage = run(cpId, qlId, "en", seed);
      const localizedPackage = run(cpId, qlId, language, seed);
      const english = toQuestionStudioPreview(englishPackage, { seed });
      const localized = toQuestionStudioPreview(localizedPackage, { seed });
      const correctIndex = Number(localized.correctIndex ?? localized.correct ?? 0);
      const correctAnswer = localized.options?.[correctIndex] ?? localized.canonicalAnswer ?? localizedPackage.answer;
      rows.push([
        packageId,
        language,
        localizedPackage.canonicalProblemId,
        localizedPackage.questionLanguageId,
        localizedPackage.parameters.taskKind,
        localizedPackage.difficultyBand,
        localizedPackage.questionId,
        seed,
        JSON.stringify(localizedPackage.parameters.variables),
        english.text,
        localized.text,
        optionText(english.options ?? []),
        optionText(localized.options ?? []),
        correctIndex,
        correctAnswer,
        english.explanation,
        localized.explanation,
        localizedPackage.validation?.valid ? "PASS" : "FAIL",
        "",
        "",
        "",
        "PENDING",
        "",
      ].map(csv).join(","));
    }
  }
  return rows;
}

const packageConfigs = [
  {
    packageId: "RAP-001" as const,
    cpIds: RAP_001_CP_IDS,
    qlIds: (cpId: string) => getRap001QuestionLanguageIds(cpId as any, "en"),
    run: (cpId: string, qlId: string, language: "en" | ReviewLanguage, seed: string) =>
      runRap001Pipeline(cpId as any, { language, questionLanguageId: qlId, seed }),
  },
  {
    packageId: "RAP-002" as const,
    cpIds: RAP_002_CP_IDS,
    qlIds: (cpId: string) => getRap002QuestionLanguageIds(cpId as any),
    run: (cpId: string, qlId: string, language: "en" | ReviewLanguage, seed: string) =>
      runRap002Pipeline(cpId as any, { language, questionLanguageId: qlId, seed }),
  },
  {
    packageId: "RAP-003" as const,
    cpIds: RAP_003_CP_IDS,
    qlIds: (cpId: string) => getRap003QuestionLanguageIds(cpId as any),
    run: (cpId: string, qlId: string, language: "en" | ReviewLanguage, seed: string) =>
      runRap003Pipeline(cpId as any, { language, questionLanguageId: qlId, seed }),
  },
];

const expectedCounts: Record<PackageId, number> = { "RAP-001": 67, "RAP-002": 102, "RAP-003": 222 };
const summary: Record<string, number> = {};

for (const language of languages) {
  const combined = [header.map(csv).join(",")];
  for (const config of packageConfigs) {
    const rows = packageRows(config.packageId, language, config.cpIds, config.qlIds, config.run);
    if (rows.length !== expectedCounts[config.packageId]) {
      throw new Error(`${config.packageId}:${language} export count ${rows.length}; expected ${expectedCounts[config.packageId]}`);
    }
    const packagePath = path.resolve(basePath, `${config.packageId}/${config.packageId.toLowerCase()}-human-review-${language}.csv`);
    fs.writeFileSync(packagePath, [header.map(csv).join(","), ...rows].join("\n") + "\n", "utf8");
    combined.push(...rows);
    summary[`${config.packageId}:${language}`] = rows.length;
  }
  if (combined.length - 1 !== 391) throw new Error(`Combined ${language} export count ${combined.length - 1}; expected 391`);
  fs.writeFileSync(path.resolve(basePath, `rap-all-human-review-${language}.csv`), combined.join("\n") + "\n", "utf8");
  summary[`RAP-ALL:${language}`] = combined.length - 1;
}

console.log(JSON.stringify(summary, null, 2));
