import type { GeneratedOptions, GeneratedParameters, ProbabilityExperiment, ProbabilityQuestionLanguageEntry, ProbabilityTaskRegistryEntry, SolvedProbability, ValidationCheck, ValidationResult, VerificationResult } from "./types";
import { answerText, isProbability } from "./rational";
function words(text:string):number{return text.trim().split(/\s+/).filter(Boolean).length;}
function check(name:string,passed:boolean,message:string,blocker=true):ValidationCheck{return{name,passed,message:passed?"passed":message,blocker};}
export function validateProbabilityQuestion(args:{entry:ProbabilityTaskRegistryEntry;language:ProbabilityQuestionLanguageEntry;parameters:GeneratedParameters;experiment:ProbabilityExperiment;stem:string;solved:SolvedProbability;options:GeneratedOptions;explanation:string[];verification:VerificationResult;}):ValidationResult{
  const {entry,parameters,experiment,stem,solved,options,explanation,verification}=args,checks:ValidationCheck[]=[];
  checks.push(check("required-variables",entry.requiredVariables.every((key)=>parameters[key]!==undefined),"One or more required variables are missing."));
  checks.push(check("no-unresolved-placeholders",!/\{[^}]+\}/.test(stem),"The stem contains an unresolved placeholder."));
  checks.push(check("no-invalid-literals",!/(?:NaN|undefined|null|Infinity)/.test(`${stem} ${explanation.join(" ")}`),"Invalid runtime literal found."));
  checks.push(check("four-options",options.options.length===4,"Exactly four options are required."));
  checks.push(check("unique-options",new Set(options.options.map((value)=>value.trim().toLowerCase())).size===4,"Options are not unique."));
  checks.push(check("valid-correct-index",options.correctIndex>=0&&options.correctIndex<4,"Correct option index is invalid."));
  checks.push(check("correct-answer-once",options.options.filter((value)=>value===answerText(solved.answer)).length===1,"Correct answer must appear exactly once."));
  if(solved.answer.kind==="PROBABILITY")checks.push(check("probability-range",isProbability(solved.answer.exact),"Probability is outside [0,1]."));
  checks.push(check("positive-denominator",solved.answer.kind!=="PROBABILITY"||solved.answer.exact.denominator>0n,"Probability denominator is not positive."));
  const stemWords=words(stem),range=entry.difficulty==="Easy"?[18,35]:entry.difficulty==="Medium"?[28,50]:[40,75];
  checks.push(check("stem-length",stemWords>=range[0]&&stemWords<=range[1],`Stem has ${stemWords} words; expected ${range[0]}-${range[1]}.`));
  const explanationWords=words(explanation.join(" ")),minimum=entry.difficulty==="Easy"?90:entry.difficulty==="Medium"?130:170,maximum=entry.difficulty==="Easy"?180:entry.difficulty==="Medium"?260:340;
  checks.push(check("explanation-length",explanationWords>=minimum&&explanationWords<=maximum,`Explanation has ${explanationWords} words; expected ${minimum}-${maximum}.`));
  checks.push(check("sample-space-reason",solved.evidence.sampleSpaceReason.length>20,"Sample-space reason is missing."));
  checks.push(check("method-reason",solved.evidence.methodReason.length>20,"Method reason is missing."));
  checks.push(check("independent-verification",verification.supported&&verification.matched,"Independent verification failed."));
  checks.push(check("equal-likelihood-declared",experiment.equallyLikely,"Initial production requires equally likely elementary outcomes."));
  if(experiment.kind==="CARD_DRAW")checks.push(check("canonical-deck",Number(experiment.metadata.deckSize)===52,"Card experiment is not using the canonical 52-card deck."));
  if(experiment.kind==="URN_DRAW"){const red=Number(experiment.metadata.red),blue=Number(experiment.metadata.blue),draws=Number(experiment.metadata.draws);checks.push(check("valid-urn-state",red>0&&blue>0&&draws>0&&draws<=red+blue,"Urn state or draw count is infeasible."));}
  if(entry.replacementPolicy!=="NOT_APPLICABLE")checks.push(check("replacement-clarity",/replacement|replaced|not replaced|without replacement|with replacement/i.test(`${stem} ${solved.evidence.replacementReason??""}`),"Replacement policy is not explicit."));
  if(entry.orderPolicy!=="UNORDERED"&&(experiment.stages.length>1||["PRB-CP-006","PRB-CP-008"].includes(entry.cpId)))checks.push(check("order-clarity",/ordered|first|second|successive|position|office|line|code|toss/i.test(`${stem} ${solved.evidence.sampleSpaceReason} ${solved.evidence.orderReason??""}`),"Order policy is not explicit."));
  if(entry.answerDimension==="COUNT")checks.push(check("count-answer",solved.answer.kind==="COUNT","Registry expects a count answer."));
  else checks.push(check("probability-answer",solved.answer.kind==="PROBABILITY","Registry expects a probability answer."));
  const valid=checks.filter((item)=>item.blocker).every((item)=>item.passed);return{valid,checks};
}
