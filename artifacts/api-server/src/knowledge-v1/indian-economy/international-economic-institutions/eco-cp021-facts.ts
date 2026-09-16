import type { EcoCp021SourceId } from "./eco-cp021-sources";

export type EcoCp021Fact = { id: string; fact: string; sourceIds: EcoCp021SourceId[] };

export const ECO_CP021_FACTS_V1: EcoCp021Fact[] = [
  { id: "bretton-woods", fact: "The IMF and IBRD were conceived at the Bretton Woods Conference in 1944.", sourceIds: ["IMF-ABOUT", "WORLD-BANK-IBRD"] },
  { id: "imf-role", fact: "The IMF promotes international monetary cooperation and financial stability and provides policy advice and financing to members facing external difficulties.", sourceIds: ["IMF-ABOUT", "IMF-ARTICLES"] },
  { id: "imf-surveillance", fact: "IMF surveillance monitors member economies and the international monetary system.", sourceIds: ["IMF-ARTICLES"] },
  { id: "sdr", fact: "Special Drawing Rights are an international reserve asset created by the IMF, not a currency used by the public.", sourceIds: ["IMF-ARTICLES"] },
  { id: "ibrd", fact: "IBRD provides loans, guarantees and advice mainly to middle-income and creditworthy lower-income countries.", sourceIds: ["WORLD-BANK-IBRD"] },
  { id: "ida", fact: "IDA provides concessional loans and grants to low-income countries.", sourceIds: ["WORLD-BANK-IDA"] },
  { id: "world-bank", fact: "IBRD and IDA together form the World Bank.", sourceIds: ["WORLD-BANK-IBRD", "WORLD-BANK-IDA"] },
  { id: "wto-founded", fact: "The WTO was established on 1 January 1995 after the Uruguay Round negotiations.", sourceIds: ["WTO-ABOUT"] },
  { id: "wto-role", fact: "The WTO administers trade agreements, provides a forum for negotiations, handles trade disputes and reviews trade policies.", sourceIds: ["WTO-ABOUT"] },
  { id: "adb", fact: "ADB was founded in 1966 and supports development in Asia and the Pacific through loans, grants, technical assistance and other finance.", sourceIds: ["ADB-ABOUT"] },
  { id: "aiib", fact: "AIIB began operations in 2016 and focuses on sustainable infrastructure in Asia and beyond.", sourceIds: ["AIIB-ABOUT"] },
  { id: "ndb", fact: "The New Development Bank was established in 2015 by BRICS countries to finance infrastructure and sustainable development.", sourceIds: ["NDB-ABOUT"] },
  { id: "imf-vs-world-bank", fact: "The IMF focuses on monetary and financial stability, while the World Bank focuses on long-term development finance and poverty reduction.", sourceIds: ["IMF-ABOUT", "WORLD-BANK-IBRD", "WORLD-BANK-IDA"] },
  { id: "wto-vs-imf", fact: "The WTO deals with multilateral trade rules; the IMF deals with monetary cooperation and external financial stability.", sourceIds: ["WTO-ABOUT", "IMF-ABOUT"] },
  { id: "adb-vs-aiib", fact: "ADB has a broad Asia-Pacific development mandate, while AIIB has a strong infrastructure-financing focus.", sourceIds: ["ADB-ABOUT", "AIIB-ABOUT"] },
];