export const factorial=(n:number):bigint=>{if(!Number.isInteger(n)||n<0||n>120)throw Error('Factorial domain');let v=1n;for(let i=2;i<=n;i++)v*=BigInt(i);return v;};
export const choose=(n:number,k:number):bigint=>{if(!Number.isInteger(n)||!Number.isInteger(k))throw Error('Combination domain');return k<0||k>n||n<0?0n:factorial(n)/factorial(k)/factorial(n-k);};
export const permute=(n:number,k:number):bigint=>k<0||k>n?0n:factorial(n)/factorial(n-k);
export interface MultisetConstraints {symbols:string[];counts:number[];length?:number;allowed?:Record<number,string[]>;noEqualAdjacent?:boolean;unequalEnds?:boolean;forbiddenPatterns?:string[];nonzeroFirst?:boolean}
export function countMultiset(q:MultisetConstraints):bigint {
 if(q.symbols.length!==q.counts.length||new Set(q.symbols).size!==q.symbols.length||q.symbols.some(s=>s.length!==1)||q.counts.some(n=>!Number.isInteger(n)||n<0)||q.counts.reduce((a,b)=>a+b,0)>20)throw Error('Multiset domain');
 const n=q.length??q.counts.reduce((a,b)=>a+b,0);if(!Number.isInteger(n)||n<0||n>20||q.unequalEnds&&n<2||q.allowed&&Object.entries(q.allowed).some(([p,s])=>!Number.isInteger(+p)||+p<0||+p>=n||s.some(v=>!q.symbols.includes(v))))throw Error('Invalid arrangement constraint');
 const memo=new Map<string,bigint>(),memory=Math.max(1,...(q.forbiddenPatterns??[]).map(p=>p.length));
 const visit=(counts:number[],suffix:string,first:string,pos:number):bigint=>{
  if(pos===n)return q.unequalEnds&&suffix.at(-1)===first?0n:1n;
  const key=[counts.join(','),suffix,first,pos].join('|'),cached=memo.get(key);if(cached!==undefined)return cached;
  let result=0n;for(let i=0;i<counts.length;i++){const s=q.symbols[i];if(!counts[i]||pos===0&&q.nonzeroFirst&&s==='0'||q.allowed?.[pos]&&!q.allowed[pos].includes(s)||q.noEqualAdjacent&&suffix.at(-1)===s||(q.forbiddenPatterns??[]).some(p=>(suffix+s).endsWith(p)))continue;counts[i]--;result+=visit(counts,(suffix+s).slice(-memory),pos===0?s:first,pos+1);counts[i]++;}memo.set(key,result);return result;
 };return visit([...q.counts],'','',0);
}
export function enumerateMultiset(q:MultisetConstraints):bigint {
 const n=q.length??q.counts.reduce((a,b)=>a+b,0);if(n>9)throw Error('Enumeration budget');const strings=new Set<string>();
 const walk=(s:string,remaining:number[])=>{if(s.length===n){strings.add(s);return;}remaining.forEach((c,i)=>{if(c){remaining[i]--;walk(s+q.symbols[i],remaining);remaining[i]++;}});};walk('',[...q.counts]);
 return BigInt([...strings].filter(s=>!(q.nonzeroFirst&&s[0]==='0'||q.unequalEnds&&s[0]===s.at(-1)||q.noEqualAdjacent&&[...s].some((c,i)=>i>0&&c===s[i-1])||q.forbiddenPatterns?.some(p=>s.includes(p))||q.allowed&&Object.entries(q.allowed).some(([i,allowed])=>!allowed.includes(s[+i])))).length);
}
export interface CompositionConstraints {total:number;minimum:number[];maximum:number[];distinct?:boolean;exactlyInRange?:{min:number;max:number;count:number}; weights?:('identical'|number)[]}
export function countComposition(q:CompositionConstraints):bigint {
 if(!Number.isInteger(q.total)||q.total<0||q.total>300||q.minimum.length!==q.maximum.length||!q.minimum.length||q.minimum.length>8||q.maximum.some((m,i)=>!Number.isInteger(m)||!Number.isInteger(q.minimum[i])||m<q.minimum[i]||q.minimum[i]<0)||q.weights&&(q.weights.length!==q.minimum.length||q.weights.some(w=>w!=='identical'&&(!Number.isInteger(w)||w<0||w>120))))throw Error('Composition domain');
 const memo=new Map<string,bigint>();const visit=(i:number,left:number,used:number[],inRange:number):bigint=>{
  if(i===q.minimum.length)return left===0&&(!q.exactlyInRange||inRange===q.exactlyInRange.count)?1n:0n;
  const key=[i,left,q.distinct?used.join(','):'',inRange].join(':');const cached=memo.get(key);if(cached!==undefined)return cached;
  let result=0n;for(let n=q.minimum[i];n<=Math.min(q.maximum[i],left);n++){
   if(q.distinct&&used.includes(n))continue;const next=inRange+(q.exactlyInRange&&n>=q.exactlyInRange.min&&n<=q.exactlyInRange.max?1:0);if(q.exactlyInRange&&next>q.exactlyInRange.count)continue;
   const weight=q.weights?.[i];result+=(typeof weight==='number'?choose(weight,n):1n)*visit(i+1,left-n,q.distinct?[...used,n].sort((a,b)=>a-b):[],next);
  }memo.set(key,result);return result;
 };return visit(0,q.total,[],0);
}
export function enumerateComposition(q:CompositionConstraints):bigint {
 if(q.maximum.reduce((a,b)=>a*(b+1),1)>2_000_000)throw Error('Enumeration budget');let answer=0n;
 const walk=(values:number[])=>{const i=values.length;if(i===q.minimum.length){if(values.reduce((a,b)=>a+b,0)!==q.total||q.distinct&&new Set(values).size!==values.length||q.exactlyInRange&&values.filter(v=>v>=q.exactlyInRange!.min&&v<=q.exactlyInRange!.max).length!==q.exactlyInRange.count)return;answer+=values.reduce((v,n,j)=>v*(typeof q.weights?.[j]==='number'?choose(q.weights[j] as number,n):1n),1n);return;}for(let n=q.minimum[i];n<=q.maximum[i];n++)walk([...values,n]);};walk([]);return answer;
}
export function committeeWithOffices(men:number,women:number,size:number,minWomen:number,maxWomen:number,minFemaleOfficers:number,maxFemaleOfficers:number):bigint {
 let result=0n;
 for(let w=minWomen;w<=maxWomen;w++)for(let f=minFemaleOfficers;f<=maxFemaleOfficers;f++)result+=choose(women,w)*choose(men,size-w)*choose(2,f)*permute(w,f)*permute(size-w,2-f);
 return result;
}
export function rectangles(rows:number,columns:number){return choose(rows+1,2)*choose(columns+1,2);}
export function squares(rows:number,columns:number){let v=0n;for(let k=1;k<=Math.min(rows,columns);k++)v+=BigInt((rows-k+1)*(columns-k+1));return v;}
export function trianglesInBlocks(blocks:number[],other=0){const n=blocks.reduce((a,b)=>a+b,other);return choose(n,3)-blocks.reduce((v,k)=>v+choose(k,3),0n);}
export function inversePairCount(pairs:number,excludeAdjacent=false){for(let n=2;n<=1000;n++)if(choose(n,2)-(excludeAdjacent?BigInt(n):0n)===BigInt(pairs))return n;throw Error('No integer pair solution');}
export function derangements(n:number):bigint {let a=1n,b=0n;for(let i=2;i<=n;i++){const c=BigInt(i-1)*(a+b);a=b;b=c;}return n===0?a:b;}
export function lexicographicRank(word:string):bigint {
 const remaining=[...word],symbols=[...new Set(remaining)].sort();let rank=1n;
 const permutations=(letters:string[])=>factorial(letters.length)/symbols.reduce((v,s)=>v*factorial(letters.filter(c=>c===s).length),1n);
 for(const letter of word){for(const s of symbols)if(s<letter&&remaining.includes(s)){const rest=[...remaining];rest.splice(rest.indexOf(s),1);rank+=permutations(rest);}remaining.splice(remaining.indexOf(letter),1);}return rank;
}
