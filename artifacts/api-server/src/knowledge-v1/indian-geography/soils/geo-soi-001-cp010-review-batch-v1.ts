import {
  GEO_SOI_001_SOURCE_IDS,
  placeGeoSoiOptions,
  type GeoSoi001Difficulty,
  type GeoSoi001Question,
} from "./geo-soi-001-review-types";

type RawQuestion = Readonly<{
  qlId: string;
  qlName: string;
  difficulty: GeoSoi001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-SOI-001-QL-082",
    "qlName": "Texture comparison across major soils",
    "difficulty": "Easy",
    "stem": "Which soil is made of extremely fine clayey material?",
    "answer": "Black soil",
    "distractors": [
      "Arid soil",
      "Forest soil on upper slopes",
      "Khadar only"
    ],
    "explanation": "Black soil is made of extremely fine clayey material. This fine texture is one reason it holds moisture well and behaves very differently from sandy arid soil.",
    "sourceFactIds": [
      "TEXTURE-BLACK-CLAY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-082",
    "qlName": "Texture comparison across major soils",
    "difficulty": "Easy",
    "stem": "Which soil is generally sandy in texture?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Laterite soil only",
      "Khadar only"
    ],
    "explanation": "Arid soil is generally sandy in texture, reflecting its dry desert environment. This contrasts strongly with the fine clayey material of black soil and provides a useful texture-based identification clue.",
    "sourceFactIds": [
      "TEXTURE-ARID-SANDY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-082",
    "qlName": "Texture comparison across major soils",
    "difficulty": "Medium",
    "stem": "Which comparison is correct?",
    "answer": "Black soil is fine and clayey, while arid soil is generally sandy",
    "distractors": [
      "Both are usually sandy",
      "Both are always heavy clay",
      "Arid soil is finer than black soil"
    ],
    "explanation": "Black soil contains extremely fine clay particles, whereas arid soil is usually sandy. The contrast is one of the clearest texture-based ways to distinguish the two soil groups.",
    "sourceFactIds": [
      "TEXTURE-BLACK-ARID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-082",
    "qlName": "Texture comparison across major soils",
    "difficulty": "Medium",
    "stem": "A valley-side mountain soil is loamy-silty, while an upper-slope soil is coarse. Which soil group shows this relief-linked texture change?",
    "answer": "Forest soil",
    "distractors": [
      "Black soil",
      "Arid soil",
      "Alluvial soil only"
    ],
    "explanation": "Forest soil changes texture with mountain position. Valley sides tend to be loamy and silty, while upper slopes are often coarse because erosion removes finer material.",
    "sourceFactIds": [
      "TEXTURE-FOREST-RELIEF"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-082",
    "qlName": "Texture comparison across major soils",
    "difficulty": "Medium",
    "stem": "Which soil can contain varying proportions of sand, silt and clay?",
    "answer": "Alluvial soil",
    "distractors": [
      "Black soil only",
      "Arid soil only",
      "Forest soil only"
    ],
    "explanation": "Alluvial soil contains different proportions of sand, silt and clay depending on where river material is deposited. Its texture therefore varies more than a single fixed description would suggest.",
    "sourceFactIds": [
      "TEXTURE-ALLUVIAL-MIX"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-082",
    "qlName": "Texture comparison across major soils",
    "difficulty": "Hard",
    "stem": "A profile is very clayey and moisture-retentive, another is sandy and saline, and a third becomes loamy-silty down a mountain valley. Which sequence is correct?",
    "answer": "Black, arid, forest",
    "distractors": [
      "Arid, black, alluvial",
      "Forest, laterite, black",
      "Alluvial, forest, arid"
    ],
    "explanation": "Very fine moisture-retentive clay points to black soil, sandy saline material points to arid soil and loamy-silty valley-side material points to forest soil. The sequence uses texture as the main discriminator.",
    "sourceFactIds": [
      "TEXTURE-INTEGRATED-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-083",
    "qlName": "Moisture retention, cracking and workability comparison",
    "difficulty": "Easy",
    "stem": "Which soil is especially well known for holding moisture?",
    "answer": "Black soil",
    "distractors": [
      "Arid soil",
      "Forest soil on upper slopes",
      "Laterite soil"
    ],
    "explanation": "Black soil has a very high moisture-holding capacity because of its fine clayey texture. This helps crops withstand dry periods after rainfall has stopped.",
    "sourceFactIds": [
      "MOISTURE-BLACK-HOLD"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-083",
    "qlName": "Moisture retention, cracking and workability comparison",
    "difficulty": "Easy",
    "stem": "Which soil commonly lacks moisture because evaporation is rapid?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Khadar",
      "Lower-valley forest soil"
    ],
    "explanation": "Arid soil has low moisture because the dry climate and high temperature cause rapid evaporation. Rainfall is limited, so lost water is not replaced easily.",
    "sourceFactIds": [
      "MOISTURE-ARID-LOW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-083",
    "qlName": "Moisture retention, cracking and workability comparison",
    "difficulty": "Medium",
    "stem": "Which soil commonly develops deep cracks during hot weather?",
    "answer": "Black soil",
    "distractors": [
      "Arid soil",
      "Laterite soil",
      "Alluvial soil"
    ],
    "explanation": "Black soil shrinks on drying and develops deep cracks during hot weather. These cracks improve aeration and are part of the characteristic shrink-swell behaviour of the soil.",
    "sourceFactIds": [
      "MOISTURE-BLACK-CRACKS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-083",
    "qlName": "Moisture retention, cracking and workability comparison",
    "difficulty": "Medium",
    "stem": "Why is black soil difficult to work when wet?",
    "answer": "Its fine clay becomes sticky",
    "distractors": [
      "Its sand becomes loose",
      "Its kankar layer melts",
      "Its river silt disappears"
    ],
    "explanation": "Black soil becomes sticky when wet because of its high clay content. It is therefore easier to till soon after the first shower or during the pre-monsoon period.",
    "sourceFactIds": [
      "MOISTURE-BLACK-STICKY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-083",
    "qlName": "Moisture retention, cracking and workability comparison",
    "difficulty": "Medium",
    "stem": "Which moisture comparison between black and arid soils is correct?",
    "answer": "Black soil retains moisture strongly, while arid soil commonly has little moisture",
    "distractors": [
      "Arid soil holds more moisture than black soil",
      "Both are permanently waterlogged",
      "Both lose all moisture at the same rate"
    ],
    "explanation": "Black soil stores water effectively in its fine clay, whereas arid soil loses water rapidly under hot dry conditions. Their moisture behaviour reflects very different textures and climates.",
    "sourceFactIds": [
      "MOISTURE-COMPARISON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-083",
    "qlName": "Moisture retention, cracking and workability comparison",
    "difficulty": "Hard",
    "stem": "A farmer finds one soil sticky when wet and deeply cracked when dry, while another remains sandy and moisture-poor. Which soils are these?",
    "answer": "Black soil and arid soil",
    "distractors": [
      "Alluvial soil and laterite soil",
      "Forest soil and black soil",
      "Laterite soil and khadar"
    ],
    "explanation": "Sticky wet behaviour plus deep dry cracks identifies black soil, while sandy low-moisture conditions identify arid soil. The pair contrasts clay shrink-swell behaviour with dry-region sandiness.",
    "sourceFactIds": [
      "MOISTURE-WORKABILITY-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-084",
    "qlName": "Colour comparison across soils",
    "difficulty": "Easy",
    "stem": "Which soil is naturally black in colour and also called regur?",
    "answer": "Black soil",
    "distractors": [
      "Red and yellow soil",
      "Arid soil",
      "Laterite soil"
    ],
    "explanation": "Black soil is dark in colour and is also known as regur. The colour is one of its most direct identifying features in Indian geography questions, especially when paired with clayey texture.",
    "sourceFactIds": [
      "COLOUR-BLACK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-084",
    "qlName": "Colour comparison across soils",
    "difficulty": "Easy",
    "stem": "Which soil group shows red and yellow colours depending on the form of iron?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Black soil",
      "Arid soil",
      "Alluvial soil"
    ],
    "explanation": "Red and yellow soils get their colour from iron in crystalline and metamorphic rocks. The soil appears red when iron is diffused and yellow when it is hydrated.",
    "sourceFactIds": [
      "COLOUR-RED-YELLOW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-084",
    "qlName": "Colour comparison across soils",
    "difficulty": "Medium",
    "stem": "Which soil ranges from red to brown in colour under dry conditions?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Khadar",
      "Forest soil only"
    ],
    "explanation": "Arid soil commonly ranges from red to brown. The colour clue becomes stronger when it appears with sandy texture, salinity and a dry western setting such as western Rajasthan.",
    "sourceFactIds": [
      "COLOUR-ARID-RED-BROWN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-084",
    "qlName": "Colour comparison across soils",
    "difficulty": "Medium",
    "stem": "Why can the same red-yellow soil group appear in two colours?",
    "answer": "Iron appears red when diffused and yellow when hydrated",
    "distractors": [
      "Salt changes black soil into yellow",
      "Annual floods paint the soil red",
      "Kankar makes forest soil yellow"
    ],
    "explanation": "The colour difference comes from the state of iron compounds in the soil. Diffused iron gives a reddish appearance, while hydrated iron produces a yellowish colour.",
    "sourceFactIds": [
      "COLOUR-IRON-HYDRATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-084",
    "qlName": "Colour comparison across soils",
    "difficulty": "Medium",
    "stem": "Which colour-based comparison is correct?",
    "answer": "Black soil is dark, red-yellow soil reflects iron, and arid soil is often red-brown",
    "distractors": [
      "All three are always black",
      "Arid soil is always blue",
      "Red-yellow soil never contains iron"
    ],
    "explanation": "Each soil has a characteristic colour clue: black soil is dark, red-yellow soil reflects iron chemistry and arid soil commonly ranges from red to brown. These clues help with rapid identification.",
    "sourceFactIds": [
      "COLOUR-THREE-SOILS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-084",
    "qlName": "Colour comparison across soils",
    "difficulty": "Hard",
    "stem": "A sample is red when iron is diffused, yellow when hydrated; another is red-brown and sandy. Which soils are indicated?",
    "answer": "Red-yellow soil and arid soil",
    "distractors": [
      "Black soil and alluvial soil",
      "Laterite soil and black soil",
      "Forest soil and khadar"
    ],
    "explanation": "The first sample is red-yellow soil because its colour changes with iron hydration, while the second is arid soil because red-brown colour combines with sandy texture. The clues separate two visually similar soil families.",
    "sourceFactIds": [
      "COLOUR-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-085",
    "qlName": "Fertility, nutrients and humus comparison",
    "difficulty": "Easy",
    "stem": "Which soil is generally very fertile and supports intensive cultivation?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Laterite soil",
      "High Himalayan forest soil"
    ],
    "explanation": "Alluvial soil is generally very fertile and contains useful amounts of potash, phosphoric acid and lime. This supports intensive cultivation across major plains and deltas.",
    "sourceFactIds": [
      "FERTILITY-ALLUVIAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-085",
    "qlName": "Fertility, nutrients and humus comparison",
    "difficulty": "Easy",
    "stem": "Which soil is generally deficient in plant nutrients because of strong leaching?",
    "answer": "Laterite soil",
    "distractors": [
      "Alluvial soil",
      "Black soil",
      "Khadar only"
    ],
    "explanation": "Laterite soil is strongly leached by heavy rainfall and is commonly deficient in plant nutrients. It often needs conservation and fertility management before intensive cultivation.",
    "sourceFactIds": [
      "FERTILITY-LATERITE-LOW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-085",
    "qlName": "Fertility, nutrients and humus comparison",
    "difficulty": "Medium",
    "stem": "Which nutrient statement best fits black soil?",
    "answer": "Rich in calcium carbonate, magnesium, potash and lime but poor in phosphoric content",
    "distractors": [
      "Rich only in humus and salt",
      "Poor in every mineral",
      "Dominated by fresh river phosphates only"
    ],
    "explanation": "Black soil contains several useful mineral nutrients, including calcium carbonate, magnesium, potash and lime. At the same time, it is generally poor in phosphoric content.",
    "sourceFactIds": [
      "FERTILITY-BLACK-NUTRIENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-085",
    "qlName": "Fertility, nutrients and humus comparison",
    "difficulty": "Medium",
    "stem": "Which soil commonly has low humus because of dry climate and rapid evaporation?",
    "answer": "Arid soil",
    "distractors": [
      "Alluvial soil",
      "Black soil",
      "Lower-valley forest soil"
    ],
    "explanation": "Arid soil commonly lacks humus and moisture under hot dry conditions. Sparse vegetation and rapid water loss limit the build-up of organic matter in the surface soil.",
    "sourceFactIds": [
      "FERTILITY-ARID-HUMUS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-085",
    "qlName": "Fertility, nutrients and humus comparison",
    "difficulty": "Medium",
    "stem": "How can forest-soil fertility differ within the same mountain system?",
    "answer": "High Himalayan soils may be acidic and low-humus, while lower valley soils can be fertile",
    "distractors": [
      "All mountain soils are equally fertile",
      "Upper slopes are always most fertile",
      "Valley soils are always saline"
    ],
    "explanation": "Forest soil changes greatly with altitude and slope position. High Himalayan zones can be acidic and low in humus, while lower terraces and alluvial fans can accumulate fertile material.",
    "sourceFactIds": [
      "FERTILITY-FOREST-CONTRAST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-085",
    "qlName": "Fertility, nutrients and humus comparison",
    "difficulty": "Hard",
    "stem": "Which sequence correctly matches fertility clues: very fertile river soil; nutrient-deficient leached soil; mineral-rich but phosphoric-poor dark clay?",
    "answer": "Alluvial, laterite, black",
    "distractors": [
      "Arid, forest, alluvial",
      "Black, alluvial, arid",
      "Laterite, black, forest"
    ],
    "explanation": "Very fertile river soil points to alluvium, while strong leaching and nutrient deficiency point to laterite. Dark clay rich in several minerals but poor in phosphoric content identifies black soil.",
    "sourceFactIds": [
      "FERTILITY-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-086",
    "qlName": "Formation-process comparison",
    "difficulty": "Easy",
    "stem": "Which soil is formed chiefly by river deposition?",
    "answer": "Alluvial soil",
    "distractors": [
      "Black soil",
      "Laterite soil",
      "Arid soil"
    ],
    "explanation": "Alluvial soil forms from sediments deposited by rivers across plains, valleys and deltas. Its origin is depositional rather than volcanic or strongly leached.",
    "sourceFactIds": [
      "FORMATION-ALLUVIAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-086",
    "qlName": "Formation-process comparison",
    "difficulty": "Easy",
    "stem": "Which soil is strongly linked with Deccan basalt and lava flows?",
    "answer": "Black soil",
    "distractors": [
      "Alluvial soil",
      "Arid soil",
      "Forest soil"
    ],
    "explanation": "Black soil is typical of the Deccan Trap basalt region and develops from weathered lava material. Parent rock is therefore a major clue to its formation.",
    "sourceFactIds": [
      "FORMATION-BLACK-BASALT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-086",
    "qlName": "Formation-process comparison",
    "difficulty": "Medium",
    "stem": "Which soil results from intense leaching under heavy rainfall?",
    "answer": "Laterite soil",
    "distractors": [
      "Black soil",
      "Arid soil",
      "Khadar"
    ],
    "explanation": "Laterite soil develops through intense leaching under heavy rain in tropical and subtropical climates. Water removes soluble materials and leaves a strongly weathered soil profile.",
    "sourceFactIds": [
      "FORMATION-LATERITE-LEACHING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-086",
    "qlName": "Formation-process comparison",
    "difficulty": "Medium",
    "stem": "Which soil develops on crystalline igneous rocks in low-rainfall parts of the Deccan?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Alluvial soil",
      "Black soil",
      "Forest soil"
    ],
    "explanation": "Red soil develops on crystalline igneous rocks under relatively low rainfall in eastern and southern Deccan regions. Iron in the parent material contributes to its characteristic colour.",
    "sourceFactIds": [
      "FORMATION-RED-CRYSTALLINE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-086",
    "qlName": "Formation-process comparison",
    "difficulty": "Medium",
    "stem": "Which process pair is correctly matched?",
    "answer": "Alluvial—river deposition; laterite—intense leaching",
    "distractors": [
      "Black—annual flood deposition; arid—heavy leaching",
      "Forest—desert evaporation; red soil—glacial deposition",
      "Laterite—lava flows; alluvial—kankar formation only"
    ],
    "explanation": "Alluvial soil is built by river deposition, whereas laterite is produced by strong leaching under heavy rainfall. The pair contrasts accumulation of transported material with removal of soluble material.",
    "sourceFactIds": [
      "FORMATION-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-086",
    "qlName": "Formation-process comparison",
    "difficulty": "Hard",
    "stem": "One soil is deposited by rivers, another forms from Deccan lava and a third develops by intense leaching. Which sequence is correct?",
    "answer": "Alluvial, black, laterite",
    "distractors": [
      "Black, arid, forest",
      "Laterite, alluvial, red-yellow",
      "Arid, forest, black"
    ],
    "explanation": "River deposition identifies alluvial soil, Deccan lava identifies black soil and intense leaching identifies laterite. The three processes represent distinct depositional, volcanic-weathering and leaching pathways.",
    "sourceFactIds": [
      "FORMATION-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-087",
    "qlName": "Profile markers: khadar, bangar, cracks and kankar",
    "difficulty": "Easy",
    "stem": "Which younger alluvial soil is renewed by recent river deposits?",
    "answer": "Khadar",
    "distractors": [
      "Bangar",
      "Black soil",
      "Arid soil"
    ],
    "explanation": "Khadar is the newer alluvial soil formed from recent river deposits. It generally contains finer particles and is more fertile than older bangar alluvium.",
    "sourceFactIds": [
      "PROFILE-KHADAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-087",
    "qlName": "Profile markers: khadar, bangar, cracks and kankar",
    "difficulty": "Easy",
    "stem": "Which older alluvial soil commonly has more kankar nodules than khadar?",
    "answer": "Bangar",
    "distractors": [
      "Khadar",
      "Black soil",
      "Laterite soil"
    ],
    "explanation": "Bangar is the older alluvial soil and commonly contains more kankar nodules than khadar. The distinction helps separate the two age classes of alluvium.",
    "sourceFactIds": [
      "PROFILE-BANGAR-KANKAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-087",
    "qlName": "Profile markers: khadar, bangar, cracks and kankar",
    "difficulty": "Medium",
    "stem": "Deep cracks during hot weather are a characteristic profile clue for which soil?",
    "answer": "Black soil",
    "distractors": [
      "Alluvial soil",
      "Laterite soil",
      "Forest soil"
    ],
    "explanation": "Black soil develops deep cracks as its clay shrinks during hot dry weather. These cracks improve aeration and are one of the soil's most recognisable profile features.",
    "sourceFactIds": [
      "PROFILE-BLACK-CRACKS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-087",
    "qlName": "Profile markers: khadar, bangar, cracks and kankar",
    "difficulty": "Medium",
    "stem": "A hard kankar layer in the lower horizon that restricts infiltration is typical of which soil?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Khadar",
      "Laterite soil"
    ],
    "explanation": "Arid soil can accumulate calcium downward, forming a hard kankar layer in lower horizons. This layer restricts the downward movement of water through the profile.",
    "sourceFactIds": [
      "PROFILE-ARID-KANKAR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-087",
    "qlName": "Profile markers: khadar, bangar, cracks and kankar",
    "difficulty": "Medium",
    "stem": "Which comparison correctly distinguishes bangar kankar from arid-soil kankar?",
    "answer": "Bangar has more kankar than khadar, while arid kankar forms a lower-horizon calcium layer",
    "distractors": [
      "Both refer only to black-soil cracks",
      "Both are fresh river silt",
      "Neither contains calcium"
    ],
    "explanation": "Bangar is older alluvium with more kankar nodules than khadar, while arid soil develops a calcium-rich kankar layer deeper in the profile. The terms overlap in material but not in soil context.",
    "sourceFactIds": [
      "PROFILE-KANKAR-COMPARE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-087",
    "qlName": "Profile markers: khadar, bangar, cracks and kankar",
    "difficulty": "Hard",
    "stem": "A profile has old alluvium with kankar, another has deep shrink cracks, and a third has a hard lower calcium layer. Which sequence is correct?",
    "answer": "Bangar, black soil, arid soil",
    "distractors": [
      "Khadar, laterite, forest soil",
      "Black soil, alluvial soil, laterite",
      "Arid soil, khadar, black soil"
    ],
    "explanation": "Old alluvium with kankar indicates bangar, deep shrink cracks indicate black soil and a hard lower calcium layer indicates arid soil. These profile markers are highly diagnostic when used together.",
    "sourceFactIds": [
      "PROFILE-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-088",
    "qlName": "Climate and relief comparison",
    "difficulty": "Easy",
    "stem": "Which soil develops under heavy rainfall and intense leaching?",
    "answer": "Laterite soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Khadar"
    ],
    "explanation": "Laterite soil develops in warm climates with heavy rainfall and strong leaching. Its climatic setting contrasts sharply with the hot dry environment of arid soil.",
    "sourceFactIds": [
      "CLIMATE-LATERITE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-088",
    "qlName": "Climate and relief comparison",
    "difficulty": "Easy",
    "stem": "Which soil is typical of hot dry regions with rapid evaporation?",
    "answer": "Arid soil",
    "distractors": [
      "Laterite soil",
      "Alluvial soil",
      "Forest soil"
    ],
    "explanation": "Arid soil develops under dry climatic conditions where high temperature causes rapid evaporation. This explains its low moisture, low humus and frequent salinity.",
    "sourceFactIds": [
      "CLIMATE-ARID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-088",
    "qlName": "Climate and relief comparison",
    "difficulty": "Medium",
    "stem": "Which soil is strongly tied to hilly and mountainous relief with forest cover?",
    "answer": "Forest soil",
    "distractors": [
      "Alluvial soil",
      "Arid soil",
      "Black soil"
    ],
    "explanation": "Forest soil is characteristic of hilly and mountainous terrain where sufficient rainfall supports forests. Altitude and slope position then control texture and fertility.",
    "sourceFactIds": [
      "CLIMATE-FOREST-RELIEF"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-088",
    "qlName": "Climate and relief comparison",
    "difficulty": "Medium",
    "stem": "Which soil is most typical of extensive depositional plains and river deltas?",
    "answer": "Alluvial soil",
    "distractors": [
      "Forest soil",
      "Arid soil",
      "Laterite soil"
    ],
    "explanation": "Alluvial soil dominates major river plains and eastern coastal deltas because it is built from transported sediments. Relief is generally low and depositional rather than steep and erosional.",
    "sourceFactIds": [
      "CLIMATE-ALLUVIAL-RELIEF"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-088",
    "qlName": "Climate and relief comparison",
    "difficulty": "Medium",
    "stem": "Which climate comparison between laterite and arid soils is correct?",
    "answer": "Laterite reflects heavy rainfall, while arid soil reflects dryness and rapid evaporation",
    "distractors": [
      "Both require identical rainfall",
      "Arid soil forms by intense leaching",
      "Laterite forms only in deserts"
    ],
    "explanation": "Laterite and arid soils form under opposite moisture regimes. Laterite develops with heavy rain and leaching, whereas arid soil develops where rainfall is limited and evaporation is strong.",
    "sourceFactIds": [
      "CLIMATE-LATERITE-ARID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-088",
    "qlName": "Climate and relief comparison",
    "difficulty": "Medium",
    "stem": "A steep forested mountain, a hot wet upland and a dry desert plain would most likely carry which soils respectively?",
    "answer": "Forest, laterite and arid",
    "distractors": [
      "Alluvial, black and forest",
      "Arid, forest and khadar",
      "Black, alluvial and laterite"
    ],
    "explanation": "Forested mountains favour forest soil, hot wet uplands favour laterite through leaching and dry desert plains favour arid soil. Relief and climate together explain the sequence.",
    "sourceFactIds": [
      "CLIMATE-THREE-SETTINGS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-089",
    "qlName": "Two-clue comparative soil identification",
    "difficulty": "Easy",
    "stem": "A soil is black, clayey and holds moisture well. Which soil is it?",
    "answer": "Black soil",
    "distractors": [
      "Arid soil",
      "Laterite soil",
      "Forest soil"
    ],
    "explanation": "Black colour plus very fine clay and strong moisture retention identifies black soil. The combination is more reliable than using colour alone because several Indian soils can share reddish or brownish shades.",
    "sourceFactIds": [
      "ID-BLACK-TWO-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-089",
    "qlName": "Two-clue comparative soil identification",
    "difficulty": "Easy",
    "stem": "A soil is sandy, saline and moisture-poor. Which soil is it?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Alluvial soil",
      "Forest soil"
    ],
    "explanation": "Sandiness, salinity and low moisture form a classic arid-soil combination. These features result from the hot dry climate and strong evaporation of western desert regions.",
    "sourceFactIds": [
      "ID-ARID-TWO-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-089",
    "qlName": "Two-clue comparative soil identification",
    "difficulty": "Medium",
    "stem": "A soil is strongly leached, acidic and deficient in plant nutrients. Which soil is indicated?",
    "answer": "Laterite soil",
    "distractors": [
      "Alluvial soil",
      "Black soil",
      "Khadar"
    ],
    "explanation": "Strong leaching, acidity and nutrient deficiency together point to laterite soil. Heavy rainfall removes soluble materials and leaves the profile chemically depleted.",
    "sourceFactIds": [
      "ID-LATERITE-TWO-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-089",
    "qlName": "Two-clue comparative soil identification",
    "difficulty": "Medium",
    "stem": "A soil is formed by river deposits and is highly fertile. Which soil is indicated?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Black soil",
      "Laterite soil"
    ],
    "explanation": "River deposition identifies alluvial soil, and high fertility is one of its major agricultural strengths. The same soil dominates the northern plains and important coastal deltas.",
    "sourceFactIds": [
      "ID-ALLUVIAL-TWO-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-089",
    "qlName": "Two-clue comparative soil identification",
    "difficulty": "Medium",
    "stem": "A soil is coarse on upper slopes but loamy-silty on valley sides. Which soil is indicated?",
    "answer": "Forest soil",
    "distractors": [
      "Black soil",
      "Arid soil",
      "Khadar"
    ],
    "explanation": "Relief-sensitive texture is a defining feature of forest soil in mountains. Erosion leaves coarse material higher up, while finer particles accumulate along valley sides.",
    "sourceFactIds": [
      "ID-FOREST-TWO-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-089",
    "qlName": "Two-clue comparative soil identification",
    "difficulty": "Medium",
    "stem": "A soil forms on crystalline rocks, appears red from iron diffusion and yellow when hydrated. Which soil is indicated?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Black soil",
      "Arid soil",
      "Alluvial soil"
    ],
    "explanation": "Crystalline parent rock and iron-controlled colour identify red and yellow soil. The red appearance comes from diffused iron, while hydration produces the yellow form.",
    "sourceFactIds": [
      "ID-REDYELLOW-TWO-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-090",
    "qlName": "Integrated comparative diagnosis",
    "difficulty": "Easy",
    "stem": "Which soil best fits the clues: river-deposited, very fertile and suitable for many cereals and pulses?",
    "answer": "Alluvial soil",
    "distractors": [
      "Arid soil",
      "Laterite soil",
      "Forest soil"
    ],
    "explanation": "River deposition and high fertility identify alluvial soil. Its nutrient supply supports wheat, other cereals, pulses, paddy and sugarcane across intensively cultivated plains.",
    "sourceFactIds": [
      "DIAG-ALLUVIAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-090",
    "qlName": "Integrated comparative diagnosis",
    "difficulty": "Easy",
    "stem": "Which soil best fits the clues: Deccan basalt, dark clay, deep summer cracks and cotton suitability?",
    "answer": "Black soil",
    "distractors": [
      "Laterite soil",
      "Arid soil",
      "Alluvial soil"
    ],
    "explanation": "Deccan basalt, dark clay and deep shrink cracks all identify black soil. Cotton suitability reinforces the diagnosis because the soil is also known as black cotton soil.",
    "sourceFactIds": [
      "DIAG-BLACK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-090",
    "qlName": "Integrated comparative diagnosis",
    "difficulty": "Medium",
    "stem": "Which soil best fits the clues: heavy rain, intense leaching, acidity, nutrient deficiency and tea/coffee after conservation?",
    "answer": "Laterite soil",
    "distractors": [
      "Alluvial soil",
      "Arid soil",
      "Black soil"
    ],
    "explanation": "Heavy rain and intense leaching produce laterite, while acidity and nutrient deficiency describe its chemistry. Conservation can improve hilly lateritic land for tea and coffee.",
    "sourceFactIds": [
      "DIAG-LATERITE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-090",
    "qlName": "Integrated comparative diagnosis",
    "difficulty": "Medium",
    "stem": "Which soil best fits the clues: red-brown colour, sandy texture, salinity, low humus and lower-horizon kankar?",
    "answer": "Arid soil",
    "distractors": [
      "Black soil",
      "Forest soil",
      "Alluvial soil"
    ],
    "explanation": "The entire clue set belongs to arid soil. Dry climate and rapid evaporation explain sandiness, salinity, low humus and the development of calcium-rich kankar lower in the profile.",
    "sourceFactIds": [
      "DIAG-ARID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-090",
    "qlName": "Integrated comparative diagnosis",
    "difficulty": "Medium",
    "stem": "Which soil best fits the clues: mountain relief, coarse upper slopes, loamy-silty valley sides and fertile lower terraces?",
    "answer": "Forest soil",
    "distractors": [
      "Black soil",
      "Arid soil",
      "Laterite soil"
    ],
    "explanation": "Forest soil varies with mountain position. Upper slopes are coarser, valley sides can be loamy-silty and lower terraces or alluvial fans can develop fertile deposits.",
    "sourceFactIds": [
      "DIAG-FOREST"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-090",
    "qlName": "Integrated comparative diagnosis",
    "difficulty": "Medium",
    "stem": "Which sequence correctly identifies five clue sets: river deposit; basaltic dark clay; iron-red crystalline soil; strongly leached hot-wet soil; sandy saline desert soil?",
    "answer": "Alluvial, black, red-yellow, laterite, arid",
    "distractors": [
      "Black, alluvial, arid, forest, laterite",
      "Laterite, red-yellow, alluvial, black, forest",
      "Arid, forest, black, alluvial, laterite"
    ],
    "explanation": "River deposits indicate alluvial soil, while basaltic dark clay indicates black soil and iron-red crystalline material indicates red-yellow soil. Strong leaching then identifies laterite, while sandy salinity identifies arid soil.",
    "sourceFactIds": [
      "DIAG-FIVE-SOILS"
    ]
  }
]);

export const GEO_SOI_001_CP010_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = (index + 3) % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP010-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoSoiOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: GEO_SOI_001_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;

export function auditGeoSoi001Cp010ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP010_REVIEW_BATCH_V1) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    const stem = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push("DUPLICATE_STEM:" + q.questionId);
    stems.add(stem);
    const exp = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(exp)) issues.push("DUPLICATE_EXPLANATION:" + q.questionId);
    explanations.add(exp);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
    const learnerText = q.stem + "\n" + q.options.join("\n") + "\n" + q.explanation;
    if (BANNED.test(learnerText)) issues.push("STYLE:" + q.questionId);
    if (q.stem.length < 25 || q.stem.length > 360 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 150) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_SOI_001_CP010_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP010_REVIEW_BATCH_V1.length);
  for (let n = 82; n <= 90; n += 1) {
    const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,13,13,14") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_SOI_001_CP010_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
