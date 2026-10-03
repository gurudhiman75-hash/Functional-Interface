import { canonicalDigest } from "../../../SEA-001/canonical.ts";
import { localizedSea001Name } from "../../../SEA-001/localization/name-pack.ts";
import { SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL } from "../permanent/registry.ts";
import type { Sea002Cp006Caselet, Sea002Cp006ChildQuestion, Sea002Cp006Option } from "../types.ts";
import {
  SEA002_CP006_LOCALIZATION_AUTHORITY,
  SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER,
  cp006CanonicalParityFingerprint,
  type Sea002Cp006TranslatedLocale,
} from "./readiness.ts";

export interface Sea002Cp006LocalizedReviewOption {
  readonly displayValue: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: Sea002Cp006Option["misconceptionId"];
  readonly explanation: string;
}

export interface Sea002Cp006LocalizedReviewChild {
  readonly questionOrder: Sea002Cp006ChildQuestion["questionOrder"];
  readonly queryContractId: Sea002Cp006ChildQuestion["queryContractId"];
  readonly answerType: Sea002Cp006ChildQuestion["answerType"];
  readonly answerDeterminingFactFingerprint: string;
  readonly answerIndex: Sea002Cp006ChildQuestion["answerIndex"];
  readonly canonicalAnswer: string;
  readonly displayAnswer: string;
  readonly text: string;
  readonly options: readonly [Sea002Cp006LocalizedReviewOption, Sea002Cp006LocalizedReviewOption, Sea002Cp006LocalizedReviewOption, Sea002Cp006LocalizedReviewOption];
  readonly explanation: string;
}

export interface Sea002Cp006LocalizedReviewCaselet {
  readonly locale: Sea002Cp006TranslatedLocale;
  readonly canonicalLocale: "en-IN";
  readonly canonicalCaseletId: string;
  readonly checkpointId: "SEA-CP-006";
  readonly blueprintAuthorityId: Sea002Cp006Caselet["blueprintAuthorityId"];
  readonly permanentQlId: (typeof SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL)[Sea002Cp006Caselet["blueprintAuthorityId"]];
  readonly canonicalParityFingerprint: string;
  readonly canonicalContentFingerprint: string;
  readonly localizationAuthority: typeof SEA002_CP006_LOCALIZATION_AUTHORITY;
  readonly localizationStatus: "EXECUTABLE_EXPLANATION_PARITY_HUMAN_REVIEW_REQUIRED";
  readonly humanLanguageReviewRequired: true;
  readonly activeEditorialBlockers: readonly [typeof SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER];
  readonly productDeliveryUnlocked: false;
  readonly productionStagingApproved: false;
  readonly setupText: string;
  readonly clueTexts: readonly string[];
  readonly sharedExplanation: string;
  readonly teachingSkeleton: readonly string[];
  readonly diagramText: string;
  readonly children: readonly [Sea002Cp006LocalizedReviewChild, Sea002Cp006LocalizedReviewChild, Sea002Cp006LocalizedReviewChild, Sea002Cp006LocalizedReviewChild];
  readonly presentationFingerprint: string;
}

type Locale = Sea002Cp006TranslatedLocale;
type Match = RegExpMatchArray;
const personToken = "\\{P:([^}]+)\\}";

function rx(source: string): RegExp { return new RegExp(`^${source}$`, "u"); }
function esc(value: string): string { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function name(nameValue: string, locale: Locale): string { return localizedSea001Name(nameValue, locale); }
function isHi(locale: Locale): boolean { return locale === "hi-IN"; }

function markNames(text: string, people: readonly string[]): string {
  let output = text;
  for (const person of [...people].sort((a, b) => b.length - a.length)) {
    output = output.replace(new RegExp(`\\b${esc(person)}\\b`, "gu"), `{P:${person}}`);
  }
  return output;
}

function markedNames(fragment: string): string[] {
  return [...fragment.matchAll(/\{P:([^}]+)\}/gu)].map((match) => match[1]!);
}

function joinNames(values: readonly string[], locale: Locale): string {
  const localized = values.map((value) => name(value, locale));
  if (localized.length <= 1) return localized.join("");
  const conjunction = isHi(locale) ? " और " : " ਅਤੇ ";
  return `${localized.slice(0, -1).join(", ")}${conjunction}${localized.at(-1)}`;
}

function rowWord(row: string, locale: Locale): string {
  return row === "upper" ? (isHi(locale) ? "ऊपरी" : "ਉੱਪਰਲੀ") : (isHi(locale) ? "निचली" : "ਹੇਠਲੀ");
}
function facingWord(facing: string, locale: Locale): string {
  return facing === "north" ? (isHi(locale) ? "उत्तर" : "ਉੱਤਰ") : (isHi(locale) ? "दक्षिण" : "ਦੱਖਣ");
}
function sideWord(side: string, locale: Locale): string {
  return side === "left" ? (isHi(locale) ? "बाईं" : "ਖੱਬੇ") : (isHi(locale) ? "दाईं" : "ਸੱਜੇ");
}
function endWord(side: string, locale: Locale): string {
  return side === "left" ? (isHi(locale) ? "बायाँ" : "ਖੱਬਾ") : (isHi(locale) ? "दायाँ" : "ਸੱਜਾ");
}
function ordinalWord(value: string, locale: Locale): string {
  const hi: Readonly<Record<string, string>> = Object.freeze({ first: "पहले", second: "दूसरे", third: "तीसरे", fourth: "चौथे", fifth: "पाँचवें", "6th": "छठे" });
  const pa: Readonly<Record<string, string>> = Object.freeze({ first: "ਪਹਿਲੇ", second: "ਦੂਜੇ", third: "ਤੀਜੇ", fourth: "ਚੌਥੇ", fifth: "ਪੰਜਵੇਂ", "6th": "ਛੇਵੇਂ" });
  return (isHi(locale) ? hi : pa)[value] ?? value;
}
function relativePhrase(ordinal: string, side: string, locale: Locale): string {
  if (ordinal === "immediately" || ordinal === "immediate") return isHi(locale) ? `${sideWord(side, locale)} ओर ठीक अगले स्थान पर` : `${sideWord(side, locale)} ਪਾਸੇ ਬਿਲਕੁਲ ਅਗਲੇ ਸਥਾਨ ਤੇ`;
  return isHi(locale)
    ? `${sideWord(side, locale)} ओर ${ordinalWord(ordinal, locale)} स्थान पर`
    : `${sideWord(side, locale)} ਪਾਸੇ ${ordinalWord(ordinal, locale)} ਸਥਾਨ ਤੇ`;
}

function firstMatch<T>(source: string, patterns: readonly [RegExp, (match: Match) => T][], context: string): T {
  for (const [pattern, render] of patterns) {
    const match = source.match(pattern);
    if (match) return render(match);
  }
  throw new Error(`SEA-002 CP006 localization unsupported ${context}: ${source}`);
}

export function localizeCp006Setup(caselet: Sea002Cp006Caselet, locale: Locale): string {
  const people = joinNames(caselet.people, locale);
  const total = caselet.people.length;
  const width = caselet.state.seatCountPerRow;
  return isHi(locale)
    ? `${total} व्यक्ति, ${people}, दो समानांतर पंक्तियों में बैठे हैं, प्रत्येक पंक्ति में ${width} व्यक्ति हैं। ऊपरी पंक्ति के व्यक्ति दक्षिण की ओर और निचली पंक्ति के व्यक्ति उत्तर की ओर मुख किए हैं। एक पंक्ति का प्रत्येक व्यक्ति दूसरी पंक्ति के ठीक एक व्यक्ति के सामने बैठा है; जो व्यक्ति एक-दूसरे के सामने हैं, वे दोनों पंक्तियों में समान स्थान पर हैं।`
    : `${total} ਵਿਅਕਤੀ, ${people}, ਦੋ ਸਮਾਂਤਰ ਕਤਾਰਾਂ ਵਿੱਚ ਬੈਠੇ ਹਨ, ਹਰ ਕਤਾਰ ਵਿੱਚ ${width} ਵਿਅਕਤੀ ਹਨ। ਉੱਪਰਲੀ ਕਤਾਰ ਦੇ ਵਿਅਕਤੀ ਦੱਖਣ ਵੱਲ ਅਤੇ ਹੇਠਲੀ ਕਤਾਰ ਦੇ ਵਿਅਕਤੀ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ਇੱਕ ਕਤਾਰ ਦਾ ਹਰ ਵਿਅਕਤੀ ਦੂਜੀ ਕਤਾਰ ਦੇ ਠੀਕ ਇੱਕ ਵਿਅਕਤੀ ਦੇ ਸਾਹਮਣੇ ਬੈਠਾ ਹੈ; ਜੋ ਵਿਅਕਤੀ ਇੱਕ-ਦੂਜੇ ਦੇ ਸਾਹਮਣੇ ਹਨ, ਉਹ ਦੋਵੇਂ ਕਤਾਰਾਂ ਵਿੱਚ ਇੱਕੋ ਸਥਾਨ ਤੇ ਹਨ।`;
}

