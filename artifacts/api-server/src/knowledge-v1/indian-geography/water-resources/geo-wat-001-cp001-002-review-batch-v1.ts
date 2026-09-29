import { buildQl, finalizeCp, auditCp } from "./geo-wat-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_WAT_001_CP001_QLS=Object.freeze([
buildQl("WATER-AVAILABILITY","Water availability in India",[
r("Why does water availability vary greatly across India?","Rainfall, relief and river systems differ by region","Every region gets equal rainfall","All rivers are perennial","Groundwater is uniform everywhere","India's water availability is uneven because climate, drainage and terrain vary strongly.","WAT-AVAIL-1"),
r("Which region generally has more reliable surface-water availability?","Areas with high rainfall and perennial rivers","Arid desert interiors","High cold deserts only","Areas without drainage","High rainfall and perennial drainage improve surface-water availability.","WAT-AVAIL-2"),
r("Which factor can make water availability seasonal?","Monsoon-dependent rainfall","Uniform year-round rain","Permanent glaciers in every region","Equal reservoir storage everywhere","Large parts of India receive most rainfall during the monsoon season.","WAT-AVAIL-3"),
r("Consider the statements: I. Water availability is uneven in India. II. Monsoon seasonality affects supply. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both regional unevenness and seasonality are central features of India's water geography.","WAT-AVAIL-4"),
r("A district receives little rainfall and has no perennial river. What problem is most likely?","Water scarcity","Excess water throughout the year","Permanent flooding everywhere","No need for groundwater","Low rainfall and weak perennial drainage can create water scarcity.","WAT-AVAIL-5")
]),
buildQl("WATER-SCARCITY","Water scarcity and stress",[
r("What does water scarcity mean?","Available water is insufficient for demand","Rainfall is always excessive","Every river floods","Groundwater is unlimited","Scarcity occurs when usable supply cannot meet human and ecological needs.","WAT-SCARCITY-1"),
r("Which human factor can intensify water scarcity?","Rapid growth of demand","Lower water use","Improved conservation","Reduced leakage","Rising domestic, industrial and agricultural demand can increase pressure on limited supplies.","WAT-SCARCITY-2"),
r("Which activity consumes a large share of freshwater in India?","Irrigation","Aviation","Railway signalling","Satellite communication","Agriculture is a major freshwater user because irrigation supports crop production.","WAT-SCARCITY-3"),
r("Consider the statements: I. Over-extraction can lower groundwater levels. II. Pollution can reduce usable water supply. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Scarcity depends on both quantity and quality of water.","WAT-SCARCITY-4"),
r("A city has adequate rainfall but polluted rivers and falling groundwater. What does this show?","Water stress can result from misuse and pollution","Rainfall alone guarantees water security","Pollution increases usable supply","Groundwater cannot decline","Poor management can create scarcity even where rainfall is not extremely low.","WAT-SCARCITY-5")
]),
buildQl("WATER-CONSERVATION","Water conservation principles",[
r("What is the main aim of water conservation?","Use water efficiently and protect supplies for future use","Increase wastage","Pollute rivers","Eliminate recharge","Conservation reduces waste and protects surface and groundwater resources.","WAT-CONS-1"),
r("Which practice directly helps conserve water in agriculture?","Efficient irrigation","Flooding fields unnecessarily","Leaving canals unlined everywhere","Over-pumping groundwater","Efficient irrigation reduces losses and unnecessary withdrawals.","WAT-CONS-2"),
r("Why is groundwater recharge important?","It replenishes aquifers","It drains aquifers faster","It prevents infiltration","It removes soil moisture","Recharge helps restore groundwater that is withdrawn through wells and tube wells.","WAT-CONS-3"),
r("Consider the statements: I. Conservation includes reducing losses. II. It also includes protecting water quality. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Water security depends on both efficient use and clean usable supplies.","WAT-CONS-4"),
r("Which approach is most sustainable in a water-stressed area?","Demand management plus recharge","Unlimited pumping","Ignoring leakage","Replacing recharge areas with concrete","Combining efficient use with recharge improves long-term water security.","WAT-CONS-5")
]),
buildQl("MULTIPURPOSE-PROJECT-CONCEPT","Multipurpose river-valley projects",[
r("Why are some large river projects called multipurpose projects?","They serve several functions such as irrigation, power and flood control","They serve only tourism","They only deepen rivers","They only build roads","Large river-valley projects often combine multiple water-management objectives.","WAT-MULTI-1"),
r("Which is a common benefit of multipurpose dams?","Hydroelectric power generation","Only sea navigation","Only railway transport","Only mining","Stored water can be released through turbines to generate hydroelectricity.","WAT-MULTI-2"),
r("Which function of dams directly supports agriculture?","Irrigation","Air transport","Satellite communication","Railway electrification","Reservoir water can be distributed to farms through canals.","WAT-MULTI-3"),
r("Consider the statements: I. Dams can help regulate floods. II. They can store water for dry periods. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Storage allows river flows to be regulated across seasons.","WAT-MULTI-4"),
r("A reservoir supplies canals, generates power and moderates floods. What type of project is it?","Multipurpose river-valley project","Single-use road project","Airport project","Mining project","Serving several water functions makes it multipurpose.","WAT-MULTI-5")
]),
buildQl("DAMS-TRADEOFFS","Benefits and costs of large dams",[
r("Which social issue can arise from construction of a large reservoir?","Displacement of settlements","Automatic creation of new farmland everywhere","No land submergence","No change in local livelihoods","Reservoirs can submerge villages and require resettlement.","WAT-DAM-TRADE-1"),
r("Which environmental change can a large dam cause?","Submergence of forests and habitats","Permanent increase in biodiversity everywhere","No river alteration","No sediment change","Reservoir creation can inundate ecosystems and alter river processes.","WAT-DAM-TRADE-2"),
r("Why can sedimentation reduce reservoir usefulness?","It reduces storage capacity","It increases storage endlessly","It creates new turbines","It prevents all evaporation","Sediment accumulating behind dams gradually occupies reservoir space.","WAT-DAM-TRADE-3"),
r("Consider the statements: I. Large dams can provide benefits. II. They can also create ecological and social costs. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Large projects require balancing multiple benefits against displacement and environmental impacts.","WAT-DAM-TRADE-4"),
r("Which statement gives the most balanced view of multipurpose projects?","They provide major benefits but can involve serious trade-offs","They have only benefits","They have only costs","They never alter rivers","River projects need case-specific evaluation of benefits and impacts.","WAT-DAM-TRADE-5")
])
]);
export const GEO_WAT_001_CP001_REVIEW_BATCH_V1=finalizeCp(1,GEO_WAT_001_CP001_QLS);
export function auditGeoWat001Cp001ReviewBatchV1(){return auditCp(1,GEO_WAT_001_CP001_QLS,GEO_WAT_001_CP001_REVIEW_BATCH_V1);}

