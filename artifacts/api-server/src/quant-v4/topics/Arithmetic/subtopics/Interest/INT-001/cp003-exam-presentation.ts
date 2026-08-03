import type { Cp003QuestionContract, IntCp003QlId } from "./cp003-exam-model";
import type { Cp003RenderedPresentation, Cp003PresentationTable } from "./cp003-exam-types";
import { amount } from "./cp003-exam-model";
import { annualFactorText, moneyMath, ordinal, rateMath, tableMarkdown, type ResolvedState } from "./cp003-exam-support";

function prosePrompt(qlId:IntCp003QlId,r:ResolvedState,family:string):string {
  switch(qlId){
    case"INT-QL-053": return family==="MATURITY_VALUE"?`What will be the amount on ${moneyMath(r.principal)} after $${r.years}$ years at ${rateMath(r.ratePercent)} per annum, compounded annually?`:family==="INVESTMENT_OUTCOME"?`Find the amount obtained by investing ${moneyMath(r.principal)} at ${rateMath(r.ratePercent)} compound interest per annum for $${r.years}$ years.`:`A sum of ${moneyMath(r.principal)} is invested for $${r.years}$ years at ${rateMath(r.ratePercent)} per annum, compounded annually. Find the amount.`;
    case"INT-QL-054": return family==="INTEREST_EARNED"?`How much compound interest will ${moneyMath(r.principal)} earn in $${r.years}$ years at ${rateMath(r.ratePercent)} per annum?`:`Find the compound interest on ${moneyMath(r.principal)} for $${r.years}$ years at ${rateMath(r.ratePercent)} per annum, compounded annually.`;
    case"INT-QL-055": return family==="INITIAL_DEPOSIT"?`A fixed deposit grows to ${moneyMath(r.amount)} in $${r.years}$ years at ${rateMath(r.ratePercent)} per annum, compounded annually. What was deposited initially?`:`A sum amounts to ${moneyMath(r.amount)} in $${r.years}$ years at ${rateMath(r.ratePercent)} per annum, compounded annually. Find the original sum.`;
    case"INT-QL-056": return `The compound interest on a certain sum for $${r.years}$ years at ${rateMath(r.ratePercent)} per annum is ${moneyMath(r.compoundInterest)}. Find the principal.`;
    case"INT-QL-057": return family==="RATE_FROM_RATIO"?`Under annual compounding, ${moneyMath(r.principal)} becomes ${moneyMath(r.amount)} in $${r.years}$ years. What is the rate per annum?`:`A sum of ${moneyMath(r.principal)} amounts to ${moneyMath(r.amount)} in $${r.years}$ years at compound interest, compounded annually. Find the rate.`;
    case"INT-QL-058": return `In how many years will ${moneyMath(r.principal)} amount to ${moneyMath(r.amount)} at ${rateMath(r.ratePercent)} per annum, compounded annually?`;
    case"INT-QL-059": return `Find the interest earned during the ${ordinal(r.targetYear)} year on ${moneyMath(r.principal)} at ${rateMath(r.ratePercent)} per annum, compounded annually.`;
    case"INT-QL-060": return `The interest earned during the ${ordinal(r.targetYear)} year is ${moneyMath(r.nthYearInterest)} at ${rateMath(r.ratePercent)} compound interest per annum. Find the principal.`;
    case"INT-QL-061": return `The interest earned during the ${ordinal(r.targetYear)} year on ${moneyMath(r.principal)} is ${moneyMath(r.nthYearInterest)}. If interest is compounded annually, find the rate.`;
    case"INT-QL-062": return `An account has ${moneyMath(r.currentAmount)} at the end of year $${r.currentYear}$. If interest is compounded annually at ${rateMath(r.ratePercent)}, what was the balance one year earlier?`;
    case"INT-QL-063": return `An account balance rises from ${moneyMath(amount(r.principal,r.ratePercent,r.currentYear-1))} to ${moneyMath(r.currentAmount)} in one year. Find the annual compound rate.`;
    case"INT-QL-064": return `A sum amounts to ${moneyMath(r.currentAmount)} after $${r.currentYear}$ year${r.currentYear===1?"":"s"} and ${moneyMath(r.nextAmount)} after $${r.currentYear+1}$ years. Find the original sum.`;
    case"INT-QL-065": return `${moneyMath(r.principal)} is invested at ${rateMath(r.ratePercent)} per annum, compounded annually. Find the difference between the amounts after $${r.earlierYear}$ and $${r.laterYear}$ years.`;
    case"INT-QL-066": return `At ${rateMath(r.ratePercent)} annual compound interest, the interest during the ${ordinal(r.earlierYear)} year is ${moneyMath(r.earlierInterest)}. Find the interest during the ${ordinal(r.laterYear)} year.`;
  }
}

