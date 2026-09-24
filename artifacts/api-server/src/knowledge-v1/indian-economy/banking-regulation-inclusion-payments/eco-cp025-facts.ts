import type { EcoCp025SourceId } from "./eco-cp025-sources";
export type EcoCp025Fact = { id: string; fact: string; sourceIds: EcoCp025SourceId[] };
export const ECO_CP025_FACTS_V1: EcoCp025Fact[] = [
  { id:"basel-purpose", fact:"Basel capital standards are prudential rules designed to make banks hold capital against risks and strengthen resilience.", sourceIds:["RBI-BASEL-III"] },
  { id:"basel-india", fact:"Basel III capital regulations began to be implemented in India from 1 April 2013 in a phased manner.", sourceIds:["RBI-BASEL-III"] },
  { id:"capital-adequacy", fact:"Capital adequacy compares a bank's regulatory capital with risk-weighted exposures rather than treating all assets as equally risky.", sourceIds:["RBI-BASEL-III"] },
  { id:"pmjdy", fact:"PMJDY was launched on 28 August 2014 as a national mission for financial inclusion providing access to basic banking, remittance, credit, insurance and pension services.", sourceIds:["PMJDY-ABOUT"] },
  { id:"pmjdy-dbt", fact:"PMJDY accounts support access to Direct Benefit Transfer and basic banking through branches or Business Correspondents.", sourceIds:["PMJDY-ABOUT"] },
  { id:"pmmy", fact:"Pradhan Mantri MUDRA Yojana was launched on 8 April 2015 to provide institutional collateral-free credit to micro enterprises.", sourceIds:["DFS-PMMY"] },
  { id:"mudra-role", fact:"MUDRA supports the flow of credit to micro enterprises through member lending institutions rather than replacing banks as the sole direct lender.", sourceIds:["DFS-PMMY"] },
  { id:"shg-blp", fact:"NABARD launched the SHG-Bank Linkage Programme as a pilot in 1992 to connect self-help groups with formal financial institutions.", sourceIds:["NABARD-SHG"] },
  { id:"shg-purpose", fact:"SHG-Bank Linkage is a microfinance mechanism for extending formal financial services to unreached and underserved households.", sourceIds:["NABARD-SHG"] },
  { id:"upi", fact:"UPI is an instant payment system developed by NPCI and built over IMPS infrastructure for bank-to-bank transfers.", sourceIds:["NPCI-UPI"] },
  { id:"npcI", fact:"NPCI operates retail payment infrastructure including UPI; UPI transfers money directly between bank accounts.", sourceIds:["NPCI-UPI"] },
  { id:"rtgs", fact:"RTGS settles fund transfers continuously in real time and individually on a gross basis.", sourceIds:["RBI-RTGS"] },
  { id:"neft", fact:"NEFT is an electronic funds-transfer system in which transactions are processed in batches.", sourceIds:["RBI-CPS","RBI-RTGS"] },
  { id:"rbi-cps", fact:"RBI owns and operates the RTGS and NEFT centralised payment systems.", sourceIds:["RBI-CPS"] },
  { id:"pss-act", fact:"The Payment and Settlement Systems Act, 2007 provides for regulation and supervision of payment systems and designates RBI as the authority.", sourceIds:["RBI-PSS-ACT"] },
];
