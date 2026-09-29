import { buildQl, finalizeCp, auditCp } from "./geo-lnd-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});

export const GEO_LND_001_CP001_QLS=Object.freeze([
buildQl("LAND-RESOURCE-CONCEPT","Land as a resource",[
r("Why is land considered an important natural resource?","It supports agriculture, settlements, industry and infrastructure","It is used only for forests","It has no economic role","It is unlimited and uniform","Land provides the physical base for most human activities.","LND-RES-1"),
r("Which factor strongly influences how land is used?","Relief, soil, climate and human demand","Only longitude","Only river names","Only population sex ratio","Land use reflects both physical conditions and human needs.","LND-RES-2"),
r("Consider the statements: I. Land is finite. II. Different uses compete for the same land. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Limited land must support agriculture, forests, settlements, transport and industry.","LND-RES-3"),
r("Which pair correctly identifies a land resource function?","Agricultural land — crop production","Built-up land — river discharge","Forest land — railway gauge","Fallow land — sea transport","Land categories reflect different uses and functions.","LND-RES-4"),
r("A region faces rising demand for farms, housing and roads on the same finite area. What issue does this illustrate?","Competing land uses","Unlimited land supply","No land-use pressure","Only climate change","Finite land must be allocated among competing uses.","LND-RES-5")
]),
buildQl("LAND-USE-CATEGORIES","Major land-use categories",[
r("Which category includes land currently under crops?","Net sown area","Current fallow","Barren land","Forest only","Net sown area is land actually cultivated with crops in a given year.","LND-USE-1"),
r("What is current fallow land?","Land left uncultivated for a short period","Land permanently under forests","Land permanently barren","Urban built-up land","Current fallow is temporarily left uncultivated and may return to cultivation.","LND-USE-2"),
r("Which category includes land under forests?","Forest area","Net sown area","Current fallow","Culturable wasteland only","Forest land is recorded separately from cultivated and fallow categories.","LND-USE-3"),
r("Consider the statements: I. Net sown area is cultivated land. II. Fallow land is temporarily not cultivated. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","The categories distinguish active cultivation from temporary non-cultivation.","LND-USE-4"),
r("A field was cultivated last year but is deliberately left uncultivated this year. Which category fits best?","Current fallow","Permanent pasture","Forest","Barren land","Temporary non-cultivation places it in current fallow.","LND-USE-5")
]),
buildQl("NET-SOWN-AREA","Net sown area and cropping use",[
r("What does net sown area measure?","Area sown with crops at least once in a year","Total forest area","Area under towns only","Area irrigated twice only","Net sown area counts land actually cultivated at least once during the year.","LND-NSA-1"),
r("If the same field is cropped twice in one year, how is it counted in net sown area?","Once","Twice","Three times","Not counted","Net sown area counts the physical area, not the number of crop cycles.","LND-NSA-2"),
r("Which concept differs from net sown area by counting repeated cropping?","Gross cropped area","Forest area","Permanent pasture","Barren land","Gross cropped area counts each crop cycle, so multiple cropping increases it.","LND-NSA-3"),
r("Consider the statements: I. Net sown area counts physical cultivated area. II. Multiple cropping can make gross cropped area larger than net sown area. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Repeated cropping raises gross cropped area without changing the land's physical area.","LND-NSA-4"),
r("A 10-hectare farm is cropped twice in the same year. What remains 10 hectares?","Net sown area","Gross cropped area","Total cropped area counted by seasons","Number of crop harvests","The physical cultivated area remains 10 hectares.","LND-NSA-5")
]),
buildQl("FALLOW-LAND","Fallow land and agricultural rotation",[
r("Why might farmers leave land fallow?","To restore soil moisture or fertility or because of temporary constraints","To turn it permanently into sea","To increase road density","To create a port","Fallow periods can be deliberate or caused by temporary economic or climatic conditions.","LND-FALLOW-1"),
r("What distinguishes current fallow from permanent barren land?","Current fallow can return to cultivation","Barren land is always cropped","Both are identical","Current fallow is forest land","Fallow is temporarily uncultivated; barren land is not normally suitable for cropping.","LND-FALLOW-2"),
r("Consider the statements: I. Fallow land can re-enter cultivation. II. Its extent may vary from year to year. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Fallow is a flexible land-use category influenced by annual conditions.","LND-FALLOW-3"),
r("Which pair correctly matches land-use category and meaning?","Current fallow — temporarily uncultivated agricultural land","Forest — current fallow","Barren land — cropped twice","Built-up land — pasture only","Current fallow remains part of potentially cultivated land.","LND-FALLOW-4"),
r("A farmer skips cultivation for one season because of low rainfall. Which category is most likely?","Current fallow","Permanent pasture","Forest","Urban land","Temporary non-cultivation due to drought fits current fallow.","LND-FALLOW-5")
]),
buildQl("LAND-USE-CHANGE","Land-use change",[
r("What is land-use change?","Conversion of land from one use to another","Change in river name","Change in latitude","Change in rainfall only","Land use changes when forests, farms, pastures or open land are converted to other uses.","LND-CHANGE-1"),
r("Which process can reduce agricultural land near cities?","Urban expansion","Lower population density","Forest regeneration only","River recharge","Urban growth can convert farmland into housing, roads and industry.","LND-CHANGE-2"),
r("Which process can increase cultivated area?","Bringing suitable wasteland under cultivation","Urban sprawl","Mining expansion only","Reservoir submergence","Reclamation and irrigation can expand cultivation where conditions allow.","LND-CHANGE-3"),
r("Consider the statements: I. Population growth can alter land use. II. Infrastructure development can also alter land use. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Human demand is a major driver of land-use change.","LND-CHANGE-4"),
r("Farmland on a city fringe is converted into housing colonies. What process is this?","Land-use change","Natural increase","River capture","Soil formation","The land has shifted from agricultural to built-up use.","LND-CHANGE-5")
])
]);
export const GEO_LND_001_CP001_REVIEW_BATCH_V1=finalizeCp(1,GEO_LND_001_CP001_QLS);
export function auditGeoLnd001Cp001ReviewBatchV1(){return auditCp(1,GEO_LND_001_CP001_QLS,GEO_LND_001_CP001_REVIEW_BATCH_V1);}

