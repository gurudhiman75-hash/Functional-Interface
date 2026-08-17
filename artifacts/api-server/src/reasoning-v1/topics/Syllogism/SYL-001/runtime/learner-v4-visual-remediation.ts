import type { SurfacePremise, SylLocale, TermId } from "../foundation/types";
import { renderRelationAwareModelDiagramV4 } from "./learner-v4-model-topology";
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" role="img" lang="${input.locale}" aria-labelledby="${titleId} ${descId}" data-venn-v4="true" data-diagram-mode="VENN_SEPARATION" data-answer-sentence="false" data-static-relation-aware="true">
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

function witnessTransferRelation(input: VisualRemediationInputV4): {
  inside: TermId;
  shared: TermId;
  outside: TermId;
} | null {
  const some = input.displayedPremises.find((premise) =>
    premise.form === "SOME" || premise.form === "A_FEW" || premise.form === "ONLY_A_FEW");
  if (!some) return null;
  const no = input.displayedPremises.find((premise) =>
    premise.form === "NO"
    && [some.subject, some.predicate].some((term) =>
      premise.subject === term || premise.predicate === term));
  if (!no) return null;

  const shared = [some.subject, some.predicate].find((term) =>
    no.subject === term || no.predicate === term);
  if (!shared) return null;
  const inside = some.subject === shared ? some.predicate : some.subject;
  const outside = no.subject === shared ? no.predicate : no.subject;
  if (inside === outside) return null;
  return { inside, shared, outside };
}

