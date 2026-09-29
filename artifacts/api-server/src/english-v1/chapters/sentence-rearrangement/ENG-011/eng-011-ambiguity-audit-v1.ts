import type{Eng011SetV1}from"./eng-011-authorities-v1";

const movable=/^(before|after|during|throughout|at |in |across|along|within|while |when |if |although |even |because |unless )/i;
const finite=/\b(is|are|was|were|be|been|being|has|have|had|does|do|did|can|could|may|might|must|should|would|will|helps?|keeps?|makes?|gives?|allows?|uses?|need|needs|improve|improves|reduce|reduces|review|reviews|compare|compares|protect|protects|maintain|maintains|monitor|monitors|assess|assesses|define|defines|examine|examines|update|updates|hold|holds)\b/i;

export type Eng011AmbiguityFlagV1={
 setId:string;
 risk:"low"|"review";
 reasons:string[];
 movableFragmentCount:number;
 reconstructedSentence:string;
};

export function auditEng011AmbiguityV1(set:Eng011SetV1):Eng011AmbiguityFlagV1{
 const logical=set.order.map(n=>set.fragments[n-1]!);
 const reconstructedSentence=logical.join(" ");
 const reasons:string[]=[];
 const movableFragmentCount=logical.filter(x=>movable.test(x.trim())).length;
 if(new Set(logical.map(x=>x.trim().toLowerCase())).size!==logical.length)reasons.push("duplicate-fragment");
 if(!finite.test(reconstructedSentence))reasons.push("finite-verb-not-detected");
 if(movableFragmentCount>=3)reasons.push("multiple-movable-adverbials");
 if(logical.some(x=>x.trim().length<3))reasons.push("very-short-fragment");
 return{setId:set.id,risk:reasons.length?"review":"low",reasons,movableFragmentCount,reconstructedSentence};
}

export function summarizeEng011AmbiguityV1(sets:readonly Eng011SetV1[]){
 const rows=sets.map(auditEng011AmbiguityV1);
 const review=rows.filter(x=>x.risk==="review");
 const severe=review.filter(x=>x.reasons.includes("duplicate-fragment")||x.reasons.includes("finite-verb-not-detected"));
 return{total:rows.length,reviewCount:review.length,severeCount:severe.length,rows,review,severe};
}
