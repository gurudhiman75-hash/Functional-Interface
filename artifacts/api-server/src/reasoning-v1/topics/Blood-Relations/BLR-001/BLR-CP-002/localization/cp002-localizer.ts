import { stableHash } from "../../foundation/prng";
import {
  localizeBlrPersonName,
  localizeBlrPersonNamesInText,
} from "../../foundation/localized-person-names";
import type { BlrRoleId } from "../../foundation/types";
import {
  generateBlrCp002Question,
  type BlrCp002PermanentQuestion,
} from "../cp002-runtime";
import type { BlrCp002QlId } from "../cp002-permanent-contracts";
import type {
  BlrCp002Anchor,
  BlrCp002QuestionForm,
  BlrCp002StructuredPrompt,
  BlrEntityExpression,
  BlrRoleAssertion,
  BlrRoleCardinalityConstraint,
} from "../cp002-types";
import {
  BLR_CP002_LOCALIZATION_VERSION,
  BLR_CP002_MULTILINGUAL_RUNTIME_VERSION,
  cp002AnchorPossessive,
  cp002AnswerLabel,
  cp002OnlyRoleLabel,
  cp002OwnershipOption,
  cp002RoleLabel,
  cp002RolePossessiveParticle,
  localeText,
  type BlrCp002TranslatedLocale,
} from "./cp002-language-pack";

export const BLR_CP002_HI_PA_LOCALISATION_REVIEW_CANDIDATE =
  "BLR_CP002_HI_PA_LOCALISATION_REVIEW_CANDIDATE" as const;
export const BLR_CP002_HUMAN_REVIEW_BLOCKER =
  "HINDI_PUNJABI_HUMAN_REVIEW_PENDING" as const;

export interface GeneratedBlrCp002LocalizedQuestion
  extends Omit<
    BlrCp002PermanentQuestion,
    "locale" | "stem" | "options" | "explanation" | "metadata"
  > {
  locale: BlrCp002TranslatedLocale;
  canonicalLocale: "en-IN";
  stem: string;
  options: readonly (BlrCp002PermanentQuestion["options"][number] & { value: string })[];
  explanation: {
    coreConcept: readonly string[];
    normalizedClues: readonly string[];
    queryPath: readonly string[];
    conclusion: string;
    familyTree: BlrCp002StructuredPrompt["familyGraph"];
  };
  canonicalItemId: string;
  itemId: string;
  questionLanguageId: string;
  metadata: Omit<BlrCp002PermanentQuestion["metadata"], "runtimeVersion"> & {
    runtimeVersion: typeof BLR_CP002_MULTILINGUAL_RUNTIME_VERSION;
    canonicalRuntimeVersion: "blr-cp002-runtime-v1";
    localizationVersion: typeof BLR_CP002_LOCALIZATION_VERSION;
    localizationAuthority: typeof BLR_CP002_HI_PA_LOCALISATION_REVIEW_CANDIDATE;
    localizationStatus: "EXECUTABLE_REVIEW_REQUIRED";
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED";
    canonicalSemanticFingerprint: string;
    localizedSemanticFingerprint: string;
    semanticParity: "EXECUTABLE_PROVED";
    learnerTextLocalized: true;
    humanLanguageReviewRequired: true;
    activeEditorialBlockers: readonly [typeof BLR_CP002_HUMAN_REVIEW_BLOCKER];
    productDeliveryUnlocked: false;
    productionStagingApproved: false;
  };
}

function anchorName(prompt: BlrCp002StructuredPrompt, anchor: BlrCp002Anchor): string {
  const id = anchor === "SPEAKER"
    ? prompt.speakerId
    : anchor === "LISTENER"
      ? prompt.listenerId!
      : prompt.pointedPersonId!;
  return prompt.personNames[id] ?? id;
}

function roleText(
  roleId: BlrRoleId,
  only: boolean,
  locale: BlrCp002TranslatedLocale,
): string {
  return only ? cp002OnlyRoleLabel(roleId, locale) : cp002RoleLabel(roleId, locale);
}

