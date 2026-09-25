import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp025ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp025ReviewSpec[] = [
  [
    1,
    "Easy",
    "The brain and spinal cord together form the:",
    "Central nervous system",
    [
      "Peripheral nervous system",
      "Autonomic nervous system",
      "Endocrine system"
    ],
    "The central nervous system, or CNS, consists of the brain and spinal cord. It acts as the main processing and coordinating centre of the nervous system.",
    [
      "CNS-BRAIN-SPINAL-CORD"
    ]
  ],
  [
    1,
    "Easy",
    "Nerves outside the brain and spinal cord belong to the:",
    "Peripheral nervous system",
    [
      "Central nervous system",
      "Digestive system",
      "Endocrine system"
    ],
    "The peripheral nervous system includes nerves that connect the central nervous system with the rest of the body. It carries sensory information inward and motor commands outward.",
    [
      "PNS-DEFINITION"
    ]
  ],
  [
    1,
    "Medium",
    "What is the basic role of the nervous system?",
    "Receive information, process it and coordinate responses",
    [
      "Produce digestive enzymes",
      "Transport oxygen in blood",
      "Filter wastes from blood"
    ],
    "The nervous system detects changes, processes information and sends signals that coordinate rapid responses. Its rapid electrical signalling allows the body to respond quickly to changing conditions.",
    [
      "NERVOUS-SYSTEM-ROLE"
    ]
  ],
  [
    1,
    "Medium",
    "Which division connects the brain and spinal cord to muscles and sense organs?",
    "Peripheral nervous system",
    [
      "Central nervous system only",
      "Endocrine glands",
      "Circulatory system"
    ],
    "Peripheral nerves carry information between the CNS and receptors, muscles and other organs. These nerves provide the communication link between central control and the rest of the body.",
    [
      "PNS-CONNECTION"
    ]
  ],
  [
    1,
    "Medium",
    "Why is nervous coordination generally faster than hormonal coordination?",
    "Nerve impulses travel rapidly along neurons",
    [
      "Hormones move only through nerves",
      "Neurons do not require energy",
      "Hormones never reach target organs"
    ],
    "Electrical impulses move quickly along neurons, while hormones must travel through body fluids to target tissues. This makes nervous responses especially suitable for immediate actions such as reflexes.",
    [
      "NERVOUS-VS-HORMONAL-SPEED"
    ]
  ],
  [
    1,
    "Hard",
    "A person can detect a pinprick in the foot and quickly move the leg. Which systems must communicate directly for this response?",
    "Peripheral nerves and central nervous system",
    [
      "Digestive and excretory systems",
      "Endocrine and skeletal systems only",
      "Respiratory and urinary systems"
    ],
    "Sensory nerves carry information to the CNS, which processes it and sends motor signals back through peripheral nerves. The response therefore depends on two-way communication between peripheral pathways and central processing.",
    [
      "CNS-PNS-INTEGRATION"
    ]
  ],
  [
    2,
    "Easy",
    "The structural and functional unit of the nervous system is the:",
    "Neuron",
    [
      "Nephron",
      "Alveolus",
      "Villus"
    ],
    "A neuron is a specialized cell that receives and transmits nerve impulses. Its structure is specialized for communication over short or long distances.",
    [
      "NEURON-UNIT"
    ]
  ],
  [
    2,
    "Easy",
    "Which part of a neuron usually receives signals from other cells?",
    "Dendrites",
    [
      "Axon",
      "Myelin sheath",
      "Synaptic terminal only"
    ],
    "Dendrites are branched extensions that receive incoming signals and carry them toward the cell body. Their branching shape increases the surface available for receiving information.",
    [
      "DENDRITES-RECEIVE"
    ]
  ],
  [
    2,
    "Medium",
    "The axon of a neuron carries impulses:",
    "Away from the cell body",
    [
      "Toward the cell body only",
      "Only inside the nucleus",
      "Directly into blood"
    ],
    "The axon conducts nerve impulses away from the neuron's cell body toward another neuron, muscle or gland. Long axons allow signals to travel from the cell body to distant targets.",
    [
      "AXON-AWAY"
    ]
  ],
  [
    2,
    "Medium",
    "What is the function of the myelin sheath around many axons?",
    "It increases the speed of impulse conduction",
    [
      "It produces neurotransmitters",
      "It stores glucose",
      "It forms blood clots"
    ],
    "Myelin electrically insulates the axon and allows nerve impulses to travel faster. In myelinated fibres, impulses effectively jump between gaps called nodes of Ranvier.",
    [
      "MYELIN-FUNCTION"
    ]
  ],
  [
    2,
    "Medium",
    "A synapse is the junction between:",
    "A neuron and another neuron or target cell",
    [
      "Two red blood cells",
      "A muscle and a bone only",
      "Two blood vessels"
    ],
    "At a synapse, a neuron communicates with another neuron, muscle cell or gland cell. Chemical neurotransmitters commonly carry the signal across the tiny synaptic gap.",
    [
      "SYNAPSE-DEFINITION"
    ]
  ],
  [
    2,
    "Hard",
    "If the myelin sheath of a long motor neuron is damaged, which change is most likely?",
    "Nerve impulses travel more slowly",
    [
      "The neuron carries more oxygen",
      "The axon becomes a blood vessel",
      "The cell body stops containing DNA"
    ],
    "Loss of myelin reduces electrical insulation and slows conduction along the axon. This can impair timing and coordination even when the neuron itself remains alive.",
    [
      "MYELIN-DAMAGE"
    ]
  ],
  [
    3,
    "Easy",
    "Which part of the brain controls higher functions such as thinking, memory and voluntary actions?",
    "Cerebrum",
    [
      "Cerebellum",
      "Medulla oblongata",
      "Spinal cord"
    ],
    "The cerebrum is the largest part of the brain and is involved in thinking, memory, sensation and voluntary movement. Different regions specialize in functions such as language, vision, movement and memory.",
    [
      "CEREBRUM-FUNCTION"
    ]
  ],
  [
    3,
    "Easy",
    "Which part of the brain helps maintain balance and coordinates muscular activity?",
    "Cerebellum",
    [
      "Cerebrum",
      "Medulla oblongata",
      "Hypothalamus"
    ],
    "The cerebellum coordinates voluntary muscle activity and helps maintain posture and balance. It compares intended movement with sensory feedback and corrects errors during motion.",
    [
      "CEREBELLUM-BALANCE"
    ]
  ],
  [
    3,
    "Medium",
    "Breathing and heartbeat are controlled largely by the:",
    "Medulla oblongata",
    [
      "Cerebrum",
      "Retina",
      "Cerebellum"
    ],
    "The medulla contains centres that regulate involuntary functions such as breathing and heart rate. These automatic controls continue without conscious attention during sleep.",
    [
      "MEDULLA-VITAL-FUNCTIONS"
    ]
  ]
] as const;
