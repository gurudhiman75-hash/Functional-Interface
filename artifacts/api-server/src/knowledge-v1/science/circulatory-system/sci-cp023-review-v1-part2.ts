import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp023ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp023ReviewSpec[] = [
  [
    3,
    "Medium",
    "Why is blood clotting important after a cut?",
    "It reduces blood loss and helps block entry of microbes",
    [
      "It increases oxygen loss",
      "It destroys all red blood cells",
      "It lowers body temperature"
    ],
    "A clot seals the wound, limits blood loss and forms a barrier that can reduce entry of microorganisms.",
    [
      "CLOTTING-FUNCTION"
    ]
  ],
  [
    3,
    "Medium",
    "A very low platelet count would most directly cause difficulty in:",
    "Stopping bleeding after injury",
    [
      "Transporting oxygen",
      "Digesting fats",
      "Producing urine"
    ],
    "Platelets are essential for normal clot formation, so a low count can make bleeding harder to stop.",
    [
      "LOW-PLATELETS"
    ]
  ],
  [
    3,
    "Hard",
    "A person has normal red and white blood cell counts but bleeds for a long time after minor cuts. Which blood component is most likely deficient?",
    "Platelets",
    [
      "Haemoglobin",
      "Plasma water",
      "Antibodies only"
    ],
    "Prolonged bleeding with otherwise normal blood cell counts points to a problem with platelets or clotting factors.",
    [
      "BLEEDING-PLATELETS"
    ]
  ],
  [
    4,
    "Easy",
    "How many chambers are present in the human heart?",
    "Four",
    [
      "Two",
      "Three",
      "Five"
    ],
    "The human heart has four chambers: two atria and two ventricles.",
    [
      "HEART-FOUR-CHAMBERS"
    ]
  ],
  [
    4,
    "Easy",
    "Which chamber receives deoxygenated blood from the body?",
    "Right atrium",
    [
      "Left atrium",
      "Right ventricle",
      "Left ventricle"
    ],
    "The right atrium receives deoxygenated blood returning from the body through the venae cavae.",
    [
      "RIGHT-ATRIUM-RECEIVES"
    ]
  ],
  [
    4,
    "Medium",
    "Which chamber pumps oxygenated blood into the aorta?",
    "Left ventricle",
    [
      "Right ventricle",
      "Left atrium",
      "Right atrium"
    ],
    "The left ventricle pumps oxygenated blood into the aorta for distribution to the body.",
    [
      "LEFT-VENTRICLE-AORTA"
    ]
  ],
  [
    4,
    "Medium",
    "Why is the wall of the left ventricle thicker than that of the right ventricle?",
    "It must pump blood throughout the body at higher pressure",
    [
      "It stores more oxygen",
      "It receives blood directly from veins",
      "It produces red blood cells"
    ],
    "The left ventricle must generate enough pressure to send blood through the systemic circulation, so its muscular wall is thicker.",
    [
      "LEFT-VENTRICLE-THICK"
    ]
  ],
  [
    4,
    "Medium",
    "Which chamber sends deoxygenated blood to the lungs?",
    "Right ventricle",
    [
      "Left ventricle",
      "Left atrium",
      "Right atrium"
    ],
    "The right ventricle pumps deoxygenated blood through the pulmonary artery to the lungs.",
    [
      "RIGHT-VENTRICLE-LUNGS"
    ]
  ],
  [
    4,
    "Hard",
    "If the left ventricle becomes very weak, which circulation is affected most directly?",
    "Systemic circulation",
    [
      "Pulmonary circulation only",
      "Coronary circulation only",
      "Lymph flow only"
    ],
    "The left ventricle drives blood into the aorta and therefore powers most of the systemic circulation.",
    [
      "LEFT-VENTRICLE-SYSTEMIC"
    ]
  ],
  [
    5,
    "Easy",
    "What is the purpose of valves in the heart?",
    "Prevent backflow of blood",
    [
      "Produce blood cells",
      "Exchange gases",
      "Filter wastes"
    ],
    "Heart valves ensure that blood moves in one direction by preventing backward flow when chambers contract or relax.",
    [
      "HEART-VALVES-FUNCTION"
    ]
  ],
  [
    5,
    "Easy",
    "The valve between the left atrium and left ventricle is the:",
    "Bicuspid or mitral valve",
    [
      "Tricuspid valve",
      "Pulmonary valve",
      "Aortic semilunar valve"
    ],
    "The left atrioventricular valve is called the bicuspid or mitral valve.",
    [
      "MITRAL-VALVE"
    ]
  ],
  [
    5,
    "Medium",
    "The tricuspid valve lies between the:",
    "Right atrium and right ventricle",
    [
      "Left atrium and left ventricle",
      "Right ventricle and pulmonary artery",
      "Left ventricle and aorta"
    ],
    "The tricuspid valve is the right atrioventricular valve and prevents backflow into the right atrium.",
    [
      "TRICUSPID-LOCATION"
    ]
  ],
  [
    5,
    "Medium",
    "Semilunar valves are found at the openings of the:",
    "Aorta and pulmonary artery",
    [
      "Vena cava and pulmonary vein",
      "Atria only",
      "Capillaries"
    ],
    "The aortic and pulmonary semilunar valves prevent blood from flowing back into the ventricles after ejection.",
    [
      "SEMILUNAR-VALVES"
    ]
  ],
  [
    5,
    "Medium",
    "If a heart valve fails to close properly, the immediate result may be:",
    "Backflow of blood",
    [
      "Loss of all red blood cells",
      "No pulse anywhere",
      "Complete stoppage of gas exchange"
    ],
    "A faulty valve can allow some blood to move backward instead of continuing in the intended direction.",
    [
      "VALVE-FAILURE-BACKFLOW"
    ]
  ],
  [
    5,
    "Hard",
    "Blood has just entered the left ventricle. Which valve must it pass through next to leave the heart?",
    "Aortic semilunar valve",
    [
      "Mitral valve",
      "Tricuspid valve",
      "Pulmonary semilunar valve"
    ],
    "Blood exits the left ventricle through the aortic semilunar valve and enters the aorta.",
    [
      "LEFT-VENTRICLE-AORTIC-VALVE"
    ]
  ]
] as const;
