import { renderWordSequence } from "../foundation/distractors";
import type { LexicalComparisonTrace, WorLocale, WorQuestionState } from "../foundation/types";

function comparisonSentence(trace: LexicalComparisonTrace, locale: WorLocale): string {
  if (trace.decision !== "FIRST_DIFFERING_CHARACTER") {
    const shorter = trace.decision === "LEFT_IS_PREFIX" ? trace.left : trace.right;
    const longer = trace.decision === "LEFT_IS_PREFIX" ? trace.right : trace.left;
    if (locale === "hi-IN") return `${shorter} और ${longer} में ${trace.commonPrefix} तक अक्षर समान हैं। ${shorter} यहीं पूरा हो जाता है, इसलिए वह पहले आएगा।`;
    if (locale === "pa-IN") return `${shorter} ਅਤੇ ${longer} ਵਿੱਚ ${trace.commonPrefix} ਤੱਕ ਅੱਖਰ ਇੱਕੋ ਹਨ। ${shorter} ਇੱਥੇ ਪੂਰਾ ਹੋ ਜਾਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਹ ਪਹਿਲਾਂ ਆਵੇਗਾ।`;
    return `${shorter} and ${longer} match through ${trace.commonPrefix}. ${shorter} ends here, so the shorter word comes first.`;
  }
  const first = trace.winner === "LEFT_FIRST" ? trace.left : trace.right;
  const firstChar = trace.winner === "LEFT_FIRST" ? trace.leftDecisionChar : trace.rightDecisionChar;
  const secondChar = trace.winner === "LEFT_FIRST" ? trace.rightDecisionChar : trace.leftDecisionChar;
  if (!trace.commonPrefix) {
    if (locale === "hi-IN") return `${trace.left} और ${trace.right} के पहले अक्षर ${firstChar} और ${secondChar} हैं। ${firstChar} पहले आता है, इसलिए ${first} पहले होगा।`;
    if (locale === "pa-IN") return `${trace.left} ਅਤੇ ${trace.right} ਦੇ ਪਹਿਲੇ ਅੱਖਰ ${firstChar} ਅਤੇ ${secondChar} ਹਨ। ${firstChar} ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ, ਇਸ ਲਈ ${first} ਪਹਿਲਾਂ ਹੋਵੇਗਾ।`;
    return `The first letters of ${trace.left} and ${trace.right} are ${firstChar} and ${secondChar}. ${firstChar} comes first, so ${first} comes first.`;
  }
  const prefix = trace.commonPrefix;
  if (locale === "hi-IN") return `${trace.left} और ${trace.right} में ${prefix} तक अक्षर समान हैं। पहला अलग अक्षर ${firstChar} और ${secondChar} है। ${firstChar} पहले आता है, इसलिए ${first} पहले होगा।`;
  if (locale === "pa-IN") return `${trace.left} ਅਤੇ ${trace.right} ਵਿੱਚ ${prefix} ਤੱਕ ਅੱਖਰ ਇੱਕੋ ਹਨ। ਪਹਿਲੇ ਵੱਖਰੇ ਅੱਖਰ ${firstChar} ਅਤੇ ${secondChar} ਹਨ। ${firstChar} ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ, ਇਸ ਲਈ ${first} ਪਹਿਲਾਂ ਹੋਵੇਗਾ।`;
  return `${trace.left} and ${trace.right} match through ${prefix}. The first different letters are ${firstChar} and ${secondChar}. ${firstChar} comes first, so ${first} comes first.`;
}

export function renderWorExplanation(state: WorQuestionState, locale: WorLocale): string {
  const rule = locale === "hi-IN"
    ? "शब्दों को बाएँ से दाएँ अक्षर-दर-अक्षर मिलाएँ। पहला अलग अक्षर क्रम तय करता है; यदि एक शब्द वहीं पूरा हो जाए, तो छोटा शब्द पहले आता है।"
    : locale === "pa-IN"
      ? "ਸ਼ਬਦਾਂ ਨੂੰ ਖੱਬੇ ਤੋਂ ਸੱਜੇ ਅੱਖਰ-ਅੱਖਰ ਮਿਲਾਓ। ਪਹਿਲਾ ਵੱਖਰਾ ਅੱਖਰ ਕ੍ਰਮ ਤੈਅ ਕਰਦਾ ਹੈ; ਜੇ ਇੱਕ ਸ਼ਬਦ ਉੱਥੇ ਹੀ ਪੂਰਾ ਹੋ ਜਾਵੇ, ਤਾਂ ਛੋਟਾ ਸ਼ਬਦ ਪਹਿਲਾਂ ਆਉਂਦਾ ਹੈ।"
      : "Compare the words letter by letter from left to right. The first different letter decides the order; if one word ends there, the shorter word comes first.";
  const useful = [...state.comparisonTrace]
    .sort((a, b) => Number(b.decision !== "FIRST_DIFFERING_CHARACTER") - Number(a.decision !== "FIRST_DIFFERING_CHARACTER") || b.commonPrefixLength - a.commonPrefixLength)
    .slice(0, 2)
    .map((trace) => comparisonSentence(trace, locale));
  const ascending = renderWordSequence(state.canonicalAscendingOrder);
  const finalOrder = renderWordSequence(state.requestedOrder);
  const orderLine = state.sortDirection === "DESCENDING"
    ? locale === "hi-IN" ? `सामान्य क्रम ${ascending} है। इसे उलटने पर मांगा गया क्रम ${finalOrder} होगा।`
      : locale === "pa-IN" ? `ਆਮ ਕ੍ਰਮ ${ascending} ਹੈ। ਇਸ ਨੂੰ ਉਲਟਣ ਉੱਤੇ ਮੰਗਿਆ ਕ੍ਰਮ ${finalOrder} ਹੋਵੇਗਾ।`
        : `The normal order is ${ascending}. Reversing it gives the requested order ${finalOrder}.`
    : locale === "hi-IN" ? `अंतिम शब्दकोश क्रम है: ${ascending}।`
      : locale === "pa-IN" ? `ਅੰਤਿਮ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਹੈ: ${ascending}।`
        : `Final dictionary order: ${ascending}.`;
  const answerLine = locale === "hi-IN" ? `इसलिए सही उत्तर ${state.correctAnswer} है।`
    : locale === "pa-IN" ? `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${state.correctAnswer} ਹੈ।`
      : `Therefore, the correct answer is ${state.correctAnswer}.`;
  return [rule, ...useful, orderLine, answerLine].join(" ");
}