export function presentationFor(contract:Cp003QuestionContract,r:ResolvedState):Cp003RenderedPresentation {
  const rep=contract.presentation.representation,family=contract.presentation.stemFamilyId,qlId=contract.qlId;
  if(rep==="STANDARD_PROSE"){
    const prompt=prosePrompt(qlId,r,family);return Object.freeze({representation:rep,stemFamilyId:family,prompt,markdown:prompt});
  }
  let leadText:string|undefined,table:Cp003PresentationTable,prompt:string;
  const factorText=annualFactorText(r.ratePercent);
  switch(qlId){
    case"INT-QL-053":
      leadText=rep==="BANK_STATEMENT"?"The following fixed-deposit record is incomplete.":"Study the investment details.";
      table=rep==="BALANCE_LEDGER"?{headers:["Year","Opening balance","Annual rate","Closing balance"],rows:[["0",moneyMath(r.principal),rateMath(r.ratePercent),moneyMath(r.principal)],[String(r.years),"—",rateMath(r.ratePercent),"?"]]}:{headers:["Particular","Value"],rows:[["Principal",moneyMath(r.principal)],["Annual rate",rateMath(r.ratePercent)],["Time",`$${r.years}$ years`],["Maturity amount","?"]]};
      prompt="Find the missing maturity amount.";break;
    case"INT-QL-054":
      leadText="Complete the compound-interest record.";
      table=rep==="BALANCE_LEDGER"?{headers:["Item","Amount"],rows:[["Opening principal",moneyMath(r.principal)],[`Balance after ${r.years} years`,moneyMath(r.amount)],["Compound interest","?"]]}:{headers:["Principal","Rate","Time","Compound interest"],rows:[[moneyMath(r.principal),rateMath(r.ratePercent),`$${r.years}$ years`,"?"]]};
      prompt="Find the compound interest.";break;
    case"INT-QL-055":
      leadText=rep==="GROWTH_RATIO"?"Use the annual growth information shown below.":"The original deposit is missing from the record.";
      table=rep==="GROWTH_RATIO"?{headers:["Annual multiplier","Number of years","Final amount","Original sum"],rows:[[factorText,`$${r.years}$`,moneyMath(r.amount),"?"]]}:{headers:["Entry","Value"],rows:[["Original deposit","?"],["Rate",rateMath(r.ratePercent)],["Term",`$${r.years}$ years`],["Maturity value",moneyMath(r.amount)]]};
      prompt="Find the original sum.";break;
    case"INT-QL-056":
      leadText="A compound-interest worksheet has one missing entry.";
      table={headers:["Principal","Annual rate","Time","Compound interest"],rows:[["?",rateMath(r.ratePercent),`$${r.years}$ years`,moneyMath(r.compoundInterest)]]};
      prompt="Find the principal.";break;
    case"INT-QL-057":
      leadText=rep==="GROWTH_RATIO"?"The total growth ratio is shown below.":"Use the account observations.";
      table=rep==="GROWTH_RATIO"?{headers:["Principal","Amount","Time","Two-sided ratio"],rows:[[moneyMath(r.principal),moneyMath(r.amount),`$${r.years}$ years`,`$\\frac{A}{P}=\\frac{${r.amount.numerator}}{${r.principal.numerator}}$`]]}:{headers:["Opening deposit","Closing balance","Years","Annual rate"],rows:[[moneyMath(r.principal),moneyMath(r.amount),String(r.years),"?"]]};
      prompt="Find the annual compound rate.";break;
    case"INT-QL-058":
      leadText=rep==="GROWTH_RATIO"?"Match the observed multiplier with repeated annual growth.":"The maturity year is missing.";
      table=rep==="BALANCE_LEDGER"?{headers:["Year","Balance"],rows:[["0",moneyMath(r.principal)],["?",moneyMath(r.amount)]]}:{headers:["Principal","Rate","Final amount","Time"],rows:[[moneyMath(r.principal),rateMath(r.ratePercent),moneyMath(r.amount),"?"]]};
      prompt="Find the number of years.";break;
    case"INT-QL-059":
      leadText="Complete the yearly-interest entry.";
      table={headers:["Principal","Annual rate","Required year","Interest in that year"],rows:[[moneyMath(r.principal),rateMath(r.ratePercent),ordinal(r.targetYear),"?"]]};
      prompt=`Find the interest earned during the ${ordinal(r.targetYear)} year.`;break;
    case"INT-QL-060":
      leadText="The principal is missing from this annual-interest ledger.";
      table={headers:["Principal","Rate","Year observed","Interest during that year"],rows:[["?",rateMath(r.ratePercent),ordinal(r.targetYear),moneyMath(r.nthYearInterest)]]};
      prompt="Find the principal.";break;
    case"INT-QL-061":
      leadText=rep==="GROWTH_RATIO"?"Use the year-specific interest observation.":"The annual rate is missing from the ledger.";
      table={headers:["Principal","Year observed","Interest during that year","Annual rate"],rows:[[moneyMath(r.principal),ordinal(r.targetYear),moneyMath(r.nthYearInterest),"?"]]};
      prompt="Find the annual compound rate.";break;
    case"INT-QL-062":
      leadText="One year-end balance is missing from the statement.";
      table={headers:["Statement entry","Balance"],rows:[[`End of year ${r.currentYear-1}`,"?"],[`End of year ${r.currentYear}`,moneyMath(r.currentAmount)],["Annual rate",rateMath(r.ratePercent)]]};
      prompt="Find the missing previous-year balance.";break;
    case"INT-QL-063":
      leadText="Use the consecutive year-end balances.";
      table={headers:["Year-end","Opening balance","Closing balance","Rate"],rows:[[String(r.currentYear),moneyMath(amount(r.principal,r.ratePercent,r.currentYear-1)),moneyMath(r.currentAmount),"?"]]};
      prompt="Find the annual compound rate.";break;
    case"INT-QL-064":
      leadText="The opening deposit is missing from the bank statement.";
      table={headers:["Entry","Balance"],rows:[["Original deposit","?"],[`End of year ${r.currentYear}`,moneyMath(r.currentAmount)],[`End of year ${r.currentYear+1}`,moneyMath(r.nextAmount)]]};
      prompt="Find the original deposit.";break;
    case"INT-QL-065":
      leadText="The two required year-end balances are not supplied; calculate their difference from the investment terms.";
      table={headers:["Principal","Annual rate","Earlier year","Later year","Difference"],rows:[[moneyMath(r.principal),rateMath(r.ratePercent),String(r.earlierYear),String(r.laterYear),"?"]]};
      prompt=`Find the difference between the amounts after $${r.earlierYear}$ and $${r.laterYear}$ years.`;break;
    case"INT-QL-066":
      leadText="Complete the yearly-interest sequence.";
      table={headers:["Year","Interest earned"],rows:[[ordinal(r.earlierYear),moneyMath(r.earlierInterest)],[ordinal(r.laterYear),"?"]]};
      prompt=`Find the interest earned during the ${ordinal(r.laterYear)} year.`;break;
  }
  const markdown=[leadText,"",tableMarkdown(table!),"",prompt].filter(Boolean).join("\n");
  return Object.freeze({representation:rep,stemFamilyId:family,leadText,table:Object.freeze({headers:Object.freeze([...table!.headers]),rows:Object.freeze(table!.rows.map(row=>Object.freeze([...row])))}),prompt,markdown});
}
