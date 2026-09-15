import type { PolCp010Difficulty, PolCp010ReviewQuestion } from "./pol-cp010-review-types";

const C = "LEGISLATIVE-DEPT-CONSTITUTION-2025";
type Draft = Omit<PolCp010ReviewQuestion, "questionId" | "correctIndex" | "options"> & { distractors: [string, string, string] };
const drafts: Draft[] = [];

function add(ql: number, difficulty: PolCp010Difficulty, stem: string, answer: string, distractors: [string, string, string], explanation: string, fact: string) {
  drafts.push({ qlId: `POL-010-QL-${String(ql).padStart(3, "0")}`, difficulty, stem, canonicalAnswer: answer, distractors, explanation, sourceIds: [C], sourceFactIds: [fact] });
}

// QL-001 — Article to subject
add(1,"Easy","Article 79 deals with:","Constitution of Parliament",["Composition of Rajya Sabha","Duration of Parliament","Qualifications for Parliament"],"Article 79 says Parliament consists of the President and the two Houses of Parliament.","pol-cp010-art79");
add(1,"Easy","Article 80 deals with:","Composition of Rajya Sabha",["Composition of Lok Sabha","Sessions of Parliament","Speaker and Deputy Speaker"],"Article 80 gives the constitutional composition and main representation rules for Rajya Sabha.","pol-cp010-art80");
add(1,"Easy","Article 83 deals with:","Duration of Houses of Parliament",["Constitution of Parliament","Readjustment after census","Parliamentary secretariat"],"Article 83 covers the continuing nature of Rajya Sabha and the normal five-year term of Lok Sabha.","pol-cp010-art83");
add(1,"Easy","Article 84 deals with:","Qualifications for membership of Parliament",["Sessions of Parliament","Presiding officers' salaries","Special address by President"],"Article 84 sets citizenship, oath, age and other qualification requirements for Parliament membership.","pol-cp010-art84");

// QL-002 — Subject to Article
add(2,"Easy","Sessions, prorogation and dissolution of Parliament are mainly covered by:","Article 85",["Article 83","Article 87","Article 91"],"Article 85 covers summoning Parliament, prorogation and the President's power to dissolve Lok Sabha.","pol-cp010-art85");
add(2,"Easy","The President's special address to Parliament is mainly covered by:","Article 87",["Article 85","Article 86","Article 88"],"Article 87 requires the special address after a general election and at the first session of each year.","pol-cp010-art87");
add(2,"Easy","Chairman and Deputy Chairman of Rajya Sabha are mainly covered by:","Article 89",["Article 90","Article 93","Article 97"],"Article 89 makes the Vice-President ex officio Chairman and provides for a Deputy Chairman chosen by Rajya Sabha.","pol-cp010-art89");
add(2,"Easy","Speaker and Deputy Speaker of Lok Sabha are mainly covered by:","Article 93",["Article 89","Article 94","Article 98"],"Article 93 requires Lok Sabha to choose two of its members as Speaker and Deputy Speaker.","pol-cp010-art93");

// QL-003 — Parliament composition
add(3,"Easy","Which of the following is part of Parliament under Article 79?","President",["Prime Minister","Chief Justice of India","Election Commission"],"Article 79 includes the President along with Rajya Sabha and Lok Sabha as parts of Parliament.","pol-cp010-parliament-structure");
add(3,"Easy","The Council of States is the constitutional name of:","Rajya Sabha",["Lok Sabha","Inter-State Council","Legislative Council"],"The Council of States is Rajya Sabha, one of the two Houses of Parliament.","pol-cp010-parliament-structure");
add(3,"Easy","The House of the People is the constitutional name of:","Lok Sabha",["Rajya Sabha","Legislative Assembly","Council of States"],"The House of the People is Lok Sabha, the directly elected House of Parliament.","pol-cp010-parliament-structure");
add(3,"Easy","Parliament under Article 79 has:","President and two Houses",["Two Houses only","President and Lok Sabha only","Prime Minister and two Houses"],"The Constitution treats Parliament as the President together with Rajya Sabha and Lok Sabha.","pol-cp010-parliament-structure");

