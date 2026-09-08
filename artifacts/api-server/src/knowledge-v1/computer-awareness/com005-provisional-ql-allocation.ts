import { COM005_PROVISIONAL_TASKS } from "./com005-networking-merge-split-audit";

export const COM005_PERMANENT_QL_CANDIDATES = [
  { qlId:"COM005-QL-001", title:"Network Types by Coverage", taskId:"COM005-PT-001", status:"PROVISIONAL_ALLOCATION" },
  { qlId:"COM005-QL-002", title:"Network Topologies", taskId:"COM005-PT-002", status:"PROVISIONAL_ALLOCATION" },
  { qlId:"COM005-QL-003", title:"Networking Devices and Functions", taskId:"COM005-PT-003", status:"PROVISIONAL_ALLOCATION" },
  { qlId:"COM005-QL-004", title:"Basic Network Protocols", taskId:"COM005-PT-004", status:"PROVISIONAL_ALLOCATION" },
  { qlId:"COM005-QL-005", title:"Network Addressing Terms", taskId:"COM005-PT-005", status:"PROVISIONAL_ALLOCATION" },
  { qlId:"COM005-QL-006", title:"Transmission Media", taskId:"COM005-PT-006", status:"PROVISIONAL_ALLOCATION" },
  { qlId:"COM005-QL-007", title:"Transmission Modes", taskId:"COM005-PT-007", status:"PROVISIONAL_ALLOCATION" },
] as const;

export const COM005_QL_ALLOCATION_AUDIT = {
  candidateTaskCount: COM005_PROVISIONAL_TASKS.length,
  allocatedQlCount: COM005_PERMANENT_QL_CANDIDATES.length,
  heldTaskIds: ["COM005-HOLD-001"],
  permanent: false,
  nextGate: "SOURCE_SATURATION_VERDICT",
} as const;
