import type { Sta001State } from "../STAT-001/types";
import type { Stat002State } from "../STAT-002/types";
import type { Stat003State } from "../STAT-003/types";
import { formatExactNumber } from "./exact";

export type StatisticsFoundationLanguage = "en" | "hi" | "pa";
type State = Sta001State | Stat002State | Stat003State;
export function normalizeStatisticsFoundationLanguage(
  value: unknown,
): StatisticsFoundationLanguage {
  if (value === undefined) return "en";
  if (typeof value !== "string")
    throw new Error("Statistics language must be a string.");
  const language = value.trim().toLowerCase();
  if (language === "en" || language === "en-in") return "en";
  if (language === "hi" || language === "hi-in") return "hi";
  if (language === "pa" || language === "pa-in") return "pa";
  throw new Error(`Unsupported Statistics foundation language '${value}'.`);
}

const kinds = [
  "SIMPLE_MEAN_RAW",
  "MISSING_OBSERVATION",
  "CORRECTED_MEAN",
  "COMBINED_MEAN",
  "MEDIAN_RAW",
  "MODE_RAW",
  "RAW_POPULATION_SD",
  "MEAN_AND_MEAN_SQUARES",
  "TRANSLATED_DATA",
  "SCALED_DATA",
  "REVERSE_SCALE",
  "AFFINE_FROM_MOMENTS",
  "DISCRETE_FREQUENCY_MEAN",
  "GROUPED_FREQUENCY_MEAN",
  "DISCRETE_FREQUENCY_MEDIAN",
  "GROUPED_FREQUENCY_MEDIAN",
  "GROUPED_FREQUENCY_MODE",
  "EMPIRICAL_MODE",
  "EMPIRICAL_DIFFERENCE",
  "MISSING_VALUE_FROM_MEAN",
] as const;
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
const list = (xs: readonly number[]) => xs.join(", ");

