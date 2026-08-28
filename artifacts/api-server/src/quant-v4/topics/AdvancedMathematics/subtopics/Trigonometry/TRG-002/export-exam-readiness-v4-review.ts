import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { formatExactPlain } from "../foundation/exact";
import { generateTrg002V4CanonicalQuestion, isTrg002V4CanonicalOverride } from "./exam-readiness-v4-canonical";
import { generateTrg002V4CandidateQuestion } from "./exam-readiness-v4-candidate";
import { buildTrg002V4BaselineAudit } from "./exam-readiness-v4-audit";
import { applyTrg002V4PhysicalSupportMigration } from "./exam-readiness-v4-physical-support";
import { renderTrg002SolutionDiagramSvg } from "./exam-readiness-v4-review-svg";
import {
  applyTrg002V4RiverPlatformMigration,
  generateLocalizedTrg002V4RiverQl093,
  isTrg002V4RiverMathOverride,
} from "./exam-readiness-v4-river";
import {
  generateTrg002V4NaturalMeasurementQuestion,
  isTrg002V4NaturalMeasurementOverride,
} from "./exam-readiness-v4-natural-measurements";
import {
  generateTrg002V4ScenarioWave3Question,
  isTrg002V4ScenarioWave3,
} from "./exam-readiness-v4-scenario-wave3";
import {
  generateTrg002V4ScenarioWave4Question,
  isTrg002V4ScenarioWave4,
} from "./exam-readiness-v4-scenario-wave4";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
mkdirSync(outDir, { recursive: true });

function esc(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function stringify(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current, 2);
}

const SUBSCRIPT_DIGITS: Record<string, string> = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
const SUPERSCRIPT_DIGITS: Record<string, string> = { "²": "2", "³": "3" };
const UNICODE_WORD = String.raw`[\p{L}\p{M}]+(?:[-‑][\p{L}\p{M}]+)*`;
const WORD_PHRASE = String.raw`${UNICODE_WORD}(?:\s+${UNICODE_WORD}){0,1}`;
const TRIG = String.raw`(?:tan|sin|cos|cot|sec|cosec)\s*(?:θ|\d+(?:\.\d+)?°?)`;
const VARIABLE = String.raw`[A-Za-z][A-Za-z₀-₉²³]*`;
const NUMBER = String.raw`[-−]?\d+(?:\.\d+)?(?:√\d+)?(?:[²³]+)?°?`;
const PAREN = String.raw`\([^()]{1,40}\)`;
const BRACKET_PRODUCT = String.raw`\[(?:\([^()]{1,40}\)){1,4}\]`;
const IMPLICIT_TRIG_PRODUCT = String.raw`${VARIABLE}\s*${TRIG}`;
const IMPLICIT_PAREN_PRODUCT = String.raw`${NUMBER}\s*${PAREN}`;
const MATH_TOKEN = String.raw`(?:${IMPLICIT_TRIG_PRODUCT}|${IMPLICIT_PAREN_PRODUCT}|${TRIG}|${BRACKET_PRODUCT}|(?:horizontal|vertical)\s+(?:distance|run|drop)|${VARIABLE}|${NUMBER}|√\d+|${WORD_PHRASE}|${PAREN})`;
const MATH_EXPR = new RegExp(String.raw`${MATH_TOKEN}(?:\s*(?:=|\+|−|-|×|·|\/|⇒)\s*${MATH_TOKEN})+(?:\s*m)?|${TRIG}|(?:-?\d+(?:\.\d+)?\s*(?:\+|−|-)\s*)?\d*√\d+(?:\/\d+)?(?:\s*m)?|\b\d+(?:\.\d+)?°`, "gu");
const MATH_SIGNAL = /(?:[=√×⇒]|\b(?:tan|sin|cos|cot|sec|cosec)\s*(?:θ|\d)|\d+(?:\.\d+)?°|[A-Za-z0-9][²³])/u;
const unformattedMathFragments: string[] = [];

