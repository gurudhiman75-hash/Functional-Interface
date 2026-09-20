import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp032ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp032ReviewSpec[] = [
  [
    3,
    "Medium",
    "Cyanobacteria are classified under Monera because they:",
    "Are prokaryotic despite carrying out photosynthesis",
    [
      "Are fungi with chlorophyll",
      "Have true nuclei",
      "Are multicellular plants"
    ],
    "Cyanobacteria photosynthesize but have prokaryotic cell organization, placing them in Monera in the five-kingdom system.",
    [
      "CYANOBACTERIA-MONERA"
    ]
  ],
  [
    3,
    "Medium",
    "Paramecium differs from a bacterium because Paramecium:",
    "Has a true nucleus and membrane-bound organelles",
    [
      "Has no genetic material",
      "Is always photosynthetic",
      "Has a cellulose cell wall"
    ],
    "Paramecium is a eukaryotic protist with a true nucleus and membrane-bound organelles.",
    [
      "PARAMECIUM-EUKARYOTE"
    ]
  ],
  [
    3,
    "Hard",
    "A microscopic organism is unicellular, has a true nucleus and moves using pseudopodia. It is best classified as a:",
    "Protist",
    [
      "Moneran",
      "Fungus",
      "Bryophyte"
    ],
    "Amoeba-like organisms with pseudopodia are unicellular eukaryotes and belong to Protista.",
    [
      "IDENTIFY-PROTIST"
    ]
  ],
  [
    4,
    "Easy",
    "Mushrooms belong to the kingdom:",
    "Fungi",
    [
      "Plantae",
      "Protista",
      "Monera"
    ],
    "Mushrooms are multicellular fungi.",
    [
      "MUSHROOM-FUNGI"
    ]
  ],
  [
    4,
    "Easy",
    "In classification, yeast is best described as a:",
    "Unicellular fungus",
    [
      "Bacterium",
      "Protozoan",
      "Alga"
    ],
    "Yeast is a single-celled member of the fungi.",
    [
      "YEAST-FUNGUS"
    ]
  ],
  [
    4,
    "Medium",
    "Fungi differ from green plants because fungi:",
    "Lack chlorophyll and obtain food heterotrophically",
    [
      "Have chlorophyll in all cells",
      "Always lack cell walls",
      "Are prokaryotic"
    ],
    "Fungi do not photosynthesize; they absorb nutrients from organic material.",
    [
      "FUNGI-VS-PLANTS"
    ]
  ],
  [
    4,
    "Medium",
    "Which substance is commonly present in fungal cell walls?",
    "Chitin",
    [
      "Cellulose only",
      "Lignin only",
      "Haemoglobin"
    ],
    "Fungal cell walls typically contain chitin.",
    [
      "FUNGI-CHITIN"
    ]
  ],
  [
    4,
    "Medium",
    "Bread mould is commonly classified as a fungus because it:",
    "Forms hyphae and absorbs nutrients from organic matter",
    [
      "Has roots, stems and leaves",
      "Carries out photosynthesis",
      "Is prokaryotic"
    ],
    "Moulds consist of hyphae and use absorptive heterotrophic nutrition.",
    [
      "MOULD-FUNGAL-FEATURES"
    ]
  ],
  [
    4,
    "Hard",
    "An organism has a cell wall, lacks chlorophyll and feeds by secreting enzymes onto dead matter before absorbing nutrients. It most likely belongs to:",
    "Fungi",
    [
      "Plantae",
      "Animalia",
      "Protista only"
    ],
    "External digestion followed by absorption, together with a non-photosynthetic cell wall, strongly indicates a fungus.",
    [
      "IDENTIFY-FUNGUS"
    ]
  ],
  [
    5,
    "Easy",
    "Bryophytes are often called the amphibians of the plant kingdom because they:",
    "Live on land but need water for sexual reproduction",
    [
      "Live only in oceans",
      "Have flowers and fruits",
      "Produce naked seeds"
    ],
    "Bryophytes are terrestrial plants but water is needed for movement of male gametes during sexual reproduction.",
    [
      "BRYOPHYTES-AMPHIBIANS"
    ]
  ],
  [
    5,
    "Easy",
    "Which plant group has vascular tissue but reproduces by spores rather than seeds?",
    "Pteridophytes",
    [
      "Bryophytes",
      "Gymnosperms",
      "Angiosperms"
    ],
    "Pteridophytes such as ferns have vascular tissues and reproduce by spores.",
    [
      "PTERIDOPHYTES-VASCULAR-SPORES"
    ]
  ],
  [
    5,
    "Medium",
    "Algae are traditionally placed among thallophytes because their body:",
    "Is not differentiated into true roots, stems and leaves",
    [
      "Always bears flowers",
      "Produces seeds in cones",
      "Has a vertebral column"
    ],
    "A thallus is a simple plant body lacking true root, stem and leaf differentiation.",
    [
      "THALLOPHYTA-THALLUS"
    ]
  ],
  [
    5,
    "Medium",
    "Which feature separates pteridophytes from bryophytes?",
    "Presence of well-developed vascular tissue",
    [
      "Absence of chlorophyll",
      "Production of flowers",
      "Production of fruits"
    ],
    "Bryophytes lack true vascular tissue, while pteridophytes possess xylem and phloem.",
    [
      "PTERIDOPHYTE-VS-BRYOPHYTE"
    ]
  ],
  [
    5,
    "Medium",
    "Which example belongs to the bryophytes?",
    "Moss",
    [
      "Fern",
      "Pine",
      "Mango"
    ],
    "Mosses are bryophytes, small non-vascular land plants.",
    [
      "MOSS-BRYOPHYTE"
    ]
  ],
  [
    5,
    "Hard",
    "A plant has true roots, stems and leaves, contains vascular tissue, but forms no seeds. It is best classified as a:",
    "Pteridophyte",
    [
      "Bryophyte",
      "Gymnosperm",
      "Angiosperm"
    ],
    "Vascular tissue with true organs but reproduction by spores rather than seeds is characteristic of pteridophytes.",
    [
      "IDENTIFY-PTERIDOPHYTE"
    ]
  ]
] as const;
