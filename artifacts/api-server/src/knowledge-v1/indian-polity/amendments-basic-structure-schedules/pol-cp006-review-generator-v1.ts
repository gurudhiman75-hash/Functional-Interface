import { deterministicShuffle } from "../../deterministic";
import type { KnowledgeV1Difficulty } from "../../types";
import {
  POL_CP006_ARTICLE368_V1,
  POL_CP006_BASIC_STRUCTURE_CASES_V1,
  POL_CP006_BASIC_STRUCTURE_FEATURES_V1,
  POL_CP006_HIGH_YIELD_AMENDMENTS_V1,
  POL_CP006_RATIFICATION_AREAS_V1,
  POL_CP006_SCHEDULES_V1,
  type PolCp006Sourced,
} from "./pol-cp006-facts";
import type { PolCp006ReviewQuestion } from "./pol-cp006-review-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
const qlNames: Record<number, string> = {
  1: "Article 368 subject", 2: "Initiation of a Constitution Amendment Bill", 3: "Special majority under Article 368",
  4: "State ratification requirement", 5: "Joint sitting and presidential assent", 6: "Changes outside Article 368 procedure",
  7: "Basic structure case mapping", 8: "Core meaning of basic structure doctrine", 9: "Identify basic-structure features",
  10: "Minerva Mills and limited amending power", 11: "Secularism, federalism, separation of powers and judicial review",
  12: "Ninth Schedule and basic-structure review", 13: "Schedule to subject", 14: "Subject to Schedule",
  15: "First, Fourth and Seventh Schedule distinction", 16: "Fifth and Sixth Schedule distinction",
  17: "Eighth Schedule languages", 18: "Tenth Schedule anti-defection", 19: "Eleventh Schedule Panchayats",
  20: "Twelfth Schedule Municipalities", 21: "Amendment to change", 22: "Change to amendment",
  23: "Chronology of constitutional amendments", 24: "Forty-second and Forty-fourth Amendment comparison",
  25: "Recent high-yield amendments", 26: "Integrated amendment/basic-structure/schedule statements",
};

const countsByQl: Record<number, number> = {1:4,2:3,3:3,4:4,5:3,6:3,7:4,8:3,9:4,10:3,11:3,12:3,13:4,14:4,15:3,16:4,17:3,18:3,19:3,20:3,21:4,22:5,23:4,24:4,25:3,26:3};
const difficultyForQl = (ql: number): KnowledgeV1Difficulty => [7,10,12,23,26].includes(ql) ? "Hard" : [1,2,13,14,17,18,19,20].includes(ql) ? "Easy" : "Medium";

function moveCorrect(options: string[], correct: string, target: number) {
  const index = options.indexOf(correct);
  if (index < 0) throw new Error(`Correct option missing: ${correct}`);
  [options[index], options[target]] = [options[target], options[index]];
  return options;
}
function chooseFour(values: readonly string[], correct: string, seed: string, target: number) {
  const wrong = deterministicShuffle([...new Set(values.filter((v) => v !== correct))], seed).slice(0, 3);
  if (wrong.length < 3) throw new Error(`Insufficient distractors for ${seed}`);
  return moveCorrect(deterministicShuffle([...wrong, correct], `${seed}:options`), correct, target);
}
function meta(items: readonly PolCp006Sourced[]) {
  return { sourceIds: [...new Set(items.flatMap(i => [...i.sourceIds]))], sourceFactIds: [...new Set(items.flatMap(i => [...i.sourceFactIds]))] };
}
const amendment = (name: string) => POL_CP006_HIGH_YIELD_AMENDMENTS_V1.find(r => r.amendment === name)!;
const schedule = (name: string) => POL_CP006_SCHEDULES_V1.find(r => r.schedule === name)!;

