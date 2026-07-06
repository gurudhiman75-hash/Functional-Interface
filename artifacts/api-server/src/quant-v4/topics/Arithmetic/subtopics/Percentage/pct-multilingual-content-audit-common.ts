type AuditLanguage = "hi" | "pa";

type AuditPackage = {
  language?: string;
  questionLanguageId?: string;
  stem?: string;
  explanation?: {
    lines?: string[];
  } | string;
};

export type MultilingualContentAuditModule<TCpId extends string> = {
  packageId: string;
  cpIds: readonly TCpId[];
  run: (cpId: TCpId, options: { language: AuditLanguage; seed: string }) => AuditPackage;
};

type AuditFailure = {
  packageId: string;
  cpId: string;
  language: AuditLanguage;
  seed: string;
  check:
    | "crash"
    | "metadata-language"
    | "empty-output"
    | "english-leakage"
    | "garbled-output"
    | "mojibake-output"
    | "unresolved-placeholder";
  location: "stem" | "explanation" | "package";
  text: string;
};

const LANGUAGES: readonly AuditLanguage[] = ["hi", "pa"];
const DEFAULT_SEEDS_PER_CP_LANGUAGE = 30;
const ENGLISH_FUNCTION_WORDS = ["of", "is", "are", "the", "and", "if", "find", "then"] as const;
const ENGLISH_FUNCTION_WORD_PATTERN = new RegExp(`\\b(?:${ENGLISH_FUNCTION_WORDS.join("|")})\\b`, "i");

function stripMathAndAllowedLatin(text: string) {
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\\\[[\s\S]*?\\\]/g, " ")
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/\bRs\.?\b/g, " ")
    .replace(/\b[A-Z]\b/g, " ");
}

function getExplanationText(pkg: AuditPackage) {
  if (typeof pkg.explanation === "string") return pkg.explanation;
  return (pkg.explanation?.lines ?? []).join("\n");
}

function hasEnglishFunctionWord(text: string) {
  return ENGLISH_FUNCTION_WORD_PATTERN.test(stripMathAndAllowedLatin(text));
}

function hasGarbledQuestionMarks(text: string) {
  return text.includes("?") || /\?{3,}/.test(text);
}

function hasMojibake(text: string) {
  return /[àÃ�]/.test(text);
}

function hasUnresolvedPlaceholder(text: string) {
  return /\{[A-Za-z_][A-Za-z0-9_]*\}/.test(
    text
      .replace(/\$\$[\s\S]*?\$\$/g, " ")
      .replace(/\\\[[\s\S]*?\\\]/g, " "),
  );
}

function recordContentFailures(
  failures: AuditFailure[],
  moduleCase: MultilingualContentAuditModule<string>,
  cpId: string,
  language: AuditLanguage,
  seed: string,
  location: "stem" | "explanation",
  text: string,
) {
  if (!text.trim()) {
    failures.push({ packageId: moduleCase.packageId, cpId, language, seed, check: "empty-output", location, text });
  }
  if (hasEnglishFunctionWord(text)) {
    failures.push({ packageId: moduleCase.packageId, cpId, language, seed, check: "english-leakage", location, text });
  }
  if (hasGarbledQuestionMarks(text)) {
    failures.push({ packageId: moduleCase.packageId, cpId, language, seed, check: "garbled-output", location, text });
  }
  if (hasMojibake(text)) {
    failures.push({ packageId: moduleCase.packageId, cpId, language, seed, check: "mojibake-output", location, text });
  }
  if (hasUnresolvedPlaceholder(text)) {
    failures.push({ packageId: moduleCase.packageId, cpId, language, seed, check: "unresolved-placeholder", location, text });
  }
}

export function runMultilingualContentAudit<TCpId extends string>(
  moduleCase: MultilingualContentAuditModule<TCpId>,
  seedsPerCpLanguage = DEFAULT_SEEDS_PER_CP_LANGUAGE,
) {
  const failures: AuditFailure[] = [];
  let generated = 0;

  for (const cpId of moduleCase.cpIds) {
    for (const language of LANGUAGES) {
      for (let seedIndex = 0; seedIndex < seedsPerCpLanguage; seedIndex += 1) {
        const seed = `${moduleCase.packageId}:${cpId}:${language}:content-audit:${seedIndex}`;
        try {
          const pkg = moduleCase.run(cpId, { language, seed });
          generated += 1;
          const stem = String(pkg.stem ?? "");
          const explanation = getExplanationText(pkg);

          if (pkg.language !== language) {
            failures.push({
              packageId: moduleCase.packageId,
              cpId,
              language,
              seed,
              check: "metadata-language",
              location: "package",
              text: `Expected ${language}, got ${String(pkg.language)}`,
            });
          }

          recordContentFailures(failures, moduleCase as MultilingualContentAuditModule<string>, cpId, language, seed, "stem", stem);
          recordContentFailures(
            failures,
            moduleCase as MultilingualContentAuditModule<string>,
            cpId,
            language,
            seed,
            "explanation",
            explanation,
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push({
            packageId: moduleCase.packageId,
            cpId,
            language,
            seed,
            check: "crash",
            location: "package",
            text: message,
          });
        }
      }
    }
  }

  const counts = {
    crash: failures.filter((failure) => failure.check === "crash").length,
    metadataLanguage: failures.filter((failure) => failure.check === "metadata-language").length,
    emptyOutput: failures.filter((failure) => failure.check === "empty-output").length,
    englishLeakage: failures.filter((failure) => failure.check === "english-leakage").length,
    garbledOutput: failures.filter((failure) => failure.check === "garbled-output").length,
    mojibakeOutput: failures.filter((failure) => failure.check === "mojibake-output").length,
    unresolvedPlaceholder: failures.filter((failure) => failure.check === "unresolved-placeholder").length,
  };

  if (failures.length) {
    console.error(`${moduleCase.packageId} multilingual content audit: FAILED`);
    console.error(`Languages: ${LANGUAGES.join(", ")}`);
    console.error(`Seeds per CP/language: ${seedsPerCpLanguage}`);
    console.error(`Generated packages: ${generated}`);
    console.error(`Failures: ${failures.length}`);
    console.error(JSON.stringify(counts, null, 2));
    for (const failure of failures) {
      console.error(
        `FAIL ${failure.packageId}:${failure.cpId}:${failure.language}:${failure.seed}:${failure.location}:${failure.check}`,
      );
      console.error(failure.text);
    }
    process.exitCode = 1;
    return { passed: false, generated, failures, counts };
  }

  console.log(`${moduleCase.packageId} multilingual content audit: PASSED`);
  console.log(`Languages: ${LANGUAGES.join(", ")}`);
  console.log(`Seeds per CP/language: ${seedsPerCpLanguage}`);
  console.log(`Generated packages: ${generated}`);
  console.log("Failures: 0");
  console.log(JSON.stringify(counts, null, 2));
  return { passed: true, generated, failures, counts };
}
