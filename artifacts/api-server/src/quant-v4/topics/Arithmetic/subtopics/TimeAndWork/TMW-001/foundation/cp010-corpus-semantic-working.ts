import { add, divide, multiply, rational, subtract, toLatex } from "./rational";
import { tmwCp009NetRate } from "./cp009-core";
import { simulateTmwCp010Cycle, simulateTmwCp010Stages } from "./cp010-engine";
import type { TmwCp010Parameters, TmwCp010Solution } from "./cp010-types";
import type { Rational } from "./types";

export type Cp010ReviewLanguage = "en" | "hi" | "pa";
type Triplet = readonly [string, string, string];
export interface Cp010SemanticQuestion {
  solveMode?: string;
  parameters?: TmwCp010Parameters;
  solution?: TmwCp010Solution;
}

function t(language: Cp010ReviewLanguage, x: Triplet): string { return language === "hi" ? x[1] : language === "pa" ? x[2] : x[0]; }
function p(language: Cp010ReviewLanguage): string { return language === "en" ? "." : "।"; }
function m(x: string): string { return `\\(${x}\\)`; }
function absR(x: Rational): Rational { return rational(Math.abs(x.numerator), x.denominator); }
function sum(xs: Rational[]): Rational { return xs.reduce((a, b) => add(a, b), rational(0)); }
function target(q: TmwCp010Parameters): Rational { return q.targetLevel ?? (q.targetBoundary === "EMPTY" ? rational(0) : rational(1)); }
function u(language: Cp010ReviewLanguage, kind: "hours" | "tank/hour" | "litres"): string {
  if (kind === "hours") return t(language, ["hours", "घंटे", "ਘੰਟੇ"]);
  if (kind === "litres") return t(language, ["litres", "लीटर", "ਲੀਟਰ"]);
  return t(language, ["tank per hour", "टंकी प्रति घंटा", "ਟੈਂਕੀ ਪ੍ਰਤੀ ਘੰਟਾ"]);
}

function stageSteps(q: TmwCp010Parameters, language: Cp010ReviewLanguage): string[] {
  const stages = q.stages ?? [];
  if (!stages.length) return [];
  const result = simulateTmwCp010Stages(q);
  let level = q.initialLevel;
  let elapsed = rational(0);
  const out: string[] = [];
  for (let i = 0; i <= result.terminalIndex && i < stages.length; i += 1) {
    const stage = stages[i];
    const rate = tmwCp009NetRate(stage.pipes);
    if (i === result.terminalIndex) {
      const remaining = subtract(target(q), level);
      const needed = divide(remaining, rate);
      out.push(`${t(language,["Level still required","अभी बचा स्तर","ਹਾਲੇ ਲੋੜੀਂਦਾ ਪੱਧਰ"])}: ${m(toLatex(absR(remaining)))}${p(language)}`);
      out.push(`${t(language,["Time in the final stage","अंतिम चरण का समय","ਅੰਤਿਮ ਪੜਾਅ ਦਾ ਸਮਾਂ"])}: ${m(`${toLatex(absR(remaining))}\\div${toLatex(absR(rate))}=${toLatex(needed)}`)} ${u(language,"hours")}${p(language)}`);
      if (elapsed.numerator !== 0) out.push(`${t(language,["Total elapsed time","कुल बीता समय","ਕੁੱਲ ਬੀਤਿਆ ਸਮਾਂ"])}: ${m(`${toLatex(elapsed)}+${toLatex(needed)}=${toLatex(result.time)}`)} ${u(language,"hours")}${p(language)}`);
      break;
    }
    if (!stage.duration) continue;
    const change = multiply(rate, stage.duration);
    const next = add(level, change);
    out.push(`${t(language,["Stage","चरण","ਪੜਾਅ"])} ${i+1}: ${m(`${toLatex(rate)}\\times${toLatex(stage.duration)}=${toLatex(change)}`)}; ${t(language,["tank level becomes","टंकी का स्तर हो जाता है","ਟੈਂਕੀ ਦਾ ਪੱਧਰ ਹੋ ਜਾਂਦਾ ਹੈ"])} ${m(toLatex(next))}${p(language)}`);
    level = next;
    elapsed = add(elapsed, stage.duration);
  }
  return out.slice(-4);
}