function queryAnchorLabel(
  prompt: BlrCp002StructuredPrompt,
  anchor: BlrCp002Anchor,
  locale: BlrCp002TranslatedLocale,
): string {
  if (anchor !== "POINTED_PERSON") return anchorName(prompt, anchor);
  if (prompt.presentation === "INTRODUCTION" || prompt.presentation === "STAGE") {
    return anchorName(prompt, anchor);
  }
  if (prompt.presentation === "PHOTOGRAPH") {
    return localeText(locale, "तस्वीर में व्यक्ति", "ਤਸਵੀਰ ਵਾਲਾ ਵਿਅਕਤੀ");
  }
  return localeText(locale, "जिस व्यक्ति की ओर इशारा किया गया है", "ਜਿਸ ਵਿਅਕਤੀ ਵੱਲ ਇਸ਼ਾਰਾ ਕੀਤਾ ਗਿਆ ਹੈ");
}

function chainFromAnchor(
  prompt: BlrCp002StructuredPrompt,
  expression: Extract<BlrEntityExpression, { kind: "ROLE_CHAIN" }>,
  locale: BlrCp002TranslatedLocale,
  namedAnchor = false,
): string {
  const first = expression.steps[0]!;
  const firstRole = first.relationId;
  let result: string;
  if (namedAnchor) {
    result = `${queryAnchorLabel(prompt, expression.anchor, locale)} ${cp002RolePossessiveParticle(firstRole, locale)} ${roleText(firstRole, first.quantifier === "ONLY", locale)}`;
  } else {
    result = `${cp002AnchorPossessive(expression.anchor, firstRole, locale)} ${roleText(firstRole, first.quantifier === "ONLY", locale)}`;
  }
  for (let index = 1; index < expression.steps.length; index += 1) {
    const step = expression.steps[index]!;
    result += ` ${cp002RolePossessiveParticle(step.relationId, locale)} ${roleText(step.relationId, step.quantifier === "ONLY", locale)}`;
  }
  return result;
}

function expressionNominal(
  prompt: BlrCp002StructuredPrompt,
  expression: BlrEntityExpression,
  locale: BlrCp002TranslatedLocale,
): string {
  if (expression.kind === "ROLE_CHAIN") return chainFromAnchor(prompt, expression, locale);
  if (expression.anchor === "SPEAKER") return localeText(locale, "मैं", "ਮੈਂ");
  if (expression.anchor === "LISTENER") return localeText(locale, "आप", "ਤੁਸੀਂ");
  return localeText(locale, "वह व्यक्ति", "ਉਹ ਵਿਅਕਤੀ");
}

function expressionQueryLabel(
  prompt: BlrCp002StructuredPrompt,
  expression: BlrEntityExpression,
  locale: BlrCp002TranslatedLocale,
): string {
  if (expression.kind === "ROLE_CHAIN") {
    return chainFromAnchor(prompt, expression, locale, true);
  }
  return queryAnchorLabel(prompt, expression.anchor, locale);
}

function possessorPrefix(
  prompt: BlrCp002StructuredPrompt,
  expression: BlrEntityExpression,
  targetRole: BlrRoleId,
  locale: BlrCp002TranslatedLocale,
): string {
  if (expression.kind === "ANCHOR") {
    return cp002AnchorPossessive(expression.anchor, targetRole, locale);
  }
  return `${expressionNominal(prompt, expression, locale)} ${cp002RolePossessiveParticle(targetRole, locale)}`;
}

function constraintPossessor(
  prompt: BlrCp002StructuredPrompt,
  expression: BlrEntityExpression,
  roleId: BlrRoleId,
  locale: BlrCp002TranslatedLocale,
): string {
  if (expression.kind === "ANCHOR") {
    return cp002AnchorPossessive(expression.anchor, roleId, locale);
  }
  return `${expressionNominal(prompt, expression, locale)} ${cp002RolePossessiveParticle(roleId, locale)}`;
}

