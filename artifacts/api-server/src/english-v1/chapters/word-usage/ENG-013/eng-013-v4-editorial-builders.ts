import type{Eng013AuthorityV1}from"./eng-013-authorities-v1";

const hash=(v:string)=>{let h=0x811c9dc5;for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;};
const pick=<T>(xs:readonly T[],seed:string)=>xs[hash(seed)%xs.length]!;
const cap=(s:string)=>s.charAt(0).toUpperCase()+s.slice(1);

export function buildSscStandardV4(id:string,word:string,object:string):Eng013AuthorityV1{
 const validSets=[
  [
   `The review committee may ${word} ${object} if the record supports the change.`,
   `Officials can ${word} ${object} after completing the required checks.`,
   `The final order authorises the department to ${word} ${object} where necessary.`
  ],
  [
   `The department decided to ${word} ${object} after the inspection.`,
   `Under the revised procedure, the authority may ${word} ${object} with written reasons.`,
   `The competent officer can ${word} ${object} once the file is complete.`
  ],
  [
   `The rules allow the authority to ${word} ${object} in an appropriate case.`,
   `After reviewing the evidence, the panel may ${word} ${object}.`,
   `The circular explains when officials should ${word} ${object}.`
  ],
  [
   `The inquiry may require the department to ${word} ${object} before closing the matter.`,
   `The designated authority has power to ${word} ${object} under the applicable rule.`,
   `Officials were instructed to ${word} ${object} only after verification.`
  ],
  [
   `The committee recommended that the department ${word} ${object} without unnecessary delay.`,
   `A written decision is required before officers ${word} ${object}.`,
   `The revised guideline permits officials to ${word} ${object} in specified circumstances.`
  ],
  [
   `The authority may ${word} ${object} when the statutory conditions are satisfied.`,
   `The report recommends steps to ${word} ${object} in a transparent manner.`,
   `The department must record its reasons whenever it chooses to ${word} ${object}.`
  ],
  [
   `The board can ${word} ${object} after considering the committee's recommendation.`,
   `The procedure sets out who may ${word} ${object} and at what stage.`,
   `The officer was asked to ${word} ${object} before issuing the final communication.`
  ],
  [
   `The administration may ${word} ${object} only within the limits of the rule.`,
   `The review note explains why it may be necessary to ${word} ${object}.`,
   `The competent authority will ${word} ${object} if the supporting material is sufficient.`
  ]
 ] as const;
 const invalid=[
  `The department may ${word} to ${object} after verification.`,
  `The officer was instructed to ${word} to ${object} before closing the file.`,
  `The authority can ${word} to ${object} under the revised procedure.`,
  `The committee decided to ${word} to ${object} after the review.`
 ] as const;
 const good=pick(validSets,id),bad=pick(invalid,`${id}:bad`);
 return{id,cpId:"ENG-013-CP001",difficulty:"medium",word,mode:"incorrect",sentences:[good[0],good[1],good[2],bad],answerIndex:3,
  explanation:`In options A, B and C, "${word}" is used naturally as a transitive verb with ${object} as its direct object. Option D inserts "to" between the verb and its object, which is not the required verb pattern here. Hence option D is the incorrect usage.`};
}

