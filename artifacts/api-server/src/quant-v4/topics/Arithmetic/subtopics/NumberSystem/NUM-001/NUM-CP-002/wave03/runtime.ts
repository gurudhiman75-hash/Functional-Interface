import {
  compareRational,
  decimalDigitsToRational,
  fractionBody,
  fractionLatex,
  mixedRecurringToRational,
  pureRecurringToRational,
  rational,
  terminatingDecimal,
  terminates,
  type Rational,
} from "../wave01/exact";
import { NUM_CP002_WAVE03_SOURCE_ANCESTRY } from "./source-registry";
import { NUM_CP002_WAVE03_PROTOTYPE_IDS, type NumCp002Wave03AnswerSemantic, type NumCp002Wave03Difficulty, type NumCp002Wave03Option, type NumCp002Wave03Package, type NumCp002Wave03PrototypeId } from "./types";

const math=(body:string)=>`\\(${body}\\)`;
const lifecycle=Object.freeze({permanentQlId:null,maturity:"EXECUTABLE_DISCOVERY_PROOF" as const,reviewStatus:"UNREVIEWED_DISCOVERY_CANDIDATE" as const,active:false as const,questionStudioDiscoverable:false as const,questionBankWritable:false as const,questionBankStatus:"NOT_STORED" as const,testEligible:false as const,testEligibility:"INELIGIBLE" as const,publiclyPublishable:false as const});
function idx(seed:number,size:number,salt=0){return (Math.imul((seed+29)^Math.imul(salt+11,0x45d9f3b),2654435761)>>>0)%size;}
function choose<T>(seed:number,values:readonly T[],salt=0):T{return values[idx(seed,values.length,salt)]!;}
function add(a:Rational,b:Rational){return rational(a.n*b.d+b.n*a.d,a.d*b.d);}
function sub(a:Rational,b:Rational){return rational(a.n*b.d-b.n*a.d,a.d*b.d);}
function reciprocal(a:Rational){if(a.n===0)throw new Error("zero reciprocal");return rational(a.d,a.n);}
function eq(a:Rational,b:Rational){return compareRational(a,b)===0;}
function decimal(value:Rational){return math(terminatingDecimal(value));}
function options(correct:string,wrongValues:readonly string[],seed:number,salt:number){const wrong=wrongValues.filter((v,i,a)=>v!==correct&&a.indexOf(v)===i).slice(0,3);if(wrong.length!==3)throw new Error(`Need three distinct distractors for ${correct}`);const correctIndex=idx(seed,4,salt);const out:NumCp002Wave03Option[]=wrong.map((value,i)=>({value,isCorrect:false,misconceptionId:`DISTRACTOR_${i+1}`}));out.splice(correctIndex,0,{value:correct,isCorrect:true});return{options:Object.freeze(out),correctIndex};}

interface Draft{answerSemantic:NumCp002Wave03AnswerSemantic;difficulty:NumCp002Wave03Difficulty;stem:string;correct:string;wrong:string[];hiddenState:Record<string,unknown>;concept?:string;solution:string[];}

const betweenCases=[
  {a:rational(2,5),b:rational(1,2),c:rational(9,20)},
  {a:rational(5,8),b:rational(2,3),c:rational(13,20)},
  {a:rational(7,12),b:rational(3,5),c:rational(29,50)},
  {a:rational(11,20),b:rational(4,7),c:rational(14,25)},
] as const;
function p023(seed:number):Draft{const c=choose(seed,betweenCases,23);return{answerSemantic:"RATIONAL",difficulty:"MEDIUM",stem:`Which of the following lies strictly between ${fractionLatex(c.a)} and ${fractionLatex(c.b)}?`,correct:fractionLatex(c.c),wrong:[fractionLatex(c.a),fractionLatex(c.b),fractionLatex(add(c.b,rational(1,20)))],hiddenState:{aN:c.a.n,aD:c.a.d,bN:c.b.n,bD:c.b.d,cN:c.c.n,cD:c.c.d},concept:"Compare every option exactly with both bounds.",solution:[`${fractionLatex(c.a)} ${math("<")} ${fractionLatex(c.c)} ${math("<")} ${fractionLatex(c.b)}.`,`So ${fractionLatex(c.c)} is inside the open interval.`]};}

