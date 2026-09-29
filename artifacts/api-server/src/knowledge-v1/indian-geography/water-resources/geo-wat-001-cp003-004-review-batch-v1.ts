import { buildQl, finalizeCp, auditCp } from "./geo-wat-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});

export const GEO_WAT_001_CP003_QLS=Object.freeze([
buildQl("BHAKRA-NANGAL","Bhakra-Nangal project",[
r("Bhakra-Nangal project is built on which river?","Sutlej","Mahanadi","Narmada","Krishna","Bhakra dam is built on the Sutlej in the north-western river system.","WAT-BHAKRA-1"),
r("Which states are strongly linked with the Bhakra-Nangal irrigation-power system?","Punjab, Haryana and Rajasthan","Odisha and Chhattisgarh only","Tamil Nadu and Kerala only","Assam and Meghalaya only","The project supports irrigation and power across the north-western plains.","WAT-BHAKRA-2"),
r("Which function is important at Bhakra-Nangal?","Irrigation and hydroelectric power","Only sea navigation","Only urban drainage","Only fisheries","Bhakra-Nangal is a classic multipurpose irrigation and power project.","WAT-BHAKRA-3"),
r("Consider the statements: I. Bhakra is on the Sutlej. II. The project supports north-western irrigation. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are standard facts about Bhakra-Nangal.","WAT-BHAKRA-4"),
r("A multipurpose project on the Sutlej serves Punjab and neighbouring states. Which project is it?","Bhakra-Nangal","Hirakud","Tehri","Nagarjuna Sagar","The Sutlej clue identifies Bhakra-Nangal.","WAT-BHAKRA-5")
]),
buildQl("HIRAKUD","Hirakud project",[
r("Hirakud Dam is built on which river?","Mahanadi","Sutlej","Bhagirathi","Narmada","Hirakud is a major multipurpose dam on the Mahanadi in Odisha.","WAT-HIRAKUD-1"),
r("Hirakud Dam is located in which state?","Odisha","Punjab","Uttarakhand","Gujarat","Hirakud lies in Odisha on the Mahanadi.","WAT-HIRAKUD-2"),
r("Which is a major function of the Hirakud project?","Flood control, irrigation and power","Only sea transport","Only drinking water for one village","Only railway supply","The project combines flood moderation with irrigation and hydroelectricity.","WAT-HIRAKUD-3"),
r("Consider the statements: I. Hirakud is on the Mahanadi. II. It is a multipurpose project. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Hirakud is on the Mahanadi in Odisha and combines several water-management and power functions.","WAT-HIRAKUD-4"),
r("A dam in Odisha is built across the Mahanadi. Which one is it?","Hirakud","Bhakra","Tehri","Sardar Sarovar","The river-state combination identifies Hirakud.","WAT-HIRAKUD-5")
]),
buildQl("DAMODAR-VALLEY","Damodar Valley Project",[
r("The Damodar Valley Project is based on which river basin?","Damodar","Godavari","Sutlej","Cauvery","The project manages the Damodar basin in eastern India.","WAT-DVC-1"),
r("Which states are most directly linked with the Damodar Valley Project?","Jharkhand and West Bengal","Punjab and Haryana","Gujarat and Rajasthan","Kerala and Tamil Nadu","The Damodar basin extends through Jharkhand into West Bengal.","WAT-DVC-2"),
r("Why was flood control historically important in the Damodar Valley?","The river was known for damaging floods","The region had no rivers","The basin was permanently dry","Flooding never occurred","The Damodar had a history of destructive floods before basin development.","WAT-DVC-3"),
r("Consider the statements: I. DVC combines dams and power development. II. It also supports irrigation and flood management. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","The Damodar Valley system is a classic multipurpose basin project.","WAT-DVC-4"),
r("A river-valley authority manages floods, irrigation and power in Jharkhand-West Bengal. Which system is it?","Damodar Valley Project","Bhakra-Nangal","Tehri project","Tungabhadra project","The regional clue identifies the Damodar Valley Project.","WAT-DVC-5")
]),
buildQl("TEHRI","Tehri Dam project",[
r("Tehri Dam is built on which river?","Bhagirathi","Mahanadi","Sutlej","Narmada","Tehri Dam is on the Bhagirathi in Uttarakhand.","WAT-TEHRI-1"),
r("Tehri Dam is located in which state?","Uttarakhand","Odisha","Gujarat","Punjab","The Tehri project is located in the Himalayan state of Uttarakhand.","WAT-TEHRI-2"),
r("Which function is important at Tehri?","Hydroelectric power and water supply","Only coastal shipping","Only tank irrigation","Only fisheries","Tehri supports hydropower along with water and irrigation functions.","WAT-TEHRI-3"),
r("Consider the statements: I. Tehri is on the Bhagirathi. II. It lies in the Himalaya. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both facts describe Tehri correctly.","WAT-TEHRI-4"),
r("A large Himalayan dam in Uttarakhand stands on the Bhagirathi. Which dam is it?","Tehri","Hirakud","Bhakra","Nagarjuna Sagar","The location and river identify Tehri.","WAT-TEHRI-5")
]),
buildQl("SARDAR-SAROVAR","Sardar Sarovar project",[
r("Sardar Sarovar Dam is built on which river?","Narmada","Mahanadi","Sutlej","Krishna","Sardar Sarovar is a major dam on the Narmada.","WAT-SSP-1"),
r("Which state contains the Sardar Sarovar Dam site?","Gujarat","Punjab","Odisha","Uttarakhand","The dam is located in Gujarat on the Narmada.","WAT-SSP-2"),
r("Which function is important in the Sardar Sarovar project?","Irrigation and water supply","Only sea navigation","Only coal transport","Only railway power","The project distributes Narmada water for irrigation and other uses.","WAT-SSP-3"),
r("Consider the statements: I. Sardar Sarovar is on the Narmada. II. It serves western India. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","The dam is on the Narmada in Gujarat, and the wider project distributes water across western India.","WAT-SSP-4"),
r("A major multipurpose dam in Gujarat lies on the Narmada. Which project is it?","Sardar Sarovar","Hirakud","Bhakra-Nangal","Tehri","The Gujarat-Narmada clue identifies Sardar Sarovar.","WAT-SSP-5")
])
]);
export const GEO_WAT_001_CP003_REVIEW_BATCH_V1=finalizeCp(3,GEO_WAT_001_CP003_QLS);
export function auditGeoWat001Cp003ReviewBatchV1(){return auditCp(3,GEO_WAT_001_CP003_QLS,GEO_WAT_001_CP003_REVIEW_BATCH_V1);}

