import type { Trg002DiagramStrategy } from "./spatial";
import type { Trg002ProofQlId } from "./runtime-proof";
import {
  generateAllSolutionDiagramTrg002RuntimeProofQuestions,
  generateSolutionDiagramTrg002RuntimeProofQuestion,
} from "./runtime-proof-solution-diagram";
import { renderTrg002DiagramReviewSvg } from "./diagram-review-svg";

export const TRG_002_DIAGRAM_REVIEW_REPRESENTATIVES: ReadonlyArray<{
  strategy: Trg002DiagramStrategy;
  qlId: Trg002ProofQlId;
}> = [
  { strategy: "SINGLE_ELEVATION", qlId: "TRG-002-QL-001" },
  { strategy: "SINGLE_DEPRESSION", qlId: "TRG-002-QL-015" },
  { strategy: "SHADOW", qlId: "TRG-002-QL-025" },
  { strategy: "LADDER", qlId: "TRG-002-QL-036" },
  { strategy: "GUY_WIRE", qlId: "TRG-002-QL-045" },
  { strategy: "TWO_OBSERVATIONS_SAME_SIDE", qlId: "TRG-002-QL-049" },
  { strategy: "OBSERVER_MOVES_CLOSER", qlId: "TRG-002-QL-056" },
  { strategy: "OBSERVER_MOVES_FARTHER", qlId: "TRG-002-QL-061" },
  { strategy: "OBSERVER_HEIGHT", qlId: "TRG-002-QL-073" },
  { strategy: "OPPOSITE_SIDE_OBSERVATIONS", qlId: "TRG-002-QL-078" },
  { strategy: "BUILDING_TO_BUILDING", qlId: "TRG-002-QL-083" },
  { strategy: "ELEVATION_AND_DEPRESSION", qlId: "TRG-002-QL-088" },
  { strategy: "RIVER_WIDTH", qlId: "TRG-002-QL-092" },
] as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildTrg002DiagramReviewCases(seed = "trg002-diagram-review-01") {
  return TRG_002_DIAGRAM_REVIEW_REPRESENTATIVES.map(({ strategy, qlId }) => {
    const question = generateSolutionDiagramTrg002RuntimeProofQuestion(qlId, seed);
    if (question.solutionDiagram.strategy !== strategy) {
      throw new Error(`${qlId}: expected review strategy ${strategy}, got ${question.solutionDiagram.strategy}.`);
    }
    return {
      strategy,
      qlId,
      seed,
      stem: question.stem,
      answer: question.answer,
      difficulty: question.difficulty,
      exactDiagram: question.solutionDiagram,
      solutionAnnotations: question.solutionAnnotations,
      svg: renderTrg002DiagramReviewSvg(question.solutionDiagram, {
        title: `${qlId} solution diagram — ${strategy}`,
        annotations: question.solutionAnnotations,
      }),
      validation: question.validation,
      canonicalTargetVerification: question.verification.canonicalTarget,
      diagramPolicyVerification: question.verification.diagramPolicy,
      solutionAnnotationVerification: question.verification.solutionAnnotations,
    };
  });
}

export function proofDiagramStrategies(seed = "trg002-diagram-review-01") {
  return new Set(
    generateAllSolutionDiagramTrg002RuntimeProofQuestions(seed)
      .map((question) => question.solutionDiagram.strategy),
  );
}

export function renderTrg002DiagramReviewHtml(seed = "trg002-diagram-review-01") {
  const cases = buildTrg002DiagramReviewCases(seed);
  const cards = cases.map((item) => `
    <article class="review-card" data-review-card="${escapeHtml(item.qlId)}" data-strategy="${escapeHtml(item.strategy)}">
      <header>
        <div>
          <h2>${escapeHtml(item.qlId)}</h2>
          <p class="strategy">${escapeHtml(item.strategy)} · ${escapeHtml(item.difficulty)}</p>
        </div>
        <span class="status">solution only</span>
      </header>
      <p class="stem"><strong>Stem:</strong> ${escapeHtml(item.stem)}</p>
      <div class="diagram-frame">${item.svg}</div>
      <p class="answer"><strong>Answer:</strong> ${escapeHtml(item.answer)}</p>
      <p class="annotation-count"><strong>Exact solution labels:</strong> ${item.solutionAnnotations.length}</p>
      <ul class="checklist">
        <li>Ground/object/sight-line geometry is visually legible.</li>
        <li>Angle marker is attached to the correct observer/reference horizontal.</li>
        <li>Given and solved measurement labels sit on the intended canonical segment.</li>
        <li>Solved target labels agree with the exact answer and appear only in the solution figure.</li>
        <li>Point/measurement labels do not overlap important lines or angle text.</li>
        <li>No segment or label is clipped by the viewport.</li>
      </ul>
    </article>`).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TRG-002 Solution Diagram Review</title>
  <style>
    :root { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #111827; background: #f3f4f6; }
    body { margin: 0; padding: 32px; }
    main { max-width: 1320px; margin: 0 auto; }
    .intro { background: #fff; border: 1px solid #d1d5db; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    .intro h1 { margin: 0 0 8px; font-size: 30px; }
    .intro p { margin: 6px 0; line-height: 1.55; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(520px, 1fr)); gap: 22px; }
    .review-card { background: #fff; border: 1px solid #d1d5db; border-radius: 16px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,.04); }
    .review-card header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .review-card h2 { margin: 0; font-size: 21px; }
    .strategy { margin: 4px 0 0; color: #4b5563; font-size: 13px; font-weight: 700; letter-spacing: .03em; }
    .status { font-size: 12px; font-weight: 700; border: 1px solid #9ca3af; border-radius: 999px; padding: 4px 8px; white-space: nowrap; }
    .stem, .answer, .annotation-count { line-height: 1.5; }
    .diagram-frame { border: 1px solid #d1d5db; border-radius: 12px; overflow: hidden; background: #fff; margin: 14px 0; }
    .diagram-frame svg { display: block; width: 100%; height: auto; }
    .checklist { margin: 12px 0 0; padding-left: 20px; color: #374151; line-height: 1.5; font-size: 14px; }
    @media (max-width: 640px) { body { padding: 14px; } .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
<main>
  <section class="intro">
    <h1>TRG-002 solution-diagram visual review</h1>
    <p><strong>Seed:</strong> ${escapeHtml(seed)}</p>
    <p>This review surface renders one active exam-ready solution diagram for every diagram strategy currently represented by the 20-QL proof. It deliberately does not emit stem diagrams.</p>
    <p>Given and solved measurement labels come from explicit exact annotation plans; the SVG renderer does not infer mathematical values from screen coordinates.</p>
  </section>
  <section class="grid">
    ${cards}
  </section>
</main>
</body>
</html>`;
}
