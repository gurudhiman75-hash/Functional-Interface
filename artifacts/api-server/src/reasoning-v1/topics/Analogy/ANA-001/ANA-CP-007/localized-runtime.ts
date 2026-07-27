import { letterPosition } from "../foundation/alphabet";
import {
  generateWordAnalogy,
  type GeneratedWordAnalogy,
  type WordLayout,
} from "./generator";
import {
  ANA_CP007_VOWELS,
  deriveWordStructure,
  extractWordPositions,
} from "./foundation/word-structure";
import type { AnaCp007RuleId } from "./question-language.en";
import type { WordRuleContext, WordRuleResult } from "./rule-definitions";

export type WordLocale = "hi-IN" | "pa-IN";

export interface GeneratedLocalizedWordAnalogy extends Omit<GeneratedWordAnalogy, "stem" | "explanation"> {
  locale: WordLocale;
  stem: string;
  explanation: GeneratedWordAnalogy["explanation"];
}

function displayResult(result: WordRuleResult): string {
  return String(result);
}

function localizedStem(
  locale: WordLocale,
  presentationMode: GeneratedWordAnalogy["presentationMode"],
  layout: WordLayout,
  sourceInput: string,
  sourceOutput: WordRuleResult,
  targetInput: string,
): string {
  const result = displayResult(sourceOutput);
  if (presentationMode === "DIRECT_COMPLETION") {
    if (layout === "ARROW") return `${sourceInput} → ${result}  ::  ${targetInput} → ?`;
    if (layout === "BOXED_PAIRS") return `[ ${sourceInput} : ${result} ]  ::  [ ${targetInput} : ? ]`;
    if (layout === "TWO_ROW_TABLE") {
      return locale === "hi-IN"
        ? `उसी शब्द-संरचना संबंध का प्रयोग करके दूसरी पंक्ति पूरी कीजिए।\n\n| युग्म | शब्द | परिणाम |\n|---|---|---|\n| A | ${sourceInput} | ${result} |\n| B | ${targetInput} | ? |`
        : `ਉਸੇ ਸ਼ਬਦ-ਬਣਤਰ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਦੂਜੀ ਕਤਾਰ ਪੂਰੀ ਕਰੋ।\n\n| ਜੋੜਾ | ਸ਼ਬਦ | ਨਤੀਜਾ |\n|---|---|---|\n| A | ${sourceInput} | ${result} |\n| B | ${targetInput} | ? |`;
    }
    return `${sourceInput} : ${result} :: ${targetInput} : ?`;
  }

  if (layout === "ARROW") {
    return locale === "hi-IN"
      ? `${sourceInput} → ${result} के समान नियम वाला शब्द-परिणाम युग्म चुनिए।`
      : `${sourceInput} → ${result} ਵਾਲੇ ਇੱਕੋ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਨ ਵਾਲਾ ਸ਼ਬਦ-ਨਤੀਜਾ ਜੋੜਾ ਚੁਣੋ।`;
  }
  if (layout === "BOXED_PAIRS") {
    return locale === "hi-IN"
      ? `[ ${sourceInput} : ${result} ] के समान नियम वाला बॉक्स चुनिए।`
      : `[ ${sourceInput} : ${result} ] ਵਾਲੇ ਇੱਕੋ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਨ ਵਾਲਾ ਡੱਬਾ ਚੁਣੋ।`;
  }
  if (layout === "TWO_ROW_TABLE") {
    return locale === "hi-IN"
      ? `वह पंक्ति चुनिए जो | ${sourceInput} | ${result} | के समान शब्द-संरचना संबंध दिखाती है।`
      : `ਉਹ ਕਤਾਰ ਚੁਣੋ ਜੋ | ${sourceInput} | ${result} | ਵਾਲਾ ਇੱਕੋ ਸ਼ਬਦ-ਬਣਤਰ ਸੰਬੰਧ ਦਿਖਾਉਂਦੀ ਹੈ।`;
  }
  return locale === "hi-IN"
    ? `${sourceInput} : ${result} के समान संबंध वाला शब्द-परिणाम युग्म चुनिए।`
    : `${sourceInput} : ${result} ਵਾਲਾ ਇੱਕੋ ਸੰਬੰਧ ਰੱਖਣ ਵਾਲਾ ਸ਼ਬਦ-ਨਤੀਜਾ ਜੋੜਾ ਚੁਣੋ।`;
}

