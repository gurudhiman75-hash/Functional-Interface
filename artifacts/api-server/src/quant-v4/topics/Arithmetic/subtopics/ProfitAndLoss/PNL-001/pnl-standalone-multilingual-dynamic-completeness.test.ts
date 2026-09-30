import assert from "node:assert/strict";

import {
  PNL_001_STANDALONE_DYNAMIC_CP_IDS,
  getPnl001StandaloneDynamicCpIds,
  listPnl001StandaloneDynamicQlIds,
  runPnl001StandaloneDynamicPipeline,
  type Pnl001StandaloneDynamicLanguage,
} from "./pnl-standalone-multilingual-dynamic-runtime";

const languages = ["en", "hi", "pa"] as const satisfies readonly Pnl001StandaloneDynamicLanguage[];
const seeds = Array.from(
  { length: 24 },
  (_, index) => `pnl-standalone-multilingual-completeness-${index + 1}`,
);
const qlIds = listPnl001StandaloneDynamicQlIds();

assert.equal(qlIds.length, 186);
assert.deepEqual(
  qlIds,
  Array.from(
    { length: 186 },
    (_, index) => `PNL-QL-${String(index + 1).padStart(3, "0")}`,
  ),
);
assert.deepEqual(
  getPnl001StandaloneDynamicCpIds(),
  [...PNL_001_STANDALONE_DYNAMIC_CP_IDS],
);

const expectedCpCounts = new Map([
  ["PNL-CP-001", 36],
  ["PNL-CP-002", 34],
  ["PNL-CP-003", 24],
  ["PNL-CP-004", 26],
  ["PNL-CP-005", 29],
  ["PNL-CP-006", 37],
]);

function expectedCpId(qlId: string): string {
  const number = Number(qlId.slice(-3));
  if (number <= 36) return "PNL-CP-001";
  if (number <= 70) return "PNL-CP-002";
  if (number <= 94) return "PNL-CP-003";
  if (number <= 120) return "PNL-CP-004";
  if (number <= 149) return "PNL-CP-005";
  return "PNL-CP-006";
}

function numberTokens(value: unknown): readonly string[] {
  return (JSON.stringify(value).match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
}

function unresolvedPlaceholders(value: string): readonly string[] {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return [
    ...new Set(
      [...proseOnly.matchAll(/\{([a-z][A-Za-z0-9_]*)\}/g)].map(
        (match) => match[1]!,
      ),
    ),
  ];
}

function assertMathJaxIntegrity(value: string, scope: string) {
  assert.equal((value.match(/\\\[/g) ?? []).length, (value.match(/\\\]/g) ?? []).length, scope + ": unmatched display-math brackets");
  assert.equal((value.match(/\\\(/g) ?? []).length, (value.match(/\\\)/g) ?? []).length, scope + ": unmatched inline-math delimiters");
  assert.equal((value.match(/\$\$/g) ?? []).length % 2, 0, scope + ": unbalanced display-math dollar delimiters");
  assert.doesNotMatch(value, /\\(?:frac|times|div|cdot)$/, scope + ": dangling LaTeX operator");
  assert.doesNotMatch(value, /\\text\{[^}]*\$[^}]*\}/, scope + ": nested unescaped math delimiter inside MathJax text");
}

const failures: string[] = [];
const generatedIds = new Set<string>();
const cpCounts = new Map<string, number>();
const languageCounts = new Map<string, number>();
const nativeMathJaxPackages = new Map<string, number>();
let packageCount = 0;
let deterministicReplayCount = 0;

