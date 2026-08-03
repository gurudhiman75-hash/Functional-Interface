import {
  INT_CP003_QL_IDS,
  INT_CP003_RATE_LIBRARY,
  generateIntCp003ExamQuestion,
  type IntCp003ExamQuestion,
  type IntCp003QlId,
} from "./cp003-exam-runtime";

function stable(value: unknown): string {
  return JSON.stringify(value, (_key,item)=>typeof item === "bigint" ? item.toString() : item);
}
const EXPECTED_STATE_KEYS: Readonly<Record<IntCp003QlId,readonly string[]>> = Object.freeze({
  "INT-QL-053":["principal","ratePercent","years"],"INT-QL-054":["principal","ratePercent","years"],
  "INT-QL-055":["amount","ratePercent","years"],"INT-QL-056":["compoundInterest","ratePercent","years"],
  "INT-QL-057":["principal","amount","years"],"INT-QL-058":["principal","amount","ratePercent"],
  "INT-QL-059":["principal","ratePercent","targetYear"],"INT-QL-060":["nthYearInterest","ratePercent","targetYear"],
  "INT-QL-061":["principal","nthYearInterest","targetYear"],"INT-QL-062":["currentAmount","ratePercent","currentYear"],
  "INT-QL-063":["openingAmount","closingAmount","yearNumber"],"INT-QL-064":["amountAtYear","nextYearAmount","yearNumber"],
  "INT-QL-065":["principal","ratePercent","earlierYear","laterYear"],"INT-QL-066":["earlierYearInterest","ratePercent","earlierYear","laterYear"],
});

const rateCounts = new Map<string,number>();
const representationCounts = new Map<string,number>();
const difficultyCounts = new Map<string,number>();
const answerPositions = [0,0,0,0];
const templatesByQl = new Map<IntCp003QlId,Set<string>>();
const fingerprints = new Set<string>();
const numericFamilies = new Set<string>();
const representationRates = new Map<string,Set<string>>();
const rateRepresentations = new Map<string,Set<string>>();
const keyIdeaCounts = new Map<string,number>();
const positionSequence:number[]=[];
let questionCount=0, deterministicChecks=0, optionChecks=0, stateKeyChecks=0, representationChecks=0, explanationChecks=0, lifecycleChecks=0;
let shortcutCount=0, verificationCount=0;

function assertQuestion(question:IntCp003ExamQuestion,index:number):void {
  const prefix=`${question.qlId}/${index}`;
  const keys=Object.keys(question.mathematicalState).filter(key=>key!=="qlId").sort();
  const expected=[...EXPECTED_STATE_KEYS[question.qlId]].sort();
  if(keys.join("|")!==expected.join("|"))throw new Error(`${prefix}: irrelevant or missing mathematical-state fields ${keys.join(",")}`);
  stateKeyChecks += keys.length;
  const fingerprintKeys=question.mathematicalFingerprint.split("|").slice(1,-1).map(part=>part.split("=")[0]).sort();
  if(fingerprintKeys.join("|")!==expected.join("|"))throw new Error(`${prefix}: fingerprint contains irrelevant fields`);
  stateKeyChecks += fingerprintKeys.length;

  if(question.options.length!==4||new Set(question.options.map(option=>option.text)).size!==4)throw new Error(`${prefix}: invalid options`);
  if(question.options.filter(option=>option.isCorrect).length!==1||!question.options[question.correctIndex]?.isCorrect)throw new Error(`${prefix}: correct option ownership`);
  for(const option of question.options){
    if(!option.calculation||!option.studentFeedback||!option.misconceptionId)throw new Error(`${prefix}: incomplete option diagnosis`);
    if(!option.isCorrect&&option.misconceptionId==="CORRECT")throw new Error(`${prefix}: wrong option tagged correct`);
    optionChecks += 1;
  }

  const markdown=question.presentation.markdown;
  if(question.presentation.representation!=="STANDARD_PROSE"){
    if(!question.presentation.table||!markdown.includes("| ---"))throw new Error(`${prefix}: metadata-only representation`);
  }
  if(question.presentation.representation==="STANDARD_PROSE"&&question.presentation.table)throw new Error(`${prefix}: prose unexpectedly carries a table`);
  representationChecks += 1;

  const learnerText=[markdown,question.explanation.keyIdea,...question.explanation.steps,question.explanation.finalAnswer,question.explanation.shortcut?.title??"",...(question.explanation.shortcut?.steps??[]),question.explanation.commonMistake??"",question.explanation.verification?.method??"",...(question.explanation.verification?.steps??[])].join("\n");
  if(/bounded|canonical|verifier|mathematical state|generation seed/iu.test(learnerText))throw new Error(`${prefix}: engineering terminology leak`);
  if(/₹\d{3},\d{3}(?:\D|$)/u.test(learnerText)||/₹\d{1,3},\d{3},\d{3}/u.test(learnerText))throw new Error(`${prefix}: western currency grouping`);
  if(question.explanation.steps.length<2||question.explanation.depths.foundation.steps.length<2)throw new Error(`${prefix}: underdeveloped explanation`);
  if(!question.explanation.finalAnswer.includes(question.correctAnswer))throw new Error(`${prefix}: final answer mismatch`);
  explanationChecks += 5;
  if(question.explanation.shortcut)shortcutCount += 1;
  if(question.explanation.verification)verificationCount += 1;

  if(question.qlId==="INT-QL-065"){
    if("amount" in question.mathematicalState||"amountAtYear" in question.mathematicalState)throw new Error(`${prefix}: QL-065 gives away derived amounts`);
    if(!/(difference|subtract|later year)/iu.test(question.explanation.keyIdea))throw new Error(`${prefix}: QL-065 explanation lost CI relationship`);
  }

  if(question.enabled||question.questionStudioDiscoverable||question.publiclyPublishable||question.stagingStatus!=="NOT_STAGED"||question.registrationStatus!=="NOT_REGISTERED"||question.questionBankStatus!=="NOT_STORED"||question.testEligibility!=="INELIGIBLE")throw new Error(`${prefix}: lifecycle lock failure`);
  lifecycleChecks += 7;
}

