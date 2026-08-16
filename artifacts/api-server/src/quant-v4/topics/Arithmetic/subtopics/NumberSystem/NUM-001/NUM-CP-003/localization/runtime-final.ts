import type { NumCp003RetainedHiddenState } from "../retained/runtime-types";
import type { NumCp003PermanentQlId } from "../permanent/allocation";
import { runNumCp003LocalizedForQl } from "./runtime";
import type { NumCp003LocalizedQuestion, NumCp003TranslatedLanguage } from "./types";

function math(value: string | number | bigint): string {
  return `\\(${String(value)}\\)`;
}

function formatInteger(value: bigint | number): string {
  return typeof value === "bigint"
    ? value.toLocaleString("en-IN")
    : Math.trunc(value).toLocaleString("en-IN");
}

function divisorList(values: readonly bigint[], language: NumCp003TranslatedLanguage): string {
  const rendered = values.map((value) => math(value));
  if (rendered.length <= 1) return rendered[0] ?? "";
  return language === "hi"
    ? `${rendered.slice(0, -1).join(", ")} और ${rendered.at(-1)}`
    : `${rendered.slice(0, -1).join(", ")} ਅਤੇ ${rendered.at(-1)}`;
}

function directStem(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DIRECT_DIVISIBILITY" }>,
  language: NumCp003TranslatedLanguage,
): string {
  if (language === "hi") {
    return state.requestedPolarity === "DIVISIBLE"
      ? `${math(formatInteger(state.number))} निम्नलिखित में से किस संख्या से पूर्णतः विभाज्य है?`
      : `${math(formatInteger(state.number))} निम्नलिखित में से किस संख्या से पूर्णतः विभाज्य नहीं है?`;
  }
  return state.requestedPolarity === "DIVISIBLE"
    ? `${math(formatInteger(state.number))} ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਸੰਖਿਆ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੈ?`
    : `${math(formatInteger(state.number))} ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਸੰਖਿਆ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਨਹੀਂ ਹੈ?`;
}

function repeatedStem(
  state: Extract<NumCp003RetainedHiddenState, { kind: "IMPLICIT_REPEATED_NUMERAL" }>,
  language: NumCp003TranslatedLanguage,
): string {
  if (language === "hi") {
    return `${math(state.block)} को ${state.repeats} बार लगातार लिखकर एक संख्या बनाई गई है। बनी हुई संख्या निम्नलिखित में से किससे पूर्णतः विभाज्य है?`;
  }
  return `${math(state.block)} ਨੂੰ ${state.repeats} ਵਾਰ ਲਗਾਤਾਰ ਲਿਖ ਕੇ ਇੱਕ ਸੰਖਿਆ ਬਣਾਈ ਗਈ ਹੈ। ਬਣੀ ਸੰਖਿਆ ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਸ ਨਾਲ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਾਗਯੋਗ ਹੈ?`;
}

function dataSufficiencyStem(
  state: Extract<NumCp003RetainedHiddenState, { kind: "DATA_SUFFICIENCY" }>,
  currentStem: string,
  language: NumCp003TranslatedLanguage,
): string {
  const lines = currentStem.split("\n");
  const statementI = lines.find((line) => /^(?:कथन|ਕਥਨ) I:/u.test(line)) ?? "";
  const statementII = lines.find((line) => /^(?:कथन|ਕਥਨ) II:/u.test(line)) ?? "";
  if (language === "hi") {
    return `क्या ${math(state.template)} में गायब अंक ${math("X")} को निश्चित रूप से पाया जा सकता है?\n${statementI}\n${statementII}\nचुनिए कि दी गई जानकारी ${math("X")} को तय करने के लिए पर्याप्त है या नहीं।`;
  }
  return `ਕੀ ${math(state.template)} ਵਿੱਚ ਗੁੰਮ ਅੰਕ ${math("X")} ਨੂੰ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਲੱਭਿਆ ਜਾ ਸਕਦਾ ਹੈ?\n${statementI}\n${statementII}\nਚੁਣੋ ਕਿ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ${math("X")} ਨੂੰ ਤੈਅ ਕਰਨ ਲਈ ਕਾਫ਼ੀ ਹੈ ਜਾਂ ਨਹੀਂ।`;
}

