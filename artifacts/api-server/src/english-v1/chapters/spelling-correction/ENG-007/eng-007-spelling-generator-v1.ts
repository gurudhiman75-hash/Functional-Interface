import{deterministicIndex}from"../../../core/deterministic";

export type Eng007SharedDifficulty="easy"|"medium"|"hard";
export type Eng007SharedMode="correct-spelling"|"misspelt-word";
export interface Eng007SharedEntry{
  id:string;correct:string;misspelling:string;difficulty:Eng007SharedDifficulty;domain:string;sourceRef:string;trap:string;
}
export interface GenerateEng007SharedInput{seed:string;difficulty:Eng007SharedDifficulty;mode?:Eng007SharedMode;entryId?:string;}
export interface Eng007SharedQuestion{
  questionId:string;stem:string;options:readonly string[];correctOptionIndex:number;explanation:string;
  metadata:{chapterId:"ENG-007";cpId:string;difficulty:Eng007SharedDifficulty;mode:Eng007SharedMode;entryId:string;correctSpelling:string;misspelling:string;domain:string;trap:string;sourceRef:string;seed:string;reviewOnly:true};
}

function hash(v:string){let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function pickEntry(entries:readonly Eng007SharedEntry[],input:GenerateEng007SharedInput){
  if(input.entryId){
    const e=entries.find(x=>x.id===input.entryId);
    if(!e)throw new Error("Unknown ENG-007 entry");
    if(e.difficulty!==input.difficulty)throw new Error("ENG-007 difficulty mismatch");
    return e;
  }
  const pool=entries.filter(x=>x.difficulty===input.difficulty);
  if(!pool.length)throw new Error("ENG-007 difficulty pool is empty");
  return pool[deterministicIndex(`${input.seed}:entry`,pool.length)]!;
}
function pickMode(input:GenerateEng007SharedInput):Eng007SharedMode{
  return input.mode??(deterministicIndex(`${input.seed}:mode`,2)===0?"correct-spelling":"misspelt-word");
}
function distractors(entries:readonly Eng007SharedEntry[],target:Eng007SharedEntry,seed:string){
  const pool=entries.filter(x=>x.id!==target.id&&x.difficulty===target.difficulty);
  pool.sort((a,b)=>
    (a.domain===target.domain?0:1)-(b.domain===target.domain?0:1)||
    (a.trap===target.trap?0:1)-(b.trap===target.trap?0:1)||
    Math.abs(a.correct.length-target.correct.length)-Math.abs(b.correct.length-target.correct.length)||
    a.id.localeCompare(b.id)
  );
  const shortlist=pool.slice(0,Math.min(36,pool.length));
  for(let i=shortlist.length-1;i>0;i--){
    const j=deterministicIndex(`${seed}:shuffle:${i}`,i+1);
    [shortlist[i],shortlist[j]]=[shortlist[j]!,shortlist[i]!];
  }
  return shortlist.slice(0,3);
}
function spellingVariants(entries:readonly Eng007SharedEntry[],target:Eng007SharedEntry,seed:string){
  const w=target.correct.toLowerCase(),out:string[]=[];
  for(let i=0;i<w.length-1;i++)if(w[i]===w[i+1])out.push(w.slice(0,i)+w.slice(i+1));
  for(const [a,b] of [["ie","ei"],["ei","ie"],["ance","ence"],["ence","ance"],["able","ible"],["ible","able"],["ant","ent"],["ent","ant"],["ary","ery"],["ery","ary"],["tion","sion"],["sion","tion"]]as const){
    const i=w.indexOf(a);if(i>0)out.push(w.slice(0,i)+b+w.slice(i+a.length));
  }
  for(let i=2;i<w.length-2;i++){
    const ch=w[i]!;
    if(/[bcdfghjklmnpqrstvwxyz]/.test(ch)&&ch!==w[i-1]&&ch!==w[i+1])out.push(w.slice(0,i)+ch+w.slice(i));
  }
  for(let i=2;i<w.length-2;i++)if(w[i]!==w[i+1])out.push(w.slice(0,i)+w[i+1]+w[i]+w.slice(i+2));
  for(let i=2;i<w.length-2;i++)if(/[aeiou]/.test(w[i]!))out.push(w.slice(0,i)+w.slice(i+1));
  const canonical=new Set(entries.map(x=>x.correct.toLowerCase()));
  const primary=target.misspelling.toLowerCase();
  const extras=[...new Set(out)].filter(x=>x!==w&&x!==primary&&!canonical.has(x));
  for(let i=extras.length-1;i>0;i--){
    const j=deterministicIndex(`${seed}:variant:${i}`,i+1);
    [extras[i],extras[j]]=[extras[j]!,extras[i]!];
  }
  const variants=[primary,...extras.slice(0,2)];
  if(variants.length<3)throw new Error("ENG-007 requires three same-word spelling variants");
  return variants;
}
function trapAdvice(trap:string){
  switch(trap){
    case"omitted-letter":return"One letter has been omitted in the incorrect form.";
    case"extra-letter":return"The incorrect form contains an extra letter.";
    case"letter-order":return"Two letters are in the wrong order in the incorrect form.";
    case"vowel-sequence":return"Pay attention to the vowel sequence.";
    case"double-letter":return"Pay attention to the doubled-letter pattern.";
    case"ending-pattern":return"Pay attention to the standard word ending.";
    default:return"Compare the internal letter pattern carefully.";
  }
}
function explain(e:Eng007SharedEntry,m:Eng007SharedMode){
  return m==="correct-spelling"
    ?`“${e.correct}” is correctly spelt. “${e.misspelling}” is incorrect. ${trapAdvice(e.trap)}`
    :`“${e.misspelling}” is misspelt. The correct spelling is “${e.correct}”. ${trapAdvice(e.trap)}`;
}

export function buildEng007SpellingQuestionV1(cpId:string,entries:readonly Eng007SharedEntry[],input:GenerateEng007SharedInput):Eng007SharedQuestion{
  const e=pickEntry(entries,input),m=pickMode(input),other=distractors(entries,e,input.seed);
  if(other.length<3)throw new Error("ENG-007 requires at least three distractors");
  const answer=m==="correct-spelling"?e.correct:e.misspelling;
  const wrong=m==="correct-spelling"?spellingVariants(entries,e,input.seed):other.map(x=>x.correct);
  const ci=hash(`${input.seed}:position`)%4,options:string[]=[];let wi=0;
  for(let i=0;i<4;i++)options.push(i===ci?answer:wrong[wi++]!);
  const stems=m==="correct-spelling"
    ?["Select the correctly spelt word.","Choose the word that is spelt correctly.","Identify the correctly spelt word."]
    :["Select the incorrectly spelt word.","Identify the misspelt word.","Choose the word that is spelt incorrectly."];
  return{
    questionId:`${cpId}-${e.id}-${hash(input.seed).toString(16)}`,
    stem:stems[deterministicIndex(`${input.seed}:stem`,stems.length)]!,
    options,correctOptionIndex:ci,explanation:explain(e,m),
    metadata:{chapterId:"ENG-007",cpId,difficulty:e.difficulty,mode:m,entryId:e.id,correctSpelling:e.correct,misspelling:e.misspelling,domain:e.domain,trap:e.trap,sourceRef:e.sourceRef,seed:input.seed,reviewOnly:true}
  };
}
