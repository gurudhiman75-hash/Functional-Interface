import { pick } from "../foundation/prng";
import type { AlpQuestionLogic } from "../types";
import { WORDS, allPairs, key, nums, wordPairs, type C, type L } from "./shared";

export function buildCp006(ql: AlpQuestionLogic, seed: number): C {
  let word = pick(WORDS, key(ql, seed, "word"));
  let direction: "BOTH" | "FORWARD" | "BACKWARD" = "BOTH";
  if (ql.solveMode === "COUNT_WORD_ALPHA_PAIRS_FORWARD") direction = "FORWARD";
  if (ql.solveMode === "COUNT_WORD_ALPHA_PAIRS_BACKWARD") direction = "BACKWARD";
  const operation: L = {
    en: "compare each word-position difference with the alphabet-rank difference of the same two letters",
    hi: "हर शब्द-स्थान अंतर को उन्हीं दो अक्षरों के वर्णमाला-स्थान अंतर से मिलाएँ",
    pa: "ਹਰ ਸ਼ਬਦ-ਥਾਂ ਫਰਕ ਨੂੰ ਉਹਨਾਂ ਹੀ ਦੋ ਅੱਖਰਾਂ ਦੇ ਵਰਣਮਾਲਾ-ਥਾਂ ਫਰਕ ਨਾਲ ਮਿਲਾਓ",
  };
  const shortcut: L = {
    en: "Use absolute position differences; equal differences identify a valid pair without writing the full alphabet.",
    hi: "निरपेक्ष स्थान-अंतर लें; समान अंतर सही युग्म बताता है और पूरी वर्णमाला लिखने की आवश्यकता नहीं पड़ती।",
    pa: "ਨਿਰਪੱਖ ਥਾਂ-ਫਰਕ ਲਓ; ਇੱਕੋ ਫਰਕ ਸਹੀ ਜੋੜਾ ਦੱਸਦਾ ਹੈ ਅਤੇ ਪੂਰੀ ਵਰਣਮਾਲਾ ਲਿਖਣ ਦੀ ਲੋੜ ਨਹੀਂ ਪੈਂਦੀ।",
  };

  if (ql.solveMode === "IDENTIFY_WORD_ALPHA_PAIR") {
    word = pick(WORDS.filter((candidate) => wordPairs(candidate).length), key(ql, seed, "eligible-word"));
    const pair = pick(wordPairs(word), key(ql, seed, "pair"));
    const answer = `${pair[0]} : ${pair[1]}`;
    const valid = new Set(wordPairs(word).map((candidate) => `${candidate[0]} : ${candidate[1]}`));
    return {
      source: [...word], word, answer, pool: allPairs([...word]).filter((candidate) => !valid.has(candidate)), operation,
      query: { en: "identify the displayed pair that satisfies the equality", hi: "समानता पूरी करने वाला दिखाया युग्म चुनें", pa: "ਬਰਾਬਰੀ ਪੂਰੀ ਕਰਨ ਵਾਲਾ ਦਿੱਤਾ ਜੋੜਾ ਚੁਣੋ" },
      working: { en: `The valid pair is ${answer}.`, hi: `सही युग्म ${answer} है।`, pa: `ਸਹੀ ਜੋੜਾ ${answer} ਹੈ।` }, shortcut,
    };
  }

  if (ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT") {
    const rows = WORDS.map((candidate) => ({ word: candidate, count: wordPairs(candidate).length }));
    const selected = pick(rows.filter((row) => rows.filter((other) => other.count !== row.count).length >= 3), key(ql, seed, "count-word"));
    return {
      source: [...selected.word], word: selected.word, answer: selected.word,
      pool: rows.filter((row) => row.count !== selected.count).map((row) => row.word), operation,
      query: { en: `identify the word having exactly ${selected.count} valid pairs`, hi: `ठीक ${selected.count} सही युग्म वाला शब्द चुनें`, pa: `ਠੀਕ ${selected.count} ਸਹੀ ਜੋੜਿਆਂ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ` },
      working: { en: `${selected.word} has ${selected.count} valid pairs.`, hi: `${selected.word} में ${selected.count} सही युग्म हैं।`, pa: `${selected.word} ਵਿੱਚ ${selected.count} ਸਹੀ ਜੋੜੇ ਹਨ।` }, shortcut,
    };
  }

  const original = word;
  const source = ql.solveMode === "COUNT_WORD_ALPHA_PAIRS_AFTER_REVERSE" ? [...word].reverse().join("") : word;
  const pairs = wordPairs(source, direction);
  return {
    source: [...source], changed: source === original ? undefined : [...source], word: original,
    changedWord: source === original ? undefined : source, answer: String(pairs.length), pool: nums(pairs.length, 12), operation,
    query: {
      en: `count the valid ${direction.toLowerCase()} pairs${source !== original ? " after reversal" : ""}`,
      hi: `${source !== original ? "उलटने के बाद " : ""}सही युग्मों की संख्या गिनें`,
      pa: `${source !== original ? "ਉਲਟਣ ਤੋਂ ਬਾਅਦ " : ""}ਸਹੀ ਜੋੜਿਆਂ ਦੀ ਗਿਣਤੀ ਕਰੋ`,
    },
    working: {
      en: `Accepted pairs: ${pairs.length ? pairs.map((pair) => pair.join(":")).join(", ") : "none"}; total ${pairs.length}.`,
      hi: `स्वीकृत युग्म: ${pairs.length ? pairs.map((pair) => pair.join(":")).join(", ") : "कोई नहीं"}; कुल ${pairs.length}।`,
      pa: `ਮੰਨੇ ਜੋੜੇ: ${pairs.length ? pairs.map((pair) => pair.join(":")).join(", ") : "ਕੋਈ ਨਹੀਂ"}; ਕੁੱਲ ${pairs.length}।`,
    }, shortcut,
  };
}
