import type {
  CanonicalConclusion,
  InternalConclusionClass,
  SurfacePremise,
  SurfacePremiseForm,
  SylLocale,
  TermId,
} from "../foundation/types";
import type { TermAssignment } from "./localization";
import type {
  PairClassificationStatus,
  PairSemanticStatus,
  SylDiagramMode,
  SylDiagramRole,
} from "./types";

export interface PedagogicalDiagramFocus {
  label: string;
  conclusion: CanonicalConclusion;
  classification: InternalConclusionClass;
}

export interface PedagogicalDiagramResult {
  role: SylDiagramRole;
  mode: SylDiagramMode;
  title: string;
  caption: string;
  svg: string;
}

interface NormalizedPairRelation {
  form: "ALL" | "NO" | "SOME" | "SOME_NOT" | "ONLY_A_FEW" | "IDENTITY";
  subject: TermId;
  predicate: TermId;
  sourceForm: SurfacePremiseForm | CanonicalConclusion["form"];
}

const PALETTE = [
  { fill: "#3b82f6", stroke: "#2563eb" },
  { fill: "#f59e0b", stroke: "#d97706" },
  { fill: "#ef4444", stroke: "#dc2626" },
  { fill: "#10b981", stroke: "#059669" },
  { fill: "#8b5cf6", stroke: "#7c3aed" },
] as const;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function hash(value: string): number {
  let result = 0;
  for (const character of value) result = (result * 31 + character.codePointAt(0)!) >>> 0;
  return result;
}

function colour(termId: string): (typeof PALETTE)[number] {
  return PALETTE[hash(termId) % PALETTE.length];
}

function label(termId: TermId, locale: SylLocale, assignment: TermAssignment): string {
  return assignment[termId]?.labels[locale] ?? termId;
}

function shortLabel(value: string): string {
  const characters = [...value];
  return characters.length <= 17 ? value : `${characters.slice(0, 15).join("")}…`;
}

