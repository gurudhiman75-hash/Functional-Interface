import type { SurfacePremise, SylLocale, TermId } from "../foundation/types";
import type { SylLearnerPresentationV4 } from "./learner-v4-types";

interface VisualRemediationInputV4 {
  locale: SylLocale;
  displayedPremises: readonly SurfacePremise[];
  termLabels: Readonly<Record<TermId, string>>;
}

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function label(term: TermId, input: VisualRemediationInputV4): string {
  return input.termLabels[term] ?? term;
}

function modelLegend(locale: SylLocale): string {
  if (locale === "hi-IN") return "हर × एक संभावित सदस्य दिखाता है; अंक अलग सदस्यों को पहचानते हैं।";
  if (locale === "pa-IN") return "ਹਰ × ਇੱਕ ਸੰਭਵ ਮੈਂਬਰ ਦਿਖਾਉਂਦਾ ਹੈ; ਅੰਕ ਵੱਖਰੇ ਮੈਂਬਰਾਂ ਨੂੰ ਪਛਾਣਦੇ ਹਨ।";
  return "Each × represents one possible member; the numbers distinguish different members.";
}

function identityNoCaption(
  identityLeft: string,
  identityRight: string,
  outside: string,
  locale: SylLocale,
): string {
  if (locale === "hi-IN") {
    return `${identityLeft} और ${identityRight} एक ही वर्ग हैं। यह वर्ग ${outside} से पूरी तरह अलग है।`;
  }
  if (locale === "pa-IN") {
    return `${identityLeft} ਅਤੇ ${identityRight} ਇੱਕੋ ਵਰਗ ਹਨ। ਇਹ ਵਰਗ ${outside} ਤੋਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਹੈ।`;
  }
  return `${identityLeft} and ${identityRight} are the same set, and that set is completely separate from ${outside}.`;
}

function identityWithNoDiagram(
  presentation: SylLearnerPresentationV4,
  input: VisualRemediationInputV4,
): SylLearnerPresentationV4["diagram"] | null {
  const identity = input.displayedPremises.find((premise) => premise.form === "IDENTITY");
  if (!identity) return null;
  const no = input.displayedPremises.find((premise) =>
    premise.form === "NO"
    && [identity.subject, identity.predicate].some((term) =>
      premise.subject === term || premise.predicate === term));
  if (!no) return null;

  const matchingIdentityTerm = [identity.subject, identity.predicate].find((term) =>
    no.subject === term || no.predicate === term);
  if (!matchingIdentityTerm) return null;
  const outside = no.subject === matchingIdentityTerm ? no.predicate : no.subject;
  const leftLabel = label(identity.subject, input);
  const rightLabel = label(identity.predicate, input);
  const outsideLabel = label(outside, input);
  const caption = identityNoCaption(leftLabel, rightLabel, outsideLabel, input.locale);
  const suffix = presentation.administratorProof.identity.reviewVersionId.slice(0, 18);
  const titleId = `syl-v4-title-${suffix}`;
  const descId = `syl-v4-desc-${suffix}`;
  const equivalentLabel = `${leftLabel} = ${rightLabel}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" role="img" lang="${input.locale}" aria-labelledby="${titleId} ${descId}" data-venn-v4="true" data-diagram-mode="VENN_SEPARATION" data-answer-sentence="false">
    <title id="${titleId}">${esc(caption)}</title>
    <desc id="${descId}">${esc(caption)}</desc>
    <style>
      .identity-set{fill:#dbeafe;fill-opacity:.78;stroke:#2563eb;stroke-width:2.5}
      .outside-set{fill:#fef3c7;fill-opacity:.72;stroke:#d97706;stroke-width:2.5}
      .set-label{font:700 14px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a}
    </style>
    <g data-relation="IDENTITY_AND_NO" data-equivalent="${esc(identity.subject)},${esc(identity.predicate)}" data-outside="${esc(outside)}">
      <g data-relation="IDENTITY"><circle cx="112" cy="112" r="68" class="identity-set"/><text x="112" y="75" text-anchor="middle" class="set-label">${esc(equivalentLabel)}</text></g>
      <g data-relation="NO"><circle cx="270" cy="112" r="58" class="outside-set"/><text x="270" y="84" text-anchor="middle" class="set-label">${esc(outsideLabel)}</text></g>
    </g>
  </svg>`;

  return {
    enabled: true,
    mode: "VENN_SEPARATION",
    omissionReason: null,
    svg,
    caption,
    accessibleDescription: caption,
    semanticSignature: `IDENTITY_NO:${identity.subject}:${identity.predicate}:!${outside}`,
    modelSignature: null,
    answerSentenceEmbedded: false,
    mobileViewBoxWidth: 360,
    diagramCount: 1,
  };
}

function improveModelDiagram(
  presentation: SylLearnerPresentationV4,
  input: VisualRemediationInputV4,
): SylLearnerPresentationV4["diagram"] {
  const diagram = presentation.diagram;
  if (!diagram.enabled || !diagram.svg) return diagram;
  const modelModes = new Set(["VENN_COUNTEREXAMPLE", "VENN_POSSIBILITY", "VENN_DUAL_MODEL"]);
  if (!modelModes.has(diagram.mode)) return diagram;
  const legend = modelLegend(input.locale);
  const caption = `${diagram.caption ?? ""} ${legend}`.trim();
  const accessibleDescription = `${diagram.accessibleDescription ?? diagram.caption ?? ""} ${legend}`.trim();
  const svg = diagram.svg
    .replace(".mini-model-label{font:750 9.5px", ".mini-model-label{font:750 12px")
    .replace(".mini-witness{font:900 15px", ".mini-witness{font:900 17px");
  return {
    ...diagram,
    svg,
    caption,
    accessibleDescription,
  };
}

export function remediateLearnerVisualV4(
  presentation: SylLearnerPresentationV4,
  input: VisualRemediationInputV4,
): SylLearnerPresentationV4 {
  const identityNo = presentation.diagram.mode === "VENN_SEPARATION"
    ? identityWithNoDiagram(presentation, input)
    : null;
  const diagram = identityNo ?? improveModelDiagram(presentation, input);
  return {
    ...presentation,
    learnerExplanation: {
      ...presentation.learnerExplanation,
      showDiagram: diagram.enabled,
    },
    diagram,
    administratorProof: {
      ...presentation.administratorProof,
      diagramSpecification: {
        ...presentation.administratorProof.diagramSpecification,
        v4Mode: diagram.mode,
      },
    },
  };
}
