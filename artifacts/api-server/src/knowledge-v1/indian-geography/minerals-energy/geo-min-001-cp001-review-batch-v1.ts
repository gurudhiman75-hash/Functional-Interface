import { buildGeoMinQl, finalizeGeoMinCp, auditGeoMinCp } from "./geo-min-001-review-builder";

const QL_001 = buildGeoMinQl(1, "Mineral meaning and basic character", [
  {
    "stem": "Which statement correctly defines a mineral in geography?",
    "answer": "A naturally occurring homogeneous substance with a definable internal structure",
    "distractors": [
      "Any rock used for construction",
      "Any material extracted from a mine",
      "A manufactured substance with metallic properties"
    ],
    "explanation": "A mineral is a naturally occurring homogeneous substance with a definable internal structure. Rocks may contain one or several minerals, so the two terms are not interchangeable.",
    "sourceFactId": "MINERAL-DEFINITION"
  },
  {
    "stem": "A geographer finds a naturally formed substance with a definite internal structure. How should it be classified?",
    "answer": "As a mineral",
    "distractors": [
      "As an ore in every case",
      "As a sedimentary rock only",
      "As an industrial product"
    ],
    "explanation": "The defining clue is that the substance is naturally occurring and has a definable internal structure. An ore is a narrower economic term and not every mineral is an ore.",
    "sourceFactId": "MINERAL-IDENTIFICATION"
  },
  {
    "stem": "Consider the statements: I. Minerals occur naturally. II. Every mineral is necessarily an ore. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Minerals are naturally occurring substances, but only some mineral deposits can be economically worked as ores. Therefore the first statement is correct and the second is too broad.",
    "sourceFactId": "MINERAL-VS-ORE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Mineral — naturally occurring homogeneous substance",
    "distractors": [
      "Ore — every mineral found in the crust",
      "Rock — always made of one mineral",
      "Mineral — necessarily metallic"
    ],
    "explanation": "A mineral is defined by natural occurrence and a characteristic internal structure. Ores are economically workable mineral-bearing materials, while rocks can contain several minerals.",
    "sourceFactId": "MINERAL-MATCH"
  },
  {
    "stem": "Why can two rocks of the same broad type contain different mineral combinations?",
    "answer": "Rocks may be aggregates of different minerals",
    "distractors": [
      "Every rock is a pure mineral",
      "Minerals occur only in sedimentary rocks",
      "Rock composition is fixed throughout India"
    ],
    "explanation": "A rock is commonly an aggregate of one or more minerals. Because the mineral mixture can vary, rocks belonging to the same broad group need not have identical mineral composition.",
    "sourceFactId": "ROCK-MINERAL-RELATION"
  },
  {
    "stem": "A question asks for the most precise distinction between a mineral and an ore. Which response is correct?",
    "answer": "An ore is a mineral-bearing material that can be worked economically",
    "distractors": [
      "A mineral is always commercially workable but an ore is not",
      "An ore must be non-metallic while a mineral must be metallic",
      "There is no distinction between the two terms"
    ],
    "explanation": "Ore is an economic concept: it contains enough useful mineral to justify extraction under given conditions. Mineral is the broader natural-material concept and need not be commercially workable.",
    "sourceFactId": "MINERAL-ORE-DISTINCTION"
  }
] as const);

