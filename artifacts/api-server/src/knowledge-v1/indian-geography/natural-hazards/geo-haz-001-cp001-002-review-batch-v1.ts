import { buildQl, finalizeCp, auditCp } from "./geo-haz-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_HAZ_001_CP001_QLS=Object.freeze([
buildQl("EARTHQUAKE-BASICS","Earthquake process and focus",[
r("What causes most earthquakes?","Sudden release of energy along faults in the Earth's crust","Daily tides","Cloud formation","River evaporation","Stress builds in rocks and is released suddenly when they break or slip.","HAZ-EQ-1"),
r("What is the focus of an earthquake?","Point inside the Earth where rupture begins","Point directly above it on the surface","The nearest city","The strongest building","The focus, or hypocentre, is the underground origin of rupture.","HAZ-EQ-2"),
r("What is the epicentre?","Point on the surface directly above the focus","Deepest point of the ocean","Centre of a cyclone","Source of a river","The epicentre is the surface location vertically above the focus.","HAZ-EQ-3"),
r("Consider the statements: I. Earthquakes release seismic energy. II. The epicentre lies on the surface. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements describe basic earthquake geography.","HAZ-EQ-4"),
r("A fault suddenly slips several kilometres below the surface. What event can result?","Earthquake","Drought","Heat wave","River meander","Sudden fault movement releases seismic waves.","HAZ-EQ-5")
]),
buildQl("SEISMIC-ZONES-INDIA","Seismic risk regions of India",[
r("Which broad region of India has high earthquake risk because of active plate collision?","Himalayan belt","Stable central peninsula only","Coastal plains everywhere equally","Thar Desert only","The Himalaya lie along an active convergent plate boundary.","HAZ-SEISMIC-1"),
r("Why is the Himalayan region earthquake-prone?","Indian and Eurasian plates are converging","It has no faults","It lies at a passive plate centre","It has no crustal stress","Ongoing plate convergence builds strong tectonic stress.","HAZ-SEISMIC-2"),
r("Which other Indian region has significant seismic risk?","Northeast India","Only the western coastal plain","Only central alluvial basins","No other region","Northeast India is tectonically active and experiences frequent earthquakes.","HAZ-SEISMIC-3"),
r("Consider the statements: I. Himalaya have high seismic risk. II. Northeast India is also earthquake-prone. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both regions are major high-risk seismic zones.","HAZ-SEISMIC-4"),
r("A district lies along an active Himalayan fault system. Which hazard deserves special building-design attention?","Earthquakes","Coastal storm surge only","Sea erosion only","Drought only","Active faults raise earthquake risk and require seismic-resistant construction.","HAZ-SEISMIC-5")
]),
buildQl("EARTHQUAKE-MITIGATION","Earthquake risk reduction",[
r("Which measure most directly reduces earthquake building collapse risk?","Earthquake-resistant construction","Building on weak foundations","Removing reinforcement","Ignoring building codes","Seismic design improves a structure's ability to withstand shaking.","HAZ-EQ-MIT-1"),
r("Why should heavy objects be secured in earthquake-prone areas?","They can fall during shaking","They prevent tremors","They cause plate motion","They stop aftershocks","Securing objects reduces indoor injury hazards.","HAZ-EQ-MIT-2"),
r("Which land-use practice can reduce earthquake risk?","Avoiding unsafe construction on active faults and unstable slopes","Concentrating weak buildings on faults","Ignoring soil conditions","Removing evacuation routes","Risk-sensitive land use reduces exposure to severe ground effects.","HAZ-EQ-MIT-3"),
r("Consider the statements: I. Building codes reduce vulnerability. II. Preparedness drills improve response. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Mitigation combines safer structures with preparedness.","HAZ-EQ-MIT-4"),
r("A city cannot prevent earthquakes but strengthens buildings and trains residents. What is it reducing?","Vulnerability","Plate movement","Earthquake magnitude","Tectonic stress","Risk reduction focuses on lowering vulnerability and improving response.","HAZ-EQ-MIT-5")
]),
buildQl("TSUNAMI-BASICS","Tsunami generation and coastal impact",[
r("What is a tsunami?","A series of large sea waves caused by sudden displacement of water","A normal daily tide","A heat wave","A river flood only","Tsunamis result from sudden displacement of the sea floor or water column.","HAZ-TSU-1"),
r("Which event most commonly generates a major tsunami?","Strong undersea earthquake","Desert drought","Heat wave","River meander","Seafloor movement during an undersea earthquake can displace huge volumes of water.","HAZ-TSU-2"),
r("Why can tsunami waves become destructive near shore?","They slow and grow in height in shallow water","They disappear near shore","They turn into winds","They freeze instantly","Shoaling increases wave height as water depth decreases.","HAZ-TSU-3"),
r("Consider the statements: I. Tsunamis can cross ocean basins. II. Coastal areas are most exposed to inundation. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Tsunamis travel long distances and become hazardous at coasts.","HAZ-TSU-4"),
r("A powerful earthquake displaces the seafloor offshore. Which hazard may follow?","Tsunami","Drought","Cold wave","Dust storm","Sudden seafloor displacement can generate tsunami waves.","HAZ-TSU-5")
]),
buildQl("TSUNAMI-WARNING","Tsunami early warning and INCOIS",[
r("Which Indian institution operates the Indian Tsunami Early Warning Centre?","INCOIS","NHAI","DFCCIL","NITI Aayog","INCOIS provides ocean information and tsunami warning services for India.","HAZ-TSU-WARN-1"),
r("What information is crucial for tsunami warning after an undersea earthquake?","Earthquake location and sea-level observations","Crop prices","Railway timetables","Road toll data","Warnings combine seismic detection with ocean-level monitoring and modelling.","HAZ-TSU-WARN-2"),
r("Why are coastal evacuation routes important?","They help people move quickly to safer higher ground","They stop earthquakes","They reduce rainfall","They deepen harbours","Rapid evacuation can save lives after a tsunami warning.","HAZ-TSU-WARN-3"),
r("Consider the statements: I. INCOIS has a tsunami-warning role. II. Coastal communities need rapid evacuation plans. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Warning and evacuation are complementary parts of tsunami risk reduction.","HAZ-TSU-WARN-4"),
r("A strong offshore earthquake triggers an official warning for India's coast. Which agency is central to tsunami warning?","INCOIS","CWC","NHAI","BRO","INCOIS operates India's tsunami early-warning system.","HAZ-TSU-WARN-5")
])
]);
export const GEO_HAZ_001_CP001_REVIEW_BATCH_V1=finalizeCp(1,GEO_HAZ_001_CP001_QLS);
export function auditGeoHaz001Cp001ReviewBatchV1(){return auditCp(1,GEO_HAZ_001_CP001_QLS,GEO_HAZ_001_CP001_REVIEW_BATCH_V1);}