for (const qlId of qlIds) {
  const cpId = expectedCpId(qlId);
  cpCounts.set(cpId, (cpCounts.get(cpId) ?? 0) + 1);

  for (const seed of seeds) {
    let english: any;
    try {
      english = runPnl001StandaloneDynamicPipeline({
        questionLanguageId: qlId,
        language: "en",
        seed,
      });
    } catch (error) {
      failures.push(`${qlId}/${seed}/en: ${String(error)}`);
      continue;
    }

    for (const language of languages) {
      try {
        const pkg = language === "en"
          ? english
          : runPnl001StandaloneDynamicPipeline({
              questionLanguageId: qlId,
              language,
              seed,
            });
        packageCount += 1;
        languageCounts.set(language, (languageCounts.get(language) ?? 0) + 1);

        assert.equal(pkg.archetypeId, "PNL-001");
        assert.equal(pkg.canonicalProblemId, cpId);
        assert.equal(pkg.questionLanguageId, qlId);
        if (language !== "en") {
          assert.equal(pkg.language, language);
          assert.equal(pkg.parameters.language, language);
          assert.equal(pkg.traceability.language, language);
        }
        assert.equal(pkg.parameters.runtimeMode, "DYNAMIC_CANDIDATE");
        assert.equal(pkg.parameters.reviewStatus, "UNREVIEWED_DYNAMIC_CANDIDATE");
        assert.equal(pkg.parameters.questionBankStatus, "NOT_STORED");
        assert.equal(pkg.parameters.testEligibility, "INELIGIBLE");
        assert.equal(pkg.parameters.publiclyPublishable, false);
        assert.equal(pkg.traceability.generationMode, "DYNAMIC_CANDIDATE");
        assert.equal(pkg.traceability.questionBankStatus, "NOT_STORED");
        assert.equal(pkg.traceability.testEligibility, "INELIGIBLE");
        assert.equal(pkg.traceability.publiclyPublishable, false);
        assert.equal(pkg.validation.valid, true);
        assert.equal(pkg.options.length, 4);
        assert.equal(new Set(pkg.options).size, 4);
        assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
        assert.equal(unresolvedPlaceholders(`${pkg.stem}\n${pkg.explanation.lines.join("\n")}`).length, 0);
        assertMathJaxIntegrity(pkg.stem, `${qlId}/${seed}/${language}/stem`);
        assertMathJaxIntegrity(pkg.explanation.lines.join("\n"), `${qlId}/${seed}/${language}/explanation`);

        const uniqueId = `${language}:${pkg.questionId}`;
        assert.equal(generatedIds.has(uniqueId), false, `duplicate generated ID ${uniqueId}`);
        generatedIds.add(uniqueId);

        if (language === "en") {
          assert.equal(pkg.parameters.sourceLanguage, undefined);
          assert.equal(pkg.parameters.localizationAuthority, undefined);
        } else {
          const nativePattern = language === "hi"
            ? /[\u0900-\u097F]/u
            : /[\u0A00-\u0A7F]/u;
          assert.match(pkg.stem, nativePattern);
          assert.match(pkg.explanation.lines.join("\n"), nativePattern);
          assert.equal(pkg.correctIndex, english.correctIndex);
          assert.equal(pkg.difficultyBand, english.difficultyBand);
          assert.equal(pkg.parameters.taskKind, english.parameters.taskKind);
          assert.equal(pkg.parameters.answerType, english.parameters.answerType);
          assert.deepEqual(
            numberTokens(pkg.parameters.variables),
            numberTokens(english.parameters.variables),
          );
          assert.equal(pkg.solver.numericAnswer, english.solver.numericAnswer);
          assert.deepEqual(pkg.solver.mathJax, english.solver.mathJax);
          assert.equal(pkg.parameters.sourceLanguage, "en");
          assert.equal(
            pkg.parameters.localizationAuthority,
            "PNL-001-WAVE03-STANDALONE-DYNAMIC",
          );
          if (/\\\[|\\\(/u.test(pkg.explanation.lines.join("\n"))) {
            nativeMathJaxPackages.set(
              language,
              (nativeMathJaxPackages.get(language) ?? 0) + 1,
            );
          }
        }

        if (seed === seeds[0]) {
          const replay = runPnl001StandaloneDynamicPipeline({
            questionLanguageId: qlId,
            language,
            seed,
          });
          assert.equal(replay.stem, pkg.stem);
          assert.deepEqual(replay.options, pkg.options);
          assert.equal(replay.answer, pkg.answer);
          assert.equal(replay.correctIndex, pkg.correctIndex);
          assert.deepEqual(replay.parameters.variables, pkg.parameters.variables);
          deterministicReplayCount += 1;
        }
      } catch (error) {
        failures.push(`${qlId}/${seed}/${language}: ${String(error)}`);
      }
    }
  }
}

// Direct authored-language breadth: same seed selects the same semantic variant in all languages.
for (const qlId of ["PNL-QL-001", "PNL-QL-002", "PNL-QL-005", "PNL-QL-006", "PNL-QL-037", "PNL-QL-038", "PNL-QL-039", "PNL-QL-040", "PNL-QL-072", "PNL-QL-073", "PNL-QL-075", "PNL-QL-076", "PNL-QL-082", "PNL-QL-083", "PNL-QL-084", "PNL-QL-085", "PNL-QL-086", "PNL-QL-087", "PNL-QL-094", "PNL-QL-095", "PNL-QL-096", "PNL-QL-097", "PNL-QL-098", "PNL-QL-099", "PNL-QL-100", "PNL-QL-101", "PNL-QL-102", "PNL-QL-103", "PNL-QL-104", "PNL-QL-105", "PNL-QL-106", "PNL-QL-107", "PNL-QL-108", "PNL-QL-109", "PNL-QL-110", "PNL-QL-111", "PNL-QL-112", "PNL-QL-113", "PNL-QL-114"]) {
  const seen = new Map<string, Set<number>>(languages.map((language) => [language, new Set<number>()]));
  const stems = new Map<string, Set<string>>(languages.map((language) => [language, new Set<string>()]));
  for (let index = 0; index < 72; index += 1) {
    const seed = "pnl-authored-stem-review:" + qlId + ":" + index;
    const packages = languages.map((language) =>
      runPnl001StandaloneDynamicPipeline({ questionLanguageId: qlId, language, seed }),
    );
    const variants = packages.map((pkg: any) => pkg.traceability.authoredStemVariant ?? 0);
    assert.equal(variants[0], variants[1], qlId + ": EN/HI variant selector differs");
    assert.equal(variants[0], variants[2], qlId + ": EN/PA variant selector differs");
    packages.forEach((pkg: any, languageIndex) => {
      const language = languages[languageIndex]!;
      assert.equal(pkg.validation.valid, true);
      assert.equal(pkg.options[pkg.correctIndex], pkg.answer);
      assert.equal(unresolvedPlaceholders(pkg.stem).length, 0);
      seen.get(language)!.add(variants[languageIndex]!);
      stems.get(language)!.add(pkg.stem.replace(/₹\s*[\d,.]+|\b\d+(?:\.\d+)?%?/g, "#"));
    });
  }
  for (const language of languages) {
    assert.deepEqual([...seen.get(language)!].sort(), [0, 1, 2], qlId + "/" + language + ": authored variant coverage");
    assert.ok(stems.get(language)!.size >= 3, qlId + "/" + language + ": only one stem structure");
  }
}

for (const [cpId, count] of expectedCpCounts) {
  assert.equal(cpCounts.get(cpId), count, `${cpId}: QL ownership count`);
}

const expectedPackageCount = qlIds.length * seeds.length * languages.length;
const summary = {
  ok: failures.length === 0 && packageCount === expectedPackageCount,
  qlCount: qlIds.length,
  cpCount: PNL_001_STANDALONE_DYNAMIC_CP_IDS.length,
  seedsPerQl: seeds.length,
  languages,
  packageCount,
  expectedPackageCount,
  englishPackages: languageCounts.get("en") ?? 0,
  hindiPackages: languageCounts.get("hi") ?? 0,
  punjabiPackages: languageCounts.get("pa") ?? 0,
  deterministicReplayCount,
  uniqueGeneratedIds: generatedIds.size,
  nativeMathJaxPackages: Object.fromEntries(nativeMathJaxPackages),
  cpCounts: Object.fromEntries(cpCounts),
  questionStudioWiringChanged: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  failureCount: failures.length,
  failures: failures.slice(0, 200),
};

console.log(JSON.stringify(summary, null, 2));
if (!summary.ok) process.exitCode = 1;
