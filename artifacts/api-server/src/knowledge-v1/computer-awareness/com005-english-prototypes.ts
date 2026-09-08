export type Com005EnglishQuestion = {
  questionId: string;
  qlId: string;
  difficulty: "EASY" | "MEDIUM";
  stem: string;
  options: readonly string[];
  answer: string;
  explanation: string;
  sourceFactId: string;
  productionState: "ENGLISH_PROTOTYPE";
};

export const COM005_ENGLISH_PROTOTYPES: Com005EnglishQuestion[] = [
{questionId:"COM005-Q-001",qlId:"COM005-QL-001",difficulty:"EASY",stem:"Which network usually covers a small office or building?",options:["LAN","WAN","MAN","PAN"],answer:"LAN",explanation:"A LAN connects devices within a limited area such as a room, office or building.",sourceFactId:"NET-FACT-SCOPE-LAN",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-002",qlId:"COM005-QL-001",difficulty:"MEDIUM",stem:"Which network connects computers over a large geographical area?",options:["PAN","LAN","WAN","CAN"],answer:"WAN",explanation:"A WAN covers a large area and can connect networks in different cities or countries.",sourceFactId:"NET-FACT-SCOPE-WAN",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-003",qlId:"COM005-QL-002",difficulty:"EASY",stem:"Which topology uses a central connecting device?",options:["Bus","Ring","Star","Mesh"],answer:"Star",explanation:"In a star topology, each device connects to a central device.",sourceFactId:"NET-FACT-TOPOLOGY-STAR",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-004",qlId:"COM005-QL-002",difficulty:"MEDIUM",stem:"Which topology provides a direct link between every pair of devices?",options:["Bus","Star","Ring","Mesh"],answer:"Mesh",explanation:"A mesh topology has direct connections between devices, so it provides multiple paths.",sourceFactId:"NET-FACT-TOPOLOGY-MESH",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-005",qlId:"COM005-QL-003",difficulty:"EASY",stem:"Which device connects different networks?",options:["Hub","Router","Repeater","NIC"],answer:"Router",explanation:"A router forwards data between different networks.",sourceFactId:"NET-FACT-DEVICE-ROUTER",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-006",qlId:"COM005-QL-003",difficulty:"MEDIUM",stem:"Which device forwards data to the required device in a local network?",options:["Switch","Modem","Repeater","Gateway"],answer:"Switch",explanation:"A switch forwards data to the required device within a local network.",sourceFactId:"NET-FACT-DEVICE-SWITCH",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-007",qlId:"COM005-QL-004",difficulty:"EASY",stem:"Which protocol translates a domain name into an IP address?",options:["DNS","DHCP","FTP","SMTP"],answer:"DNS",explanation:"DNS maps domain names to IP addresses.",sourceFactId:"NET-FACT-PROTOCOL-DNS",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-008",qlId:"COM005-QL-004",difficulty:"MEDIUM",stem:"Which protocol automatically provides IP configuration to a host?",options:["DNS","DHCP","HTTP","FTP"],answer:"DHCP",explanation:"DHCP automatically supplies network configuration such as an IP address.",sourceFactId:"NET-FACT-PROTOCOL-DHCP",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-009",qlId:"COM005-QL-005",difficulty:"EASY",stem:"Which address identifies a network interface at the hardware level?",options:["MAC address","Domain name","URL","Port number"],answer:"MAC address",explanation:"A MAC address identifies a network interface at the hardware level.",sourceFactId:"NET-FACT-ADDRESS-MAC",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-010",qlId:"COM005-QL-005",difficulty:"MEDIUM",stem:"Which term is a human-readable name used for an Internet resource?",options:["MAC address","Domain name","Subnet mask","Frame"],answer:"Domain name",explanation:"A domain name is a readable name that identifies an Internet resource.",sourceFactId:"NET-FACT-ADDRESS-DOMAIN",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-011",qlId:"COM005-QL-006",difficulty:"EASY",stem:"Which transmission medium carries data using light?",options:["Twisted-pair cable","Coaxial cable","Optical fibre","Radio wave"],answer:"Optical fibre",explanation:"Optical fibre carries data as light through thin glass or plastic fibres.",sourceFactId:"NET-FACT-MEDIA-FIBRE",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-012",qlId:"COM005-QL-006",difficulty:"MEDIUM",stem:"Which option is a wireless transmission medium?",options:["Coaxial cable","Optical fibre","Twisted-pair cable","Radio wave"],answer:"Radio wave",explanation:"Radio waves transmit data through the air without a physical cable.",sourceFactId:"NET-FACT-MEDIA-RADIO",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-013",qlId:"COM005-QL-007",difficulty:"EASY",stem:"Which mode permits transmission in only one direction?",options:["Simplex","Half-duplex","Full-duplex","Multiplex"],answer:"Simplex",explanation:"Simplex communication allows data to move in only one direction.",sourceFactId:"NET-FACT-MODE-SIMPLEX",productionState:"ENGLISH_PROTOTYPE"},
{questionId:"COM005-Q-014",qlId:"COM005-QL-007",difficulty:"MEDIUM",stem:"Which mode permits simultaneous communication in both directions?",options:["Simplex","Half-duplex","Full-duplex","Broadcast"],answer:"Full-duplex",explanation:"Full-duplex communication allows both sides to transmit at the same time.",sourceFactId:"NET-FACT-MODE-FULL-DUPLEX",productionState:"ENGLISH_PROTOTYPE"},
];

export const COM005_ENGLISH_PROTOTYPE_AUDIT = {
  questionCount: COM005_ENGLISH_PROTOTYPES.length,
  qlCount: new Set(COM005_ENGLISH_PROTOTYPES.map((q) => q.qlId)).size,
  easyCount: COM005_ENGLISH_PROTOTYPES.filter((q) => q.difficulty === "EASY").length,
  mediumCount: COM005_ENGLISH_PROTOTYPES.filter((q) => q.difficulty === "MEDIUM").length,
  allDirectStems: COM005_ENGLISH_PROTOTYPES.every((q) => !/^(In the following|Consider the following|Read the question carefully)/i.test(q.stem)),
  allQuestionSpecificExplanations: COM005_ENGLISH_PROTOTYPES.every((q) => q.explanation.length > 0),
} as const;
