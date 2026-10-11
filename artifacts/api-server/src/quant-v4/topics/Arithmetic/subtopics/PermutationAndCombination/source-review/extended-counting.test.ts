import assert from 'node:assert/strict';
import {countMultiset,enumerateMultiset,countComposition,enumerateComposition,choose,factorial,committeeWithOffices,rectangles,squares,trianglesInBlocks,derangements} from './extended-counting';
import {extendedSourceCases} from './extended-source-cases';
import {digitSourceCases} from './digit-source-cases';
let domains=0;
for(const counts of [[2,2,1],[1,2,3],[3,1,2],[1,1,1,1]])for(const noEqualAdjacent of [false,true])for(const unequalEnds of [false,true])for(const length of [3,counts.reduce((a,b)=>a+b,0)]){
 const q={symbols:['0','1','2','3'].slice(0,counts.length),counts,noEqualAdjacent,unequalEnds,length,nonzeroFirst:true,forbiddenPatterns:['12'],allowed:{1:['0','1']}};assert.equal(countMultiset(q),enumerateMultiset(q),JSON.stringify(q));domains++;
}
for(let total=0;total<=12;total++)for(const distinct of [false,true])for(const count of [0,1,2]){
 const q={total,minimum:[0,1,0],maximum:[5,5,4],distinct,exactlyInRange:{min:0,max:2,count}};assert.equal(countComposition(q),enumerateComposition(q),JSON.stringify(q));domains++;
}
for(let m=2;m<=4;m++)for(let w=2;w<=4;w++){
 // Enumerate office holders and unordered secretary pairs independently.
 let n=0n;const people=Array.from({length:m+w},(_,i)=>i);
 for(const president of people)for(const vice of people)if(vice!==president)for(const a of people)for(const b of people)if(a<b&&![president,vice].includes(a)&&![president,vice].includes(b)) {
  const female=[president,vice,a,b].filter(i=>i>=m).length,femaleOffices=[president,vice].filter(i=>i>=m).length;
  if(female>=2&&femaleOffices>=1)n++;
 }
 assert.equal(committeeWithOffices(m,w,4,2,4,1,2),n);domains++;
}
for(let r=1;r<=6;r++)for(let c=1;c<=6;c++){
 let rect=0n,sq=0n;for(let top=0;top<r;top++)for(let bottom=top+1;bottom<=r;bottom++)for(let left=0;left<c;left++)for(let right=left+1;right<=c;right++){rect++;if(bottom-top===right-left)sq++;}
 assert.equal(rectangles(r,c),rect);assert.equal(squares(r,c),sq);domains++;
}
assert.equal(derangements(5),44n);
const ids=[...digitSourceCases,...extendedSourceCases].map(c=>c.id);assert.equal(ids.length,187);assert.equal(new Set(ids).size,187);
for(const [level,n]of [['I',87],['II',50],['III',50]]as const)for(let i=1;i<=n;i++)assert.ok(ids.includes(`${level}-${String(i).padStart(3,'0')}`));
const expected:Record<string,string>={'I-005':'2612736000','I-020':'3','I-021':'7','I-064':'425','I-066':'252','I-067':'6269','I-071':'3','I-074':'6','I-076':'6','II-002':'249','II-004':'22680','II-008':'512','II-009':'512','II-017':'71','II-025':'342','III-003':'60','III-013':'110551','III-015':'1768','III-021':'14370048000','III-032':'26250','III-050':'64906'};
let failures=0;for(const c of extendedSourceCases)if(expected[c.id]&&c.answer!==expected[c.id]){console.log(c.id,c.answer,'expected',expected[c.id]);failures++;}
const urnByInclusion=Array.from({length:10},(_,j)=>(j%2?-1n:1n)*choose(10,j)*choose(15-j,6)**2n).reduce((a,b)=>a+b,0n);assert.equal(urnByInclusion,26250n);
const permutationSolutions:number[]=[];for(let n=1;n<=30;n++){const numerator=factorial(2*n+1)/factorial(n+2),denominator=factorial(2*n-1)/factorial(n-1);if(10n*numerator===7n*denominator)permutationSolutions.push(n);}assert.deepEqual(permutationSolutions,[3]);
const combinationSolutions:number[]=[];for(let r=2;r<=14;r++)if(11n*choose(28,2*r)===225n*choose(24,2*r-4))combinationSolutions.push(r);assert.deepEqual(combinationSolutions,[7]);
assert.equal(failures,0);console.log(JSON.stringify({domains,sourceCases:extendedSourceCases.length,allSourceExercises:ids.length,status:'PASS'}));
