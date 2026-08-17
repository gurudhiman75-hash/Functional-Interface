import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const path = resolve(process.argv[2] ?? "dist/SAP-CP-004-300-FULL-ENGLISH-REVIEW.html");
let html = readFileSync(path, "utf8");

html = html.replace(/(\([^)]+\)|-?\d+)\^x/g, "$1<sup>x</sup>");
html = html.replace(/ class="correct-option"/g, "");

if (html.includes("^x")) throw new Error("Raw unknown-exponent caret remains in the HTML review.");
const cardCount = (html.match(/<details class="question-card"/g) ?? []).length;
const optionCount = (html.match(/<li(?: class="")?>/g) ?? []).length;
if (cardCount !== 300) throw new Error(`Expected 300 HTML question cards, found ${cardCount}.`);
if (!html.includes('<span class="missing-variable"')) throw new Error("Missing-variable rendering is absent from the HTML review.");

writeFileSync(path, html, "utf8");
console.log(JSON.stringify({
  status: "FIXED_SAP_CP004_HTML_MATH_RENDERING",
  path,
  questionCards: cardCount,
  rawUnknownExponentCarets: 0,
  correctOptionPreHighlighting: false,
  observedSimpleListItems: optionCount,
}, null, 2));
