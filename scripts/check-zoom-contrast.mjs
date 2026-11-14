import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(appRoot, "../..");

const indexHtml = fs.readFileSync(path.join(appRoot, "index.html"), "utf8");
const publicPage = fs.readFileSync(path.join(appRoot, "src/components/PublicPage.tsx"), "utf8");
const profile = fs.readFileSync(path.join(appRoot, "src/pages/profile.tsx"), "utf8");
const browserProof = fs.readFileSync(
  path.join(repoRoot, "scripts/e2e/tests/student-zoom-contrast-hardening.spec.ts"),
  "utf8",
);

assert.doesNotMatch(indexHtml, /maximum-scale\s*=\s*1/i, "student viewport must not cap browser zoom");
assert.doesNotMatch(indexHtml, /user-scalable\s*=\s*no/i, "student viewport must not disable browser zoom");

assert.match(publicPage, /bg-\[#1e1b4b\][\s\S]*?text-indigo-100/, "public hero must retain its high-contrast foreground/background contract");
assert.match(publicPage, /bg-slate-50[\s\S]*?text-slate-950[\s\S]*?text-slate-600/, "public information cards must retain explicit readable light-surface colors");

assert.match(profile, /min-h-screen bg-background/, "profile page must use the theme background instead of a permanently light gradient");
assert.doesNotMatch(profile, /from-slate-50 to-white/, "profile must not pair theme-dependent foreground text with a fixed light gradient");

assert.match(browserProof, /pageScaleFactor:\s*2/, "browser proof must exercise a 2x Chromium page scale");
assert.match(browserProof, /width:\s*640,\s*height:\s*900/, "browser proof must exercise 640px reflow, equivalent to a 1280px viewport at 200% zoom");
assert.match(browserProof, /documentElement\.scrollWidth - window\.innerWidth/, "browser proof must reject horizontal page overflow");
assert.match(browserProof, /toBeGreaterThanOrEqual\(4\.5\)/, "browser proof must enforce WCAG AA normal-text contrast");
assert.match(browserProof, /page\.goto\("\/about"\)/, "browser proof must cover a public acquisition surface");
assert.match(browserProof, /page\.goto\("\/dashboard"\)/, "browser proof must cover the preparation dashboard shell");
assert.match(browserProof, /page\.goto\("\/profile"\)/, "browser proof must cover the account/profile surface");
assert.match(browserProof, /classList\.add\("dark"\)/, "browser proof must certify profile contrast in dark theme as well as the default theme");

console.log("Zoom/reflow and contrast audit passed (14 assertions).");
