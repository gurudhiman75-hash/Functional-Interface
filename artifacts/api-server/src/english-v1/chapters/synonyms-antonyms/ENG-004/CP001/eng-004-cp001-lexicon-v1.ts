export type Eng004Difficulty = "easy" | "medium" | "hard";
export type Eng004RelationType = "synonym" | "antonym";
export type Eng004PartOfSpeech = "adjective" | "verb";

export interface Eng004LexicalEntryV1 {
  id: string;
  word: string;
  pos: Eng004PartOfSpeech;
  meaning: string;
  synonym: string;
  antonym: string;
  synonymDistractors: readonly [string, string, string];
  antonymDistractors: readonly [string, string, string];
  difficulty: Eng004Difficulty;
  example: string;
}

export const ENG004_CP001_LEXICON_V1: readonly Eng004LexicalEntryV1[] = Object.freeze([
  {id:"LEX-E-001",word:"abundant",pos:"adjective",meaning:"existing in large quantities",synonym:"plentiful",antonym:"scarce",synonymDistractors:["limited","ordinary","narrow"],antonymDistractors:["ample","copious","plentiful"],difficulty:"easy",example:"The region receives abundant rainfall during the monsoon."},
  {id:"LEX-E-002",word:"brief",pos:"adjective",meaning:"lasting for a short time or using few words",synonym:"concise",antonym:"lengthy",synonymDistractors:["complex","formal","distant"],antonymDistractors:["short","concise","compact"],difficulty:"easy",example:"She gave a brief summary of the report."},
  {id:"LEX-E-003",word:"calm",pos:"adjective",meaning:"peaceful and not excited or disturbed",synonym:"serene",antonym:"agitated",synonymDistractors:["rigid","rapid","stern"],antonymDistractors:["peaceful","serene","tranquil"],difficulty:"easy",example:"He remained calm during the discussion."},
  {id:"LEX-E-004",word:"diligent",pos:"adjective",meaning:"careful and hardworking",synonym:"industrious",antonym:"lazy",synonymDistractors:["careless","casual","timid"],antonymDistractors:["hardworking","industrious","assiduous"],difficulty:"easy",example:"The diligent clerk checked every entry twice."},
  {id:"LEX-E-005",word:"eager",pos:"adjective",meaning:"very willing or interested to do something",synonym:"keen",antonym:"reluctant",synonymDistractors:["weary","doubtful","silent"],antonymDistractors:["keen","willing","enthusiastic"],difficulty:"easy",example:"The students were eager to see the results."},
  {id:"LEX-E-006",word:"fragile",pos:"adjective",meaning:"easily broken or damaged",synonym:"delicate",antonym:"sturdy",synonymDistractors:["massive","rough","steady"],antonymDistractors:["delicate","brittle","frail"],difficulty:"easy",example:"The parcel contained fragile glassware."},
  {id:"LEX-E-007",word:"genuine",pos:"adjective",meaning:"real and not false",synonym:"authentic",antonym:"fake",synonymDistractors:["partial","remote","common"],antonymDistractors:["real","authentic","original"],difficulty:"easy",example:"The expert confirmed that the signature was genuine."},
  {id:"LEX-E-008",word:"humble",pos:"adjective",meaning:"not proud or arrogant",synonym:"modest",antonym:"arrogant",synonymDistractors:["wealthy","strict","restless"],antonymDistractors:["modest","unassuming","meek"],difficulty:"easy",example:"Despite his success, he remained humble."},
  {id:"LEX-E-009",word:"rapid",pos:"adjective",meaning:"happening very quickly",synonym:"swift",antonym:"slow",synonymDistractors:["steady","late","mild"],antonymDistractors:["swift","fast","speedy"],difficulty:"easy",example:"The city has seen rapid growth in recent years."},
  {id:"LEX-E-010",word:"silent",pos:"adjective",meaning:"making no sound",synonym:"quiet",antonym:"noisy",synonymDistractors:["bright","empty","rough"],antonymDistractors:["quiet","mute","soundless"],difficulty:"easy",example:"The hall became silent before the announcement."},
  {id:"LEX-E-011",word:"vacant",pos:"adjective",meaning:"not occupied or being used",synonym:"empty",antonym:"occupied",synonymDistractors:["crowded","public","narrow"],antonymDistractors:["empty","unused","unoccupied"],difficulty:"easy",example:"Only one seat remained vacant."},
  {id:"LEX-E-012",word:"vivid",pos:"adjective",meaning:"very clear, bright or detailed",synonym:"striking",antonym:"dull",synonymDistractors:["faint","plain","minor"],antonymDistractors:["bright","striking","graphic"],difficulty:"easy",example:"She gave a vivid description of the scene."},

  {id:"LEX-M-001",word:"alleviate",pos:"verb",meaning:"to make pain or a problem less severe",synonym:"relieve",antonym:"aggravate",synonymDistractors:["postpone","observe","collect"],antonymDistractors:["relieve","ease","lessen"],difficulty:"medium",example:"The new measures may alleviate traffic congestion."},
  {id:"LEX-M-002",word:"candid",pos:"adjective",meaning:"truthful and straightforward",synonym:"frank",antonym:"evasive",synonymDistractors:["rigid","formal","secretive"],antonymDistractors:["frank","open","honest"],difficulty:"medium",example:"She gave a candid reply to the committee."},
  {id:"LEX-M-003",word:"coherent",pos:"adjective",meaning:"logical and easy to understand",synonym:"logical",antonym:"confused",synonymDistractors:["brief","emotional","ordinary"],antonymDistractors:["logical","orderly","consistent"],difficulty:"medium",example:"His argument was coherent and well structured."},
  {id:"LEX-M-004",word:"concise",pos:"adjective",meaning:"giving much information in few words",synonym:"succinct",antonym:"verbose",synonymDistractors:["vague","casual","lengthy"],antonymDistractors:["brief","succinct","compact"],difficulty:"medium",example:"Keep your answer concise and relevant."},
  {id:"LEX-M-005",word:"deteriorate",pos:"verb",meaning:"to become worse",synonym:"worsen",antonym:"improve",synonymDistractors:["stabilize","announce","divide"],antonymDistractors:["worsen","decline","degrade"],difficulty:"medium",example:"The road may deteriorate further during heavy rain."},
  {id:"LEX-M-006",word:"impartial",pos:"adjective",meaning:"fair and not favouring either side",synonym:"neutral",antonym:"biased",synonymDistractors:["strict","uncertain","private"],antonymDistractors:["neutral","fair","unbiased"],difficulty:"medium",example:"An impartial inquiry was ordered."},
  {id:"LEX-M-007",word:"inevitable",pos:"adjective",meaning:"certain to happen and impossible to avoid",synonym:"unavoidable",antonym:"avoidable",synonymDistractors:["unlikely","temporary","flexible"],antonymDistractors:["unavoidable","certain","inescapable"],difficulty:"medium",example:"Some delay was inevitable because of the storm."},
  {id:"LEX-M-008",word:"meticulous",pos:"adjective",meaning:"very careful about small details",synonym:"thorough",antonym:"careless",synonymDistractors:["speedy","casual","broad"],antonymDistractors:["thorough","careful","precise"],difficulty:"medium",example:"She kept meticulous records of every payment."},
  {id:"LEX-M-009",word:"obsolete",pos:"adjective",meaning:"no longer used because something newer exists",synonym:"outdated",antonym:"current",synonymDistractors:["complex","scarce","useful"],antonymDistractors:["outdated","old-fashioned","superseded"],difficulty:"medium",example:"The office replaced its obsolete equipment."},
  {id:"LEX-M-010",word:"prudent",pos:"adjective",meaning:"showing careful and sensible judgement",synonym:"cautious",antonym:"reckless",synonymDistractors:["generous","rigid","curious"],antonymDistractors:["cautious","wise","careful"],difficulty:"medium",example:"It would be prudent to keep some money in reserve."},
  {id:"LEX-M-011",word:"resilient",pos:"adjective",meaning:"able to recover quickly from difficulty",synonym:"tough",antonym:"fragile",synonymDistractors:["silent","formal","narrow"],antonymDistractors:["tough","robust","durable"],difficulty:"medium",example:"Small businesses can be remarkably resilient."},
  {id:"LEX-M-012",word:"scarce",pos:"adjective",meaning:"available only in small quantities",synonym:"rare",antonym:"abundant",synonymDistractors:["ample","cheap","visible"],antonymDistractors:["rare","limited","sparse"],difficulty:"medium",example:"Clean drinking water was scarce after the flood."},

  {id:"LEX-H-001",word:"austere",pos:"adjective",meaning:"plain, strict or without comfort",synonym:"severe",antonym:"luxurious",synonymDistractors:["ornate","cheerful","casual"],antonymDistractors:["severe","plain","spartan"],difficulty:"hard",example:"The committee adopted an austere spending plan."},
  {id:"LEX-H-002",word:"benevolent",pos:"adjective",meaning:"kind and willing to help others",synonym:"charitable",antonym:"malevolent",synonymDistractors:["cautious","distant","stern"],antonymDistractors:["charitable","kindly","generous"],difficulty:"hard",example:"The trust was created by a benevolent donor."},
  {id:"LEX-H-003",word:"clandestine",pos:"adjective",meaning:"kept secret, especially because it is improper",synonym:"secret",antonym:"overt",synonymDistractors:["lawful","formal","random"],antonymDistractors:["secret","covert","hidden"],difficulty:"hard",example:"The officers uncovered a clandestine operation."},
  {id:"LEX-H-004",word:"corroborate",pos:"verb",meaning:"to support a statement with additional evidence",synonym:"confirm",antonym:"contradict",synonymDistractors:["delay","summarize","question"],antonymDistractors:["confirm","support","verify"],difficulty:"hard",example:"The records corroborate the witness's account."},
  {id:"LEX-H-005",word:"ephemeral",pos:"adjective",meaning:"lasting for a very short time",synonym:"short-lived",antonym:"enduring",synonymDistractors:["uncertain","ordinary","distant"],antonymDistractors:["short-lived","brief","fleeting"],difficulty:"hard",example:"Online trends can be surprisingly ephemeral."},
  {id:"LEX-H-006",word:"fastidious",pos:"adjective",meaning:"very attentive to detail and hard to please",synonym:"particular",antonym:"careless",synonymDistractors:["generous","rapid","flexible"],antonymDistractors:["particular","meticulous","fussy"],difficulty:"hard",example:"The editor was fastidious about punctuation."},
  {id:"LEX-H-007",word:"magnanimous",pos:"adjective",meaning:"generous and forgiving, especially toward a rival",synonym:"generous",antonym:"petty",synonymDistractors:["timid","formal","careful"],antonymDistractors:["generous","noble","forgiving"],difficulty:"hard",example:"She was magnanimous in victory."},
  {id:"LEX-H-008",word:"mitigate",pos:"verb",meaning:"to make something harmful less severe",synonym:"reduce",antonym:"intensify",synonymDistractors:["measure","predict","explain"],antonymDistractors:["reduce","lessen","ease"],difficulty:"hard",example:"Trees can help mitigate the effects of extreme heat."},
  {id:"LEX-H-009",word:"pragmatic",pos:"adjective",meaning:"dealing with problems in a practical way",synonym:"practical",antonym:"impractical",synonymDistractors:["idealistic","formal","secretive"],antonymDistractors:["practical","realistic","sensible"],difficulty:"hard",example:"They adopted a pragmatic approach to the dispute."},
  {id:"LEX-H-010",word:"redundant",pos:"adjective",meaning:"unnecessary because it is repeated or no longer needed",synonym:"superfluous",antonym:"essential",synonymDistractors:["complex","valuable","scarce"],antonymDistractors:["superfluous","unnecessary","excess"],difficulty:"hard",example:"The final paragraph contained several redundant phrases."},
  {id:"LEX-H-011",word:"tacit",pos:"adjective",meaning:"understood without being directly stated",synonym:"implicit",antonym:"explicit",synonymDistractors:["temporary","formal","uncertain"],antonymDistractors:["implicit","unstated","unspoken"],difficulty:"hard",example:"His silence was taken as tacit approval."},
  {id:"LEX-H-012",word:"vindicate",pos:"verb",meaning:"to clear someone from blame or prove them right",synonym:"exonerate",antonym:"condemn",synonymDistractors:["question","restrict","dismiss"],antonymDistractors:["exonerate","clear","justify"],difficulty:"hard",example:"The new evidence may vindicate the accused officer."},
]);

export function eng004Cp001PoolV1(difficulty: Eng004Difficulty) {
  return ENG004_CP001_LEXICON_V1.filter((entry) => entry.difficulty === difficulty);
}
