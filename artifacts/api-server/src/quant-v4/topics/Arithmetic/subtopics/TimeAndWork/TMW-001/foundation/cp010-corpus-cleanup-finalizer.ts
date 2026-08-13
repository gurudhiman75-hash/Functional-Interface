import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import { buildCp010SemanticWorking, type Cp010ReviewLanguage, type Cp010SemanticQuestion } from "./cp010-corpus-semantic-working";

type Triplet = readonly [string, string, string];
interface LegacyExplanation {
  opening: string;
  formula: string;
  givens: string[];
  steps: string[];
  shortcut: { title: string; steps: string[] };
  commonTrap: { optionLabel: string; optionText: string; misconceptionId: string; explanation: string };
  conclusion: string;
}
interface Cp010Question extends Cp010SemanticQuestion {
  canonicalProblemId?: string;
  cpId?: string;
  learnerExplanation?: TmwLearnerExplanationV2;
  explanation?: LegacyExplanation;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}
function t(language:Cp010ReviewLanguage,x:Triplet):string{return language==="hi"?x[1]:language==="pa"?x[2]:x[0];}
function cleanAnswer(value:string):string{
  let current=value;
  for(let i=0;i<4;i+=1){const next=current.replace(/\\\(([^()]*)\\;\\text\{([^{}]+)\}\\\)/g,(_m,expr:string,label:string)=>`\\(${expr.trim()}\\) ${label.trim()}`);if(next===current)break;current=next;}
  return current.replace(/\s{2,}/g," ").trim();
}
function solverTrace(value:string):boolean{
  if(/\\text\{|\\Delta/.test(value))return true;
  for(const hit of value.matchAll(/\\\(([\s\S]*?)\\\)/g)){if(/(?:^|[^A-Za-z\\])(?:r|L|V|T|t|x)(?:_|=|\b)/.test(hit[1]??""))return true;}
  return false;
}
function localizedProseInMath(value:string):boolean{
  for(const hit of value.matchAll(/\\\(([\s\S]*?)\\\)/g)){if(/[\u0900-\u097F\u0A00-\u0A7F]/u.test(hit[1]??""))return true;}
  return false;
}
function legacyFormula(language:Cp010ReviewLanguage,mode:string):string{
  if(mode==="findCapacityFromStagedPhysicalFlows")return t(language,["Stage volume = flow × time; use the stated filled fraction for total capacity","चरण का आयतन = प्रवाह × समय; दिए भरे भाग से कुल क्षमता निकालें","ਪੜਾਅ ਦੀ ਮਾਤਰਾ = ਪ੍ਰਵਾਹ × ਸਮਾਂ; ਦਿੱਤੇ ਭਰੇ ਹਿੱਸੇ ਤੋਂ ਕੁੱਲ ਸਮਰੱਥਾ ਕੱਢੋ"]);
  if(["findCompletionWithAlternatingPipes","findCompletionWithPeriodicSchedule","findCompletionFromArbitraryCyclePhase","findFullCycleCountToBoundary","findTerminalActiveSegment","findBoundaryEventTimeUnderSchedule"].includes(mode))return t(language,["One-cycle change = sum of the signed changes of its segments","एक-चक्र परिवर्तन = उसके सभी खंडों के भराव/निकासी परिवर्तन का योग","ਇੱਕ-ਚੱਕਰ ਬਦਲਾਅ = ਉਸ ਦੇ ਸਾਰੇ ਹਿੱਸਿਆਂ ਦੇ ਭਰਨ/ਨਿਕਾਸੀ ਬਦਲਾਅ ਦਾ ਜੋੜ"]);
  if(mode==="findAutomaticLevelControlCompletion")return t(language,["Control-cycle time = down-time + return-time","नियंत्रण-चक्र समय = नीचे जाने का समय + वापसी का समय","ਕੰਟਰੋਲ-ਚੱਕਰ ਸਮਾਂ = ਹੇਠਾਂ ਜਾਣ ਦਾ ਸਮਾਂ + ਵਾਪਸੀ ਦਾ ਸਮਾਂ"]);
  return t(language,["Stage change = net rate × stage time","चरण परिवर्तन = शुद्ध दर × चरण का समय","ਪੜਾਅ ਬਦਲਾਅ = ਸ਼ੁੱਧ ਦਰ × ਪੜਾਅ ਦਾ ਸਮਾਂ"]);
}

export function finalizeTmwCp010CorpusCleanup<T extends Cp010Question>(question:T,language:Cp010ReviewLanguage):T{
  if((question.canonicalProblemId??question.cpId)!=="TMW-CP-010"||!question.learnerExplanation)return question;
  const working=buildCp010SemanticWorking(question,language);
  const answer=cleanAnswer(question.learnerExplanation.answer);
  const learner:TmwLearnerExplanationV2={...question.learnerExplanation,solution:[...working.slice(0,4),answer],answer};
  const explanation=question.explanation?{...question.explanation,opening:learner.method,formula:legacyFormula(language,question.solveMode??""),steps:working.slice(0,4),conclusion:answer}:question.explanation;
  const editorialErrors=validateTmwLearnerExplanationV2(learner);
  const presentation=[learner.method,...learner.solution,learner.answer].join(" ");
  const legacy=explanation?[explanation.opening,explanation.formula,...explanation.steps,explanation.conclusion].join(" "):"";
  if(!working.length)editorialErrors.push("No semantic worked solution rendered");
  if(solverTrace(presentation)||solverTrace(legacy))editorialErrors.push("Solver-style symbols or prose-in-MathJax remain");
  if(localizedProseInMath(presentation)||localizedProseInMath(legacy))editorialErrors.push("Localized prose remains inside MathJax");
  const inherited=question.validation?.errors??[];
  const errors=[...inherited.filter(error=>!error.startsWith("CP010 corpus cleanup:")),...editorialErrors.map(error=>`CP010 corpus cleanup: ${error}`)];
  return{...question,learnerExplanation:learner,explanation,validation:{valid:errors.length===0,errors},publiclyPublishable:false}as T;
}
