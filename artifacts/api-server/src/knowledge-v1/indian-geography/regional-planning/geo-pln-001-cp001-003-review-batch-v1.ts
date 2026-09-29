import { buildQl, finalizeCp, auditCp } from "./geo-pln-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});

export const GEO_PLN_001_CP001_QLS=Object.freeze([
buildQl("PLANNING-CONCEPT","Planning and regional development",[
r("What is planning in a geographic development context?","Deliberate allocation of resources to achieve defined development goals","Random use of resources","Only map drawing","Only population counting","Planning coordinates resources, priorities and actions toward stated objectives.","PLN-CONCEPT-1"),
r("Why is regional planning needed in India?","Different regions have different resources, problems and development levels","All regions are identical","Only cities need development","Physical geography never affects development","Regional variation makes one uniform approach insufficient.","PLN-CONCEPT-2"),
r("Consider the statements: I. Planning involves priorities. II. It also involves allocating resources. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Planning links goals with resource allocation and implementation.","PLN-CONCEPT-3"),
r("Which pair correctly identifies planning logic?","Regional planning — development tailored to area-specific needs","Regional planning — same solution for all areas","Planning — no objectives","Planning — no resource allocation","Regional planning responds to local conditions.","PLN-CONCEPT-4"),
r("A drought-prone district receives a development programme designed around water scarcity and livelihood risk. What does this illustrate?","Area-specific planning","Random investment","Only national averaging","No planning","The intervention is tailored to a region's specific problem.","PLN-CONCEPT-5")
]),
buildQl("TARGET-AREA-PLANNING","Target-area planning",[
r("What is target-area planning?","Development planning focused on a specific problem region","Planning only for individuals","Planning with no geographic focus","Only urban zoning","Target-area programmes address spatially concentrated development problems.","PLN-TAREA-1"),
r("Which is an example of target-area planning?","Drought-prone area development","Scholarship for one student","Individual pension only","Private household budgeting","A drought-prone programme targets a defined geographic area.","PLN-TAREA-2"),
r("Why are hill-area programmes examples of target-area planning?","They focus on regions with specific physical constraints","They target only one occupation","They are unrelated to geography","They cover all regions equally","Mountain regions face distinctive accessibility and resource constraints.","PLN-TAREA-3"),
r("Consider the statements: I. Target-area planning focuses on regions. II. It can address physical or socioeconomic backwardness. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","The target is a defined area with identifiable development needs.","PLN-TAREA-4"),
r("A programme is designed only for chronically drought-affected districts. Which planning approach is being used?","Target-area planning","Target-group planning","No planning","Only sectoral accounting","The geographic area itself is the unit of intervention.","PLN-TAREA-5")
]),
buildQl("TARGET-GROUP-PLANNING","Target-group planning",[
r("What is target-group planning?","Planning focused on a specific section of population","Planning focused only on a river basin","Planning with no beneficiaries","Only city master planning","Target-group programmes are designed around defined social or economic groups.","PLN-TGROUP-1"),
r("Which example fits target-group planning?", "Programme for small and marginal farmers","Hill-area development programme","Drought-prone area programme","River-basin zoning","Small and marginal farmers form a defined beneficiary group rather than a geographic area.","PLN-TGROUP-2"),
r("How does target-group planning differ from target-area planning?","It focuses on people rather than a specific geographic region","It has no beneficiaries","It ignores social groups","It always covers only mountains","The basis of targeting is population group, not territory.","PLN-TGROUP-3"),
r("Consider the statements: I. Target-group planning focuses on beneficiary categories. II. Such groups may exist across many regions. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","A social group can be geographically dispersed.","PLN-TGROUP-4"),
r("A programme provides support specifically to landless labourers across many districts. Which approach is this?","Target-group planning","Target-area planning","Regional zoning only","No planning","The beneficiary group is the basis of the programme.","PLN-TGROUP-5")
]),
buildQl("HILL-AREA-DEVELOPMENT","Hill Area Development Programme",[
r("What problem does hill-area planning seek to address?","Development constraints caused by difficult terrain and fragile environments","Only coastal flooding","Only urban traffic","Only desert salinity","Hill regions face accessibility, slope and ecological constraints.","PLN-HILL-1"),
r("Which activity is important in sustainable hill development?","Horticulture, forestry and soil conservation suited to slopes","Uncontrolled deforestation","Large-scale slope clearing","Ignoring erosion","Development should match mountain ecology and land capability.","PLN-HILL-2"),
r("Why is transport improvement important in hill areas?","Difficult terrain can isolate settlements and markets","Hill areas have no settlements","Transport worsens every livelihood","Roads are unrelated to development","Connectivity helps access services, markets and employment.","PLN-HILL-3"),
r("Consider the statements: I. Hill development must consider ecological fragility. II. Slope-sensitive land use is important. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Mountain development must balance livelihoods and environmental stability.","PLN-HILL-4"),
r("A mountain programme promotes horticulture, terracing and better access roads. What type of planning does it illustrate?","Hill-area development","Coastal-zone planning","Desert irrigation only","Port planning","The measures respond to mountain-specific conditions.","PLN-HILL-5")
]),
buildQl("DROUGHT-PRONE-AREA-PLANNING","Drought-prone area planning",[
r("What is a major objective of drought-prone area planning?","Reduce vulnerability to chronic water scarcity","Increase water wastage","Promote floodplain settlement","Ignore rainfall variability","Such programmes aim to stabilise livelihoods under recurrent drought risk.","PLN-DPAP-1"),
r("Which measure is appropriate in a drought-prone area?","Watershed development and water conservation","Uncontrolled groundwater extraction","Removal of tanks","High-water crops everywhere","Conservation improves local water security and resilience.","PLN-DPAP-2"),
r("Which livelihood strategy suits drought-prone planning?","Activities adapted to limited water availability","Only water-intensive farming","No livelihood diversification","Permanent fallow everywhere","Development should reduce dependence on highly water-demanding systems.","PLN-DPAP-3"),
r("Consider the statements: I. Drought-prone planning is target-area planning. II. Water conservation is central to it. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","The programme targets a defined problem region and addresses its core constraint.","PLN-DPAP-4"),
r("A semi-arid district receives watershed treatment and livelihood diversification because of recurrent drought. Which approach is this?","Drought-prone area planning","Port-led development","Urban renewal only","No regional planning","The programme is designed around a chronic regional hazard.","PLN-DPAP-5")
])
]);
export const GEO_PLN_001_CP001_REVIEW_BATCH_V1=finalizeCp(1,GEO_PLN_001_CP001_QLS);
export function auditGeoPln001Cp001ReviewBatchV1(){return auditCp(1,GEO_PLN_001_CP001_QLS,GEO_PLN_001_CP001_REVIEW_BATCH_V1);}