export const GEO_HAZ_001_CP002_QLS=Object.freeze([
buildQl("TROPICAL-CYCLONE-BASICS","Tropical cyclones and Indian coasts",[
r("What is a tropical cyclone?","An intense low-pressure storm over warm tropical seas","A cold continental high-pressure system","A river flood","A drought","Tropical cyclones develop over warm oceans around strong low pressure.","HAZ-CYC-1"),
r("Which condition favours tropical cyclone formation?","Warm ocean water","Cold desert surface","Permanent snow","Dry continental air only","Warm seas provide the heat and moisture that fuel tropical cyclones.","HAZ-CYC-2"),
r("Which Indian coastline is highly exposed to Bay of Bengal cyclones?","East coast","Only the Himalayan belt","Only the western desert","Only central plateau","Many severe cyclones affect the Bay of Bengal and India's east coast.","HAZ-CYC-3"),
r("Consider the statements: I. Cyclones bring strong winds. II. They can also cause storm surge and heavy rain. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Cyclone impacts include wind, coastal surge and flooding rain.","HAZ-CYC-4"),
r("A powerful low-pressure storm approaches Odisha from the Bay of Bengal. Which hazard is it?","Tropical cyclone","Earthquake","Avalanche","Drought","Odisha is frequently exposed to Bay of Bengal tropical cyclones.","HAZ-CYC-5")
]),
buildQl("STORM-SURGE","Storm surge and coastal flooding",[
r("What is storm surge?","Abnormal rise of sea level driven by a storm","Normal astronomical tide only","River groundwater recharge","Mountain snowmelt","Cyclone winds and low pressure can push sea water onto the coast.","HAZ-SURGE-1"),
r("Which areas are most vulnerable to storm surge?","Low-lying coastal areas","High mountain plateaus","Interior deserts only","Deep inland valleys only","Low coastal terrain can be inundated by elevated sea levels.","HAZ-SURGE-2"),
r("Why can storm surge be especially dangerous near river deltas?","Flat low-lying land allows water to spread far inland","Deltas are always high mountains","Deltas have no population","Storm surges cannot enter estuaries","Low relief and estuaries can channel surge inland.","HAZ-SURGE-3"),
r("Consider the statements: I. Storm surge is a coastal hazard. II. It can accompany tropical cyclones. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Storm surge is one of the most dangerous coastal cyclone impacts.","HAZ-SURGE-4"),
r("A cyclone drives sea water several kilometres inland across a delta. What caused the coastal flooding?","Storm surge","Drought","Earthquake focus","Cold wave","Cyclonic winds and low pressure created a surge above normal sea level.","HAZ-SURGE-5")
]),
buildQl("FLOOD-BASICS","Flood causes and floodplains",[
r("What is a flood?","Overflow of water onto normally dry land","Long period of deficient rainfall","Sudden ground shaking","Extreme cold only","Flooding occurs when water exceeds channel or drainage capacity.","HAZ-FLOOD-1"),
r("Which condition can cause river flooding?","Very heavy rainfall in a catchment","Prolonged lack of rain","Low river discharge","Permanent drought","Heavy rainfall can raise river discharge beyond channel capacity.","HAZ-FLOOD-2"),
r("Why are floodplains naturally prone to flooding?","They are low-lying areas beside rivers","They are high mountain ridges","They have no rivers","They are all deserts","Floodplains are built by river overflow and remain exposed to future floods.","HAZ-FLOOD-3"),
r("Consider the statements: I. Floods can be natural river processes. II. Encroachment on drainage channels can worsen urban flooding. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Flood risk reflects both natural flows and human alteration of drainage.","HAZ-FLOOD-4"),
r("A river exceeds its banks after prolonged monsoon rain. Which hazard is occurring?","River flood","Drought","Avalanche","Heat wave","High discharge has exceeded the river channel capacity.","HAZ-FLOOD-5")
]),
buildQl("DROUGHT-BASICS","Drought and rainfall deficiency",[
r("What is meteorological drought?","Prolonged significant deficiency of rainfall","Excessive rainfall","Earthquake shaking","High sea waves","Meteorological drought begins with rainfall well below normal.","HAZ-DROUGHT-1"),
r("Which sector is especially vulnerable to drought in rain-fed regions?","Agriculture","Deep-sea shipping only","Air traffic only","Rail signalling only","Crops depending on rainfall can fail when moisture is insufficient.","HAZ-DROUGHT-2"),
r("Which condition can worsen agricultural drought?","Low soil moisture","Excess groundwater recharge","Continuous flooding","Permanent snow in fields","Agricultural drought reflects inadequate moisture for crops.","HAZ-DROUGHT-3"),
r("Consider the statements: I. Drought develops over time. II. Water conservation can reduce vulnerability. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Unlike sudden hazards, drought builds gradually and can be mitigated through better water management.","HAZ-DROUGHT-4"),
r("A rain-fed district receives far below normal monsoon rainfall and crops fail. Which hazard is most likely?","Drought","Storm surge","Tsunami","Avalanche","Prolonged rainfall shortage can produce agricultural drought.","HAZ-DROUGHT-5")
]),
buildQl("CYCLONE-FLOOD-DROUGHT-MITIGATION","Mitigation for hydro-meteorological hazards",[
r("Which measure reduces cyclone deaths most directly?","Early warning and evacuation","Ignoring warnings","Building only on exposed beaches","Removing shelters","Timely warnings and evacuation move people away from life-threatening conditions.","HAZ-HYDRO-MIT-1"),
r("Which measure helps reduce flood damage?","Keeping natural drainage and floodways clear","Blocking every drain","Building in active river channels","Removing wetlands","Maintaining drainage and floodplain space reduces exposure and waterlogging.","HAZ-HYDRO-MIT-2"),
r("Which measure improves drought resilience?","Water conservation and drought-resistant farming","Greater water wastage","Removal of storage","Continuous groundwater over-pumping","Efficient water use and adapted crops reduce drought impacts.","HAZ-HYDRO-MIT-3"),
r("Consider the statements: I. Cyclone shelters reduce loss of life. II. Floodplain zoning can reduce exposure. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Structural and land-use measures both reduce hazard risk.","HAZ-HYDRO-MIT-4"),
r("A coastal district issues warnings, opens shelters and evacuates low-lying villages. Which hazard is it preparing for?","Cyclone and storm surge","Drought only","Earthquake focus only","Cold wave only","Evacuation from low coastal areas is a key cyclone-surge preparedness measure.","HAZ-HYDRO-MIT-5")
])
]);
export const GEO_HAZ_001_CP002_REVIEW_BATCH_V1=finalizeCp(2,GEO_HAZ_001_CP002_QLS);
export function auditGeoHaz001Cp002ReviewBatchV1(){return auditCp(2,GEO_HAZ_001_CP002_QLS,GEO_HAZ_001_CP002_REVIEW_BATCH_V1);}
