import { createHash } from "node:crypto";

import {
  SEA002_CP008_ENGLISH_REVIEW_SET_V1,
  type Sea002Cp008NormalizedClue,
  type Sea002Cp008NormalizedQuery,
  type Sea002Cp008ReviewCandidate,
  type Sea002Cp008ReviewTopology,
} from "./production-review-v1.ts";

export type Sea002Cp008Locale = "hi" | "pa";

export type Sea002Cp008LocalizedReviewCandidate = Readonly<{
  locale: Sea002Cp008Locale;
  permanentQlId: Sea002Cp008ReviewCandidate["permanentQlId"];
  authorityKey: string;
  signatureId: string;
  variantIndex: number;
  difficulty: Sea002Cp008ReviewCandidate["difficulty"];
  examLineage: Sea002Cp008ReviewCandidate["examLineage"];
  stem: string;
  question: string;
  options: readonly string[];
  correctOptionIndex: number;
  answer: string;
  explanation: string;
  sourceEnglishFingerprint: string;
  localizedFingerprint: string;
  reviewStatus: "V1_REVIEW_READY_HUMAN_APPROVAL_PENDING";
  active: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  publiclyPublishable: false;
}>;

function hiOrdinal(steps: number): string {
  if (steps === 1) return "तुरंत";
  if (steps === 2) return "दूसरे स्थान पर";
  if (steps === 3) return "तीसरे स्थान पर";
  if (steps === 4) return "चौथे स्थान पर";
  return `${steps} स्थान दूर`;
}

function paOrdinal(steps: number): string {
  if (steps === 1) return "ਤੁਰੰਤ";
  if (steps === 2) return "ਦੂਜੇ ਸਥਾਨ 'ਤੇ";
  if (steps === 3) return "ਤੀਜੇ ਸਥਾਨ 'ਤੇ";
  if (steps === 4) return "ਚੌਥੇ ਸਥਾਨ 'ਤੇ";
  return `${steps} ਸਥਾਨ ਦੂਰ`;
}

function hiDirection(direction: "LEFT" | "RIGHT"): string {
  return direction === "LEFT" ? "बाएँ" : "दाएँ";
}

function paDirection(direction: "LEFT" | "RIGHT"): string {
  return direction === "LEFT" ? "ਖੱਬੇ" : "ਸੱਜੇ";
}

function hiIntro(topology: Sea002Cp008ReviewTopology, facingMode: string): string {
  if (topology === "ALT8_ROLE_DERIVED") {
    return facingMode === "CORNERS_OUT_SIDES_IN"
      ? "आठ व्यक्ति एक वर्गाकार मेज के चारों ओर हैं। चार व्यक्ति कोनों पर और चार भुजाओं के मध्य में हैं। कोनों पर मौजूद व्यक्तियों का मुख बाहर की ओर तथा भुजाओं के मध्य वालों का मुख केंद्र की ओर है।"
      : "आठ व्यक्ति एक वर्गाकार मेज के चारों ओर हैं। चार व्यक्ति कोनों पर और चार भुजाओं के मध्य में हैं। कोनों पर मौजूद व्यक्तियों का मुख केंद्र की ओर तथा भुजाओं के मध्य वालों का मुख बाहर की ओर है।";
  }
  if (topology === "SIDEPAIR8_UNIFORM") return "आठ व्यक्ति एक वर्गाकार मेज की चार भुजाओं पर हैं, प्रत्येक भुजा पर दो व्यक्ति हैं और कोई भी कोने पर नहीं है। सभी का मुख केंद्र की ओर है।";
  if (topology === "SIDEPAIR8_MIXED") return "आठ व्यक्ति एक वर्गाकार मेज की चार भुजाओं पर हैं, प्रत्येक भुजा पर दो व्यक्ति हैं और कोई भी कोने पर नहीं है। कुछ का मुख केंद्र की ओर और कुछ का बाहर की ओर है।";
  if (topology === "ALT8_UNIFORM") return facingMode === "ALL_OUT"
    ? "आठ व्यक्ति एक वर्गाकार मेज के चारों ओर हैं, चार कोनों पर और चार भुजाओं के मध्य में। सभी का मुख बाहर की ओर है।"
    : "आठ व्यक्ति एक वर्गाकार मेज के चारों ओर हैं, चार कोनों पर और चार भुजाओं के मध्य में। सभी का मुख केंद्र की ओर है।";
  if (topology === "ALT8_MIXED") return "आठ व्यक्ति एक वर्गाकार मेज के चारों ओर हैं, चार कोनों पर और चार भुजाओं के मध्य में। कुछ का मुख केंद्र की ओर और कुछ का बाहर की ओर है।";
  if (topology === "VARIABLE_SIDE6") return "छह व्यक्ति वर्गाकार मेज की भुजाओं पर हैं और सभी का मुख केंद्र की ओर है। कोई भी कोने पर नहीं है। दो आमने-सामने वाली भुजाओं पर एक-एक व्यक्ति और बाकी दो भुजाओं पर दो-दो व्यक्ति हैं।";
  return "बारह व्यक्ति 60 मीटर परिमाप वाली वर्गाकार मेज के चारों ओर समान दूरी पर हैं। प्रत्येक कोने पर एक और प्रत्येक भुजा पर दो अतिरिक्त व्यक्ति हैं। लगातार दो स्थानों के बीच दूरी 5 मीटर है और सभी का मुख केंद्र की ओर है।";
}

