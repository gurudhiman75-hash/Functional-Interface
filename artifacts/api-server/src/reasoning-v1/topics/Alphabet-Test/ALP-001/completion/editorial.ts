import type { AlpDistractorAnalysis, AlpLocale, AlpOption, AlpQuestionLogic } from "../types";
import { digit, letter, rank, shift, symbol, vowel, type C } from "./shared";

export interface CompletionEditorial {
  stem: string;
  coreConcept: string;
  ruleStatement: string;
  steps: readonly string[];
  visualWorking: readonly string[];
  examShortcut: string;
  conclusion: string;
  distractorAnalyses: readonly AlpDistractorAnalysis[];
  closestTrapRejection: string;
}

const tx = (locale: AlpLocale, en: string, hi: string, pa: string) => locale === "hi-IN" ? hi : locale === "pa-IN" ? pa : en;
const spaced = (items: readonly string[]) => items.join(" ");
const joined = (items: readonly string[]) => items.join("");
const num = (value: string, fallback = 1) => Number(value.match(/\d+/)?.[0] ?? fallback);
const ord = (value: number) => {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  return `${value}${value % 10 === 1 ? "st" : value % 10 === 2 ? "nd" : value % 10 === 3 ? "rd" : "th"}`;
};

function classIntermediate(c: C): string[] {
  const rule = c.operation.en;
  if (rule.includes("vowels by the next letter and consonants by the previous letter")) return c.source.map((x) => shift(x, vowel(x) ? 1 : -1));
  if (rule.includes("keep vowels unchanged and replace consonants by the next letter")) return c.source.map((x) => vowel(x) ? x : shift(x, 1));
  if (rule.includes("vowels by the previous letter and keep consonants unchanged")) return c.source.map((x) => vowel(x) ? shift(x, -1) : x);
  if (rule.includes("odd-ranked letters by the next letter")) return c.source.map((x) => rank(x) % 2 ? shift(x, 1) : x);
  return c.changed ?? c.source;
}

function pairRows(items: readonly string[], value: (x: string) => number, direction: "BOTH" | "FORWARD" | "BACKWARD" = "BOTH") {
  const out: Array<{ a: string; b: string; gap: number }> = [];
  for (let i = 0; i < items.length; i += 1) for (let j = i + 1; j < items.length; j += 1) {
    const first = items[i]!;
    const second = items[j]!;
    const forward = value(first) < value(second);
    if (direction === "FORWARD" && !forward || direction === "BACKWARD" && forward) continue;
    const rowGap = j - i - 1;
    const naturalGap = Math.abs(value(first) - value(second)) - 1;
    if (rowGap === naturalGap) out.push({ a: first, b: second, gap: rowGap });
  }
  return out;
}

function direction(mode: string): "BOTH" | "FORWARD" | "BACKWARD" {
  return mode.includes("FORWARD") ? "FORWARD" : mode.includes("BACKWARD") ? "BACKWARD" : "BOTH";
}

