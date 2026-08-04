import { INT_CP003_RATE_LIBRARY, add, amount, canonicalAnswer, compoundInterest, div, eq, factor, integer, mul, pow, rat, sub, yearlyInterest, type Cp003AnswerSemantic, type Cp003MathematicalState, type IntCp003QlId, type Rational } from "./cp003-exam-model";
import type { Cp003PresentationTable } from "./cp003-exam-types";

export const ANSWER_SEMANTICS: Readonly<Record<IntCp003QlId,Cp003AnswerSemantic>> = Object.freeze({
  "INT-QL-053":"MONEY","INT-QL-054":"MONEY","INT-QL-055":"PRINCIPAL","INT-QL-056":"PRINCIPAL",
  "INT-QL-057":"RATE_PERCENT","INT-QL-058":"TIME_YEARS","INT-QL-059":"MONEY","INT-QL-060":"PRINCIPAL",
  "INT-QL-061":"RATE_PERCENT","INT-QL-062":"MONEY","INT-QL-063":"RATE_PERCENT","INT-QL-064":"PRINCIPAL",
  "INT-QL-065":"MONEY","INT-QL-066":"MONEY",
});

const abs = (value: bigint) => value < 0n ? -value : value;
export function gcd(a: bigint,b: bigint): bigint { a=abs(a); b=abs(b); while(b!==0n)[a,b]=[b,a%b]; return a||1n; }
export function round(value: Rational, places: number): Rational {
  const scale = 10n ** BigInt(places);
  const positive = abs(value.numerator) * scale;
  let quotient = positive / value.denominator;
  if ((positive % value.denominator) * 2n >= value.denominator) quotient += 1n;
  return rat(value.numerator < 0n ? -quotient : quotient,scale);
}
export function decimal(value:Rational,places=6):string {
  if(value.denominator===1n)return value.numerator.toString();
  const sign=value.numerator<0n?"-":"", numerator=abs(value.numerator), whole=numerator/value.denominator;
  let remainder=numerator%value.denominator, fraction="";
  for(let i=0;i<places&&remainder!==0n;i++){remainder*=10n;fraction+=(remainder/value.denominator).toString();remainder%=value.denominator;}
  return fraction?`${sign}${whole}.${fraction}`:`${sign}${whole}`;
}
export function indianInteger(value:bigint):string {
  const sign=value<0n?"-":"", source=abs(value).toString();
  if(source.length<=3)return sign+source;
  const last=source.slice(-3),head=source.slice(0,-3),groups:string[]=[];
  for(let i=head.length;i>0;i-=2)groups.unshift(head.slice(Math.max(0,i-2),i));
  return `${sign}${groups.join(",")},${last}`;
}
export function fractionLatex(value:Rational):string { return value.denominator===1n?value.numerator.toString():`\\frac{${value.numerator}}{${value.denominator}}`; }
export function moneyPlain(value:Rational):string { return value.denominator===1n?`₹${indianInteger(value.numerator)}`:`₹${decimal(value,2)}`; }
export function moneyMath(value:Rational):string { return `$${moneyPlain(value)}$`; }
export function ratePlain(value:Rational):string {
  const known = new Map<string,string>([["25/3","8⅓"],["50/3","16⅔"],["100/3","33⅓"],["100/7","14 2/7"]]);
  return known.get(`${value.numerator}/${value.denominator}`) ?? decimal(value,2);
}
export function rateMath(value:Rational):string {
  const known = new Map<string,string>([["25/3","8\\frac{1}{3}"],["50/3","16\\frac{2}{3}"],["100/3","33\\frac{1}{3}"],["100/7","14\\frac{2}{7}"]]);
  return `$${known.get(`${value.numerator}/${value.denominator}`) ?? decimal(value,2)}\\%$`;
}
export function fixedDecimal(value:Rational,places:number):string {
  const rounded=round(value,places),scale=10n**BigInt(places),scaled=rounded.numerator*scale/rounded.denominator;
  const sign=scaled<0n?"-":"",digits=abs(scaled).toString().padStart(places+1,"0");
  return places===0?`${sign}${digits}`:`${sign}${digits.slice(0,-places)}.${digits.slice(-places)}`;
}
export function answerText(semantic:Cp003AnswerSemantic,value:Rational):string {
  if(semantic==="RATE_PERCENT")return rateMath(value);
  if(semantic==="TIME_YEARS"){const years=integer(value);return `$${years}$ year${years===1?"":"s"}`;}
  return moneyMath(value);
}
export function ordinal(value:number):string {
  let suffix="th"; if(![11,12,13].includes(value%100))suffix=({1:"st",2:"nd",3:"rd"} as Record<number,string>)[value%10]??"th";
  return `$${value}^{\\text{${suffix}}}$`;
}
export function annualFactorText(ratePercent:Rational):string {
  const f=factor(ratePercent), decimalForm=decimal(f,6), fractionForm=fractionLatex(f);
  return f.denominator===1n?`$${decimalForm}$`:`$${decimalForm}= ${fractionForm}$`;
}
export function tableMarkdown(table:Cp003PresentationTable):string {
  return [`| ${table.headers.join(" | ")} |`,`| ${table.headers.map(()=>"---").join(" | ")} |`,...table.rows.map(row=>`| ${row.join(" | ")} |`)].join("\n");
}