function paIntro(topology: Sea002Cp008ReviewTopology, facingMode: string): string {
  if (topology === "ALT8_ROLE_DERIVED") {
    return facingMode === "CORNERS_OUT_SIDES_IN"
      ? "ਅੱਠ ਵਿਅਕਤੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਹਨ। ਚਾਰ ਕੋਨਿਆਂ 'ਤੇ ਅਤੇ ਚਾਰ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰ ਹਨ। ਕੋਨਿਆਂ ਵਾਲਿਆਂ ਦਾ ਮੂੰਹ ਬਾਹਰ ਵੱਲ ਅਤੇ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰ ਵਾਲਿਆਂ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਹੈ।"
      : "ਅੱਠ ਵਿਅਕਤੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਹਨ। ਚਾਰ ਕੋਨਿਆਂ 'ਤੇ ਅਤੇ ਚਾਰ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰ ਹਨ। ਕੋਨਿਆਂ ਵਾਲਿਆਂ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਅਤੇ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰ ਵਾਲਿਆਂ ਦਾ ਮੂੰਹ ਬਾਹਰ ਵੱਲ ਹੈ।";
  }
  if (topology === "SIDEPAIR8_UNIFORM") return "ਅੱਠ ਵਿਅਕਤੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੀਆਂ ਚਾਰ ਭੁਜਾਵਾਂ 'ਤੇ ਹਨ, ਹਰ ਭੁਜਾ 'ਤੇ ਦੋ ਵਿਅਕਤੀ ਹਨ ਅਤੇ ਕੋਈ ਵੀ ਕੋਨੇ 'ਤੇ ਨਹੀਂ ਹੈ। ਸਭ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਹੈ।";
  if (topology === "SIDEPAIR8_MIXED") return "ਅੱਠ ਵਿਅਕਤੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੀਆਂ ਚਾਰ ਭੁਜਾਵਾਂ 'ਤੇ ਹਨ, ਹਰ ਭੁਜਾ 'ਤੇ ਦੋ ਵਿਅਕਤੀ ਹਨ ਅਤੇ ਕੋਈ ਵੀ ਕੋਨੇ 'ਤੇ ਨਹੀਂ ਹੈ। ਕੁਝ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਅਤੇ ਕੁਝ ਦਾ ਬਾਹਰ ਵੱਲ ਹੈ।";
  if (topology === "ALT8_UNIFORM") return facingMode === "ALL_OUT"
    ? "ਅੱਠ ਵਿਅਕਤੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਹਨ, ਚਾਰ ਕੋਨਿਆਂ 'ਤੇ ਅਤੇ ਚਾਰ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰ। ਸਭ ਦਾ ਮੂੰਹ ਬਾਹਰ ਵੱਲ ਹੈ।"
    : "ਅੱਠ ਵਿਅਕਤੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਹਨ, ਚਾਰ ਕੋਨਿਆਂ 'ਤੇ ਅਤੇ ਚਾਰ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰ। ਸਭ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਹੈ।";
  if (topology === "ALT8_MIXED") return "ਅੱਠ ਵਿਅਕਤੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਹਨ, ਚਾਰ ਕੋਨਿਆਂ 'ਤੇ ਅਤੇ ਚਾਰ ਭੁਜਾਵਾਂ ਦੇ ਵਿਚਕਾਰ। ਕੁਝ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਅਤੇ ਕੁਝ ਦਾ ਬਾਹਰ ਵੱਲ ਹੈ।";
  if (topology === "VARIABLE_SIDE6") return "ਛੇ ਵਿਅਕਤੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੀਆਂ ਭੁਜਾਵਾਂ 'ਤੇ ਹਨ ਅਤੇ ਸਭ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਹੈ। ਕੋਈ ਵੀ ਕੋਨੇ 'ਤੇ ਨਹੀਂ ਹੈ। ਦੋ ਆਮਨੇ-ਸਾਮਨੇ ਭੁਜਾਵਾਂ 'ਤੇ ਇੱਕ-ਇੱਕ ਅਤੇ ਬਾਕੀ ਦੋ ਭੁਜਾਵਾਂ 'ਤੇ ਦੋ-दੋ ਵਿਅਕਤੀ ਹਨ।".replace("ਦੋ-दੋ", "ਦੋ-ਦੋ");
  return "ਬਾਰਾਂ ਵਿਅਕਤੀ 60 ਮੀਟਰ ਪਰਿਮਾਪ ਵਾਲੀ ਵਰਗਾਕਾਰ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਸਮਾਨ ਦੂਰੀ 'ਤੇ ਹਨ। ਹਰ ਕੋਨੇ 'ਤੇ ਇੱਕ ਅਤੇ ਹਰ ਭੁਜਾ 'ਤੇ ਦੋ ਵਾਧੂ ਵਿਅਕਤੀ ਹਨ। ਲਗਾਤਾਰ ਦੋ ਸਥਾਨਾਂ ਵਿਚਕਾਰ 5 ਮੀਟਰ ਦੂਰੀ ਹੈ ਅਤੇ ਸਭ ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਹੈ।";
}

