import { intBetween, pick } from "../foundation/prng";
import type { AlpQuestionLogic } from "../types";
import { A, CLASS_WORDS, key, nums, rank, seqMiss, shift, vowel, type C, type L } from "./shared";

const RULES = [
  { d: { en: "replace vowels by the next letter and consonants by the previous letter", hi: "स्वरों को अगले अक्षर और व्यंजनों को पिछले अक्षर से बदलें", pa: "ਸਵਰਾਂ ਨੂੰ ਅਗਲੇ ਅੱਖਰ ਅਤੇ ਵਿਅੰਜਨਾਂ ਨੂੰ ਪਿਛਲੇ ਅੱਖਰ ਨਾਲ ਬਦਲੋ" }, f: (token: string) => shift(token, vowel(token) ? 1 : -1) },
  { d: { en: "keep vowels unchanged and replace consonants by the next letter", hi: "स्वरों को न बदलें और व्यंजनों को अगले अक्षर से बदलें", pa: "ਸਵਰਾਂ ਨੂੰ ਨਾ ਬਦਲੋ ਅਤੇ ਵਿਅੰਜਨਾਂ ਨੂੰ ਅਗਲੇ ਅੱਖਰ ਨਾਲ ਬਦਲੋ" }, f: (token: string) => vowel(token) ? token : shift(token, 1) },
  { d: { en: "replace vowels by the previous letter and keep consonants unchanged", hi: "स्वरों को पिछले अक्षर से बदलें और व्यंजनों को न बदलें", pa: "ਸਵਰਾਂ ਨੂੰ ਪਿਛਲੇ ਅੱਖਰ ਨਾਲ ਬਦਲੋ ਅਤੇ ਵਿਅੰਜਨਾਂ ਨੂੰ ਨਾ ਬਦਲੋ" }, f: (token: string) => vowel(token) ? shift(token, -1) : token },
  { d: { en: "replace odd-ranked letters by the next letter and keep even-ranked letters unchanged", hi: "विषम वर्णमाला-स्थान वाले अक्षर को अगले अक्षर से बदलें और सम स्थान वाले अक्षर को न बदलें", pa: "ਵਿਸਮ ਵਰਣਮਾਲਾ-ਥਾਂ ਵਾਲੇ ਅੱਖਰ ਨੂੰ ਅਗਲੇ ਅੱਖਰ ਨਾਲ ਬਦਲੋ ਅਤੇ ਸਮ ਥਾਂ ਵਾਲੇ ਅੱਖਰ ਨੂੰ ਨਾ ਬਦਲੋ" }, f: (token: string) => rank(token) % 2 ? shift(token, 1) : token },
] as const;

