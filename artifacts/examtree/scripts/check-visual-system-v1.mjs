import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const read = (relative) => fs.readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");

const publicLayout = read("../src/components/PublicLayout.tsx");
const seriesCard = read("../src/components/ExamSeriesCard.tsx");
const category = read("../src/pages/category.tsx");
const subcategory = read("../src/pages/subcategory.tsx");
const home = read("../src/pages/home.tsx");

assert.match(publicLayout, /h-\[72px\]/, "public header should retain the calmer 72px navigation rhythm");
assert.match(publicLayout, /border-b-2[\s\S]*?border-indigo-700/, "desktop active navigation should use an underline rather than a filled pill");
assert.match(publicLayout, /href="\/mock-tests"[\s\S]*?Start a mock/, "public primary CTA should lead directly to mock tests");
assert.match(publicLayout, /\{ label: "Resources", href: "\/blog" \}/, "top navigation should keep secondary help links out of the primary row");
assert.doesNotMatch(publicLayout, /\{ label: "FAQ", href: "\/faq" \},\n\];/, "FAQ should not return to the primary navigation row");

assert.match(seriesCard, /export function ExamSeriesCard/, "exam series should have one canonical shared card component");
assert.match(seriesCard, /aria-label=\{`Open \$\{series\.name\} test series`\}/, "canonical series card should keep an explicit accessible action name");
assert.match(seriesCard, /series\.fullLengthCount/, "series card should expose full-length composition");
assert.match(seriesCard, /series\.sectionalCount/, "series card should expose sectional composition");
assert.match(seriesCard, /series\.topicWiseCount/, "series card should expose topic-wise composition");
assert.match(seriesCard, /metrics\.attemptedCount/, "series card should preserve truthful learner progress when available");

assert.match(category, /<ExamSeriesCard/, "category discovery should consume the canonical series card");
assert.doesNotMatch(category, /CATEGORY_STYLES|backgroundImage: gradient/, "category discovery should not reintroduce competing decorative gradient identities");
assert.doesNotMatch(category, /hover:-translate-y-1/, "category discovery should avoid exaggerated card lift motion");

assert.doesNotMatch(subcategory, /CATEGORY_STYLES|backgroundImage: gradient/, "exam detail should share the restrained Examtree identity instead of a separate gradient theme");
assert.doesNotMatch(subcategory, /viewMode|List view|Grid view/, "exam detail should keep one canonical test-inventory presentation");
assert.match(subcategory, /Available tests/, "exam detail should prioritize test discovery before commerce");
assert.match(subcategory, /Packages for this exam/, "exam commerce should remain a clearly secondary section after test inventory");
assert.match(subcategory, /aria-pressed=\{active\}/, "test-format controls should expose their selected state without incomplete tab semantics");
assert.match(subcategory, /attemptId=\$\{encodeURIComponent\(latestAttempt\.id\)\}/, "visual redesign must preserve exact-attempt review navigation");
assert.doesNotMatch(subcategory, /hover:scale-\[1\.015\]|bg-gradient-to-r from-amber-500|bg-gradient-to-r from-violet-600/, "exam detail should not restore aggressive commerce or action gradients");

assert.doesNotMatch(home, /shadow-\[0_8px_30px_rgb\(0,0,0,0\.12\)\]/, "homepage should not regress to the old repeated heavy shadow treatment");

console.log("Visual system V1 audit passed (22 assertions).");