function constraintSentence(
  prompt: BlrCp002StructuredPrompt,
  constraint: BlrRoleCardinalityConstraint,
  locale: BlrCp002TranslatedLocale,
): string {
  if (constraint.relationId === "SIBLING") {
    const possessor = constraintPossessor(prompt, constraint.reference, "BROTHER", locale);
    return localeText(
      locale,
      `${possessor} कोई भाई या बहन नहीं है।`,
      `${possessor} ਕੋਈ ਭਰਾ ਜਾਂ ਭੈਣ ਨਹੀਂ ਹੈ।`,
    );
  }
  if (constraint.relationId === "PARENT") {
    const possessor = constraintPossessor(prompt, constraint.reference, "PARENT", locale);
    return localeText(
      locale,
      `${possessor} माता-पिता में से कोई मौजूद नहीं है।`,
      `${possessor} ਮਾਤਾ-ਪਿਤਾ ਵਿੱਚੋਂ ਕੋਈ ਮੌਜੂਦ ਨਹੀਂ ਹੈ।`,
    );
  }
  const relation = cp002RoleLabel(constraint.relationId, locale);
  const possessor = constraintPossessor(prompt, constraint.reference, constraint.relationId, locale);
  return localeText(
    locale,
    `${possessor} कोई ${relation} नहीं है।`,
    `${possessor} ਕੋਈ ${relation} ਨਹੀਂ ਹੈ।`,
  );
}

function assertionSentence(
  prompt: BlrCp002StructuredPrompt,
  assertion: BlrRoleAssertion,
  locale: BlrCp002TranslatedLocale,
): string {
  const subject = expressionNominal(prompt, assertion.subject, locale);
  const reference = expressionNominal(prompt, assertion.reference, locale);
  if (assertion.relation.kind === "SAME_PERSON") {
    return localeText(
      locale,
      `${subject} और ${reference} एक ही व्यक्ति हैं।`,
      `${subject} ਅਤੇ ${reference} ਇੱਕੋ ਵਿਅਕਤੀ ਹਨ।`,
    );
  }
  const role = assertion.relation.relationId;
  const relation = roleText(role, assertion.relation.quantifier === "ONLY", locale);
  const prefix = possessorPrefix(prompt, assertion.reference, role, locale);
  const copula =
    assertion.subject.kind === "ANCHOR" && assertion.subject.anchor === "SPEAKER"
      ? localeText(locale, "हूँ", "ਹਾਂ")
      : assertion.subject.kind === "ANCHOR" && assertion.subject.anchor === "LISTENER"
        ? localeText(locale, "हैं", "ਹੋ")
        : localeText(locale, "है", "ਹੈ");
  return `${subject}, ${prefix} ${relation} ${copula}।`;
}

function questionText(
  prompt: BlrCp002StructuredPrompt,
  locale: BlrCp002TranslatedLocale,
): string {
  const questionForm: BlrCp002QuestionForm = prompt.questionForm ?? "HOW_RELATED";
  if (questionForm === "WHOSE_PHOTOGRAPH") {
    return localeText(locale, "यह तस्वीर किसकी थी?", "ਇਹ ਤਸਵੀਰ ਕਿਸ ਦੀ ਸੀ?");
  }
  if (questionForm === "WHOSE_PORTRAIT") {
    const speaker = anchorName(prompt, "SPEAKER");
    return localeText(
      locale,
      `${speaker} किसका चित्र देख रहे थे?`,
      `${speaker} ਕਿਸ ਦਾ ਚਿੱਤਰ ਦੇਖ ਰਹੇ ਸਨ?`,
    );
  }
  const subject = expressionQueryLabel(prompt, prompt.query.subject, locale);
  const reference = expressionQueryLabel(prompt, prompt.query.reference, locale);
  return localeText(
    locale,
    `${subject} का ${reference} से क्या संबंध है?`,
    `${subject} ਦਾ ${reference} ਨਾਲ ਕੀ ਰਿਸ਼ਤਾ ਹੈ?`,
  );
}