function finalLevelSteps(q: TmwCp010Parameters, language: Cp010ReviewLanguage): string[] {
  let level = q.initialLevel;
  const out: string[] = [];
  for (let i = 0; i < (q.stages ?? []).length; i += 1) {
    const stage = q.stages![i];
    if (!stage.duration) continue;
    const rate = tmwCp009NetRate(stage.pipes);
    const change = multiply(rate, stage.duration);
    level = add(level, change);
    out.push(`${t(language,["Stage","चरण","ਪੜਾਅ"])} ${i+1}: ${m(`${toLatex(rate)}\\times${toLatex(stage.duration)}=${toLatex(change)}`)}; ${t(language,["new level","नया स्तर","ਨਵਾਂ ਪੱਧਰ"])} ${m(toLatex(level))}${p(language)}`);
  }
  return out.slice(-4);
}

function inverseEvent(q:TmwCp010Parameters,s:TmwCp010Solution,language:Cp010ReviewLanguage):string[]{
  const stages=q.stages??[]; if(stages.length<2||!q.knownCompletionTime)return[];
  const a=tmwCp009NetRate(stages[0].pipes), b=tmwCp009NetRate(stages[1].pipes);
  const need=subtract(target(q),q.initialLevel), base=multiply(b,q.knownCompletionTime), extra=subtract(need,base), gap=subtract(a,b), event=s.answerValues[0];
  return [
    `${t(language,["Required tank-level change","आवश्यक टंकी-स्तर परिवर्तन","ਲੋੜੀਂਦਾ ਟੈਂਕੀ-ਪੱਧਰ ਬਦਲਾਅ"])}: ${m(toLatex(need))}${p(language)}`,
    `${t(language,["Change from the later-stage rate over the whole known time","बाद वाले चरण की दर से पूरे ज्ञात समय का परिवर्तन","ਬਾਅਦਲੇ ਪੜਾਅ ਦੀ ਦਰ ਨਾਲ ਪੂਰੇ ਪਤਾ ਸਮੇਂ ਦਾ ਬਦਲਾਅ"])}: ${m(`${toLatex(b)}\\times${toLatex(q.knownCompletionTime)}=${toLatex(base)}`)}${p(language)}`,
    `${t(language,["Extra change per earlier-stage hour","पहले चरण के प्रति घंटे अतिरिक्त परिवर्तन","ਪਹਿਲੇ ਪੜਾਅ ਦੇ ਪ੍ਰਤੀ ਘੰਟਾ ਵਾਧੂ ਬਦਲਾਅ"])}: ${m(`${toLatex(a)}-${toLatex(b)}=${toLatex(gap)}`)}${p(language)}`,
    `${t(language,["Event time","घटना का समय","ਘਟਨਾ ਦਾ ਸਮਾਂ"])}: ${m(`${toLatex(extra)}\\div${toLatex(gap)}=${toLatex(event)}`)} ${u(language,"hours")}${p(language)}`,
  ];
}

function finalRate(q:TmwCp010Parameters,s:TmwCp010Solution,language:Cp010ReviewLanguage):string[]{
  const stages=q.stages??[]; if(stages.length<2||!stages[0].duration||!q.knownCompletionTime)return[];
  const rate=tmwCp009NetRate(stages[0].pipes), first=multiply(rate,stages[0].duration), remain=subtract(subtract(target(q),q.initialLevel),first), time=subtract(q.knownCompletionTime,stages[0].duration);
  return [
    `${t(language,["Work completed in the first stage","पहले चरण में भरा भाग","ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਭਰਿਆ ਹਿੱਸਾ"])}: ${m(`${toLatex(rate)}\\times${toLatex(stages[0].duration)}=${toLatex(first)}`)}${p(language)}`,
    `${t(language,["Tank part still to fill","अभी भरना बाकी टंकी-भाग","ਹਾਲੇ ਭਰਨਾ ਬਾਕੀ ਟੈਂਕੀ-ਹਿੱਸਾ"])}: ${m(toLatex(remain))}; ${t(language,["time remaining","बचा समय","ਬਾਕੀ ਸਮਾਂ"])}: ${m(toLatex(time))} ${u(language,"hours")}${p(language)}`,
    `${t(language,["Required final filling rate","आवश्यक अंतिम भराव दर","ਲੋੜੀਂਦੀ ਅੰਤਿਮ ਭਰਨ ਦਰ"])}: ${m(`${toLatex(remain)}\\div${toLatex(time)}=${toLatex(absR(s.answerValues[0]))}`)} ${u(language,"tank/hour")}${p(language)}`,
  ];
}