function toTex(value: unknown) {
  let text = String(value ?? "").trim();
  text = text.replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, (digits) => `_{${Array.from(digits).map((digit) => SUBSCRIPT_DIGITS[digit] ?? digit).join("")}}`);
  text = text.replace(/([A-Za-z0-9])([²³]+)/g, (_match, base, digits) => `${base}^{${Array.from(String(digits)).map((digit) => SUPERSCRIPT_DIGITS[digit] ?? digit).join("")}}`);
  text = text.replace(/√\s*\(([^()]+)\)/g, "\\sqrt{$1}");
  text = text.replace(/√\s*([A-Za-z0-9.]+)/g, "\\sqrt{$1}");
  text = text.replace(/\b(tan|sin|cos|cot|sec|cosec)\s*/g, "\\$1 ");
  text = text.replace(/θ/g, "\\theta ");
  text = text.replace(/(\d+(?:\.\d+)?)°/g, "$1^{\\circ}");
  text = text.replace(/×/g, "\\times ");
  text = text.replace(/·/g, "\\cdot ");
  text = text.replace(/⇒/g, "\\Rightarrow ");
  text = text.replace(/−/g, "-");
  text = text.replace(/\b(horizontal|vertical)\s+(distance|run|drop)\b/g, "\\text{$1 $2}");
  text = text.replace(/([\p{L}\p{M}]*[^\x00-\x7F][\p{L}\p{M}]*(?:[-‑][\p{L}\p{M}]+)*)/gu, "\\text{$1}");
  text = text.replace(/\s+m$/g, "\\,\\mathrm{m}");
  return text;
}

function mathMlRow(value: unknown): string {
  const raw = String(value ?? "");
  let i = 0;
  let out = "";
  const operators = new Set(["=", "+", "−", "-", "×", "·", "/", "⇒", "(", ")", "[", "]", ","]);
  const trig = ["cosec", "sin", "cos", "tan", "cot", "sec"];

  while (i < raw.length) {
    const rest = raw.slice(i);
    const ws = rest.match(/^\s+/);
    if (ws) {
      out += `<mspace width="0.18em"/>`;
      i += ws[0].length;
      continue;
    }

    const trigName = trig.find((name) => rest.startsWith(name));
    if (trigName) {
      out += `<mi mathvariant="normal">${trigName}</mi>`;
      i += trigName.length;
      continue;
    }

    if (raw[i] === "θ") {
      out += `<mi>θ</mi>`;
      i++;
      continue;
    }

    if (raw[i] === "√") {
      const after = raw.slice(i + 1);
      const paren = after.match(/^\(([^()]*)\)/);
      if (paren) {
        out += `<msqrt><mrow>${mathMlRow(paren[1])}</mrow></msqrt>`;
        i += 1 + paren[0].length;
        continue;
      }
      const radicand = after.match(/^[A-Za-z0-9.]+/);
      if (radicand) {
        out += `<msqrt><mrow>${mathMlRow(radicand[0])}</mrow></msqrt>`;
        i += 1 + radicand[0].length;
        continue;
      }
      out += `<mo>√</mo>`;
      i++;
      continue;
    }

    const signedNumber = rest.match(/^([−-]?)(\d+(?:\.\d+)?)/);
    if (signedNumber) {
      if (signedNumber[1]) out += `<mo>${signedNumber[1] === "−" ? "−" : "-"}</mo>`;
      const base = signedNumber[2]!;
      i += signedNumber[0].length;
      const superscripts = raw.slice(i).match(/^[²³]+/);
      if (superscripts) {
        const exponent = Array.from(superscripts[0]).map((digit) => SUPERSCRIPT_DIGITS[digit] ?? digit).join("");
        out += `<msup><mn>${base}</mn><mn>${exponent}</mn></msup>`;
        i += superscripts[0].length;
      } else if (raw[i] === "°") {
        out += `<msup><mn>${base}</mn><mo>°</mo></msup>`;
        i++;
      } else {
        out += `<mn>${base}</mn>`;
      }
      continue;
    }

    const variableWithSubscript = rest.match(/^([A-Za-z])([₀₁₂₃₄₅₆₇₈₉]+)/);
    if (variableWithSubscript) {
      const subscript = Array.from(variableWithSubscript[2]).map((digit) => SUBSCRIPT_DIGITS[digit] ?? digit).join("");
      out += `<msub><mi>${esc(variableWithSubscript[1])}</mi><mn>${subscript}</mn></msub>`;
      i += variableWithSubscript[0].length;
      continue;
    }

    const variableWithSuperscript = rest.match(/^([A-Za-z])([²³]+)/);
    if (variableWithSuperscript) {
      const exponent = Array.from(variableWithSuperscript[2]).map((digit) => SUPERSCRIPT_DIGITS[digit] ?? digit).join("");
      out += `<msup><mi>${esc(variableWithSuperscript[1])}</mi><mn>${exponent}</mn></msup>`;
      i += variableWithSuperscript[0].length;
      continue;
    }

    const word = rest.match(/^[A-Za-z]+/);
    if (word) {
      const isUnit = word[0] === "m" && /^\s*$/.test(raw.slice(i + 1));
      out += isUnit ? `<mtext>m</mtext>` : word[0].length === 1 ? `<mi>${esc(word[0])}</mi>` : `<mtext>${esc(word[0])}</mtext>`;
      i += word[0].length;
      continue;
    }

    const localizedWord = rest.match(/^[\p{L}\p{M}]+(?:[-‑][\p{L}\p{M}]+)*/u);
    if (localizedWord) {
      out += `<mtext>${esc(localizedWord[0])}</mtext>`;
      i += localizedWord[0].length;
      continue;
    }

    const char = raw[i]!;
    if (operators.has(char)) {
      const op = char === "⇒" ? "⇒" : char === "−" ? "−" : char;
      out += `<mo>${esc(op)}</mo>`;
      i++;
      continue;
    }

    out += `<mtext>${esc(char)}</mtext>`;
    i++;
  }
  return out;
}

