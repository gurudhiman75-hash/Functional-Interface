import {
  generateMenCp013Question,
  type MenCp013Question,
} from './discovery';

export const MEN_CP_013_DISCOVERY_PRESENTATION_V2_AUTHORITY =
  'MEN-CP013-DISCOVERY-PRESENTATION-V2' as const;

const LABELS = ['A','B','C','D'] as const;

function tidy(value:number){
  return Number.isInteger(value) ? `${value}` : value.toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
}

function normalizeCountGrammar(text:string){
  return text
    .replace(/\b1 spheres\b/g,'1 sphere')
    .replace(/\b1 cubes\b/g,'1 cube')
    .replace(/\b1 litres\b/g,'1 litre');
}

function numericCmAnswer(answer:string){
  const match=/^(\d+(?:\.\d+)?) cm$/.exec(answer);
  return match ? Number(match[1]) : null;
}

function rebuildNumericCmOptions(question:MenCp013Question){
  const value=numericCmAnswer(question.answer);
  if(value===null) return question.options;
  const candidates=[value/2,value*2,value+2,Math.max(0.5,value-2),value*3,value+5];
  const wrong=[...new Set(candidates.map(v=>`${tidy(v)} cm`).filter(v=>v!==question.answer))].slice(0,3);
  if(wrong.length!==3) return question.options;
  let wi=0;
  return LABELS.map((label,index)=>index===question.correctIndex
    ? {label,display:question.answer,isCorrect:true,misconception:null}
    : {label,display:wrong[wi++]!,isCorrect:false,misconception:`${question.id}-PRESENTATION-V2-M${wi}`});
}

function polishOptions(question:MenCp013Question){
  if(question.id==='CP013-W1-PARTIAL-FILL-FINAL-LEVEL' || question.id==='CP013-W2-DRAW-OFF-LEVEL-DROP'){
    return rebuildNumericCmOptions(question);
  }
  return question.options.map(option=>({
    ...option,
    display:normalizeCountGrammar(option.display),
  }));
}

function polishText(text:string){
  return normalizeCountGrammar(text)
    .replace(/edge of edge /g,'edge ')
    .replace(/17\.333333333333336 cm/g,'17.333 cm');
}

export type MenCp013PresentationV2Question = MenCp013Question & {
  readonly presentationAuthority: typeof MEN_CP_013_DISCOVERY_PRESENTATION_V2_AUTHORITY;
};

export function generateMenCp013QuestionV2(id:string,seed:string):MenCp013PresentationV2Question{
  const base=generateMenCp013Question(id,seed);
  const answer=polishText(base.answer);
  const options=polishOptions({...base,answer} as MenCp013Question).map(option=>({
    ...option,
    display:polishText(option.display),
  }));
  const result:MenCp013PresentationV2Question={
    ...base,
    stem:polishText(base.stem),
    answer,
    options,
    explanation:{
      ...base.explanation,
      steps:base.explanation.steps.map(step=>({...step,body:polishText(step.body)})),
      traps:base.explanation.traps.map(polishText),
    },
    presentationAuthority:MEN_CP_013_DISCOVERY_PRESENTATION_V2_AUTHORITY,
  };
  if(new Set(result.options.map(option=>option.display)).size!==4){
    throw new Error(`${id}/${seed}: presentation V2 duplicate options`);
  }
  if(result.options.filter(option=>option.isCorrect).length!==1 || result.options[result.correctIndex]?.display!==result.answer){
    throw new Error(`${id}/${seed}: presentation V2 answer parity failed`);
  }
  return result;
}
