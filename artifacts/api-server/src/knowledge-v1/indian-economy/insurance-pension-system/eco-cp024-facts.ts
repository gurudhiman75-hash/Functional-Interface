import type { EcoCp024SourceId } from "./eco-cp024-sources";

export type EcoCp024Fact = { id: string; fact: string; sourceIds: EcoCp024SourceId[] };

export const ECO_CP024_FACTS_V1: EcoCp024Fact[] = [
  { id: "insurance-pooling", fact: "Insurance pools risks: policyholders pay premiums and covered losses are paid according to policy terms.", sourceIds: ["IRDAI-DUTIES"] },
  { id: "life-general", fact: "Life insurance covers life-related risks, while general insurance covers non-life risks such as property, motor and other contingencies.", sourceIds: ["IRDAI-EVOLUTION"] },
  { id: "lic-1956", fact: "India nationalised life insurance in 1956 and the Life Insurance Corporation of India came into existence that year.", sourceIds: ["IRDAI-EVOLUTION"] },
  { id: "general-nationalisation", fact: "General insurance business was nationalised with effect from 1 January 1973 under the General Insurance Business (Nationalisation) Act, 1972.", sourceIds: ["IRDAI-EVOLUTION"] },
  { id: "gic-1973", fact: "General Insurance Corporation of India commenced business on 1 January 1973 as part of the nationalised general-insurance structure.", sourceIds: ["IRDAI-EVOLUTION"] },
  { id: "malhotra", fact: "The Government set up the R. N. Malhotra Committee in 1993 to recommend insurance-sector reforms; it submitted its report in 1994.", sourceIds: ["IRDAI-EVOLUTION"] },
  { id: "irdai-act", fact: "IRDA was constituted under the IRDA Act, 1999 and became a statutory body in 2000.", sourceIds: ["IRDAI-EVOLUTION", "IRDAI-DUTIES"] },
  { id: "irdai-role", fact: "IRDAI regulates, promotes and ensures orderly growth of insurance and reinsurance business and protects policyholders' interests.", sourceIds: ["IRDAI-DUTIES"] },
  { id: "solvency", fact: "IRDAI regulates insurer investments and maintenance of solvency margins.", sourceIds: ["IRDAI-DUTIES"] },
  { id: "reinsurance", fact: "Reinsurance is insurance for insurers: an insurer transfers part of its risk to another insurer or reinsurer.", sourceIds: ["IRDAI-DUTIES"] },
  { id: "pfrda-2003", fact: "The Interim Pension Fund Regulatory and Development Authority was established on 23 August 2003 to promote, develop and regulate the pension sector.", sourceIds: ["PFRDA-AUTHORITY"] },
  { id: "nps-2004", fact: "The National Pension System began on 1 January 2004 as a contributory pension system for new Central Government employees, except the Armed Forces.", sourceIds: ["PFRDA-AUTHORITY", "PFRDA-HISTORY"] },
  { id: "nps-2009", fact: "NPS was opened voluntarily to all citizens from 1 May 2009.", sourceIds: ["PFRDA-AUTHORITY", "PFRDA-HISTORY"] },
  { id: "pfrda-statutory", fact: "The PFRDA Act was enacted in 2013 and came into force on 1 February 2014, giving PFRDA statutory status.", sourceIds: ["PFRDA-AUTHORITY", "PFRDA-HISTORY"] },
  { id: "pfrda-role", fact: "PFRDA promotes old-age income security, develops and regulates pension funds and protects pension-scheme subscribers.", sourceIds: ["PFRDA-AUTHORITY"] },
];
