import type { KnowledgeV1Difficulty } from "../../types";

type ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export type SciCp016ReviewQuestion = {
  questionId:string; chapterId:"SCI-001"; cpId:"SCI-CP-016"; qlId:string; qlName:string;
  difficulty:KnowledgeV1Difficulty; stem:string; options:string[]; correctIndex:number;
  canonicalAnswer:string; explanation:string; sourceIds:string[]; sourceFactIds:string[];
  reviewOnly:true; runtimeRegistered:false;
};

const SOURCE_IDS = Object.freeze(["NCERT-SCIENCE-X-METALS-NONMETALS","NIOS-SECONDARY-SCIENCE-METALS-NONMETALS"]);

export const SCI_CP016_QL_NAMES_V1: Record<number,string> = {
  1:"Physical properties and exceptions",
  2:"Reactions and amphoteric oxides",
  3:"Reactivity series and displacement",
  4:"Ionic compounds and properties",
  5:"Common ores and ore-metal matching",
  6:"Metallurgy vocabulary and ore treatment",
  7:"Extraction, refining and thermite",
  8:"Corrosion and alloys",
  9:"Integrated metals/metallurgy reasoning",
  10:"Mixed metals/non-metals application"
};

const REVIEW_SPECS: readonly ReviewSpec[] = Object.freeze([
  [1,"Easy","Which property allows a metal to be beaten into thin sheets?","malleability",["ductility","sonority","brittleness"],"Malleability is the ability of a material to be hammered or rolled into thin sheets. Aluminium and gold are familiar malleable metals.",["sci016-malleability"]],
  [1,"Easy","The ability of a metal to be drawn into wires is called:","ductility",["malleability","sonority","brittleness"],"Ductility allows a metal to be drawn into wires. Copper is widely used for wiring because it is both ductile and a good conductor.",["sci016-ductility"]],
  [1,"Easy","Which non-metal is an important conductor of electricity?","graphite",["sulphur","phosphorus","bromine"],"Graphite is an allotrope of carbon with mobile electrons between its layers, so it conducts electricity although it is a non-metal.",["sci016-graphite-conductor"]],
  [1,"Easy","Which metal is liquid at ordinary room temperature?","mercury",["iron","aluminium","zinc"],"Mercury is a familiar exception to the general rule that metals are solid at room temperature.",["sci016-mercury-liquid"]],
  [1,"Easy","Metals generally conduct heat and electricity well because they contain:","mobile electrons",["only fixed neutrons","no charged particles","free protons outside nuclei"],"Metallic structures contain electrons that can move through the lattice, allowing heat and electric charge to be transferred efficiently.",["sci016-metal-conductivity"]],
  [1,"Easy","Which statement is generally true of solid non-metals?","They are usually brittle rather than malleable",["They are usually ductile","They are always sonorous","They are all good electrical conductors"],"Most solid non-metals break when hammered instead of forming sheets. This contrasts with the malleability of many metals.",["sci016-nonmetal-brittle"]],

  [2,"Easy","Magnesium burns in oxygen to form:","magnesium oxide",["magnesium chloride","magnesium sulphide","magnesium carbonate"],"Magnesium combines with oxygen to form magnesium oxide, MgO. The reaction is seen as a bright white flame.",["sci016-magnesium-oxide"]],
  [2,"Easy","Most metal oxides are generally:","basic in nature",["always acidic","always neutral","always gaseous"],"Most metal oxides are basic and react with acids to form salt and water. Some, such as aluminium oxide and zinc oxide, are amphoteric.",["sci016-metal-oxide-basic"]],
  [2,"Easy","Which oxide reacts with both acids and bases?","aluminium oxide",["sodium oxide only","carbon dioxide only","sulphur dioxide only"],"Aluminium oxide is amphoteric. It can react with acids as well as strong bases.",["sci016-alumina-amphoteric"]],
  [2,"Easy","Which other metal oxide is commonly described as amphoteric?","zinc oxide",["magnesium oxide","calcium oxide","potassium oxide"],"Zinc oxide reacts with both acids and bases, so it is classified as amphoteric.",["sci016-zinc-oxide-amphoteric"]],
  [2,"Easy","Which metal reacts vigorously with cold water?","sodium",["copper","silver","gold"],"Sodium is high in the reactivity series and reacts vigorously with cold water, producing sodium hydroxide and hydrogen.",["sci016-sodium-water"]],
  [2,"Easy","Copper normally does not release hydrogen from dilute hydrochloric acid because copper is:","below hydrogen in the reactivity series",["above sodium in the series","a non-metal","unable to form ions"],"A metal must be above hydrogen to displace hydrogen from a dilute non-oxidizing acid. Copper lies below hydrogen.",["sci016-copper-acid"]],

  [3,"Easy","A metal can displace another metal from its salt solution when it is:","more reactive than the metal in the salt",["less reactive than the metal in the salt","identical in reactivity in every case","a non-metal"],"Displacement occurs when the free metal is higher in the reactivity series than the metal present in the salt.",["sci016-displacement-rule"]],
  [3,"Easy","Which metal can displace copper from copper sulphate solution?","zinc",["silver","gold","copper"],"Zinc lies above copper in the reactivity series, so zinc can displace copper from copper sulphate solution.",["sci016-zinc-displace-copper"]],
  [3,"Easy","In Fe + CuSO₄ → FeSO₄ + Cu, the reaction occurs because:","iron is more reactive than copper",["copper is more reactive than iron","iron is below copper in the series","sulphate ions are metals"],"Iron is higher than copper in the reactivity series, so it replaces copper from copper sulphate.",["sci016-fe-cuso4"]],
  [3,"Easy","Which metal cannot displace zinc from zinc sulphate solution?","copper",["magnesium","calcium","aluminium"],"Copper is less reactive than zinc and therefore cannot displace zinc from zinc sulphate solution.",["sci016-copper-zinc-displacement"]],
  [3,"Easy","Which order shows decreasing reactivity correctly?","Mg > Zn > Fe > Cu",["Cu > Fe > Zn > Mg","Fe > Mg > Cu > Zn","Zn > Mg > Cu > Fe"],"Magnesium is more reactive than zinc, zinc more reactive than iron, and iron more reactive than copper.",["sci016-reactivity-order"]],
  [3,"Easy","A metal that releases hydrogen from dilute hydrochloric acid must generally lie:","above hydrogen in the reactivity series",["below hydrogen in the series","below gold only","outside the reactivity series"],"Metals above hydrogen can displace hydrogen ions from dilute non-oxidizing acids and release hydrogen gas.",["sci016-hydrogen-position"]],

  [4,"Medium","Ionic compounds are generally formed by:","transfer of electrons followed by attraction between oppositely charged ions",["transfer of protons between nuclei","sharing of neutrons","mixing without charge formation"],"A metal commonly loses electrons and a non-metal gains them. The resulting positive and negative ions attract to form an ionic compound.",["sci016-ionic-formation"]],
  [4,"Medium","Why do ionic compounds usually have high melting points?","strong electrostatic forces hold their ions in a lattice",["their ions do not attract","they contain only gases","they have no charged particles"],"Oppositely charged ions are strongly attracted in an ionic lattice, so considerable energy is needed to separate them during melting.",["sci016-ionic-high-mp"]],
  [4,"Medium","Why does solid sodium chloride conduct electricity poorly?","its ions are fixed in the crystal lattice",["it contains no ions","chloride becomes neutral","sodium becomes a non-metal"],"Solid NaCl has charged ions, but they cannot move freely. Without mobile charge carriers, electric current cannot pass easily.",["sci016-solid-nacl"]],
  [4,"Medium","Molten sodium chloride conducts electricity because:","its ions are free to move",["its protons leave the nuclei","all ions become neutral","it changes into metallic sodium completely"],"Melting frees the ions from fixed lattice positions. Mobile ions can then carry electric charge.",["sci016-molten-nacl"]],
  [4,"Medium","Which statement about solubility of ionic compounds is safest?","Many ionic compounds dissolve in water, but solubility varies among compounds",["Every ionic compound is completely soluble in water","No ionic compound dissolves in water","Ionic compounds dissolve only in kerosene"],"Water can stabilize many ions, so many ionic compounds are water-soluble. However, solubility is not universal and differs from one ionic compound to another.",["sci016-ionic-solubility-qualified"]],
  [4,"Medium","Why are ionic compounds usually poor conductors in solid form but conduct when molten?","ions are fixed in solids but mobile in the molten state",["solids have electrons but liquids have protons","melting removes all charges","ionic solids contain no ions"],"Electrical conduction requires mobile charged particles. Ionic solids have fixed ions, while molten ionic compounds have ions that can move.",["sci016-ionic-state-conduction"]],

  [5,"Medium","Bauxite is an important ore of:","aluminium",["lead","mercury","zinc"],"Bauxite is the principal aluminium ore used at general-exam level. Aluminium is obtained after purification and electrolytic reduction of its oxide.",["sci016-bauxite-aluminium"]],
  [5,"Medium","Haematite is an important ore of:","iron",["aluminium","lead","mercury"],"Haematite is iron(III) oxide-rich ore and is one of the major ores of iron.",["sci016-haematite-iron"]],
  [5,"Medium","Galena is an important ore of:","lead",["zinc","aluminium","mercury"],"Galena is lead sulphide, PbS, and is a major ore of lead.",["sci016-galena-lead"]],
  [5,"Medium","Cinnabar is an important ore of:","mercury",["iron","zinc","aluminium"],"Cinnabar is mercury sulphide, HgS, and is a well-known ore of mercury.",["sci016-cinnabar-mercury"]],
  [5,"Medium","Zinc blende is mainly:","zinc sulphide",["zinc carbonate","lead sulphide","iron oxide"],"Zinc blende, also called sphalerite, is zinc sulphide, ZnS.",["sci016-zinc-blende"]],
  [5,"Medium","Calamine is commonly represented at school-exam level as an ore containing:","zinc carbonate",["lead sulphide","mercury sulphide","aluminium oxide"],"Calamine is commonly treated in school-level chemistry as zinc carbonate, ZnCO₃, an ore of zinc.",["sci016-calamine-zinc"]],

  [6,"Medium","In metallurgy, unwanted earthy material mixed with an ore is called:","gangue",["flux","slag","alloy"],"Gangue is the unwanted rocky or earthy material accompanying an ore. It is removed during ore concentration and later processing.",["sci016-gangue"]],
  [6,"Medium","What is the main purpose of concentrating an ore?","to remove much of the gangue before extraction",["to convert every ore directly into an alloy","to add more impurities","to make the metal less pure"],"Concentration or ore dressing removes much of the unwanted gangue so the valuable mineral fraction can be processed more efficiently.",["sci016-ore-concentration"]],
  [6,"Medium","Heating a sulphide ore strongly in excess air is called:","roasting",["calcination","galvanization","electrolytic refining"],"Roasting heats a sulphide ore in air, commonly converting the sulphide into an oxide and releasing sulphur-containing gases.",["sci016-roasting"]],
  [6,"Medium","Heating a carbonate ore in limited or no air is called:","calcination",["roasting","electroplating","alloying"],"Calcination heats carbonate ores with little or no air and commonly converts the carbonate into an oxide while releasing carbon dioxide.",["sci016-calcination"]],
  [6,"Medium","A substance added during smelting to react with gangue is called:","flux",["slag","ore","alloy"],"Flux is added to combine chemically with gangue. The product formed can then be removed more easily.",["sci016-flux"]],
  [6,"Medium","The fusible product formed when flux combines with gangue is called:","slag",["ore","alloy","electrolyte"],"Flux reacts with gangue to form slag. Slag separates from the molten metal and helps remove impurities.",["sci016-slag"]],

  [7,"Medium","Highly reactive metals such as sodium are commonly extracted by:","electrolysis of molten compounds",["carbon reduction of their oxides","simple heating of their oxides","displacement by copper"],"Highly reactive metals form very stable compounds. Electrolysis of a molten ionic compound is used because carbon cannot readily reduce them.",["sci016-high-reactivity-electrolysis"]],
  [7,"Medium","For a moderately reactive metal such as zinc, extraction commonly includes:","conversion to an oxide followed by reduction",["electrolysis in every case","dissolving the ore only in water","cooling the ore without chemical change"],"Sulphide or carbonate ores are often converted to oxides by roasting or calcination. The oxide can then be reduced to the metal.",["sci016-zinc-extraction-route"]],
  [7,"Medium","In electrolytic refining, the impure metal is usually the:","anode",["cathode","electrolyte only","insulator"],"During electrolytic refining the impure metal is made the anode, while a thin sheet of pure metal is used as the cathode.",["sci016-refining-anode"]],
  [7,"Medium","In electrolytic refining, pure metal is deposited on the:","cathode",["anode","gangue","slag"],"Metal ions from the electrolyte gain electrons and deposit as pure metal on the cathode.",["sci016-refining-cathode"]],
  [7,"Medium","The thermite reaction commonly uses aluminium powder to reduce:","iron(III) oxide",["sodium chloride","calcium oxide","potassium chloride"],"In the thermite reaction aluminium reduces iron(III) oxide to molten iron and releases a large amount of heat.",["sci016-thermite"]],
  [7,"Medium","Why is carbon unsuitable for extracting sodium from sodium compounds?","sodium is more reactive than carbon",["sodium is a non-metal","carbon cannot react with oxygen","sodium compounds contain no ions"],"Sodium lies above carbon in the reactivity series, so its compounds are too stable to be reduced effectively by carbon.",["sci016-sodium-carbon"]],

  [8,"Medium","Rusting of iron requires oxygen and:","water or moisture",["nitrogen only","sunlight only","hydrogen only"],"Iron rusts when both oxygen and moisture are present. Removing either condition greatly slows rust formation.",["sci016-rusting"]],
  [8,"Medium","Coating iron with zinc to prevent corrosion is called:","galvanization",["roasting","calcination","annealing"],"Galvanization protects iron or steel with a zinc coating. The coating blocks air and moisture and can also provide sacrificial protection.",["sci016-galvanization"]],
  [8,"Medium","The green coating that develops on old copper surfaces is mainly a:","basic copper carbonate patina",["zinc oxide layer","iron rust layer","silver sulphide layer"],"Copper exposed for a long time to moist air and carbon dioxide develops a green patina commonly described as basic copper carbonate.",["sci016-copper-patina"]],
  [8,"Medium","Brass is mainly an alloy of:","copper and zinc",["copper and tin","iron and carbon","lead and tin"],"Brass is principally copper mixed with zinc.",["sci016-brass"]],
  [8,"Medium","Bronze is mainly an alloy of:","copper and tin",["copper and zinc","iron and chromium","aluminium and sodium"],"Bronze is principally copper mixed with tin.",["sci016-bronze"]],
  [8,"Medium","Stainless steel resists corrosion largely because it contains:","chromium",["sodium","mercury","calcium"],"Chromium forms a thin protective oxide film on stainless steel, greatly improving its resistance to corrosion.",["sci016-stainless-chromium"]],

  [9,"Hard","An ore is a sulphide of zinc. Which sequence best matches its extraction at school-exam level?","roasting to form the oxide, then reduction of the oxide",["calcination to form chloride, then electrolysis of water","galvanization followed by alloying","direct conversion into slag without reduction"],"Zinc blende is ZnS. A sulphide ore is first roasted in air to form an oxide; the oxide is then reduced to obtain zinc.",["sci016-integrated-zinc-route"]],
  [9,"Hard","A sample is identified as bauxite. Which extraction idea is most consistent with the high reactivity of its metal?","purify the aluminium compound and use electrolysis for reduction",["reduce it directly with carbon like a less reactive metal","obtain aluminium by displacement with copper","roast it only and collect free aluminium"],"Bauxite is an aluminium ore. Aluminium is highly reactive, so its oxide is not reduced by carbon in the usual extraction route; electrolytic reduction is used.",["sci016-integrated-bauxite-route"]],
  [9,"Hard","A metallurgical step adds a substance that reacts with gangue and produces a removable molten material. The added substance and product are respectively:","flux and slag",["slag and flux","ore and alloy","anode and cathode"],"Flux is added to react with gangue. Their reaction forms slag, which can be separated from the metal.",["sci016-integrated-flux-slag"]],
  [9,"Hard","A metal cannot be extracted from its oxide by carbon, but its molten compound can be electrolysed. This most strongly suggests that the metal is:","high in the reactivity series",["below copper in the series","a noble gas","less reactive than carbon"],"Metals above carbon form compounds that carbon cannot reduce readily. Such highly reactive metals are commonly extracted by electrolysis of molten compounds.",["sci016-integrated-reactivity-extraction"]],
  [9,"Hard","In a thermite mixture, aluminium converts iron(III) oxide into iron. What role does aluminium play?","it acts as the reducing agent",["it acts only as an inert flux","it is the gangue","it is the cathode"],"Aluminium removes oxygen from iron(III) oxide and is itself oxidized. Therefore aluminium acts as the reducing agent.",["sci016-integrated-thermite-redox"]],
  [9,"Hard","An impure copper anode is used during electrolytic refining. What should happen at the cathode under normal refining conditions?","pure copper should be deposited",["gangue should be deposited as slag","iron rust should form","zinc should coat the cathode by galvanization"],"Copper atoms from the impure anode enter solution as ions and are deposited as purer copper on the cathode.",["sci016-integrated-refining"]],

  [10,"Hard","Metal X displaces copper from CuSO₄ and also releases hydrogen from dilute HCl. Which conclusion is safest?","X lies above both copper and hydrogen in the reactivity series",["X must lie below hydrogen","X must be copper","X must be a non-metal"],"Displacing copper shows X is more reactive than copper. Releasing hydrogen from dilute acid shows X is also above hydrogen.",["sci016-mixed-reactivity"]],
  [10,"Hard","A solid compound has a high melting point, does not conduct as a solid, but conducts when molten. Which description best fits it?","an ionic compound",["a simple molecular gas","a noble gas","a metallic alloy"],"Strong ionic attractions explain the high melting point. The ions are fixed in the solid but become mobile on melting, allowing conduction.",["sci016-mixed-ionic"]],
  [10,"Hard","A zinc carbonate ore is heated with little air before reduction. Which pair correctly identifies the ore and the treatment?","calamine and calcination",["zinc blende and roasting","galena and electrolysis","bauxite and galvanization"],"Calamine is commonly treated as ZnCO₃ at this level. Carbonate ores are converted to oxides by calcination before reduction.",["sci016-mixed-calamine"]],
  [10,"Hard","An iron structure is protected with zinc, while a kitchen vessel is made from an iron-chromium alloy. The two corrosion-control ideas are:","galvanization and stainless-steel alloying",["roasting and calcination","electrolysis and slag formation","smelting and ore concentration"],"Zinc coating is galvanization. Chromium-containing stainless steel is an alloy designed to resist corrosion through a protective surface film.",["sci016-mixed-corrosion"]],
  [10,"Hard","A non-metal conducts electricity, while a metal is liquid at room temperature. Which pair fits these exceptions?","graphite and mercury",["sulphur and iron","phosphorus and aluminium","bromine and copper"],"Graphite conducts electricity despite being a non-metal, and mercury is liquid despite being a metal.",["sci016-mixed-exceptions"]],
  [10,"Hard","A metal oxide reacts with both an acid and a strong base, and the same metal is obtained from bauxite. Which oxide is indicated?","aluminium oxide",["calcium oxide","magnesium oxide","sodium oxide"],"Bauxite is an aluminium ore. Aluminium oxide is amphoteric, so it reacts with both acids and strong bases.",["sci016-mixed-amphoteric-bauxite"]]
]);