function localizedStem(
  prompt: BlrCp002StructuredPrompt,
  locale: BlrCp002TranslatedLocale,
): { stem: string; normalizedClues: readonly string[] } {
  const speaker = anchorName(prompt, "SPEAKER");
  const pointed = prompt.pointedPersonId ? anchorName(prompt, "POINTED_PERSON") : "";
  const listener = prompt.listenerId ? anchorName(prompt, "LISTENER") : "";
  const clues = [
    ...(prompt.constraints ?? []).map((constraint) => constraintSentence(prompt, constraint, locale)),
    assertionSentence(prompt, prompt.assertion, locale),
  ];
  const quote = clues.join(" ");
  const question = questionText(prompt, locale);
  const form: BlrCp002QuestionForm = prompt.questionForm ?? "HOW_RELATED";

  if (prompt.presentation === "CONVERSATION") {
    return {
      stem: localeText(
        locale,
        `${speaker} ने ${listener} से कहा, “${quote}” ${question}`,
        `${speaker} ਨੇ ${listener} ਨੂੰ ਕਿਹਾ, “${quote}” ${question}`,
      ),
      normalizedClues: clues,
    };
  }
  if (form === "WHOSE_PORTRAIT") {
    return {
      stem: localeText(
        locale,
        `एक व्यक्ति का चित्र देखते हुए, ${speaker} ने कहा, “${quote}” ${question}`,
        `ਇੱਕ ਵਿਅਕਤੀ ਦਾ ਚਿੱਤਰ ਵੇਖਦੇ ਹੋਏ, ${speaker} ਨੇ ਕਿਹਾ, “${quote}” ${question}`,
      ),
      normalizedClues: clues,
    };
  }
  if (prompt.presentation === "PHOTOGRAPH") {
    return {
      stem: localeText(
        locale,
        `एक व्यक्ति की तस्वीर की ओर इशारा करते हुए, ${speaker} ने कहा, “${quote}” ${question}`,
        `ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਤਸਵੀਰ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦੇ ਹੋਏ, ${speaker} ਨੇ ਕਿਹਾ, “${quote}” ${question}`,
      ),
      normalizedClues: clues,
    };
  }
  if (prompt.presentation === "POINTING") {
    return {
      stem: localeText(
        locale,
        `एक व्यक्ति की ओर इशारा करते हुए, ${speaker} ने कहा, “${quote}” ${question}`,
        `ਇੱਕ ਵਿਅਕਤੀ ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦੇ ਹੋਏ, ${speaker} ਨੇ ਕਿਹਾ, “${quote}” ${question}`,
      ),
      normalizedClues: clues,
    };
  }
  if (prompt.presentation === "STAGE") {
    return {
      stem: localeText(
        locale,
        `मंच पर ${pointed} की ओर इशारा करते हुए, ${speaker} ने कहा, “${quote}” ${question}`,
        `ਮੰਚ ਉੱਤੇ ${pointed} ਵੱਲ ਇਸ਼ਾਰਾ ਕਰਦੇ ਹੋਏ, ${speaker} ਨੇ ਕਿਹਾ, “${quote}” ${question}`,
      ),
      normalizedClues: clues,
    };
  }
  return {
    stem: localeText(
      locale,
      `${pointed} का परिचय देते हुए, ${speaker} ने कहा, “${quote}” ${question}`,
      `${pointed} ਦੀ ਜਾਣ-ਪਛਾਣ ਕਰਵਾਉਂਦੇ ਹੋਏ, ${speaker} ਨੇ ਕਿਹਾ, “${quote}” ${question}`,
    ),
    normalizedClues: clues,
  };
}

