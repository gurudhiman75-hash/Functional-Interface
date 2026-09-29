import { buildQl, finalizeCp, auditCp } from "./geo-lak-001-review-builder";
const r=(stem:string,answer:string,d1:string,d2:string,d3:string,explanation:string,sourceFactId:string)=>({stem,answer,distractors:[d1,d2,d3] as const,explanation,sourceFactId});

export const GEO_LAK_001_CP001_QLS=Object.freeze([
buildQl("WULAR-LAKE","Wular Lake",[
r("Wular Lake is located in which Union Territory?","Jammu and Kashmir","Ladakh","Delhi","Puducherry","Wular is a major freshwater lake in the Kashmir Valley.","LAK-WULAR-1"),
r("What type of lake is Wular?","Freshwater lake","Salt pan","Coastal lagoon","Artificial reservoir only","Wular is a natural freshwater lake in the Kashmir Valley.","LAK-WULAR-2"),
r("Which river is closely linked with Wular Lake?","Jhelum","Godavari","Narmada","Mahanadi","The Jhelum flows through the Kashmir Valley and is linked with Wular Lake.","LAK-WULAR-3"),
r("Consider the statements: I. Wular is in the Kashmir Valley. II. It is a freshwater lake. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are standard facts about Wular.","LAK-WULAR-4"),
r("A large freshwater lake in the Kashmir Valley is linked with the Jhelum. Which lake is it?","Wular","Chilika","Sambhar","Pulicat","The Kashmir-Jhelum clue identifies Wular.","LAK-WULAR-5")
]),
buildQl("DAL-LAKE","Dal Lake",[
r("Dal Lake is located in which city?","Srinagar","Jaipur","Bhopal","Kochi","Dal Lake is one of Srinagar's best-known geographic features.","LAK-DAL-1"),
r("Dal Lake lies in which Union Territory?","Jammu and Kashmir","Ladakh","Chandigarh","Delhi","Srinagar and Dal Lake are in Jammu and Kashmir.","LAK-DAL-2"),
r("Which feature is strongly identified with Dal Lake?","Houseboats and floating gardens","Salt extraction","Coral reefs","Desert dunes","Dal is known for houseboats and floating gardens in Srinagar.","LAK-DAL-3"),
r("Consider the statements: I. Dal Lake is in Srinagar. II. It lies in the Kashmir Valley. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both locational statements are correct.","LAK-DAL-4"),
r("A lake famous for houseboats lies beside Srinagar. Which one is it?","Dal Lake","Loktak Lake","Kolleru Lake","Sambhar Lake","The Srinagar-houseboat clue identifies Dal Lake.","LAK-DAL-5")
]),
buildQl("LOKTAK-LAKE","Loktak Lake",[
r("Loktak Lake is located in which state?","Manipur","Odisha","Rajasthan","Kerala","Loktak is a major freshwater lake of Manipur.","LAK-LOK-1"),
r("What are the floating masses of vegetation and soil in Loktak Lake called?","Phumdis","Chars","Duns","Khadins","Phumdis are characteristic floating biomass formations of Loktak.","LAK-LOK-2"),
r("Which national park is closely linked with Loktak Lake?","Keibul Lamjao National Park","Kaziranga National Park","Gir National Park","Simlipal National Park","Keibul Lamjao lies on floating phumdis in the Loktak ecosystem.","LAK-LOK-3"),
r("Consider the statements: I. Loktak is in Manipur. II. It is known for phumdis. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are defining facts of Loktak.","LAK-LOK-4"),
r("A lake in Manipur contains floating phumdis and is linked with Keibul Lamjao. Which lake is it?","Loktak","Wular","Sambhar","Pulicat","The phumdi and park clues identify Loktak.","LAK-LOK-5")
]),
buildQl("CHILIKA-LAKE","Chilika Lake",[
r("Chilika Lake is located in which state?","Odisha","Rajasthan","Manipur","Maharashtra","Chilika is a large coastal lagoon on the Odisha coast.","LAK-CHIL-1"),
r("What type of water body is Chilika?","Brackish coastal lagoon","High-altitude freshwater lake","Salt pan in a desert","Artificial canal reservoir","Chilika is a brackish lagoon connected to the Bay of Bengal.","LAK-CHIL-2"),
r("Chilika Lake is connected with which sea region?","Bay of Bengal","Arabian Sea","Red Sea","Caspian Sea","The lagoon lies on India's east coast beside the Bay of Bengal.","LAK-CHIL-3"),
r("Consider the statements: I. Chilika is in Odisha. II. It is a coastal lagoon. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements are correct.","LAK-CHIL-4"),
r("A brackish lagoon on the Odisha coast opens toward the Bay of Bengal. Which lake is it?","Chilika","Sambhar","Wular","Loktak","The Odisha coastal-lagoon clue identifies Chilika.","LAK-CHIL-5")
]),
buildQl("SAMBHAR-LAKE","Sambhar Lake",[
r("Sambhar Lake is located in which state?","Rajasthan","Kerala","Manipur","Odisha","Sambhar is a saline lake in Rajasthan.","LAK-SAMBHAR-1"),
r("What type of lake is Sambhar?","Saline lake","Freshwater glacial lake","Coastal lagoon","River oxbow lake","Sambhar is an inland salt lake in Rajasthan.","LAK-SAMBHAR-2"),
r("Which activity is strongly linked with Sambhar Lake?","Salt production","Tea cultivation","Marine fishing","Hydropower generation","The saline lake supports commercial salt production.","LAK-SAMBHAR-3"),
r("Consider the statements: I. Sambhar lies in Rajasthan. II. It is saline. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","LAK-SAMBHAR-4"),
r("An inland saline lake in Rajasthan is important for salt production. Which lake is it?","Sambhar","Dal","Loktak","Kolleru","The Rajasthan-salt clue identifies Sambhar.","LAK-SAMBHAR-5")
])
]);
export const GEO_LAK_001_CP001_REVIEW_BATCH_V1=finalizeCp(1,GEO_LAK_001_CP001_QLS);
export function auditGeoLak001Cp001ReviewBatchV1(){return auditCp(1,GEO_LAK_001_CP001_QLS,GEO_LAK_001_CP001_REVIEW_BATCH_V1);}

