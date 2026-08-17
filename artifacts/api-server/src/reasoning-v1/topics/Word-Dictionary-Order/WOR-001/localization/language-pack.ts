import type { WorLocale, WorQuestionState } from "../foundation/types";

export function renderWorStem(state: WorQuestionState, locale: WorLocale): string {
  const rank = state.queryRank ?? 0;
  const target = state.targetWord ?? "";
  const inserted = state.insertionWord ?? "";
  const english: Record<WorQuestionState["taskKind"], string> = {
    SELECT_COMPLETE_ORDER: "Arrange the following words in the order in which they would appear in an English dictionary.",
    SELECT_DESCENDING_ORDER: "Arrange the following words in reverse dictionary order, from last to first.",
    SELECT_FIRST: "Which of the following words will come first in an English dictionary?",
    SELECT_LAST: "Which of the following words will come last in an English dictionary?",
    SELECT_KTH: `After arranging the words in dictionary order, which word will be at position ${rank}?`,
    FIND_RANK: `After arranging the words in dictionary order, what will be the position of ${target}?`,
    SELECT_PREDECESSOR: `Which word will come immediately before ${target} in dictionary order?`,
    SELECT_SUCCESSOR: `Which word will come immediately after ${target} in dictionary order?`,
    SELECT_MIDDLE: "Which word will be exactly in the middle after arranging the words in dictionary order?",
    INSERT_WORD: `The displayed words are already in dictionary order. At which position should ${inserted} be inserted?`,
    RANK_AFTER_INSERTION: `If ${inserted} is inserted in the displayed dictionary order, what will be the new position of ${target}?`,
    PREDECESSOR_AFTER_INSERTION: `After inserting ${inserted} in the displayed dictionary order, which word will come immediately before it?`,
    FIND_MISPLACED_WORD: "One word is misplaced in the displayed dictionary order. Which word is it?",
    FIND_INCORRECT_PAIR: "Which adjacent pair is not in the correct dictionary order?",
    COMPLETE_PARTIAL_ORDER: "Choose the word that correctly fills the blank in the displayed dictionary order.",
  };
  const hindi: Record<WorQuestionState["taskKind"], string> = {
    SELECT_COMPLETE_ORDER: "निम्न शब्दों को अंग्रेज़ी शब्दकोश में आने वाले क्रम में लगाइए।",
    SELECT_DESCENDING_ORDER: "निम्न शब्दों को उल्टे शब्दकोश क्रम में, अंतिम से प्रथम की ओर लगाइए।",
    SELECT_FIRST: "निम्न में से कौन-सा शब्द अंग्रेज़ी शब्दकोश में सबसे पहले आएगा?",
    SELECT_LAST: "निम्न में से कौन-सा शब्द अंग्रेज़ी शब्दकोश में सबसे अंत में आएगा?",
    SELECT_KTH: `शब्दों को शब्दकोश क्रम में लगाने पर स्थान ${rank} पर कौन-सा शब्द आएगा?`,
    FIND_RANK: `शब्दों को शब्दकोश क्रम में लगाने पर ${target} का स्थान क्या होगा?`,
    SELECT_PREDECESSOR: `शब्दकोश क्रम में ${target} से ठीक पहले कौन-सा शब्द आएगा?`,
    SELECT_SUCCESSOR: `शब्दकोश क्रम में ${target} के ठीक बाद कौन-सा शब्द आएगा?`,
    SELECT_MIDDLE: "शब्दों को शब्दकोश क्रम में लगाने पर ठीक बीच में कौन-सा शब्द आएगा?",
    INSERT_WORD: `दिए गए शब्द पहले से शब्दकोश क्रम में हैं। ${inserted} को किस स्थान पर रखा जाएगा?`,
    RANK_AFTER_INSERTION: `दिए गए शब्दकोश क्रम में ${inserted} जोड़ने पर ${target} का नया स्थान क्या होगा?`,
    PREDECESSOR_AFTER_INSERTION: `${inserted} को सही शब्दकोश क्रम में जोड़ने पर उसके ठीक पहले कौन-सा शब्द आएगा?`,
    FIND_MISPLACED_WORD: "दिए गए शब्दकोश क्रम में एक शब्द गलत स्थान पर है। वह कौन-सा शब्द है?",
    FIND_INCORRECT_PAIR: "कौन-सी साथ-साथ दी गई जोड़ी सही शब्दकोश क्रम में नहीं है?",
    COMPLETE_PARTIAL_ORDER: "दिए गए शब्दकोश क्रम में खाली स्थान पर सही बैठने वाला शब्द चुनिए।",
  };
  const punjabi: Record<WorQuestionState["taskKind"], string> = {
    SELECT_COMPLETE_ORDER: "ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦਾਂ ਨੂੰ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦਕੋਸ਼ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਲਗਾਓ।",
    SELECT_DESCENDING_ORDER: "ਹੇਠਾਂ ਦਿੱਤੇ ਸ਼ਬਦਾਂ ਨੂੰ ਉਲਟੇ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ, ਅਖੀਰ ਤੋਂ ਪਹਿਲੇ ਵੱਲ ਲਗਾਓ।",
    SELECT_FIRST: "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦਕੋਸ਼ ਵਿੱਚ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਆਵੇਗਾ?",
    SELECT_LAST: "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸ਼ਬਦ ਅੰਗਰੇਜ਼ੀ ਸ਼ਬਦਕੋਸ਼ ਵਿੱਚ ਸਭ ਤੋਂ ਅਖੀਰ ਆਵੇਗਾ?",
    SELECT_KTH: `ਸ਼ਬਦਾਂ ਨੂੰ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਸਥਾਨ ${rank} ਉੱਤੇ ਕਿਹੜਾ ਸ਼ਬਦ ਆਵੇਗਾ?`,
    FIND_RANK: `ਸ਼ਬਦਾਂ ਨੂੰ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ${target} ਦਾ ਸਥਾਨ ਕੀ ਹੋਵੇਗਾ?`,
    SELECT_PREDECESSOR: `ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ${target} ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਕਿਹੜਾ ਸ਼ਬਦ ਆਵੇਗਾ?`,
    SELECT_SUCCESSOR: `ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ${target} ਤੋਂ ਠੀਕ ਬਾਅਦ ਕਿਹੜਾ ਸ਼ਬਦ ਆਵੇਗਾ?`,
    SELECT_MIDDLE: "ਸ਼ਬਦਾਂ ਨੂੰ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਬਿਲਕੁਲ ਵਿਚਕਾਰ ਕਿਹੜਾ ਸ਼ਬਦ ਆਵੇਗਾ?",
    INSERT_WORD: `ਦਿੱਤੇ ਸ਼ਬਦ ਪਹਿਲਾਂ ਹੀ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਹਨ। ${inserted} ਨੂੰ ਕਿਹੜੇ ਸਥਾਨ ਉੱਤੇ ਰੱਖਿਆ ਜਾਵੇਗਾ?`,
    RANK_AFTER_INSERTION: `ਦਿੱਤੇ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ${inserted} ਜੋੜਨ ਤੋਂ ਬਾਅਦ ${target} ਦਾ ਨਵਾਂ ਸਥਾਨ ਕੀ ਹੋਵੇਗਾ?`,
    PREDECESSOR_AFTER_INSERTION: `${inserted} ਨੂੰ ਸਹੀ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਉਸ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਕਿਹੜਾ ਸ਼ਬਦ ਆਵੇਗਾ?`,
    FIND_MISPLACED_WORD: "ਦਿੱਤੇ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਇੱਕ ਸ਼ਬਦ ਗਲਤ ਥਾਂ ਉੱਤੇ ਹੈ। ਉਹ ਕਿਹੜਾ ਸ਼ਬਦ ਹੈ?",
    FIND_INCORRECT_PAIR: "ਨਾਲ-ਨਾਲ ਦਿੱਤੀ ਕਿਹੜੀ ਜੋੜੀ ਸਹੀ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਨਹੀਂ ਹੈ?",
    COMPLETE_PARTIAL_ORDER: "ਦਿੱਤੇ ਸ਼ਬਦਕੋਸ਼ ਕ੍ਰਮ ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਉੱਤੇ ਸਹੀ ਬੈਠਣ ਵਾਲਾ ਸ਼ਬਦ ਚੁਣੋ।",
  };
  return locale === "hi-IN" ? hindi[state.taskKind] : locale === "pa-IN" ? punjabi[state.taskKind] : english[state.taskKind];
}
