import { intBetween, pick, shuffle } from "../foundation/prng";
import type { AlpQuestionLogic } from "../types";
import { D, allPairs, key, nums, swap, type C, type L } from "./shared";

function digitPairs(tokens: readonly string[]) {
  const pairs: Array<readonly [string, string]> = [];
  for (let first = 0; first < tokens.length; first += 1) {
    for (let second = first + 1; second < tokens.length; second += 1) {
      if (second - first === Math.abs(+tokens[first]! - +tokens[second]!)) pairs.push([tokens[first]!, tokens[second]!] as const);
    }
  }
  return pairs;
}

function digits(ql: AlpQuestionLogic, seed: number, needPair = false, requireDistinct = false) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const attemptSeed = seed + attempt * 997;
    const length = intBetween(7, 9, key(ql, attemptSeed, "digit-row-length"));
    const maxRepeats = requireDistinct ? 0 : Math.min(2, length - 4);
    const repeatCount = intBetween(0, maxRepeats, key(ql, attemptSeed, "digit-repeat-count"));
    const unique = shuffle(D, key(ql, attemptSeed, "digits-unique")).slice(0, length - repeatCount);
    const repeated = shuffle(unique, key(ql, attemptSeed, "digits-repeat-picks")).slice(0, repeatCount);
    const tokens = shuffle([...unique, ...repeated], key(ql, attemptSeed, "digits-final"));
    if (!needPair || digitPairs(tokens).length) return tokens;
  }
  throw new Error("Unable to construct digit state.");
}
const transform = (tokens: readonly string[], kind: "ASC" | "DESC" | "REV" | "SWAP") => kind === "ASC" ? [...tokens].sort((a, b) => +a - +b) : kind === "DESC" ? [...tokens].sort((a, b) => +b - +a) : kind === "REV" ? [...tokens].reverse() : swap(tokens);

