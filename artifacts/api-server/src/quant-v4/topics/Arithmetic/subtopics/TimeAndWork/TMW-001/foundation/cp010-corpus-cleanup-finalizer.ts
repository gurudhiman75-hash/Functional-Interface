import { validateTmwLearnerExplanationV2, type TmwLearnerExplanationV2 } from "./learner-explanation-contract";
import { buildCp010SemanticWorking, type Cp010ReviewLanguage, type Cp010SemanticQuestion } from "./cp010-corpus-semantic-working";
import { simulateTmwCp010Cycle, simulateTmwCp010Stages } from "./cp010-engine";
import { tmwCp009NetRate } from "./cp009-core";
import { add, compare, divide, multiply, rational, subtract, toLatex } from "./rational";
import type { Rational } from "./types";

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
  solveMode?: string;
  stem?: string;
  options?: string[];
  learnerExplanation?: TmwLearnerExplanationV2;
  explanation?: LegacyExplanation;
  validation?: { valid: boolean; errors: string[] };
  publiclyPublishable?: boolean;
}
function t(language:Cp010ReviewLanguage,x:Triplet):string{return language==="hi"?x[1]:language==="pa"?x[2]:x[0];}
function stop(language:Cp010ReviewLanguage):string{return language==="en"?".":"।";}
function math(value:string):string{return `\\(${value}\\)`;}
function absR(value:Rational):Rational{return rational(Math.abs(value.numerator),value.denominator);}
function targetLevel(question:Cp010Question):Rational{
  const q=question.parameters;
  if(!q)return rational(1);
  return q.targetLevel??(q.targetBoundary==="EMPTY"?rational(0):rational(1));
}
function unit(language:Cp010ReviewLanguage,kind:"hours"|"litres"|"tank/hour"):string{
  if(kind==="hours")return t(language,["hours","घंटे","ਘੰਟੇ"]);
  if(kind==="litres")return t(language,["litres","लीटर","ਲੀਟਰ"]);
  return t(language,["tank per hour","टंकी प्रति घंटा","ਟੈਂਕੀ ਪ੍ਰਤੀ ਘੰਟਾ"]);
}
function cleanAnswer(value:string):string{
  let current=value;
  for(let i=0;i<4;i+=1){const next=current.replace(/\\\(([^()]*)\\;\\text\{([^{}]+)\}\\\)/g,(_m,expr:string,label:string)=>`\\(${expr.trim()}\\) ${label.trim()}`);if(next===current)break;current=next;}
  return current.replace(/\s{2,}/g," ").trim();
}
function cleanStem(value:string,mode:string,language:Cp010ReviewLanguage):string{
  let stem=cleanAnswer(value);
  if(language==="hi"){
    stem=stem
      .replace(/अकेले समय:/gu,"अकेले काम करने पर समय:")
      .replace(/(\d+) घंटों तक/gu,"$1 घंटे तक")
      .replace(/(\d+) घंटों में/gu,"$1 घंटे में")
      .replace(/इनलेट ([A-Z])/gu,"भरने वाली पाइप $1")
      .replace(/आउटलेट ([A-Z])/gu,"निकासी पाइप $1")
      .replace(/((?:भरने वाली|निकासी) पाइप [A-Z]|रिसाव [A-Z]) चलती है ([^;।?]+?) तक/gu,"$1 $2 तक चलती है")
      .replace(/(((?:भरने वाली|निकासी) पाइप [A-Z]|रिसाव [A-Z]) और ((?:भरने वाली|निकासी) पाइप [A-Z]|रिसाव [A-Z])) एक साथ चलते हैं ([^;।?]+?) तक/gu,"$1 $5 तक एक साथ चलते हैं");
    if(mode==="findRequiredFinalStageRate"){
      stem=stem
        .replace(/जलाशय शुरू में खाली है और ([^।]+?) में भरनी है/gu,"जलाशय शुरू में खाली है और $1 में भरना है")
        .replace(/फिर अज्ञात-दर वाला अंतिम भराव अकेला चलता है।/gu,"फिर अज्ञात दर वाली अंतिम भराव पाइप अकेली चलती है।")
        .replace(/ भरने वाली पाइप ([A-Z]) अकेले [^।]+? पूरा भर सकती है।/gu," ");
    }
  }else if(language==="pa"){
    stem=stem
      .replace(/ਇਕੱਲੇ ਸਮੇਂ:/gu,"ਇਕੱਲੇ ਕੰਮ ਕਰਨ ਤੇ ਸਮਾਂ:")
      .replace(/(\d+) ਘੰਟਿਆਂ ਲਈ/gu,"$1 ਘੰਟੇ ਲਈ")
      .replace(/(\d+) ਘੰਟਿਆਂ ਵਿੱਚ/gu,"$1 ਘੰਟੇ ਵਿੱਚ")
      .replace(/ਇਨਲੈਟ ([A-Z])/gu,"ਭਰਨ ਵਾਲੀ ਪਾਈਪ $1")
      .replace(/ਆਉਟਲੈਟ ([A-Z])/gu,"ਨਿਕਾਸੀ ਪਾਈਪ $1")
      .replace(/((?:ਭਰਨ ਵਾਲੀ|ਨਿਕਾਸੀ) ਪਾਈਪ [A-Z]|ਰਿਸਾਅ [A-Z]) ਚੱਲਦੀ ਹੈ ([^;।?]+?) ਲਈ/gu,"$1 $2 ਲਈ ਚੱਲਦੀ ਹੈ")
      .replace(/(((?:ਭਰਨ ਵਾਲੀ|ਨਿਕਾਸੀ) ਪਾਈਪ [A-Z]|ਰਿਸਾਅ [A-Z]) ਅਤੇ ((?:ਭਰਨ ਵਾਲੀ|ਨਿਕਾਸੀ) ਪਾਈਪ [A-Z]|ਰਿਸਾਅ [A-Z])) ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ ([^;।?]+?) ਲਈ/gu,"$1 $5 ਲਈ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ");
    if(mode==="findRequiredFinalStageRate"){
      stem=stem
        .replace(/ਫਿਰ ਅਣਜਾਣ ਦਰ ਵਾਲਾ ਅੰਤਿਮ ਭਰਾਅ ਇਕੱਲਾ ਚੱਲਦਾ ਹੈ।/gu,"ਫਿਰ ਅਣਜਾਣ ਦਰ ਵਾਲੀ ਅੰਤਿਮ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ਇਕੱਲੀ ਚੱਲਦੀ ਹੈ।")
        .replace(/ ਭਰਨ ਵਾਲੀ ਪਾਈਪ ([A-Z]) ਇਕੱਲੀ [^।]+? ਪੂਰਾ ਭਰ ਸਕਦੀ ਹੈ।/gu," ");
    }
  }
  if(mode==="findAutomaticLevelControlCompletion"){
    stem=stem.replace(/\b(\d+)\/(\d+)\b/gu,(_m,n:string,d:string)=>math(`\\frac{${n}}{${d}}`));
  }
  return stem.replace(/\s{2,}/g," ").trim();
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
function fullStageWorking(question:Cp010Question,language:Cp010ReviewLanguage):string[]{
  const q=question.parameters;if(!q?.stages?.length)return[];
  const result=simulateTmwCp010Stages(q),target=targetLevel(question);
  let level=q.initialLevel,elapsed=rational(0);
  const out:string[]=[];
  for(let i=0;i<=result.terminalIndex;i+=1){
    const stage=q.stages[i],rate=tmwCp009NetRate(stage.pipes);
    if(i===result.terminalIndex){
      const remaining=absR(subtract(target,level)),needed=divide(remaining,absR(rate));
      out.push(`${t(language,["Before the final stage, level still required","अंतिम चरण से पहले बचा स्तर","ਅੰਤਿਮ ਪੜਾਅ ਤੋਂ ਪਹਿਲਾਂ ਲੋੜੀਂਦਾ ਪੱਧਰ"])}: ${math(toLatex(remaining))}; ${t(language,["final-stage time","अंतिम चरण का समय","ਅੰਤਿਮ ਪੜਾਅ ਦਾ ਸਮਾਂ"])}: ${math(`${toLatex(remaining)}\\div${toLatex(absR(rate))}=${toLatex(needed)}`)} ${unit(language,"hours")}; ${t(language,["total time","कुल समय","ਕੁੱਲ ਸਮਾਂ"])}: ${math(`${toLatex(elapsed)}+${toLatex(needed)}=${toLatex(result.time)}`)} ${unit(language,"hours")}${stop(language)}`);
      break;
    }
    if(!stage.duration)continue;
    const change=multiply(rate,stage.duration),next=add(level,change);
    if(rate.numerator===0){
      out.push(`${t(language,["No-flow stage","बिना प्रवाह वाला चरण","ਬਿਨਾਂ ਪ੍ਰਵਾਹ ਵਾਲਾ ਪੜਾਅ"])} ${i+1}: ${math(toLatex(stage.duration))} ${unit(language,"hours")}; ${t(language,["the tank level stays","टंकी का स्तर बना रहता है","ਟੈਂਕੀ ਦਾ ਪੱਧਰ ਰਹਿੰਦਾ ਹੈ"])} ${math(toLatex(level))}${stop(language)}`);
    }else{
      out.push(`${t(language,["Stage","चरण","ਪੜਾਅ"])} ${i+1}: ${math(`${toLatex(rate)}\\times${toLatex(stage.duration)}=${toLatex(change)}`)}; ${t(language,["tank level becomes","टंकी का स्तर हो जाता है","ਟੈਂਕੀ ਦਾ ਪੱਧਰ ਹੋ ਜਾਂਦਾ ਹੈ"])} ${math(toLatex(next))}${stop(language)}`);
    }
    level=next;elapsed=add(elapsed,stage.duration);
  }
  return out.slice(0,4);
}
function capacityWorking(question:Cp010Question,language:Cp010ReviewLanguage):string[]{
  const q=question.parameters,s=question.solution;if(!q?.physicalStages?.length||!s)return[];
  const volumes=q.physicalStages.map(stage=>multiply(stage.netFlowLitresPerHour,stage.duration));
  const total=volumes.reduce((acc,value)=>add(acc,value),rational(0)),fraction=q.capacityFraction??rational(1),answer=s.answerValues[0];
  const out=q.physicalStages.map((stage,index)=>`${t(language,["Stage volume","चरण का आयतन","ਪੜਾਅ ਦੀ ਮਾਤਰਾ"])} ${index+1}: ${math(`${toLatex(stage.netFlowLitresPerHour)}\\times${toLatex(stage.duration)}=${toLatex(volumes[index])}`)} ${unit(language,"litres")}${stop(language)}`);
  const sumExpression=volumes.map(toLatex).join("+");
  if(fraction.numerator===fraction.denominator){
    out.push(`${t(language,["The tank is full, so capacity equals the total added volume","टंकी पूरी भरी है, इसलिए क्षमता कुल जोड़े गए आयतन के बराबर है","ਟੈਂਕੀ ਪੂਰੀ ਭਰੀ ਹੈ, ਇਸ ਲਈ ਸਮਰੱਥਾ ਕੁੱਲ ਜੋੜੀ ਮਾਤਰਾ ਦੇ ਬਰਾਬਰ ਹੈ"])}: ${math(`${sumExpression}=${toLatex(answer)}`)} ${unit(language,"litres")}${stop(language)}`);
  }else{
    out.push(`${t(language,["These stages fill","इन चरणों से भरा भाग","ਇਨ੍ਹਾਂ ਪੜਾਵਾਂ ਨਾਲ ਭਰਿਆ ਹਿੱਸਾ"])} ${math(toLatex(fraction))}; ${t(language,["capacity","क्षमता","ਸਮਰੱਥਾ"])}: ${math(`${toLatex(total)}\\div${toLatex(fraction)}=${toLatex(answer)}`)} ${unit(language,"litres")}${stop(language)}`);
  }
  return out.slice(-4);
}
function pipeName(pipe:{label:string;kind:string},language:Cp010ReviewLanguage):string{
  const letter=pipe.label.match(/([A-Z])$/)?.[1]??"";
  if(pipe.kind==="INLET")return t(language,[`inlet ${letter}`,`भरने वाली पाइप ${letter}`,`ਭਰਨ ਵਾਲੀ ਪਾਈਪ ${letter}`]);
  if(pipe.kind==="OUTLET")return t(language,[`outlet ${letter}`,`निकासी पाइप ${letter}`,`ਨਿਕਾਸੀ ਪਾਈਪ ${letter}`]);
  return t(language,[`leak ${letter}`,`रिसाव ${letter}`,`ਰਿਸਾਅ ${letter}`]);
}
function segmentName(segment:{pipes:Array<{label:string;kind:string}>},language:Cp010ReviewLanguage):string{
  const names=segment.pipes.map(pipe=>pipeName(pipe,language));
  const joined=names.length<=1?names[0]??t(language,["terminal segment","अंतिम खंड","ਅੰਤਿਮ ਹਿੱਸਾ"]):names.join(" + ");
  return t(language,[`${joined} interval`,`${joined} का अंतराल`,`${joined} ਦਾ ਅੰਤਰਾਲ`]);
}
function signedCycleExpression(question:Cp010Question):string{
  const cycle=question.parameters?.cycle??[];
  return cycle.map((segment,index)=>{
    const rate=tmwCp009NetRate(segment.pipes),sign=rate.numerator<0?"-":index===0?"":"+";
    return `${sign}${toLatex(absR(rate))}\\times${toLatex(segment.duration)}`;
  }).join("");
}
function cycleWorking(question:Cp010Question,language:Cp010ReviewLanguage):string[]{
  const q=question.parameters,s=question.solution,mode=question.solveMode??"";if(!q?.cycle?.length||!s)return[];
  const result=simulateTmwCp010Cycle(q),cycle=q.cycle,startIndex=q.startingCycleIndex??0;
  const changes=cycle.map(segment=>multiply(tmwCp009NetRate(segment.pipes),segment.duration));
  const net=changes.reduce((acc,value)=>add(acc,value),rational(0));
  const cycleDuration=cycle.reduce((acc,segment)=>add(acc,segment.duration),rational(0));
  const fullCycles=rational(result.fullCycles),fullTime=multiply(cycleDuration,fullCycles),levelAfterFull=add(q.initialLevel,multiply(net,fullCycles));
  const out:string[]=[
    `${t(language,["One complete cycle","एक पूरा चक्र","ਇੱਕ ਪੂਰਾ ਚੱਕਰ"])}: ${math(`${signedCycleExpression(question)}=${toLatex(net)}`)}; ${t(language,["cycle time","चक्र का समय","ਚੱਕਰ ਦਾ ਸਮਾਂ"])} ${math(toLatex(cycleDuration))} ${unit(language,"hours")}${stop(language)}`,
    `${t(language,["After the safe complete cycles","सुरक्षित पूरे चक्रों के बाद","ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ"])}: ${result.fullCycles} ${t(language,["cycles take","चक्रों में समय","ਚੱਕਰਾਂ ਦਾ ਸਮਾਂ"])} ${math(`${toLatex(fullCycles)}\\times${toLatex(cycleDuration)}=${toLatex(fullTime)}`)} ${unit(language,"hours")}; ${t(language,["tank level","टंकी का स्तर","ਟੈਂਕੀ ਦਾ ਪੱਧਰ"])} ${math(toLatex(levelAfterFull))}${stop(language)}`,
  ];
  if(mode==="findFullCycleCountToBoundary"){
    out.push(`${t(language,["The next cycle is the terminal cycle, so the requested complete-cycle count is","अगला चक्र अंतिम चक्र है, इसलिए माँगे गए पूरे चक्रों की संख्या","ਅਗਲਾ ਚੱਕਰ ਅੰਤਿਮ ਚੱਕਰ ਹੈ, ਇਸ ਲਈ ਮੰਗੇ ਗਏ ਪੂਰੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ"])} ${result.fullCycles}${stop(language)}`);
    return out;
  }
  let index=startIndex,level=levelAfterFull,prefixTime=rational(0);
  while(index!==result.terminalIndex){
    const segment=cycle[index],rate=tmwCp009NetRate(segment.pipes);
    level=add(level,multiply(rate,segment.duration));prefixTime=add(prefixTime,segment.duration);index=(index+1)%cycle.length;
  }
  const terminal=cycle[result.terminalIndex],terminalRate=absR(tmwCp009NetRate(terminal.pipes)),remaining=absR(subtract(targetLevel(question),level)),terminalTime=divide(remaining,terminalRate),terminalLabel=segmentName(terminal,language);
  if(prefixTime.numerator!==0){
    out.push(`${t(language,["In the terminal cycle, the earlier segment(s) take","अंतिम चक्र में पहले वाले खंडों में","ਅੰਤਿਮ ਚੱਕਰ ਵਿੱਚ ਪਹਿਲਾਂ ਵਾਲੇ ਹਿੱਸਿਆਂ ਨੂੰ"])} ${math(toLatex(prefixTime))} ${unit(language,"hours")}; ${t(language,["the level before the terminal segment is","अंतिम खंड से पहले स्तर","ਅੰਤਿਮ ਹਿੱਸੇ ਤੋਂ ਪਹਿਲਾਂ ਪੱਧਰ"])} ${math(toLatex(level))}${stop(language)}`);
  }else{
    out.push(`${t(language,["At the start of the terminal segment, level still required","अंतिम खंड की शुरुआत में बचा स्तर","ਅੰਤਿਮ ਹਿੱਸੇ ਦੀ ਸ਼ੁਰੂਆਤ ਤੇ ਲੋੜੀਂਦਾ ਪੱਧਰ"])}: ${math(toLatex(remaining))}${stop(language)}`);
  }
  if(mode==="findTerminalActiveSegment"){
    out.push(`${t(language,["Time needed in","इसमें आवश्यक समय","ਇਸ ਵਿੱਚ ਲੋੜੀਂਦਾ ਸਮਾਂ"])} ${terminalLabel}: ${math(`${toLatex(remaining)}\\div${toLatex(terminalRate)}=${toLatex(terminalTime)}`)} ${unit(language,"hours")}, ${t(language,["which is within that segment; the boundary is first reached there","जो उसी खंड के भीतर है; सीमा पहली बार वहीं मिलती है","ਜੋ ਉਸੇ ਹਿੱਸੇ ਦੇ ਅੰਦਰ ਹੈ; ਹੱਦ ਪਹਿਲੀ ਵਾਰ ਉੱਥੇ ਮਿਲਦੀ ਹੈ"])}${stop(language)}`);
    return out;
  }
  const prefixAndTerminal=add(prefixTime,terminalTime);
  out.push(`${t(language,["Terminal part in","अंतिम भाग","ਅੰਤਿਮ ਭਾਗ"])} ${terminalLabel}: ${math(`${toLatex(remaining)}\\div${toLatex(terminalRate)}=${toLatex(terminalTime)}`)} ${unit(language,"hours")}; ${t(language,["total time","कुल समय","ਕੁੱਲ ਸਮਾਂ"])} ${math(`${toLatex(fullTime)}+${toLatex(prefixAndTerminal)}=${toLatex(result.time)}`)} ${unit(language,"hours")}${stop(language)}`);
  return out;
}
function deadlineWorking(question:Cp010Question,language:Cp010ReviewLanguage):string[]{
  const q=question.parameters,s=question.solution;if(!q?.stages||q.stages.length<2||!q.requiredDeadline||!q.adjustmentBaseDuration||!s)return[];
  const first=tmwCp009NetRate(q.stages[0].pipes),later=tmwCp009NetRate(q.stages[1].pipes),need=subtract(targetLevel(question),q.initialLevel),allLater=multiply(later,q.requiredDeadline);
  const difference=absR(subtract(allLater,need)),rateGap=absR(subtract(first,later)),newSwitch=divide(difference,rateGap),adjustment=absR(subtract(q.adjustmentBaseDuration,newSwitch));
  const relation=compare(allLater,need)>=0?t(language,["too much by","अधिक है","ਵੱਧ ਹੈ"]):t(language,["too little by","कम है","ਘੱਟ ਹੈ"]);
  const direction=q.adjustmentDirection==="LATER"?t(language,["later","बाद","ਬਾਅਦ"]):t(language,["earlier","पहले","ਪਹਿਲਾਂ"]);
  return [
    `${t(language,["Required tank-level change by the deadline","समय-सीमा तक आवश्यक टंकी-स्तर परिवर्तन","ਸਮਾਂ-ਸੀਮਾ ਤੱਕ ਲੋੜੀਂਦਾ ਟੈਂਕੀ-ਪੱਧਰ ਬਦਲਾਅ"])}: ${math(toLatex(need))}${stop(language)}`,
    `${t(language,["If the later-stage rate ran for the whole deadline","यदि बाद वाली दर पूरी समय-सीमा चले","ਜੇ ਬਾਅਦਲੀ ਦਰ ਪੂਰੀ ਸਮਾਂ-ਸੀਮਾ ਚੱਲੇ"])}: ${math(`${toLatex(later)}\\times${toLatex(q.requiredDeadline)}=${toLatex(allLater)}`)}, ${t(language,["which is","जो लक्ष्य से","ਜੋ ਟੀਚੇ ਤੋਂ"])} ${relation} ${math(toLatex(difference))}${stop(language)}`,
    `${t(language,["Each hour shifted between the two rates changes the filled amount by","दोनों दरों के बीच हर एक घंटे के बदलाव से भरे भाग में अंतर","ਦੋਨਾਂ ਦਰਾਂ ਵਿਚਕਾਰ ਹਰ ਇੱਕ ਘੰਟੇ ਦੇ ਬਦਲਾਅ ਨਾਲ ਭਰੇ ਹਿੱਸੇ ਵਿੱਚ ਫਰਕ"])} ${math(toLatex(rateGap))}; ${t(language,["required first-stage duration","आवश्यक पहले चरण की अवधि","ਲੋੜੀਂਦੀ ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਮਿਆਦ"])} ${math(`${toLatex(difference)}\\div${toLatex(rateGap)}=${toLatex(newSwitch)}`)} ${unit(language,"hours")}${stop(language)}`,
    `${t(language,["Compared with the original switch time","मूल बदलाव समय की तुलना में","ਮੂਲ ਬਦਲਾਅ ਸਮੇਂ ਨਾਲ ਤੁਲਨਾ ਕਰਕੇ"])}: ${math(`${toLatex(q.adjustmentBaseDuration)}-${toLatex(newSwitch)}=${toLatex(adjustment)}`)} ${unit(language,"hours")} ${direction}${stop(language)}`,
  ];
}
function improvedWorking(question:Cp010Question,language:Cp010ReviewLanguage):string[]{
  const mode=question.solveMode??"";
  if(["findCompletionAfterDelayedActivation","findCompletionAfterDelayedDeactivation","findCompletionWithMultipleStaggeredEvents","findCompletionWithInterruptedFlow","findCompletionFromPartialLevelAndStages","findCompletionAfterThresholdSwitch"].includes(mode))return fullStageWorking(question,language);
  if(mode==="findCapacityFromStagedPhysicalFlows")return capacityWorking(question,language);
  if(["findCompletionWithAlternatingPipes","findCompletionWithPeriodicSchedule","findCompletionFromArbitraryCyclePhase","findFullCycleCountToBoundary","findTerminalActiveSegment","findBoundaryEventTimeUnderSchedule"].includes(mode))return cycleWorking(question,language);
  if(mode==="findScheduleAdjustmentForDeadline")return deadlineWorking(question,language);
  return buildCp010SemanticWorking(question,language);
}

export function finalizeTmwCp010CorpusCleanup<T extends Cp010Question>(question:T,language:Cp010ReviewLanguage):T{
  if((question.canonicalProblemId??question.cpId)!=="TMW-CP-010"||!question.learnerExplanation)return question;
  const working=improvedWorking(question,language);
  const answer=cleanAnswer(question.learnerExplanation.answer);
  const options=question.options?.map(cleanAnswer);
  const solution=question.solution?{...question.solution,answerText:cleanAnswer(question.solution.answerText)}:question.solution;
  const stem=cleanStem(question.stem??"",question.solveMode??"",language);
  const learner:TmwLearnerExplanationV2={...question.learnerExplanation,solution:[...working.slice(0,4),answer],answer};
  const explanation=question.explanation?{...question.explanation,opening:learner.method,formula:legacyFormula(language,question.solveMode??""),steps:working.slice(0,4),conclusion:answer}:question.explanation;
  const editorialErrors=validateTmwLearnerExplanationV2(learner);
  const learnerPresentation=[learner.method,...learner.solution,learner.answer].join(" ");
  const surface=[stem,...(options??[]),solution?.answerText,learnerPresentation].filter(Boolean).join(" ");
  const legacy=explanation?[explanation.opening,explanation.formula,...explanation.steps,explanation.conclusion].join(" "):"";
  if(!working.length)editorialErrors.push("No semantic worked solution rendered");
  if(solverTrace(learnerPresentation)||solverTrace(legacy))editorialErrors.push("Solver-style symbols or prose-in-MathJax remain");
  if(localizedProseInMath(surface)||localizedProseInMath(legacy))editorialErrors.push("Localized prose remains inside MathJax");
  const inherited=question.validation?.errors??[];
  const errors=[...inherited.filter(error=>!error.startsWith("CP010 corpus cleanup:")),...editorialErrors.map(error=>`CP010 corpus cleanup: ${error}`)];
  return{...question,stem,options,solution,learnerExplanation:learner,explanation,validation:{valid:errors.length===0,errors},publiclyPublishable:false}as T;
}
