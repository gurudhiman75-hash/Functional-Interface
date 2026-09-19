import type { KnowledgeV1Difficulty } from "../../types";

export type SciCp019ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];

export const PART_3: readonly SciCp019ReviewSpec[] = [
  [
    6,
    "Easy",
    "Which organelle is known as the powerhouse of the cell?",
    "Mitochondrion",
    [
      "Ribosome",
      "Golgi apparatus",
      "Lysosome"
    ],
    "Mitochondria carry out major stages of aerobic respiration and produce ATP, the cell's usable energy currency. This is why they are often called the powerhouse of the cell.",
    [
      "MITO-POWERHOUSE"
    ]
  ],
  [
    6,
    "Easy",
    "Photosynthesis in plant cells takes place in the:",
    "chloroplast",
    [
      "mitochondrion",
      "lysosome",
      "nucleolus"
    ],
    "Chloroplasts contain chlorophyll and the internal membranes needed for photosynthesis. They capture light energy to help make carbohydrates.",
    [
      "CHLOROPLAST-PHOTOSYN"
    ]
  ],
  [
    6,
    "Medium",
    "Which pigment absorbs light energy for photosynthesis?",
    "Chlorophyll",
    [
      "Haemoglobin",
      "Melanin",
      "Keratin"
    ],
    "Chlorophyll is the principal green pigment in chloroplasts. It absorbs light energy that drives photosynthesis.",
    [
      "CHLOROPHYLL"
    ]
  ],
  [
    6,
    "Medium",
    "Which feature is common to both mitochondria and chloroplasts?",
    "their own DNA and ribosomes",
    [
      "a cellulose cell wall",
      "a nuclear envelope",
      "digestive lysosomal enzymes"
    ],
    "Mitochondria and chloroplasts contain their own DNA and ribosomes in addition to being enclosed by membranes. This gives them limited ability to make some of their own proteins.",
    [
      "SEMI-AUTONOMOUS"
    ]
  ],
  [
    6,
    "Medium",
    "Which type of cell generally contains many mitochondria because of its high energy requirement?",
    "Muscle cells",
    [
      "Mature red blood cells of mammals",
      "Dead cork cells",
      "Cells of dry outer bark only"
    ],
    "Cells with high energy needs generally contain many mitochondria. Muscle cells require substantial ATP for contraction and therefore are rich in mitochondria.",
    [
      "MITO-MUSCLE"
    ]
  ],
  [
    6,
    "Hard",
    "A plant leaf cell is kept in darkness but has oxygen and stored food. Which organelle can still produce ATP?",
    "Mitochondrion",
    [
      "Chloroplast only",
      "Cell wall",
      "Large central vacuole"
    ],
    "Photosynthesis in chloroplasts needs light, but cellular respiration in mitochondria can continue in darkness if suitable fuel and oxygen are available. Mitochondria can therefore keep producing ATP.",
    [
      "MITO-DARK"
    ]
  ],
  [
    7,
    "Easy",
    "Which organelle contains digestive enzymes for breaking down worn-out cell components?",
    "Lysosome",
    [
      "Ribosome",
      "Centrosome",
      "Nucleolus"
    ],
    "Lysosomes contain hydrolytic enzymes that digest worn-out organelles and various cellular materials. They help recycle components within the cell.",
    [
      "LYSOSOME-DIGEST"
    ]
  ],
  [
    7,
    "Easy",
    "The large central vacuole of a plant cell helps maintain:",
    "turgidity and storage",
    [
      "chromosome number",
      "protein synthesis on ribosomes",
      "DNA replication"
    ],
    "The large central vacuole stores water and dissolved substances. Water pressure in the vacuole helps maintain turgidity and supports the plant cell.",
    [
      "VACUOLE-TURGOR"
    ]
  ],
  [
    7,
    "Medium",
    "Which structure in animal cells helps organize spindle fibres during cell division?",
    "Centrosome",
    [
      "Cell wall",
      "Chloroplast",
      "Large central vacuole"
    ],
    "The centrosome, containing centrioles in many animal cells, organizes microtubules and helps form the spindle during cell division. Typical higher plant cells lack a prominent centriole-based centrosome.",
    [
      "CENTROSOME-SPINDLE"
    ]
  ],
  [
    7,
    "Medium",
    "Why does a plant cell usually not burst when excess water enters by osmosis?",
    "Its rigid cell wall resists excessive expansion",
    [
      "Its nucleus prevents water entry",
      "Its ribosomes remove all excess water",
      "Its lysosomes thicken the plasma membrane"
    ],
    "As water enters, the cell contents press against the cell wall. The rigid wall resists further expansion and helps the cell become turgid rather than burst.",
    [
      "CELL-WALL-TURGOR"
    ]
  ],
  [
    7,
    "Medium",
    "Which pair of structures is characteristic of a typical mature plant cell but not of a typical animal cell?",
    "Cell wall and large central vacuole",
    [
      "Plasma membrane and ribosomes",
      "Mitochondria and cytoplasm",
      "Nucleus and Golgi apparatus"
    ],
    "Plant and animal cells share many organelles, including a nucleus, mitochondria and ribosomes. A cellulose cell wall and a large central vacuole are characteristic features of typical plant cells.",
    [
      "PLANT-PAIR"
    ]
  ],
  [
    7,
    "Hard",
    "A cell has a cell wall, a large vacuole and mitochondria but no chloroplasts. Which conclusion is most appropriate?",
    "It may be a non-photosynthetic plant cell such as a root cell",
    [
      "It must be an animal cell",
      "It must be a bacterium because it has mitochondria",
      "It cannot be a living cell"
    ],
    "Not all plant cells contain chloroplasts; root cells, for example, are generally not exposed to light and may lack chloroplasts. A cell wall, large vacuole and mitochondria are still compatible with a plant cell.",
    [
      "ROOT-CELL"
    ]
  ],
  [
    8,
    "Easy",
    "Which type of cell division produces two genetically similar daughter cells?",
    "Mitosis",
    [
      "Meiosis",
      "Fertilization",
      "Osmosis"
    ],
    "Mitosis produces two daughter cells with essentially the same chromosome number and genetic information as the parent cell. It is important in growth and tissue repair.",
    [
      "MITOSIS-BASIC"
    ]
  ],
  [
    8,
    "Easy",
    "Meiosis is primarily responsible for the formation of:",
    "gametes with half the usual chromosome number",
    [
      "two identical body cells",
      "cells with double the usual chromosome number only",
      "new cell walls without nuclear division"
    ],
    "Meiosis reduces the chromosome number by half and produces gametes. Fertilization then restores the normal chromosome number in the offspring.",
    [
      "MEIOSIS-BASIC"
    ]
  ],
  [
    8,
    "Medium",
    "Replacement of worn-out skin cells occurs through:",
    "Mitosis",
    [
      "Meiosis",
      "Fertilization",
      "Plasmolysis"
    ],
    "Skin cells are replaced by division of body cells through mitosis. Mitosis provides genetically similar daughter cells for growth and repair.",
    [
      "MITOSIS-REPAIR"
    ]
  ]
] as const;
