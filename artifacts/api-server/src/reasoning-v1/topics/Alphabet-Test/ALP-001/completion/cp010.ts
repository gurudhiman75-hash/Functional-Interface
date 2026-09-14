import { intBetween, pick } from "../foundation/prng";
import type { AlpQuestionLogic } from "../types";
import { adj, digit, key, letter, nums, swap, symbol, type C, type L } from "./shared";
import { mixedRow } from "./mixed-row";

const group = (tokens: readonly string[], order: Array<"L" | "D" | "S">) => order.flatMap((kind) => tokens.filter(kind === "L" ? letter : kind === "D" ? digit : symbol));
const inPlace = (tokens: readonly string[], predicate: (token: string) => boolean, kind: "SORT" | "REV") => {
  const selected = tokens.filter(predicate);
  const changed = kind === "SORT" ? [...selected].sort() : [...selected].reverse();
  let index = 0;
  return tokens.map((token) => predicate(token) ? changed[index++]! : token);
};

function operationInstruction(operationName: string): L {
  switch (operationName) {
    case "group letters, then digits, then symbols":
      return {
        en: "group all letters first, digits next and symbols last, retaining the order within each group",
        hi: "पहले सभी अक्षर, फिर अंक और अंत में प्रतीक रखें तथा हर समूह का आपसी क्रम बनाए रखें",
        pa: "ਪਹਿਲਾਂ ਸਾਰੇ ਅੱਖਰ, ਫਿਰ ਅੰਕ ਅਤੇ ਅੰਤ ਵਿੱਚ ਨਿਸ਼ਾਨ ਰੱਖੋ ਅਤੇ ਹਰ ਸਮੂਹ ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ",
      };
    case "group symbols, then digits, then letters":
      return {
        en: "group all symbols first, digits next and letters last, retaining the order within each group",
        hi: "पहले सभी प्रतीक, फिर अंक और अंत में अक्षर रखें तथा हर समूह का आपसी क्रम बनाए रखें",
        pa: "ਪਹਿਲਾਂ ਸਾਰੇ ਨਿਸ਼ਾਨ, ਫਿਰ ਅੰਕ ਅਤੇ ਅੰਤ ਵਿੱਚ ਅੱਖਰ ਰੱਖੋ ਅਤੇ ਹਰ ਸਮੂਹ ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ",
      };
    case "sort only the letters in their letter positions":
      return {
        en: "sort only the letters alphabetically within the letter positions, leaving all other elements fixed",
        hi: "केवल अक्षरों को उनके अक्षर वाले स्थानों में वर्णमाला क्रम में सजाएँ और बाकी सभी चिह्न स्थिर रखें",
        pa: "ਕੇਵਲ ਅੱਖਰਾਂ ਨੂੰ ਉਹਨਾਂ ਦੀਆਂ ਅੱਖਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਵਰਣਮਾਲਾ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ ਅਤੇ ਬਾਕੀ ਸਾਰੇ ਚਿੰਨ੍ਹ ਅਡੋਲ ਰੱਖੋ",
      };
    case "sort only the digits in their digit positions":
      return {
        en: "sort only the digits in ascending order within the digit positions, leaving all other elements fixed",
        hi: "केवल अंकों को उनके अंक वाले स्थानों में बढ़ते क्रम में सजाएँ और बाकी सभी चिह्न स्थिर रखें",
        pa: "ਕੇਵਲ ਅੰਕਾਂ ਨੂੰ ਉਹਨਾਂ ਦੀਆਂ ਅੰਕ ਵਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਵੱਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ ਅਤੇ ਬਾਕੀ ਸਾਰੇ ਚਿੰਨ੍ਹ ਅਡੋਲ ਰੱਖੋ",
      };
    case "reverse only the letters in their letter positions":
      return {
        en: "reverse only the letters within the letter positions, leaving all other elements fixed",
        hi: "केवल अक्षरों का क्रम उनके अक्षर वाले स्थानों में उलटें और बाकी सभी चिह्न स्थिर रखें",
        pa: "ਕੇਵਲ ਅੱਖਰਾਂ ਦਾ ਕ੍ਰਮ ਉਹਨਾਂ ਦੀਆਂ ਅੱਖਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਉਲਟੋ ਅਤੇ ਬਾਕੀ ਸਾਰੇ ਚਿੰਨ੍ਹ ਅਡੋਲ ਰੱਖੋ",
      };
    case "reverse only the digits in their digit positions":
      return {
        en: "reverse only the digits within the digit positions, leaving all other elements fixed",
        hi: "केवल अंकों का क्रम उनके अंक वाले स्थानों में उलटें और बाकी सभी चिह्न स्थिर रखें",
        pa: "ਕੇਵਲ ਅੰਕਾਂ ਦਾ ਕ੍ਰਮ ਉਹਨਾਂ ਦੀਆਂ ਅੰਕ ਵਾਲੀਆਂ ਥਾਵਾਂ ਵਿੱਚ ਉਲਟੋ ਅਤੇ ਬਾਕੀ ਸਾਰੇ ਚਿੰਨ੍ਹ ਅਡੋਲ ਰੱਖੋ",
      };
    case "interchange every adjacent pair":
      return {
        en: "interchange every adjacent pair: 1st with 2nd, 3rd with 4th, and so on",
        hi: "हर पास-पास की जोड़ी को आपस में बदलें: पहला चिह्न दूसरे से, तीसरा चौथे से और इसी प्रकार आगे",
        pa: "ਹਰ ਨਾਲ-ਨਾਲ ਜੋੜੇ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲੋ: ਪਹਿਲਾ ਚਿੰਨ੍ਹ ਦੂਜੇ ਨਾਲ, ਤੀਜਾ ਚੌਥੇ ਨਾਲ ਅਤੇ ਇਸੇ ਤਰ੍ਹਾਂ ਅੱਗੇ",
      };
    case "reverse the complete sequence":
      return {
        en: "reverse the complete sequence",
        hi: "पूरी श्रृंखला को उलटें",
        pa: "ਪੂਰੀ ਲੜੀ ਨੂੰ ਉਲਟੋ",
      };
    case "group symbols, then letters, then digits before the scan":
      return {
        en: "group all symbols first, letters next and digits last, retaining the order within each group",
        hi: "पहले सभी प्रतीक, फिर अक्षर और अंत में अंक रखें तथा हर समूह का आपसी क्रम बनाए रखें",
        pa: "ਪਹਿਲਾਂ ਸਾਰੇ ਨਿਸ਼ਾਨ, ਫਿਰ ਅੱਖਰ ਅਤੇ ਅੰਤ ਵਿੱਚ ਅੰਕ ਰੱਖੋ ਅਤੇ ਹਰ ਸਮੂਹ ਦਾ ਆਪਸੀ ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ",
      };
    default: {
      const category = operationName.match(/^remove category ([LDS])$/)?.[1];
      if (category === "L") return { en: "remove all letters", hi: "सभी अक्षर हटा दें", pa: "ਸਾਰੇ ਅੱਖਰ ਹਟਾ ਦਿਓ" };
      if (category === "D") return { en: "remove all digits", hi: "सभी अंक हटा दें", pa: "ਸਾਰੇ ਅੰਕ ਹਟਾ ਦਿਓ" };
      if (category === "S") return { en: "remove all symbols", hi: "सभी प्रतीक हटा दें", pa: "ਸਾਰੇ ਨਿਸ਼ਾਨ ਹਟਾ ਦਿਓ" };
      throw new Error(`Unsupported CP010 operation instruction: ${operationName}`);
    }
  }
}