const RELATION=new Set(["bilateral","causal","mutual","symmetric","divergent","incompatible","linear"]);
const TREND=new Set(["abrupt","gradual","incremental","recurrent","persistent","prevalent","variable","emergent","diffuse"]);
const STRUCTURE=new Set(["vertical","aggregate","concurrent","underlying"]);
const JUDGMENT=new Set(["appropriate","arbitrary","impartial","rational","legitimate","ethical","valid","dubious","plausible","deliberate","intentional","selective","normative","neutral"]);
const ARGUMENT=new Set(["abstract","ambiguous","coherent","compelling","concise","contentious","explicit","lucid","logical","relevant"]);
const ADVANCED_SUBJECT_OVERRIDES:Record<string,string>={
 absolute:"condition",acute:"problem",adaptive:"framework",adequate:"evidence",adverse:"effect",
 consequential:"change",conventional:"approach",critical:"issue",decisive:"factor",deficient:"evidence",
 detrimental:"effect",efficient:"system",elusive:"target",exceptional:"circumstance",excessive:"amount",
 finite:"resource",fundamental:"principle",inevitable:"outcome",innovative:"approach",integral:"component",
 marginal:"improvement",moderate:"change",notable:"improvement",preliminary:"finding",resilient:"system",
 significant:"effect",stable:"pattern",strategic:"decision",stringent:"requirement",sufficient:"evidence",
 transparent:"process",uniform:"pattern",unprecedented:"event",vulnerable:"group",austere:"policy",
 complex:"issue",concrete:"example",dynamic:"environment",formal:"procedure",generic:"description",
 holistic:"approach",minimal:"change",institutional:"framework",material:"consideration",measurable:"effect",
 proportionate:"response",substantial:"improvement",transitory:"effect",pertinent:"consideration",durable:"arrangement",fragile:"system",subjective:"assessment",cohesive:"argument",precise:"description",accurate:"finding",sparse:"evidence",flexible:"framework",balanced:"assessment",admissible:"evidence"
};
function advancedSubject(word:string){
 if(ADVANCED_SUBJECT_OVERRIDES[word])return ADVANCED_SUBJECT_OVERRIDES[word]!;
 if(RELATION.has(word))return"relationship";
 if(TREND.has(word))return"pattern";
 if(STRUCTURE.has(word))return word==="vertical"?"structure":word==="aggregate"?"figure":word==="concurrent"?"events":"factor";
 if(JUDGMENT.has(word))return"assessment";
 if(ARGUMENT.has(word))return"argument";
 if(word==="equitable")return"arrangement";
 if(word==="discerning")return"analysis";
 return"feature";
}
export function buildSscAdvancedV4(id:string,word:string):Eng013AuthorityV1{
 const subject=advancedSubject(word);
 const frames=[
  [
   `The report described the ${subject} as ${word} after reviewing the evidence.`,
   `Independent reviewers also considered the ${subject} ${word} in the circumstances.`,
   `After further analysis, the ${subject} still appeared ${word}.`
  ],
  [
   `The committee's note characterised the ${subject} as ${word}.`,
   `Several reviewers found the ${subject} to be ${word}.`,
   `Nothing in the later evidence made the ${subject} appear less ${word}.`
  ],
  [
   `In the final report, the ${subject} was treated as ${word}.`,
   `The revised analysis continued to describe the ${subject} as ${word}.`,
   `For the purpose of the discussion, the ${subject} remained ${word}.`
  ],
  [
   `The panel regarded the ${subject} as ${word} rather than ordinary.`,
   `The written assessment called the ${subject} ${word}.`,
   `On the available evidence, the ${subject} could reasonably be described as ${word}.`
  ],
  [
   `The researchers identified the ${subject} as ${word} in their analysis.`,
   `The later review reached the same view and described the ${subject} as ${word}.`,
   `The final summary likewise presented the ${subject} as ${word}.`
  ],
  [
   `The ${subject} appeared ${word} when examined in context.`,
   `The report gave reasons for treating the ${subject} as ${word}.`,
   `Even after revision, the ${subject} remained clearly ${word}.`
  ]
 ] as const;
 const invalid=[
  `The committee ${word} the proposal before approval.`,
  `The analyst ${word} the finding in the final note.`,
  `The reviewers ${word} the report before publication.`,
  `The panel ${word} the evidence during the hearing.`
 ] as const;
 const good=pick(frames,id),bad=pick(invalid,`${id}:bad`);
 return{id,cpId:"ENG-013-CP002",difficulty:"hard",word,mode:"incorrect",sentences:[good[0],good[1],good[2],bad],answerIndex:3,
  explanation:`In options A, B and C, "${word}" functions naturally as an adjective describing the ${subject}. Option D incorrectly uses the adjective as though it were a finite verb. Hence option D is the incorrect usage.`};
}

