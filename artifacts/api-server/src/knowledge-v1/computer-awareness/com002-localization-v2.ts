import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM002_EDITORIALLY_APPROVED_FACTS } from "./com002-editorial-review";
import {
  localizeCom002QuestionEditorialV1,
} from "./com002-localization-editorial-v1";
import type { Com002LocalizedQuestionV1 } from "./com002-localization-v1";
import {
  localizeCom002LexemeV1,
  type Com002TargetLanguageV1,
} from "./com002-localization-lexicon-v1";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V3,
  generateCom002ReviewQuestionV3,
} from "./com002-review-synthesis-v3";
import type { Com002ReviewQuestion } from "./com002-review-types";

export const COM002_LOCALIZATION_VERSION_V2 =
  "COM-002-LOCALIZATION-V2-CANDIDATE-1" as const;
export const COM002_LOCALIZATION_DRAFT_AUTHORITY_V2 =
  "COM002_HI_PA_LOCALIZATION_V2_REVIEW_CANDIDATE" as const;

export type Com002LocalizedQuestionV2 = Omit<
  Com002LocalizedQuestionV1,
  "questionId" | "localizationV1" | "lifecycleV1"
> & {
  questionId: string;
  localizationV2: {
    version: typeof COM002_LOCALIZATION_VERSION_V2;
    authority: typeof COM002_LOCALIZATION_DRAFT_AUTHORITY_V2;
    englishGeneratorVersion: typeof COM002_ENGLISH_GENERATOR_VERSION_V3;
    englishAuthorityStatus: "V3_CANDIDATE_AWAITING_EXECUTION_AND_EXPLICIT_APPROVAL";
    englishQuestionId: string;
    semanticStateInvariant: true;
    qlInvariant: true;
    cpInvariant: true;
    surfaceModeInvariant: true;
    targetFactInvariant: true;
    sourceFactsInvariant: true;
    sourceAuthorityInvariant: true;
    solverAuthorityInvariant: true;
    optionOrderInvariant: true;
    correctIndexInvariant: true;
  };
  lifecycleV2: {
    englishV3Approved: false;
    localizationReviewOnly: true;
    localizationFrozen: false;
    questionStudioActive: false;
    reviewRunPersistenceAllowed: false;
    canonicalQuestionPersistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    productionReleaseAuthorized: false;
  };
};

function factById(factId: string) {
  const fact = COM002_EDITORIALLY_APPROVED_FACTS.find((candidate) => candidate.factId === factId);
  if (!fact) throw new Error(`Unknown COM-002 approved fact ${factId}`);
  return fact;
}

function textValue(fact: KnowledgeFact) {
  if (fact.value.kind !== "text") {
    throw new Error(`${fact.factId}: COM-002 localization V2 requires text value`);
  }
  return fact.value.text.en;
}

function localizeExact(text: string, language: Com002TargetLanguageV1) {
  return localizeCom002LexemeV1(text, language);
}

function localizedComboLabel(english: string, language: Com002TargetLanguageV1) {
  if (english === "None of the statements") {
    return language === "hi" ? "कोई भी कथन नहीं" : "ਕੋਈ ਵੀ ਕਥਨ ਨਹੀਂ";
  }
  const ids = english.match(/\b(?:I|II|III|IV)\b/g) ?? [];
  if (ids.length === 0) throw new Error(`Unsupported COM-002 combination label: ${english}`);
  if (ids.length === 1) return language === "hi" ? `केवल ${ids[0]}` : `ਕੇਵਲ ${ids[0]}`;
  if (ids.length === 2) {
    return language === "hi"
      ? `केवल ${ids[0]} और ${ids[1]}`
      : `ਕੇਵਲ ${ids[0]} ਅਤੇ ${ids[1]}`;
  }
  if (ids.length === 3) {
    return language === "hi"
      ? `केवल ${ids[0]}, ${ids[1]} और ${ids[2]}`
      : `ਕੇਵਲ ${ids[0]}, ${ids[1]} ਅਤੇ ${ids[2]}`;
  }
  return language === "hi"
    ? `${ids.slice(0, -1).join(", ")} और ${ids.at(-1)}`
    : `${ids.slice(0, -1).join(", ")} ਅਤੇ ${ids.at(-1)}`;
}

function stripV1RuntimeMetadata(question: Com002LocalizedQuestionV1) {
  const {
    localizationV1: _localizationV1,
    lifecycleV1: _lifecycleV1,
    ...rest
  } = question;
  return rest;
}

