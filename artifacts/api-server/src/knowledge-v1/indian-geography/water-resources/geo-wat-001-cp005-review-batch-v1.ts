import { buildQl, finalizeCp, auditCp } from "./geo-wat-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_WAT_001_CP005_QLS=Object.freeze([
buildQl("MATCH-WATER-PROJECTS","Match dams, rivers and states",[
r("Which set is correctly matched?","Bhakra—Sutlej; Hirakud—Mahanadi; Tehri—Bhagirathi","Bhakra—Mahanadi; Hirakud—Sutlej; Tehri—Narmada","All three—Krishna","All three—Narmada","The three dam-river pairs are standard Indian geography facts.","WAT-INT-1"),
r("Which set correctly matches projects with regions?","Bhakra—north-west; Hirakud—Odisha; Sardar Sarovar—Gujarat","Bhakra—Odisha; Hirakud—Punjab; Sardar Sarovar—Uttarakhand","All three—Tamil Nadu","All three—Assam","The projects belong to distinct regional river systems.","WAT-INT-2"),
r("Which set correctly matches irrigation methods?","Tube well—groundwater; canal—river/reservoir; tank—stored runoff","Tube well—sea water; canal—groundwater only; tank—air moisture","All three—only rainfall","All three—only rivers","The methods use different sources and storage systems.","WAT-INT-3"),
r("Which set correctly matches conservation measures?","Rainwater harvesting—capture rain; watershed management—manage drainage area; recharge—replenish aquifer","Rainwater harvesting—drain rain away; watershed—remove vegetation; recharge—pump harder","All three—increase runoff","All three—reduce infiltration","The set correctly identifies water-conservation functions.","WAT-INT-4"),
r("Which set correctly matches project and river basin?","Damodar Valley—Damodar; Nagarjuna Sagar—Krishna; Sardar Sarovar—Narmada","Damodar Valley—Sutlej; Nagarjuna Sagar—Mahanadi; Sardar Sarovar—Bhagirathi","All three—Ganga","All three—Godavari","These are the correct river-basin relationships.","WAT-INT-5")
]),
buildQl("STATEMENT-WATER-GEOGRAPHY","Multi-statement water geography",[
r("Consider the statements: I. Bhakra is on the Sutlej. II. Hirakud is on the Mahanadi. III. Tehri is on the Bhagirathi. Which is correct?","I, II and III","I and II only","II and III only","I and III only","All three dam-river pairs are correct.","WAT-STAT-1"),
r("Consider the statements: I. Tube wells use groundwater. II. Tanks store runoff. III. Canals may receive reservoir water. Which is correct?","I, II and III","I and II only","II and III only","I and III only","All three statements correctly describe irrigation sources.","WAT-STAT-2"),
r("Consider the statements: I. Over-pumping can lower groundwater. II. Recharge can improve aquifer sustainability. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements describe groundwater management.","WAT-STAT-3"),
r("Consider the statements: I. Multipurpose projects can generate power. II. They can also create displacement and ecological impacts. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Large projects have both benefits and trade-offs.","WAT-STAT-4"),
r("Consider the statements: I. Watershed management can reduce erosion. II. Rainwater harvesting can improve recharge. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both approaches support water conservation.","WAT-STAT-5")
]),
buildQl("ODD-ONE-OUT-WATER","Odd-one-out water geography",[
r("Which is the odd one out: Bhakra, Hirakud, Tehri, drip irrigation?","Drip irrigation","Bhakra","Hirakud","Tehri","The first three are major dams; drip is an irrigation method.","WAT-ODD-1"),
r("Which is the odd one out: canal, tube well, tank, storm surge?","Storm surge","canal","tube well","tank","The first three are irrigation/water-supply systems.","WAT-ODD-2"),
r("Which is the odd one out: rainwater harvesting, recharge pit, check dam, railway zone?","Railway zone","rainwater harvesting","recharge pit","check dam","The first three relate to water conservation.","WAT-ODD-3"),
r("Which is the odd one out: Sutlej, Mahanadi, Bhagirathi, AAI?","AAI","Sutlej","Mahanadi","Bhagirathi","The first three are rivers linked with major dams.","WAT-ODD-4"),
r("Which is the odd one out: irrigation, flood control, hydropower, airline scheduling?","Airline scheduling","irrigation","flood control","hydropower","The first three are common multipurpose-project functions.","WAT-ODD-5")
]),
buildQl("CLUE-WATER-PROJECTS","Location and river clues",[
r("A dam on the Sutlej supports north-western irrigation. Which project is it?","Bhakra-Nangal","Hirakud","Tehri","Sardar Sarovar","The Sutlej and north-west clue identify Bhakra-Nangal.","WAT-CLUE-1"),
r("A major Odisha dam stands on the Mahanadi. Which one?","Hirakud","Bhakra","Tehri","Nagarjuna Sagar","The state-river clue identifies Hirakud.","WAT-CLUE-2"),
r("A Himalayan dam in Uttarakhand stands on the Bhagirathi. Which one?","Tehri","Sardar Sarovar","Hirakud","Tungabhadra","The Bhagirathi-Uttarakhand clue identifies Tehri.","WAT-CLUE-3"),
r("A dam in Gujarat lies on the Narmada. Which project is it?","Sardar Sarovar","Bhakra-Nangal","Hirakud","Nagarjuna Sagar","The Gujarat-Narmada clue identifies Sardar Sarovar.","WAT-CLUE-4"),
r("A major project on the Krishna serves the Telangana-Andhra region. Which one?","Nagarjuna Sagar","Bhakra","Hirakud","Tehri","The river-region clue identifies Nagarjuna Sagar.","WAT-CLUE-5")
]),
buildQl("INTEGRATED-WATER-REASONING","Integrated water-resource reasoning",[
r("Which combination best improves long-term groundwater security?","Reduced over-pumping plus recharge","More pumping plus less infiltration","Paving recharge areas","Ignoring leakage","Balancing withdrawals with recharge is central to groundwater sustainability.","WAT-REASON-1"),
r("Which combination best suits a water-scarce orchard?","Drip irrigation plus rainwater harvesting","Uncontrolled flooding plus over-pumping","No storage and high leakage","Removing recharge structures","Efficient application and local capture reduce water demand and improve supply.","WAT-REASON-2"),
r("Which combination most clearly defines a multipurpose project?","Irrigation, power generation and flood regulation","Only one farm well","Only a village pond","Only a city drain","Multiple coordinated functions define such projects.","WAT-REASON-3"),
r("Which combination would most likely worsen water scarcity?","Pollution, leakage and groundwater over-extraction","Recharge, conservation and reuse","Efficient irrigation and watershed treatment","Rainwater harvesting and reduced losses","Several simultaneous pressures reduce usable supply.","WAT-REASON-4"),
r("A basin is shared by several states and includes large reservoirs and irrigation systems. What management approach is most appropriate?","Coordinated basin-wide planning","Each state ignoring downstream users","Unlimited upstream withdrawal","No data sharing","Shared basins require cooperation across political boundaries.","WAT-REASON-5")
])
]);
export const GEO_WAT_001_CP005_REVIEW_BATCH_V1=finalizeCp(5,GEO_WAT_001_CP005_QLS);
export function auditGeoWat001Cp005ReviewBatchV1(){return auditCp(5,GEO_WAT_001_CP005_QLS,GEO_WAT_001_CP005_REVIEW_BATCH_V1);}