export const GEO_PLN_001_CP002_QLS=Object.freeze([
buildQl("BHARMAUR-LOCATION","Bharmaur tribal region",[
r("Bharmaur tribal region is located in which state?","Himachal Pradesh","Rajasthan","Odisha","Tamil Nadu","The Bharmaur case study is located in the Chamba district region of Himachal Pradesh.","PLN-BHAR-1"),
r("Which tribal community is closely linked with the Bharmaur case study?","Gaddis","Todas","Bhils only","Santhals only","The Bharmaur region is strongly associated with the Gaddi tribal community.","PLN-BHAR-2"),
r("Why is Bharmaur useful as a regional-planning case study?","It shows development challenges in a remote tribal mountain area","It is a major seaport","It is a desert metropolis","It is an industrial corridor","The case combines isolation, tribal livelihoods and mountain constraints.","PLN-BHAR-3"),
r("Consider the statements: I. Bharmaur is in Himachal Pradesh. II. It is linked with Gaddi tribal population. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are core facts of the NCERT case study.","PLN-BHAR-4"),
r("A planning case study concerns Gaddi communities in a remote Himalayan region. Which area is it?","Bharmaur","Kandla","Bhilai","Paradip","The Gaddi-Himalayan clue identifies Bharmaur.","PLN-BHAR-5")
]),
buildQl("BHARMAUR-DEVELOPMENT-CONSTRAINTS","Bharmaur development constraints",[
r("Which physical factor limited development in Bharmaur?","Mountainous terrain and poor accessibility","Flat coastal plain","Dense port network","No relief variation","Difficult terrain restricted transport and service access.","PLN-BHAR-CON-1"),
r("Which social challenge was important in the Bharmaur region?","Low access to education and health services","Too many seaports","Excess industrialisation","No tribal population","Remote settlements historically had weak access to social infrastructure.","PLN-BHAR-CON-2"),
r("Why can scattered mountain settlements raise service costs?","Schools, roads and health facilities must serve dispersed populations","They reduce travel distance","They create dense urban markets","They eliminate transport needs","Distance and terrain make service delivery more difficult.","PLN-BHAR-CON-3"),
r("Consider the statements: I. Isolation can limit development. II. Mountain terrain can raise infrastructure costs. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both constraints shaped Bharmaur's development challenge.","PLN-BHAR-CON-4"),
r("A remote tribal area has scattered settlements and difficult mountain roads. What development problem is most direct?","Limited accessibility","Coastal flooding","Port congestion","Excessive urban density","Physical isolation can restrict access to markets and services.","PLN-BHAR-CON-5")
]),
buildQl("BHARMAUR-DEVELOPMENT-INTERVENTIONS","Bharmaur development interventions",[
r("Which type of intervention can improve human development in a remote tribal region?","Education and health services","Removing all roads","Reducing schools","Blocking market access","Social infrastructure is central to inclusive regional development.","PLN-BHAR-INT-1"),
r("Why is road connectivity important in Bharmaur-type regions?","It improves access to markets, schools and health care","It only increases rainfall","It eliminates mountains","It reduces all livelihoods","Connectivity links remote communities with wider services and economic opportunities.","PLN-BHAR-INT-2"),
r("Which livelihood can suit Himalayan tribal development?","Pastoralism and horticulture adapted to local conditions","Deep-sea fishing","Port logistics","Desert salt mining only","Development should build on locally suitable mountain livelihoods.","PLN-BHAR-INT-3"),
r("Consider the statements: I. Tribal-area development should improve services. II. It should also respect local livelihoods and environment. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Balanced development combines social improvement with local ecological suitability.","PLN-BHAR-INT-4"),
r("A mountain development programme builds roads, schools and health centres while supporting local livelihoods. What goal does this serve?","Integrated regional development","Only transport expansion","Only urbanisation","Only population control","Multiple coordinated interventions address several dimensions of backwardness.","PLN-BHAR-INT-5")
]),
buildQl("TRIBAL-AREA-PLANNING","Tribal area planning principles",[
r("What is a key principle of tribal-area planning?","Development should respond to local social and ecological conditions","One identical programme fits all regions","Local livelihoods should be ignored","Only urban industries matter","Planning should reflect the needs and environment of the community concerned.","PLN-TRIBAL-1"),
r("Why is participation important in tribal development?","Local communities understand their needs and resource systems","Participation always delays development","Local knowledge has no value","Only outside agencies should decide","Community participation improves relevance and acceptance.","PLN-TRIBAL-2"),
r("Which approach is least suitable for fragile tribal mountain regions?","Uncontrolled resource extraction","Education improvement","Health access","Sustainable livelihood support","Short-term extraction can damage the resource base on which communities depend.","PLN-TRIBAL-3"),
r("Consider the statements: I. Tribal development includes social infrastructure. II. Cultural and livelihood context matters. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Development is not only physical infrastructure; social and cultural context matters too.","PLN-TRIBAL-4"),
r("A programme is designed with local tribal participation and protects common resources. What planning principle does it reflect?","Context-sensitive inclusive development","Uniform top-down planning only","No environmental concern","Only industrial expansion","The approach combines local participation with sustainable resource use.","PLN-TRIBAL-5")
]),
buildQl("BHARMAUR-CASE-REASONING","Bharmaur case-study reasoning",[
r("Which combination best explains Bharmaur's historical development challenge?","Remoteness, mountain terrain and weak social infrastructure","Port congestion and coastal erosion","Dense urbanisation and traffic","Excess irrigation and salinity only","The case centres on remote mountain and tribal development constraints.","PLN-BHAR-REASON-1"),
r("Which combination best supports Bharmaur's development?","Connectivity, education, health and locally suitable livelihoods","Deforestation and isolation","Only heavy industry","No road access","Integrated social and economic support is more appropriate than a single-sector intervention.","PLN-BHAR-REASON-2"),
r("Which comparison is correct?","Bharmaur is a target-area tribal development case, not a metropolitan planning case","Bharmaur is a seaport project","Bharmaur is a desert canal command","Bharmaur is an industrial corridor","The case is regional and tribal, rooted in Himalayan geography.","PLN-BHAR-REASON-3"),
r("Why is Bharmaur a useful example of planning geography?","It links physical remoteness with social and economic development","It has no geographic constraints","It demonstrates only national averages","It is unrelated to region","The case shows how geography shapes development policy.","PLN-BHAR-REASON-4"),
r("A question mentions Gaddis, Chamba and tribal regional development. Which case study should you identify?","Bharmaur","Indira Gandhi Canal","Damodar Valley","Nagarjuna Sagar","Those clues point to the Bharmaur tribal region.","PLN-BHAR-REASON-5")
])
]);
export const GEO_PLN_001_CP002_REVIEW_BATCH_V1=finalizeCp(2,GEO_PLN_001_CP002_QLS);
export function auditGeoPln001Cp002ReviewBatchV1(){return auditCp(2,GEO_PLN_001_CP002_QLS,GEO_PLN_001_CP002_REVIEW_BATCH_V1);}