// QL-004 — Rajya Sabha composition
add(4,"Easy","The maximum constitutional strength of Rajya Sabha is:","250",["238","245","252"],"Article 80 allows twelve nominated members and up to 238 representatives, giving a maximum of 250.","pol-cp010-parliament-structure");
add(4,"Easy","How many Rajya Sabha members may be nominated by the President?","12",["10","14","20"],"Article 80 provides for twelve presidential nominees in Rajya Sabha from specified fields of knowledge or experience.","pol-cp010-parliament-structure");
add(4,"Easy","Rajya Sabha seat allocation among States and Union territories is linked to the:","Fourth Schedule",["Second Schedule","Seventh Schedule","Tenth Schedule"],"Article 80 links allocation of Rajya Sabha seats to the Fourth Schedule of the Constitution.","pol-cp010-parliament-structure");
add(4,"Easy","Which is a listed field for Rajya Sabha nomination?","Social service",["Agriculture only","Public administration only","Defence service only"],"Article 80 lists literature, science, art and social service for presidential nomination to Rajya Sabha.","pol-cp010-parliament-structure");

// QL-005 — Rajya Sabha election and nomination
add(5,"Easy","State representatives in Rajya Sabha are elected by:","Elected members of the State Legislative Assembly",["All State legislators","Direct public vote","Members of Lok Sabha"],"Elected MLAs choose State representatives to Rajya Sabha; members of a Legislative Council do not form this electorate.","pol-cp010-parliament-structure");
add(5,"Easy","State representatives to Rajya Sabha are elected by:","Proportional representation through single transferable vote",["First-past-the-post voting","Open public referendum","Simple majority in a joint sitting"],"Article 80 uses proportional representation through the single transferable vote for State representatives to Rajya Sabha.","pol-cp010-parliament-structure");
add(5,"Easy","Who nominates the twelve nominated members of Rajya Sabha?","President",["Prime Minister","Rajya Sabha Chairman","Chief Justice of India"],"The President nominates twelve Rajya Sabha members having special knowledge or practical experience in the listed fields.","pol-cp010-parliament-structure");
add(5,"Easy","Which set contains only listed Rajya Sabha nomination fields?","Literature, science, art and social service",["Law, defence, agriculture and trade","Sports, medicine, law and industry","Education, farming, defence and commerce"],"Article 80 specifically lists literature, science, art and social service for the nominated category.","pol-cp010-parliament-structure");

// QL-006 — Lok Sabha composition
add(6,"Easy","Article 81 allows up to how many members from States in Lok Sabha?","530",["500","520","550"],"Article 81 allows not more than 530 members chosen by direct election from State territorial constituencies.","pol-cp010-parliament-structure");
add(6,"Easy","Article 81 allows up to how many members to represent Union territories in Lok Sabha?","20",["12","18","25"],"Article 81 allows not more than twenty members to represent Union territories in Lok Sabha.","pol-cp010-parliament-structure");
add(6,"Easy","Members representing States in Lok Sabha are chosen by:","Direct election from territorial constituencies",["State Legislative Assemblies","Rajya Sabha","The President"],"State representatives in Lok Sabha are chosen directly from territorial constituencies under Article 81.","pol-cp010-parliament-structure");
add(6,"Easy","Lok Sabha is also called the:","House of the People",["Council of States","Federal Council","National Council"],"The Constitution uses House of the People as the formal name for Lok Sabha.","pol-cp010-parliament-structure");

// QL-007 — Readjustment after census
add(7,"Medium","Readjustment of Lok Sabha seats after a census is mainly covered by:","Article 82",["Article 80","Article 83","Article 85"],"Article 82 deals with readjusting State seat allocation and territorial constituencies after a census.","pol-cp010-art82");
add(7,"Medium","Who determines by law the authority and manner for readjustment under Article 82?","Parliament",["Election Commission alone","President alone","Supreme Court"],"Article 82 leaves the authority and manner of readjustment to be determined by Parliament by law.","pol-cp010-art82");
add(7,"Medium","A readjustment under Article 82 affects the existing Lok Sabha immediately: ","No",["Yes","Only if Rajya Sabha agrees","Only during an Emergency"],"Article 82 says a readjustment does not affect representation in the existing Lok Sabha until its dissolution.","pol-cp010-art82");
add(7,"Medium","The present constitutional freeze refers to figures from the first census taken after:","2026",["2001","2011","2031"],"Article 82 keeps the stated readjustment freeze until relevant figures from the first census after 2026 are published.","pol-cp010-art82");