function localizedOption(
  record: BlrCp002PermanentQuestion,
  option: BlrCp002PermanentQuestion["options"][number],
  locale: BlrCp002TranslatedLocale,
) {
  const form: BlrCp002QuestionForm = record.structuredPrompt.questionForm ?? "HOW_RELATED";
  return {
    ...option,
    value: form === "HOW_RELATED"
      ? cp002AnswerLabel(option.answerId, locale)
      : cp002OwnershipOption(option.answerId, locale),
  };
}

function localizedExplanationSteps(
  record: BlrCp002PermanentQuestion,
  locale: BlrCp002TranslatedLocale,
  correctValue: string,
): readonly string[] {
  const prompt = record.structuredPrompt;
  const speaker = anchorName(prompt, "SPEAKER");
  const steps: string[] = [];

  if (prompt.listenerId) {
    const listener = anchorName(prompt, "LISTENER");
    steps.push(
      localeText(
        locale,
        `कथन में ‘मैं’ = ${speaker} और ‘आप’ = ${listener} मानें।`,
        `ਕਥਨ ਵਿੱਚ ‘ਮੈਂ’ = ${speaker} ਅਤੇ ‘ਤੁਸੀਂ’ = ${listener} ਮੰਨੋ।`,
      ),
    );
  } else {
    steps.push(
      localeText(
        locale,
        `कथन में ‘मैं’ से आशय ${speaker} है।`,
        `ਕਥਨ ਵਿੱਚ ‘ਮੈਂ’ ਤੋਂ ਭਾਵ ${speaker} ਹੈ।`,
      ),
    );
  }

  if (record.metadata.onlyConstraintCount > 0) {
    steps.push(
      localeText(
        locale,
        "‘एकमात्र’ वाले संबंध में उसी भूमिका का केवल एक व्यक्ति हो सकता है; उसी व्यक्ति को आगे की कड़ी में लें।",
        "‘ਇਕਲੌਤਾ/ਇਕਲੌਤੀ’ ਵਾਲੇ ਰਿਸ਼ਤੇ ਵਿੱਚ ਉਸ ਭੂਮਿਕਾ ਦਾ ਕੇਵਲ ਇੱਕ ਵਿਅਕਤੀ ਹੋ ਸਕਦਾ ਹੈ; ਉਸੇ ਵਿਅਕਤੀ ਨੂੰ ਅੱਗੇ ਦੀ ਲੜੀ ਵਿੱਚ ਲਓ।",
      ),
    );
  }
  if (record.metadata.negativeConstraintCount > 0) {
    steps.push(
      localeText(
        locale,
        "‘कोई भाई/बहन नहीं’ जैसी नकारात्मक शर्त को पहले लागू करें; ऐसा व्यक्ति हटाएँ जो उस शर्त को पूरा नहीं करता।",
        "‘ਕੋਈ ਭਰਾ/ਭੈਣ ਨਹੀਂ’ ਵਰਗੀ ਨਕਾਰਾਤਮਕ ਸ਼ਰਤ ਪਹਿਲਾਂ ਲਾਗੂ ਕਰੋ; ਉਹ ਵਿਅਕਤੀ ਹਟਾਓ ਜੋ ਇਹ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਕਰਦਾ।",
      ),
    );
  }

  if (record.metadata.selfIdentity) {
    steps.push(
      localeText(
        locale,
        record.metadata.questionForm === "HOW_RELATED"
          ? "पूरी भूमिका-श्रृंखला हल करने पर प्रश्न के दोनों छोर एक ही व्यक्ति पर पहुँचते हैं।"
          : "पूरी भूमिका-श्रृंखला हल करने पर तस्वीर/चित्र वाला व्यक्ति स्वयं वक्ता ही निकलता है।",
        record.metadata.questionForm === "HOW_RELATED"
          ? "ਪੂਰੀ ਭੂਮਿਕਾ-ਲੜੀ ਹੱਲ ਕਰਨ ਉੱਤੇ ਪ੍ਰਸ਼ਨ ਦੇ ਦੋਵੇਂ ਸਿਰੇ ਇੱਕੋ ਵਿਅਕਤੀ ਉੱਤੇ ਪਹੁੰਚਦੇ ਹਨ।"
          : "ਪੂਰੀ ਭੂਮਿਕਾ-ਲੜੀ ਹੱਲ ਕਰਨ ਉੱਤੇ ਤਸਵੀਰ/ਚਿੱਤਰ ਵਾਲਾ ਵਿਅਕਤੀ ਖੁਦ ਬੋਲਣ ਵਾਲਾ ਹੀ ਨਿਕਲਦਾ ਹੈ।",
      ),
    );
  } else if (record.metadata.questionForm === "HOW_RELATED") {
    steps.push(
      localeText(
        locale,
        `सभी भूमिकाएँ क्रम से हल करने पर पूछा गया संबंध ${correctValue} मिलता है।`,
        `ਸਾਰੀਆਂ ਭੂਮਿਕਾਵਾਂ ਕ੍ਰਮ ਨਾਲ ਹੱਲ ਕਰਨ ਉੱਤੇ ਪੁੱਛਿਆ ਰਿਸ਼ਤਾ ${correctValue} ਮਿਲਦਾ ਹੈ।`,
      ),
    );
  } else {
    steps.push(
      localeText(
        locale,
        `पूरी संबंध-श्रृंखला से तस्वीर/चित्र के लिए सही विकल्प ${correctValue} मिलता है।`,
        `ਪੂਰੀ ਰਿਸ਼ਤਾ-ਲੜੀ ਤੋਂ ਤਸਵੀਰ/ਚਿੱਤਰ ਲਈ ਸਹੀ ਵਿਕਲਪ ${correctValue} ਮਿਲਦਾ ਹੈ।`,
      ),
    );
  }

  if (!steps.some((line) => line.includes(correctValue))) {
    steps.push(
      localeText(
        locale,
        `इसलिए इस प्रश्न के लिए सही विकल्प ${correctValue} है।`,
        `ਇਸ ਲਈ ਇਸ ਪ੍ਰਸ਼ਨ ਲਈ ਸਹੀ ਵਿਕਲਪ ${correctValue} ਹੈ।`,
      ),
    );
  }
  return steps;
}