export const GEO_PLN_001_CP003_QLS=Object.freeze([
buildQl("INDIRA-GANDHI-CANAL","Indira Gandhi Canal geography",[
r("Indira Gandhi Canal primarily serves which state?","Rajasthan","Kerala","Assam","Odisha","The canal transformed irrigation in north-western Rajasthan.","PLN-IGC-1"),
r("What was the canal formerly known as?","Rajasthan Canal","Damodar Canal","Upper Ganga Canal","Buckingham Canal","The Indira Gandhi Canal was earlier known as the Rajasthan Canal.","PLN-IGC-2"),
r("Which river system supplies water to the Indira Gandhi Canal?","Sutlej-Beas system","Mahanadi only","Godavari only","Brahmaputra only","The canal receives water from the north-western river system via the Harike headworks.","PLN-IGC-3"),
r("Consider the statements: I. The canal supports irrigation in arid Rajasthan. II. It changed land use and settlement patterns in its command area. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Large-scale irrigation altered agriculture and settlement in the desert command area.","PLN-IGC-4"),
r("A major canal carries north-western river water into the Thar Desert. Which project is it?","Indira Gandhi Canal","Buckingham Canal","West Coast Canal","Damodar Canal","The Rajasthan desert clue identifies the Indira Gandhi Canal.","PLN-IGC-5")
]),
buildQl("CANAL-COMMAND-BENEFITS","Indira Gandhi Canal command benefits",[
r("What major change did canal irrigation bring to parts of western Rajasthan?","Expansion of irrigated agriculture","Complete disappearance of farming","Only coastal fishing","Only mining","Reliable canal water made more intensive agriculture possible.","PLN-CANAL-BEN-1"),
r("Which livelihood effect can irrigation have in a dry region?","Increase agricultural employment and settlement","Eliminate cultivation","Reduce all population","Stop market development","Irrigation can support farming, services and new settlements.","PLN-CANAL-BEN-2"),
r("Which land-use change is expected in a canal command area?","More land under cultivation","All farmland becomes forest","No change in cropping","All land becomes urban","Water availability can convert dry land into irrigated cropland.","PLN-CANAL-BEN-3"),
r("Consider the statements: I. Irrigation can raise crop intensity. II. It can attract population into newly productive areas. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Water changes both agricultural and settlement geography.","PLN-CANAL-BEN-4"),
r("A formerly arid tract develops irrigated farms and new settlements after canal construction. What process does this show?","Regional transformation through irrigation","Coastal urbanisation","Mountain depopulation","No planning effect","Water infrastructure can reshape regional economy and settlement.","PLN-CANAL-BEN-5")
]),
buildQl("CANAL-COMMAND-PROBLEMS","Canal command environmental problems",[
r("Which problem can result from excessive canal irrigation in arid areas?","Waterlogging","Glaciation","Tsunami","Avalanche","Over-irrigation and poor drainage can raise the water table.","PLN-CANAL-PROB-1"),
r("Which soil problem may accompany waterlogging in dry climates?","Salinity","Permanent acidification only","Glacial erosion","River capture","High evaporation can leave salts behind in poorly drained soils.","PLN-CANAL-PROB-2"),
r("Why can unsuitable crops create sustainability problems in a desert canal command?","Water demand may exceed local ecological capacity","All crops use equal water","Irrigation water is unlimited","Crop choice never affects soil","Water-intensive systems can increase stress and drainage problems.","PLN-CANAL-PROB-3"),
r("Consider the statements: I. Canal irrigation can improve agriculture. II. Poor management can cause salinity and waterlogging. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","The command area illustrates both development benefits and environmental costs.","PLN-CANAL-PROB-4"),
r("An irrigated desert field develops a high water table and salt crust. What planning issue does this show?","Unsustainable canal-command management","Lack of irrigation","Earthquake risk","Urban heat island","Poor drainage and over-irrigation can degrade command-area land.","PLN-CANAL-PROB-5")
]),
buildQl("SUSTAINABLE-DEVELOPMENT","Sustainable development concept",[
r("What is sustainable development?","Development that meets present needs without undermining future generations' ability to meet theirs","Maximum present extraction regardless of future impact","No development at all","Only economic growth with no environmental concern","Sustainable development balances present improvement with long-term resource security.","PLN-SD-1"),
r("Which principle is central to sustainable development?","Balance economic, social and environmental goals","Ignore ecological limits","Maximise waste","Use resources without regard to renewal","Sustainability requires development within environmental limits.","PLN-SD-2"),
r("Why is resource efficiency important for sustainability?","It reduces waste and pressure on finite resources","It increases waste","It prevents all development","It makes planning unnecessary","Efficient use allows more benefit with less resource depletion.","PLN-SD-3"),
r("Consider the statements: I. Sustainability includes intergenerational equity. II. It requires attention to environmental limits. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Future generations and ecological limits are core sustainability ideas.","PLN-SD-4"),
r("A project raises income but permanently destroys the resource base supporting future livelihoods. Is this sustainable?","No","Yes, automatically","Only if population rises","Sustainability is unrelated","Long-term resource destruction conflicts with sustainable development.","PLN-SD-5")
]),
buildQl("CANAL-SUSTAINABILITY-MEASURES","Sustainable command-area management",[
r("Which measure helps make canal irrigation more sustainable?","Lining canals and improving drainage","Unlimited over-irrigation","Blocking all drains","Ignoring salinity","Reducing seepage and removing excess water improve command-area efficiency.","PLN-CANAL-SUS-1"),
r("Which agricultural change can reduce water stress in a desert command area?","Choosing crops suited to local water availability","Growing only the most water-intensive crops","Ignoring soil conditions","Increasing leakage","Crop choice should reflect climate, soil and water constraints.","PLN-CANAL-SUS-2"),
r("Why are shelterbelts useful in canal-irrigated desert areas?","They reduce wind erosion","They increase sand movement","They cause waterlogging","They remove vegetation","Trees and shrubs slow wind and help stabilise sandy soils.","PLN-CANAL-SUS-3"),
r("Consider the statements: I. Drainage helps control waterlogging. II. Shelterbelts help control wind erosion. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both measures address key environmental risks of desert irrigation.","PLN-CANAL-SUS-4"),
r("A canal command shifts to efficient irrigation, better drainage and suitable crops. What goal is being pursued?","Sustainable development","Maximum short-term extraction","No planning","Only urbanisation","The measures aim to preserve productivity while reducing ecological damage.","PLN-CANAL-SUS-5")
])
]);
export const GEO_PLN_001_CP003_REVIEW_BATCH_V1=finalizeCp(3,GEO_PLN_001_CP003_QLS);
export function auditGeoPln001Cp003ReviewBatchV1(){return auditCp(3,GEO_PLN_001_CP003_QLS,GEO_PLN_001_CP003_REVIEW_BATCH_V1);}
