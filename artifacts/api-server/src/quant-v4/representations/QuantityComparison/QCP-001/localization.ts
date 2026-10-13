import { quantityLabel, relationText } from "./display";
import { quadraticText, quadraticWorking } from "./quadratic-source";
import type {
  Qcp001Language,
  Qcp001Operand,
  Qcp001Question,
  Qcp001SourceState,
} from "./types";
const say = (language: Qcp001Language, hi: string, pa: string) =>
  language === "hi" ? hi : pa;
const set = (values: readonly number[]) =>
  `{${[...new Set(values)].sort((a, b) => a - b).join(", ")}}`;
function prompt(operand: Qcp001Operand, language: Qcp001Language) {
  const first = operand.states[0]!,
    left = operand.label === "Quantity I";
  if (first.kind === "PERCENTAGE") {
    const bases = operand.states.map((s) =>
        s.kind === "PERCENTAGE" ? s.baseValue : 0,
      ),
      variable = left ? "M" : "N";
    return bases.length === 1
      ? say(
          language,
          `${bases[0]} का ${first.percentageRate}%`,
          `${bases[0]} ਦਾ ${first.percentageRate}%`,
        )
      : say(
          language,
          `${variable} का ${first.percentageRate}%, जहाँ ${variable} ∈ ${set(bases)}`,
          `${variable} ਦਾ ${first.percentageRate}%, ਜਿੱਥੇ ${variable} ∈ ${set(bases)}`,
        );
  }
  if (first.kind === "RATIO") {
    const a = left ? "A" : "C",
      b = left ? "B" : "D",
      values = operand.states.map((s) => (s.kind === "RATIO" ? s.valueA : 0));
    return say(
      language,
      `${b}, यदि ${a}:${b} = ${first.ratioA}:${first.ratioB} और ${a} ${values.length === 1 ? "= " + values[0] : "∈ " + set(values)}`,
      `${b}, ਜੇ ${a}:${b} = ${first.ratioA}:${first.ratioB} ਅਤੇ ${a} ${values.length === 1 ? "= " + values[0] : "∈ " + set(values)}`,
    );
  }
  if (first.kind === "ALGEBRA") {
    const variable = left ? "x" : "y";
    const equations = [
      ...new Set(
        operand.states.map((s) =>
          s.kind === "ALGEBRA" ? quadraticText(s, variable) : "",
        ),
      ),
    ];
    return `${variable}, ${say(language, "जहाँ", "ਜਿੱਥੇ")} ${equations.join(say(language, " या ", " ਜਾਂ "))}`;
  }
  const values = operand.states.map((s) =>
      s.kind === "NUMBER_SYSTEM" ? s.dividend : 0,
    ),
    v = left ? "P" : "Q";
  return values.length === 1
    ? say(
        language,
        `${values[0]} को ${first.divisor} से भाग देने पर शेषफल`,
        `${values[0]} ਨੂੰ ${first.divisor} ਨਾਲ ਭਾਗ ਕਰਨ ਉੱਤੇ ਬਾਕੀ`,
      )
    : say(
        language,
        `${v} को ${first.divisor} से भाग देने पर शेषफल, जहाँ ${v} ∈ ${set(values)}`,
        `${v} ਨੂੰ ${first.divisor} ਨਾਲ ਭਾਗ ਕਰਨ ਉੱਤੇ ਬਾਕੀ, ਜਿੱਥੇ ${v} ∈ ${set(values)}`,
      );
}
function working(
  state: Qcp001SourceState,
  variable: string,
  language: Qcp001Language,
) {
  if (state.kind === "PERCENTAGE")
    return `${state.baseValue} × ${state.percentageRate} ÷ 100 = ${(state.baseValue * state.percentageRate) / 100}`;
  if (state.kind === "RATIO")
    return `${state.valueA} × ${state.ratioB} ÷ ${state.ratioA} = ${(state.valueA * state.ratioB) / state.ratioA}`;
  if (state.kind === "ALGEBRA") return quadraticWorking(state, variable);
  const remainder =
    ((state.dividend % state.divisor) + state.divisor) % state.divisor;
  const quotient = (state.dividend - remainder) / state.divisor;
  return `${state.dividend} = ${state.divisor} × ${quotient} + ${remainder}; ${say(language, "शेषफल", "ਬਾਕੀ")} = ${remainder}`;
}
export function localizeQcp001(
  question: Qcp001Question,
  language: Qcp001Language,
): Qcp001Question {
  if (language === "en") return question;
  const quantities = [question.quantityI, question.quantityII].map((o) => ({
    ...o,
    prompt: prompt(o, language),
  }));
  const steps = quantities.map(
    (o, i) =>
      `${quantityLabel(language, i === 0 ? "I" : "II")}: ${[...new Set(o.states.map((s) => working(s, i === 0 ? "x" : "y", language)))].join("; ")}. ${say(language, "संभव मान", "ਸੰਭਵ ਮੁੱਲ")} = ${set(o.values)}.`,
  );
  const a = question.quantityI.values,
    b = question.quantityII.values,
    minA = Math.min(...a),
    maxA = Math.max(...a),
    minB = Math.min(...b),
    maxB = Math.max(...b);
  const relation = question.answerClass;
  if (relation === "QUANTITY_I_GREATER")
    steps.push(
      `${minA} > ${maxB}; ${say(language, "पहली मात्रा का सबसे छोटा मान भी दूसरी के सबसे बड़े मान से बड़ा है।", "ਪਹਿਲੀ ਮਾਤਰਾ ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ਵੀ ਦੂਜੀ ਦੇ ਸਭ ਤੋਂ ਵੱਡੇ ਮੁੱਲ ਤੋਂ ਵੱਡਾ ਹੈ।")}`,
    );
  else if (relation === "QUANTITY_I_LESS")
    steps.push(
      `${maxA} < ${minB}; ${say(language, "पहली मात्रा का सबसे बड़ा मान भी दूसरी के सबसे छोटे मान से छोटा है।", "ਪਹਿਲੀ ਮਾਤਰਾ ਦਾ ਸਭ ਤੋਂ ਵੱਡਾ ਮੁੱਲ ਵੀ ਦੂਜੀ ਦੇ ਸਭ ਤੋਂ ਛੋਟੇ ਮੁੱਲ ਤੋਂ ਛੋਟਾ ਹੈ।")}`,
    );
  else if (
    relation === "QUANTITY_I_GREATER_OR_EQUAL" ||
    relation === "QUANTITY_I_LESS_OR_EQUAL"
  )
    steps.push(
      `${relation === "QUANTITY_I_GREATER_OR_EQUAL" ? minA : maxA} = ${relation === "QUANTITY_I_GREATER_OR_EQUAL" ? maxB : minB}; ${say(language, "समानता संभव है; अन्य सभी युग्म इसी दिशा में संबंध बनाए रखते हैं।", "ਬਰਾਬਰੀ ਸੰਭਵ ਹੈ; ਹੋਰ ਸਾਰੇ ਜੋੜੇ ਇਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਸੰਬੰਧ ਬਣਾਈ ਰੱਖਦੇ ਹਨ।")}`,
    );
  else if (question.answerEvidenceMode === "EXACT_EQUALITY")
    steps.push(
      `${set(a)} = ${set(b)}; ${say(language, "दोनों मात्राएँ बराबर हैं।", "ਦੋਵੇਂ ਮਾਤਰਾਵਾਂ ਬਰਾਬਰ ਹਨ।")}`,
    );
  else {
    const greater = a.flatMap((x) =>
        b.filter((y) => x > y).map((y) => [x, y]),
      )[0]!,
      less = a.flatMap((x) => b.filter((y) => x < y).map((y) => [x, y]))[0]!;
    steps.push(
      `${greater[0]} > ${greater[1]}, ${less[0]} < ${less[1]}; ${say(language, "संबंध बदलता है, इसलिए एक निश्चित संबंध नहीं बताया जा सकता।", "ਸੰਬੰਧ ਬਦਲਦਾ ਹੈ, ਇਸ ਲਈ ਇੱਕ ਨਿਸ਼ਚਿਤ ਸੰਬੰਧ ਨਹੀਂ ਦੱਸਿਆ ਜਾ ਸਕਦਾ।")}`,
    );
  }
  const options = question.optionMetadata.map((o) =>
    relationText(o.relationClass, language),
  );
  return {
    ...question,
    language,
    questionId: `${question.questionId}-${language}`,
    quantityI: quantities[0]!,
    quantityII: quantities[1]!,
    direction: say(
      language,
      "मात्रा I और मात्रा II के बीच सबसे सटीक संबंध चुनें।",
      "ਮਾਤਰਾ I ਅਤੇ ਮਾਤਰਾ II ਵਿਚਕਾਰ ਸਭ ਤੋਂ ਸਹੀ ਸੰਬੰਧ ਚੁਣੋ।",
    ),
    stem: `${quantityLabel(language, "I")}: ${quantities[0]!.prompt}\n${quantityLabel(language, "II")}: ${quantities[1]!.prompt}`,
    options,
    optionMetadata: question.optionMetadata.map((o, i) => ({
      ...o,
      text: options[i]!,
    })),
    answer: options[question.correctIndex]!,
    explanation: {
      keyIdea: say(
        language,
        "दोनों मात्राओं के सभी संभव मान निकालें और हर संभव जोड़े की तुलना करें।",
        "ਦੋਵੇਂ ਮਾਤਰਾਵਾਂ ਦੇ ਸਾਰੇ ਸੰਭਵ ਮੁੱਲ ਕੱਢੋ ਅਤੇ ਹਰ ਸੰਭਵ ਜੋੜੇ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
      ),
      steps,
      shortcut: say(
        language,
        "पहले सबसे छोटे और सबसे बड़े संभव मानों की तुलना करें।",
        "ਪਹਿਲਾਂ ਸਭ ਤੋਂ ਛੋਟੇ ਅਤੇ ਸਭ ਤੋਂ ਵੱਡੇ ਸੰਭਵ ਮੁੱਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
      ),
    },
  };
}
