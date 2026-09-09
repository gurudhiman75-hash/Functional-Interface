import { strict as assert } from "node:assert";
import { buildCom003OfficeTabsHumanReviewFile } from "./com003-office-tabs-human-review-file-v1";

const file = buildCom003OfficeTabsHumanReviewFile();
assert.equal(file.includes("\\n"), false);
assert.equal((file.match(/\*\*Question:\*\*/g) ?? []).length, 456);
assert.equal((file.match(/## Sources/g) ?? []).length, 1);
for (const term of ["Excel Home Tab", "Excel Formulas Tab", "Excel Data Tab", "PowerPoint Design Tab", "PowerPoint Transitions Tab", "PowerPoint Animations Tab", "PowerPoint Slide Show Tab", "Quick Access Toolbar", "COM-003-OFFICE-TABS-COMPLETION-V1"]) {
  assert.ok(file.includes(term), `review file missing ${term}`);
}
console.log("[COM003-OFFICE-TABS-HUMAN-REVIEW-FILE-V1] PASS artifacts=456 real-newlines=true");
