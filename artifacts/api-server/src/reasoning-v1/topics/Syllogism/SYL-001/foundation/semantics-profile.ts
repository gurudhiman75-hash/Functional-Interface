export interface SyllogismSemanticsProfile {
  profileId: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1";
  universalSubjectExistence: true;
  negativeUniversalSubjectExistence: true;
  negativeUniversalPredicateExistence: "ASSUMED_BY_SOURCE_PROFILE";
  allConversion: "NOT_VALID";
  noConversion: "VALID";
  someConversion: "VALID";
  someNotConversion: "NOT_VALID";
  allSubalternation: "VALID_WHEN_SUBJECT_EXISTS";
  noSubalternation: "VALID_WHEN_SUBJECT_EXISTS";
  onlyNormalization: "REVERSE_SUBSET";
  areOnlyNormalization: "FORWARD_SUBSET";
  aFewNormalization: "SOME";
  fewNormalization: "SOURCE_PROFILE_REQUIRED";
  onlyAFewNormalization: "SOME_AND_SOME_NOT";
  possibilitySemantics: "SATISFIABLE";
  definiteSemantics: "ENTAILED";
  eitherOrSemantics: "EXACTLY_ONE_ACROSS_ALL_MODELS";
}

export const SYL_001_SEMANTICS_PROFILE: SyllogismSemanticsProfile = Object.freeze({
  profileId: "INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1",
  universalSubjectExistence: true,
  negativeUniversalSubjectExistence: true,
  negativeUniversalPredicateExistence: "ASSUMED_BY_SOURCE_PROFILE",
  allConversion: "NOT_VALID",
  noConversion: "VALID",
  someConversion: "VALID",
  someNotConversion: "NOT_VALID",
  allSubalternation: "VALID_WHEN_SUBJECT_EXISTS",
  noSubalternation: "VALID_WHEN_SUBJECT_EXISTS",
  onlyNormalization: "REVERSE_SUBSET",
  areOnlyNormalization: "FORWARD_SUBSET",
  aFewNormalization: "SOME",
  fewNormalization: "SOURCE_PROFILE_REQUIRED",
  onlyAFewNormalization: "SOME_AND_SOME_NOT",
  possibilitySemantics: "SATISFIABLE",
  definiteSemantics: "ENTAILED",
  eitherOrSemantics: "EXACTLY_ONE_ACROSS_ALL_MODELS",
});
