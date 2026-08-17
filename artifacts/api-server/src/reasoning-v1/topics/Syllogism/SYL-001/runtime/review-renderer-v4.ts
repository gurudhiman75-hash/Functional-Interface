import { learnerCopyV4 } from "./learner-v4-localization";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";

export function escapeHtmlV4(value: string): string {
  return value
    .replace(/([।.!?])\1+/gu, "$1")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function localeName(locale: GeneratedSylQuestionV4["locale"]): string {
  if (locale === "hi-IN") return "Hindi";
  if (locale === "pa-IN") return "Punjabi";
  return "English";
}

function renderOptions(question: GeneratedSylQuestionV4): string {
  return question.options.map((option, index) =>
    `<li class="question-option${option.isCorrect ? " keyed" : ""}" data-option-index="${index + 1}">
      <span class="option-number">${index + 1}</span>
      <span>${escapeHtmlV4(option.text)}</span>
    </li>`,
  ).join("");
}

function renderExplanation(question: GeneratedSylQuestionV4): string {
  const v4 = question.learnerPresentationV4;
  const copy = learnerCopyV4(question.locale);
  const explanation = v4.learnerExplanation;

  const reasoning = explanation.mode === "CONCLUSION_MASK"
    ? `<div class="conclusion-results">${explanation.conclusionResults.map((entry) =>
        `<div class="conclusion-result ${entry.follows ? "follows" : "not-follows"}">
          <strong>${escapeHtmlV4(entry.label)}: ${escapeHtmlV4(entry.follows ? copy.follows : copy.doesNotFollow)}</strong>
          <span>${escapeHtmlV4(entry.text)}</span>
          ${entry.shortReason ? `<p>${escapeHtmlV4(entry.shortReason)}</p>` : ""}
        </div>`,
      ).join("")}</div>`
    : `<div class="reasoning-lines">${explanation.shortReasoning.map((line) => `<p>${escapeHtmlV4(line)}</p>`).join("")}</div>`;

  return `<section class="simple-explanation" data-explanation-mode="${explanation.mode.toLowerCase()}">
    <h3>${escapeHtmlV4(copy.why)}</h3>
    ${reasoning}
    <p class="conclusion-line">${escapeHtmlV4(explanation.conclusion)}</p>
    ${explanation.existenceNote ? `<aside class="existence-note">${escapeHtmlV4(explanation.existenceNote)}</aside>` : ""}
  </section>`;
}

function renderDiagram(question: GeneratedSylQuestionV4): string {
  const diagram = question.learnerPresentationV4.diagram;
  if (!diagram.enabled || !diagram.svg || !diagram.caption) return "";
  const copy = learnerCopyV4(question.locale);
  return `<section class="diagram-v4" data-diagram-component="1" data-diagram-mode="${diagram.mode}">
    <h3>${escapeHtmlV4(copy.diagram)}</h3>
    ${diagram.svg}
    <p class="diagram-caption">${escapeHtmlV4(diagram.caption)}</p>
  </section>`;
}

function renderShortcut(question: GeneratedSylQuestionV4): string {
  const explanation = question.learnerPresentationV4.learnerExplanation;
  if (!explanation.showShortcut || !explanation.shortcut) return "";
  const copy = learnerCopyV4(question.locale);
  return `<aside class="shortcut"><strong>${escapeHtmlV4(copy.examShortcut)}</strong><code>${escapeHtmlV4(explanation.shortcut)}</code></aside>`;
}

function renderWrongOptions(question: GeneratedSylQuestionV4): string {
  const copy = learnerCopyV4(question.locale);
  const entries = question.learnerPresentationV4.optionAnalysis.map((entry) =>
    `<li>
      <div class="wrong-head"><strong>${escapeHtmlV4(`${copy.option} ${entry.displayIndex}: ${entry.text}`)}</strong><span>${escapeHtmlV4(entry.verdictLabel)}</span></div>
      <p>${escapeHtmlV4(entry.studentReason)}</p>
    </li>`,
  ).join("");
  return `<details class="wrong-options">
    <summary>${escapeHtmlV4(copy.otherOptions)}</summary>
    <ol>${entries}</ol>
  </details>`;
}

function renderAdministratorProof(question: GeneratedSylQuestionV4): string {
  const copy = learnerCopyV4(question.locale);
  const admin = {
    learnerAuthority: question.learnerPresentationV4.authority,
    learnerSchemaVersion: question.learnerPresentationV4.schemaVersion,
    learnerMode: question.learnerPresentationV4.learnerExplanation.mode,
    learnerDiagram: question.learnerPresentationV4.diagram,
    administratorProof: question.learnerPresentationV4.administratorProof,
    structuredProofV3: question.structuredProofV3,
    structuredPrompt: question.structuredPrompt,
    reviewLogic: question.reviewLogic,
    lifecycle: question.learnerPresentationV4.lifecycle,
  };
  return `<details class="administrator-proof">
    <summary>${escapeHtmlV4(copy.administratorProof)}</summary>
    <pre>${escapeHtmlV4(JSON.stringify(admin, null, 2))}</pre>
  </details>`;
}

export function renderLearnerQuestionV4(question: GeneratedSylQuestionV4): string {
  const v4 = question.learnerPresentationV4;
  const copy = learnerCopyV4(question.locale);
  return `<article lang="${question.locale}"
    data-language="${question.locale}"
    data-ql="${question.qlId}"
    data-checkpoint="${question.checkpointId}"
    data-task="${question.metadata.taskKind}"
    data-difficulty="${question.difficulty}"
    data-explanation="${v4.learnerExplanation.mode.toLowerCase()}"
    data-diagram="${v4.diagram.mode}"
    data-existence="${v4.learnerExplanation.existenceNote ? "DEPENDENT" : "INDEPENDENT"}"
    data-review="${v4.lifecycle.reviewStatus}">
    <header>
      <div>
        <h2>${escapeHtmlV4(question.structuredProofV3.identity.questionLanguageId)}</h2>
        <p>${escapeHtmlV4(`${question.qlId} · ${question.checkpointId} · ${localeName(question.locale)} · seed ${question.seed}`)}</p>
      </div>
      <div class="badges"><span>${question.difficulty}</span><span>${escapeHtmlV4(copy.modeLabels[v4.learnerExplanation.mode])}</span><span class="revise">REVISE</span></div>
    </header>

    <section class="question">
      <pre>${escapeHtmlV4(question.stem)}</pre>
      <ol class="question-options">${renderOptions(question)}</ol>
    </section>

    <div class="learner-view">
      <section class="answer-card" data-answer-card="1">
        <strong>${escapeHtmlV4(v4.answer.label)}: ${escapeHtmlV4(`${copy.option} ${v4.answer.displayIndex}`)}</strong>
        <p>${escapeHtmlV4(v4.answer.text)}</p>
      </section>
      ${renderExplanation(question)}
      ${renderDiagram(question)}
      ${renderShortcut(question)}
      ${renderWrongOptions(question)}
    </div>

    ${renderAdministratorProof(question)}
  </article>`;
}
