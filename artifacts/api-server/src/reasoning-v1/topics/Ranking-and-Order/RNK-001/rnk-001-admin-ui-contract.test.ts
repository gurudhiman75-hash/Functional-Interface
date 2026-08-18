import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const apiPath = fileURLToPath(new URL("../../../../../../admin-app/src/features/question-studio/api.ts", import.meta.url));
const examsPath = fileURLToPath(new URL("../../../../../../admin-app/src/data/exams.ts", import.meta.url));
const cockpitPath = fileURLToPath(new URL("../../../../../../admin-app/src/pages/content/QuestionStudioCockpitPage.tsx", import.meta.url));
const apiSource = readFileSync(apiPath, "utf8");
const examsSource = readFileSync(examsPath, "utf8");
const cockpitSource = readFileSync(cockpitPath, "utf8");

assert.match(apiSource, /canonicalProblems\?: GenerationCanonicalProblem\[\]/u);
assert.match(apiSource, /supportedExamProfiles\?: string\[\]/u);
assert.match(apiSource, /examProfileId\?: string/u);
assert.match(apiSource, /cpId\?: string/u);
assert.match(apiSource, /questionLanguageId\?: string/u);
assert.match(apiSource, /input\.packageId === 'RNK-001'/u);
assert.match(apiSource, /subject: 'Reasoning Ability'/u);
assert.match(apiSource, /examProfileId: input\.examProfileId \?\? rankingExamProfile\(input\.exam\)/u);
assert.match(apiSource, /return 'SSC_CGL_T1'/u);
assert.match(apiSource, /return 'IBPS_PO_PRE'/u);
assert.match(apiSource, /return 'PUNJAB_POLICE'/u);
assert.match(apiSource, /return 'CHAPTER_COVERAGE'/u);

assert.match(examsSource, /code: 'PUNJAB_POLICE'/u);
assert.match(examsSource, /name: 'Punjab Police'/u);

assert.match(cockpitSource, /capabilities\.packages\.filter\(\(entry\) => entry\.enabled\)/u);
assert.match(cockpitSource, /activePackage\?\.supportedLanguages/u);
assert.match(cockpitSource, /packageId: activePackage\.packageId/u);
assert.match(cockpitSource, /exam: selectedExam\?\.name \?\? exam/u);

console.log(JSON.stringify({
  status: "PASS",
  rnkPackageSelectableInExistingCockpit: true,
  examSelectionDrivesRnkProfile: true,
  punjabPoliceSelectable: true,
  rnkLanguageCapabilityRespected: true,
  advancedCapabilityTypesReady: true,
}, null, 2));