export function buildCp010(ql: AlpQuestionLogic, seed: number): C {
  const source = mixedRow(ql, seed);
  const requestedPosition = intBetween(2, source.length - 1, key(ql, seed, "position"));
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
      const kind = pick(["G", "SW", "R", "SL", "SD"] as const, key(ql, seed, "kind"));
      changed = kind === "G" ? group(source, ["L", "D", "S"])
        : kind === "SW" ? swap(source)
          : kind === "R" ? [...source].reverse()
            : kind === "SL" ? inPlace(source, letter, "SORT")
              : inPlace(source, digit, "SORT");
      operationName = kind === "G" ? "group letters, then digits, then symbols"
        : kind === "SW" ? "interchange every adjacent pair"
          : kind === "R" ? "reverse the complete sequence"
            : kind === "SL" ? "sort only the letters in their letter positions"
              : "sort only the digits in their digit positions";
      break;
    }
    default: changed = group(source, ["S", "L", "D"]); operationName = "group symbols, then letters, then digits before the scan"; break;
  }
  const operation = operationInstruction(operationName);
  const shortcut: L = { en: "Mark categories above the original row and move only the named tokens; compare or scan only after the final row is complete.", hi: "मूल श्रृंखला के ऊपर श्रेणियाँ चिन्हित करें, केवल बताए चिह्न चलाएँ और अंतिम श्रृंखला बनने के बाद ही तुलना या जाँच करें।", pa: "ਮੂਲ ਲੜੀ ਉੱਤੇ ਕਿਸਮਾਂ ਨਿਸ਼ਾਨ ਲਗਾਓ, ਕੇਵਲ ਦੱਸੇ ਚਿੰਨ੍ਹ ਹਿਲਾਓ ਅਤੇ ਅੰਤਿਮ ਲੜੀ ਬਣਨ ਤੋਂ ਬਾਅਦ ਹੀ ਮਿਲਾਣ ਜਾਂ ਜਾਂਚ ਕਰੋ।" };
  let answer = "";
  let pool: string[] = [];
  let query: L;

  if (ql.solveMode === "MIXED_POSITION_OF_TOKEN_AFTER_GROUP") {
    const uniqueTargets = source.filter((token, index) => source.indexOf(token) === index && source.lastIndexOf(token) === index);
    if (!uniqueTargets.length) throw new Error(`${ql.qlId} needs at least one unique token for an unambiguous inverse-position query.`);
    const target = pick(uniqueTargets, key(ql, seed, "target"));
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
