import type { DifficultyBand } from "./index.ts";

export type Lp010Person = "A" | "B" | "C" | "D" | "E" | "F";
export type Lp010Mode = "PROFESSION" | "HEIGHT";
export type Lp010Assignment = Record<Lp010Person, number>;

export type Lp010Clue = {
  kind: "DIRECT" | "ROLE" | "TALLER" | "BETWEEN";
  person?: Lp010Person;
  other?: Lp010Person;
  value?: number;
  count?: number;
  roleText?: string;
  text: string;
};

export type Lp010Profile = {
  id: string;
  mode: Lp010Mode;
  scenario: string;
  people: Record<Lp010Person, string>;
  genders: Record<Lp010Person, "M" | "F">;
  familyClues: string[];
  relations: Array<{ from: Lp010Person; to: Lp010Person; relation: string }>;
  roles: Array<{ person: Lp010Person; anchor: Lp010Person; text: string }>;
  values: string[];
};

export type Lp010Child = {
  questionId: string;
  qlId: "LP-QL-037" | "LP-QL-038" | "LP-QL-039" | "LP-QL-040";
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  difficultyBand: DifficultyBand;
  misconceptionFamily: string;
  explanation: { summary: string; lines: string[] };
};

export type Lp010Caselet = {
  caseletId: string;
  scenario: string;
  questionSetup: string;
  scenarioProfileId: string;
  mode: Lp010Mode;
  difficultyBand: DifficultyBand;
  people: readonly Lp010Person[];
  labels: Lp010Profile;
  clues: readonly Lp010Clue[];
  assignment: Lp010Assignment;
  children: readonly Lp010Child[];
};

export const LP_010_REVIEW_PACKAGE = Object.freeze({
  packageId: "LP-010",
  checkpointId: "LP-CP-010",
  label: "Logic Puzzles — Family with Profession or Height",
  qlIds: ["LP-QL-037", "LP-QL-038", "LP-QL-039", "LP-QL-040"] as const,
  supportedDifficulties: ["Easy", "Medium", "Hard"] as const,
  supportedLanguages: ["en"] as const,
  runtimeMode: "REVIEW_ONLY" as const,
  reviewOnly: true as const,
});

const P: readonly Lp010Person[] = ["A", "B", "C", "D", "E", "F"];
const MALE = ["Aarav", "Bharat", "Chetan", "Dev", "Eshan", "Gaurav", "Harish", "Ishan", "Karan", "Manav", "Nitin", "Parth", "Ravi", "Sahil", "Tarun", "Varun"];
const FEMALE = ["Aditi", "Bhavna", "Charu", "Diya", "Farah", "Hina", "Ira", "Jyoti", "Kavya", "Meera", "Neha", "Pooja", "Ritu", "Simran", "Tanvi", "Zoya"];
const PROFESSIONS = ["Clerk", "Teacher", "Singer", "Lawyer", "Painter", "Doctor", "Engineer", "Banker", "Architect", "Nurse", "Professor", "Designer"];
const HEIGHTS = ["tallest", "second tallest", "third tallest", "fourth tallest", "fifth tallest", "shortest"];

const TOPOLOGIES = [
  { id: "PATERNAL_UNCLE", genders:{A:"M",B:"F",C:"M",D:"M",E:"F",F:"M"} as const, children:"{C} and {D} are the two sons of {A} and {B}.", relation:"paternal uncle", reverse:"nephew" },
  { id: "MATERNAL_AUNT", genders:{A:"M",B:"F",C:"F",D:"F",E:"M",F:"F"} as const, children:"{C} and {D} are the two daughters of {A} and {B}.", relation:"maternal aunt", reverse:"niece" },
  { id: "PATERNAL_AUNT", genders:{A:"M",B:"F",C:"M",D:"F",E:"F",F:"F"} as const, children:"{C} is the son and {D} is the daughter of {A} and {B}.", relation:"paternal aunt", reverse:"niece" },
  { id: "MATERNAL_UNCLE", genders:{A:"M",B:"F",C:"F",D:"M",E:"M",F:"M"} as const, children:"{C} is the daughter and {D} is the son of {A} and {B}.", relation:"maternal uncle", reverse:"nephew" },
] as const;