const QL_002 = buildGeoMinQl(2, "Veins and lodes", [
  {
    "stem": "Metallic minerals found in cracks, faults and joints of igneous and metamorphic rocks commonly occur in what form?",
    "answer": "Veins and lodes",
    "distractors": [
      "Beds and layers",
      "Placer deposits",
      "Residual blankets"
    ],
    "explanation": "Minerals may fill cracks, crevices, faults and joints in igneous and metamorphic rocks. Smaller occurrences are called veins and larger ones are called lodes.",
    "sourceFactId": "VEINS-LODES-OCCURRENCE"
  },
  {
    "stem": "Which mode of mineral occurrence is typical when molten or gaseous mineral matter is forced into rock fissures and solidifies there?",
    "answer": "Veins and lodes",
    "distractors": [
      "Alluvial placers",
      "Sedimentary beds",
      "Evaporite layers"
    ],
    "explanation": "Mineral matter can enter openings in surrounding rock and later solidify. This process produces vein or lode deposits rather than horizontal sedimentary beds.",
    "sourceFactId": "VEINS-LODES-PROCESS"
  },
  {
    "stem": "Consider the statements: I. Veins and lodes are linked with cracks and faults. II. They are formed only by river deposition. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Veins and lodes occupy fissures, joints and faults in hard rocks. River action instead produces placer deposits, so the second statement is incorrect.",
    "sourceFactId": "VEINS-LODES-STATEMENT"
  },
  {
    "stem": "Which occurrence would most strongly indicate a lode deposit?",
    "answer": "A large mineral-filled fissure cutting through hard rock",
    "distractors": [
      "Heavy grains concentrated in river sand",
      "A horizontal coal seam",
      "A surface residue left after weathering"
    ],
    "explanation": "A lode is a comparatively large mineral filling in a fissure or crack within hard rock. River sands, coal seams and residual deposits represent different modes of occurrence.",
    "sourceFactId": "LODE-CLUE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Lode — larger mineral deposit in a rock fissure",
    "distractors": [
      "Vein — river-borne heavy mineral deposit",
      "Lode — horizontal sedimentary bed",
      "Vein — residual deposit formed by weathering"
    ],
    "explanation": "Veins and lodes both fill openings in rocks, with lodes generally referring to larger occurrences. The other options describe placer, bedded or residual deposits.",
    "sourceFactId": "LODE-MATCH"
  },
  {
    "stem": "A mineral belt follows a major fault zone through metamorphic rock rather than a river valley or sedimentary basin. Which occurrence is most likely?",
    "answer": "Vein or lode mineralisation",
    "distractors": [
      "Placer concentration",
      "Bedded sedimentary deposition",
      "Residual weathering deposit"
    ],
    "explanation": "A fault zone provides fractures through which mineral-bearing solutions can move and deposit material. That setting is characteristic of vein or lode mineralisation in hard rocks.",
    "sourceFactId": "LODE-FAULT-REASONING"
  }
] as const);

const QL_003 = buildGeoMinQl(3, "Beds and layers in sedimentary rocks", [
  {
    "stem": "Coal and some other minerals in sedimentary rocks commonly occur in which form?",
    "answer": "Beds or layers",
    "distractors": [
      "Veins only",
      "Placer pockets",
      "Residual caps only"
    ],
    "explanation": "Sedimentary deposition commonly produces minerals in horizontal or gently inclined beds and layers. Coal seams are a familiar example of this form of occurrence.",
    "sourceFactId": "BEDS-LAYERS"
  },
  {
    "stem": "Which geological setting is most suitable for mineral deposits formed by repeated sedimentation in horizontal strata?",
    "answer": "Sedimentary basins",
    "distractors": [
      "Fault-filled metamorphic zones",
      "River placers only",
      "Fresh volcanic vents only"
    ],
    "explanation": "Repeated deposition in a basin builds distinct sedimentary strata. Minerals formed in this way occur as beds or layers rather than as fissure-filling lodes.",
    "sourceFactId": "SEDIMENTARY-BASIN"
  },
  {
    "stem": "Consider the statements: I. Bedded mineral deposits are common in sedimentary rocks. II. Veins and lodes are the only form in which minerals occur. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Sedimentary rocks commonly contain mineral deposits in beds or layers. Minerals have several modes of occurrence, so veins and lodes are not the only form.",
    "sourceFactId": "BEDDED-STATEMENT"
  },
  {
    "stem": "A thick mineral seam lies parallel to surrounding sedimentary strata. Which mode of occurrence does this show?",
    "answer": "A bedded or layered deposit",
    "distractors": [
      "A placer deposit",
      "A residual deposit",
      "A fissure vein"
    ],
    "explanation": "A seam that follows the surrounding sedimentary strata is a bedded deposit. Veins cut through rock openings, while placers and residual deposits form by different surface processes.",
    "sourceFactId": "BEDDED-CLUE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Coal seam — bedded sedimentary occurrence",
    "distractors": [
      "Gold in river sand — lode occurrence",
      "Bauxite residue — placer occurrence",
      "Mineral in a fault crack — sedimentary bed"
    ],
    "explanation": "Coal commonly occurs in seams within sedimentary formations. River-sand gold is a placer, bauxite can form residually, and fault cracks may host veins or lodes.",
    "sourceFactId": "BEDDED-MATCH"
  },
  {
    "stem": "A survey finds two deposits: X is parallel to sedimentary strata; Y fills a cross-cutting fracture. How should X and Y be classified?",
    "answer": "X as bedded, Y as vein or lode",
    "distractors": [
      "X as placer, Y as residual",
      "X as vein, Y as bedded",
      "Both as placer deposits"
    ],
    "explanation": "A deposit parallel to sedimentary layers is bedded, whereas a mineral filling a fracture is a vein or lode. Their geometry reveals two different modes of mineral occurrence.",
    "sourceFactId": "BEDDED-VS-LODE"
  }
] as const);

