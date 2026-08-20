import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const contact = fs.readFileSync(fileURLToPath(new URL("../src/pages/contact.tsx", import.meta.url)), "utf8");
const report = fs.readFileSync(fileURLToPath(new URL("../src/pages/report-question.tsx", import.meta.url)), "utf8");
const proof = fs.readFileSync(fileURLToPath(new URL("../../../scripts/e2e/tests/student-support-handoff.spec.ts", import.meta.url)), "utf8");
const pkg = JSON.parse(fs.readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf8"));

assert.equal(pkg.scripts["audit:support-handoff"], "node scripts/check-support-handoff.mjs");
assert.match(pkg.scripts.quality, /audit:support-handoff/);
for (const [name, source] of [["contact", contact], ["report", report]]) {
  assert.match(source, /support@examtree\.in/, `${name} must use the published support mailbox`);
  assert.match(source, /mailto:/, `${name} must provide a real email handoff`);
  assert.doesNotMatch(source, /<Button type="button"/, `${name} must not retain a dead submit-looking button`);
  assert.match(source, /Nothing is (uploaded|submitted) to ExamTree until you review and send the email\./, `${name} must explain that no server submission occurs`);
  assert.match(source, /h-11|min-h-11|data-testid=/, `${name} must retain a 44px-class actionable handoff`);
}
assert.match(contact, /contact-email-handoff/);
assert.match(contact, /Issue category:/);
assert.match(contact, /Reply email:/);
assert.match(report, /report-email-handoff/);
assert.match(report, /Question ID or test:/);
assert.match(report, /Issue type:/);
assert.match(proof, /mailto:support@examtree\.in/);
assert.match(proof, /Payment%20or%20refund/);
assert.match(proof, /Translation%20issue/);
assert.match(proof, /toBeGreaterThanOrEqual\(44\)/);

console.log("Support handoff audit passed (18 assertions).");
