import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp023ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp023ReviewSpec[] = [
  [
    1,
    "Easy",
    "Which liquid component makes up the largest part of blood?",
    "Plasma",
    [
      "Platelets",
      "Red blood cells",
      "White blood cells"
    ],
    "Plasma is the fluid part of blood. It carries cells, nutrients, hormones, wastes and dissolved substances around the body.",
    [
      "BLOOD-PLASMA"
    ]
  ],
  [
    1,
    "Easy",
    "Which of the following is a formed element of blood?",
    "Red blood cell",
    [
      "Plasma",
      "Water",
      "Dissolved glucose"
    ],
    "Red blood cells are formed elements suspended in plasma. White blood cells and platelets are also formed elements.",
    [
      "BLOOD-FORMED-ELEMENTS"
    ]
  ],
  [
    1,
    "Medium",
    "Plasma helps transport which substances through the body?",
    "Nutrients, hormones and wastes",
    [
      "Only oxygen",
      "Only platelets",
      "Only carbon dioxide"
    ],
    "Plasma carries many dissolved substances, including nutrients, hormones, salts and metabolic wastes.",
    [
      "PLASMA-TRANSPORT"
    ]
  ],
  [
    1,
    "Medium",
    "Which statement best distinguishes plasma from serum?",
    "Serum is plasma without most clotting factors",
    [
      "Serum contains more red blood cells than plasma",
      "Plasma contains no water",
      "Serum is the solid part of blood"
    ],
    "Serum is the liquid left after blood clots, so it lacks fibrinogen and several clotting factors found in plasma.",
    [
      "PLASMA-SERUM"
    ]
  ],
  [
    1,
    "Medium",
    "Blood helps maintain body temperature because it:",
    "Distributes heat around the body",
    [
      "Produces digestive enzymes",
      "Stores bile",
      "Filters urine"
    ],
    "Blood carries heat from active tissues and redistributes it, helping the body maintain a more stable temperature.",
    [
      "BLOOD-TEMPERATURE"
    ]
  ],
  [
    1,
    "Hard",
    "A blood sample is centrifuged and the cell-free liquid is collected before clotting occurs. This liquid is:",
    "Plasma",
    [
      "Serum",
      "Lymph",
      "Tissue fluid"
    ],
    "If clotting has not occurred, the cell-free liquid still contains clotting factors and is therefore plasma.",
    [
      "BLOOD-CENTRIFUGE-PLASMA"
    ]
  ],
  [
    2,
    "Easy",
    "Which blood cells contain haemoglobin?",
    "Red blood cells",
    [
      "White blood cells",
      "Platelets",
      "Plasma cells"
    ],
    "Red blood cells contain haemoglobin, the pigment that binds oxygen and gives blood its red colour.",
    [
      "RBC-HAEMOGLOBIN"
    ]
  ],
  [
    2,
    "Easy",
    "The red colour of blood is largely due to:",
    "Haemoglobin",
    [
      "Fibrin",
      "Plasma proteins",
      "Antibodies"
    ],
    "Haemoglobin is an iron-containing red pigment present in red blood cells.",
    [
      "HAEMOGLOBIN-RED"
    ]
  ],
  [
    2,
    "Medium",
    "Red blood cells are well suited for oxygen transport because they:",
    "Contain haemoglobin and have a biconcave shape",
    [
      "Contain a large nucleus",
      "Produce digestive enzymes",
      "Form blood clots"
    ],
    "Haemoglobin binds oxygen, while the biconcave shape provides a large surface area for gas exchange.",
    [
      "RBC-ADAPTATION"
    ]
  ],
  [
    2,
    "Medium",
    "Why do mature human red blood cells lack a nucleus?",
    "It leaves more space for haemoglobin",
    [
      "It allows them to produce antibodies",
      "It helps them divide rapidly in blood",
      "It lets them form fibrin"
    ],
    "Loss of the nucleus creates more internal space for haemoglobin, increasing oxygen-carrying capacity.",
    [
      "RBC-NO-NUCLEUS"
    ]
  ],
  [
    2,
    "Medium",
    "Most oxygen carried in blood is transported:",
    "Bound to haemoglobin",
    [
      "Dissolved in plasma only",
      "Inside platelets",
      "Attached to antibodies"
    ],
    "Most oxygen combines reversibly with haemoglobin inside red blood cells to form oxyhaemoglobin.",
    [
      "OXYGEN-HAEMOGLOBIN"
    ]
  ],
  [
    2,
    "Hard",
    "If the number of red blood cells falls sharply while the lungs remain normal, which ability is reduced first?",
    "Transport of oxygen to tissues",
    [
      "Formation of bile",
      "Digestion of starch",
      "Filtration of urine"
    ],
    "Fewer red blood cells mean less haemoglobin is available to carry oxygen from the lungs to body tissues.",
    [
      "LOW-RBC-OXYGEN"
    ]
  ],
  [
    3,
    "Easy",
    "Which blood cells help defend the body against infection?",
    "White blood cells",
    [
      "Red blood cells",
      "Platelets",
      "Plasma proteins only"
    ],
    "White blood cells are part of the body's defence system and help destroy pathogens or coordinate immune responses.",
    [
      "WBC-DEFENCE"
    ]
  ],
  [
    3,
    "Easy",
    "Which blood component is most directly involved in clot formation?",
    "Platelets",
    [
      "Red blood cells",
      "Plasma water",
      "Haemoglobin"
    ],
    "Platelets help start the clotting process at damaged blood vessels.",
    [
      "PLATELETS-CLOTTING"
    ]
  ],
  [
    3,
    "Medium",
    "Fibrin helps stop bleeding by:",
    "Forming a mesh that traps blood cells",
    [
      "Carrying oxygen",
      "Destroying bacteria",
      "Producing antibodies"
    ],
    "During clotting, fibrin forms thread-like fibres that create a mesh and help seal the damaged area.",
    [
      "FIBRIN-MESH"
    ]
  ]
] as const;