// QL-008 — Duration of Houses
add(8,"Medium","Rajya Sabha is:","A continuing House not subject to dissolution",["Dissolved every five years","Dissolved with Lok Sabha","Dissolved every six years"],"Article 83 makes Rajya Sabha a continuing House, so the House itself is not dissolved.","pol-cp010-parliament-structure");
add(8,"Medium","About one-third of Rajya Sabha members retire after every:","Two years",["One year","Three years","Five years"],"As nearly as possible one-third of Rajya Sabha members retire at the end of every second year.","pol-cp010-parliament-structure");
add(8,"Medium","The normal term of Lok Sabha is:","Five years from its first meeting",["Five years from election notification","Six years from its first meeting","Four years from election"],"Lok Sabha normally continues for five years from the date appointed for its first meeting unless sooner dissolved.","pol-cp010-parliament-structure");
add(8,"Medium","During a national Emergency, Lok Sabha may be extended at a time by up to:","One year",["Six months","Two years","Five years"],"Parliament may extend Lok Sabha during an Emergency by up to one year at a time, subject to the post-Emergency limit.","pol-cp010-parliament-structure");

// QL-009 — Qualifications
add(9,"Medium","Minimum age for Rajya Sabha membership is:","30 years",["25 years","28 years","35 years"],"Article 84 sets thirty years as the minimum age for a seat in Rajya Sabha.","pol-cp010-membership-qualifications");
add(9,"Medium","Minimum age for Lok Sabha membership is:","25 years",["21 years","30 years","35 years"],"Article 84 sets twenty-five years as the minimum age for a seat in Lok Sabha.","pol-cp010-membership-qualifications");
add(9,"Medium","For Article 84 qualification, the required oath is made before a person authorised by the:","Election Commission",["President","Chief Justice of India","Speaker of Lok Sabha"],"Article 84 requires the candidate's oath or affirmation before a person authorised by the Election Commission.","pol-cp010-membership-qualifications");
add(9,"Medium","The Article 84 qualification oath follows the form in the:","Third Schedule",["Second Schedule","Fourth Schedule","Tenth Schedule"],"The Constitution places the Article 84 oath or affirmation form in the Third Schedule.","pol-cp010-membership-qualifications");

// QL-010 — Sessions
add(10,"Medium","Who summons each House of Parliament?","President",["Prime Minister","Speaker and Chairman jointly","Chief Justice of India"],"Article 85 formally gives the President the power to summon each House of Parliament.","pol-cp010-sessions-address-rights");
add(10,"Medium","The Constitution allows a gap of six months or more between the relevant sittings of two sessions:","No",["Yes","Only for Rajya Sabha","Only with Supreme Court approval"],"Article 85 says six months shall not intervene between the last sitting of one session and first sitting of the next.","pol-cp010-sessions-address-rights");
add(10,"Medium","Who may prorogue either House of Parliament?","President",["Prime Minister alone","Speaker alone","Election Commission"],"Article 85 gives the President the formal power to prorogue either House of Parliament.","pol-cp010-sessions-address-rights");
add(10,"Medium","Which House may be dissolved under Article 85?","Lok Sabha",["Rajya Sabha","Both Houses","Neither House"],"Article 85 allows dissolution of Lok Sabha; Rajya Sabha is a continuing House and is not dissolved.","pol-cp010-sessions-address-rights");

// QL-011 — Presidential address and messages
add(11,"Medium","Under Article 86, the President may address:","Either House or both Houses assembled together",["Lok Sabha only","Rajya Sabha only","Only a joint sitting on a Bill"],"Article 86 permits the President to address either House or both Houses assembled together.","pol-cp010-sessions-address-rights");
add(11,"Medium","The President may send a message to either House about:","A pending Bill or another matter",["Money Bills only","Constitution Amendment Bills only","Election disputes only"],"Article 86 allows presidential messages about a pending Bill or any other matter requiring consideration.","pol-cp010-sessions-address-rights");
add(11,"Medium","The special address under Article 87 is required at the first session after:","Each general election to Lok Sabha",["Every Rajya Sabha election","Every constitutional amendment","Every Budget"],"Article 87 requires the President's special address at the first session after each general election to Lok Sabha.","pol-cp010-sessions-address-rights");
add(11,"Medium","Article 87 also requires the President's special address at:","The first session of each year",["Every session of Parliament","The last session of each year","Every joint sitting"],"The President also addresses both Houses assembled together at the commencement of the first session each year.","pol-cp010-sessions-address-rights");