export const GEO_WAT_001_CP004_QLS=Object.freeze([
buildQl("NAGARJUNA-SAGAR","Nagarjuna Sagar project",[
r("Nagarjuna Sagar Dam is built on which river?","Krishna","Narmada","Sutlej","Mahanadi","Nagarjuna Sagar is a major multipurpose project on the Krishna.","WAT-NS-1"),
r("Which region is directly linked with Nagarjuna Sagar?","Telangana-Andhra Pradesh region","Punjab-Haryana region","Odisha coast only","Uttarakhand Himalaya","The Krishna project serves areas in the Telangana-Andhra Pradesh region.","WAT-NS-2"),
r("What is a major function of Nagarjuna Sagar?","Irrigation and hydroelectric power","Only port development","Only flood forecasting","Only coastal fishing","The project supports large irrigation systems and power generation.","WAT-NS-3"),
r("Consider the statements: I. Nagarjuna Sagar is on the Krishna. II. It is a multipurpose project. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","WAT-NS-4"),
r("A large dam on the Krishna serves the Telangana-Andhra region. Which one is it?","Nagarjuna Sagar","Bhakra","Hirakud","Tehri","The Krishna clue identifies Nagarjuna Sagar.","WAT-NS-5")
]),
buildQl("TUNGABHADRA","Tungabhadra project",[
r("The Tungabhadra project is built on which river?","Tungabhadra","Sutlej","Mahanadi","Bhagirathi","The dam is on the Tungabhadra, a major tributary of the Krishna.","WAT-TUNGA-1"),
r("Which states are closely linked with the Tungabhadra project?","Karnataka and Andhra Pradesh","Punjab and Haryana","Gujarat and Rajasthan","Odisha and West Bengal","The project serves the Deccan region around Karnataka and Andhra Pradesh.","WAT-TUNGA-2"),
r("Which is a major use of the Tungabhadra project?","Irrigation and power","Only sea shipping","Only urban waterlogging control","Only mining","It is a multipurpose irrigation-power project.","WAT-TUNGA-3"),
r("Consider the statements: I. Tungabhadra is part of the Krishna basin. II. The project supports irrigation. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements are correct.","WAT-TUNGA-4"),
r("A multipurpose project in the Deccan is built on a Krishna tributary of the same name. Which project is it?","Tungabhadra","Hirakud","Bhakra","Tehri","The tributary clue identifies Tungabhadra.","WAT-TUNGA-5")
]),
buildQl("RAINWATER-HARVESTING","Rainwater harvesting",[
r("What is rainwater harvesting?","Collecting and storing rainwater for later use or recharge","Draining all rainwater away","Pumping only river water","Using sea water for irrigation","Rainwater harvesting captures rainfall instead of allowing all runoff to escape.","WAT-RWH-1"),
r("Which traditional practice is an example of rainwater harvesting?","Storing rooftop runoff","Increasing surface sealing","Removing tanks","Blocking recharge pits","Rooftop systems collect rain for storage or groundwater recharge.","WAT-RWH-2"),
r("Why is rainwater harvesting useful in cities?","It can reduce runoff and recharge groundwater","It increases all flooding","It prevents infiltration","It eliminates local storage","Capturing rain reduces storm runoff while improving local water availability.","WAT-RWH-3"),
r("Consider the statements: I. Rainwater harvesting can recharge aquifers. II. It can supplement local water supply. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are major benefits.","WAT-RWH-4"),
r("A building directs rooftop rain into a recharge pit. What practice is this?","Rainwater harvesting","Canal irrigation","Tank navigation","River dredging","The system captures rain and directs it underground.","WAT-RWH-5")
]),
buildQl("WATERSHED-MANAGEMENT","Watershed management",[
r("What is a watershed?","Area draining to a common outlet","A single well","A sea port","A railway zone","A watershed includes all land contributing runoff to a shared drainage outlet.","WAT-WATERSHED-1"),
r("What is a main aim of watershed management?","Conserve soil and water across a drainage area","Increase erosion","Speed up all runoff","Remove vegetation","Watershed management treats land and water together to reduce degradation and improve recharge.","WAT-WATERSHED-2"),
r("Which measure is common in watershed management?","Check dams and contour treatment","Removing all vegetation","Paving all slopes","Deepening every river blindly","Small structures slow runoff and increase infiltration.","WAT-WATERSHED-3"),
r("Consider the statements: I. Watershed management can reduce soil erosion. II. It can improve groundwater recharge. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both outcomes are central goals.","WAT-WATERSHED-4"),
r("A dry upland area builds check dams, plants slopes and slows runoff. What approach is being used?","Watershed management","Port development","Rail corridor planning","Urban agglomeration","The measures treat the entire drainage area for soil-water conservation.","WAT-WATERSHED-5")
]),
buildQl("INTERSTATE-WATER-MANAGEMENT","Interstate river-water management",[
r("Why can interstate river-water disputes arise?","A river basin is shared by more than one state","Rivers never cross state boundaries","All states have equal water demand","Water use has no upstream-downstream effects","Shared rivers create competing demands among states.","WAT-INTERSTATE-1"),
r("Which feature makes river-water sharing complex?","Upstream use can affect downstream availability","States are hydrologically isolated","Reservoirs never alter flows","Irrigation uses no water","River basins connect upstream and downstream users.","WAT-INTERSTATE-2"),
r("What principle is important in shared-basin management?","Coordinated use across the whole basin","Each state ignoring all others","Unlimited upstream withdrawal","No data sharing","Basin-wide coordination helps balance multiple users.","WAT-INTERSTATE-3"),
r("Consider the statements: I. River basins can cross political boundaries. II. Water management may therefore require interstate cooperation. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Hydrology does not follow state boundaries.","WAT-INTERSTATE-4"),
r("Two states depend on the same river for irrigation and cities. What management challenge is most likely?","Water sharing","Rail gauge conversion","Coastal erosion only","Air traffic management","Competing demands on a shared river require allocation and cooperation.","WAT-INTERSTATE-5")
])
]);
export const GEO_WAT_001_CP004_REVIEW_BATCH_V1=finalizeCp(4,GEO_WAT_001_CP004_QLS);
export function auditGeoWat001Cp004ReviewBatchV1(){return auditCp(4,GEO_WAT_001_CP004_QLS,GEO_WAT_001_CP004_REVIEW_BATCH_V1);}
