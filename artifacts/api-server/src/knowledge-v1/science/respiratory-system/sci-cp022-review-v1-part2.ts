import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp022ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp022ReviewSpec[] = [
  [
    3,
    "Medium",
    "Which feature of alveoli makes gas exchange efficient?",
    "Very thin walls",
    [
      "Thick muscular walls",
      "Dry inner surface",
      "Absence of blood capillaries"
    ],
    "Alveolar walls are extremely thin, so respiratory gases have only a short distance to diffuse. A short diffusion distance lets gases move rapidly between air and blood.",
    [
      "ALVEOLI-THIN-WALLS"
    ]
  ],
  [
    3,
    "Medium",
    "The large number of alveoli in the lungs is important because it provides:",
    "A very large surface area for gas exchange",
    [
      "A large storage space for food",
      "A thick barrier to diffusion",
      "A site for bile production"
    ],
    "Millions of alveoli greatly increase the total respiratory surface area, improving the rate of diffusion. A larger surface allows many gas molecules to diffuse simultaneously.",
    [
      "ALVEOLI-SURFACE-AREA"
    ]
  ],
  [
    3,
    "Hard",
    "Why does destruction of alveolar walls reduce oxygen uptake?",
    "Decreases the surface area available for gas exchange",
    [
      "Increases the amount of haemoglobin in blood",
      "Makes the trachea shorter",
      "Increases salivary secretion"
    ],
    "Loss of alveolar walls reduces total gas-exchange area and can make oxygen transfer into blood less efficient. This loss of surface area is an important problem in diseases such as emphysema.",
    [
      "ALVEOLI-DESTRUCTION"
    ]
  ],
  [
    4,
    "Easy",
    "During normal inhalation, the diaphragm:",
    "Contracts and flattens",
    [
      "Relaxes and becomes more dome-shaped",
      "Stops moving completely",
      "Moves upward while contracting"
    ],
    "When the diaphragm contracts, it flattens and increases the volume of the chest cavity. The resulting lower pressure draws air from the atmosphere into the lungs.",
    [
      "INHALATION-DIAPHRAGM"
    ]
  ],
  [
    4,
    "Easy",
    "During normal exhalation, the diaphragm usually:",
    "Relaxes and becomes dome-shaped",
    [
      "Contracts and flattens",
      "Moves downward forcefully",
      "Remains fixed"
    ],
    "During quiet exhalation the diaphragm relaxes and returns toward its dome shape, reducing chest volume. Elastic recoil of the lungs also helps push air outward during quiet breathing.",
    [
      "EXHALATION-DIAPHRAGM"
    ]
  ],
  [
    4,
    "Medium",
    "During inhalation, the ribs generally move:",
    "Upward and outward",
    [
      "Downward and inward",
      "Only downward",
      "Without any movement"
    ],
    "External intercostal muscles raise the ribs upward and outward, increasing thoracic volume during inhalation. This movement expands the chest from the sides as the diaphragm expands it downward.",
    [
      "INHALATION-RIBS"
    ]
  ],
  [
    4,
    "Medium",
    "Air enters the lungs during inhalation because pressure inside the lungs becomes:",
    "Lower than atmospheric pressure",
    [
      "Higher than atmospheric pressure",
      "Exactly zero",
      "Unrelated to chest volume"
    ],
    "Expansion of the chest increases lung volume and lowers pressure inside the lungs, so air flows inward. Air continues moving inward until the pressure difference is reduced.",
    [
      "INHALATION-PRESSURE"
    ]
  ],
  [
    4,
    "Medium",
    "During quiet exhalation, why does air leave the lungs?",
    "Thoracic volume decreases and lung pressure rises",
    [
      "Thoracic volume increases further",
      "The lungs actively pump air using alveolar muscles",
      "The trachea closes completely"
    ],
    "Relaxation of breathing muscles reduces thoracic volume. Elastic recoil raises pressure inside the lungs and pushes air outward. Air flows outward because gases move from higher pressure toward lower pressure.",
    [
      "EXHALATION-PRESSURE"
    ]
  ],
  [
    4,
    "Hard",
    "If the diaphragm cannot contract properly, which process will be most directly impaired?",
    "Expansion of the chest during inhalation",
    [
      "Chemical digestion in the stomach",
      "Filtration in the kidneys",
      "Bile storage in the gallbladder"
    ],
    "Diaphragm contraction is a major cause of increased thoracic volume during inhalation. Weak contraction therefore reduces air intake. Less chest expansion reduces the volume of fresh air reaching the lungs.",
    [
      "DIAPHRAGM-IMPAIRMENT"
    ]
  ],
  [
    5,
    "Easy",
    "Oxygen moves from the alveoli into the blood by:",
    "Diffusion",
    [
      "Active transport",
      "Filtration",
      "Peristalsis"
    ],
    "Oxygen diffuses across the thin alveolar-capillary membrane from a region of higher oxygen concentration to lower oxygen concentration. Haemoglobin binding helps keep blood oxygen low enough to maintain this gradient.",
    [
      "OXYGEN-DIFFUSION"
    ]
  ],
  [
    5,
    "Easy",
    "Carbon dioxide moves from the blood into the alveoli by:",
    "Diffusion",
    [
      "Osmosis",
      "Peristalsis",
      "Active pumping by alveoli"
    ],
    "Carbon dioxide diffuses down its concentration/partial-pressure gradient from blood into alveolar air. The gas is then removed from the body when the person exhales.",
    [
      "CO2-DIFFUSION"
    ]
  ],
  [
    5,
    "Medium",
    "Oxygen diffuses from alveoli into blood because alveolar air has:",
    "A higher oxygen concentration than deoxygenated blood",
    [
      "No oxygen at all",
      "A lower oxygen concentration than deoxygenated blood",
      "The same oxygen concentration as venous blood"
    ],
    "Freshly ventilated alveoli contain more oxygen than incoming deoxygenated blood, creating a diffusion gradient. Continuous blood flow and ventilation help preserve this difference in oxygen level.",
    [
      "ALVEOLI-OXYGEN-GRADIENT"
    ]
  ],
  [
    5,
    "Medium",
    "Carbon dioxide diffuses into the alveoli because incoming blood has:",
    "A higher carbon dioxide concentration than alveolar air",
    [
      "No carbon dioxide",
      "A lower carbon dioxide concentration than alveolar air",
      "Only oxygen"
    ],
    "Blood arriving at the lungs carries carbon dioxide from tissues. Its higher carbon dioxide level drives diffusion into alveoli. Ventilation removes carbon dioxide from alveoli and maintains the outward diffusion gradient.",
    [
      "ALVEOLI-CO2-GRADIENT"
    ]
  ],
  [
    5,
    "Medium",
    "Which combination best supports rapid gas exchange in alveoli?",
    "Thin walls, large surface area and rich blood supply",
    [
      "Thick walls, small surface area and little blood flow",
      "Dry walls and no capillaries",
      "Cartilage rings and digestive enzymes"
    ],
    "Efficient respiratory surfaces are thin, extensive, moist and well supplied with blood, allowing rapid diffusion. Moist surfaces also allow oxygen and carbon dioxide to dissolve before crossing membranes.",
    [
      "ALVEOLI-EFFICIENT-FEATURES"
    ]
  ],
  [
    5,
    "Hard",
    "Why does thickening of the alveolar membrane slow gas exchange?",
    "The diffusion distance becomes greater",
    [
      "The number of red blood cells immediately doubles",
      "Atmospheric oxygen disappears",
      "The diaphragm stops receiving nerves"
    ],
    "Diffusion is faster across a short distance. Thickening the alveolar-capillary barrier increases the distance gases must cross. A longer diffusion path reduces how quickly oxygen can enter and carbon dioxide can leave.",
    [
      "ALVEOLI-THICKENING"
    ]
  ]
] as const;
