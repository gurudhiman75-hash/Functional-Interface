import assert from "node:assert/strict";
import {
  SAP_CP006_CATALOGUE,
  SAP_CP006_PROTOTYPE_IDS,
  generateSapCp006Sweep,
  type SapCp006Oracle,
  type SapCp006Option,
} from "./runtime";

interface Rational { n: bigint; d: bigint; }

function gcd(a: bigint,b: bigint):bigint {
  let x=a<0n?-a:a, y=b<0n?-b:b;
  while(y!==0n) [x,y]=[y,x%y];
  return x||1n;
}
function rat(n:bigint|number,d:bigint|number=1n):Rational {
  let numerator=BigInt(n), denominator=BigInt(d);
  assert.notEqual(denominator,0n);
  if(denominator<0n){numerator=-numerator;denominator=-denominator;}
  const divisor=gcd(numerator,denominator);
  return {n:numerator/divisor,d:denominator/divisor};
}
function add(a:Rational,b:Rational):Rational{return rat(a.n*b.d+b.n*a.d,a.d*b.d);}
function sub(a:Rational,b:Rational):Rational{return rat(a.n*b.d-b.n*a.d,a.d*b.d);}
function mul(a:Rational,b:Rational):Rational{return rat(a.n*b.n,a.d*b.d);}
function div(a:Rational,b:Rational):Rational{assert.notEqual(b.n,0n);return rat(a.n*b.d,a.d*b.n);}
function cmp(a:Rational,b:Rational):number{const v=a.n*b.d-b.n*a.d;return v<0n?-1:v>0n?1:0;}
function format(v:Rational):string{return v.d===1n?v.n.toString():`${v.n}/${v.d}`;}
function percent(v:number):Rational{return rat(v,100);}
function factorial(n:number):bigint{let result=1n;for(let i=2;i<=n;i+=1)result*=BigInt(i);return result;}
function pow(base:number,exponent:number):bigint{return BigInt(base)**BigInt(exponent);}

function parseNumeric(text:string):Rational|null {
  if(/^\d+\/\d+$/.test(text)){
    const [n,d]=text.split("/");
    return rat(BigInt(n!),BigInt(d!));
  }
  if(/^\d+$/.test(text)) return rat(BigInt(text));
  if(/^\d+\.\d+$/.test(text)){
    const [whole,fraction]=text.split(".");
    const scale=10**fraction!.length;
    return rat(BigInt(whole!)*BigInt(scale)+BigInt(fraction!),BigInt(scale));
  }
  return null;
}

function exactAnswer(oracle:SapCp006Oracle):string {
  const d=oracle.data;
  switch(oracle.kind){
    case "SAP-CP006-PROT-MISSING-MIXED-ADDEND":
      return String(d.x!);
    case "SAP-CP006-PROT-MISSING-MIXED-FACTOR":
      return String(d.x!);
    case "SAP-CP006-PROT-MISSING-MIXED-DIVISOR":
      return String(d.x!);
    case "SAP-CP006-PROT-MISSING-BRACKET-VALUE":
      return format(rat(d.m!,d.n!));
    case "SAP-CP006-PROT-MISSING-DECIMAL-MIXED": {
      const whole=Math.floor(d.hundredths!/100), fraction=String(d.hundredths!%100).padStart(2,"0");
      return `${whole}.${fraction}`;
    }
    case "SAP-CP006-PROT-COMPOSED-POWER-MISSING":
      return String(d.exponent!);
    case "SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS": {
      const left=add(rat(d.a!,d.b!),percent(d.p!));
      const right=add(rat(d.a!,d.b!),rat(d.rightHundredths!,100));
      return cmp(left,right)>0?"A > B":cmp(left,right)<0?"A < B":"A = B";
    }
    case "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS": {
      const values:{label:string;value:number}[]=[
        {label:"A",value:d.aVal!},{label:"B",value:d.bVal!},{label:"C",value:d.cVal!},{label:"D",value:d.dVal!},
      ];
      values.sort((x,y)=>x.value-y.value);
      return values.map((item)=>item.label).join(" < ");
    }
    case "SAP-CP006-PROT-EQUIVALENT-EXPRESSION":
      return `${d.numerator!}/${d.denominator!}`;
    case "SAP-CP006-PROT-CORRECT-SIMPLIFICATION-STATEMENT":
      return `${d.a!}/${d.b!} + ${d.p!}% = ${d.numerator!}/${d.denominator!}`;
    case "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION":
      return String(d.x!);
    case "SAP-CP006-PROT-STATEMENT-COMBINATION": {
      const s1=d.statement1True===1, s2=d.statement2True===1;
      return s1&&s2?"Both I and II":s1?"Only I":s2?"Only II":"Neither I nor II";
    }
  }
}