function stem(ql: AlpQuestionLogic, c: C, locale: AlpLocale): string {
  const m = ql.solveMode;
  const word = c.word ?? joined(c.source);
  const sequence = spaced(c.source);
  const number = joined(c.source);
  const p = num(c.query.en);
  const firstTarget = c.query.en.match(/first\s+([A-Z])/i)?.[1];
  const digitTarget = c.query.en.match(/position of\s+(\d)/i)?.[1];

  if (m === "COUNT_WORD_ALPHA_PAIRS_BOTH") return tx(locale,
    `How many pairs of letters are there in the word ${word}, each having as many letters between them in the word as in the English alphabet, in either forward or backward order?`,
    `शब्द ${word} में अक्षरों के ऐसे कितने युग्म हैं जिनके बीच शब्द में उतने ही अक्षर हैं जितने अंग्रेज़ी वर्णमाला में, चाहे क्रम आगे का हो या पीछे का?`,
    `ਸ਼ਬਦ ${word} ਵਿੱਚ ਅੱਖਰਾਂ ਦੇ ਅਜੇਹੇ ਕਿੰਨੇ ਜੋੜੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਸ਼ਬਦ ਵਿੱਚ ਉਤਨੇ ਹੀ ਅੱਖਰ ਹਨ ਜਿੰਨੇ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ, ਭਾਵੇਂ ਕ੍ਰਮ ਅੱਗੇ ਦਾ ਹੋਵੇ ਜਾਂ ਪਿੱਛੇ ਦਾ?`);
  if (m === "COUNT_WORD_ALPHA_PAIRS_FORWARD" || m === "COUNT_WORD_ALPHA_PAIRS_BACKWARD") {
    const backward = m.includes("BACKWARD");
    return tx(locale,
      `How many pairs of letters in the word ${word} have equal word and alphabet gaps, with the letters appearing in ${backward ? "reverse" : "forward"} alphabetical order?`,
      `शब्द ${word} में अक्षरों के ऐसे कितने युग्म हैं जिनका शब्द-अंतर और वर्णमाला-अंतर समान है तथा अक्षर वर्णमाला के ${backward ? "उलटे" : "आगे वाले"} क्रम में हैं?`,
      `ਸ਼ਬਦ ${word} ਵਿੱਚ ਅੱਖਰਾਂ ਦੇ ਅਜੇਹੇ ਕਿੰਨੇ ਜੋੜੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦਾ ਸ਼ਬਦ-ਫਰਕ ਅਤੇ ਵਰਣਮਾਲਾ-ਫਰਕ ਇੱਕੋ ਹੈ ਅਤੇ ਅੱਖਰ ਵਰਣਮਾਲਾ ਦੇ ${backward ? "ਉਲਟ" : "ਅੱਗੇ ਵਾਲੇ"} ਕ੍ਰਮ ਵਿੱਚ ਹਨ?`);
  }
  if (m === "IDENTIFY_WORD_ALPHA_PAIR") return tx(locale,
    `Which pair of letters in the word ${word} has the same number of letters between its members in the word as in the English alphabet?`,
    `शब्द ${word} में किस अक्षर-युग्म के दोनों अक्षरों के बीच शब्द में उतने ही अक्षर हैं जितने अंग्रेज़ी वर्णमाला में?`,
    `ਸ਼ਬਦ ${word} ਵਿੱਚ ਕਿਸ ਅੱਖਰ-ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਅੱਖਰਾਂ ਵਿਚਕਾਰ ਸ਼ਬਦ ਵਿੱਚ ਉਤਨੇ ਹੀ ਅੱਖਰ ਹਨ ਜਿੰਨੇ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ?`);
  if (m === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") return tx(locale,
    `Which option contains exactly ${p} pairs of letters having equal gaps in the word and in the English alphabet?`,
    `किस विकल्प में अक्षरों के ठीक ${p} ऐसे युग्म हैं जिनका शब्द-अंतर और वर्णमाला-अंतर समान है?`,
    `ਕਿਹੜੀ ਚੋਣ ਵਿੱਚ ਅੱਖਰਾਂ ਦੇ ਠੀਕ ${p} ਅਜੇਹੇ ਜੋੜੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦਾ ਸ਼ਬਦ-ਫਰਕ ਅਤੇ ਵਰਣਮਾਲਾ-ਫਰਕ ਇੱਕੋ ਹੈ?`);
  if (m === "COUNT_WORD_ALPHA_PAIRS_AFTER_REVERSE") return tx(locale,
    `If the letters of ${word} are written in reverse order, how many letter pairs in the new word will have equal word and alphabet gaps?`,
    `यदि ${word} के अक्षरों को उलटे क्रम में लिखा जाए, तो बने शब्द में अक्षरों के ऐसे कितने युग्म होंगे जिनका शब्द-अंतर और वर्णमाला-अंतर समान है?`,
    `ਜੇ ${word} ਦੇ ਅੱਖਰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖੇ ਜਾਣ, ਤਾਂ ਬਣੇ ਸ਼ਬਦ ਵਿੱਚ ਅੱਖਰਾਂ ਦੇ ਅਜੇਹੇ ਕਿੰਨੇ ਜੋੜੇ ਹੋਣਗੇ ਜਿਨ੍ਹਾਂ ਦਾ ਸ਼ਬਦ-ਫਰਕ ਅਤੇ ਵਰਣਮਾਲਾ-ਫਰਕ ਇੱਕੋ ਹੈ?`);

  if (m.startsWith("CLASS_")) {
    const baseEn = `In the word ${word}, if ${c.operation.en}`;
    const baseHi = `शब्द ${word} में यदि ${c.operation.hi}`;
    const basePa = `ਸ਼ਬਦ ${word} ਵਿੱਚ ਜੇ ${c.operation.pa}`;
    if (m === "CLASS_SHIFT_TRANSFORMED_WORD") return tx(locale, `${baseEn}, which new word is obtained?`, `${baseHi}, तो कौन-सा नया शब्द बनेगा?`, `${basePa}, ਤਾਂ ਕਿਹੜਾ ਨਵਾਂ ਸ਼ਬਦ ਬਣੇਗਾ?`);
    if (m === "CLASS_SHIFT_COUNT_UNCHANGED") return tx(locale, `${baseEn}, how many letters remain unchanged in their original positions?`, `${baseHi}, तो कितने अक्षर अपने मूल स्थान पर बिना बदले रहेंगे?`, `${basePa}, ਤਾਂ ਕਿੰਨੇ ਅੱਖਰ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਬਿਨਾਂ ਬਦਲੇ ਰਹਿਣਗੇ?`);
    if (m === "CLASS_SHIFT_COUNT_VOWELS") return tx(locale, `${baseEn}, how many vowels will the resulting word contain?`, `${baseHi}, तो बने शब्द में कितने स्वर होंगे?`, `${basePa}, ਤਾਂ ਬਣੇ ਸ਼ਬਦ ਵਿੱਚ ਕਿੰਨੇ ਸਵਰ ਹੋਣਗੇ?`);
    if (m === "CLASS_SHIFT_SORTED_LETTER_AT_POSITION") return tx(locale, `${baseEn} and the resulting letters are then arranged alphabetically, which letter will be ${ord(p)} from the left?`, `${baseHi} और फिर प्राप्त अक्षरों को वर्णमाला क्रम में सजाया जाए, तो बाईं ओर से स्थान संख्या ${p} पर कौन-सा अक्षर होगा?`, `${basePa} ਅਤੇ ਫਿਰ ਮਿਲੇ ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਕ੍ਰਮ ਵਿੱਚ ਲਾਇਆ ਜਾਵੇ, ਤਾਂ ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੋਵੇਗਾ?`);
    if (m === "CLASS_SHIFT_SORTED_POSITION_OF_LETTER") return tx(locale, `${baseEn} and the resulting letters are then arranged alphabetically, what is the first position of ${firstTarget ?? c.answer} from the left?`, `${baseHi} और फिर प्राप्त अक्षरों को वर्णमाला क्रम में सजाया जाए, तो पहला ${firstTarget ?? c.answer} बाईं ओर से किस स्थान पर होगा?`, `${basePa} ਅਤੇ ਫਿਰ ਮਿਲੇ ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਕ੍ਰਮ ਵਿੱਚ ਲਾਇਆ ਜਾਵੇ, ਤਾਂ ਪਹਿਲਾ ${firstTarget ?? c.answer} ਖੱਬੇ ਪਾਸੋਂ ਕਿਹੜੀ ਥਾਂ ਉੱਤੇ ਹੋਵੇਗਾ?`);
    if (m === "CLASS_OPPOSITE_LETTER_AT_POSITION") return tx(locale,
      `In ${word}, if each vowel is replaced by its opposite letter in the English alphabet while consonants remain unchanged, which letter will be ${ord(p)} from the left?`,
      `${word} में यदि प्रत्येक स्वर को अंग्रेज़ी वर्णमाला के उसके विपरीत अक्षर से बदला जाए और व्यंजन न बदले जाएँ, तो बाईं ओर से स्थान संख्या ${p} पर कौन-सा अक्षर होगा?`,
      `${word} ਵਿੱਚ ਜੇ ਹਰ ਸਵਰ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਦੇ ਉਸਦੇ ਉਲਟ ਅੱਖਰ ਨਾਲ ਬਦਲਿਆ ਜਾਵੇ ਅਤੇ ਵਿਅੰਜਨ ਨਾ ਬਦਲੇ ਜਾਣ, ਤਾਂ ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੋਵੇਗਾ?`);
    if (m === "CLASS_TWO_STAGE_LETTER_AT_POSITION") return tx(locale, `${baseEn}. If the result is then reversed, which letter will be ${ord(p)} from the left?`, `${baseHi}। फिर परिणाम उलटने पर बाईं ओर से स्थान संख्या ${p} पर कौन-सा अक्षर होगा?`, `${basePa}। ਫਿਰ ਨਤੀਜਾ ਉਲਟਣ ਉੱਤੇ ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੋਵੇਗਾ?`);
    return tx(locale, `${baseEn}, which letter will be ${ord(p)} from the left?`, `${baseHi}, तो बाईं ओर से स्थान संख्या ${p} पर कौन-सा अक्षर होगा?`, `${basePa}, ਤਾਂ ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੋਵੇਗਾ?`);
  }

  if (m === "DIGIT_AT_LEFT_POSITION" || m === "DIGIT_AT_RIGHT_POSITION") {
    const end = m.includes("LEFT") ? "left" : "right";
    return tx(locale, `Which digit is ${ord(p)} from the ${end} end of ${number}?`, `संख्या ${number} में ${end === "left" ? "बाईं" : "दाईं"} ओर से स्थान संख्या ${p} पर कौन-सा अंक है?`, `ਸੰਖਿਆ ${number} ਵਿੱਚ ${end === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਅੰਕ ਹੈ?`);
  }
  if (m === "DIGIT_LEFT_POSITION" || m === "DIGIT_RIGHT_POSITION") {
    const end = m.includes("LEFT") ? "left" : "right";
    return tx(locale, `What is the position of digit ${digitTarget} from the ${end} end of ${number}?`, `संख्या ${number} में अंक ${digitTarget} का ${end === "left" ? "बाईं" : "दाईं"} ओर से कौन-सा स्थान है?`, `ਸੰਖਿਆ ${number} ਵਿੱਚ ਅੰਕ ${digitTarget} ਦੀ ${end === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੋਂ ਕਿਹੜੀ ਥਾਂ ਹੈ?`);
  }
  if (m === "COUNT_DIGIT_GAP_PAIRS" || m === "IDENTIFY_DIGIT_GAP_PAIR") return tx(locale,
    `${m.startsWith("COUNT") ? "How many" : "Which"} digit pair${m.startsWith("COUNT") ? "s" : ""} in ${number} ${m.startsWith("COUNT") ? "have" : "has"} the same number of digits between its members in the number as in the natural number sequence?`,
    `संख्या ${number} में ${m.startsWith("COUNT") ? "अंकों के ऐसे कितने युग्म हैं" : "किस अंक-युग्म के दोनों अंकों के बीच"} संख्या और प्राकृतिक क्रम में समान अंतर है?`,
    `ਸੰਖਿਆ ${number} ਵਿੱਚ ${m.startsWith("COUNT") ? "ਅੰਕਾਂ ਦੇ ਅਜੇਹੇ ਕਿੰਨੇ ਜੋੜੇ ਹਨ" : "ਕਿਸ ਅੰਕ-ਜੋੜੇ ਦੇ ਦੋਵੇਂ ਅੰਕਾਂ ਵਿਚਕਾਰ"} ਸੰਖਿਆ ਅਤੇ ਕੁਦਰਤੀ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕੋ ਫਰਕ ਹੈ?`);
  if (m.startsWith("DIGIT_AFTER_") || m.startsWith("DIGIT_COUNT_UNCHANGED")) {
    const action = m.includes("ASC") ? ["arranged from smallest to largest", "छोटे से बड़े क्रम में सजाया", "ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਇਆ"] : m.includes("DESC") ? ["arranged from largest to smallest", "बड़े से छोटे क्रम में सजाया", "ਵੱਡੇ ਤੋਂ ਛੋਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਇਆ"] : m.includes("REVERSE") ? ["written in reverse order", "उलटे क्रम में लिखा", "ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਿਆ"] : m.includes("ADJACENT") ? ["interchanged in adjacent pairs", "साथ वाले युग्मों में बदला", "ਨਾਲ ਵਾਲੇ ਜੋੜਿਆਂ ਵਿੱਚ ਬਦਲਿਆ"] : [c.query.en.match(/apply\s+(ASC|DESC|REV|SWAP)/)?.[1] ?? "rearranged", "दिए नियम से बदला", "ਦਿੱਤੇ ਨਿਯਮ ਨਾਲ ਬਦਲਿਆ"];
    if (m.includes("COUNT_UNCHANGED")) return tx(locale, `If the digits of ${number} are ${action[0]}, how many remain in their original positions?`, `यदि ${number} के अंकों को ${action[1]} जाए, तो कितने अंक अपने मूल स्थान पर रहेंगे?`, `ਜੇ ${number} ਦੇ ਅੰਕਾਂ ਨੂੰ ${action[2]} ਜਾਵੇ, ਤਾਂ ਕਿੰਨੇ ਅੰਕ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿਣਗੇ?`);
    return tx(locale, `If the digits of ${number} are ${action[0]}, which digit will be ${ord(p)} from the left?`, `यदि ${number} के अंकों को ${action[1]} जाए, तो बाईं ओर से स्थान संख्या ${p} पर कौन-सा अंक होगा?`, `ਜੇ ${number} ਦੇ ਅੰਕਾਂ ਨੂੰ ${action[2]} ਜਾਵੇ, ਤਾਂ ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਅੰਕ ਹੋਵੇਗਾ?`);
  }

  if (m.startsWith("MIXED_ELEMENT_")) return tx(locale, `Study the sequence ${sequence}. Which element is ${ord(p)} from the ${m.includes("LEFT") ? "left" : "right"} end?`, `श्रृंखला ${sequence} को देखें। ${m.includes("LEFT") ? "बाईं" : "दाईं"} ओर से स्थान संख्या ${p} पर कौन-सा चिह्न है?`, `ਲੜੀ ${sequence} ਨੂੰ ਵੇਖੋ। ${m.includes("LEFT") ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੈ?`);
  if (m.startsWith("MIXED_RELATIVE_")) {
    const x = c.query.en.match(/(\d+)\s+(right|left)\s+of\s+(\d+)\s+from\s+(right|left)/i);
    const offset = Number(x?.[1] ?? 1), move = x?.[2] ?? "right", anchor = Number(x?.[3] ?? 1), end = x?.[4] ?? "left";
    return tx(locale, `Study the sequence ${sequence}. Which element is ${offset} places to the ${move} of the ${ord(anchor)} element from the ${end} end?`, `श्रृंखला ${sequence} को देखें। ${end === "left" ? "बाईं" : "दाईं"} ओर से स्थान संख्या ${anchor} वाले चिह्न से ${offset} स्थान ${move === "right" ? "दाईं" : "बाईं"} ओर कौन-सा चिह्न है?`, `ਲੜੀ ${sequence} ਨੂੰ ਵੇਖੋ। ${end === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${anchor} ਵਾਲੇ ਚਿੰਨ੍ਹ ਤੋਂ ${offset} ਥਾਵਾਂ ${move === "right" ? "ਸੱਜੇ" : "ਖੱਬੇ"} ਪਾਸੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੈ?`);
  }
  const adjacency: Record<string, [string, string, string]> = {
    COUNT_LETTER_FOLLOWED_BY_SYMBOL: ["letters are immediately followed by a symbol", "अक्षरों के तुरंत बाद कोई प्रतीक है", "ਅੱਖਰਾਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਕੋਈ ਨਿਸ਼ਾਨ ਹੈ"],
    COUNT_SYMBOL_PRECEDED_BY_LETTER: ["symbols are immediately preceded by a letter", "प्रतीकों के ठीक पहले कोई अक्षर है", "ਨਿਸ਼ਾਨਾਂ ਦੇ ਠੀਕ ਪਹਿਲਾਂ ਕੋਈ ਅੱਖਰ ਹੈ"],
    COUNT_DIGIT_FOLLOWED_BY_LETTER: ["digits are immediately followed by a letter", "अंकों के तुरंत बाद कोई अक्षर है", "ਅੰਕਾਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਕੋਈ ਅੱਖਰ ਹੈ"],
    COUNT_LETTER_PRECEDED_BY_DIGIT: ["letters are immediately preceded by a digit", "अक्षरों के ठीक पहले कोई अंक है", "ਅੱਖਰਾਂ ਦੇ ਠੀਕ ਪਹਿਲਾਂ ਕੋਈ ਅੰਕ ਹੈ"],
    COUNT_VOWEL_FOLLOWED_BY_DIGIT: ["vowels are immediately followed by a digit", "स्वरों के तुरंत बाद कोई अंक है", "ਸਵਰਾਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਕੋਈ ਅੰਕ ਹੈ"],
    COUNT_EVEN_DIGIT_PRECEDED_BY_SYMBOL: ["even digits are immediately preceded by a symbol", "सम अंकों के ठीक पहले कोई प्रतीक है", "ਜਿਸਤ ਅੰਕਾਂ ਦੇ ਠੀਕ ਪਹਿਲਾਂ ਕੋਈ ਨਿਸ਼ਾਨ ਹੈ"],
  };
  if (adjacency[m]) return tx(locale, `In the sequence ${sequence}, how many ${adjacency[m]![0]}?`, `श्रृंखला ${sequence} में कितने ${adjacency[m]![1]}?`, `ਲੜੀ ${sequence} ਵਿੱਚ ਕਿੰਨੇ ${adjacency[m]![2]}?`);
  if (m === "NTH_LETTER_FROM_LEFT" || m === "NTH_SYMBOL_FROM_RIGHT") {
    const kind = m.includes("LETTER") ? ["letter", "अक्षर", "ਅੱਖਰ"] : ["symbol", "प्रतीक", "ਨਿਸ਼ਾਨ"];
    const end = m.includes("LEFT") ? ["left", "बाईं", "ਖੱਬੇ"] : ["right", "दाईं", "ਸੱਜੇ"];
    return tx(locale, `In ${sequence}, which is the ${ord(p)} ${kind[0]} from the ${end[0]} when only ${kind[0]}s are counted?`, `श्रृंखला ${sequence} में केवल ${kind[1]} गिनने पर ${end[1]} ओर से स्थान संख्या ${p} पर कौन-सा ${kind[1]} है?`, `ਲੜੀ ${sequence} ਵਿੱਚ ਕੇਵਲ ${kind[2]} ਗਿਣਨ ਉੱਤੇ ${end[2]} ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ${kind[2]} ਹੈ?`);
  }

  const prefix = [`Study the sequence ${sequence}.`, `श्रृंखला ${sequence} को ध्यान से देखें।`, `ਲੜੀ ${sequence} ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖੋ।`];
  const operation = c.operation.en.replace(/^apply the explicit mixed-row operation:\s*/i, "");
  const target = c.query.en.match(/position of\s+([^\s]+)/)?.[1];
  const cp10: Record<string, [string, string, string]> = {
    MIXED_GROUP_LETTERS_DIGITS_SYMBOLS_POSITION: [`Place all letters first, digits next and symbols last, retaining order within each group. Which element is ${ord(p)} from the left?`, `पहले सभी अक्षर, फिर अंक और अंत में प्रतीक रखते हुए हर समूह का क्रम बनाए रखें। बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `ਪਹਿਲਾਂ ਸਾਰੇ ਅੱਖਰ, ਫਿਰ ਅੰਕ ਅਤੇ ਅੰਤ ਵਿੱਚ ਨਿਸ਼ਾਨ ਰੱਖਦਿਆਂ ਹਰ ਸਮੂਹ ਦਾ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ। ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`],
    MIXED_GROUP_SYMBOLS_DIGITS_LETTERS_POSITION: [`Place all symbols first, digits next and letters last, retaining order within each group. Which element is ${ord(p)} from the left?`, `पहले सभी प्रतीक, फिर अंक और अंत में अक्षर रखते हुए हर समूह का क्रम बनाए रखें। बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `ਪਹਿਲਾਂ ਸਾਰੇ ਨਿਸ਼ਾਨ, ਫਿਰ ਅੰਕ ਅਤੇ ਅੰਤ ਵਿੱਚ ਅੱਖਰ ਰੱਖਦਿਆਂ ਹਰ ਸਮੂਹ ਦਾ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ। ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`],
    MIXED_SORT_LETTERS_IN_PLACE_POSITION: [`Arrange only the letters alphabetically, leaving digits and symbols fixed. Which element is ${ord(p)} from the left?`, `केवल अक्षरों को वर्णमाला क्रम में सजाएँ और अंक तथा प्रतीक स्थिर रखें। बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `ਕੇਵਲ ਅੱਖਰਾਂ ਨੂੰ ਵਰਣਮਾਲਾ ਕ੍ਰਮ ਵਿੱਚ ਲਾਓ ਅਤੇ ਅੰਕ ਤੇ ਨਿਸ਼ਾਨ ਅਡੋਲ ਰੱਖੋ। ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`],
    MIXED_SORT_DIGITS_IN_PLACE_POSITION: [`Arrange only the digits from smallest to largest, leaving letters and symbols fixed. Which element is ${ord(p)} from the left?`, `केवल अंकों को छोटे से बड़े क्रम में सजाएँ और अक्षर तथा प्रतीक स्थिर रखें। बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `ਕੇਵਲ ਅੰਕਾਂ ਨੂੰ ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਓ ਅਤੇ ਅੱਖਰ ਤੇ ਨਿਸ਼ਾਨ ਅਡੋਲ ਰੱਖੋ। ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`],
    MIXED_REVERSE_LETTERS_IN_PLACE_POSITION: [`Reverse only the letters within the letter positions, leaving other elements fixed. Which element is ${ord(p)} from the left?`, `केवल अक्षरों का क्रम अक्षर वाले स्थानों में उलटें और अन्य चिह्न स्थिर रखें। बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `ਕੇਵਲ ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਅੱਖਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਉਲਟੋ ਅਤੇ ਹੋਰ ਚਿੰਨ੍ਹ ਅਡੋਲ ਰੱਖੋ। ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`],
    MIXED_REVERSE_DIGITS_IN_PLACE_POSITION: [`Reverse only the digits within the digit positions, leaving other elements fixed. Which element is ${ord(p)} from the left?`, `केवल अंकों का क्रम अंक वाले स्थानों में उलटें और अन्य चिह्न स्थिर रखें। बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `ਕੇਵਲ ਅੰਕਾਂ ਦਾ ਕ੍ਰਮ ਅੰਕ ਵਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਉਲਟੋ ਅਤੇ ਹੋਰ ਚਿੰਨ੍ਹ ਅਡੋਲ ਰੱਖੋ। ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`],
    MIXED_SWAP_ADJACENT_POSITION: [`Interchange the 1st element with the 2nd, the 3rd with the 4th, and so on. Which element is ${ord(p)} from the left?`, `पहला चिह्न दूसरे से, तीसरा चौथे से और इसी प्रकार आगे बदलें। बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `ਪਹਿਲਾ ਚਿੰਨ੍ਹ ਦੂਜੇ ਨਾਲ, ਤੀਜਾ ਚੌਥੇ ਨਾਲ ਅਤੇ ਇਸੇ ਤਰ੍ਹਾਂ ਅੱਗੇ ਬਦਲੋ। ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`],
    MIXED_REVERSE_ALL_POSITION: [`Reverse the complete sequence. Which element is ${ord(p)} from the left?`, `पूरी श्रृंखला उलटें। बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `ਪੂਰੀ ਲੜੀ ਉਲਟੋ। ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`],
    MIXED_POSITION_OF_TOKEN_AFTER_GROUP: [`Place letters first, digits next and symbols last without changing internal order. What is the position of ${target} from the left?`, `अक्षर पहले, अंक फिर और प्रतीक अंत में रखें तथा आपसी क्रम न बदलें। ${target} का बाईं ओर से कौन-सा स्थान होगा?`, `ਅੱਖਰ ਪਹਿਲਾਂ, ਅੰਕ ਫਿਰ ਅਤੇ ਨਿਸ਼ਾਨ ਅੰਤ ਵਿੱਚ ਰੱਖੋ ਅਤੇ ਆਪਸੀ ਕ੍ਰਮ ਨਾ ਬਦਲੋ। ${target} ਦੀ ਖੱਬੇ ਪਾਸੋਂ ਕਿਹੜੀ ਥਾਂ ਹੋਵੇਗੀ?`],
    MIXED_COUNT_ADJACENCY_AFTER_TRANSFORM: [`Place symbols first, letters next and digits last without changing internal order. How many letters are immediately followed by a digit?`, `प्रतीक पहले, अक्षर फिर और अंक अंत में रखें तथा आपसी क्रम न बदलें। कितने अक्षरों के तुरंत बाद कोई अंक होगा?`, `ਨਿਸ਼ਾਨ ਪਹਿਲਾਂ, ਅੱਖਰ ਫਿਰ ਅਤੇ ਅੰਕ ਅੰਤ ਵਿੱਚ ਰੱਖੋ ਅਤੇ ਆਪਸੀ ਕ੍ਰਮ ਨਾ ਬਦਲੋ। ਕਿੰਨੇ ਅੱਖਰਾਂ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਕੋਈ ਅੰਕ ਹੋਵੇਗਾ?`],
  };
  if (m === "MIXED_REMOVE_CATEGORY_POSITION") {
    const code = operation.match(/remove category\s+([LDS])/i)?.[1] ?? "L";
    const kinds = code === "L" ? ["letters", "अक्षर", "ਅੱਖਰ"] : code === "D" ? ["digits", "अंक", "ਅੰਕ"] : ["symbols", "प्रतीक", "ਨਿਸ਼ਾਨ"];
    return tx(locale, `${prefix[0]} Remove all ${kinds[0]}. Which element is ${ord(p)} from the left in the remaining sequence?`, `${prefix[1]} सभी ${kinds[1]} हटा दें। बची श्रृंखला में बाईं ओर से स्थान संख्या ${p} पर कौन-सा चिह्न होगा?`, `${prefix[2]} ਸਾਰੇ ${kinds[2]} ਹਟਾ ਦਿਓ। ਬਚੀ ਲੜੀ ਵਿੱਚ ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ਨੰਬਰ ${p} ਉੱਤੇ ਕਿਹੜਾ ਚਿੰਨ੍ਹ ਹੋਵੇਗਾ?`);
  }
  if (m === "MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM") return tx(locale, `${prefix[0]} After the stated rearrangement (${operation}), how many elements remain in their original positions?`, `${prefix[1]} दिए गए पुनर्व्यवस्थापन के बाद कितने चिह्न अपने मूल स्थान पर रहेंगे?`, `${prefix[2]} ਦਿੱਤੀ ਮੁੜ-ਵਿਵਸਥਾ ਤੋਂ ਬਾਅਦ ਕਿੰਨੇ ਚਿੰਨ੍ਹ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿਣਗੇ?`);
  const q = cp10[m] ?? ["Apply the stated rearrangement and find the result.", "दिया पुनर्व्यवस्थापन करके परिणाम ज्ञात करें।", "ਦਿੱਤੀ ਮੁੜ-ਵਿਵਸਥਾ ਕਰਕੇ ਨਤੀਜਾ ਕੱਢੋ।"];
  return tx(locale, `${prefix[0]} ${q[0]}`, `${prefix[1]} ${q[1]}`, `${prefix[2]} ${q[2]}`);
}

