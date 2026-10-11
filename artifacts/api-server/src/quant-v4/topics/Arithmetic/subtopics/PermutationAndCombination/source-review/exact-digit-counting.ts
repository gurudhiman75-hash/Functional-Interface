export interface ExactDigitInput {digits:number[];length:number;specified:number;occurrences:number;repetition:boolean;}
function validate(p:ExactDigitInput):void {
 if(p.digits.length<2||new Set(p.digits).size!==p.digits.length||p.digits.some(d=>!Number.isInteger(d)||d<0||d>9)||!p.digits.includes(p.specified)||!Number.isInteger(p.length)||p.length<2||p.length>8||!Number.isInteger(p.occurrences)||p.occurrences<1||p.occurrences>p.length||(!p.repetition&&(p.occurrences!==1||p.length>p.digits.length)))throw Error("Invalid exact-digit domain");
}
function c(n:number,r:number):number {if(r<0||r>n)return 0;let v=1;for(let i=1;i<=r;i++)v=v*(n-i+1)/i;return Math.round(v);}
function perm(n:number,r:number):number {if(r<0||r>n)return 0;let v=1;for(let i=0;i<r;i++)v*=n-i;return v;}
export function solveExactDigit(p:ExactDigitInput) {
 validate(p);const m=p.digits.length,l=p.length,t=p.occurrences,zero=p.digits.includes(0);
 let answer:number,calculation:string;
 if(!p.repetition) {
  const all=l*perm(m-1,l-1);
  const invalid=zero ? (p.specified===0 ? perm(m-1,l-1) : (l-1)*perm(m-2,l-2)) : 0;
  answer=all-invalid;calculation=`${l} × P(${m-1}, ${l-1}) − ${invalid} = ${answer}`;
 } else if(!zero) {
  answer=c(l,t)*(m-1)**(l-t);calculation=`C(${l}, ${t}) × ${m-1}^${l-t} = ${answer}`;
 } else if(p.specified===0) {
  answer=(m-1)*c(l-1,t)*(m-1)**(l-1-t);
  calculation=t===l?'A number cannot begin with 0; no valid number exists.':`${m-1} × C(${l-1}, ${t}) × ${m-1}^${l-1-t} = ${answer}`;
 } else {
  const firstSpecified=c(l-1,t-1)*(m-1)**(l-t);
  const firstOther=t===l ? 0 : (m-2)*c(l-1,t)*(m-1)**(l-1-t);
  answer=firstSpecified+firstOther;calculation=`First digit ${p.specified}: ${firstSpecified}; other nonzero first digit: ${firstOther}. Total = ${answer}`;
 }
 return {answer,calculation};
}
export function verifyExactDigit(p:ExactDigitInput):number {
 validate(p);if(p.digits.length**p.length>2_000_000)throw Error("Enumeration budget exceeded");
 let answer=0;
 function visit(depth:number,count:number,used:Set<number>):void {
  if(count>p.occurrences||count+p.length-depth<p.occurrences)return;
  if(depth===p.length){if(count===p.occurrences)answer++;return;}
  for(const d of p.digits)if(!(depth===0&&d===0)&&(p.repetition||!used.has(d)))visit(depth+1,count+(d===p.specified?1:0),new Set([...used,d]));
 }
 visit(0,0,new Set());return answer;
}
export function buildExactDigitReview(p:ExactDigitInput) {
 const s=solveExactDigit(p);
 return {packageId:"PNC-SOURCE-EXACT-DIGIT-REVIEW",stem:`How many ${p.length}-digit numbers can be formed using the digits ${p.digits.join(', ')} if ${p.specified} appears exactly ${p.occurrences===1?'once':`${p.occurrences} times`} and ${p.repetition?'the other digits may repeat':'no digit is repeated'}?`,answer:String(s.answer),explanation:[p.repetition?`Choose the positions occupied by ${p.specified} and fill the remaining positions with other allowed digits.`:`Choose the position of ${p.specified} and arrange different remaining digits.`,p.digits.includes(0)?'Exclude arrangements whose first digit is 0.':'All allowed digits are nonzero.',s.calculation],publiclyPublishable:false,reviewStatus:"REVIEW_REQUIRED",language:"en"};
}
