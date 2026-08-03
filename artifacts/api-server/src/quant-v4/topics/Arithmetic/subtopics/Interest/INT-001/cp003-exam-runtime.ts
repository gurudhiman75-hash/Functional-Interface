import { INT_CP003_QL_IDS, INT_CP003_RATE_LIBRARY, canonicalAnswer, generateCp003QuestionContract, type IntCp003QlId, type Rational } from "./cp003-exam-model";
import type { IntCp003ExamQuestion } from "./cp003-exam-types";
import { ANSWER_SEMANTICS, resolve } from "./cp003-exam-support";
import { presentationFor } from "./cp003-exam-presentation";
import { optionsFor } from "./cp003-exam-options";
import { explanationFor } from "./cp003-exam-explanation";
export { INT_CP003_QL_IDS, INT_CP003_RATE_LIBRARY, generateCp003QuestionContract, type IntCp003QlId, type Rational } from "./cp003-exam-model";
export type { IntCp003ExamQuestion } from "./cp003-exam-types";

function deepFreeze<T>(value:T):T {
  if(value&&typeof value==="object"&&!Object.isFrozen(value)){for(const nested of Object.values(value as Record<string,unknown>))deepFreeze(nested);Object.freeze(value);}return value;
}
export function generateIntCp003ExamQuestion(qlId:IntCp003QlId,seed="int-cp003-exam-default"):IntCp003ExamQuestion {
  const contract=generateCp003QuestionContract(qlId,seed),resolved=resolve(contract.mathematicalState),solution=canonicalAnswer(contract.mathematicalState),presentation=presentationFor(contract,resolved),options=optionsFor(contract,resolved),correctIndex=options.findIndex(option=>option.isCorrect);
  if(correctIndex<0||options.filter(option=>option.isCorrect).length!==1)throw new Error(`${qlId}: correct option ownership failure`);
  const normalizedTemplateKey=`${qlId}|${presentation.representation}|${presentation.stemFamilyId}`;
  const question:IntCp003ExamQuestion={packageId:"INT-001",canonicalProblemId:"INT-CP-003",checkpointId:"INT-CP-003-EXAM-READINESS-REMEDIATION",qlId,seed,mathematicalState:contract.mathematicalState,mathematicalFingerprint:contract.mathematicalFingerprint,numericFamilyKey:contract.numericFamilyKey,rateProfileId:contract.rateProfileId,normalizedTemplateKey,presentation,difficulty:contract.difficultyProfile.label,difficultyProfile:contract.difficultyProfile,answerSemantic:ANSWER_SEMANTICS[qlId],options,correctIndex,correctAnswer:options[correctIndex]!.text,solution,explanation:explanationFor(contract,resolved,solution,options),editorialStatus:"SECOND_REMEDIATION_REVIEW_CANDIDATE",approvalStatus:"WITHDRAWN_PENDING_REAUDIT",enabled:false,stagingStatus:"NOT_STAGED",registrationStatus:"NOT_REGISTERED",questionStudioDiscoverable:false,questionBankStatus:"NOT_STORED",testEligibility:"INELIGIBLE",publiclyPublishable:false};
  return deepFreeze(question);
}
