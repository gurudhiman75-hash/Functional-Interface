import {
  generateMenCp013PermanentEnglishQuestionV3,
  generateMenCp013PermanentEnglishQuestionFromSourceV3,
  listMenCp013PermanentEnglishSources,
  type MenCp013PermanentEnglishQuestionV3,
} from './runtime-v3';
import type { MenCp013PermanentQlId } from './allocation';

export const MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V4_AUTHORITY =
  'MEN-CP013-PERMANENT-ENGLISH-RUNTIME-V4-EDITORIAL-FINAL' as const;

export type MenCp013PermanentEnglishQuestionV4=Omit<MenCp013PermanentEnglishQuestionV3,'authority'> & {
  readonly authority:typeof MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V4_AUTHORITY;
  readonly editorialSourceAuthority:MenCp013PermanentEnglishQuestionV3['authority'];
};

function normalizePi(text:string){
  return text.replace(/(\d+)\/(\d+)π/g,'($1π/$2)');
}

function directDisplacementTraps(sourceId:string):readonly [string,string]{
  if(sourceId==='CP013-W1-MULTI-SPHERE-LEVEL-RISE'||sourceId==='CP013-W3-SSC-MULTI-STONE-RISE'){
    return ['Level change = total displaced volume ÷ tank base area.','Add the volumes of all completely immersed objects before dividing by the base area.'];
  }
  if(sourceId==='CP013-W2-DRAW-OFF-LEVEL-DROP'){
    return ['Level fall = removed liquid volume ÷ tank base area.','Convert litres to cubic centimetres before dividing by the tank base area.'];
  }
  return ['For complete immersion, the displaced volume equals the immersed solid’s volume.','Use tank base area—not total surface area—when converting displaced volume to level rise.'];
}

function polish(q:MenCp013PermanentEnglishQuestionV3):MenCp013PermanentEnglishQuestionV4{
  const traps=q.clusterId==='DISPLACEMENT_LEVEL_CHANGE_DIRECT'
    ? directDisplacementTraps(q.sourceId)
    : q.explanation.traps;
  const result:MenCp013PermanentEnglishQuestionV4={
    ...q,
    authority:MEN_CP_013_PERMANENT_ENGLISH_RUNTIME_V4_AUTHORITY,
    editorialSourceAuthority:q.authority,
    stem:normalizePi(q.stem),
    answer:normalizePi(q.answer),
    options:q.options.map(option=>({...option,display:normalizePi(option.display)})),
    explanation:{
      ...q.explanation,
      keyRule:normalizePi(q.explanation.keyRule),
      steps:q.explanation.steps.map(step=>({...step,body:normalizePi(step.body)})),
      shortcut:normalizePi(q.explanation.shortcut),
      traps:traps.map(normalizePi),
    },
  };
  if(result.options.length!==4||new Set(result.options.map(option=>option.display)).size!==4)throw new Error(`${q.permanentQlId}/${q.seed}: V4 option contract failed`);
  if(result.options.filter(option=>option.isCorrect).length!==1||result.options[result.correctIndex]?.display!==result.answer)throw new Error(`${q.permanentQlId}/${q.seed}: V4 answer parity failed`);
  return result;
}

export function generateMenCp013PermanentEnglishQuestionV4(qlId:MenCp013PermanentQlId,seed:string){return polish(generateMenCp013PermanentEnglishQuestionV3(qlId,seed));}
export function generateMenCp013PermanentEnglishQuestionFromSourceV4(qlId:MenCp013PermanentQlId,sourceId:string,seed:string){return polish(generateMenCp013PermanentEnglishQuestionFromSourceV3(qlId,sourceId,seed));}
export { listMenCp013PermanentEnglishSources };