function localizedCopy(locale: SylLocale): {
  title: string;
  desc: string;
  premiseHeading: string;
  conclusionHeading: string;
  forcedCaption: string;
  possibilityCaption: string;
  impossibleCaption: string;
  eitherCaption: string;
  canBeTrue: string;
  canBeFalse: string;
  definitelyTrue: string;
  impossible: string;
  focusedNote: string;
  premise: string;
  conclusion: string;
} {
  if (locale === "hi-IN") {
    return {
      title: "मूल वेन आरेख और निष्कर्ष-जाँच",
      desc: "कथनों के अनिवार्य संबंध तथा चुने गए निष्कर्ष की वेन-जाँच।",
      premiseHeading: "कथनों से निश्चित संबंध",
      conclusionHeading: "निष्कर्ष की जाँच",
      forcedCaption: "नीचे केवल निश्चित संबंध दिखाए गए हैं। काला × किसी पक्के सदस्य को दिखाता है; बिना × वाला साझा भाग केवल संभावित है।",
      possibilityCaption: "दोनों चित्र कथनों के साथ संभव हैं; इसलिए निष्कर्ष केवल संभावना है।",
      impossibleCaption: "निष्कर्ष वाला संबंध कथनों की सीमा से टकराता है; इसलिए यह असंभव है।",
      eitherCaption: "दोनों विकल्प अलग-अलग संभव हैं, पर एक साथ सत्य या एक साथ असत्य नहीं हो सकते।",
      canBeTrue: "सत्य हो सकता है",
      canBeFalse: "असत्य हो सकता है",
      definitelyTrue: "निश्चित रूप से सत्य",
      impossible: "कथनों से टकराव",
      focusedNote: "यह छोटा चित्र केवल संबंधित दो समूहों पर केंद्रित है; अन्य समूह जानबूझकर नहीं दिखाए गए हैं।",
      premise: "कथन",
      conclusion: "निष्कर्ष",
    };
  }
  if (locale === "pa-IN") {
    return {
      title: "ਮੂਲ ਵੇਨ ਚਿੱਤਰ ਅਤੇ ਨਤੀਜੇ ਦੀ ਜਾਂਚ",
      desc: "ਕਥਨਾਂ ਤੋਂ ਲਾਜ਼ਮੀ ਬਣਦੇ ਸੰਬੰਧ ਅਤੇ ਚੁਣੇ ਨਤੀਜੇ ਦੀ ਵੇਨ ਜਾਂਚ।",
      premiseHeading: "ਕਥਨਾਂ ਤੋਂ ਪੱਕੇ ਸੰਬੰਧ",
      conclusionHeading: "ਨਤੀਜੇ ਦੀ ਜਾਂਚ",
      forcedCaption: "ਹੇਠਾਂ ਸਿਰਫ਼ ਲਾਜ਼ਮੀ ਸੰਬੰਧ ਦਿਖਾਏ ਗਏ ਹਨ। ਕਾਲਾ × ਕਿਸੇ ਪੱਕੇ ਮੈਂਬਰ ਨੂੰ ਦਿਖਾਉਂਦਾ ਹੈ; ਬਿਨਾਂ × ਵਾਲਾ ਸਾਂਝਾ ਹਿੱਸਾ ਸਿਰਫ਼ ਸੰਭਵ ਹੈ।",
      possibilityCaption: "ਦੋਵੇਂ ਚਿੱਤਰ ਕਥਨਾਂ ਨਾਲ ਸੰਭਵ ਹਨ; ਇਸ ਲਈ ਨਤੀਜਾ ਸਿਰਫ਼ ਸੰਭਾਵਨਾ ਹੈ।",
      impossibleCaption: "ਨਤੀਜੇ ਵਾਲਾ ਸੰਬੰਧ ਕਥਨਾਂ ਦੀ ਹੱਦ ਨਾਲ ਟਕਰਾਉਂਦਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਅਸੰਭਵ ਹੈ।",
      eitherCaption: "ਦੋਵੇਂ ਵਿਕਲਪ ਵੱਖ-ਵੱਖ ਸੰਭਵ ਹਨ, ਪਰ ਦੋਵੇਂ ਇਕੱਠੇ ਸਹੀ ਜਾਂ ਇਕੱਠੇ ਗਲਤ ਨਹੀਂ ਹੋ ਸਕਦੇ।",
      canBeTrue: "ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ",
      canBeFalse: "ਗਲਤ ਹੋ ਸਕਦਾ ਹੈ",
      definitelyTrue: "ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ",
      impossible: "ਕਥਨਾਂ ਨਾਲ ਟਕਰਾਅ",
      focusedNote: "ਇਹ ਛੋਟਾ ਚਿੱਤਰ ਸਿਰਫ਼ ਸੰਬੰਧਿਤ ਦੋ ਸਮੂਹਾਂ ਉੱਤੇ ਕੇਂਦਰਿਤ ਹੈ; ਹੋਰ ਸਮੂਹ ਜਾਣ-ਬੁੱਝ ਕੇ ਨਹੀਂ ਦਿਖਾਏ ਗਏ।",
      premise: "ਕਥਨ",
      conclusion: "ਨਤੀਜਾ",
    };
  }
  return {
    title: "Basic Venn Diagram and Conclusion Check",
    desc: "Forced relations from the statements and a focused Venn check of the selected conclusion.",
    premiseHeading: "Relations forced by the statements",
    conclusionHeading: "Conclusion check",
    forcedCaption: "Only forced relations are shown below. A black × marks a guaranteed member; an unmarked overlap is only a possible area.",
    possibilityCaption: "Both focused diagrams are compatible with the statements, so the conclusion is possible but not definite.",
    impossibleCaption: "The claimed relation conflicts with the statement boundaries, so it is impossible.",
    eitherCaption: "Each alternative is possible separately, but they cannot both be true or both be false.",
    canBeTrue: "Can be true",
    canBeFalse: "Can be false",
    definitelyTrue: "Definitely true",
    impossible: "Conflicts with statements",
    focusedNote: "This focused diagram shows only the two relevant sets; other sets are intentionally omitted.",
    premise: "Statement",
    conclusion: "Conclusion",
  };
}

