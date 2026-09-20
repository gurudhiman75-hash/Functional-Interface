import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp023ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp023ReviewSpec[] = [
  [
    8,
    "Medium",
    "Blood pressure is highest in which type of vessel?",
    "Arteries",
    [
      "Veins",
      "Capillaries",
      "Lymph vessels"
    ],
    "Arteries receive blood directly from the heart and therefore experience the highest pressure. Pressure falls progressively as blood moves through smaller vessels and capillaries.",
    [
      "BLOOD-PRESSURE-ARTERIES"
    ]
  ],
  [
    8,
    "Medium",
    "Systolic blood pressure corresponds to pressure during:",
    "Ventricular contraction",
    [
      "Ventricular relaxation",
      "Atrial filling only",
      "Complete cardiac arrest"
    ],
    "Systolic pressure is the higher arterial pressure produced when the ventricles contract. The lower diastolic value is measured while the ventricles relax between contractions.",
    [
      "SYSTOLIC-PRESSURE"
    ]
  ],
  [
    8,
    "Hard",
    "A person's pulse rate rises from 70 to 130 beats per minute during exercise. What is the best explanation?",
    "The heart is pumping more frequently to meet increased tissue demand",
    [
      "The heart has stopped filling with blood",
      "All veins have closed",
      "Red blood cells have stopped carrying oxygen"
    ],
    "Exercise increases tissue demand for oxygen and nutrients, so the heart beats faster to increase blood flow. This supports increased respiration and waste removal in working muscles.",
    [
      "PULSE-EXERCISE-REASON"
    ]
  ],
  [
    9,
    "Medium",
    "Which blood group is often called the universal donor for red blood cell transfusion when Rh factor is also considered?",
    "O negative",
    [
      "AB positive",
      "A positive",
      "B negative"
    ],
    "O negative red blood cells lack A, B and Rh(D) antigens, so they are commonly used in emergencies when compatibility is unknown.",
    [
      "BLOOD-GROUP-O-NEGATIVE"
    ]
  ],
  [
    9,
    "Hard",
    "A person with AB positive blood needs an emergency red-cell transfusion. Which donor group could be used under standard ABO/Rh compatibility rules?",
    "Any ABO group, whether Rh positive or Rh negative",
    [
      "Only AB positive",
      "Only O negative",
      "Only A positive or B positive"
    ],
    "AB positive recipients lack anti-A and anti-B antibodies and can receive Rh-positive or Rh-negative red cells. This is why AB positive is called the universal red-cell recipient.",
    [
      "BLOOD-GROUP-AB-POSITIVE"
    ]
  ],
  [
    9,
    "Medium",
    "A person with blood group A has which antigen on red blood cells?",
    "A antigen",
    [
      "B antigen",
      "Both A and B antigens",
      "No A or B antigen"
    ],
    "Group A red blood cells carry A antigen on their surface. Its plasma normally contains antibodies against the B antigen.",
    [
      "BLOOD-GROUP-A-ANTIGEN"
    ]
  ],
  [
    9,
    "Medium",
    "A person with blood group O has:",
    "Neither A nor B antigen on red blood cells",
    [
      "Only A antigen",
      "Only B antigen",
      "Both A and B antigens"
    ],
    "Group O red blood cells lack both A and B antigens. Its plasma normally contains antibodies against both A and B antigens.",
    [
      "BLOOD-GROUP-O-ANTIGENS"
    ]
  ],
  [
    9,
    "Medium",
    "Why is blood-group matching important before transfusion?",
    "Incompatible blood can cause dangerous agglutination reactions",
    [
      "It changes the number of heart chambers",
      "It prevents digestion",
      "It controls breathing rate"
    ],
    "Antibodies can react with incompatible red-cell antigens, causing clumping and serious transfusion reactions. Severe reactions can damage red cells and threaten circulation and kidney function.",
    [
      "TRANSFUSION-COMPATIBILITY"
    ]
  ],
  [
    9,
    "Hard",
    "Why can a person with AB positive blood receive red blood cells from all ABO and Rh groups under standard compatibility rules?",
    "Their plasma lacks anti-A and anti-B antibodies, and Rh-positive status permits Rh-positive or Rh-negative red cells",
    [
      "Their red blood cells contain no A, B or Rh antigens",
      "Their blood contains antibodies against every donor antigen",
      "AB positive blood has no plasma and therefore cannot agglutinate"
    ],
    "AB plasma normally lacks anti-A and anti-B antibodies, so A or B antigens on donor red cells are not attacked. Rh-positive recipients can also receive Rh-positive or Rh-negative red cells.",
    [
      "BLOOD-GROUP-AB-POSITIVE-COMPATIBILITY"
    ]
  ],
  [
    10,
    "Easy",
    "Lymph is formed from fluid that leaves:",
    "Blood capillaries",
    [
      "Alveoli",
      "Kidney tubules",
      "Stomach glands"
    ],
    "Some plasma filters out of capillaries into tissues. Part of this tissue fluid enters lymphatic vessels and becomes lymph. This pathway prevents excess fluid from accumulating permanently between tissue cells.",
    [
      "LYMPH-FORMATION"
    ]
  ],
  [
    10,
    "Easy",
    "One important function of lymph is to:",
    "Return excess tissue fluid to the bloodstream",
    [
      "Pump blood from the heart",
      "Produce hydrochloric acid",
      "Filter urine"
    ],
    "The lymphatic system collects excess tissue fluid and returns it to the blood circulation. Without this return pathway, swelling or oedema can develop in tissues.",
    [
      "LYMPH-RETURN-FLUID"
    ]
  ],
  [
    10,
    "Medium",
    "Lacteals in the small intestine are part of the lymphatic system and help absorb:",
    "Fats",
    [
      "Amino acids only",
      "Oxygen",
      "Urea"
    ],
    "Lacteals absorb many products of fat digestion and transport them through lymph before they enter the bloodstream. These absorbed lipids eventually re-enter the bloodstream through larger lymphatic vessels.",
    [
      "LYMPH-LACTEALS-FAT"
    ]
  ],
  [
    10,
    "Medium",
    "Why are capillaries essential even though arteries and veins carry most of the blood over long distances?",
    "Capillaries provide the exchange surface with tissues",
    [
      "Capillaries create the heartbeat",
      "Capillaries store bile",
      "Capillaries produce red blood cells"
    ],
    "Only capillaries have walls thin enough for efficient exchange of gases, nutrients and wastes with tissues. Arteries and veins mainly serve transport, while capillaries connect transport with tissue exchange.",
    [
      "CAPILLARY-EXCHANGE-ROLE"
    ]
  ],
  [
    10,
    "Hard",
    "If blood could move through arteries and veins but not through capillaries, which process would fail most directly?",
    "Exchange of substances between blood and body cells",
    [
      "Opening of heart valves",
      "Formation of pulse waves",
      "Movement of air into lungs"
    ],
    "Capillaries connect the arterial and venous sides of circulation and are the main exchange vessels. Cells would be unable to receive oxygen and nutrients efficiently or remove wastes.",
    [
      "NO-CAPILLARY-EXCHANGE"
    ]
  ],
  [
    10,
    "Hard",
    "A red blood cell travels from the left ventricle to a leg muscle and back to the right atrium. Which route is correct?",
    "Aorta → Arteries → Capillaries → Veins → Vena cava",
    [
      "Pulmonary artery → Alveoli → Pulmonary vein",
      "Vena cava → Aorta → Capillaries → Pulmonary vein",
      "Aorta → Pulmonary artery → Veins → Left atrium"
    ],
    "Systemic blood leaves the left ventricle through the aorta, reaches tissues through arteries and capillaries, then returns through veins and the vena cava.",
    [
      "SYSTEMIC-ROUTE-MIXED"
    ]
  ]
] as const;
