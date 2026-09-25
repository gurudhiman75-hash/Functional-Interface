import type { EcoCp027SourceId } from "./eco-cp027-sources";
export type EcoCp027Fact={id:string;fact:string;sourceIds:EcoCp027SourceId[]};
export const ECO_CP027_FACTS_V1:EcoCp027Fact[]=[
{id:"derivative",fact:"A derivative is a financial instrument whose value is derived from an underlying security, commodity, currency or other financial instrument.",sourceIds:["SEBI-DERIVATIVES"]},
{id:"futures",fact:"A futures contract is a standardised exchange-traded contract to buy or sell an underlying product at a predetermined price on a future date.",sourceIds:["SEBI-DERIVATIVES"]},
{id:"option",fact:"An option gives the buyer the right, but not the obligation, to exercise at a predetermined price and date or period.",sourceIds:["SEBI-DERIVATIVES"]},
{id:"call",fact:"A call option gives the buyer the right to buy the underlying security.",sourceIds:["SEBI-DERIVATIVES"]},
{id:"put",fact:"A put option gives the buyer the right to sell the underlying security.",sourceIds:["SEBI-DERIVATIVES"]},
{id:"premium",fact:"The buyer of an option pays a premium for the option contract.",sourceIds:["SEBI-DERIVATIVES"]},
{id:"hedging",fact:"Derivatives can be used to manage or hedge price risk as well as for other market strategies.",sourceIds:["SEBI-DERIVATIVES","SEBI-EDUCATION"]},
];
