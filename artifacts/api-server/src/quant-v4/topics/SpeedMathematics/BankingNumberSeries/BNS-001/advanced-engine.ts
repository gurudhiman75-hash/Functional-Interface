import type {
  Bns001Language,
  Bns001PatternKind,
  Bns001Question,
  Bns001TaskKind,
} from "./types";
import { ADVANCED_PATTERNS, cleanNumber } from "./advanced-verifier";
import {
  independentGrammarMatches,
  independentWrongTermRepairs,
  independentlyVerifyBns001Question,
} from "./independent-verifier";
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
export const BNS_MAINS_PATTERNS: readonly Bns001PatternKind[] =
  ADVANCED_PATTERNS.filter(
    (p) => p !== "FRACTIONAL_GEOMETRIC" && p !== "CONSECUTIVE_CUBES" && p !== "CONSTANT_DIVISION" && p !== "CONSECUTIVE_PRIME_DIFFERENCE",
  );
function rng(seed: string) {
  let h = 2166136261;
  for (const c of seed) {
    h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
}
const choose = <T>(r: () => number, p: readonly T[]) =>
  p[Math.floor(r() * p.length)]!;
const text = (lang: Bns001Language, en: string, hi: string, pa: string) =>
  lang === "hi" ? hi : lang === "pa" ? pa : en;
function state(pattern: Bns001PatternKind, seed: string, length: number) {
  const r = rng(seed),
    series: number[] = [],
    steps: string[] = [];
  const first = choose(r, [3, 5, 7, 11, 17, 23]),
    shift = choose(r, [0, 1, 2]),
    scale = choose(r, [1, 2, 3]);
  let rule: string[];
  let start = choose(r, [12, 18, 24, 31, 38, 49, 65]);
  if (pattern === "CONSECUTIVE_PRIME_DIFFERENCE") {
    const offset = choose(r, [0, 1, 2, 3, 4, 5, 6, 7, 8]), sign = choose(r, [-1, 1]);
    const gaps = Array.from({ length: length - 1 }, (_, i) => scale * primes[offset + i]!);
    if (sign < 0) start += gaps.reduce((a, b) => a + b, 0);
    rule = [
      `${sign > 0 ? "Add" : "Subtract"} ${scale} times successive primes, beginning with ${primes[offset]}.`,
      `${primes[offset]} से शुरू होने वाली क्रमागत अभाज्य संख्याओं के ${scale} गुने ${sign > 0 ? "जोड़ें" : "घटाएँ"}।`,
      `${primes[offset]} ਤੋਂ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੀਆਂ ਲਗਾਤਾਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਦੇ ${scale} ਗੁਣੇ ${sign > 0 ? "ਜੋੜੋ" : "ਘਟਾਓ"}।`,
    ];
    series.push(start);
    for (let i = 0; i < length - 1; i++) {
      const next = series[i]! + sign * gaps[i]!;
      steps.push(`${series[i]} ${sign > 0 ? "+" : "−"} ${scale} × ${primes[offset + i]} = ${next}`);
      series.push(next);
    }
    return { series, steps, rule };
  }
  if (pattern === "CONSTANT_DIVISION") {
    const divisor = choose(r, [2, 3, 4]);
    // Start at an exact multiple of the whole divisor chain, keeping every
    // generated term integral without rounded recurring decimals.
    const unit = choose(r, [1, 2, 3]);
    rule = [
      `Divide each term by ${divisor}.`,
      `हर पद को ${divisor} से भाग दें।`,
      `ਹਰ ਪਦ ਨੂੰ ${divisor} ਨਾਲ ਭਾਗ ਕਰੋ।`,
    ];
    for (let i = 0; i < length; i++) {
      series.push(unit * divisor ** (length - 1 - i));
      if (i > 0) steps.push(`${series[i - 1]} ÷ ${divisor} = ${series[i]}`);
    }
    return { series, steps, rule };
  }
  if (pattern === "QUARTIC_POLYNOMIAL_TERMS") {
    const k = choose(r, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    rule = [
      `Use n⁴ − n³ − n² for consecutive integers beginning at ${k}.`,
      `लगातार पूर्णांकों के लिए n⁴ − n³ − n² लें, ${k} से शुरू करें।`,
      `ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਲਈ n⁴ − n³ − n² ਲਵੋ, ${k} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।`,
    ];
    for (let i = 0; i < length; i++) {
      const n = k + i,
        value = n ** 4 - n ** 3 - n ** 2;
      series.push(value);
      steps.push(`${n}⁴ − ${n}³ − ${n}² = ${value}`);
    }
    return { series, steps, rule };
  }
  if (pattern === "CONSECUTIVE_CUBES") {
    const k = choose(r, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    rule = [
      `Cubes of consecutive integers, beginning with ${k}.`,
      `लगातार पूर्णांकों के घन लें, ${k} से शुरू करें।`,
      `ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਦੇ ਘਣ ਲਵੋ, ${k} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।`,
    ];
    for (let i = 0; i < length; i++) {
      series.push((k + i) ** 3);
      steps.push(`${k + i}³ = ${series[i]}`);
    }
    return { series, steps, rule };
  }
  if (pattern === "INTERLEAVED_PROGRESSIVE_DIFFERENCE") {
    const a = choose(r, [3, 5, 8]),
      b = choose(r, [18, 21, 25]),
      rise = choose(r, [1, 2, 3]);
    rule = [
      `Separate odd and even positions. Their differences change by +${rise} and −${rise}, respectively.`,
      `विषम और सम स्थान अलग करें। उनके अंतर क्रमशः +${rise} और −${rise} बदलते हैं।`,
      `ਟਾਂਕ ਅਤੇ ਜਿਸਤ ਸਥਾਨ ਵੱਖ ਕਰੋ। ਉਨ੍ਹਾਂ ਦੇ ਅੰਤਰ ਕ੍ਰਮਵਾਰ +${rise} ਅਤੇ −${rise} ਨਾਲ ਬਦਲਦੇ ਹਨ।`,
    ];
    series.push(start, start + choose(r, [31, 47, 59]));
    steps.push(`${series[0]}, ${series[1]}`);
    for (let i = 2; i < length; i++) {
      const pos = Math.floor(i / 2) - 1,
        d = i % 2 === 0 ? a + pos * rise : b - pos * rise;
      series.push(series[i - 2]! + d);
      steps.push(`${series[i - 2]} + ${d} = ${series[i]}`);
    }
    return { series, steps, rule };
  }
  let operation: (n: number, i: number) => [number, string];
  if (pattern === "QUADRATIC_DIFFERENCE") {
    const second = choose(r, [5, 11, 23]),
      third = choose(r, [2, 4, 6]);
    rule = [
      `The differences have first value ${first}, initial increase ${second}, and constant second increase ${third}.`,
      `अंतर ${first} से शुरू होते हैं; उनकी शुरुआती वृद्धि ${second} है, जो हर बार ${third} बढ़ती है।`,
      `ਅੰਤਰ ${first} ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੇ ਹਨ; ਉਨ੍ਹਾਂ ਦਾ ਸ਼ੁਰੂਆਤੀ ਵਾਧਾ ${second} ਹੈ, ਜੋ ਹਰ ਵਾਰ ${third} ਵਧਦਾ ਹੈ।`,
    ];
    operation = (n, i) => {
      const d = first + i * second + ((i * (i - 1)) / 2) * third;
      return [
        n + d,
        `${n} + (${first} + ${i} × ${second} + ${i} × ${i - 1} ÷ 2 × ${third}) = ${n + d}`,
      ];
    };
  } else if (pattern === "POWER_DIFFERENCE") {
    rule = [
      `Add ${scale} × (4^k − 2^k), with k starting at ${shift} and increasing by one.`,
      `हर बार ${scale} × (4^k − 2^k) जोड़ें; k को ${shift} से शुरू करके एक-एक बढ़ाएँ।`,
      `ਹਰ ਵਾਰ ${scale} × (4^k − 2^k) ਜੋੜੋ; k ਨੂੰ ${shift} ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ਇੱਕ-ਇੱਕ ਵਧਾਓ।`,
    ];
    operation = (n, i) => {
      const k = i + shift,
        d = scale * (4 ** k - 2 ** k);
      return [n + d, `${n} + ${scale} × (4^${k} − 2^${k}) = ${n + d}`];
    };
  } else if (
    pattern === "DESCENDING_CUBE_DIFFERENCE" ||
    pattern === "ODD_SQUARE_DIFFERENCE"
  ) {
    const cube = pattern === "DESCENDING_CUBE_DIFFERENCE",
      k = cube ? choose(r, [15, 17, 19]) : choose(r, [3, 5, 7]),
      power = cube ? 3 : 2;
    start =
      scale *
        Array.from(
          { length: length - 1 },
          (_, i) => (k + (cube ? -2 : 2) * i) ** power,
        ).reduce((a, b) => a + b, 0) +
      choose(r, [41, 73, 101, 139]);
    rule = [
      `Subtract ${scale} times the ${cube ? "cubes of descending" : "squares of ascending"} odd integers, starting at ${k}.`,
      `${k} से शुरू होने वाली ${cube ? "घटती" : "बढ़ती"} विषम संख्याओं के ${cube ? "घन" : "वर्ग"} के ${scale} गुने घटाएँ।`,
      `${k} ਤੋਂ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੀਆਂ ${cube ? "ਘਟਦੀਆਂ" : "ਵਧਦੀਆਂ"} ਟਾਂਕ ਸੰਖਿਆਵਾਂ ਦੇ ${cube ? "ਘਣ" : "ਵਰਗ"} ਦੇ ${scale} ਗੁਣੇ ਘਟਾਓ।`,
    ];
    operation = (n, i) => {
      const v = k + (cube ? -2 : 2) * i,
        d = scale * v ** power;
      return [n - d, `${n} − ${scale} × ${v}${cube ? "³" : "²"} = ${n - d}`];
    };
  } else if (
    pattern === "VARIABLE_MULTIPLY_SUBTRACT" ||
    pattern === "VARIABLE_MULTIPLY_ADD"
  ) {
    start = choose(r, [3, 4, 5, 6, 7, 8, 9, 10, 12]);
    const k = 1;
    const subtract = pattern === "VARIABLE_MULTIPLY_SUBTRACT",
      mode = choose(r, [0, 1]),
      b = choose(r, [5, 6, 7, 8, 9]);
    rule = subtract
      ? [
          `Multiply by successive integers starting at ${k}, then subtract the multiplier.`,
          `लगातार पूर्णांकों से गुणा करें, ${k} से शुरू करें; फिर वही संख्या घटाएँ।`,
          `ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ, ${k} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ; ਫਿਰ ਉਹੀ ਸੰਖਿਆ ਘਟਾਓ।`,
        ]
      : mode === 0
        ? [
            `Multiply by successive integers starting at ${k}, then add 2, 4, 6, … .`,
            `लगातार पूर्णांकों से गुणा करें, ${k} से शुरू करें; फिर 2, 4, 6, … जोड़ें।`,
            `ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ, ${k} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ; ਫਿਰ 2, 4, 6, … ਜੋੜੋ।`,
          ]
        : [
            `Multiply by successive integers starting at ${k}; the addend starts at ${b} and decreases by one.`,
            `लगातार पूर्णांकों से गुणा करें, ${k} से शुरू करें; जोड़ी जाने वाली संख्या ${b} से शुरू होकर एक-एक घटती है।`,
            `ਲਗਾਤਾਰ ਪੂਰਨ ਅੰਕਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ, ${k} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ; ਜੋੜੀ ਜਾਣ ਵਾਲੀ ਸੰਖਿਆ ${b} ਤੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਇੱਕ-ਇੱਕ ਘਟਦੀ ਹੈ।`,
          ];
    operation = (n, i) => {
      const m = k + i,
        add = subtract ? -m : mode === 0 ? 2 * (i + 1) : b - i;
      return [
        n * m + add,
        `${n} × ${m} ${add < 0 ? "−" : "+"} ${Math.abs(add)} = ${n * m + add}`,
      ];
    };
  } else if (
    pattern === "FRACTIONAL_GEOMETRIC" ||
    pattern === "VARIABLE_FRACTIONAL_MULTIPLIER" ||
    pattern === "VARIABLE_FRACTIONAL_DIVISOR"
  ) {
    const division = pattern === "VARIABLE_FRACTIONAL_DIVISOR";
    const m = division
      ? choose(r, [4.5, 5, 5.5, 6])
      : pattern === "FRACTIONAL_GEOMETRIC"
        ? choose(r, [1.5, 2.5])
        : choose(r, [1.5, 2, 2.5]);
    start = division
      ? choose(r, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) *
        Array.from({ length: length - 1 }, (_, i) => m - i * 0.5).reduce(
          (a, b) => a * b,
          1,
        )
      : choose(r, [2, 2.5, 4, 8, 12, 16]);
    rule = division
      ? [
          `Divide successively by ${m}, ${m - 0.5}, ${m - 1}, … .`,
          `क्रम से ${m}, ${m - 0.5}, ${m - 1}, … से भाग दें।`,
          `ਕ੍ਰਮ ਨਾਲ ${m}, ${m - 0.5}, ${m - 1}, … ਨਾਲ ਭਾਗ ਕਰੋ।`,
        ]
      : pattern === "FRACTIONAL_GEOMETRIC"
        ? [
            `Multiply each term by ${m}.`,
            `हर पद को ${m} से गुणा करें।`,
            `ਹਰ ਪਦ ਨੂੰ ${m} ਨਾਲ ਗੁਣਾ ਕਰੋ।`,
          ]
        : [
            `The multipliers are ${m}, ${m + 0.5}, ${m + 1}, … .`,
            `गुणक क्रम से ${m}, ${m + 0.5}, ${m + 1}, … हैं।`,
            `ਗੁਣਕ ਕ੍ਰਮ ਨਾਲ ${m}, ${m + 0.5}, ${m + 1}, … ਹਨ।`,
          ];
    operation = (n, i) => {
      const v = division
        ? m - i * 0.5
        : pattern === "FRACTIONAL_GEOMETRIC"
          ? m
          : m + i * 0.5;
      return [
        division ? n / v : n * v,
        `${cleanNumber(n)} ${division ? "÷" : "×"} ${v} = ${cleanNumber(division ? n / v : n * v)}`,
      ];
    };
  } else if (pattern === "ALTERNATING_MULTIPLY_DIVIDE") {
    const [m, d] = choose(r, [
      [2, 4],
      [2, 8],
      [3, 6],
      [4, 8],
    ] as const);
    start = choose(r, [48, 96, 144, 192]);
    rule = [
      `Alternate multiplication by ${m} and division by ${d}.`,
      `बारी-बारी से ${m} से गुणा और ${d} से भाग दें।`,
      `ਵਾਰੀ-ਵਾਰੀ ${m} ਨਾਲ ਗੁਣਾ ਅਤੇ ${d} ਨਾਲ ਭਾਗ ਕਰੋ।`,
    ];
    operation = (n, i) => {
      const mul = i % 2 === 0;
      const result = mul ? n * m : n / d;
      return [
        result,
        `${cleanNumber(n)} ${mul ? "×" : "÷"} ${mul ? m : d} = ${cleanNumber(result)}`,
      ];
    };
  } else {
    const primeStart = choose(r, [0, 1, 2]);
    let delta = first;
    rule = [
      `The first difference is ${first}; increase it successively by the primes beginning with ${primes[primeStart]}.`,
      `पहला अंतर ${first} है; इसे ${primes[primeStart]} से शुरू होने वाली लगातार अभाज्य संख्याओं से बढ़ाएँ।`,
      `ਪਹਿਲਾ ਅੰਤਰ ${first} ਹੈ; ਇਸ ਨੂੰ ${primes[primeStart]} ਤੋਂ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲੀਆਂ ਲਗਾਤਾਰ ਅਭਾਜ ਸੰਖਿਆਵਾਂ ਨਾਲ ਵਧਾਓ।`,
    ];
    operation = (n, i) => {
      const value = n + delta,
        line = `${n} + ${delta} = ${value}`;
      delta += primes[primeStart + i]!;
      return [value, line];
    };
  }
  series.push(cleanNumber(start));
  for (let i = 0; i < length - 1; i++) {
    const [value, line] = operation(series[i]!, i);
    series.push(cleanNumber(value));
    steps.push(line);
  }
  return { series, steps, rule };
}
export function generateAdvancedBns(input: {
  seed?: string;
  patternKind: Bns001PatternKind;
  taskKind?: Bns001TaskKind;
  language?: Bns001Language;
  examProfile?: "BANKING_PRELIMS" | "BANKING_MAINS";
}): Bns001Question {
  const seed = input.seed ?? "BNS-V3",
    task =
      input.taskKind ??
      choose(rng(`${input.seed ?? "BNS-V3"}:task`), [
        "NEXT_TERM",
        "MISSING_TERM",
        "WRONG_TERM",
      ] as const),
    lang = input.language ?? "en",
    profile = input.examProfile ?? "BANKING_PRELIMS";
  if (
    !["NEXT_TERM", "MISSING_TERM", "WRONG_TERM"].includes(task) ||
    !["en", "hi", "pa"].includes(lang)
  )
    throw Error("BNS-001 unsupported task or language.");
  if (
    profile === "BANKING_MAINS" &&
    !BNS_MAINS_PATTERNS.includes(input.patternKind)
  )
    throw Error("BNS-001 pattern outside the bounded Mains profile.");
  for (let attempt = 0; attempt < 128; attempt++) {
    const r = rng(`${seed}:${attempt}`),
      hidden = choose(
        r,
        task === "WRONG_TERM" ? [0, 1, 2, 3, 4, 5, 6, 7] : [2, 3, 4],
      );
    const visibleCount = task === "WRONG_TERM" ? 8 : 6;
    const length = visibleCount + 1;
    const s = state(input.patternKind, `${seed}:${attempt}:state`, length);
    if (
      s.series.some((n) => !Number.isFinite(n) || n <= 0) ||
      s.series.slice(0, visibleCount).some((n) => n > 250000)
    )
      continue;
    const visible: (number | "?")[] = s.series.slice(0, visibleCount);
    let answer =
      task === "NEXT_TERM" ? s.series[visibleCount]! : s.series[hidden]!;
    if (task === "MISSING_TERM") visible[hidden] = "?";
    if (task === "WRONG_TERM") {
      visible[hidden] = cleanNumber(answer + choose(r, [-3, -1, 1, 2, 3]));
      answer = Number(visible[hidden]);
      const repairs = independentWrongTermRepairs(visible.map(Number));
      if (repairs.length !== 1 || repairs[0]!.index !== hidden) continue;
    }
    const target = task === "NEXT_TERM" ? visibleCount : hidden;
    const before = s.series[target - 1]!,
      priorGap = before - s.series[target - 2]!;
    const candidate =
      task === "WRONG_TERM"
        ? visible.map(Number)
        : task === "MISSING_TERM"
          ? [
              before,
              s.series[target + 1]!,
              (before + s.series[target + 1]!) / 2,
              before + priorGap,
              answer + (answer - before),
              answer - 1,
              answer + 1,
              answer * 2,
              answer / 2,
            ]
          : [
              before + priorGap,
              before - (answer - before),
              answer + (answer - before),
              before,
              answer - 1,
              answer + 1,
              answer * 2,
              answer / 2,
            ];
    const choices = [answer];
    for (const raw of candidate) {
      const n = cleanNumber(raw);
      if (n <= 0 || choices.includes(n)) continue;
      if (task !== "WRONG_TERM") {
        const complete =
          task === "NEXT_TERM"
            ? [...visible.map(Number), n]
            : visible.map((v, i) => (i === hidden ? n : Number(v)));
        if (independentGrammarMatches(complete).length) continue;
      }
      choices.push(n);
      if (choices.length === 5) break;
    }
    if (choices.length !== 5) continue;
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [choices[i], choices[j]] = [choices[j]!, choices[i]!];
    }
    const prompt =
      task === "NEXT_TERM"
        ? text(
            lang,
            "What number comes next in the series?",
            "शृंखला में अगली संख्या क्या होगी?",
            "ਲੜੀ ਵਿੱਚ ਅਗਲੀ ਸੰਖਿਆ ਕੀ ਹੋਵੇਗੀ?",
          )
        : task === "MISSING_TERM"
          ? text(
              lang,
              "What number replaces the question mark?",
              "प्रश्न चिह्न की जगह कौन-सी संख्या आएगी?",
              "ਪ੍ਰਸ਼ਨ ਚਿੰਨ੍ਹ ਦੀ ਥਾਂ ਕਿਹੜੀ ਸੰਖਿਆ ਆਵੇਗੀ?",
            )
          : text(
              lang,
              "Which number is wrong in the series?",
              "शृंखला में कौन-सी संख्या गलत है?",
              "ਲੜੀ ਵਿੱਚ ਕਿਹੜੀ ਸੰਖਿਆ ਗਲਤ ਹੈ?",
            );
    const keyRule = s.rule[lang === "hi" ? 1 : lang === "pa" ? 2 : 0]!;
    const working = [
      keyRule,
      ...s.steps.slice(
        0,
        input.patternKind === "CONSECUTIVE_CUBES" ||
          input.patternKind === "QUARTIC_POLYNOMIAL_TERMS"
          ? visibleCount + (task === "NEXT_TERM" ? 1 : 0)
          : visibleCount - (task === "NEXT_TERM" ? 0 : 1),
      ),
    ];
    if (task === "WRONG_TERM")
      working.push(
        text(
          lang,
          `The wrong number is ${answer}; replace it with ${s.series[hidden]}.`,
          `गलत संख्या ${answer} है; इसे ${s.series[hidden]} से बदलें।`,
          `ਗਲਤ ਸੰਖਿਆ ${answer} ਹੈ; ਇਸ ਦੀ ਥਾਂ ${s.series[hidden]} ਰੱਖੋ।`,
        ),
      );
    else
      working.push(
        text(
          lang,
          `Required number = ${answer}.`,
          `आवश्यक संख्या = ${answer}।`,
          `ਲੋੜੀਂਦੀ ਸੰਖਿਆ = ${answer}।`,
        ),
      );
    const q: Bns001Question = {
      packageId: "BNS-001",
      questionId: `BNS-V3-${input.patternKind}-${task}-${seed}-${lang}-${profile}`,
      seed,
      language: lang,
      examProfile: profile,
      optionCount: 5,
      taskKind: task,
      patternKind: input.patternKind,
      difficulty: profile === "BANKING_MAINS" ? "Hard" : "Medium",
      visibleSeries: visible,
      stem: `${prompt} ${visible.join(", ")}${task === "NEXT_TERM" ? ", ?" : ""}`,
      options: choices.map(String),
      optionMetadata: choices.map((n) => ({
        text: String(n),
        misconceptionId:
          n === answer
            ? "CORRECT"
            : task === "WRONG_TERM"
              ? "REJECT_VALID_TERM"
              : "OPERATION_OR_ARITHMETIC_ERROR",
        derivation:
          n === answer
            ? "Satisfies the supported full-series rule."
            : "Does not produce a valid completion of the governing rule.",
      })),
      correctIndex: choices.indexOf(answer),
      answer: String(answer),
      explanation: {
        keyRule,
        working,
        shortcut: text(
          lang,
          "Write the differences or operations in order.",
          "अंतर या संक्रियाएँ क्रम से लिखें।",
          "ਅੰਤਰ ਜਾਂ ਕਿਰਿਆਵਾਂ ਕ੍ਰਮ ਨਾਲ ਲਿਖੋ।",
        ),
        trap: text(
          lang,
          "Check the rule over the complete visible series.",
          "पूरी दी गई शृंखला पर नियम जाँचें।",
          "ਪੂਰੀ ਦਿੱਤੀ ਹੋਈ ਲੜੀ ਉੱਤੇ ਨਿਯਮ ਜਾਂਚੋ।",
        ),
      },
      proof: {
        fullSeries: s.series,
        hiddenIndex: task === "NEXT_TERM" ? null : hidden,
        canonicalNext: s.series.at(-1)!,
        supportedGrammarMatches: independentGrammarMatches(s.series),
        independentVerifier: "PASS",
      },
      traceability: {
        packageId: "BNS-001",
        contractVersion: "BNS-001-CONTENT-REVIEW-V3",
        ownership: "SPEED_MATHEMATICS_BANKING_NUMBER_SERIES",
        numberSystemOwnership: false,
        reasoningLetterSeriesOwnership: false,
        reviewStatus: "UNREVIEWED",
        questionStudioDiscoverable: false,
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
      },
    };
    if (independentlyVerifyBns001Question(q).valid) return q;
  }
  throw Error(
    `BNS-001 no unique ${input.patternKind}/${task} item for ${seed}.`,
  );
}
