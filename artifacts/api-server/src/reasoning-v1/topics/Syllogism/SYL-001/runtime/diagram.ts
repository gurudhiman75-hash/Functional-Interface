import type { CanonicalModel, SylLocale } from "../foundation/types";
import type { TermAssignment } from "./localization";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function localizedText(locale: SylLocale): {
  title: string;
  desc: string;
  occupied: string;
  none: string;
} {
  if (locale === "hi-IN") {
    return {
      title: "समुच्चय-संबंध प्रमाण",
      desc: "तर्क में प्रयुक्त वर्गों और एक मान्य साक्ष्य व्यवस्था का सार।",
      occupied: "मान्य सदस्य-क्षेत्र",
      none: "कोई अलग अस्तित्व-साक्ष्य आवश्यक नहीं",
    };
  }
  if (locale === "pa-IN") {
    return {
      title: "ਸਮੂਹ-ਸੰਬੰਧ ਸਬੂਤ",
      desc: "ਤਰਕ ਵਿੱਚ ਵਰਤੇ ਵਰਗਾਂ ਅਤੇ ਇੱਕ ਮੰਨੀ ਹੋਈ ਸਬੂਤੀ ਬਣਤਰ ਦਾ ਸਾਰ।",
      occupied: "ਮੰਨੇ ਹੋਏ ਮੈਂਬਰ-ਖੇਤਰ",
      none: "ਵੱਖਰਾ ਮੌਜੂਦਗੀ ਸਬੂਤ ਲੋੜੀਂਦਾ ਨਹੀਂ",
    };
  }
  return {
    title: "Set-relation evidence",
    desc: "Summary of the categories and one valid witness arrangement used by the logic.",
    occupied: "Occupied witness regions",
    none: "No separate existence witness is required",
  };
}

function regionLabel(
  model: CanonicalModel,
  mask: number,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  const included = model.termOrder
    .filter((termId, index) => (mask & (1 << index)) !== 0)
    .map((termId) => assignment[termId]?.labels[locale] ?? termId);
  if (included.length === 0) {
    return locale === "hi-IN" ? "सभी वर्गों से बाहर" : locale === "pa-IN" ? "ਸਾਰੇ ਵਰਗਾਂ ਤੋਂ ਬਾਹਰ" : "outside all shown categories";
  }
  return included.join(" + ");
}

export function renderEvidenceDiagram(
  model: CanonicalModel | null,
  locale: SylLocale,
  assignment: TermAssignment,
  idSuffix: string,
): string {
  const copy = localizedText(locale);
  const labels = model?.termOrder.map((termId) => assignment[termId]?.labels[locale] ?? termId) ?? [];
  const regions = model?.occupiedRegions.map((region) => regionLabel(model, region.mask, locale, assignment)) ?? [];
  const width = 720;
  const height = 180 + Math.max(1, regions.length) * 28;
  const titleId = `syl-title-${idSuffix}`;
  const descId = `syl-desc-${idSuffix}`;

  const circles = labels.slice(0, 3).map((text, index) => {
    const x = 160 + index * 145;
    const y = 85;
    return `<circle cx="${x}" cy="${y}" r="58" fill="none" stroke="currentColor" stroke-width="2"/><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="14">${escapeXml(text)}</text>`;
  }).join("");

  const extraTerms = labels.slice(3).map((text, index) =>
    `<rect x="${530 + (index % 2) * 88}" y="${42 + Math.floor(index / 2) * 50}" width="78" height="34" rx="7" fill="none" stroke="currentColor"/><text x="${569 + (index % 2) * 88}" y="${59 + Math.floor(index / 2) * 50}" text-anchor="middle" dominant-baseline="middle" font-size="12">${escapeXml(text)}</text>`,
  ).join("");

  const regionRows = (regions.length > 0 ? regions : [copy.none]).map((text, index) =>
    `<text x="32" y="${190 + index * 28}" font-size="13">• ${escapeXml(text)}</text>`,
  ).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${titleId} ${descId}">
<title id="${titleId}">${escapeXml(copy.title)}</title>
<desc id="${descId}">${escapeXml(copy.desc)}</desc>
<rect x="1" y="1" width="718" height="${height - 2}" rx="12" fill="none" stroke="currentColor"/>
${circles}
${extraTerms}
<line x1="24" y1="160" x2="696" y2="160" stroke="currentColor" stroke-opacity="0.35"/>
<text x="24" y="181" font-size="13" font-weight="600">${escapeXml(copy.occupied)}</text>
${regionRows}
</svg>`;
}

export function describeModel(
  model: CanonicalModel | null,
  locale: SylLocale,
  assignment: TermAssignment,
): string {
  if (!model || model.occupiedRegions.length === 0) {
    if (locale === "hi-IN") return "इस जाँच के लिए अलग अस्तित्व-साक्ष्य की आवश्यकता नहीं है।";
    if (locale === "pa-IN") return "ਇਸ ਜਾਂਚ ਲਈ ਵੱਖਰੇ ਮੌਜੂਦਗੀ ਸਬੂਤ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।";
    return "No separate existence witness is required for this check.";
  }
  const regions = model.occupiedRegions.map((region) => regionLabel(model, region.mask, locale, assignment));
  if (locale === "hi-IN") return `एक मान्य व्यवस्था में सदस्य इन क्षेत्रों में रखे जा सकते हैं: ${regions.join("; ")}।`;
  if (locale === "pa-IN") return `ਇੱਕ ਮੰਨੀ ਹੋਈ ਬਣਤਰ ਵਿੱਚ ਮੈਂਬਰ ਇਨ੍ਹਾਂ ਖੇਤਰਾਂ ਵਿੱਚ ਰੱਖੇ ਜਾ ਸਕਦੇ ਹਨ: ${regions.join("; ")}।`;
  return `One valid arrangement places witnesses in these regions: ${regions.join("; ")}.`;
}