function hash(value: string) { let h = 2166136261; for (const c of value) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed: string) { let s = hash(seed) || 1; return () => { s = Math.imul(s ^ (s >>> 15), 2246822519) >>> 0; s = Math.imul(s ^ (s >>> 13), 3266489917) >>> 0; return ((s ^ (s >>> 16)) >>> 0) / 4294967296; }; }
function shuffle<T>(items: readonly T[], random: () => number) { const r = [...items]; for (let i=r.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [r[i],r[j]]=[r[j]!,r[i]!]; } return r; }
function fill(template: string, values: Record<string,string>) { return template.replace(/\{(\w+)\}/g,(_,k:string)=>values[k]??k); }

function profileFor(seed: string, index: number): Lp010Profile {
  const random = rng(`${seed}:profile:${index}`);
  const t = TOPOLOGIES[index % TOPOLOGIES.length]!;
  const male = shuffle(MALE, random), female = shuffle(FEMALE, random);
  let mi=0, fi=0; const people={} as Record<Lp010Person,string>;
  for (const person of P) people[person] = t.genders[person] === "M" ? male[mi++]! : female[fi++]!;
  const names = Object.fromEntries(P.map((person)=>[person,people[person]]));
  const mode: Lp010Mode = index % 2 === 0 ? "PROFESSION" : "HEIGHT";
  const values = mode === "PROFESSION" ? shuffle(PROFESSIONS, random).slice(0,6) : [...HEIGHTS];
  const relation = t.relation;
  return {
    id:`${t.id}_${mode}`, mode,
    scenario: mode === "PROFESSION" ? "Six members of one family have six different professions." : "Six members of one family have six different heights.",
    people, genders:t.genders,
    familyClues:[
      fill("{A} and {B} are married.",names), fill(t.children,names), fill("{C} is married to {E}.",names), fill("{F} is the only child of {C} and {E}.",names),
    ],
    relations:[
      {from:"D",to:"F",relation}, {from:"F",to:"D",relation:t.reverse},
      {from:"A",to:"F",relation: t.id.startsWith("MATERNAL") ? "maternal grandfather" : "paternal grandfather"},
      {from:"B",to:"F",relation: t.id.startsWith("MATERNAL") ? "maternal grandmother" : "paternal grandmother"},
      {from:"B",to:"E",relation:"mother-in-law"}, {from:"C",to:"F",relation:t.genders.C === "M" ? "father" : "mother"},
      {from:"E",to:"F",relation:t.genders.E === "M" ? "father" : "mother"},
    ],
    roles:[
      {person:"D",anchor:"F",text:`the ${relation} of ${people.F}`},
      {person:"B",anchor:"E",text:`the mother-in-law of ${people.E}`},
      {person:"A",anchor:"F",text:`the ${t.id.startsWith("MATERNAL") ? "maternal" : "paternal"} grandfather of ${people.F}`},
      {person:"E",anchor:"F",text:`the ${t.genders.E === "M" ? "father" : "mother"} of ${people.F}`},
    ], values,
  };
}

function assignmentFor(seed: string, index: number): Lp010Assignment {
  const random = rng(`${seed}:assignment:${index}`); const order=shuffle([0,1,2,3,4,5],random);
  return {A:order[0]!,B:order[1]!,C:order[2]!,D:order[3]!,E:order[4]!,F:order[5]!};
}

function direct(profile: Lp010Profile, assignment: Lp010Assignment, person: Lp010Person): Lp010Clue {
  const value=assignment[person]!, label=profile.values[value]!;
  return {kind:"DIRECT",person,value,text:profile.mode === "PROFESSION" ? `${profile.people[person]} is the ${label}.` : `${profile.people[person]} is the ${label} member of the family.`};
}
function role(profile: Lp010Profile, assignment: Lp010Assignment, person: Lp010Person): Lp010Clue {
  const r=profile.roles.find((item)=>item.person===person)!; const value=assignment[person]!, label=profile.values[value]!;
  return {kind:"ROLE",person,value,roleText:r.text,text:`${r.text[0]!.toUpperCase()}${r.text.slice(1)} is ${profile.mode === "PROFESSION" ? `the ${label}` : `the ${label} member of the family`}.`};
}