const QL_004 = buildGeoMinQl(4, "Residual deposits and weathering", [
  {
    "stem": "Which mineral is a standard example of a residual deposit formed by decomposition of surface rocks?",
    "answer": "Bauxite",
    "distractors": [
      "Coal",
      "Petroleum",
      "Rock salt"
    ],
    "explanation": "Bauxite may form when intense weathering removes soluble materials and leaves aluminium-rich material behind. This makes it a classic residual mineral deposit.",
    "sourceFactId": "RESIDUAL-BAUXITE"
  },
  {
    "stem": "What process is most directly responsible for residual mineral concentration near the land surface?",
    "answer": "Weathering and removal of soluble constituents",
    "distractors": [
      "River sorting alone",
      "Cooling of magma in a fissure",
      "Burial of organic matter only"
    ],
    "explanation": "Residual concentration develops when weathering breaks down rock and mobile materials are leached away. Less soluble mineral matter remains concentrated at or near the surface.",
    "sourceFactId": "RESIDUAL-PROCESS"
  },
  {
    "stem": "Consider the statements: I. Residual deposits can form through weathering. II. They require minerals to be transported far downstream. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Residual deposits form largely in place as weathering removes unwanted material. Long-distance transport and sorting are features of placer formation, not residual concentration.",
    "sourceFactId": "RESIDUAL-STATEMENT"
  },
  {
    "stem": "A plateau surface has been deeply weathered, leaving an aluminium-rich mantle after soluble material was removed. What deposit is indicated?",
    "answer": "A residual bauxite deposit",
    "distractors": [
      "A coal seam",
      "A petroleum trap",
      "A placer gold deposit"
    ],
    "explanation": "Deep chemical weathering can leave aluminium-rich bauxite as a residual mantle. The deposit forms at the weathered surface rather than in a sedimentary seam or river channel.",
    "sourceFactId": "RESIDUAL-CLUE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Residual deposit — concentration left after weathering",
    "distractors": [
      "Placer deposit — mineral filling a deep rock crack",
      "Lode — horizontal sedimentary seam",
      "Bed deposit — material left after leaching"
    ],
    "explanation": "Residual deposits are concentrations that remain after weathering and leaching remove more soluble components. The other pairings mix up distinct mineral-occurrence processes.",
    "sourceFactId": "RESIDUAL-MATCH"
  },
  {
    "stem": "Why is bauxite often linked with old plateau surfaces rather than active river channels?",
    "answer": "Prolonged weathering can leave aluminium-rich residual material in place",
    "distractors": [
      "Bauxite forms only by river sorting",
      "It is created by coalification",
      "It requires marine salt evaporation"
    ],
    "explanation": "Old stable surfaces can undergo prolonged chemical weathering and leaching, favouring residual bauxite formation. Active river channels are more typical settings for placer concentration.",
    "sourceFactId": "RESIDUAL-PLATEAU-REASONING"
  }
] as const);