function hiClue(clue: Sea002Cp008NormalizedClue): string {
  if (clue.kind === "ROLE") return clue.role === "CORNER" ? `${clue.person} कोने वाली सीट पर है।` : `${clue.person} भुजा वाली सीट पर है।`;
  if (clue.kind === "FACING_ANCHOR") return `${clue.person} का मुख ${clue.facing === "IN" ? "केंद्र की ओर" : "बाहर की ओर"} है।`;
  if (clue.kind === "FACING_RELATION") return clue.relation === "SAME"
    ? `${clue.a} और ${clue.b} का मुख एक ही दिशा में है।`
    : `${clue.a} और ${clue.b} का मुख विपरीत दिशाओं में है।`;
  if (clue.kind === "RELATIVE") return `${clue.subject}, ${clue.reference} के ${hiDirection(clue.direction)} ${hiOrdinal(clue.steps)} है।`;
  if (clue.kind === "OPPOSITE") return `${clue.a}, ${clue.b} के ठीक सामने है।`;
  if (clue.kind === "SAME_SIDE") return `${clue.a} और ${clue.b} मेज की एक ही भुजा पर हैं।`;
  if (clue.kind === "OCCUPANCY_CLASS") return clue.occupancyKind === "SINGLE"
    ? `${clue.person} उस भुजा पर है जहाँ केवल एक व्यक्ति है।`
    : `${clue.person} उस भुजा पर है जहाँ दो व्यक्ति हैं।`;
  return `${clue.subject}, ${clue.reference} से परिमाप के साथ ${hiDirection(clue.direction)} ${clue.metres} मीटर की दूरी पर है।`;
}

function paClue(clue: Sea002Cp008NormalizedClue): string {
  if (clue.kind === "ROLE") return clue.role === "CORNER" ? `${clue.person} ਕੋਨੇ ਵਾਲੀ ਸੀਟ 'ਤੇ ਹੈ।` : `${clue.person} ਭੁਜਾ ਵਾਲੀ ਸੀਟ 'ਤੇ ਹੈ।`;
  if (clue.kind === "FACING_ANCHOR") return `${clue.person} ਦਾ ਮੂੰਹ ${clue.facing === "IN" ? "ਕੇਂਦਰ ਵੱਲ" : "ਬਾਹਰ ਵੱਲ"} ਹੈ।`;
  if (clue.kind === "FACING_RELATION") return clue.relation === "SAME"
    ? `${clue.a} ਅਤੇ ${clue.b} ਦਾ ਮੂੰਹ ਇੱਕੋ ਦਿਸ਼ਾ ਵੱਲ ਹੈ।`
    : `${clue.a} ਅਤੇ ${clue.b} ਦਾ ਮੂੰਹ ਉਲਟ ਦਿਸ਼ਾਵਾਂ ਵੱਲ ਹੈ।`;
  if (clue.kind === "RELATIVE") return `${clue.subject}, ${clue.reference} ਦੇ ${paDirection(clue.direction)} ${paOrdinal(clue.steps)} ਹੈ।`;
  if (clue.kind === "OPPOSITE") return `${clue.a}, ${clue.b} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹੈ।`;
  if (clue.kind === "SAME_SIDE") return `${clue.a} ਅਤੇ ${clue.b} ਮੇਜ਼ ਦੀ ਇੱਕੋ ਭੁਜਾ 'ਤੇ ਹਨ।`;
  if (clue.kind === "OCCUPANCY_CLASS") return clue.occupancyKind === "SINGLE"
    ? `${clue.person} ਉਸ ਭੁਜਾ 'ਤੇ ਹੈ ਜਿੱਥੇ ਕੇਵਲ ਇੱਕ ਵਿਅਕਤੀ ਹੈ।`
    : `${clue.person} ਉਸ ਭੁਜਾ 'ਤੇ ਹੈ ਜਿੱਥੇ ਦੋ ਵਿਅਕਤੀ ਹਨ।`;
  return `${clue.subject}, ${clue.reference} ਤੋਂ ਪਰਿਮਾਪ ਦੇ ਨਾਲ ${paDirection(clue.direction)} ${clue.metres} ਮੀਟਰ ਦੀ ਦੂਰੀ 'ਤੇ ਹੈ।`;
}