function strictWitnessTransferDiagram(
  presentation: SylLearnerPresentationV4,
  input: VisualRemediationInputV4,
): SylLearnerPresentationV4["diagram"] | null {
  if (presentation.diagram.mode !== "VENN_WITNESS_TRANSFER") return null;
  const relation = witnessTransferRelation(input);
  if (!relation) return null;

  const insideLabel = label(relation.inside, input);
  const sharedLabel = label(relation.shared, input);
  const outsideLabel = label(relation.outside, input);
  const caption = presentation.diagram.caption ?? presentation.diagram.accessibleDescription ?? "";
  const suffix = presentation.administratorProof.identity.reviewVersionId.slice(0, 18);
  const titleId = `syl-v4-title-${suffix}`;
  const descId = `syl-v4-desc-${suffix}`;

  // Geometry is deliberate:
  // inside/shared: centres 58 apart, radii total 124 -> required overlap.
  // shared/outside: centres 146 apart, radii total 112 -> 34-unit gap.
  // inside/outside: centres 204 apart, radii total 112 -> 92-unit gap.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 230" role="img" lang="${input.locale}" aria-labelledby="${titleId} ${descId}" data-venn-v4="true" data-diagram-mode="VENN_WITNESS_TRANSFER" data-answer-sentence="false" data-static-relation-aware="true">
    <title id="${titleId}">${esc(caption)}</title>
    <desc id="${descId}">${esc(caption)}</desc>
    <style>
      .set-a{fill:#dbeafe;fill-opacity:.78;stroke:#2563eb;stroke-width:2.5}
      .set-b{fill:#fef3c7;fill-opacity:.72;stroke:#d97706;stroke-width:2.5}
      .set-c{fill:#e2e8f0;fill-opacity:.72;stroke:#475569;stroke-width:2.5}
      .set-label{font:700 14px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#0f172a}
      .witness{font:900 25px system-ui,-apple-system,"Segoe UI",sans-serif;fill:#111827}
      .no-mark{stroke:#dc2626;stroke-width:3;stroke-linecap:round}
    </style>
    <g data-relation="WITNESS_TRANSFER" data-inside="${esc(relation.inside)}" data-shared="${esc(relation.shared)}" data-outside="${esc(relation.outside)}">
      <g data-panel="STATIC" data-pair="${esc(relation.inside)}|${esc(relation.shared)}" data-geometry="overlap" data-basis="SOME"></g>
      <g data-panel="STATIC" data-pair="${esc(relation.shared)}|${esc(relation.outside)}" data-geometry="separate" data-basis="NO"></g>
      <g data-panel="STATIC" data-pair="${esc(relation.inside)}|${esc(relation.outside)}" data-geometry="separate" data-basis="NO_RELATION"></g>
      <g data-set-group="${esc(relation.inside)}"><circle data-panel="STATIC" data-terms="${esc(relation.inside)}" data-cx="90" data-cy="118" data-r="62" cx="90" cy="118" r="62" class="set-a"/><text x="90" y="76" text-anchor="middle" class="set-label">${esc(insideLabel)}</text></g>
      <g data-set-group="${esc(relation.shared)}"><circle data-panel="STATIC" data-terms="${esc(relation.shared)}" data-cx="148" data-cy="118" data-r="62" cx="148" cy="118" r="62" class="set-b"/><text x="148" y="76" text-anchor="middle" class="set-label">${esc(sharedLabel)}</text></g>
      <g data-set-group="${esc(relation.outside)}"><circle data-panel="STATIC" data-terms="${esc(relation.outside)}" data-cx="294" data-cy="118" data-r="50" cx="294" cy="118" r="50" class="set-c"/><text x="294" y="87" text-anchor="middle" class="set-label">${esc(outsideLabel)}</text></g>
      <text x="119" y="132" text-anchor="middle" class="witness" data-witness-region="${esc(relation.inside)}&amp;${esc(relation.shared)}&amp;!${esc(relation.outside)}">×</text>
      <line x1="222" y1="108" x2="238" y2="124" class="no-mark"/><line x1="238" y1="108" x2="222" y2="124" class="no-mark"/>
    </g>
  </svg>`;

  return {
    ...presentation.diagram,
    enabled: true,
    mode: "VENN_WITNESS_TRANSFER",
    omissionReason: null,
    svg,
    caption,
    accessibleDescription: caption,
    semanticSignature: `STRICT_WITNESS_TRANSFER:${relation.inside}:${relation.shared}:!${relation.outside}`,
    modelSignature: null,
    answerSentenceEmbedded: false,
    mobileViewBoxWidth: 360,
    diagramCount: 1,
  };
}

function strictLegend(locale: SylLocale): { oldText: string; newText: string } {
  if (locale === "hi-IN") {
    return {
      oldText: "जिन वर्गों के बीच न कथन-संबंध है और न साझा मॉडल-सदस्य, उनके वृत्त अलग हैं।",
      newText: "जिन वर्गों के बीच कथनों से कोई प्रत्यक्ष या निष्कर्षित संबंध नहीं बनता, उनके वृत्त हमेशा अलग हैं।",
    };
  }
  if (locale === "pa-IN") {
    return {
      oldText: "ਜਿਨ੍ਹਾਂ ਵਰਗਾਂ ਵਿਚ ਨਾ ਕਥਨ-ਸੰਬੰਧ ਹੈ ਅਤੇ ਨਾ ਸਾਂਝਾ ਮਾਡਲ-ਮੈਂਬਰ, ਉਨ੍ਹਾਂ ਦੇ ਘੇਰੇ ਵੱਖ ਹਨ।",
      newText: "ਜਿਨ੍ਹਾਂ ਵਰਗਾਂ ਵਿਚ ਕਥਨਾਂ ਤੋਂ ਕੋਈ ਸਿੱਧਾ ਜਾਂ ਨਿਕਲਿਆ ਸੰਬੰਧ ਨਹੀਂ ਬਣਦਾ, ਉਨ੍ਹਾਂ ਦੇ ਘੇਰੇ ਹਮੇਸ਼ਾਂ ਵੱਖ ਹਨ।",
    };
  }
  return {
    oldText: "Classes with neither a premise relation nor a shared model member are shown separately.",
    newText: "Classes with no stated or derived relation are always shown separately.",
  };
}

function applyStrictLegend(
  diagram: SylLearnerPresentationV4["diagram"],
  locale: SylLocale,
): SylLearnerPresentationV4["diagram"] {
  const copy = strictLegend(locale);
  return {
    ...diagram,
    svg: diagram.svg?.replaceAll(copy.oldText, copy.newText) ?? null,
    caption: diagram.caption?.replaceAll(copy.oldText, copy.newText) ?? null,
    accessibleDescription: diagram.accessibleDescription?.replaceAll(copy.oldText, copy.newText) ?? null,
  };
}

function strictOmission(
  presentation: SylLearnerPresentationV4,
  reason: "MODEL_ONLY_OVERLAP" | "NO_STABLE_SIMPLE_VENN",
): SylLearnerPresentationV4["diagram"] {
  return {
    enabled: false,
    mode: "OMITTED_NOT_USEFUL",
    omissionReason: "NO_STABLE_SIMPLE_VENN",
    svg: null,
    caption: null,
    accessibleDescription: null,
    semanticSignature: `OMIT:STRICT_NO_UNRELATED_OVERLAP:${reason}:${presentation.diagram.semanticSignature}`,
    modelSignature: presentation.diagram.modelSignature,
    answerSentenceEmbedded: false,
    mobileViewBoxWidth: 360,
    diagramCount: 0,
  };
}

function relationAwareModelOrOmission(
  presentation: SylLearnerPresentationV4,
  input: VisualRemediationInputV4,
): SylLearnerPresentationV4["diagram"] | null {
  const modelModes = new Set(["VENN_COUNTEREXAMPLE", "VENN_POSSIBILITY", "VENN_DUAL_MODEL"]);
  if (!modelModes.has(presentation.diagram.mode)) return null;
  const rendered = renderRelationAwareModelDiagramV4(presentation, input);
  if (!rendered) return strictOmission(presentation, "NO_STABLE_SIMPLE_VENN");

  if (rendered.svg?.includes('data-basis="MODEL_WITNESS"')) {
    return strictOmission(presentation, "MODEL_ONLY_OVERLAP");
  }

  return applyStrictLegend(rendered, input.locale);
}

export function remediateLearnerVisualV4(
  presentation: SylLearnerPresentationV4,
  input: VisualRemediationInputV4,
): SylLearnerPresentationV4 {
  const identityNo = presentation.diagram.mode === "VENN_SEPARATION"
    ? identityWithNoDiagram(presentation, input)
    : null;
  const witnessTransfer = strictWitnessTransferDiagram(presentation, input);
  const modelDiagram = relationAwareModelOrOmission(presentation, input);
  const diagram = identityNo ?? witnessTransfer ?? modelDiagram ?? presentation.diagram;
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