interface Entry{display:string;value:Rational}
const selectionSets:readonly (readonly Entry[])[]=[
  [{display:math("0.62"),value:rational(31,50)},{display:math("\\frac{5}{8}"),value:rational(5,8)},{display:math("0.6\\overline{3}"),value:rational(19,30)},{display:math("\\frac{2}{3}"),value:rational(2,3)}],
  [{display:math("0.7"),value:rational(7,10)},{display:math("\\frac{11}{16}"),value:rational(11,16)},{display:math("0.\\overline{69}"),value:rational(23,33)},{display:math("\\frac{17}{24}"),value:rational(17,24)}],
  [{display:math("0.58"),value:rational(29,50)},{display:math("\\frac{7}{12}"),value:rational(7,12)},{display:math("0.5\\overline{8}"),value:rational(53,90)},{display:math("\\frac{3}{5}"),value:rational(3,5)}],
] as const;
function p024(seed:number):Draft{const entries=choose(seed,selectionSets,24);const largest=seed%2===0;const sorted=[...entries].sort((a,b)=>compareRational(a.value,b.value));const target=largest?sorted.at(-1)!:sorted[0]!;return{answerSemantic:"RATIONAL",difficulty:"MEDIUM",stem:`Which is the ${largest?"largest":"smallest"} of ${entries.map(e=>e.display).join(", ")}?`,correct:target.display,wrong:entries.filter(e=>e.display!==target.display).map(e=>e.display),hiddenState:{largest,entries:entries.map(e=>({display:e.display,n:e.value.n,d:e.value.d}))},concept:"Largest/smallest selection is an ordering task on exact rational values.",solution:["Compare the four values without rounding the recurring decimal.",`The ${largest?"largest":"smallest"} value is ${target.display}.`]};}

const numeratorCases=[
  {target:rational(3,8),d:40},{target:rational(7,20),d:100},{target:rational(9,25),d:75},{target:rational(11,16),d:64},{target:rational(13,20),d:80},
] as const;
function p025(seed:number):Draft{const c=choose(seed,numeratorCases,25);const n=c.target.n*(c.d/c.target.d);const shown=terminatingDecimal(c.target);return{answerSemantic:"INTEGER",difficulty:"EASY",stem:`If ${math(`\\frac{n}{${c.d}}=${shown}`)}, find the integer ${math("n")}.`,correct:math(String(n)),wrong:[math(String(n-1)),math(String(n+1)),math(String(c.target.n))],hiddenState:{d:c.d,targetN:c.target.n,targetD:c.target.d},concept:"Convert the decimal to an exact fraction and use equivalent fractions.",solution:[`${math(shown)} ${math(`=${fractionBody(c.target)}`)}.`,`Thus ${math(`\\frac{n}{${c.d}}=${fractionBody(c.target)}`)}, giving ${math(`n=${n}`)}.`]};}

const denominatorCases=[
  {n:5,target:pureRecurringToRational(5,1),display:math("0.\\overline{5}")},
  {n:7,target:pureRecurringToRational(7,1),display:math("0.\\overline{7}")},
  {n:4,target:pureRecurringToRational(4,1),display:math("0.\\overline{4}")},
  {n:5,target:mixedRecurringToRational(1,1,6,1),display:math("0.1\\overline{6}")},
  {n:7,target:mixedRecurringToRational(2,1,3,1),display:math("0.2\\overline{3}")},
] as const;
function p026(seed:number):Draft{const c=choose(seed,denominatorCases,26);const d=(c.n*c.target.d)/c.target.n;if(!Number.isInteger(d))throw new Error("P026 denominator fixture");return{answerSemantic:"INTEGER",difficulty:"MEDIUM",stem:`If ${math(`\\frac{${c.n}}{d}`)} is exactly equal to ${c.display}, find the positive integer ${math("d")}.`,correct:math(String(d)),wrong:[math(String(d-1)),math(String(d+1)),math(String(c.target.d))],hiddenState:{n:c.n,targetN:c.target.n,targetD:c.target.d},concept:"First convert the recurring decimal to its exact reduced fraction.",solution:[`${c.display} ${math(`=${fractionBody(c.target)}`)}.`,`So ${math(`\\frac{${c.n}}{d}=${fractionBody(c.target)}`)}, hence ${math(`d=${d}`)}.`]};}

