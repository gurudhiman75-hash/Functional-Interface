import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  canonicalizeClsCp002StudentPair,
  localizeClsCp002StudentPair,
  localizedClsCp002StudentRelationLabel,
  localizedClsCp002StudentRelationRule,
} from "./localization/cp002-student-presentation";
import {
  CLS_CP002_MULTILINGUAL_SAFE_FACTS,
} from "./localization/cp002-safe-facts";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp002-permanent-review");

const rows = [...CLS_CP002_MULTILINGUAL_SAFE_FACTS]
  .sort((left, right) =>
    left.relationId.localeCompare(right.relationId)
    || left.factId.localeCompare(right.factId),
  )
  .map((fact) => {
    const canonicalPair = { left: fact.left, right: fact.right };
    const hiPair = localizeClsCp002StudentPair(canonicalPair, [fact.factId], "hi-IN");
    const paPair = localizeClsCp002StudentPair(canonicalPair, [fact.factId], "pa-IN");
    const hiReverse = canonicalizeClsCp002StudentPair(hiPair, [fact.factId], "hi-IN");
    const paReverse = canonicalizeClsCp002StudentPair(paPair, [fact.factId], "pa-IN");
    if (JSON.stringify(hiReverse) !== JSON.stringify(canonicalPair)) {
      throw new Error(`${fact.factId} failed Hindi canonical reconstruction`);
    }
    if (JSON.stringify(paReverse) !== JSON.stringify(canonicalPair)) {
      throw new Error(`${fact.factId} failed Punjabi canonical reconstruction`);
    }
    return {
      factId: fact.factId,
      relationId: fact.relationId,
      sourceLibrary: fact.sourceLibrary,
      difficulty: fact.difficulty,
      english: canonicalPair,
      hindi: hiPair,
      punjabi: paPair,
      hindiRelationLabel: localizedClsCp002StudentRelationLabel(fact.relationId, "hi-IN"),
      punjabiRelationLabel: localizedClsCp002StudentRelationLabel(fact.relationId, "pa-IN"),
      hindiRule: localizedClsCp002StudentRelationRule(fact.relationId, "hi-IN"),
      punjabiRule: localizedClsCp002StudentRelationRule(fact.relationId, "pa-IN"),
    };
  });

const relationCount = new Set(rows.map((row) => row.relationId)).size;
if (rows.length !== 160) throw new Error(`Expected 160 multilingual-safe facts, received ${rows.length}`);
if (relationCount !== 31) throw new Error(`Expected 31 fact relations, received ${relationCount}`);

const markdown = [
  "# CLS-CP-002 Complete Multilingual Fact Review",
  "",
  `Fact pairs: ${rows.length}`,
  `Fact relations: ${relationCount}`,
  "Scope: every fact admitted to permanent multilingual generation",
  "English-only discovery facts are intentionally excluded from this learner-facing sheet.",
  "",
  "| # | Relation | English | Hindi | Punjabi |",
  "|---:|---|---|---|---|",
  ...rows.map((row, index) =>
    `| ${index + 1} | ${row.relationId} | ${row.english.left} : ${row.english.right} | ${row.hindi.left} : ${row.hindi.right} | ${row.punjabi.left} : ${row.punjabi.right} |`,
  ),
  "",
  "## Relation wording",
  "",
  ...[...new Set(rows.map((row) => row.relationId))].flatMap((relationId) => {
    const row = rows.find((candidate) => candidate.relationId === relationId)!;
    return [
      `### ${relationId}`,
      "",
      `- Hindi label: ${row.hindiRelationLabel}`,
      `- Hindi rule: ${row.hindiRule}`,
      `- Punjabi label: ${row.punjabiRelationLabel}`,
      `- Punjabi rule: ${row.punjabiRule}`,
      "",
    ];
  }),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp002-complete-multilingual-fact-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp002-complete-multilingual-fact-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-002 complete multilingual fact review written.", {
  outputDir,
  factPairs: rows.length,
  relations: relationCount,
  sourceLibraries: Object.fromEntries(
    [...new Set(rows.map((row) => row.sourceLibrary))]
      .map((sourceLibrary) => [
        sourceLibrary,
        rows.filter((row) => row.sourceLibrary === sourceLibrary).length,
      ]),
  ),
});
