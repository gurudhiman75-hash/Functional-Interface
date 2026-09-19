import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp035ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp035ReviewSpec[] = [
  [
    6,
    "Easy",
    "An organism whose genetic material has been deliberately altered using biotechnology is called a:",
    "Genetically modified organism",
    [
      "Decomposer",
      "Fossil",
      "Abiotic factor"
    ],
    "A GMO carries genetic changes introduced through modern biotechnology.",
    [
      "GMO-DEFINITION"
    ]
  ],
  [
    6,
    "Easy",
    "Bt cotton was developed mainly for resistance against certain:",
    "Insect pests",
    [
      "Droughts only",
      "Fungal cell walls",
      "Viruses in humans"
    ],
    "Bt cotton produces a protein derived from Bacillus thuringiensis that targets certain insect pests.",
    [
      "BT-COTTON-INSECT"
    ]
  ],
  [
    6,
    "Medium",
    "The 'Bt' in Bt cotton refers to:",
    "Bacillus thuringiensis",
    [
      "Bacillus tuberculosis",
      "Biological tissue",
      "Beta toxin only"
    ],
    "Bt stands for the bacterium Bacillus thuringiensis, the source of the insecticidal protein gene.",
    [
      "BT-FULL-SOURCE"
    ]
  ],
  [
    6,
    "Medium",
    "A major aim of developing pest-resistant GM crops is to:",
    "Reduce crop damage from specific pests",
    [
      "Eliminate all insects from ecosystems",
      "Stop photosynthesis",
      "Remove every plant gene"
    ],
    "Pest-resistant crops are designed to protect plants from particular damaging insects.",
    [
      "GM-PEST-RESISTANCE-AIM"
    ]
  ],
  [
    6,
    "Medium",
    "Golden Rice was developed to increase the content of:",
    "Beta-carotene",
    [
      "Iron metal",
      "Chlorophyll only",
      "Vitamin C only"
    ],
    "Golden Rice is engineered to produce beta-carotene, a precursor of vitamin A, in the grain.",
    [
      "GOLDEN-RICE-BETA-CAROTENE"
    ]
  ],
  [
    6,
    "Hard",
    "A crop receives a gene that lets it produce a protein toxic to a specific insect pest. What is the most direct expected benefit?",
    "Lower damage from that target insect",
    [
      "Resistance to every disease",
      "No need for water",
      "Permanent elimination of all weeds"
    ],
    "The introduced trait is specific to certain pests and is intended to reduce their damage.",
    [
      "GM-CROP-TARGETED-TRAIT"
    ]
  ],
  [
    7,
    "Easy",
    "Recombinant human insulin can be produced using genetically engineered:",
    "Microorganisms",
    [
      "Rocks",
      "Minerals",
      "Red blood cells only"
    ],
    "Engineered bacteria or yeast can manufacture human insulin using an inserted insulin gene.",
    [
      "RECOMBINANT-INSULIN-MICROBES"
    ]
  ],
  [
    7,
    "Easy",
    "Biotechnology can be used to produce:",
    "Vaccines and therapeutic proteins",
    [
      "Only fertilizers",
      "Only metals",
      "Only plastics"
    ],
    "Modern biotechnology produces medicines such as vaccines, hormones and other proteins.",
    [
      "BIOTECH-MEDICAL-PRODUCTS"
    ]
  ],
  [
    7,
    "Medium",
    "Why was recombinant insulin an important biotechnology advance?",
    "It allowed large-scale production of human insulin using engineered cells",
    [
      "It removed the need for genes",
      "It turned insulin into an antibiotic",
      "It made insulin from minerals"
    ],
    "Recombinant technology enabled reliable production of human insulin without depending on animal extraction.",
    [
      "RECOMBINANT-INSULIN-ADVANCE"
    ]
  ],
  [
    7,
    "Medium",
    "A recombinant vaccine may use:",
    "A harmless antigenic protein produced through genetic engineering",
    [
      "Only antibiotics",
      "Only red blood cells",
      "No biological material"
    ],
    "Some vaccines use specific antigens produced by recombinant DNA methods.",
    [
      "RECOMBINANT-VACCINE"
    ]
  ],
  [
    7,
    "Medium",
    "Biotechnology helps in diagnosis when molecular tests detect:",
    "Specific DNA, RNA or proteins linked to a condition",
    [
      "Only body height",
      "Only temperature without biomarkers",
      "Only blood pressure"
    ],
    "Molecular diagnostic methods identify characteristic nucleic acids or proteins.",
    [
      "MOLECULAR-DIAGNOSIS"
    ]
  ],
  [
    7,
    "Hard",
    "A medicine is a human protein made by bacteria carrying the corresponding human gene. Which two ideas are combined in this process?",
    "Recombinant DNA and microbial production",
    [
      "Taxonomy and succession",
      "Photosynthesis and transpiration",
      "Predation and competition"
    ],
    "The gene is inserted by recombinant-DNA methods and the engineered microbe produces the protein.",
    [
      "MEDICINE-RECOMBINANT-MICROBE"
    ]
  ],
  [
    8,
    "Easy",
    "Growing plant cells or tissues on a sterile nutrient medium is called:",
    "Tissue culture",
    [
      "Pollination",
      "Transpiration",
      "Composting"
    ],
    "Plant tissue culture grows cells, tissues or organs under controlled sterile conditions.",
    [
      "TISSUE-CULTURE-DEFINITION"
    ]
  ],
  [
    8,
    "Easy",
    "A genetically identical copy produced from one parent is called a:",
    "Clone",
    [
      "Hybrid only",
      "Vector",
      "Antigen"
    ],
    "A clone is genetically identical or nearly identical to the source organism or cell.",
    [
      "CLONE-DEFINITION"
    ]
  ],
  [
    8,
    "Medium",
    "Plant tissue culture is useful for:",
    "Rapid multiplication of many similar plants",
    [
      "Producing only seeds",
      "Eliminating all plant hormones",
      "Changing every chromosome"
    ],
    "Small amounts of plant tissue can generate many plantlets under suitable conditions.",
    [
      "TISSUE-CULTURE-MASS-PROPAGATION"
    ]
  ]
] as const;
