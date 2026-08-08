import {
  buildClockScene,
  renderSpatialSceneToSvg,
} from "../../../../../foundation/spatial";
import {
  CLOCK_CP001_ANGLE_MODES,
  CLOCK_CP001_TIME_FRAMES,
  generateClockCp001Question,
  type ClockAngleMode,
  type ClockCp001Difficulty,
  type ClockCp001Question,
  type ClockTimeFrame,
} from "./angle-at-time-generator";

export interface ClockCp001ReviewRow {
  reviewNumber: number;
  question: ClockCp001Question;
  targetClockSvg: string;
}

export interface ClockCp001ReviewExport {
  schemaVersion: "1.0";
  chapterCode: "CLK-001";
  checkpointCode: "CLK-CP-001";
  status: "OPEN_DISCOVERY_REVIEW";
  questionCount: number;
  rows: ClockCp001ReviewRow[];
}

function difficultyFor(
  mode: ClockAngleMode,
  frame: ClockTimeFrame,
  variant: number,
): ClockCp001Difficulty {
  if (mode === "SMALLER_ANGLE" && frame === "DIRECT" && variant === 0) {
    return "EASY";
  }
  if (
    (mode === "SMALLER_ANGLE" || mode === "REFLEX_ANGLE") &&
    frame !== "BEFORE_SHIFT"
  ) {
    return "MEDIUM";
  }
  return "HARD";
}

export function buildClockCp001ReviewExport(): ClockCp001ReviewExport {
  const rows: ClockCp001ReviewRow[] = [];
  let reviewNumber = 1;

  for (const mode of CLOCK_CP001_ANGLE_MODES) {
    for (const frame of CLOCK_CP001_TIME_FRAMES) {
      for (let variant = 0; variant < 2; variant += 1) {
        const question = generateClockCp001Question({
          seed: `CLK-CP001-REVIEW-${mode}-${frame}-${variant + 1}`,
          difficulty: difficultyFor(mode, frame, variant),
          angleMode: mode,
          frame,
          correctOptionIndex: ((reviewNumber - 1) % 4) as 0 | 1 | 2 | 3,
        });
        const targetClockSvg = renderSpatialSceneToSvg(
          buildClockScene(
            question.scenario.targetTime,
            `clk-cp001-review-${reviewNumber}`,
          ),
          {
            ariaLabel: `Clock showing ${question.scenario.targetTime.hour}:${question.scenario.targetTime.minute
              .toString()
              .padStart(2, "0")}`,
          },
        );

        rows.push({ reviewNumber, question, targetClockSvg });
        reviewNumber += 1;
      }
    }
  }

  return {
    schemaVersion: "1.0",
    chapterCode: "CLK-001",
    checkpointCode: "CLK-CP-001",
    status: "OPEN_DISCOVERY_REVIEW",
    questionCount: rows.length,
    rows,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderClockCp001ReviewHtml(
  review: ClockCp001ReviewExport,
): string {
  const rows = review.rows
    .map(({ reviewNumber, question, targetClockSvg }) => {
      const options = question.options
        .map(
          (option, index) => `
<li class="option ${option.isCorrect ? "correct" : ""}">
  <strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(option.display)}
  <span class="audit">${escapeHtml(option.label)}${
    option.likelyMistake ? ` — ${escapeHtml(option.likelyMistake)}` : ""
  }</span>
</li>`,
        )
        .join("\n");
      const steps = question.explanation.steps
        .map((step) => `<li>${escapeHtml(step)}</li>`)
        .join("\n");

      return `
<section class="question">
  <header>
    <h2>Question ${reviewNumber}</h2>
    <div class="badges">
      <span>${escapeHtml(question.scenario.angleMode)}</span>
      <span>${escapeHtml(question.scenario.frame)}</span>
      <span>${escapeHtml(question.difficulty)}</span>
    </div>
  </header>
  <p class="stem">${escapeHtml(question.stem)}</p>
  <ol class="options" type="A">${options}</ol>
  <details>
    <summary>Answer, explanation and solver evidence</summary>
    <div class="review-grid">
      <div>
        <p><strong>Answer:</strong> ${escapeHtml(question.answer.display)} (${String.fromCharCode(
          65 + question.correctOptionIndex,
        )})</p>
        <p><strong>Strategy:</strong> ${escapeHtml(question.explanation.strategy)}</p>
        <ol>${steps}</ol>
        <p><strong>Closest trap:</strong> ${escapeHtml(question.explanation.closestTrap)}</p>
        <p><strong>Conclusion:</strong> ${escapeHtml(question.explanation.conclusion)}</p>
        <p><strong>Canonical / independent:</strong> ${escapeHtml(
          question.solverEvidence.canonicalAnswer,
        )} / ${escapeHtml(question.solverEvidence.independentAnswer)}</p>
        <p><strong>Fingerprint:</strong> <code>${escapeHtml(question.fingerprint)}</code></p>
      </div>
      <div class="clock-reference">
        <p><strong>Reviewer-only target clock:</strong></p>
        ${targetClockSvg}
      </div>
    </div>
  </details>
</section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CLK-CP-001 Angle at a Stated Time — Editorial Review</title>
<style>
body{font-family:Arial,sans-serif;max-width:1120px;margin:auto;padding:24px;background:#f5f7fb;color:#172033}.question{background:#fff;border:1px solid #d7dce5;border-radius:12px;padding:20px;margin:0 0 22px}header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.badges{display:flex;flex-wrap:wrap;gap:6px}.badges span{font-size:12px;background:#eef2f7;border-radius:999px;padding:5px 8px}.stem{font-size:18px;line-height:1.5}.options{padding-left:28px}.option{margin:10px 0}.option.correct{font-weight:700}.audit{display:block;margin:4px 0 0 20px;font-size:13px;color:#5c6678;font-weight:400}.review-grid{display:grid;grid-template-columns:2fr 1fr;gap:24px}.clock-reference svg{width:190px;max-width:100%;height:auto}details{margin-top:14px}summary{cursor:pointer;font-weight:700}code{word-break:break-all}@media(max-width:760px){body{padding:12px}.question{padding:15px}.review-grid{grid-template-columns:1fr}header{display:block}.badges{margin-top:8px}}
</style>
</head>
<body>
<h1>CLK-CP-001 — Angle at a Stated Time</h1>
<p>Open-discovery editorial review. Permanent QLs, Question Studio, Question Bank and test delivery remain disabled.</p>
${rows}
</body>
</html>`;
}