function hiQuestion(query: Sea002Cp008NormalizedQuery): string {
  if (query.kind === "OPPOSITE") return `${query.reference} के ठीक सामने कौन है?`;
  if (query.kind === "RELATIVE_METRIC") return `${query.reference} से परिमाप के साथ ${hiDirection(query.direction!)} ${query.metres} मीटर की दूरी पर कौन है?`;
  return `${query.reference} के ${hiDirection(query.direction!)} ${hiOrdinal(query.steps!)} कौन है?`;
}

function paQuestion(query: Sea002Cp008NormalizedQuery): string {
  if (query.kind === "OPPOSITE") return `${query.reference} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਕੌਣ ਹੈ?`;
  if (query.kind === "RELATIVE_METRIC") return `${query.reference} ਤੋਂ ਪਰਿਮਾਪ ਦੇ ਨਾਲ ${paDirection(query.direction!)} ${query.metres} ਮੀਟਰ ਦੀ ਦੂਰੀ 'ਤੇ ਕੌਣ ਹੈ?`;
  return `${query.reference} ਦੇ ${paDirection(query.direction!)} ${paOrdinal(query.steps!)} ਕੌਣ ਹੈ?`;
}

function hiRelation(query: Sea002Cp008NormalizedQuery): string {
  if (query.kind === "OPPOSITE") return `${query.reference} के ठीक सामने`;
  if (query.kind === "RELATIVE_METRIC") return `${query.reference} से ${hiDirection(query.direction!)} ${query.metres} मीटर की दूरी पर`;
  return `${query.reference} के ${hiDirection(query.direction!)} ${hiOrdinal(query.steps!)}`;
}

function paRelation(query: Sea002Cp008NormalizedQuery): string {
  if (query.kind === "OPPOSITE") return `${query.reference} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ`;
  if (query.kind === "RELATIVE_METRIC") return `${query.reference} ਤੋਂ ${paDirection(query.direction!)} ${query.metres} ਮੀਟਰ ਦੀ ਦੂਰੀ 'ਤੇ`;
  return `${query.reference} ਦੇ ${paDirection(query.direction!)} ${paOrdinal(query.steps!)}`;
}

