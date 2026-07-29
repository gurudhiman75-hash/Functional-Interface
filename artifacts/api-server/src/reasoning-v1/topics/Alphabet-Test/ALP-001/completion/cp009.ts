import { intBetween } from "../foundation/prng";
import type { AlpQuestionLogic } from "../types";
import { adj, digit, key, letter, mixed, nums, symbol, vowel, type C, type L } from "./shared";

export function buildCp009(ql: AlpQuestionLogic, seed: number): C {
  const source = mixed(ql, seed);
  const length = source.length;
  const offset = intBetween(2, 5, key(ql, seed, "offset"));
  const operation: L = { en: "read letters, digits and symbols as one ordered token row", hi: "अक्षर, अंक और चिन्हों को एक क्रमबद्ध तत्त्व-पंक्ति मानें", pa: "ਅੱਖਰ, ਅੰਕ ਅਤੇ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਇੱਕ ਕ੍ਰਮਵਾਰ ਤੱਤ-ਕਤਾਰ ਮੰਨੋ" };
  const shortcut: L = { en: "Number the row once from both ends and underline only the category or adjacent window named in the question.", hi: "पंक्ति को दोनों सिरों से एक बार अंकित करें और केवल माँगी श्रेणी या साथ-साथ खिड़की को रेखांकित करें।", pa: "ਕਤਾਰ ਨੂੰ ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕ ਵਾਰ ਅੰਕਿਤ ਕਰੋ ਅਤੇ ਕੇਵਲ ਮੰਗੀ ਸ਼੍ਰੇਣੀ ਜਾਂ ਨਾਲ-ਨਾਲ ਖਿੜਕੀ ਨੂੰ ਰੇਖਾਂਕਿਤ ਕਰੋ।" };
  let answer = "";
  let pool: string[] = [];
  let query: L;

  if (ql.solveMode.startsWith("MIXED_ELEMENT_") || ql.solveMode.startsWith("MIXED_RELATIVE_")) {
    let index = 0;
    let description = "";
    if (ql.solveMode === "MIXED_ELEMENT_FROM_LEFT") {
      const position = intBetween(3, length - 2, key(ql, seed, "position")); index = position - 1; description = `${position} from left`;
    } else if (ql.solveMode === "MIXED_ELEMENT_FROM_RIGHT") {
      const position = intBetween(3, length - 2, key(ql, seed, "position")); index = length - position; description = `${position} from right`;
    } else {
      const rightReference = ql.solveMode.endsWith("FROM_RIGHT");
      const moveRight = ql.solveMode.includes("RELATIVE_RIGHT");
      const position = intBetween(offset + 2, length - offset - 1, key(ql, seed, "position"));
      const anchor = rightReference ? length - position : position - 1;
      index = anchor + (moveRight ? offset : -offset);
      description = `${offset} ${moveRight ? "right" : "left"} of ${position} from ${rightReference ? "right" : "left"}`;
    }
    answer = source[index]!; pool = source;
    query = { en: `read the element ${description}`, hi: "दिए सिरे और चाल से तत्त्व पढ़ें", pa: "ਦਿੱਤੇ ਸਿਰੇ ਅਤੇ ਚਾਲ ਨਾਲ ਤੱਤ ਪੜ੍ਹੋ" };
  } else if (ql.solveMode === "NTH_LETTER_FROM_LEFT" || ql.solveMode === "NTH_SYMBOL_FROM_RIGHT") {
    const filtered = ql.solveMode === "NTH_LETTER_FROM_LEFT" ? source.filter(letter) : source.filter(symbol).reverse();
    const position = intBetween(2, Math.min(5, filtered.length), key(ql, seed, "category-position"));
    answer = filtered[position - 1]!; pool = filtered;
    query = { en: `read category item ${position}`, hi: `माँगी श्रेणी का क्रम ${position} पढ़ें`, pa: `ਮੰਗੀ ਸ਼੍ਰੇਣੀ ਦਾ ਕ੍ਰਮ ${position} ਪੜ੍ਹੋ` };
  } else {
    let count = 0;
    let condition: L;
    switch (ql.solveMode) {
      case "COUNT_LETTER_FOLLOWED_BY_SYMBOL":
      case "COUNT_SYMBOL_PRECEDED_BY_LETTER":
        count = adj(source, letter, symbol); condition = { en: "letter immediately followed by symbol", hi: "अक्षर के तुरंत बाद चिन्ह", pa: "ਅੱਖਰ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਚਿੰਨ੍ਹ" }; break;
      case "COUNT_DIGIT_FOLLOWED_BY_LETTER":
      case "COUNT_LETTER_PRECEDED_BY_DIGIT":
        count = adj(source, digit, letter); condition = { en: "digit immediately followed by letter", hi: "अंक के तुरंत बाद अक्षर", pa: "ਅੰਕ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਅੱਖਰ" }; break;
      case "COUNT_VOWEL_FOLLOWED_BY_DIGIT":
        count = adj(source, vowel, digit); condition = { en: "vowel immediately followed by digit", hi: "स्वर के तुरंत बाद अंक", pa: "ਸਵਰ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਅੰਕ" }; break;
      default:
        count = adj(source, symbol, (token) => digit(token) && +token % 2 === 0); condition = { en: "symbol immediately followed by even digit", hi: "चिन्ह के तुरंत बाद सम अंक", pa: "ਚਿੰਨ੍ਹ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਜਿਸਤ ਅੰਕ" }; break;
    }
    answer = String(count); pool = nums(count, length - 1);
    query = { en: `count ${condition.en} occurrences`, hi: `${condition.hi} वाले अवसर गिनें`, pa: `${condition.pa} ਵਾਲੇ ਮੌਕੇ ਗਿਣੋ` };
  }

  return { source, answer, pool, operation, query, working: { en: `The required scan gives ${answer}.`, hi: `माँगी जाँच से ${answer} मिलता है।`, pa: `ਮੰਗੀ ਜਾਂਚ ਤੋਂ ${answer} ਮਿਲਦਾ ਹੈ।` }, shortcut };
}
