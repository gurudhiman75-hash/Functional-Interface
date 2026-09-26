import{ENG008_CP003_PASSAGES_V1,type Eng008Cp003Genre}from"../CP003/eng-008-cp003-authorities-v1";

export type Eng008Cp007Difficulty="medium";
export type Eng008Cp007FamilyId="BP-F10";

export interface Eng008Cp007AuthorityV1{
 id:string;
 passageId:string;
 genre:Eng008Cp003Genre;
 familyId:Eng008Cp007FamilyId;
 difficulty:Eng008Cp007Difficulty;
 targetText:string;
 prompt:string;
 correctAnswer:string;
 distractors:readonly[string,string,string];
 explanation:string;
 evidence:string;
}

export const ENG008_CP007_AUTHORITIES_V1:readonly Eng008Cp007AuthorityV1[]=[
 {id:"N01-Q10",passageId:"ENG008-BP-N01",genre:"narrative",familyId:"BP-F10",difficulty:"medium",targetText:"consistent",prompt:"Which word best fits the blank in the passage?",correctAnswer:"consistent",distractors:["accidental","scattered","brief"],explanation:"The sentence describes a repeated and reliable pattern in the dog's behaviour, so “consistent” fits the context.",evidence:"Because the pattern was so consistent"},
 {id:"N02-Q10",passageId:"ENG008-BP-N02",genre:"narrative",familyId:"BP-F10",difficulty:"medium",targetText:"ambitious",prompt:"Which word best fits the blank in the passage?",correctAnswer:"ambitious",distractors:["crowded","familiar","costly"],explanation:"The revised itinerary contained fewer fixed stops than the original, so it was less ambitious in scope.",evidence:"The second was less ambitious"},
 {id:"S01-Q10",passageId:"ENG008-BP-S01",genre:"social",familyId:"BP-F10",difficulty:"medium",targetText:"practical",prompt:"Which word best fits the blank in the passage?",correctAnswer:"practical",distractors:["decorative","private","temporary"],explanation:"The organisers wanted the shared shelf to remain useful and focused on items residents actually borrowed, so “practical” is the best fit.",evidence:"wanted the shelf to remain practical"},
 {id:"S02-Q10",passageId:"ENG008-BP-S02",genre:"social",familyId:"BP-F10",difficulty:"medium",targetText:"flexible",prompt:"Which word best fits the blank in the passage?",correctAnswer:"flexible",distractors:["rigid","secret","expensive"],explanation:"The planning method could adjust to changing attendance instead of following one fixed rule, so “flexible” fits.",evidence:"made the planning process more flexible"},
 {id:"SC01-Q10",passageId:"ENG008-BP-SC01",genre:"science",familyId:"BP-F10",difficulty:"medium",targetText:"interpret",prompt:"Which word best fits the blank in the passage?",correctAnswer:"interpret",distractors:["transport","repeat","store"],explanation:"Background noise made the recordings harder to understand correctly, so “interpret” is the appropriate word.",evidence:"recordings harder to interpret"},
 {id:"SC02-Q10",passageId:"ENG008-BP-SC02",genre:"science",familyId:"BP-F10",difficulty:"medium",targetText:"dependable",prompt:"Which word best fits the blank in the passage?",correctAnswer:"dependable",distractors:["decorative","invisible","automatic"],explanation:"Officials wanted to know whether the lighting system remained reliable for residents, so “dependable” fits the meaning.",evidence:"system remained dependable for residents"},
 {id:"B01-Q10",passageId:"ENG008-BP-B01",genre:"business",familyId:"BP-F10",difficulty:"medium",targetText:"convenient",prompt:"Which word best fits the blank in the passage?",correctAnswer:"convenient",distractors:["identical","formal","temporary"],explanation:"The passage discusses which receipt format customers found easiest or most useful in practice, so “convenient” is the best fit.",evidence:"which customers found each format convenient"},
 {id:"B02-Q10",passageId:"ENG008-BP-B02",genre:"business",familyId:"BP-F10",difficulty:"medium",targetText:"avoidable",prompt:"Which word best fits the blank in the passage?",correctAnswer:"avoidable",distractors:["technical","permanent","costly"],explanation:"The sentence contrasts genuine machine limits with movement or waiting that could be prevented, so “avoidable” fits.",evidence:"avoidable movement or waiting"},
 {id:"N03-Q10",passageId:"ENG008-BP-N03",genre:"narrative",familyId:"BP-F10",difficulty:"medium",targetText:"alternative",prompt:"Which word best fits the blank in the passage?",correctAnswer:"alternative",distractors:["obstacle","routine","delay"],explanation:"The sentence says another useful option can exist when the first route is unavailable, so “alternative” fits the context.","evidence":"a useful alternative can exist"},
 {id:"SC03-Q10",passageId:"ENG008-BP-SC03",genre:"science",familyId:"BP-F10",difficulty:"medium",targetText:"gradually",prompt:"Which word best fits the blank in the passage?",correctAnswer:"gradually",distractors:["instantly","randomly","secretly"],explanation:"The passage describes reducing noise step by step rather than through one dramatic action, so “gradually” is the correct fit.","evidence":"measured and managed gradually"},
 {id:"S03-Q10",passageId:"ENG008-BP-S03",genre:"social",familyId:"BP-F10",difficulty:"medium",targetText:"informal",prompt:"Which word best fits the blank in the passage?",correctAnswer:"informal",distractors:["expensive","temporary","official"],explanation:"The exchange continued without fines or registration, so “informal” is the word that best fits the context.","evidence":"still kept the exchange informal"},
 {id:"B03-Q10",passageId:"ENG008-BP-B03",genre:"business",familyId:"BP-F10",difficulty:"medium",targetText:"predictable",prompt:"Which word best fits the blank in the passage?",correctAnswer:"predictable",distractors:["complicated","seasonal","expensive"],explanation:"The shorter menu made kitchen work easier to anticipate during the rush, so “predictable” fits the passage.","evidence":"food preparation became more predictable"},
] as const;

export function eng008Cp007MaskedPassageV1(authority:Eng008Cp007AuthorityV1){
 const passage=ENG008_CP003_PASSAGES_V1.find(p=>p.id===authority.passageId);
 if(!passage)throw new Error(`Missing CP003 passage ${authority.passageId}`);
 const needle=authority.targetText;
 const index=passage.text.indexOf(needle);
 if(index<0)throw new Error(`${authority.id} target text not found in passage`);
 return passage.text.slice(0,index)+"_____"+passage.text.slice(index+needle.length);
}
