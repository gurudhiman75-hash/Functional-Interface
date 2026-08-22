import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
const home = read("../src/pages/home.tsx");
const proof = read("../../../scripts/e2e/tests/student-premium-home.spec.ts");
const pkg = JSON.parse(read("../package.json"));

assert.equal(pkg.scripts["audit:premium-home"], "node scripts/check-premium-home.mjs");
assert.match(pkg.scripts.quality, /audit:premium-home/);

assert.match(home, /data-testid="premium-home"/);
assert.match(home, /data-testid="home-premium-hero"/);
assert.match(home, /data-testid="home-exam-discovery"/);
assert.match(home, /data-testid="home-practice-continuity"/);
assert.match(home, /data-testid="home-featured-mocks"/);
assert.match(home, /Structured mock tests for serious exam practice\./);
assert.match(home, /aria-label="Search exams and tests"/);
assert.match(home, /Published tests/);
assert.match(home, /Live questions/);
assert.match(home, /Exam families/);
assert.match(home, /Browse live tests/);
assert.match(home, /attemptId=\$\{encodeURIComponent\(latestAttempt\.id\)\}/);
assert.match(home, /min-h-11/);
assert.match(home, /et-panel-raised/);
assert.match(home, /et-interactive/);
assert.match(home, /bg-primary\/10/);
assert.match(home, /text-muted-foreground/);
assert.doesNotMatch(home, /bg-\[#/);
assert.doesNotMatch(home, /text-slate-/);
assert.doesNotMatch(home, /bg-slate-/);
assert.doesNotMatch(home, /shadow-\[0_8px_30px/);
assert.doesNotMatch(home, /Most Advanced|Current Active Users|Amandeep K\.|Ritika S\.|Harsh M\./);

assert.match(proof, /home-premium-hero/);
assert.match(proof, /home-exam-discovery/);
assert.match(proof, /home-practice-continuity/);
assert.match(proof, /home-featured-mocks/);
assert.match(proof, /Search exams and tests/);
assert.match(proof, /scrollWidth <= window\.innerWidth \+ 1/);
assert.match(proof, /toBeGreaterThanOrEqual\(44\)/);

console.log("Premium Home acquisition audit passed.");