// QL-012 — Article 88 rights
add(12,"Medium","Under Article 88, the Attorney-General may speak in:","Either House of Parliament",["Lok Sabha only","Rajya Sabha only","Neither House unless elected"],"Article 88 lets the Attorney-General speak and take part in proceedings of either House.","pol-cp010-sessions-address-rights");
add(12,"Medium","Article 88 allows Ministers and the Attorney-General to take part in a joint sitting:","Yes",["No","Only if both are MPs","Only with presidential permission"],"Article 88 expressly includes participation in a joint sitting of both Houses.","pol-cp010-sessions-address-rights");
add(12,"Medium","A Minister may participate in a parliamentary committee under Article 88 when:","Named as a member of that committee",["Any committee automatically","Only a Lok Sabha committee","Only a financial committee"],"Article 88 covers a parliamentary committee when the Minister is named as a member of that committee.","pol-cp010-sessions-address-rights");
add(12,"Medium","Article 88 by itself gives the Attorney-General a right to vote in Parliament:","No",["Yes","Only in Rajya Sabha","Only in a joint sitting"],"Article 88 grants speaking and participation rights but does not itself create a right to vote.","pol-cp010-sessions-address-rights");

// QL-013 — Rajya Sabha Chairman and Deputy Chairman
add(13,"Medium","The ex officio Chairman of Rajya Sabha is the:","Vice-President",["President","Prime Minister","Speaker of Lok Sabha"],"Article 89 makes the Vice-President of India ex officio Chairman of Rajya Sabha.","pol-cp010-rajya-sabha-officers");
add(13,"Medium","Who chooses the Deputy Chairman of Rajya Sabha?","Rajya Sabha",["President","Lok Sabha","Prime Minister"],"Rajya Sabha chooses one of its own members to serve as Deputy Chairman.","pol-cp010-rajya-sabha-officers");
add(13,"Medium","The Deputy Chairman of Rajya Sabha must be:","A member of Rajya Sabha",["A Lok Sabha member","A Governor","A retired judge"],"Article 89 requires Rajya Sabha to choose the Deputy Chairman from among its members.","pol-cp010-rajya-sabha-officers");
add(13,"Medium","The Vice-President needs a separate Rajya Sabha election to become Chairman:","No",["Yes","Only after a general election","Only after taking an MP oath"],"The Vice-President becomes Rajya Sabha Chairman automatically by virtue of the Vice-Presidential office.","pol-cp010-rajya-sabha-officers");

// QL-014 — Deputy Chairman removal etc.
add(14,"Medium","The Deputy Chairman of Rajya Sabha resigns to the:","Chairman",["President","Prime Minister","Speaker of Lok Sabha"],"Article 90 requires the Deputy Chairman's resignation to be addressed to the Chairman.","pol-cp010-rajya-sabha-officers");
add(14,"Medium","A Deputy Chairman who ceases to be a Rajya Sabha member:","Vacates the office",["Continues for six months","Continues until replaced","Becomes acting Chairman permanently"],"The Deputy Chairman must remain a Rajya Sabha member; ceasing membership also ends the Deputy Chairmanship.","pol-cp010-rajya-sabha-officers");
add(14,"Medium","Removal of the Rajya Sabha Deputy Chairman requires:","Majority of all the then members of Rajya Sabha",["Simple majority of members present and voting","Two-thirds of total membership","Joint sitting majority"],"Article 90 uses a majority of all the then members of Rajya Sabha for removal.","pol-cp010-rajya-sabha-officers");
add(14,"Medium","Minimum notice for a Deputy Chairman removal resolution is:","14 days",["7 days","21 days","30 days"],"At least fourteen days' notice is required before moving a resolution to remove the Deputy Chairman.","pol-cp010-rajya-sabha-officers");

// QL-015 — Acting Chairman
add(15,"Medium","If the Rajya Sabha Chairman's office is vacant, duties are first performed by the:","Deputy Chairman",["Speaker of Lok Sabha","Prime Minister","Leader of Rajya Sabha"],"Article 91 places the Deputy Chairman first when the office of Rajya Sabha Chairman is vacant.","pol-cp010-rajya-sabha-officers");
add(15,"Medium","When the Vice-President acts as President, Rajya Sabha Chairman duties are performed first by the:","Deputy Chairman",["President","Speaker of Lok Sabha","Prime Minister"],"When the Vice-President performs presidential functions, the Deputy Chairman performs the Chairman's duties.","pol-cp010-rajya-sabha-officers");
add(15,"Medium","If both Chairman and Deputy Chairman offices are vacant, who may appoint a Rajya Sabha member to act?","President",["Prime Minister","Lok Sabha Speaker","Chief Justice of India"],"Article 91 lets the President appoint a Rajya Sabha member when both presiding offices are vacant.","pol-cp010-rajya-sabha-officers");
add(15,"Medium","If Chairman and Deputy Chairman are absent from a sitting, the acting arrangement may be determined by:","Rajya Sabha rules or the House",["President only","Supreme Court","Election Commission"],"For absence from a sitting, Article 91 uses the House's rules and, if needed, a person determined by Rajya Sabha.","pol-cp010-rajya-sabha-officers");

