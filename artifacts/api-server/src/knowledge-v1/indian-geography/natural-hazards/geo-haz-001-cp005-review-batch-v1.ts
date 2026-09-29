import { buildQl, finalizeCp, auditCp } from "./geo-haz-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_HAZ_001_CP005_QLS=Object.freeze([
buildQl("MATCH-HAZARDS","Match hazards and processes",[
r("Which set is correctly matched?","Earthquake—fault rupture; tsunami—sea-floor displacement; landslide—slope failure","Earthquake—drought; tsunami—heat wave; landslide—cyclone","All three—river flooding","All three—cold waves","The set correctly links each hazard with its physical process.","HAZ-INT-1"),
r("Which set correctly matches agencies and roles?","IMD—weather warnings; CWC—flood forecasting; INCOIS—tsunami warning","IMD—highways; CWC—airports; INCOIS—railways","All three—census","All three—ports only","These agencies have distinct warning and monitoring roles.","HAZ-INT-2"),
r("Which set correctly matches hazard and vulnerable region?","Cyclone—coast; avalanche—high Himalaya; landslide—steep slopes","Cyclone—only deserts; avalanche—deltas; landslide—open sea","All three—flat plains only","All three—deep ocean only","The regional relationships follow each hazard's physical requirements.","HAZ-INT-3"),
r("Which set correctly matches mitigation measures?","Earthquake—seismic construction; cyclone—evacuation; drought—water conservation","Earthquake—storm shelter only; cyclone—no warning; drought—more wastage","All three—ignore alerts","All three—remove drainage","The measures address each hazard's main vulnerability.","HAZ-INT-4"),
r("Which set correctly matches warning institutions?","NDMA—national disaster guidance; IMD—cyclone forecast; INCOIS—tsunami warning","NDMA—rail freight; IMD—dam construction; INCOIS—highways","All three—airports","All three—irrigation only","The set correctly identifies institutional roles.","HAZ-INT-5")
]),
buildQl("STATEMENT-HAZARDS","Multi-statement hazard geography",[
r("Consider the statements: I. Himalaya have high earthquake risk. II. Bay of Bengal coast is cyclone-prone. III. High Himalaya face avalanche risk. Which is correct?","I, II and III","I and II only","II and III only","I and III only","All three regional hazard relationships are correct.","HAZ-STAT-1"),
r("Consider the statements: I. Storm surge affects coasts. II. Floodplains are naturally flood-prone. III. Drought reflects prolonged water deficiency. Which is correct?","I, II and III","I and II only","II and III only","I and III only","All three statements correctly describe hydro-meteorological hazards.","HAZ-STAT-2"),
r("Consider the statements: I. IMD forecasts cyclones. II. CWC forecasts river floods. III. INCOIS provides tsunami warning. Which is correct?","I, II and III","I and II only","II and III only","I and III only","All three agency-role pairs are correct.","HAZ-STAT-3"),
r("Consider the statements: I. Early warning must reach people at risk. II. Response capacity matters after a warning is issued. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Warnings are effective only when communities can act on them.","HAZ-STAT-4"),
r("Consider the statements: I. Hazards do not automatically become disasters. II. Exposure and vulnerability influence losses. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Disaster risk depends on more than hazard intensity alone.","HAZ-STAT-5")
]),
buildQl("ODD-ONE-OUT-HAZARDS","Odd-one-out hazard geography",[
r("Which is the odd one out: earthquake, tsunami, landslide, irrigation canal?","Irrigation canal","earthquake","tsunami","landslide","The first three are natural hazards.","HAZ-ODD-1"),
r("Which is the odd one out: IMD, CWC, INCOIS, NHAI?", "NHAI","IMD","CWC","INCOIS","The first three have direct hazard-monitoring or warning roles.","HAZ-ODD-2"),
r("Which is the odd one out: cyclone, storm surge, heavy-rain flood, railway gauge?", "Railway gauge","cyclone","storm surge","heavy-rain flood","The first three are hydro-meteorological hazards or impacts.","HAZ-ODD-3"),
r("Which is the odd one out: avalanche, landslide, heat wave, Bhakra Dam?", "Bhakra Dam","avalanche","landslide","heat wave","The first three are hazards.","HAZ-ODD-4"),
r("Which is the odd one out: evacuation, early warning, resilient construction, ignoring alerts?", "Ignoring alerts","evacuation","early warning","resilient construction","The first three reduce disaster risk.","HAZ-ODD-5")
]),
buildQl("CLUE-HAZARDS","Hazard clue identification",[
r("A steep Himalayan slope fails after intense rain. Which hazard is it?","Landslide","Drought","Storm surge","Tsunami","Rain-triggered slope failure is a landslide.","HAZ-CLUE-1"),
r("A Bay of Bengal storm brings strong winds and coastal surge. Which hazard is it?","Tropical cyclone","Earthquake","Avalanche","Cold wave","Wind, surge and heavy rain identify a tropical cyclone.","HAZ-CLUE-2"),
r("An offshore earthquake displaces the sea floor and waves threaten the coast. Which hazard follows?","Tsunami","Drought","Heat wave","Landslide","Sudden seafloor displacement can generate tsunami waves.","HAZ-CLUE-3"),
r("A northern city experiences several days of dangerous extreme heat. Which hazard is occurring?","Heat wave","Cold wave","Flood","Avalanche","Persistent extreme heat defines a heat wave.","HAZ-CLUE-4"),
r("A river rises rapidly after prolonged monsoon rain and overtops its banks. Which hazard is occurring?","Flood","Drought","Earthquake","Tsunami","River discharge has exceeded channel capacity.","HAZ-CLUE-5")
]),
buildQl("INTEGRATED-RISK-REASONING","Integrated disaster-risk reasoning",[
r("Which combination creates the highest disaster risk?","Severe hazard plus high exposure and high vulnerability","Hazard in an uninhabited area with strong resilience","No hazard and no exposure","Strong preparedness with low exposure","Risk increases when hazard, exposure and vulnerability coincide.","HAZ-REASON-1"),
r("Which combination best reduces cyclone mortality?","Accurate forecast, last-mile warning and evacuation","Forecast with no communication","No shelters and no warning","Ignoring landfall information","An effective warning chain must lead to protective action.","HAZ-REASON-2"),
r("Which combination best reduces earthquake losses?","Seismic building codes plus preparedness","Weak construction plus dense exposure","No evacuation planning","Ignoring soil conditions","Reducing structural vulnerability is central to earthquake risk reduction.","HAZ-REASON-3"),
r("Which combination improves flood resilience?","Forecasting, drainage protection and floodplain planning","Blocked drains and floodplain encroachment","No warnings","Building in active channels","Multiple complementary measures reduce both exposure and impact.","HAZ-REASON-4"),
r("A warning is scientifically accurate but residents do not receive it. Which part of disaster management failed?","Last-mile communication","Hazard detection","Plate tectonics","Ocean temperature","The warning failed to reach the exposed population.","HAZ-REASON-5")
])
]);
export const GEO_HAZ_001_CP005_REVIEW_BATCH_V1=finalizeCp(5,GEO_HAZ_001_CP005_QLS);
export function auditGeoHaz001Cp005ReviewBatchV1(){return auditCp(5,GEO_HAZ_001_CP005_QLS,GEO_HAZ_001_CP005_REVIEW_BATCH_V1);}
