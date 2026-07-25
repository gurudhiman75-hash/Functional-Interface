import { entries, explanationMap, getEntry, render } from "./library";
import { choose, consecutive, factorial, hashSeed, permutations } from "./math";
import type { Pnc002Package, Pnc002Parameters, Pnc002QlId, Pnc002SolverEvidence } from "./types";

function parameters(qlId:Pnc002QlId,seed:string):Pnc002Parameters{
 const entry=getEntry(qlId);let totalObjects=choose([5,6,7,8],`${seed}:n`);let blockSize=2;let secondBlockSize=2;
 if(qlId==="PNC-QL-108")blockSize=3;
 if(qlId==="PNC-QL-109"||qlId==="PNC-QL-113")blockSize=choose([2,3],`${seed}:b`);
 if(qlId==="PNC-QL-111"){totalObjects=choose([7,8],`${seed}:n`);blockSize=2;secondBlockSize=3;}
 if(qlId==="PNC-QL-112")blockSize=3;
 if(qlId==="PNC-QL-117"){totalObjects=choose([4,5,6,7,8],`${seed}:inverse`);blockSize=2;}
 if(qlId==="PNC-QL-118"){totalObjects=choose([5,6,7,8],`${seed}:inverse`);blockSize=3;}
 const target=entry.solveMode==="recoverTotalObjectsFromBlockCount"?factorial(totalObjects-blockSize+1)*factorial(blockSize):0;
 return {qlId,seed,totalObjects,blockSize,secondBlockSize,target};
}
function solve(p:Pnc002Parameters,mode:string):{answer:number;equation:string;evidence:Pnc002SolverEvidence}{
 const n=p.totalObjects,b=p.blockSize,c=p.secondBlockSize,all=factorial(n);
 if(mode==="countSingleBlockTogether"){const outer=n-b+1,answer=factorial(outer)*factorial(b);return{answer,equation:`\\(${outer}!\\times${b}!=${answer}\\)`,evidence:{outerUnits:outer,unrestricted:all,forbidden:0}};}
 if(mode==="countMultipleBlocksTogether"){const outer=n-b-c+2,answer=factorial(outer)*factorial(b)*factorial(c);return{answer,equation:`\\(${outer}!\\times${b}!\\times${c}!=${answer}\\)`,evidence:{outerUnits:outer,unrestricted:all,forbidden:0}};}
 if(mode==="countSpecifiedGroupNotAllTogether"){const outer=n-b+1,forbidden=factorial(outer)*factorial(b),answer=all-forbidden;return{answer,equation:`\\(${n}!-(${outer}!\\times${b}!)=${answer}\\)`,evidence:{outerUnits:outer,unrestricted:all,forbidden}};}
 if(mode==="countTwoSpecifiedApart"){const forbidden=factorial(n-1)*2,answer=all-forbidden;return{answer,equation:`\\(${n}!-2\\times${n-1}!=${answer}\\)`,evidence:{outerUnits:n-1,unrestricted:all,forbidden}};}
 if(mode==="countExactlyOnePairTogether"){const firstForced=factorial(n-1)*2,bothForced=factorial(n-2)*4,answer=2*(firstForced-bothForced);return{answer,equation:`\\(2[2(${n-1})!-4(${n-2})!]=${answer}\\)`,evidence:{outerUnits:n-1,unrestricted:all,forbidden:bothForced,firstForced,bothForced}};}
 for(let candidate=4;candidate<=8;candidate++){const count=factorial(candidate-b+1)*factorial(b);if(count===p.target)return{answer:candidate,equation:`\\(${candidate-b+1}!\\times${b}!=${p.target}\\)`,evidence:{outerUnits:candidate-b+1,unrestricted:factorial(candidate),forbidden:0,recoveredN:candidate}};}
 throw new Error("No inverse solution");
}
function verify(p:Pnc002Parameters,mode:string):number{
 if(mode==="recoverTotalObjectsFromBlockCount"){for(let n=4;n<=8;n++)if(factorial(n-p.blockSize+1)*factorial(p.blockSize)===p.target)return n;throw new Error("No verifier inverse");}
 const rows=permutations(Array.from({length:p.totalObjects},(_,i)=>i));const g1=Array.from({length:p.blockSize},(_,i)=>i);const g2=Array.from({length:p.secondBlockSize},(_,i)=>p.blockSize+i);
 return rows.filter(row=>{const a=consecutive(row,g1),b=consecutive(row,g2);if(mode==="countSingleBlockTogether")return a;if(mode==="countMultipleBlocksTogether")return a&&b;if(mode==="countSpecifiedGroupNotAllTogether")return !a;if(mode==="countTwoSpecifiedApart")return !consecutive(row,[0,1]);if(mode==="countExactlyOnePairTogether")return Number(consecutive(row,[0,1]))+Number(consecutive(row,[2,3]))===1;return false;}).length;
}
function options(answer:number,seed:string):{options:string[];correctIndex:number}{const candidates=[answer,Math.max(1,answer-2),answer+2,Math.max(1,Math.round(answer/2))];const unique=[...new Set(candidates)];for(let d=3;unique.length<4;d++)if(!unique.includes(answer+d))unique.push(answer+d);const values=unique.slice(0,4);const shift=hashSeed(seed)%4;const rotated=values.map((_,i)=>values[(i+shift)%4]!);return{options:rotated.map(String),correctIndex:rotated.indexOf(answer)};}
export function runPnc002(input:{questionLanguageId:Pnc002QlId;seed:string}):Pnc002Package{
 const entry=getEntry(input.questionLanguageId),p=parameters(entry.qlId,input.seed),solved=solve(p,entry.solveMode),verifierAnswer=verify(p,entry.solveMode);
 const variables={...p,outerUnits:solved.evidence.outerUnits,equation:solved.equation,answer:solved.answer};const stem=render(entry.template,variables);const explanation=explanationMap[entry.qlId].map(line=>render(line,variables));const optionBundle=options(solved.answer,`${input.seed}:${entry.qlId}`);
 const valid=verifierAnswer===solved.answer&&optionBundle.options.length===4&&new Set(optionBundle.options).size===4&&optionBundle.options[optionBundle.correctIndex]===String(solved.answer)&&explanation.length===3&&!/[{][A-Za-z0-9_]+[}]/.test([stem,...explanation].join(" "))&&solved.equation.startsWith("\\(")&&solved.equation.endsWith("\\)");
 return{packageId:"PNC-002",canonicalProblemId:"PNC-CP-007",qlId:entry.qlId,seed:input.seed,difficulty:entry.difficulty,solveMode:entry.solveMode,stem,options:optionBundle.options,correctIndex:optionBundle.correctIndex,answer:String(solved.answer),equation:solved.equation,explanation,evidence:solved.evidence,verifierAnswer,valid,publiclyPublishable:false};
}
export function getPnc002Entries(){return [...entries];}