export const GEO_LND_001_CP002_QLS=Object.freeze([
buildQl("LAND-DEGRADATION","Land degradation concept",[
r("What is land degradation?","Decline in the productive quality of land","Increase in soil fertility everywhere","Only urban growth","Only rainfall change","Degradation reduces the land's capacity to support agriculture, vegetation or other uses.","LND-DEG-1"),
r("Which activity can cause land degradation?","Deforestation","Afforestation","Controlled grazing","Soil conservation","Removing vegetation can expose soil to erosion and reduce land quality.","LND-DEG-2"),
r("Which process often accompanies land degradation in dry regions?","Desertification","Glaciation","Sea-floor spreading","Urban agglomeration only","Dryland degradation can lead to desert-like conditions.","LND-DEG-3"),
r("Consider the statements: I. Land degradation can be caused by human activity. II. Natural processes can also contribute. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both misuse and natural erosion or aridity can degrade land.","LND-DEG-4"),
r("A grazing area loses vegetation and its soil becomes exposed and unproductive. What is occurring?","Land degradation","Urbanisation","Population growth","Irrigation expansion","Loss of vegetation and productivity indicates land degradation.","LND-DEG-5")
]),
buildQl("SOIL-EROSION-LINK","Land degradation and soil erosion",[
r("How does soil erosion degrade land?","It removes fertile topsoil","It adds humus","It increases soil depth","It always improves moisture","Topsoil contains much of the soil's nutrients and organic matter.","LND-EROSION-1"),
r("Which factor can accelerate water erosion on slopes?","Removal of vegetation","Contour farming","Terracing","Grass cover","Bare slopes allow runoff to remove soil more rapidly.","LND-EROSION-2"),
r("Which process is common in dry sandy regions?","Wind erosion","Glacial deposition only","Tidal erosion only","River meandering only","Strong winds can remove loose dry soil where vegetation is sparse.","LND-EROSION-3"),
r("Consider the statements: I. Erosion can reduce soil fertility. II. Vegetation cover helps protect soil. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Vegetation slows runoff and wind, reducing soil loss.","LND-EROSION-4"),
r("A bare field loses its fertile upper layer during heavy rain. Which process caused the degradation?","Soil erosion","Groundwater recharge","Afforestation","Urban planning","Runoff has removed the topsoil.","LND-EROSION-5")
]),
buildQl("OVERGRAZING-MINING","Overgrazing and mining impacts",[
r("How can overgrazing degrade land?","It removes protective vegetation faster than it can recover","It always increases forest cover","It reduces erosion","It increases humus automatically","Excess grazing exposes soil and weakens plant regeneration.","LND-OVERGRAZE-1"),
r("How can mining degrade land?","Excavation and waste dumps disturb soil and vegetation","It always improves soil structure","It creates forests automatically","It reduces all erosion","Mining can leave pits, spoil heaps and contaminated surfaces.","LND-MINING-1"),
r("Consider the statements: I. Overgrazing can expose soil. II. Mining can leave wastelands if poorly restored. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both activities can strongly degrade land when unmanaged.","LND-OM-STATEMENT"),
r("Which pair correctly matches activity and land impact?","Mining — surface disturbance","Afforestation — vegetation removal","Contour ploughing — gully formation","Check dams — wind erosion","Mining directly alters the land surface.","LND-OM-MATCH"),
r("A dry grazing tract is stripped of vegetation by excessive livestock pressure. What is the main cause of degradation?","Overgrazing","Afforestation","Terracing","Rainwater harvesting","Too much grazing prevents vegetation recovery.","LND-OVERGRAZE-CLUE")
]),
buildQl("IRRIGATION-SALINITY-WATERLOGGING","Irrigation-related land degradation",[
r("How can excessive irrigation cause waterlogging?","Water table rises close to the surface","Groundwater disappears instantly","Soil dries completely","Rainfall stops","Poor drainage and excessive water can saturate the root zone.","LND-WATERLOG-1"),
r("How can salinity develop in irrigated dry regions?","Evaporation leaves dissolved salts in the soil","Rain removes all salts permanently","Plants create sea water","Soil has no minerals","High evaporation can concentrate salts when drainage is weak.","LND-SALINITY-1"),
r("Consider the statements: I. Waterlogging can damage crops. II. Salinity can reduce soil productivity. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are major irrigation-related land problems.","LND-IRR-STATEMENT"),
r("Which measure helps prevent irrigation salinity?","Adequate drainage","Unlimited flooding","Blocking all drains","Over-irrigation","Drainage removes excess water and salts from the root zone.","LND-IRR-MATCH"),
r("An irrigated field develops a white salt crust and poor crop growth. What problem is most likely?","Soil salinity","Afforestation","River deposition","Urbanisation","Salt accumulation on the surface is a classic sign of salinisation.","LND-SALINITY-CLUE")
]),
buildQl("LAND-CONSERVATION","Land conservation measures",[
r("Which practice reduces erosion on slopes?","Terracing","Removing all vegetation","Ploughing straight down steep slopes","Overgrazing","Terraces shorten slope length and slow runoff.","LND-CONS-1"),
r("Which practice helps reduce wind erosion?","Shelterbelts","Bare fallow everywhere","Deforestation","Sand removal only","Rows of trees reduce wind speed near the ground.","LND-CONS-2"),
r("Which practice helps restore degraded land?","Afforestation","Open-cast dumping without reclamation","Overgrazing","Burning vegetation repeatedly","Tree and grass cover stabilise soil and rebuild ecological function.","LND-CONS-3"),
r("Consider the statements: I. Contour ploughing slows runoff. II. Afforestation helps stabilise soil. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are widely used soil and land conservation measures.","LND-CONS-4"),
r("A farmer cultivates across the slope rather than directly downhill. Which conservation method is this?","Contour ploughing","Strip mining","Over-irrigation","Urban zoning","Following contour lines slows runoff and soil loss.","LND-CONS-5")
])
]);
export const GEO_LND_001_CP002_REVIEW_BATCH_V1=finalizeCp(2,GEO_LND_001_CP002_QLS);
export function auditGeoLnd001Cp002ReviewBatchV1(){return auditCp(2,GEO_LND_001_CP002_QLS,GEO_LND_001_CP002_REVIEW_BATCH_V1);}