export function buildCp007(ql: AlpQuestionLogic, seed: number): C {
  const word = pick(CLASS_WORDS, key(ql, seed, "word"));
  const rule = pick(RULES, key(ql, seed, "rule"));
  const changedByRule = [...word].map(rule.f);
  const position = intBetween(1, word.length, key(ql, seed, "position"));
  let operation: L = rule.d;
  const shortcut: L = {
    en: "Mark each letter class first, make one stated replacement, and only then perform any sorting or reversal.",
    hi: "पहले हर अक्षर की श्रेणी चिन्हित करें, एक दिया बदलाव करें और उसके बाद ही छँटाई या उलटना करें।",
    pa: "ਪਹਿਲਾਂ ਹਰ ਅੱਖਰ ਦੀ ਕਿਸਮ ਨਿਸ਼ਾਨ ਲਗਾਓ, ਦਿੱਤਾ ਬਦਲਾਅ ਕਰੋ ਅਤੇ ਉਸ ਤੋਂ ਬਾਅਦ ਹੀ ਕ੍ਰਮ ਲਗਾਓ ਜਾਂ ਉਲਟੋ।",
  };
  let changed = changedByRule;
  let answer = changedByRule[position - 1]!;
  let pool = [...changedByRule];
  let query: L = { en: `read position ${position} from the left`, hi: `बाईं ओर से स्थान ${position} पढ़ें`, pa: `ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ${position} ਪੜ੍ਹੋ` };

  if (ql.solveMode === "CLASS_SHIFT_TRANSFORMED_WORD") {
    answer = changedByRule.join(""); pool = seqMiss(answer);
    query = { en: "form the complete changed word", hi: "पूरा बदला हुआ शब्द बनाएँ", pa: "ਪੂਰਾ ਬਦਲਿਆ ਸ਼ਬਦ ਬਣਾਓ" };
  } else if (ql.solveMode === "CLASS_SHIFT_COUNT_UNCHANGED") {
    const count = [...word].filter((token, index) => token === changedByRule[index]).length;
    answer = String(count); pool = nums(count, word.length);
    query = { en: "count unchanged positions", hi: "बिना बदले स्थान गिनें", pa: "ਬਿਨਾਂ ਬਦਲੀਆਂ ਥਾਵਾਂ ਗਿਣੋ" };
  } else if (ql.solveMode === "CLASS_SHIFT_COUNT_VOWELS") {
    const count = changedByRule.filter(vowel).length;
    answer = String(count); pool = nums(count, word.length);
    query = { en: "count vowels in the changed word", hi: "बदले शब्द में स्वर गिनें", pa: "ਬਦਲੇ ਸ਼ਬਦ ਵਿੱਚ ਸਵਰ ਗਿਣੋ" };
  } else if (ql.solveMode === "CLASS_SHIFT_SORTED_LETTER_AT_POSITION") {
    changed = [...changedByRule].sort(); answer = changed[position - 1]!; pool = changed;
    query = { en: `sort the changed letters and read left position ${position}`, hi: `बदले अक्षर क्रमबद्ध करके बायाँ स्थान ${position} पढ़ें`, pa: `ਬਦਲੇ ਅੱਖਰ ਕ੍ਰਮ ਵਿੱਚ ਲਾ ਕੇ ਖੱਬੀ ਥਾਂ ${position} ਪੜ੍ਹੋ` };
  } else if (ql.solveMode === "CLASS_SHIFT_SORTED_POSITION_OF_LETTER") {
    changed = [...changedByRule].sort();
    const target = pick([...new Set(changed)], key(ql, seed, "target"));
    const finalPosition = changed.indexOf(target) + 1;
    answer = String(finalPosition); pool = nums(finalPosition, word.length);
    query = { en: `sort the changed letters and find the first ${target}`, hi: `बदले अक्षर क्रमबद्ध करके पहला ${target} खोजें`, pa: `ਬਦਲੇ ਅੱਖਰ ਕ੍ਰਮ ਵਿੱਚ ਲਾ ਕੇ ਪਹਿਲਾ ${target} ਲੱਭੋ` };
  } else if (ql.solveMode === "CLASS_OPPOSITE_LETTER_AT_POSITION") {
    operation = {
      en: "replace every vowel by its opposite letter in the English alphabet and keep consonants unchanged",
      hi: "हर स्वर को अंग्रेज़ी वर्णमाला के उसके विपरीत अक्षर से बदलें और व्यंजनों को न बदलें",
      pa: "ਹਰ ਸਵਰ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਵਰਣਮਾਲਾ ਦੇ ਉਸਦੇ ਉਲਟ ਅੱਖਰ ਨਾਲ ਬਦਲੋ ਅਤੇ ਵਿਅੰਜਨਾਂ ਨੂੰ ਨਾ ਬਦਲੋ",
    };
    changed = [...word].map((token) => vowel(token) ? A[26 - rank(token)]! : token);
    answer = changed[position - 1]!; pool = changed;
    query = { en: `read position ${position} from the left`, hi: `बाईं ओर से स्थान ${position} पढ़ें`, pa: `ਖੱਬੇ ਪਾਸੋਂ ਥਾਂ ${position} ਪੜ੍ਹੋ` };
  } else if (ql.solveMode === "CLASS_TWO_STAGE_LETTER_AT_POSITION") {
    changed = [...changedByRule].reverse(); answer = changed[position - 1]!; pool = changed;
    query = { en: `apply the rule, reverse the result and read position ${position}`, hi: `नियम लगाकर परिणाम उलटें और स्थान ${position} पढ़ें`, pa: `ਨਿਯਮ ਲਗਾ ਕੇ ਨਤੀਜਾ ਉਲਟੋ ਅਤੇ ਥਾਂ ${position} ਪੜ੍ਹੋ` };
  }

  return {
    source: [...word], changed, word, changedWord: changed.join(""), answer, pool, operation, query,
    working: { en: `${word} becomes ${changed.join("")}; the required result is ${answer}.`, hi: `${word} बदलकर ${changed.join("")} बनता है; माँगा परिणाम ${answer} है।`, pa: `${word} ਬਦਲ ਕੇ ${changed.join("")} ਬਣਦਾ ਹੈ; ਮੰਗਿਆ ਨਤੀਜਾ ${answer} ਹੈ।` }, shortcut,
  };
}
