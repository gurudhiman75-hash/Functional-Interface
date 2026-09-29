import { buildQl, finalizeCp, auditCp } from "./geo-pln-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});
export const GEO_PLN_001_CP004_QLS=Object.freeze([
buildQl("MATCH-PLANNING","Match planning concepts and case studies",[
r("Which set is correctly matched?","Target area—specific region; target group—specific population; Bharmaur—tribal mountain development","Target area—only individuals; target group—river basin; Bharmaur—seaport","All three—urban planning only","All three—industrial corridors","The set correctly distinguishes planning approaches and the Bharmaur case.","PLN-INT-M1"),
r("Which set correctly matches regional cases?","Bharmaur—Himachal Pradesh; Indira Gandhi Canal—Rajasthan; drought-prone planning—water-scarce regions","Bharmaur—Odisha; canal—Assam; drought planning—coasts only","All three—Kerala","All three—Punjab only","The geographic matches are correct.","PLN-INT-M2"),
r("Which set correctly matches planning issues?","Hill area—accessibility; drought area—water scarcity; canal command—waterlogging/salinity risk","Hill area—storm surge; drought area—glaciers; canal command—avalanche","All three—port congestion","All three—sea erosion","Each problem reflects the region's physical setting.","PLN-INT-M3"),
r("Which set correctly matches sustainability measures?","Canal command—drainage; hills—slope-sensitive use; drought areas—water conservation","Canal command—over-irrigation; hills—deforestation; drought areas—water wastage","All three—maximum extraction","All three—no planning","The measures reduce environmental stress in each region.","PLN-INT-M4")
]),
buildQl("STATEMENT-PLANNING","Multi-statement planning geography",[
r("Consider the statements: I. Target-area planning focuses on regions. II. Target-group planning focuses on defined beneficiary groups. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","The distinction is geographic area versus population group.","PLN-INT-S1"),
r("Consider the statements: I. Bharmaur is linked with Gaddi communities. II. It is in Himachal Pradesh. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are core facts of the case study.","PLN-INT-S2"),
r("Consider the statements: I. Indira Gandhi Canal serves Rajasthan. II. Poor drainage can create salinity and waterlogging in command areas. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both describe the benefits and risks of desert irrigation.","PLN-INT-S3"),
r("Consider the statements: I. Sustainable development includes future generations. II. It also requires attention to ecological limits. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are central sustainability principles.","PLN-INT-S4")
]),
buildQl("CLUE-PLANNING","Planning clue identification",[
r("A case study mentions Gaddis, Chamba and remote Himalayan development. Which region is it?","Bharmaur","Indira Gandhi Canal","Damodar Valley","Kandla","The clues identify Bharmaur in Himachal Pradesh.","PLN-INT-C1"),
r("A canal carries north-western river water into the Thar Desert. Which project is it?","Indira Gandhi Canal","West Coast Canal","Buckingham Canal","Damodar Canal","The Rajasthan desert clue identifies the Indira Gandhi Canal.","PLN-INT-C2"),
r("A programme is designed only for chronically drought-affected districts. Which planning approach is it?","Target-area planning","Target-group planning","No planning","Only urban zoning","A defined geographic problem area is the target.","PLN-INT-C3"),
r("A programme supports landless labourers across many states. Which planning approach is it?","Target-group planning","Target-area planning","Hill-area planning only","No planning","The beneficiary group, not the region, defines the intervention.","PLN-INT-C4")
]),
buildQl("INTEGRATED-PLANNING","Integrated planning reasoning",[
r("Which combination best reflects sustainable hill development?","Connectivity, horticulture and slope conservation","Deforestation and unplanned road cutting","Only heavy industry","No services","Development must combine livelihoods, access and ecological protection.","PLN-INT-R1"),
r("Which combination best suits drought-prone regional planning?","Watershed development, water conservation and livelihood diversification","Water-intensive cropping and over-pumping","No storage","Ignoring rainfall variability","The measures reduce dependence on unreliable rainfall.","PLN-INT-R2"),
r("Which combination best improves sustainability in the Indira Gandhi Canal command area?","Efficient irrigation, drainage and suitable crops","Over-irrigation and poor drainage","No shelterbelts","Maximum water use","Better water management reduces salinity and waterlogging risk.","PLN-INT-R3"),
r("Which statement captures the main lesson of regional planning?","Development should respond to the specific geography and needs of each region","Every region needs the same intervention","Physical geography is irrelevant","Planning should ignore local communities","Regional differences require tailored strategies.","PLN-INT-R4")
])
]);
export const GEO_PLN_001_CP004_REVIEW_BATCH_V1=finalizeCp(4,GEO_PLN_001_CP004_QLS);
export function auditGeoPln001Cp004ReviewBatchV1(){return auditCp(4,GEO_PLN_001_CP004_QLS,GEO_PLN_001_CP004_REVIEW_BATCH_V1);}
