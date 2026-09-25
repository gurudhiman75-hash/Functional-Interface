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
    "qlId": "GEO-SOI-001-QL-091",
    "qlName": "Soil erosion: meaning and natural agents",
    "difficulty": "Easy",
    "stem": "What is meant by soil erosion?",
    "answer": "The denudation and washing away of the soil cover",
    "distractors": [
      "The formation of new soil from rock",
      "The addition of humus to topsoil",
      "The annual deposition of river silt"
    ],
    "explanation": "Soil erosion is the removal or washing away of the soil cover from the land surface. It reduces the protective top layer and can lower the productive capacity of the land when loss becomes severe.",
    "sourceFactIds": [
      "EROSION-DEFINITION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-091",
    "qlName": "Soil erosion: meaning and natural agents",
    "difficulty": "Easy",
    "stem": "Which natural agents can cause soil erosion?",
    "answer": "Running water and wind",
    "distractors": [
      "Only groundwater salts",
      "Only earthworms",
      "Only plant roots"
    ],
    "explanation": "Running water and wind are major natural agents of soil erosion, while glaciers can also remove material in suitable regions. These forces detach and transport soil particles from one place to another.",
    "sourceFactIds": [
      "EROSION-NATURAL-AGENTS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-091",
    "qlName": "Soil erosion: meaning and natural agents",
    "difficulty": "Medium",
    "stem": "Which process is occurring when fertile topsoil is carried away from a field by flowing water?",
    "answer": "Soil erosion",
    "distractors": [
      "Soil formation",
      "Humus accumulation",
      "Alluvial renewal"
    ],
    "explanation": "When flowing water removes the upper soil layer, the process is soil erosion. The loss is harmful because topsoil usually contains more organic matter and plant nutrients than deeper layers.",
    "sourceFactIds": [
      "EROSION-WATER-ID"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-091",
    "qlName": "Soil erosion: meaning and natural agents",
    "difficulty": "Medium",
    "stem": "Why is the loss of topsoil especially serious for agriculture?",
    "answer": "The upper layer usually contains much of the soil's fertility",
    "distractors": [
      "The top layer contains no plant nutrients",
      "Only deep rock supports roots",
      "Erosion always adds humus"
    ],
    "explanation": "Topsoil is usually the most biologically active and nutrient-rich part of the profile. Removing it weakens soil structure and fertility, so crop productivity can fall even if deeper material remains.",
    "sourceFactIds": [
      "EROSION-TOPSOIL-LOSS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-091",
    "qlName": "Soil erosion: meaning and natural agents",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes soil erosion from soil formation?",
    "answer": "Erosion removes soil, while formation develops soil from parent material over time",
    "distractors": [
      "Both processes only add soil",
      "Erosion forms humus and formation removes it",
      "Both are forms of river deposition"
    ],
    "explanation": "Soil formation gradually develops soil through weathering and biological activity, whereas erosion removes existing soil from the surface. The two processes therefore act in opposite directions on soil depth.",
    "sourceFactIds": [
      "EROSION-VS-FORMATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-091",
    "qlName": "Soil erosion: meaning and natural agents",
    "difficulty": "Hard",
    "stem": "A landscape loses its upper soil layer through runoff and wind faster than new soil can form. What is the main problem?",
    "answer": "Accelerated soil erosion",
    "distractors": [
      "Rapid soil formation",
      "Increased humus accumulation",
      "Alluvial deposition"
    ],
    "explanation": "The key problem is that soil is being removed faster than it is replenished by natural formation. Such accelerated erosion progressively thins the productive soil cover and degrades the land.",
    "sourceFactIds": [
      "EROSION-ACCELERATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-092",
    "qlName": "Human activities that accelerate erosion",
    "difficulty": "Easy",
    "stem": "Which human activity can greatly increase soil erosion by removing protective vegetation?",
    "answer": "Deforestation",
    "distractors": [
      "Afforestation",
      "Strip cropping",
      "Terrace farming"
    ],
    "explanation": "Deforestation exposes the soil surface by removing roots and plant cover that hold soil in place. Once bare, the land becomes much more vulnerable to runoff and wind erosion.",
    "sourceFactIds": [
      "EROSION-DEFORESTATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-092",
    "qlName": "Human activities that accelerate erosion",
    "difficulty": "Easy",
    "stem": "Which activity can expose soil and increase erosion on grazing land?",
    "answer": "Overgrazing",
    "distractors": [
      "Shelter-belt planting",
      "Contour ploughing",
      "Mulching only"
    ],
    "explanation": "Overgrazing removes protective grass cover and leaves the soil surface open to wind and flowing water. Repeated trampling can also weaken soil structure and increase runoff.",
    "sourceFactIds": [
      "EROSION-OVERGRAZING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-092",
    "qlName": "Human activities that accelerate erosion",
    "difficulty": "Medium",
    "stem": "How can mining increase soil erosion?",
    "answer": "It removes vegetation and disturbs the soil and rock surface",
    "distractors": [
      "It always creates new fertile topsoil",
      "It stops surface runoff completely",
      "It converts all land into terraces"
    ],
    "explanation": "Mining often strips vegetation and disturbs large areas of soil and loose material. Exposed spoil and bare slopes can then be carried away more easily by rainwater and wind.",
    "sourceFactIds": [
      "EROSION-MINING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-092",
    "qlName": "Human activities that accelerate erosion",
    "difficulty": "Medium",
    "stem": "Why can construction activity accelerate soil erosion?",
    "answer": "Bare disturbed soil is left exposed to runoff",
    "distractors": [
      "Construction always increases forest cover",
      "Concrete produces humus",
      "Roads permanently stop all water flow"
    ],
    "explanation": "Construction frequently clears vegetation and disturbs the soil surface before the land is stabilised. Rainwater can then detach and carry away loose particles from exposed areas.",
    "sourceFactIds": [
      "EROSION-CONSTRUCTION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-092",
    "qlName": "Human activities that accelerate erosion",
    "difficulty": "Medium",
    "stem": "Which group contains only human activities that can intensify soil erosion?",
    "answer": "Deforestation, overgrazing and mining",
    "distractors": [
      "Afforestation, terrace farming and shelter belts",
      "Contour ploughing, strip cropping and afforestation",
      "Terracing, contouring and shelter-belt planting"
    ],
    "explanation": "Deforestation, overgrazing and mining all remove or disturb protective land cover and can accelerate erosion. The other groups contain practices used to reduce soil loss rather than increase it.",
    "sourceFactIds": [
      "EROSION-HUMAN-CAUSES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-092",
    "qlName": "Human activities that accelerate erosion",
    "difficulty": "Hard",
    "stem": "A hillside is cleared for timber, heavily grazed and then cut by a road. Why is erosion likely to increase sharply?",
    "answer": "Vegetation loss and surface disturbance leave soil exposed to runoff",
    "distractors": [
      "The activities create a deeper humus layer",
      "The road forces all water into the soil",
      "Grazing automatically forms terraces"
    ],
    "explanation": "Several protective controls have been removed at the same time: roots, ground cover and stable surface structure. Rainfall can therefore generate faster runoff and detach much more soil from the disturbed slope.",
    "sourceFactIds": [
      "EROSION-MULTIPLE-HUMAN-CAUSES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-093",
    "qlName": "Gully erosion and ravines",
    "difficulty": "Easy",
    "stem": "What is formed when running water cuts deep channels into soil?",
    "answer": "Gullies",
    "distractors": [
      "Dunes",
      "Terraces",
      "Shelter belts"
    ],
    "explanation": "Gullies form when concentrated running water cuts deep channels into the land surface. Repeated erosion enlarges these channels and can make the affected land difficult to cultivate.",
    "sourceFactIds": [
      "EROSION-GULLY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-093",
    "qlName": "Gully erosion and ravines",
    "difficulty": "Easy",
    "stem": "The ravines of the Chambal basin are a classic example of which type of erosion?",
    "answer": "Gully erosion",
    "distractors": [
      "Wind erosion",
      "Sheet erosion",
      "Glacial deposition"
    ],
    "explanation": "The Chambal ravines are a well-known example of severe gully erosion. Running water has dissected the land into deep channels and irregular badland-like terrain.",
    "sourceFactIds": [
      "EROSION-CHAMBAL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-093",
    "qlName": "Gully erosion and ravines",
    "difficulty": "Medium",
    "stem": "Why does gully erosion make farmland difficult to use?",
    "answer": "Deep channels divide the field and remove large amounts of soil",
    "distractors": [
      "It creates a smooth level surface",
      "It adds fresh fertile silt everywhere",
      "It increases protective vegetation"
    ],
    "explanation": "Gullies cut fields into uneven blocks and remove significant amounts of soil from the affected area. As channels deepen, normal ploughing and field operations become increasingly difficult.",
    "sourceFactIds": [
      "EROSION-GULLY-FARMLAND"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-093",
    "qlName": "Gully erosion and ravines",
    "difficulty": "Medium",
    "stem": "Which clue most strongly identifies gully erosion?",
    "answer": "Deep narrow channels cut by concentrated runoff",
    "distractors": [
      "A thin uniform layer removed from a wide field",
      "Loose dry soil blown by wind",
      "Fresh river silt deposited after floods"
    ],
    "explanation": "Gully erosion is identified by concentrated water flow that cuts visible channels into the soil. This differs from sheet erosion, which removes a thinner layer over a wider surface.",
    "sourceFactIds": [
      "EROSION-GULLY-CLUE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-093",
    "qlName": "Gully erosion and ravines",
    "difficulty": "Medium",
    "stem": "What can severe gully erosion eventually produce?",
    "answer": "Ravines and badly dissected land",
    "distractors": [
      "New volcanic plateaus",
      "Permanent floodplains",
      "Coastal sand bars"
    ],
    "explanation": "As gullies deepen and branch, the landscape can become dissected into ravines. Such terrain is difficult to cultivate and represents an advanced stage of water erosion.",
    "sourceFactIds": [
      "EROSION-GULLY-RAVINES"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-093",
    "qlName": "Gully erosion and ravines",
    "difficulty": "Hard",
    "stem": "A clayey landscape has been cut into a network of deep channels by concentrated runoff, producing ravine-like terrain. Which erosion type fits best?",
    "answer": "Gully erosion",
    "distractors": [
      "Sheet erosion",
      "Wind erosion",
      "Glacial erosion"
    ],
    "explanation": "Deep branching channels and ravines are defining signs of gully erosion. Concentrated runoff has enough erosive power to cut into the soil rather than merely removing a thin surface layer.",
    "sourceFactIds": [
      "EROSION-GULLY-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-094",
    "qlName": "Sheet erosion",
    "difficulty": "Easy",
    "stem": "What happens in sheet erosion?",
    "answer": "Water flows as a sheet and removes a thin layer of soil over a wide area",
    "distractors": [
      "Wind forms tall dunes",
      "Rivers deposit fresh silt",
      "Glaciers create moraines"
    ],
    "explanation": "Sheet erosion occurs when runoff spreads over the land surface and removes a thin layer of soil. Because the loss is widespread rather than channelled, it may be less obvious at first than gully erosion.",
    "sourceFactIds": [
      "EROSION-SHEET"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-094",
    "qlName": "Sheet erosion",
    "difficulty": "Easy",
    "stem": "Which type of erosion removes soil in a relatively uniform layer from a field?",
    "answer": "Sheet erosion",
    "distractors": [
      "Gully erosion",
      "Wind erosion only",
      "River deposition"
    ],
    "explanation": "Sheet erosion removes a thin, fairly even layer of topsoil from a wide surface. It is produced by unchannelled runoff rather than deep concentrated flow.",
    "sourceFactIds": [
      "EROSION-SHEET-UNIFORM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-094",
    "qlName": "Sheet erosion",
    "difficulty": "Medium",
    "stem": "How does sheet erosion differ from gully erosion?",
    "answer": "Sheet erosion removes a thin layer widely, while gully erosion cuts deep channels",
    "distractors": [
      "Both always form ravines",
      "Sheet erosion is caused only by wind",
      "Gully erosion deposits new topsoil"
    ],
    "explanation": "Sheet erosion spreads across the surface and gradually strips topsoil, whereas gully erosion concentrates water into channels. The difference is primarily in the pattern and depth of soil removal.",
    "sourceFactIds": [
      "EROSION-SHEET-VS-GULLY"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-094",
    "qlName": "Sheet erosion",
    "difficulty": "Medium",
    "stem": "Why can sheet erosion be difficult to notice early?",
    "answer": "The soil is removed gradually across a wide area without deep channels",
    "distractors": [
      "It always creates large ravines immediately",
      "It adds a visible salt crust",
      "It forms black clay cracks"
    ],
    "explanation": "Sheet erosion often removes only a thin surface layer during each event, so the field can still look smooth. Repeated losses, however, can remove substantial fertile topsoil over time.",
    "sourceFactIds": [
      "EROSION-SHEET-SUBTLE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-094",
    "qlName": "Sheet erosion",
    "difficulty": "Medium",
    "stem": "A sloping field shows no deep channels, but its fertile surface layer becomes thinner after repeated storms. Which process is most likely?",
    "answer": "Sheet erosion",
    "distractors": [
      "Gully erosion",
      "Alluvial deposition",
      "Black-soil cracking"
    ],
    "explanation": "The lack of channels and widespread thinning of the surface layer indicate sheet erosion. Runoff is moving across the field as a shallow sheet and carrying fine soil away.",
    "sourceFactIds": [
      "EROSION-SHEET-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-094",
    "qlName": "Sheet erosion",
    "difficulty": "Hard",
    "stem": "Field A loses a thin layer over most of its surface; Field B is cut by deep channels. Which erosion types affect A and B respectively?",
    "answer": "Sheet erosion and gully erosion",
    "distractors": [
      "Gully erosion and wind erosion",
      "Wind erosion and sheet erosion",
      "Deposition and gully erosion"
    ],
    "explanation": "Field A shows sheet erosion because soil loss is shallow and widespread, while Field B shows gully erosion because concentrated runoff has cut deep channels. The pair contrasts two major forms of water erosion.",
    "sourceFactIds": [
      "EROSION-SHEET-GULLY-COMPARE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-095",
    "qlName": "Wind erosion",
    "difficulty": "Easy",
    "stem": "Which agent is especially important in eroding loose soil in dry regions?",
    "answer": "Wind",
    "distractors": [
      "Glacier only",
      "River deposition",
      "Plant roots"
    ],
    "explanation": "Wind can lift and transport loose dry soil where vegetation cover is sparse. This form of erosion is especially important in arid and semi-arid regions with exposed surfaces.",
    "sourceFactIds": [
      "EROSION-WIND"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-095",
    "qlName": "Wind erosion",
    "difficulty": "Easy",
    "stem": "Wind erosion is most likely where soil is what?",
    "answer": "Loose, dry and poorly protected by vegetation",
    "distractors": [
      "Permanently waterlogged",
      "Covered by dense forest",
      "Deeply frozen all year"
    ],
    "explanation": "Loose dry particles are easily detached and carried by strong winds, especially when vegetation is sparse. Ground cover reduces this risk by trapping soil and lowering wind speed near the surface.",
    "sourceFactIds": [
      "EROSION-WIND-CONDITIONS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-095",
    "qlName": "Wind erosion",
    "difficulty": "Medium",
    "stem": "Which landscape is most vulnerable to wind erosion?",
    "answer": "An exposed dry field with loose soil",
    "distractors": [
      "A densely forested humid slope",
      "A flooded delta under water",
      "A terraced field with strong vegetation cover"
    ],
    "explanation": "An exposed dry field provides both loose material and little protection against moving air. Wind can therefore detach and transport soil particles much more easily than on well-covered land.",
    "sourceFactIds": [
      "EROSION-WIND-LANDSCAPE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-095",
    "qlName": "Wind erosion",
    "difficulty": "Medium",
    "stem": "How does wind erosion differ from sheet erosion?",
    "answer": "Wind transports loose dry particles, while sheet erosion is caused by shallow runoff",
    "distractors": [
      "Both are caused only by rivers",
      "Both require deep channels",
      "Wind erosion always deposits fertile silt"
    ],
    "explanation": "Wind erosion is driven by moving air over dry exposed surfaces, whereas sheet erosion is driven by water flowing over the land as a thin sheet. The agents and surface conditions are different.",
    "sourceFactIds": [
      "EROSION-WIND-VS-SHEET"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-095",
    "qlName": "Wind erosion",
    "difficulty": "Medium",
    "stem": "Why does vegetation reduce wind erosion?",
    "answer": "It lowers wind speed near the ground and helps hold soil in place",
    "distractors": [
      "It makes soil drier and looser",
      "It removes all roots",
      "It increases the size of sand grains"
    ],
    "explanation": "Plants act as a physical barrier to moving air and their roots help bind soil particles. Together these effects reduce the amount of loose material that wind can lift and transport.",
    "sourceFactIds": [
      "EROSION-WIND-VEGETATION"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-095",
    "qlName": "Wind erosion",
    "difficulty": "Hard",
    "stem": "A flat dry tract with sparse vegetation loses fine soil during strong winds but shows no runoff channels. Which process is dominant?",
    "answer": "Wind erosion",
    "distractors": [
      "Gully erosion",
      "Sheet erosion",
      "River deposition"
    ],
    "explanation": "The key clues are dryness, sparse vegetation and soil movement by strong winds without water-cut channels. Those conditions point directly to wind erosion rather than water erosion.",
    "sourceFactIds": [
      "EROSION-WIND-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-096",
    "qlName": "Contour ploughing",
    "difficulty": "Easy",
    "stem": "What is contour ploughing?",
    "answer": "Ploughing along the contour lines of a slope",
    "distractors": [
      "Ploughing straight up and down the slope",
      "Removing all vegetation from a slope",
      "Deepening natural gullies"
    ],
    "explanation": "Contour ploughing follows lines of equal elevation across a slope rather than running directly downhill. The furrows slow runoff and give water more time to soak into the soil.",
    "sourceFactIds": [
      "CONSERVATION-CONTOUR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-096",
    "qlName": "Contour ploughing",
    "difficulty": "Easy",
    "stem": "How does contour ploughing help conserve soil?",
    "answer": "It slows water flowing down the slope",
    "distractors": [
      "It increases wind speed",
      "It creates deep gullies",
      "It removes terrace walls"
    ],
    "explanation": "Contour furrows act as small barriers across a slope and reduce the speed of runoff. Slower water has less power to detach and carry away soil particles.",
    "sourceFactIds": [
      "CONSERVATION-CONTOUR-RUNOFF"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-096",
    "qlName": "Contour ploughing",
    "difficulty": "Medium",
    "stem": "Which field layout best represents contour ploughing?",
    "answer": "Furrows running across the slope at nearly equal elevation",
    "distractors": [
      "Furrows running directly downhill",
      "Bare strips aligned with strongest winds",
      "Deep channels cut through the field"
    ],
    "explanation": "Contour ploughing keeps cultivation lines roughly horizontal across the slope. This arrangement interrupts downhill runoff and reduces the erosive force of flowing water.",
    "sourceFactIds": [
      "CONSERVATION-CONTOUR-LAYOUT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-096",
    "qlName": "Contour ploughing",
    "difficulty": "Medium",
    "stem": "Why is ploughing up and down a steep slope usually worse for erosion than contour ploughing?",
    "answer": "Downhill furrows can channel runoff and increase its speed",
    "distractors": [
      "Downhill furrows always stop water",
      "Contour furrows create ravines",
      "Slope direction has no effect on runoff"
    ],
    "explanation": "Furrows running downhill can guide water rapidly toward the base of a slope, increasing its erosive power. Contour furrows cut across that flow and slow the movement of water.",
    "sourceFactIds": [
      "CONSERVATION-CONTOUR-VS-DOWNHILL"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-096",
    "qlName": "Contour ploughing",
    "difficulty": "Medium",
    "stem": "Which erosion problem is contour ploughing designed primarily to reduce?",
    "answer": "Water erosion on sloping farmland",
    "distractors": [
      "Glacial erosion",
      "Coastal wave erosion only",
      "Volcanic weathering"
    ],
    "explanation": "Contour ploughing is a soil-conservation method for sloping agricultural land affected by runoff. By reducing water speed, it limits sheet erosion and the development of more concentrated flow paths.",
    "sourceFactIds": [
      "CONSERVATION-CONTOUR-PURPOSE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-096",
    "qlName": "Contour ploughing",
    "difficulty": "Hard",
    "stem": "Two similar sloping fields receive the same storm; one is ploughed downhill and the other along contour lines. Why should the contour-ploughed field lose less soil?",
    "answer": "Its cross-slope furrows interrupt and slow runoff",
    "distractors": [
      "Its soil becomes permanently frozen",
      "Its furrows increase runoff speed",
      "Its vegetation is automatically removed"
    ],
    "explanation": "Cross-slope furrows reduce the uninterrupted downhill path available to water. Slower runoff has less energy to detach and transport soil, so erosion is reduced compared with downhill ploughing.",
    "sourceFactIds": [
      "CONSERVATION-CONTOUR-REASONING"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-097",
    "qlName": "Terrace cultivation",
    "difficulty": "Easy",
    "stem": "Which soil-conservation method creates step-like fields on steep slopes?",
    "answer": "Terrace cultivation",
    "distractors": [
      "Strip cropping",
      "Shelter belts",
      "Overgrazing"
    ],
    "explanation": "Terrace cultivation converts a steep slope into a series of step-like level surfaces. The shorter, flatter sections reduce runoff speed and help prevent soil from being washed downhill.",
    "sourceFactIds": [
      "CONSERVATION-TERRACE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-097",
    "qlName": "Terrace cultivation",
    "difficulty": "Easy",
    "stem": "Terrace farming is especially useful in which type of terrain?",
    "answer": "Steep hilly and mountainous slopes",
    "distractors": [
      "Flat desert plains only",
      "River deltas only",
      "Coastal marshes only"
    ],
    "explanation": "Terrace farming is best suited to steep hilly terrain where uncontrolled runoff would otherwise move quickly downslope. The steps shorten the slope and make cultivation safer for the soil.",
    "sourceFactIds": [
      "CONSERVATION-TERRACE-TERRAIN"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-097",
    "qlName": "Terrace cultivation",
    "difficulty": "Medium",
    "stem": "How do terraces reduce soil erosion?",
    "answer": "They shorten the effective slope and slow runoff",
    "distractors": [
      "They remove all vegetation",
      "They increase the length of the slope",
      "They direct water into deep gullies"
    ],
    "explanation": "Terraces break one long slope into several shorter level or gently sloping sections. This reduces water velocity and allows more rainfall to infiltrate instead of carrying soil away.",
    "sourceFactIds": [
      "CONSERVATION-TERRACE-MECHANISM"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-097",
    "qlName": "Terrace cultivation",
    "difficulty": "Medium",
    "stem": "Which region is well known for terrace cultivation as a soil-conservation practice?",
    "answer": "The western and central Himalayas",
    "distractors": [
      "The Thar dune core only",
      "The active Ganga floodplain",
      "The Deccan lava plain only"
    ],
    "explanation": "Terrace farming is widely used in the western and central Himalayas because cultivation occurs on steep slopes. Step-like fields help farmers control runoff and conserve the thin mountain soil.",
    "sourceFactIds": [
      "CONSERVATION-TERRACE-HIMALAYA"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-097",
    "qlName": "Terrace cultivation",
    "difficulty": "Medium",
    "stem": "A farmer converts a long hillside into a sequence of nearly level steps. What conservation objective is being achieved?",
    "answer": "Reducing runoff velocity and soil loss",
    "distractors": [
      "Increasing gully depth",
      "Exposing more bare soil to wind",
      "Encouraging downhill water flow"
    ],
    "explanation": "The steps interrupt the continuous downhill slope and reduce the speed of water. Lower runoff energy means less soil is detached and transported during heavy rain.",
    "sourceFactIds": [
      "CONSERVATION-TERRACE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-097",
    "qlName": "Terrace cultivation",
    "difficulty": "Medium",
    "stem": "Which comparison is correct?",
    "answer": "Terraces reshape steep slopes into steps, while contour ploughing follows elevation lines without creating large steps",
    "distractors": [
      "Both methods require flat desert land",
      "Contour ploughing creates deep ravines",
      "Terraces increase slope length"
    ],
    "explanation": "Both methods reduce runoff on sloping land, but they do so differently. Terraces physically reshape the slope into steps, while contour ploughing uses cross-slope furrows that follow elevation lines.",
    "sourceFactIds": [
      "CONSERVATION-TERRACE-VS-CONTOUR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-098",
    "qlName": "Strip cropping",
    "difficulty": "Easy",
    "stem": "Which description best defines strip cropping?",
    "answer": "Growing crops in alternating strips that interrupt wind or water flow",
    "distractors": [
      "Leaving the entire field bare",
      "Ploughing only straight downhill",
      "Removing all field boundaries"
    ],
    "explanation": "Strip cropping divides farmland into alternating bands, often with different crops or protective cover. The strips break the movement of wind and runoff, reducing the amount of soil carried away.",
    "sourceFactIds": [
      "CONSERVATION-STRIP"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-098",
    "qlName": "Strip cropping",
    "difficulty": "Easy",
    "stem": "How can strips of grass between crop rows help control erosion?",
    "answer": "They slow runoff and trap moving soil",
    "distractors": [
      "They increase runoff speed",
      "They remove soil-binding roots",
      "They create deep gullies"
    ],
    "explanation": "Grass strips provide roughness and dense roots that slow water and trap detached particles. They protect nearby cultivated strips from losing as much topsoil during rainfall.",
    "sourceFactIds": [
      "CONSERVATION-GRASS-STRIPS"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-098",
    "qlName": "Strip cropping",
    "difficulty": "Medium",
    "stem": "Which field arrangement best represents strip cropping?",
    "answer": "Alternating cultivated and protective strips across erosion-prone land",
    "distractors": [
      "One completely bare field",
      "Deep drainage gullies through the crop",
      "Only a single row of trees around the farm"
    ],
    "explanation": "Strip cropping uses repeated bands rather than leaving the whole field uniformly exposed. Protective strips interrupt wind or water movement and reduce the distance over which erosion can build strength.",
    "sourceFactIds": [
      "CONSERVATION-STRIP-LAYOUT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-098",
    "qlName": "Strip cropping",
    "difficulty": "Medium",
    "stem": "Why can strip cropping reduce wind erosion on open farmland?",
    "answer": "Alternating strips break the uninterrupted sweep of wind across bare soil",
    "distractors": [
      "It removes all surface roughness",
      "It increases the length of bare ground",
      "It makes soil permanently dry"
    ],
    "explanation": "Wind gains erosive power when it moves over a long exposed surface. Alternating crop or grass strips interrupt that movement and help trap particles before they travel far.",
    "sourceFactIds": [
      "CONSERVATION-STRIP-WIND"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-098",
    "qlName": "Strip cropping",
    "difficulty": "Medium",
    "stem": "Which practice is more appropriate for a field where runoff moves across the surface but the land is not steep enough for terraces?",
    "answer": "Strip cropping",
    "distractors": [
      "Mining",
      "Deforestation",
      "Overgrazing"
    ],
    "explanation": "Strip cropping can slow surface water and trap soil without requiring the major earthwork of terraces. It is useful where alternating bands can break runoff and protect the cultivated surface.",
    "sourceFactIds": [
      "CONSERVATION-STRIP-RUNOFF"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-098",
    "qlName": "Strip cropping",
    "difficulty": "Medium",
    "stem": "Which statement best distinguishes strip cropping from shelter belts?",
    "answer": "Strip cropping uses alternating crop or grass bands, while shelter belts use rows of trees or shrubs",
    "distractors": [
      "Both are identical forms of terrace farming",
      "Strip cropping is a mining method",
      "Shelter belts are deep gullies"
    ],
    "explanation": "Strip cropping protects soil with bands across a field, whereas shelter belts use woody vegetation as a wind barrier. Both reduce erosion, but their layout and primary mechanism differ.",
    "sourceFactIds": [
      "CONSERVATION-STRIP-VS-SHELTER"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-099",
    "qlName": "Shelter belts and dune stabilisation",
    "difficulty": "Easy",
    "stem": "Which description best defines a shelter belt?",
    "answer": "A row or belt of trees and shrubs planted to reduce wind speed",
    "distractors": [
      "A deep drainage gully",
      "A bare strip of soil",
      "A flooded river channel"
    ],
    "explanation": "Shelter belts are rows of trees or shrubs planted across the direction of prevailing winds. They slow near-surface air movement and protect loose soil from being blown away.",
    "sourceFactIds": [
      "CONSERVATION-SHELTER-BELT"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-099",
    "qlName": "Shelter belts and dune stabilisation",
    "difficulty": "Easy",
    "stem": "Shelter belts are especially useful for controlling which type of erosion?",
    "answer": "Wind erosion",
    "distractors": [
      "Glacial erosion",
      "River deposition",
      "Chemical weathering"
    ],
    "explanation": "Shelter belts reduce wind speed close to the ground and therefore reduce the movement of loose particles. They are particularly useful in dry and semi-arid landscapes exposed to strong winds.",
    "sourceFactIds": [
      "CONSERVATION-SHELTER-WIND"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-099",
    "qlName": "Shelter belts and dune stabilisation",
    "difficulty": "Medium",
    "stem": "How do shelter belts help stabilise sand dunes in western India?",
    "answer": "Vegetation slows wind and roots help hold loose sand",
    "distractors": [
      "Trees increase wind velocity",
      "Roots remove all sand",
      "They channel runoff into ravines"
    ],
    "explanation": "Rows of trees and shrubs reduce the force of wind over sandy surfaces, while roots help bind the loose material. This combination can stabilise dunes and reduce their movement.",
    "sourceFactIds": [
      "CONSERVATION-DUNE-STABILISE"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-099",
    "qlName": "Shelter belts and dune stabilisation",
    "difficulty": "Medium",
    "stem": "Which conservation practice is a standard choice for open dry land exposed to strong winds?",
    "answer": "Shelter belts",
    "distractors": [
      "Downhill ploughing",
      "Deforestation",
      "Overgrazing"
    ],
    "explanation": "Shelter belts are designed for wind-exposed landscapes where loose soil can be transported easily. Trees and shrubs act as barriers that reduce wind speed and trap moving particles.",
    "sourceFactIds": [
      "CONSERVATION-SHELTER-DRYLAND"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-099",
    "qlName": "Shelter belts and dune stabilisation",
    "difficulty": "Medium",
    "stem": "Which erosion-control comparison is correct?",
    "answer": "Shelter belts reduce wind speed, while contour ploughing primarily slows water runoff on slopes",
    "distractors": [
      "Both methods create deep gullies",
      "Shelter belts work only under water",
      "Contour ploughing is used to increase wind erosion"
    ],
    "explanation": "Shelter belts are primarily wind-control structures made of vegetation, whereas contour ploughing changes the direction of furrows on sloping fields. Each method targets a different erosion mechanism.",
    "sourceFactIds": [
      "CONSERVATION-SHELTER-VS-CONTOUR"
    ]
  },
  {
    "qlId": "GEO-SOI-001-QL-099",
    "qlName": "Shelter belts and dune stabilisation",
    "difficulty": "Medium",
    "stem": "A western Indian farm uses rows of trees across prevailing winds and grass strips between fields. What is the main purpose?",
    "answer": "To reduce wind speed and trap moving soil",
    "distractors": [
      "To expose more loose soil",
      "To increase dune movement",
      "To deepen runoff channels"
    ],
    "explanation": "Tree rows and grass strips both break the movement of air close to the surface. Together they reduce wind erosion and help keep loose soil or sand from travelling across the landscape.",
    "sourceFactIds": [
      "CONSERVATION-SHELTER-INTEGRATED"
    ]
  }
]);

export const GEO_SOI_001_CP011_REVIEW_BATCH_V1: readonly GeoSoi001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = (index + 3) % 4;
    return Object.freeze({
      questionId: `GEO-SOI-001-CP011-Q${String(index + 1).padStart(3, "0")}`,
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

export function auditGeoSoi001Cp011ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoSoi001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  for (const q of GEO_SOI_001_CP011_REVIEW_BATCH_V1) {
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
  if (GEO_SOI_001_CP011_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_SOI_001_CP011_REVIEW_BATCH_V1.length);
  for (let n=91;n<=99;n+=1){const qlId="GEO-SOI-001-QL-"+String(n).padStart(3,"0");if(qlCounts[qlId]!==6)issues.push("QL_COUNT:"+qlId+":"+(qlCounts[qlId]??0));}
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,13,13,14") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);
  return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_SOI_001_CP011_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