function countSubstitutionMatches(oracle:SapCp006Oracle,options:readonly SapCp006Option[]):number {
  const d=oracle.data;
  switch(oracle.kind){
    case "SAP-CP006-PROT-MISSING-MIXED-ADDEND": {
      const target=add(add(rat(d.x!),rat(d.a!,d.b!)),percent(d.p!));
      return options.filter((option)=>{
        const x=parseNumeric(option.value); if(!x)return false;
        return cmp(add(add(x,rat(d.a!,d.b!)),percent(d.p!)),target)===0;
      }).length;
    }
    case "SAP-CP006-PROT-MISSING-MIXED-FACTOR": {
      const target=add(mul(rat(d.x!),rat(d.a!,d.b!)),percent(d.p!));
      return options.filter((option)=>{
        const x=parseNumeric(option.value); if(!x)return false;
        return cmp(add(mul(x,rat(d.a!,d.b!)),percent(d.p!)),target)===0;
      }).length;
    }
    case "SAP-CP006-PROT-MISSING-MIXED-DIVISOR": {
      const target=add(div(rat(d.a!,d.b!),rat(d.x!)),percent(d.p!));
      return options.filter((option)=>{
        const x=parseNumeric(option.value); if(!x||x.n===0n)return false;
        return cmp(add(div(rat(d.a!,d.b!),x),percent(d.p!)),target)===0;
      }).length;
    }
    case "SAP-CP006-PROT-MISSING-BRACKET-VALUE": {
      const target=mul(add(rat(d.m!,d.n!),percent(d.p!)),rat(d.c!));
      return options.filter((option)=>{
        const x=parseNumeric(option.value); if(!x)return false;
        return cmp(mul(add(x,percent(d.p!)),rat(d.c!)),target)===0;
      }).length;
    }
    case "SAP-CP006-PROT-MISSING-DECIMAL-MIXED": {
      const value=rat(d.hundredths!,100);
      const target=add(add(value,rat(d.a!,d.b!)),percent(d.p!));
      return options.filter((option)=>{
        const x=parseNumeric(option.value); if(!x)return false;
        return cmp(add(add(x,rat(d.a!,d.b!)),percent(d.p!)),target)===0;
      }).length;
    }
    case "SAP-CP006-PROT-COMPOSED-POWER-MISSING": {
      const target=add(add(rat(factorial(d.factN!)),rat(pow(d.base!,d.exponent!))),rat(d.a!,d.b!));
      return options.filter((option)=>{
        if(!/^\d+$/.test(option.value))return false;
        const exponent=Number(option.value);
        const candidate=add(add(rat(factorial(d.factN!)),rat(pow(d.base!,exponent))),rat(d.a!,d.b!));
        return cmp(candidate,target)===0;
      }).length;
    }
    case "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION": {
      const target=add(mul(rat(d.x!),rat(d.a!,d.b!)),percent(d.p!));
      return options.filter((option)=>{
        const x=parseNumeric(option.value); if(!x)return false;
        return cmp(add(mul(x,rat(d.a!,d.b!)),percent(d.p!)),target)===0;
      }).length;
    }
    default:
      return 1;
  }
}

function equivalentOptionMatches(oracle:SapCp006Oracle,options:readonly SapCp006Option[]):number {
  const d=oracle.data;
  const target=add(rat(d.a!,d.b!),percent(d.p!));
  return options.filter((option)=>{
    const value=parseNumeric(option.value); return value ? cmp(value,target)===0 : false;
  }).length;
}

function statementOptionMatches(oracle:SapCp006Oracle,options:readonly SapCp006Option[]):number {
  const d=oracle.data;
  const target=add(rat(d.a!,d.b!),percent(d.p!));
  return options.filter((option)=>{
    const rhs=option.value.split(" = ")[1];
    if(!rhs)return false;
    const value=parseNumeric(rhs); return value ? cmp(value,target)===0 : false;
  }).length;
}

assert.equal(SAP_CP006_PROTOTYPE_IDS.length,12);
assert.equal(SAP_CP006_CATALOGUE.length,12);
assert.deepEqual(
  SAP_CP006_CATALOGUE.map((item)=>item.proposedPermanentQlId),
  Array.from({length:12},(_,index)=>`SAP-QL-${String(92+index).padStart(3,"0")}`),
);

const sweep=generateSapCp006Sweep(100);
assert.equal(sweep.length,1200);
const identities=new Set<string>();
const payloadsByPrototype=new Map<string,Set<string>>();
const counts=new Map<string,number>();
const directions=new Set<string>();
const difficulties=new Set<string>();
const answerSets=new Map<string,Set<string>>();

