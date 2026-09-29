import { buildGeoWatQl, finalizeGeoWatCp, auditGeoWatCp } from "./geo-wat-001-review-builder";
const SRC=["NCERT-CLASS10-GEOGRAPHY-WATER-RESOURCES","NCERT-CLASS12-INDIA-PEOPLE-ECONOMY-WATER-RESOURCES","CENTRAL-WATER-COMMISSION-INDIA"] as const;
const q=(key:string,name:string,rows:readonly any[])=>buildGeoWatQl(key,name,rows.map((r:any)=>({...r,sourceIds:SRC})) as any);
const QLS=Object.freeze([
q("BHAKRA-NANGAL","Bhakra-Nangal project",[
{stem:"Bhakra Dam is built on which river?",answer:"Sutlej",distractors:["Mahanadi","Narmada","Krishna"],explanation:"Bhakra Dam is a major multipurpose project on the Sutlej River.",sourceFactId:"DAM-BHAKRA-RIVER"},
{stem:"Bhakra Dam is located in which state?",answer:"Himachal Pradesh",distractors:["Odisha","Gujarat","Telangana"],explanation:"Bhakra Dam is located in Himachal Pradesh near the Punjab boundary.",sourceFactId:"DAM-BHAKRA-STATE"},
{stem:"Which reservoir is formed by Bhakra Dam?",answer:"Gobind Sagar",distractors:["Hirakud Reservoir","Nagarjuna Sagar","Indira Sagar"],explanation:"The Bhakra reservoir on the Sutlej is known as Gobind Sagar.",sourceFactId:"DAM-BHAKRA-RES"},
{stem:"Consider the statements: I. Bhakra is on the Sutlej. II. Gobind Sagar is its reservoir. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"Both river and reservoir relationships are correct.",sourceFactId:"DAM-BHAKRA-STATEMENT"},
{stem:"Which pair correctly identifies Bhakra-Nangal geography?",answer:"Bhakra — Sutlej",distractors:["Bhakra — Mahanadi","Bhakra — Krishna","Bhakra — Godavari"],explanation:"Bhakra is constructed on the Sutlej.",sourceFactId:"DAM-BHAKRA-MATCH"},
{stem:"A map marks a major dam on the Sutlej forming Gobind Sagar. Which project is it?",answer:"Bhakra-Nangal",distractors:["Hirakud","Tehri","Sardar Sarovar"],explanation:"The Sutlej and Gobind Sagar identify Bhakra-Nangal.",sourceFactId:"DAM-BHAKRA-CLUE"}
]),
q("HIRAKUD","Hirakud project",[
{stem:"Hirakud Dam is built on which river?",answer:"Mahanadi",distractors:["Sutlej","Narmada","Bhagirathi"],explanation:"Hirakud is a major multipurpose dam on the Mahanadi River.",sourceFactId:"DAM-HIRAKUD-RIVER"},
{stem:"Hirakud Dam is located in which state?",answer:"Odisha",distractors:["Punjab","Gujarat","Uttarakhand"],explanation:"Hirakud is located near Sambalpur in Odisha.",sourceFactId:"DAM-HIRAKUD-STATE"},
{stem:"Which city is closely linked with Hirakud Dam?",answer:"Sambalpur",distractors:["Bilaspur","Tehri","Bharuch"],explanation:"Hirakud Dam is located near Sambalpur in Odisha.",sourceFactId:"DAM-HIRAKUD-SAMBALPUR"},
{stem:"Consider the statements: I. Hirakud is on the Mahanadi. II. It is in Odisha. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"Both project-location facts are correct.",sourceFactId:"DAM-HIRAKUD-STATEMENT"},
{stem:"Which pair correctly identifies Hirakud geography?",answer:"Hirakud — Mahanadi",distractors:["Hirakud — Sutlej","Hirakud — Narmada","Hirakud — Cauvery"],explanation:"Hirakud Dam impounds the Mahanadi.",sourceFactId:"DAM-HIRAKUD-MATCH"},
{stem:"A major multipurpose dam near Sambalpur controls the Mahanadi. Which project is it?",answer:"Hirakud",distractors:["Bhakra","Tehri","Koyna"],explanation:"The Mahanadi-Sambalpur combination identifies Hirakud.",sourceFactId:"DAM-HIRAKUD-CLUE"}
]),
q("DAMODAR-VALLEY","Damodar Valley project system",[
{stem:"The Damodar Valley Project is based on which river basin?",answer:"Damodar",distractors:["Narmada","Sutlej","Cauvery"],explanation:"The Damodar Valley Corporation developed a multipurpose project system in the Damodar basin.",sourceFactId:"DAM-DVC-BASIN"},
{stem:"Which two states are most closely linked with the Damodar Valley project system?",answer:"Jharkhand and West Bengal",distractors:["Punjab and Haryana","Gujarat and Rajasthan","Kerala and Tamil Nadu"],explanation:"The Damodar basin project system extends across Jharkhand and West Bengal.",sourceFactId:"DAM-DVC-STATES"},
{stem:"Which organisation manages the Damodar Valley multipurpose system?",answer:"Damodar Valley Corporation",distractors:["NHAI","AAI","DFCCIL"],explanation:"DVC manages dams, power and water-resource functions in the Damodar Valley.",sourceFactId:"DAM-DVC-ORG"},
{stem:"Consider the statements: I. DVC is a multipurpose river-valley organisation. II. Flood control was one of its major objectives. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"DVC was designed for flood moderation, power, irrigation and regional development.",sourceFactId:"DAM-DVC-STATEMENT"},
{stem:"Which pair correctly identifies Damodar Valley geography?",answer:"Damodar — Jharkhand and West Bengal",distractors:["Damodar — Gujarat and Maharashtra","Damodar — Punjab and Haryana","Damodar — Kerala and Karnataka"],explanation:"The Damodar basin is centred in Jharkhand and West Bengal.",sourceFactId:"DAM-DVC-MATCH"},
{stem:"A multipurpose river-basin system is known for flood control and power development in Jharkhand-West Bengal. Which project is it?",answer:"Damodar Valley Project",distractors:["Bhakra-Nangal","Sardar Sarovar","Nagarjuna Sagar"],explanation:"Those features identify the Damodar Valley Project.",sourceFactId:"DAM-DVC-CLUE"}
]),
q("TEHRI","Tehri Dam project",[
{stem:"Tehri Dam is built on which river?",answer:"Bhagirathi",distractors:["Mahanadi","Tapi","Beas"],explanation:"Tehri Dam is built on the Bhagirathi River in Uttarakhand.",sourceFactId:"DAM-TEHRI-RIVER"},
{stem:"Tehri Dam is located in which state?",answer:"Uttarakhand",distractors:["Odisha","Gujarat","Punjab"],explanation:"Tehri Dam is in Uttarakhand.",sourceFactId:"DAM-TEHRI-STATE"},
{stem:"Which larger river system includes the Bhagirathi at Tehri?",answer:"Ganga system",distractors:["Narmada system","Mahanadi system","Krishna system"],explanation:"The Bhagirathi is a principal headstream of the Ganga.",sourceFactId:"DAM-TEHRI-BASIN"},
{stem:"Consider the statements: I. Tehri is on the Bhagirathi. II. It lies in Uttarakhand. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"Both project-river and project-state relations are correct.",sourceFactId:"DAM-TEHRI-STATEMENT"},
{stem:"Which pair correctly identifies Tehri geography?",answer:"Tehri — Bhagirathi",distractors:["Tehri — Mahanadi","Tehri — Sutlej","Tehri — Tapi"],explanation:"Tehri Dam is on the Bhagirathi.",sourceFactId:"DAM-TEHRI-MATCH"},
{stem:"A major Himalayan dam in Uttarakhand is built on the Bhagirathi. Which dam is it?",answer:"Tehri",distractors:["Hirakud","Ukai","Koyna"],explanation:"The Bhagirathi-Uttarakhand combination identifies Tehri.",sourceFactId:"DAM-TEHRI-CLUE"}
]),
q("SARDAR-SAROVAR","Sardar Sarovar project",[
{stem:"Sardar Sarovar Dam is built on which river?",answer:"Narmada",distractors:["Mahanadi","Sutlej","Cauvery"],explanation:"Sardar Sarovar is a major multipurpose project on the Narmada River.",sourceFactId:"DAM-SSP-RIVER"},
{stem:"Sardar Sarovar Dam is located in which state?",answer:"Gujarat",distractors:["Odisha","Himachal Pradesh","Uttarakhand"],explanation:"Sardar Sarovar is located in Gujarat on the Narmada.",sourceFactId:"DAM-SSP-STATE"},
{stem:"Which river basin is linked with Sardar Sarovar?",answer:"Narmada basin",distractors:["Ganga basin","Mahanadi basin","Cauvery basin"],explanation:"The project is part of the Narmada basin.",sourceFactId:"DAM-SSP-BASIN"},
{stem:"Consider the statements: I. Sardar Sarovar is on the Narmada. II. It is in Gujarat. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"Both facts correctly identify the project.",sourceFactId:"DAM-SSP-STATEMENT"},
{stem:"Which pair correctly identifies Sardar Sarovar geography?",answer:"Sardar Sarovar — Narmada",distractors:["Sardar Sarovar — Krishna","Sardar Sarovar — Beas","Sardar Sarovar — Mahanadi"],explanation:"Sardar Sarovar impounds the Narmada.",sourceFactId:"DAM-SSP-MATCH"},
{stem:"A major dam in Gujarat is built on the Narmada. Which project is it?",answer:"Sardar Sarovar",distractors:["Hirakud","Bhakra","Tehri"],explanation:"The Gujarat-Narmada combination identifies Sardar Sarovar.",sourceFactId:"DAM-SSP-CLUE"}
]),
q("NAGARJUNA-SAGAR","Nagarjuna Sagar project",[
{stem:"Nagarjuna Sagar Dam is built on which river?",answer:"Krishna",distractors:["Narmada","Mahanadi","Sutlej"],explanation:"Nagarjuna Sagar is a major multipurpose project on the Krishna River.",sourceFactId:"DAM-NS-RIVER"},
{stem:"Nagarjuna Sagar is linked with which river basin?",answer:"Krishna basin",distractors:["Narmada basin","Ganga basin","Mahanadi basin"],explanation:"The project is located on the Krishna River.",sourceFactId:"DAM-NS-BASIN"},
{stem:"Which two present-day states are linked by the Nagarjuna Sagar project region?",answer:"Telangana and Andhra Pradesh",distractors:["Punjab and Haryana","Gujarat and Rajasthan","Odisha and Jharkhand"],explanation:"Nagarjuna Sagar lies on the Krishna between the Telangana-Andhra Pradesh region.",sourceFactId:"DAM-NS-STATES"},
{stem:"Consider the statements: I. Nagarjuna Sagar is on the Krishna. II. It serves the Telangana-Andhra Pradesh region. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"Both project-river and regional relations are correct.",sourceFactId:"DAM-NS-STATEMENT"},
{stem:"Which pair correctly identifies Nagarjuna Sagar geography?",answer:"Nagarjuna Sagar — Krishna",distractors:["Nagarjuna Sagar — Sutlej","Nagarjuna Sagar — Narmada","Nagarjuna Sagar — Bhagirathi"],explanation:"Nagarjuna Sagar Dam is on the Krishna.",sourceFactId:"DAM-NS-MATCH"},
{stem:"A major multipurpose project on the Krishna serves the Telangana-Andhra Pradesh region. Which project is it?",answer:"Nagarjuna Sagar",distractors:["Bhakra-Nangal","Hirakud","Tehri"],explanation:"That river-region combination identifies Nagarjuna Sagar.",sourceFactId:"DAM-NS-CLUE"}
]),
q("TUNGABHADRA","Tungabhadra project",[
{stem:"Tungabhadra Dam is built on which river?",answer:"Tungabhadra",distractors:["Narmada","Mahanadi","Sutlej"],explanation:"Tungabhadra Dam is constructed on the Tungabhadra River.",sourceFactId:"DAM-TB-RIVER"},
{stem:"Tungabhadra Dam is located in which state?",answer:"Karnataka",distractors:["Odisha","Punjab","Gujarat"],explanation:"The Tungabhadra reservoir is in Karnataka.",sourceFactId:"DAM-TB-STATE"},
{stem:"The Tungabhadra is a tributary of which major river?",answer:"Krishna",distractors:["Ganga","Narmada","Mahanadi"],explanation:"The Tungabhadra is a major tributary of the Krishna.",sourceFactId:"DAM-TB-BASIN"},
{stem:"Consider the statements: I. Tungabhadra Dam is in Karnataka. II. The Tungabhadra belongs to the Krishna basin. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"Both statements correctly locate the project.",sourceFactId:"DAM-TB-STATEMENT"},
{stem:"Which pair correctly identifies Tungabhadra geography?",answer:"Tungabhadra — Krishna basin",distractors:["Tungabhadra — Ganga basin","Tungabhadra — Narmada basin","Tungabhadra — Sutlej basin"],explanation:"The Tungabhadra drains into the Krishna.",sourceFactId:"DAM-TB-MATCH"},
{stem:"A Karnataka reservoir lies on a major tributary of the Krishna with the same name as the project. Which is it?",answer:"Tungabhadra",distractors:["Tehri","Hirakud","Bhakra"],explanation:"The description identifies the Tungabhadra project.",sourceFactId:"DAM-TB-CLUE"}
]),
q("CHAMBAL-VALLEY","Chambal Valley projects",[
{stem:"The Chambal Valley Project is based on which river?",answer:"Chambal",distractors:["Sutlej","Mahanadi","Tapi"],explanation:"The Chambal multipurpose development system is built on the Chambal River.",sourceFactId:"DAM-CHAMBAL-RIVER"},
{stem:"Gandhi Sagar Dam is built on which river?",answer:"Chambal",distractors:["Narmada","Krishna","Cauvery"],explanation:"Gandhi Sagar is one of the major dams in the Chambal Valley system.",sourceFactId:"DAM-GANDHI-RIVER"},
{stem:"Rana Pratap Sagar is part of which river-valley system?",answer:"Chambal",distractors:["Damodar","Sutlej","Mahanadi"],explanation:"Rana Pratap Sagar is one of the major Chambal Valley projects.",sourceFactId:"DAM-RPS-CHAMBAL"},
{stem:"Consider the statements: I. Gandhi Sagar is on the Chambal. II. Rana Pratap Sagar is also part of the Chambal system. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"Both dams belong to the Chambal Valley development sequence.",sourceFactId:"DAM-CHAMBAL-STATEMENT"},
{stem:"Which pair correctly identifies Chambal Valley geography?",answer:"Gandhi Sagar — Chambal",distractors:["Gandhi Sagar — Mahanadi","Rana Pratap Sagar — Sutlej","Kota Barrage — Narmada"],explanation:"Gandhi Sagar is a major dam on the Chambal.",sourceFactId:"DAM-CHAMBAL-MATCH"},
{stem:"A river system includes Gandhi Sagar, Rana Pratap Sagar and Kota Barrage. Which river is it?",answer:"Chambal",distractors:["Mahanadi","Bhagirathi","Beas"],explanation:"These projects form the well-known Chambal Valley development system.",sourceFactId:"DAM-CHAMBAL-CLUE"}
]),
q("KOYNA","Koyna project",[
{stem:"Koyna Dam is located in which state?",answer:"Maharashtra",distractors:["Odisha","Gujarat","Uttarakhand"],explanation:"The Koyna project is in Maharashtra.",sourceFactId:"DAM-KOYNA-STATE"},
{stem:"Koyna Dam is built on which river?",answer:"Koyna",distractors:["Mahanadi","Sutlej","Bhagirathi"],explanation:"The project is built on the Koyna River.",sourceFactId:"DAM-KOYNA-RIVER"},
{stem:"The Koyna River is a tributary of which major river?",answer:"Krishna",distractors:["Ganga","Narmada","Brahmaputra"],explanation:"The Koyna joins the Krishna in Maharashtra.",sourceFactId:"DAM-KOYNA-BASIN"},
{stem:"Consider the statements: I. Koyna is in Maharashtra. II. It belongs to the Krishna basin. Which is correct?",answer:"Both I and II are correct",distractors:["Only I is correct","Only II is correct","Neither I nor II is correct"],explanation:"Both statements correctly locate the Koyna project.",sourceFactId:"DAM-KOYNA-STATEMENT"},
{stem:"Which pair correctly identifies Koyna geography?",answer:"Koyna — Maharashtra",distractors:["Koyna — Odisha","Koyna — Punjab","Koyna — Uttarakhand"],explanation:"The Koyna project is located in Maharashtra.",sourceFactId:"DAM-KOYNA-MATCH"},
{stem:"A major hydropower-oriented project in Maharashtra lies on a tributary of the Krishna. Which project is it?",answer:"Koyna",distractors:["Hirakud","Bhakra","Tehri"],explanation:"The location and basin identify the Koyna project.",sourceFactId:"DAM-KOYNA-CLUE"}
]),
q("CAUVERY-DAMS","Major Cauvery-basin dams",[
{stem:"Krishnarajasagara Dam is built on which river?",answer:"Cauvery",distractors:["Mahanadi","Narmada","Sutlej"],explanation:"Krishnarajasagara, or KRS, is a major dam on the Cauvery in Karnataka.",sourceFactId:"DAM-KRS-RIVER"},
{stem:"Krishnarajasagara Dam is located in which state?",answer:"Karnataka",distractors:["Odisha","Punjab","Gujarat"],explanation:"KRS is located in Karnataka.",sourceFactId:"DAM-KRS-STATE"},
{stem:"Mettur Dam is built on which river?",answer:"Cauvery",distractors:["Krishna","Narmada","Mahanadi"],explanation:"Mettur Dam is a major Cauvery project in Tamil Nadu.",sourceFactId:"DAM-METTUR-RIVER"},
{stem:"Mettur Dam is located in which state?",answer:"Tamil Nadu",distractors:["Karnataka","Punjab","Odisha"],explanation:"Mettur is located in Tamil Nadu.",sourceFactId:"DAM-METTUR-STATE"},
{stem:"Consider the statements: I. KRS is in Karnataka. II. Mettur is in Tamil Nadu. III. Both are on the Cauvery. Which is correct?",answer:"I, II and III",distractors:["I and II only","II and III only","I and III only"],explanation:"All three statements correctly describe Cauvery-basin dam geography.",sourceFactId:"DAM-CAUVERY-STATEMENT"},
{stem:"Which pair correctly identifies Cauvery-basin projects?",answer:"KRS — Karnataka; Mettur — Tamil Nadu",distractors:["KRS — Odisha; Mettur — Gujarat","KRS — Punjab; Mettur — Haryana","KRS — Uttarakhand; Mettur — Himachal Pradesh"],explanation:"KRS and Mettur are major Cauvery projects in Karnataka and Tamil Nadu respectively.",sourceFactId:"DAM-CAUVERY-MATCH"}
]),
q("PROJECT-RIVER-STATE-INTEGRATION","Integrated dam-river-state reasoning",[
{stem:"Which sequence is correctly matched?",answer:"Bhakra—Sutlej; Hirakud—Mahanadi; Tehri—Bhagirathi",distractors:["Bhakra—Mahanadi; Hirakud—Sutlej; Tehri—Narmada","All three—Krishna","All three—Cauvery"],explanation:"The sequence correctly identifies three major dam-river relationships.",sourceFactId:"DAM-INT-1"},
{stem:"Which sequence is correctly matched?",answer:"Sardar Sarovar—Narmada; Nagarjuna Sagar—Krishna; KRS—Cauvery",distractors:["Sardar Sarovar—Sutlej; Nagarjuna Sagar—Mahanadi; KRS—Narmada","All three—Ganga","All three—Brahmaputra"],explanation:"All three project-river relationships are correct.",sourceFactId:"DAM-INT-2"},
{stem:"Which project is the correct match for Odisha and the Mahanadi?",answer:"Hirakud",distractors:["Bhakra","Tehri","Sardar Sarovar"],explanation:"Hirakud is the major Mahanadi project in Odisha.",sourceFactId:"DAM-INT-3"},
{stem:"Which project is the correct match for Gujarat and the Narmada?",answer:"Sardar Sarovar",distractors:["Hirakud","Tehri","Koyna"],explanation:"Sardar Sarovar is located on the Narmada in Gujarat.",sourceFactId:"DAM-INT-4"},
{stem:"Which project is the correct match for Uttarakhand and the Bhagirathi?",answer:"Tehri",distractors:["Bhakra","Tungabhadra","Mettur"],explanation:"Tehri Dam is in Uttarakhand on the Bhagirathi.",sourceFactId:"DAM-INT-5"},
{stem:"A map marks Bhakra in the north-west, Hirakud in eastern India and Sardar Sarovar in western India. What is being tested?",answer:"Project-river-state geography",distractors:["Only population density","Only crop seasons","Only industrial ownership"],explanation:"Such a map integrates dam locations with rivers and states.",sourceFactId:"DAM-INT-6"}
])
]);
export const GEO_WAT_001_CP002_REVIEW_BATCH_V1=finalizeGeoWatCp(2,QLS);
export function auditGeoWat001Cp002ReviewBatchV1(){return auditGeoWatCp(2,QLS,GEO_WAT_001_CP002_REVIEW_BATCH_V1);}