export const GEO_LND_001_CP003_QLS=Object.freeze([
buildQl("DESERTIFICATION","Desertification",[
r("What is desertification?","Land degradation in dry areas leading to desert-like conditions","Expansion of ocean water","Urban growth only","Formation of glaciers","Desertification reduces vegetation and productivity in arid and semi-arid lands.","LND-DESERT-1"),
r("Which human activity can promote desertification?","Overgrazing","Afforestation","Controlled irrigation","Watershed treatment","Vegetation loss exposes dryland soils to wind and water erosion.","LND-DESERT-2"),
r("Which climatic condition increases desertification risk?","Prolonged drought","High year-round humidity","Permanent snow","Frequent flooding only","Dry conditions weaken vegetation and increase soil exposure.","LND-DESERT-3"),
r("Consider the statements: I. Desertification can occur outside existing deserts. II. It is a form of land degradation. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Dryland degradation can expand desert-like conditions into semi-arid areas.","LND-DESERT-4"),
r("A semi-arid grazing region loses vegetation, soil and productivity over time. What process may be occurring?","Desertification","Glaciation","Urban agglomeration","River rejuvenation","Progressive dryland degradation is desertification.","LND-DESERT-5")
]),
buildQl("WASTELAND","Wasteland and reclamation",[
r("What is wasteland?","Land currently degraded or underused with low productive value","All fertile cropland","All forest land","All urban land","Wasteland refers to land with limited current productivity, often because of degradation or difficult conditions.","LND-WASTE-1"),
r("Which measure can help reclaim ravine land?","Gully control and vegetation","More uncontrolled runoff","Removing all plants","Deepening gullies","Stabilising gullies and restoring vegetation can reduce erosion.","LND-WASTE-2"),
r("Which measure can help reclaim saline land?","Drainage and suitable soil-water management","Adding more salt","Blocking drains","Over-irrigating continuously","Improved drainage and management can reduce salt accumulation.","LND-WASTE-3"),
r("Consider the statements: I. Some wastelands can be reclaimed. II. Reclamation method depends on the cause of degradation. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Different problems require different restoration approaches.","LND-WASTE-4"),
r("A degraded gully tract is treated with check dams and grasses. What is the objective?","Land reclamation","Urban expansion","Mining intensification","Forest clearing","The measures aim to restore productive land and reduce erosion.","LND-WASTE-5")
]),
buildQl("COMMON-PROPERTY-RESOURCES","Common property land resources",[
r("What are common property resources?","Resources used collectively by a community","Only privately owned factories","Only central government offices","Only individual houses","Village grazing land, ponds and community forests can be shared resources.","LND-CPR-1"),
r("Which is an example of a common property resource?","Village grazing land","Private house plot","Individual factory site","Personal vehicle","Community grazing areas are used by multiple households.","LND-CPR-2"),
r("Why are common property resources important in rural areas?","They support grazing, fuel, water and livelihoods","They have no livelihood role","They are always unused","They only support airports","Shared resources often support poorer households and livestock.","LND-CPR-3"),
r("Consider the statements: I. Overuse can degrade common land. II. Community management can improve sustainability. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Collective rules can help prevent open-access degradation.","LND-CPR-4"),
r("A village jointly manages pasture used by many households. What type of resource is this?","Common property resource","Private industrial land","Urban built-up land","Net sown area only","Shared community use defines a common property resource.","LND-CPR-5")
]),
buildQl("SUSTAINABLE-LAND-MANAGEMENT","Sustainable land management",[
r("What is sustainable land management?","Using land while maintaining long-term productivity and ecological function","Maximising short-term extraction regardless of damage","Removing all vegetation","Ignoring soil loss","Sustainable management balances use with conservation.","LND-SLM-1"),
r("Which approach supports sustainable farming land?","Crop rotation and soil conservation","Continuous erosion","Overgrazing","Uncontrolled salinity","Maintaining soil structure and fertility supports long-term productivity.","LND-SLM-2"),
r("Why is land capability important in planning?","Land should be used according to its physical suitability","Every land type is equally suitable for every use","Steep slopes are ideal for all construction","Wetlands should always be converted","Matching use to capability reduces degradation.","LND-SLM-3"),
r("Consider the statements: I. Sustainable land use considers future productivity. II. It also considers ecological limits. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Long-term land use must respect resource limits.","LND-SLM-4"),
r("A steep erosion-prone slope is kept under forest rather than intensive cultivation. What principle is being applied?","Land capability-based use","Maximum short-term extraction","Urban sprawl","Mining-first planning","The land use is matched to its physical suitability.","LND-SLM-5")
]),
buildQl("INTEGRATED-LAND-REASONING","Integrated land-resource reasoning",[
r("Which combination most likely causes land degradation?","Deforestation, overgrazing and erosion","Afforestation, terracing and contour farming","Recharge, shelterbelts and drainage","Watershed treatment and grass cover","The first combination removes protection and accelerates soil loss.","LND-INT-1"),
r("Which combination best reduces dryland degradation?","Shelterbelts, controlled grazing and water conservation","Deforestation and overgrazing","Unlimited groundwater pumping","Bare soil and high runoff","Vegetation and careful water use reduce erosion and desertification.","LND-INT-2"),
r("Which comparison correctly distinguishes cultivated and fallow land?","Net sown area is cultivated; current fallow is temporarily uncultivated","Both are forests","Both are permanently barren","Current fallow is urban land","The categories differ by whether cultivation occurs in the reference year.","LND-INT-3"),
r("Which comparison correctly distinguishes waterlogging and salinity?","Waterlogging means excess water; salinity means excess salts","Both mean wind erosion","Both mean afforestation","Both mean urbanisation","The two problems can occur together but are distinct.","LND-INT-4"),
r("A region protects forests on steep slopes, farms gentler land and restores gullies. What approach is this?","Sustainable land management","Random land use","Maximum extraction","Unplanned expansion","Land use is being matched to capability and conservation needs.","LND-INT-5")
])
]);
export const GEO_LND_001_CP003_REVIEW_BATCH_V1=finalizeCp(3,GEO_LND_001_CP003_QLS);
export function auditGeoLnd001Cp003ReviewBatchV1(){return auditCp(3,GEO_LND_001_CP003_QLS,GEO_LND_001_CP003_REVIEW_BATCH_V1);}