function conceptFor(
  state: NumCp003RetainedHiddenState,
  qlId: NumCp003PermanentQlId,
  language: NumCp003TranslatedLanguage,
): string {
  const hi = language === "hi";
  switch (state.kind) {
    case "DIRECT_DIVISIBILITY":
      return hi
        ? "यहाँ सही विभाज्यता नियम लगाकर यह तय करना है कि कौन-सा विकल्प संख्या को बिना शेष के विभाजित करता है।"
        : "ਇੱਥੇ ਸਹੀ ਭਾਗਯੋਗਤਾ ਨਿਯਮ ਲਗਾ ਕੇ ਇਹ ਤੈਅ ਕਰਨਾ ਹੈ ਕਿ ਕਿਹੜਾ ਵਿਕਲਪ ਸੰਖਿਆ ਨੂੰ ਬਿਨਾਂ ਬਾਕੀ ਦੇ ਭਾਗ ਕਰਦਾ ਹੈ।";
    case "SINGLE_DIGIT_CANDIDATE_SET": {
      const taskHi: Record<string, string> = {
        "NUM-QL-002": "एकमात्र सही गायब अंक",
        "NUM-QL-003": "सबसे बड़ा या सबसे छोटा सही अंक",
        "NUM-QL-004": "सही अंकों की संख्या",
        "NUM-QL-005": "सही अंकों का योग",
        "NUM-QL-006": "सभी सही अंक",
        "NUM-QL-007": "सबसे बड़ी या सबसे छोटी सही पूरी संख्या",
      };
      const taskPa: Record<string, string> = {
        "NUM-QL-002": "ਇੱਕੋ ਸਹੀ ਗੁੰਮ ਅੰਕ",
        "NUM-QL-003": "ਸਭ ਤੋਂ ਵੱਡਾ ਜਾਂ ਸਭ ਤੋਂ ਛੋਟਾ ਸਹੀ ਅੰਕ",
        "NUM-QL-004": "ਸਹੀ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ",
        "NUM-QL-005": "ਸਹੀ ਅੰਕਾਂ ਦਾ ਜੋੜ",
        "NUM-QL-006": "ਸਾਰੇ ਸਹੀ ਅੰਕ",
        "NUM-QL-007": "ਸਭ ਤੋਂ ਵੱਡੀ ਜਾਂ ਸਭ ਤੋਂ ਛੋਟੀ ਸਹੀ ਪੂਰੀ ਸੰਖਿਆ",
      };
      return hi
        ? `यहाँ ${math(state.template)} में ${taskHi[qlId] ?? "सही मान"} निकालने के लिए ${divisorList(state.divisors, language)} की सभी शर्तें एक साथ लगानी हैं।`
        : `ਇੱਥੇ ${math(state.template)} ਵਿੱਚ ${taskPa[qlId] ?? "ਸਹੀ ਮੁੱਲ"} ਕੱਢਣ ਲਈ ${divisorList(state.divisors, language)} ਦੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਇਕੱਠਿਆਂ ਲਗਾਉਣੀਆਂ ਹਨ।`;
    }
    case "ORDERED_PAIR_CANDIDATE_SET":
      return hi
        ? `यहाँ ${math(state.template)} में क्रमित युग्म ${math("(X,Y)")} को ${divisorList(state.divisors, language)} की सभी शर्तें पूरी करनी हैं; ${math("X")} और ${math("Y")} की जगह बदलने से युग्म बदल जाता है।`
        : `ਇੱਥੇ ${math(state.template)} ਵਿੱਚ ਕ੍ਰਮਬੱਧ ਜੋੜੇ ${math("(X,Y)")} ਨੂੰ ${divisorList(state.divisors, language)} ਦੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਣੀਆਂ ਹਨ; ${math("X")} ਅਤੇ ${math("Y")} ਦੀ ਥਾਂ ਬਦਲਣ ਨਾਲ ਜੋੜਾ ਬਦਲ ਜਾਂਦਾ ਹੈ।`;
    case "DIGIT_BOUND_MULTIPLE":
      return hi
        ? `यहाँ ${state.digits}-अंकीय सीमा से शुरू करके ${math(state.divisor)} से विभाज्य ${state.direction === "GREATEST" ? "सबसे बड़ी" : "सबसे छोटी"} संख्या निकालनी है।`
        : `ਇੱਥੇ ${state.digits}-ਅੰਕੀ ਸੀਮਾ ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ${math(state.divisor)} ਨਾਲ ਭਾਗਯੋਗ ${state.direction === "GREATEST" ? "ਸਭ ਤੋਂ ਵੱਡੀ" : "ਸਭ ਤੋਂ ਛੋਟੀ"} ਸੰਖਿਆ ਕੱਢਣੀ ਹੈ।`;
    case "ONE_DIVISOR_RANGE":
      return hi
        ? `यहाँ ${math(formatInteger(state.lower))} से ${math(formatInteger(state.upper))} तक ${math(state.divisor)} से विभाज्य पूर्णांकों की गिनती करनी है; दोनों सिरे शामिल हैं।`
        : `ਇੱਥੇ ${math(formatInteger(state.lower))} ਤੋਂ ${math(formatInteger(state.upper))} ਤੱਕ ${math(state.divisor)} ਨਾਲ ਭਾਗਯੋਗ ਪੂਰਨ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ ਕਰਨੀ ਹੈ; ਦੋਵੇਂ ਸਿਰੇ ਸ਼ਾਮਲ ਹਨ।`;
    case "IMPLICIT_REPEATED_NUMERAL":
      return hi
        ? "पहले दिए गए ब्लॉक को बार-बार लिखकर पूरी संख्या बनानी है, फिर उस संख्या पर सही विभाज्यता नियम लगाना है।"
        : "ਪਹਿਲਾਂ ਦਿੱਤੇ ਬਲਾਕ ਨੂੰ ਵਾਰ-ਵਾਰ ਲਿਖ ਕੇ ਪੂਰੀ ਸੰਖਿਆ ਬਣਾਉਣੀ ਹੈ, ਫਿਰ ਉਸ ਸੰਖਿਆ ਉੱਤੇ ਸਹੀ ਭਾਗਯੋਗਤਾ ਨਿਯਮ ਲਗਾਉਣਾ ਹੈ।";
    case "LINKED_ARITHMETIC_DIVISIBILITY":
      return hi
        ? "पहले अंक वाला जोड़ सही पूरा करना है, फिर बनी संख्या पर विभाज्यता नियम लगाकर माँगा गया सबसे बड़ा या सबसे छोटा मान चुनना है।"
        : "ਪਹਿਲਾਂ ਅੰਕਾਂ ਵਾਲਾ ਜੋੜ ਠੀਕ ਪੂਰਾ ਕਰਨਾ ਹੈ, ਫਿਰ ਬਣੀ ਸੰਖਿਆ ਉੱਤੇ ਭਾਗਯੋਗਤਾ ਨਿਯਮ ਲਗਾ ਕੇ ਮੰਗਿਆ ਸਭ ਤੋਂ ਵੱਡਾ ਜਾਂ ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ ਚੁਣਨਾ ਹੈ।";
    case "DATA_SUFFICIENCY":
      return hi
        ? `यहाँ देखना है कि कथन I या II, अकेले या साथ में, ${math("X")} का केवल एक संभव मान तय करते हैं या नहीं।`
        : `ਇੱਥੇ ਦੇਖਣਾ ਹੈ ਕਿ ਕਥਨ I ਜਾਂ II, ਇਕੱਲੇ ਜਾਂ ਮਿਲ ਕੇ, ${math("X")} ਦਾ ਕੇਵਲ ਇੱਕ ਸੰਭਵ ਮੁੱਲ ਤੈਅ ਕਰਦੇ ਹਨ ਜਾਂ ਨਹੀਂ।`;
    case "CLAIM_VALIDATION":
      return hi
        ? "यहाँ दिए गए विभाज्यता कथन को उसके सही नियम से जाँचकर तय करना है कि कथन सही है या गलत।"
        : "ਇੱਥੇ ਦਿੱਤੇ ਭਾਗਯੋਗਤਾ ਕਥਨ ਨੂੰ ਉਸਦੇ ਸਹੀ ਨਿਯਮ ਨਾਲ ਜਾਂਚ ਕੇ ਤੈਅ ਕਰਨਾ ਹੈ ਕਿ ਕਥਨ ਸਹੀ ਹੈ ਜਾਂ ਗਲਤ।";
  }
}

