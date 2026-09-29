import { buildQl, finalizeCp, auditCp } from "./geo-lnd-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_LND_001_CP004_QLS=Object.freeze([
buildQl("MATCH-LAND-USE","Match land-use concepts",[
r("Which set is correctly matched?","Net sown area—cultivated; current fallow—temporarily uncultivated; wasteland—low productive value","Net sown area—forest; current fallow—urban; wasteland—irrigated cropland","All three—forest categories","All three—transport uses","The set correctly distinguishes major land-use categories.","LND-INT-M1"),
r("Which set correctly matches degradation and cause?","Overgrazing—vegetation loss; mining—surface disturbance; over-irrigation—salinity/waterlogging","Overgrazing—afforestation; mining—soil conservation; irrigation—no land effect","All three—only urbanisation","All three—only rainfall","The relationships correctly connect land-use pressures with degradation.","LND-INT-M2"),
r("Which set correctly matches conservation measures?","Terracing—slope erosion control; shelterbelt—wind erosion control; drainage—salinity/waterlogging control","Terracing—wind erosion; shelterbelt—waterlogging; drainage—desertification","All three—increase erosion","All three—remove vegetation","The measures address different land-degradation processes.","LND-INT-M3"),
r("Which set correctly matches land concepts?","Common property—shared community resource; desertification—dryland degradation; land capability—suitability for use","Common property—private factory; desertification—glacier growth; capability—population density","All three—urban planning terms","All three—river processes","The set correctly identifies the three land-resource concepts.","LND-INT-M4")
]),
buildQl("STATEMENT-LAND","Multi-statement land-resource geography",[
r("Consider the statements: I. Net sown area counts land cropped at least once. II. Gross cropped area can exceed it when land is cropped more than once. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Multiple cropping raises gross cropped area without changing physical net sown area.","LND-INT-S1"),
r("Consider the statements: I. Waterlogging can follow excessive irrigation. II. Salinity can develop where evaporation is high and drainage is poor. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are classic irrigation-related land problems.","LND-INT-S2"),
r("Consider the statements: I. Desertification is a form of dryland degradation. II. It can occur outside existing deserts. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Semi-arid areas can degrade into desert-like conditions.","LND-INT-S3"),
r("Consider the statements: I. Common property resources are shared. II. Community management can reduce overuse. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Collective rules can improve sustainability of shared resources.","LND-INT-S4")
]),
buildQl("CLUE-LAND","Land-resource clue identification",[
r("A field is cultivated in one year and deliberately left uncultivated the next. Which category applies in the uncultivated year?","Current fallow","Forest land","Permanent pasture","Built-up land","Temporary non-cultivation is current fallow.","LND-INT-C1"),
r("An irrigated dryland field develops a high water table and salt crust. Which two problems are present?","Waterlogging and salinity","Wind erosion and glaciation","Urban sprawl and drought","Forest regeneration and recharge","The clues point to excess subsurface water and salt accumulation.","LND-INT-C2"),
r("A village jointly uses and manages grazing land. What type of resource is this?","Common property resource","Private industrial land","Urban built-up land","Net sown area only","Shared community use defines common property.","LND-INT-C3"),
r("A steep slope is kept under forest rather than intensive farming. What planning principle is being followed?","Land capability-based use","Maximum extraction","Urban sprawl","Mining-first development","The land use is matched to physical suitability.","LND-INT-C4")
]),
buildQl("INTEGRATED-LAND","Integrated land management reasoning",[
r("Which combination best restores degraded dryland?","Controlled grazing, vegetation recovery and water conservation","Overgrazing, deforestation and bare soil","Unlimited pumping and no recharge","Mining without reclamation","Restoring cover and conserving water reduce erosion and desertification.","LND-INT-R1"),
r("Which combination best prevents soil loss on slopes?","Terracing, contour cultivation and vegetation cover","Down-slope ploughing and deforestation","Overgrazing and bare soil","Uncontrolled runoff","All three measures slow runoff and protect soil.","LND-INT-R2"),
r("Which comparison correctly distinguishes current fallow and barren land?","Current fallow is temporary; barren land is generally not suitable for cultivation","Both are identical","Barren land is always cropped","Current fallow is always forest","The categories differ in potential and current use.","LND-INT-R3"),
r("Which approach is most sustainable for finite land resources?","Match land use to capability and conserve soil","Use every slope intensively","Ignore degradation","Maximise extraction regardless of future productivity","Sustainable land use protects long-term productive capacity.","LND-INT-R4")
])
]);
export const GEO_LND_001_CP004_REVIEW_BATCH_V1=finalizeCp(4,GEO_LND_001_CP004_QLS);
export function auditGeoLnd001Cp004ReviewBatchV1(){return auditCp(4,GEO_LND_001_CP004_QLS,GEO_LND_001_CP004_REVIEW_BATCH_V1);}