// QL-016 — Rajya Sabha removal sitting
add(16,"Medium","During a resolution to remove the Vice-President, the Rajya Sabha Chairman may preside:","No",["Yes","Only with House permission","Only if Deputy Chairman is absent"],"Article 92 prevents the Chairman from presiding while the Vice-President's removal resolution is under consideration.","pol-cp010-rajya-sabha-officers");
add(16,"Medium","During the Vice-President's removal resolution, the Chairman may:","Speak and take part",["Preside normally","Cast a deciding vote","Vote twice"],"Article 92 allows the Chairman to speak and take part even though the Chairman cannot preside.","pol-cp010-rajya-sabha-officers");
add(16,"Medium","During the Vice-President's removal proceedings in Rajya Sabha, the Chairman can vote:","Not at all",["Only in the first instance","Only on a tie","Only with President's permission"],"Article 92 specifically removes the Chairman's voting right during proceedings on the Vice-President's removal.","pol-cp010-rajya-sabha-officers");
add(16,"Medium","A Deputy Chairman facing a removal resolution may preside over that sitting:","No",["Yes","Only for procedural matters","Only if Chairman permits"],"The presiding officer whose removal resolution is being considered cannot preside over that sitting.","pol-cp010-rajya-sabha-officers");

// QL-017 — Speaker and Deputy Speaker basics
add(17,"Medium","Who chooses the Speaker and Deputy Speaker of Lok Sabha?","Lok Sabha",["President","Prime Minister","Election Commission"],"Article 93 requires Lok Sabha to choose two of its members as Speaker and Deputy Speaker.","pol-cp010-lok-sabha-officers");
add(17,"Medium","The Speaker of Lok Sabha resigns to the:","Deputy Speaker",["President","Prime Minister","Rajya Sabha Chairman"],"Article 94 requires the Speaker's resignation to be addressed to the Deputy Speaker.","pol-cp010-lok-sabha-officers");
add(17,"Medium","The Deputy Speaker of Lok Sabha resigns to the:","Speaker",["President","Prime Minister","Vice-President"],"Article 94 requires the Deputy Speaker's resignation to be addressed to the Speaker.","pol-cp010-lok-sabha-officers");
add(17,"Medium","The Speaker and Deputy Speaker must be chosen from:","Members of Lok Sabha",["Members of either House","Former judges","State legislators"],"Article 93 requires Lok Sabha to choose both presiding officers from among its own members.","pol-cp010-lok-sabha-officers");

// QL-018 — Speaker removal and continuity
add(18,"Hard","Removal of the Lok Sabha Speaker requires:","Majority of all the then members of Lok Sabha",["Simple majority present and voting","Two-thirds of total membership","Joint sitting majority"],"Article 94 uses a majority of all the then members of Lok Sabha, not merely those present and voting.","pol-cp010-lok-sabha-officers");
add(18,"Hard","Minimum notice for removal of the Lok Sabha Speaker is:","14 days",["7 days","21 days","30 days"],"At least fourteen days' notice must be given before moving a resolution to remove the Speaker.","pol-cp010-lok-sabha-officers");
add(18,"Hard","When Lok Sabha is dissolved, the Speaker:","Continues until immediately before the first meeting of the new Lok Sabha",["Vacates office immediately","Continues for six months","Becomes Rajya Sabha Chairman"],"Article 94 keeps the Speaker in office after dissolution until immediately before the new Lok Sabha first meets.","pol-cp010-lok-sabha-officers");
add(18,"Hard","A Speaker who ceases to be a Lok Sabha member normally:","Vacates the office",["Continues for one year","Becomes Deputy Speaker","Continues until Rajya Sabha meets"],"Article 94 links the Speaker's office to Lok Sabha membership, subject to the special post-dissolution continuity rule.","pol-cp010-lok-sabha-officers");

