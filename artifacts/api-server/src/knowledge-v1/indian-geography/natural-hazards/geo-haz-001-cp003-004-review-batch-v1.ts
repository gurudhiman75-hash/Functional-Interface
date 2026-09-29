import { buildQl, finalizeCp, auditCp } from "./geo-haz-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_HAZ_001_CP003_QLS=Object.freeze([
buildQl("LANDSLIDES","Landslides and slope instability",[
r("What is a landslide?","Downslope movement of rock, soil or debris","Sea-level rise","A drought","An air-pressure system","Landslides occur when slope materials move under gravity.","HAZ-LS-1"),
r("Which condition can trigger landslides?","Intense rainfall","Stable dry bedrock only","No slope","Low gravity","Heavy rain can saturate and destabilise slopes.","HAZ-LS-2"),
r("Which Indian region is highly vulnerable to landslides?","Himalayan mountain belt","Flat desert plains only","Open ocean","Central alluvial plain everywhere equally","Steep relief, active tectonics and heavy rain make Himalayan slopes highly vulnerable.","HAZ-LS-3"),
r("Consider the statements: I. Road cutting can destabilise slopes. II. Deforestation can increase landslide risk. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Human alteration of slopes can increase instability.","HAZ-LS-4"),
r("A steep Himalayan slope fails after days of heavy monsoon rain. Which hazard occurred?","Landslide","Drought","Storm surge","Tsunami","Rainfall-triggered slope failure is a landslide.","HAZ-LS-5")
]),
buildQl("AVALANCHES","Snow avalanches",[
r("What is an avalanche?","Rapid downslope movement of snow and ice","River flooding","Sea wave","Heat wave","Avalanches occur when unstable snow moves rapidly down a slope.","HAZ-AVA-1"),
r("Which region of India is most exposed to snow avalanches?","High Himalaya","Coastal delta","Thar Desert","Ganga plain","Avalanches require steep snow-covered mountain slopes.","HAZ-AVA-2"),
r("Which factor can increase avalanche danger?","Heavy fresh snowfall on steep slopes","Absence of snow","Flat terrain","Warm sea water","Fresh snow can overload unstable mountain snowpacks.","HAZ-AVA-3"),
r("Consider the statements: I. Avalanches are slope hazards. II. They affect high-altitude transport routes and settlements. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Avalanches can block roads and threaten mountain communities.","HAZ-AVA-4"),
r("A mass of snow suddenly rushes down a steep Himalayan slope. What is it?","Avalanche","Cyclone","Drought","Tsunami","Rapid snow movement down a slope is an avalanche.","HAZ-AVA-5")
]),
buildQl("HEAT-WAVES","Heat waves",[
r("What is a heat wave?","Period of unusually high temperature relative to local conditions","A river flood","A snowstorm","An earthquake","Heat waves are episodes of extreme heat with health and infrastructure impacts.","HAZ-HEAT-1"),
r("Which part of India often experiences severe pre-monsoon heat waves?","Northern and central plains","High snowfields only","Deep ocean","Only Andaman seas","Interior northern and central regions commonly experience extreme summer heat.","HAZ-HEAT-2"),
r("Who is especially vulnerable during heat waves?","Elderly people, outdoor workers and people without cooling","Only deep-sea sailors","Only airline pilots","No one","Exposure, age and limited access to cooling raise heat risk.","HAZ-HEAT-3"),
r("Consider the statements: I. Heat waves can cause dehydration. II. Urban heat can intensify exposure. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Extreme heat affects health and can be amplified by urban surfaces.","HAZ-HEAT-4"),
r("A city records several days of extreme temperatures and heat illness. Which hazard is occurring?","Heat wave","Cold wave","Avalanche","Tsunami","Persistent extreme heat defines a heat-wave event.","HAZ-HEAT-5")
]),
buildQl("COLD-WAVES","Cold waves",[
r("What is a cold wave?","Period of unusually low temperature relative to local conditions","A tropical cyclone","River flooding","A heat wave","Cold waves are episodes of severe cold that can affect health and agriculture.","HAZ-COLD-1"),
r("Which region is commonly exposed to winter cold waves?","Northern Indian plains","Equatorial ocean only","Hot desert summer only","Southern tropical seas only","Cold continental air can produce severe winter conditions over northern India.","HAZ-COLD-2"),
r("Which group is especially vulnerable during cold waves?","People without adequate shelter","Only swimmers","Only pilots","No one","Exposure to low temperatures is most dangerous for people lacking shelter or heating.","HAZ-COLD-3"),
r("Consider the statements: I. Cold waves can damage crops. II. They can also increase health risks. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Severe cold affects both agriculture and human health.","HAZ-COLD-4"),
r("A northern district experiences unusually low temperatures for several days in winter. Which hazard is it?","Cold wave","Heat wave","Tsunami","Storm surge","Persistent abnormal cold indicates a cold wave.","HAZ-COLD-5")
]),
buildQl("LIGHTNING","Lightning hazard",[
r("What causes lightning?","Electrical discharge within or between clouds and the ground","River overflow","Plate movement","Sea-level rise","Charge separation in thunderstorms can produce powerful electrical discharges.","HAZ-LIGHT-1"),
r("When is lightning risk especially high?","During thunderstorms","During clear calm weather only","During drought without clouds","During earthquakes only","Thunderstorm clouds create the electrical conditions for lightning.","HAZ-LIGHT-2"),
r("Which action is safer during a lightning storm?","Move inside a substantial building","Stand under an isolated tall tree","Remain in an open field","Hold a metal pole","A substantial building provides safer shelter than exposed locations.","HAZ-LIGHT-3"),
r("Consider the statements: I. Lightning can occur before heavy rain reaches a location. II. Open fields and isolated trees are dangerous places during storms. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Lightning can strike away from the heaviest rain and exposure raises danger.","HAZ-LIGHT-4"),
r("A thunderstorm approaches while workers are in an open field. What is the immediate hazard?","Lightning","Drought","Avalanche","Tsunami","Thunderstorms create direct lightning risk.","HAZ-LIGHT-5")
])
]);
export const GEO_HAZ_001_CP003_REVIEW_BATCH_V1=finalizeCp(3,GEO_HAZ_001_CP003_QLS);
export function auditGeoHaz001Cp003ReviewBatchV1(){return auditCp(3,GEO_HAZ_001_CP003_QLS,GEO_HAZ_001_CP003_REVIEW_BATCH_V1);}