/** Authored from structured facts; English strings are never parsed or translated. */
export function renderStatisticsFoundationNative(
  state: State,
  language: "hi" | "pa",
  qlId: string,
) {
  const index = kinds.indexOf(state.kind);
  if (index < 0 || qlId !== `STAT-QL-${String(index + 1).padStart(3, "0")}`)
    throw new Error("Native Statistics state/QL ownership mismatch.");
  const t = (hi: string, pa: string) => (language === "hi" ? hi : pa);
  let stem = "",
    keyIdea = "",
    steps: string[] = [],
    numerator = 0,
    denominator = 1;
  const mean = t("माध्य", "ਔਸਤ"),
    median = t("माध्यिका", "ਮੱਧਿਕਾ"),
    mode = t("बहुलक", "ਬਹੁਲਕ"),
    sd = t("मानक विचलन", "ਮਿਆਰੀ ਵਿਛੱਲਣ");
  const table = (
    rows: readonly (readonly [string | number, number])[],
    grouped = false,
    cumulative = false,
  ) =>
    `| ${grouped ? t("वर्ग अंतराल", "ਵਰਗ ਅੰਤਰਾਲ") : t("मान (x)", "ਮੁੱਲ (x)")} | ${cumulative ? t("संचयी आवृत्ति", "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ") : t("आवृत्ति (f)", "ਬਾਰੰਬਾਰਤਾ (f)")} |\n|---:|---:|\n${rows.map((r) => `| ${r[0]} | ${r[1]} |`).join("\n")}`;
  const population = (values: readonly number[]) => {
    const n = values.length,
      total = sum(values),
      squares = sum(values.map((x) => x * x));
    const variance = squares / n - (total / n) ** 2;
    return { n, total, squares, variance, sd: Math.sqrt(variance) };
  };
  const sdIdea = t(
    "समष्टि मानक विचलन के लिए भाजक N है, N−1 नहीं। σ² = Σx²/N − (Σx/N)²।",
    "ਸਮਸ਼ਟੀ ਦੇ ਮਿਆਰੀ ਵਿਛੱਲਣ ਲਈ ਭਾਜਕ N ਹੈ, N−1 ਨਹੀਂ। σ² = Σx²/N − (Σx/N)²।",
  );
  switch (state.kind) {
    case "SIMPLE_MEAN_RAW":
      stem = t(
        `इन मानों का अंकगणितीय माध्य क्या है: ${list(state.values)}?`,
        `ਇਨ੍ਹਾਂ ਮੁੱਲਾਂ ਦੀ ਅੰਕਗਣਿਤਕ ਔਸਤ ਕੀ ਹੈ: ${list(state.values)}?`,
      );
      numerator = sum(state.values);
      denominator = state.values.length;
      keyIdea = t(
        "सभी मानों के योग को उनकी संख्या से भाग दें।",
        "ਸਾਰੇ ਮੁੱਲਾਂ ਦੇ ਜੋੜ ਨੂੰ ਉਨ੍ਹਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
      );
      steps = [
        `Σx = ${state.values.join(" + ")} = ${numerator}`,
        `N = ${denominator}`,
      ];
      break;
    case "MISSING_OBSERVATION":
      stem = t(
        `${state.observationCount} प्रेक्षणों का माध्य ${state.mean} है। ज्ञात प्रेक्षण ${list(state.knownValues)} हैं। लुप्त प्रेक्षण क्या है?`,
        `${state.observationCount} ਪ੍ਰੇਖਣਾਂ ਦੀ ਔਸਤ ${state.mean} ਹੈ। ਜਾਣੇ ਹੋਏ ਪ੍ਰੇਖਣ ${list(state.knownValues)} ਹਨ। ਗੁੰਮ ਪ੍ਰੇਖਣ ਕੀ ਹੈ?`,
      );
      numerator = state.observationCount * state.mean - sum(state.knownValues);
      keyIdea = t(
        "आवश्यक कुल योग में से ज्ञात प्रेक्षणों का योग घटाएँ।",
        "ਲੋੜੀਂਦੇ ਕੁੱਲ ਜੋੜ ਵਿੱਚੋਂ ਜਾਣੇ ਹੋਏ ਪ੍ਰੇਖਣਾਂ ਦਾ ਜੋੜ ਘਟਾਓ।",
      );
      steps = [
        `Σx = ${state.observationCount} × ${state.mean} = ${state.observationCount * state.mean}`,
        `x = ${state.observationCount * state.mean} − ${sum(state.knownValues)}`,
      ];
      break;
    case "CORRECTED_MEAN":
      stem = t(
        `${state.observationCount} प्रेक्षणों का माध्य ${state.reportedMean} निकाला गया था। एक मान ${state.correctValue} के बजाय ${state.wrongValue} दर्ज हुआ था। सही माध्य क्या है?`,
        `${state.observationCount} ਪ੍ਰੇਖਣਾਂ ਦੀ ਔਸਤ ${state.reportedMean} ਕੱਢੀ ਗਈ ਸੀ। ਇੱਕ ਮੁੱਲ ${state.correctValue} ਦੀ ਥਾਂ ${state.wrongValue} ਦਰਜ ਕੀਤਾ ਗਿਆ ਸੀ। ਸਹੀ ਔਸਤ ਕੀ ਹੈ?`,
      );
      numerator =
        state.observationCount * state.reportedMean -
        state.wrongValue +
        state.correctValue;
      denominator = state.observationCount;
      keyIdea = t(
        "पहले कुल योग से गलत मान हटाएँ और सही मान जोड़ें; फिर संख्या से भाग दें।",
        "ਪਹਿਲਾਂ ਕੁੱਲ ਜੋੜ ਵਿੱਚੋਂ ਗਲਤ ਮੁੱਲ ਘਟਾਓ ਅਤੇ ਸਹੀ ਮੁੱਲ ਜੋੜੋ; ਫਿਰ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ।",
      );
      steps = [
        `Σx = ${state.observationCount} × ${state.reportedMean} − ${state.wrongValue} + ${state.correctValue} = ${numerator}`,
      ];
      break;
    case "COMBINED_MEAN":
      stem = t(
        `पहले समूह में ${state.group1Count} प्रेक्षणों का माध्य ${state.group1Mean} है। दूसरे समूह में ${state.group2Count} प्रेक्षणों का माध्य ${state.group2Mean} है। संयुक्त माध्य क्या है?`,
        `ਪਹਿਲੇ ਸਮੂਹ ਦੇ ${state.group1Count} ਪ੍ਰੇਖਣਾਂ ਦੀ ਔਸਤ ${state.group1Mean} ਹੈ। ਦੂਜੇ ਸਮੂਹ ਦੇ ${state.group2Count} ਪ੍ਰੇਖਣਾਂ ਦੀ ਔਸਤ ${state.group2Mean} ਹੈ। ਸਾਂਝੀ ਔਸਤ ਕੀ ਹੈ?`,
      );
      numerator =
        state.group1Count * state.group1Mean +
        state.group2Count * state.group2Mean;
      denominator = state.group1Count + state.group2Count;
      keyIdea = t(
        "समूहों की संख्याओं को भार मानें; दोनों माध्यों का साधारण औसत न लें।",
        "ਸਮੂਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਨੂੰ ਭਾਰ ਮੰਨੋ; ਦੋਵੇਂ ਔਸਤਾਂ ਦਾ ਸਧਾਰਨ ਔਸਤ ਨਾ ਲਓ।",
      );
      steps = [
        `Σx = ${state.group1Count} × ${state.group1Mean} + ${state.group2Count} × ${state.group2Mean} = ${numerator}`,
        `N = ${state.group1Count} + ${state.group2Count} = ${denominator}`,
      ];
      break;
    case "MEDIAN_RAW": {
      stem = t(
        `इन प्रेक्षणों की माध्यिका क्या है: ${list(state.values)}?`,
        `ਇਨ੍ਹਾਂ ਪ੍ਰੇਖਣਾਂ ਦੀ ਮੱਧਿਕਾ ਕੀ ਹੈ: ${list(state.values)}?`,
      );
      const sorted = [...state.values].sort((a, b) => a - b),
        n = sorted.length;
      const a = sorted[Math.floor((n - 1) / 2)]!,
        b = sorted[Math.floor(n / 2)]!;
      numerator = a + b;
      denominator = 2;
      keyIdea = t(
        "प्रेक्षणों को बढ़ते क्रम में रखें। विषम संख्या में बीच का मान और सम संख्या में बीच के दो मानों का औसत लें।",
        "ਪ੍ਰੇਖਣਾਂ ਨੂੰ ਵਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖੋ। ਟਾਂਕ ਗਿਣਤੀ ਲਈ ਵਿਚਕਾਰਲਾ ਮੁੱਲ ਅਤੇ ਜਿਸਤ ਗਿਣਤੀ ਲਈ ਵਿਚਕਾਰਲੇ ਦੋ ਮੁੱਲਾਂ ਦਾ ਔਸਤ ਲਓ।",
      );
      steps = [
        list(sorted),
        n % 2 ? `${median} = ${a}` : `${median} = (${a} + ${b}) / 2`,
      ];
      break;
    }
    case "MODE_RAW": {
      stem = t(
        `इन प्रेक्षणों का बहुलक क्या है: ${list(state.values)}?`,
        `ਇਨ੍ਹਾਂ ਪ੍ਰੇਖਣਾਂ ਦਾ ਬਹੁਲਕ ਕੀ ਹੈ: ${list(state.values)}?`,
      );
      const counts = new Map<number, number>();
      for (const x of state.values) counts.set(x, (counts.get(x) ?? 0) + 1);
      const rows = [...counts].sort((a, b) => a[0] - b[0]);
      const max = Math.max(...counts.values());
      const winners = rows.filter((r) => r[1] === max);
      if (winners.length !== 1)
        throw new Error("Native mode requires a unique maximum.");
      numerator = winners[0]![0];
      keyIdea = t(
        "सबसे अधिक बार आने वाला मान बहुलक है; उसकी आवृत्ति उत्तर नहीं है।",
        "ਸਭ ਤੋਂ ਵੱਧ ਵਾਰ ਆਉਣ ਵਾਲਾ ਮੁੱਲ ਬਹੁਲਕ ਹੈ; ਉਸ ਦੀ ਬਾਰੰਬਾਰਤਾ ਉੱਤਰ ਨਹੀਂ ਹੈ।",
      );
      steps = [table(rows)];
      break;
    }
    case "RAW_POPULATION_SD":
    case "TRANSLATED_DATA":
    case "SCALED_DATA": {
      const p = population(state.values);
      const data = list(state.values);
      stem =
        state.kind === "RAW_POPULATION_SD"
          ? t(
              `मान ${data} पूरी समष्टि बनाते हैं। उनका मानक विचलन क्या है?`,
              `ਮੁੱਲ ${data} ਪੂਰੀ ਸਮਸ਼ਟੀ ਬਣਾਉਂਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦਾ ਮਿਆਰੀ ਵਿਛੱਲਣ ਕੀ ਹੈ?`,
            )
          : state.kind === "TRANSLATED_DATA"
            ? t(
                `पूरी समष्टि के मान ${data} हैं। प्रत्येक मान में ${state.additiveConstant} जोड़ने के बाद मानक विचलन क्या होगा?`,
                `ਪੂਰੀ ਸਮਸ਼ਟੀ ਦੇ ਮੁੱਲ ${data} ਹਨ। ਹਰੇਕ ਮੁੱਲ ਵਿੱਚ ${state.additiveConstant} ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਮਿਆਰੀ ਵਿਛੱਲਣ ਕੀ ਹੋਵੇਗਾ?`,
              )
            : t(
                `पूरी समष्टि के मान ${data} हैं। प्रत्येक मान को ${state.multiplier} से गुणा करने के बाद मानक विचलन क्या होगा?`,
                `ਪੂਰੀ ਸਮਸ਼ਟੀ ਦੇ ਮੁੱਲ ${data} ਹਨ। ਹਰੇਕ ਮੁੱਲ ਨੂੰ ${state.multiplier} ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੋਂ ਬਾਅਦ ਮਿਆਰੀ ਵਿਛੱਲਣ ਕੀ ਹੋਵੇਗਾ?`,
              );
      keyIdea = sdIdea;
      steps = [
        `N = ${p.n}; Σx = ${p.total}; Σx² = ${p.squares}`,
        `σ² = ${p.squares}/${p.n} − (${p.total}/${p.n})² = ${p.variance}`,
        `σ = √${p.variance} = ${p.sd}`,
      ];
      numerator = p.sd;
      if (state.kind === "TRANSLATED_DATA") {
        keyIdea += t(
          " सभी मानों में समान स्थिरांक जोड़ने से फैलाव नहीं बदलता।",
          " ਸਾਰੇ ਮੁੱਲਾਂ ਵਿੱਚ ਇੱਕੋ ਸਥਿਰ ਅੰਕ ਜੋੜਨ ਨਾਲ ਫੈਲਾਅ ਨਹੀਂ ਬਦਲਦਾ।",
        );
        steps.push("σ′ = σ");
      }
      if (state.kind === "SCALED_DATA") {
        keyIdea += t(
          " मानक विचलन गुणक के निरपेक्ष मान से गुणा होता है।",
          " ਮਿਆਰੀ ਵਿਛੱਲਣ ਗੁਣਕ ਦੇ ਨਿਰਪੇਖ ਮੁੱਲ ਨਾਲ ਗੁਣਾ ਹੁੰਦਾ ਹੈ।",
        );
        numerator *= Math.abs(state.multiplier);
        steps.push(`σ′ = |${state.multiplier}| × ${p.sd}`);
      }
      break;
    }
    case "MEAN_AND_MEAN_SQUARES":
    case "AFFINE_FROM_MOMENTS": {
      stem =
        state.kind === "MEAN_AND_MEAN_SQUARES"
          ? t(
              `किसी समष्टि में x का माध्य ${state.mean} और x² का माध्य ${state.meanOfSquares} है। x का मानक विचलन क्या है?`,
              `ਕਿਸੇ ਸਮਸ਼ਟੀ ਵਿੱਚ x ਦੀ ਔਸਤ ${state.mean} ਅਤੇ x² ਦੀ ਔਸਤ ${state.meanOfSquares} ਹੈ। x ਦਾ ਮਿਆਰੀ ਵਿਛੱਲਣ ਕੀ ਹੈ?`,
            )
          : t(
              `किसी समष्टि में x का माध्य ${state.mean} और x² का माध्य ${state.meanOfSquares} है। y = (${state.multiplier})x + (${state.additiveConstant}) का मानक विचलन क्या है?`,
              `ਕਿਸੇ ਸਮਸ਼ਟੀ ਵਿੱਚ x ਦੀ ਔਸਤ ${state.mean} ਅਤੇ x² ਦੀ ਔਸਤ ${state.meanOfSquares} ਹੈ। y = (${state.multiplier})x + (${state.additiveConstant}) ਦਾ ਮਿਆਰੀ ਵਿਛੱਲਣ ਕੀ ਹੈ?`,
            );
      const variance = state.meanOfSquares - state.mean ** 2;
      const sigma = Math.sqrt(variance);
      numerator = sigma;
      keyIdea = sdIdea;
      steps = [
        `σ² = ${state.meanOfSquares} − (${state.mean})² = ${variance}`,
        `σ = √${variance} = ${sigma}`,
      ];
      if (state.kind === "AFFINE_FROM_MOMENTS") {
        numerator *= Math.abs(state.multiplier);
        keyIdea += t(
          " y = ax+b के लिए σᵧ = |a|σₓ; b का प्रभाव नहीं पड़ता।",
          " y = ax+b ਲਈ σᵧ = |a|σₓ; b ਦਾ ਅਸਰ ਨਹੀਂ ਪੈਂਦਾ।",
        );
        steps.push(`σᵧ = |${state.multiplier}| × ${sigma}`);
      }
      break;
    }
    case "REVERSE_SCALE":
      stem = t(
        `y = kx में k धनात्मक है। x का मानक विचलन ${state.originalStandardDeviation} और y का ${state.transformedStandardDeviation} है। k का मान क्या है?`,
        `y = kx ਵਿੱਚ k ਧਨਾਤਮਕ ਹੈ। x ਦਾ ਮਿਆਰੀ ਵਿਛੱਲਣ ${state.originalStandardDeviation} ਅਤੇ y ਦਾ ${state.transformedStandardDeviation} ਹੈ। k ਦਾ ਮੁੱਲ ਕੀ ਹੈ?`,
      );
      numerator = state.transformedStandardDeviation;
      denominator = state.originalStandardDeviation;
      keyIdea = t(
        "σᵧ = |k|σₓ और k > 0 से k = σᵧ/σₓ।",
        "σᵧ = |k|σₓ ਅਤੇ k > 0 ਤੋਂ k = σᵧ/σₓ।",
      );
      steps = [`k = ${numerator}/${denominator}`];
      break;
    case "DISCRETE_FREQUENCY_MEAN":
    case "DISCRETE_FREQUENCY_MEDIAN": {
      const rows = [...state.rows].sort((a, b) => a.value - b.value),
        n = sum(rows.map((r) => r.frequency));
      stem =
        t(
          `निम्न आवृत्ति वितरण का ${state.kind === "DISCRETE_FREQUENCY_MEAN" ? mean : median} क्या है?`,
          `ਹੇਠਲੇ ਬਾਰੰਬਾਰਤਾ ਵੰਡ ਦਾ ${state.kind === "DISCRETE_FREQUENCY_MEAN" ? mean : median} ਕੀ ਹੈ?`,
        ) +
        "\n\n" +
        table(rows.map((r) => [r.value, r.frequency]));
      if (state.kind === "DISCRETE_FREQUENCY_MEAN") {
        numerator = sum(rows.map((r) => r.value * r.frequency));
        denominator = n;
        keyIdea = t(
          "आवृत्तियों को भार मानकर माध्य = Σfx/Σf निकालें।",
          "ਬਾਰੰਬਾਰਤਾਵਾਂ ਨੂੰ ਭਾਰ ਮੰਨ ਕੇ ਔਸਤ = Σfx/Σf ਕੱਢੋ।",
        );
        steps = [
          `Σf = ${n}`,
          `Σfx = ${rows.map((r) => `${r.value}×${r.frequency}`).join(" + ")} = ${numerator}`,
        ];
      } else {
        const at = (rank: number) => {
          let cf = 0;
          for (const r of rows) {
            cf += r.frequency;
            if (cf >= rank) return r.value;
          }
          throw new Error("Invalid median rank");
        };
        const a = Math.floor((n + 1) / 2),
          b = Math.floor(n / 2) + 1;
        numerator = at(a) + at(b);
        denominator = 2;
        keyIdea = t(
          "संचयी आवृत्ति से बीच के स्थानों के मान खोजें। सम संख्या में दोनों का औसत लें।",
          "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ਤੋਂ ਵਿਚਕਾਰਲੇ ਸਥਾਨਾਂ ਦੇ ਮੁੱਲ ਲੱਭੋ। ਜਿਸਤ ਗਿਣਤੀ ਲਈ ਦੋਵਾਂ ਦਾ ਔਸਤ ਲਓ।",
        );
        let cf = 0;
        steps = [
          `N = ${n}`,
          table(
            rows.map((r) => [r.value, (cf += r.frequency)]),
            false,
            true,
          ),
          `${t("संचयी आवृत्तियाँ ऊपर दी गई हैं।", "ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾਵਾਂ ਉੱਪਰ ਦਿੱਤੀਆਂ ਹਨ।")} ${a} → ${at(a)}; ${b} → ${at(b)}`,
        ];
      }
      break;
    }
    case "GROUPED_FREQUENCY_MEAN":
    case "GROUPED_FREQUENCY_MEDIAN":
    case "GROUPED_FREQUENCY_MODE": {
      const cs = state.classes,
        n = sum(cs.map((c) => c.frequency));
      const target =
        state.kind === "GROUPED_FREQUENCY_MEAN"
          ? mean
          : state.kind === "GROUPED_FREQUENCY_MEDIAN"
            ? median
            : mode;
      stem =
        t(
          `निम्न सतत वर्गीकृत वितरण का ${target} क्या है? प्रत्येक अंतराल में निचली सीमा शामिल और ऊपरी सीमा शामिल नहीं है। आवश्यक हो तो उत्तर दो दशमलव स्थानों तक दें।`,
          `ਹੇਠਲੇ ਨਿਰੰਤਰ ਵਰਗੀਕ੍ਰਿਤ ਵੰਡ ਦਾ ${target} ਕੀ ਹੈ? ਹਰੇਕ ਅੰਤਰਾਲ ਵਿੱਚ ਹੇਠਲੀ ਹੱਦ ਸ਼ਾਮਲ ਹੈ ਅਤੇ ਉੱਪਰਲੀ ਹੱਦ ਸ਼ਾਮਲ ਨਹੀਂ ਹੈ। ਲੋੜ ਪੈਣ 'ਤੇ ਉੱਤਰ ਦੋ ਦਸ਼ਮਲਵ ਸਥਾਨਾਂ ਤੱਕ ਦਿਓ।`,
        ) +
        "\n\n" +
        table(
          cs.map((c) => [`[${c.lower}, ${c.upper})`, c.frequency]),
          true,
        );
      if (state.kind === "GROUPED_FREQUENCY_MEAN") {
        numerator = sum(cs.map((c) => (c.lower + c.upper) * c.frequency));
        denominator = 2 * n;
        keyIdea = t(
          "हर वर्ग के मध्यबिंदु m = (निचली सीमा + ऊपरी सीमा)/2 को प्रतिनिधि मान लें। माध्य = Σfm/Σf।",
          "ਹਰੇਕ ਵਰਗ ਦਾ ਮੱਧ-ਬਿੰਦੂ m = (ਹੇਠਲੀ ਹੱਦ + ਉੱਪਰਲੀ ਹੱਦ)/2 ਪ੍ਰਤੀਨਿਧ ਮੁੱਲ ਹੈ। ਔਸਤ = Σfm/Σf।",
        );
        steps = [
          `Σf = ${n}`,
          `Σfm = ${cs.map((c) => `${c.frequency}×${(c.lower + c.upper) / 2}`).join(" + ")} = ${numerator / 2}`,
        ];
      } else if (state.kind === "GROUPED_FREQUENCY_MEDIAN") {
        let cf = 0;
        const c = cs.find((c) => {
          if (2 * (cf + c.frequency) >= n) return true;
          cf += c.frequency;
          return false;
        });
        if (!c) throw new Error("Missing median class");
        const h = c.upper - c.lower;
        numerator = 2 * c.lower * c.frequency + (n - 2 * cf) * h;
        denominator = 2 * c.frequency;
        keyIdea = t(
          "माध्यिका = l + ((N/2 − C)/f)h; C माध्यिका वर्ग से पहले की संचयी आवृत्ति है।",
          "ਮੱਧਿਕਾ = l + ((N/2 − C)/f)h; C ਮੱਧਿਕਾ ਵਰਗ ਤੋਂ ਪਹਿਲਾਂ ਦੀ ਸੰਚਿਤ ਬਾਰੰਬਾਰਤਾ ਹੈ।",
        );
        steps = [
          `N = ${n}; l = ${c.lower}; C = ${cf}; f = ${c.frequency}; h = ${h}`,
          `${median} = ${c.lower} + ((${n}/2 − ${cf})/${c.frequency}) × ${h}`,
        ];
      } else {
        const i = cs.findIndex(
            (c) => c.frequency === Math.max(...cs.map((c) => c.frequency)),
          ),
          c = cs[i]!,
          f0 = cs[i - 1]?.frequency,
          f2 = cs[i + 1]?.frequency;
        if (f0 === undefined || f2 === undefined)
          throw new Error("Modal class must have neighbours");
        const f1 = c.frequency,
          h = c.upper - c.lower,
          d = 2 * f1 - f0 - f2;
        numerator = c.lower * d + (f1 - f0) * h;
        denominator = d;
        keyIdea = t(
          "सबसे अधिक आवृत्ति वाला वर्ग बहुलक वर्ग है। बहुलक = l + ((f₁−f₀)/(2f₁−f₀−f₂))h।",
          "ਸਭ ਤੋਂ ਵੱਧ ਬਾਰੰਬਾਰਤਾ ਵਾਲਾ ਵਰਗ ਬਹੁਲਕ ਵਰਗ ਹੈ। ਬਹੁਲਕ = l + ((f₁−f₀)/(2f₁−f₀−f₂))h।",
        );
        steps = [
          `l = ${c.lower}; h = ${h}; f₀ = ${f0}; f₁ = ${f1}; f₂ = ${f2}`,
          `${mode} = ${c.lower} + ((${f1}−${f0})/(2×${f1}−${f0}−${f2}))×${h}`,
        ];
      }
      break;
    }
    case "EMPIRICAL_MODE":
      stem = t(
        `एक वितरण का माध्य ${state.mean} और माध्यिका ${state.median} है। अनुभवजन्य संबंध के अनुसार बहुलक क्या है?`,
        `ਇੱਕ ਵੰਡ ਦੀ ਔਸਤ ${state.mean} ਅਤੇ ਮੱਧਿਕਾ ${state.median} ਹੈ। ਅਨੁਭਵੀ ਸੰਬੰਧ ਅਨੁਸਾਰ ਬਹੁਲਕ ਕੀ ਹੈ?`,
      );
      numerator = 3 * state.median - 2 * state.mean;
      keyIdea = t(
        "अनुभवजन्य संबंध: बहुलक = 3 × माध्यिका − 2 × माध्य।",
        "ਅਨੁਭਵੀ ਸੰਬੰਧ: ਬਹੁਲਕ = 3 × ਮੱਧਿਕਾ − 2 × ਔਸਤ।",
      );
      steps = [`${mode} = 3 × ${state.median} − 2 × ${state.mean}`];
      break;
    case "EMPIRICAL_DIFFERENCE":
      stem = t(
        `किसी वितरण में माध्य − बहुलक = ${state.meanModeDifference} है। अनुभवजन्य संबंध के अनुसार माध्य − माध्यिका कितना है?`,
        `ਕਿਸੇ ਵੰਡ ਵਿੱਚ ਔਸਤ − ਬਹੁਲਕ = ${state.meanModeDifference} ਹੈ। ਅਨੁਭਵੀ ਸੰਬੰਧ ਅਨੁਸਾਰ ਔਸਤ − ਮੱਧਿਕਾ ਕਿੰਨਾ ਹੈ?`,
      );
      numerator = state.meanModeDifference;
      denominator = 3;
      keyIdea = t(
        "माध्य − बहुलक = 3(माध्य − माध्यिका)।",
        "ਔਸਤ − ਬਹੁਲਕ = 3(ਔਸਤ − ਮੱਧਿਕਾ)।",
      );
      steps = [`${mean} − ${median} = ${state.meanModeDifference}/3`];
      break;
    case "MISSING_VALUE_FROM_MEAN": {
      stem =
        t(
          `निम्न आवृत्ति वितरण का माध्य ${state.statedMean} है। लुप्त मान x क्या है?`,
          `ਹੇਠਲੇ ਬਾਰੰਬਾਰਤਾ ਵੰਡ ਦੀ ਔਸਤ ${state.statedMean} ਹੈ। ਗੁੰਮ ਮੁੱਲ x ਕੀ ਹੈ?`,
        ) +
        "\n\n" +
        table(
          state.values.map((v, i) => [
            v === null ? "x" : v,
            state.frequencies[i]!,
          ]),
        );
      const n = sum(state.frequencies),
        known = sum(
          state.values.map((v, i) =>
            v === null ? 0 : v * state.frequencies[i]!,
          ),
        );
      numerator = state.statedMean * n - known;
      denominator = state.frequencies[state.missingIndex]!;
      keyIdea = t(
        "Σfx = माध्य × Σf। ज्ञात पंक्तियों का योगदान घटाकर शेष को लुप्त मान की आवृत्ति से भाग दें।",
        "Σfx = ਔਸਤ × Σf। ਜਾਣੀਆਂ ਕਤਾਰਾਂ ਦਾ ਯੋਗਦਾਨ ਘਟਾ ਕੇ ਬਾਕੀ ਨੂੰ ਗੁੰਮ ਮੁੱਲ ਦੀ ਬਾਰੰਬਾਰਤਾ ਨਾਲ ਭਾਗ ਦਿਓ।",
      );
      steps = [
        `Σf = ${n}; Σfx = ${state.statedMean} × ${n} = ${state.statedMean * n}`,
        `${known} + ${denominator}x = ${state.statedMean * n}`,
        `x = (${state.statedMean * n} − ${known})/${denominator}`,
      ];
      break;
    }
    default: {
      const unreachable: never = state;
      throw new Error(`Unsupported native state ${unreachable}`);
    }
  }
  const answer = formatExactNumber(numerator, denominator);
  const equality = Number(answer) === numerator / denominator ? "=" : "≈";
  steps.push(
    `${t("उत्तर", "ਉੱਤਰ")}: ${numerator}/${denominator} ${equality} ${answer}`,
  );
  return { stem, answer, explanation: { keyIdea, steps } };
}