export function localizeCp006ClueText(text: string, people: readonly string[], locale: Locale): string {
  const source = markNames(text, people);
  const grouped = source.match(rx(`(.+?) sit in the upper row, while (.+?) sit in the lower row\\.`));
  if (grouped) {
    const upper = joinNames(markedNames(grouped[1]!), locale);
    const lower = joinNames(markedNames(grouped[2]!), locale);
    return isHi(locale) ? `${upper} ऊपरी पंक्ति में और ${lower} निचली पंक्ति में बैठे हैं।` : `${upper} ਉੱਪਰਲੀ ਕਤਾਰ ਵਿੱਚ ਅਤੇ ${lower} ਹੇਠਲੀ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ।`;
  }
  return firstMatch(source, [
    [rx(`${personToken} sits exactly opposite ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} का स्थान ${name(m[2]!, locale)} के ठीक सामने है।` : `${name(m[1]!, locale)} ਦਾ ਸਥਾਨ ${name(m[2]!, locale)} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹੈ।`],
    [rx(`${personToken} does not sit opposite ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} का स्थान ${name(m[2]!, locale)} के सामने नहीं है।` : `${name(m[1]!, locale)} ਦਾ ਸਥਾਨ ${name(m[2]!, locale)} ਦੇ ਸਾਹਮਣੇ ਨਹੀਂ ਹੈ।`],
    [rx(`${personToken} sits in the upper row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} ऊपरी पंक्ति में है।` : `${name(m[1]!, locale)} ਉੱਪਰਲੀ ਕਤਾਰ ਵਿੱਚ ਹੈ।`],
    [rx(`${personToken} sits in the lower row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} निचली पंक्ति में है।` : `${name(m[1]!, locale)} ਹੇਠਲੀ ਕਤਾਰ ਵਿੱਚ ਹੈ।`],
    [rx(`${personToken} sits (immediately|second|third|fourth|fifth) to the (left|right) of ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)}, ${name(m[4]!, locale)} से ${relativePhrase(m[2]!, m[3]!, locale)} है।` : `${name(m[1]!, locale)}, ${name(m[4]!, locale)} ਤੋਂ ${relativePhrase(m[2]!, m[3]!, locale)} ਹੈ।`],
    [rx(`${personToken} sits diagonally opposite ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} का स्थान ${name(m[2]!, locale)} के तिरछे सामने है।` : `${name(m[1]!, locale)} ਦਾ ਸਥਾਨ ${name(m[2]!, locale)} ਦੇ ਤਿਰਛੇ ਸਾਹਮਣੇ ਹੈ।`],
    [rx(`${personToken} sits at the (left|right) end of the (upper|lower) row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} का स्थान ${rowWord(m[3]!, locale)} पंक्ति के ${endWord(m[2]!, locale)} छोर पर है।` : `${name(m[1]!, locale)} ਦਾ ਸਥਾਨ ${rowWord(m[3]!, locale)} ਕਤਾਰ ਦੇ ${endWord(m[2]!, locale)} ਸਿਰੇ ਤੇ ਹੈ।`],
    [rx(`Exactly (\\d+) (?:person sits|persons sit) between ${personToken} and ${personToken} in the same row\\.`), (m) => isHi(locale) ? `${name(m[2]!, locale)} और ${name(m[3]!, locale)} के बीच उसी पंक्ति में ठीक ${m[1]} व्यक्ति बैठे हैं।` : `${name(m[2]!, locale)} ਅਤੇ ${name(m[3]!, locale)} ਦੇ ਵਿਚਕਾਰ ਉਸੇ ਕਤਾਰ ਵਿੱਚ ਠੀਕ ${m[1]} ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ।`],
    [rx(`At least (\\d+) persons sit between ${personToken} and ${personToken} in the same row\\.`), (m) => isHi(locale) ? `${name(m[2]!, locale)} और ${name(m[3]!, locale)} के बीच उसी पंक्ति में कम से कम ${m[1]} व्यक्ति बैठे हैं।` : `${name(m[2]!, locale)} ਅਤੇ ${name(m[3]!, locale)} ਦੇ ਵਿਚਕਾਰ ਉਸੇ ਕਤਾਰ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ${m[1]} ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ।`],
    [rx(`${personToken} and ${personToken} are immediate neighbours in the same row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} उसी पंक्ति में एक-दूसरे के ठीक पड़ोसी हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਉਸੇ ਕਤਾਰ ਵਿੱਚ ਇੱਕ-ਦੂਜੇ ਦੇ ਤੁਰੰਤ ਗੁਆਂਢੀ ਹਨ।`],
    [rx(`${personToken} and ${personToken} are not immediate neighbours\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} एक-दूसरे के ठीक पड़ोसी नहीं हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਇੱਕ-ਦੂਜੇ ਦੇ ਤੁਰੰਤ ਗੁਆਂਢੀ ਨਹੀਂ ਹਨ।`],
    [rx(`The number of persons sitting between ${personToken} and ${personToken} is the same as that between ${personToken} and ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} के बीच बैठे व्यक्तियों की संख्या, ${name(m[3]!, locale)} और ${name(m[4]!, locale)} के बीच बैठे व्यक्तियों की संख्या के समान है।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਦੇ ਵਿਚਕਾਰ ਬੈਠੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ, ${name(m[3]!, locale)} ਅਤੇ ${name(m[4]!, locale)} ਦੇ ਵਿਚਕਾਰ ਬੈਠੇ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ਦੇ ਬਰਾਬਰ ਹੈ।`],
    [rx(`${personToken} (does not sit|sits) second from either end of the row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} पंक्ति के किसी भी छोर से दूसरे स्थान पर ${m[2] === "does not sit" ? "नहीं " : ""}है।` : `${name(m[1]!, locale)} ਕਤਾਰ ਦੇ ਕਿਸੇ ਵੀ ਸਿਰੇ ਤੋਂ ਦੂਜੇ ਸਥਾਨ ਤੇ ${m[2] === "does not sit" ? "ਨਹੀਂ " : ""}ਹੈ।`],
    [rx(`The person facing ${personToken} sits (immediately|second) to the (left|right) of the person facing ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} के सामने बैठा व्यक्ति, ${name(m[4]!, locale)} के सामने बैठे व्यक्ति से ${relativePhrase(m[2]!, m[3]!, locale)} है।` : `${name(m[1]!, locale)} ਦੇ ਸਾਹਮਣੇ ਬੈਠਾ ਵਿਅਕਤੀ, ${name(m[4]!, locale)} ਦੇ ਸਾਹਮਣੇ ਬੈਠੇ ਵਿਅਕਤੀ ਤੋਂ ${relativePhrase(m[2]!, m[3]!, locale)} ਹੈ।`],
  ], "clue text");
}

export function localizeCp006QuestionText(text: string, people: readonly string[], locale: Locale): string {
  const source = markNames(text, people);
  return firstMatch(source, [
    [rx(`Who sits exactly opposite ${personToken}\\?`), (m) => isHi(locale) ? `${name(m[1]!, locale)} के ठीक सामने कौन है?` : `${name(m[1]!, locale)} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਕੌਣ ਹੈ?`],
    [rx(`Who sits (immediately|second|third) to the (left|right) of ${personToken}\\?`), (m) => isHi(locale) ? `${name(m[3]!, locale)} से ${relativePhrase(m[1]!, m[2]!, locale)} कौन है?` : `${name(m[3]!, locale)} ਤੋਂ ${relativePhrase(m[1]!, m[2]!, locale)} ਕੌਣ ਹੈ?`],
    [rx(`Which of the following sits in the same row as ${personToken}\\?`), (m) => isHi(locale) ? `निम्न में से कौन ${name(m[1]!, locale)} की ही पंक्ति में है?` : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕੌਣ ${name(m[1]!, locale)} ਵਾਲੀ ਹੀ ਕਤਾਰ ਵਿੱਚ ਹੈ?`],
    [rx(`Who sits diagonally opposite ${personToken}\\?`), (m) => isHi(locale) ? `${name(m[1]!, locale)} के तिरछे सामने कौन है?` : `${name(m[1]!, locale)} ਦੇ ਤਿਰਛੇ ਸਾਹਮਣੇ ਕੌਣ ਹੈ?`],
    [rx(`Who are the immediate neighbours of ${personToken}\\?`), (m) => isHi(locale) ? `${name(m[1]!, locale)} के दोनों ठीक पड़ोसी कौन हैं?` : `${name(m[1]!, locale)} ਦੇ ਦੋਵੇਂ ਤੁਰੰਤ ਗੁਆਂਢੀ ਕੌਣ ਹਨ?`],
    [rx(`Which of the following pairs faces each other\\?`), () => isHi(locale) ? "निम्न में से कौन-सा जोड़ा एक-दूसरे के ठीक सामने है?" : "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਜੋੜੀ ਇੱਕ-ਦੂਜੇ ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹੈ?"],
    [rx(`Which pair occupies the two ends of the (upper|lower) row\\?`), (m) => isHi(locale) ? `${rowWord(m[1]!, locale)} पंक्ति के दोनों छोरों पर कौन-सा जोड़ा है?` : `${rowWord(m[1]!, locale)} ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੇ ਕਿਹੜੀ ਜੋੜੀ ਹੈ?`],
    [rx(`How many persons sit between ${personToken} and ${personToken} in their row\\?`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} के बीच उनकी पंक्ति में कितने व्यक्ति हैं?` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਦੇ ਵਿਚਕਾਰ ਉਨ੍ਹਾਂ ਦੀ ਕਤਾਰ ਵਿੱਚ ਕਿੰਨੇ ਵਿਅਕਤੀ ਹਨ?`],
    [rx(`What is the position of ${personToken} with respect to ${personToken}\\?`), (m) => isHi(locale) ? `${name(m[2]!, locale)} के संबंध में ${name(m[1]!, locale)} का स्थान क्या है?` : `${name(m[2]!, locale)} ਦੇ ਸੰਬੰਧ ਵਿੱਚ ${name(m[1]!, locale)} ਦਾ ਸਥਾਨ ਕੀ ਹੈ?`],
  ], "question text");
}

export function localizeCp006Explanation(text: string, people: readonly string[], locale: Locale): string {
  const source = markNames(text, people);
  return firstMatch(source, [
    [rx(`${personToken} and ${personToken} occupy the same position in different rows, so ${personToken} sits exactly opposite ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} अलग पंक्तियों में समान स्थान पर हैं, इसलिए ${name(m[3]!, locale)} ${name(m[4]!, locale)} के ठीक सामने है।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਇੱਕੋ ਸਥਾਨ ਤੇ ਹਨ, ਇਸ ਲਈ ${name(m[3]!, locale)} ${name(m[4]!, locale)} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹੈ।`],
    [rx(`${personToken} and ${personToken} occupy the same position in different rows, so they face each other\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} अलग पंक्तियों में समान स्थान पर हैं, इसलिए वे एक-दूसरे के ठीक सामने हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਇੱਕੋ ਸਥਾਨ ਤੇ ਹਨ, ਇਸ ਲਈ ਉਹ ਇੱਕ-ਦੂਜੇ ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹਨ।`],
    [rx(`${personToken} and ${personToken} are (\\d+) seats apart in the same row, so (\\d+) (?:person sits|persons sit) between them\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} उसी पंक्ति में ${m[3]} स्थान दूर हैं, इसलिए उनके बीच ${m[4]} व्यक्ति हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਉਸੇ ਕਤਾਰ ਵਿੱਚ ${m[3]} ਸਥਾਨ ਦੂਰ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ${m[4]} ਵਿਅਕਤੀ ਹਨ।`],
    [rx(`${personToken} and ${personToken} occupy the two seats immediately beside ${personToken} in the same row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)}, ${name(m[3]!, locale)} के दोनों ओर उसी पंक्ति में तुरंत साथ वाले स्थानों पर हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)}, ${name(m[3]!, locale)} ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਉਸੇ ਕਤਾਰ ਵਿੱਚ ਤੁਰੰਤ ਨਾਲ ਵਾਲੇ ਸਥਾਨਾਂ ਤੇ ਹਨ।`],
    [rx(`${personToken} is at an end position\\. ${personToken} is in the other row one position away, so ${personToken} is diagonally opposite ${personToken}; the person in the same position would be directly opposite\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} छोर के स्थान पर है। ${name(m[2]!, locale)} दूसरी पंक्ति में एक स्थान दूर है, इसलिए ${name(m[3]!, locale)} ${name(m[4]!, locale)} के तिरछे सामने है; समान स्थान वाला व्यक्ति सीधे सामने होता।` : `${name(m[1]!, locale)} ਸਿਰੇ ਵਾਲੇ ਸਥਾਨ ਤੇ ਹੈ। ${name(m[2]!, locale)} ਦੂਜੀ ਕਤਾਰ ਵਿੱਚ ਇੱਕ ਸਥਾਨ ਦੂਰ ਹੈ, ਇਸ ਲਈ ${name(m[3]!, locale)} ${name(m[4]!, locale)} ਦੇ ਤਿਰਛੇ ਸਾਹਮਣੇ ਹੈ; ਇੱਕੋ ਸਥਾਨ ਵਾਲਾ ਵਿਅਕਤੀ ਸਿੱਧਾ ਸਾਹਮਣੇ ਹੁੰਦਾ।`],
    [rx(`${personToken} is in the (upper|lower) row and faces (north|south)\\. Therefore ${personToken}'s (left|right) is towards our (left|right); moving (\\d+) (?:seat|seats) reaches ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} ${rowWord(m[2]!, locale)} पंक्ति में है और ${facingWord(m[3]!, locale)} की ओर मुख किए है। इसलिए ${name(m[4]!, locale)} की ${sideWord(m[5]!, locale)} ओर हमारे ${m[6] === "left" ? "बाएँ" : "दाएँ"} तरफ पड़ती है; ${m[7]} स्थान बढ़ने पर ${name(m[8]!, locale)} मिलता है।` : `${name(m[1]!, locale)} ${rowWord(m[2]!, locale)} ਕਤਾਰ ਵਿੱਚ ਹੈ ਅਤੇ ${facingWord(m[3]!, locale)} ਵੱਲ ਮੂੰਹ ਕਰਦਾ ਹੈ। ਇਸ ਲਈ ${name(m[4]!, locale)} ਦਾ ${sideWord(m[5]!, locale)} ਪਾਸਾ ਸਾਡੇ ${m[6] === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੇ ਵੱਲ ਹੈ; ${m[7]} ਸਥਾਨ ਅੱਗੇ ਜਾਣ ਤੇ ${name(m[8]!, locale)} ਮਿਲਦਾ ਹੈ।`],
    [rx(`${personToken} and ${personToken} occupy the two extreme seats of the (upper|lower) row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} ${rowWord(m[3]!, locale)} पंक्ति के दोनों अंतिम स्थानों पर हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ${rowWord(m[3]!, locale)} ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਆਖਰੀ ਸਥਾਨਾਂ ਤੇ ਹਨ।`],
    [rx(`${personToken} and ${personToken} are both seated in the (upper|lower) row\\. Therefore ${personToken} is in the same row as ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} दोनों ${rowWord(m[3]!, locale)} पंक्ति में हैं। इसलिए ${name(m[4]!, locale)}, ${name(m[5]!, locale)} की ही पंक्ति में है।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਦੋਵੇਂ ${rowWord(m[3]!, locale)} ਕਤਾਰ ਵਿੱਚ ਹਨ। ਇਸ ਲਈ ${name(m[4]!, locale)}, ${name(m[5]!, locale)} ਵਾਲੀ ਹੀ ਕਤਾਰ ਵਿੱਚ ਹੈ।`],
    [rx(`${personToken} faces (north|south)\\. From ${personToken}'s own facing, ${personToken} is (immediate|second|third|fourth|fifth) to the (left|right)\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} ${facingWord(m[2]!, locale)} की ओर मुख किए है। ${name(m[3]!, locale)} की अपनी दिशा से देखने पर ${name(m[4]!, locale)} ${relativePhrase(m[5]!, m[6]!, locale)} है।` : `${name(m[1]!, locale)} ${facingWord(m[2]!, locale)} ਵੱਲ ਮੂੰਹ ਕਰਦਾ ਹੈ। ${name(m[3]!, locale)} ਦੀ ਆਪਣੀ ਦਿਸ਼ਾ ਤੋਂ ਦੇਖਣ ਤੇ ${name(m[4]!, locale)} ${relativePhrase(m[5]!, m[6]!, locale)} ਹੈ।`],
    [rx(`${personToken} does not share ${personToken}'s position\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} समान स्थान पर नहीं हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਇੱਕੋ ਸਥਾਨ ਤੇ ਨਹੀਂ ਹਨ।`],
    [rx(`${personToken} and ${personToken} does not satisfy the requested pair relation in the solved rows\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} का जोड़ा हल की गई पंक्तियों में पूछे गए संबंध को पूरा नहीं करता।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਦੀ ਜੋੜੀ ਹੱਲ ਕੀਤੀਆਂ ਕਤਾਰਾਂ ਵਿੱਚ ਪੁੱਛੇ ਸੰਬੰਧ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦੀ।`],
    [rx(`(\\d+) is not the number of occupied seats between ${personToken} and ${personToken}; endpoints are not counted\\.`), (m) => isHi(locale) ? `${m[1]}, ${name(m[2]!, locale)} और ${name(m[3]!, locale)} के बीच बैठे व्यक्तियों की सही संख्या नहीं है; दोनों सिरों को नहीं गिना जाता।` : `${m[1]}, ${name(m[2]!, locale)} ਅਤੇ ${name(m[3]!, locale)} ਦੇ ਵਿਚਕਾਰ ਬੈਠੇ ਵਿਅਕਤੀਆਂ ਦੀ ਸਹੀ ਗਿਣਤੀ ਨਹੀਂ ਹੈ; ਦੋਵੇਂ ਸਿਰਿਆਂ ਨੂੰ ਨਹੀਂ ਗਿਣਿਆ ਜਾਂਦਾ।`],
    [rx(`${personToken} is in the other row but not in ${personToken}'s exact position; that is not an opposite seat\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} दूसरी पंक्ति में है, लेकिन ${name(m[2]!, locale)} के ठीक समान स्थान पर नहीं है; इसलिए वह सामने वाला स्थान नहीं है।` : `${name(m[1]!, locale)} ਦੂਜੀ ਕਤਾਰ ਵਿੱਚ ਹੈ, ਪਰ ${name(m[2]!, locale)} ਦੇ ਬਿਲਕੁਲ ਇੱਕੋ ਸਥਾਨ ਤੇ ਨਹੀਂ ਹੈ; ਇਸ ਲਈ ਉਹ ਸਾਹਮਣੇ ਵਾਲਾ ਸਥਾਨ ਨਹੀਂ ਹੈ।`],
    [rx(`${personToken} is obtained by reading page-left/page-right instead of ${personToken}'s own facing\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} वाला उत्तर पन्ने की बाईं/दाईं दिशा पढ़ने से आता है, ${name(m[2]!, locale)} की अपनी मुख-दिशा से नहीं।` : `${name(m[1]!, locale)} ਵਾਲਾ ਉੱਤਰ ਸਫ਼ੇ ਦੀ ਖੱਬੀ/ਸੱਜੀ ਦਿਸ਼ਾ ਪੜ੍ਹਨ ਨਾਲ ਆਉਂਦਾ ਹੈ, ${name(m[2]!, locale)} ਦੀ ਆਪਣੀ ਮੂੰਹ-ਦਿਸ਼ਾ ਨਾਲ ਨਹੀਂ।`],
    [rx(`${personToken} is in a different position from the required (\\d+)-seat move\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} आवश्यक ${m[2]}-स्थान की चाल से मिलने वाले स्थान पर नहीं है।` : `${name(m[1]!, locale)} ਲੋੜੀਂਦੀ ${m[2]}-ਸਥਾਨ ਚਾਲ ਨਾਲ ਮਿਲਣ ਵਾਲੇ ਸਥਾਨ ਤੇ ਨਹੀਂ ਹੈ।`],
    [rx(`${personToken} and ${personToken} does not place both persons in the two seats directly beside ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} दोनों, ${name(m[3]!, locale)} के ठीक दोनों पड़ोसी स्थानों पर नहीं हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਦੋਵੇਂ, ${name(m[3]!, locale)} ਦੇ ਬਿਲਕੁਲ ਦੋਵੇਂ ਗੁਆਂਢੀ ਸਥਾਨਾਂ ਤੇ ਨਹੀਂ ਹਨ।`],
    [rx(`${personToken} does not follow the (north|south)-facing direction rule for ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} वाला विकल्प ${name(m[3]!, locale)} की ${facingWord(m[2]!, locale)}-मुखी दिशा के नियम को सही नहीं मानता।` : `${name(m[1]!, locale)} ਵਾਲਾ ਵਿਕਲਪ ${name(m[3]!, locale)} ਦੀ ${facingWord(m[2]!, locale)}-ਮੁਖੀ ਦਿਸ਼ਾ ਦੇ ਨਿਯਮ ਨੂੰ ਠੀਕ ਨਹੀਂ ਮੰਨਦਾ।`],
    [rx(`${personToken} sits in the other row, so ${personToken} cannot be in the same row as ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} दूसरी पंक्ति में है, इसलिए ${name(m[2]!, locale)} ${name(m[3]!, locale)} की ही पंक्ति में नहीं हो सकता।` : `${name(m[1]!, locale)} ਦੂਜੀ ਕਤਾਰ ਵਿੱਚ ਹੈ, ਇਸ ਲਈ ${name(m[2]!, locale)} ${name(m[3]!, locale)} ਵਾਲੀ ਹੀ ਕਤਾਰ ਵਿੱਚ ਨਹੀਂ ਹੋ ਸਕਦਾ।`],
    [rx(`${personToken} is not in the required cross-row diagonal seat\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} आवश्यक दूसरी-पंक्ति वाले तिरछे स्थान पर नहीं है।` : `${name(m[1]!, locale)} ਲੋੜੀਂਦੇ ਦੂਜੀ-ਕਤਾਰ ਵਾਲੇ ਤਿਰਛੇ ਸਥਾਨ ਤੇ ਨਹੀਂ ਹੈ।`],
    [rx(`${personToken} is in the wrong position for the diagonal relation\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} तिरछे संबंध के लिए गलत स्थान पर है।` : `${name(m[1]!, locale)} ਤਿਰਛੇ ਸੰਬੰਧ ਲਈ ਗਲਤ ਸਥਾਨ ਤੇ ਹੈ।`],
    [rx(`${personToken} is not one position away in the other row; do not confuse direct opposite with diagonal\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} दूसरी पंक्ति में एक स्थान दूर नहीं है; सीधे सामने और तिरछे सामने को एक न मानें।` : `${name(m[1]!, locale)} ਦੂਜੀ ਕਤਾਰ ਵਿੱਚ ਇੱਕ ਸਥਾਨ ਦੂਰ ਨਹੀਂ ਹੈ; ਸਿੱਧੇ ਸਾਹਮਣੇ ਅਤੇ ਤਿਰਛੇ ਸਾਹਮਣੇ ਨੂੰ ਇੱਕ ਨਾ ਸਮਝੋ।`],
    [rx(`(Immediate|Second|Third|Fourth|Fifth) to the (left|right) has the wrong direction or seat distance from ${personToken}\\.`), (m) => isHi(locale) ? `${relativePhrase(m[1]!.toLowerCase(), m[2]!, locale)} वाला विकल्प ${name(m[3]!, locale)} से गलत दिशा या गलत स्थान-दूरी देता है।` : `${relativePhrase(m[1]!.toLowerCase(), m[2]!, locale)} ਵਾਲਾ ਵਿਕਲਪ ${name(m[3]!, locale)} ਤੋਂ ਗਲਤ ਦਿਸ਼ਾ ਜਾਂ ਗਲਤ ਸਥਾਨ-ਦੂਰੀ ਦਿੰਦਾ ਹੈ।`],
    [rx(`(Immediate|Second|Third|Fourth|Fifth) to the (left|right) does not use ${personToken}'s (north|south) facing correctly\\.`), (m) => isHi(locale) ? `${relativePhrase(m[1]!.toLowerCase(), m[2]!, locale)} वाला विकल्प ${name(m[3]!, locale)} की ${facingWord(m[4]!, locale)}-मुखी दिशा का सही उपयोग नहीं करता।` : `${relativePhrase(m[1]!.toLowerCase(), m[2]!, locale)} ਵਾਲਾ ਵਿਕਲਪ ${name(m[3]!, locale)} ਦੀ ${facingWord(m[4]!, locale)}-ਮੁਖੀ ਦਿਸ਼ਾ ਦੀ ਠੀਕ ਵਰਤੋਂ ਨਹੀਂ ਕਰਦਾ।`],
  ], "explanation/rationale");
}

export function localizeCp006DisplayValue(value: string, people: readonly string[], locale: Locale): string {
  if (/^\d+$/u.test(value)) return value;
  const person = people.find((candidate) => candidate === value);
  if (person) return name(person, locale);
  const pair = value.match(/^(.+) and (.+)$/u);
  if (pair && people.includes(pair[1]!) && people.includes(pair[2]!)) return joinNames([pair[1]!, pair[2]!], locale);
  const relation = value.match(/^(Immediate|Second|Third|Fourth|Fifth) to the (left|right)$/u);
  if (relation) return relativePhrase(relation[1]!.toLowerCase(), relation[2]!, locale);
  throw new Error(`SEA-002 CP006 localization unsupported display value: ${value}`);
}

function localizeAction(body: string, people: readonly string[], locale: Locale): string {
  const source = markNames(body, people);
  return firstMatch(source, [
    [rx(`${personToken} and ${personToken} must occupy the same position in the two rows\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} को दोनों पंक्तियों में समान स्थान पर होना चाहिए।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਨੂੰ ਦੋਵੇਂ ਕਤਾਰਾਂ ਵਿੱਚ ਇੱਕੋ ਸਥਾਨ ਤੇ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`],
    [rx(`${personToken} and ${personToken} must occupy different positions\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} को अलग-अलग स्थानों पर होना चाहिए।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਨੂੰ ਵੱਖ-ਵੱਖ ਸਥਾਨਾਂ ਤੇ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`],
    [rx(`${personToken} is (\\d+) position(?:s)? to the (left|right) of ${personToken} in the same row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} उसी पंक्ति में ${name(m[4]!, locale)} से ${m[2]} स्थान ${sideWord(m[3]!, locale)} ओर है।` : `${name(m[1]!, locale)} ਉਸੇ ਕਤਾਰ ਵਿੱਚ ${name(m[4]!, locale)} ਤੋਂ ${m[2]} ਸਥਾਨ ${sideWord(m[3]!, locale)} ਪਾਸੇ ਹੈ।`],
    [rx(`${personToken} and ${personToken} must occupy adjacent positions in the same row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} को उसी पंक्ति में पास-पास के स्थानों पर होना चाहिए।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਨੂੰ ਉਸੇ ਕਤਾਰ ਵਿੱਚ ਨਾਲ-ਨਾਲ ਸਥਾਨਾਂ ਤੇ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`],
    [rx(`${personToken} and ${personToken} must be in the same row with a position difference of (\\d+)\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} एक ही पंक्ति में हों और उनके स्थानों का अंतर ${m[3]} हो।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਇੱਕੋ ਕਤਾਰ ਵਿੱਚ ਹੋਣ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ${m[3]} ਹੋਵੇ।`],
    [rx(`${personToken} and ${personToken} must be in the same row with a position difference of at least (\\d+)\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} एक ही पंक्ति में हों और उनके स्थानों का अंतर कम से कम ${m[3]} हो।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਇੱਕੋ ਕਤਾਰ ਵਿੱਚ ਹੋਣ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ਘੱਟੋ-ਘੱਟ ${m[3]} ਹੋਵੇ।`],
    [rx(`The position gap between ${personToken} and ${personToken} must equal the position gap between ${personToken} and ${personToken}\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)}–${name(m[2]!, locale)} के स्थान-अंतर के बराबर ${name(m[3]!, locale)}–${name(m[4]!, locale)} का स्थान-अंतर होना चाहिए।` : `${name(m[1]!, locale)}–${name(m[2]!, locale)} ਦੇ ਸਥਾਨ-ਅੰਤਰ ਦੇ ਬਰਾਬਰ ${name(m[3]!, locale)}–${name(m[4]!, locale)} ਦਾ ਸਥਾਨ-ਅੰਤਰ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`],
    [rx(`${personToken} and ${personToken} cannot occupy adjacent positions in the same row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} उसी पंक्ति में पास-पास के स्थानों पर नहीं हो सकते।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਉਸੇ ਕਤਾਰ ਵਿੱਚ ਨਾਲ-ਨਾਲ ਸਥਾਨਾਂ ਤੇ ਨਹੀਂ ਹੋ ਸਕਦੇ।`],
    [rx(`Find the persons facing ${personToken} and ${personToken}; the first is (\\d+) position(?:s)? to the (left|right) of the second\\.`), (m) => isHi(locale) ? `पहले ${name(m[1]!, locale)} और ${name(m[2]!, locale)} के सामने बैठे व्यक्तियों को पहचानें; पहला व्यक्ति दूसरे से ${m[3]} स्थान ${sideWord(m[4]!, locale)} ओर है।` : `ਪਹਿਲਾਂ ${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਦੇ ਸਾਹਮਣੇ ਬੈਠੇ ਵਿਅਕਤੀਆਂ ਨੂੰ ਪਛਾਣੋ; ਪਹਿਲਾ ਵਿਅਕਤੀ ਦੂਜੇ ਤੋਂ ${m[3]} ਸਥਾਨ ${sideWord(m[4]!, locale)} ਪਾਸੇ ਹੈ।`],
    [rx(`${personToken} → (left|right) end of the (upper|lower) row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → ${rowWord(m[3]!, locale)} पंक्ति का ${endWord(m[2]!, locale)} छोर।` : `${name(m[1]!, locale)} → ${rowWord(m[3]!, locale)} ਕਤਾਰ ਦਾ ${endWord(m[2]!, locale)} ਸਿਰਾ।`],
    [rx(`${personToken} can occupy the second position from either end of the row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} पंक्ति के किसी भी छोर से दूसरे स्थान पर हो सकता है।` : `${name(m[1]!, locale)} ਕਤਾਰ ਦੇ ਕਿਸੇ ਵੀ ਸਿਰੇ ਤੋਂ ਦੂਜੇ ਸਥਾਨ ਤੇ ਹੋ ਸਕਦਾ ਹੈ।`],
    [rx(`${personToken} cannot occupy the second position from either end of the row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} पंक्ति के किसी भी छोर से दूसरे स्थान पर नहीं हो सकता।` : `${name(m[1]!, locale)} ਕਤਾਰ ਦੇ ਕਿਸੇ ਵੀ ਸਿਰੇ ਤੋਂ ਦੂਜੇ ਸਥਾਨ ਤੇ ਨਹੀਂ ਹੋ ਸਕਦਾ।`],
    [rx(`${personToken} and ${personToken} must be in different rows and adjacent positions\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} अलग पंक्तियों में और पास-पास के स्थानों पर होने चाहिए।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਅਤੇ ਨਾਲ-ਨਾਲ ਸਥਾਨਾਂ ਤੇ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।`],
    [rx(`${personToken} → (upper|lower) row; position not fixed yet\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} पंक्ति; स्थान अभी तय नहीं।` : `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} ਕਤਾਰ; ਸਥਾਨ ਹਾਲੇ ਤੈਅ ਨਹੀਂ।`],
  ], "teaching action");
}

function localizePosition(body: string, people: readonly string[], locale: Locale): string {
  if (body === "Exact positions are still open.") return isHi(locale) ? "सटीक स्थान अभी तय नहीं हैं।" : "ਸਹੀ ਸਥਾਨ ਹਾਲੇ ਤੈਅ ਨਹੀਂ ਹਨ।";
  const source = markNames(body, people);
  return firstMatch(source, [
    [rx(`${personToken} and ${personToken} → position (\\d+); therefore they face each other\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} और ${name(m[2]!, locale)} → स्थान ${m[3]}; इसलिए वे एक-दूसरे के ठीक सामने हैं।` : `${name(m[1]!, locale)} ਅਤੇ ${name(m[2]!, locale)} → ਸਥਾਨ ${m[3]}; ਇਸ ਲਈ ਉਹ ਇੱਕ-ਦੂਜੇ ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹਨ।`],
    [rx(`${personToken} → position (\\d+); ${personToken} → position (\\d+)\\. Their positions are different\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → स्थान ${m[2]}; ${name(m[3]!, locale)} → स्थान ${m[4]}। दोनों के स्थान अलग हैं।` : `${name(m[1]!, locale)} → ਸਥਾਨ ${m[2]}; ${name(m[3]!, locale)} → ਸਥਾਨ ${m[4]}। ਦੋਵੇਂ ਦੇ ਸਥਾਨ ਵੱਖ ਹਨ।`],
    [rx(`${personToken} → (upper|lower) row, position (\\d+), facing (north|south)\\. (\\d+) position(?:s)? to ${personToken}'s (left|right) gives position (\\d+); therefore ${personToken} → position (\\d+)\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} पंक्ति, स्थान ${m[3]}, मुख ${facingWord(m[4]!, locale)} की ओर। ${name(m[6]!, locale)} से ${m[5]} स्थान ${sideWord(m[7]!, locale)} ओर जाने पर स्थान ${m[8]} मिलता है; इसलिए ${name(m[9]!, locale)} → स्थान ${m[10]}।` : `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} ਕਤਾਰ, ਸਥਾਨ ${m[3]}, ਮੂੰਹ ${facingWord(m[4]!, locale)} ਵੱਲ। ${name(m[6]!, locale)} ਤੋਂ ${m[5]} ਸਥਾਨ ${sideWord(m[7]!, locale)} ਪਾਸੇ ਜਾਣ ਤੇ ਸਥਾਨ ${m[8]} ਮਿਲਦਾ ਹੈ; ਇਸ ਲਈ ${name(m[9]!, locale)} → ਸਥਾਨ ${m[10]}।`],
    [rx(`${personToken} → position (\\d+); ${personToken} → position (\\d+)\\. Position difference = (\\d+), so (\\d+) (?:person sits|persons sit) between them\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → स्थान ${m[2]}; ${name(m[3]!, locale)} → स्थान ${m[4]}। स्थान-अंतर = ${m[5]}, इसलिए उनके बीच ${m[6]} व्यक्ति हैं।` : `${name(m[1]!, locale)} → ਸਥਾਨ ${m[2]}; ${name(m[3]!, locale)} → ਸਥਾਨ ${m[4]}। ਸਥਾਨ-ਅੰਤਰ = ${m[5]}, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ${m[6]} ਵਿਅਕਤੀ ਹਨ।`],
    [rx(`${personToken} → position (\\d+); ${personToken} → position (\\d+)\\. There (?:is|are) (\\d+) (?:person|persons) between them, so the minimum condition is satisfied\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → स्थान ${m[2]}; ${name(m[3]!, locale)} → स्थान ${m[4]}। उनके बीच ${m[5]} व्यक्ति हैं, इसलिए न्यूनतम दूरी की शर्त पूरी होती है।` : `${name(m[1]!, locale)} → ਸਥਾਨ ${m[2]}; ${name(m[3]!, locale)} → ਸਥਾਨ ${m[4]}। ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ${m[5]} ਵਿਅਕਤੀ ਹਨ, ਇਸ ਲਈ ਘੱਟੋ-ਘੱਟ ਦੂਰੀ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।`],
    [rx(`${personToken}/${personToken} → positions (\\d+) and (\\d+) \\((\\d+) between\\); ${personToken}/${personToken} → positions (\\d+) and (\\d+) \\((\\d+) between\\)\\. The gaps are equal\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)}/${name(m[2]!, locale)} → स्थान ${m[3]} और ${m[4]} (बीच में ${m[5]}); ${name(m[6]!, locale)}/${name(m[7]!, locale)} → स्थान ${m[8]} और ${m[9]} (बीच में ${m[10]})। दोनों अंतर समान हैं।` : `${name(m[1]!, locale)}/${name(m[2]!, locale)} → ਸਥਾਨ ${m[3]} ਅਤੇ ${m[4]} (ਵਿਚਕਾਰ ${m[5]}); ${name(m[6]!, locale)}/${name(m[7]!, locale)} → ਸਥਾਨ ${m[8]} ਅਤੇ ${m[9]} (ਵਿਚਕਾਰ ${m[10]})। ਦੋਵੇਂ ਅੰਤਰ ਬਰਾਬਰ ਹਨ।`],
    [rx(`${personToken} → (upper|lower) row, position (\\d+); ${personToken} → (upper|lower) row, position (\\d+)\\. They are in different rows, so they are not immediate neighbours\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} पंक्ति, स्थान ${m[3]}; ${name(m[4]!, locale)} → ${rowWord(m[5]!, locale)} पंक्ति, स्थान ${m[6]}। वे अलग पंक्तियों में हैं, इसलिए वे ठीक पड़ोसी नहीं हैं।` : `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} ਕਤਾਰ, ਸਥਾਨ ${m[3]}; ${name(m[4]!, locale)} → ${rowWord(m[5]!, locale)} ਕਤਾਰ, ਸਥਾਨ ${m[6]}। ਉਹ ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਹਨ, ਇਸ ਲਈ ਉਹ ਤੁਰੰਤ ਗੁਆਂਢੀ ਨਹੀਂ ਹਨ।`],
    [rx(`${personToken} → position (\\d+); ${personToken} → position (\\d+)\\. These positions are not adjacent\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → स्थान ${m[2]}; ${name(m[3]!, locale)} → स्थान ${m[4]}। ये स्थान पास-पास नहीं हैं।` : `${name(m[1]!, locale)} → ਸਥਾਨ ${m[2]}; ${name(m[3]!, locale)} → ਸਥਾਨ ${m[4]}। ਇਹ ਸਥਾਨ ਨਾਲ-ਨਾਲ ਨਹੀਂ ਹਨ।`],
    [rx(`${personToken} faces ${personToken} at position (\\d+); ${personToken} faces ${personToken} at position (\\d+)\\. ${personToken} faces (north|south); (\\d+) position(?:s)? to its (left|right) gives position (\\d+)\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} स्थान ${m[3]} पर ${name(m[2]!, locale)} के सामने है; ${name(m[4]!, locale)} स्थान ${m[6]} पर ${name(m[5]!, locale)} के सामने है। ${name(m[7]!, locale)} ${facingWord(m[8]!, locale)} की ओर मुख किए है; उसकी ${sideWord(m[10]!, locale)} ओर ${m[9]} स्थान जाने पर स्थान ${m[11]} मिलता है।` : `${name(m[1]!, locale)} ਸਥਾਨ ${m[3]} ਤੇ ${name(m[2]!, locale)} ਦੇ ਸਾਹਮਣੇ ਹੈ; ${name(m[4]!, locale)} ਸਥਾਨ ${m[6]} ਤੇ ${name(m[5]!, locale)} ਦੇ ਸਾਹਮਣੇ ਹੈ। ${name(m[7]!, locale)} ${facingWord(m[8]!, locale)} ਵੱਲ ਮੂੰਹ ਕਰਦਾ ਹੈ; ਉਸਦੇ ${sideWord(m[10]!, locale)} ਪਾਸੇ ${m[9]} ਸਥਾਨ ਜਾਣ ਤੇ ਸਥਾਨ ${m[11]} ਮਿਲਦਾ ਹੈ।`],
    [rx(`${personToken} → (upper|lower) row, position (\\d+) \\((left|right) end\\)\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} पंक्ति, स्थान ${m[3]} (${endWord(m[4]!, locale)} छोर)।` : `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} ਕਤਾਰ, ਸਥਾਨ ${m[3]} (${endWord(m[4]!, locale)} ਸਿਰਾ)।`],
    [rx(`${personToken} → position (\\d+); (first|second|third|fourth|fifth|6th) from the left end and (first|second|third|fourth|fifth|6th) from the right end\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → स्थान ${m[2]}; बाएँ छोर से ${ordinalWord(m[3]!, locale)} स्थान और दाएँ छोर से ${ordinalWord(m[4]!, locale)} स्थान।` : `${name(m[1]!, locale)} → ਸਥਾਨ ${m[2]}; ਖੱਬੇ ਸਿਰੇ ਤੋਂ ${ordinalWord(m[3]!, locale)} ਸਥਾਨ ਅਤੇ ਸੱਜੇ ਸਿਰੇ ਤੋਂ ${ordinalWord(m[4]!, locale)} ਸਥਾਨ।`],
    [rx(`${personToken} → (upper|lower) row, position (\\d+); ${personToken} → (upper|lower) row, position (\\d+)\\. They are in different rows and adjacent positions, so they are diagonal\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} पंक्ति, स्थान ${m[3]}; ${name(m[4]!, locale)} → ${rowWord(m[5]!, locale)} पंक्ति, स्थान ${m[6]}। वे अलग पंक्तियों में पास-पास के स्थानों पर हैं, इसलिए तिरछे सामने हैं।` : `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} ਕਤਾਰ, ਸਥਾਨ ${m[3]}; ${name(m[4]!, locale)} → ${rowWord(m[5]!, locale)} ਕਤਾਰ, ਸਥਾਨ ${m[6]}। ਉਹ ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਨਾਲ-ਨਾਲ ਸਥਾਨਾਂ ਤੇ ਹਨ, ਇਸ ਲਈ ਤਿਰਛੇ ਸਾਹਮਣੇ ਹਨ।`],
    [rx(`${personToken} → (upper|lower) row\\.`), (m) => isHi(locale) ? `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} पंक्ति।` : `${name(m[1]!, locale)} → ${rowWord(m[2]!, locale)} ਕਤਾਰ।`],
  ], "position deduction");
}

export function cp006TeachingSkeleton(sharedExplanation: string): readonly string[] {
  return Object.freeze(sharedExplanation.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    if (/^Use positions /u.test(line)) return "OPENING";
    if (/^Use this condition first:/u.test(line)) return "USE_ONE_CONDITION";
    if (/^Use these conditions first:/u.test(line)) return "USE_CONDITIONS";
    if (/^\d+ arrangements are possible:/u.test(line)) return "ARRANGEMENTS_POSSIBLE";
    if (/^\d+ arrangements remain before the deciding condition:/u.test(line)) return "ARRANGEMENTS_BEFORE_DECIDER";
    if (/^Case \d+:$/u.test(line)) return "CASE";
    if (/^Positions:/u.test(line)) return "POSITIONS";
    if (/^Upper row/u.test(line)) return "UPPER_ROW";
    if (/^Lower row/u.test(line)) return "LOWER_ROW";
    if (/^[↕\s]+$/u.test(line)) return "FACING_LINKS";
    if (/^Next condition:/u.test(line)) return "NEXT_CONDITION";
    if (/^Case \d+ ✅/u.test(line)) return "CASE_ACCEPT";
    if (/^Case \d+ ❌/u.test(line)) return "CASE_REJECT";
    if (/^Only Case /u.test(line)) return "ONLY_CASE";
    if (line === "Working:") return "WORKING";
    if (/^Step \d+:/u.test(line)) return "STEP";
    if (/^Position:/u.test(line)) return "POSITION_RESULT";
    if (line === "Final arrangement:") return "FINAL_ARRANGEMENT";
    if (/^\d+\. /u.test(line)) return "CONDITION_ACTION";
    throw new Error(`SEA-002 CP006 localization unsupported teaching skeleton line: ${line}`);
  }));
}

function localizeSharedLine(line: string, caselet: Sea002Cp006Caselet, locale: Locale): string {
  const raw = line.trim();
  if (!raw) return "";
  const source = markNames(raw, caselet.people);
  let match = source.match(rx(`Use positions 1 to (\\d+) from left to right\\. Upper row faces south and lower row faces north; persons at the same position in the two rows face each other\\.`));
  if (match) return isHi(locale)
    ? `बाएँ से दाएँ स्थान 1 से ${match[1]} तक मानें। ऊपरी पंक्ति दक्षिण की ओर और निचली पंक्ति उत्तर की ओर मुख करती है; दोनों पंक्तियों में समान स्थान पर बैठे व्यक्ति एक-दूसरे के ठीक सामने होते हैं।`
    : `ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਸਥਾਨ 1 ਤੋਂ ${match[1]} ਤੱਕ ਮੰਨੋ। ਉੱਪਰਲੀ ਕਤਾਰ ਦੱਖਣ ਵੱਲ ਅਤੇ ਹੇਠਲੀ ਕਤਾਰ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਦੀ ਹੈ; ਦੋਵੇਂ ਕਤਾਰਾਂ ਵਿੱਚ ਇੱਕੋ ਸਥਾਨ ਤੇ ਬੈਠੇ ਵਿਅਕਤੀ ਇੱਕ-ਦੂਜੇ ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹੁੰਦੇ ਹਨ।`;
  if (raw === "Working:") return isHi(locale) ? "कार्य:" : "ਹੱਲ ਦੀ ਕਾਰਵਾਈ:";
  if (raw === "Final arrangement:") return isHi(locale) ? "अंतिम व्यवस्था:" : "ਅੰਤਿਮ ਵਿਵਸਥਾ:";
  if (raw === "Use these conditions first:") return isHi(locale) ? "पहले इन शर्तों का उपयोग करें:" : "ਪਹਿਲਾਂ ਇਹ ਸ਼ਰਤਾਂ ਵਰਤੋ:";
  if (raw === "Use this condition first:") return isHi(locale) ? "पहले इस शर्त का उपयोग करें:" : "ਪਹਿਲਾਂ ਇਹ ਸ਼ਰਤ ਵਰਤੋ:";
  match = source.match(rx(`Positions:\\s+(.+)`));
  if (match) return `${isHi(locale) ? "स्थान" : "ਸਥਾਨ"}: ${match[1]}`;
  match = source.match(rx(`Upper row — South ↓:\\s+(.+)`));
  if (match) return `${isHi(locale) ? "ऊपरी पंक्ति — दक्षिण" : "ਉੱਪਰਲੀ ਕਤਾਰ — ਦੱਖਣ"} ↓: ${markedNames(match[1]!).map((value) => name(value, locale)).join("   ")}`;
  match = source.match(rx(`Lower row — North ↑:\\s+(.+)`));
  if (match) return `${isHi(locale) ? "निचली पंक्ति — उत्तर" : "ਹੇਠਲੀ ਕਤਾਰ — ਉੱਤਰ"} ↑: ${markedNames(match[1]!).map((value) => name(value, locale)).join("   ")}`;
  if (/^[↕\s]+$/u.test(raw)) return raw;
  match = source.match(rx(`Case (\\d+):`));
  if (match) return `${isHi(locale) ? "स्थिति" : "ਸਥਿਤੀ"} ${match[1]}:`;
  match = source.match(rx(`Case (\\d+) ✅ — fits\\.`));
  if (match) return isHi(locale) ? `स्थिति ${match[1]} ✅ — सही बैठती है।` : `ਸਥਿਤੀ ${match[1]} ✅ — ਠੀਕ ਬੈਠਦੀ ਹੈ।`;
  match = source.match(rx(`Case (\\d+) ❌ — does not fit; reject it\\.`));
  if (match) return isHi(locale) ? `स्थिति ${match[1]} ❌ — सही नहीं बैठती; इसे हटा दें।` : `ਸਥਿਤੀ ${match[1]} ❌ — ਠੀਕ ਨਹੀਂ ਬੈਠਦੀ; ਇਸਨੂੰ ਰੱਦ ਕਰੋ।`;
  match = source.match(rx(`Only Case (\\d+) remains\\.`));
  if (match) return isHi(locale) ? `अब केवल स्थिति ${match[1]} बचती है।` : `ਹੁਣ ਕੇਵਲ ਸਥਿਤੀ ${match[1]} ਬਚਦੀ ਹੈ।`;
  match = source.match(rx(`(\\d+) arrangements are possible:`));
  if (match) return isHi(locale) ? `${match[1]} व्यवस्थाएँ संभव हैं:` : `${match[1]} ਵਿਵਸਥਾਵਾਂ ਸੰਭਵ ਹਨ:`;
  match = source.match(rx(`(\\d+) arrangements remain before the deciding condition:`));
  if (match) return isHi(locale) ? `निर्णायक शर्त लगाने से पहले ${match[1]} व्यवस्थाएँ बचती हैं:` : `ਫੈਸਲਾ ਕਰਨ ਵਾਲੀ ਸ਼ਰਤ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ${match[1]} ਵਿਵਸਥਾਵਾਂ ਬਚਦੀਆਂ ਹਨ:`;
  if (raw.startsWith("Next condition: ")) return `${isHi(locale) ? "अगली शर्त" : "ਅਗਲੀ ਸ਼ਰਤ"}: ${localizeCp006ClueText(raw.slice("Next condition: ".length), caselet.people, locale)}`;
  match = source.match(rx(`Step (\\d+): Mark row groups: upper — (.+); lower — (.+)\\.`));
  if (match) {
    const upper = joinNames(markedNames(match[2]!), locale), lower = joinNames(markedNames(match[3]!), locale);
    return isHi(locale) ? `चरण ${match[1]}: पंक्ति समूह तय करें: ऊपरी — ${upper}; निचली — ${lower}।` : `ਕਦਮ ${match[1]}: ਕਤਾਰ ਸਮੂਹ ਤੈਅ ਕਰੋ: ਉੱਪਰਲੀ — ${upper}; ਹੇਠਲੀ — ${lower}।`;
  }
  match = raw.match(/^Step (\d+): (.+)$/u);
  if (match) return `${isHi(locale) ? "चरण" : "ਕਦਮ"} ${match[1]}: ${localizeAction(match[2]!, caselet.people, locale)}`;
  if (raw.startsWith("Position: ")) return `${isHi(locale) ? "स्थान" : "ਸਥਾਨ"}: ${localizePosition(raw.slice("Position: ".length), caselet.people, locale)}`;
  match = source.match(rx(`(\\d+)\\. Row groups: upper — (.+); lower — (.+)\\. Keep exact positions open\\.`));
  if (match) {
    const upper = joinNames(markedNames(match[2]!), locale), lower = joinNames(markedNames(match[3]!), locale);
    return isHi(locale) ? `${match[1]}. पंक्ति समूह: ऊपरी — ${upper}; निचली — ${lower}। सटीक स्थान अभी खुला रखें।` : `${match[1]}. ਕਤਾਰ ਸਮੂਹ: ਉੱਪਰਲੀ — ${upper}; ਹੇਠਲੀ — ${lower}। ਸਹੀ ਸਥਾਨ ਹਾਲੇ ਖੁੱਲ੍ਹੇ ਰੱਖੋ।`;
  }
  match = raw.match(/^(\d+)\. (.+)$/u);
  if (match) return `${match[1]}. ${localizeAction(match[2]!, caselet.people, locale)}`;
  throw new Error(`SEA-002 CP006 localization unsupported shared-solution line: ${raw}`);
}

export function localizeCp006SharedExplanation(caselet: Sea002Cp006Caselet, locale: Locale): string {
  return caselet.sharedExplanation.split("\n").map((line) => localizeSharedLine(line, caselet, locale)).join("\n");
}

export function localizeCp006DiagramText(caselet: Sea002Cp006Caselet, locale: Locale): string {
  const positions = Array.from({ length: caselet.state.seatCountPerRow }, (_, index) => String(index + 1)).join("     ");
  const links = Array.from({ length: caselet.state.seatCountPerRow }, () => "↕").join("     ");
  return [
    `${isHi(locale) ? "स्थान" : "ਸਥਾਨ"}: ${positions}`,
    `${isHi(locale) ? "ऊपरी पंक्ति — दक्षिण" : "ਉੱਪਰਲੀ ਕਤਾਰ — ਦੱਖਣ"} ↓: ${caselet.state.top.map((person) => name(person, locale)).join("   ")}`,
    links,
    `${isHi(locale) ? "निचली पंक्ति — उत्तर" : "ਹੇਠਲੀ ਕਤਾਰ — ਉੱਤਰ"} ↑: ${caselet.state.bottom.map((person) => name(person, locale)).join("   ")}`,
  ].join("\n");
}

function localizedOption(option: Sea002Cp006Option, caselet: Sea002Cp006Caselet, locale: Locale): Sea002Cp006LocalizedReviewOption {
  return Object.freeze({
    displayValue: localizeCp006DisplayValue(option.value, caselet.people, locale),
    isCorrect: option.isCorrect,
    ...(option.misconceptionId ? { misconceptionId: option.misconceptionId } : {}),
    explanation: localizeCp006Explanation(option.explanation, caselet.people, locale),
  });
}

function localizedChild(child: Sea002Cp006ChildQuestion, caselet: Sea002Cp006Caselet, locale: Locale): Sea002Cp006LocalizedReviewChild {
  const options = child.options.map((option) => localizedOption(option, caselet, locale)) as unknown as Sea002Cp006LocalizedReviewChild["options"];
  return Object.freeze({
    questionOrder: child.questionOrder,
    queryContractId: child.queryContractId,
    answerType: child.answerType,
    answerDeterminingFactFingerprint: child.answerDeterminingFactFingerprint,
    answerIndex: child.answerIndex,
    canonicalAnswer: child.answer,
    displayAnswer: localizeCp006DisplayValue(child.answer, caselet.people, locale),
    text: localizeCp006QuestionText(child.text, caselet.people, locale),
    options,
    explanation: localizeCp006Explanation(child.explanation, caselet.people, locale),
  });
}

export function localizeCp006ReviewCaselet(caselet: Sea002Cp006Caselet, locale: Locale): Sea002Cp006LocalizedReviewCaselet {
  const setupText = localizeCp006Setup(caselet, locale);
  const clueTexts = Object.freeze(caselet.clueTexts.map((clue) => localizeCp006ClueText(clue, caselet.people, locale)));
  const sharedExplanation = localizeCp006SharedExplanation(caselet, locale);
  const teachingSkeleton = cp006TeachingSkeleton(caselet.sharedExplanation);
  const diagramText = localizeCp006DiagramText(caselet, locale);
  const children = caselet.children.map((child) => localizedChild(child, caselet, locale)) as unknown as Sea002Cp006LocalizedReviewCaselet["children"];
  const canonicalParityFingerprint = cp006CanonicalParityFingerprint(caselet);
  const canonicalContentFingerprint = canonicalDigest({
    setupText: caselet.setupText,
    clueTexts: caselet.clueTexts,
    sharedExplanation: caselet.sharedExplanation,
    diagramText: caselet.diagramText,
    children: caselet.children,
  });
  const presentationFingerprint = canonicalDigest({ locale, setupText, clueTexts, sharedExplanation, teachingSkeleton, diagramText, children });
  return Object.freeze({
    locale,
    canonicalLocale: "en-IN" as const,
    canonicalCaseletId: caselet.caseletId,
    checkpointId: "SEA-CP-006" as const,
    blueprintAuthorityId: caselet.blueprintAuthorityId,
    permanentQlId: SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL[caselet.blueprintAuthorityId],
    canonicalParityFingerprint,
    canonicalContentFingerprint,
    localizationAuthority: SEA002_CP006_LOCALIZATION_AUTHORITY,
    localizationStatus: "EXECUTABLE_EXPLANATION_PARITY_HUMAN_REVIEW_REQUIRED" as const,
    humanLanguageReviewRequired: true as const,
    activeEditorialBlockers: [SEA002_CP006_LOCALIZATION_HUMAN_REVIEW_BLOCKER] as const,
    productDeliveryUnlocked: false as const,
    productionStagingApproved: false as const,
    setupText,
    clueTexts,
    sharedExplanation,
    teachingSkeleton,
    diagramText,
    children,
    presentationFingerprint,
  });
}