export const GEO_LAK_001_CP002_QLS=Object.freeze([
buildQl("VEMBANAD-LAKE","Vembanad Lake",[
r("Vembanad Lake is located in which state?","Kerala","Odisha","Rajasthan","Manipur","Vembanad is a major lake-backwater system of Kerala.","LAK-VEM-1"),
r("Vembanad is closely linked with which regional landscape?","Kerala backwaters","Thar Desert","Kashmir Valley","Brahmaputra floodplain","It forms an important part of Kerala's backwater network.","LAK-VEM-2"),
r("Which coastal sea lies west of Vembanad's region?","Arabian Sea","Bay of Bengal","Black Sea","Mediterranean Sea","Kerala lies along the Arabian Sea coast.","LAK-VEM-3"),
r("Consider the statements: I. Vembanad is in Kerala. II. It is part of the backwater landscape. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both describe Vembanad accurately.","LAK-VEM-4"),
r("A major lake-backwater system in Kerala lies close to the Arabian Sea coast. Which lake is it?","Vembanad","Wular","Sambhar","Loktak","The Kerala-backwater clue identifies Vembanad.","LAK-VEM-5")
]),
buildQl("PULICAT-LAKE","Pulicat Lake",[
r("Pulicat Lake lies along the coast of which two states?","Andhra Pradesh and Tamil Nadu","Kerala and Karnataka","Odisha and West Bengal","Gujarat and Maharashtra","Pulicat straddles the Andhra Pradesh-Tamil Nadu coast.","LAK-PUL-1"),
r("What type of water body is Pulicat?","Coastal lagoon","High-altitude glacial lake","Desert salt pan","Freshwater mountain tarn","Pulicat is a brackish coastal lagoon on the Coromandel Coast.","LAK-PUL-2"),
r("Pulicat Lake lies near which coast?","Coromandel Coast","Konkan Coast","Malabar Coast","Kutch Coast","Pulicat lies on India's south-eastern Coromandel Coast.","LAK-PUL-3"),
r("Consider the statements: I. Pulicat is a coastal lagoon. II. It lies between Andhra Pradesh and Tamil Nadu. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are standard locational facts.","LAK-PUL-4"),
r("A lagoon on the Coromandel Coast spans Andhra Pradesh and Tamil Nadu. Which lake is it?","Pulicat","Chilika","Sambhar","Dal","The state and coast clues identify Pulicat.","LAK-PUL-5")
]),
buildQl("KOLLERU-LAKE","Kolleru Lake",[
r("Kolleru Lake is located in which state?","Andhra Pradesh","Rajasthan","Jammu and Kashmir","Manipur","Kolleru is a freshwater lake in Andhra Pradesh.","LAK-KOL-1"),
r("Kolleru lies between the deltas of which two rivers?","Krishna and Godavari","Ganga and Brahmaputra","Narmada and Tapi","Mahanadi and Brahmani","Kolleru lies in the lowland between the Krishna and Godavari deltas.","LAK-KOL-2"),
r("What type of lake is Kolleru?","Freshwater lake","Desert salt lake","High-altitude glacial lake","Coastal coral lagoon","Kolleru is a shallow freshwater lake.","LAK-KOL-3"),
r("Consider the statements: I. Kolleru is in Andhra Pradesh. II. It lies between Krishna and Godavari delta regions. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","LAK-KOL-4"),
r("A freshwater lake lies between the Krishna and Godavari deltas. Which lake is it?","Kolleru","Sambhar","Wular","Dal","The delta-location clue identifies Kolleru.","LAK-KOL-5")
]),
buildQl("LONAR-LAKE","Lonar Lake",[
r("Lonar Lake is located in which state?","Maharashtra","Manipur","Odisha","Kerala","Lonar lies in Maharashtra's Deccan volcanic region.","LAK-LON-1"),
r("What is the origin of Lonar Lake?","Meteorite-impact crater","River meander cutoff","Coastal lagoon formation","Glacial erosion","Lonar occupies an impact crater formed in basaltic rock.","LAK-LON-2"),
r("Lonar Lake lies in which broad plateau region?","Deccan Plateau","Shillong Plateau","Malwa Plateau only","Chota Nagpur Plateau","The crater lies in the basaltic Deccan region of Maharashtra.","LAK-LON-3"),
r("Consider the statements: I. Lonar is in Maharashtra. II. It occupies an impact crater. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both facts are correct.","LAK-LON-4"),
r("A lake in Maharashtra occupies a meteorite-impact crater in basalt. Which lake is it?","Lonar","Loktak","Pulicat","Wular","The impact-crater clue identifies Lonar.","LAK-LON-5")
]),
buildQl("PANGONG-TSO","Pangong Tso",[
r("Pangong Tso is located in which Union Territory of India?","Ladakh","Jammu and Kashmir","Delhi","Chandigarh","The Indian portion of Pangong Tso lies in Ladakh.","LAK-PAN-1"),
r("Pangong Tso is a transboundary lake shared by India and which country?","China","Nepal","Bhutan","Myanmar","The lake extends eastward from Ladakh into the Tibetan region of China.","LAK-PAN-2"),
r("Which broad setting describes Pangong Tso?","High-altitude endorheic lake","Coastal lagoon","Desert salt pan at sea level","River delta lake","Pangong lies in a high-altitude closed-drainage basin.","LAK-PAN-3"),
r("Consider the statements: I. Pangong Tso is in Ladakh. II. It is transboundary. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements are correct.","LAK-PAN-4"),
r("A high-altitude lake in Ladakh extends across the India-China boundary. Which lake is it?","Pangong Tso","Loktak","Chilika","Sambhar","The Ladakh transboundary clue identifies Pangong Tso.","LAK-PAN-5")
])
]);
export const GEO_LAK_001_CP002_REVIEW_BATCH_V1=finalizeCp(2,GEO_LAK_001_CP002_QLS);
export function auditGeoLak001Cp002ReviewBatchV1(){return auditCp(2,GEO_LAK_001_CP002_QLS,GEO_LAK_001_CP002_REVIEW_BATCH_V1);}

