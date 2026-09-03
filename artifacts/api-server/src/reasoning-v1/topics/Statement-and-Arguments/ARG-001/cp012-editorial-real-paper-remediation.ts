import { createHash } from "node:crypto";

import {
  ARG_CP007_EXAM_PROFILES,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
} from "./cp007-exam-profile-generator-v2.ts";
import {
  ARG_CP010_AUTHORITY,
  generateArgCp010RealPaperQuestion,
} from "./cp010-correlated-real-paper-generator.ts";
import type { ArgDifficulty, ArgLocale, ArgQlId, ArgStrength } from "./types.ts";

export const ARG_CP012_CHECKPOINT_ID = "ARG-CP-012" as const;
export const ARG_CP012_AUTHORITY = "ARG_CP012_EDITORIAL_REAL_PAPER_REMEDIATION_V1" as const;

const ROMAN = ["I", "II", "III", "IV"] as const;

type LocalizedText = Readonly<Record<ArgLocale, string>>;
type SupplementalArgument = Readonly<{
  text: LocalizedText;
  reason: LocalizedText;
  strength: ArgStrength;
}>;

function localized(en: string, hi: string, pa: string): LocalizedText {
  return Object.freeze({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
}

const SUPPLEMENTAL_ARGUMENTS: Readonly<Record<ArgQlId, Readonly<{ strong: SupplementalArgument; weak: SupplementalArgument }>>> = Object.freeze({
  "ARG-QL-001": Object.freeze({
    strong: Object.freeze({
      strength: "STRONG",
      text: localized(
        "Yes. Relevant post-process information or a clear contact route makes it easier for affected users to verify an outcome or seek clarification.",
        "हाँ। प्रक्रिया के बाद प्रासंगिक जानकारी या स्पष्ट संपर्क माध्यम प्रभावित लोगों को परिणाम की जाँच करने या स्पष्टीकरण मांगने में मदद करता है।",
        "ਹਾਂ। ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਜਾਂ ਸਪੱਸ਼ਟ ਸੰਪਰਕ ਮਾਧਿਅਮ ਪ੍ਰਭਾਵਿਤ ਲੋਕਾਂ ਨੂੰ ਨਤੀਜਾ ਜਾਂਚਣ ਜਾਂ ਸਪੱਸ਼ਟੀਕਰਨ ਮੰਗਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
      ),
      reason: localized(
        "It gives a direct post-process transparency or clarification benefit.",
        "यह प्रक्रिया के बाद पारदर्शिता या स्पष्टीकरण से जुड़ा सीधा लाभ बताता है।",
        "ਇਹ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਪਾਰਦਰਸ਼ਤਾ ਜਾਂ ਸਪੱਸ਼ਟੀਕਰਨ ਨਾਲ ਜੁੜਿਆ ਸਿੱਧਾ ਲਾਭ ਦੱਸਦਾ ਹੈ।",
      ),
    }),
    weak: Object.freeze({
      strength: "WEAK",
      text: localized(
        "No. Once a process is complete, anything displayed afterwards is automatically useless.",
        "नहीं। प्रक्रिया पूरी होते ही उसके बाद दिखाई जाने वाली हर जानकारी अपने-आप बेकार हो जाती है।",
        "ਨਹੀਂ। ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਨਾਲ ਉਸ ਤੋਂ ਬਾਅਦ ਦਿਖਾਈ ਜਾਣ ਵਾਲੀ ਹਰ ਜਾਣਕਾਰੀ ਆਪਣੇ ਆਪ ਬੇਕਾਰ ਹੋ ਜਾਂਦੀ ਹੈ।",
      ),
      reason: localized(
        "Completion of a process does not make relevant post-process information useless.",
        "प्रक्रिया पूरी होना बाद की प्रासंगिक जानकारी को बेकार सिद्ध नहीं करता।",
        "ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣਾ ਬਾਅਦ ਦੀ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਨੂੰ ਬੇਕਾਰ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
      ),
    }),
  }),
  "ARG-QL-002": Object.freeze({
    strong: Object.freeze({
      strength: "STRONG",
      text: localized(
        "No. Independent verification should include a secure recovery route, otherwise a genuine user who loses access to the old factor may be locked out.",
        "नहीं। स्वतंत्र सत्यापन के साथ सुरक्षित रिकवरी विकल्प भी होना चाहिए, वरना पुराने सत्यापन माध्यम तक पहुँच खोने वाला वास्तविक उपयोगकर्ता फँस सकता है।",
        "ਨਹੀਂ। ਸੁਤੰਤਰ ਤਸਦੀਕ ਨਾਲ ਸੁਰੱਖਿਅਤ ਰਿਕਵਰੀ ਵਿਕਲਪ ਵੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਨਹੀਂ ਤਾਂ ਪੁਰਾਣੇ ਤਸਦੀਕੀ ਮਾਧਿਅਮ ਤੱਕ ਪਹੁੰਚ ਗੁਆਉਣ ਵਾਲਾ ਅਸਲੀ ਵਰਤੋਂਕਾਰ ਫਸ ਸਕਦਾ ਹੈ।",
      ),
      reason: localized(
        "It raises a material recovery and legitimate-access condition.",
        "यह रिकवरी और वास्तविक उपयोगकर्ता की पहुँच से जुड़ी महत्वपूर्ण शर्त उठाता है।",
        "ਇਹ ਰਿਕਵਰੀ ਅਤੇ ਅਸਲੀ ਵਰਤੋਂਕਾਰ ਦੀ ਪਹੁੰਚ ਨਾਲ ਜੁੜੀ ਮਹੱਤਵਪੂਰਨ ਸ਼ਰਤ ਉਠਾਉਂਦਾ ਹੈ।",
      ),
    }),
    weak: Object.freeze({
      strength: "WEAK",
      text: localized(
        "Yes. Any second verification step makes every future fraud attempt impossible.",
        "हाँ। कोई भी दूसरा सत्यापन कदम भविष्य की हर धोखाधड़ी को असंभव बना देता है।",
        "ਹਾਂ। ਕੋਈ ਵੀ ਦੂਜਾ ਤਸਦੀਕੀ ਕਦਮ ਭਵਿੱਖ ਦੀ ਹਰ ਧੋਖਾਧੜੀ ਨੂੰ ਅਸੰਭਵ ਬਣਾ ਦਿੰਦਾ ਹੈ।",
      ),
      reason: localized(
        "A second factor can reduce risk but cannot guarantee that all fraud becomes impossible.",
        "दूसरा सत्यापन जोखिम घटा सकता है, लेकिन हर धोखाधड़ी को असंभव होने की गारंटी नहीं देता।",
        "ਦੂਜੀ ਤਸਦੀਕ ਜੋਖਮ ਘਟਾ ਸਕਦੀ ਹੈ, ਪਰ ਹਰ ਧੋਖਾਧੜੀ ਨੂੰ ਅਸੰਭਵ ਹੋਣ ਦੀ ਗਾਰੰਟੀ ਨਹੀਂ ਦਿੰਦੀ।",
      ),
    }),
  }),
  "ARG-QL-003": Object.freeze({
    strong: Object.freeze({
      strength: "STRONG",
      text: localized(
        "Yes. Where service duration is reasonably predictable, scheduled slots can also help staff plan counter capacity across the day.",
        "हाँ। जहाँ सेवा में लगने वाला समय काफी हद तक अनुमानित हो, वहाँ निर्धारित स्लॉट कर्मचारियों को दिन भर काउंटर क्षमता की योजना बनाने में भी मदद कर सकते हैं।",
        "ਹਾਂ। ਜਿੱਥੇ ਸੇਵਾ ਲਈ ਲੱਗਣ ਵਾਲਾ ਸਮਾਂ ਕਾਫ਼ੀ ਹੱਦ ਤੱਕ ਅੰਦਾਜ਼ੇਯੋਗ ਹੋਵੇ, ਉੱਥੇ ਨਿਰਧਾਰਤ ਸਲਾਟ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਦਿਨ ਭਰ ਕਾਊਂਟਰ ਸਮਰੱਥਾ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਵਿੱਚ ਵੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹਨ।",
      ),
      reason: localized(
        "It gives a practical capacity-planning mechanism.",
        "यह व्यावहारिक क्षमता-योजना का कारण बताता है।",
        "ਇਹ ਵਿਆਵਹਾਰਿਕ ਸਮਰੱਥਾ-ਯੋਜਨਾ ਦਾ ਕਾਰਨ ਦੱਸਦਾ ਹੈ।",
      ),
    }),
    weak: Object.freeze({
      strength: "WEAK",
      text: localized(
        "No. A time-slot system always makes public services inaccessible to everyone.",
        "नहीं। समय-स्लॉट व्यवस्था हमेशा सार्वजनिक सेवाओं को हर व्यक्ति के लिए अनुपलब्ध बना देती है।",
        "ਨਹੀਂ। ਸਮਾਂ-ਸਲਾਟ ਪ੍ਰਣਾਲੀ ਹਮੇਸ਼ਾਂ ਸਰਕਾਰੀ ਸੇਵਾਵਾਂ ਨੂੰ ਹਰ ਵਿਅਕਤੀ ਲਈ ਅਣਪਹੁੰਚ ਬਣਾ ਦਿੰਦੀ ਹੈ।",
      ),
      reason: localized(
        "The universal access-failure claim is unsupported.",
        "सभी के लिए पहुँच समाप्त होने का सार्वभौमिक दावा असमर्थित है।",
        "ਹਰ ਕਿਸੇ ਲਈ ਪਹੁੰਚ ਖਤਮ ਹੋਣ ਦਾ ਸਰਬਭੌਮ ਦਾਅਵਾ ਬਿਨਾਂ ਆਧਾਰ ਹੈ।",
      ),
    }),
  }),
  "ARG-QL-004": Object.freeze({
    strong: Object.freeze({
      strength: "STRONG",
      text: localized(
        "Yes. During a defined peak, limiting heavy vehicles can reduce turning and pedestrian conflict on a busy approach road.",
        "हाँ। तय व्यस्त समय में भारी वाहनों को सीमित करने से व्यस्त पहुँच मार्ग पर मोड़ संबंधी और पैदल यात्री टकराव कम हो सकते हैं।",
        "ਹਾਂ। ਨਿਰਧਾਰਤ ਭੀੜ ਸਮੇਂ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਸੀਮਿਤ ਕਰਨ ਨਾਲ ਰੁਝੇ ਹੋਏ ਪਹੁੰਚ ਰਸਤੇ ਉੱਤੇ ਮੋੜ ਅਤੇ ਪੈਦਲ ਯਾਤਰੀ ਟਕਰਾਅ ਘਟ ਸਕਦੇ ਹਨ।",
      ),
      reason: localized(
        "It identifies a direct peak-period safety mechanism.",
        "यह व्यस्त समय से जुड़ा सीधा सुरक्षा कारण बताता है।",
        "ਇਹ ਭੀੜ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਸਿੱਧਾ ਸੁਰੱਖਿਆ ਕਾਰਨ ਦੱਸਦਾ ਹੈ।",
      ),
    }),
    weak: Object.freeze({
      strength: "WEAK",
      text: localized(
        "No. Any temporary restriction on heavy vehicles inevitably shuts every nearby business permanently.",
        "नहीं। भारी वाहनों पर कोई भी अस्थायी प्रतिबंध आसपास के हर व्यवसाय को स्थायी रूप से बंद कर देता है।",
        "ਨਹੀਂ। ਭਾਰੀ ਵਾਹਨਾਂ ਉੱਤੇ ਕੋਈ ਵੀ ਅਸਥਾਈ ਪਾਬੰਦੀ ਨੇੜਲੇ ਹਰ ਕਾਰੋਬਾਰ ਨੂੰ ਸਦਾ ਲਈ ਬੰਦ ਕਰ ਦਿੰਦੀ ਹੈ।",
      ),
      reason: localized(
        "It turns a limited traffic measure into an unsupported permanent outcome.",
        "यह सीमित यातायात उपाय को बिना आधार स्थायी परिणाम में बदल देता है।",
        "ਇਹ ਸੀਮਿਤ ਆਵਾਜਾਈ ਕਦਮ ਨੂੰ ਬਿਨਾਂ ਆਧਾਰ ਸਥਾਈ ਨਤੀਜੇ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ।",
      ),
    }),
  }),
  "ARG-QL-005": Object.freeze({
    strong: Object.freeze({
      strength: "STRONG",
      text: localized(
        "Yes. Advance notice also lets employees understand how monitoring data may be used in workplace decisions.",
        "हाँ। पहले से सूचना मिलने पर कर्मचारी यह भी समझ सकते हैं कि निगरानी से जुटाए गए डेटा का कार्यस्थल के निर्णयों में कैसे उपयोग हो सकता है।",
        "ਹਾਂ। ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਮਿਲਣ ਨਾਲ ਕਰਮਚਾਰੀ ਇਹ ਵੀ ਸਮਝ ਸਕਦੇ ਹਨ ਕਿ ਨਿਗਰਾਨੀ ਰਾਹੀਂ ਇਕੱਠੇ ਕੀਤੇ ਡਾਟੇ ਦੀ ਕੰਮਕਾਜੀ ਫੈਸਲਿਆਂ ਵਿੱਚ ਕਿਵੇਂ ਵਰਤੋਂ ਹੋ ਸਕਦੀ ਹੈ।",
      ),
      reason: localized(
        "It gives a direct informed-notice and workplace-governance benefit.",
        "यह पूर्व सूचना और कार्यस्थल डेटा-प्रबंधन से जुड़ा सीधा लाभ बताता है।",
        "ਇਹ ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਅਤੇ ਕੰਮਕਾਜੀ ਡਾਟਾ-ਪ੍ਰਬੰਧਨ ਨਾਲ ਜੁੜਿਆ ਸਿੱਧਾ ਲਾਭ ਦੱਸਦਾ ਹੈ।",
      ),
    }),
    weak: Object.freeze({
      strength: "WEAK",
      text: localized(
        "No. Employees who value privacy cannot be trusted at work.",
        "नहीं। जो कर्मचारी अपनी गोपनीयता को महत्व देते हैं, उन पर काम में भरोसा नहीं किया जा सकता।",
        "ਨਹੀਂ। ਜੋ ਕਰਮਚਾਰੀ ਆਪਣੀ ਪਰਦੇਦਾਰੀ ਨੂੰ ਮਹੱਤਵ ਦਿੰਦੇ ਹਨ, ਉਨ੍ਹਾਂ ਉੱਤੇ ਕੰਮ ਵਿੱਚ ਭਰੋਸਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।",
      ),
      reason: localized(
        "It stereotypes employees instead of addressing whether the monitoring is justified.",
        "यह निगरानी की उचितता पर विचार करने के बजाय कर्मचारियों के बारे में रूढ़ धारणा बनाता है।",
        "ਇਹ ਨਿਗਰਾਨੀ ਦੀ ਵਾਜਬਤਾ ਬਾਰੇ ਵਿਚਾਰ ਕਰਨ ਦੀ ਬਜਾਏ ਕਰਮਚਾਰੀਆਂ ਬਾਰੇ ਰੂੜ੍ਹੀਵਾਦੀ ਧਾਰਨਾ ਬਣਾਉਂਦਾ ਹੈ।",
      ),
    }),
  }),
  "ARG-QL-006": Object.freeze({
    strong: Object.freeze({
      strength: "STRONG",
      text: localized(
        "No. A reversible interim restriction can address immediate risk while the evidence is checked.",
        "नहीं। साक्ष्य की जाँच के दौरान वापस लिया जा सकने वाला अस्थायी प्रतिबंध तत्काल जोखिम को संभाल सकता है।",
        "ਨਹੀਂ। ਸਬੂਤ ਦੀ ਜਾਂਚ ਦੌਰਾਨ ਵਾਪਸ ਲਿਆ ਜਾ ਸਕਣ ਵਾਲਾ ਅਸਥਾਈ ਰੋਕ ਤੁਰੰਤ ਜੋਖਮ ਨੂੰ ਸੰਭਾਲ ਸਕਦਾ ਹੈ।",
      ),
      reason: localized(
        "It offers a proportionate reversible response while facts are verified.",
        "यह तथ्यों की जाँच तक अनुपातिक और वापस लिया जा सकने वाला उपाय देता है।",
        "ਇਹ ਤੱਥਾਂ ਦੀ ਜਾਂਚ ਤੱਕ ਅਨੁਪਾਤਿਕ ਅਤੇ ਵਾਪਸ ਲਿਆ ਜਾ ਸਕਣ ਵਾਲਾ ਕਦਮ ਦਿੰਦਾ ਹੈ।",
      ),
    }),
    weak: Object.freeze({
      strength: "WEAK",
      text: localized(
        "Yes. A single complaint or automated flag always proves the most serious misconduct.",
        "हाँ। एक शिकायत या स्वचालित संकेत हमेशा सबसे गंभीर कदाचार को सिद्ध कर देता है।",
        "ਹਾਂ। ਇੱਕ ਸ਼ਿਕਾਇਤ ਜਾਂ ਆਟੋਮੈਟਿਕ ਸੰਕੇਤ ਹਮੇਸ਼ਾਂ ਸਭ ਤੋਂ ਗੰਭੀਰ ਗਲਤ ਵਿਹਾਰ ਨੂੰ ਸਾਬਤ ਕਰ ਦਿੰਦਾ ਹੈ।",
      ),
      reason: localized(
        "A complaint or risk flag is not automatic proof of the most serious wrongdoing.",
        "शिकायत या जोखिम संकेत सबसे गंभीर गलती का अपने-आप प्रमाण नहीं है।",
        "ਸ਼ਿਕਾਇਤ ਜਾਂ ਜੋਖਮ ਸੰਕੇਤ ਸਭ ਤੋਂ ਗੰਭੀਰ ਗਲਤ ਕੰਮ ਦਾ ਆਪਣੇ ਆਪ ਸਬੂਤ ਨਹੀਂ ਹੁੰਦਾ।",
      ),
    }),
  }),
});

function normalizeLocale(value: ArgLocale | string): ArgLocale {
  if (value === "hi" || value === "hi-IN") return "hi-IN";
  if (value === "pa" || value === "pb" || value === "pa-IN") return "pa-IN";
  return "en-IN";
}

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

function stableHash(text: string): number {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value >>> 0;
}

function hash(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function displayDifficulty(value: ArgCp007Difficulty): ArgDifficulty {
  if (value === "Easy") return "EASY";
  if (value === "Medium") return "MEDIUM";
  return "HARD";
}

function subsetKey(indices: readonly number[]): string {
  return [...indices].sort((a, b) => a - b).join(",");
}

function subsetLabel(locale: ArgLocale, indices: readonly number[], count: number): string {
  if (indices.length === 0) {
    if (locale === "hi-IN") return "कोई भी तर्क मजबूत नहीं है";
    if (locale === "pa-IN") return "ਕੋਈ ਵੀ ਦਲੀਲ ਮਜ਼ਬੂਤ ਨਹੀਂ ਹੈ";
    return "None of the arguments is strong";
  }
  if (indices.length === count) {
    if (locale === "hi-IN") return "सभी तर्क मजबूत हैं";
    if (locale === "pa-IN") return "ਸਾਰੀਆਂ ਦਲੀਲਾਂ ਮਜ਼ਬੂਤ ਹਨ";
    return "All arguments are strong";
  }
  const labels = indices.map((index) => ROMAN[index]!);
  const joiner = locale === "hi-IN" ? " और " : locale === "pa-IN" ? " ਅਤੇ " : " and ";
  const names = labels.join(joiner);
  if (locale === "hi-IN") return `केवल तर्क ${names} मजबूत ${labels.length === 1 ? "है" : "हैं"}`;
  if (locale === "pa-IN") return `ਕੇਵਲ ਦਲੀਲ ${names} ਮਜ਼ਬੂਤ ${labels.length === 1 ? "ਹੈ" : "ਹਨ"}`;
  return `Only argument${labels.length === 1 ? "" : "s"} ${names} ${labels.length === 1 ? "is" : "are"} strong`;
}

function combinationOptions(locale: ArgLocale, strengths: readonly ArgStrength[], seed: number) {
  const count = strengths.length;
  const correct = strengths.flatMap((strength, index) => strength === "STRONG" ? [index] : []);
  const correctKey = subsetKey(correct);
  const subsets = Array.from({ length: 1 << count }, (_, mask) =>
    Array.from({ length: count }, (_, index) => index).filter((index) => Boolean(mask & (1 << index))),
  ).filter((indices) => subsetKey(indices) !== correctKey);
  const choices: number[][] = [correct];
  const offset = positiveModulo(seed * 7 + count * 11, subsets.length);
  for (let step = 0; choices.length < 5 && step < subsets.length * 2; step += 1) {
    const next = subsets[(offset + step * 3) % subsets.length]!;
    if (!choices.some((entry) => subsetKey(entry) === subsetKey(next))) choices.push(next);
  }
  if (choices.length !== 5) throw new Error("ARG-001 CP012 could not construct five unique combination options");
  const rotation = positiveModulo(Math.floor(seed / 3), 5);
  const ordered = [...choices.slice(rotation), ...choices.slice(0, rotation)];
  const options = Object.freeze(ordered.map((indices) => subsetLabel(locale, indices, count)));
  const correctIndex = ordered.findIndex((indices) => subsetKey(indices) === correctKey);
  if (correctIndex < 0 || new Set(options).size !== 5) throw new Error("ARG-001 CP012 option integrity failure");
  return Object.freeze({ options, correctIndex, strongIndices: Object.freeze(correct) });
}

function explanationPrefixes(locale: ArgLocale, count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => {
    const label = ROMAN[index]!;
    if (locale === "hi-IN") return `तर्क ${label} `;
    if (locale === "pa-IN") return `ਦਲੀਲ ${label} `;
    return `Argument ${label} `;
  });
}

function extractReasons(explanation: string, locale: ArgLocale, count: number): string[] {
  const prefixes = explanationPrefixes(locale, count);
  return prefixes.map((prefix, index) => {
    const start = explanation.indexOf(prefix);
    if (start < 0) throw new Error(`ARG-001 CP012 could not locate explanation prefix ${prefix}`);
    const colon = explanation.indexOf(": ", start);
    if (colon < 0) throw new Error(`ARG-001 CP012 could not locate explanation separator after ${prefix}`);
    const nextPrefix = prefixes[index + 1];
    const end = nextPrefix ? explanation.indexOf(nextPrefix, colon + 2) : explanation.length;
    return explanation.slice(colon + 2, end < 0 ? explanation.length : end).trim();
  });
}

function naturalizeReason(reason: string, locale: ArgLocale): string {
  if (locale === "hi-IN") {
    return reason
      .replaceAll("यह सीधा गोपनीयता और सूचित-नोटिस हित बताता है।", "यह गोपनीयता और पहले से जानकारी दिए जाने से जुड़ा सीधा और महत्वपूर्ण कारण है।")
      .replaceAll("यह वैध अनुपातिकता सुरक्षा उठाता है।", "यह निगरानी की आवश्यकता और सीमा से जुड़ी उचित चिंता उठाता है।");
  }
  if (locale === "pa-IN") {
    return reason
      .replaceAll("ਇਹ ਸਿੱਧਾ ਪਰਦੇਦਾਰੀ ਅਤੇ ਜਾਣਕਾਰੀ-ਨੋਟਿਸ ਹਿੱਤ ਦੱਸਦਾ ਹੈ।", "ਇਹ ਪਰਦੇਦਾਰੀ ਅਤੇ ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਦਿੱਤੇ ਜਾਣ ਨਾਲ ਜੁੜਿਆ ਸਿੱਧਾ ਅਤੇ ਮਹੱਤਵਪੂਰਨ ਕਾਰਨ ਹੈ।")
      .replaceAll("ਇਹ ਵਾਜਬ ਅਨੁਪਾਤਿਕਤਾ ਸੁਰੱਖਿਆ ਦਾ ਮੁੱਦਾ ਉਠਾਉਂਦਾ ਹੈ।", "ਇਹ ਨਿਗਰਾਨੀ ਦੀ ਲੋੜ ਅਤੇ ਹੱਦ ਨਾਲ ਜੁੜੀ ਵਾਜਬ ਚਿੰਤਾ ਉਠਾਉਂਦਾ ਹੈ।");
  }
  return reason;
}

function formatExplanation(locale: ArgLocale, strengths: readonly ArgStrength[], reasons: readonly string[]): string {
  return strengths.map((strength, index) => {
    const label = ROMAN[index]!;
    const reason = reasons[index]!;
    if (locale === "hi-IN") return `तर्क ${label} ${strength === "STRONG" ? "मजबूत" : "कमजोर"} है: ${reason}`;
    if (locale === "pa-IN") return `ਦਲੀਲ ${label} ${strength === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ"} ਹੈ: ${reason}`;
    return `Argument ${label} is ${strength.toLowerCase()}: ${reason}`;
  }).join(" ");
}

function patchCorrelatedEditorialCopy(input: {
  readonly qlId: ArgQlId;
  readonly locale: ArgLocale;
  readonly scenarioId: string;
  readonly arguments: readonly string[];
  readonly strengths: readonly ArgStrength[];
  readonly reasons: readonly string[];
}) {
  const argumentsList = [...input.arguments];
  const reasons = input.reasons.map((reason) => naturalizeReason(reason, input.locale));

  if (input.qlId === "ARG-QL-001" && input.scenarioId.includes("GRIEVANCE_CONTACT")) {
    const target = argumentsList.findIndex((argument) => {
      if (input.locale === "hi-IN") return argument.includes("निर्णय प्रक्रिया");
      if (input.locale === "pa-IN") return argument.includes("ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ");
      return argument.includes("understand the decision process");
    });
    if (target >= 0) {
      if (input.locale === "hi-IN") {
        argumentsList[target] = "हाँ। स्पष्ट शिकायत संपर्क उपयोगकर्ताओं को प्रक्रिया पूरी होने के बाद स्पष्टीकरण मांगने या संभावित त्रुटि की सूचना देने का सीधा माध्यम देता है।";
        reasons[target] = "यह प्रक्रिया के बाद शिकायत या स्पष्टीकरण के लिए सीधा और प्रासंगिक माध्यम देता है।";
      } else if (input.locale === "pa-IN") {
        argumentsList[target] = "ਹਾਂ। ਸਪੱਸ਼ਟ ਸ਼ਿਕਾਇਤ ਸੰਪਰਕ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਸਪੱਸ਼ਟੀਕਰਨ ਮੰਗਣ ਜਾਂ ਸੰਭਾਵਿਤ ਗਲਤੀ ਦੀ ਜਾਣਕਾਰੀ ਦੇਣ ਲਈ ਸਿੱਧਾ ਮਾਧਿਅਮ ਦਿੰਦਾ ਹੈ।";
        reasons[target] = "ਇਹ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਸ਼ਿਕਾਇਤ ਜਾਂ ਸਪੱਸ਼ਟੀਕਰਨ ਲਈ ਸਿੱਧਾ ਅਤੇ ਸੰਬੰਧਿਤ ਮਾਧਿਅਮ ਦਿੰਦਾ ਹੈ।";
      } else {
        argumentsList[target] = "Yes. A clear grievance contact gives users a direct route to seek clarification or report a possible error after the process is complete.";
        reasons[target] = "It gives a direct and relevant post-process grievance or clarification route.";
      }
    }
  }

  return Object.freeze({
    arguments: Object.freeze(argumentsList),
    strengths: Object.freeze([...input.strengths]),
    reasons: Object.freeze(reasons),
  });
}

function realPaperMetadata(source: ReturnType<typeof generateArgCp010RealPaperQuestion>, profile: ArgCp007ExamProfile, cardinalityMode: string) {
  return Object.freeze({
    ...source.metadata,
    authority: ARG_CP012_AUTHORITY,
    supersedesRealPaperAuthority: ARG_CP010_AUTHORITY,
    sourceRealPaperAuthority: source.authority,
    sourceRealPaperCheckpoint: source.checkpointId,
    editorialRealPaperRemediation: true as const,
    answerCardinalityAntiGaming: true as const,
    cardinalityMode,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockEligible: false as const,
    publicEligible: false as const,
    automaticStudentPublication: false as const,
    learnerRelease: "LOCKED" as const,
    requestedProfile: profile,
  });
}

export function generateArgCp012RealPaperQuestion(input: {
  readonly qlId: ArgQlId;
  readonly locale: ArgLocale | string;
  readonly seed: number;
  readonly profile: ArgCp007ExamProfile;
  readonly difficulty: ArgCp007Difficulty;
}) {
  const locale = normalizeLocale(input.locale);
  const profileMeta = ARG_CP007_EXAM_PROFILES[input.profile];
  if (!(profileMeta.supportedDifficulties as readonly string[]).includes(input.difficulty)) {
    throw new Error(`${input.profile} does not support ${input.difficulty}.`);
  }

  if (profileMeta.argumentCount <= 2) {
    const source = generateArgCp010RealPaperQuestion(input);
    const reasons = extractReasons(source.explanation, locale, source.arguments.length);
    const patched = patchCorrelatedEditorialCopy({
      qlId: input.qlId,
      locale,
      scenarioId: source.metadata.correlatedScenarioId,
      arguments: source.arguments,
      strengths: source.argumentStrengths,
      reasons,
    });
    const explanation = formatExplanation(locale, patched.strengths, patched.reasons);
    const contentFingerprint = hash([
      ARG_CP012_AUTHORITY,
      input.qlId,
      input.profile,
      input.difficulty,
      locale,
      input.seed,
      source.metadata.correlatedScenarioId,
      source.statement,
      patched.arguments,
      source.options,
      source.correctIndex,
    ]);
    return Object.freeze({
      ...source,
      checkpointId: ARG_CP012_CHECKPOINT_ID,
      authority: ARG_CP012_AUTHORITY,
      scenarioId: `${source.scenarioId}-CP012`,
      arguments: patched.arguments,
      argumentStrengths: patched.strengths,
      explanation,
      contentFingerprint,
      metadata: realPaperMetadata(source, input.profile, "TWO_ARGUMENT_EDITORIAL_ONLY"),
    });
  }

  const source = generateArgCp010RealPaperQuestion({
    qlId: input.qlId,
    locale,
    seed: input.seed,
    profile: "BANKING_COMBO_4X5",
    difficulty: "Hard",
  });
  const sourceReasons = extractReasons(source.explanation, locale, 4);
  const patched = patchCorrelatedEditorialCopy({
    qlId: input.qlId,
    locale,
    scenarioId: source.metadata.correlatedScenarioId,
    arguments: source.arguments,
    strengths: source.argumentStrengths,
    reasons: sourceReasons,
  });

  let argumentsList = [...patched.arguments];
  let strengths = [...patched.strengths];
  let reasons = [...patched.reasons];
  let cardinalityMode: string;

  if (input.profile === "BANKING_COMBO_3X5") {
    const omitIndex = positiveModulo(Math.floor(input.seed / 4) + (input.difficulty === "Hard" ? 1 : 0), 4);
    argumentsList = argumentsList.filter((_, index) => index !== omitIndex);
    strengths = strengths.filter((_, index) => index !== omitIndex);
    reasons = reasons.filter((_, index) => index !== omitIndex);
    cardinalityMode = `THREE_ARGUMENT_OMIT_${ROMAN[omitIndex]}`;
  } else {
    const mode = positiveModulo(Math.floor(input.seed / 4), 3);
    if (mode === 1) {
      const weakIndex = strengths.findIndex((strength) => strength === "WEAK");
      if (weakIndex < 0) throw new Error("ARG-001 CP012 expected a weak source argument for 3-strong remediation");
      const supplemental = SUPPLEMENTAL_ARGUMENTS[input.qlId].strong;
      argumentsList[weakIndex] = supplemental.text[locale];
      strengths[weakIndex] = supplemental.strength;
      reasons[weakIndex] = supplemental.reason[locale];
      cardinalityMode = "FOUR_ARGUMENT_THREE_STRONG";
    } else if (mode === 2) {
      const strongIndex = strengths.findIndex((strength) => strength === "STRONG");
      if (strongIndex < 0) throw new Error("ARG-001 CP012 expected a strong source argument for 1-strong remediation");
      const supplemental = SUPPLEMENTAL_ARGUMENTS[input.qlId].weak;
      argumentsList[strongIndex] = supplemental.text[locale];
      strengths[strongIndex] = supplemental.strength;
      reasons[strongIndex] = supplemental.reason[locale];
      cardinalityMode = "FOUR_ARGUMENT_ONE_STRONG";
    } else {
      cardinalityMode = "FOUR_ARGUMENT_TWO_STRONG";
    }
  }

  const combination = combinationOptions(locale, strengths, input.seed);
  const explanation = formatExplanation(locale, strengths, reasons);
  const contentFingerprint = hash([
    ARG_CP012_AUTHORITY,
    input.qlId,
    input.profile,
    input.difficulty,
    locale,
    input.seed,
    source.metadata.correlatedScenarioId,
    source.statement,
    argumentsList,
    strengths,
    combination.options,
    combination.correctIndex,
  ]);

  return Object.freeze({
    ...source,
    checkpointId: ARG_CP012_CHECKPOINT_ID,
    authority: ARG_CP012_AUTHORITY,
    scenarioId: `${source.templateId}-CP012-${source.metadata.correlatedScenarioId}-${input.profile}-${Math.floor(input.seed / 4)}`,
    profile: input.profile,
    profileLabel: profileMeta.label,
    difficulty: displayDifficulty(input.difficulty),
    difficultyLabel: input.difficulty,
    arguments: Object.freeze(argumentsList),
    argumentStrengths: Object.freeze(strengths),
    strongArgumentIndices: combination.strongIndices,
    options: combination.options,
    correctIndex: combination.correctIndex,
    answer: combination.options[combination.correctIndex]!,
    explanation,
    contentFingerprint,
    metadata: realPaperMetadata(source, input.profile, cardinalityMode),
  });
}

export function generateArgCp012RealPaperBatch(input: {
  readonly profile: ArgCp007ExamProfile;
  readonly qlId?: ArgQlId;
  readonly locale?: ArgLocale | string;
  readonly difficulty: ArgCp007Difficulty;
  readonly seed?: string;
  readonly count?: number;
}) {
  const profileMeta = ARG_CP007_EXAM_PROFILES[input.profile];
  if (!(profileMeta.supportedDifficulties as readonly string[]).includes(input.difficulty)) {
    throw new Error(`${input.profile} does not support ${input.difficulty}.`);
  }
  const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 1) || 1)));
  const seedText = String(input.seed ?? "ARG-CP012-DEFAULT");
  const qlIds = ["ARG-QL-001", "ARG-QL-002", "ARG-QL-003", "ARG-QL-004", "ARG-QL-005", "ARG-QL-006"] as const;
  const questions = Object.freeze(Array.from({ length: count }, (_, index) => {
    const qlId = input.qlId ?? qlIds[index % qlIds.length]!;
    const seed = stableHash(`${ARG_CP012_AUTHORITY}:${seedText}:${input.profile}:${input.difficulty}:${qlId}:${index}`) & 0x7fffffff;
    return generateArgCp012RealPaperQuestion({
      qlId,
      locale: input.locale ?? "en-IN",
      seed,
      profile: input.profile,
      difficulty: input.difficulty,
    });
  }));

  return Object.freeze({
    packageId: "ARG-001" as const,
    checkpointId: ARG_CP012_CHECKPOINT_ID,
    authority: ARG_CP012_AUTHORITY,
    profile: input.profile,
    difficulty: input.difficulty,
    questions,
    generationContext: Object.freeze({
      chapterId: "ARG-001" as const,
      checkpointId: ARG_CP012_CHECKPOINT_ID,
      authority: ARG_CP012_AUTHORITY,
      supersedesRealPaperAuthority: ARG_CP010_AUTHORITY,
      examProfile: input.profile,
      answerCardinalityAntiGaming: true as const,
      correlatedEditorialRemediation: true as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}