function polishHindi(value: string): string {
  return value
    .replace(/उसका (\\\([^)]*\\\)) और (\\\([^)]*\\\)), दोनों से विभाज्य होना जरूरी है/gu, "उसे $1 और $2 दोनों से विभाज्य होना चाहिए")
    .replace(/वैकल्पिक स्थानों के अंकों के दोनों योगों/gu, "एक छोड़कर एक स्थान पर आने वाले अंकों के दोनों योगों")
    .replace(/वैकल्पिक स्थानों के अंकों के योग/gu, "एक छोड़कर एक स्थान पर आने वाले अंकों के योग")
    .replace(/संभव अंकों (\\\([^)]*\\\)) को जाँचने पर सही अंक (\\\([^)]*\\\)) मिलते हैं।/gu, "संभव अंकों $1 को जाँचने पर ये मान सही मिलते हैं: $2।")
    .replace(/सभी क्रमित अंक-युग्म/gu, "सभी क्रमित युग्म")
    .replace(/डेटा पर्याप्तता में कोई कथन तभी पर्याप्त है जब वह/gu, "किसी कथन को तभी पर्याप्त मानेंगे जब वह")
    .replace(/सही डेटा-पर्याप्तता निष्कर्ष चुनिए।/gu, "चुनिए कि दी गई जानकारी पर्याप्त है या नहीं।");
}

