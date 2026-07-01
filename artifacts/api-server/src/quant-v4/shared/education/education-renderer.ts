import { composeEducationalExplanation } from "./explanation-composer";
import type {
  EducationRenderResult,
  EducationalExplanation,
  EducationalExplanationBlock,
  EducationalRendererTarget,
  ExplanationComposerInput,
} from "./renderer-contracts";

function renderBlockMarkdown(block: EducationalExplanationBlock) {
  const title = block.title ? `### ${block.title}\n\n` : "";
  const math = block.mathjax ? `\n\n${block.mathjax}` : "";
  return `${title}${block.markdown}${math}`.trim();
}

function renderMarkdown(explanation: EducationalExplanation) {
  return explanation.blocks.map(renderBlockMarkdown).join("\n\n");
}

function renderMathJax(explanation: EducationalExplanation) {
  return explanation.mathIllustrations.map((item) => item.mathjax).join("\n");
}

function renderStatementMathLines(explanation: EducationalExplanation) {
  return explanation.mathIllustrations.flatMap((item) => [item.statement, item.mathjax]);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function renderHtml(explanation: EducationalExplanation) {
  return explanation.blocks
    .map((block) => {
      const title = block.title ? `<h3>${escapeHtml(block.title)}</h3>` : "";
      const body = `<p>${escapeHtml(block.markdown).replace(/\n/g, "<br />")}</p>`;
      const math = block.mathjax ? `<div class=\"mathjax\">${escapeHtml(block.mathjax)}</div>` : "";
      return `<section data-kind=\"${escapeHtml(block.kind)}\" data-id=\"${escapeHtml(block.id)}\">${title}${body}${math}</section>`;
    })
    .join("\n");
}

export function renderEducationalExplanation(
  explanation: EducationalExplanation,
  target: EducationalRendererTarget = "markdown",
): EducationRenderResult {
  const markdown = renderMarkdown(explanation);
  const mathjax = renderMathJax(explanation);

  if (target === "blocks") {
    return { target, blocks: explanation.blocks };
  }

  if (target === "statement-math-lines") {
    const lines = renderStatementMathLines(explanation);
    return {
      target,
      blocks: explanation.blocks,
      markdown: lines.join("\n"),
      mathjax,
      lines,
      futurePayload: {
        contractVersion: explanation.contractVersion,
        lines,
        knowledgeLinks: explanation.knowledgeLinks,
      },
    };
  }

  if (target === "html") {
    return {
      target,
      blocks: explanation.blocks,
      markdown,
      mathjax,
      html: renderHtml(explanation),
    };
  }

  if (target === "pdf" || target === "flutter-card") {
    return {
      target,
      blocks: explanation.blocks,
      markdown,
      mathjax,
      futurePayload: {
        contractVersion: explanation.contractVersion,
        blocks: explanation.blocks,
        knowledgeLinks: explanation.knowledgeLinks,
      },
    };
  }

  return {
    target,
    blocks: explanation.blocks,
    markdown,
    mathjax,
  };
}

export function renderEducationalExplanationFromInput(
  input: ExplanationComposerInput,
  target: EducationalRendererTarget = "markdown",
): EducationRenderResult {
  return renderEducationalExplanation(composeEducationalExplanation(input), target);
}