// QL-019 — Acting Speaker and removal voting
add(19,"Hard","If the Speaker's office is vacant, duties are first performed by the:","Deputy Speaker",["Prime Minister","President","Leader of Opposition"],"Article 95 places the Deputy Speaker first when the office of Speaker is vacant.","pol-cp010-lok-sabha-officers");
add(19,"Hard","If both Speaker and Deputy Speaker offices are vacant, who may appoint a Lok Sabha member to act?","President",["Prime Minister","Rajya Sabha Chairman","Chief Justice of India"],"Article 95 allows the President to appoint a Lok Sabha member when both presiding offices are vacant.","pol-cp010-lok-sabha-officers");
add(19,"Hard","While a Speaker-removal resolution is under consideration, the Speaker may vote:","In the first instance, but not on an equality of votes",["Only on an equality of votes","Not at all","Twice"],"Article 96 lets the Speaker vote in the first instance during removal proceedings but gives no casting vote on a tie.","pol-cp010-lok-sabha-officers");
add(19,"Hard","If Speaker and Deputy Speaker are absent from a sitting, the acting arrangement may be determined by:","Lok Sabha rules or the House",["President only","Supreme Court","Election Commission"],"For absence from a sitting, Article 95 relies on Lok Sabha rules and, if needed, a person determined by the House.","pol-cp010-lok-sabha-officers");

// QL-020 — Salaries, secretariat and integrated distinctions
add(20,"Hard","Who may fix salaries and allowances of Parliament's presiding officers by law?","Parliament",["President","Finance Commission","Supreme Court"],"Article 97 gives Parliament the law-making role for salaries and allowances of the four presiding officers.","pol-cp010-support-structure");
add(20,"Hard","Until Parliament provides otherwise, presiding-officer salaries are linked to the:","Second Schedule",["Third Schedule","Fourth Schedule","Tenth Schedule"],"Article 97 refers to the Second Schedule until Parliament fixes these salaries and allowances by law.","pol-cp010-support-structure");
add(20,"Hard","Each House of Parliament normally has:","Separate secretarial staff",["One compulsory common secretariat","Staff appointed only by Supreme Court","No constitutional secretariat"],"Article 98 provides separate secretarial staff for each House, while still allowing posts common to both Houses.","pol-cp010-support-structure");
add(20,"Hard","Before Parliament makes a secretariat service law, rules may be made by the President after consulting the:","Speaker or Chairman concerned",["Prime Minister only","Chief Justice of India","Election Commission"],"Article 98 allows interim presidential rules after consultation with the Speaker or Chairman, depending on the House concerned.","pol-cp010-support-structure");

export function generatePolCp010ReviewBatchV1(): PolCp010ReviewQuestion[] {
  const questions = drafts.map((q, index) => {
    const correctIndex = (index % 4) as 0 | 1 | 2 | 3;
    const options = [...q.distractors] as string[];
    options.splice(correctIndex, 0, q.canonicalAnswer);
    return {
      questionId: `POL-CP010-V1-${String(index + 1).padStart(3, "0")}`,
      qlId: q.qlId,
      difficulty: q.difficulty,
      stem: q.stem,
      options: options as [string, string, string, string],
      correctIndex,
      canonicalAnswer: q.canonicalAnswer,
      explanation: q.explanation,
      sourceIds: q.sourceIds,
      sourceFactIds: q.sourceFactIds,
    };
  });

  if (questions.length !== 80) throw new Error(`Expected 80 questions, got ${questions.length}`);
  if (new Set(questions.map(q => q.qlId)).size !== 20) throw new Error("Expected 20 QLs");
  if (new Set(questions.map(q => q.explanation)).size !== questions.length) throw new Error("Repeated explanation");
  for (const q of questions) {
    if (q.options.length !== 4 || new Set(q.options).size !== 4) throw new Error(`Option defect in ${q.questionId}`);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) throw new Error(`Answer alignment defect in ${q.questionId}`);
    if (!q.stem.startsWith("Consider the following statements") && q.stem.trim().split(/\s+/).length > 28) throw new Error(`Long stem in ${q.questionId}`);
    const explanationWords = q.explanation.trim().split(/\s+/).length;
    if (explanationWords < 11 || explanationWords > 30) throw new Error(`Explanation length defect in ${q.questionId}: ${explanationWords}`);
  }
  return questions;
}
