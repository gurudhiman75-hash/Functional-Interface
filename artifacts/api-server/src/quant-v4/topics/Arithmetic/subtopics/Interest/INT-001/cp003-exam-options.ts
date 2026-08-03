import { add, amount, canonicalAnswer, compoundInterest, div, eq, factor, hash, mul, pow, rat, sub, verifyAnswer, yearlyInterest, type Cp003AnswerSemantic, type Cp003MathematicalState, type Cp003QuestionContract, type Rational } from "./cp003-exam-model";
import type { Cp003Option } from "./cp003-exam-types";
import { ANSWER_SEMANTICS, answerText, moneyPlain, round, type ResolvedState } from "./cp003-exam-support";

interface WrongCandidate { value:Rational; misconceptionId:string; calculation:string; feedback:string }
function candidateWrongs(state:Cp003MathematicalState,r:ResolvedState):WrongCandidate[] {
  const f=factor(r.ratePercent), growth=sub(div(r.amount,r.principal),rat(1)), rateFraction=div(r.ratePercent,rat(100));
  switch(state.qlId){
    case"INT-QL-053": return [
      {value:r.compoundInterest,misconceptionId:"INTEREST_ONLY_REPORTED_TRAP",calculation:`$${moneyPlain(r.amount)}-${moneyPlain(r.principal)}$`,feedback:"This is only the compound interest, not the final amount."},
      {value:mul(r.principal,add(rat(1),mul(rateFraction,rat(r.years)))),misconceptionId:"SIMPLE_INTEREST_APPLIED_TRAP",calculation:`$P(1+nr)$`,feedback:"This uses simple interest instead of annual compounding."},
      {value:amount(r.principal,r.ratePercent,1),misconceptionId:"SINGLE_PERIOD_COMPOUNDING_TRAP",calculation:`$P\\left(1+\\frac{r}{100}\\right)$`,feedback:"This compounds for only one year."},
    ];
    case"INT-QL-054": return [
      {value:r.amount,misconceptionId:"AMOUNT_REPORTED_INSTEAD_OF_INTEREST_TRAP",calculation:`$A$`,feedback:"This reports the maturity amount instead of the interest earned."},
      {value:mul(r.principal,mul(rateFraction,rat(r.years))),misconceptionId:"SIMPLE_INTEREST_APPLIED_TRAP",calculation:`$P\\times r\\times n$`,feedback:"This is the simple interest for the same period."},
      {value:yearlyInterest(r.principal,r.ratePercent,1),misconceptionId:"FIRST_YEAR_INTEREST_ONLY_TRAP",calculation:`$P\\times r$`,feedback:"This is only the first-year interest."},
    ];
    case"INT-QL-055": return [
      {value:r.amount,misconceptionId:"GIVEN_AMOUNT_COPIED_TRAP",calculation:"Copies the given maturity amount.",feedback:"The final amount is not the original principal."},
      {value:div(r.amount,add(rat(1),mul(rateFraction,rat(r.years)))),misconceptionId:"SIMPLE_INTEREST_REVERSE_TRAP",calculation:`$A\\div(1+nr)$`,feedback:"This reverses a simple-interest amount."},
      {value:div(r.amount,pow(f,Math.max(1,r.years-1))),misconceptionId:"GROWTH_PERIOD_UNDERCOUNT_TRAP",calculation:`$A\\div f^{${Math.max(1,r.years-1)}}$`,feedback:"This reverses one fewer annual increase."},
    ];
    case"INT-QL-056": return [
      {value:r.compoundInterest,misconceptionId:"GIVEN_INTEREST_COPIED_TRAP",calculation:"Copies the given compound interest.",feedback:"Interest and principal are different quantities."},
      {value:div(r.compoundInterest,mul(rateFraction,rat(r.years))),misconceptionId:"SIMPLE_INTEREST_INVERSE_TRAP",calculation:`$CI\\div(nr)$`,feedback:"This treats the given compound interest as simple interest."},
      {value:div(r.compoundInterest,rateFraction),misconceptionId:"SINGLE_PERIOD_ASSUMPTION_TRAP",calculation:`$CI\\div r$`,feedback:"This assumes the entire interest was earned in one year."},
      {value:div(r.compoundInterest,pow(f,r.years)),misconceptionId:"INTEREST_TREATED_AS_AMOUNT_TRAP",calculation:`$CI\\div f^n$`,feedback:"This incorrectly treats the given interest as if it were the maturity amount."},
      {value:div(r.compoundInterest,sub(pow(f,r.years+1),rat(1))),misconceptionId:"EXTRA_COMPOUND_PERIOD_INVERSE_TRAP",calculation:`$CI\\div(f^{n+1}-1)$`,feedback:"This reverses one extra compound period."},
      {value:div(r.compoundInterest,sub(pow(f,Math.max(1,r.years-1)),rat(1))),misconceptionId:"FEWER_COMPOUND_PERIOD_INVERSE_TRAP",calculation:`$CI\\div(f^{n-1}-1)$`,feedback:"This reverses one fewer compound period."},
    ];
    case"INT-QL-057": return [
      {value:div(mul(growth,rat(100)),rat(r.years)),misconceptionId:"LINEAR_RATE_AVERAGING_TRAP",calculation:`$\\frac{(A/P-1)\\times100}{n}$`,feedback:"This spreads total growth equally as if the growth were linear."},
      {value:mul(growth,rat(100)),misconceptionId:"TOTAL_GROWTH_AS_ANNUAL_RATE_TRAP",calculation:`$(A/P-1)\\times100$`,feedback:"This reports the total multi-year growth as the annual rate."},
      {value:div(mul(div(sub(r.amount,r.principal),r.amount),rat(100)),rat(r.years)),misconceptionId:"CLOSING_AMOUNT_AS_RATE_BASE_TRAP",calculation:`$\\frac{A-P}{A\\times n}\\times100$`,feedback:"This incorrectly uses the closing amount as the percentage base."},
    ];
    case"INT-QL-058": return [
      {value:div(mul(growth,rat(100)),r.ratePercent),misconceptionId:"LINEAR_TIME_ASSUMPTION_TRAP",calculation:`$\\frac{(A/P-1)\\times100}{r}$`,feedback:"This uses the simple-interest time relation."},
      {value:rat(Math.max(1,r.years-1)),misconceptionId:"GROWTH_PERIOD_UNDERCOUNT_TRAP",calculation:`$n-1$`,feedback:"This stops one complete year too early."},
      {value:rat(r.years+1),misconceptionId:"GROWTH_PERIOD_OVERCOUNT_TRAP",calculation:`$n+1$`,feedback:"This counts one extra year."},
      {value:rat(r.years*2),misconceptionId:"HALF_YEAR_PERIOD_COUNT_TRAP",calculation:`$2n$`,feedback:"This counts half-year periods even though compounding is annual."},
      {value:rat(r.years+2),misconceptionId:"TWO_EXTRA_PERIODS_TRAP",calculation:`$n+2$`,feedback:"This counts two additional annual periods."},
    ];
    case"INT-QL-059": return [
      {value:yearlyInterest(r.principal,r.ratePercent,1),misconceptionId:"FIRST_YEAR_INTEREST_TRAP",calculation:`$P\\times r$`,feedback:"This is the first-year interest, not the requested year's interest."},
      {value:yearlyInterest(r.principal,r.ratePercent,Math.max(1,r.targetYear-1)),misconceptionId:"PREVIOUS_YEAR_INTEREST_TRAP",calculation:`$I_{${Math.max(1,r.targetYear-1)}}$`,feedback:"This uses the previous year's interest."},
      {value:compoundInterest(r.principal,r.ratePercent,r.targetYear),misconceptionId:"CUMULATIVE_INTEREST_REPORTED_TRAP",calculation:`$A_{${r.targetYear}}-P$`,feedback:"This is total interest up to that year, not interest during that year alone."},
      {value:yearlyInterest(r.principal,r.ratePercent,r.targetYear+1),misconceptionId:"NEXT_YEAR_INTEREST_TRAP",calculation:`$I_{${r.targetYear+1}}$`,feedback:"This uses the following year's interest."},
      {value:amount(r.principal,r.ratePercent,r.targetYear-1),misconceptionId:"OPENING_BALANCE_REPORTED_TRAP",calculation:`$A_{${r.targetYear-1}}$`,feedback:"This reports the opening balance of the requested year instead of that year's interest."},
      {value:mul(r.principal,mul(rateFraction,rat(r.targetYear))),misconceptionId:"SIMPLE_CUMULATIVE_INTEREST_TRAP",calculation:`$P\\times r\\times n$`,feedback:"This calculates simple interest accumulated over the years."},
    ];
    case"INT-QL-060": return [
      {value:div(r.nthYearInterest,rateFraction),misconceptionId:"FIRST_YEAR_INVERSE_TRAP",calculation:`$I_n\\div r$`,feedback:"This treats the observed interest as first-year interest."},
      {value:div(r.nthYearInterest,mul(rateFraction,pow(f,r.targetYear))),misconceptionId:"EXTRA_GROWTH_FACTOR_TRAP",calculation:`$I_n\\div(rf^n)$`,feedback:"This reverses one extra annual factor."},
      {value:div(r.nthYearInterest,mul(rateFraction,rat(r.targetYear))),misconceptionId:"SIMPLE_YEAR_MULTIPLIER_TRAP",calculation:`$I_n\\div(nr)$`,feedback:"This replaces compound growth with a simple year multiplier."},
    ];
    case"INT-QL-061": return [
      {value:mul(div(r.nthYearInterest,r.principal),rat(100)),misconceptionId:"FIRST_YEAR_RATE_ASSUMPTION_TRAP",calculation:`$I_n/P\\times100$`,feedback:"This treats the requested year's interest as first-year interest."},
      {value:div(mul(div(r.nthYearInterest,r.principal),rat(100)),rat(r.targetYear)),misconceptionId:"YEAR_DIVISION_RATE_TRAP",calculation:`$I_n/(P\\times n)\\times100$`,feedback:"This divides by the year number as if interest grew linearly."},
      {value:mul(div(r.nthYearInterest,add(r.principal,r.nthYearInterest)),rat(100)),misconceptionId:"CLOSING_BALANCE_AS_RATE_BASE_TRAP",calculation:`$I_n/(P+I_n)\\times100$`,feedback:"This uses a closing-style balance instead of the correct opening balance."},
    ];
    case"INT-QL-062": return [
      {value:r.currentAmount,misconceptionId:"LATER_BALANCE_COPIED_TRAP",calculation:"Copies the given later balance.",feedback:"The question asks for the previous year's balance."},
      {value:mul(r.currentAmount,sub(rat(1),rateFraction)),misconceptionId:"SUBTRACT_RATE_INSTEAD_OF_DIVIDE_TRAP",calculation:`$A(1-r)$`,feedback:"Reversing compound growth requires division by the factor, not subtracting the rate."},
      {value:div(r.currentAmount,sub(rat(1),rateFraction)),misconceptionId:"DEPRECIATION_INVERSE_TRAP",calculation:`$A\\div(1-r)$`,feedback:"This uses a depreciation factor instead of a growth factor."},
    ];
    case"INT-QL-063": {
      const opening=amount(r.principal,r.ratePercent,r.currentYear-1),increase=sub(r.currentAmount,opening);
      return [
        {value:mul(div(increase,r.currentAmount),rat(100)),misconceptionId:"CLOSING_BALANCE_AS_BASE_TRAP",calculation:`$\\frac{\\text{increase}}{\\text{closing balance}}\\times100$`,feedback:"The percentage must be based on the opening balance."},
        {value:mul(div(increase,div(add(opening,r.currentAmount),rat(2))),rat(100)),misconceptionId:"AVERAGE_BALANCE_AS_BASE_TRAP",calculation:`$\\frac{\\text{increase}}{\\text{average balance}}\\times100$`,feedback:"Compound interest for the year is calculated on the opening balance, not the average balance."},
        {value:div(r.ratePercent,rat(r.currentYear+1)),misconceptionId:"ELAPSED_YEARS_DIVISION_TRAP",calculation:`$r/(t+1)$`,feedback:"This wrongly divides the one-year rate by the number of elapsed years."},
      ];
    }
    case"INT-QL-064": return [
      {value:r.currentAmount,misconceptionId:"OBSERVED_AMOUNT_AS_PRINCIPAL_TRAP",calculation:"Copies the observed year-end amount.",feedback:"The observed amount already includes compound growth."},
      {value:div(r.currentAmount,pow(f,r.currentYear+1)),misconceptionId:"EXTRA_REVERSE_PERIOD_TRAP",calculation:`$A_t\\div f^{t+1}$`,feedback:"This reverses one extra year."},
      {value:div(r.nextAmount,pow(f,r.currentYear)),misconceptionId:"INSUFFICIENT_REVERSE_PERIOD_TRAP",calculation:`$A_{t+1}\\div f^t$`,feedback:"This reverses one fewer year from the later observation."},
      {value:div(r.currentAmount,add(rat(1),mul(div(r.ratePercent,rat(100)),rat(r.currentYear)))),misconceptionId:"SIMPLE_INTEREST_REVERSE_TRAP",calculation:`$A_t\\div(1+tr)$`,feedback:"This reverses the observation using a simple-interest multiplier."},
      {value:sub(r.nextAmount,r.currentAmount),misconceptionId:"ANNUAL_INCREASE_AS_PRINCIPAL_TRAP",calculation:`$A_{t+1}-A_t$`,feedback:"This mistakes one year's interest for the original principal."},
      {value:div(r.nextAmount,pow(f,r.currentYear+2)),misconceptionId:"TWO_EXTRA_REVERSE_PERIODS_TRAP",calculation:`$A_{t+1}\\div f^{t+2}$`,feedback:"This reverses two extra annual periods."},
    ];
    case"INT-QL-065": return [
      {value:compoundInterest(r.principal,r.ratePercent,r.laterYear),misconceptionId:"LATER_CUMULATIVE_INTEREST_TRAP",calculation:`$A_${r.laterYear}-P$`,feedback:"This is total interest up to the later year, not the difference between the two amounts."},
      {value:compoundInterest(r.principal,r.ratePercent,r.earlierYear),misconceptionId:"EARLIER_CUMULATIVE_INTEREST_TRAP",calculation:`$A_${r.earlierYear}-P$`,feedback:"This is total interest up to the earlier year."},
      {value:mul(r.principal,mul(rateFraction,rat(r.laterYear-r.earlierYear))),misconceptionId:"SIMPLE_INTEREST_INTERVAL_TRAP",calculation:`$P\\times r\\times(${r.laterYear-r.earlierYear})$`,feedback:"This uses simple interest over the gap and ignores the grown balance."},
      {value:r.laterAmount,misconceptionId:"LATER_AMOUNT_REPORTED_TRAP",calculation:`$A_${r.laterYear}$`,feedback:"This reports the later amount instead of the difference."},
      {value:yearlyInterest(r.principal,r.ratePercent,r.earlierYear),misconceptionId:"EARLIER_YEAR_INTEREST_TRAP",calculation:`$I_${r.earlierYear}$`,feedback:"This uses the earlier year's interest instead of the amount difference."},
      {value:sub(r.laterAmount,r.principal),misconceptionId:"TOTAL_INTEREST_TO_LATER_YEAR_TRAP",calculation:`$A_${r.laterYear}-P$`,feedback:"This gives total compound interest up to the later year."},
    ];
    case"INT-QL-066": return [
      {value:r.earlierInterest,misconceptionId:"FLAT_SIMPLE_INTEREST_ASSUMPTION_TRAP",calculation:"Keeps yearly interest unchanged.",feedback:"Under compound interest, the balance and yearly interest both grow."},
      {value:sub(r.laterInterest,r.earlierInterest),misconceptionId:"INCREMENT_ONLY_REPORTED_TRAP",calculation:`$I_${r.laterYear}-I_${r.earlierYear}$`,feedback:"This reports only the increase in yearly interest."},
      {value:mul(r.earlierInterest,pow(f,r.laterYear-r.earlierYear+1)),misconceptionId:"EXTRA_GROWTH_STEP_TRAP",calculation:`$I_${r.earlierYear}f^{${r.laterYear-r.earlierYear+1}}$`,feedback:"This applies one extra annual growth step."},
    ];
  }
}
function normalizedOptionValue(semantic:Cp003AnswerSemantic,value:Rational):Rational {
  if(semantic==="MONEY"||semantic==="PRINCIPAL")return round(value,0);
  if(semantic==="RATE_PERCENT")return round(value,2);
  return rat(Math.max(1,Math.round(Number(value.numerator)/Number(value.denominator))));
}
export function optionsFor(contract:Cp003QuestionContract,r:ResolvedState):readonly Cp003Option[] {
  const semantic=ANSWER_SEMANTICS[contract.qlId],solution=canonicalAnswer(contract.mathematicalState);
  const candidates=candidateWrongs(contract.mathematicalState,r),wrong: Cp003Option[]=[];
  for(const candidate of candidates){
    const value=normalizedOptionValue(semantic,candidate.value);
    if(value.numerator<=0n||eq(value,solution)||verifyAnswer(contract.mathematicalState,value)||wrong.some(option=>eq(option.value,value)))continue;
    wrong.push(Object.freeze({text:answerText(semantic,value),value,misconceptionId:candidate.misconceptionId,calculation:candidate.calculation,studentFeedback:candidate.feedback,isCorrect:false}));
  }
  if(wrong.length<3)throw new Error(`${contract.qlId}: only ${wrong.length} valid misconception options`);
  const correct:Cp003Option=Object.freeze({text:answerText(semantic,solution),value:solution,misconceptionId:"CORRECT",calculation:"Satisfies the complete compound-interest state.",studentFeedback:"Correct.",isCorrect:true});
  const items=[correct,...wrong.slice(0,3)];
  let state=hash(`${contract.seed}:${contract.qlId}:option-shuffle`);
  for(let index=items.length-1;index>0;index--){state^=state<<13;state^=state>>>17;state^=state<<5;const target=(state>>>0)%(index+1);[items[index],items[target]]=[items[target]!,items[index]!];}
  return Object.freeze(items);
}
