import type { GeneratedOptions, GeneratedParameters, ProbabilityAnswer, ProbabilityTaskRegistryEntry, SolvedProbability } from "./types";
import { combinationCount, permutationCount } from "./combinatorial-counter";
import { answerText, complementRational, isProbability, rational, rationalText } from "./rational";
import { seededRandom, shuffleRandom } from "./random";

type Candidate={text:string;label:string};
export function generateProbabilityOptions(entry:ProbabilityTaskRegistryEntry,parameters:GeneratedParameters,solved:SolvedProbability,seed:string):GeneratedOptions{
  const correct=answerText(solved.answer),candidates:Candidate[]=[];
  const add=(answer:ProbabilityAnswer,label:string)=>{const text=answerText(answer);if(text!==correct&&!candidates.some((item)=>item.text===text))candidates.push({text,label});};
  if(solved.answer.kind==="COUNT"){
    const value=solved.answer.exact;add({kind:"COUNT",exact:value+1n},"OFF_BY_ONE_HIGH");if(value>1n)add({kind:"COUNT",exact:value-1n},"OFF_BY_ONE_LOW");add({kind:"COUNT",exact:value*2n},"DOUBLE_COUNT");if(solved.evidence.totalOutcomeCount!==undefined)add({kind:"COUNT",exact:solved.evidence.totalOutcomeCount},"USED_TOTAL_INSTEAD_OF_FAVOURABLE");
  }else if(solved.answer.kind==="PROBABILITY"){
    const exact=solved.answer.exact;
    const addRat=(n:bigint|number,d:bigint|number,label:string)=>{const value=rational(n,d);if(isProbability(value))add({kind:"PROBABILITY",exact:value,preferredDisplay:"FRACTION"},label);};
    add({kind:"PROBABILITY",exact:complementRational(exact),preferredDisplay:"FRACTION"},"COMPLEMENT_CONFUSION");
    if(solved.evidence.totalOutcomeCount!==undefined&&solved.evidence.favourableOutcomeCount!==undefined){const t=solved.evidence.totalOutcomeCount,f=solved.evidence.favourableOutcomeCount;addRat(f+1n,t,"ONE_EXTRA_FAVOURABLE");if(f>0n)addRat(f,t+1n,"ONE_EXTRA_TOTAL");if(t>1n)addRat(f,t-1n,"DENOMINATOR_OFF_BY_ONE");}
    for(const strategy of entry.distractorStrategyIds){
      if(strategy==="FORGET_COMPLEMENT")add({kind:"PROBABILITY",exact:complementRational(exact),preferredDisplay:"FRACTION"},strategy);
      else if(strategy==="COUNT_EXACTLY_ONE_ONLY"&&typeof parameters.trials==="number"){const total=2n**BigInt(parameters.trials);addRat(combinationCount(parameters.trials,1),total,strategy);}
      else if(strategy==="KEEP_DENOMINATOR_UNCHANGED"&&typeof parameters.red==="number"&&typeof parameters.blue==="number"){const n=parameters.red+parameters.blue;addRat(BigInt(parameters.red*parameters.red),BigInt(n*n),strategy);}
      else if(strategy==="FAIL_SUBTRACT_OVERLAP"&&typeof parameters.aCount==="number"&&typeof parameters.bCount==="number"&&typeof parameters.total==="number")addRat(parameters.aCount+parameters.bCount,parameters.total,strategy);
      else if(strategy==="USE_ORIGINAL_TOTAL"&&solved.evidence.favourableOutcomeCount!==undefined){const original=typeof parameters.upper==="number"?parameters.upper:typeof parameters.red==="number"&&typeof parameters.blue==="number"?parameters.red+parameters.blue:undefined;if(original)addRat(solved.evidence.favourableOutcomeCount,original,strategy);}
      else if(strategy==="DECK_FACT_TRAP"&&solved.evidence.favourableOutcomeCount!==undefined)addRat(solved.evidence.favourableOutcomeCount+1n,52n,strategy);
      else if(strategy==="PERMUTATION_DENOMINATOR"&&typeof parameters.men==="number"&&typeof parameters.women==="number"&&typeof parameters.committeeSize==="number"&&solved.evidence.favourableOutcomeCount!==undefined){addRat(solved.evidence.favourableOutcomeCount,permutationCount(parameters.men+parameters.women,parameters.committeeSize),strategy);}
      else if(strategy==="ENDPOINT_OFF_BY_ONE"&&solved.evidence.favourableOutcomeCount!==undefined&&solved.evidence.totalOutcomeCount!==undefined)addRat(solved.evidence.favourableOutcomeCount,solved.evidence.totalOutcomeCount+1n,strategy);
      else if(strategy==="ADD_INSTEAD_OF_MULTIPLY"&&typeof parameters.aNumerator==="number"&&typeof parameters.bNumerator==="number"){const a=rational(parameters.aNumerator,parameters.aDenominator as number),b=rational(parameters.bNumerator,parameters.bDenominator as number);addRat(a.numerator*b.denominator+b.numerator*a.denominator,a.denominator*b.denominator,strategy);}
    }
    for(let denominator=2;denominator<=24&&candidates.length<6;denominator++)for(let numerator=1;numerator<denominator&&candidates.length<6;numerator++)addRat(numerator,denominator,"NEARBY_VALID_PROBABILITY");
  }
  for(const strategy of entry.distractorStrategyIds){
    if(candidates.some((item)=>item.label===strategy))continue;
    if(solved.answer.kind==="COUNT"){
      const base=solved.answer.exact;for(const value of [base+2n,base>2n?base-2n:base+3n,base*3n]){const text=value.toString();if(text!==correct&&!candidates.some((item)=>item.text===text)){candidates.push({text,label:strategy});break;}}
    }else if(solved.answer.kind==="PROBABILITY"){
      outer:for(let denominator=2;denominator<=32;denominator++)for(let numerator=1;numerator<denominator;numerator++){const text=rationalText(rational(numerator,denominator));if(text!==correct&&!candidates.some((item)=>item.text===text)){candidates.push({text,label:strategy});break outer;}}
    }
  }
  if(candidates.length<3)throw new Error(`Unable to construct three distractors for ${entry.qlId}: ${correct}`);
  const prioritized:Candidate[]=[];
  for(const strategy of entry.distractorStrategyIds){const found=candidates.find((item)=>item.label===strategy&&!prioritized.some((chosen)=>chosen.text===item.text));if(found)prioritized.push(found);}
  for(const candidate of candidates){if(prioritized.length>=3)break;if(!prioritized.some((chosen)=>chosen.text===candidate.text))prioritized.push(candidate);}
  const selected:Candidate[]=[{text:correct,label:"CORRECT"},...prioritized.slice(0,3)];const shuffled=shuffleRandom(seededRandom(`${seed}:${entry.qlId}:options`),selected);
  return{options:shuffled.map((item)=>item.text),correctIndex:shuffled.findIndex((item)=>item.label==="CORRECT"),labels:shuffled.map((item)=>item.label)};
}
