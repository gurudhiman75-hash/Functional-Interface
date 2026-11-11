/**
 * Human-authored fifth-option expansions. Never infer an extra distractor from
 * a different passage or manufacture a generic "none of the above" choice.
 * Only authority IDs listed here may be rendered as five-option RC items.
 */
export const ENG008_BANKING_FIFTH_DISTRACTORS_V1: Readonly<Record<string,Readonly<Record<string,string>>>> = {
 BANKING_PRELIMS_RC: {
  "B01-Q1":"Receipts were provided only for purchases above a fixed amount",
  "B01-Q2":"The format customers chose depended entirely on the price of the purchase",
  "B01-Q3":"Every customer should receive the same kind of receipt regardless of preference",
  "B01-Q4":"The number of printed receipts remained exactly the same",
  "B01-Q5":"difficult to interpret after an event",
  "B01-Q6":"welcomed",
  "B01-Q7":"The receipt format that was quickest for the cashier to print",
  "B01-Q8":"The owner wanted to make receipts compulsory for online orders",
  "B01-Q9":"How a Shop Eliminated Paper Receipts",
  "B01-Q10":"compulsory"
 },
 BANKING_MAINS_RC: {
  "B01-Q1":"Users cannot apply filters until they have already purchased an item",
  "B01-Q2":"They transfer responsibility for selecting products entirely to sellers",
  "B01-Q3":"A large catalogue is valuable even when customers cannot compare its options",
  "B01-Q4":"Confidence that personalisation always represents users' interests",
  "B01-Q5":"To explain why paid sellers usually offer lower prices than other sellers",
  "B01-Q6":"Recommendation systems can shape the products that users notice first",
  "B01-Q7":"It supplies evidence that search filters remove the need for recommendations",
  "B01-Q8":"Search rankings should always replace customers' own comparisons",
  "B01-Q9":"the range of discounts provided by different merchants",
  "B01-Q10":"That some shoppers use filters when comparing products"
 }
} as const;

export function eng008ApprovedFifthDistractorV1(
 profile: string, authorityId: string, options: readonly string[],
):string|undefined {
 const candidate=ENG008_BANKING_FIFTH_DISTRACTORS_V1[profile]?.[authorityId]?.trim();
 if(!candidate)return undefined;
 const normalized=(s:string)=>s.trim().toLocaleLowerCase("en-IN").replace(/\\s+/g," ");
 if(options.some(option=>normalized(option)===normalized(candidate)))
  throw new Error(`ENG-008 duplicate fifth distractor for ${profile}/${authorityId}`);
 return candidate;
}
