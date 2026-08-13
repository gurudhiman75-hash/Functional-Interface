import { TRG_002_RUNTIME_PROOF_IDS, type Trg002ProofQlId } from "./runtime-proof";
import { generateSolutionDiagramTrg002RuntimeProofQuestion } from "./runtime-proof-solution-diagram";
import { TRG_002_MVP_48_IDS, type Trg002Mvp48Id } from "./mvp-48-registry";
import { TRG_002_MVP_CP007_A_IDS, generateTrg002MvpCp007AQuestion, type Trg002MvpCp007AId } from "./mvp-cp007-a";
import { TRG_002_MVP_CP007_B_IDS, generateTrg002MvpCp007BQuestion, type Trg002MvpCp007BId } from "./mvp-cp007-b";
import { generateTrg002MvpQl024Clean } from "./mvp-ql024-clean";
import { TRG_002_MVP_CP008_SHADOW_LADDER_IDS, generateTrg002MvpCp008ShadowLadderQuestion, type Trg002MvpCp008ShadowLadderId } from "./mvp-cp008-shadow-ladder";
import { generateTrg002MvpQl035Clean } from "./mvp-ql035-clean";
import { generateTrg002MvpQl038Clean } from "./mvp-ql038-clean";
import { TRG_002_MVP_CP008_BROKEN_IDS, generateTrg002MvpCp008BrokenQuestion, type Trg002MvpCp008BrokenId } from "./mvp-cp008-broken";
import { TRG_002_MVP_CP008_WIRE_IDS, generateTrg002MvpCp008WireQuestion, type Trg002MvpCp008WireId } from "./mvp-cp008-wire";
import { TRG_002_MVP_CP009_A_IDS, generateTrg002MvpCp009AQuestion, type Trg002MvpCp009AId } from "./mvp-cp009-a";
import { TRG_002_MVP_CP009_B_IDS, generateTrg002MvpCp009BQuestion, type Trg002MvpCp009BId } from "./mvp-cp009-b";
import { TRG_002_MVP_CP010_OBSERVER_OPPOSITE_IDS, generateTrg002MvpCp010ObserverOppositeQuestion, type Trg002MvpCp010ObserverOppositeId } from "./mvp-cp010-observer-opposite";
import { TRG_002_MVP_CP010_BUILDING_SIGHT_IDS, generateTrg002MvpCp010BuildingSightQuestion, type Trg002MvpCp010BuildingSightId } from "./mvp-cp010-building-sight";
import { generateTrg002MvpQl094Clean } from "./mvp-ql094-clean";
import { generateTrg002MvpQl095, generateTrg002MvpQl096 } from "./mvp-cp010-composite-a";

const proof = new Set<string>(TRG_002_RUNTIME_PROOF_IDS);
const c7a = new Set<string>(TRG_002_MVP_CP007_A_IDS);
const c7b = new Set<string>(TRG_002_MVP_CP007_B_IDS);
const c8a = new Set<string>(TRG_002_MVP_CP008_SHADOW_LADDER_IDS);
const c8b = new Set<string>(TRG_002_MVP_CP008_BROKEN_IDS);
const c8c = new Set<string>(TRG_002_MVP_CP008_WIRE_IDS);
const c9a = new Set<string>(TRG_002_MVP_CP009_A_IDS);
const c9b = new Set<string>(TRG_002_MVP_CP009_B_IDS);
const c10a = new Set<string>(TRG_002_MVP_CP010_OBSERVER_OPPOSITE_IDS);
const c10b = new Set<string>(TRG_002_MVP_CP010_BUILDING_SIGHT_IDS);

export function generateTrg002Mvp48Question(qlId: Trg002Mvp48Id, seed: string) {
  if (proof.has(qlId)) return generateSolutionDiagramTrg002RuntimeProofQuestion(qlId as Trg002ProofQlId, seed);
  if (qlId === "TRG-002-QL-024") return generateTrg002MvpQl024Clean(seed);
  if (qlId === "TRG-002-QL-035") return generateTrg002MvpQl035Clean(seed);
  if (qlId === "TRG-002-QL-038") return generateTrg002MvpQl038Clean(seed);
  if (qlId === "TRG-002-QL-094") return generateTrg002MvpQl094Clean(seed);
  if (c7a.has(qlId)) return generateTrg002MvpCp007AQuestion(qlId as Trg002MvpCp007AId, seed);
  if (c7b.has(qlId)) return generateTrg002MvpCp007BQuestion(qlId as Trg002MvpCp007BId, seed);
  if (c8a.has(qlId)) return generateTrg002MvpCp008ShadowLadderQuestion(qlId as Trg002MvpCp008ShadowLadderId, seed);
  if (c8b.has(qlId)) return generateTrg002MvpCp008BrokenQuestion(qlId as Trg002MvpCp008BrokenId, seed);
  if (c8c.has(qlId)) return generateTrg002MvpCp008WireQuestion(qlId as Trg002MvpCp008WireId, seed);
  if (c9a.has(qlId)) return generateTrg002MvpCp009AQuestion(qlId as Trg002MvpCp009AId, seed);
  if (c9b.has(qlId)) return generateTrg002MvpCp009BQuestion(qlId as Trg002MvpCp009BId, seed);
  if (c10a.has(qlId)) return generateTrg002MvpCp010ObserverOppositeQuestion(qlId as Trg002MvpCp010ObserverOppositeId, seed);
  if (c10b.has(qlId)) return generateTrg002MvpCp010BuildingSightQuestion(qlId as Trg002MvpCp010BuildingSightId, seed);
  if (qlId === "TRG-002-QL-095") return generateTrg002MvpQl095(seed);
  if (qlId === "TRG-002-QL-096") return generateTrg002MvpQl096(seed);
  throw new Error(`Missing TRG-002 MVP generator for ${qlId}.`);
}

export function generateAllTrg002Mvp48Questions(seed: string) {
  return TRG_002_MVP_48_IDS.map((qlId) => generateTrg002Mvp48Question(qlId, seed));
}
