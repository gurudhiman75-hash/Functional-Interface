import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const files = {
  home: fs.readFileSync(path.join(appRoot, "src/pages/home.tsx"), "utf8"),
  activity: fs.readFileSync(path.join(appRoot, "src/pages/activity.tsx"), "utf8"),
  tests: fs.readFileSync(path.join(appRoot, "src/pages/tests.tsx"), "utf8"),
  result: fs.readFileSync(path.join(appRoot, "src/pages/canonical-result.tsx"), "utf8"),
};

const forbidden = [
  ["home", "Current Active Users", "Do not present derived attempt counts as live-user telemetry."],
  ["home", "Questions Generated:", "Do not present generated-question marketing counters without a canonical metric."],
  ["home", "Most Advanced", "Avoid unverifiable product superlatives on production surfaces."],
  ["home", "Amandeep K.", "Prototype testimonial must not appear in production."],
  ["home", "Ritika S.", "Prototype testimonial must not appear in production."],
  ["home", "Harsh M.", "Prototype testimonial must not appear in production."],
  ["home", "08:42:10", "Hard-coded challenge countdown must not appear in production."],
  ["home", "2024 patterns updated", "Do not claim pattern freshness without canonical evidence."],
  ["home", "50+ added", "Do not claim PYQ inventory counts without canonical evidence."],
  ["home", 'setLocation("/performance")', "Pending analytics must not be promoted from the production homepage."],
  ["activity", "Practice time", "Activity time is calculated from real attempts and must not be labelled practice time."],
  ["activity", "Analytics, rankings, packages, and payments will be enabled", "Production student UI must not advertise roadmap functionality."],
  ["tests", "API expected at", "Student-facing errors must not expose backend configuration details."],
  ["result", "const localResult", "Canonical results must not render browser-local score content as official."],
  ["result", "attemptId ? resultQuery.data :", "Canonical results must not branch to local score content when an attempt id is absent."],
];

const required = [
  ["home", "Published tests:", "Homepage should expose a truthful catalog-backed test count."],
  ["home", "Questions in live catalog:", "Homepage should expose only the current catalog question count."],
  ["home", "Browse Live Tests", "Homepage primary CTA must lead to a live student journey."],
  ["home", "attemptId=", "Resume/review link must carry the canonical attempt id."],
  ["tests", "The test catalog is temporarily unavailable.", "Catalog errors should use student-safe recovery copy."],
  ["result", "Submission is not confirmed yet", "A missing committed attempt id must render a truthful recovery state."],
  ["result", "const resolvedAttemptId = attemptId ?? cachedAttemptId", "Legacy test-only links may recover an identifier but not local score content."],
  ["result", "getAttemptById(resolvedAttemptId!)", "Every displayed result must be fetched from the canonical attempt endpoint."],
  ["result", "Canonical saved result", "Committed result pages should retain explicit canonical provenance."],
];

const failures = [];

for (const [fileKey, needle, reason] of forbidden) {
  if (files[fileKey].includes(needle)) failures.push(`${fileKey}: forbidden text \"${needle}\" — ${reason}`);
}

for (const [fileKey, needle, reason] of required) {
  if (!files[fileKey].includes(needle)) failures.push(`${fileKey}: missing \"${needle}\" — ${reason}`);
}

if (failures.length) {
  console.error("Production truth audit failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Production truth audit passed (${forbidden.length + required.length} assertions).`);