function mathSpan(value: unknown) {
  const raw = String(value ?? "");
  return `<span class="math-inline" data-tex="${esc(toTex(raw))}"><math class="mathml" xmlns="http://www.w3.org/1998/Math/MathML"><mrow>${mathMlRow(raw)}</mrow></math></span>`;
}

function appendPlainMathAudit(value: string) {
  if (MATH_SIGNAL.test(value)) {
    const fragment = value.trim();
    if (fragment) unformattedMathFragments.push(fragment);
  }
  return esc(value);
}

function richMath(value: unknown) {
  const raw = String(value ?? "");
  let html = "";
  let cursor = 0;
  MATH_EXPR.lastIndex = 0;
  for (const match of raw.matchAll(MATH_EXPR)) {
    const index = match.index ?? 0;
    if (index < cursor) continue;
    html += appendPlainMathAudit(raw.slice(cursor, index));
    html += mathSpan(match[0]);
    cursor = index + match[0].length;
  }
  html += appendPlainMathAudit(raw.slice(cursor));
  return html;
}

function englishRiverQl093(seed: string) {
  const q: any = generateLocalizedTrg002V4RiverQl093(seed, "hi-IN");
  const observer = q.canonicalSpatialState.observers[0];
  if (!observer) throw new Error("TRG-002-QL-093 V4 review: canonical observer missing.");
  const height = formatExactPlain(observer.eyeHeight);
  const width = q.exactAnswer.kind === "NUMBER" ? formatExactPlain(q.exactAnswer.value) : q.answer.replace(/ m$/, "");
  return {
    ...q,
    language: "en" as const,
    stem: `An observation platform on one bank of a river is ${height} m high. From its top, the point directly opposite on the other bank is seen at an angle of depression of 60°. Find the exact width of the river.`,
    explanation: {
      keyRule: "The platform height is the vertical drop and the river width is the horizontal side of the depression triangle.",
      steps: [
        { title: "Given", body: `The platform height is ${height} m. Let the river width be w m.` },
        { title: "Calculation", body: `tan60° = ${height}/w = √3, so w = ${height}/√3 = ${width} m.` },
      ],
      shortcut: "At 60°, river width = vertical platform height/√3.",
      traps: ["The river width is the perpendicular horizontal distance between the banks, not the sloping line of sight."],
    },
  };
}