function hindiRuleStatement(ruleId: AnaCp007RuleId): string {
  const texts: Record<AnaCp007RuleId, string> = {
    WORD_REMOVE_VOWELS: "सभी स्वरों को हटाकर व्यंजनों को उनके मूल क्रम में रखा जाता है।",
    WORD_REMOVE_CONSONANTS: "सभी व्यंजनों को हटाकर स्वरों को उनके मूल क्रम में रखा जाता है।",
    WORD_POSITION_EXTRACTION: "एक ही आरंभिक स्थान से हर दूसरा अक्षर लिया जाता है।",
    WORD_ALPHABET_POSITION_SUM: "सभी अक्षरों के सामान्य वर्णमाला-स्थान जोड़ दिए जाते हैं।",
    WORD_LENGTH_MINUS_ONE: "शब्द के अक्षरों की संख्या गिनकर उसमें से एक घटाया जाता है।",
    WORD_EQUALITY_PATTERN: "हर नए अक्षर को अगली संख्या दी जाती है और दोहराए अक्षर के लिए वही संख्या फिर लिखी जाती है।",
    WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT: "स्वरों को एक निश्चित दिशा और व्यंजनों को दूसरी निश्चित दिशा में चलाया जाता है।",
  };
  return `संबंध का नियम: ${texts[ruleId]}`;
}

function punjabiRuleStatement(ruleId: AnaCp007RuleId): string {
  const texts: Record<AnaCp007RuleId, string> = {
    WORD_REMOVE_VOWELS: "ਸਾਰੇ ਸਵਰ ਹਟਾ ਕੇ ਵਿਅੰਜਨਾਂ ਨੂੰ ਉਹਨਾਂ ਦੇ ਮੂਲ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
    WORD_REMOVE_CONSONANTS: "ਸਾਰੇ ਵਿਅੰਜਨ ਹਟਾ ਕੇ ਸਵਰਾਂ ਨੂੰ ਉਹਨਾਂ ਦੇ ਮੂਲ ਕ੍ਰਮ ਵਿੱਚ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ।",
    WORD_POSITION_EXTRACTION: "ਇੱਕੋ ਸ਼ੁਰੂਆਤੀ ਥਾਂ ਤੋਂ ਹਰ ਦੂਜਾ ਅੱਖਰ ਲਿਆ ਜਾਂਦਾ ਹੈ।",
    WORD_ALPHABET_POSITION_SUM: "ਸਾਰੇ ਅੱਖਰਾਂ ਦੇ ਆਮ ਵਰਣਮਾਲਾ-ਸਥਾਨ ਜੋੜੇ ਜਾਂਦੇ ਹਨ।",
    WORD_LENGTH_MINUS_ONE: "ਸ਼ਬਦ ਦੇ ਅੱਖਰ ਗਿਣ ਕੇ ਗਿਣਤੀ ਵਿੱਚੋਂ ਇੱਕ ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ।",
    WORD_EQUALITY_PATTERN: "ਹਰ ਨਵੇਂ ਅੱਖਰ ਨੂੰ ਅਗਲਾ ਨੰਬਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਦੁਹਰਾਏ ਅੱਖਰ ਲਈ ਉਹੀ ਨੰਬਰ ਮੁੜ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।",
    WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT: "ਸਵਰਾਂ ਨੂੰ ਇੱਕ ਨਿਰਧਾਰਤ ਚਾਲ ਅਤੇ ਵਿਅੰਜਨਾਂ ਨੂੰ ਵੱਖਰੀ ਨਿਰਧਾਰਤ ਚਾਲ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।",
  };
  return `ਸੰਬੰਧ ਦਾ ਨਿਯਮ: ${texts[ruleId]}`;
}

function hindiMovement(amount: number): string {
  return `${Math.abs(amount)} स्थान ${amount > 0 ? "आगे" : "पीछे"}`;
}

