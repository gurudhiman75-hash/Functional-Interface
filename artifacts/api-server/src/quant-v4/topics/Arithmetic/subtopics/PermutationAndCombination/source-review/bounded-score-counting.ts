export interface ScoreInput {capacities:number[];target:number;condition:"exactly"|"atLeast";}
function validate(p:ScoreInput):void {
 if(p.capacities.length<2||p.capacities.length>4||p.capacities.some(c=>!Number.isInteger(c)||c<1||c>100)||!Number.isInteger(p.target)||p.target<0||p.target>p.capacities.reduce((a,b)=>a+b,0)||!["exactly","atLeast"].includes(p.condition))throw Error("Invalid bounded integer score domain");
}
export function solveBoundedScore(p:ScoreInput) {
 validate(p);let counts=[1];const stages:{paper:number;maximum:number;targetWays:number}[]=[];
 for(const [i,capacity]of p.capacities.entries()) {
  const next=Array(counts.length+capacity).fill(0);
  for(let total=0;total<counts.length;total++)for(let score=0;score<=capacity;score++)next[total+score]+=counts[total];
  counts=next;stages.push({paper:i+1,maximum:capacity,targetWays:counts[p.target]??0});
 }
 return {answer:p.condition==="exactly"?counts[p.target]:counts.slice(p.target).reduce((a,b)=>a+b,0),counts,stages};
}
/** Independently enumerates scores on all but the last paper; directly counts allowed final scores. */
export function verifyBoundedScore(p:ScoreInput):number {
 validate(p);let answer=0;
 function visit(i:number,total:number):void {
  if(i===p.capacities.length-1) {
   const required=p.target-total,cap=p.capacities[i];
   if(p.condition==="exactly"){if(required>=0&&required<=cap)answer++;}
   else answer+=Math.max(0,cap-Math.max(0,required)+1);
   return;
  }
  for(let score=0;score<=p.capacities[i];score++)visit(i+1,total+score);
 }
 visit(0,0);return answer;
}
function choose(n:number,r:number):number {if(n<r)return 0;let v=1;for(let i=1;i<=r;i++)v=v*(n-i+1)/i;return Math.round(v);}
export function buildBoundedScoreReview(p:ScoreInput) {
 const solved=solveBoundedScore(p),m=p.capacities.length;
 const limit=p.condition==='exactly'?p.target:p.capacities.reduce((a,b)=>a+b,0)-p.target;
 const r=p.condition==='exactly'?m-1:m;
 const terms:string[]=[];
 for(let mask=0;mask<2**m;mask++) {
  let shift=0,violations=0;
  for(let i=0;i<m;i++)if(mask&(1<<i)){shift+=p.capacities[i]+1;violations++;}
  if(limit<shift)continue;
  const value=choose(limit-shift+r,r);
  terms.push(`${violations%2?'−':'+'} C(${limit-shift+r}, ${r}) = ${violations%2?-value:value}`);
 }
 return {packageId:"PNC-SOURCE-BOUNDED-SCORE-REVIEW",stem:`An examination has ${m} papers with maximum marks ${p.capacities.join(', ')}, respectively. Marks are non-negative integers. In how many ways can a student score ${p.condition==='exactly'?'exactly':'at least'} ${p.target} marks in total?`,answer:String(solved.answer),explanation:[p.condition==='exactly'?`Count non-negative score combinations with total ${p.target}.`:`Write each score as its paper maximum minus a deficit. The total deficit must be at most ${limit}.`,`Without the paper limits, there are C(${limit+r}, ${r}) = ${choose(limit+r,r)} combinations.`,`Subtract cases exceeding a paper limit, restore cases exceeding two limits, and continue by inclusion–exclusion.`,...terms,`Adding these terms gives ${solved.answer} combinations.`],publiclyPublishable:false,reviewStatus:"REVIEW_REQUIRED",language:"en"};
}