function polishPunjabi(value: string): string {
  return value
    .replace(/ਉਸਦਾ (\\\([^)]*\\\)) ਅਤੇ (\\\([^)]*\\\)), ਦੋਵਾਂ ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਜ਼ਰੂਰੀ ਹੈ/gu, "ਉਹ $1 ਅਤੇ $2 ਦੋਵਾਂ ਨਾਲ ਭਾਗਯੋਗ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ")
    .replace(/ਇੱਕ ਛੱਡ ਕੇ ਅੰਕਾਂ ਦੇ ਦੋ ਜੋੜਾਂ/gu, "ਇੱਕ ਛੱਡ ਕੇ ਇੱਕ ਥਾਂ ਵਾਲੇ ਅੰਕਾਂ ਦੇ ਦੋ ਜੋੜਾਂ")
    .replace(/ਇੱਕ ਛੱਡ ਕੇ ਅੰਕਾਂ ਦੇ ਜੋੜ/gu, "ਇੱਕ ਛੱਡ ਕੇ ਇੱਕ ਥਾਂ ਵਾਲੇ ਅੰਕਾਂ ਦੇ ਜੋੜ")
    .replace(/ਸੰਭਵ ਅੰਕਾਂ (\\\([^)]*\\\)) ਨੂੰ ਜਾਂਚਣ ਉੱਤੇ ਸਹੀ ਅੰਕ (\\\([^)]*\\\)) ਮਿਲਦੇ ਹਨ।/gu, "ਸੰਭਵ ਅੰਕਾਂ $1 ਨੂੰ ਜਾਂਚਣ ਉੱਤੇ ਇਹ ਮੁੱਲ ਸਹੀ ਮਿਲਦੇ ਹਨ: $2।")
    .replace(/ਸਾਰੇ ਕ੍ਰਮਬੱਧ ਅੰਕ-ਜੋੜੇ/gu, "ਸਾਰੇ ਕ੍ਰਮਬੱਧ ਜੋੜੇ")
    .replace(/ਡਾਟਾ-ਪਰਯਾਪਤਾ ਵਿੱਚ ਕੋਈ ਕਥਨ ਤਦ ਹੀ ਕਾਫ਼ੀ ਹੈ ਜਦੋਂ ਉਹ/gu, "ਕਿਸੇ ਕਥਨ ਨੂੰ ਤਦ ਹੀ ਕਾਫ਼ੀ ਮੰਨਾਂਗੇ ਜਦੋਂ ਉਹ")
    .replace(/ਸਹੀ ਡਾਟਾ-ਪਰਯਾਪਤਾ ਨਤੀਜਾ ਚੁਣੋ।/gu, "ਚੁਣੋ ਕਿ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਕਾਫ਼ੀ ਹੈ ਜਾਂ ਨਹੀਂ।");
}

function fixDivisionAgreement(value: string, language: NumCp003TranslatedLanguage): string {
  const divisions = value.match(/\\div/gu)?.length ?? 0;
  if (divisions !== 1) return value;
  return language === "hi"
    ? value.replace(/पूर्ण हैं/gu, "पूर्ण है")
    : value.replace(/ਪੂਰੇ ਹਨ/gu, "ਪੂਰਾ ਹੈ");
}