export const GEO_LAK_001_CP003_QLS=Object.freeze([
buildQl("JOG-FALLS","Jog Falls",[
r("Jog Falls is located in which state?","Karnataka","Odisha","Rajasthan","Jharkhand","Jog Falls is a major waterfall in Karnataka.","LAK-JOG-1"),
r("Jog Falls is formed by which river?","Sharavathi","Narmada","Indravati","Subarnarekha","The Sharavathi plunges over the Western Ghats to form Jog Falls.","LAK-JOG-2"),
r("Which mountain region is closely linked with Jog Falls?","Western Ghats","Aravalli","Shivalik","Eastern Himalaya","Jog lies in Karnataka's Western Ghats.","LAK-JOG-3"),
r("Consider the statements: I. Jog Falls is in Karnataka. II. It is on the Sharavathi. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","LAK-JOG-4"),
r("A major waterfall in Karnataka is formed by the Sharavathi. Which one is it?","Jog Falls","Dhuandhar","Hundru","Chitrakote","The Sharavathi clue identifies Jog Falls.","LAK-JOG-5")
]),
buildQl("CHITRAKOTE-FALLS","Chitrakote Falls",[
r("Chitrakote Falls is located in which state?","Chhattisgarh","Karnataka","Kerala","Gujarat","Chitrakote is a major waterfall in Bastar, Chhattisgarh.","LAK-CHI-1"),
r("Chitrakote Falls is formed by which river?","Indravati","Sharavathi","Narmada","Kaveri","The Indravati forms Chitrakote Falls in Chhattisgarh.","LAK-CHI-2"),
r("Which region is closely linked with Chitrakote Falls?","Bastar","Malwa","Konkan","Kashmir Valley","Chitrakote lies in the Bastar region.","LAK-CHI-3"),
r("Consider the statements: I. Chitrakote is in Chhattisgarh. II. It is on the Indravati. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","LAK-CHI-4"),
r("A broad waterfall in Bastar is formed by the Indravati. Which one is it?","Chitrakote Falls","Jog Falls","Dudhsagar Falls","Hundru Falls","The Bastar-Indravati clue identifies Chitrakote.","LAK-CHI-5")
]),
buildQl("DHUANDHAR-FALLS","Dhuandhar Falls",[
r("Dhuandhar Falls is located in which state?","Madhya Pradesh","Kerala","Odisha","Sikkim","Dhuandhar lies near Bhedaghat in Madhya Pradesh.","LAK-DHU-1"),
r("Dhuandhar Falls is formed by which river?","Narmada","Godavari","Mahanadi","Teesta","The Narmada forms Dhuandhar near Bhedaghat.","LAK-DHU-2"),
r("Which place is closely linked with Dhuandhar Falls?","Bhedaghat","Srinagar","Puri","Gangtok","Bhedaghat's marble gorge and Dhuandhar Falls are on the Narmada.","LAK-DHU-3"),
r("Consider the statements: I. Dhuandhar is on the Narmada. II. It is in Madhya Pradesh. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both statements are correct.","LAK-DHU-4"),
r("A waterfall on the Narmada near Bhedaghat is called what?","Dhuandhar Falls","Jog Falls","Athirappilly Falls","Dudhsagar Falls","The Narmada-Bhedaghat clue identifies Dhuandhar.","LAK-DHU-5")
]),
buildQl("HUNDRU-FALLS","Hundru Falls",[
r("Hundru Falls is located in which state?","Jharkhand","Rajasthan","Goa","Tamil Nadu","Hundru is one of Jharkhand's well-known waterfalls.","LAK-HUN-1"),
r("Hundru Falls is formed by which river?","Subarnarekha","Kaveri","Sharavathi","Mandovi","Hundru Falls is on the Subarnarekha River.","LAK-HUN-2"),
r("Which plateau region contains Hundru Falls?","Chota Nagpur Plateau","Deccan Plateau only","Shillong Plateau","Ladakh Plateau","The Subarnarekha descends across the Chota Nagpur Plateau.","LAK-HUN-3"),
r("Consider the statements: I. Hundru is in Jharkhand. II. It is on the Subarnarekha. Which is correct?","Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct","Both are correct.","LAK-HUN-4"),
r("A waterfall in Jharkhand is formed by the Subarnarekha. Which one is it?","Hundru Falls","Dhuandhar Falls","Jog Falls","Chitrakote Falls","The river-state clue identifies Hundru.","LAK-HUN-5")
]),
buildQl("KAVERI-WATERFALLS","Shivanasamudra and Hogenakkal",[
r("Shivanasamudra Falls is formed by which river?","Kaveri","Narmada","Mahanadi","Indravati","Shivanasamudra is a major waterfall on the Kaveri in Karnataka.","LAK-KAV-1"),
r("Shivanasamudra Falls is located in which state?","Karnataka","Tamil Nadu","Kerala","Goa","The falls lie on the Kaveri in Karnataka.","LAK-KAV-2"),
r("Hogenakkal Falls is formed by which river?","Kaveri","Sharavathi","Subarnarekha","Mandovi","Hogenakkal is another major waterfall on the Kaveri.","LAK-KAV-3"),
r("Hogenakkal Falls is located in which state?","Tamil Nadu","Karnataka","Odisha","Jharkhand","Hogenakkal lies in Tamil Nadu on the Kaveri.","LAK-KAV-4"),
r("Which river forms major waterfalls at both Shivanasamudra and Hogenakkal?","Kaveri","Narmada","Godavari","Teesta","Both waterfalls occur along the Kaveri system.","LAK-KAV-5")
])
]);
export const GEO_LAK_001_CP003_REVIEW_BATCH_V1=finalizeCp(3,GEO_LAK_001_CP003_QLS);
export function auditGeoLak001Cp003ReviewBatchV1(){return auditCp(3,GEO_LAK_001_CP003_QLS,GEO_LAK_001_CP003_REVIEW_BATCH_V1);}
