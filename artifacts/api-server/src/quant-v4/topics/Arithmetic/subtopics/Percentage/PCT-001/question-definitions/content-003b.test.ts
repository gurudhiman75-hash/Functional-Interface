import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildContent003BReport } from "./content-003b-report";
import { MIGRATION_READINESS_REPORT } from "./migration-readiness-report";

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("Running Content-003b Human Enrichment Tests...");

// 1. Validate the report and success criteria
const report = buildContent003BReport();
assert.equal(report.totalQuestionsAudited, 5, "Should audit exactly 5 questions");
assert.equal(report.successCriteria.readyStatusCount, 5, "All 5 questions must have status READY");
assert.equal(report.successCriteria.richness85PlusCount, 5, "All 5 questions must have richness 85+");
assert.equal(report.successCriteria.questionSpecificExplanationsCount, 5, "All 5 questions must have question-specific explanations");
assert.equal(report.successCriteria.questionSpecificHintsCount, 5, "All 5 questions must have question-specific hints");
assert.equal(report.successCriteria.questionSpecificMisconceptionsCount, 5, "All 5 questions must have question-specific misconceptions");
assert.equal(report.successCriteria.contextPersistenceCount, 5, "All 5 questions must persist context");
assert.ok(report.enrichedRichnessAverage >= 85, "Average richness score must be 85+");

// 2. Validate migration readiness report
assert.ok(MIGRATION_READINESS_REPORT.allReady, "Migration readiness must be true");
assert.equal(MIGRATION_READINESS_REPORT.readinessPercentage, 100, "Readiness percentage must be 100%");
assert.ok(MIGRATION_READINESS_REPORT.reportSummary.includes("READY"), "Report summary must indicate READY status");

// 3. Asset-level content checks for each question
const targetIds = ["Q001", "Q002", "Q003", "Q004", "Q005"];
for (const id of targetIds) {
  const dirPath = join(
    process.cwd(),
    "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/Percentage/PCT-001/question-definitions",
    id
  );

  // Check stem.md
  const stemPath = join(dirPath, "stem.md");
  assert.ok(existsSync(stemPath), `${id} stem.md is missing`);
  const stem = readFileSync(stemPath, "utf8");
  assert.ok(stem.trim().length > 0, `${id} stem.md is empty`);
  assert.ok(!stem.includes("generic quantity"), `${id} stem has generic quantity wording`);
  assert.ok(stem.includes("{rate1}") && stem.includes("{rate2}"), `${id} stem is missing required template variables`);

  // Check variables.ts
  const variablesPath = join(dirPath, "variables.ts");
  assert.ok(existsSync(variablesPath), `${id} variables.ts is missing`);
  const variablesContent = readFileSync(variablesPath, "utf8");
  assert.ok(!variablesContent.includes("wording"), `${id} variables.ts contains wording`);

  // Check relationship.md (Pedagogical Block 1)
  const relPath = join(dirPath, "relationship.md");
  assert.ok(existsSync(relPath), `${id} relationship.md is missing`);
  const relContent = readFileSync(relPath, "utf8");
  assert.ok(relContent.trim().length > 0, `${id} relationship.md is empty`);
  assert.ok(!relContent.includes("let x") && !relContent.includes("Let x"), `${id} relationship.md contains algebra/let x be`);

  // Check unit-value.md (Pedagogical Block 2)
  const uvPath = join(dirPath, "unit-value.md");
  assert.ok(existsSync(uvPath), `${id} unit-value.md is missing`);
  const uvContent = readFileSync(uvPath, "utf8");
  assert.ok(uvContent.trim().length > 0, `${id} unit-value.md is empty`);
  assert.ok(uvContent.includes("divide") || uvContent.includes("dividing"), `${id} unit-value.md must explain division`);
  assert.ok(uvContent.includes("1%"), `${id} unit-value.md must explain 1%`);
  assert.ok(!uvContent.includes("let x") && !uvContent.includes("Let x"), `${id} unit-value.md contains algebra/let x be`);

  // Check scaling.md (Pedagogical Block 3)
  const scalingPath = join(dirPath, "scaling.md");
  assert.ok(existsSync(scalingPath), `${id} scaling.md is missing`);
  const scalingContent = readFileSync(scalingPath, "utf8");
  assert.ok(scalingContent.trim().length > 0, `${id} scaling.md is empty`);
  assert.ok(scalingContent.includes("multiply") || scalingContent.includes("multiplying"), `${id} scaling.md must justify multiplication`);
  assert.ok(!scalingContent.includes("let x") && !scalingContent.includes("Let x"), `${id} scaling.md contains algebra/let x be`);

  // Check answer.md (Pedagogical Block 4)
  const answerPath = join(dirPath, "answer.md");
  assert.ok(existsSync(answerPath), `${id} answer.md is missing`);
  const answerContent = readFileSync(answerPath, "utf8");
  assert.ok(answerContent.trim().length > 0, `${id} answer.md is empty`);
  assert.ok(answerContent.includes("{answer}"), `${id} answer.md is missing {answer} variable`);
  // Must not be a bare number
  assert.ok(answerContent.trim() !== "{answer}", `${id} answer.md is a bare number placeholder`);

  // Check hints.md
  const hintsPath = join(dirPath, "hints.md");
  assert.ok(existsSync(hintsPath), `${id} hints.md is missing`);
  const hintsContent = readFileSync(hintsPath, "utf8");
  assert.ok(hintsContent.includes("Hint 1") && hintsContent.includes("Hint 2") && hintsContent.includes("Hint 3"), `${id} hints.md is missing 3 levels of hints`);
  assert.ok(!hintsContent.includes("{answer}"), `${id} hints.md reveals the final answer`);

  // Check misconceptions.md
  const miscPath = join(dirPath, "misconceptions.md");
  assert.ok(existsSync(miscPath), `${id} misconceptions.md is missing`);
  const miscContent = readFileSync(miscPath, "utf8");
  assert.ok(miscContent.trim().length > 0, `${id} misconceptions.md is empty`);
  assert.ok(miscContent.includes("100") || miscContent.includes("bare number") || miscContent.includes("percentage"), `${id} misconceptions.md must record common mistakes`);

  // Check realism.md
  const realismPath = join(dirPath, "realism.md");
  assert.ok(existsSync(realismPath), `${id} realism.md is missing`);
  const realismContent = readFileSync(realismPath, "utf8");
  assert.ok(realismContent.trim().length > 0, `${id} realism.md is empty`);
  assert.ok(realismContent.includes("positive") || realismContent.includes("fail closed") || realismContent.includes("fractional"), `${id} realism.md must list realistic boundaries`);
}

console.log("All Content-003b Human Enrichment Tests passed successfully!");
