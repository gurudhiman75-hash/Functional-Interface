import {localizeSourceReview} from './source-localization-review';
import {digitWorkings} from './digit-workings';
import {digitSourceCases,digitSourceAnswer} from './digit-source-cases';
import {countConstrainedDigits} from './constrained-digits';
import {extendedSourceCases} from './extended-source-cases';
import {workedSourceCases} from './worked-source-cases';
export interface SourceCatalogueRow {id:string;group:string;language:string;stem:string;answer:string;explanation:string[];options:string[];correctIndex:number;difficulty:string;assumptions?:string;exactIntegerAnswer?:string}
let cached:SourceCatalogueRow[]|undefined;
function numericOptions(answer:string,index:number):{options:string[];correctIndex:number} {
 if(/^\d+$/.test(answer)){const value=BigInt(answer),step=value>20n?value/7n:1n;const candidates=new Set([answer]);for(const n of [value+step,value>step?value-step:value+2n*step,value*2n+1n,value+3n*step,value+4n*step])if(n>=0)candidates.add(String(n));const options=[...candidates].slice(0,4),correctIndex=index%4;[options[0],options[correctIndex]]=[options[correctIndex],options[0]];return {options,correctIndex};}
 const wrong:Record<string,string[]>={'2:9':['9:2','2:3','3:2'],'76:105':['105:76','76:181','105:181'],'977.9%':['9.8%','97.8%','1770.0%'],'Impossible':['Always possible','Possible only for even party sizes','Possible only for odd party sizes'],'Cannot be determined':['Always 15','Always 16','Always 10'],'35; 120':['45; 120','35; 90','45; 90'],'30; 78':['30; 136','221; 78','17; 13'],'20; 0':['18; 0','20; 2','18; 2']};
 const distractors=wrong[answer];if(!distractors)throw Error(`Missing nonnumeric options: ${answer}`);const options=[answer,...distractors],correctIndex=index%4;[options[0],options[correctIndex]]=[options[correctIndex],options[0]];return {options,correctIndex};
}
export function completeSourceCatalogue():SourceCatalogueRow[] {
 if(!cached){
 const items:{id:string;stem:string;answer:string;explanation:string[];assumptions?:string}[]=digitSourceCases.map(c=>{
  const answer=String(digitSourceAnswer(c));let explanation:string[]=[];
  if(c.id==='II-034')explanation=['All-odd choices: 5^6=15625. All-even choices: four nonzero first digits and five choices thereafter, 4×5^5=12500. The disjoint cases sum to 28125.'];
  else if(c.id==='II-035')explanation=['All six-digit integers: 9×10^5=900000. All-odd integers: 5^6=15625. Subtract: 900000−15625=884375.'];
  else if(c.id==='II-036')explanation=['All ten-digit integers: 9×10^9=9000000000. Distinct-digit integers: 9×9!=3265920. Subtract: 8996734080.'];
  else {
   const terms:string[]=[];let check=0n;
   for(let n=c.input.minLength;n<=c.input.maxLength;n++){
    const value=countConstrainedDigits({...c.input,minLength:n,maxLength:n});if(value===0n)continue;
    const branches=c.input.digits.map(d=>({digit:d,count:countConstrainedDigits({...c.input,minLength:n,maxLength:n,fixed:{...c.input.fixed,0:d}})})).filter(b=>b.count>0n);
    // Do not override an existing fixed first digit when splitting cases.
    const valid=c.input.fixed?.[0]===undefined?branches:branches.filter(b=>b.digit===c.input.fixed![0]);
    const subtotal=valid.reduce((v,b)=>v+b.count,0n);if(subtotal!==value)throw Error(`Digit partition failed ${c.id}`);
    explanation.push(`${n}-digit cases, split by the first digit: ${valid.map(b=>`${b.digit} → ${b.count}`).join('; ')}. Subtotal = ${value}.`);check+=value;terms.push(String(value));
   }
   if(check!==BigInt(answer))throw Error(`Digit sum failed ${c.id}`);
   explanation.push(`The length cases and first-digit cases are disjoint. Total = ${terms.join(' + ')} = ${answer}.`);
   if(c.input.exact)explanation.unshift(`Keep exactly ${c.input.exact.count} occurrence(s) of ${c.input.exact.digit}; reject a branch as soon as it exceeds this count.`);
   if(c.input.modulus)explanation.unshift(`As a digit d is appended to a prefix with remainder r, the new remainder is (10r+d) mod ${c.input.modulus}. Keep final remainder ${c.input.residue??0}.`);
   if(c.input.distinct)explanation.unshift(`Retain only strings using between ${c.input.distinct.min} and ${c.input.distinct.max} distinct digit values.`);
  }
  if(!digitWorkings[c.id])throw Error(`Missing worked digit reasoning ${c.id}`);
  explanation.unshift(digitWorkings[c.id]);
  explanation.unshift(c.input.code?'Count fixed-width codes; initial zero is permitted unless a fixed prefix excludes it.':'Count positive integers; initial zero is excluded.');
  if(c.interpretation)explanation.push(`Convention: ${c.interpretation}`);
  explanation.push(`Answer: ${answer}.`);return {id:c.id,stem:c.stem,answer,explanation,assumptions:c.interpretation};
 });
 for(const c of [...extendedSourceCases,...workedSourceCases])items.push({id:c.id,stem:c.stem,answer:c.answer,explanation:[c.working,...(c.assumptions?[`Convention: ${c.assumptions}`]:[]),`Answer: ${c.answer}.`],assumptions:c.assumptions});
 const symbolic:Record<string,string[]>={
 'II-013':['99!','99!/2','2×99!','100!'],
 'III-010':['36×24!','18×24!','2×24!','26!'],
 'III-011':['2×18!','18!','19!','2×19!'],
 'III-045':['100!/2','100!','99!','99!/2'],
 'III-049':['62!/[20!×(12!)²×(5!)³]','62!/[20!×12!×5!]','62!','62!/[20!×12!]']};
 cached=items.map((original,index)=>{
 const values=symbolic[original.id];const exactIntegerAnswer=/^\d+$/.test(original.answer)?original.answer:undefined;
 const c=values?{...original,answer:values[0],explanation:original.explanation.map(line=>line===`Answer: ${original.answer}.`?`Answer: ${values[0]}.`:line)}:original;
 let optionBundle:ReturnType<typeof numericOptions>;if(values){const options=[...values],correctIndex=index%4;[options[0],options[correctIndex]]=[options[correctIndex],options[0]];optionBundle={options,correctIndex};}else optionBundle=numericOptions(c.answer,index);
 return {...c,exactIntegerAnswer,...optionBundle,language:'en',group:c.id.startsWith('WORKED')?'PNC-SOURCE-WORKED':'PNC-SOURCE-EXERCISES',difficulty:c.id.startsWith('I-')?'Easy':c.id.startsWith('II-')?'Medium':'Hard'};});
 }
 return cached.flatMap(q=>[{...q,options:[...q.options],explanation:[...q.explanation]},localizeSourceReview(q,'hi'),localizeSourceReview(q,'pa')]);
}