for(const qlId of INT_CP003_QL_IDS){
  const templates=new Set<string>();
  for(let index=0;index<100;index++){
    const seed=`int-cp003-exam-readiness:${qlId}:${index}`;
    const first=generateIntCp003ExamQuestion(qlId,seed),second=generateIntCp003ExamQuestion(qlId,seed);
    if(stable(first)!==stable(second))throw new Error(`${qlId}/${index}: deterministic replay failed`);
    deterministicChecks += 1; questionCount += 1;
    assertQuestion(first,index);
    rateCounts.set(first.rateProfileId,(rateCounts.get(first.rateProfileId)??0)+1);
    representationCounts.set(first.presentation.representation,(representationCounts.get(first.presentation.representation)??0)+1);
    difficultyCounts.set(first.difficulty,(difficultyCounts.get(first.difficulty)??0)+1);
    answerPositions[first.correctIndex] += 1; positionSequence.push(first.correctIndex);
    templates.add(first.normalizedTemplateKey); fingerprints.add(first.mathematicalFingerprint); numericFamilies.add(first.numericFamilyKey);
    if(!representationRates.has(first.presentation.representation))representationRates.set(first.presentation.representation,new Set());
    representationRates.get(first.presentation.representation)!.add(first.rateProfileId);
    if(!rateRepresentations.has(first.rateProfileId))rateRepresentations.set(first.rateProfileId,new Set());
    rateRepresentations.get(first.rateProfileId)!.add(first.presentation.representation);
    keyIdeaCounts.set(first.explanation.keyIdea,(keyIdeaCounts.get(first.explanation.keyIdea)??0)+1);
  }
  if(templates.size<4)throw new Error(`${qlId}: normalized template diversity ${templates.size}/4`);
  templatesByQl.set(qlId,templates);
}

if(rateCounts.size!==INT_CP003_RATE_LIBRARY.length)throw new Error(`rate coverage ${rateCounts.size}/${INT_CP003_RATE_LIBRARY.length}`);
if(representationCounts.size!==6)throw new Error(`representation coverage ${representationCounts.size}/6`);
if([...representationRates.values()].some(rates=>rates.size<10))throw new Error("representation remains correlated with too few rates");
if([...rateRepresentations.values()].some(reps=>reps.size<4))throw new Error("rate remains correlated with too few representations");
if(answerPositions.some(count=>count<280||count>420))throw new Error(`answer-position imbalance ${answerPositions.join("/")}`);
let maximumRun=1,currentRun=1;for(let i=1;i<positionSequence.length;i++){if(positionSequence[i]===positionSequence[i-1])currentRun+=1;else currentRun=1;maximumRun=Math.max(maximumRun,currentRun);}
if(maximumRun>8)throw new Error(`answer-position run too long: ${maximumRun}`);
let repeatedCycle=false;for(let i=0;i+15<positionSequence.length;i++){const block=positionSequence.slice(i,i+4).join("");if(block===positionSequence.slice(i+4,i+8).join("")&&block===positionSequence.slice(i+8,i+12).join("")&&block===positionSequence.slice(i+12,i+16).join("")){repeatedCycle=true;break;}}
if(repeatedCycle)throw new Error("fixed answer-position cycle detected");
if(!["Easy","Medium","Hard"].every(label=>difficultyCounts.has(label)))throw new Error("difficulty bands incomplete");
if(numericFamilies.size<800)throw new Error(`numeric-family diversity ${numericFamilies.size}/800`);
if(fingerprints.size<1000)throw new Error(`mathematical-state diversity ${fingerprints.size}/1000`);
if(shortcutCount>=questionCount*0.6)throw new Error("shortcut section is still near-universal");
if(verificationCount>=questionCount*0.4)throw new Error("verification section is still near-universal");
if(Math.max(...keyIdeaCounts.values())>questionCount*0.1)throw new Error("one generic key idea dominates the chapter");

const summary={status:"SECOND_REMEDIATION_REVIEW_CANDIDATE",questionCount,deterministicChecks,stateKeyChecks,optionChecks,representationChecks,explanationChecks,lifecycleChecks,rateCounts:Object.fromEntries(rateCounts),representationCounts:Object.fromEntries(representationCounts),difficultyCounts:Object.fromEntries(difficultyCounts),answerPositions,maximumAnswerPositionRun:maximumRun,rateCoverage:rateCounts.size,representationCoverage:representationCounts.size,numericFamilyCount:numericFamilies.size,mathematicalFingerprintCount:fingerprints.size,normalizedTemplatesByQl:Object.fromEntries([...templatesByQl].map(([ql,set])=>[ql,set.size])),shortcutCount,verificationCount,lifecycle:{enabled:false,stagingStatus:"NOT_STAGED",registrationStatus:"NOT_REGISTERED",questionStudioDiscoverable:false,questionBankStatus:"NOT_STORED",testEligibility:"INELIGIBLE",publiclyPublishable:false}};
console.log(JSON.stringify(summary,null,2));
console.log("PASS_INT_CP003_EXAM_READINESS_REMEDIATION");