function normalizePremiseRelation(premise: SurfacePremise): NormalizedPairRelation {
  switch (premise.form) {
    case "ALL":
    case "NO":
    case "SOME":
    case "SOME_NOT":
    case "IDENTITY":
      return { form: premise.form, subject: premise.subject, predicate: premise.predicate, sourceForm: premise.form };
    case "A_FEW":
      return { form: "SOME", subject: premise.subject, predicate: premise.predicate, sourceForm: premise.form };
    case "NOT_ALL":
      return { form: "SOME_NOT", subject: premise.subject, predicate: premise.predicate, sourceForm: premise.form };
    case "ONLY_A_FEW":
      return { form: "ONLY_A_FEW", subject: premise.subject, predicate: premise.predicate, sourceForm: premise.form };
    case "ONLY":
      return { form: "ALL", subject: premise.predicate, predicate: premise.subject, sourceForm: premise.form };
    case "ARE_ONLY":
      return { form: "ALL", subject: premise.subject, predicate: premise.predicate, sourceForm: premise.form };
    case "FEW":
      throw new Error("Plain FEW is not admitted by the frozen SYL-001 profile.");
  }
}

function normalizeConclusionRelation(conclusion: CanonicalConclusion): NormalizedPairRelation {
  return {
    form: conclusion.form,
    subject: conclusion.subject,
    predicate: conclusion.predicate,
    sourceForm: conclusion.form,
  };
}

function negatedConclusionRelation(conclusion: CanonicalConclusion): NormalizedPairRelation {
  switch (conclusion.form) {
    case "ALL": return { form: "SOME_NOT", subject: conclusion.subject, predicate: conclusion.predicate, sourceForm: "SOME_NOT" };
    case "NO": return { form: "SOME", subject: conclusion.subject, predicate: conclusion.predicate, sourceForm: "SOME" };
    case "SOME": return { form: "NO", subject: conclusion.subject, predicate: conclusion.predicate, sourceForm: "NO" };
    case "SOME_NOT": return { form: "ALL", subject: conclusion.subject, predicate: conclusion.predicate, sourceForm: "ALL" };
  }
}

function relationCaption(
  relation: NormalizedPairRelation,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const subject = label(relation.subject, locale, assignment);
  const predicate = label(relation.predicate, locale, assignment);
  if (locale === "hi-IN") {
    if (relation.form === "ALL") return `${subject} ⊆ ${predicate}`;
    if (relation.form === "NO") return `${subject} ∩ ${predicate} = ∅`;
    if (relation.form === "SOME") return `साझा भाग में ×`;
    if (relation.form === "SOME_NOT") return `${subject}-मात्र भाग में ×`;
    if (relation.form === "ONLY_A_FEW") return `साझा भाग + बाहर ×`;
    return `${subject} = ${predicate}`;
  }
  if (locale === "pa-IN") {
    if (relation.form === "ALL") return `${subject} ⊆ ${predicate}`;
    if (relation.form === "NO") return `${subject} ∩ ${predicate} = ∅`;
    if (relation.form === "SOME") return `ਸਾਂਝੇ ਹਿੱਸੇ ਵਿੱਚ ×`;
    if (relation.form === "SOME_NOT") return `${subject}-ਵਾਲੇ ਹਿੱਸੇ ਵਿੱਚ ×`;
    if (relation.form === "ONLY_A_FEW") return `ਸਾਂਝਾ ਹਿੱਸਾ + ਬਾਹਰ ×`;
    return `${subject} = ${predicate}`;
  }
  if (relation.form === "ALL") return `${subject} inside ${predicate}`;
  if (relation.form === "NO") return `${subject} ∩ ${predicate} = ∅`;
  if (relation.form === "SOME") return `× in the overlap`;
  if (relation.form === "SOME_NOT") return `× in ${subject}-only region`;
  if (relation.form === "ONLY_A_FEW") return `× overlap + × outside`;
  return `${subject} = ${predicate}`;
}

function circle(
  cx: number,
  cy: number,
  radius: number,
  termId: TermId,
  opacity = 0.13,
): string {
  const tone = colour(termId);
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${tone.fill}" fill-opacity="${opacity}" stroke="${tone.stroke}" stroke-width="2.5"/>`;
}