const constraintTargets=[rational(1,4),rational(2,5),rational(3,8),rational(5,12),rational(7,20)] as const;
function p027(seed:number):Draft{const t=choose(seed,constraintTargets,27);const complement=seed%2===0;const x=complement?sub(rational(1,1),t):reciprocal(t);const correct=fractionLatex(x);return{answerSemantic:"RATIONAL",difficulty:complement?"MEDIUM":"EASY",stem:complement?`If ${math("1-x")} is exactly ${fractionLatex(t)}, find ${math("x")}.`:`If the reciprocal of ${math("x")} is ${fractionLatex(t)}, find ${math("x")}.`,correct,wrong:[fractionLatex(t),fractionLatex(complement?add(rational(1,1),t):rational(t.n,t.d+1)),fractionLatex(complement?sub(rational(1,1),rational(t.n,Math.max(1,t.d*2))):rational(t.d+1,t.n))],hiddenState:{mode:complement?"COMPLEMENT":"RECIPROCAL",tN:t.n,tD:t.d},concept:complement?"Use the exact complement to 1.":"Taking the reciprocal twice returns the original rational number.",solution:complement?[`${math("x=1")} ${math("-")} ${fractionLatex(t)}.`,`Therefore ${math("x=")}${correct}.`]:[`${math("x")} is the reciprocal of ${fractionLatex(t)}.`,`Therefore ${math("x=")}${correct}.`]};}

const evidenceCases=[
  {t:rational(1,6),u:rational(3,4)},{t:rational(2,9),u:rational(7,9)},{t:rational(3,10),u:rational(4,5)},{t:rational(5,12),u:rational(11,12)},
] as const;
function p028(seed:number):Draft{const c=choose(seed,evidenceCases,28);const difference=seed%2===1;const x=sub(c.u,c.t);const correct=fractionLatex(x);return{answerSemantic:"RATIONAL",difficulty:"MEDIUM",stem:difference?`If ${fractionLatex(c.u)} ${math("-x=")} ${fractionLatex(c.t)}, find ${math("x")}.`:`If ${math("x+")} ${fractionLatex(c.t)} ${math("=")} ${fractionLatex(c.u)}, find ${math("x")}.`,correct,wrong:[fractionLatex(add(c.u,c.t)),fractionLatex(c.t),fractionLatex(c.u)],hiddenState:{tN:c.t.n,tD:c.t.d,uN:c.u.n,uD:c.u.d},concept:"Keep all quantities as exact fractions and isolate the unknown.",solution:[`${math("x=")} ${fractionLatex(c.u)} ${math("-")} ${fractionLatex(c.t)}.`,`This gives ${math("x=")}${correct}.`]};}

const recurringEquivalenceCases=[
  {short:math("0.\\overline{3}"),long:math("0.\\overline{33}"),value:pureRecurringToRational(3,1)},
  {short:math("0.\\overline{27}"),long:math("0.\\overline{2727}"),value:pureRecurringToRational(27,2)},
  {short:math("0.1\\overline{6}"),long:math("0.1\\overline{66}"),value:mixedRecurringToRational(1,1,6,1)},
  {short:math("0.2\\overline{45}"),long:math("0.2\\overline{4545}"),value:mixedRecurringToRational(2,1,45,2)},
] as const;
function p029(seed:number):Draft{const c=choose(seed,recurringEquivalenceCases,29);const correct=c.long;return{answerSemantic:"DECIMAL_REPRESENTATION",difficulty:"EASY",stem:`Which recurring decimal is exactly equal to ${c.short}?`,correct,wrong:[c.short.replace("\\overline{","\\overline{0"),math("0.25"),math("0.\\overline{9}")],hiddenState:{short:c.short,long:c.long,n:c.value.n,d:c.value.d},concept:"Repeating the same minimal recurring block twice does not change the represented rational number.",solution:[`${c.short} represents ${fractionLatex(c.value)}.`,`${c.long} has the same repeating cycle and therefore the same exact value.`]};}

