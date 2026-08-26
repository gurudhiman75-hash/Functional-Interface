import { applyPfcFoldV1, type PfcFoldV1, type PfcLayerFragmentV1 } from "./paper-folding-foundation-v1";
import {
  renderPfcDiscoveryOptionSvgV1,
  type PfcDiscoveryRepresentationIdV1,
} from "./paper-folding-discovery-v1";
import type { SpatialPoint } from "./types";
import {
  generatePfcPermanentEnglishCorpusV1,
  generatePfcPermanentEnglishQlV1,
  type PfcPermanentEnglishQuestionV1,
} from "./paper-folding-permanent-english-runtime-v1";
import type { PfcPermanentQlIdV3 } from "./spatial-permanent-ql-allocation-v3";
import { PFC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./paper-folding-english-freeze-v1";

export const PFC_001_LOCALIZATION_AUTHORITY_DRAFT_V1 = Object.freeze({
  authorityId: "PFC-001-HI-PA-LOCALIZATION-REVIEW-V1" as const,
  chapterCode: "PFC-001" as const,
  englishFreezeAuthorityId: PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  status: "HINDI_PUNJABI_RUNTIME_IMPLEMENTED_REVIEW_PENDING" as const,
  supportedLanguages: ["hi", "pa"] as const,
  geometryInvariant: true,
  foldsInvariant: true,
  cutsInvariant: true,
  optionOrderInvariant: true,
  answerInvariant: true,
  idInvariant: true,
  fingerprintInvariant: true,
  questionStudioRegistered: false,
  automaticPublication: false,
} as const);

export type PfcLocalizedLanguageV1 = "hi" | "pa";
export type PfcLocalizedLocaleV1 = "hi-IN" | "pa-IN";

export type PfcLocalizedQuestionV1 = Omit<
  PfcPermanentEnglishQuestionV1,
  "language" | "locale" | "permanentQlTitle" | "stem" | "explanation"
> & {
  language: PfcLocalizedLanguageV1;
  locale: PfcLocalizedLocaleV1;
  permanentQlTitle: string;
  stem: string;
  explanation: string;
  localization: {
    authorityId: typeof PFC_001_LOCALIZATION_AUTHORITY_DRAFT_V1.authorityId;
    englishFreezeAuthorityId: typeof PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId;
    geometryInvariant: true;
    foldsInvariant: true;
    cutsInvariant: true;
    optionOrderInvariant: true;
    answerInvariant: true;
    idInvariant: true;
    fingerprintInvariant: true;
    reviewOnly: true;
    frozen: false;
  };
};

const HI_QL_TITLES: Record<PfcPermanentQlIdV3, string> = {
  "SPA-QL-035": "सीधे और बार-बार मोड़े कागज़ को खोलना",
  "SPA-QL-036": "कई दिशाओं में मोड़े कागज़ को खोलना",
  "SPA-QL-037": "तिरछे और कोने से मोड़े कागज़ को खोलना",
  "SPA-QL-038": "कई कट और किनारे के कट वाला कागज़ खोलना",
};

const PA_QL_TITLES: Record<PfcPermanentQlIdV3, string> = {
  "SPA-QL-035": "ਸਿੱਧੇ ਅਤੇ ਵਾਰ-ਵਾਰ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
  "SPA-QL-036": "ਕਈ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
  "SPA-QL-037": "ਤਿਰਛੇ ਅਤੇ ਕੋਨੇ ਤੋਂ ਮੋੜੇ ਕਾਗਜ਼ ਨੂੰ ਖੋਲ੍ਹਣਾ",
  "SPA-QL-038": "ਕਈ ਕੱਟਾਂ ਅਤੇ ਕਿਨਾਰੇ ਵਾਲੇ ਕੱਟ ਨਾਲ ਕਾਗਜ਼ ਖੋਲ੍ਹਣਾ",
};

const HI_STEM = "कागज़ को तीर की दिशा में मोड़कर दिखाए अनुसार काटा गया है। पूरा खोलने पर कागज़ किस विकल्प जैसा दिखेगा?";
const PA_STEM = "ਕਾਗਜ਼ ਨੂੰ ਤੀਰ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਮੋੜ ਕੇ ਦਿਖਾਏ ਅਨੁਸਾਰ ਕੱਟਿਆ ਗਿਆ ਹੈ। ਪੂਰਾ ਖੋਲ੍ਹਣ ਤੇ ਕਾਗਜ਼ ਕਿਸ ਵਿਕਲਪ ਵਰਗਾ ਦਿਖੇਗਾ?";

function hiExplanation(representationId: PfcDiscoveryRepresentationIdV1, answer: string): string {
  switch (representationId) {
    case "PFC-PROT-01-SINGLE-AXIAL-HOLE":
      return `कागज़ एक बार मोड़ा गया है, इसलिए छेद दो परतों से गुजरता है। कागज़ खोलने पर मोड़ की रेखा के दूसरी तरफ उतनी ही दूरी पर दूसरा छेद बनेगा। यही जोड़ी विकल्प ${answer} में है।`;
    case "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH":
      return `कट मोड़े हुए कागज़ के बाहरी किनारे पर है। कागज़ खोलने पर दूसरी तरफ के मिलते हुए किनारे पर वैसा ही कट बनेगा। दोनों कट किनारे पर ही रहते हैं, इसलिए विकल्प ${answer} सही है।`;
    case "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD":
      return `कागज़ दो अलग दिशाओं में मोड़ा गया है, इसलिए छेद चार परतों से गुजरता है। पहले दूसरा मोड़ खोलें, फिर पहला। हर बार छेद दूसरी तरफ दोहरता है और चार छेद बनते हैं। यह विकल्प ${answer} है।`;
    case "PFC-PROT-04-REPEATED-SAME-DIRECTION":
      return `दोनों मोड़ एक ही दिशा में हैं। पहले दूसरा मोड़ खोलने पर छेद की एक और जगह बनती है। फिर पहला मोड़ खोलने पर दोनों निशान दूसरी तरफ भी बनते हैं। चार छेदों वाला सही चित्र विकल्प ${answer} है।`;
    case "PFC-PROT-05-CORNER-FOLD":
      return `सिर्फ मोड़ा हुआ कोना कागज़ के ऊपर आया है, इसलिए छेद उस जगह की दो परतों से गुजरता है। कोना खोलने पर तिरछी मोड़ रेखा के दूसरी तरफ वैसा ही दूसरा छेद बनेगा। यह विकल्प ${answer} में है।`;
    case "PFC-PROT-06-DIAGONAL-FOLD":
      return `कागज़ तिरछी रेखा पर मोड़ा गया है। खोलने पर छेद उसी तिरछी रेखा के दूसरी तरफ उतनी ही दूरी पर बनता है। दोनों छेदों की सही जगह विकल्प ${answer} में है।`;
    case "PFC-PROT-07-DIAGONAL-PLUS-AXIAL":
      return `यहाँ दो अलग मोड़ हैं। पहले आखिरी तिरछा मोड़ खोलें, फिर पहला सीधा मोड़। हर बार बने निशान मोड़ की दूसरी तरफ दोहरते हैं। चार छेदों की सही बनावट विकल्प ${answer} है।`;
    case "PFC-PROT-08-MULTIPLE-CUTS":
      return `कागज़ की चार परतें साथ हैं और दो छेद किए गए हैं। हर छेद कागज़ पूरा खोलने पर चार जगह दिखाई देगा। इस तरह कुल आठ छेद बनते हैं। उनकी सही जगह विकल्प ${answer} में है।`;
    case "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH":
      return `कट मोड़े हुए कागज़ के किनारे पर है। दोनों मोड़ खोलने पर यही कट मिलती हुई चार किनारी जगहों पर आता है; यह अंदर का छेद नहीं बनता। सही चित्र विकल्प ${answer} है।`;
    case "PFC-PROT-10-THREE-FOLD-ADVANCED":
      return `तीन मोड़ों के बाद छेद आठ परतों से गुजरता है। पहले आखिरी मोड़, फिर दूसरा और फिर पहला मोड़ खोलें। निशान 1 से 2, फिर 4 और आखिर में 8 हो जाते हैं। यह बनावट विकल्प ${answer} में है।`;
  }
}

function paExplanation(representationId: PfcDiscoveryRepresentationIdV1, answer: string): string {
  switch (representationId) {
    case "PFC-PROT-01-SINGLE-AXIAL-HOLE":
      return `ਕਾਗਜ਼ ਇੱਕ ਵਾਰ ਮੋੜਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਛੇਦ ਦੋ ਪਰਤਾਂ ਵਿਚੋਂ ਲੰਘਦਾ ਹੈ। ਕਾਗਜ਼ ਖੋਲ੍ਹਣ ਤੇ ਮੋੜ ਵਾਲੀ ਰੇਖਾ ਦੇ ਦੂਜੇ ਪਾਸੇ ਉੱਨੀ ਹੀ ਦੂਰੀ ਤੇ ਦੂਜਾ ਛੇਦ ਬਣੇਗਾ। ਇਹ ਜੋੜੀ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
    case "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH":
      return `ਕੱਟ ਮੋੜੇ ਕਾਗਜ਼ ਦੇ ਬਾਹਰਲੇ ਕਿਨਾਰੇ ਤੇ ਹੈ। ਕਾਗਜ਼ ਖੋਲ੍ਹਣ ਤੇ ਦੂਜੇ ਪਾਸੇ ਦੇ ਮਿਲਦੇ ਕਿਨਾਰੇ ਤੇ ਉਹੋ ਜਿਹਾ ਕੱਟ ਬਣੇਗਾ। ਦੋਵੇਂ ਕੱਟ ਕਿਨਾਰੇ ਤੇ ਹੀ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਲਈ ਵਿਕਲਪ ${answer} ਸਹੀ ਹੈ।`;
    case "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD":
      return `ਕਾਗਜ਼ ਦੋ ਵੱਖ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਮੋੜਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਛੇਦ ਚਾਰ ਪਰਤਾਂ ਵਿਚੋਂ ਲੰਘਦਾ ਹੈ। ਪਹਿਲਾਂ ਦੂਜਾ ਮੋੜ ਖੋਲ੍ਹੋ, ਫਿਰ ਪਹਿਲਾ। ਹਰ ਵਾਰ ਛੇਦ ਦੂਜੇ ਪਾਸੇ ਦੁਹਰਦਾ ਹੈ ਅਤੇ ਚਾਰ ਛੇਦ ਬਣਦੇ ਹਨ। ਇਹ ਵਿਕਲਪ ${answer} ਹੈ।`;
    case "PFC-PROT-04-REPEATED-SAME-DIRECTION":
      return `ਦੋਵੇਂ ਮੋੜ ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਹਨ। ਪਹਿਲਾਂ ਦੂਜਾ ਮੋੜ ਖੋਲ੍ਹਣ ਨਾਲ ਛੇਦ ਦੀ ਇੱਕ ਹੋਰ ਥਾਂ ਬਣਦੀ ਹੈ। ਫਿਰ ਪਹਿਲਾ ਮੋੜ ਖੋਲ੍ਹਣ ਨਾਲ ਦੋਵੇਂ ਨਿਸ਼ਾਨ ਦੂਜੇ ਪਾਸੇ ਵੀ ਬਣਦੇ ਹਨ। ਚਾਰ ਛੇਦਾਂ ਵਾਲਾ ਸਹੀ ਚਿੱਤਰ ਵਿਕਲਪ ${answer} ਹੈ।`;
    case "PFC-PROT-05-CORNER-FOLD":
      return `ਸਿਰਫ ਮੋੜਿਆ ਹੋਇਆ ਕੋਨਾ ਕਾਗਜ਼ ਉੱਤੇ ਆਇਆ ਹੈ, ਇਸ ਲਈ ਛੇਦ ਉਸ ਥਾਂ ਦੀਆਂ ਦੋ ਪਰਤਾਂ ਵਿਚੋਂ ਲੰਘਦਾ ਹੈ। ਕੋਨਾ ਖੋਲ੍ਹਣ ਤੇ ਤਿਰਛੀ ਮੋੜ ਰੇਖਾ ਦੇ ਦੂਜੇ ਪਾਸੇ ਉਹੋ ਜਿਹਾ ਦੂਜਾ ਛੇਦ ਬਣੇਗਾ। ਇਹ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
    case "PFC-PROT-06-DIAGONAL-FOLD":
      return `ਕਾਗਜ਼ ਤਿਰਛੀ ਰੇਖਾ ਤੇ ਮੋੜਿਆ ਗਿਆ ਹੈ। ਖੋਲ੍ਹਣ ਤੇ ਛੇਦ ਉਸੇ ਤਿਰਛੀ ਰੇਖਾ ਦੇ ਦੂਜੇ ਪਾਸੇ ਉੱਨੀ ਹੀ ਦੂਰੀ ਤੇ ਬਣਦਾ ਹੈ। ਦੋਵੇਂ ਛੇਦਾਂ ਦੀ ਸਹੀ ਥਾਂ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
    case "PFC-PROT-07-DIAGONAL-PLUS-AXIAL":
      return `ਇੱਥੇ ਦੋ ਵੱਖ ਮੋੜ ਹਨ। ਪਹਿਲਾਂ ਆਖਰੀ ਤਿਰਛਾ ਮੋੜ ਖੋਲ੍ਹੋ, ਫਿਰ ਪਹਿਲਾ ਸਿੱਧਾ ਮੋੜ। ਹਰ ਵਾਰ ਬਣੇ ਨਿਸ਼ਾਨ ਮੋੜ ਦੇ ਦੂਜੇ ਪਾਸੇ ਦੁਹਰਦੇ ਹਨ। ਚਾਰ ਛੇਦਾਂ ਦੀ ਸਹੀ ਬਣਤਰ ਵਿਕਲਪ ${answer} ਹੈ।`;
    case "PFC-PROT-08-MULTIPLE-CUTS":
      return `ਕਾਗਜ਼ ਦੀਆਂ ਚਾਰ ਪਰਤਾਂ ਇਕੱਠੀਆਂ ਹਨ ਅਤੇ ਦੋ ਛੇਦ ਕੀਤੇ ਗਏ ਹਨ। ਕਾਗਜ਼ ਪੂਰਾ ਖੋਲ੍ਹਣ ਤੇ ਹਰ ਛੇਦ ਚਾਰ ਥਾਵਾਂ ਤੇ ਦਿਖੇਗਾ। ਇਸ ਤਰ੍ਹਾਂ ਕੁੱਲ ਅੱਠ ਛੇਦ ਬਣਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਸਹੀ ਥਾਂ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
    case "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH":
      return `ਕੱਟ ਮੋੜੇ ਕਾਗਜ਼ ਦੇ ਕਿਨਾਰੇ ਤੇ ਹੈ। ਦੋਵੇਂ ਮੋੜ ਖੋਲ੍ਹਣ ਤੇ ਇਹੋ ਕੱਟ ਮਿਲਦੀਆਂ ਚਾਰ ਕਿਨਾਰੀ ਥਾਵਾਂ ਤੇ ਆਉਂਦਾ ਹੈ; ਇਹ ਅੰਦਰਲਾ ਛੇਦ ਨਹੀਂ ਬਣਦਾ। ਸਹੀ ਚਿੱਤਰ ਵਿਕਲਪ ${answer} ਹੈ।`;
    case "PFC-PROT-10-THREE-FOLD-ADVANCED":
      return `ਤਿੰਨ ਮੋੜਾਂ ਤੋਂ ਬਾਅਦ ਛੇਦ ਅੱਠ ਪਰਤਾਂ ਵਿਚੋਂ ਲੰਘਦਾ ਹੈ। ਪਹਿਲਾਂ ਆਖਰੀ ਮੋੜ, ਫਿਰ ਦੂਜਾ ਅਤੇ ਫਿਰ ਪਹਿਲਾ ਮੋੜ ਖੋਲ੍ਹੋ। ਨਿਸ਼ਾਨ 1 ਤੋਂ 2, ਫਿਰ 4 ਅਤੇ ਅਖੀਰ ਵਿੱਚ 8 ਹੋ ਜਾਂਦੇ ਹਨ। ਇਹ ਬਣਤਰ ਵਿਕਲਪ ${answer} ਵਿੱਚ ਹੈ।`;
  }
}

export function localizePfcPermanentQuestionV1(
  question: PfcPermanentEnglishQuestionV1,
  language: PfcLocalizedLanguageV1,
): PfcLocalizedQuestionV1 {
  if (!PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiGenerationAllowed) {
    throw new Error("PFC English freeze does not allow localization.");
  }
  const isHindi = language === "hi";
  return {
    ...question,
    language,
    locale: isHindi ? "hi-IN" : "pa-IN",
    permanentQlTitle: isHindi ? HI_QL_TITLES[question.permanentQlId] : PA_QL_TITLES[question.permanentQlId],
    stem: isHindi ? HI_STEM : PA_STEM,
    explanation: isHindi
      ? hiExplanation(question.representationId, question.correctOptionId)
      : paExplanation(question.representationId, question.correctOptionId),
    localization: {
      authorityId: PFC_001_LOCALIZATION_AUTHORITY_DRAFT_V1.authorityId,
      englishFreezeAuthorityId: PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
      geometryInvariant: true,
      foldsInvariant: true,
      cutsInvariant: true,
      optionOrderInvariant: true,
      answerInvariant: true,
      idInvariant: true,
      fingerprintInvariant: true,
      reviewOnly: true,
      frozen: false,
    },
  };
}

export function generatePfcLocalizedQlV1(
  qlId: PfcPermanentQlIdV3,
  language: PfcLocalizedLanguageV1,
): PfcLocalizedQuestionV1[] {
  return generatePfcPermanentEnglishQlV1(qlId).map((question) =>
    localizePfcPermanentQuestionV1(question, language),
  );
}

export function generatePfcLocalizedCorpusV1(
  language: PfcLocalizedLanguageV1,
): PfcLocalizedQuestionV1[] {
  return generatePfcPermanentEnglishCorpusV1().map((question) =>
    localizePfcPermanentQuestionV1(question, language),
  );
}

interface LocalizedLabels {
  paper: string;
  fold: string;
  cut: string;
}

const LABELS: Record<PfcLocalizedLanguageV1, LocalizedLabels> = {
  hi: { paper: "कागज़", fold: "मोड़", cut: "कट" },
  pa: { paper: "ਕਾਗਜ਼", fold: "ਮੋੜ", cut: "ਕੱਟ" },
};

function q(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function polygonPoints(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function foldArrow(fold: PfcFoldV1, markerId: string): string {
  const dx = fold.line.b.x - fold.line.a.x;
  const dy = fold.line.b.y - fold.line.a.y;
  const length = Math.hypot(dx, dy);
  if (length <= 0) return "";
  const nx = -dy / length;
  const ny = dx / length;
  const sign = fold.movingSide === "POSITIVE" ? 1 : -1;
  const t = fold.kind === "DIAGONAL" || fold.kind === "CORNER" ? 0.55 : 0.35;
  const anchor = { x: fold.line.a.x + dx * t, y: fold.line.a.y + dy * t };
  const start = { x: anchor.x + nx * sign * 18, y: anchor.y + ny * sign * 18 };
  const end = { x: anchor.x + nx * sign * 3, y: anchor.y + ny * sign * 3 };
  return `<line x1="${q(start.x)}" y1="${q(start.y)}" x2="${q(end.x)}" y2="${q(end.y)}" stroke="black" stroke-width="2.2" marker-end="url(#${markerId})"/>`;
}

export function renderPfcLocalizedStimulusSvgV1(
  question: PfcLocalizedQuestionV1,
  size = 520,
): string {
  const labels = LABELS[question.language];
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: question.sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  const panels: string[] = [];
  const panelCount = question.folds.length + 2;
  const panelWidth = 126;
  const markerId = `pfc-arrow-${question.language}-${question.permanentQuestionId.replace(/[^a-zA-Z0-9]/g, "")}`;
  panels.push(`<g transform="translate(8,12)"><text x="50" y="-3" text-anchor="middle" font-size="9">${labels.paper}</text><polygon points="${polygonPoints(question.sheetBoundary)}" fill="white" stroke="black" stroke-width="1.8"/></g>`);

  question.folds.forEach((fold, index) => {
    fragments = applyPfcFoldV1(fragments, fold);
    const x = 8 + (index + 1) * panelWidth;
    const visiblePolygons = fragments.map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" fill-opacity="0.72" stroke="black" stroke-width="1.15"/>`).join("");
    panels.push(`<g transform="translate(${x},12)"><text x="50" y="-3" text-anchor="middle" font-size="9">${labels.fold} ${index + 1}</text>${visiblePolygons}<line x1="${q(fold.line.a.x)}" y1="${q(fold.line.a.y)}" x2="${q(fold.line.b.x)}" y2="${q(fold.line.b.y)}" stroke="black" stroke-width="1" stroke-dasharray="4 3"/>${foldArrow(fold, markerId)}</g>`);
  });

  const finalX = 8 + (panelCount - 1) * panelWidth;
  const finalPolygons = fragments.map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" fill-opacity="0.72" stroke="black" stroke-width="1.15"/>`).join("");
  const finalCuts = question.cuts.map((cut) => `<circle cx="${q(cut.center.x)}" cy="${q(cut.center.y)}" r="${q(Math.max(2.8, cut.radius))}" fill="${cut.kind === "POINT_HOLE" ? "black" : "white"}" stroke="black" stroke-width="1.5"/>`).join("");
  panels.push(`<g transform="translate(${finalX},12)"><text x="50" y="-3" text-anchor="middle" font-size="9">${labels.cut}</text>${finalPolygons}${finalCuts}</g>`);

  const viewWidth = 16 + panelCount * panelWidth;
  const viewHeight = 130;
  const scale = size / Math.max(viewWidth, viewHeight);
  const width = Math.round(viewWidth * scale);
  const height = Math.round(viewHeight * scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="${labels.paper}"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="black"/></marker></defs><rect width="100%" height="100%" fill="white"/>${panels.join("")}</svg>`;
}

export function renderPfcLocalizationReviewHtmlV1(
  questions: readonly PfcLocalizedQuestionV1[],
): string {
  const cards = questions.map((question) => `<article lang="${question.language}" style="border:1px solid #ccc;border-radius:10px;padding:16px;margin:16px 0;background:#fff"><h2 style="margin:0 0 4px">${question.permanentQuestionId} · ${question.language.toUpperCase()}</h2><p><strong>${question.permanentQlId}</strong> · ${question.permanentQlTitle}</p><p><strong>${question.language === "hi" ? "प्रश्न" : "ਸਵਾਲ"}:</strong> ${question.stem}</p><div style="overflow:auto">${renderPfcLocalizedStimulusSvgV1(question, 520)}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(112px,1fr));gap:12px;margin-top:14px">${question.options.map((option) => `<div style="text-align:center"><strong>${option.optionId}</strong><div>${renderPfcDiscoveryOptionSvgV1(option, 112)}</div></div>`).join("")}</div><p><strong>${question.language === "hi" ? "उत्तर" : "ਜਵਾਬ"}:</strong> ${question.correctOptionId}</p><p><strong>${question.language === "hi" ? "समझें" : "ਸਮਝੋ"}:</strong> ${question.explanation}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC-001 Hindi Punjabi Review V1</title></head><body style="font-family:Arial,sans-serif;background:#f5f5f5;color:#111;max-width:1100px;margin:0 auto;padding:16px"><h1>PFC-001 Hindi Punjabi Review V1</h1><p>Geometry, folds, cuts, options, answers, IDs and fingerprints are inherited unchanged from the frozen English runtime.</p>${cards}</body></html>`;
}
