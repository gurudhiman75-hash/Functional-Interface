import {GEO_SOI_001_SOURCE_IDS,placeGeoSoiOptions,type GeoSoi001Difficulty,type GeoSoi001Question} from "./geo-soi-001-review-types";
type RawQuestion=Readonly<{qlId:string;qlName:string;difficulty:GeoSoi001Difficulty;stem:string;answer:string;distractors:readonly string[];explanation:string;sourceFactIds:readonly string[];}>;
const RAW:readonly RawQuestion[]=Object.freeze([
  {
    "qlId": "GEO-SOI-001-QL-100",
    "qlName": "Integrated formation and classification statements",
    "difficulty": "Easy",
    "stem": "Consider the statements: I. Alluvial soil is formed by river deposition. II. Black soil is linked with Deccan basalt. Which is correct?",
    "answer": "Both I and II",
    "distractors": [
      "I only",
      "II only",
      "Neither I nor II"
    ],
    "explanation": "Both statements are correct. Alluvial soil is built from river-borne sediments, while black soil develops over the basaltic lava region of the Deccan Trap.",
    "sourceFactIds": [
      "INT-FORMATION-ALLUVIAL-BLACK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-100",
    "qlName": "Integrated formation and classification statements",
    "difficulty": "Easy",
    "stem": "Consider the statements: I. Laterite forms under heavy rainfall and intense leaching. II. Arid soil forms under hot dry conditions. Which is correct?",
    "answer": "Both I and II",
    "distractors": [
      "I only",
      "II only",
      "Neither I nor II"
    ],
    "explanation": "Both statements correctly connect soil formation with climate. Laterite reflects strong leaching in wet conditions, whereas arid soil reflects dryness and rapid evaporation.",
    "sourceFactIds": [
      "INT-FORMATION-LATERITE-ARID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-100",
    "qlName": "Integrated formation and classification statements",
    "difficulty": "Medium",
    "stem": "Which set of soil-formation pairs is fully correct?",
    "answer": "Alluvial—river deposition; black—basalt weathering; laterite—intense leaching",
    "distractors": [
      "Alluvial—lava; black—river deposition; laterite—desert evaporation",
      "Alluvial—glacial ice; black—sea deposition; laterite—annual floods",
      "Alluvial—wind only; black—peat; laterite—snow cover"
    ],
    "explanation": "The correct set uses three distinct processes: deposition for alluvial soil, basalt weathering for black soil and strong leaching for laterite. These are standard formation clues for separating major Indian soils.",
    "sourceFactIds": [
      "INT-FORMATION-TRIPLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-100",
    "qlName": "Integrated formation and classification statements",
    "difficulty": "Medium",
    "stem": "A soil forms on crystalline rocks in relatively low-rainfall Deccan areas and another forms in hot wet regions with heavy leaching. Which pair is indicated?",
    "answer": "Red-yellow soil and laterite soil",
    "distractors": [
      "Black soil and arid soil",
      "Alluvial soil and black soil",
      "Forest soil and khadar"
    ],
    "explanation": "Red and yellow soil develops over crystalline rocks under comparatively lower rainfall, while laterite develops under heavy rainfall and intense leaching. The pair contrasts parent-rock control with strong climatic leaching.",
    "sourceFactIds": [
      "INT-RED-LATERITE-FORMATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-100",
    "qlName": "Integrated formation and classification statements",
    "difficulty": "Medium",
    "stem": "Which statement set is correct? I. Soil formation depends on parent material, climate, relief and organisms. II. Different combinations of these factors help create different soil groups.",
    "answer": "Both statements are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Both statements are incorrect"
    ],
    "explanation": "Both statements are correct because soils develop through interacting physical and biological controls. Changes in parent rock, rainfall, relief or vegetation can therefore produce different soil properties and groups.",
    "sourceFactIds": [
      "INT-SOIL-FACTORS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-100",
    "qlName": "Integrated formation and classification statements",
    "difficulty": "Hard",
    "stem": "A question gives four clues: river sediment, basaltic lava, crystalline-rock iron colouring and hot-wet leaching. Which soil sequence is correct?",
    "answer": "Alluvial, black, red-yellow, laterite",
    "distractors": [
      "Black, alluvial, arid, forest",
      "Laterite, forest, alluvial, black",
      "Arid, red-yellow, black, alluvial"
    ],
    "explanation": "River sediment identifies alluvial soil, basaltic lava identifies black soil, crystalline-rock iron colouring identifies red-yellow soil and hot-wet leaching identifies laterite. The sequence combines four different formation pathways.",
    "sourceFactIds": [
      "INT-FORMATION-FOUR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-101",
    "qlName": "Alluvial and black soil statement integration",
    "difficulty": "Easy",
    "stem": "Which statement pair is correct? I. Khadar is newer alluvium. II. Black soil is ideal for cotton.",
    "answer": "Both I and II",
    "distractors": [
      "I only",
      "II only",
      "Neither I nor II"
    ],
    "explanation": "Both statements are correct. Khadar is the younger alluvial deposit, while black soil is the classic cotton soil because of its fine clay and moisture-holding capacity.",
    "sourceFactIds": [
      "INT-ALLUVIAL-BLACK-BASIC"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-101",
    "qlName": "Alluvial and black soil statement integration",
    "difficulty": "Easy",
    "stem": "Which pair is correctly matched?",
    "answer": "Bangar—older alluvium; black soil—deep summer cracks",
    "distractors": [
      "Khadar—older alluvium; black soil—sandy texture",
      "Bangar—recent alluvium; black soil—annual flood renewal",
      "Khadar—desert soil; black soil—laterite"
    ],
    "explanation": "Bangar is the older alluvial soil and often contains more kankar, while black soil is known for shrinkage and deep cracks in hot weather. The pair uses two different but characteristic profile clues.",
    "sourceFactIds": [
      "INT-BANGAR-BLACK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-101",
    "qlName": "Alluvial and black soil statement integration",
    "difficulty": "Medium",
    "stem": "Consider the statements: I. Alluvial soil is generally fertile. II. Black soil has high moisture-holding capacity. III. Both soils are formed by annual river deposition. Which are correct?",
    "answer": "I and II only",
    "distractors": [
      "I and III only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Alluvial soil is generally fertile, and black soil holds moisture well because of its clay content. Black soil is not formed by annual river deposition, so the third statement is incorrect.",
    "sourceFactIds": [
      "INT-ALLUVIAL-BLACK-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-101",
    "qlName": "Alluvial and black soil statement integration",
    "difficulty": "Medium",
    "stem": "Which contrast is correct?",
    "answer": "Alluvial soil varies in sand-silt-clay proportions, while black soil is extremely fine and clayey",
    "distractors": [
      "Both are always coarse sand",
      "Black soil is renewed annually by floods",
      "Alluvial soil is always sticky black clay"
    ],
    "explanation": "Alluvial texture varies with depositional setting, whereas black soil is characteristically fine and clay-rich. This textural contrast is useful even when both soils support intensive agriculture.",
    "sourceFactIds": [
      "INT-ALLUVIAL-BLACK-TEXTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-101",
    "qlName": "Alluvial and black soil statement integration",
    "difficulty": "Medium",
    "stem": "A field has recent river deposits and another develops deep cracks during hot weather. Which soils are indicated?",
    "answer": "Khadar and black soil",
    "distractors": [
      "Bangar and laterite",
      "Arid soil and forest soil",
      "Black soil and khadar"
    ],
    "explanation": "Recent river deposits point to khadar, the younger alluvium. Deep shrink cracks point to black soil because its clay expands when wet and contracts strongly when dry.",
    "sourceFactIds": [
      "INT-KHADAR-BLACK-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-101",
    "qlName": "Alluvial and black soil statement integration",
    "difficulty": "Hard",
    "stem": "Which set contains only correct alluvial/black facts?",
    "answer": "Khadar is newer; bangar is older; black soil is clayey and moisture-retentive",
    "distractors": [
      "Khadar is older; bangar is newer; black soil is sandy",
      "Alluvium forms from basalt; black soil forms from river silt",
      "Bangar lacks kankar; black soil is always acidic and leached"
    ],
    "explanation": "Khadar and bangar are the younger and older forms of alluvium respectively, while black soil is fine, clayey and moisture-retentive. The other sets reverse or mix these defining facts.",
    "sourceFactIds": [
      "INT-ALLUVIAL-BLACK-MASTER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-102",
    "qlName": "Red-yellow and laterite statement integration",
    "difficulty": "Easy",
    "stem": "Which statement pair is correct? I. Red-yellow soil colour reflects iron. II. Laterite forms under intense leaching.",
    "answer": "Both I and II",
    "distractors": [
      "I only",
      "II only",
      "Neither I nor II"
    ],
    "explanation": "Both statements are correct. Iron gives red-yellow soils their characteristic colours, while laterite develops where heavy rainfall strongly leaches soluble materials from the soil.",
    "sourceFactIds": [
      "INT-RED-LATERITE-BASIC"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-102",
    "qlName": "Red-yellow and laterite statement integration",
    "difficulty": "Easy",
    "stem": "Which soil pair is correctly matched?",
    "answer": "Red-yellow—crystalline rocks; laterite—heavy rainfall and leaching",
    "distractors": [
      "Red-yellow—annual flood silt; laterite—desert evaporation",
      "Red-yellow—basaltic black clay; laterite—new alluvium",
      "Red-yellow—glacial ice; laterite—river delta"
    ],
    "explanation": "Red-yellow soils are tied to crystalline rocks in many Deccan uplands, while laterite reflects heavy rainfall and leaching. The pair distinguishes parent-rock influence from strong climatic weathering.",
    "sourceFactIds": [
      "INT-RED-LATERITE-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-102",
    "qlName": "Red-yellow and laterite statement integration",
    "difficulty": "Medium",
    "stem": "Consider the statements: I. Red soil appears yellow when iron becomes hydrated. II. Laterite is often nutrient-deficient. III. Laterite is naturally renewed by annual river floods. Which are correct?",
    "answer": "I and II only",
    "distractors": [
      "I and III only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Hydrated iron can give red-yellow soil a yellow colour, and strong leaching often leaves laterite nutrient-poor. Laterite is not an annually renewed river deposit, so the third statement is false.",
    "sourceFactIds": [
      "INT-RED-LATERITE-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-102",
    "qlName": "Red-yellow and laterite statement integration",
    "difficulty": "Medium",
    "stem": "Which comparison is correct?",
    "answer": "Red-yellow soil is linked with crystalline rocks, while laterite is linked with intense leaching",
    "distractors": [
      "Both are annual river deposits",
      "Laterite is defined by black clay cracks",
      "Red-yellow soil forms only in deserts"
    ],
    "explanation": "The formation controls differ clearly: red-yellow soil reflects weathering of crystalline rocks, while laterite reflects strong leaching under warm wet conditions. This distinction prevents colour-based confusion.",
    "sourceFactIds": [
      "INT-RED-LATERITE-COMPARE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-102",
    "qlName": "Red-yellow and laterite statement integration",
    "difficulty": "Medium",
    "stem": "A southern upland has iron-red soil; another hot wet upland is strongly leached and acidic. Which soils fit respectively?",
    "answer": "Red-yellow soil and laterite soil",
    "distractors": [
      "Black soil and arid soil",
      "Alluvial soil and black soil",
      "Forest soil and khadar"
    ],
    "explanation": "Iron-red colouring over crystalline uplands points to red-yellow soil, while a strongly leached acidic hot-wet profile points to laterite. The two may occur in similar broad regions but form differently.",
    "sourceFactIds": [
      "INT-RED-LATERITE-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-102",
    "qlName": "Red-yellow and laterite statement integration",
    "difficulty": "Hard",
    "stem": "Which set is fully correct?",
    "answer": "Red-yellow soil: iron colour and crystalline parent rock; laterite: heavy rain, leaching and nutrient loss",
    "distractors": [
      "Red-yellow: annual floods; laterite: black clay cracks",
      "Red-yellow: desert salinity; laterite: river deposition",
      "Red-yellow: glacier deposits; laterite: dry-climate kankar"
    ],
    "explanation": "The correct set combines the core formation and property clues of both soils. Red-yellow soil reflects iron-rich crystalline material, whereas laterite reflects intense leaching and consequent nutrient loss.",
    "sourceFactIds": [
      "INT-RED-LATERITE-MASTER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-103",
    "qlName": "Arid and forest soil statement integration",
    "difficulty": "Easy",
    "stem": "Which statement pair is correct? I. Arid soil is commonly sandy and saline. II. Forest soil varies with mountain relief.",
    "answer": "Both I and II",
    "distractors": [
      "I only",
      "II only",
      "Neither I nor II"
    ],
    "explanation": "Both statements are correct. Arid soil reflects dry-region sandiness and salinity, while forest soil changes in texture and fertility according to slope position and altitude.",
    "sourceFactIds": [
      "INT-ARID-FOREST-BASIC"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-103",
    "qlName": "Arid and forest soil statement integration",
    "difficulty": "Easy",
    "stem": "Which pair is correctly matched?",
    "answer": "Arid—lower-horizon kankar; forest—coarse upper slopes",
    "distractors": [
      "Arid—annual flood silt; forest—desert salinity",
      "Arid—black clay cracks; forest—khadar",
      "Arid—peat; forest—salt pan"
    ],
    "explanation": "Arid soil can develop a calcium-rich kankar layer lower in the profile, while forest soil on upper mountain slopes is often coarse because of erosion. The pair uses distinctive profile and relief clues.",
    "sourceFactIds": [
      "INT-ARID-FOREST-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-103",
    "qlName": "Arid and forest soil statement integration",
    "difficulty": "Medium",
    "stem": "Consider the statements: I. Arid soil usually has low humus and moisture. II. High Himalayan forest soil may be acidic and low in humus. III. Both are formed by annual river deposition. Which are correct?",
    "answer": "I and II only",
    "distractors": [
      "I and III only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Arid soil is low in humus and moisture, and high Himalayan forest soil may also be low in humus and acidic. Neither is defined by annual river deposition, so the third statement is incorrect.",
    "sourceFactIds": [
      "INT-ARID-FOREST-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-103",
    "qlName": "Arid and forest soil statement integration",
    "difficulty": "Medium",
    "stem": "Which comparison is correct?",
    "answer": "Arid soil reflects rapid evaporation, while forest soil reflects mountain relief and vegetation",
    "distractors": [
      "Both are defined by heavy river deposition",
      "Forest soil is always saline and sandy",
      "Arid soil is always loamy-silty"
    ],
    "explanation": "Arid soil is shaped strongly by dry climate and evaporation, whereas forest soil is shaped by mountain relief, altitude and forest cover. Their controlling environments are therefore quite different.",
    "sourceFactIds": [
      "INT-ARID-FOREST-COMPARE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-103",
    "qlName": "Arid and forest soil statement integration",
    "difficulty": "Medium",
    "stem": "A soil is red-brown, sandy and saline; another is coarse upslope but loamy-silty along valley sides. Which soils are these?",
    "answer": "Arid soil and forest soil",
    "distractors": [
      "Black soil and laterite",
      "Alluvial soil and black soil",
      "Laterite soil and arid soil"
    ],
    "explanation": "The first clue set is characteristic of arid soil, while the second describes relief-sensitive forest soil. Using both texture and landscape position makes the identification reliable.",
    "sourceFactIds": [
      "INT-ARID-FOREST-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-103",
    "qlName": "Arid and forest soil statement integration",
    "difficulty": "Hard",
    "stem": "Which set is fully correct?",
    "answer": "Arid: low moisture, salinity, kankar; forest: relief-linked texture, high-slope denudation, fertile lower valleys",
    "distractors": [
      "Arid: annual floods; forest: black clay cracks",
      "Arid: heavy leaching; forest: desert sand",
      "Arid: peat; forest: salt accumulation"
    ],
    "explanation": "The correct set combines key properties of both soil groups. Arid soil reflects dryness and calcium accumulation, while forest soil varies with mountain position and can be much more fertile in lower valleys.",
    "sourceFactIds": [
      "INT-ARID-FOREST-MASTER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-104",
    "qlName": "Distribution statement integration",
    "difficulty": "Easy",
    "stem": "Which distribution pair is correct?",
    "answer": "Alluvial—northern plains; black—Maharashtra",
    "distractors": [
      "Arid—Assam hills; laterite—Punjab plains",
      "Forest—Thar desert; black—Ganga delta",
      "Red-yellow—Punjab floodplain; arid—Kerala coast"
    ],
    "explanation": "Alluvial soil dominates the northern plains, while Maharashtra lies within the core black-soil belt. The pair combines two of the strongest national distribution clues.",
    "sourceFactIds": [
      "INT-DIST-ALLUVIAL-BLACK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-104",
    "qlName": "Distribution statement integration",
    "difficulty": "Easy",
    "stem": "Which distribution pair is correct?",
    "answer": "Arid—western Rajasthan; forest—Himalayan hills",
    "distractors": [
      "Arid—Kerala coast; forest—Thar dunes",
      "Arid—Mahanadi delta; forest—Maharashtra black-soil belt",
      "Arid—Assam valley; forest—Gujarat plains"
    ],
    "explanation": "Western Rajasthan is the classic arid-soil region, while hilly Himalayan terrain is a major zone of forest and mountain soils. The contrast follows very different climates and relief.",
    "sourceFactIds": [
      "INT-DIST-ARID-FOREST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-104",
    "qlName": "Distribution statement integration",
    "difficulty": "Medium",
    "stem": "Which set is fully correct?",
    "answer": "Laterite—Karnataka/Kerala; red-yellow—Odisha/Chhattisgarh; black—Maharashtra/Malwa",
    "distractors": [
      "Laterite—Punjab; red-yellow—Thar; black—Assam",
      "Laterite—Ganga plain; red-yellow—Kerala coast only; black—Himalayas",
      "Laterite—Ladakh; red-yellow—Punjab; black—Brahmaputra valley"
    ],
    "explanation": "The correct set matches laterite with warm wet uplands, red-yellow soils with eastern/southern peninsular areas and black soil with western-central Deccan regions.",
    "sourceFactIds": [
      "INT-DIST-TRIPLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-104",
    "qlName": "Distribution statement integration",
    "difficulty": "Medium",
    "stem": "A map highlights the Ganga plain, Maharashtra, hilly Odisha and western Rajasthan. Which sequence fits best?",
    "answer": "Alluvial, black, laterite, arid",
    "distractors": [
      "Black, alluvial, forest, laterite",
      "Laterite, arid, black, forest",
      "Arid, forest, alluvial, black"
    ],
    "explanation": "The Ganga plain is alluvial, Maharashtra is strongly black-soil country, hilly Odisha includes laterite and western Rajasthan is arid. The sequence combines four standard map associations.",
    "sourceFactIds": [
      "INT-DIST-FOUR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-104",
    "qlName": "Distribution statement integration",
    "difficulty": "Medium",
    "stem": "Which statement is correct? I. Alluvial soil also occurs in major eastern coastal deltas. II. Black soil extends through parts of the Godavari-Krishna valleys.",
    "answer": "Both statements are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Both statements are incorrect"
    ],
    "explanation": "Both statements are correct. Alluvial soil occurs in important eastern deltas, while black soil extends across parts of the Deccan river-valley belt as well as plateau surfaces.",
    "sourceFactIds": [
      "INT-DIST-DELTAS-VALLEYS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-104",
    "qlName": "Distribution statement integration",
    "difficulty": "Hard",
    "stem": "Which national soil map reading is fully correct?",
    "answer": "Northern plains—alluvial; western-central Deccan—black; eastern/southern uplands—red-yellow; western desert—arid; mountain belts—forest",
    "distractors": [
      "Northern plains—black; Deccan—forest; eastern uplands—arid; desert—alluvial; mountains—laterite",
      "Northern plains—laterite; Deccan—arid; eastern uplands—black; desert—forest; mountains—alluvial",
      "Northern plains—forest; Deccan—alluvial; eastern uplands—arid; desert—black; mountains—laterite"
    ],
    "explanation": "The first sequence matches the standard large-scale distribution of India's major soil groups. Each region reflects a different combination of parent material, climate, relief and depositional history.",
    "sourceFactIds": [
      "INT-DIST-MASTER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-105",
    "qlName": "Soil-crop statement integration",
    "difficulty": "Easy",
    "stem": "Which crop-soil pair is correct?",
    "answer": "Cotton—black soil",
    "distractors": [
      "Tea—arid soil",
      "Cashew—khadar",
      "Coffee—western desert soil"
    ],
    "explanation": "Cotton is the classic crop of black soil and gives rise to the name black cotton soil. Its fine clay and moisture retention make the crop-soil relation especially strong.",
    "sourceFactIds": [
      "INT-CROP-COTTON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-105",
    "qlName": "Soil-crop statement integration",
    "difficulty": "Easy",
    "stem": "Which crop-soil pair is correct?",
    "answer": "Sugarcane—alluvial soil",
    "distractors": [
      "Cotton—laterite",
      "Tea—arid",
      "Cashew—black soil"
    ],
    "explanation": "Sugarcane is one of the major crops suited to fertile alluvial soil. The relation is especially common in intensively cultivated river-plain regions.",
    "sourceFactIds": [
      "INT-CROP-SUGARCANE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-105",
    "qlName": "Soil-crop statement integration",
    "difficulty": "Medium",
    "stem": "Which set contains only correct relations?",
    "answer": "Alluvial—paddy/wheat; black—cotton; improved laterite—tea/coffee",
    "distractors": [
      "Alluvial—tea only; black—cashew; arid—coffee",
      "Forest—cotton; arid—tea; black—paddy only",
      "Laterite—wheat only; alluvial—cashew; black—coffee"
    ],
    "explanation": "Alluvial soil supports paddy and wheat, black soil is ideal for cotton and improved laterite can support tea and coffee. These are source-grounded crop relations from the chapter.",
    "sourceFactIds": [
      "INT-CROP-TRIPLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-105",
    "qlName": "Soil-crop statement integration",
    "difficulty": "Medium",
    "stem": "Which statement pair is correct? I. Red laterite in parts of south India suits cashew. II. Arid soil can become cultivable after irrigation.",
    "answer": "Both I and II",
    "distractors": [
      "I only",
      "II only",
      "Neither I nor II"
    ],
    "explanation": "Both statements are correct. Cashew is a standard red-laterite crop relation in parts of southern India, while irrigation can overcome the severe moisture limitation of arid soil.",
    "sourceFactIds": [
      "INT-CROP-LATERITE-ARID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-105",
    "qlName": "Soil-crop statement integration",
    "difficulty": "Medium",
    "stem": "A farmer grows cotton on dark clay, while another grows coffee on conserved leached hill soil. Which soils are indicated?",
    "answer": "Black soil and laterite soil",
    "distractors": [
      "Alluvial soil and arid soil",
      "Forest soil and black soil",
      "Arid soil and khadar"
    ],
    "explanation": "Dark clay with cotton identifies black soil, while conserved strongly leached hill soil with coffee identifies laterite. The crop clues reinforce the physical soil clues.",
    "sourceFactIds": [
      "INT-CROP-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-105",
    "qlName": "Soil-crop statement integration",
    "difficulty": "Hard",
    "stem": "Which sequence matches crop clues correctly: sugarcane, cotton, tea after conservation, cashew on red laterite?",
    "answer": "Alluvial, black, laterite, laterite",
    "distractors": [
      "Black, alluvial, arid, forest",
      "Laterite, black, alluvial, arid",
      "Arid, forest, black, alluvial"
    ],
    "explanation": "Sugarcane is linked with alluvial soil, cotton with black soil, and both tea after conservation and cashew on red laterite belong to laterite-related crop relations. The sequence tests crop knowledge across several soil groups.",
    "sourceFactIds": [
      "INT-CROP-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-106",
    "qlName": "Erosion and conservation statement integration",
    "difficulty": "Easy",
    "stem": "Which pair is correctly matched?",
    "answer": "Gully erosion—deep channels; sheet erosion—thin layer removed widely",
    "distractors": [
      "Gully erosion—wind only; sheet erosion—river deposition",
      "Gully erosion—terrace farming; sheet erosion—black-soil cracking",
      "Gully erosion—salt accumulation; sheet erosion—lava weathering"
    ],
    "explanation": "Gully erosion cuts deep channels through concentrated runoff, while sheet erosion removes a thinner layer over a broad surface. The two are major but visually different forms of water erosion.",
    "sourceFactIds": [
      "INT-EROSION-GULLY-SHEET"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-106",
    "qlName": "Erosion and conservation statement integration",
    "difficulty": "Easy",
    "stem": "Which pair is correctly matched?",
    "answer": "Wind erosion—dry exposed soil; shelter belts—wind control",
    "distractors": [
      "Wind erosion—annual floods; shelter belts—gully formation",
      "Wind erosion—black-soil cracks; shelter belts—mining",
      "Wind erosion—glacial deposition; shelter belts—salinity"
    ],
    "explanation": "Wind erosion is strongest on loose dry exposed surfaces, and shelter belts reduce it by slowing near-surface wind. The pair links an erosion process with an appropriate conservation response.",
    "sourceFactIds": [
      "INT-EROSION-WIND-SHELTER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-106",
    "qlName": "Erosion and conservation statement integration",
    "difficulty": "Medium",
    "stem": "Which statement set is correct? I. Deforestation can accelerate erosion. II. Overgrazing can expose soil. III. Mining may disturb protective land cover.",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three activities can increase erosion because they remove vegetation or disturb the soil surface. Bare or loosened soil is much easier for wind and runoff to transport.",
    "sourceFactIds": [
      "INT-EROSION-HUMAN-CAUSES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-106",
    "qlName": "Erosion and conservation statement integration",
    "difficulty": "Medium",
    "stem": "Which conservation pair is correctly matched?",
    "answer": "Contour ploughing—cross-slope furrows; terrace farming—step-like fields",
    "distractors": [
      "Contour ploughing—tree belts; terrace farming—deep gullies",
      "Contour ploughing—mining; terrace farming—overgrazing",
      "Contour ploughing—sand dunes; terrace farming—annual floods"
    ],
    "explanation": "Contour ploughing follows elevation lines to slow runoff, while terraces physically reshape steep slopes into steps. Both reduce water erosion but use different field layouts.",
    "sourceFactIds": [
      "INT-CONSERVATION-CONTOUR-TERRACE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-106",
    "qlName": "Erosion and conservation statement integration",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Strip cropping—alternating protective bands; shelter belts—rows of trees or shrubs",
    "distractors": [
      "Strip cropping—ravines; shelter belts—downhill furrows",
      "Strip cropping—deforestation; shelter belts—mining",
      "Strip cropping—river silt; shelter belts—black clay"
    ],
    "explanation": "Strip cropping interrupts erosion with alternating bands across a field, while shelter belts use woody vegetation to reduce wind speed. The two techniques differ in layout and mechanism.",
    "sourceFactIds": [
      "INT-CONSERVATION-STRIP-SHELTER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-106",
    "qlName": "Erosion and conservation statement integration",
    "difficulty": "Medium",
    "stem": "A hillside field has contour furrows and terraces, while a dry plain has tree belts across the wind. What is the common objective?",
    "answer": "Reducing soil erosion",
    "distractors": [
      "Increasing runoff speed",
      "Removing vegetation",
      "Deepening gullies"
    ],
    "explanation": "All of these practices are designed to keep soil in place. Contours and terraces mainly control water on slopes, while shelter belts mainly reduce wind erosion on exposed dry land.",
    "sourceFactIds": [
      "INT-CONSERVATION-COMMON-GOAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-107",
    "qlName": "Match-the-pairs soil integration",
    "difficulty": "Easy",
    "stem": "Which match is correct?",
    "answer": "Khadar—newer alluvium",
    "distractors": [
      "Bangar—newer alluvium",
      "Black soil—sandy desert soil",
      "Laterite—annual river deposit"
    ],
    "explanation": "Khadar is the younger form of alluvial soil and receives more recent river deposits. Bangar is older alluvium, while black and laterite soils have different origins.",
    "sourceFactIds": [
      "INT-MATCH-KHADAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-107",
    "qlName": "Match-the-pairs soil integration",
    "difficulty": "Easy",
    "stem": "Which match is correct?",
    "answer": "Black soil—Deccan basalt and cotton",
    "distractors": [
      "Arid soil—heavy rainfall and tea",
      "Forest soil—annual flood silt",
      "Laterite—western desert kankar"
    ],
    "explanation": "Black soil is strongly linked with the Deccan basalt region and is the classic cotton soil. Combining parent material and crop makes the match especially diagnostic.",
    "sourceFactIds": [
      "INT-MATCH-BLACK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-107",
    "qlName": "Match-the-pairs soil integration",
    "difficulty": "Medium",
    "stem": "Which option contains only correct matches?",
    "answer": "Alluvial—river plains; black—Maharashtra; arid—western Rajasthan",
    "distractors": [
      "Alluvial—Thar; black—Assam hills; arid—Kerala",
      "Alluvial—Himalayan ridges; black—Punjab floodplain; arid—Mahanadi delta",
      "Alluvial—lava plateau; black—western desert; arid—Brahmaputra valley"
    ],
    "explanation": "The correct option matches each soil with a standard distribution zone. Northern river plains favour alluvium, Maharashtra lies in the black-soil belt and western Rajasthan is the core arid-soil region.",
    "sourceFactIds": [
      "INT-MATCH-DISTRIBUTION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-107",
    "qlName": "Match-the-pairs soil integration",
    "difficulty": "Medium",
    "stem": "Which option contains only correct property matches?",
    "answer": "Black—moisture-retentive clay; arid—sandy and saline; laterite—strongly leached",
    "distractors": [
      "Black—annual flood silt; arid—peat; laterite—black clay cracks",
      "Black—coarse mountain soil; arid—high humus; laterite—fresh khadar",
      "Black—desert sand; arid—river silt; laterite—basaltic black clay"
    ],
    "explanation": "The first option correctly combines three characteristic property sets. Black soil is fine and moisture-retentive, arid soil is sandy and often saline, and laterite is strongly leached.",
    "sourceFactIds": [
      "INT-MATCH-PROPERTIES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-107",
    "qlName": "Match-the-pairs soil integration",
    "difficulty": "Medium",
    "stem": "Which option contains only correct conservation matches?",
    "answer": "Gully—ravines; contour ploughing—slows runoff; shelter belts—reduce wind",
    "distractors": [
      "Gully—fresh silt; contour ploughing—increases runoff; shelter belts—remove trees",
      "Gully—wind dunes; contour ploughing—mining; shelter belts—black cracks",
      "Gully—terraces; contour ploughing—salinity; shelter belts—flooding"
    ],
    "explanation": "The correct option links each term with its standard process or control. Gullies can form ravines, contour ploughing slows slope runoff and shelter belts reduce wind speed.",
    "sourceFactIds": [
      "INT-MATCH-CONSERVATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-107",
    "qlName": "Match-the-pairs soil integration",
    "difficulty": "Medium",
    "stem": "Which option contains only correct crop matches?",
    "answer": "Alluvial—wheat; black—cotton; red laterite—cashew",
    "distractors": [
      "Arid—tea; forest—cotton; black—coffee",
      "Laterite—wheat only; alluvial—cashew; black—tea",
      "Forest—sugarcane only; arid—coffee; black—cashew"
    ],
    "explanation": "Wheat is supported by fertile alluvial soil, cotton is the defining black-soil crop and cashew is linked with red laterite in parts of southern India. The set combines three standard crop relations.",
    "sourceFactIds": [
      "INT-MATCH-CROPS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-108",
    "qlName": "Full mixed-soils mastery statements",
    "difficulty": "Easy",
    "stem": "Which statement pair is correct? I. Black soil cracks deeply when dry. II. Arid soil may contain lower-horizon kankar.",
    "answer": "Both I and II",
    "distractors": [
      "I only",
      "II only",
      "Neither I nor II"
    ],
    "explanation": "Both statements are correct and refer to different diagnostic profile features. Black soil shrinks and cracks, while arid soil can accumulate calcium as kankar in lower horizons.",
    "sourceFactIds": [
      "INT-MASTER-PROFILE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-108",
    "qlName": "Full mixed-soils mastery statements",
    "difficulty": "Easy",
    "stem": "Which statement pair is correct? I. Laterite is strongly leached. II. Alluvial soil is generally fertile.",
    "answer": "Both I and II",
    "distractors": [
      "I only",
      "II only",
      "Neither I nor II"
    ],
    "explanation": "Both statements are correct. Laterite commonly loses soluble nutrients through intense leaching, whereas alluvial soil is generally fertile and supports intensive cultivation.",
    "sourceFactIds": [
      "INT-MASTER-FERTILITY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-108",
    "qlName": "Full mixed-soils mastery statements",
    "difficulty": "Medium",
    "stem": "Which set is fully correct?",
    "answer": "Black—cotton; alluvial—wheat; laterite—tea after conservation; arid—cultivable after irrigation",
    "distractors": [
      "Black—tea; alluvial—desert shrubs; laterite—cotton; arid—coffee",
      "Black—cashew; alluvial—forest only; laterite—wheat only; arid—tea",
      "Black—paddy only; alluvial—coffee; laterite—barley only; arid—cotton"
    ],
    "explanation": "The first set uses source-grounded crop and management relations. Cotton fits black soil, wheat fits alluvium, improved laterite can support tea and irrigation can make arid soil cultivable.",
    "sourceFactIds": [
      "INT-MASTER-CROPS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-108",
    "qlName": "Full mixed-soils mastery statements",
    "difficulty": "Medium",
    "stem": "Which sequence correctly identifies the clues: river deposition; basaltic clay; iron-red crystalline soil; intense leaching; sandy salinity?",
    "answer": "Alluvial, black, red-yellow, laterite, arid",
    "distractors": [
      "Black, alluvial, forest, arid, laterite",
      "Laterite, red-yellow, black, alluvial, forest",
      "Arid, forest, alluvial, black, laterite"
    ],
    "explanation": "The five clues map directly to five major soil groups. They represent depositional, basaltic, iron-coloured crystalline, strongly leached and dry saline formation environments respectively.",
    "sourceFactIds": [
      "INT-MASTER-DIAGNOSIS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-108",
    "qlName": "Full mixed-soils mastery statements",
    "difficulty": "Medium",
    "stem": "Which statement set is correct? I. Forest soil varies with slope position. II. Lower valley forest soils can be more fertile. III. High Himalayan forest soils may be acidic.",
    "answer": "I, II and III",
    "distractors": [
      "I and II only",
      "II and III only",
      "I and III only"
    ],
    "explanation": "All three statements reflect the strong relief control on forest soil. Upper and high-altitude positions differ from lower valleys in texture, humus and fertility.",
    "sourceFactIds": [
      "INT-MASTER-FOREST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-108",
    "qlName": "Full mixed-soils mastery statements",
    "difficulty": "Medium",
    "stem": "Which statement best summarises soil conservation?",
    "answer": "The method should match the main erosion process and terrain",
    "distractors": [
      "One method works equally well everywhere",
      "Erosion control requires removing all vegetation",
      "Only river deposition can conserve soil"
    ],
    "explanation": "Effective soil conservation depends on how soil is being lost and on the shape of the land. Contours and terraces suit runoff-prone slopes, while strip crops and shelter belts can control exposed field erosion.",
    "sourceFactIds": [
      "INT-MASTER-CONSERVATION"
    ]
  }
]);
export const GEO_SOI_001_CP012_REVIEW_BATCH_V1:readonly GeoSoi001Question[]=Object.freeze(RAW.map((raw,index)=>{const correctIndex=index%4;return Object.freeze({questionId:`GEO-SOI-001-CP012-Q${String(index+1).padStart(3,"0")}`,qlId:raw.qlId,qlName:raw.qlName,difficulty:raw.difficulty,stem:raw.stem,options:placeGeoSoiOptions(raw.answer,raw.distractors,correctIndex),correctIndex,canonicalAnswer:raw.answer,explanation:raw.explanation,sourceIds:GEO_SOI_001_SOURCE_IDS,sourceFactIds:Object.freeze([...raw.sourceFactIds]),reviewOnly:true as const,runtimeRegistered:false as const});}));
const BANNED=/associated with|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;
export function auditGeoSoi001Cp012ReviewBatchV1(){const issues:string[]=[];const ids=new Set<string>();const stems=new Set<string>();const explanations=new Set<string>();const qlCounts:Record<string,number>={};const difficultyCounts:Record<GeoSoi001Difficulty,number>={Easy:0,Medium:0,Hard:0};const answerPositions=[0,0,0,0];for(const q of GEO_SOI_001_CP012_REVIEW_BATCH_V1){if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);const stem=q.stem.replace(/\s+/g," ").trim().toLowerCase();if(stems.has(stem))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(stem);const exp=q.explanation.replace(/\s+/g," ").trim().toLowerCase();if(explanations.has(exp))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);explanations.add(exp);qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);const learnerText=q.stem+"\n"+q.options.join("\n")+"\n"+q.explanation;if(BANNED.test(learnerText))issues.push("STYLE:"+q.questionId);if(q.stem.length<25||q.stem.length>360||!q.stem.trim().endsWith("?"))issues.push("STEM_SHAPE:"+q.questionId);if(q.explanation.length<150)issues.push("SHORT_EXPLANATION:"+q.questionId);if((q.explanation.match(/[.!?](?:\s|$)/g)??[]).length<2)issues.push("EXPLANATION_DEPTH:"+q.questionId);}if(GEO_SOI_001_CP012_REVIEW_BATCH_V1.length!==54)issues.push("COUNT:"+GEO_SOI_001_CP012_REVIEW_BATCH_V1.length);for(let n=100;n<=108;n+=1){const qlId="GEO-SOI-001-QL-"+String(n).padStart(3,"0");if(qlCounts[qlId]!==6)issues.push("QL_COUNT:"+qlId+":"+(qlCounts[qlId]??0));}if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==30||difficultyCounts.Hard!==6)issues.push("DIFFICULTY:"+JSON.stringify(difficultyCounts));if(answerPositions.join(",")!=="14,14,13,13")issues.push("ANSWER_POSITIONS:"+answerPositions.join(","));if(stems.size!==54)issues.push("STEM_COUNT:"+stems.size);if(explanations.size!==54)issues.push("EXPLANATION_COUNT:"+explanations.size);return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_SOI_001_CP012_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});}