export function buildCp008(ql: AlpQuestionLogic, seed: number): C {
  const source = digits(ql, seed, ql.solveMode === "IDENTIFY_DIGIT_GAP_PAIR", ql.solveMode === "IDENTIFY_DIGIT_GAP_PAIR");
  const position = intBetween(2, source.length - 1, key(ql, seed, "position"));
  const operation: L = { en: "treat the displayed number as an ordered row of digit tokens", hi: "दिखाई संख्या को अंक-चिह्नों की क्रमबद्ध पंक्ति मानें", pa: "ਦਿੱਤੀ ਸੰਖਿਆ ਨੂੰ ਅੰਕ-ਚਿੰਨ੍ਹਾਂ ਦੀ ਕ੍ਰਮਵਾਰ ਕਤਾਰ ਮੰਨੋ" };
  const shortcut: L = { en: "Number the digit slots once; for pair questions compare absolute position difference with absolute digit difference.", hi: "अंक-स्थानों को एक बार अंकित करें; युग्म प्रश्न में निरपेक्ष स्थान-अंतर को निरपेक्ष अंक-अंतर से मिलाएँ।", pa: "ਅੰਕ-ਥਾਵਾਂ ਨੂੰ ਇੱਕ ਵਾਰ ਅੰਕਿਤ ਕਰੋ; ਜੋੜਾ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਨਿਰਪੱਖ ਥਾਂ-ਫਰਕ ਨੂੰ ਨਿਰਪੱਖ ਅੰਕ-ਫਰਕ ਨਾਲ ਮਿਲਾਓ।" };
  let changed: string[] | undefined;
  let answer = "";
  let pool: string[] = [];
  let query: L;

  if (ql.solveMode === "DIGIT_AT_LEFT_POSITION" || ql.solveMode === "DIGIT_AT_RIGHT_POSITION") {
    answer = source[ql.solveMode === "DIGIT_AT_LEFT_POSITION" ? position - 1 : source.length - position]!; pool = source;
    query = { en: `read position ${position} from the ${ql.solveMode.includes("LEFT") ? "left" : "right"}`, hi: `${ql.solveMode.includes("LEFT") ? "बाईं" : "दाईं"} ओर से स्थान ${position} पढ़ें`, pa: `${ql.solveMode.includes("LEFT") ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੋਂ ਥਾਂ ${position} ਪੜ੍ਹੋ` };
  } else if (ql.solveMode === "DIGIT_LEFT_POSITION" || ql.solveMode === "DIGIT_RIGHT_POSITION") {
    const uniqueIndices = source.map((token, index) => ({ token, index })).filter(({ token, index }) => index > 0 && index < source.length - 1 && source.indexOf(token) === index && source.lastIndexOf(token) === index);
    if (!uniqueIndices.length) throw new Error(`${ql.qlId} needs a unique digit occurrence for an inverse-position query.`);
    const selected = pick(uniqueIndices, key(ql, seed, "unique-index"));
    const target = selected.token;
    const finalPosition = ql.solveMode === "DIGIT_LEFT_POSITION" ? selected.index + 1 : source.length - selected.index;
    answer = String(finalPosition); pool = nums(finalPosition, source.length);
    query = { en: `find the ${ql.solveMode.includes("LEFT") ? "left" : "right"} position of ${target}`, hi: `${target} का ${ql.solveMode.includes("LEFT") ? "बायाँ" : "दायाँ"} स्थान खोजें`, pa: `${target} ਦੀ ${ql.solveMode.includes("LEFT") ? "ਖੱਬੀ" : "ਸੱਜੀ"} ਥਾਂ ਲੱਭੋ` };
  } else if (ql.solveMode === "COUNT_DIGIT_GAP_PAIRS") {
    const count = digitPairs(source).length; answer = String(count); pool = nums(count, 16);
    query = { en: "count digit pairs with equal row and natural-order gaps", hi: "समान पंक्ति और प्राकृतिक अंक-अंतर वाले युग्म गिनें", pa: "ਇੱਕੋ ਕਤਾਰ ਅਤੇ ਕੁਦਰਤੀ ਅੰਕ-ਫਰਕ ਵਾਲੇ ਜੋੜੇ ਗਿਣੋ" };
  } else if (ql.solveMode === "IDENTIFY_DIGIT_GAP_PAIR") {
    const pair = pick(digitPairs(source), key(ql, seed, "pair"));
    answer = `${pair[0]} : ${pair[1]}`;
    const valid = new Set(digitPairs(source).map((candidate) => `${candidate[0]} : ${candidate[1]}`));
    pool = allPairs(source).filter((candidate) => !valid.has(candidate));
    query = { en: "identify the digit pair with equal gaps", hi: "समान अंतर वाला अंक-युग्म चुनें", pa: "ਇੱਕੋ ਫਰਕ ਵਾਲਾ ਅੰਕ-ਜੋੜਾ ਚੁਣੋ" };
  } else {
    const kind: "ASC" | "DESC" | "REV" | "SWAP" = ql.solveMode.includes("ASC") ? "ASC" : ql.solveMode.includes("DESC") ? "DESC" : ql.solveMode.includes("REVERSE") ? "REV" : ql.solveMode.includes("ADJACENT") ? "SWAP" : pick(["ASC", "DESC", "REV", "SWAP"] as const, key(ql, seed, "kind"));
    changed = transform(source, kind);
    if (ql.solveMode.includes("COUNT_UNCHANGED")) {
      const count = source.filter((token, index) => token === changed![index]).length;
      answer = String(count); pool = nums(count, source.length);
      query = { en: `apply ${kind} and count unchanged positions`, hi: "दिया बदलाव लगाकर बिना बदले स्थान गिनें", pa: "ਦਿੱਤਾ ਬਦਲਾਅ ਲਗਾ ਕੇ ਬਿਨਾਂ ਬਦਲੀਆਂ ਥਾਵਾਂ ਗਿਣੋ" };
    } else {
      answer = changed[position - 1]!; pool = changed;
      query = { en: `apply ${kind} and read left position ${position}`, hi: `दिया बदलाव लगाकर बायाँ स्थान ${position} पढ़ें`, pa: `ਦਿੱਤਾ ਬਦਲਾਅ ਲਗਾ ਕੇ ਖੱਬੀ ਥਾਂ ${position} ਪੜ੍ਹੋ` };
    }
  }
  const working = `${source.join("")}${changed ? ` → ${changed.join("")}` : ""} → ${answer}`;
  return { source, changed, answer, pool, operation, query, working: { en: working, hi: working, pa: working }, shortcut };
}
