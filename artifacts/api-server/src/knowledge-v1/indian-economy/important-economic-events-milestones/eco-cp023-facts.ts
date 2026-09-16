export interface EcoCp023Fact {
  id: string;
  fact: string;
  sourceIds: string[];
}

export const ECO_CP023_FACTS_V1: EcoCp023Fact[] = [
  { id: "rbi-nationalised-1949", fact: "The Reserve Bank of India was nationalised with effect from 1 January 1949.", sourceIds: ["RBI-NATIONALISATION-HISTORY"] },
  { id: "planning-commission-1950", fact: "The Planning Commission was established by Government Resolution on 15 March 1950.", sourceIds: ["NITI-PLANNING-TRANSITION"] },
  { id: "sbi-1955", fact: "The State Bank of India Act, 1955 constituted SBI and transferred to it the undertaking of the Imperial Bank of India.", sourceIds: ["SBI-ACT-1955"] },
  { id: "banks-1969", fact: "Fourteen major commercial banks were nationalised in 1969.", sourceIds: ["RBI-BANK-NATIONALISATION"] },
  { id: "banks-1980", fact: "Six more commercial banks were nationalised in 1980.", sourceIds: ["RBI-BANK-NATIONALISATION"] },
  { id: "nabard-1982", fact: "NABARD was established on 12 July 1982 by an Act of Parliament as an apex development bank for agriculture and rural development.", sourceIds: ["NABARD-CHARTER"] },
  { id: "bop-crisis-1991", fact: "The balance-of-payments crisis of 1991 prompted wide-ranging economic reforms and liberalisation.", sourceIds: ["RBI-1991-REFORMS"] },
  { id: "sebi-1988", fact: "SEBI was constituted as a non-statutory body on 12 April 1988.", sourceIds: ["SEBI-ABOUT"] },
  { id: "sebi-statutory-1992", fact: "SEBI became a statutory body in 1992 under the SEBI Act, 1992.", sourceIds: ["SEBI-ABOUT"] },
  { id: "lerms-1992", fact: "LERMS introduced a transitional dual exchange-rate system in 1992.", sourceIds: ["RBI-EXCHANGE-REFORMS"] },
  { id: "unified-rate-1993", fact: "India moved to a unified market-determined exchange rate in 1993.", sourceIds: ["RBI-EXCHANGE-REFORMS"] },
  { id: "current-convertibility-1994", fact: "India accepted current-account convertibility in 1994.", sourceIds: ["RBI-EXCHANGE-REFORMS"] },
  { id: "wto-1995", fact: "India has been a WTO member since 1 January 1995.", sourceIds: ["WTO-INDIA-MEMBER"] },
  { id: "frbm-2003", fact: "The Fiscal Responsibility and Budget Management Act was enacted in 2003.", sourceIds: ["INDIACODE-FRBM"] },
  { id: "frbm-2004", fact: "The FRBM Act came into force on 5 July 2004.", sourceIds: ["INDIACODE-FRBM"] },
  { id: "niti-2015", fact: "NITI Aayog was constituted by Union Cabinet Resolution with effect from 1 January 2015, superseding the 1950 Planning Commission resolution.", sourceIds: ["NITI-PLANNING-TRANSITION"] },
  { id: "gst-amendment-2016", fact: "The Constitution (One Hundred and First Amendment) Act, 2016 created the constitutional framework for GST.", sourceIds: ["CBIC-GST-101"] },
  { id: "gst-launch-2017", fact: "GST was launched on 1 July 2017.", sourceIds: ["CBIC-GST-LAUNCH"] },
];