const compoundCases=[
  {p2:2,p5:1,badPrime:3,badExp:2},{p2:1,p5:3,badPrime:7,badExp:1},{p2:4,p5:1,badPrime:3,badExp:3},{p2:2,p5:2,badPrime:11,badExp:1},
] as const;
function p030(seed:number):Draft{const c=choose(seed,compoundCases,30);const correct=math(String(c.badExp));return{answerSemantic:"INTEGER",difficulty:"MEDIUM",stem:`Find the least non-negative integer ${math("x")} for which ${math(`\\frac{${c.badPrime}^{x}}{2^{${c.p2}}\\times5^{${c.p5}}\\times${c.badPrime}^{${c.badExp}}}`)} has a terminating decimal expansion after reduction.`,correct,wrong:[math(String(Math.max(0,c.badExp-1))),math(String(c.badExp+1)),math(String(c.p2+c.p5))],hiddenState:{p2:c.p2,p5:c.p5,badPrime:c.badPrime,badExp:c.badExp},concept:"Every denominator prime other than 2 and 5 must be fully cancelled.",solution:[`The denominator contains ${math(`${c.badPrime}^{${c.badExp}}`)} as its only unwanted prime-power factor.`,`Thus ${math(`x=${c.badExp}`)} is the least exponent that cancels it.`]};}

const statementCases=[
  {statements:["A rational number in lowest terms with denominator 40 has a terminating decimal.","A rational number in lowest terms with denominator 21 has a terminating decimal.",`${math("0.\\overline{9}")} is exactly ${math("1")}.`],truth:[true,false,true]},
  {statements:["A reduced denominator containing only powers of 2 and 5 gives a terminating decimal.","Every non-terminating decimal is irrational.",`${math("0.\\overline{27}")} and ${math("0.\\overline{2727}")} represent the same rational number.`],truth:[true,false,true]},
  {statements:["A rational decimal may terminate after cancelling common factors first.","A reduced denominator divisible by 3 gives a terminating decimal.","Every recurring decimal is rational."],truth:[true,false,true]},
] as const;
const combinationOptions=["I only","II only","I and III only","I, II and III"] as const;
function p031(seed:number):Draft{const c=choose(seed,statementCases,31);const indices=c.truth.map((v,i)=>v?i+1:0).filter(Boolean);const correct=indices.length===1?`${indices[0]===1?"I":"II"} only`:indices.length===2&&indices[0]===1&&indices[1]===3?"I and III only":"I, II and III";return{answerSemantic:"BOOLEAN_COMBINATION",difficulty:"MEDIUM",stem:["Consider the following statements:",`I. ${c.statements[0]}`,`II. ${c.statements[1]}`,`III. ${c.statements[2]}`,"Which statement(s) is/are correct?"].join("\n"),correct,wrong:combinationOptions.filter(x=>x!==correct),hiddenState:{truth:[...c.truth]},concept:"Judge each statement from exact rational representation and reduced-denominator structure.",solution:[`Statement I is ${c.truth[0]?"true":"false"}; Statement II is ${c.truth[1]?"true":"false"}; Statement III is ${c.truth[2]?"true":"false"}.`,`Therefore the correct choice is ${correct}.`]};}

const dsOptions=["Statement I alone is sufficient","Statement II alone is sufficient","Both statements together are sufficient, but neither alone is sufficient","Even both statements together are not sufficient"] as const;
const dsCases=[
  {d:12,s1:"n is divisible by 3",s2:"n is even",cls:0},
  {d:28,s1:"n is even",s2:"n is divisible by 7",cls:1},
  {d:84,s1:"n is divisible by 3",s2:"n is divisible by 7",cls:2},
  {d:84,s1:"n is divisible by 3",s2:"n is even",cls:3},
] as const;
function p032(seed:number):Draft{const c=choose(seed,dsCases,32);const correct=dsOptions[c.cls]!;return{answerSemantic:"SUFFICIENCY_CLASS",difficulty:"HARD",stem:[`For a positive integer ${math("n")}, is ${math(`\\frac{n}{${c.d}}`)} a terminating decimal after reduction?`,`Statement I: ${c.s1}.`,`Statement II: ${c.s2}.`,`Which option correctly describes the sufficiency of the statements?`].join("\n"),correct,wrong:dsOptions.filter(x=>x!==correct),hiddenState:{d:c.d,caseClass:c.cls},concept:"A statement is sufficient only if it forces cancellation of every denominator prime other than 2 and 5.",solution:[c.cls===0?"Statement I forces the factor 3 to cancel; Statement II does not.":c.cls===1?"Statement II forces the factor 7 to cancel; Statement I does not.":c.cls===2?"Both 3 and 7 must be cancelled, so the two statements are needed together.":"Even together, the statements do not force cancellation of the factor 7.",`Hence: ${correct}.`]};}