function concept(ql: AlpQuestionLogic, locale: AlpLocale): string {
  const cp = Number(ql.checkpointId.slice(-3));
  const texts: Record<number, [string, string, string]> = {
    6: ["A valid letter pair has the same internal gap in the word and in the English alphabet; direction is checked only when the question restricts it.", "सही अक्षर-युग्म का भीतरी अंतर शब्द और अंग्रेज़ी वर्णमाला में समान होता है; दिशा तभी जाँचें जब प्रश्न उसे सीमित करे।", "ਸਹੀ ਅੱਖਰ-ਜੋੜੇ ਦਾ ਅੰਦਰਲਾ ਫਰਕ ਸ਼ਬਦ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਵਿੱਚ ਇੱਕੋ ਹੁੰਦਾ ਹੈ; ਦਿਸ਼ਾ ਕੇਵਲ ਉਸ ਵੇਲੇ ਜਾਂਚੋ ਜਦੋਂ ਪ੍ਰਸ਼ਨ ਉਸਨੂੰ ਸੀਮਿਤ ਕਰੇ।"],
    7: ["Apply the stated replacement separately to every letter, and complete that stage before sorting, reversing, counting or reading a position.", "दिया बदलाव हर अक्षर पर अलग-अलग लगाएँ और क्रमबद्ध करने, उलटने, गिनने या स्थान पढ़ने से पहले यह चरण पूरा करें।", "ਦਿੱਤਾ ਬਦਲਾਅ ਹਰ ਅੱਖਰ ਉੱਤੇ ਵੱਖ-ਵੱਖ ਲਗਾਓ ਅਤੇ ਕ੍ਰਮ ਲਗਾਉਣ, ਉਲਟਣ, ਗਿਣਨ ਜਾਂ ਥਾਂ ਪੜ੍ਹਨ ਤੋਂ ਪਹਿਲਾਂ ਇਹ ਪੜਾਅ ਪੂਰਾ ਕਰੋ।"],
    8: ["Treat the displayed digits as one fixed positional sequence; complete any named rearrangement before reading a digit or counting unchanged positions.", "दिखाए अंकों को एक निश्चित स्थान-क्रम मानें; कोई अंक पढ़ने या बिना बदले स्थान गिनने से पहले दिया पुनर्व्यवस्थापन पूरा करें।", "ਦਿੱਤੇ ਅੰਕਾਂ ਨੂੰ ਇੱਕ ਨਿਸ਼ਚਿਤ ਥਾਂ-ਕ੍ਰਮ ਮੰਨੋ; ਕੋਈ ਅੰਕ ਪੜ੍ਹਨ ਜਾਂ ਬਿਨਾਂ ਬਦਲੀਆਂ ਥਾਵਾਂ ਗਿਣਨ ਤੋਂ ਪਹਿਲਾਂ ਦੱਸੀ ਮੁੜ-ਵਿਵਸਥਾ ਪੂਰੀ ਕਰੋ।"],
    9: ["Letters, digits and symbols share one sequence. Retain every element while counting from an end or checking only the requested neighbouring relationship.", "अक्षर, अंक और प्रतीक एक ही श्रृंखला में हैं। किसी सिरे से गिनते या माँगा साथ वाला संबंध जाँचते समय सभी चिह्न बनाए रखें।", "ਅੱਖਰ, ਅੰਕ ਅਤੇ ਨਿਸ਼ਾਨ ਇੱਕੋ ਲੜੀ ਵਿੱਚ ਹਨ। ਕਿਸੇ ਸਿਰੇ ਤੋਂ ਗਿਣਦਿਆਂ ਜਾਂ ਮੰਗਿਆ ਨਾਲ ਵਾਲਾ ਸੰਬੰਧ ਜਾਂਚਦਿਆਂ ਸਾਰੇ ਚਿੰਨ੍ਹ ਬਣਾਈ ਰੱਖੋ।"],
    10: ["Construct the complete final sequence first. Positions, unchanged places and adjacent relationships must be checked only after the rearrangement is finished.", "पहले पूरी अंतिम श्रृंखला बनाएँ। स्थान, बिना बदले जगह और साथ वाले संबंध पुनर्व्यवस्थापन पूरा होने के बाद ही जाँचें।", "ਪਹਿਲਾਂ ਪੂਰੀ ਅੰਤਿਮ ਲੜੀ ਬਣਾਓ। ਥਾਵਾਂ, ਬਿਨਾਂ ਬਦਲੀਆਂ ਜਗ੍ਹਾਂ ਅਤੇ ਨਾਲ ਵਾਲੇ ਸੰਬੰਧ ਮੁੜ-ਵਿਵਸਥਾ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹੀ ਜਾਂਚੋ।"],
  };
  const x = texts[cp] ?? texts[10]!;
  return tx(locale, x[0], x[1], x[2]);
}