function punjabiMovement(amount: number): string {
  return `${Math.abs(amount)} ਥਾਂ ${amount > 0 ? "ਅੱਗੇ" : "ਪਿੱਛੇ"}`;
}

function hindiExplanation(
  ruleId: AnaCp007RuleId,
  context: WordRuleContext,
  input: string,
  output: WordRuleResult,
): string {
  const structure = deriveWordStructure(input);
  switch (ruleId) {
    case "WORD_REMOVE_VOWELS":
      return `${input} से शुरू करें। इसमें स्वर ${structure.vowels.join(", ")} हैं; इन्हें हटाइए। शेष व्यंजन ${structure.consonants.join(", ")} हैं और उन्हें उसी क्रम में जोड़ने पर ${output} मिलता है।`;
    case "WORD_REMOVE_CONSONANTS":
      return `${input} से शुरू करें। इसमें व्यंजन ${structure.consonants.join(", ")} हैं; इन्हें हटाइए। बचे हुए स्वर ${structure.vowels.join(", ")} हैं और उनका मूल क्रम रखने पर ${output} मिलता है।`;
    case "WORD_POSITION_EXTRACTION": {
      if (context.kind !== "POSITION_EXTRACTION") return `${input} से ${output} प्राप्त होता है।`;
      const positions = context.parity === "ODD"
        ? Array.from({ length: Math.ceil(input.length / 2) }, (_, index) => index * 2 + 1)
        : Array.from({ length: Math.floor(input.length / 2) }, (_, index) => index * 2 + 2);
      const selected = extractWordPositions(input, context.parity);
      return `${input} में ${context.parity === "ODD" ? "1वें, 3वें, 5वें और आगे के विषम" : "2वें, 4वें, 6वें और आगे के सम"} स्थानों के अक्षर लें। स्थान ${positions.join(", ")} से ${[...selected].join(", ")} मिलते हैं; इन्हें जोड़ने पर ${output} बनता है।`;
    }
    case "WORD_ALPHABET_POSITION_SUM": {
      const values = [...input].map((letter) => `${letter}=${letterPosition(letter)}`).join(", ");
      return `${input} के प्रत्येक अक्षर का सामान्य स्थान लिखें: ${values}। अब ${structure.alphabetPositions.join(" + ")} = ${output}; इसलिए पूर्ण योग ${output} है।`;
    }
    case "WORD_LENGTH_MINUS_ONE":
      return `${input} में कुल ${input.length} अक्षर हैं। नियम के अनुसार एक घटाएँ: ${input.length} − 1 = ${output}; इसलिए परिणाम ${output} है।`;
    case "WORD_EQUALITY_PATTERN": {
      const seen = new Map<string, number>();
      let next = 1;
      const trace = [...input].map((letter) => {
        let number = seen.get(letter);
        if (number === undefined) {
          number = next;
          seen.set(letter, number);
          next += 1;
          return `${letter} को पहली बार ${number}`;
        }
        return `${letter} दोहरने पर फिर ${number}`;
      });
      return `${input} में हर नए अक्षर को अगली संख्या दें और दोहराए अक्षर के लिए पुरानी संख्या रखें: ${trace.join("; ")}। इससे पूरा प्रतिरूप ${output} बनता है।`;
    }
    case "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT": {
      if (context.kind !== "CLASS_SHIFT") return `${input} से ${output} प्राप्त होता है।`;
      const result = String(output);
      const trace = [...input].map((letter, index) => {
        const vowel = ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U");
        const amount = vowel ? context.vowelShift : context.consonantShift;
        return `${letter} ${vowel ? "स्वर" : "व्यंजन"} है और ${hindiMovement(amount)} चलकर ${result[index]} बनता है`;
      });
      return `${input} में प्रत्येक स्वर को ${hindiMovement(context.vowelShift)} और प्रत्येक व्यंजन को ${hindiMovement(context.consonantShift)} चलाएँ। ${trace.join("; ")}। बदले अक्षरों को क्रम से जोड़ने पर ${output} मिलता है।`;
    }
  }
}