function buildClues(profile: Lp010Profile, assignment: Lp010Assignment, difficulty: DifficultyBand, seed:string): Lp010Clue[] {
  const random=rng(`${seed}:clues:${profile.id}`);
  if (difficulty === "Easy") return shuffle(P,random).slice(0,5).map((person)=>direct(profile,assignment,person));
  if (difficulty === "Medium") {
    const rolePeople=shuffle(profile.roles.map((item)=>item.person),random).slice(0,2);
    const remaining=shuffle(P.filter((person)=>!rolePeople.includes(person)),random).slice(0,3);
    return [...rolePeople.map((person)=>role(profile,assignment,person)),...remaining.map((person)=>direct(profile,assignment,person))];
  }
  if (profile.mode === "PROFESSION") {
    const rolePeople=profile.roles.map((item)=>item.person);
    const remaining=P.find((person)=>!rolePeople.includes(person))!;
    return [...rolePeople.map((person)=>role(profile,assignment,person)),direct(profile,assignment,remaining)];
  }
  const sorted=[...P].sort((a,b)=>assignment[a]-assignment[b]);
  const tallest=sorted[0]!, shortest=sorted[5]!, second=sorted[1]!, fourth=sorted[3]!, fifth=sorted[4]!;
  const roleTall=profile.roles.find((item)=>item.person===tallest);
  const first = roleTall ? role(profile,assignment,tallest) : direct(profile,assignment,tallest);
  return [
    first,
    direct(profile,assignment,shortest),
    {kind:"TALLER",person:second,other:fourth,text:`${profile.people[second]} is taller than ${profile.people[fourth]}.`},
    {kind:"BETWEEN",person:second,other:fifth,count:2,text:`Exactly two people are between ${profile.people[second]} and ${profile.people[fifth]} in the height order.`},
    direct(profile,assignment,thirdPerson(sorted)),
  ];
}
function thirdPerson(sorted: Lp010Person[]) { return sorted[2]!; }

function familyTable(profile:Lp010Profile) {
  const rows=P.map((person)=>`| ${profile.people[person]} | ${profile.genders[person] === "M" ? "Male" : "Female"} |`).join("\n");
  return `| Family member | Gender |\n|---|---|\n${rows}`;
}
function attrTable(profile:Lp010Profile, assignment:Lp010Assignment, revealed:Set<Lp010Person>) {
  const rows=P.map((person)=>`| ${profile.people[person]} | ${revealed.has(person) ? profile.values[assignment[person]] : "—"} |`).join("\n");
  return `| Family member | ${profile.mode === "PROFESSION" ? "Profession" : "Height position"} |\n|---|---|\n${rows}`;
}
function explanation(profile:Lp010Profile, assignment:Lp010Assignment, clues:readonly Lp010Clue[], conclusion:string) {
  const lines=[`**Step 1: Build the family tree**\n\nUse the four family statements first. This identifies the married couples, siblings, parent-child links and the uncle/aunt relation.\n\n${familyTable(profile)}`];
  const revealed=new Set<Lp010Person>(); let step=2;
  for (const clue of clues) {
    if (clue.kind === "DIRECT" || clue.kind === "ROLE") revealed.add(clue.person!);
    let detail = clue.kind === "ROLE" ? `From the family tree, ${clue.roleText} is ${profile.people[clue.person!]}. Therefore that row can be filled.` : clue.kind === "DIRECT" ? `Enter this information directly in ${profile.people[clue.person!]}'s row.` : clue.kind === "TALLER" ? `${profile.people[clue.person!]} must be above ${profile.people[clue.other!]} in the height order.` : `The two named members must be three positions apart in the height order.`;
    lines.push(`**Step ${step}: Use the clue — ${clue.text}**\n\n${detail}\n\n${attrTable(profile,assignment,revealed)}`); step++;
  }
  P.forEach((person)=>revealed.add(person));
  lines.push(`**Step ${step}: Complete the one-to-one table**\n\nAfter the stated entries are placed, the remaining unused value goes to the remaining family member.\n\n${attrTable(profile,assignment,revealed)}\n\n${conclusion}`);
  return {summary:"Build the family tree first, then fill the profession/height table clue by clue.",lines};
}
function choices(answer:string,pool:string[],target:number,random:()=>number) { const d=shuffle(pool.filter((x)=>x!==answer),random).slice(0,3); const idx=Math.min(target,3); d.splice(idx,0,answer); return {options:d,correctIndex:idx}; }
function stem(profile:Lp010Profile, clues:readonly Lp010Clue[], question:string) { return `${profile.scenario}\n\nFamily information:\n${profile.familyClues.map((x)=>`- ${x}`).join("\n")}\n\nAttribute information:\n${clues.map((x)=>`- ${x.text}`).join("\n")}\n\n${question}`; }