function finalizeV2(
  english: Com002ReviewQuestion,
  base: Omit<Com002LocalizedQuestionV1, "localizationV1" | "lifecycleV1">,
): Com002LocalizedQuestionV2 {
  assertKnowledgeQuestionValid({
    stem: base.stem,
    explanation: base.explanation,
    options: base.options,
    correctIndex: english.correctIndex,
    canonicalAnswer: base.canonicalAnswer,
  });

  return {
    ...base,
    questionId: `${english.questionId}-${base.language.toUpperCase()}`,
    qlId: english.qlId,
    cpId: english.cpId,
    surfaceMode: english.surfaceMode,
    targetFactId: english.targetFactId,
    correctIndex: english.correctIndex,
    sourceIds: [...english.sourceIds],
    sourceFactIds: [...english.sourceFactIds],
    solverAuthority: english.solverAuthority,
    reviewOnly: true,
    runtimeRegistered: false,
    localizationV2: {
      version: COM002_LOCALIZATION_VERSION_V2,
      authority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V2,
      englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
      englishAuthorityStatus: "V3_CANDIDATE_AWAITING_EXECUTION_AND_EXPLICIT_APPROVAL",
      englishQuestionId: english.questionId,
      semanticStateInvariant: true,
      qlInvariant: true,
      cpInvariant: true,
      surfaceModeInvariant: true,
      targetFactInvariant: true,
      sourceFactsInvariant: true,
      sourceAuthorityInvariant: true,
      solverAuthorityInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
    },
    lifecycleV2: {
      englishV3Approved: false,
      localizationReviewOnly: true,
      localizationFrozen: false,
      questionStudioActive: false,
      reviewRunPersistenceAllowed: false,
      canonicalQuestionPersistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
  };
}

function localizeQl004V2(input: {
  seed: string;
  language: Com002TargetLanguageV1;
  english: Com002ReviewQuestion;
}): Com002LocalizedQuestionV2 {
  const historical = localizeCom002QuestionEditorialV1({
    qlId: "COM-002-QL-004",
    seed: input.seed,
    language: input.language,
  });
  const stripped = stripV1RuntimeMetadata(historical);
  const hi = input.language === "hi";
  const target = input.english.targetFactId ? factById(input.english.targetFactId) : null;
  if (!target) throw new Error(`${input.english.questionId}: V3 QL-004 target fact is missing`);
  const entity = localizeExact(target.entity.label.en, input.language);
  const value = localizeExact(textValue(target), input.language);

  let stem = stripped.stem;
  let explanation = stripped.explanation;
  if (input.english.surfaceMode === "CORE_COMPONENT") {
    stem = hi
      ? "ऑपरेटिंग सिस्टम का मुख्य घटक कौन-सा है?"
      : "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਮੁੱਖ ਘਟਕ ਕਿਹੜਾ ਹੈ?";
    explanation = hi
      ? "कर्नेल ऑपरेटिंग सिस्टम का मुख्य घटक है।"
      : "ਕਰਨਲ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਮੁੱਖ ਘਟਕ ਹੈ।";
  } else if (input.english.surfaceMode === "COMPONENT_TO_ROLE") {
    stem = hi
      ? "कौन-सा विकल्प ऑपरेटिंग सिस्टम में कर्नेल की प्रमुख भूमिका को सबसे सही बताता है?"
      : "ਕਿਹੜਾ ਵਿਕਲਪ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਵਿੱਚ ਕਰਨਲ ਦੀ ਮੁੱਖ ਭੂਮਿਕਾ ਨੂੰ ਸਭ ਤੋਂ ਠੀਕ ਦੱਸਦਾ ਹੈ?";
    explanation = hi ? `${entity} ${value}।` : `${entity} ${value}।`;
  } else if (target.factId === "com002-kernel-core") {
    explanation = hi
      ? "कर्नेल ऑपरेटिंग सिस्टम का मुख्य घटक है।"
      : "ਕਰਨਲ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਮੁੱਖ ਘਟਕ ਹੈ।";
  } else {
    explanation = hi ? `${entity} ${value}।` : `${entity} ${value}।`;
  }

  return finalizeV2(input.english, {
    ...stripped,
    stem,
    explanation,
  });
}

type ParsedSafeStatement = {
  id: string;
  target: KnowledgeFact;
  claimedValue: string;
};

function parseSafeQ13Statements(english: Com002ReviewQuestion): ParsedSafeStatement[] {
  const candidateFacts = english.sourceFactIds.map(factById);
  const lines = english.stem.split("\n").filter((line) => /^(I|II|III|IV)\./.test(line));
  if (lines.length !== 4) {
    throw new Error(`${english.questionId}: expected four V3 QL-013 statements`);
  }

  return lines.map((line) => {
    const match = line.match(/^(I|II|III|IV)\.\s+(.+)$/);
    if (!match) throw new Error(`${english.questionId}: malformed V3 QL-013 statement ${line}`);
    const id = match[1]!;
    const sentence = match[2]!;
    const target = candidateFacts
      .filter((fact) => sentence.startsWith(fact.entity.label.en))
      .sort((left, right) => right.entity.label.en.length - left.entity.label.en.length)[0];
    if (!target) throw new Error(`${english.questionId}: cannot resolve V3 QL-013 target for ${sentence}`);
    const entity = target.entity.label.en;
    let claimedValue: string;
    switch (target.relation) {
      case "license_class":
        claimedValue = sentence.slice(`${entity} is classified as `.length).replace(/\.$/, "");
        break;
      case "file_operation_effect":
        claimedValue = sentence.slice(entity.length).trim().replace(/\.$/, "");
        break;
      case "extension_file_type":
        claimedValue = sentence.slice(`${entity} is associated with `.length).replace(/\.$/, "");
        break;
      case "shortcut_action":
        claimedValue = sentence.slice(`${entity} is used to `.length).replace(/\.$/, "");
        break;
      default:
        throw new Error(`${english.questionId}: unsafe V3 QL-013 relation ${target.relation}`);
    }
    return { id, target, claimedValue };
  });
}

function safeStatementText(
  statement: ParsedSafeStatement,
  language: Com002TargetLanguageV1,
  actual = false,
) {
  const hi = language === "hi";
  const entity = localizeExact(statement.target.entity.label.en, language);
  const rawValue = actual ? textValue(statement.target) : statement.claimedValue;
  const value = localizeExact(rawValue, language);
  switch (statement.target.relation) {
    case "license_class":
      return hi
        ? `${entity} को ${value} के रूप में वर्गीकृत किया गया है।`
        : `${entity} ਨੂੰ ${value} ਵਜੋਂ ਵਰਗੀਕ੍ਰਿਤ ਕੀਤਾ ਗਿਆ ਹੈ।`;
    case "file_operation_effect":
      return hi ? `${entity} क्रिया ${value}।` : `${entity} ਕਾਰਵਾਈ ${value}।`;
    case "extension_file_type":
      return hi ? `${entity} का संबंध ${value} से है।` : `${entity} ਦਾ ਸੰਬੰਧ ${value} ਨਾਲ ਹੈ।`;
    case "shortcut_action":
      return hi
        ? `${entity} का उपयोग ${value} के लिए किया जाता है।`
        : `${entity} ਦੀ ਵਰਤੋਂ ${value} ਲਈ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।`;
    default:
      throw new Error(`Unsupported V3 QL-013 relation ${statement.target.relation}`);
  }
}

function trueStatementIds(canonicalAnswer: string) {
  if (canonicalAnswer === "None of the statements") return new Set<string>();
  return new Set(canonicalAnswer.match(/\b(?:I|II|III|IV)\b/g) ?? []);
}

function localizeQl013V2(input: {
  seed: string;
  language: Com002TargetLanguageV1;
  english: Com002ReviewQuestion;
}): Com002LocalizedQuestionV2 {
  const hi = input.language === "hi";
  const statements = parseSafeQ13Statements(input.english);
  const options = input.english.options.map((option) => localizedComboLabel(option, input.language));
  const canonicalAnswer = localizedComboLabel(input.english.canonicalAnswer, input.language);
  const stem = [
    hi ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠਾਂ ਦਿੱਤੇ ਕਥਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:",
    ...statements.map((statement) => `${statement.id}. ${safeStatementText(statement, input.language)}`),
    hi ? "उपरोक्त में से कौन-से कथन सही हैं?" : "ਉਪਰੋਕਤ ਵਿੱਚੋਂ ਕਿਹੜੇ ਕਥਨ ਸਹੀ ਹਨ?",
  ].join("\n");
  const trueIds = trueStatementIds(input.english.canonicalAnswer);
  const explanationBody = statements.map((statement) => {
    const correct = trueIds.has(statement.id);
    if (correct) {
      return hi
        ? `${statement.id} सही है। ${safeStatementText(statement, input.language, true)}`
        : `${statement.id} ਸਹੀ ਹੈ। ${safeStatementText(statement, input.language, true)}`;
    }
    return hi
      ? `${statement.id} गलत है। सही तथ्य: ${safeStatementText(statement, input.language, true)}`
      : `${statement.id} ਗਲਤ ਹੈ। ਸਹੀ ਤੱਥ: ${safeStatementText(statement, input.language, true)}`;
  }).join(" ");
  const explanation = hi
    ? `${explanationBody} इसलिए ${canonicalAnswer} सही उत्तर है।`
    : `${explanationBody} ਇਸ ਲਈ ${canonicalAnswer} ਸਹੀ ਉੱਤਰ ਹੈ।`;

  const base = {
    ...input.english,
    questionId: `${input.english.questionId}-${input.language.toUpperCase()}`,
    language: input.language,
    locale: hi ? "hi-IN" as const : "pa-IN" as const,
    stem,
    options,
    canonicalAnswer,
    explanation,
  };
  return finalizeV2(input.english, base);
}

export function localizeCom002QuestionV2(input: {
  qlId: string;
  seed: string;
  language: Com002TargetLanguageV1;
}): Com002LocalizedQuestionV2 {
  const english = generateCom002ReviewQuestionV3({ qlId: input.qlId, seed: input.seed });

  if (input.qlId === "COM-002-QL-004") {
    return localizeQl004V2({ ...input, english });
  }
  if (input.qlId === "COM-002-QL-013") {
    return localizeQl013V2({ ...input, english });
  }

  const historical = localizeCom002QuestionEditorialV1(input);
  const stripped = stripV1RuntimeMetadata(historical);
  return finalizeV2(english, stripped);
}