function rule(ql: AlpQuestionLogic, c: C, locale: AlpLocale): string {
  const cp = Number(ql.checkpointId.slice(-3));
  if (cp === 6) return tx(locale, "Compare the number of items strictly between each pair in the word with the number strictly between the same letters in the alphabet.", "हर युग्म के बीच शब्द में आने वाले अक्षरों की संख्या को वर्णमाला में उन्हीं अक्षरों के बीच आने वाले अक्षरों की संख्या से मिलाएँ।", "ਹਰ ਜੋੜੇ ਦੇ ਵਿਚਕਾਰ ਸ਼ਬਦ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਵਰਣਮਾਲਾ ਵਿੱਚ ਉਹਨਾਂ ਹੀ ਅੱਖਰਾਂ ਦੇ ਵਿਚਕਾਰ ਆਉਣ ਵਾਲੇ ਅੱਖਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਮਿਲਾਓ।");
  if (cp === 7) return tx(locale, `Apply this rule to every letter: ${c.operation.en}.`, `हर अक्षर पर यह नियम लगाएँ: ${c.operation.hi}।`, `ਹਰ ਅੱਖਰ ਉੱਤੇ ਇਹ ਨਿਯਮ ਲਗਾਓ: ${c.operation.pa}।`);
  if (cp === 8) return tx(locale, "Count positions from 1 at the named end and preserve the displayed order unless the question explicitly changes it.", "बताए सिरे पर पहला स्थान 1 मानें और जब तक प्रश्न क्रम न बदले, अंकों का दिखाया क्रम बनाए रखें।", "ਦੱਸੇ ਸਿਰੇ ਉੱਤੇ ਪਹਿਲੀ ਥਾਂ 1 ਮੰਨੋ ਅਤੇ ਜਦੋਂ ਤੱਕ ਪ੍ਰਸ਼ਨ ਕ੍ਰਮ ਨਾ ਬਦਲੇ, ਅੰਕਾਂ ਦਾ ਦਿੱਤਾ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ।");
  if (cp === 9) return tx(locale, "Skip uncounted categories without deleting them; ordinary positions still include every displayed element.", "जिस श्रेणी को नहीं गिनना उसे छोड़ें, हटाएँ नहीं; सामान्य स्थान में हर दिखाया चिह्न शामिल रहता है।", "ਜਿਸ ਕਿਸਮ ਨੂੰ ਨਹੀਂ ਗਿਣਨਾ ਉਸਨੂੰ ਛੱਡੋ, ਹਟਾਓ ਨਾ; ਆਮ ਥਾਂ ਵਿੱਚ ਹਰ ਦਿੱਤਾ ਚਿੰਨ੍ਹ ਸ਼ਾਮਲ ਰਹਿੰਦਾ ਹੈ।");
  return tx(locale, "Preserve the internal order of each group unless sorting or reversal is specifically required, and answer only from the final sequence.", "जब तक क्रमबद्ध करने या उलटने को न कहा जाए, हर समूह का आपसी क्रम बनाए रखें और उत्तर केवल अंतिम श्रृंखला से दें।", "ਜਦੋਂ ਤੱਕ ਕ੍ਰਮ ਲਗਾਉਣ ਜਾਂ ਉਲਟਣ ਲਈ ਨਾ ਕਿਹਾ ਜਾਵੇ, ਹਰ ਸਮੂਹ ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ ਅਤੇ ਉੱਤਰ ਕੇਵਲ ਅੰਤਿਮ ਲੜੀ ਤੋਂ ਦਿਓ।");
}