export const GEO_HAZ_001_CP004_QLS=Object.freeze([
buildQl("NDMA-ROLE","NDMA and disaster management",[
r("What does NDMA stand for?","National Disaster Management Authority","National Development Mapping Agency","National Drought Monitoring Authority","National Drainage Management Agency","NDMA is India's national disaster-management authority.","HAZ-NDMA-1"),
r("What is NDMA's central role?","National policy and guidance for disaster management","Railway operations","Highway toll collection","Port dredging","NDMA provides national-level disaster-management direction and guidance.","HAZ-NDMA-2"),
r("Which national platform disseminates official geo-targeted disaster alerts?","SACHET","NHAI FASTag","IRCTC","DigiLocker only","SACHET is NDMA's integrated public disaster-alert platform.","HAZ-NDMA-3"),
r("Consider the statements: I. NDMA deals with multiple hazards. II. SACHET disseminates authorised disaster alerts. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements reflect India's disaster-management system.","HAZ-NDMA-4"),
r("An official multi-hazard alert is pushed to citizens through a national disaster portal. Which authority is linked with it?","NDMA","NHAI","DFCCIL","Census of India","NDMA operates the SACHET alert framework.","HAZ-NDMA-5")
]),
buildQl("IMD-ROLE","IMD and weather hazards",[
r("Which agency is central to cyclone forecasting in India?","India Meteorological Department","NHAI","Census of India","IWAI","IMD monitors weather systems and issues cyclone forecasts and warnings.","HAZ-IMD-1"),
r("Which hazards fall directly within IMD's weather-warning role?","Cyclones, heat waves and heavy rainfall","Earthquake plate motion only","Rail accidents only","Dam construction only","IMD issues warnings for major meteorological hazards.","HAZ-IMD-2"),
r("Why are cyclone track forecasts important?","They guide evacuation and preparedness","They stop cyclones","They eliminate storm surge","They deepen ports","Forecasts indicate likely landfall areas and timing.","HAZ-IMD-3"),
r("Consider the statements: I. IMD monitors tropical cyclones. II. It also issues heat-wave warnings. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are core meteorological warning functions.","HAZ-IMD-4"),
r("A severe Bay of Bengal cyclone is being tracked before landfall. Which agency issues the main meteorological warning?","IMD","CWC only","NHAI","BRO","IMD is India's primary weather and cyclone forecasting agency.","HAZ-IMD-5")
]),
buildQl("CWC-FLOOD-FORECASTING","CWC and flood forecasting",[
r("Which central agency is closely linked with river flood forecasting in India?","Central Water Commission","Airports Authority of India","NHAI","ISRO only","CWC monitors rivers and provides flood forecasts at many locations.","HAZ-CWC-1"),
r("What data are important for flood forecasting?","River level, discharge and rainfall","Railway fares","Airline schedules","Port customs data","Flood forecasting depends on hydrological and rainfall observations.","HAZ-CWC-2"),
r("Why are upstream river gauges useful?","They can provide advance information about downstream flood waves","They stop rainfall","They eliminate rivers","They prevent all erosion","Upstream observations help estimate the timing and size of approaching flows.","HAZ-CWC-3"),
r("Consider the statements: I. CWC has a flood-forecasting role. II. Forecasts can improve evacuation and reservoir decisions. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Forecasts support preparedness and water-management decisions.","HAZ-CWC-4"),
r("A rising river is monitored to warn downstream districts before inundation. Which agency is closely linked with this function?","Central Water Commission","DFCCIL","AAI","NHAI","CWC is a major national flood-forecasting agency.","HAZ-CWC-5")
]),
buildQl("HAZARD-RISK-VULNERABILITY","Hazard, exposure and vulnerability",[
r("What is a hazard?","A potentially damaging event or process","The same thing as population density","Only a disaster after losses occur","A transport route","A hazard is a potentially harmful natural or human-induced event.","HAZ-RISK-1"),
r("What is exposure in disaster risk?","People and assets located in hazard-prone areas","Only earthquake magnitude","Only rainfall amount","Only warning time","Exposure concerns what lies in the path of a hazard.","HAZ-RISK-2"),
r("What is vulnerability?","Susceptibility to damage when exposed to a hazard","The hazard itself","Only population size","Only river discharge","Vulnerability reflects how likely exposed people or systems are to suffer harm.","HAZ-RISK-3"),
r("Consider the statements: I. A strong hazard need not cause a major disaster in an uninhabited area. II. High exposure and vulnerability increase disaster risk. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Disaster risk depends on hazard, exposure and vulnerability together.","HAZ-RISK-4"),
r("Two towns face the same flood, but one has stronger buildings and evacuation plans. Which town is less vulnerable?","The better-prepared town","Both must have identical losses","The less-prepared town","Vulnerability cannot differ","Preparedness and resilient infrastructure reduce vulnerability.","HAZ-RISK-5")
]),
buildQl("EARLY-WARNING-CHAIN","Early warning and last-mile communication",[
r("What is the purpose of an early-warning system?","Provide timely information so people can act before impact","Stop all hazards physically","Replace evacuation","Eliminate weather","Warnings reduce loss by enabling protective action.","HAZ-WARN-1"),
r("What does last-mile warning mean?","Warning reaches the people actually at risk","Warning stays only at national headquarters","Only scientists receive it","No local communication occurs","A warning is useful only if exposed communities receive and understand it.","HAZ-WARN-2"),
r("Which combination makes an early-warning system effective?","Monitoring, forecasting, communication and response capacity","Forecasting with no communication","Alerts with no response plan","No monitoring","All parts of the warning chain must function together.","HAZ-WARN-3"),
r("Consider the statements: I. Accurate forecasts alone are insufficient. II. Communities must know how to respond. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Preparedness converts warning information into protective action.","HAZ-WARN-4"),
r("A cyclone warning is accurate but never reaches coastal villages. What failed?","Last-mile communication","Cyclone formation","Ocean temperature","River discharge","The warning chain failed at dissemination to people at risk.","HAZ-WARN-5")
])
]);
export const GEO_HAZ_001_CP004_REVIEW_BATCH_V1=finalizeCp(4,GEO_HAZ_001_CP004_QLS);
export function auditGeoHaz001Cp004ReviewBatchV1(){return auditCp(4,GEO_HAZ_001_CP004_QLS,GEO_HAZ_001_CP004_REVIEW_BATCH_V1);}
