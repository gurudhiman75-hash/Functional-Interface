import {completeSourceCatalogue} from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/source-review/complete-source-catalogue";
import {geometryModes,generateGeometryReview} from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/source-review/geometry-counting";
import {buildSubsetReview,type SubsetInput} from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/source-review/subset-counting";
import {buildExactDigitReview,type ExactDigitInput} from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/source-review/exact-digit-counting";
import {buildBoundedScoreReview,type ScoreInput} from "../quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/source-review/bounded-score-counting";
import {QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as standard} from "./standard-lifecycle";
import type {QuestionStudioGenerationRequest,QuestionStudioGenerationResult,QuestionStudioPackageDefinition,QuestionStudioGeneratedQuestion} from "./engine-types";
const {questionBankAcceptanceMode:_mode,questionBankAcceptanceAuthority:_authority,...lifecycle}=standard;
const packageId="PNC-SOURCE-REVIEW";
const raw:{id:string;group:string;language:string;stem:string;answer:string;explanation:string[];options?:string[];correctIndex?:number;difficulty:string}[]=[];
for(const mode of geometryModes)for(const language of ['en','hi','pa']as const)for(let seed=0;seed<12;seed++) {
 const q=generateGeometryReview(mode,`source-geometry:${seed}`,language);
 raw.push({id:`geometry:${mode}:${seed}:${language}`,group:'PNC-SOURCE-GEOMETRY',language,stem:q.stem,answer:q.answer,explanation:q.explanation,options:q.options,correctIndex:q.correctIndex,difficulty:mode==='quadrilateralsWithCollinearBlock'?'Hard':mode==='lines'||mode==='triangles'?'Easy':'Medium'});
}
const subsets:SubsetInput[]=[{mode:'nonemptyDistinct',counts:[5,3,6]},{mode:'eachDistinctCategory',counts:[5,3,6]},{mode:'boundedIdentical',counts:[5,4,4]},{mode:'optionalQuestions',counts:[15,2]},{mode:'atMostDistinct',counts:[15],maximumSelected:5,includeEmpty:true}];
for(const [i,input]of subsets.entries()){const q=buildSubsetReview(input);raw.push({id:`subset:${i}`,group:'PNC-SOURCE-SUBSET',language:'en',stem:q.stem,answer:q.answer,explanation:q.explanation,options:q.options,correctIndex:q.correctIndex,difficulty:'Medium'});}
const digits:ExactDigitInput[]=[{digits:[1,2,3,4,5,6,7,8],length:4,specified:1,occurrences:1,repetition:true},{digits:[1,2,3],length:7,specified:3,occurrences:2,repetition:true},{digits:[1,2,3,4,5,6,7,8],length:4,specified:2,occurrences:1,repetition:false}];
for(const [i,input]of digits.entries()){const q=buildExactDigitReview(input);raw.push({id:`digit:${i}`,group:'PNC-SOURCE-EXACT-DIGIT',language:'en',stem:q.stem,answer:q.answer,explanation:q.explanation,difficulty:'Medium'});}
const scores:ScoreInput[]=[{capacities:[50,50,50,100],target:150,condition:'exactly'},{capacities:[45,45,45,45],target:90,condition:'exactly'},{capacities:[45,45,45,45],target:90,condition:'atLeast'}];
for(const [i,input]of scores.entries()){const q=buildBoundedScoreReview(input);raw.push({id:`score:${i}`,group:'PNC-SOURCE-BOUNDED-SCORE',language:'en',stem:q.stem,answer:q.answer,explanation:q.explanation,difficulty:'Hard'});}
const nativeAliases:Record<string,string>={'subset:0':'I-052','subset:1':'I-053','subset:2':'I-051','subset:3':'I-054','subset:4':'I-031','digit:0':'II-048','digit:1':'II-049','digit:2':'II-050','score:0':'III-013','score:1':'III-050'};
const catalogue=completeSourceCatalogue();
for(const q of [...raw])if(nativeAliases[q.id])for(const language of ['hi','pa']){const localized=catalogue.find(c=>c.id===`${nativeAliases[q.id]}:${language}`)!;if(!localized)throw Error('Missing native source alias');raw.push({...localized,id:`${q.id}:${language}`,group:q.group,difficulty:q.difficulty});}
for(const language of ['hi','pa']){const q=raw.find(c=>c.id==='score:2')!;raw.push({...q,id:`score:2:${language}`,language,stem:language==='hi'?'चार खंडों के पूर्णांक अंक 0 से 45 तक हैं। कुल कम से कम 90 देने वाले कितने क्रमित चौकड़े हैं?':'ਚਾਰ ਭਾਗਾਂ ਦੇ ਪੂਰਨ ਅੰਕ 0 ਤੋਂ 45 ਤੱਕ ਹਨ। ਕੁੱਲ ਘੱਟੋ-ਘੱਟ 90 ਦੇਣ ਵਾਲੀਆਂ ਕਿੰਨੀਆਂ ਕ੍ਰਮਵਾਰ ਚੌਕੜੀਆਂ ਹਨ?',explanation:language==='hi'?['कुल चौकड़े 46⁴ हैं। कुल 90 से कम और 90 से अधिक के चौकड़े पूरक जोड़ों में समान संख्या में हैं।','(46⁴+64906)/2=2271181।']:['ਕੁੱਲ ਚੌਕੜੀਆਂ 46⁴ ਹਨ। ਕੁੱਲ 90 ਤੋਂ ਘੱਟ ਅਤੇ 90 ਤੋਂ ਵੱਧ ਦੀਆਂ ਚੌਕੜੀਆਂ ਪੂਰਕ ਜੋੜਿਆਂ ਵਿੱਚ ਬਰਾਬਰ ਗਿਣਤੀ ਵਿੱਚ ਹਨ।','(46⁴+64906)/2=2271181।']});}
export function pncSourceReviewRows():QuestionStudioGeneratedQuestion[] {
 return [...raw,...completeSourceCatalogue()].map((q,index)=>{
  let options=q.options?[...q.options]:[q.answer,String(Number(q.answer)+1),String(Number(q.answer)-1),String(Number(q.answer)*2)];let correctIndex=q.correctIndex??0;
  if(!q.options){correctIndex=index%4;[options[0],options[correctIndex]]=[options[correctIndex],options[0]];}
  if(options.length!==4||new Set(options).size!==4||options[correctIndex]!==q.answer)throw Error(`Invalid source review options: ${q.id}`);
  return {questionId:`${packageId}:${q.id}`,text:q.stem,stem:q.stem,options,correct:correctIndex,correctIndex,answer:q.answer,answerText:q.answer,explanation:q.explanation.join('\n\n'),difficulty:q.difficulty,difficultyLabel:q.difficulty,language:q.language,packageId,patternId:packageId,canonicalProblemId:q.group,qlId:q.id,questionLanguageId:q.id,section:'Quant',topic:'Arithmetic',subtopic:'Permutation & Combination',generationBackend:'quant-v4',...lifecycle,lifecycleStage:'REVIEW_ONLY',reviewOnly:true,questionStudioRegistrationStatus:'REGISTERED_REVIEW_ONLY',publicReleaseAuthorized:false,persistenceAllowed:false,routeMounted:true,productionSelectorVisible:true,reviewStatus:'REVIEW_REQUIRED',metadata:{exactIntegerAnswer:'exactIntegerAnswer' in q?q.exactIntegerAnswer:undefined,nativeEditorialApprovalRecorded:false,chapterAuditClosed:true,technicalReviewFrozen:true,freezeAuthority:"PNC-CHAPTER-FREEZE-20261011",auditScope:"TECHNICAL_REVIEW"}};
 });
}
export function pncSourceReviewPackage():QuestionStudioPackageDefinition {
 return {engineId:'quant-v4',packageId,topic:'Arithmetic',subtopic:'Permutation & Combination',label:'Permutation & Combination — source-gap review',enabled:true,cpIds:[...new Set([...raw,...completeSourceCatalogue()].map(q=>q.group))],supportedLanguages:['en','hi','pa'],supportedDifficulties:['Easy','Medium','Hard'],difficultyFilterSupported:true,...lifecycle,lifecycleStage:'REVIEW_ONLY',metadata:{rows:raw.length+completeSourceCatalogue().length,languageSupportByCp:{'PNC-SOURCE-GEOMETRY':['en','hi','pa'],'PNC-SOURCE-SUBSET':['en','hi','pa'],'PNC-SOURCE-EXACT-DIGIT':['en','hi','pa'],'PNC-SOURCE-BOUNDED-SCORE':['en','hi','pa'],'PNC-SOURCE-EXERCISES':['en','hi','pa'],'PNC-SOURCE-WORKED':['en','hi','pa']},editorialApproval:'PENDING'}};
}
function hash(s:string):number {let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;}
export function generatePncSourceReviewBatch(request:QuestionStudioGenerationRequest):QuestionStudioGenerationResult|null {
 if(String(request.packageId??request.patternId??'').toUpperCase()!==packageId)return null;
 const language=request.language??'en',band=String(request.difficulty??'mixed').toLowerCase().replace('moderate','medium'),count=request.count??1,seed=request.seed??packageId;
 if(!['en','hi','pa'].includes(language)||!['mixed','easy','medium','hard'].includes(band)||!Number.isInteger(count)||count<1||count>50)throw Error('Invalid PNC source review request');
 const rows=pncSourceReviewRows().filter(q=>q.language===language&&(!request.canonicalProblemId||q.canonicalProblemId===request.canonicalProblemId)&&(!request.questionLanguageId||q.qlId===request.questionLanguageId)&&(band==='mixed'||String(q.difficulty).toLowerCase()===band)).sort((a,b)=>hash(`${seed}:${a.questionId}`)-hash(`${seed}:${b.questionId}`)||String(a.questionId).localeCompare(String(b.questionId)));
 const seen=new Set<string>(),questions:QuestionStudioGeneratedQuestion[]=[];
 for(const q of rows){const key=JSON.stringify([q.stem,q.options]);if(seen.has(key))continue;seen.add(key);questions.push(q);if(questions.length===count)break;}
 if(questions.length!==count)throw Error(`Only ${questions.length} PNC source candidates match these filters`);
 return {questions,generationContext:{engineId:'quant-v4',generationDomain:'quant-v4',packageId,seed,...lifecycle,lifecycleStage:'REVIEW_ONLY',reviewOnly:true}};
}