function makeQuestion(ql: number, row: number, globalIndex: number): PolCp006ReviewQuestion {
  const qlId = `POL-006-QL-${String(ql).padStart(3,"0")}`;
  const target = globalIndex % 4;
  let stem="", correct="", options:string[]=[], explanation="";
  let sourceIds:string[]=[C], sourceFactIds:string[]=["pol-cp006-review"];

  if (ql === 1) {
    const stems = ["Article 368 deals with:","The constitutional amendment procedure is mainly contained in:","Parliament's constituent power to amend the Constitution is dealt with in:","Which Article lays down the main procedure for amending the Constitution?"];
    stem=stems[row%4]; correct=row===0?POL_CP006_ARTICLE368_V1.subject:"Article 368";
    options = row===0 ? moveCorrect([correct,"Emergency provisions","Citizenship at commencement","Inter-State trade"],correct,target) : moveCorrect(["Article 368","Article 356","Article 324","Article 280"],correct,target);
    explanation=`Article 368 deals with Parliament's power to amend the Constitution and the procedure for doing so.`; sourceFactIds=[...POL_CP006_ARTICLE368_V1.sourceFactIds];
  } else if (ql === 2) {
    const stems=["A Constitution Amendment Bill may be introduced in:","A Constitution Amendment Bill can be introduced by:","Which statement about introducing a Constitution Amendment Bill is correct?"];
    const answers=["Either House of Parliament","A minister or a private member","It may be introduced in either House of Parliament."];
    stem=stems[row%3]; correct=answers[row%3];
    const pools=[[correct,"Lok Sabha only","Rajya Sabha only","A State Legislature only"],[correct,"Only the Prime Minister","Only the Law Minister","Only the President"],[correct,"It must begin in Lok Sabha.","It must begin in Rajya Sabha.","It is introduced first in a State Legislature."]];
    options=moveCorrect(pools[row%3],correct,target); explanation=POL_CP006_ARTICLE368_V1.initiation; sourceFactIds=[...POL_CP006_ARTICLE368_V1.sourceFactIds];
  } else if (ql === 3) {
    const variants=[
      ["The special majority under Article 368 requires:","A majority of the total membership plus at least two-thirds of members present and voting"],
      ["For the two-thirds part of the Article 368 majority, the Constitution counts:","Members present and voting"],
      ["Which majority is generally required in each House for an Article 368 amendment?","Special majority"]
    ];
    [stem,correct]=variants[row%3];
    options=moveCorrect([correct,"Simple majority of members present and voting","Two-thirds of the total membership only","Unanimous approval of both Houses"],correct,target);
    explanation=POL_CP006_ARTICLE368_V1.specialMajority; sourceFactIds=[...POL_CP006_ARTICLE368_V1.sourceFactIds];
  } else if (ql === 4) {
    const area=POL_CP006_RATIFICATION_AREAS_V1[row%POL_CP006_RATIFICATION_AREAS_V1.length];
    stem="Which change requires ratification by at least half of the State Legislatures under Article 368?"; correct=area;
    options=chooseFour([...POL_CP006_RATIFICATION_AREAS_V1,"A change in the salary of a Union minister","Creation of a new district"],correct,`${qlId}:${row}`,target);
    explanation=`Changes affecting specified federal provisions, including ${area.toLowerCase()}, require ratification by legislatures of not less than one-half of the States.`; sourceFactIds=[...POL_CP006_ARTICLE368_V1.sourceFactIds];
  } else if (ql === 5) {
    const variants=[
      ["If the two Houses disagree on a Constitution Amendment Bill, can a joint sitting be used?","No"],
      ["After a Constitution Amendment Bill is duly passed under Article 368, the President:","Shall give assent"],
      ["Which statement is correct about an Article 368 Amendment Bill?","There is no joint sitting for resolving disagreement between the Houses."]
    ]; [stem,correct]=variants[row%3];
    options=moveCorrect([correct,"Yes, in every case","Only if the Rajya Sabha requests it","Only during an emergency"],correct,target);
    if(row%3===1) options=moveCorrect([correct,"May return it for reconsideration","Must send it to the Supreme Court","May withhold assent permanently"],correct,target);
    explanation=row%3===1?POL_CP006_ARTICLE368_V1.presidentialAssent:POL_CP006_ARTICLE368_V1.jointSitting; sourceFactIds=[...POL_CP006_ARTICLE368_V1.sourceFactIds];
  } else if (ql === 6) {
    const variants=[
      ["A law under Articles 2 and 3 changing State areas or boundaries is:","Not deemed a constitutional amendment for Article 368 purposes"],
      ["Creation or abolition of a State Legislative Council under Article 169 is generally done by:","Parliament by ordinary law after the required State Assembly resolution"],
      ["Which is an example of a constitutional change that may be made without using the Article 368 amendment procedure?","Formation or alteration of States under Articles 2 to 4"]
    ]; [stem,correct]=variants[row%3];
    options=moveCorrect([correct,"Always an Article 368 amendment requiring State ratification","Possible only by referendum","Possible only through a joint sitting"],correct,target);
    explanation="Some constitutional changes are expressly made by ordinary law and are not treated as amendments under Article 368.";
  } else if (ql === 7) {
    const c=POL_CP006_BASIC_STRUCTURE_CASES_V1[row%POL_CP006_BASIC_STRUCTURE_CASES_V1.length];
    stem=`${c.caseName} (${c.year}) is best known here for:`; correct=c.principle;
    options=chooseFour(POL_CP006_BASIC_STRUCTURE_CASES_V1.map(x=>x.principle),correct,`${qlId}:${c.year}`,target); explanation=c.principle; ({sourceIds,sourceFactIds}=meta([c]));
  } else if (ql === 8) {
    const variants=[
      ["The basic structure doctrine means that Parliament:","May amend the Constitution but cannot destroy its basic structure"],
      ["The basic structure doctrine was laid down in:","Kesavananda Bharati v. State of Kerala"],
      ["Which statement about the basic structure is correct?","There is no single closed constitutional list of all basic-structure features."]
    ]; [stem,correct]=variants[row%3]; options=moveCorrect([correct,"Cannot amend any Fundamental Right","May destroy any constitutional feature by special majority","Can amend the Constitution only after a referendum"],correct,target);
    explanation="Kesavananda Bharati established that Parliament's amending power is wide but cannot be used to destroy the Constitution's basic structure."; sourceIds=["SCI-KESAVANANDA-1973"]; sourceFactIds=["pol-cp006-basic-structure-core"];
  } else if (ql === 9) {
    correct=POL_CP006_BASIC_STRUCTURE_FEATURES_V1[row%POL_CP006_BASIC_STRUCTURE_FEATURES_V1.length]; stem="Which of the following has been recognised as part of the Constitution's basic structure?";
    options=moveCorrect([correct,"A fixed number of Union ministers","A permanent ban on creating new States","A constitutional requirement for one national language"],correct,target); explanation=`${correct} has been recognised in basic-structure jurisprudence.`; sourceIds=["SCI-KESAVANANDA-1973","SCI-BASIC-STRUCTURE-2022"]; sourceFactIds=["pol-cp006-basic-features"];
  } else if (ql === 10) {
    const variants=[
      ["Minerva Mills is associated with which basic-structure principle?","Limited amending power of Parliament"],
      ["Minerva Mills stressed the importance of balance between:","Fundamental Rights and Directive Principles"],
      ["Which statement reflects Minerva Mills?","An unlimited power to amend the Constitution would itself damage the basic structure."]
    ]; [stem,correct]=variants[row%3]; options=moveCorrect([correct,"Absolute supremacy of Directive Principles over all Fundamental Rights","Unlimited amending power","Removal of judicial review from constitutional amendments"],correct,target); explanation="Minerva Mills reaffirmed limited amending power and the constitutional balance between Parts III and IV."; sourceIds=["SCI-BASIC-STRUCTURE-2022","SCI-ARTICLE31C-2024"]; sourceFactIds=["pol-cp006-minerva-mills"];
  } else if (ql === 11) {
    const variants=[
      ["S. R. Bommai is especially associated with which basic feature?","Secularism"],
      ["Which basic feature keeps constitutional organs within legal limits through courts?","Judicial review"],
      ["Which of the following is a recognised basic feature?","Separation of powers"]
    ]; [stem,correct]=variants[row%3]; options=moveCorrect([correct,"Unlimited parliamentary sovereignty","One-party government","A fixed territorial map of States"],correct,target); explanation=`${correct} forms part of settled basic-structure doctrine.`; sourceIds=["SCI-BASIC-STRUCTURE-2022"]; sourceFactIds=["pol-cp006-basic-features"];
  } else if (ql === 12) {
    const variants=[
      ["I. R. Coelho is important for the Ninth Schedule because it held that:","Post-24 April 1973 insertions can face basic-structure review"],
      ["The key cut-off date commonly used in Ninth Schedule basic-structure review is:","24 April 1973"],
      ["Which statement about the Ninth Schedule is correct?","Placement in the Ninth Schedule does not create complete immunity from basic-structure review for post-Kesavananda insertions."]
    ]; [stem,correct]=variants[row%3]; options=moveCorrect([correct,"Every Ninth Schedule law is completely immune from judicial review","The Ninth Schedule was created by the Forty-fourth Amendment","Only State laws can be placed in the Ninth Schedule"],correct,target); explanation="I. R. Coelho applies basic-structure review to constitutionally relevant post-24 April 1973 Ninth Schedule insertions."; sourceIds=["SCI-BASIC-STRUCTURE-2022",C]; sourceFactIds=["pol-cp006-case-coelho","pol-cp006-schedule-9"];
  } else if (ql === 13) {
    const s=POL_CP006_SCHEDULES_V1[(row*3)%POL_CP006_SCHEDULES_V1.length]; stem=`${s.schedule} deals with:`; correct=s.subject;
    options=chooseFour(POL_CP006_SCHEDULES_V1.map(x=>x.subject),correct,`${qlId}:${s.schedule}`,target); explanation=`${s.schedule}: ${s.detail}.`; ({sourceIds,sourceFactIds}=meta([s]));
  } else if (ql === 14) {
    const s=POL_CP006_SCHEDULES_V1[(row*5+1)%POL_CP006_SCHEDULES_V1.length]; stem=`${s.subject} is mainly covered by:`; correct=s.schedule;
    options=chooseFour(POL_CP006_SCHEDULES_V1.map(x=>x.schedule),correct,`${qlId}:${s.schedule}`,target); explanation=`${s.schedule}: ${s.detail}.`; ({sourceIds,sourceFactIds}=meta([s]));
  } else if (ql === 15) {
    const variants=[
      ["States and Union territories are listed in the:","First Schedule"],
      ["Allocation of Rajya Sabha seats is given in the:","Fourth Schedule"],
      ["Union, State and Concurrent Lists are in the:","Seventh Schedule"]
    ]; [stem,correct]=variants[row%3]; options=moveCorrect(["First Schedule","Fourth Schedule","Seventh Schedule","Tenth Schedule"],correct,target); explanation=`${correct} contains this subject.`; sourceFactIds=["pol-cp006-schedule-core-map"];
  } else if (ql === 16) {
    const variants=[
      ["The Fifth Schedule mainly concerns:","Scheduled Areas and Scheduled Tribes"],
      ["The Sixth Schedule applies to specified tribal areas in:","Assam, Meghalaya, Tripura and Mizoram"],
      ["Autonomous district and regional councils are especially associated with the:","Sixth Schedule"],
      ["Which statement correctly distinguishes the Fifth and Sixth Schedules?","The Fifth deals broadly with Scheduled Areas and Scheduled Tribes; the Sixth has a special tribal-area framework for four northeastern States."]
    ]; [stem,correct]=variants[row%4]; options=moveCorrect([correct,"Union and State legislative lists","Anti-defection rules","Municipal functions"],correct,target); explanation=row%4===0?schedule("Fifth Schedule").detail:row%4===1||row%4===2?schedule("Sixth Schedule").detail:"The Fifth and Sixth Schedules create different constitutional frameworks for Scheduled/tribal areas."; sourceFactIds=["pol-cp006-schedule-5-6"];
  } else if (ql === 17) {
    const variants=[
      ["The Eighth Schedule deals with:","Recognised languages"],
      ["How many languages are currently listed in the Eighth Schedule?","22"],
      ["Recognised constitutional languages are listed in the:","Eighth Schedule"]
    ]; [stem,correct]=variants[row%3]; options=moveCorrect([correct,"18","20","24"],correct,target); if(row%3!==1) options=moveCorrect([correct,"Seventh Schedule","Ninth Schedule","Tenth Schedule"],correct,target); explanation=schedule("Eighth Schedule").detail; sourceFactIds=["pol-cp006-schedule-8"];
  } else if (ql === 18) {
    const variants=[
      ["The Tenth Schedule deals with:","Anti-defection provisions"],
      ["The anti-defection law was added by the:","Fifty-second Amendment"],
      ["Disqualification on grounds of defection is mainly dealt with in the:","Tenth Schedule"]
    ]; [stem,correct]=variants[row%3]; options=moveCorrect([correct,"Ninth Schedule","Eleventh Schedule","Twelfth Schedule"],correct,target); if(row%3===1) options=moveCorrect([correct,"Forty-fourth Amendment","Sixty-first Amendment","Seventy-third Amendment"],correct,target); explanation="The Fifty-second Amendment added the Tenth Schedule containing anti-defection provisions."; sourceFactIds=["pol-cp006-schedule-10","pol-cp006-amendment-52"];
  } else if (ql === 19) {
    const variants=[["The Eleventh Schedule is connected with:","Panchayats"],["How many subjects are listed in the Eleventh Schedule?","29"],["The Eleventh Schedule was added by the:","Seventy-third Amendment"]]; [stem,correct]=variants[row%3]; options=moveCorrect([correct,"Municipalities","Anti-defection","Recognised languages"],correct,target); if(row%3===1) options=moveCorrect(["18","22","29","30"],correct,target); if(row%3===2) options=moveCorrect([correct,"Seventy-fourth Amendment","Fifty-second Amendment","Eighty-sixth Amendment"],correct,target); explanation="The Seventy-third Amendment added the Eleventh Schedule with 29 subjects for Panchayats."; sourceFactIds=["pol-cp006-schedule-11","pol-cp006-amendment-73"];
  } else if (ql === 20) {
    const variants=[["The Twelfth Schedule is connected with:","Municipalities"],["How many subjects are listed in the Twelfth Schedule?","18"],["The Twelfth Schedule was added by the:","Seventy-fourth Amendment"]]; [stem,correct]=variants[row%3]; options=moveCorrect([correct,"Panchayats","Anti-defection","Recognised languages"],correct,target); if(row%3===1) options=moveCorrect(["18","22","29","30"],correct,target); if(row%3===2) options=moveCorrect([correct,"Seventy-third Amendment","Fifty-second Amendment","Eighty-sixth Amendment"],correct,target); explanation="The Seventy-fourth Amendment added the Twelfth Schedule with 18 subjects for Municipalities."; sourceFactIds=["pol-cp006-schedule-12","pol-cp006-amendment-74"];
  } else if (ql === 21) {
    const names=["Fifty-second Amendment","Sixty-first Amendment","Seventy-third Amendment","Seventy-fourth Amendment"];
    const a=amendment(names[row%4]); stem=`${a.amendment} (${a.year}) is associated with:`; correct=a.change; options=chooseFour(names.map(n=>amendment(n).change),correct,`${qlId}:${a.year}`,target); explanation=a.change; ({sourceIds,sourceFactIds}=meta([a]));
  } else if (ql === 22) {
    const names=["First Amendment","Twenty-fourth Amendment","Eighty-sixth Amendment","One Hundred and First Amendment","One Hundred and Sixth Amendment"];
    const a=amendment(names[row%5]); stem=`${a.change} This was done by the:`; correct=a.amendment; options=chooseFour(POL_CP006_HIGH_YIELD_AMENDMENTS_V1.map(x=>x.amendment),correct,`${qlId}:${a.year}`,target); explanation=`${a.amendment} (${a.year}): ${a.change}.`; ({sourceIds,sourceFactIds}=meta([a]));
  } else if (ql === 23) {
    const sets=[
      ["First Amendment","Twenty-fourth Amendment","Forty-second Amendment","Forty-fourth Amendment"],
      ["Fifty-second Amendment","Sixty-first Amendment","Seventy-third Amendment","Eighty-sixth Amendment"],
      ["Seventy-third Amendment","Seventy-fourth Amendment","Ninety-first Amendment","One Hundred and First Amendment"],
      ["One Hundred and First Amendment","One Hundred and Third Amendment","One Hundred and Sixth Amendment","Ninety-first Amendment"]
    ];
    const names=sets[row%4]; const sorted=[...names].sort((a,b)=>amendment(a).year-amendment(b).year); correct=sorted.join(" → "); stem="Which sequence is in chronological order from earliest to latest?";
    const wrong1=[...sorted].reverse().join(" → "); const wrong2=[sorted[1],sorted[0],sorted[2],sorted[3]].join(" → "); const wrong3=[sorted[0],sorted[2],sorted[1],sorted[3]].join(" → "); options=moveCorrect([correct,wrong1,wrong2,wrong3],correct,target); explanation=`Correct order by year: ${sorted.map(n=>`${n} (${amendment(n).year})`).join(", ")}.`; ({sourceIds,sourceFactIds}=meta(names.map(amendment)));
  } else if (ql === 24) {
    const variants=[
      ["Which Amendment added Socialist and Secular to the Preamble?","Forty-second Amendment"],
      ["Which Amendment shifted the right to property out of the Fundamental Rights chapter?","Forty-fourth Amendment"],
      ["Which Amendment is often called the wide-ranging or 'Mini-Constitution' amendment?","Forty-second Amendment"],
      ["Which pair is correctly matched?","Forty-second — Fundamental Duties; Forty-fourth — right to property moved out of Fundamental Rights"]
    ]; [stem,correct]=variants[row%4]; options=moveCorrect([correct,"Forty-fourth Amendment","Twenty-fourth Amendment","Fifty-second Amendment"],correct,target); if(row%4===3) options=moveCorrect([correct,"Forty-second — voting age 18; Forty-fourth — anti-defection","Forty-second — GST; Forty-fourth — Panchayats","Forty-second — EWS reservation; Forty-fourth — Municipalities"],correct,target); explanation="The Forty-second Amendment made wide-ranging changes including Fundamental Duties; the Forty-fourth Amendment reversed or modified several changes and altered the right-to-property position."; ({sourceIds,sourceFactIds}=meta([amendment("Forty-second Amendment"),amendment("Forty-fourth Amendment")]));
  } else if (ql === 25) {
    const names=["One Hundred and First Amendment","One Hundred and Third Amendment","One Hundred and Sixth Amendment"]; const a=amendment(names[row%3]); stem=`${a.amendment} is associated with:`; correct=a.change;
    options=moveCorrect([correct,...names.filter(n=>n!==a.amendment).map(n=>amendment(n).change),"Anti-defection under the Tenth Schedule"],correct,target); explanation=`${a.amendment} (${a.year}): ${a.change}.`; ({sourceIds,sourceFactIds}=meta([a]));
  } else {
    const sets=[
      [["Article 368 allows constitutional amendment by Parliament.","The basic structure doctrine limits the amending power.","The Seventh Schedule contains the Union, State and Concurrent Lists."],"All three","All three statements are correct."],
      [["The Tenth Schedule concerns anti-defection.","The Eleventh Schedule concerns Panchayats.","The Twelfth Schedule contains 29 Panchayat subjects."],"Only two","Statements 1 and 2 are correct. The Twelfth Schedule concerns Municipalities and contains 18 subjects."],
      [["Kesavananda Bharati is associated with the basic structure doctrine.","Minerva Mills is associated with limited amending power.","A joint sitting can resolve disagreement on a Constitution Amendment Bill."],"Only two","Statements 1 and 2 are correct. Article 368 provides no joint sitting for an Amendment Bill."]
    ]; const [ss,ans,exp]=sets[row%3] as [string[],string,string]; stem=`Consider the following statements:\n1. ${ss[0]}\n2. ${ss[1]}\n3. ${ss[2]}\nHow many statements are correct?`; correct=ans; options=moveCorrect(["None","Only one","Only two","All three"],correct,target); explanation=exp; sourceIds=[C,"SCI-KESAVANANDA-1973","SCI-BASIC-STRUCTURE-2022"]; sourceFactIds=["pol-cp006-integrated"];
  }

  return { questionId:`POL-CP006-V1-${String(globalIndex+1).padStart(3,"0")}`,chapterId:"POL-001",cpId:"POL-CP-006",qlId,qlName:qlNames[ql],difficulty:difficultyForQl(ql),stem,options,correctIndex:target,canonicalAnswer:correct,explanation,sourceIds,sourceFactIds,reviewOnly:true,runtimeRegistered:false };
}

export function generatePolCp006ReviewBatchV1() {
  const output: PolCp006ReviewQuestion[]=[]; let globalIndex=0;
  for(let ql=1; ql<=26; ql+=1) for(let row=0; row<countsByQl[ql]; row+=1) { output.push(makeQuestion(ql,row,globalIndex)); globalIndex+=1; }
  return output;
}
