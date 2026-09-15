export type GeoCli001Cp002Difficulty = "Easy" | "Medium" | "Hard";
export interface GeoCli001Cp002Question {
  questionId:string; qlId:string; qlName:string; difficulty:GeoCli001Cp002Difficulty;
  stem:string; options:readonly string[]; correctIndex:number; canonicalAnswer:string;
  explanation:string; sourceIds:readonly string[]; sourceFactIds:readonly string[];
  reviewOnly:true; runtimeRegistered:false;
}
type Raw=readonly[number,GeoCli001Cp002Difficulty,string,string,readonly[string,string,string]];
const QL_NAMES:Readonly<Record<number,string>>=Object.freeze({"10":"Differential heating of land and sea","11":"Summer thermal low and pressure gradient","12":"ITCZ and monsoon trough","13":"Cross-equatorial southeast trade winds","14":"Coriolis deflection and southwest direction","15":"Summer onshore monsoon flow","16":"Winter pressure pattern and northeast monsoon","17":"Seasonal wind reversal","18":"Integrated monsoon mechanism"});
const QL_NOTES:Readonly<Record<number,string>>=Object.freeze({"10":"Land heats and cools faster than water. In summer, stronger heating over the subcontinent helps lower surface pressure relative to the surrounding sea.","11":"Intense summer heating creates a thermal low over north and northwestern India. Air is drawn from relatively higher pressure toward this lower-pressure region.","12":"The ITCZ is a low-pressure convergence zone. In July it shifts north to about 20°N–25°N over the Gangetic plain, where it is called the monsoon trough.","13":"Southern Hemisphere southeast trade winds cross the Equator toward India's summer low-pressure area. NCERT places the main crossing between about 40°E and 60°E.","14":"After crossing the Equator, the flow enters the Northern Hemisphere and is deflected by Earth's rotation. This Coriolis deflection helps make it southwesterly.","15":"The summer pressure gradient draws air from the Indian Ocean toward India. Because this flow travels over warm ocean water, it can carry abundant moisture.","16":"In winter the land cools rapidly and relatively high pressure develops over the continent. Winds generally reverse and blow from the northeast toward the seas.","17":"The Indian monsoon shows a seasonal reversal of prevailing winds. The broad land-sea pressure gradient changes between summer and winter, reversing the flow.","18":"The full mechanism links seasonal heating, pressure change, ITCZ movement, cross-equatorial flow and Coriolis deflection. Winter reverses the pressure gradient and the prevailing winds."});
const SOURCE_IDS=Object.freeze(["NCERT-CONTEMPORARY-INDIA-I-CLIMATE","NCERT-INDIA-PHYSICAL-ENVIRONMENT-CLIMATE"]);
const RAW:readonly Raw[]=Object.freeze([
  [10,"Easy","Why does a strong land-sea pressure contrast develop over India in summer?","Land heats faster than the surrounding sea",["Sea heats faster than land","Land and sea heat at the same rate","Only mountains receive solar heating"]],
  [10,"Easy","During summer, which surface generally heats more quickly?","The Indian landmass",["The surrounding ocean","Land and ocean equally","Only the Himalayan region"]],
  [10,"Easy","Which process helps set up the basic summer monsoon pressure pattern?","Differential heating of land and sea",["Equal heating of land and sea","Winter cooling of the ocean only","Permanent high pressure over north India"]],
  [10,"Easy","What is the main result of intense summer heating over the Indian landmass?","Lower surface pressure over the heated land",["Higher surface pressure over the heated land","No change in surface pressure","Permanent snowfall over the plains"]],
  [10,"Easy","Which pair is correctly matched for the Indian summer?","Faster land heating — lower pressure over land",["Faster land heating — higher pressure over land","Slower ocean heating — lower pressure over land","Equal heating — strong pressure contrast"]],
  [10,"Easy","Consider these statements about summer heating:\nI. Land heats faster than water.\nII. The ocean warms more slowly and remains relatively higher in pressure.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],
  [11,"Easy","Where does intense summer heating help create a major thermal low over the Indian subcontinent?","North and northwestern India",["Southern Indian Ocean","Central Himalayas only","Eastern coastal waters only"]],
  [11,"Easy","What pressure condition develops over northwestern India during the hot summer months?","Low pressure",["High pressure","No pressure difference","Permanent polar pressure"]],
  [11,"Easy","Why are winds drawn from the Indian Ocean toward India in summer?","Pressure is lower over the heated land than over the ocean",["Pressure is higher over the heated land","The ocean has no air pressure","Mountains pull the winds by gravity"]],
  [11,"Easy","Which pressure pattern favours an onshore summer flow toward India?","Higher pressure over the ocean and lower pressure over land",["Lower pressure over the ocean and higher pressure over land","Equal pressure over land and sea","High pressure over both land and sea"]],
  [11,"Easy","A strong thermal low forms over northwestern India. What is its direct effect on surrounding air?","It helps draw air toward the low-pressure region",["It pushes all air away from India","It stops pressure-driven winds","It creates permanent winter winds"]],
  [11,"Easy","Which statement best explains the summer pressure gradient over India?","Strong land heating lowers pressure over the subcontinent",["Strong land heating raises pressure over the subcontinent","Ocean water always creates lower pressure than land","Pressure does not respond to seasonal heating"]],
  [12,"Easy","What is the Inter Tropical Convergence Zone (ITCZ)?","A low-pressure zone where trade winds converge",["A permanent high-pressure belt over India","A cold ocean current","A winter mountain wind"]],
  [12,"Easy","During July, the ITCZ shifts northward over India to roughly which latitudes?","About 20°N to 25°N",["About 0° to 5°N","About 45°N to 50°N","About 60°N to 70°N"]],
  [12,"Easy","What is the northward-shifted ITCZ over the Gangetic plain commonly called in summer?","Monsoon trough",["Polar front","Rain-shadow belt","Subtropical ridge"]],
  [12,"Easy","How does the northward shift of the ITCZ support the summer monsoon?","It helps establish a low-pressure trough over northern India",["It creates permanent high pressure over northern India","It blocks all cross-equatorial winds","It ends the land-sea pressure contrast"]],
  [12,"Easy","What generally happens to air where the trade winds converge in the ITCZ?","It tends to rise",["It sinks strongly","It stops moving","It always flows westward"]],
  [12,"Easy","Consider these statements:\nI. The ITCZ is a low-pressure zone.\nII. In July it shifts northward over the Indian region.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],
  [13,"Medium","Which winds cross the Equator and help form the southwest monsoon over India?","Southeast trade winds of the Southern Hemisphere",["Northeast trade winds of the Northern Hemisphere","Polar easterlies","Mid-latitude westerlies only"]],
  [13,"Medium","The southeast trade winds that feed the Indian summer monsoon cross the Equator mainly between which longitudes?","About 40°E and 60°E",["About 0° and 10°E","About 90°E and 110°E","About 140°E and 160°E"]],
  [13,"Medium","Why do southeast trade winds from the Southern Hemisphere move toward India in summer?","They are drawn toward the strong low-pressure region over the subcontinent",["They are pushed by permanent high pressure over India","They move because India lies at the Equator","They are pulled by Himalayan snow"]],
  [13,"Medium","After crossing the Equator, the southeast trade winds move mainly toward which region?","The Indian subcontinent",["Antarctica","The South Atlantic","Central Europe"]],
  [13,"Medium","Which statement correctly describes the origin of the southwest monsoon flow?","It is linked to southeast trade winds crossing the Equator",["It begins as polar easterlies over Siberia","It forms from local mountain breezes only","It starts as northeast trades without crossing the Equator"]],
  [13,"Medium","Consider these statements:\nI. Southeast trade winds cross the Equator in the summer monsoon setup.\nII. They then move toward the Indian low-pressure area.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],
  [14,"Medium","Why do the cross-equatorial winds approach India as southwesterlies?","They are deflected by the Coriolis force after entering the Northern Hemisphere",["They are turned by ocean tides alone","They are forced westward by the Himalayas","They keep their original southeast direction unchanged"]],
  [14,"Medium","The Coriolis force is mainly caused by which movement of the Earth?","Earth's rotation",["Earth's revolution around the Sun","Movement of tectonic plates","Ocean tides"]],
  [14,"Medium","In the Northern Hemisphere, moving air is deflected mainly toward which side?","To the right of its path",["To the left of its path","Straight upward only","Toward the Equator in every case"]],
  [14,"Medium","Which change occurs to the southeast trade winds after they cross the Equator toward India?","They turn into a southwesterly flow",["They become polar easterlies","They reverse into a southeasterly land wind","They lose all horizontal motion"]],
  [14,"Medium","Which pair correctly explains the name 'southwest monsoon'?","Cross-equatorial flow — deflected to approach India from the southwest",["Winter land breeze — approaches India from the southwest","Polar wind — approaches India from the northwest","Sea breeze — approaches India from the southeast"]],
  [14,"Medium","Consider these statements:\nI. The summer monsoon flow crosses the Equator from the Southern Hemisphere.\nII. Coriolis deflection helps give it a southwesterly direction.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],
  [15,"Medium","In summer, the main monsoon winds over India generally move from which region toward which?","From the Indian Ocean toward the Indian landmass",["From the Indian landmass toward the Indian Ocean","From Central Asia toward the Arabian Sea only","From the Himalayas toward the Equator only"]],
  [15,"Medium","Why are the summer monsoon winds able to carry large amounts of moisture?","They travel over warm ocean waters before reaching India",["They move only over dry continental land","They descend from the cold Himalayas","They form inside desert interiors"]],
  [15,"Medium","Which pressure difference most directly supports the summer onshore monsoon flow?","Higher pressure over the ocean and lower pressure over the heated land",["Lower pressure over the ocean and higher pressure over the heated land","Equal pressure over land and sea","High pressure over northern India and low pressure over Tibet only"]],
  [15,"Medium","A moist wind is moving from the Indian Ocean toward a thermal low over northern India. Which season is this flow most typical of?","Summer monsoon season",["Cold weather season","Late winter only","Pre-winter transition only"]],
  [15,"Medium","Which two factors together best explain the direction of the summer monsoon toward India?","Pressure gradient and Coriolis deflection",["Soil type and river direction","Altitude and longitude only","Vegetation and population density"]],
  [15,"Medium","Which pair correctly describes the summer monsoon over India?","Summer monsoon — moist onshore flow",["Summer monsoon — dry offshore flow","Winter monsoon — persistent southwest onshore flow over all India","ITCZ — permanent high-pressure belt"]],
  [16,"Medium","What pressure condition generally develops over the northern Indian landmass in winter?","High pressure",["Deep thermal low pressure","Permanent equatorial low pressure","No pressure pattern"]],
  [16,"Medium","In winter, the prevailing surface winds over much of India generally blow from which direction?","From the northeast toward the south and southwest",["From the southwest toward the northeast","From the southeast toward the northwest","From west to east only"]],
  [16,"Medium","Why does the monsoon wind direction reverse in winter?","The seasonal pressure pattern over land and sea reverses",["Earth stops rotating in winter","The Himalayas move southward","Ocean currents reverse everywhere"]],
  [16,"Medium","What happens to the ITCZ during the Indian winter?","It shifts southward",["It remains fixed over the Gangetic plain","It moves to the Arctic Circle","It becomes a high-pressure belt over India"]],
  [16,"Medium","Which pair is correctly matched?","Winter monsoon — northeasterly flow from land toward sea",["Winter monsoon — southwesterly flow from sea toward land","Summer monsoon — northeasterly offshore flow","ITCZ in July — south of the Equator"]],
  [16,"Medium","Consider these statements:\nI. Northern India develops relatively high pressure in winter.\nII. Winds generally blow from land toward sea during this season.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],
  [17,"Medium","Which seasonal wind pattern is typical of the Indian monsoon system?","Southwesterlies in summer and northeasterlies in winter",["Northeasterlies in both seasons","Southwesterlies in both seasons","Westerlies in summer and polar easterlies in winter"]],
  [17,"Medium","What is the main reason India's prevailing monsoon winds change direction between summer and winter?","Seasonal reversal of the land-sea pressure pattern",["Seasonal movement of rivers","Change in India's latitude","A reversal of Earth's rotation"]],
  [17,"Medium","Which sequence correctly describes the broad summer monsoon setup?","Land heats strongly → low pressure develops → moist winds move inland",["Land cools strongly → high pressure develops → moist winds move inland","Ocean cools fastest → low pressure forms over land","Land and sea reach equal pressure → strong monsoon begins"]],
  [17,"Medium","Which sequence correctly describes the broad winter monsoon setup?","Land cools strongly → higher pressure develops → winds blow outward",["Land heats strongly → lower pressure develops → winds blow outward","Ocean cools faster → high pressure forms over land","ITCZ shifts north → southwest monsoon strengthens"]],
  [17,"Medium","A wind system changes from mainly onshore in summer to mainly offshore in winter. What feature of monsoon climate does this show?","Seasonal reversal of winds",["Permanent westerly circulation","No seasonal pressure change","A fixed equatorial wind belt"]],
  [17,"Medium","Consider these statements:\nI. Summer pressure conditions favour ocean-to-land flow.\nII. Winter pressure conditions favour land-to-sea flow.\nWhich statement(s) are correct?","Both I and II",["I only","II only","Neither I nor II"]],
  [18,"Hard","Which sequence best explains the development of the southwest monsoon over India?","Strong land heating → northern low pressure → cross-equatorial flow → Coriolis deflection",["Strong land cooling → northern high pressure → cross-equatorial flow → southwest monsoon","Equal land-sea heating → no pressure gradient → southwest monsoon","Southward ITCZ shift → northern high pressure → summer onshore flow"]],
  [18,"Hard","Consider these statements:\nI. The ITCZ shifts northward in summer.\nII. Southeast trade winds cross the Equator toward India.\nIII. Coriolis deflection helps turn them into southwesterlies.\nWhich statements are correct?","I, II and III",["I and II only","II and III only","I and III only"]],
  [18,"Hard","Which combination correctly compares the summer and winter monsoon pressure patterns?","Summer: lower pressure over land; Winter: higher pressure over land",["Summer: higher pressure over land; Winter: lower pressure over land","Summer and winter: equally low pressure over land","Summer and winter: equally high pressure over land"]],
  [18,"Hard","If summer heating over northwestern India were much weaker, which part of the monsoon mechanism would be reduced most directly?","The land-sea pressure gradient drawing winds toward India",["Earth's Coriolis force","The existence of the Equator","Earth's rotation"]],
  [18,"Hard","A wind starts as a southeast trade wind, crosses the Equator and then reaches India from the southwest. Which two processes explain this change?","Cross-equatorial movement toward low pressure and Coriolis deflection",["Winter land cooling and polar easterlies","Ocean tides and mountain erosion","River drainage and sea breeze"]],
  [18,"Hard","Which chain correctly explains the seasonal reversal of India's monsoon winds?","Seasonal heating changes pressure → pressure gradient reverses → prevailing winds reverse",["Earth reverses rotation → Coriolis reverses → winds reverse","Mountains change height → pressure belts disappear → winds reverse","Ocean currents stop → ITCZ vanishes → winds reverse"]]
] as Raw[]);

function makeOptions(answer:string,distractors:readonly[string,string,string],correctIndex:number){
  const options=[...distractors]; options.splice(correctIndex,0,answer); return Object.freeze(options);
}

export const GEO_CLI_001_CP002_REVIEW_BATCH_V1:readonly GeoCli001Cp002Question[]=Object.freeze(
  RAW.map(([ql,difficulty,stem,answer,distractors],index)=>{
    const correctIndex=index%4; const qlCode=String(ql).padStart(3,"0"); const within=String((index%6)+1).padStart(2,"0");
    return Object.freeze({
      questionId:`GEO-CLI-001-CP002-Q${String(index+1).padStart(3,"0")}`,
      qlId:`GEO-CLI-001-QL-${qlCode}`, qlName:QL_NAMES[ql], difficulty, stem,
      options:makeOptions(answer,distractors,correctIndex), correctIndex, canonicalAnswer:answer,
      explanation:`${answer}. ${QL_NOTES[ql]}`,
      sourceIds:SOURCE_IDS, sourceFactIds:Object.freeze([`geo-cli-001-cp002-${qlCode}-${within}`]),
      reviewOnly:true as const, runtimeRegistered:false as const,
    });
  })
);

const BANNED=/sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|NCERT|population density|soil colour|more roads/i;
const BANNED_STEM=/associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp002ReviewBatchV1(){
  const issues:string[]=[]; const ids=new Set<string>(); const stems=new Set<string>(); const semantics=new Set<string>();
  const qlCounts:Record<string,number>={}; const difficultyCounts:Record<GeoCli001Cp002Difficulty,number>={Easy:0,Medium:0,Hard:0};
  const answerPositions=[0,0,0,0]; const hardAnswers=new Set<string>(); let statementStemCount=0;
  for(const q of GEO_CLI_001_CP002_REVIEW_BATCH_V1){
    if(ids.has(q.questionId))issues.push(`DUPLICATE_ID:${q.questionId}`); ids.add(q.questionId);
    const s=q.stem.replace(/\s+/g," ").trim().toLowerCase(); if(stems.has(s))issues.push(`DUPLICATE_STEM:${q.questionId}`); stems.add(s);
    const sem=`${s}::${q.canonicalAnswer.toLowerCase()}`; if(semantics.has(sem))issues.push(`DUPLICATE_SEMANTIC:${q.questionId}`); semantics.add(sem);
    qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1; difficultyCounts[q.difficulty]+=1; answerPositions[q.correctIndex]+=1;
    if(q.difficulty==="Hard")hardAnswers.add(q.canonicalAnswer);
    if(q.options.length!==4||new Set(q.options).size!==4)issues.push(`OPTIONS:${q.questionId}`);
    if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push(`ANSWER:${q.questionId}`);
    if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push(`PROVENANCE:${q.questionId}`);
    if(!q.reviewOnly||q.runtimeRegistered)issues.push(`LIFECYCLE:${q.questionId}`);
    if(q.explanation.length<40)issues.push(`SHORT_EXPLANATION:${q.questionId}`);
    if(q.stem.length<28)issues.push(`SHORT_STEM:${q.questionId}`); if(q.stem.length>220)issues.push(`LONG_STEM:${q.questionId}`);
    if(!q.stem.trim().endsWith("?"))issues.push(`NON_QUESTION_STEM:${q.questionId}`); if(BANNED_STEM.test(q.stem))issues.push(`NON_EXAM_STEM:${q.questionId}`);
    if(/^Consider these statements:/i.test(q.stem))statementStemCount+=1;
    if(BANNED.test(`${q.stem}\n${q.options.join("\n")}\n${q.explanation}`))issues.push(`LEARNER_TEXT:${q.questionId}`);
  }
  if(GEO_CLI_001_CP002_REVIEW_BATCH_V1.length!==54)issues.push(`COUNT:${GEO_CLI_001_CP002_REVIEW_BATCH_V1.length}`);
  if(stems.size!==54)issues.push(`STEM_COUNT:${stems.size}`); if(semantics.size!==54)issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if(statementStemCount>10)issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for(let i=10;i<=18;i+=1){const id=`GEO-CLI-001-QL-${String(i).padStart(3,"0")}`;if(qlCounts[id]!==6)issues.push(`QL_COUNT:${id}:${qlCounts[id]??0}`);}
  if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==30||difficultyCounts.Hard!==6)issues.push(`DIFFICULTY:${difficultyCounts.Easy}/${difficultyCounts.Medium}/${difficultyCounts.Hard}`);
  if(answerPositions.join(",")!=="14,14,13,13")issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`); if(hardAnswers.size<3)issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);
  return {valid:issues.length===0,issues,questionCount:GEO_CLI_001_CP002_REVIEW_BATCH_V1.length,stemCount:stems.size,semanticCount:semantics.size,qlCounts,difficultyCounts,answerPositions,hardAnswerVariety:hardAnswers.size,statementStemCount};
}