type PrelimCategory="account"|"payment"|"cheque"|"card"|"loan"|"fee"|"identity"|"service"|"general";
function prelimCategory(word:string):PrelimCategory{
 const w=word.toLowerCase();
 if(/account|balance|customer id|account number|beneficiary/.test(w))return"account";
 if(/upi|neft|rtgs|imps|fund transfer|auto-debit|direct debit|ecs|nach/.test(w))return"payment";
 if(/cheque|demand draft|pay order|ifsc|micr/.test(w))return"cheque";
 if(/card|atm|pin|otp/.test(w))return"card";
 if(/loan|emi|down payment|credit score|credit history|credit bureau|cibil|repayment|foreclosure|pre-closure|hypothecation|guarantee|co-borrower|co-applicant|sanction letter/.test(w))return"loan";
 if(/fee|charge|minimum due|due date|billing cycle|interest rate/.test(w))return"fee";
 if(/kyc|ckyc|pan|nomination/.test(w))return"identity";
 if(/locker|safe custody|cash deposit|cash withdrawal|balance enquiry|mini statement|passbook update|freeze|cheque return|insufficient funds|cash deposit machine/.test(w))return"service";
 return"general";
}
const prelimFrames:Record<PrelimCategory,readonly (readonly[string,string,string])[]>={
 account:[
  ["The branch explained the rules connected with the {w}.","The customer checked the details recorded for the {w}.","The service request referred specifically to the {w}."],
  ["The bank asked the customer to verify information relating to the {w}.","A discrepancy in the {w} was reported to the branch.","The customer received a written clarification about the {w}."]
 ],
 payment:[
  ["The bank explained when the {w} would be processed.","The customer checked the status of the {w} after receiving the alert.","The transaction record contained details of the {w}."],
  ["The customer asked whether the {w} had been completed successfully.","The branch clarified the timing applicable to the {w}.","A reference number was generated for the {w}."]
 ],
 cheque:[
  ["The branch verified the details connected with the {w}.","The customer asked how the {w} would be handled.","The bank's written instructions referred to the {w}."],
  ["The customer submitted a query about the {w}.","The branch explained the requirement associated with the {w}.","The transaction record included information about the {w}."]
 ],
 card:[
  ["The bank advised the customer to protect details connected with the {w}.","The customer reported an issue involving the {w}.","The branch explained the security rules applicable to the {w}."],
  ["The customer asked for clarification about the {w}.","The bank's alert contained information relating to the {w}.","The service desk recorded the complaint about the {w}."]
 ],
 loan:[
  ["The loan officer explained how the {w} would affect the application.","The customer asked for written details about the {w}.","The sanction process included a check relating to the {w}."],
  ["The bank discussed the {w} before finalising the loan request.","The borrower reviewed the conditions connected with the {w}.","The loan file contained a separate note on the {w}."]
 ],
 fee:[
  ["The bank disclosed the {w} before the customer accepted the facility.","The customer asked how the {w} would be calculated.","The schedule of charges contained a separate entry for the {w}."],
  ["The branch clarified when the {w} would apply.","The customer compared the {w} with the amount shown in the statement.","The bank's notice explained the basis of the {w}."]
 ],
 identity:[
  ["The branch explained the requirement relating to the {w}.","The customer checked whether the {w} details were up to date.","The application could not be completed until the {w} requirement was addressed."],
  ["The bank asked the customer to review information connected with the {w}.","The service request contained a note about the {w}.","The branch clarified how the {w} would be used for the request."]
 ],
 service:[
  ["The customer asked the branch for details about the {w}.","The bank explained the procedure connected with the {w}.","The service record showed an entry relating to the {w}."],
  ["The branch received a request concerning the {w}.","The customer was given written instructions about the {w}.","The bank clarified the conditions applicable to the {w}."]
 ],
 general:[
  ["The customer asked the bank for details about the {w}.","The branch explained the conditions connected with the {w}.","The service record contained a reference to the {w}."],
  ["The bank provided written information about the {w}.","The customer requested clarification regarding the {w}.","The branch reviewed the details associated with the {w}."]
 ]
};
const fill=(s:string,w:string)=>s.replaceAll("{w}",w);
const PRELIM_SPECIAL:Record<string,readonly[string,string,string]>={
 "cardholder":["The cardholder reported the disputed transaction to the bank.","The bank sent the cardholder a security alert after the transaction.","The cardholder was asked to verify the purchase before the block was removed."],
 "MICR":["The cheque carried the MICR information required for clearing.","The branch explained how MICR is used in cheque processing.","The bank verified the MICR details printed on the cheque."],
 "IFSC":["The customer entered the IFSC before initiating the transfer.","The branch confirmed the IFSC shown on the transfer form.","The beneficiary details included the correct IFSC for the branch."]
};
export function buildBankingPrelimsV4(id:string,word:string):Eng013AuthorityV1{
 const category=prelimCategory(word),good=(PRELIM_SPECIAL[word]??pick(prelimFrames[category],id).map(x=>fill(x,word))) as readonly[string,string,string];
 const invalid=[
  `The customer decided to ${word} the application before submission.`,
  `The branch officer ${word} the form before sending it for review.`,
  `The applicant ${word} the request after speaking to the manager.`,
  `The bank ${word} the complaint before closing the service ticket.`
 ] as const;
 const bad=pick(invalid,`${id}:bad`);
 return{id,cpId:"ENG-013-CP003",difficulty:"medium",word,mode:"incorrect",sentences:[good[0],good[1],good[2],bad],answerIndex:3,
  explanation:`In options A, B and C, "${word}" is used naturally as a banking noun or noun phrase in a ${category} context. Option D incorrectly forces the noun phrase into a verb position. Hence option D is the incorrect usage.`};
}