for(const pkg of sweep){
  assert.equal(pkg.validation.ok,true,`${pkg.prototypeId}/${pkg.seed}: ${pkg.validation.errors.join("; ")}`);
  assert.equal(exactAnswer(pkg.oracle),pkg.canonicalAnswer,`${pkg.prototypeId}/${pkg.seed}: independent answer mismatch.`);
  assert.equal(pkg.options.length,4);
  assert.equal(new Set(pkg.options.map((option)=>option.value)).size,4);
  assert.equal(pkg.options.filter((option)=>option.isCorrect).length,1);
  assert.equal(pkg.options[pkg.correctIndex]?.value,pkg.canonicalAnswer);
  assert.ok(pkg.options.filter((option)=>!option.isCorrect).every((option)=>Boolean(option.misconceptionId)&&option.analysis.length>=45));
  assert.ok(pkg.explanation.coreConcept.length>=100);
  assert.ok(pkg.explanation.steps.length>=2);
  assert.ok(pkg.explanation.verification.length>=2);
  assert.ok(pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer));
  assert.equal(pkg.lifecycle.permanentQlId,null);
  assert.equal(pkg.lifecycle.active,false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable,false);
  assert.equal(pkg.lifecycle.questionBankWritable,false);
  assert.equal(pkg.lifecycle.testEligible,false);
  assert.equal(pkg.lifecycle.publiclyPublishable,false);
  assert.ok(!identities.has(pkg.generationIdentity),`${pkg.prototypeId}/${pkg.seed}: repeated generation identity.`);
  identities.add(pkg.generationIdentity);

  if([
    "SAP-CP006-PROT-MISSING-MIXED-ADDEND",
    "SAP-CP006-PROT-MISSING-MIXED-FACTOR",
    "SAP-CP006-PROT-MISSING-MIXED-DIVISOR",
    "SAP-CP006-PROT-MISSING-BRACKET-VALUE",
    "SAP-CP006-PROT-MISSING-DECIMAL-MIXED",
    "SAP-CP006-PROT-COMPOSED-POWER-MISSING",
    "SAP-CP006-PROT-CANDIDATE-SUBSTITUTION",
  ].includes(pkg.prototypeId)){
    assert.equal(countSubstitutionMatches(pkg.oracle,pkg.options),1,`${pkg.prototypeId}/${pkg.seed}: substitution did not identify exactly one option.`);
  }
  if(pkg.prototypeId==="SAP-CP006-PROT-EQUIVALENT-EXPRESSION"){
    assert.equal(equivalentOptionMatches(pkg.oracle,pkg.options),1,`${pkg.seed}: more than one equivalent expression option.`);
  }
  if(pkg.prototypeId==="SAP-CP006-PROT-CORRECT-SIMPLIFICATION-STATEMENT"){
    assert.equal(statementOptionMatches(pkg.oracle,pkg.options),1,`${pkg.seed}: more than one exact simplification statement.`);
  }

  const payloads=payloadsByPrototype.get(pkg.prototypeId)??new Set<string>();
  payloads.add(pkg.canonicalPayloadKey); payloadsByPrototype.set(pkg.prototypeId,payloads);
  counts.set(pkg.prototypeId,(counts.get(pkg.prototypeId)??0)+1);
  directions.add(pkg.taskDirection); difficulties.add(pkg.difficulty);
  const answers=answerSets.get(pkg.prototypeId)??new Set<string>(); answers.add(pkg.canonicalAnswer); answerSets.set(pkg.prototypeId,answers);
}

assert.equal(identities.size,1200);
for(const prototypeId of SAP_CP006_PROTOTYPE_IDS){
  assert.equal(counts.get(prototypeId),100);
  assert.ok((payloadsByPrototype.get(prototypeId)?.size??0)>=8,`${prototypeId}: variable pool collapsed.`);
}
assert.deepEqual([...directions].sort(),["COMPARISON","INVERSE","ORDERING","SYNTHESIS","VERIFICATION"]);
assert.deepEqual([...difficulties].sort(),["HARD","MEDIUM"]);
assert.ok((answerSets.get("SAP-CP006-PROT-COMPARE-EXACT-EXPRESSIONS")?.size??0)>=3,"Comparison mode must exercise <, = and >.");
assert.ok((answerSets.get("SAP-CP006-PROT-STATEMENT-COMBINATION")?.size??0)>=4,"Statement mode must exercise all four truth combinations.");

console.log("SAP-CP-006 foundation authority passed: 1200 deterministic cases across 12 exact synthesis modes with independent substitution/evaluation proof.");