/** Source packages remain English mathematical authorities; only preview surfaces change. */
export function localizeStatisticsFoundationBatch<
  T extends { generationContext: Record<string, unknown>; questions: any[] },
>(
  batch: T,
  language: StatisticsFoundationLanguage,
): Omit<T, "generationContext" | "questions"> & {
  generationContext: Record<string, unknown>;
  questions: any[];
} {
  if (language === "en") return batch;
  const nativeStatus = "NATIVE_REVIEW_CANDIDATE";
  const nativeFields = (object: Record<string, any>) => ({
    language,
    sourceLanguage: "en",
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    manualApprovalRequired: true,
    reviewOnly: true,
    runtimeMode: `${String(object.packageId).replace("-", "")}_NATIVE_REVIEW_V1`,
    reviewStatus: nativeStatus,
    localizationStatus: "HI_PA_REVIEW_CANDIDATE",
    sourceReleaseId: object.releaseId,
    releaseId: `${object.packageId}_FOUNDATION_NATIVE_REVIEW_V1`,
    releaseFreezeStatus: "NATIVE_HUMAN_REVIEW_PENDING",
  });
  return {
    ...batch,
    generationContext: {
      ...batch.generationContext,
      ...nativeFields(batch.generationContext),
    },
    questions: batch.questions.map((q) => {
      const native = renderStatisticsFoundationNative(
        q.state,
        language,
        q.permanentQlId,
      );
      if (
        !q.validation?.valid ||
        native.answer !== q.answer ||
        q.options[q.correctIndex] !== native.answer
      )
        throw new Error("Native Statistics answer parity failed.");
      const fields = nativeFields(q);
      return {
        ...q,
        ...fields,
        text: native.stem,
        stem: native.stem,
        questionId: `${q.questionId}:${language}`,
        explanation: [
          native.explanation.keyIdea,
          ...native.explanation.steps,
        ].join("\n\n"),
        richExplanation: native.explanation,
        // Distractor derivations are source audit material, not untranslated native learner copy.
        optionMetadata: q.optionMetadata.map(
          ({
            text,
            misconceptionId,
          }: {
            text: string;
            misconceptionId: string;
          }) => ({ text, misconceptionId }),
        ),
        metadata: { ...q.metadata, ...fields },
        traceability: { ...q.traceability, ...fields },
      };
    }),
  };
}
