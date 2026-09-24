import type { EcoCp024ReviewQuestion } from "./eco-cp024-review-types";

type Row = Omit<EcoCp024ReviewQuestion, "questionId" | "chapterId" | "cpId" | "qlId" | "qlName" | "correctIndex" | "reviewOnly" | "runtimeRegistered"> & { ql: number; answer: string; distractors: string[] };

const qlNames: Record<number, string> = {
  1: "Insurance concept and risk pooling",
  2: "Life and general insurance",
  3: "Insurance nationalisation and institutions",
  4: "IRDAI origin and functions",
  5: "Policyholder protection, solvency and reinsurance",
  6: "PFRDA and NPS evolution",
  7: "Insurance-pension regulatory distinctions",
};

const rows: Row[] = [
  { ql:1, difficulty:"Easy", stem:"What is the basic economic purpose of insurance?", answer:"Pooling financial risk across many policyholders", distractors:["Creating currency for policyholders","Fixing market interest rates","Guaranteeing profits on investments"], explanation:"Insurance spreads specified risks across a pool of policyholders. Premiums finance claims according to policy terms.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["insurance-pooling"], options:[], canonicalAnswer:"" },
  { ql:1, difficulty:"Easy", stem:"What does a policyholder pay to obtain insurance cover?", answer:"Premium", distractors:["Dividend","Coupon","Royalty"], explanation:"A premium is the amount paid for insurance cover under the policy.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["insurance-pooling"], options:[], canonicalAnswer:"" },
  { ql:1, difficulty:"Medium", stem:"A large number of people contribute small amounts so that covered losses of a few can be compensated. Which principle does this illustrate?", answer:"Risk pooling", distractors:["Currency creation","Tax devolution","Open-market operation"], explanation:"Insurance works by pooling risks and premiums across many policyholders.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["insurance-pooling"], options:[], canonicalAnswer:"" },
  { ql:1, difficulty:"Hard", stem:"Which statement correctly describes insurance?", answer:"It transfers specified financial risk to an insurer in return for a premium", distractors:["It eliminates every possible loss faced by the insured","It guarantees a positive investment return","It replaces the need for contracts"], explanation:"Insurance transfers covered risk under agreed policy terms. It does not remove every risk or guarantee investment profit.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["insurance-pooling"], options:[], canonicalAnswer:"" },

  { ql:2, difficulty:"Easy", stem:"Which type of insurance covers risks linked to human life?", answer:"Life insurance", distractors:["Marine insurance","Motor insurance","Fire insurance"], explanation:"Life insurance covers life-related risks. Motor, fire and marine covers belong to general insurance.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["life-general"], options:[], canonicalAnswer:"" },
  { ql:2, difficulty:"Easy", stem:"Motor insurance belongs to which broad category?", answer:"General insurance", distractors:["Life insurance","Pension regulation","Monetary insurance"], explanation:"Motor insurance is a non-life cover and therefore falls under general insurance.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["life-general"], options:[], canonicalAnswer:"" },
  { ql:2, difficulty:"Medium", stem:"Which pair is correctly matched?", answer:"Life insurance—life-related risk; general insurance—non-life risks", distractors:["Life insurance—only property risk; general insurance—only life risk","Life insurance—currency risk; general insurance—tax risk","Life insurance—trade disputes; general insurance—pension funds"], explanation:"Life and general insurance are distinguished by the broad type of risk covered.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["life-general"], options:[], canonicalAnswer:"" },
  { ql:2, difficulty:"Hard", stem:"A household wants cover for a person's life and separately for a car. Which combination is correct?", answer:"Life insurance for the person and general insurance for the car", distractors:["General insurance for both","Life insurance for both","Pension regulation for the person and life insurance for the car"], explanation:"Life cover belongs to life insurance, while motor cover belongs to general insurance.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["life-general"], options:[], canonicalAnswer:"" },

  { ql:3, difficulty:"Easy", stem:"In which year did the Life Insurance Corporation of India come into existence?", answer:"1956", distractors:["1949","1973","2000"], explanation:"Life insurance was nationalised in 1956 and LIC came into existence that year.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["lic-1956"], options:[], canonicalAnswer:"" },
  { ql:3, difficulty:"Easy", stem:"General insurance business in India was nationalised with effect from which date?", answer:"1 January 1973", distractors:["1 January 1956","1 January 1969","1 January 2000"], explanation:"General insurance nationalisation took effect on 1 January 1973.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["general-nationalisation"], options:[], canonicalAnswer:"" },
  { ql:3, difficulty:"Medium", stem:"Which sequence is chronologically correct?", answer:"LIC 1956 → general insurance nationalisation 1973 → IRDA statutory framework 1999-2000", distractors:["General insurance nationalisation 1973 → LIC 1956 → IRDA 2000","IRDA 2000 → LIC 1956 → general insurance nationalisation 1973","LIC 1956 → IRDA 2000 → general insurance nationalisation 1973"], explanation:"LIC dates to 1956, general insurance nationalisation took effect in 1973, and the IRDA statutory framework followed in 1999-2000.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["lic-1956","general-nationalisation","irdai-act"], options:[], canonicalAnswer:"" },
  { ql:3, difficulty:"Medium", stem:"Which body commenced business in 1973 as part of the nationalised general-insurance structure?", answer:"General Insurance Corporation of India", distractors:["PFRDA","NABARD","SEBI"], explanation:"GIC commenced business on 1 January 1973 in the nationalised general-insurance structure.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["gic-1973"], options:[], canonicalAnswer:"" },

  { ql:4, difficulty:"Easy", stem:"Which body regulates India's insurance and reinsurance business?", answer:"IRDAI", distractors:["PFRDA","SEBI","NABARD"], explanation:"IRDAI regulates, promotes and ensures orderly growth of insurance and reinsurance business.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["irdai-role"], options:[], canonicalAnswer:"" },
  { ql:4, difficulty:"Easy", stem:"The IRDA Act that created the insurance regulatory framework was enacted in which year?", answer:"1999", distractors:["1956","1972","2013"], explanation:"The IRDA Act was enacted in 1999; IRDA became a statutory body in 2000.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["irdai-act"], options:[], canonicalAnswer:"" },
  { ql:4, difficulty:"Medium", stem:"Which committee recommended opening the insurance sector to private participation in the 1990s?", answer:"R. N. Malhotra Committee", distractors:["Narasimham Committee","Tendulkar Committee","Mahalanobis Committee"], explanation:"The R. N. Malhotra Committee was set up in 1993 and reported in 1994 on insurance-sector reforms.", sourceIds:["IRDAI-EVOLUTION"], sourceFactIds:["malhotra"], options:[], canonicalAnswer:"" },
  { ql:4, difficulty:"Hard", stem:"Which function belongs to IRDAI rather than PFRDA?", answer:"Regulating insurers and protecting insurance policyholders", distractors:["Regulating the National Pension System","Distributing Union taxes among States","Conducting monetary policy"], explanation:"IRDAI is the insurance regulator. PFRDA regulates pension funds and the NPS.", sourceIds:["IRDAI-DUTIES","PFRDA-AUTHORITY"], sourceFactIds:["irdai-role","pfrda-role"], options:[], canonicalAnswer:"" },

  { ql:5, difficulty:"Easy", stem:"What is reinsurance?", answer:"Insurance purchased by an insurer to transfer part of its risk", distractors:["A pension paid by an insurer","A tax on insurance premiums","A loan from a policyholder to an insurer"], explanation:"Reinsurance lets an insurer transfer part of its insured risk to another insurer or reinsurer.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["reinsurance"], options:[], canonicalAnswer:"" },
  { ql:5, difficulty:"Medium", stem:"Why does an insurance regulator monitor solvency margins?", answer:"To help ensure insurers can meet their obligations to policyholders", distractors:["To fix all market interest rates","To set GST rates","To determine stock-index levels"], explanation:"Solvency requirements support an insurer's financial ability to meet policyholder obligations.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["solvency"], options:[], canonicalAnswer:"" },
  { ql:5, difficulty:"Medium", stem:"Which responsibility belongs to IRDAI?", answer:"Protecting policyholders' interests", distractors:["Issuing currency notes","Setting repo rate","Allocating tax devolution among States"], explanation:"Protecting policyholders is a statutory IRDAI responsibility.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["irdai-role"], options:[], canonicalAnswer:"" },
  { ql:5, difficulty:"Hard", stem:"An insurer wants to reduce its exposure to a very large group of insured risks. Which arrangement is designed for this purpose?", answer:"Reinsurance", distractors:["Open-market operation","Tax sharing","Pension annuity regulation"], explanation:"Reinsurance allows an insurer to transfer part of its risk exposure to a reinsurer.", sourceIds:["IRDAI-DUTIES"], sourceFactIds:["reinsurance"], options:[], canonicalAnswer:"" },

  { ql:6, difficulty:"Easy", stem:"When was the Interim PFRDA established?", answer:"23 August 2003", distractors:["1 January 2004","1 May 2009","1 February 2014"], explanation:"The Interim PFRDA was established on 23 August 2003.", sourceIds:["PFRDA-AUTHORITY"], sourceFactIds:["pfrda-2003"], options:[], canonicalAnswer:"" },
  { ql:6, difficulty:"Easy", stem:"The National Pension System began for new Central Government employees on which date?", answer:"1 January 2004", distractors:["23 August 2003","1 May 2009","1 February 2014"], explanation:"NPS began on 1 January 2004 for new Central Government employees, except the Armed Forces.", sourceIds:["PFRDA-AUTHORITY"], sourceFactIds:["nps-2004"], options:[], canonicalAnswer:"" },
  { ql:6, difficulty:"Medium", stem:"When was NPS opened voluntarily to all citizens?", answer:"1 May 2009", distractors:["1 January 2004","1 January 2010","1 February 2014"], explanation:"NPS was extended voluntarily to all citizens from 1 May 2009.", sourceIds:["PFRDA-AUTHORITY"], sourceFactIds:["nps-2009"], options:[], canonicalAnswer:"" },
  { ql:6, difficulty:"Hard", stem:"Which sequence correctly shows the evolution of pension regulation?", answer:"Interim PFRDA 2003 → NPS 2004 → NPS opened to all citizens 2009 → PFRDA Act in force 2014", distractors:["NPS 2004 → Interim PFRDA 2003 → PFRDA Act 2014 → all-citizen NPS 2009","PFRDA Act 2014 → Interim PFRDA 2003 → NPS 2004 → all-citizen NPS 2009","Interim PFRDA 2003 → all-citizen NPS 2009 → NPS 2004 → PFRDA Act 2014"], explanation:"The sequence is PFRDA in 2003, NPS in 2004, wider voluntary access in 2009 and statutory PFRDA from 2014.", sourceIds:["PFRDA-AUTHORITY","PFRDA-HISTORY"], sourceFactIds:["pfrda-2003","nps-2004","nps-2009","pfrda-statutory"], options:[], canonicalAnswer:"" },

  { ql:7, difficulty:"Easy", stem:"Which regulator is responsible for pension funds and the National Pension System?", answer:"PFRDA", distractors:["IRDAI","SEBI","CACP"], explanation:"PFRDA regulates and develops pension funds and oversees the NPS framework.", sourceIds:["PFRDA-AUTHORITY"], sourceFactIds:["pfrda-role"], options:[], canonicalAnswer:"" },
  { ql:7, difficulty:"Medium", stem:"Which regulator-function pair is correct?", answer:"IRDAI—insurance; PFRDA—pension funds", distractors:["IRDAI—pension funds; PFRDA—insurance","IRDAI—monetary policy; PFRDA—securities markets","IRDAI—tax devolution; PFRDA—trade disputes"], explanation:"IRDAI regulates insurance, while PFRDA regulates pension funds and protects pension subscribers.", sourceIds:["IRDAI-DUTIES","PFRDA-AUTHORITY"], sourceFactIds:["irdai-role","pfrda-role"], options:[], canonicalAnswer:"" },
  { ql:7, difficulty:"Medium", stem:"What is a defining feature of the National Pension System?", answer:"It is a contributory pension system", distractors:["It is a general-insurance policy","It is a monetary-policy instrument","It is a securities exchange"], explanation:"NPS is a contributory pension system designed for retirement savings.", sourceIds:["PFRDA-AUTHORITY"], sourceFactIds:["nps-2004"], options:[], canonicalAnswer:"" },
  { ql:7, difficulty:"Hard", stem:"A person has an insurance grievance and another has an NPS regulatory issue. Which regulators correspond to these matters?", answer:"IRDAI for insurance; PFRDA for NPS", distractors:["PFRDA for insurance; IRDAI for NPS","SEBI for both","RBI for insurance and SEBI for NPS"], explanation:"Insurance regulation belongs to IRDAI, while pension and NPS regulation belongs to PFRDA.", sourceIds:["IRDAI-DUTIES","PFRDA-AUTHORITY"], sourceFactIds:["irdai-role","pfrda-role"], options:[], canonicalAnswer:"" },
];

function rotateOptions(answer: string, distractors: string[], ql: number, index: number) {
  const options = [answer, ...distractors];
  const target = (ql + index) % 4;
  const [correct] = options.splice(0, 1);
  options.splice(target, 0, correct);
  return { options, correctIndex: target };
}

export const ECO_CP024_REVIEW_V1: EcoCp024ReviewQuestion[] = rows.map((row, index) => {
  const { options, correctIndex } = rotateOptions(row.answer, row.distractors, row.ql, index);
  return {
    questionId: `ECO-CP-024-Q${String(index + 1).padStart(2, "0")}`,
    chapterId: "ECO-001",
    cpId: "ECO-CP-024",
    qlId: `ECO-024-QL-${String(row.ql).padStart(3, "0")}`,
    qlName: qlNames[row.ql],
    difficulty: row.difficulty,
    stem: row.stem,
    options,
    correctIndex,
    canonicalAnswer: row.answer,
    explanation: row.explanation,
    sourceIds: row.sourceIds,
    sourceFactIds: row.sourceFactIds,
    reviewOnly: true,
    runtimeRegistered: false,
  };
});