function children(caseletId:string,profile:Lp010Profile,assignment:Lp010Assignment,clues:readonly Lp010Clue[],difficulty:DifficultyBand,seed:string):Lp010Child[] {
  const random=rng(`${seed}:children:${caseletId}`); const offset=Number(caseletId.slice(-3))-1;
  const rel=profile.relations[offset%profile.relations.length]!; const relAns=rel.relation;
  const relPool=["father","mother","brother","sister","paternal uncle","maternal uncle","paternal aunt","maternal aunt","grandfather","grandmother","mother-in-law","brother-in-law","nephew","niece"];
  const c1=choices(relAns,relPool,offset%4,random);
  const targetValue=offset%6; const valuePerson=P.find((person)=>assignment[person]===targetValue)!; const personAns=profile.people[valuePerson]; const c2=choices(personAns,P.map((person)=>profile.people[person]),(offset+1)%4,random);
  const targetPerson=P[(offset+2)%6]!; const valueAns=profile.values[assignment[targetPerson]]!; const c3=choices(valueAns,profile.values,(offset+2)%4,random);
  const descriptor=profile.roles[offset%profile.roles.length]!; const roleAns=profile.values[assignment[descriptor.person]]!; const c4=choices(roleAns,profile.values,(offset+3)%4,random);
  const q2=profile.mode === "PROFESSION" ? `Who is the ${profile.values[targetValue]}?` : `Who is the ${profile.values[targetValue]} member of the family?`;
  const q3=profile.mode === "PROFESSION" ? `What is the profession of ${profile.people[targetPerson]}?` : `What is ${profile.people[targetPerson]}'s position in the height order?`;
  const q4=profile.mode === "PROFESSION" ? `What is the profession of ${descriptor.text}?` : `What is the height position of ${descriptor.text}?`;
  return [
    {questionId:`${caseletId}-Q1`,qlId:"LP-QL-037",stem:stem(profile,clues,`How is ${profile.people[rel.from]} related to ${profile.people[rel.to]}?`),...c1,answer:relAns,difficultyBand:difficulty,misconceptionFamily:"family-relation reversal",explanation:explanation(profile,assignment,clues,`${profile.people[rel.from]} is the **${relAns}** of ${profile.people[rel.to]}.`)},
    {questionId:`${caseletId}-Q2`,qlId:"LP-QL-038",stem:stem(profile,clues,q2),...c2,answer:personAns,difficultyBand:difficulty,misconceptionFamily:"attribute-to-person reversal",explanation:explanation(profile,assignment,clues,`${profile.values[targetValue]} belongs to **${personAns}**.`)},
    {questionId:`${caseletId}-Q3`,qlId:"LP-QL-039",stem:stem(profile,clues,q3),...c3,answer:valueAns,difficultyBand:difficulty,misconceptionFamily:"person-to-attribute reversal",explanation:explanation(profile,assignment,clues,`${profile.people[targetPerson]} is **${valueAns}**.`)},
    {questionId:`${caseletId}-Q4`,qlId:"LP-QL-040",stem:stem(profile,clues,q4),...c4,answer:roleAns,difficultyBand:difficulty,misconceptionFamily:"relation-and-attribute link",explanation:explanation(profile,assignment,clues,`${descriptor.text[0]!.toUpperCase()}${descriptor.text.slice(1)} is ${profile.people[descriptor.person]}, whose entry is **${roleAns}**.`)},
  ];
}

export function generateLp010Batch(seed="lp-010-review",count=8):Lp010Caselet[] {
  return Array.from({length:count},(_,index)=>{
    const profile=profileFor(seed,index); const assignment=assignmentFor(seed,index); const difficulty=(['Easy','Medium','Hard'] as const)[hash(`${seed}:difficulty:${index}`)%3]!; const clues=buildClues(profile,assignment,difficulty,`${seed}:${index}`); const caseletId=`LP-010-${String(index+1).padStart(3,'0')}`;
    return {caseletId,scenario:profile.scenario,questionSetup:`${profile.scenario} The family members are ${P.map((person)=>profile.people[person]).join(', ')}.`,scenarioProfileId:profile.id,mode:profile.mode,difficultyBand:difficulty,people:P,labels:profile,clues,assignment,children:children(caseletId,profile,assignment,clues,difficulty,seed)};
  });
}