function capacity(q:TmwCp010Parameters,s:TmwCp010Solution,language:Cp010ReviewLanguage):string[]{
  const stages=q.physicalStages??[]; if(!stages.length)return[];
  const vols=stages.map(x=>multiply(x.netFlowLitresPerHour,x.duration)), total=sum(vols), fraction=q.capacityFraction??rational(1);
  const out=stages.map((x,i)=>`${t(language,["Volume in stage","चरण में आयतन","ਪੜਾਅ ਵਿੱਚ ਮਾਤਰਾ"])} ${i+1}: ${m(`${toLatex(x.netFlowLitresPerHour)}\\times${toLatex(x.duration)}=${toLatex(vols[i])}`)} ${u(language,"litres")}${p(language)}`);
  out.push(`${t(language,["Tank capacity","टंकी की क्षमता","ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ"])}: ${m(`${toLatex(total)}\\div${toLatex(fraction)}=${toLatex(s.answerValues[0])}`)} ${u(language,"litres")}${p(language)}`);
  return out.slice(-4);
}

function cycleExpression(q:TmwCp010Parameters):string{return(q.cycle??[]).map((seg,i)=>{const rate=tmwCp009NetRate(seg.pipes), sign=rate.numerator<0?"-":i===0?"":"+";return`${sign}${toLatex(absR(rate))}\\times${toLatex(seg.duration)}`;}).join("");}
function cycle(q:TmwCp010Parameters,s:TmwCp010Solution,mode:string,language:Cp010ReviewLanguage):string[]{
  if(!(q.cycle??[]).length)return[]; const result=simulateTmwCp010Cycle(q), changes=q.cycle!.map(seg=>multiply(tmwCp009NetRate(seg.pipes),seg.duration)), net=sum(changes), start=add(q.initialLevel,multiply(net,rational(result.fullCycles))), remain=absR(subtract(target(q),start)), label=q.cycle![result.terminalIndex]?.label??`segment ${result.terminalIndex+1}`;
  const out=[`${t(language,["Net change in one complete cycle","एक पूरे चक्र में शुद्ध परिवर्तन","ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਵਿੱਚ ਸ਼ੁੱਧ ਬਦਲਾਅ"])}: ${m(`${cycleExpression(q)}=${toLatex(net)}`)}${p(language)}`,`${t(language,["Safe complete cycles before the terminal cycle","अंतिम चक्र से पहले सुरक्षित पूरे चक्र","ਅੰਤਿਮ ਚੱਕਰ ਤੋਂ ਪਹਿਲਾਂ ਸੁਰੱਖਿਅਤ ਪੂਰੇ ਚੱਕਰ"])}: ${result.fullCycles}; ${t(language,["level still required","अभी बचा स्तर","ਹਾਲੇ ਲੋੜੀਂਦਾ ਪੱਧਰ"])}: ${m(toLatex(remain))}${p(language)}`];
  if(mode==="findFullCycleCountToBoundary")out.push(`${t(language,["Requested complete-cycle count","माँगी गई पूरे चक्रों की संख्या","ਮੰਗੀ ਗਈ ਪੂਰੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ"])}: ${s.answerValues[0].numerator}${p(language)}`);
  else if(mode==="findTerminalActiveSegment")out.push(`${t(language,["Boundary is first reached in","सीमा पहली बार इस खंड में पहुँचती है","ਹੱਦ ਪਹਿਲੀ ਵਾਰ ਇਸ ਹਿੱਸੇ ਵਿੱਚ ਪਹੁੰਚਦੀ ਹੈ"])}: ${label}${p(language)}`);
  else out.push(`${t(language,["Total time after checking the terminal cycle in order","अंतिम चक्र क्रम से जाँचने पर कुल समय","ਅੰਤਿਮ ਚੱਕਰ ਕ੍ਰਮ ਨਾਲ ਜਾਂਚਣ ਉੱਤੇ ਕੁੱਲ ਸਮਾਂ"])}: ${m(toLatex(result.time))} ${u(language,"hours")}${p(language)}`);
  return out;
}

