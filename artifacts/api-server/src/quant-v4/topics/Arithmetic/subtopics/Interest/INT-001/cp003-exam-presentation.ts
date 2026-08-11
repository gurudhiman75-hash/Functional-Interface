import type { Cp003QuestionContract, IntCp003QlId } from "./cp003-exam-model";
import type { Cp003RenderedPresentation, Cp003PresentationTable } from "./cp003-exam-types";
import { amount, yearlyInterest } from "./cp003-exam-model";
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
      if(rep==="GROWTH_RATIO"){
        leadText="Use the annual growth information shown below.";
        table={headers:["Annual multiplier","Number of years","Final amount","Original sum"],rows:[[factorText,`$${r.years}$`,moneyMath(r.amount),"?"]]};
      }else if(rep==="BANK_STATEMENT"){
        leadText="The opening entry is missing from this fixed-deposit statement.";
        table={headers:["Statement entry","Recorded value"],rows:[["Opening deposit","?"],["Term",`$${r.years}$ years`],["Annual rate",rateMath(r.ratePercent)],["Maturity credit",moneyMath(r.amount)]]};
      }else{
        leadText="The original deposit is missing from the account table.";
        table={headers:["Original sum","Rate","Years","Amount"],rows:[["?",rateMath(r.ratePercent),String(r.years),moneyMath(r.amount)]]};
      }
      prompt="Find the original sum.";break;
    case"INT-QL-056":
      if(rep==="GROWTH_RATIO"){
        leadText="The compound-interest factor is provided, but the original sum is missing.";
        table={headers:["CI factor","Given compound interest","Principal"],rows:[[`$(${factorText.slice(1,-1)})^{${r.years}}-1$`,moneyMath(r.compoundInterest),"?"]]};
      }else if(rep==="ACCOUNT_TABLE"){
        leadText="Read the compound-interest account details.";
        table={headers:["Annual rate","Time","Compound interest","Principal"],rows:[[rateMath(r.ratePercent),`$${r.years}$ years`,moneyMath(r.compoundInterest),"?"]]};
      }else{
        leadText="A compound-interest worksheet has one missing entry.";
        table={headers:["Principal","Annual rate","Time","Compound interest"],rows:[["?",rateMath(r.ratePercent),`$${r.years}$ years`,moneyMath(r.compoundInterest)]]};
      }
      prompt="Find the principal.";break;
    case"INT-QL-057":
      if(rep==="GROWTH_RATIO"){
        leadText="The total growth ratio is shown below.";
        table={headers:["Principal","Amount","Time","Two-sided ratio"],rows:[[moneyMath(r.principal),moneyMath(r.amount),`$${r.years}$ years`,`$\\frac{A}{P}=\\frac{${r.amount.numerator}}{${r.principal.numerator}}$`]]};
      }else if(rep==="BANK_STATEMENT"){
        leadText="Compare the opening and maturity entries in the deposit statement.";
        table={headers:["Statement date","Balance"],rows:[["Opening",moneyMath(r.principal)],[`After ${r.years} years`,moneyMath(r.amount)],["Annual rate","?"]]};
      }else{
        leadText="Use the account observations.";
        table={headers:["Opening deposit","Closing balance","Years","Annual rate"],rows:[[moneyMath(r.principal),moneyMath(r.amount),String(r.years),"?"]]};
      }
      prompt="Find the annual compound rate.";break;
    case"INT-QL-058":
      leadText=rep==="GROWTH_RATIO"?"Match the observed multiplier with repeated annual growth.":"The maturity year is missing.";
      table=rep==="BALANCE_LEDGER"?{headers:["Year","Balance"],rows:[["0",moneyMath(r.principal)],["?",moneyMath(r.amount)]]}:{headers:["Principal","Rate","Final amount","Time"],rows:[[moneyMath(r.principal),rateMath(r.ratePercent),moneyMath(r.amount),"?"]]};
      prompt="Find the number of years.";break;
    case"INT-QL-059":
      if(rep==="BALANCE_LEDGER"){
        leadText="The interest column is incomplete for the required year.";
        table={headers:["Year","Opening balance","Rate","Interest"],rows:[[ordinal(r.targetYear),moneyMath(amount(r.principal,r.ratePercent,r.targetYear-1)),rateMath(r.ratePercent),"?"]]};
      }else if(rep==="MISSING_ENTRY"){
        leadText="Fill the missing year-specific interest entry.";
        table={headers:["Known item","Value"],rows:[["Original principal",moneyMath(r.principal)],["Annual rate",rateMath(r.ratePercent)],["Required year",ordinal(r.targetYear)],["Interest during required year","?"]]};
      }else{
        leadText="Complete the yearly-interest account table.";
        table={headers:["Principal","Annual rate","Required year","Interest in that year"],rows:[[moneyMath(r.principal),rateMath(r.ratePercent),ordinal(r.targetYear),"?"]]};
      }
      prompt=`Find the interest earned during the ${ordinal(r.targetYear)} year.`;break;
    case"INT-QL-060":
      if(rep==="BALANCE_LEDGER"){
        leadText="Use the observed yearly interest to reconstruct the opening principal.";
        table={headers:["Observed year","Interest earned","Annual rate","Original principal"],rows:[[ordinal(r.targetYear),moneyMath(r.nthYearInterest),rateMath(r.ratePercent),"?"]]};
      }else if(rep==="MISSING_ENTRY"){
        leadText="One entry is missing from the inverse-interest record.";
        table={headers:["Record item","Value"],rows:[["Original principal","?"],["Annual rate",rateMath(r.ratePercent)],["Year of observed interest",ordinal(r.targetYear)],["Observed interest",moneyMath(r.nthYearInterest)]]};
      }else{
        leadText="The principal is missing from this annual-interest account table.";
        table={headers:["Principal","Rate","Year observed","Interest during that year"],rows:[["?",rateMath(r.ratePercent),ordinal(r.targetYear),moneyMath(r.nthYearInterest)]]};
      }
      prompt="Find the principal.";break;
    case"INT-QL-061":
      leadText=rep==="GROWTH_RATIO"?"Use the year-specific interest observation.":"The annual rate is missing from the ledger.";
      table={headers:["Principal","Year observed","Interest during that year","Annual rate"],rows:[[moneyMath(r.principal),ordinal(r.targetYear),moneyMath(r.nthYearInterest),"?"]]};
      prompt="Find the annual compound rate.";break;
    case"INT-QL-062":
      if(rep==="BALANCE_LEDGER"){
        leadText="Reverse the final transition in the annual balance ledger.";
        table={headers:["Year","Opening balance","Rate","Closing balance"],rows:[[String(r.currentYear),"?",rateMath(r.ratePercent),moneyMath(r.currentAmount)]]};
      }else if(rep==="BANK_STATEMENT"){
        leadText="The previous closing balance is missing from the bank statement.";
        table={headers:["Statement date","Closing balance"],rows:[[`End of year ${r.currentYear-1}`,"?"],[`End of year ${r.currentYear}`,moneyMath(r.currentAmount)],["Interest rate",rateMath(r.ratePercent)]]};
      }else{
        leadText="One year-end balance is missing from the record.";
        table={headers:["Record item","Value"],rows:[["Current year-end balance",moneyMath(r.currentAmount)],["Annual rate",rateMath(r.ratePercent)],["Previous year-end balance","?"]]};
      }
      prompt="Find the missing previous-year balance.";break;
    case"INT-QL-063":
      if(rep==="BALANCE_LEDGER"){
        leadText="Complete the rate column in the annual balance ledger.";
        table={headers:["Year","Opening balance","Interest","Closing balance","Rate"],rows:[[String(r.currentYear),moneyMath(amount(r.principal,r.ratePercent,r.currentYear-1)),moneyMath(yearlyInterest(r.principal,r.ratePercent,r.currentYear)),moneyMath(r.currentAmount),"?"]]};
      }else if(rep==="BANK_STATEMENT"){
        leadText="Infer the annual rate from two consecutive bank-statement balances.";
        table={headers:["Statement entry","Balance"],rows:[[`End of year ${r.currentYear-1}`,moneyMath(amount(r.principal,r.ratePercent,r.currentYear-1))],[`End of year ${r.currentYear}`,moneyMath(r.currentAmount)],["Annual rate","?"]]};
      }else{
        leadText="Use the one-year opening and closing balances.";
        table={headers:["Opening balance","Closing balance","Annual rate"],rows:[[moneyMath(amount(r.principal,r.ratePercent,r.currentYear-1)),moneyMath(r.currentAmount),"?"]]};
      }
      prompt="Find the annual compound rate.";break;
    case"INT-QL-064":
      if(rep==="GROWTH_RATIO"){
        leadText="Use the consecutive-balance ratio to reconstruct the original sum.";
        table={headers:["Amount at year t","Amount at year t+1","One-year ratio","Principal"],rows:[[moneyMath(r.currentAmount),moneyMath(r.nextAmount),`$\\frac{${r.nextAmount.numerator}}{${r.currentAmount.numerator}}$`,"?"]]};
      }else if(rep==="BALANCE_LEDGER"){
        leadText="The original row is missing from the annual balance ledger.";
        table={headers:["Year","Balance"],rows:[["0","?"],[String(r.currentYear),moneyMath(r.currentAmount)],[String(r.currentYear+1),moneyMath(r.nextAmount)]]};
      }else{
        leadText="The opening deposit is missing from the bank statement.";
        table={headers:["Statement entry","Balance"],rows:[["Opening deposit","?"],[`End of year ${r.currentYear}`,moneyMath(r.currentAmount)],[`End of year ${r.currentYear+1}`,moneyMath(r.nextAmount)]]};
      }
      prompt="Find the original deposit.";break;
    case"INT-QL-065":
      if(rep==="BALANCE_LEDGER"){
        leadText="Calculate the missing change between two year-end balances.";
        table={headers:["Year","Calculated balance"],rows:[[String(r.earlierYear),"to be calculated"],[String(r.laterYear),"to be calculated"],["Difference","?"]]};
      }else if(rep==="MISSING_ENTRY"){
        leadText="Complete the comparison record from the investment terms.";
        table={headers:["Principal","Rate","From year","To year","Amount difference"],rows:[[moneyMath(r.principal),rateMath(r.ratePercent),String(r.earlierYear),String(r.laterYear),"?"]]};
      }else{
        leadText="Use the investment terms to compare the two maturity dates.";
        table={headers:["Investment","Annual rate","Earlier duration","Later duration"],rows:[[moneyMath(r.principal),rateMath(r.ratePercent),`$${r.earlierYear}$ years`,`$${r.laterYear}$ years`]]};
      }
      prompt=`Find the difference between the amounts after $${r.earlierYear}$ and $${r.laterYear}$ years.`;break;
    case"INT-QL-066":
      if(rep==="GROWTH_RATIO"){
        leadText="Use the common annual multiplier of the yearly-interest sequence.";
        table={headers:["Earlier-year interest","Annual multiplier","Year gap","Later-year interest"],rows:[[moneyMath(r.earlierInterest),factorText,String(r.laterYear-r.earlierYear),"?"]]};
      }else if(rep==="BALANCE_LEDGER"){
        leadText="Complete the interest column of the annual ledger.";
        table={headers:["Year","Interest earned"],rows:[[ordinal(r.earlierYear),moneyMath(r.earlierInterest)],[ordinal(r.laterYear),"?"]]};
      }else{
        leadText="Fill the missing term in the yearly-interest progression.";
        table={headers:["Known term","Value"],rows:[[`${ordinal(r.earlierYear)}-year interest`,moneyMath(r.earlierInterest)],["Annual factor",factorText],[`${ordinal(r.laterYear)}-year interest`,"?"]]};
      }
      prompt=`Find the interest earned during the ${ordinal(r.laterYear)} year.`;break;
  }
  const markdown=[leadText,"",tableMarkdown(table!),"",prompt].filter(Boolean).join("\n");
  return Object.freeze({representation:rep,stemFamilyId:family,leadText,table:Object.freeze({headers:Object.freeze([...table!.headers]),rows:Object.freeze(table!.rows.map(row=>Object.freeze([...row])))}),prompt,markdown});
}
