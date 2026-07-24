export interface LexicalRelationDefinition {
  id: string;
  label: string;
  ruleStatement: string;
  predicateTemplate: string;
  sourceCategory: string;
  answerCategory: string;
}

export const ANA_CP002_RELATIONS: readonly LexicalRelationDefinition[] = [
  { id: "LEX_SYNONYM", label: "synonym", ruleStatement: "The second term has the same meaning as the first.", predicateTemplate: "{right} is a synonym of {left}.", sourceCategory: "WORD", answerCategory: "SYNONYM" },
  { id: "LEX_ANTONYM", label: "antonym", ruleStatement: "The second term has the opposite meaning to the first.", predicateTemplate: "{right} is an antonym of {left}.", sourceCategory: "WORD", answerCategory: "ANTONYM" },
  { id: "LEX_INTENSITY_UP", label: "lower to higher intensity", ruleStatement: "The second term expresses a stronger degree of the first.", predicateTemplate: "{right} expresses a stronger degree than {left}.", sourceCategory: "LOWER_INTENSITY", answerCategory: "HIGHER_INTENSITY" },
  { id: "LEX_INTENSITY_DOWN", label: "higher to lower intensity", ruleStatement: "The second term expresses a milder degree of the first.", predicateTemplate: "{right} expresses a milder degree than {left}.", sourceCategory: "HIGHER_INTENSITY", answerCategory: "LOWER_INTENSITY" },
  { id: "LEX_CAUSE_EFFECT", label: "cause and effect", ruleStatement: "The second term is a typical effect of the first.", predicateTemplate: "{left} can cause {right}.", sourceCategory: "CAUSE", answerCategory: "EFFECT" },
  { id: "LEX_EFFECT_CAUSE", label: "effect and cause", ruleStatement: "The second term is a typical cause of the first.", predicateTemplate: "{right} can cause {left}.", sourceCategory: "EFFECT", answerCategory: "CAUSE" },
  { id: "LEX_CONDITION_SYMPTOM", label: "condition and symptom", ruleStatement: "The second term is a characteristic symptom of the first condition.", predicateTemplate: "{right} is a characteristic symptom of {left}.", sourceCategory: "CONDITION", answerCategory: "SYMPTOM" },
  { id: "LEX_ACTION_RESULT", label: "action and result", ruleStatement: "The second term is a typical result of the first action.", predicateTemplate: "{left} typically results in {right}.", sourceCategory: "ACTION", answerCategory: "RESULT" },
  { id: "LEX_OBJECT_CHARACTERISTIC", label: "object and characteristic", ruleStatement: "The second term is a defining characteristic of the first.", predicateTemplate: "{right} is a defining characteristic of {left}.", sourceCategory: "OBJECT_OR_SUBSTANCE", answerCategory: "CHARACTERISTIC" },
  { id: "LEX_WORD_DEFINITION", label: "word and definition", ruleStatement: "The second term defines the first.", predicateTemplate: "{right} defines {left}.", sourceCategory: "WORD", answerCategory: "DEFINITION" },
  { id: "LEX_DEFICIENCY_MISSING_QUALITY", label: "deficiency and missing quality", ruleStatement: "The second term is the quality whose absence is named by the first.", predicateTemplate: "{left} is the absence or deficiency of {right}.", sourceCategory: "DEFICIENCY", answerCategory: "MISSING_QUALITY" },
  { id: "LEX_STUDY_SUBJECT", label: "study and subject", ruleStatement: "The second term is the subject studied by the first discipline.", predicateTemplate: "{left} is the study of {right}.", sourceCategory: "FIELD_OF_STUDY", answerCategory: "SUBJECT" },
];

export function lexicalRelationDefinition(ruleId: string): LexicalRelationDefinition {
  const definition = ANA_CP002_RELATIONS.find((entry) => entry.id === ruleId);
  if (!definition) throw new Error(`Unknown ANA-CP-002 relation: ${ruleId}`);
  return definition;
}