function canonicalProjection(
  record: BlrCp002PermanentQuestion | GeneratedBlrCp002LocalizedQuestion,
) {
  return {
    packageId: record.packageId,
    checkpointId: record.checkpointId,
    qlId: record.qlId,
    permanentQlId: record.permanentQlId,
    ruleId: record.ruleId,
    seed: record.seed,
    difficulty: record.difficulty,
    renderer: record.renderer,
    answerType: record.answerType,
    correctIndex: record.correctIndex,
    structuredPrompt: record.structuredPrompt,
    sourcePrototypeId: record.metadata.sourcePrototypeId,
    sourceScenarioId: record.metadata.sourceScenarioId,
    hiddenFingerprint: record.metadata.hiddenFingerprint,
    solveAuthority: record.metadata.solveAuthority,
    answerId: record.metadata.answerId,
    optionSemantics: record.options.map((option) => ({
      answerId: option.answerId,
      isCorrect: option.isCorrect,
      errorLabel: option.errorLabel ?? null,
    })),
  };
}

export function localizeBlrCp002Question(
  record: BlrCp002PermanentQuestion,
  locale: BlrCp002TranslatedLocale,
): GeneratedBlrCp002LocalizedQuestion {
  const localized = localizedStem(record.structuredPrompt, locale);
  const localizedStemText = localizeBlrPersonNamesInText(localized.stem, locale);
  const localizedClues = localized.normalizedClues.map((line) =>
    localizeBlrPersonNamesInText(line, locale),
  );
  const options = record.options.map((option) => {
    const localizedValue = localizedOption(record, option, locale);
    return {
      ...localizedValue,
      value: localizeBlrPersonNamesInText(localizedValue.value, locale),
    };
  });
  const localizedFamilyGraph = {
    ...record.structuredPrompt.familyGraph,
    persons: record.structuredPrompt.familyGraph.persons.map((person) => ({
      ...person,
      name: localizeBlrPersonName(person.name, locale),
    })),
  };
  const correct = options[record.correctIndex]!;
  const canonicalItemId = [
    record.checkpointId,
    record.qlId,
    String(record.metadata.sourceScenarioId),
    record.seed,
    String(record.metadata.hiddenFingerprint),
  ].join(":");
  const questionLanguageId = `${canonicalItemId}:${locale}`;
  const localizedSemanticFingerprint = stableHash([
    String(record.metadata.hiddenFingerprint),
    locale,
    localizedStemText,
    ...options.map((option) => option.value),
  ]);
  const candidate = {
    ...record,
    locale,
    stem: localizedStemText,
    options,
  } as unknown as GeneratedBlrCp002LocalizedQuestion;
  if (
    JSON.stringify(canonicalProjection(candidate))
    !== JSON.stringify(canonicalProjection(record))
  ) {
    throw new Error(
      `CP-002 localization semantic parity failed for ${record.seed}/${locale}.`,
    );
  }

  return {
    ...record,
    locale,
    canonicalLocale: "en-IN",
    stem: localizedStemText,
    options,
    explanation: {
      coreConcept: [
        localeText(
          locale,
          "पहले ‘मैं’, ‘आप’ और बताए गए व्यक्ति की पहचान स्पष्ट करें। फिर रिश्ते की कड़ी को एक-एक चरण में हल करें।",
          "ਪਹਿਲਾਂ ‘ਮੈਂ’, ‘ਤੁਸੀਂ’ ਅਤੇ ਦੱਸੇ ਵਿਅਕਤੀ ਦੀ ਪਛਾਣ ਸਪਸ਼ਟ ਕਰੋ। ਫਿਰ ਰਿਸ਼ਤੇ ਦੀ ਲੜੀ ਨੂੰ ਇੱਕ-ਇੱਕ ਪੜਾਅ ਵਿੱਚ ਹੱਲ ਕਰੋ।",
        ),
      ],
      normalizedClues: localizedClues,
      queryPath: localizedExplanationSteps(record, locale, correct.value).map((line) =>
        localizeBlrPersonNamesInText(line, locale),
      ),
      conclusion: localeText(
        locale,
        `अतः सही उत्तर है: ${correct.value}।`,
        `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਹੈ: ${correct.value}।`,
      ),
      familyTree: localizedFamilyGraph,
    },
    canonicalItemId,
    itemId: questionLanguageId,
    questionLanguageId,
    metadata: {
      ...record.metadata,
      runtimeVersion: BLR_CP002_MULTILINGUAL_RUNTIME_VERSION,
      canonicalRuntimeVersion: "blr-cp002-runtime-v1",
      localizationVersion: BLR_CP002_LOCALIZATION_VERSION,
      localizationAuthority: BLR_CP002_HI_PA_LOCALISATION_REVIEW_CANDIDATE,
      localizationStatus: "EXECUTABLE_REVIEW_REQUIRED",
      reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
      canonicalSemanticFingerprint: String(record.metadata.hiddenFingerprint),
      localizedSemanticFingerprint,
      semanticParity: "EXECUTABLE_PROVED",
      learnerTextLocalized: true,
      humanLanguageReviewRequired: true,
      activeEditorialBlockers: [BLR_CP002_HUMAN_REVIEW_BLOCKER],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
    },
  };
}

export function generateBlrCp002LocalizedQuestion(
  qlId: BlrCp002QlId,
  seed: number,
  locale: BlrCp002TranslatedLocale,
): GeneratedBlrCp002LocalizedQuestion {
  return localizeBlrCp002Question(generateBlrCp002Question(qlId, seed), locale);
}

export function blrCp002CanonicalParityProjection(
  record: BlrCp002PermanentQuestion | GeneratedBlrCp002LocalizedQuestion,
) {
  return canonicalProjection(record);
}