export interface ResolvedState {
  principal:Rational; ratePercent:Rational; years:number; targetYear:number; currentYear:number; earlierYear:number; laterYear:number;
  amount:Rational; compoundInterest:Rational; nthYearInterest:Rational; currentAmount:Rational; nextAmount:Rational; earlierAmount:Rational; laterAmount:Rational; earlierInterest:Rational; laterInterest:Rational;
}
function findRate(predicate:(value:Rational)=>boolean):Rational {
  const matches=INT_CP003_RATE_LIBRARY.filter(profile=>predicate(profile.ratePercent));
  if(matches.length!==1)throw new Error(`expected one rate match, found ${matches.length}`);
  return matches[0]!.ratePercent;
}
export function resolve(state:Cp003MathematicalState):ResolvedState {
  let principal=rat(1),ratePercent=rat(10),years=2,targetYear=2,currentYear=1,earlierYear=1,laterYear=2;
  switch(state.qlId){
    case"INT-QL-053":case"INT-QL-054": principal=state.principal;ratePercent=state.ratePercent;years=state.years;break;
    case"INT-QL-055": ratePercent=state.ratePercent;years=state.years;principal=div(state.amount,pow(factor(ratePercent),years));break;
    case"INT-QL-056": ratePercent=state.ratePercent;years=state.years;principal=div(state.compoundInterest,sub(pow(factor(ratePercent),years),rat(1)));break;
    case"INT-QL-057": principal=state.principal;years=state.years;ratePercent=findRate(r=>eq(amount(principal,r,years),state.amount));break;
    case"INT-QL-058": principal=state.principal;ratePercent=state.ratePercent;years=integer(canonicalAnswer(state))!;break;
    case"INT-QL-059": principal=state.principal;ratePercent=state.ratePercent;targetYear=state.targetYear;years=targetYear;break;
    case"INT-QL-060": ratePercent=state.ratePercent;targetYear=state.targetYear;years=targetYear;principal=canonicalAnswer(state);break;
    case"INT-QL-061": principal=state.principal;targetYear=state.targetYear;years=targetYear;ratePercent=canonicalAnswer(state);break;
    case"INT-QL-062": ratePercent=state.ratePercent;currentYear=state.currentYear;years=currentYear;principal=div(state.currentAmount,pow(factor(ratePercent),currentYear));break;
    case"INT-QL-063": currentYear=state.yearNumber;years=currentYear;ratePercent=canonicalAnswer(state);principal=div(state.openingAmount,pow(factor(ratePercent),currentYear-1));break;
    case"INT-QL-064": currentYear=state.yearNumber;years=currentYear+1;ratePercent=mul(sub(div(state.nextYearAmount,state.amountAtYear),rat(1)),rat(100));principal=canonicalAnswer(state);break;
    case"INT-QL-065": principal=state.principal;ratePercent=state.ratePercent;earlierYear=state.earlierYear;laterYear=state.laterYear;years=laterYear;break;
    case"INT-QL-066": ratePercent=state.ratePercent;earlierYear=state.earlierYear;laterYear=state.laterYear;years=laterYear;principal=div(state.earlierYearInterest,mul(sub(factor(ratePercent),rat(1)),pow(factor(ratePercent),earlierYear-1)));break;
  }
  return Object.freeze({principal,ratePercent,years,targetYear,currentYear,earlierYear,laterYear,amount:amount(principal,ratePercent,years),compoundInterest:compoundInterest(principal,ratePercent,years),nthYearInterest:yearlyInterest(principal,ratePercent,targetYear),currentAmount:amount(principal,ratePercent,currentYear),nextAmount:amount(principal,ratePercent,currentYear+1),earlierAmount:amount(principal,ratePercent,earlierYear),laterAmount:amount(principal,ratePercent,laterYear),earlierInterest:yearlyInterest(principal,ratePercent,earlierYear),laterInterest:yearlyInterest(principal,ratePercent,laterYear)});
}