function englishBridgeQl021(question: any) {
  const observer = question.canonicalSpatialState.observers[0];
  if (!observer) throw new Error("TRG-002-QL-021 V4 review: canonical observer missing.");
  const height = formatExactPlain(observer.eyeHeight);
  return {
    ...question,
    stem: `From the edge of a ${height} m high pedestrian overbridge above a level road, a point on the road is seen at an angle of depression of 45°. Find the horizontal distance from the point directly below the bridge edge to that road point.`,
    explanation: {
      keyRule: "The bridge height is the vertical drop. At a 45° angle of depression, the vertical drop and horizontal run are equal.",
      steps: [
        { title: "Given", body: `Bridge height = ${height} m and angle of depression = 45°.` },
        { title: "Calculation", body: `Let the horizontal distance be d. tan45° = ${height}/d = 1, so d = ${height} m.` },
      ],
      shortcut: "At 45°, the vertical and horizontal legs of the right triangle are equal.",
      traps: ["Do not use the sloping line of sight as the required horizontal road distance."],
    },
  };
}

function generateEnglishV4ReviewQuestion(qlId: string, seed: string) {
  if (isTrg002V4ScenarioWave4(qlId)) return generateTrg002V4ScenarioWave4Question(qlId, seed, "en");
  if (isTrg002V4ScenarioWave3(qlId)) return generateTrg002V4ScenarioWave3Question(qlId, seed, "en");
  if (isTrg002V4NaturalMeasurementOverride(qlId)) return generateTrg002V4NaturalMeasurementQuestion(qlId, seed, "en");
  if (isTrg002V4RiverMathOverride(qlId)) return englishRiverQl093(seed);
  return generateTrg002V4CanonicalQuestion(qlId, seed);
}

const qlIds = Array.from({ length: 96 }, (_, index) => `TRG-002-QL-${String(index + 1).padStart(3, "0")}`);
const records = qlIds.map((qlId, index) => {
  const seed = `trg002-v4-human-review-${String(index + 1).padStart(3, "0")}`;
  const rawEn: any = generateEnglishV4ReviewQuestion(qlId, seed);
  const englishPhysicalSupport = applyTrg002V4PhysicalSupportMigration(rawEn);
  const englishRiverSupport = applyTrg002V4RiverPlatformMigration(englishPhysicalSupport.question);
  const enBase: any = englishRiverSupport.question;
  const en: any = qlId === "TRG-002-QL-021" ? englishBridgeQl021(enBase) : enBase;
  const hi: any = generateTrg002V4CandidateQuestion(qlId, seed, "hi-IN");
  const pa: any = generateTrg002V4CandidateQuestion(qlId, seed, "pa-IN");
  return {
    qlId,
    cpId: en.cpId,
    difficulty: en.difficulty,
    lockedFamily: en.lockedFamily,
    solveMode: en.solveMode,
    seed,
    v4CanonicalOverride: isTrg002V4CanonicalOverride(qlId) || isTrg002V4RiverMathOverride(qlId),
    v4NaturalMeasurementOverride: isTrg002V4NaturalMeasurementOverride(qlId),
    v4ScenarioWave3Override: isTrg002V4ScenarioWave3(qlId),
    v4ScenarioWave4Override: isTrg002V4ScenarioWave4(qlId),
    v4PhysicalSupportMigrated: englishPhysicalSupport.migrated || englishRiverSupport.migrated,
    english: { stem: en.stem, options: en.options, answer: en.answer, explanation: en.explanation },
    hindi: { stem: hi.stem, options: hi.options, answer: hi.answer, explanation: hi.explanation, v4ExamReadiness: hi.v4ExamReadiness },
    punjabi: { stem: pa.stem, options: pa.options, answer: pa.answer, explanation: pa.explanation, v4ExamReadiness: pa.v4ExamReadiness },
    solutionDiagram: en.solutionDiagram,
    diagramEvidence: en.diagramEvidence,
    canonicalSpatialState: en.canonicalSpatialState,
    validation: en.validation,
    lifecycle: {
      historicalEnglishAuthorityMutated: false,
      v4CandidateOnly: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioDiscoverable: false,
    },
  };
});

