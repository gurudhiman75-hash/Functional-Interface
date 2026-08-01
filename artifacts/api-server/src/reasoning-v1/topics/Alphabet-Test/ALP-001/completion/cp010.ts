import { intBetween, pick } from "../foundation/prng";
import type { AlpQuestionLogic } from "../types";
import { adj, digit, key, letter, mixed, nums, swap, symbol, type C, type L } from "./shared";

const group = (tokens: readonly string[], order: Array<"L" | "D" | "S">) => order.flatMap((kind) => tokens.filter(kind === "L" ? letter : kind === "D" ? digit : symbol));
const inPlace = (tokens: readonly string[], predicate: (token: string) => boolean, kind: "SORT" | "REV") => {
  const selected = tokens.filter(predicate);
  const changed = kind === "SORT" ? [...selected].sort() : [...selected].reverse();
  let index = 0;
  return tokens.map((token) => predicate(token) ? changed[index++]! : token);
};

export function buildCp010(ql: AlpQuestionLogic, seed: number): C {
  const source = mixed(ql, seed).slice(0, 18);
  const requestedPosition = intBetween(2, 17, key(ql, seed, "position"));
  let changed: string[];
  let operationName = "";
  switch (ql.solveMode) {
    case "MIXED_GROUP_LETTERS_DIGITS_SYMBOLS_POSITION": changed = group(source, ["L", "D", "S"]); operationName = "group letters, then digits, then symbols"; break;
    case "MIXED_GROUP_SYMBOLS_DIGITS_LETTERS_POSITION": changed = group(source, ["S", "D", "L"]); operationName = "group symbols, then digits, then letters"; break;
    case "MIXED_SORT_LETTERS_IN_PLACE_POSITION": changed = inPlace(source, letter, "SORT"); operationName = "sort only the letters in their letter positions"; break;
    case "MIXED_SORT_DIGITS_IN_PLACE_POSITION": changed = inPlace(source, digit, "SORT"); operationName = "sort only the digits in their digit positions"; break;
    case "MIXED_REVERSE_LETTERS_IN_PLACE_POSITION": changed = inPlace(source, letter, "REV"); operationName = "reverse only the letters in their letter positions"; break;
    case "MIXED_REVERSE_DIGITS_IN_PLACE_POSITION": changed = inPlace(source, digit, "REV"); operationName = "reverse only the digits in their digit positions"; break;
    case "MIXED_SWAP_ADJACENT_POSITION": changed = swap(source); operationName = "interchange every adjacent pair"; break;
    case "MIXED_REVERSE_ALL_POSITION": changed = [...source].reverse(); operationName = "reverse the complete sequence"; break;
    case "MIXED_REMOVE_CATEGORY_POSITION": {
      const category = pick(["L", "D", "S"] as const, key(ql, seed, "remove"));
      const predicate = category === "L" ? letter : category === "D" ? digit : symbol;
      changed = source.filter((token) => !predicate(token)); operationName = `remove category ${category}`; break;
    }
    case "MIXED_POSITION_OF_TOKEN_AFTER_GROUP": changed = group(source, ["L", "D", "S"]); operationName = "group letters, then digits, then symbols"; break;
    case "MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM": {
      const kind = pick(["G", "SW", "R"] as const, key(ql, seed, "kind"));
      changed = kind === "G" ? group(source, ["L", "D", "S"]) : kind === "SW" ? swap(source) : [...source].reverse();
      operationName = kind === "G" ? "group letters, then digits, then symbols" : kind === "SW" ? "interchange every adjacent pair" : "reverse the complete sequence";
      break;
    }
    default: changed = group(source, ["S", "L", "D"]); operationName = "group symbols, then letters, then digits before the scan"; break;
  }
  const operation: L = { en: `apply the explicit mixed-row operation: ${operationName}`, hi: "दिए गए नियम के अनुसार श्रृंखला को पूरी तरह पुनर्व्यवस्थित करें", pa: "ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਲੜੀ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਮੁੜ ਵਿਵਸਥਿਤ ਕਰੋ" };
  const shortcut: L = { en: "Mark categories above the original row and move only the named tokens; compare or scan only after the final row is complete.", hi: "मूल श्रृंखला के ऊपर श्रेणियाँ चिन्हित करें, केवल बताए चिह्न चलाएँ और अंतिम श्रृंखला बनने के बाद ही तुलना या जाँच करें।", pa: "ਮੂਲ ਲੜੀ ਉੱਤੇ ਕਿਸਮਾਂ ਨਿਸ਼ਾਨ ਲਗਾਓ, ਕੇਵਲ ਦੱਸੇ ਚਿੰਨ੍ਹ ਹਿਲਾਓ ਅਤੇ ਅੰਤਿਮ ਲੜੀ ਬਣਨ ਤੋਂ ਬਾਅਦ ਹੀ ਮਿਲਾਣ ਜਾਂ ਜਾਂਚ ਕਰੋ।" };
  let answer = "";
  let pool: string[] = [];
  let query: L;

  if (ql.solveMode === "MIXED_POSITION_OF_TOKEN_AFTER_GROUP") {
    const target = pick(source, key(ql, seed, "target"));
    const position = changed.indexOf(target) + 1;
    answer = String(position); pool = nums(position, changed.length);
    query = { en: `find the final position of ${target}`, hi: `${target} का अंतिम स्थान खोजें`, pa: `${target} ਦੀ ਅੰਤਿਮ ਥਾਂ ਲੱਭੋ` };
  } else if (ql.solveMode === "MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM") {
    const count = source.filter((token, index) => token === changed[index]).length;
    answer = String(count); pool = nums(count, source.length);
    query = { en: "count unchanged positions", hi: "बिना बदले स्थान गिनें", pa: "ਬਿਨਾਂ ਬਦਲੀਆਂ ਥਾਵਾਂ ਗਿਣੋ" };
  } else if (ql.solveMode === "MIXED_COUNT_ADJACENCY_AFTER_TRANSFORM") {
    const count = adj(changed, letter, digit);
    answer = String(count); pool = nums(count, changed.length - 1);
    query = { en: "count final letter-digit adjacencies", hi: "अंतिम अक्षर-अंक साथ वाले युग्म गिनें", pa: "ਅੰਤਿਮ ਅੱਖਰ-ਅੰਕ ਨਾਲ ਵਾਲੇ ਜੋੜੇ ਗਿਣੋ" };
  } else {
    const position = Math.min(requestedPosition, changed.length);
    answer = changed[position - 1]!; pool = changed;
    query = { en: `read final left position ${position}`, hi: `अंतिम बायाँ स्थान ${position} पढ़ें`, pa: `ਅੰਤਿਮ ਖੱਬੀ ਥਾਂ ${position} ਪੜ੍ਹੋ` };
  }

  return {
    source, changed, answer, pool, operation, query,
    working: { en: `${source.join(" ")} → ${changed.join(" ")} → ${answer}`, hi: `${source.join(" ")} → ${changed.join(" ")} → ${answer}`, pa: `${source.join(" ")} → ${changed.join(" ")} → ${answer}` }, shortcut,
  };
}