const pad3=(n:number)=>String(n).padStart(3,"0");
function buildOptions(answer:string,distractors:readonly [string,string,string],correctIndex:number){const options=[...distractors];options.splice(correctIndex,0,answer);return options;}

export const SCI_CP016_REVIEW_V1: readonly SciCp016ReviewQuestion[] = Object.freeze(
  REVIEW_SPECS.map((spec,index)=>{
    const [ql,difficulty,stem,answer,distractors,explanation,factIds]=spec;
    const correctIndex=index%4;
    return Object.freeze({
      questionId:`SCI-CP-016-REV-${pad3(index+1)}`,chapterId:"SCI-001" as const,cpId:"SCI-CP-016" as const,
      qlId:`SCI-016-QL-${pad3(ql)}`,qlName:SCI_CP016_QL_NAMES_V1[ql],difficulty,stem,
      options:buildOptions(answer,distractors,correctIndex),correctIndex,canonicalAnswer:answer,explanation,
      sourceIds:[...SOURCE_IDS],sourceFactIds:[...factIds],reviewOnly:true as const,runtimeRegistered:false as const
    });
  })
);

export type SciCp016Validation={valid:boolean;errors:string[];totalQuestions:number;qlCounts:Record<string,number>;difficultyCounts:Record<string,number>;answerPositionCounts:Record<string,number>};