function setLabel(x: number, y: number, text: string, anchor: "start" | "middle" | "end" = "middle"): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="set-label">${escapeXml(shortLabel(text))}</text>`;
}

function witness(x: number, y: number, labelText = "×"): string {
  return `<circle cx="${x}" cy="${y}" r="10" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/><text x="${x}" y="${y + 5}" text-anchor="middle" class="witness">${escapeXml(labelText)}</text>`;
}

function renderRelationGeometry(
  relation: NormalizedPairRelation,
  locale: SylLocale,
  assignment: TermAssignment,
  x: number,
  y: number,
  width: number,
  height: number,
  status: "NORMAL" | "CORRECT" | "CONFLICT" = "NORMAL",
): string {
  const subjectText = label(relation.subject, locale, assignment);
  const predicateText = label(relation.predicate, locale, assignment);
  const cx = x + width / 2;
  const cy = y + 72;
  const border = status === "CORRECT" ? "#16a34a" : status === "CONFLICT" ? "#dc2626" : "#cbd5e1";
  const fill = status === "CORRECT" ? "#f0fdf4" : status === "CONFLICT" ? "#fef2f2" : "#ffffff";
  let geometry = "";

  if (relation.form === "ALL") {
    geometry = [
      circle(cx, cy, 49, relation.predicate),
      circle(cx, cy + 3, 28, relation.subject, 0.2),
      setLabel(cx, cy - 37, predicateText),
      setLabel(cx, cy + 8, subjectText),
      witness(cx, cy + 25),
    ].join("");
  } else if (relation.form === "IDENTITY") {
    geometry = [
      circle(cx, cy, 47, relation.subject),
      circle(cx, cy, 41, relation.predicate, 0.08),
      setLabel(cx, cy - 6, subjectText),
      setLabel(cx, cy + 14, predicateText),
      witness(cx, cy + 32),
    ].join("");
  } else if (relation.form === "NO") {
    geometry = [
      circle(cx - 42, cy, 36, relation.subject),
      circle(cx + 42, cy, 36, relation.predicate),
      setLabel(cx - 42, cy - 46, subjectText),
      setLabel(cx + 42, cy - 46, predicateText),
      `<line x1="${cx - 5}" y1="${cy}" x2="${cx + 5}" y2="${cy}" class="exclusion-line"/>`,
      `<line x1="${cx - 7}" y1="${cy - 7}" x2="${cx + 7}" y2="${cy + 7}" class="cross-mark"/>`,
      `<line x1="${cx + 7}" y1="${cy - 7}" x2="${cx - 7}" y2="${cy + 7}" class="cross-mark"/>`,
      witness(cx - 42, cy + 18),
      witness(cx + 42, cy + 18),
    ].join("");
  } else {
    geometry = [
      circle(cx - 30, cy, 43, relation.subject),
      circle(cx + 30, cy, 43, relation.predicate),
      setLabel(cx - 48, cy - 50, subjectText),
      setLabel(cx + 48, cy - 50, predicateText),
    ].join("");
    if (relation.form === "SOME") geometry += witness(cx, cy);
    if (relation.form === "SOME_NOT") geometry += witness(cx - 55, cy + 8);
    if (relation.form === "ONLY_A_FEW") geometry += `${witness(cx, cy)}${witness(cx - 55, cy + 8)}`;
  }

  if (status === "CONFLICT") {
    geometry += `<line x1="${x + 24}" y1="${y + 30}" x2="${x + width - 24}" y2="${y + height - 32}" class="large-cross"/><line x1="${x + width - 24}" y1="${y + 30}" x2="${x + 24}" y2="${y + height - 32}" class="large-cross"/>`;
  }

  return `<g data-relation="${relation.form}">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="12" fill="${fill}" stroke="${border}" stroke-width="1.5"/>
    ${geometry}
    <text x="${cx}" y="${y + height - 14}" text-anchor="middle" class="relation-caption">${escapeXml(relationCaption(relation, locale, assignment))}</text>
  </g>`;
}

function relationRole(
  focus: readonly PedagogicalDiagramFocus[],
  pairStatus: PairSemanticStatus | PairClassificationStatus | null,
): { role: SylDiagramRole; mode: SylDiagramMode } {
  if (pairStatus === "EITHER_OR" || pairStatus === "EITHER_OR_FOLLOWS") {
    return { role: "EITHER_OR_ALTERNATIVES", mode: "EITHER_OR_COMPARISON" };
  }
  const hasUndetermined = focus.some((entry) => entry.classification === "UNDETERMINED");
  const hasForced = focus.some((entry) => entry.classification === "ENTAILED");
  if (hasUndetermined && hasForced) {
    return { role: "POSSIBILITY_COMPARISON", mode: "FORCED_AND_TRUE_FALSE_COMPARISON" };
  }
  if (hasUndetermined) {
    return { role: "POSSIBILITY_COMPARISON", mode: "TRUE_FALSE_COMPARISON" };
  }
  if (focus.some((entry) => entry.classification === "CONTRADICTED")) {
    return { role: "IMPOSSIBILITY_CONFLICT", mode: "FORCED_WITH_FOCUS" };
  }
  return { role: "FORCED_FACTS", mode: focus.length > 0 ? "FORCED_WITH_FOCUS" : "RELATION_CARDS" };
}

export function renderPedagogicalVennDiagram(
  premises: readonly SurfacePremise[],
  focus: readonly PedagogicalDiagramFocus[],
  pairStatus: PairSemanticStatus | PairClassificationStatus | null,
  locale: SylLocale,
  assignment: TermAssignment,
  idSuffix: string,
): PedagogicalDiagramResult {
  const copy = localizedCopy(locale);
  const { role, mode } = relationRole(focus, pairStatus);
  const cardWidth = premises.length === 2 ? 316 : 210;
  const cardGap = 14;
  const premiseStartX = premises.length === 2 ? 36 : 24;
  const premiseY = 64;
  const premiseHeight = 156;
  const focusY = 266;
  const focusCount = mode === "TRUE_FALSE_COMPARISON" ? 2 : mode === "FORCED_AND_TRUE_FALSE_COMPARISON" ? 3 : Math.min(Math.max(focus.length, 1), 3);
  const focusCardWidth = focusCount === 1 ? 650 : focusCount === 2 ? 316 : 210;
  const focusStartX = focusCount === 1 ? 35 : focusCount === 2 ? 36 : 24;
  const focusHeight = 164;
  const totalHeight = focus.length > 0 ? 482 : 258;
  const titleId = `syl-ped-title-${idSuffix}`;
  const descId = `syl-ped-desc-${idSuffix}`;

  const premiseCards = premises.map((premise, index) => {
    const relation = normalizePremiseRelation(premise);
    const x = premiseStartX + index * (cardWidth + cardGap);
    return `<text x="${x + 8}" y="${premiseY - 10}" class="card-kicker">${escapeXml(copy.premise)} ${index + 1}</text>${renderRelationGeometry(
      relation,
      locale,
      assignment,
      x,
      premiseY,
      cardWidth,
      premiseHeight,
    )}`;
  }).join("");

  let focusCards = "";
  let caption = copy.forcedCaption;
  if (focus.length > 0 && mode === "TRUE_FALSE_COMPARISON") {
    const current = focus.find((entry) => entry.classification === "UNDETERMINED") ?? focus[0];
    const trueRelation = normalizeConclusionRelation(current.conclusion);
    const falseRelation = negatedConclusionRelation(current.conclusion);
    focusCards = [
      `<text x="44" y="${focusY - 10}" class="card-kicker">${escapeXml(current.label)} · ${escapeXml(copy.canBeTrue)}</text>${renderRelationGeometry(trueRelation, locale, assignment, 36, focusY, 316, focusHeight, "NORMAL")}`,
      `<text x="374" y="${focusY - 10}" class="card-kicker">${escapeXml(current.label)} · ${escapeXml(copy.canBeFalse)}</text>${renderRelationGeometry(falseRelation, locale, assignment, 368, focusY, 316, focusHeight, "NORMAL")}`,
    ].join("");
    caption = `${copy.possibilityCaption} ${copy.focusedNote}`;
  } else if (focus.length > 0 && mode === "FORCED_AND_TRUE_FALSE_COMPARISON") {
    const forced = focus.find((entry) => entry.classification === "ENTAILED")!;
    const uncertain = focus.find((entry) => entry.classification === "UNDETERMINED")!;
    focusCards = [
      `<text x="32" y="${focusY - 10}" class="card-kicker">${escapeXml(forced.label)} · ${escapeXml(copy.definitelyTrue)}</text>${renderRelationGeometry(normalizeConclusionRelation(forced.conclusion), locale, assignment, 24, focusY, 210, focusHeight, "CORRECT")}`,
      `<text x="263" y="${focusY - 10}" class="card-kicker">${escapeXml(uncertain.label)} · ${escapeXml(copy.canBeTrue)}</text>${renderRelationGeometry(normalizeConclusionRelation(uncertain.conclusion), locale, assignment, 255, focusY, 210, focusHeight, "NORMAL")}`,
      `<text x="494" y="${focusY - 10}" class="card-kicker">${escapeXml(uncertain.label)} · ${escapeXml(copy.canBeFalse)}</text>${renderRelationGeometry(negatedConclusionRelation(uncertain.conclusion), locale, assignment, 486, focusY, 210, focusHeight, "NORMAL")}`,
    ].join("");
    caption = `${copy.forcedCaption} ${copy.possibilityCaption} ${copy.focusedNote}`;
  } else if (focus.length > 0) {
    focusCards = focus.slice(0, 3).map((entry, index) => {
      const relation = normalizeConclusionRelation(entry.conclusion);
      const x = focusStartX + index * (focusCardWidth + cardGap);
      const status = entry.classification === "ENTAILED" ? "CORRECT" : entry.classification === "CONTRADICTED" ? "CONFLICT" : "NORMAL";
      const badge = entry.classification === "ENTAILED"
        ? copy.definitelyTrue
        : entry.classification === "CONTRADICTED"
          ? copy.impossible
          : copy.canBeTrue;
      return `<text x="${x + 8}" y="${focusY - 10}" class="card-kicker">${escapeXml(entry.label)} · ${escapeXml(badge)}</text>${renderRelationGeometry(
        relation,
        locale,
        assignment,
        x,
        focusY,
        focusCardWidth,
        focusHeight,
        status,
      )}`;
    }).join("");
    caption = role === "IMPOSSIBILITY_CONFLICT"
      ? `${copy.impossibleCaption} ${copy.focusedNote}`
      : role === "EITHER_OR_ALTERNATIVES"
        ? `${copy.eitherCaption} ${copy.focusedNote}`
        : `${copy.forcedCaption} ${copy.focusedNote}`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${totalHeight}" width="100%" role="img" aria-labelledby="${titleId} ${descId}" data-diagram-mode="${mode}" class="examtree-venn-svg">
  <title id="${titleId}">${escapeXml(copy.title)}</title>
  <desc id="${descId}">${escapeXml(copy.desc)}</desc>
  <style>
    .examtree-venn-svg{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.set-label{font-size:11px;font-weight:700;fill:#1e293b}.witness{font-size:16px;font-weight:800;fill:#0f172a}.relation-caption{font-size:10px;font-weight:600;fill:#334155}.section-title{font-size:14px;font-weight:800;fill:#0f172a}.card-kicker{font-size:11px;font-weight:800;fill:#475569}.exclusion-line{stroke:#dc2626;stroke-width:2;stroke-dasharray:4 4}.cross-mark{stroke:#dc2626;stroke-width:3;stroke-linecap:round}.large-cross{stroke:#dc2626;stroke-width:5;stroke-linecap:round;opacity:.72}
  </style>
  <rect x="2" y="2" width="716" height="${totalHeight - 4}" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="24" y="30" class="section-title">${escapeXml(copy.premiseHeading)}</text>
  ${premiseCards}
  ${focus.length > 0 ? `<line x1="24" y1="240" x2="696" y2="240" stroke="#cbd5e1"/><text x="24" y="258" class="section-title">${escapeXml(copy.conclusionHeading)}</text>${focusCards}` : ""}
  </svg>`;

  return {
    role,
    mode,
    title: copy.title,
    caption,
    svg,
  };
}
