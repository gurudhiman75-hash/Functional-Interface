import type {
  SurfacePremise,
  SurfacePremiseForm,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { GeneratedSylQuestionV4 } from "./learner-v4-types";
import type { SylLearnerPresentationV5 } from "./learner-v5-types";

interface DiagramCopyV5 {
  title: string;
  description: string;
  statement: string;
  conclusion: string;
  definitelyFollows: string;
  impossible: string;
  possibleNotDefinite: string;
  caption: string;
  legend: string;
  relation: Readonly<Record<NormalizedRelationFormV5, string>>;
}

type NormalizedRelationFormV5 =
  | "ALL"
  | "NO"
  | "SOME"
  | "SOME_NOT"
  | "ONLY_A_FEW"
  | "IDENTITY";

interface NormalizedRelationV5 {
  form: NormalizedRelationFormV5;
  subject: TermId;
  predicate: TermId;
}

const COPY: Readonly<Record<SylLocale, DiagramCopyV5>> = {
  "en-IN": {
    title: "Statement relation map and conclusion check",
    description: "A safe visual map of the relations stated or forced by the premises and the logical status of each conclusion.",
    statement: "Statement",
    conclusion: "Conclusion",
    definitelyFollows: "Definitely follows",
    impossible: "Impossible",
    possibleNotDefinite: "Possible, not definite",
    caption: "Only stated or forced links are drawn. A missing link means the relation is not fixed; it does not mean that the classes are separate.",
    legend: "Arrows show forced inclusion. Other labelled links show the exact stated relation.",
    relation: {
      ALL: "All / inside",
      NO: "No overlap",
      SOME: "Some overlap",
      SOME_NOT: "Some outside",
      ONLY_A_FEW: "Overlap + outside",
      IDENTITY: "Same class",
    },
  },
  "hi-IN": {
    title: "कथन-संबंध मानचित्र और निष्कर्ष-जाँच",
    description: "कथनों से दिए या निश्चित संबंधों तथा प्रत्येक निष्कर्ष की तार्किक स्थिति का सुरक्षित दृश्य मानचित्र।",
    statement: "कथन",
    conclusion: "निष्कर्ष",
    definitelyFollows: "निश्चित रूप से निकलता है",
    impossible: "असंभव",
    possibleNotDefinite: "संभव, निश्चित नहीं",
    caption: "केवल दिए गए या कथनों से निश्चित संबंध दिखाए गए हैं। किसी कड़ी का न होना संबंध को अनिश्चित बताता है; इसका अर्थ अलगाव नहीं है।",
    legend: "तीर निश्चित समावेशन दिखाते हैं। अन्य नामित कड़ियाँ कथन का ठीक संबंध दिखाती हैं।",
    relation: {
      ALL: "सभी / अंदर",
      NO: "कोई साझा भाग नहीं",
      SOME: "कुछ साझा",
      SOME_NOT: "कुछ बाहर",
      ONLY_A_FEW: "साझा + बाहर",
      IDENTITY: "एक ही वर्ग",
    },
  },
  "pa-IN": {
    title: "ਕਥਨ-ਸੰਬੰਧ ਨਕਸ਼ਾ ਅਤੇ ਨਤੀਜੇ ਦੀ ਜਾਂਚ",
    description: "ਕਥਨਾਂ ਤੋਂ ਦਿੱਤੇ ਜਾਂ ਲਾਜ਼ਮੀ ਸੰਬੰਧਾਂ ਅਤੇ ਹਰ ਨਤੀਜੇ ਦੀ ਤਾਰਕਿਕ ਸਥਿਤੀ ਦਾ ਸੁਰੱਖਿਅਤ ਦ੍ਰਿਸ਼ ਨਕਸ਼ਾ।",
    statement: "ਕਥਨ",
    conclusion: "ਨਤੀਜਾ",
    definitelyFollows: "ਨਿਸ਼ਚਿਤ ਤੌਰ ’ਤੇ ਨਿਕਲਦਾ ਹੈ",
    impossible: "ਅਸੰਭਵ",
    possibleNotDefinite: "ਸੰਭਵ, ਨਿਸ਼ਚਿਤ ਨਹੀਂ",
    caption: "ਸਿਰਫ਼ ਦਿੱਤੇ ਜਾਂ ਕਥਨਾਂ ਤੋਂ ਲਾਜ਼ਮੀ ਸੰਬੰਧ ਦਿਖਾਏ ਗਏ ਹਨ। ਕਿਸੇ ਕੜੀ ਦਾ ਨਾ ਹੋਣਾ ਸੰਬੰਧ ਨੂੰ ਅਨਿਸ਼ਚਿਤ ਦੱਸਦਾ ਹੈ; ਇਸ ਦਾ ਅਰਥ ਵੱਖਰਾ ਹੋਣਾ ਨਹੀਂ ਹੈ।",
    legend: "ਤੀਰ ਲਾਜ਼ਮੀ ਸਮਾਵੇਸ਼ ਦਿਖਾਉਂਦੇ ਹਨ। ਹੋਰ ਨਾਮ ਵਾਲੀਆਂ ਕੜੀਆਂ ਕਥਨ ਦਾ ਠੀਕ ਸੰਬੰਧ ਦਿਖਾਉਂਦੀਆਂ ਹਨ।",
    relation: {
      ALL: "ਸਾਰੇ / ਅੰਦਰ",
      NO: "ਕੋਈ ਸਾਂਝ ਨਹੀਂ",
      SOME: "ਕੁਝ ਸਾਂਝ",
      SOME_NOT: "ਕੁਝ ਬਾਹਰ",
      ONLY_A_FEW: "ਸਾਂਝ + ਬਾਹਰ",
      IDENTITY: "ਇੱਕੋ ਵਰਗ",
    },
  },
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function shortLabel(value: string, limit = 24): string {
  const characters = [...value];
  return characters.length <= limit
    ? value
    : `${characters.slice(0, Math.max(1, limit - 1)).join("")}…`;
}

function normalizePremise(premise: SurfacePremise): NormalizedRelationV5 {
  switch (premise.form) {
    case "ALL":
    case "NO":
    case "SOME":
    case "SOME_NOT":
    case "IDENTITY":
      return { form: premise.form, subject: premise.subject, predicate: premise.predicate };
    case "A_FEW":
      return { form: "SOME", subject: premise.subject, predicate: premise.predicate };
    case "NOT_ALL":
      return { form: "SOME_NOT", subject: premise.subject, predicate: premise.predicate };
    case "ONLY_A_FEW":
      return { form: "ONLY_A_FEW", subject: premise.subject, predicate: premise.predicate };
    case "ONLY":
      return { form: "ALL", subject: premise.predicate, predicate: premise.subject };
    case "ARE_ONLY":
      return { form: "ALL", subject: premise.subject, predicate: premise.predicate };
    case "FEW":
      return { form: "SOME_NOT", subject: premise.subject, predicate: premise.predicate };
  }
}

function termLabel(
  termId: TermId,
  termLabels: Readonly<Record<TermId, string>>,
): string {
  return termLabels[termId] ?? termId;
}

function statusLabel(
  status: "ENTAILED" | "CONTRADICTED" | "UNDETERMINED",
  copy: DiagramCopyV5,
): string {
  if (status === "ENTAILED") return copy.definitelyFollows;
  if (status === "CONTRADICTED") return copy.impossible;
  return copy.possibleNotDefinite;
}

function statusTone(status: "ENTAILED" | "CONTRADICTED" | "UNDETERMINED"): {
  fill: string;
  stroke: string;
  text: string;
} {
  if (status === "ENTAILED") return { fill: "#dcfce7", stroke: "#16a34a", text: "#166534" };
  if (status === "CONTRADICTED") return { fill: "#fee2e2", stroke: "#dc2626", text: "#991b1b" };
  return { fill: "#fef3c7", stroke: "#d97706", text: "#92400e" };
}

function relationLine(
  relation: NormalizedRelationV5,
  copy: DiagramCopyV5,
  markerId: string,
  y: number,
): string {
  const dashed = relation.form === "SOME"
    || relation.form === "SOME_NOT"
    || relation.form === "ONLY_A_FEW";
  const marker = relation.form === "ALL" ? ` marker-end="url(#${markerId})"` : "";
  const line = `<line x1="254" y1="${y}" x2="466" y2="${y}" stroke="#64748b" stroke-width="2.5"${dashed ? ' stroke-dasharray="8 6"' : ""}${marker}/>`;
  const label = escapeXml(copy.relation[relation.form]);
  return `${line}<rect x="286" y="${y - 17}" width="148" height="30" rx="15" fill="#ffffff" stroke="#cbd5e1"/><text x="360" y="${y + 4}" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">${label}</text>`;
}

function buildRelationMapSvg(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  termLabels: Readonly<Record<TermId, string>>,
): string {
  const copy = COPY[question.locale];
  const relations = question.structuredPrompt.premises.map(normalizePremise);
  const conclusions = presentation.learnerExplanation.conclusionResults;
  const premiseStartY = 104;
  const premiseStep = 78;
  const conclusionHeadingY = premiseStartY + relations.length * premiseStep + 8;
  const conclusionStartY = conclusionHeadingY + 44;
  const conclusionStep = 64;
  const height = conclusionStartY + Math.max(1, conclusions.length) * conclusionStep + 68;
  const idBase = `${question.qlId}-${question.seed}-${question.locale}`.replace(/[^a-zA-Z0-9_-]/gu, "-");
  const markerId = `${idBase}-arrow`;
  const titleId = `${idBase}-title`;
  const descId = `${idBase}-desc`;

  const premiseRows = relations.map((relation, index) => {
    const y = premiseStartY + index * premiseStep;
    const left = escapeXml(shortLabel(termLabel(relation.subject, termLabels)));
    const right = escapeXml(shortLabel(termLabel(relation.predicate, termLabels)));
    return [
      `<text x="26" y="${y + 5}" font-size="14" font-weight="800" fill="#475569">${escapeXml(copy.statement)} ${index + 1}</text>`,
      `<rect x="112" y="${y - 25}" width="142" height="50" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>`,
      `<text x="183" y="${y + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="#1e3a8a">${left}</text>`,
      relationLine(relation, copy, markerId, y),
      `<rect x="466" y="${y - 25}" width="142" height="50" rx="14" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2"/>`,
      `<text x="537" y="${y + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="#4c1d95">${right}</text>`,
    ].join("");
  }).join("");

  const conclusionRows = conclusions.map((result, index) => {
    const y = conclusionStartY + index * conclusionStep;
    const tone = statusTone(result.status);
    const conclusionText = escapeXml(shortLabel(result.text, 56));
    const statusText = escapeXml(shortLabel(statusLabel(result.status, copy), 25));
    return [
      `<rect x="38" y="${y - 24}" width="644" height="52" rx="13" fill="#f8fafc" stroke="#cbd5e1"/>`,
      `<text x="58" y="${y + 7}" font-size="14" font-weight="800" fill="#475569">${escapeXml(copy.conclusion)} ${index + 1}</text>`,
      `<text x="156" y="${y + 7}" font-size="14" font-weight="600" fill="#0f172a">${conclusionText}</text>`,
      `<rect x="505" y="${y - 14}" width="157" height="32" rx="16" fill="${tone.fill}" stroke="${tone.stroke}"/>`,
      `<text x="583.5" y="${y + 7}" text-anchor="middle" font-size="12.5" font-weight="800" fill="${tone.text}">${statusText}</text>`,
    ].join("");
  }).join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${height}" role="img" aria-labelledby="${titleId} ${descId}">`,
    `<title id="${titleId}">${escapeXml(copy.title)}</title>`,
    `<desc id="${descId}">${escapeXml(copy.description)}</desc>`,
    `<defs><marker id="${markerId}" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#64748b"/></marker></defs>`,
    `<rect x="1" y="1" width="718" height="${height - 2}" rx="18" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>`,
    `<text x="360" y="34" text-anchor="middle" font-size="21" font-weight="800" fill="#0f172a">${escapeXml(copy.title)}</text>`,
    `<text x="360" y="61" text-anchor="middle" font-size="13" fill="#475569">${escapeXml(copy.legend)}</text>`,
    premiseRows,
    `<line x1="38" y1="${conclusionHeadingY}" x2="682" y2="${conclusionHeadingY}" stroke="#cbd5e1"/>`,
    `<text x="38" y="${conclusionHeadingY + 30}" font-size="16" font-weight="800" fill="#0f172a">${escapeXml(copy.conclusion)}</text>`,
    conclusionRows,
    `<text x="360" y="${height - 24}" text-anchor="middle" font-size="12" fill="#64748b">${escapeXml(copy.caption)}</text>`,
    `</svg>`,
  ].join("");
}

export function completeRequiredDiagramV5(
  question: GeneratedSylQuestionV4,
  presentation: SylLearnerPresentationV5,
  termLabels: Readonly<Record<TermId, string>>,
): SylLearnerPresentationV5 {
  if (presentation.diagram.enabled && presentation.diagram.svg) {
    return {
      ...presentation,
      learnerExplanation: {
        ...presentation.learnerExplanation,
        showDiagram: true,
      },
    };
  }

  const copy = COPY[question.locale];
  const svg = buildRelationMapSvg(question, presentation, termLabels);
  return {
    ...presentation,
    learnerExplanation: {
      ...presentation.learnerExplanation,
      showDiagram: true,
    },
    diagram: {
      enabled: true,
      mode: "RELATION_MAP",
      omissionReason: null,
      svg,
      caption: copy.caption,
      accessibleDescription: copy.description,
      semanticSignature: `syl-v5:relation-map:${question.qlId}:${question.seed}:${question.locale}`,
      modelSignature: null,
      answerSentenceEmbedded: false,
      mobileViewBoxWidth: 360,
      diagramCount: 1,
    },
  };
}

export function normalizedDiagramRelationFormV5(form: SurfacePremiseForm): NormalizedRelationFormV5 {
  if (form === "ONLY") return "ALL";
  if (form === "ARE_ONLY") return "ALL";
  if (form === "A_FEW") return "SOME";
  if (form === "NOT_ALL" || form === "FEW") return "SOME_NOT";
  return form;
}
