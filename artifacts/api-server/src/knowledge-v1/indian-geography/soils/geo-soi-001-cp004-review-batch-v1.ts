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
    "qlId": "GEO-SOI-001-QL-028",
    "qlName": "Crystalline igneous-rock origin",
    "difficulty": "Easy",
    "stem": "Red and yellow soils commonly develop from which kind of parent rock?",
    "answer": "Crystalline igneous rocks",
    "distractors": [
      "Recent river alluvium",
      "Coral limestone only",
      "Wind-blown dune sand only"
    ],
    "explanation": "Red and yellow soils commonly develop on crystalline igneous rocks. Weathering of these rocks supplies the mineral material from which the soil forms under suitable climatic conditions.",
    "sourceFactIds": [
      "RY-CRYSTALLINE-IGNEOUS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-028",
    "qlName": "Crystalline igneous-rock origin",
    "difficulty": "Easy",
    "stem": "Which parent material is most closely linked with the formation of red soil in peninsular India?",
    "answer": "Weathered crystalline igneous rock",
    "distractors": [
      "Fresh floodplain silt",
      "Marine coral deposits",
      "Permanent glacial ice"
    ],
    "explanation": "Red soil commonly develops from weathered crystalline igneous rocks in parts of peninsular India. The rock provides mineral material, while climate and drainage influence how the soil develops.",
    "sourceFactIds": [
      "RY-PARENT-MATERIAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-028",
    "qlName": "Crystalline igneous-rock origin",
    "difficulty": "Medium",
    "stem": "A soil forms directly over old crystalline igneous rocks rather than from recent river deposits. Which soil group is a likely fit in low-rainfall parts of the Deccan?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Khadar",
      "Bhangar",
      "Deltaic alluvium"
    ],
    "explanation": "Red and yellow soils are linked with crystalline igneous parent rocks in parts of the Deccan plateau. Khadar, bhangar and deltaic soils are river-deposited alluvial forms, so their origin is different.",
    "sourceFactIds": [
      "RY-ORIGIN-VS-ALLUVIUM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-028",
    "qlName": "Crystalline igneous-rock origin",
    "difficulty": "Medium",
    "stem": "Which sequence best represents the basic origin of red and yellow soil?",
    "answer": "Crystalline igneous rock → weathering → red or yellow soil development",
    "distractors": [
      "River flood → fresh silt → regur",
      "Coral reef → uplift → khadar",
      "Glacier melt → dune formation → laterite"
    ],
    "explanation": "The usual school-level explanation begins with weathering of crystalline igneous rocks. The resulting mineral material develops into red or yellow soil under suitable climate and moisture conditions.",
    "sourceFactIds": [
      "RY-ORIGIN-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-028",
    "qlName": "Crystalline igneous-rock origin",
    "difficulty": "Medium",
    "stem": "Why is parent rock important in red and yellow soil formation?",
    "answer": "It supplies the mineral material from which the soil develops",
    "distractors": [
      "It fixes annual rainfall by itself",
      "It prevents all weathering",
      "It renews the soil through floods every year"
    ],
    "explanation": "Parent rock provides the starting mineral material for soil formation. In red and yellow soils, weathered crystalline igneous rocks are a major source of that material.",
    "sourceFactIds": [
      "RY-PARENT-ROLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-028",
    "qlName": "Crystalline igneous-rock origin",
    "difficulty": "Hard",
    "stem": "Two sites receive similar rainfall, but one lies on crystalline igneous rock and the other on fresh river alluvium. Which site is more likely to develop typical red and yellow soil?",
    "answer": "The site on crystalline igneous rock",
    "distractors": [
      "The site on fresh river alluvium",
      "Both must form khadar",
      "Parent material has no effect on soil formation"
    ],
    "explanation": "Parent material is one of the major controls of soil formation. With rainfall held similar, crystalline igneous rock better matches the standard origin of red and yellow soil, while fresh river deposits favour alluvial soil.",
    "sourceFactIds": [
      "RY-PARENT-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-029",
    "qlName": "Low-rainfall formation setting",
    "difficulty": "Easy",
    "stem": "Red and yellow soils commonly develop in areas of what rainfall condition?",
    "answer": "Low rainfall",
    "distractors": [
      "Very high rainfall only",
      "Permanent snowfall",
      "Daily river flooding"
    ],
    "explanation": "Red and yellow soils commonly develop in low-rainfall parts of the eastern and southern Deccan plateau. The climate is less strongly leaching than the very wet conditions linked with laterite formation.",
    "sourceFactIds": [
      "RY-LOW-RAINFALL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-029",
    "qlName": "Low-rainfall formation setting",
    "difficulty": "Easy",
    "stem": "Which climatic setting best fits the standard formation of red and yellow soil?",
    "answer": "A relatively dry tropical setting with low rainfall",
    "distractors": [
      "A permanently frozen polar setting",
      "A constantly flooded river delta only",
      "A very wet mountain rainforest only"
    ],
    "explanation": "Low rainfall is an important part of the standard description of red and yellow soil formation. This helps distinguish the soil from strongly leached laterite formed under much wetter conditions.",
    "sourceFactIds": [
      "RY-DRY-SETTING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-029",
    "qlName": "Low-rainfall formation setting",
    "difficulty": "Medium",
    "stem": "Why is low rainfall useful as a clue for identifying red and yellow soil?",
    "answer": "Its standard formation zone includes low-rainfall parts of the Deccan plateau",
    "distractors": [
      "It forms only under permanent snow",
      "Low rainfall automatically produces alluvial soil",
      "Rainfall has no relation to soil formation"
    ],
    "explanation": "Red and yellow soil is commonly linked with low-rainfall areas over crystalline rocks in the Deccan plateau. The rainfall clue becomes stronger when combined with rock type and regional location.",
    "sourceFactIds": [
      "RY-LOW-RAIN-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-029",
    "qlName": "Low-rainfall formation setting",
    "difficulty": "Medium",
    "stem": "A plateau region has crystalline rocks and receives relatively low rainfall. Which soil group is more likely than laterite?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Laterite soil",
      "Khadar",
      "Deltaic alluvium"
    ],
    "explanation": "Low rainfall over crystalline igneous rocks fits the standard setting of red and yellow soils. Laterite, by contrast, is linked with intense leaching under high temperature and heavy rainfall.",
    "sourceFactIds": [
      "RY-LOW-RAIN-VS-LATERITE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-029",
    "qlName": "Low-rainfall formation setting",
    "difficulty": "Medium",
    "stem": "Which combination best describes the formation setting of red and yellow soil?",
    "answer": "Crystalline igneous rocks and relatively low rainfall",
    "distractors": [
      "Recent river silt and annual floods",
      "Heavy rainfall and intense leaching only",
      "Permanent ice and glacial deposition"
    ],
    "explanation": "Both geology and climate matter. Crystalline igneous parent material supplies the minerals, while the relatively low-rainfall setting helps define the typical red-yellow soil region.",
    "sourceFactIds": [
      "RY-FORMATION-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-029",
    "qlName": "Low-rainfall formation setting",
    "difficulty": "Hard",
    "stem": "Site A lies on crystalline rock in a low-rainfall Deccan area; Site B lies on a very wet, strongly leached hill slope. Which site better fits red and yellow soil?",
    "answer": "Site A",
    "distractors": [
      "Site B",
      "Both equally for the same reason",
      "Neither because rainfall never affects soil"
    ],
    "explanation": "Site A matches the standard combination of crystalline igneous rock and low rainfall used to identify red and yellow soil. Site B more strongly suggests conditions favourable to laterite development.",
    "sourceFactIds": [
      "RY-CLIMATE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-030",
    "qlName": "Red colour and iron diffusion",
    "difficulty": "Easy",
    "stem": "What gives red soil its characteristic red colour?",
    "answer": "Iron compounds in the soil",
    "distractors": [
      "Calcium carbonate alone",
      "Fresh river humus",
      "Sea salt"
    ],
    "explanation": "The red colour comes from iron present in the soil material. When iron is spread through the soil in oxidised form, it gives the soil its characteristic reddish appearance.",
    "sourceFactIds": [
      "RY-IRON-RED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-030",
    "qlName": "Red colour and iron diffusion",
    "difficulty": "Easy",
    "stem": "The red colour of red soil is caused by the diffusion of which element?",
    "answer": "Iron",
    "distractors": [
      "Gold",
      "Sodium",
      "Carbon"
    ],
    "explanation": "Iron is the key element behind the red colour. Its diffusion through the crystalline and metamorphic material gives the soil a reddish shade under suitable oxidation conditions.",
    "sourceFactIds": [
      "RY-IRON-DIFFUSION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-030",
    "qlName": "Red colour and iron diffusion",
    "difficulty": "Medium",
    "stem": "Why can soil derived from crystalline rock appear red even though the rock itself may not look bright red?",
    "answer": "Iron becomes diffused through the soil material during weathering",
    "distractors": [
      "River floods paint the soil red",
      "The soil contains no minerals",
      "Clay automatically becomes red without iron"
    ],
    "explanation": "Weathering releases and redistributes iron within the soil material. When this iron becomes oxidised and diffused through the fine particles, the soil develops a red colour.",
    "sourceFactIds": [
      "RY-WEATHERING-IRON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-030",
    "qlName": "Red colour and iron diffusion",
    "difficulty": "Medium",
    "stem": "Which clue most directly explains the colour of red soil?",
    "answer": "Oxidised iron spread through the soil",
    "distractors": [
      "Annual renewal by river silt",
      "High calcium nodules only",
      "Permanent waterlogging"
    ],
    "explanation": "The red colour is primarily a mineral-colour effect caused by iron oxidation. It is not produced by flood renewal or by the calcium nodules associated with older alluvium.",
    "sourceFactIds": [
      "RY-OXIDISED-IRON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-030",
    "qlName": "Red colour and iron diffusion",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Red soil — colour from iron diffusion",
    "distractors": [
      "Black soil — red colour from iron diffusion",
      "Khadar — red colour from lava",
      "Laterite — yellow colour only from river silt"
    ],
    "explanation": "Red soil is named for the reddish colour produced by iron diffused through the soil material. This is a basic identification clue and is separate from the origin of black or alluvial soils.",
    "sourceFactIds": [
      "RY-RED-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-030",
    "qlName": "Red colour and iron diffusion",
    "difficulty": "Hard",
    "stem": "A soil forms over crystalline rock and shows a strong red colour without being a recent river deposit. Which process best explains the colour?",
    "answer": "Oxidation and diffusion of iron in the soil material",
    "distractors": [
      "Annual flood deposition",
      "Accumulation of coral fragments",
      "Permanent freezing of mineral particles"
    ],
    "explanation": "The red colour points to iron that has been oxidised and distributed through the soil material. The crystalline-rock setting supports the usual formation pattern of red and yellow soil.",
    "sourceFactIds": [
      "RY-RED-COLOUR-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-031",
    "qlName": "Yellow colour and hydration",
    "difficulty": "Easy",
    "stem": "When red soil becomes yellowish, what change in iron is responsible?",
    "answer": "Hydration of iron compounds",
    "distractors": [
      "Complete loss of all iron",
      "Replacement of iron by coal",
      "Annual river flooding"
    ],
    "explanation": "Red soil may appear yellow when iron compounds become hydrated. Water combines with iron-bearing minerals and changes the visible colour from red toward yellow.",
    "sourceFactIds": [
      "RY-YELLOW-HYDRATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-031",
    "qlName": "Yellow colour and hydration",
    "difficulty": "Easy",
    "stem": "Yellow soil is closely related to red soil but differs in colour because the iron is what?",
    "answer": "Hydrated",
    "distractors": [
      "Absent",
      "Frozen",
      "Replaced by limestone"
    ],
    "explanation": "The yellow colour develops when iron in the soil is hydrated. The basic soil family remains closely related to red soil, but the condition of the iron changes the colour seen by the learner.",
    "sourceFactIds": [
      "RY-HYDRATED-IRON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-031",
    "qlName": "Yellow colour and hydration",
    "difficulty": "Medium",
    "stem": "Why can the same soil family appear red in one place and yellow in another?",
    "answer": "The state of hydration of iron compounds can differ",
    "distractors": [
      "One area contains no minerals",
      "Yellow soil must be river-deposited",
      "Red soil contains no water at all"
    ],
    "explanation": "Red and yellow colours are linked to the condition of iron in the soil. Oxidised iron gives a red appearance, while greater hydration can shift the colour toward yellow.",
    "sourceFactIds": [
      "RY-COLOUR-VARIATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-031",
    "qlName": "Yellow colour and hydration",
    "difficulty": "Medium",
    "stem": "Which statement correctly explains yellow colour in red and yellow soils?",
    "answer": "Hydrated iron gives the soil a yellowish appearance",
    "distractors": [
      "Calcium nodules create all yellow soil",
      "River humus is the only cause",
      "Yellow colour proves the soil is alluvial"
    ],
    "explanation": "Yellow colour is produced when iron-bearing material is hydrated. This is why red and yellow soils are usually treated as related forms rather than completely separate soil origins.",
    "sourceFactIds": [
      "RY-YELLOW-EXPLANATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-031",
    "qlName": "Yellow colour and hydration",
    "difficulty": "Medium",
    "stem": "A soil from crystalline rock changes from red to yellowish in a moister local setting. Which mineral process is the best explanation?",
    "answer": "Greater hydration of iron compounds",
    "distractors": [
      "Loss of every iron mineral",
      "Fresh basalt eruption",
      "Annual deposition of new silt"
    ],
    "explanation": "More moisture can hydrate iron compounds already present in the soil. That change in mineral condition can make the same red-yellow soil family appear more yellow.",
    "sourceFactIds": [
      "RY-MOISTURE-YELLOW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-031",
    "qlName": "Yellow colour and hydration",
    "difficulty": "Hard",
    "stem": "Consider the following statements: I. Red colour is linked with iron diffusion and oxidation. II. Yellow colour can develop when iron is hydrated. III. Red and yellow colours require completely different parent rocks. Which statements are correct?",
    "answer": "I and II only",
    "distractors": [
      "I only",
      "II and III only",
      "I, II and III"
    ],
    "explanation": "Statements I and II correctly describe the colour mechanism. Statement III is incorrect because red and yellow forms can develop from the same general crystalline-rock soil family, with iron condition affecting colour.",
    "sourceFactIds": [
      "RY-COLOUR-STATEMENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-032",
    "qlName": "Eastern and southern Deccan distribution",
    "difficulty": "Easy",
    "stem": "Red and yellow soils are widely found in which part of the Deccan plateau?",
    "answer": "Eastern and southern parts",
    "distractors": [
      "Only the far northern plains",
      "Only the western coastal delta",
      "Only the high Himalaya"
    ],
    "explanation": "Red and yellow soils occur widely in the eastern and southern parts of the Deccan plateau. Their distribution reflects both the underlying crystalline rocks and the regional rainfall pattern.",
    "sourceFactIds": [
      "RY-EAST-SOUTH-DECCAN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-032",
    "qlName": "Eastern and southern Deccan distribution",
    "difficulty": "Easy",
    "stem": "Which region is a major zone of red and yellow soil?",
    "answer": "The eastern Deccan plateau",
    "distractors": [
      "The active Ganga floodplain only",
      "The Indus delta only",
      "The highest Himalayan snowfields"
    ],
    "explanation": "The eastern Deccan plateau is one of the standard regions for red and yellow soils. Crystalline rocks and relatively low rainfall provide the typical formation setting.",
    "sourceFactIds": [
      "RY-EAST-DECCAN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-032",
    "qlName": "Eastern and southern Deccan distribution",
    "difficulty": "Medium",
    "stem": "Which distribution pattern best fits red and yellow soils?",
    "answer": "Large areas of the eastern and southern Deccan plateau",
    "distractors": [
      "Only active river floodplains of northern India",
      "Only desert dunes of western Rajasthan",
      "Only coral islands"
    ],
    "explanation": "The main belt lies across parts of the eastern and southern Deccan plateau. This pattern differs from alluvial soils, which dominate large river plains and deltas.",
    "sourceFactIds": [
      "RY-DECCAN-DISTRIBUTION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-032",
    "qlName": "Eastern and southern Deccan distribution",
    "difficulty": "Medium",
    "stem": "A map shades crystalline uplands in the eastern and southern Deccan rather than the northern river plains. Which soil is likely being shown?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Alluvial soil",
      "Khadar only",
      "Bhangar only"
    ],
    "explanation": "Crystalline uplands of the eastern and southern Deccan are a major red-yellow soil region. The northern river plains, by contrast, are dominated by alluvial deposits.",
    "sourceFactIds": [
      "RY-DECCAN-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-032",
    "qlName": "Eastern and southern Deccan distribution",
    "difficulty": "Medium",
    "stem": "Why does red and yellow soil distribution differ from the great alluvial plains?",
    "answer": "It is linked with weathered crystalline plateau rocks rather than recent river deposits",
    "distractors": [
      "It is renewed by every river flood",
      "It forms only from marine sediment",
      "It requires permanent snow cover"
    ],
    "explanation": "Red and yellow soil develops over old crystalline rocks in plateau settings. Alluvial soil is transported and deposited by rivers, so the two soil groups follow different landscapes.",
    "sourceFactIds": [
      "RY-DECCAN-VS-ALLUVIAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-032",
    "qlName": "Eastern and southern Deccan distribution",
    "difficulty": "Hard",
    "stem": "A soil belt covers low-rainfall crystalline terrain across the eastern and southern Deccan. Which combination of clues identifies it best?",
    "answer": "Red and yellow soil with iron-controlled colour",
    "distractors": [
      "Alluvial soil renewed by floods",
      "Black soil defined only by khadar deposits",
      "Mountain soil formed under permanent snow"
    ],
    "explanation": "The distribution, rock type and rainfall condition all point to red and yellow soil. Its colour is further explained by iron oxidation and hydration, making the identification complete.",
    "sourceFactIds": [
      "RY-DECCAN-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-033",
    "qlName": "Odisha, Chhattisgarh and middle-Ganga extension",
    "difficulty": "Easy",
    "stem": "Red and yellow soils occur in important parts of which eastern Indian state?",
    "answer": "Odisha",
    "distractors": [
      "Punjab",
      "Haryana",
      "Jammu and Kashmir only"
    ],
    "explanation": "Parts of Odisha contain red and yellow soils as an extension of the eastern Indian crystalline-soil belt. The state's upland areas share geological conditions favourable to this soil group.",
    "sourceFactIds": [
      "RY-ODISHA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-033",
    "qlName": "Odisha, Chhattisgarh and middle-Ganga extension",
    "difficulty": "Easy",
    "stem": "Which central-eastern state contains important areas of red and yellow soil?",
    "answer": "Chhattisgarh",
    "distractors": [
      "Punjab",
      "Haryana",
      "Goa only"
    ],
    "explanation": "Chhattisgarh contains significant red and yellow soil areas. Its plateau and upland terrain connects with the wider crystalline-rock soil regions of central and eastern India.",
    "sourceFactIds": [
      "RY-CHHATTISGARH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-033",
    "qlName": "Odisha, Chhattisgarh and middle-Ganga extension",
    "difficulty": "Medium",
    "stem": "Red and yellow soils also occur in which part of the Ganga plain region?",
    "answer": "Southern parts of the middle Ganga plain",
    "distractors": [
      "Only the active delta mouth",
      "Only the northernmost Himalayan edge",
      "Only the western Indus plain"
    ],
    "explanation": "The soil extends beyond the Deccan plateau into southern parts of the middle Ganga plain. This is a useful exception to the idea that the soil occurs only in peninsular plateau regions.",
    "sourceFactIds": [
      "RY-MIDDLE-GANGA-SOUTH"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-033",
    "qlName": "Odisha, Chhattisgarh and middle-Ganga extension",
    "difficulty": "Medium",
    "stem": "Which group contains recognised red and yellow soil areas?",
    "answer": "Odisha, Chhattisgarh and southern parts of the middle Ganga plain",
    "distractors": [
      "Punjab, Haryana and the active Indus floodplain only",
      "Lakshadweep, Andaman reefs and Thar dunes only",
      "Kashmir snowfields, Ladakh and Siachen only"
    ],
    "explanation": "Red and yellow soils occur in parts of Odisha and Chhattisgarh and extend into southern parts of the middle Ganga plain. This distribution broadens the soil belt beyond the Deccan plateau.",
    "sourceFactIds": [
      "RY-REGION-GROUP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-033",
    "qlName": "Odisha, Chhattisgarh and middle-Ganga extension",
    "difficulty": "Medium",
    "stem": "A question places red and yellow soil in Chhattisgarh and southern parts of the middle Ganga plain. Is this distribution consistent with standard Indian geography?",
    "answer": "Yes, both are recognised occurrence areas",
    "distractors": [
      "No, the soil occurs only in Maharashtra",
      "No, it occurs only in river deltas",
      "No, it is restricted to high mountains"
    ],
    "explanation": "Both areas are recognised parts of the red-yellow soil distribution. The soil occurs across several crystalline upland and adjoining regions rather than being restricted to one state.",
    "sourceFactIds": [
      "RY-DISTRIBUTION-CHECK"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-033",
    "qlName": "Odisha, Chhattisgarh and middle-Ganga extension",
    "difficulty": "Hard",
    "stem": "A map shows red-yellow soil patches in Odisha, Chhattisgarh and the southern middle Ganga plain in addition to the Deccan belt. What does this show?",
    "answer": "The soil extends beyond the core Deccan plateau into adjoining eastern and northern-margin regions",
    "distractors": [
      "The soil is limited to coastal deltas",
      "The soil is confined to Maharashtra",
      "All marked areas are active floodplains"
    ],
    "explanation": "The distribution is wider than the core eastern-southern Deccan belt. Recognised extensions into Odisha, Chhattisgarh and the southern middle Ganga plain show how the soil follows suitable upland geology across adjoining regions.",
    "sourceFactIds": [
      "RY-DISTRIBUTION-EXTENSION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-034",
    "qlName": "Western Ghats piedmont red loamy belt",
    "difficulty": "Easy",
    "stem": "Which soil is found along parts of the piedmont zone of the Western Ghats?",
    "answer": "Red loamy soil",
    "distractors": [
      "Khadar",
      "Bhangar",
      "Arid dune soil"
    ],
    "explanation": "A long belt of red loamy soil occurs along parts of the piedmont zone of the Western Ghats. This is an important regional occurrence within the wider red and yellow soil group.",
    "sourceFactIds": [
      "RY-WG-PIEDMONT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-034",
    "qlName": "Western Ghats piedmont red loamy belt",
    "difficulty": "Easy",
    "stem": "The red soil along the foothill belt of the Western Ghats is commonly described as what?",
    "answer": "Red loamy soil",
    "distractors": [
      "Black cotton soil only",
      "Newer alluvium",
      "Desert sand"
    ],
    "explanation": "The Western Ghats piedmont belt contains red loamy soil. The term loamy describes its texture and distinguishes this occurrence from the heavy clayey black soil of many Deccan areas.",
    "sourceFactIds": [
      "RY-RED-LOAMY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-034",
    "qlName": "Western Ghats piedmont red loamy belt",
    "difficulty": "Medium",
    "stem": "Which pair is correctly matched?",
    "answer": "Western Ghats piedmont — red loamy soil",
    "distractors": [
      "Active Ganga floodplain — red loamy soil as its defining soil",
      "Thar dunes — red loamy soil only",
      "Brahmaputra delta — regur soil"
    ],
    "explanation": "Red loamy soil occurs along the piedmont zone of the Western Ghats. Active floodplains are more closely linked with alluvium, while regur refers to black soil.",
    "sourceFactIds": [
      "RY-WG-PAIR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-034",
    "qlName": "Western Ghats piedmont red loamy belt",
    "difficulty": "Medium",
    "stem": "A foothill zone lies immediately east of the Western Ghats and has red loamy material. Which soil group does it belong to?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Alluvial soil",
      "Black soil only",
      "Arid soil"
    ],
    "explanation": "The red loamy piedmont belt is treated as part of the red and yellow soil distribution. Its location near the Western Ghats is a useful regional clue in exam questions.",
    "sourceFactIds": [
      "RY-WG-IDENTIFICATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-034",
    "qlName": "Western Ghats piedmont red loamy belt",
    "difficulty": "Medium",
    "stem": "Why is the Western Ghats piedmont belt important in questions on red and yellow soil?",
    "answer": "It provides a recognised long stretch of red loamy soil",
    "distractors": [
      "It is the only area of khadar in India",
      "It is India's main desert-soil belt",
      "It contains no crystalline terrain"
    ],
    "explanation": "The piedmont zone is specifically noted for a long stretch of red loamy soil. This makes it a distinct regional association within the chapter's red-yellow soil map.",
    "sourceFactIds": [
      "RY-WG-SIGNIFICANCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-034",
    "qlName": "Western Ghats piedmont red loamy belt",
    "difficulty": "Hard",
    "stem": "A map marks a narrow foothill belt along the Western Ghats rather than a river floodplain. The legend says 'red loamy'. Which soil family should the map key use?",
    "answer": "Red and yellow soils",
    "distractors": [
      "Alluvial soils",
      "Black soils only",
      "Arid soils"
    ],
    "explanation": "Red loamy soil in the Western Ghats piedmont belongs to the red and yellow soil family. Its foothill position and red loamy description separate it from floodplain alluvium and heavy black clay.",
    "sourceFactIds": [
      "RY-WG-MAP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-035",
    "qlName": "Red and yellow soil comparison",
    "difficulty": "Easy",
    "stem": "What is the key difference between red and yellow forms of this soil family?",
    "answer": "The condition of iron affects the visible colour",
    "distractors": [
      "They always come from unrelated parent rocks",
      "One is river-deposited and the other volcanic",
      "Only yellow soil contains minerals"
    ],
    "explanation": "Both colours belong to the same general soil family. Red colour is linked with oxidised iron, while hydration of iron compounds can produce a yellowish appearance.",
    "sourceFactIds": [
      "RY-RED-YELLOW-DIFFERENCE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-035",
    "qlName": "Red and yellow soil comparison",
    "difficulty": "Easy",
    "stem": "Which statement correctly compares red and yellow soil colours?",
    "answer": "Red reflects oxidised iron; yellow reflects more hydrated iron",
    "distractors": [
      "Red contains no iron; yellow contains all the iron",
      "Both colours come only from river silt",
      "Yellow colour proves the soil is black soil"
    ],
    "explanation": "The colour difference is controlled by the state of iron in the soil. Oxidised iron gives a red shade, while hydrated iron compounds can make the soil look yellow.",
    "sourceFactIds": [
      "RY-COLOUR-COMPARE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-035",
    "qlName": "Red and yellow soil comparison",
    "difficulty": "Medium",
    "stem": "Why are red and yellow soils grouped together rather than treated as completely unrelated soils?",
    "answer": "They share a similar origin and differ largely in iron condition and colour",
    "distractors": [
      "One is a river soil and one is a desert soil",
      "They occur on opposite continents only",
      "They have no mineral relationship"
    ],
    "explanation": "Both develop from similar crystalline parent material under related regional conditions. Differences in oxidation and hydration of iron help explain why one area appears red and another yellow.",
    "sourceFactIds": [
      "RY-GROUPING-REASON"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-035",
    "qlName": "Red and yellow soil comparison",
    "difficulty": "Medium",
    "stem": "A soil changes from reddish on a well-drained slope to yellowish in a moister pocket. Which explanation is most reasonable?",
    "answer": "Iron is more hydrated in the moister pocket",
    "distractors": [
      "All iron disappears in the moister pocket",
      "The parent rock instantly changes to river silt",
      "Yellow colour requires a new soil group"
    ],
    "explanation": "Moisture can increase hydration of iron compounds, shifting the visible colour toward yellow. The underlying soil family can remain the same even though the colour changes locally.",
    "sourceFactIds": [
      "RY-SLOPE-MOISTURE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-035",
    "qlName": "Red and yellow soil comparison",
    "difficulty": "Medium",
    "stem": "Which feature would NOT by itself prove that red and yellow soils have different origins?",
    "answer": "A difference in red versus yellow colour",
    "distractors": [
      "Different parent rocks verified by geology",
      "Different depositional processes verified by evidence",
      "Different formation histories established by sources"
    ],
    "explanation": "Colour alone can change with the oxidation and hydration state of iron. Therefore, red and yellow appearances do not automatically mean the soils formed from completely different parent materials.",
    "sourceFactIds": [
      "RY-COLOUR-NOT-ORIGIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-035",
    "qlName": "Red and yellow soil comparison",
    "difficulty": "Medium",
    "stem": "Which comparison is most accurate?",
    "answer": "Both are linked with crystalline rocks; iron condition helps determine whether the soil looks red or yellow",
    "distractors": [
      "Red soil is alluvial while yellow soil is black soil",
      "Yellow soil forms only from desert sand",
      "Red soil has no iron compounds"
    ],
    "explanation": "Red and yellow forms share a common crystalline-rock background in standard school geography. Their colour difference is strongly linked with whether iron is more oxidised or more hydrated.",
    "sourceFactIds": [
      "RY-COMPARE-ACCURATE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-036",
    "qlName": "Integrated red-yellow-soil reasoning",
    "difficulty": "Easy",
    "stem": "A soil develops on crystalline rock in a low-rainfall Deccan area and appears reddish. Which soil is it?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Alluvial soil",
      "Black soil",
      "Arid soil"
    ],
    "explanation": "Crystalline parent rock, relatively low rainfall and a reddish iron-based colour form a standard set of clues for red and yellow soil. Together they identify the soil more reliably than colour alone.",
    "sourceFactIds": [
      "RY-INTEGRATED-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-036",
    "qlName": "Integrated red-yellow-soil reasoning",
    "difficulty": "Easy",
    "stem": "A yellowish soil in the same family as red soil contains hydrated iron. Which soil group is indicated?",
    "answer": "Red and yellow soil",
    "distractors": [
      "Black soil",
      "Khadar",
      "Forest soil"
    ],
    "explanation": "Hydrated iron can give the yellow form of the red-yellow soil family its colour. The colour mechanism connects yellow soil directly with the same general formation group as red soil.",
    "sourceFactIds": [
      "RY-INTEGRATED-YELLOW"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-036",
    "qlName": "Integrated red-yellow-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which combination correctly identifies red and yellow soils?",
    "answer": "Crystalline-rock origin, low-rainfall setting and iron-controlled colour",
    "distractors": [
      "Recent river deposition, annual flood renewal and kankar only",
      "Basaltic clay, self-ploughing and cotton as the only clues",
      "Desert dunes, high salinity and no iron"
    ],
    "explanation": "The strongest combined clues are crystalline igneous parent material, relatively low rainfall and colour controlled by iron oxidation or hydration. These features fit the standard red-yellow soil description.",
    "sourceFactIds": [
      "RY-INTEGRATED-COMBINATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-036",
    "qlName": "Integrated red-yellow-soil reasoning",
    "difficulty": "Medium",
    "stem": "A map shows red-yellow soils across the eastern-southern Deccan, Odisha and Chhattisgarh. Which common factor best links these regions?",
    "answer": "Suitable crystalline upland terrain for red-yellow soil development",
    "distractors": [
      "Annual Himalayan flood deposition",
      "Permanent snow cover",
      "Marine coral accumulation"
    ],
    "explanation": "These regions contain extensive crystalline upland terrain where red and yellow soils can develop under suitable rainfall conditions. Their shared setting explains the regional pattern better than river deposition.",
    "sourceFactIds": [
      "RY-INTEGRATED-DISTRIBUTION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-036",
    "qlName": "Integrated red-yellow-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which chain best explains a yellowish patch within a red-soil region?",
    "answer": "Iron-bearing soil → greater hydration → yellowish colour",
    "distractors": [
      "River flood → khadar renewal → black soil",
      "Basalt eruption → alluvium → yellow colour",
      "Sand dune → permanent flooding → red colour"
    ],
    "explanation": "The soil already contains iron from its mineral material. When those iron compounds become more hydrated, the visible colour can shift from red toward yellow without requiring a different soil origin.",
    "sourceFactIds": [
      "RY-INTEGRATED-COLOUR-CHAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-036",
    "qlName": "Integrated red-yellow-soil reasoning",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes red and yellow soil from black soil?",
    "answer": "Red-yellow soil is linked with crystalline rocks and iron colour, while black soil is strongly linked with basaltic clay and shrink-crack behaviour",
    "distractors": [
      "Both are identical forms of khadar",
      "Black soil is always river-deposited",
      "Red-yellow soil is defined by annual flood renewal"
    ],
    "explanation": "Red-yellow soils are identified by crystalline-rock origin and iron-controlled colour. Black soil is more closely linked with Deccan basalt, high clay content, moisture retention and seasonal cracking.",
    "sourceFactIds": [
      "RY-VS-BLACK"
    ]
  }
]);

export const GEO_SOI_001_CP004_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP004-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoSoi001Cp004ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_SOI_001_CP004_REVIEW_BATCH_V1) {
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

  if (GEO_SOI_001_CP004_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP004_REVIEW_BATCH_V1.length);
  for (let n = 28; n <= 36; n += 1) {
    const qlId = "GEO-SOI-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_SOI_001_CP004_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
  });
}