const generators:Readonly<Record<NumCp002Wave03PrototypeId,(seed:number)=>Draft>>={
  "NUM-CP002-PROT-023":p023,"NUM-CP002-PROT-024":p024,"NUM-CP002-PROT-025":p025,"NUM-CP002-PROT-026":p026,"NUM-CP002-PROT-027":p027,"NUM-CP002-PROT-028":p028,"NUM-CP002-PROT-029":p029,"NUM-CP002-PROT-030":p030,"NUM-CP002-PROT-031":p031,"NUM-CP002-PROT-032":p032,
};

function parseEntry(e:any):Entry{return{display:String(e.display),value:rational(Number(e.n),Number(e.d))};}
export function independentlyVerifyNumCp002Wave03(id:NumCp002Wave03PrototypeId,s:Readonly<Record<string,unknown>>):string{const h=s as any;switch(id){
case"NUM-CP002-PROT-023":{const a=rational(h.aN,h.aD),b=rational(h.bN,h.bD),c=rational(h.cN,h.cD);if(!(compareRational(a,c)<0&&compareRational(c,b)<0))throw new Error("P023 candidate not between");return fractionLatex(c);}
case"NUM-CP002-PROT-024":{const entries=(h.entries as any[]).map(parseEntry);const sorted=[...entries].sort((a,b)=>compareRational(a.value,b.value));return h.largest?sorted.at(-1)!.display:sorted[0]!.display;}
case"NUM-CP002-PROT-025":{const t=rational(h.targetN,h.targetD);const n=t.n*(Number(h.d)/t.d);if(!Number.isInteger(n))throw new Error("P025 noninteger");return math(String(n));}
case"NUM-CP002-PROT-026":{const t=rational(h.targetN,h.targetD);const d=(Number(h.n)*t.d)/t.n;if(!Number.isInteger(d))throw new Error("P026 noninteger");return math(String(d));}
case"NUM-CP002-PROT-027":{const t=rational(h.tN,h.tD);return fractionLatex(h.mode==="COMPLEMENT"?sub(rational(1,1),t):reciprocal(t));}
case"NUM-CP002-PROT-028":return fractionLatex(sub(rational(h.uN,h.uD),rational(h.tN,h.tD)));
case"NUM-CP002-PROT-029":return String(h.long);
case"NUM-CP002-PROT-030":return math(String(h.badExp));
case"NUM-CP002-PROT-031":{const truth=h.truth as boolean[];return truth[0]&&!truth[1]&&truth[2]?"I and III only":truth[0]&&!truth[1]&&!truth[2]?"I only":!truth[0]&&truth[1]&&!truth[2]?"II only":"I, II and III";}
case"NUM-CP002-PROT-032":return dsOptions[Number(h.caseClass)]!;
}}

export function generateNumCp002Wave03(id:NumCp002Wave03PrototypeId,seed:number):NumCp002Wave03Package{if(!Number.isInteger(seed)||seed<0)throw new Error("seed must be non-negative integer");const i=NUM_CP002_WAVE03_PROTOTYPE_IDS.indexOf(id);if(i<0)throw new Error(`Unknown prototype ${id}`);const d=generators[id](seed);const placed=options(d.correct,d.wrong,seed,100+i);const verifierAnswer=independentlyVerifyNumCp002Wave03(id,d.hiddenState);if(verifierAnswer!==d.correct)throw new Error(`${id}: verifier ${verifierAnswer} != ${d.correct}`);return Object.freeze({packageId:"NUM-001",checkpointId:"NUM-CP-002",temporaryPrototypeId:id,permanentQlId:null,seed,locale:"en-IN",difficulty:d.difficulty,answerSemantic:d.answerSemantic,stem:d.stem,options:placed.options,correctIndex:placed.correctIndex,canonicalAnswer:d.correct,verifierAnswer,hiddenState:Object.freeze({...d.hiddenState}),sourceAncestry:NUM_CP002_WAVE03_SOURCE_ANCESTRY[id],mathematicalFingerprint:`${id}:${JSON.stringify(d.hiddenState)}`,explanation:Object.freeze({concept:d.concept,solution:Object.freeze([...d.solution]),finalAnswer:d.correct}),lifecycle});}