export function validateSciCp016ReviewV1():SciCp016Validation{
  const errors:string[]=[];
  const qlCounts:Record<string,number>={};
  const difficultyCounts:Record<string,number>={};
  const answerPositionCounts:Record<string,number>={A:0,B:0,C:0,D:0};
  const seenIds=new Set<string>();
  const seenStems=new Set<string>();
  for(const q of SCI_CP016_REVIEW_V1){
    qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;
    difficultyCounts[q.difficulty]=(difficultyCounts[q.difficulty]??0)+1;
    const p=["A","B","C","D"][q.correctIndex];
    answerPositionCounts[p]+=1;
    if(seenIds.has(q.questionId))errors.push(`Duplicate questionId: ${q.questionId}`);
    seenIds.add(q.questionId);
    if(seenStems.has(q.stem))errors.push(`Duplicate stem: ${q.stem}`);
    seenStems.add(q.stem);
    if(q.options.length!==4)errors.push(`${q.questionId}: expected four options`);
    if(new Set(q.options).size!==4)errors.push(`${q.questionId}: options must be distinct`);
    if(q.options[q.correctIndex]!==q.canonicalAnswer)errors.push(`${q.questionId}: keyed answer mismatch`);
    if(!q.explanation.trim())errors.push(`${q.questionId}: missing explanation`);
    if(q.sourceIds.length===0||q.sourceFactIds.length===0)errors.push(`${q.questionId}: missing provenance`);
    if(!q.reviewOnly||q.runtimeRegistered)errors.push(`${q.questionId}: review lifecycle violation`);
  }
  if(SCI_CP016_REVIEW_V1.length!==60)errors.push(`Expected 60 questions, found ${SCI_CP016_REVIEW_V1.length}`);
  for(let ql=1;ql<=10;ql++){
    const id=`SCI-016-QL-${pad3(ql)}`;
    if(qlCounts[id]!==6)errors.push(`${id}: expected 6 questions, found ${qlCounts[id]??0}`);
  }
  for(const [d,e] of Object.entries({Easy:18,Medium:30,Hard:12}))if(difficultyCounts[d]!==e)errors.push(`${d}: expected ${e}, found ${difficultyCounts[d]??0}`);
  for(const p of ["A","B","C","D"] as const)if(answerPositionCounts[p]!==15)errors.push(`${p}: expected 15 keyed answers, found ${answerPositionCounts[p]}`);
  return{valid:errors.length===0,errors,totalQuestions:SCI_CP016_REVIEW_V1.length,qlCounts,difficultyCounts,answerPositionCounts};
}