function controller(q:TmwCp010Parameters,s:TmwCp010Solution,language:Cp010ReviewLanguage):string[]{
  const c=q.levelControl;if(!c)return[];const span=subtract(c.upper,c.lower),down=absR(tmwCp009NetRate(c.offPipes)),up=absR(tmwCp009NetRate(c.onPipes)),td=divide(span,down),tu=divide(span,up),one=add(td,tu);
  return [`${t(language,["Upper-to-lower time","ऊपरी से निचले स्तर का समय","ਉੱਪਰਲੇ ਤੋਂ ਹੇਠਲੇ ਪੱਧਰ ਦਾ ਸਮਾਂ"])}: ${m(`${toLatex(span)}\\div${toLatex(down)}=${toLatex(td)}`)} ${u(language,"hours")}${p(language)}`,`${t(language,["Lower-to-upper return time","निचले से ऊपरी स्तर की वापसी का समय","ਹੇਠਲੇ ਤੋਂ ਉੱਪਰਲੇ ਪੱਧਰ ਦੀ ਵਾਪਸੀ ਦਾ ਸਮਾਂ"])}: ${m(`${toLatex(span)}\\div${toLatex(up)}=${toLatex(tu)}`)} ${u(language,"hours")}${p(language)}`,`${t(language,["One control cycle","एक नियंत्रण चक्र","ਇੱਕ ਕੰਟਰੋਲ ਚੱਕਰ"])}: ${m(`${toLatex(td)}+${toLatex(tu)}=${toLatex(one)}`)} ${u(language,"hours")}${p(language)}`,`${t(language,["Time for the required returns","माँगी गई वापसी तक कुल समय","ਮੰਗੀਆਂ ਵਾਪਸੀਆਂ ਤੱਕ ਕੁੱਲ ਸਮਾਂ"])}: ${m(`${c.targetUpperHits}\\times${toLatex(one)}=${toLatex(s.answerValues[0])}`)} ${u(language,"hours")}${p(language)}`];
}

function deadline(q:TmwCp010Parameters,s:TmwCp010Solution,language:Cp010ReviewLanguage):string[]{
  const stages=q.stages??[];if(stages.length<2||!q.requiredDeadline||!q.adjustmentBaseDuration)return[];const a=tmwCp009NetRate(stages[0].pipes),b=tmwCp009NetRate(stages[1].pipes),need=subtract(target(q),q.initialLevel),base=multiply(b,q.requiredDeadline),extra=subtract(need,base),gap=subtract(a,b),newSwitch=divide(extra,gap);
  return [`${t(language,["Required tank-level change","आवश्यक टंकी-स्तर परिवर्तन","ਲੋੜੀਂਦਾ ਟੈਂਕੀ-ਪੱਧਰ ਬਦਲਾਅ"])}: ${m(toLatex(need))}${p(language)}`,`${t(language,["Change from the later-stage rate over the whole deadline","बाद वाले चरण की दर से पूरी समय-सीमा का परिवर्तन","ਬਾਅਦਲੇ ਪੜਾਅ ਦੀ ਦਰ ਨਾਲ ਪੂਰੀ ਸਮਾਂ-ਸੀਮਾ ਦਾ ਬਦਲਾਅ"])}: ${m(`${toLatex(b)}\\times${toLatex(q.requiredDeadline)}=${toLatex(base)}`)}${p(language)}`,`${t(language,["Required new switch time","आवश्यक नया स्विच समय","ਲੋੜੀਂਦਾ ਨਵਾਂ ਸਵਿੱਚ ਸਮਾਂ"])}: ${m(`${toLatex(extra)}\\div${toLatex(gap)}=${toLatex(newSwitch)}`)} ${u(language,"hours")}${p(language)}`,`${t(language,["Adjustment from the original switch time","मूल स्विच समय से बदलाव","ਮੂਲ ਸਵਿੱਚ ਸਮੇਂ ਤੋਂ ਬਦਲਾਅ"])}: ${m(`${toLatex(q.adjustmentBaseDuration)}-${toLatex(newSwitch)}=${toLatex(absR(s.answerValues[0]))}`)} ${u(language,"hours")}${p(language)}`];
}

export function buildCp010SemanticWorking(question:Cp010SemanticQuestion,language:Cp010ReviewLanguage):string[]{
  const q=question.parameters,s=question.solution;if(!q||!s)return[];switch(question.solveMode){
    case"findCompletionAfterDelayedActivation":case"findCompletionAfterDelayedDeactivation":case"findCompletionWithMultipleStaggeredEvents":case"findCompletionWithInterruptedFlow":case"findCompletionFromPartialLevelAndStages":case"findCompletionAfterThresholdSwitch":return stageSteps(q,language);
    case"findFinalLevelAfterStagedSchedule":return finalLevelSteps(q,language);
    case"findEventTimeFromKnownCompletion":return inverseEvent(q,s,language);
    case"findRequiredFinalStageRate":return finalRate(q,s,language);
    case"findCapacityFromStagedPhysicalFlows":return capacity(q,s,language);
    case"findCompletionWithAlternatingPipes":case"findCompletionWithPeriodicSchedule":case"findCompletionFromArbitraryCyclePhase":case"findFullCycleCountToBoundary":case"findTerminalActiveSegment":case"findBoundaryEventTimeUnderSchedule":return cycle(q,s,question.solveMode??"",language);
    case"findAutomaticLevelControlCompletion":return controller(q,s,language);
    case"findScheduleAdjustmentForDeadline":return deadline(q,s,language);
    default:return[];
  }}