function punjabiExplanation(
  ruleId: AnaCp007RuleId,
  context: WordRuleContext,
  input: string,
  output: WordRuleResult,
): string {
  const structure = deriveWordStructure(input);
  switch (ruleId) {
    case "WORD_REMOVE_VOWELS":
      return `${input} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ। ਇਸ ਦੇ ਸਵਰ ${structure.vowels.join(", ")} ਹਨ; ਇਹਨਾਂ ਨੂੰ ਹਟਾਓ। ਬਾਕੀ ਵਿਅੰਜਨ ${structure.consonants.join(", ")} ਹਨ ਅਤੇ ਉਹਨਾਂ ਨੂੰ ਉਸੇ ਕ੍ਰਮ ਵਿੱਚ ਜੋੜਨ ਨਾਲ ${output} ਮਿਲਦਾ ਹੈ।`;
    case "WORD_REMOVE_CONSONANTS":
      return `${input} ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ। ਇਸ ਦੇ ਵਿਅੰਜਨ ${structure.consonants.join(", ")} ਹਨ; ਇਹਨਾਂ ਨੂੰ ਹਟਾਓ। ਬਚੇ ਸਵਰ ${structure.vowels.join(", ")} ਹਨ ਅਤੇ ਮੂਲ ਕ੍ਰਮ ਰੱਖਣ ਨਾਲ ${output} ਮਿਲਦਾ ਹੈ।`;
    case "WORD_POSITION_EXTRACTION": {
      if (context.kind !== "POSITION_EXTRACTION") return `${input} ਤੋਂ ${output} ਮਿਲਦਾ ਹੈ।`;
      const positions = context.parity === "ODD"
        ? Array.from({ length: Math.ceil(input.length / 2) }, (_, index) => index * 2 + 1)
        : Array.from({ length: Math.floor(input.length / 2) }, (_, index) => index * 2 + 2);
      const selected = extractWordPositions(input, context.parity);
      return `${input} ਵਿੱਚੋਂ ${context.parity === "ODD" ? "1ਵੀਂ, 3ਵੀਂ, 5ਵੀਂ ਅਤੇ ਅੱਗੇ ਦੀਆਂ ਵਿਸ਼ਮ" : "2ਵੀਂ, 4ਵੀਂ, 6ਵੀਂ ਅਤੇ ਅੱਗੇ ਦੀਆਂ ਸਮ"} ਥਾਵਾਂ ਦੇ ਅੱਖਰ ਲਵੋ। ਥਾਵਾਂ ${positions.join(", ")} ਤੋਂ ${[...selected].join(", ")} ਮਿਲਦੇ ਹਨ; ਜੋੜਨ ਨਾਲ ${output} ਬਣਦਾ ਹੈ।`;
    }
    case "WORD_ALPHABET_POSITION_SUM": {
      const values = [...input].map((letter) => `${letter}=${letterPosition(letter)}`).join(", ");
      return `${input} ਦੇ ਹਰ ਅੱਖਰ ਦਾ ਆਮ ਵਰਣਮਾਲਾ-ਸਥਾਨ ਲਿਖੋ: ${values}। ਹੁਣ ${structure.alphabetPositions.join(" + ")} = ${output}; ਇਸ ਲਈ ਪੂਰਾ ਜੋੜ ${output} ਹੈ।`;
    }
    case "WORD_LENGTH_MINUS_ONE":
      return `${input} ਵਿੱਚ ਕੁੱਲ ${input.length} ਅੱਖਰ ਹਨ। ਨਿਯਮ ਅਨੁਸਾਰ ਇੱਕ ਘਟਾਓ: ${input.length} − 1 = ${output}; ਇਸ ਲਈ ਨਤੀਜਾ ${output} ਹੈ।`;
    case "WORD_EQUALITY_PATTERN": {
      const seen = new Map<string, number>();
      let next = 1;
      const trace = [...input].map((letter) => {
        let number = seen.get(letter);
        if (number === undefined) {
          number = next;
          seen.set(letter, number);
          next += 1;
          return `${letter} ਨੂੰ ਪਹਿਲੀ ਵਾਰ ${number}`;
        }
        return `${letter} ਦੁਹਰਾਉਣ ਤੇ ਫਿਰ ${number}`;
      });
      return `${input} ਵਿੱਚ ਹਰ ਨਵੇਂ ਅੱਖਰ ਨੂੰ ਅਗਲਾ ਨੰਬਰ ਦਿਓ ਅਤੇ ਦੁਹਰਾਏ ਅੱਖਰ ਲਈ ਪਹਿਲਾਂ ਵਾਲਾ ਨੰਬਰ ਰੱਖੋ: ${trace.join("; ")}। ਇਸ ਨਾਲ ਪੂਰਾ ਨਮੂਨਾ ${output} ਬਣਦਾ ਹੈ।`;
    }
    case "WORD_VOWEL_CONSONANT_DIFFERENTIAL_SHIFT": {
      if (context.kind !== "CLASS_SHIFT") return `${input} ਤੋਂ ${output} ਮਿਲਦਾ ਹੈ।`;
      const result = String(output);
      const trace = [...input].map((letter, index) => {
        const vowel = ANA_CP007_VOWELS.has(letter as "A" | "E" | "I" | "O" | "U");
        const amount = vowel ? context.vowelShift : context.consonantShift;
        return `${letter} ${vowel ? "ਸਵਰ" : "ਵਿਅੰਜਨ"} ਹੈ ਅਤੇ ${punjabiMovement(amount)} ਚੱਲ ਕੇ ${result[index]} ਬਣਦਾ ਹੈ`;
      });
      return `${input} ਵਿੱਚ ਹਰ ਸਵਰ ਨੂੰ ${punjabiMovement(context.vowelShift)} ਅਤੇ ਹਰ ਵਿਅੰਜਨ ਨੂੰ ${punjabiMovement(context.consonantShift)} ਚਲਾਓ। ${trace.join("; ")}। ਬਦਲੇ ਅੱਖਰ ਕ੍ਰਮ ਨਾਲ ਜੋੜਨ ਤੇ ${output} ਮਿਲਦਾ ਹੈ।`;
    }
  }
}

