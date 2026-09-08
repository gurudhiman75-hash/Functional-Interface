import { COM005_NETWORKING_DISCOVERY } from "./com005-networking-discovery";

export type Com005ProvisionalTask = {
  taskId: string;
  title: string;
  candidateIds: string[];
  disposition: "PROVISIONAL_TASK" | "HOLD";
  rationale: string;
  splitCondition?: string;
};

export const COM005_PROVISIONAL_TASKS: Com005ProvisionalTask[] = [
  {taskId:"COM005-PT-001",title:"Network Scope",candidateIds:["NET-DISC-001"],disposition:"PROVISIONAL_TASK",rationale:"PAN, LAN, MAN and WAN classify networks by coverage."},
  {taskId:"COM005-PT-002",title:"Network Topology",candidateIds:["NET-DISC-002"],disposition:"PROVISIONAL_TASK",rationale:"Topology questions identify the connection pattern.",splitCondition:"Split only if target-exam evidence separates fault or cost reasoning."},
  {taskId:"COM005-PT-003",title:"Networking Devices",candidateIds:["NET-DISC-003","NET-DISC-004"],disposition:"PROVISIONAL_TASK",rationale:"Device identity and basic forwarding function use the same device-role model."},
  {taskId:"COM005-PT-004",title:"Basic Protocol Purpose",candidateIds:["NET-DISC-005","NET-DISC-006"],disposition:"PROVISIONAL_TASK",rationale:"Protocol purpose and expansion are two surfaces of the same protocol-identity relation.",splitCondition:"Split expansion recall only if PYQs show independent volume."},
  {taskId:"COM005-PT-005",title:"Network Addressing Terms",candidateIds:["NET-DISC-007"],disposition:"PROVISIONAL_TASK",rationale:"IP, MAC and domain name comparison is a distinct addressing task."},
  {taskId:"COM005-PT-006",title:"Transmission Media",candidateIds:["NET-DISC-008"],disposition:"PROVISIONAL_TASK",rationale:"Media are classified by signal or transmission path."},
  {taskId:"COM005-PT-007",title:"Transmission Direction",candidateIds:["NET-DISC-009"],disposition:"PROVISIONAL_TASK",rationale:"Simplex, half-duplex and full-duplex test direction of communication."},
  {taskId:"COM005-HOLD-001",title:"Network Performance Terms",candidateIds:["NET-DISC-010"],disposition:"HOLD",rationale:"Bandwidth and latency remain held until target-exam evidence confirms repeated, unambiguous demand."},
];

export const COM005_AUDIT = {
  chapter: "COM-005",
  discoveryCandidateCount: COM005_NETWORKING_DISCOVERY.length,
  provisionalTaskCount: COM005_PROVISIONAL_TASKS.length,
  permanentQlCount: 0,
  sourceSaturationClosed: false,
  productionReady: false,
  protectedBoundaries: ["COM-004 owns user-facing Web/e-mail workflows; COM-005 owns basic networking mechanics.","COM-006 owns threats, attacks and defensive security controls."],
  nextGate: "TARGET_EXAM_SOURCE_SATURATION_VERDICT",
} as const;