export const GEO_WAT_001_CP002_QLS=Object.freeze([
buildQl("WELL-TUBEWELL-IRRIGATION","Wells and tube wells",[
r("What is the main source of water for well irrigation?","Groundwater","Sea water","Glacier ice only","Air moisture","Wells tap water stored below the ground.","WAT-WELL-1"),
r("How does a tube well differ from a shallow dug well?","It can tap deeper groundwater layers","It uses no groundwater","It works only in deserts","It is a canal","Tube wells use bored pipes to access deeper aquifers.","WAT-WELL-2"),
r("Which physical condition favours well irrigation?","Accessible groundwater","Impermeable rock at the surface everywhere","No recharge","Permanent frozen ground","Well irrigation is practical where groundwater is available at usable depths.","WAT-WELL-3"),
r("Consider the statements: I. Tube wells use groundwater. II. Excess pumping can lower the water table. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Groundwater irrigation is useful but can become unsustainable when withdrawals exceed recharge.","WAT-WELL-4"),
r("An agricultural area depends on pumped water from deep boreholes. Which irrigation source is being used?","Tube wells","Canal irrigation only","Tank irrigation only","River navigation","Deep boreholes indicate tube-well irrigation.","WAT-WELL-5")
]),
buildQl("CANAL-IRRIGATION","Canal irrigation",[
r("Where does canal irrigation usually obtain water?","Rivers or reservoirs","Only groundwater wells","Only rainfall on fields","Sea water","Canals divert or distribute stored river water to agricultural areas.","WAT-CANAL-1"),
r("Which region is especially suited to extensive canal networks?","Level plains","Very steep mountains","Permanent ice sheets","Deep ocean floors","Gentle slopes make gravity-fed canal distribution easier.","WAT-CANAL-2"),
r("What is a major advantage of canal irrigation?","It can distribute water over large agricultural areas","It requires no source of water","It cannot serve farms","It works only in cities","Main canals and distributaries can supply large command areas.","WAT-CANAL-3"),
r("Consider the statements: I. Canals can receive water from reservoirs. II. Their distribution is easier on level terrain. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Reservoir supply and gentle terrain favour canal irrigation.","WAT-CANAL-4"),
r("A reservoir feeds a main canal that branches into distributaries serving farms. Which system is this?","Canal irrigation","Tank irrigation","Drip irrigation only","Air irrigation","The branching network is characteristic of canal irrigation.","WAT-CANAL-5")
]),
buildQl("TANK-IRRIGATION","Tank irrigation",[
r("What is a tank in traditional irrigation geography?","A small reservoir storing local runoff","A deep-sea harbour","A railway terminal","A tube well","Tanks collect and store runoff for local use.","WAT-TANK-1"),
r("In which broad region has tank irrigation historically been important?","Peninsular India","High Himalaya only","Ganga delta only","Arctic region","Undulating hard-rock terrain of peninsular India favours many local tanks.","WAT-TANK-2"),
r("Why are tanks useful in areas with seasonal rainfall?","They store runoff for later use","They create rainfall","They eliminate evaporation","They require perennial rivers","Storage helps bridge dry periods after seasonal rains.","WAT-TANK-3"),
r("Consider the statements: I. Tanks store local runoff. II. They are often smaller than major multipurpose reservoirs. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Tank irrigation is generally local in scale.","WAT-TANK-4"),
r("A village stores monsoon runoff in a local embankment reservoir for crops. Which method is this?","Tank irrigation","Deep-sea irrigation","Pipeline freight","Rail irrigation","Local runoff storage identifies tank irrigation.","WAT-TANK-5")
]),
buildQl("DRIP-SPRINKLER","Drip and sprinkler irrigation",[
r("Which irrigation method delivers water directly near plant roots in small quantities?","Drip irrigation","Flood irrigation","Canal navigation","Tank storage only","Drip systems minimise losses by applying water close to roots.","WAT-MICRO-1"),
r("Which irrigation method sprays water over crops through nozzles?","Sprinkler irrigation","Drip irrigation","Tube-well drilling","Reservoir storage","Sprinklers distribute water through pressurised spray.","WAT-MICRO-2"),
r("Which method is especially useful for saving water in orchards and row crops?","Drip irrigation","Uncontrolled flooding","Open-channel leakage","Over-irrigation","Drip irrigation reduces evaporation and conveyance losses.","WAT-MICRO-3"),
r("Consider the statements: I. Drip irrigation can improve water-use efficiency. II. Sprinklers can irrigate uneven terrain. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are efficient alternatives to uncontrolled surface irrigation.","WAT-MICRO-4"),
r("A farmer in a dry area uses pipes with emitters beside each plant. Which method is this?","Drip irrigation","Tank irrigation","Canal irrigation","River lift only","Emitters beside plants are characteristic of drip systems.","WAT-MICRO-5")
]),
buildQl("GROUNDWATER-DEPLETION","Groundwater depletion and recharge",[
r("What happens when groundwater withdrawal consistently exceeds recharge?","Water table declines","Aquifer storage always rises","Wells become shallower automatically","Rivers become glaciers","Overdraft lowers groundwater levels.","WAT-GW-1"),
r("Which activity can accelerate groundwater depletion?","Intensive tube-well pumping","Rainwater harvesting","Recharge structures","Reduced pumping","Heavy pumping can exceed natural replenishment.","WAT-GW-2"),
r("Which measure helps recharge groundwater?","Percolation structures and rainwater harvesting","Paving all open land","Draining recharge zones","Continuous over-pumping","Allowing rainwater to infiltrate helps replenish aquifers.","WAT-GW-3"),
r("Consider the statements: I. Falling water tables can make wells deeper and costlier. II. Recharge can improve groundwater sustainability. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Groundwater management must balance withdrawals and recharge.","WAT-GW-4"),
r("A farming region needs progressively deeper pumps every few years. What problem is most likely?","Groundwater depletion","Reservoir sedimentation only","Sea-level rise","Urban agglomeration","Increasing pumping depth is a common sign of a falling water table.","WAT-GW-5")
])
]);
export const GEO_WAT_001_CP002_REVIEW_BATCH_V1=finalizeCp(2,GEO_WAT_001_CP002_QLS);
export function auditGeoWat001Cp002ReviewBatchV1(){return auditCp(2,GEO_WAT_001_CP002_QLS,GEO_WAT_001_CP002_REVIEW_BATCH_V1);}