type MainsCategory="policy-rate"|"risk"|"capital"|"instrument"|"market"|"derivative"|"liquidity"|"general";
function mainsCategory(word:string):MainsCategory{
 const w=word.toLowerCase();
 if(w!=="swap rate"&&/swap|forward rate agreement|derivatives|mark-to-market|margin|central counterparty|clearing house/.test(w))return"derivative";
 if(/risk|probability of default|exposure at default|loss given default|recovery rate|expected credit loss/.test(w))return"risk";
 if(/capital|common equity tier 1|tier 1 capital|tier 2 capital|leverage ratio|risk-weighted assets|buffer|provision coverage|npa ratio/.test(w))return"capital";
 if(/rate|basis point|policy corridor|term premium|credit spread|bid-ask spread/.test(w))return"policy-rate";
 if(/security|debenture|commercial paper|certificate of deposit|treasury bill|loan|gilt fund|tranche|subordinated debt|securitization|special purpose vehicle/.test(w))return"instrument";
 if(/market|book building|rights issue|bonus issue|share buyback|dividend payout|face value|issue price|market price|underwriting|loan syndication/.test(w))return"market";
 if(/liquidity|stable funding|asset-liability|duration gap|repricing gap|credit conversion factor/.test(w))return"liquidity";
 return"general";
}
const mainsFrames:Record<MainsCategory,readonly (readonly[string,string,string])[]>={
 "policy-rate":[
  ["The monetary review outlined why the {w} mattered.","Analysts compared movements in the {w} with other market indicators.","The committee discussed how the {w} could influence financial conditions."],
  ["The report included a separate discussion of the {w}.","Market participants monitored changes in the {w} during the period.","The analysis linked the {w} with broader monetary and funding conditions."]
 ],
 risk:[
  ["The risk report assessed the institution's exposure to {w}.","The committee reviewed the controls used to manage {w}.","The note explained why {w} mattered for the bank's loss profile."],
  ["Management discussed recent changes in {w}.","The internal review identified factors that could increase {w}.","The risk framework set out how {w} would be monitored."]
 ],
 capital:[
  ["The regulatory note discussed the bank's {w}.","The board reviewed the {w} before approving the capital plan.","The analysis explained how the {w} affected the institution's resilience."],
  ["The report compared the {w} with the applicable regulatory threshold.","Senior management reviewed movements in the {w}.","The capital assessment included a detailed note on the {w}."]
 ],
 instrument:[
  ["The treasury report discussed the bank's exposure to the {w}.","Analysts reviewed the pricing and maturity of the {w}.","The investment note explained the role of the {w} in the portfolio."],
  ["The institution evaluated the {w} before taking an investment decision.","The report described the main features of the {w}.","The committee considered the risks associated with the {w}."]
 ],
 market:[
  ["The market note discussed recent developments in the {w}.","Analysts examined how the {w} affected financing conditions.","The committee reviewed the institution's activity in the {w}."],
  ["The report explained the role of the {w} in the transaction.","Market participants tracked changes connected with the {w}.","The analysis considered how the {w} influenced investor decisions."]
 ],
 derivative:[
  ["The treasury team reviewed the {w} as part of its hedging strategy.","The risk note explained the exposure created by the {w}.","The committee discussed the valuation and settlement of the {w}."],
  ["The bank documented the purpose of the {w} before entering the transaction.","Analysts assessed the risks associated with the {w}.","The control framework required regular review of the {w}."]
 ],
 liquidity:[
  ["The asset-liability committee reviewed the {w}.","The report explained how the {w} affected funding resilience.","Analysts monitored the {w} as part of the bank's balance-sheet assessment."],
  ["The liquidity note contained a detailed discussion of the {w}.","Management compared the {w} with internal limits.","The committee considered how the {w} could change under stress."]
 ],
 general:[
  ["The internal note outlined the relevance of the {w}.","The committee reviewed how the {w} could affect the institution.","The report included a separate analysis of the {w}."],
  ["Analysts discussed the {w} in the bank's annual risk review.","Senior management considered the implications of the {w}.","The internal note described how the {w} would be monitored."]
 ]
};
export function buildBankingMainsV4(id:string,word:string):Eng013AuthorityV1{
 const category=mainsCategory(word),good=pick(mainsFrames[category],id).map(x=>fill(x,word)) as unknown as readonly[string,string,string];
 const invalid=[
  `The bank decided to ${word} the facility before the review.`,
  `The committee ${word} the exposure before approving the limit.`,
  `The analyst ${word} the portfolio in the final report.`,
  `Management ${word} the transaction before the meeting.`
 ] as const;
 const bad=pick(invalid,`${id}:bad`);
 return{id,cpId:"ENG-013-CP004",difficulty:"hard",word,mode:"incorrect",sentences:[good[0],good[1],good[2],bad],answerIndex:3,
  explanation:`In options A, B and C, "${word}" is used naturally as a financial noun or noun phrase in a ${category} context. Option D incorrectly uses the term as a finite verb. Hence option D is the incorrect usage.`};
}