function polishSolutionLine(
  value: string,
  language: NumCp003TranslatedLanguage,
): string {
  const polished = language === "hi" ? polishHindi(value) : polishPunjabi(value);
  return fixDivisionAgreement(polished, language);
}

function polishSpecialSolution(
  q: NumCp003LocalizedQuestion,
  lines: readonly string[],
): readonly string[] {
  const state = q.hiddenState;
  const language = q.language;
  const hi = language === "hi";
  const result = [...lines];

  if (state.kind === "DATA_SUFFICIENCY" && result.length > 0) {
    result[0] = hi
      ? `किसी कथन को तभी पर्याप्त मानेंगे जब वह ${math("X")} का केवल एक संभव मान छोड़े।`
      : `ਕਿਸੇ ਕਥਨ ਨੂੰ ਤਦ ਹੀ ਕਾਫ਼ੀ ਮੰਨਾਂਗੇ ਜਦੋਂ ਉਹ ${math("X")} ਦਾ ਕੇਵਲ ਇੱਕ ਸੰਭਵ ਮੁੱਲ ਛੱਡੇ।`;
  }

  if (state.kind === "ONE_DIVISOR_RANGE" && result.length > 0) {
    result[0] = hi
      ? "दोनों सिरों को शामिल करते हुए गिनती करने के लिए, ऊपरी सीमा तक के गुणजों में से निचली सीमा से पहले के गुणज घटाएँ।"
      : "ਦੋਵੇਂ ਸਿਰੇ ਸ਼ਾਮਲ ਕਰਕੇ ਗਿਣਤੀ ਕਰਨ ਲਈ, ਉੱਪਰੀ ਸੀਮਾ ਤੱਕ ਦੇ ਗੁਣਜਾਂ ਵਿੱਚੋਂ ਹੇਠਲੀ ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਗੁਣਜ ਘਟਾਓ।";
  }

  if (state.kind === "DIGIT_BOUND_MULTIPLE" && result.length > 0) {
    const last = result.length - 1;
    result[last] = state.direction === "GREATEST"
      ? (hi
          ? `${math(formatInteger(state.answer))} ${math(state.divisor)} से विभाज्य सबसे बड़ी ${state.digits}-अंकीय संख्या है।`
          : `${math(formatInteger(state.answer))} ${math(state.divisor)} ਨਾਲ ਭਾਗਯੋਗ ਸਭ ਤੋਂ ਵੱਡੀ ${state.digits}-ਅੰਕੀ ਸੰਖਿਆ ਹੈ।`)
      : (hi
          ? `${math(formatInteger(state.answer))} ${math(state.divisor)} से विभाज्य सबसे छोटी ${state.digits}-अंकीय संख्या है।`
          : `${math(formatInteger(state.answer))} ${math(state.divisor)} ਨਾਲ ਭਾਗਯੋਗ ਸਭ ਤੋਂ ਛੋਟੀ ${state.digits}-ਅੰਕੀ ਸੰਖਿਆ ਹੈ।`);
  }

  return Object.freeze(result.map((line) => polishSolutionLine(line, language)));
}

export function runNumCp003LocalizedFinalForQl(
  questionLanguageId: NumCp003PermanentQlId,
  seed: string,
  language: NumCp003TranslatedLanguage,
): NumCp003LocalizedQuestion {
  const q = runNumCp003LocalizedForQl(questionLanguageId, seed, language);
  const state = q.hiddenState;
  let stem = language === "hi" ? polishHindi(q.stem) : polishPunjabi(q.stem);

  if (state.kind === "DIRECT_DIVISIBILITY") stem = directStem(state, language);
  else if (state.kind === "IMPLICIT_REPEATED_NUMERAL") stem = repeatedStem(state, language);
  else if (state.kind === "DATA_SUFFICIENCY") stem = dataSufficiencyStem(state, stem, language);

  const concept = conceptFor(state, q.permanentQlId, language);
  const solution = polishSpecialSolution(q, q.explanation.solution);

  return Object.freeze({
    ...q,
    stem,
    explanation: Object.freeze({
      ...q.explanation,
      concept,
      solution,
    }),
  });
}