const audit = buildTrg002V4BaselineAudit("trg002-v4-review-audit");
const cards = records.map((r) => {
  const lang = (title: string, q: any) => `<section class="lang"><h3>${title}</h3><p class="stem math-rich">${richMath(q.stem)}</p><ol>${q.options.map((o: any) => `<li class="${o.isCorrect ? "correct" : ""}">${esc(o.label)}. ${mathSpan(o.display)}${o.isCorrect ? " ✓" : ""}</li>`).join("")}</ol><p><b>Answer:</b> ${mathSpan(q.answer)}</p><p class="math-rich"><b>Rule:</b> ${richMath(q.explanation.keyRule)}</p><ol>${q.explanation.steps.map((s: any) => `<li class="math-rich"><b>${esc(s.title)}:</b> ${richMath(s.body)}</li>`).join("")}</ol>${q.v4ExamReadiness ? `<p><b>V4 topology:</b> ${esc(q.v4ExamReadiness.spatialTopology)} · <b>scenario:</b> ${esc(q.v4ExamReadiness.recommendedScenarioShell)} · <b>text applied:</b> ${esc(q.v4ExamReadiness.scenarioTextApplied)} · <b>full surface:</b> ${esc(q.v4ExamReadiness.scenarioSurfaceApplied)} · <b>natural measurements:</b> ${esc(q.v4ExamReadiness.naturalMeasurementOverride)} · <b>physical support:</b> ${esc(q.v4ExamReadiness.physicalObserverSupport)} · <b>diagram pending:</b> ${esc(q.v4ExamReadiness.diagramMigrationRequired)}</p>` : ""}</section>`;
  const diagram = renderTrg002SolutionDiagramSvg({ ...r.solutionDiagram, qlId: r.qlId });
  return `<article class="card"><header><h2>${esc(r.qlId)} · ${esc(r.difficulty)}${r.v4CanonicalOverride ? " · V4 CANONICAL OVERRIDE" : ""}${r.v4NaturalMeasurementOverride ? " · V4 NATURAL-MEASUREMENT OVERRIDE" : ""}${r.v4ScenarioWave3Override ? " · V4 STRUCTURAL WAVE3" : ""}${r.v4ScenarioWave4Override ? " · V4 STRUCTURAL WAVE4" : ""}${r.v4PhysicalSupportMigrated ? " · V4 PHYSICAL-SUPPORT MIGRATION" : ""}</h2><p>${esc(r.lockedFamily)} · ${esc(r.solveMode)}</p></header><div class="langs">${lang("English V4 candidate", r.english)}${lang("Hindi V4 candidate", r.hindi)}${lang("Punjabi V4 candidate", r.punjabi)}</div><section class="visual"><h3>Solution diagram</h3>${diagram}<details class="debug-spec"><summary>Diagram specification + evidence</summary><pre>${esc(stringify(r.solutionDiagram))}</pre><pre>${esc(stringify(r.diagramEvidence))}</pre></details><details class="debug-spec"><summary>Canonical spatial state</summary><pre>${esc(stringify(r.canonicalSpatialState))}</pre></details></section></article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-002 V4 Exam Readiness Review</title><style>body{font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;background:#f4f4f4;color:#111;margin:0}.page{max-width:1600px;margin:auto;padding:20px}.summary,.card{background:white;border:1px solid #ddd;border-radius:10px;padding:18px;margin-bottom:18px}.langs{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.lang{border:1px solid #e4e4e4;border-radius:8px;padding:14px}.stem{font-size:17px;line-height:1.55}.correct{font-weight:700}.math-inline{display:inline-flex;align-items:baseline;vertical-align:-0.08em;margin:0 .05em;white-space:nowrap}.math-inline math{font-family:"STIX Two Math","Cambria Math","Times New Roman",serif;font-size:1.06em}.visual{margin-top:16px;border-top:1px solid #ddd;padding-top:14px}.diagram-figure{margin:10px 0 14px}.diagram-caption{font-size:14px;color:#475569;margin:0 0 8px}.solution-diagram{display:block;width:100%;height:auto;max-height:520px;background:#fff;border-radius:10px}.solution-diagram text{font-family:Arial,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;fill:#111827}.solution-diagram .point-label{font-weight:600}.solution-diagram .angle-label{font-weight:700;fill:#6d28d9}.solution-diagram .measurement-label{font-weight:700;fill:#0f766e}.solution-diagram .label-bg{vector-effect:non-scaling-stroke}.debug-spec{margin-top:10px}.debug-spec summary{cursor:pointer;font-weight:700;color:#475569}.visual pre{white-space:pre-wrap;background:#f7f7f7;border:1px solid #eee;border-radius:6px;padding:10px;overflow:auto}.diagram-missing{padding:18px;border:1px dashed #cbd5e1;border-radius:8px;color:#64748b}.blocker{color:#8a1c1c;font-weight:700}@media(max-width:1050px){.langs{grid-template-columns:1fr}.page{padding:10px}.solution-diagram .diagram-label text{font-size:20px}}</style></head><body><main class="page"><section class="summary"><h1>TRG-002 V4 · Comprehensive Exam-Readiness Review</h1><p><b>Scope:</b> 96 V4 candidate QLs shown side-by-side in English, Hindi and Punjabi, with self-contained MathML mathematical notation and TeX fallback metadata, rendered solution geometry, canonical spatial state and diagram evidence.</p><p class="blocker">This remains a blocker-discovery artifact, not a freeze artifact. Historical frozen English authority is untouched; V4 canonical overrides, natural-measurement overrides, structural scenario waves and physical-support migrations are separate candidates.</p><pre>${esc(stringify(audit))}</pre></section>${cards}</main></body></html>`;

const renderedSvgs = html.match(/<svg class="solution-diagram"[\s\S]*?<\/svg>/g) ?? [];
const mathNodes = html.match(/<math class="mathml"/g) ?? [];
const textLabels = html.match(/class="(?:point-label|angle-label|measurement-label)"/g) ?? [];
const labelBoxes = html.match(/data-label-box="true"/g) ?? [];
if (renderedSvgs.length !== 96) throw new Error(`TRG-002 V4 review expected 96 SVGs, got ${renderedSvgs.length}.`);
if (mathNodes.length < 1000) throw new Error(`TRG-002 V4 review expected broad math typesetting coverage, got only ${mathNodes.length} MathML nodes.`);
if (unformattedMathFragments.length !== 0) throw new Error(`TRG-002 V4 review left ${unformattedMathFragments.length} math-like plain-text fragments; first=${unformattedMathFragments.slice(0, 8).join(" || ")}`);
if (textLabels.length === 0 || labelBoxes.length !== textLabels.length) throw new Error(`TRG-002 V4 review label collision protection mismatch: labels=${textLabels.length}, boxes=${labelBoxes.length}.`);

writeFileSync(join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json"), stringify({ audit, records }), "utf8");
writeFileSync(join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html"), html, "utf8");
console.log(`TRG002_V4_REVIEW_EXPORT_PASS qls=${records.length} languages=3 canonicalOverrides=${records.filter((r) => r.v4CanonicalOverride).length} naturalMeasurementOverrides=${records.filter((r) => r.v4NaturalMeasurementOverride).length} wave3=${records.filter((r) => r.v4ScenarioWave3Override).length} wave4=${records.filter((r) => r.v4ScenarioWave4Override).length} physicalSupportMigrations=${records.filter((r) => r.v4PhysicalSupportMigrated).length} renderedSvgs=${renderedSvgs.length} mathMlNodes=${mathNodes.length} unformattedMathFragments=0 collisionProtectedLabels=${labelBoxes.length} freeze=OFF activation=OFF`);
