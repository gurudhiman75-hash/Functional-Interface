import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp024ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_3: readonly SciCp024ReviewSpec[] = [
  [
    6,
    "Easy",
    "Normal urine contains a large proportion of:",
    "Water",
    [
      "Red blood cells",
      "Large proteins",
      "Platelets"
    ],
    "Urine is mostly water, with dissolved urea, salts and other waste substances. The exact water fraction changes with hydration and hormone levels.",
    [
      "URINE-WATER"
    ]
  ],
  [
    6,
    "Easy",
    "Which substance is normally absent or present only in negligible amounts in urine of a healthy person?",
    "Glucose",
    [
      "Urea",
      "Water",
      "Mineral salts"
    ],
    "Healthy kidneys reabsorb virtually all filtered glucose, so it is normally absent or nearly absent from urine. Persistent glucose in urine can indicate that normal regulation has been exceeded or impaired.",
    [
      "URINE-NO-GLUCOSE"
    ]
  ],
  [
    6,
    "Medium",
    "Urine is formed through filtration followed by:",
    "Selective reabsorption and secretion",
    [
      "Digestion and absorption",
      "Ventilation and diffusion",
      "Clotting and coagulation"
    ],
    "The nephron first filters blood, then modifies the filtrate through reabsorption and secretion to form urine. These later steps make final urine very different from the original glomerular filtrate.",
    [
      "URINE-FORMATION-STEPS"
    ]
  ],
  [
    6,
    "Medium",
    "Why is urine usually more concentrated than the initial glomerular filtrate?",
    "Much of the water is reabsorbed",
    [
      "Red blood cells are added",
      "All urea is reabsorbed",
      "Large proteins enter the tubule"
    ],
    "As filtrate moves through the nephron, much water is returned to the blood, leaving wastes in a smaller fluid volume.",
    [
      "URINE-CONCENTRATION"
    ]
  ],
  [
    6,
    "Medium",
    "Which change would make urine more dilute?",
    "Excretion of more water",
    [
      "Reabsorption of more water",
      "Loss of all filtration",
      "Addition of red blood cells"
    ],
    "When less water is reabsorbed, a larger volume of water remains in the urine and the urine becomes more dilute.",
    [
      "DILUTE-URINE"
    ]
  ],
  [
    6,
    "Hard",
    "A urine sample contains many red blood cells. Which conclusion is most appropriate?",
    "This is not a normal feature of healthy urine",
    [
      "Red blood cells are a normal major component of urine",
      "The kidneys have increased glucose reabsorption",
      "The bladder is producing blood cells"
    ],
    "Healthy filtration barriers retain blood cells. Their presence in urine suggests bleeding or damage somewhere in the urinary system. The source may be the kidney or another part of the urinary tract.",
    [
      "URINE-RBC-ABNORMAL"
    ]
  ],
  [
    7,
    "Easy",
    "Which hormone helps the kidneys conserve water?",
    "ADH",
    [
      "Insulin",
      "Thyroxine",
      "Adrenaline"
    ],
    "Antidiuretic hormone, or ADH, increases water reabsorption by the kidneys. It acts especially on the collecting ducts to increase their permeability to water.",
    [
      "ADH-WATER"
    ]
  ],
  [
    7,
    "Easy",
    "When the body is dehydrated, urine is often:",
    "More concentrated",
    [
      "More dilute",
      "Free of urea",
      "Rich in red blood cells"
    ],
    "During dehydration, the kidneys conserve water, reducing urine volume and increasing urine concentration. This response reduces further water loss from the body.",
    [
      "DEHYDRATION-URINE"
    ]
  ],
  [
    7,
    "Medium",
    "A rise in ADH generally causes the kidneys to:",
    "Reabsorb more water",
    [
      "Excrete more glucose",
      "Stop filtering blood",
      "Release bile"
    ],
    "ADH increases the permeability of parts of the kidney tubules to water, so more water returns to the blood. As a result, urine volume usually decreases and urine becomes more concentrated.",
    [
      "ADH-REABSORPTION"
    ]
  ],
  [
    7,
    "Medium",
    "After drinking a large amount of water, ADH secretion usually falls. What happens to urine?",
    "Its volume increases and it becomes more dilute",
    [
      "Its volume falls and it becomes more concentrated",
      "It contains more red blood cells",
      "It stops forming"
    ],
    "Lower ADH causes less water reabsorption, so more water is excreted in a larger volume of dilute urine. This prevents the body from retaining more water than it needs.",
    [
      "LOW-ADH-DILUTE-URINE"
    ]
  ],
  [
    7,
    "Medium",
    "Why is regulation of water reabsorption important?",
    "It helps keep body fluid concentration within a suitable range",
    [
      "It controls tooth growth",
      "It produces digestive enzymes",
      "It creates haemoglobin"
    ],
    "Adjusting water reabsorption helps maintain osmotic balance and stable conditions for cells. Cells function best when the concentration of body fluids stays within a narrow range.",
    [
      "WATER-BALANCE-HOMEOSTASIS"
    ]
  ],
  [
    7,
    "Hard",
    "A dehydrated person produces a small volume of concentrated urine. Which change best explains this?",
    "More water is reabsorbed from the nephron",
    [
      "Less water is reabsorbed",
      "Glucose filtration stops completely",
      "Red blood cells enter the tubule"
    ],
    "During dehydration, water-conserving mechanisms increase reabsorption so less water is lost in urine. ADH secretion commonly rises during dehydration and supports this response.",
    [
      "DEHYDRATION-REABSORPTION"
    ]
  ],
  [
    8,
    "Easy",
    "Dialysis is used when the kidneys cannot adequately:",
    "Remove wastes and excess water from blood",
    [
      "Pump blood through arteries",
      "Exchange gases in lungs",
      "Digest proteins"
    ],
    "Dialysis performs some filtering functions of failed kidneys by removing wastes and excess fluid from blood. It does not fully replace all hormonal and regulatory functions of healthy kidneys.",
    [
      "DIALYSIS-FUNCTION"
    ]
  ],
  [
    8,
    "Hard",
    "A dialysis membrane allows urea, excess salts and water to cross but retains blood cells and large proteins. Which property makes this possible?",
    "Selective permeability",
    [
      "Complete impermeability",
      "Active pumping by red blood cells",
      "Unrestricted passage of all particles"
    ],
    "A dialysis membrane is selectively permeable: small solutes and water can cross it, while blood cells and large proteins are retained.",
    [
      "HEMODIALYSIS-MEMBRANE"
    ]
  ],
  [
    8,
    "Medium",
    "Why does dialysis fluid contain normal concentrations of useful substances such as glucose?",
    "To reduce loss of those substances from the blood",
    [
      "To force red blood cells out of blood",
      "To stop all diffusion",
      "To produce urea"
    ],
    "Matching useful solute concentrations prevents a large diffusion gradient that would otherwise remove them from blood. Wastes such as urea are kept low in the fluid so they still diffuse out of blood.",
    [
      "DIALYSIS-FLUID-GLUCOSE"
    ]
  ]
] as const;
