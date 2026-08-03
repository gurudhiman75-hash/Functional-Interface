import { amount, compoundInterest, div, factor, mul, pow, rat, sub, yearlyInterest, type Cp003QuestionContract, type Rational } from "./cp003-exam-model";
import type { Cp003Option, Cp003StudentExplanation } from "./cp003-exam-types";
import { ANSWER_SEMANTICS, annualFactorText, answerText, fractionLatex, gcd, moneyMath, moneyPlain, ordinal, rateMath, ratePlain, type ResolvedState } from "./cp003-exam-support";

function factorPowerLine(r:ResolvedState,years:number):string {
  const f=factor(r.ratePercent),fp=pow(f,years);
  return `$\\left(${fractionLatex(f)}\\right)^{${years}}=${fractionLatex(fp)}$`;
}
function productCalculation(base:Rational,multiplier:Rational):readonly string[] {
  const g=gcd(base.numerator,multiplier.denominator),reducedBase=base.numerator/g,reducedDen=multiplier.denominator/g;
  const result=mul(base,multiplier);
  if(g>1n&&reducedDen===1n)return Object.freeze([`Cancel before multiplying: $${base.numerator}\\div${multiplier.denominator}=${reducedBase}$.`,`Then $${reducedBase}\\times${multiplier.numerator}=${result.numerator}$.`]);
  return Object.freeze([`$${fractionLatex(base)}\\times${fractionLatex(multiplier)}=${fractionLatex(result)}$.`]);
}
export function explanationFor(contract:Cp003QuestionContract,r:ResolvedState,solution:Rational,_options:readonly Cp003Option[]):Cp003StudentExplanation {
  const f=factor(r.ratePercent),semantic=ANSWER_SEMANTICS[contract.qlId],finalAnswer=answerText(semantic,solution),steps:string[]=[],foundation:string[]=[],exam:string[]=[];
  let keyIdea="",shortcut:Cp003StudentExplanation["shortcut"],commonMistake:string|undefined,verification:Cp003StudentExplanation["verification"];
  switch(contract.qlId){
    case"INT-QL-053":{
      keyIdea=`The amount is multiplied by the annual factor ${annualFactorText(r.ratePercent)} once each year.`;
      const multiplier=pow(f,r.years);steps.push(`Annual multiplier for $${r.years}$ years: ${factorPowerLine(r,r.years)}.`,`$A=${moneyPlain(r.principal)}\\times${fractionLatex(multiplier)}$.`,...productCalculation(r.principal,multiplier));
      exam.push(`$A=P\\left(1+\\frac{r}{100}\\right)^n=${moneyPlain(r.principal)}\\times${fractionLatex(multiplier)}=${moneyPlain(solution)}$.`);
      foundation.push(`Start with ${moneyMath(r.principal)}.`,...Array.from({length:r.years},(_,i)=>`After year $${i+1}$: ${moneyMath(amount(r.principal,r.ratePercent,i+1))}.`));
      if(f.denominator<=10n)shortcut={title:"Cancel the denominator before multiplying",steps:productCalculation(r.principal,multiplier)};
      commonMistake="Do not stop at the compound interest; the question asks for the total amount.";break;
    }
    case"INT-QL-054":{
      keyIdea="First find the maturity amount, then subtract the original principal.";
      const multiplier=pow(f,r.years);steps.push(`$A=${moneyPlain(r.principal)}\\times${fractionLatex(multiplier)}=${moneyPlain(r.amount)}$.`,`$CI=A-P=${moneyPlain(r.amount)}-${moneyPlain(r.principal)}=${moneyPlain(solution)}$.`);
      exam.push(`$CI=P[(1+r)^n-1]=${moneyPlain(solution)}$.`);
      foundation.push(`Original principal: ${moneyMath(r.principal)}.`,`Balance after $${r.years}$ years: ${moneyMath(r.amount)}.`,`Interest earned: ${moneyMath(r.amount)} − ${moneyMath(r.principal)} = ${moneyMath(solution)}.`);
      commonMistake=`${moneyMath(mul(r.principal,mul(div(r.ratePercent,rat(100)),rat(r.years))))} would be simple interest and ignores interest on interest.`;break;
    }
    case"INT-QL-055":{
      keyIdea=`Reverse the $${r.years}$ annual increases by multiplying by the reciprocal factor.`;
      const reverse=div(rat(1),pow(f,r.years));steps.push(`Forward multiplier: ${factorPowerLine(r,r.years)}.`,`$P=${moneyPlain(r.amount)}\\times${fractionLatex(reverse)}$.`,...productCalculation(r.amount,reverse));
      exam.push(`$P=A\\left(\\frac{1}{1+r}\\right)^n=${moneyPlain(solution)}$.`);
      foundation.push(`The final amount is ${moneyMath(r.amount)}.`,`Undo one annual factor ${annualFactorText(r.ratePercent)} at a time for $${r.years}$ years.`,`The starting value is ${moneyMath(solution)}.`);
      shortcut={title:"Reverse the factor instead of expanding",steps:[`Use $${fractionLatex(reverse)}$ directly: $${moneyPlain(r.amount)}\\times${fractionLatex(reverse)}=${moneyPlain(solution)}$.`]};
      commonMistake="Do not divide by a simple-interest multiplier; the annual increases compound.";break;
    }
    case"INT-QL-056":{
      keyIdea="The given compound interest equals the principal multiplied by the compound-interest factor.";
      const ciFactor=sub(pow(f,r.years),rat(1));steps.push(`Compound-interest factor: $${factorPowerLine(r,r.years).slice(1,-1)}-1=${fractionLatex(ciFactor)}$.`,`$P=${moneyPlain(r.compoundInterest)}\\div${fractionLatex(ciFactor)}=${moneyPlain(solution)}$.`);
      exam.push(`$P=CI\\div[(1+r)^n-1]=${moneyPlain(solution)}$.`);
      foundation.push(`Suppose the principal is $P$.`,`After $${r.years}$ years, the interest part is $P\\times${fractionLatex(ciFactor)}$.`,`Equating it to ${moneyMath(r.compoundInterest)} gives ${moneyMath(solution)}.`);
      commonMistake="The given interest is not the final amount and cannot be copied as the principal.";break;
    }
    case"INT-QL-057":{
      keyIdea="Compare the final amount with the principal to identify the repeated annual multiplier.";
      const ratio=div(r.amount,r.principal);steps.push(`Two-sided growth factor: $\\frac{A}{P}=\\frac{${r.amount.numerator}}{${r.principal.numerator}}=${fractionLatex(ratio)}$.`,`Recognise $${fractionLatex(ratio)}=\\left(${fractionLatex(f)}\\right)^{${r.years}}$.`,`Annual factor $=${fractionLatex(f)}$, so rate $=(${fractionLatex(f)}-1)\\times100=${ratePlain(solution)}\\%$.`);
      exam.push(`$A/P=${fractionLatex(ratio)}=${fractionLatex(f)}^{${r.years}}\\Rightarrow r=${ratePlain(solution)}\\%$.`);
      foundation.push(`Divide amount by principal to remove the size of the investment.`,`Find the annual factor which, repeated $${r.years}$ times, gives that ratio.`,`Convert the excess over $1$ into a percentage.`);
      verification={method:"Substitute the rate",steps:[`$${moneyPlain(r.principal)}\\times(${fractionLatex(f)})^{${r.years}}=${moneyPlain(r.amount)}$, which matches the question.`]};
      commonMistake="Do not divide the total percentage growth equally by the number of years; compound growth is multiplicative.";break;
    }
    case"INT-QL-058":{
      keyIdea=`At ${rateMath(r.ratePercent)}, the balance is multiplied by ${annualFactorText(r.ratePercent)} each year.`;
      const ratio=div(r.amount,r.principal);steps.push(`Required multiplier: $A/P=${fractionLatex(ratio)}$.`,`Repeated factor: $${fractionLatex(f)}^{${r.years}}=${fractionLatex(ratio)}$.`,`Therefore, the number of years is $${r.years}$.`);
      exam.push(`$A/P=${fractionLatex(ratio)}=${fractionLatex(f)}^{${r.years}}\\Rightarrow n=${r.years}$.`);
      foundation.push(...Array.from({length:r.years+1},(_,i)=>`Year $${i}$ balance: ${moneyMath(amount(r.principal,r.ratePercent,i))}.`));
      verification={method:"Year-by-year balance ladder",steps:Array.from({length:r.years},(_,i)=>`${moneyMath(amount(r.principal,r.ratePercent,i))} → ${moneyMath(amount(r.principal,r.ratePercent,i+1))}.`)};
      commonMistake="A simple-interest time formula does not apply to repeated annual multiplication.";break;
    }
    case"INT-QL-059":{
      keyIdea=`Interest in the ${ordinal(r.targetYear)} year is calculated on the balance after $${r.targetYear-1}$ years.`;
      const opening=amount(r.principal,r.ratePercent,r.targetYear-1);steps.push(`Opening balance of year $${r.targetYear}$: $${moneyPlain(r.principal)}\\times(${fractionLatex(f)})^{${r.targetYear-1}}=${moneyPlain(opening)}$.`,`Year-$${r.targetYear}$ interest: $${moneyPlain(opening)}\\times${fractionLatex(div(r.ratePercent,rat(100)))}=${moneyPlain(solution)}$.`);
      exam.push(`$I_${r.targetYear}=P(1+r)^{${r.targetYear-1}}r=${moneyPlain(solution)}$.`);
      foundation.push(...Array.from({length:r.targetYear},(_,i)=>`Interest in year $${i+1}$: ${moneyMath(yearlyInterest(r.principal,r.ratePercent,i+1))}.`));
      shortcut={title:"Find only the opening balance of the required year",steps:[`Do not calculate total compound interest. Find the balance after $${r.targetYear-1}$ years and take ${rateMath(r.ratePercent)} of it.`]};
      commonMistake="The first-year interest is based on the principal; later-year interest is based on the increased balance.";break;
    }
    case"INT-QL-060":{
      keyIdea=`The ${ordinal(r.targetYear)}-year interest equals the principal multiplied by the year-specific interest factor.`;
      const multiplier=mul(div(r.ratePercent,rat(100)),pow(f,r.targetYear-1));steps.push(`Year-specific factor: $${fractionLatex(div(r.ratePercent,rat(100)))}\\times(${fractionLatex(f)})^{${r.targetYear-1}}=${fractionLatex(multiplier)}$.`,`$P=${moneyPlain(r.nthYearInterest)}\\div${fractionLatex(multiplier)}=${moneyPlain(solution)}$.`);
      exam.push(`$P=I_${r.targetYear}/[r(1+r)^{${r.targetYear-1}}]=${moneyPlain(solution)}$.`);
      foundation.push(`The balance grows for $${r.targetYear-1}$ years before the requested year's interest is earned.`,`Undo both the rate and those earlier growth factors.`);
      commonMistake="Dividing only by the rate treats the observed interest as first-year interest.";break;
    }
    case"INT-QL-061":{
      keyIdea=`Test an exam-friendly annual factor against the ${ordinal(r.targetYear)}-year interest.`;
      steps.push(`For a rate $r$, year-$${r.targetYear}$ interest is $P\\times r\\times(1+r)^{${r.targetYear-1}}$.`,`Try ${rateMath(solution)}: $${moneyPlain(r.principal)}\\times${fractionLatex(div(solution,rat(100)))}\\times(${fractionLatex(f)})^{${r.targetYear-1}}=${moneyPlain(r.nthYearInterest)}$.`,`This matches the given interest, so the rate is ${rateMath(solution)}.`);
      exam.push(`Option check: $P\\times r\\times(1+r)^{${r.targetYear-1}}=${moneyPlain(r.nthYearInterest)}\\Rightarrow r=${ratePlain(solution)}\\%$.`);
      foundation.push(`At the correct rate, first-year interest is $P\\times r$.`,`That yearly interest itself grows by the annual factor until year $${r.targetYear}$.`,`The matching rate is ${rateMath(solution)}.`);
      verification={method:"Direct substitution",steps:[`Substitution gives exactly ${moneyMath(r.nthYearInterest)}, not a rounded approximation.`]};
      commonMistake="Using $I/P$ directly ignores the growth of the balance before the requested year.";break;
    }
    case"INT-QL-062":{
      keyIdea="Undo one year's growth by dividing the current balance by the annual factor.";
      steps.push(`Annual factor: ${annualFactorText(r.ratePercent)}.`,`Previous balance $=${moneyPlain(r.currentAmount)}\\div${fractionLatex(f)}=${moneyPlain(solution)}$.`);
      exam.push(`$A_{t-1}=A_t/(1+r)=${moneyPlain(solution)}$.`);
      foundation.push(`The previous balance grows by ${rateMath(r.ratePercent)} to become ${moneyMath(r.currentAmount)}.`,`Division by the growth factor returns ${moneyMath(solution)}.`);
      commonMistake="Subtracting the rate from the current amount is not the reverse of percentage growth.";break;
    }
    case"INT-QL-063":{
      keyIdea="The one-year interest is the increase in balance, and its percentage base is the opening balance.";
      const opening=amount(r.principal,r.ratePercent,r.currentYear-1),increase=sub(r.currentAmount,opening);steps.push(`One-year interest: $${moneyPlain(r.currentAmount)}-${moneyPlain(opening)}=${moneyPlain(increase)}$.`,`Rate $=\\frac{${moneyPlain(increase)}}{${moneyPlain(opening)}}\\times100=${ratePlain(solution)}\\%$.`);
      exam.push(`$r=(A_t-A_{t-1})/A_{t-1}\\times100=${ratePlain(solution)}\\%$.`);
      foundation.push(`Opening balance: ${moneyMath(opening)}.`,`Closing balance: ${moneyMath(r.currentAmount)}.`,`The increase is ${moneyMath(increase)}, which is ${rateMath(solution)} of the opening balance.`);
      commonMistake="Dividing by the closing balance gives a smaller, incorrect percentage.";break;
    }
    case"INT-QL-064":{
      keyIdea="First obtain the annual factor from consecutive balances, then reverse the earlier observation to the original deposit.";
      const ratio=div(r.nextAmount,r.currentAmount),reverse=div(rat(1),pow(ratio,r.currentYear));steps.push(`Annual factor: $${moneyPlain(r.nextAmount)}\\div${moneyPlain(r.currentAmount)}=${fractionLatex(ratio)}$.`,`Original principal: $${moneyPlain(r.currentAmount)}\\times${fractionLatex(reverse)}=${moneyPlain(solution)}$.`);
      exam.push(`$f=A_{t+1}/A_t=${fractionLatex(ratio)},\\;P=A_t/f^t=${moneyPlain(solution)}$.`);
      foundation.push(`The two observations reveal how much the account multiplies in one year.`,`Undo that same multiplier $${r.currentYear}$ time${r.currentYear===1?"":"s"} from the earlier observation.`);
      commonMistake="The first observed amount is not the original principal unless it is the year-zero balance.";break;
    }
    case"INT-QL-065":{
      keyIdea=r.laterYear-r.earlierYear===1?`The difference between consecutive year-end amounts is exactly the interest earned in the later year.`:"Calculate both required year-end amounts from the same principal, then subtract.";
      if(r.laterYear-r.earlierYear===1){steps.push(`Amount after $${r.earlierYear}$ years: $${moneyPlain(r.principal)}\\times(${fractionLatex(f)})^{${r.earlierYear}}=${moneyPlain(r.earlierAmount)}$.`,`Required difference $=${rateMath(r.ratePercent)}$ of ${moneyMath(r.earlierAmount)} $=${moneyPlain(solution)}$.`);shortcut={title:"Treat the difference as the next year's interest",steps:[`Do not calculate both full amounts. Take ${rateMath(r.ratePercent)} of the earlier year-end amount.`]};}
      else steps.push(`Earlier amount: $${moneyPlain(r.principal)}\\times(${fractionLatex(f)})^{${r.earlierYear}}=${moneyPlain(r.earlierAmount)}$.`,`Later amount: $${moneyPlain(r.principal)}\\times(${fractionLatex(f)})^{${r.laterYear}}=${moneyPlain(r.laterAmount)}$.`,`Difference $=${moneyPlain(r.laterAmount)}-${moneyPlain(r.earlierAmount)}=${moneyPlain(solution)}$.`);
      exam.push(`$A_${r.laterYear}-A_${r.earlierYear}=${moneyPlain(solution)}$.`);
      foundation.push(`Build only the two requested balances.`,`Subtract the earlier balance from the later balance.`);
      commonMistake="Do not use simple interest on the original principal for the year gap; the balance has already grown.";break;
    }
    case"INT-QL-066":{
      keyIdea="Successive yearly interests form a geometric progression with the same annual factor as the account balance.";
      const gap=r.laterYear-r.earlierYear,multiplier=pow(f,gap);steps.push(`Year gap: $${r.laterYear}-${r.earlierYear}=${gap}$.`,`Interest multiplier: $(${fractionLatex(f)})^{${gap}}=${fractionLatex(multiplier)}$.`,`Later-year interest: $${moneyPlain(r.earlierInterest)}\\times${fractionLatex(multiplier)}=${moneyPlain(solution)}$.`);
      exam.push(`$I_${r.laterYear}=I_${r.earlierYear}(1+r)^{${gap}}=${moneyPlain(solution)}$.`);
      foundation.push(...Array.from({length:gap+1},(_,i)=>`Interest in year $${r.earlierYear+i}$: ${moneyMath(yearlyInterest(r.principal,r.ratePercent,r.earlierYear+i))}.`));
      shortcut={title:"Use the yearly-interest GP",steps:[`Multiply the earlier year's interest by the annual factor once for each year gap.`]};
      commonMistake="Keeping yearly interest constant would be simple-interest reasoning.";break;
    }
  }
  return Object.freeze({keyIdea,steps:Object.freeze(steps),finalAnswer:`Therefore, the answer is ${finalAnswer}.`,...(shortcut?{shortcut:Object.freeze({title:shortcut.title,steps:Object.freeze([...shortcut.steps])})}:{}),...(commonMistake?{commonMistake}:{}),...(verification?{verification:Object.freeze({method:verification.method,steps:Object.freeze([...verification.steps])})}:{}),depths:Object.freeze({exam:Object.freeze({steps:Object.freeze(exam)}),student:Object.freeze({steps:Object.freeze([keyIdea,...steps])}),foundation:Object.freeze({steps:Object.freeze(foundation)})})});
}