function adjacentMatches(ql: AlpQuestionLogic, items: readonly string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i + 1 < items.length; i += 1) {
    const a = items[i]!, b = items[i + 1]!;
    const ok = ql.solveMode === "COUNT_LETTER_FOLLOWED_BY_SYMBOL" || ql.solveMode === "COUNT_SYMBOL_PRECEDED_BY_LETTER" ? letter(a) && symbol(b)
      : ql.solveMode === "COUNT_DIGIT_FOLLOWED_BY_LETTER" || ql.solveMode === "COUNT_LETTER_PRECEDED_BY_DIGIT" ? digit(a) && letter(b)
      : ql.solveMode === "COUNT_VOWEL_FOLLOWED_BY_DIGIT" ? vowel(a) && digit(b)
      : ql.solveMode === "COUNT_EVEN_DIGIT_PRECEDED_BY_SYMBOL" ? symbol(a) && digit(b) && +b % 2 === 0
      : ql.solveMode === "MIXED_COUNT_ADJACENCY_AFTER_TRANSFORM" ? letter(a) && digit(b) : false;
    if (ok) out.push(`${a}${b}(${i + 1}-${i + 2})`);
  }
  return out;
}

function steps(ql: AlpQuestionLogic, c: C, locale: AlpLocale): string[] {
  const final = c.changed ?? c.source;
  if (ql.solveMode.includes("WORD_ALPHA_PAIR")) {
    const pairs = pairRows(c.source, rank, direction(ql.solveMode));
    const list = pairs.length ? pairs.map((x) => `${x.a}:${x.b}[${x.gap}]`).join(", ") : tx(locale, "none", "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
    return [tx(locale, `Mark the word positions: ${c.source.map((x, i) => `${x}(${i + 1})`).join(" ")}.`, `शब्द के स्थान लिखें: ${c.source.map((x, i) => `${x}(${i + 1})`).join(" ")}।`, `ਸ਼ਬਦ ਦੀਆਂ ਥਾਵਾਂ ਲਿਖੋ: ${c.source.map((x, i) => `${x}(${i + 1})`).join(" ")}।`), tx(locale, `The equal-gap pairs are ${list}.`, `समान-अंतर वाले युग्म हैं: ${list}।`, `ਇੱਕੋ-ਫਰਕ ਵਾਲੇ ਜੋੜੇ ਹਨ: ${list}।`), tx(locale, `The required result is ${c.answer}.`, `माँगा परिणाम ${c.answer} है।`, `ਮੰਗਿਆ ਨਤੀਜਾ ${c.answer} ਹੈ।`)];
  }
  if (ql.solveMode.startsWith("CLASS_")) {
    const middle = ql.solveMode === "CLASS_OPPOSITE_LETTER_AT_POSITION" ? final : classIntermediate(c);
    const out = [tx(locale, `Apply the letter rule: ${spaced(c.source)} → ${spaced(middle)}.`, `अक्षर-नियम लगाएँ: ${spaced(c.source)} → ${spaced(middle)}।`, `ਅੱਖਰ-ਨਿਯਮ ਲਗਾਓ: ${spaced(c.source)} → ${spaced(middle)}।`)];
    if (joined(middle) !== joined(final)) out.push(tx(locale, `Complete the second stage: ${spaced(middle)} → ${spaced(final)}.`, `दूसरा चरण पूरा करें: ${spaced(middle)} → ${spaced(final)}।`, `ਦੂਜਾ ਪੜਾਅ ਪੂਰਾ ਕਰੋ: ${spaced(middle)} → ${spaced(final)}।`));
    else out.push(tx(locale, `The resulting sequence is ${spaced(final)}.`, `प्राप्त क्रम ${spaced(final)} है।`, `ਮਿਲਿਆ ਕ੍ਰਮ ${spaced(final)} ਹੈ।`));
    out.push(tx(locale, `The requested result is ${c.answer}.`, `माँगा परिणाम ${c.answer} है।`, `ਮੰਗਿਆ ਨਤੀਜਾ ${c.answer} ਹੈ।`));
    return out;
  }
  if (ql.solveMode.includes("DIGIT_GAP_PAIR")) {
    const pairs = pairRows(c.source, (x) => +x);
    const list = pairs.length ? pairs.map((x) => `${x.a}:${x.b}[${x.gap}]`).join(", ") : tx(locale, "none", "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
    return [tx(locale, `Number the digit positions: ${c.source.map((x, i) => `${i + 1}:${x}`).join(" | ")}.`, `अंक-स्थान लिखें: ${c.source.map((x, i) => `${i + 1}:${x}`).join(" | ")}।`, `ਅੰਕ-ਥਾਵਾਂ ਲਿਖੋ: ${c.source.map((x, i) => `${i + 1}:${x}`).join(" | ")}।`), tx(locale, `Equal-gap pairs are ${list}.`, `समान-अंतर वाले युग्म हैं: ${list}।`, `ਇੱਕੋ-ਫਰਕ ਵਾਲੇ ਜੋੜੇ ਹਨ: ${list}।`), tx(locale, `The required result is ${c.answer}.`, `माँगा परिणाम ${c.answer} है।`, `ਮੰਗਿਆ ਨਤੀਜਾ ${c.answer} ਹੈ।`)];
  }
  if (Number(ql.checkpointId.slice(-3)) === 9 && ql.solveMode.startsWith("COUNT_")) {
    const matches = adjacentMatches(ql, c.source);
    const list = matches.length ? matches.join(", ") : tx(locale, "none", "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
    return [tx(locale, `Keep the complete sequence indexed: ${c.source.map((x, i) => `${i + 1}:${x}`).join(" | ")}.`, `पूरी श्रृंखला को स्थान सहित रखें: ${c.source.map((x, i) => `${i + 1}:${x}`).join(" | ")}।`, `ਪੂਰੀ ਲੜੀ ਨੂੰ ਥਾਵਾਂ ਸਮੇਤ ਰੱਖੋ: ${c.source.map((x, i) => `${i + 1}:${x}`).join(" | ")}।`), tx(locale, `Matching adjacent groups are ${list}.`, `मिलने वाले साथ वाले समूह हैं: ${list}।`, `ਮਿਲਦੇ ਨਾਲ ਵਾਲੇ ਸਮੂਹ ਹਨ: ${list}।`), tx(locale, `Their total is ${c.answer}.`, `इनकी कुल संख्या ${c.answer} है।`, `ਇਨ੍ਹਾਂ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ${c.answer} ਹੈ।`)];
  }
  const out = [tx(locale, `Original sequence: ${spaced(c.source)}.`, `मूल श्रृंखला: ${spaced(c.source)}।`, `ਮੂਲ ਲੜੀ: ${spaced(c.source)}।`)];
  if (c.changed) out.push(tx(locale, `After the stated operation: ${spaced(final)}.`, `दिए नियम के बाद: ${spaced(final)}।`, `ਦਿੱਤੇ ਨਿਯਮ ਤੋਂ ਬਾਅਦ: ${spaced(final)}।`));
  else out.push(tx(locale, `Index the sequence from the required end or category.`, `श्रृंखला को माँगे सिरे या श्रेणी के अनुसार गिनें।`, `ਲੜੀ ਨੂੰ ਮੰਗੇ ਸਿਰੇ ਜਾਂ ਕਿਸਮ ਅਨੁਸਾਰ ਗਿਣੋ।`));
  out.push(tx(locale, `The requested result is ${c.answer}.`, `माँगा परिणाम ${c.answer} है।`, `ਮੰਗਿਆ ਨਤੀਜਾ ${c.answer} ਹੈ।`));
  return out;
}

function shortcut(ql: AlpQuestionLogic, locale: AlpLocale): string {
  const cp = Number(ql.checkpointId.slice(-3));
  if (cp === 6) return tx(locale, "Use position numbers: equal word-position and alphabet-rank differences identify a valid pair without writing the full alphabet.", "स्थान-संख्याएँ लें: शब्द-स्थान और वर्णमाला-स्थान का समान अंतर सही युग्म बताता है और पूरी वर्णमाला लिखने की जरूरत नहीं पड़ती।", "ਥਾਂ-ਅੰਕ ਲਓ: ਸ਼ਬਦ-ਥਾਂ ਅਤੇ ਵਰਣਮਾਲਾ-ਥਾਂ ਦਾ ਇੱਕੋ ਫਰਕ ਸਹੀ ਜੋੜਾ ਦੱਸਦਾ ਹੈ ਅਤੇ ਪੂਰੀ ਵਰਣਮਾਲਾ ਲਿਖਣ ਦੀ ਲੋੜ ਨਹੀਂ ਪੈਂਦੀ।");
  if (cp === 7) return tx(locale, "Mark vowels/consonants or odd/even ranks above the word before changing any letter; this prevents applying the rule to the wrong class.", "किसी अक्षर को बदलने से पहले शब्द के ऊपर स्वर-व्यंजन या विषम-सम स्थान चिन्हित करें; इससे गलत श्रेणी पर नियम नहीं लगेगा।", "ਕਿਸੇ ਅੱਖਰ ਨੂੰ ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਸ਼ਬਦ ਉੱਤੇ ਸਵਰ-ਵਿਅੰਜਨ ਜਾਂ ਟਾਂਕ-ਜਿਸਤ ਥਾਵਾਂ ਨਿਸ਼ਾਨ ਲਗਾਓ; ਇਸ ਨਾਲ ਗਲਤ ਕਿਸਮ ਉੱਤੇ ਨਿਯਮ ਨਹੀਂ ਲੱਗੇਗਾ।");
  if (cp === 8) return tx(locale, "Write digit positions once from both ends, and write the final number before reading any position after a rearrangement.", "अंकों के स्थान दोनों सिरों से एक बार लिखें और पुनर्व्यवस्थापन के बाद कोई स्थान पढ़ने से पहले अंतिम संख्या लिख लें।", "ਅੰਕਾਂ ਦੀਆਂ ਥਾਵਾਂ ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕ ਵਾਰ ਲਿਖੋ ਅਤੇ ਮੁੜ-ਵਿਵਸਥਾ ਤੋਂ ਬਾਅਦ ਕੋਈ ਥਾਂ ਪੜ੍ਹਨ ਤੋਂ ਪਹਿਲਾਂ ਅੰਤਿਮ ਸੰਖਿਆ ਲਿਖ ਲਓ।");
  if (cp === 9) return tx(locale, "Number the whole sequence from both ends, then circle only the requested category or neighbouring pair without deleting other elements.", "पूरी श्रृंखला को दोनों सिरों से अंकित करें, फिर अन्य चिह्न हटाए बिना केवल माँगी श्रेणी या साथ वाला युग्म घेरें।", "ਪੂਰੀ ਲੜੀ ਨੂੰ ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੋਂ ਅੰਕਿਤ ਕਰੋ, ਫਿਰ ਹੋਰ ਚਿੰਨ੍ਹ ਹਟਾਏ ਬਿਨਾਂ ਕੇਵਲ ਮੰਗੀ ਕਿਸਮ ਜਾਂ ਨਾਲ ਵਾਲਾ ਜੋੜਾ ਘੇਰੋ।");
  return tx(locale, "Write the final sequence on a fresh line and answer only from that line, never from the original arrangement.", "अंतिम श्रृंखला नई पंक्ति में लिखें और उत्तर केवल उसी से दें, मूल क्रम से नहीं।", "ਅੰਤਿਮ ਲੜੀ ਨਵੀਂ ਲਾਈਨ ਉੱਤੇ ਲਿਖੋ ਅਤੇ ਉੱਤਰ ਕੇਵਲ ਉਸੇ ਤੋਂ ਦਿਓ, ਮੂਲ ਕ੍ਰਮ ਤੋਂ ਨਹੀਂ।");
}

function evidence(ql: AlpQuestionLogic, c: C, locale: AlpLocale): string {
  if (ql.solveMode.includes("WORD_ALPHA_PAIR")) {
    const p = pairRows(c.source, rank, direction(ql.solveMode));
    return p.length ? p.map((x) => `${x.a}:${x.b}`).join(", ") : tx(locale, "none", "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
  }
  if (ql.solveMode.includes("DIGIT_GAP_PAIR")) {
    const p = pairRows(c.source, (x) => +x);
    return p.length ? p.map((x) => `${x.a}:${x.b}`).join(", ") : tx(locale, "none", "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
  }
  if (ql.solveMode.includes("UNCHANGED")) {
    const final = c.changed ?? c.source;
    const p = c.source.map((x, i) => x === final[i] ? i + 1 : 0).filter(Boolean);
    return p.length ? p.join(", ") : tx(locale, "none", "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
  }
  const p = adjacentMatches(ql, c.changed ?? c.source);
  return p.length ? p.join(", ") : tx(locale, "none", "कोई नहीं", "ਕੋਈ ਨਹੀਂ");
}

function wrongReason(ql: AlpQuestionLogic, c: C, value: string, locale: AlpLocale): string {
  if (ql.answerType === "TOKEN_PAIR") {
    const [a, b] = value.split(/\s*:\s*/);
    const valueOf = ql.solveMode.includes("DIGIT") ? (x: string) => +x : rank;
    let best: { rowGap: number; naturalGap: number } | undefined;
    for (let i = 0; i < c.source.length; i += 1) for (let j = i + 1; j < c.source.length; j += 1) if (c.source[i] === a && c.source[j] === b) {
      const candidate = { rowGap: j - i - 1, naturalGap: Math.abs(valueOf(a!) - valueOf(b!)) - 1 };
      if (!best || Math.abs(candidate.rowGap - candidate.naturalGap) < Math.abs(best.rowGap - best.naturalGap)) best = candidate;
    }
    return best ? tx(locale, `${value} has a displayed gap of ${best.rowGap} but a natural-order gap of ${best.naturalGap}; the two are unequal.`, `${value} का दी गई श्रृंखला में अंतर ${best.rowGap} और प्राकृतिक क्रम में ${best.naturalGap} है; दोनों समान नहीं हैं।`, `${value} ਦਾ ਦਿੱਤੀ ਲੜੀ ਵਿੱਚ ਫਰਕ ${best.rowGap} ਅਤੇ ਕੁਦਰਤੀ ਕ੍ਰਮ ਵਿੱਚ ${best.naturalGap} ਹੈ; ਦੋਵੇਂ ਇੱਕੋ ਨਹੀਂ ਹਨ।`) : tx(locale, `${value} does not occur in the required order.`, `${value} माँगे क्रम में नहीं आता।`, `${value} ਮੰਗੇ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਆਉਂਦਾ।`);
  }
  if (ql.answerType === "TOKEN_SEQUENCE") {
    if (ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") {
      const count = pairRows([...value], rank).length;
      return tx(locale, `${value} has ${count} qualifying pair(s), whereas the required option is ${c.answer}.`, `${value} में ${count} सही युग्म हैं, जबकि सही विकल्प ${c.answer} है।`, `${value} ਵਿੱਚ ${count} ਸਹੀ ਜੋੜੇ ਹਨ, ਜਦਕਿ ਸਹੀ ਚੋਣ ${c.answer} ਹੈ।`);
    }
    return tx(locale, `${value} is not the complete transformed sequence; applying every stated change gives ${c.answer}.`, `${value} पूरी बदली श्रृंखला नहीं है; सभी बदलाव लगाने पर ${c.answer} मिलता है।`, `${value} ਪੂਰੀ ਬਦਲੀ ਲੜੀ ਨਹੀਂ ਹੈ; ਸਾਰੇ ਬਦਲਾਅ ਲਗਾਉਣ ਉੱਤੇ ${c.answer} ਮਿਲਦਾ ਹੈ।`);
  }
  if (ql.answerType === "NUMBER" && !ql.solveMode.includes("POSITION")) return tx(locale, `The verified matching pairs or positions are ${evidence(ql, c, locale)}, giving ${c.answer}; ${value} misses or adds a case.`, `जाँचे सही युग्म या स्थान हैं: ${evidence(ql, c, locale)}; इनकी संख्या ${c.answer} है, इसलिए ${value} में कम या अधिक गिनती हुई है।`, `ਜਾਂਚੇ ਸਹੀ ਜੋੜੇ ਜਾਂ ਥਾਵਾਂ ਹਨ: ${evidence(ql, c, locale)}; ਇਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ${c.answer} ਹੈ, ਇਸ ਲਈ ${value} ਵਿੱਚ ਘੱਟ ਜਾਂ ਵੱਧ ਗਿਣਤੀ ਹੋਈ ਹੈ।`);
  const final = c.changed ?? c.source;
  const where = final.indexOf(value);
  return tx(locale, `At the requested place in the completed sequence the entry is ${c.answer}, not ${value}${where >= 0 ? `; ${value} is at position ${where + 1}` : ""}.`, `पूरी श्रृंखला में माँगे स्थान पर ${c.answer} है, ${value} नहीं${where >= 0 ? `; ${value} स्थान ${where + 1} पर है` : ""}।`, `ਪੂਰੀ ਲੜੀ ਵਿੱਚ ਮੰਗੀ ਥਾਂ ਉੱਤੇ ${c.answer} ਹੈ, ${value} ਨਹੀਂ${where >= 0 ? `; ${value} ਥਾਂ ${where + 1} ਉੱਤੇ ਹੈ` : ""}।`);
}

function distractors(ql: AlpQuestionLogic, c: C, opts: readonly AlpOption[], correct: number, locale: AlpLocale): AlpDistractorAnalysis[] {
  return opts.map((option, optionIndex) => ({ option, optionIndex })).filter((x) => x.optionIndex !== correct).map(({ option, optionIndex }) => {
    const reason = wrongReason(ql, c, option.value, locale);
    return {
      optionIndex,
      optionValue: option.value,
      errorLabel: option.errorLabel ?? "WRONG_OPTION",
      explanation: tx(locale, `Option ${optionIndex + 1} (${option.value}) is incorrect. ${reason}`, `विकल्प ${optionIndex + 1} (${option.value}) गलत है। ${reason}`, `ਚੋਣ ${optionIndex + 1} (${option.value}) ਗਲਤ ਹੈ। ${reason}`),
    };
  });
}

export function renderCompletionEditorial(ql: AlpQuestionLogic, c: C, opts: readonly AlpOption[], correct: number, locale: AlpLocale): CompletionEditorial {
  const analyses = distractors(ql, c, opts, correct, locale);
  const final = c.changed ?? c.source;
  const visual = [tx(locale, `Original: ${spaced(c.source)}`, `मूल: ${spaced(c.source)}`, `ਮੂਲ: ${spaced(c.source)}`)];
  if (ql.solveMode.startsWith("CLASS_") && ql.solveMode !== "CLASS_OPPOSITE_LETTER_AT_POSITION") visual.push(tx(locale, `After letter rule: ${spaced(classIntermediate(c))}`, `अक्षर-नियम के बाद: ${spaced(classIntermediate(c))}`, `ਅੱਖਰ-ਨਿਯਮ ਤੋਂ ਬਾਅਦ: ${spaced(classIntermediate(c))}`));
  visual.push(tx(locale, `Final: ${spaced(final)}`, `अंतिम: ${spaced(final)}`, `ਅੰਤਿਮ: ${spaced(final)}`));
  visual.push(tx(locale, `Answer: ${c.answer}`, `उत्तर: ${c.answer}`, `ਉੱਤਰ: ${c.answer}`));
  return {
    stem: stem(ql, c, locale),
    coreConcept: concept(ql, locale),
    ruleStatement: rule(ql, c, locale),
    steps: steps(ql, c, locale),
    visualWorking: visual,
    examShortcut: shortcut(ql, locale),
    conclusion: tx(locale, `Therefore, the correct answer is ${c.answer}.`, `इसलिए सही उत्तर ${c.answer} है।`, `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${c.answer} ਹੈ।`),
    distractorAnalyses: analyses,
    closestTrapRejection: tx(locale, `The nearest distractor still fails the completed check; the verified result is ${c.answer}.`, `निकटतम भटकाने वाला विकल्प भी पूरी जाँच में असफल होता है; सत्यापित परिणाम ${c.answer} है।`, `ਸਭ ਤੋਂ ਨੇੜਲੀ ਭੁਲਾਵੇ ਵਾਲੀ ਚੋਣ ਵੀ ਪੂਰੀ ਜਾਂਚ ਵਿੱਚ ਅਸਫਲ ਹੁੰਦੀ ਹੈ; ਜਾਂਚਿਆ ਨਤੀਜਾ ${c.answer} ਹੈ।`),
  };
}