function localizedTrap(locale: WordLocale, errorLabel: string | null): string {
  const key = errorLabel ?? "GENERIC";
  const hi: Record<string, string> = {
    WRONG_RULE_CONTEXT: "सबसे निकट गलत विकल्प सही सामान्य विचार लेता है, पर आरंभिक स्थान या अक्षर-वर्ग की चाल बदल देता है।",
    WRONG_LETTER_CLASS: "सबसे निकट गलत विकल्प स्वर और व्यंजन में भ्रम करके गलत अक्षर-वर्ग को हटाता या रखता है।",
    WRONG_STARTING_POSITION: "सबसे निकट गलत विकल्प हर दूसरे अक्षर का चयन दूसरे आरंभिक स्थान से शुरू करता है।",
    WRONG_NUMERIC_RULE: "सबसे निकट गलत विकल्प पूर्ण दिखाए गए नियम के बजाय पास की गिनती या दूसरी संख्या-विधि अपनाता है।",
    WRONG_EQUALITY_PATTERN: "सबसे निकट गलत विकल्प दोहराए अक्षर के लिए वही संख्या फिर से प्रयोग नहीं करता।",
    WRONG_CLASS_SHIFT: "सबसे निकट गलत विकल्प स्वर और व्यंजन की चाल आपस में बदल देता है या सभी अक्षरों पर एक चाल लगाता है।",
    GENERIC: "सबसे निकट गलत विकल्प पूरे स्रोत संबंध को प्रत्येक अक्षर या मान पर सही ढंग से लागू नहीं करता।",
  };
  const pa: Record<string, string> = {
    WRONG_RULE_CONTEXT: "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਆਮ ਵਿਚਾਰ ਤਾਂ ਲੈਂਦਾ ਹੈ, ਪਰ ਸ਼ੁਰੂਆਤੀ ਥਾਂ ਜਾਂ ਅੱਖਰ-ਵਰਗ ਦੀ ਚਾਲ ਬਦਲ ਦਿੰਦਾ ਹੈ।",
    WRONG_LETTER_CLASS: "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਸਵਰ ਅਤੇ ਵਿਅੰਜਨ ਵਿੱਚ ਗਲਤੀ ਕਰਕੇ ਗਲਤ ਅੱਖਰ-ਵਰਗ ਹਟਾਉਂਦਾ ਜਾਂ ਰੱਖਦਾ ਹੈ।",
    WRONG_STARTING_POSITION: "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਹਰ ਦੂਜਾ ਅੱਖਰ ਦੂਜੀ ਸ਼ੁਰੂਆਤੀ ਥਾਂ ਤੋਂ ਲੈਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ।",
    WRONG_NUMERIC_RULE: "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਪੂਰੇ ਦਿਖਾਏ ਨਿਯਮ ਦੀ ਥਾਂ ਨੇੜਲੀ ਗਿਣਤੀ ਜਾਂ ਵੱਖਰਾ ਅੰਕੀ ਨਿਯਮ ਵਰਤਦਾ ਹੈ।",
    WRONG_EQUALITY_PATTERN: "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਦੁਹਰਾਏ ਅੱਖਰ ਲਈ ਉਹੀ ਨੰਬਰ ਮੁੜ ਨਹੀਂ ਵਰਤਦਾ।",
    WRONG_CLASS_SHIFT: "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਸਵਰ ਅਤੇ ਵਿਅੰਜਨ ਦੀਆਂ ਚਾਲਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ ਜਾਂ ਸਾਰੇ ਅੱਖਰਾਂ ਤੇ ਇੱਕੋ ਚਾਲ ਲਗਾਉਂਦਾ ਹੈ।",
    GENERIC: "ਸਭ ਤੋਂ ਨੇੜਲਾ ਗਲਤ ਵਿਕਲਪ ਸਰੋਤ ਦੇ ਪੂਰੇ ਸੰਬੰਧ ਨੂੰ ਹਰ ਅੱਖਰ ਜਾਂ ਮੁੱਲ ਤੇ ਠੀਕ ਤਰ੍ਹਾਂ ਲਾਗੂ ਨਹੀਂ ਕਰਦਾ।",
  };
  return locale === "hi-IN" ? (hi[key] ?? hi.GENERIC) : (pa[key] ?? pa.GENERIC);
}