const QL_005 = buildGeoMinQl(5, "Placer and alluvial deposits", [
  {
    "stem": "Heavy minerals such as gold may become concentrated in river sands as what type of deposit?",
    "answer": "Placer deposit",
    "distractors": [
      "Residual deposit",
      "Bedded coal deposit",
      "Evaporite layer"
    ],
    "explanation": "Running water can separate heavy, resistant mineral grains from lighter material and concentrate them in alluvial sands. Such concentrations are known as placer deposits.",
    "sourceFactId": "PLACER-DEFINITION"
  },
  {
    "stem": "Which process is central to the formation of placer deposits?",
    "answer": "Mechanical sorting by flowing water",
    "distractors": [
      "Leaching on a plateau",
      "Cooling inside a fault",
      "Compaction of plant remains"
    ],
    "explanation": "Placer deposits form because moving water transports and sorts particles according to size and density. Heavy resistant minerals can therefore become concentrated in stream or river sediments.",
    "sourceFactId": "PLACER-PROCESS"
  },
  {
    "stem": "Consider the statements: I. Placer deposits are often found in alluvial sands. II. They form because heavy minerals are easily dissolved in water. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Placers occur in alluvial sediments where heavy resistant grains accumulate. Their concentration depends on physical sorting, not on the minerals dissolving readily in water.",
    "sourceFactId": "PLACER-STATEMENT"
  },
  {
    "stem": "A prospector finds dense metallic grains concentrated behind bends in a river channel. Which deposit is most likely?",
    "answer": "A placer deposit",
    "distractors": [
      "A lode deposit",
      "A residual bauxite deposit",
      "A sedimentary coal seam"
    ],
    "explanation": "River bends and similar low-energy zones can trap dense mineral grains after lighter sediment is carried farther. That sorting mechanism is characteristic of placer deposits.",
    "sourceFactId": "PLACER-CLUE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Placer — heavy mineral concentration in alluvial material",
    "distractors": [
      "Lode — mineral concentration in river sand",
      "Residual — mineral seam parallel to strata",
      "Bed — mineral left after surface leaching"
    ],
    "explanation": "Placers are alluvial concentrations of heavy minerals. Lodes fill rock fissures, residual deposits remain after weathering, and beds follow sedimentary layering.",
    "sourceFactId": "PLACER-MATCH"
  },
  {
    "stem": "Deposit X is a gold-rich river sand; deposit Y is aluminium-rich material left after intense weathering. Which classification is correct?",
    "answer": "X is placer and Y is residual",
    "distractors": [
      "X is residual and Y is placer",
      "Both are lodes",
      "Both are bedded deposits"
    ],
    "explanation": "Gold-rich alluvium is a placer formed by mechanical sorting, while aluminium-rich material left by weathering is residual. The two deposits therefore record different surface processes.",
    "sourceFactId": "PLACER-VS-RESIDUAL"
  }
] as const);

