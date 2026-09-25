import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp020ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_3: readonly SciCp020ReviewSpec[] = [
  [
    6,
    "Easy",
    "Which gas is taken in by green plants for photosynthesis?",
    "Carbon dioxide",
    [
      "Oxygen",
      "Nitrogen",
      "Hydrogen"
    ],
    "During photosynthesis, green plants use carbon dioxide from the air along with water to make carbohydrates. Oxygen is released as a by-product.",
    [
      "PHOTOSYNTHESIS-CO2"
    ]
  ],
  [
    6,
    "Easy",
    "Which gas is released as a major by-product of photosynthesis?",
    "Oxygen",
    [
      "Carbon dioxide",
      "Methane",
      "Nitrogen"
    ],
    "In oxygenic photosynthesis, water is split during the light reactions and oxygen is released. The plant uses carbon dioxide to build carbohydrates.",
    [
      "PHOTOSYNTHESIS-O2"
    ]
  ],
  [
    6,
    "Medium",
    "Which substance in leaves captures light energy for photosynthesis?",
    "Chlorophyll",
    [
      "Haemoglobin",
      "Keratin",
      "Cellulose"
    ],
    "Chlorophyll pigments absorb light energy in chloroplasts. This energy drives the reactions that ultimately produce carbohydrates. Chlorophyll is concentrated in chloroplasts of green leaf cells.",
    [
      "PHOTOSYNTHESIS-CHLOROPHYLL"
    ]
  ],
  [
    6,
    "Medium",
    "In the iodine test for a leaf, a blue-black colour indicates the presence of:",
    "Starch",
    [
      "Protein",
      "Fat",
      "Cellulose"
    ],
    "Iodine forms a blue-black complex with starch. A photosynthesizing leaf often stores some of the glucose formed as starch, so the test is used as evidence of photosynthesis.",
    [
      "PHOTOSYNTHESIS-IODINE"
    ]
  ],
  [
    6,
    "Medium",
    "Why is a potted plant kept in darkness before a starch test for photosynthesis?",
    "To remove previously stored starch from the leaves",
    [
      "To increase chlorophyll immediately",
      "To stop roots from absorbing water",
      "To fill leaves with carbon dioxide"
    ],
    "Keeping the plant in darkness allows stored starch to be used in respiration. This 'destarches' the leaves so newly formed starch can be linked to photosynthesis during the experiment.",
    [
      "PHOTOSYNTHESIS-DESTARCH"
    ]
  ],
  [
    6,
    "Hard",
    "A variegated leaf is exposed to light and then tested with iodine. Which region is expected to turn blue-black?",
    "Only the green region containing chlorophyll",
    [
      "Only the non-green region",
      "The entire leaf regardless of colour",
      "Neither region if water is available"
    ],
    "Only the green parts contain enough chlorophyll to carry out normal photosynthesis. Starch therefore accumulates in those regions and turns blue-black with iodine.",
    [
      "PHOTOSYNTHESIS-VARIEGATED"
    ]
  ],
  [
    7,
    "Easy",
    "Plant cells carry out respiration:",
    "Both during day and night",
    [
      "Only during the day",
      "Only during the night",
      "Only when photosynthesis stops permanently"
    ],
    "Respiration continuously releases usable energy from food in living plant cells. It occurs both in light and darkness, although photosynthesis requires light.",
    [
      "PLANT-RESPIRATION-DAY-NIGHT"
    ]
  ],
  [
    7,
    "Easy",
    "Which element is especially important for the formation of proteins in plants?",
    "Nitrogen",
    [
      "Sodium",
      "Chlorine only",
      "Neon"
    ],
    "Nitrogen is a major plant nutrient required for amino acids, proteins and nucleic acids. Plants commonly absorb it from soil as nitrate or ammonium ions.",
    [
      "PLANT-NITROGEN-PROTEIN"
    ]
  ],
  [
    7,
    "Medium",
    "Roots obtain mineral nutrients from the soil in the form of:",
    "Dissolved ions",
    [
      "Solid rock particles",
      "Undissolved starch grains",
      "Atmospheric pollen"
    ],
    "Mineral nutrients must generally be dissolved in soil water before roots can absorb them. They enter root cells as ions such as nitrate, potassium and phosphate.",
    [
      "PLANT-MINERALS-IONS"
    ]
  ],
  [
    7,
    "Medium",
    "Leguminous plants often improve soil nitrogen because their root nodules contain:",
    "Nitrogen-fixing bacteria",
    [
      "Yeast that produces oxygen",
      "Algae that form xylem",
      "Fungi that make chlorophyll"
    ],
    "Root nodules of many legumes contain Rhizobium bacteria. These bacteria fix atmospheric nitrogen into forms that can enter biological nitrogen compounds.",
    [
      "LEGUME-RHIZOBIUM"
    ]
  ],
  [
    7,
    "Medium",
    "Magnesium deficiency can directly reduce photosynthesis because magnesium is an important part of:",
    "Chlorophyll",
    [
      "Cellulose",
      "Starch only",
      "Pollen wall"
    ],
    "Magnesium is a central component of the chlorophyll molecule. A severe deficiency can therefore reduce chlorophyll formation and lower photosynthetic capacity.",
    [
      "PLANT-MAGNESIUM-CHLOROPHYLL"
    ]
  ],
  [
    7,
    "Hard",
    "Why may a plant wilt and show poor growth when its roots remain waterlogged for a long time?",
    "Roots receive too little oxygen for normal respiration",
    [
      "Leaves receive too much nitrogen from the air",
      "Xylem begins producing sugars instead of water",
      "Stomata permanently absorb soil minerals"
    ],
    "Waterlogged soil has fewer air spaces, so roots may become oxygen-deficient. Reduced root respiration lowers energy supply for active uptake and normal root function.",
    [
      "PLANT-WATERLOGGING-RESPIRATION"
    ]
  ],
  [
    8,
    "Easy",
    "Growth of a plant shoot toward light is called:",
    "Phototropism",
    [
      "Geotropism",
      "Hydrotropism",
      "Thigmotropism"
    ],
    "Phototropism is directional growth in response to light. Young shoots commonly show positive phototropism by bending toward the light source.",
    [
      "TROPISM-PHOTO"
    ]
  ],
  [
    8,
    "Easy",
    "Roots generally grow downward in response to gravity. This is:",
    "Positive geotropism",
    [
      "Negative geotropism",
      "Positive phototropism",
      "Negative hydrotropism"
    ],
    "Roots usually grow in the direction of gravitational pull and therefore show positive geotropism, also called positive gravitropism. This response helps roots grow into the soil where water and minerals are available.",
    [
      "TROPISM-GEO-ROOT"
    ]
  ],
  [
    8,
    "Medium",
    "Growth of roots toward a region of higher moisture is an example of:",
    "Hydrotropism",
    [
      "Phototropism",
      "Thigmotropism",
      "Chemotropism of pollen only"
    ],
    "Hydrotropism is directional growth in response to water or moisture. Roots often grow toward regions where more water is available.",
    [
      "TROPISM-HYDRO"
    ]
  ],
  [
    8,
    "Medium",
    "Which plant hormone promotes cell elongation and bending of shoots toward light?",
    "Auxin",
    [
      "Abscisic acid",
      "Ethylene",
      "Cytokinin only"
    ],
    "Auxin promotes cell elongation in young shoots. Unequal auxin distribution during phototropism causes greater elongation on one side, bending the shoot toward light.",
    [
      "HORMONE-AUXIN"
    ]
  ],
  [
    8,
    "Medium",
    "Which plant hormone promotes fruit ripening?",
    "Ethylene",
    [
      "Auxin",
      "Gibberellin",
      "Cytokinin"
    ],
    "Ethylene is a gaseous plant hormone that promotes ripening in many fruits. It also participates in several ageing and shedding responses.",
    [
      "HORMONE-ETHYLENE"
    ]
  ],
  [
    8,
    "Hard",
    "A plant closes its stomata during water stress and slows growth. Which hormone is linked with this stress response?",
    "Abscisic acid",
    [
      "Auxin",
      "Gibberellin",
      "Ethylene only"
    ],
    "Abscisic acid helps plants respond to water stress, including promoting stomatal closure. It also tends to inhibit growth under unfavourable conditions.",
    [
      "HORMONE-ABA"
    ]
  ]
] as const;
