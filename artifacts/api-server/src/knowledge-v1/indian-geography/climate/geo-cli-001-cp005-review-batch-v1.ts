import { CP005_DATA_A } from "./geo-cli-001-cp005-data-a";
import { CP005_DATA_B } from "./geo-cli-001-cp005-data-b";
import { CP005_DATA_C } from "./geo-cli-001-cp005-data-c";

export type GeoCli001Cp005Difficulty = "Easy" | "Medium" | "Hard";

export interface GeoCli001Cp005Question {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Cp005Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}

type Raw = readonly [number, GeoCli001Cp005Difficulty, string, string, readonly [string,string,string], string];

const QL_NAMES: Readonly<Record<number,string>> = Object.freeze({
  37: "Onset over Kerala and early advance",
  38: "Burst of monsoon and early-season change",
  39: "Arabian Sea branch",
  40: "Bay of Bengal branch",
  41: "Himalayan deflection and inland routes",
  42: "Monsoon trough and breaks",
  43: "Arabian Sea branch subdivisions and inland movement",
  44: "Branch interaction and advance across India",
  45: "Integrated advancing-monsoon reasoning",
});

const SOURCE_IDS = Object.freeze([
  "NCERT-CONTEMPORARY-INDIA-I-CLIMATE",
  "NCERT-INDIA-PHYSICAL-ENVIRONMENT-CLIMATE",
]);

const RAW = [...CP005_DATA_A, ...CP005_DATA_B, ...CP005_DATA_C] as unknown as readonly Raw[];

function positionOptions(answer:string,distractors:readonly [string,string,string],index:number){
  const correctIndex=index%4;
  const options=[...distractors];
  options.splice(correctIndex,0,answer);
  return {options:Object.freeze(options),correctIndex};
}

export const GEO_CLI_001_CP005_REVIEW_BATCH_V1: readonly GeoCli001Cp005Question[] = Object.freeze(
  RAW.map((row,index)=>{
    const [ql,difficulty,stem,canonicalAnswer,distractors,explanation]=row;
    const {options,correctIndex}=positionOptions(canonicalAnswer,distractors,index);
    const serial=String(index+1).padStart(3,"0");
    return Object.freeze({
      questionId:`GEO-CLI-001-CP005-Q${serial}`,
      qlId:`GEO-CLI-001-QL-${String(ql).padStart(3,"0")}`,
      qlName:QL_NAMES[ql],
      difficulty,stem,options,correctIndex,canonicalAnswer,explanation,
      sourceIds:SOURCE_IDS,
      sourceFactIds:Object.freeze([`GEO-CLI-001-QL-${String(ql).padStart(3,"0")}-FACT-${String((index%6)+1).padStart(2,"0")}`]),
      reviewOnly:true as const,
      runtimeRegistered:false as const,
    });
  })
);

const BANNED_LEARNER_TEXT=/sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT/i;
const BANNED_STEM_TEXT=/associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp005ReviewBatchV1(){
  const issues:string[]=[];
  const ids=new Set<string>();
  const stems=new Set<string>();
  const semantics=new Set<string>();
  const explanations=new Set<string>();
  const qlCounts:Record<string,number>={};
  const difficultyCounts:Record<GeoCli001Cp005Difficulty,number>={Easy:0,Medium:0,Hard:0};
  const answerPositions=[0,0,0,0];
  const hardAnswers=new Set<string>();
  let statementStemCount=0;

  for(const q of GEO_CLI_001_CP005_REVIEW_BATCH_V1){
    if(ids.has(q.questionId)) issues.push(`DUPLICATE_ID:${q.questionId}`);
    ids.add(q.questionId);
    const normalizedStem=q.stem.replace(/\s+/g," ").trim().toLowerCase();
    if(stems.has(normalizedStem)) issues.push(`DUPLICATE_STEM:${q.questionId}`);
    stems.add(normalizedStem);
    const semantic=`${normalizedStem}::${q.canonicalAnswer.toLowerCase()}`;
    if(semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${q.questionId}`);
    semantics.add(semantic);
    const normalizedExplanation=q.explanation.replace(/\s+/g," ").trim().toLowerCase();
    if(explanations.has(normalizedExplanation)) issues.push(`DUPLICATE_EXPLANATION:${q.questionId}`);
    explanations.add(normalizedExplanation);
    qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;
    difficultyCounts[q.difficulty]+=1;
    answerPositions[q.correctIndex]+=1;
    if(q.difficulty==="Hard") hardAnswers.add(q.canonicalAnswer);
    if(q.options.length!==4||new Set(q.options).size!==4) issues.push(`OPTIONS:${q.questionId}`);
    if(q.options[q.correctIndex]!==q.canonicalAnswer) issues.push(`ANSWER:${q.questionId}`);
    if(!q.sourceIds.length||!q.sourceFactIds.length) issues.push(`PROVENANCE:${q.questionId}`);
    if(!q.reviewOnly||q.runtimeRegistered) issues.push(`LIFECYCLE:${q.questionId}`);
    if(q.explanation.length<60) issues.push(`SHORT_EXPLANATION:${q.questionId}`);
    if(q.stem.length<28) issues.push(`SHORT_STEM:${q.questionId}`);
    if(q.stem.length>220) issues.push(`LONG_STEM:${q.questionId}`);
    if(!q.stem.trim().endsWith("?")) issues.push(`NON_QUESTION_STEM:${q.questionId}`);
    if(BANNED_STEM_TEXT.test(q.stem)) issues.push(`NON_EXAM_STEM:${q.questionId}`);
    if(/^Consider these statements/i.test(q.stem)||/^Which statement set/i.test(q.stem)) statementStemCount+=1;
    const learnerText=`${q.stem}\n${q.options.join("\n")}\n${q.explanation}`;
    if(BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${q.questionId}`);
  }

  if(GEO_CLI_001_CP005_REVIEW_BATCH_V1.length!==54) issues.push(`COUNT:${GEO_CLI_001_CP005_REVIEW_BATCH_V1.length}`);
  if(stems.size!==54) issues.push(`STEM_COUNT:${stems.size}`);
  if(semantics.size!==54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if(explanations.size!==54) issues.push(`EXPLANATION_COUNT:${explanations.size}`);
  if(statementStemCount>10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for(let i=37;i<=45;i+=1){
    const qlId=`GEO-CLI-001-QL-${String(i).padStart(3,"0")}`;
    if(qlCounts[qlId]!==6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId]??0}`);
  }
  if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==30||difficultyCounts.Hard!==6) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if(answerPositions.join(",")!=="14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if(hardAnswers.size<3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return Object.freeze({
    valid:issues.length===0,
    issues:Object.freeze(issues),
    questionCount:GEO_CLI_001_CP005_REVIEW_BATCH_V1.length,
    stemCount:stems.size,
    semanticCount:semantics.size,
    explanationCount:explanations.size,
    qlCounts:Object.freeze(qlCounts),
    difficultyCounts:Object.freeze(difficultyCounts),
    answerPositions:Object.freeze(answerPositions),
    hardAnswerVariety:hardAnswers.size,
    statementStemCount,
  });
}