const QL_006 = buildGeoMinQl(6, "Ferrous minerals", [
  {
    "stem": "Which group of minerals contains iron and is therefore classed as ferrous?",
    "answer": "Iron ore, manganese and chromite",
    "distractors": [
      "Bauxite, copper and lead",
      "Mica, limestone and gypsum",
      "Gold, silver and copper"
    ],
    "explanation": "Ferrous minerals are linked with iron and the iron-and-steel alloy system. Iron ore, manganese and chromite are standard exam examples in this group.",
    "sourceFactId": "FERROUS-GROUP"
  },
  {
    "stem": "Why are manganese and chromite commonly grouped with iron ore in mineral geography?",
    "answer": "They are important ferrous or ferro-alloy minerals used with iron and steel",
    "distractors": [
      "They are all non-metallic minerals",
      "They occur only in river sands",
      "They are all fuels"
    ],
    "explanation": "Manganese and chromium-bearing chromite are important to alloy and steel production. This industrial relationship places them with the ferrous mineral group in exam geography.",
    "sourceFactId": "FERROUS-LOGIC"
  },
  {
    "stem": "Consider the statements: I. Ferrous minerals are important to metallurgical industries. II. Bauxite is a ferrous mineral. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Ferrous minerals underpin iron, steel and alloy industries. Bauxite is the principal ore of aluminium and belongs to the non-ferrous group.",
    "sourceFactId": "FERROUS-STATEMENT"
  },
  {
    "stem": "Which of the following is NOT a ferrous mineral?",
    "answer": "Bauxite",
    "distractors": [
      "Iron ore",
      "Manganese",
      "Chromite"
    ],
    "explanation": "Bauxite supplies aluminium and is classified as non-ferrous. Iron ore, manganese and chromite are grouped with the ferrous and ferro-alloy mineral system.",
    "sourceFactId": "FERROUS-NEGATIVE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Chromite — ferrous/ferro-alloy mineral",
    "distractors": [
      "Bauxite — ferrous mineral",
      "Mica — metallic ferrous mineral",
      "Limestone — non-ferrous metal ore"
    ],
    "explanation": "Chromite provides chromium used in alloy steels and is treated with ferro-alloy minerals. Bauxite is non-ferrous, while mica and limestone are non-metallic minerals.",
    "sourceFactId": "FERROUS-MATCH"
  },
  {
    "stem": "A proposed alloy-steel plant wants nearby supplies of iron ore plus two important alloy minerals. Which pair would be most relevant?",
    "answer": "Manganese and chromite",
    "distractors": [
      "Mica and gypsum",
      "Bauxite and limestone only",
      "Gold and silver"
    ],
    "explanation": "Manganese and chromite provide alloying elements widely used with iron and steel. Their role is different from non-metallic minerals such as mica or gypsum.",
    "sourceFactId": "FERROUS-ALLOY-REASONING"
  }
] as const);

const QL_007 = buildGeoMinQl(7, "Non-ferrous metallic minerals", [
  {
    "stem": "Which set consists entirely of non-ferrous metallic minerals?",
    "answer": "Bauxite, copper and lead-zinc",
    "distractors": [
      "Iron ore, manganese and chromite",
      "Mica, gypsum and limestone",
      "Coal, petroleum and natural gas"
    ],
    "explanation": "Non-ferrous metallic minerals do not belong to the iron-based ferrous group. Bauxite supplies aluminium, while copper and lead-zinc are standard non-ferrous metals.",
    "sourceFactId": "NONFERROUS-GROUP"
  },
  {
    "stem": "Which mineral should be placed in the non-ferrous category rather than the ferrous category?",
    "answer": "Copper",
    "distractors": [
      "Iron ore",
      "Manganese",
      "Chromite"
    ],
    "explanation": "Copper is a metallic mineral but it is not part of the iron-based ferrous group. Iron ore, manganese and chromite are treated as ferrous or ferro-alloy minerals.",
    "sourceFactId": "NONFERROUS-COPPER"
  },
  {
    "stem": "Consider the statements: I. Bauxite is non-ferrous. II. Copper is non-metallic. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Bauxite is the ore of aluminium and belongs to the non-ferrous metallic group. Copper is also metallic, so describing it as non-metallic is incorrect.",
    "sourceFactId": "NONFERROUS-STATEMENT"
  },
  {
    "stem": "A mineral is metallic but has no role as an iron-bearing ore. Which classification is most appropriate?",
    "answer": "Non-ferrous metallic mineral",
    "distractors": [
      "Non-metallic mineral in every case",
      "Fuel mineral",
      "Sedimentary rock"
    ],
    "explanation": "Metallic minerals are divided into ferrous and non-ferrous groups according to their relation to iron. A metallic mineral outside the iron-based group is classified as non-ferrous.",
    "sourceFactId": "NONFERROUS-CLUE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Bauxite — non-ferrous metallic mineral",
    "distractors": [
      "Manganese — non-ferrous mineral",
      "Limestone — metallic mineral",
      "Coal — non-ferrous metal"
    ],
    "explanation": "Bauxite is the principal aluminium ore and is non-ferrous. Manganese is grouped with ferrous minerals, while limestone and coal are not metallic ores.",
    "sourceFactId": "NONFERROUS-MATCH"
  },
  {
    "stem": "A classification table places iron ore, copper, bauxite and mica together. Which two entries should form the non-ferrous metallic subgroup?",
    "answer": "Copper and bauxite",
    "distractors": [
      "Iron ore and mica",
      "Iron ore and copper",
      "Bauxite and mica"
    ],
    "explanation": "Copper and bauxite are both metallic resources outside the ferrous iron group. Iron ore is ferrous, while mica is a non-metallic mineral.",
    "sourceFactId": "NONFERROUS-SORTING"
  }
] as const);

