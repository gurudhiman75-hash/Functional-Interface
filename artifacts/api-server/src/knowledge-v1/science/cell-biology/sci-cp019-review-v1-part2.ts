import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp019ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_2: readonly SciCp019ReviewSpec[] = [
  [
    3,
    "Medium",
    "The shrinking of a plant cell's contents away from the cell wall in a concentrated salt solution is called:",
    "plasmolysis",
    [
      "deplasmolysis",
      "cytokinesis",
      "phagocytosis"
    ],
    "In a hypertonic solution, water leaves a plant cell by osmosis. The shrinking of the cell contents away from the cell wall is called plasmolysis.",
    [
      "PLASMOLYSIS"
    ]
  ],
  [
    3,
    "Medium",
    "Unlike osmosis, diffusion may involve the movement of:",
    "many kinds of particles, not only water",
    [
      "only water through a selectively permeable membrane",
      "only water from low to high water concentration",
      "only ions using cellular energy"
    ],
    "Diffusion is the movement of particles from a region of higher concentration to lower concentration. Osmosis specifically refers to movement of water through a selectively permeable membrane.",
    [
      "DIFFUSION-OSMOSIS"
    ]
  ],
  [
    3,
    "Hard",
    "A plant cell is transferred from distilled water to a concentrated sugar solution. What is the most likely sequence of changes?",
    "It becomes turgid, then loses water and becomes plasmolysed",
    [
      "It plasmolyses first, then becomes turgid",
      "It bursts in both solutions because it has no cell wall",
      "It remains unchanged in both solutions"
    ],
    "In distilled water, water enters the cell and the cell becomes turgid because the cell wall resists bursting. In concentrated sugar solution, water leaves the cell and plasmolysis can occur.",
    [
      "OSMOSIS-SEQUENCE"
    ]
  ],
  [
    4,
    "Easy",
    "Which organelle contains most of the genetic material in a eukaryotic cell?",
    "Nucleus",
    [
      "Golgi apparatus",
      "Lysosome",
      "Vacuole"
    ],
    "The nucleus contains chromosomes made of DNA and proteins. It stores most of the cell's hereditary information.",
    [
      "NUCLEUS-GENETIC"
    ]
  ],
  [
    4,
    "Easy",
    "Chromosomes are mainly composed of:",
    "DNA and proteins",
    [
      "cellulose and lipids",
      "starch and proteins",
      "RNA and cellulose"
    ],
    "Chromosomes are structures made mainly of DNA associated with proteins. Genes are located on DNA within chromosomes.",
    [
      "CHROMOSOME-COMPOSITION"
    ]
  ],
  [
    4,
    "Medium",
    "The nucleolus is mainly involved in the formation of:",
    "ribosomal components",
    [
      "cell wall fibres",
      "lysosomal enzymes only",
      "spindle fibres"
    ],
    "The nucleolus is a dense region inside the nucleus where ribosomal RNA is produced and ribosomal subunits begin to assemble. These components later participate in protein synthesis.",
    [
      "NUCLEOLUS-RIBOSOME"
    ]
  ],
  [
    4,
    "Medium",
    "Which of the following correctly relates genes, DNA and chromosomes?",
    "Genes are segments of DNA located on chromosomes",
    [
      "Chromosomes are segments of proteins located on genes",
      "DNA is made of many nuclei arranged in genes",
      "Genes are organelles present outside chromosomes"
    ],
    "Genes are functional segments of DNA. DNA is organized into chromosomes inside the nucleus of eukaryotic cells.",
    [
      "GENE-DNA-CHROMOSOME"
    ]
  ],
  [
    4,
    "Medium",
    "Removal of the nucleus from a cell would most directly affect:",
    "Control of gene expression and cell activities",
    [
      "Immediate diffusion of oxygen through the membrane",
      "Cell-wall rigidity due to cellulose",
      "Movement of water by osmosis alone"
    ],
    "The nucleus contains DNA and directs gene expression, which controls many cellular activities. Without it, long-term coordination and production of many proteins would be severely affected.",
    [
      "NUCLEUS-CONTROL"
    ]
  ],
  [
    4,
    "Hard",
    "Body cells of the same organism may differ in shape and function despite having the same chromosomes mainly because:",
    "different genes are active in the two cell types",
    [
      "one cell has no DNA at all",
      "each tissue receives a completely different genome",
      "chromosomes turn into cell organelles"
    ],
    "Most body cells contain essentially the same genetic information, but different genes are switched on or off in different cell types. This produces different proteins and cellular functions.",
    [
      "GENE-EXPRESSION-DIFFERENTIATION"
    ]
  ],
  [
    5,
    "Easy",
    "Which cell structure is the main site of protein synthesis?",
    "Ribosome",
    [
      "Lysosome",
      "Vacuole",
      "Centrosome"
    ],
    "Ribosomes assemble amino acids into proteins according to genetic instructions. They may be free in the cytoplasm or attached to rough endoplasmic reticulum.",
    [
      "RIBOSOME-PROTEIN"
    ]
  ],
  [
    5,
    "Easy",
    "Which organelle modifies, sorts and packages proteins for transport?",
    "Golgi apparatus",
    [
      "Nucleolus",
      "Cell wall",
      "Chromosome"
    ],
    "The Golgi apparatus receives many proteins and lipids, modifies them and sorts them into vesicles. These vesicles can carry materials to different parts of the cell or outside it.",
    [
      "GOLGI-PACKAGING"
    ]
  ],
  [
    5,
    "Medium",
    "Why does rough endoplasmic reticulum appear rough?",
    "ribosomes attached to its surface",
    [
      "cellulose fibres on its surface",
      "DNA attached to its membrane",
      "lysosomes embedded in it"
    ],
    "Rough endoplasmic reticulum has ribosomes attached to its outer surface. These ribosomes make many proteins that enter the endoplasmic-reticulum system for further processing.",
    [
      "RER-RIBOSOMES"
    ]
  ],
  [
    5,
    "Medium",
    "Smooth endoplasmic reticulum is mainly associated with the synthesis of:",
    "lipids",
    [
      "cellulose walls",
      "chromosomal DNA only",
      "ribosomes"
    ],
    "Smooth endoplasmic reticulum lacks attached ribosomes and is involved in lipid synthesis. In some cells it also helps in detoxification.",
    [
      "SER-LIPIDS"
    ]
  ],
  [
    5,
    "Medium",
    "Which sequence correctly shows the pathway of a protein meant for secretion?",
    "Ribosome → rough ER → Golgi apparatus → secretory vesicle",
    [
      "Golgi apparatus → nucleus → lysosome → cell wall",
      "Smooth ER → chromosome → ribosome → vacuole",
      "Lysosome → nucleolus → rough ER → mitochondrion"
    ],
    "Secreted proteins are synthesized on ribosomes attached to rough ER, processed through the ER and Golgi apparatus, and then carried in vesicles to the cell membrane. This coordinated pathway prepares proteins for secretion.",
    [
      "SECRETORY-PATHWAY"
    ]
  ],
  [
    5,
    "Hard",
    "If the Golgi apparatus is damaged while ribosomes and rough ER remain functional, which process will be most directly affected?",
    "Final modification and sorting of many newly made proteins",
    [
      "Initial joining of amino acids into polypeptides",
      "Replication of nuclear DNA",
      "Diffusion of oxygen through the plasma membrane"
    ],
    "Ribosomes can still synthesize proteins and rough ER can begin processing them, but the Golgi is needed for further modification, sorting and packaging. Protein delivery would therefore be strongly disturbed.",
    [
      "GOLGI-DAMAGE"
    ]
  ]
] as const;
