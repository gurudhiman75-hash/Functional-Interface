import { intBetween, pick } from "../foundation/prng";
import type { AlpQuestionLogic } from "../types";
import { A, D, S, adj, digit, key, letter, nums, symbol, vowel, type C, type L } from "./shared";
import { mixedRow } from "./mixed-row";

function putWindow(source: readonly string[], start: number, values: readonly string[]): string[] {
  const out = [...source];
  values.forEach((value, offset) => { out[start + offset] = value; });
  return out;
}

function countWindows(
  source: readonly string[],
  predicate: (previous: string, centre: string, next: string) => boolean,
): { count: number; matches: string[] } {
  const matches: string[] = [];
  for (let index = 0; index + 2 < source.length; index += 1) {
    const previous = source[index]!;
    const centre = source[index + 1]!;
    const next = source[index + 2]!;
    if (predicate(previous, centre, next)) matches.push(`${previous} ${centre} ${next} (${index + 1}-${index + 3})`);
  }
  return { count: matches.length, matches };
}

export function buildCp009(ql: AlpQuestionLogic, seed: number): C {
  let source = mixedRow(ql, seed);
  const offset = intBetween(2, 5, key(ql, seed, "offset"));
  const operation: L = { en: "read letters, digits and symbols as one ordered token row", hi: "अक्षर, अंक और चिन्हों को एक क्रमबद्ध तत्त्व-पंक्ति मानें", pa: "ਅੱਖਰ, ਅੰਕ ਅਤੇ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਇੱਕ ਕ੍ਰਮਵਾਰ ਤੱਤ-ਕਤਾਰ ਮੰਨੋ" };
  const shortcut: L = { en: "Number the row once from both ends and mark only the adjacent pair or three-token window named in the question.", hi: "पंक्ति को दोनों सिरों से एक बार अंकित करें और केवल प्रश्न में बताए साथ वाले युग्म या तीन-तत्त्व समूह को चिन्हित करें।", pa: "ਕਤਾਰ ਨੂੰ ਦੋਵੇਂ ਸਿਰਿਆਂ ਤੋਂ ਇੱਕ ਵਾਰ ਅੰਕਿਤ ਕਰੋ ਅਤੇ ਕੇਵਲ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦੱਸੇ ਨਾਲ ਵਾਲੇ ਜੋੜੇ ਜਾਂ ਤਿੰਨ-ਤੱਤ ਸਮੂਹ ਨੂੰ ਨਿਸ਼ਾਨ ਲਗਾਓ।" };
  let answer = "";
  let pool: string[] = [];
  let query: L;
  let working: L | undefined;

  // ALP-QL-138 and ALP-QL-140 previously duplicated the exact pairwise
  // semantics of 137 and 139. Their permanent IDs are retained, but before
  // chapter freeze they now own the source-backed compound-window identities.
  if (ql.qlId === "ALP-QL-138") {
    const literalZab = intBetween(0, 1, key(ql, seed, "compound-window-kind")) === 1;
    const start = intBetween(1, source.length - 4, key(ql, seed, "compound-window-start"));
    if (literalZab) {
      source = putWindow(source, start, ["Z", "A", "B"]);
      const result = countWindows(source, (previous, centre, next) => previous === "Z" && centre === "A" && next === "B");
      answer = String(result.count); pool = nums(result.count, source.length - 2);
      query = { en: "count three-token windows Z-A-B", hi: "ऐसे तीन-तत्त्व समूह गिनें जिनमें A के ठीक पहले Z और ठीक बाद B हो", pa: "ਅਜੇਹੇ ਤਿੰਨ-ਤੱਤ ਸਮੂਹ ਗਿਣੋ ਜਿਨ੍ਹਾਂ ਵਿੱਚ A ਦੇ ਠੀਕ ਪਹਿਲਾਂ Z ਅਤੇ ਠੀਕ ਬਾਅਦ B ਹੋਵੇ" };
      const shown = result.matches.length ? result.matches.join(", ") : "none";
      working = { en: `Matching Z-A-B windows: ${shown}. Total = ${answer}.`, hi: `मिलने वाले Z-A-B समूह: ${shown}। कुल = ${answer}।`, pa: `ਮਿਲਦੇ Z-A-B ਸਮੂਹ: ${shown}। ਕੁੱਲ = ${answer}।` };
    } else {
      source = putWindow(source, start, [pick(S, key(ql, seed, "compound-symbol")), pick(A, key(ql, seed, "compound-letter")), pick(D, key(ql, seed, "compound-digit"))]);
      const result = countWindows(source, (previous, centre, next) => symbol(previous) && letter(centre) && digit(next));
      answer = String(result.count); pool = nums(result.count, source.length - 2);
      query = { en: "count three-token windows symbol-letter-digit", hi: "ऐसे अक्षर गिनें जिनके ठीक पहले चिन्ह और ठीक बाद अंक हो", pa: "ਅਜੇਹੇ ਅੱਖਰ ਗਿਣੋ ਜਿਨ੍ਹਾਂ ਦੇ ਠੀਕ ਪਹਿਲਾਂ ਨਿਸ਼ਾਨ ਅਤੇ ਠੀਕ ਬਾਅਦ ਅੰਕ ਹੋਵੇ" };
      const shown = result.matches.length ? result.matches.join(", ") : "none";
      working = { en: `Matching symbol-letter-digit windows: ${shown}. Total = ${answer}.`, hi: `मिलने वाले चिन्ह-अक्षर-अंक समूह: ${shown}। कुल = ${answer}।`, pa: `ਮਿਲਦੇ ਨਿਸ਼ਾਨ-ਅੱਖਰ-ਅੰਕ ਸਮੂਹ: ${shown}। ਕੁੱਲ = ${answer}।` };
    }
  } else if (ql.qlId === "ALP-QL-140") {
    const start = intBetween(1, source.length - 4, key(ql, seed, "flanked-window-start"));
    const letterFirst = intBetween(0, 1, key(ql, seed, "flanked-window-order")) === 1;
    const left = letterFirst ? pick(A, key(ql, seed, "flanked-letter")) : pick(D, key(ql, seed, "flanked-digit"));
    const right = letterFirst ? pick(D, key(ql, seed, "flanked-digit")) : pick(A, key(ql, seed, "flanked-letter"));
    source = putWindow(source, start, [left, pick(S, key(ql, seed, "flanked-symbol")), right]);
    const result = countWindows(source, (previous, centre, next) => symbol(centre) && ((letter(previous) && digit(next)) || (digit(previous) && letter(next))));
    answer = String(result.count); pool = nums(result.count, source.length - 2);
    query = { en: "count symbols flanked by one letter and one digit", hi: "ऐसे चिन्ह गिनें जिनके दोनों ओर एक अक्षर और एक अंक हो", pa: "ਅਜੇਹੇ ਨਿਸ਼ਾਨ ਗਿਣੋ ਜਿਨ੍ਹਾਂ ਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਇੱਕ ਅੱਖਰ ਅਤੇ ਇੱਕ ਅੰਕ ਹੋਵੇ" };
    const shown = result.matches.length ? result.matches.join(", ") : "none";
    working = { en: `Matching letter/digit-symbol-letter/digit windows: ${shown}. Total = ${answer}.`, hi: `मिलने वाले तीन-तत्त्व समूह: ${shown}। कुल = ${answer}।`, pa: `ਮਿਲਦੇ ਤਿੰਨ-ਤੱਤ ਸਮੂਹ: ${shown}। ਕੁੱਲ = ${answer}।` };
  } else {
    const length = source.length;
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
          count = adj(source, letter, symbol); condition = { en: "letter immediately followed by symbol", hi: "अक्षर के तुरंत बाद चिन्ह", pa: "ਅੱਖਰ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਚਿੰਨ੍ਹ" }; break;
        case "COUNT_DIGIT_FOLLOWED_BY_LETTER":
          count = adj(source, digit, letter); condition = { en: "digit immediately followed by letter", hi: "अंक के तुरंत बाद अक्षर", pa: "ਅੰਕ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਅੱਖਰ" }; break;
        case "COUNT_VOWEL_FOLLOWED_BY_DIGIT":
          count = adj(source, vowel, digit); condition = { en: "vowel immediately followed by digit", hi: "स्वर के तुरंत बाद अंक", pa: "ਸਵਰ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਅੰਕ" }; break;
        default:
          count = adj(source, symbol, (token) => digit(token) && +token % 2 === 0); condition = { en: "symbol immediately followed by even digit", hi: "चिन्ह के तुरंत बाद सम अंक", pa: "ਚਿੰਨ੍ਹ ਦੇ ਤੁਰੰਤ ਬਾਅਦ ਜਿਸਤ ਅੰਕ" }; break;
      }
      answer = String(count); pool = nums(count, length - 1);
      query = { en: `count ${condition.en} occurrences`, hi: `${condition.hi} वाले अवसर गिनें`, pa: `${condition.pa} ਵਾਲੇ ਮੌਕੇ ਗਿਣੋ` };
    }
  }

  return { source, answer, pool, operation, query, working: working ?? { en: `The required scan gives ${answer}.`, hi: `माँगी जाँच से ${answer} मिलता है।`, pa: `ਮੰਗੀ ਜਾਂਚ ਤੋਂ ${answer} ਮਿਲਦਾ ਹੈ।` }, shortcut };
}