function localizedExplanation(candidate: Sea002Cp008ReviewCandidate, locale: Sea002Cp008Locale): string {
  const ordered = [...candidate.participants].sort((a, b) => a.seatIndex - b.seatIndex);
  const mixed = new Set(ordered.map((participant) => participant.facing)).size > 1;
  if (locale === "hi") {
    const order = ordered.map((participant) => mixed ? `${participant.id} (${participant.facing === "IN" ? "अंदर" : "बाहर"})` : participant.id).join(" → ");
    const setup = candidate.topology === "ALT12_METRIC"
      ? "5 मीटर की प्रत्येक दूरी को एक स्थान मानकर, संदर्भ व्यक्ति की दिशा के अनुसार बाएँ-दाएँ संबंध लगाएँ।"
      : candidate.topology === "VARIABLE_SIDE6"
        ? "पहले 1-2-1-2 भुजा-वितरण तय करें, फिर समान भुजा और सामने वाले संबंध लगाएँ।"
        : mixed
          ? "पहले स्थान तय करें और मुख-दिशा के संबंधों से अंदर-बाहर की दिशा निकालें; उसके बाद बाएँ-दाएँ संबंध लगाएँ।"
          : "पहले वर्गाकार व्यवस्था में स्थान तय करें और दिए गए मुख-दिशा नियम के अनुसार बाएँ-दाएँ संबंध लगाएँ।";
    return `${setup} एक सही घड़ी-दिशा क्रम है: ${order}। इस व्यवस्था में ${candidate.answer}, ${hiRelation(candidate.query)} है। इसलिए उत्तर ${candidate.answer} है।`;
  }
  const order = ordered.map((participant) => mixed ? `${participant.id} (${participant.facing === "IN" ? "ਅੰਦਰ" : "ਬਾਹਰ"})` : participant.id).join(" → ");
  const setup = candidate.topology === "ALT12_METRIC"
    ? "ਹਰ 5 ਮੀਟਰ ਦੂਰੀ ਨੂੰ ਇੱਕ ਸਥਾਨ ਮੰਨ ਕੇ, ਹਵਾਲਾ ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਖੱਬੇ-ਸੱਜੇ ਸੰਬੰਧ ਲਗਾਓ।"
    : candidate.topology === "VARIABLE_SIDE6"
      ? "ਪਹਿਲਾਂ 1-2-1-2 ਭੁਜਾ-ਵੰਡ ਨਿਰਧਾਰਤ ਕਰੋ, ਫਿਰ ਇੱਕੋ ਭੁਜਾ ਅਤੇ ਸਾਹਮਣੇ ਵਾਲੇ ਸੰਬੰਧ ਲਗਾਓ।"
      : mixed
        ? "ਪਹਿਲਾਂ ਸਥਾਨ ਨਿਰਧਾਰਤ ਕਰੋ ਅਤੇ ਮੂੰਹ ਦੀਆਂ ਦਿਸ਼ਾਵਾਂ ਦੇ ਸੰਬੰਧਾਂ ਤੋਂ ਅੰਦਰ-ਬਾਹਰ ਦੀ ਦਿਸ਼ਾ ਕੱਢੋ; ਫਿਰ ਖੱਬੇ-ਸੱਜੇ ਸੰਬੰਧ ਲਗਾਓ।"
        : "ਪਹਿਲਾਂ ਵਰਗਾਕਾਰ ਵਿਵਸਥਾ ਵਿੱਚ ਸਥਾਨ ਨਿਰਧਾਰਤ ਕਰੋ ਅਤੇ ਦਿੱਤੇ ਮੂੰਹ-ਦਿਸ਼ਾ ਨਿਯਮ ਅਨੁਸਾਰ ਖੱਬੇ-ਸੱਜੇ ਸੰਬੰਧ ਲਗਾਓ।";
  return `${setup} ਇੱਕ ਸਹੀ ਘੜੀਵਾਰ ਕ੍ਰਮ ਹੈ: ${order}। ਇਸ ਵਿਵਸਥਾ ਵਿੱਚ ${candidate.answer}, ${paRelation(candidate.query)} ਹੈ। ਇਸ ਲਈ ਉੱਤਰ ${candidate.answer} ਹੈ।`;
}

export function localizeSea002Cp008ReviewCandidate(
  candidate: Sea002Cp008ReviewCandidate,
  locale: Sea002Cp008Locale,
): Sea002Cp008LocalizedReviewCandidate {
  const intro = locale === "hi" ? hiIntro(candidate.topology, candidate.facingMode) : paIntro(candidate.topology, candidate.facingMode);
  const clueText = candidate.clues.map((clue) => locale === "hi" ? hiClue(clue) : paClue(clue)).join(" ");
  const stem = `${intro} ${clueText}`;
  const question = locale === "hi" ? hiQuestion(candidate.query) : paQuestion(candidate.query);
  const explanation = localizedExplanation(candidate, locale);
  const localizedFingerprint = createHash("sha256").update(JSON.stringify({ locale, source: candidate.fingerprint, stem, question, explanation })).digest("hex");
  return Object.freeze({
    locale,
    permanentQlId: candidate.permanentQlId,
    authorityKey: candidate.authorityKey,
    signatureId: candidate.signatureId,
    variantIndex: candidate.variantIndex,
    difficulty: candidate.difficulty,
    examLineage: candidate.examLineage,
    stem,
    question,
    options: candidate.options,
    correctOptionIndex: candidate.correctOptionIndex,
    answer: candidate.answer,
    explanation,
    sourceEnglishFingerprint: candidate.fingerprint,
    localizedFingerprint,
    reviewStatus: "V1_REVIEW_READY_HUMAN_APPROVAL_PENDING" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    publiclyPublishable: false as const,
  });
}

export const SEA002_CP008_LOCALIZED_REVIEW_SET_V1: readonly Sea002Cp008LocalizedReviewCandidate[] = Object.freeze(
  SEA002_CP008_ENGLISH_REVIEW_SET_V1.flatMap((candidate) => [
    localizeSea002Cp008ReviewCandidate(candidate, "hi"),
    localizeSea002Cp008ReviewCandidate(candidate, "pa"),
  ]),
);