export function generateLocalizedWordAnalogy(
  qlId: string,
  locale: WordLocale,
  seed = 0,
): GeneratedLocalizedWordAnalogy {
  const english = generateWordAnalogy(qlId, seed);
  const errorLabel = english.options.find((option, index) =>
    index !== english.correctIndex && option.errorLabel !== null,
  )?.errorLabel ?? null;
  const explain = locale === "hi-IN" ? hindiExplanation : punjabiExplanation;

  return {
    ...english,
    locale,
    stem: localizedStem(
      locale,
      english.presentationMode,
      english.layout,
      english.source.input,
      english.source.output,
      english.target.input,
    ),
    explanation: {
      ruleStatement: locale === "hi-IN"
        ? hindiRuleStatement(english.ruleId)
        : punjabiRuleStatement(english.ruleId),
      sourceDemonstration: explain(
        english.ruleId,
        english.context,
        english.source.input,
        english.source.output,
      ),
      targetApplication: explain(
        english.ruleId,
        english.context,
        english.target.input,
        english.target.output,
      ),
      conclusion: english.presentationMode === "DIRECT_COMPLETION"
        ? locale === "hi-IN"
          ? `अतः ${displayResult(english.target.output)} से उपमा पूरी होती है।`
          : `ਇਸ ਲਈ ${displayResult(english.target.output)} ਨਾਲ ਸਮਾਨਤਾ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।`
        : locale === "hi-IN"
          ? `अतः ${english.target.input} : ${displayResult(english.target.output)} उसी नियम का पालन करता है।`
          : `ਇਸ ਲਈ ${english.target.input} : ${displayResult(english.target.output)} ਉਸੇ ਨਿਯਮ ਦੀ ਪਾਲਣਾ ਕਰਦਾ ਹੈ।`,
      closestTrapRejection: localizedTrap(locale, errorLabel),
    },
  };
}
