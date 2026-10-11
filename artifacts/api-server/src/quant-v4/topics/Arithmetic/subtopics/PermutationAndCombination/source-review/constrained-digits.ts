/** Counts positive base-10 integers or fixed-width codes under explicit constraints. */
export interface DigitConstraints {
 digits:number[]; minLength:number; maxLength:number; repetition:boolean; code?:boolean;
 minimum?:number; maximum?:number; modulus?:number; residue?:number;
 fixed?:Record<number,number>; prefixes?:string[]; evenPositions?:number[];
 exact?:{digit:number;count:number}; distinct?:{min:number;max:number};
 oddCount?:number; sumParity?:0|1; increasing?:boolean; divisibleByLast?:boolean; excludeLast?:number[]; lastUnique?:boolean;
}
export function countConstrainedDigits(q:DigitConstraints):bigint {
 if(new Set(q.digits).size!==q.digits.length||!q.digits.length||q.digits.some(d=>!Number.isInteger(d)||d<0||d>9)||!Number.isInteger(q.minLength)||!Number.isInteger(q.maxLength)||q.minLength<1||q.maxLength<q.minLength||q.maxLength>12)throw Error('Invalid digit domain');
 if(q.modulus!==undefined&&(!Number.isInteger(q.modulus)||q.modulus<1||q.modulus>100))throw Error('Invalid modulus');
 if(q.minimum!==undefined&&(!Number.isSafeInteger(q.minimum)||q.minimum<0)||q.maximum!==undefined&&(!Number.isSafeInteger(q.maximum)||q.maximum<0))throw Error('Invalid bounds');
 if(q.exact&&(!q.digits.includes(q.exact.digit)||!Number.isInteger(q.exact.count)||q.exact.count<0||q.exact.count>q.maxLength))throw Error('Invalid exact occurrence');
 if(q.distinct&&(!Number.isInteger(q.distinct.min)||!Number.isInteger(q.distinct.max)||q.distinct.min<1||q.distinct.max<q.distinct.min||q.distinct.max>10))throw Error('Invalid distinct count');
 if(q.oddCount!==undefined&&(!Number.isInteger(q.oddCount)||q.oddCount<0||q.oddCount>q.maxLength)||q.sumParity!==undefined&&q.sumParity!==0&&q.sumParity!==1)throw Error('Invalid parity constraint');
 if(q.fixed&&Object.entries(q.fixed).some(([p,d])=>!Number.isInteger(+p)||+p<0||+p>=q.maxLength||!Number.isInteger(d)||d<0||d>9)||q.evenPositions?.some(p=>!Number.isInteger(p)||p<0||p>=q.maxLength))throw Error('Invalid constrained position');
 if(q.residue!==undefined&&(!q.modulus||!Number.isInteger(q.residue)||q.residue<0||q.residue>=q.modulus))throw Error('Invalid residue');
 let total=0n;
 for(let length=q.minLength;length<=q.maxLength;length++) {
  if(Object.keys(q.fixed??{}).some(p=>+p>=length)||q.evenPositions?.some(p=>p>=length))continue;
  const lo=String(q.minimum??0), hi=String(q.maximum??10**length-1);
  if(!q.code&&(hi.length<length||lo.length>length))continue;
  const lower=lo.padStart(length,'0'),upper=hi.length>length?'9'.repeat(length):hi.padStart(length,'0');
  const prefixes=q.prefixes??[''];
  if(prefixes.some(p=>!/^\d*$/.test(p)))throw Error('Invalid prefix');
  if(new Set(prefixes).size!==prefixes.length||prefixes.some((p,i)=>prefixes.some((s,j)=>i!==j&&s.startsWith(p))))throw Error('Prefixes must be disjoint');
  for(const prefix of prefixes) {
   if(prefix.length>length)continue;
   const memo=new Map<string,bigint>();
   // Last digit must be tracked only for predicates that need it; carrying it otherwise wastes states.
   const needsLast=!!q.divisibleByLast||!!q.lastUnique||!!q.excludeLast;
   const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
   const mod=q.divisibleByLast?2520*(q.modulus??1)/gcd(2520,q.modulus??1):q.modulus??1;
   const visit=(pos:number,mask:number,rem:number,occ:number,odds:number,parity:number,last:number,lastCount:number,lowTight:boolean,highTight:boolean):bigint=>{
    if(pos===length){const distinct=popcount(mask);return (!q.exact||occ===q.exact.count)&&(!q.distinct||distinct>=q.distinct.min&&distinct<=q.distinct.max)&&(q.oddCount===undefined||odds===q.oddCount)&&(q.sumParity===undefined||parity===q.sumParity)&&(!q.divisibleByLast||last!==0&&rem%last===0)&&(!q.excludeLast||!q.excludeLast.includes(last))&&(!q.lastUnique||lastCount===1)&&(q.modulus===undefined||rem%q.modulus===(q.residue??0))?1n:0n;}
    const key=[pos,mask,rem,occ,odds,parity,last,lastCount,+lowTight,+highTight].join(':');const cached=memo.get(key);if(cached!==undefined)return cached;
    let answer=0n;
    for(const d of q.digits){
     if(pos===0&&!q.code&&d===0||!q.repetition&&(mask&(1<<d))||q.increasing&&pos>0&&d<=last||pos<prefix.length&&d!==Number(prefix[pos])||q.fixed?.[pos]!==undefined&&d!==q.fixed[pos]||q.evenPositions?.includes(pos)&&d%2!==0)continue;
     if(lowTight&&d<Number(lower[pos])||highTight&&d>Number(upper[pos]))continue;
     const nextOcc=occ+(q.exact&&d===q.exact.digit?1:0);if(q.exact&&nextOcc>q.exact.count)continue;
     // lastUnique is decided by its chosen final digit. Track used-twice symbols via a second bitmask.
     const duplicateMask=lastCount|((mask&(1<<d))?1<<d:0);
     answer+=visit(pos+1,mask|(1<<d),(rem*10+d)%mod,nextOcc,q.oddCount===undefined?0:odds+d%2,q.sumParity===undefined?0:(parity+d)%2,q.increasing||needsLast?d:0,q.lastUnique?(pos===length-1?((duplicateMask&(1<<d))?2:1):duplicateMask):0,lowTight&&d===Number(lower[pos]),highTight&&d===Number(upper[pos]));
    }
    memo.set(key,answer);return answer;
   };
   total+=visit(0,0,0,0,0,0,-1,0,true,true);
  }
 }
 return total;
}
function popcount(n:number){let c=0;for(;n;n&=n-1)c++;return c;}
/** Deliberately separate direct enumeration oracle, limited to small domains. */
export function enumerateConstrainedDigits(q:DigitConstraints):bigint {
 if(q.digits.length**q.maxLength>2_000_000)throw Error('Enumeration budget exceeded');let count=0n;
 for(let n=q.minLength;n<=q.maxLength;n++){
  if(Object.keys(q.fixed??{}).some(p=>+p>=n)||q.evenPositions?.some(p=>p>=n))continue;
  const walk=(s:string)=>{if(s.length<n){for(const d of q.digits)walk(s+d);return;}
   const ds=[...s].map(Number),value=Number(s),last=ds[n-1];
   if(!q.code&&ds[0]===0||!q.repetition&&new Set(ds).size<n||value<(q.minimum??0)||value>(q.maximum??Infinity)||q.modulus!==undefined&&value%q.modulus!==(q.residue??0)||q.fixed&&Object.entries(q.fixed).some(([p,d])=>ds[+p]!==d)||q.prefixes&&!q.prefixes.some(p=>s.startsWith(p))||q.evenPositions?.some(p=>ds[p]%2)||q.exact&&ds.filter(d=>d===q.exact!.digit).length!==q.exact.count||q.distinct&&(new Set(ds).size<q.distinct.min||new Set(ds).size>q.distinct.max)||q.oddCount!==undefined&&ds.filter(d=>d%2).length!==q.oddCount||q.sumParity!==undefined&&ds.reduce((a,b)=>a+b,0)%2!==q.sumParity||q.increasing&&ds.some((d,i)=>i>0&&d<=ds[i-1])||q.divisibleByLast&&(last===0||value%last!==0)||q.excludeLast?.includes(last)||q.lastUnique&&ds.filter(d=>d===last).length!==1)return;count++;
  };walk('');
 }return count;
}
