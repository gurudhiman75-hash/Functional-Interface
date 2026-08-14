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

function taskConclusion(state: WorQuestionState, locale: WorLocale): string {
  const answer = state.correctAnswer;
  if (locale === "hi-IN") {
    switch (state.taskKind) {
      case "SELECT_COMPLETE_ORDER":
      case "SELECT_DESCENDING_ORDER": return `इसलिए मांगा गया पूरा क्रम ${answer} है।`;
      case "SELECT_FIRST": return `इस क्रम में सबसे पहला शब्द ${answer} है।`;
      case "SELECT_LAST": return `इस क्रम में सबसे अंतिम शब्द ${answer} है।`;
      case "SELECT_KTH": return `गिनने पर स्थान ${state.queryRank} पर ${answer} आता है।`;
      case "FIND_RANK": return `इसलिए ${state.targetWord} का स्थान ${answer} है।`;
      case "SELECT_PREDECESSOR": return `${state.targetWord} से ठीक पहले ${answer} आता है।`;
      case "SELECT_SUCCESSOR": return `${state.targetWord} के ठीक बाद ${answer} आता है।`;
      case "SELECT_MIDDLE": return `बीच वाले स्थान पर ${answer} आता है।`;
      case "INSERT_WORD": return `पूरे क्रम में ${state.insertionWord} स्थान ${answer} पर आता है, इसलिए इसे वहीं जोड़ा जाएगा।`;
      case "RANK_AFTER_INSERTION": return `${state.insertionWord} को जोड़ने के बाद ${state.targetWord} का नया स्थान ${answer} है।`;
      case "PREDECESSOR_AFTER_INSERTION": return `${state.insertionWord} को जोड़ने के बाद उसके ठीक पहले ${answer} आता है।`;
      case "FIND_MISPLACED_WORD": return `दिए गए क्रम की सही क्रम से तुलना करने पर केवल ${answer} गलत स्थान पर मिलता है।`;
      case "FIND_INCORRECT_PAIR": return `दिए गए क्रम में शब्दकोश नियम तोड़ने वाली एकमात्र आसन्न जोड़ी ${answer} है।`;
      case "COMPLETE_PARTIAL_ORDER": return `पूरा सही क्रम बनाने के लिए रिक्त स्थान में ${answer} आएगा।`;
    }
  }
  if (locale === "pa-IN") {
    switch (state.taskKind) {
      case "SELECT_COMPLETE_ORDER":
      case "SELECT_DESCENDING_ORDER": return `ਇਸ ਲਈ ਮੰਗਿਆ ਗਿਆ ਪੂਰਾ ਕ੍ਰਮ ${answer} ਹੈ।`;
      case "SELECT_FIRST": return `ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਸਭ ਤੋਂ ਪਹਿਲਾ ਸ਼ਬਦ ${answer} ਹੈ।`;
      case "SELECT_LAST": return `ਇਸ ਕ੍ਰਮ ਵਿੱਚ ਸਭ ਤੋਂ ਆਖਰੀ ਸ਼ਬਦ ${answer} ਹੈ।`;
      case "SELECT_KTH": return `ਗਿਣਤੀ ਕਰਨ 'ਤੇ ਸਥਾਨ ${state.queryRank} ਉੱਤੇ ${answer} ਆਉਂਦਾ ਹੈ।`;
      case "FIND_RANK": return `ਇਸ ਲਈ ${state.targetWord} ਦਾ ਸਥਾਨ ${answer} ਹੈ।`;
      case "SELECT_PREDECESSOR": return `${state.targetWord} ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ${answer} ਆਉਂਦਾ ਹੈ।`;
      case "SELECT_SUCCESSOR": return `${state.targetWord} ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ${answer} ਆਉਂਦਾ ਹੈ।`;
      case "SELECT_MIDDLE": return `ਬਿਲਕੁਲ ਵਿਚਕਾਰਲੇ ਸਥਾਨ ਉੱਤੇ ${answer} ਆਉਂਦਾ ਹੈ।`;
      case "INSERT_WORD": return `ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ${state.insertionWord} ਸਥਾਨ ${answer} ਉੱਤੇ ਆਉਂਦਾ ਹੈ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਉੱਥੇ ਜੋੜਿਆ ਜਾਵੇਗਾ।`;
      case "RANK_AFTER_INSERTION": return `${state.insertionWord} ਜੋੜਨ ਤੋਂ ਬਾਅਦ ${state.targetWord} ਦਾ ਨਵਾਂ ਸਥਾਨ ${answer} ਹੈ।`;
      case "PREDECESSOR_AFTER_INSERTION": return `${state.insertionWord} ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਇਸ ਤੋਂ ਤੁਰੰਤ ਪਹਿਲਾਂ ${answer} ਆਉਂਦਾ ਹੈ।`;
      case "FIND_MISPLACED_WORD": return `ਦਿੱਤੇ ਕ੍ਰਮ ਦੀ ਸਹੀ ਕ੍ਰਮ ਨਾਲ ਤੁਲਨਾ ਕਰਨ 'ਤੇ ਕੇਵਲ ${answer} ਗਲਤ ਥਾਂ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।`;
      case "FIND_INCORRECT_PAIR": return `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਸ਼ਬਦਕੋਸ਼ ਨਿਯਮ ਤੋੜਨ ਵਾਲੀ ਇਕੱਲੀ ਨਾਲ-ਨਾਲ ਜੋੜੀ ${answer} ਹੈ।`;
      case "COMPLETE_PARTIAL_ORDER": return `ਪੂਰਾ ਸਹੀ ਕ੍ਰਮ ਬਣਾਉਣ ਲਈ ਖਾਲੀ ਥਾਂ ਵਿੱਚ ${answer} ਆਵੇਗਾ।`;
    }
  }
  switch (state.taskKind) {
    case "SELECT_COMPLETE_ORDER":
    case "SELECT_DESCENDING_ORDER": return `Therefore, the requested complete order is ${answer}.`;
    case "SELECT_FIRST": return `So the first word in the order is ${answer}.`;
    case "SELECT_LAST": return `So the last word in the order is ${answer}.`;
    case "SELECT_KTH": return `Counting the ordered words, position ${state.queryRank} contains ${answer}.`;
    case "FIND_RANK": return `Therefore, ${state.targetWord} is at position ${answer}.`;
    case "SELECT_PREDECESSOR": return `The word immediately before ${state.targetWord} is ${answer}.`;
    case "SELECT_SUCCESSOR": return `The word immediately after ${state.targetWord} is ${answer}.`;
    case "SELECT_MIDDLE": return `The word exactly in the middle is ${answer}.`;
    case "INSERT_WORD": return `In the complete order, ${state.insertionWord} occupies position ${answer}, so it must be inserted there.`;
    case "RANK_AFTER_INSERTION": return `After inserting ${state.insertionWord}, ${state.targetWord} is at the new position ${answer}.`;
    case "PREDECESSOR_AFTER_INSERTION": return `After insertion, the word immediately before ${state.insertionWord} is ${answer}.`;
    case "FIND_MISPLACED_WORD": return `Comparing the displayed sequence with the correct order shows that ${answer} is the single misplaced word.`;
    case "FIND_INCORRECT_PAIR": return `The only adjacent pair in the displayed sequence that violates dictionary order is ${answer}.`;
    case "COMPLETE_PARTIAL_ORDER": return `The blank must be filled with ${answer} to restore the complete dictionary order.`;
  }
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
  return [rule, ...useful, orderLine, taskConclusion(state, locale)].join(" ");
}
