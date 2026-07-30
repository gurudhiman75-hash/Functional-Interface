const TEMPORAL_OPENINGS = [
  "During review:",
  "Across stages:",
  "Over time:",
  "When scheduled:",
  "While operating:",
] as const;

const OBJECTIVE_OPENINGS = [
  "To solve:",
  "To determine:",
  "To compare:",
  "To analyse:",
  "To calculate:",
] as const;

function stableHash(value:string):number{
  let hash=2166136261;
  for(let index=0;index<value.length;index+=1){
    hash^=value.charCodeAt(index);
    hash=Math.imul(hash,16777619);
  }
  return hash>>>0;
}

function trailingOrdinal(seed:string):number|undefined{
  const match=seed.match(/(\d+)$/);
  return match?Number(match[1]):undefined;
}

function qlOrdinal(qlId:string):number{
  const match=qlId.match(/(\d+)$/);
  return match?Number(match[1]):stableHash(qlId);
}

export type TmwStemOpeningVariant="ORIGINAL"|"TEMPORAL_FIRST"|"OBJECTIVE_FIRST";

export function tmwStemOpeningVariant(qlId:string,seed:string):TmwStemOpeningVariant{
  const ordinal=trailingOrdinal(seed);
  const variant=(ordinal??stableHash(`${qlId}|${seed}`))%3;
  return variant===0?"ORIGINAL":variant===1?"TEMPORAL_FIRST":"OBJECTIVE_FIRST";
}

export function diversifyTmwEnglishStem(stem:string,qlId:string,seed:string):string{
  const clean=stem.trim();
  if(!clean)return clean;
  const ordinal=trailingOrdinal(seed);
  const rotation=Math.floor((ordinal??stableHash(seed))/3);
  const openingIndex=(qlOrdinal(qlId)+rotation)%TEMPORAL_OPENINGS.length;
  switch(tmwStemOpeningVariant(qlId,seed)){
    case "ORIGINAL":return clean;
    case "TEMPORAL_FIRST":return `${TEMPORAL_OPENINGS[openingIndex]} ${clean}`;
    case "OBJECTIVE_FIRST":return `${OBJECTIVE_OPENINGS[openingIndex]} ${clean}`;
  }
}