const QL_008 = buildGeoMinQl(8, "Non-metallic minerals", [
  {
    "stem": "Which set consists entirely of non-metallic minerals?",
    "answer": "Mica, limestone and gypsum",
    "distractors": [
      "Iron ore, manganese and chromite",
      "Bauxite, copper and zinc",
      "Coal, petroleum and natural gas"
    ],
    "explanation": "Mica, limestone and gypsum are standard non-metallic minerals used by several industries. They differ from metallic ores and from fuel resources.",
    "sourceFactId": "NONMETALLIC-GROUP"
  },
  {
    "stem": "Which mineral is non-metallic despite its major industrial importance?",
    "answer": "Mica",
    "distractors": [
      "Copper",
      "Bauxite",
      "Chromite"
    ],
    "explanation": "Mica is a non-metallic mineral valued especially for its insulating and heat-resistant properties. Copper, bauxite and chromite belong to metallic mineral groups.",
    "sourceFactId": "NONMETALLIC-MICA"
  },
  {
    "stem": "Consider the statements: I. Limestone is non-metallic. II. Every non-metallic mineral is an energy resource. Which is correct?",
    "answer": "Only I is correct",
    "distractors": [
      "Only II is correct",
      "Both I and II are correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Limestone is a non-metallic mineral and an important industrial raw material. Non-metallic does not mean fuel, so many such minerals are not energy resources.",
    "sourceFactId": "NONMETALLIC-STATEMENT"
  },
  {
    "stem": "A factory needs a mineral raw material for cement rather than a metal ore. Which mineral is most relevant?",
    "answer": "Limestone",
    "distractors": [
      "Iron ore",
      "Copper ore",
      "Chromite"
    ],
    "explanation": "Limestone is a key raw material for cement manufacture and is non-metallic. Iron ore, copper and chromite are metallic mineral resources used in different industries.",
    "sourceFactId": "NONMETALLIC-CEMENT-CLUE"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Gypsum — non-metallic mineral",
    "distractors": [
      "Copper — non-metallic mineral",
      "Manganese — non-metallic mineral",
      "Bauxite — non-metallic mineral"
    ],
    "explanation": "Gypsum belongs to the non-metallic mineral group. Copper, manganese and bauxite are metallic mineral resources even though they differ in ferrous classification.",
    "sourceFactId": "NONMETALLIC-MATCH"
  },
  {
    "stem": "Which classification correctly separates four resources: mica, limestone, copper and iron ore?",
    "answer": "Mica and limestone are non-metallic; copper and iron ore are metallic",
    "distractors": [
      "Only mica is non-metallic",
      "Copper and limestone are non-metallic",
      "All four are metallic"
    ],
    "explanation": "Mica and limestone are non-metallic industrial minerals, whereas copper and iron ore are metallic. The distinction is based on mineral character, not simply on economic importance.",
    "sourceFactId": "NONMETALLIC-SORTING"
  }
] as const);

const QL_009 = buildGeoMinQl(9, "Mineral conservation", [
  {
    "stem": "Why is conservation important for mineral resources?",
    "answer": "They are finite and form over very long geological periods",
    "distractors": [
      "They can be regenerated every crop season",
      "They are manufactured whenever demand rises",
      "Mining automatically replaces depleted deposits"
    ],
    "explanation": "Mineral deposits take extremely long geological periods to form and economically workable reserves are limited. Rapid extraction can therefore deplete resources far faster than nature can replace them.",
    "sourceFactId": "MINERAL-CONSERVATION"
  },
  {
    "stem": "Which action most directly supports mineral conservation?",
    "answer": "Recycling metals and using mineral resources efficiently",
    "distractors": [
      "Discarding metal scrap after one use",
      "Mining lower-grade ore without improving recovery",
      "Replacing durable products more frequently"
    ],
    "explanation": "Recycling recovers useful metals from existing products and reduces demand for fresh extraction. Efficient processing and reduced waste also extend the life of mineral reserves.",
    "sourceFactId": "MINERAL-RECYCLING"
  },
  {
    "stem": "Consider the statements: I. Mineral resources are exhaustible on a human time scale. II. Recycling can reduce pressure on new mining. Which is correct?",
    "answer": "Both I and II are correct",
    "distractors": [
      "Only I is correct",
      "Only II is correct",
      "Neither I nor II is correct"
    ],
    "explanation": "Mineral formation is extremely slow compared with human consumption, making reserves effectively exhaustible. Recycling and reuse reduce the amount of new ore that must be mined.",
    "sourceFactId": "MINERAL-CONSERVATION-STATEMENT"
  },
  {
    "stem": "A metal-intensive industry wants to lower its dependence on freshly mined ore. Which measure should receive priority?",
    "answer": "Greater recovery and recycling of scrap metal",
    "distractors": [
      "Increasing avoidable processing losses",
      "Using ore once and discarding the product",
      "Rejecting all secondary metal"
    ],
    "explanation": "Scrap recovery returns metal to the production cycle and directly reduces demand for virgin ore. Better recovery from ore and reduced waste reinforce the same conservation goal.",
    "sourceFactId": "MINERAL-SCRAP"
  },
  {
    "stem": "Which pair is correctly matched?",
    "answer": "Mineral conservation — recycling and efficient use",
    "distractors": [
      "Mineral conservation — faster disposal of metals",
      "Resource security — maximum processing loss",
      "Sustainable mining — ignoring low-waste technology"
    ],
    "explanation": "Conservation seeks to obtain more useful output from each unit of mineral and to recover materials after use. Recycling and efficient technology therefore fit the objective directly.",
    "sourceFactId": "MINERAL-CONSERVATION-MATCH"
  },
  {
    "stem": "Two policies are proposed: X improves ore recovery during processing; Y increases recycling of finished metal products. What is their combined effect?",
    "answer": "Both can reduce pressure on fresh mineral extraction",
    "distractors": [
      "Only X helps conservation",
      "Only Y helps conservation",
      "Neither affects mineral demand"
    ],
    "explanation": "Improved recovery reduces mineral lost during processing, while recycling returns used metal to the supply chain. Together they lower the amount of freshly mined material needed for the same service.",
    "sourceFactId": "MINERAL-CONSERVATION-REASONING"
  }
] as const);

export const GEO_MIN_001_CP001_REVIEW_BATCH_V1 = finalizeGeoMinCp(1, [QL_001, QL_002, QL_003, QL_004, QL_005, QL_006, QL_007, QL_008, QL_009]);
export function auditGeoMin001Cp001ReviewBatchV1() { return auditGeoMinCp(1, 1, 9, GEO_MIN_001_CP001_REVIEW_BATCH_V1); }
