import { COM002_EDITORIALLY_APPROVED_FACTS } from "./com002-editorial-review";
import {
  localizeCom002QuestionV1,
  type Com002LocalizedQuestionV1,
} from "./com002-localization-v1";
import {
  localizeCom002LexemeV1,
  type Com002TargetLanguageV1,
} from "./com002-localization-lexicon-v1";

function targetFact(question: Com002LocalizedQuestionV1) {
  if (!question.targetFactId) return null;
  return COM002_EDITORIALLY_APPROVED_FACTS.find((fact) => fact.factId === question.targetFactId) ?? null;
}

function factValue(fact: NonNullable<ReturnType<typeof targetFact>>, language: Com002TargetLanguageV1) {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId}: expected text value`);
  return localizeCom002LexemeV1(fact.value.text.en, language);
}

export function localizeCom002QuestionEditorialV1(input: {
  qlId: string;
  seed: string;
  language: Com002TargetLanguageV1;
}): Com002LocalizedQuestionV1 {
  const question = localizeCom002QuestionV1(input);
  const fact = targetFact(question);
  if (!fact) return question;

  const hi = input.language === "hi";
  const entity = localizeCom002LexemeV1(fact.entity.label.en, input.language);
  const value = factValue(fact, input.language);

  if (
    question.qlId === "COM-002-QL-001" &&
    question.surfaceMode === "FUNCTION_TO_ENTITY" &&
    fact.relation === "manages_resource"
  ) {
    return {
      ...question,
      stem: hi
        ? `निम्न में से कौन-सा सिस्टम सॉफ़्टवेयर ${value} का प्रबंधन करता है?`
        : `ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ ${value} ਦਾ ਪ੍ਰਬੰਧ ਕਰਦਾ ਹੈ?`,
      explanation: hi
        ? `${entity} ${value} का प्रबंधन करता है। इसलिए ${entity} सही उत्तर है।`
        : `${entity} ${value} ਦਾ ਪ੍ਰਬੰਧ ਕਰਦਾ ਹੈ। ਇਸ ਲਈ ${entity} ਸਹੀ ਉੱਤਰ ਹੈ।`,
    };
  }

  if (question.qlId === "COM-002-QL-004" && fact.factId === "com002-kernel-core") {
    return {
      ...question,
      explanation: hi
        ? "कर्नेल ऑपरेटिंग सिस्टम का मुख्य घटक है।"
        : "ਕਰਨਲ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਮੁੱਖ ਘਟਕ ਹੈ।",
    };
  }

  if (question.qlId === "COM-002-QL-007" && fact.relation === "settings_task") {
    return {
      ...question,
      explanation: hi
        ? `${entity} का उपयोग ${value} के लिए किया जाता है।`
        : `${entity} ਦੀ ਵਰਤੋਂ ${value} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`,
    };
  }

  return question;
}
