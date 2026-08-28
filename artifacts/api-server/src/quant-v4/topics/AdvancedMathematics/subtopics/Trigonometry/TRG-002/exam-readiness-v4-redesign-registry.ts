export type Trg002V4RedesignAction =
  | "EXACT_MATH_REPAIR"
  | "SCENARIO_SURFACE_REDESIGN"
  | "ARCHETYPE_REPURPOSE"
  | "PARAMETER_REALISM"
  | "PHYSICAL_CONTEXT_ANCHOR"
  | "SOLUTION_DEPTH"
  | "VISUAL_REDRAW";

export type Trg002V4RedesignEntry = Readonly<{
  qlId: string;
  actions: readonly Trg002V4RedesignAction[];
  priority: "P0" | "P1" | "P2";
  rationale: string;
  target?: string;
}>;

export const TRG_002_V4_REDESIGN_REGISTRY: readonly Trg002V4RedesignEntry[] = [
  { qlId:"TRG-002-QL-013", actions:["EXACT_MATH_REPAIR","PARAMETER_REALISM"], priority:"P0", rationale:"Historical fraction formatter corrupted 8√3/24; exact math must be token-protected.", target:"Retain find-angle archetype with natural exact ratio and protected formula rendering." },
  { qlId:"TRG-002-QL-005", actions:["ARCHETYPE_REPURPOSE","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Collapses to the same normalized direct-height stem as QL001/QL003.", target:"Use a distinct single-observation information structure rather than another tower-height clone." },

  { qlId:"TRG-002-QL-006", actions:["PARAMETER_REALISM","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Surd horizontal measurement is avoidable in a routine direct-height problem." },
  { qlId:"TRG-002-QL-010", actions:["PARAMETER_REALISM","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Surd object height is an artificial way to force an integer answer." },
  { qlId:"TRG-002-QL-011", actions:["PARAMETER_REALISM","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Surd flagpole height is an avoidable physical given." },

  { qlId:"TRG-002-QL-015", actions:["PHYSICAL_CONTEXT_ANCHOR","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Floating elevated observation point; distance wording is physically thin.", target:"Rooftop/balcony/bridge/lighthouse support with explicit horizontal separation." },
  { qlId:"TRG-002-QL-016", actions:["PHYSICAL_CONTEXT_ANCHOR","PARAMETER_REALISM","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Floating observer plus surd distance." },
  { qlId:"TRG-002-QL-017", actions:["PHYSICAL_CONTEXT_ANCHOR","PARAMETER_REALISM","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Floating observer plus surd distance." },
  { qlId:"TRG-002-QL-018", actions:["PHYSICAL_CONTEXT_ANCHOR","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Duplicates QL015 structure and uses an unsupported elevated point." },
  { qlId:"TRG-002-QL-019", actions:["PHYSICAL_CONTEXT_ANCHOR","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Floating elevated observer; should become a supported rooftop/bridge/cliff observation." },
  { qlId:"TRG-002-QL-020", actions:["PHYSICAL_CONTEXT_ANCHOR","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Same thin elevated-observer shell as QL019/022." },
  { qlId:"TRG-002-QL-021", actions:["PHYSICAL_CONTEXT_ANCHOR","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Elevated point has no real structure supporting it." },
  { qlId:"TRG-002-QL-022", actions:["PHYSICAL_CONTEXT_ANCHOR","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Same thin elevated-observer shell as QL019/020." },

  { qlId:"TRG-002-QL-027", actions:["ARCHETYPE_REPURPOSE","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Fourth direct shadow-height clone in CP008.", target:"Difference between shadow lengths under two sun elevations." },
  { qlId:"TRG-002-QL-028", actions:["ARCHETYPE_REPURPOSE","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Direct shadow-height form is already saturated.", target:"Unfinished tower/extension until elevation or shadow condition changes." },
  { qlId:"TRG-002-QL-032", actions:["ARCHETYPE_REPURPOSE","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Duplicates direct find-shadow structure.", target:"Two equal-height objects / simultaneous shadow comparison." },
  { qlId:"TRG-002-QL-034", actions:["ARCHETYPE_REPURPOSE","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Third simple new-shadow reskin.", target:"Only the change/difference in shadow length is given or requested." },
  { qlId:"TRG-002-QL-037", actions:["ARCHETYPE_REPURPOSE","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Duplicates ladder reach-height form.", target:"Angle given with wall, requiring complementary-angle interpretation." },
  { qlId:"TRG-002-QL-046", actions:["ARCHETYPE_REPURPOSE","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Duplicates guy-wire length form.", target:"Ground-anchor distance or pole height from wire geometry." },

  { qlId:"TRG-002-QL-050", actions:["SCENARIO_SURFACE_REDESIGN","SOLUTION_DEPTH"], priority:"P0", rationale:"Hard same-side two-position tower shell repeats CP009 pattern; explanation skips algebra.", target:"Vehicle/boat/roadway scenario with same topology and fully shown elimination." },
  { qlId:"TRG-002-QL-051", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Hard solution jumps over the equation solving." },
  { qlId:"TRG-002-QL-053", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Hard solution needs explicit algebra and a non-tower scenario." },
  { qlId:"TRG-002-QL-054", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Hard solution needs explicit algebra." },
  { qlId:"TRG-002-QL-057", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Hard movement solution suppresses the difficult algebra." },
  { qlId:"TRG-002-QL-060", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Hard movement shell repeats tower/person context and skips algebra.", target:"Car approaching observation tower or ship approaching lighthouse." },
  { qlId:"TRG-002-QL-062", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN"], priority:"P0", rationale:"Hard receding-observer shell needs richer context and explicit algebra." },
  { qlId:"TRG-002-QL-066", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN"], priority:"P1", rationale:"Hard movement solution skips key elimination steps." },

  { qlId:"TRG-002-QL-079", actions:["ARCHETYPE_REPURPOSE","SCENARIO_SURFACE_REDESIGN","VISUAL_REDRAW"], priority:"P0", rationale:"Near-copy of QL078 equal-angle opposite-side tower problem.", target:"Equal pillars on opposite sides of a roadway with observer between them." },
  { qlId:"TRG-002-QL-080", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN","VISUAL_REDRAW"], priority:"P1", rationale:"Hard opposite-side algebra should be shown and scenario should be exam-real." },
  { qlId:"TRG-002-QL-081", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN","VISUAL_REDRAW"], priority:"P1", rationale:"Hard opposite-side solution is too compressed." },
  { qlId:"TRG-002-QL-082", actions:["SOLUTION_DEPTH","SCENARIO_SURFACE_REDESIGN","VISUAL_REDRAW"], priority:"P1", rationale:"Hard opposite-side solution is too compressed." },

  { qlId:"TRG-002-QL-084", actions:["PARAMETER_REALISM","VISUAL_REDRAW"], priority:"P1", rationale:"Surd horizontal building separation is avoidable." },
  { qlId:"TRG-002-QL-085", actions:["PARAMETER_REALISM","VISUAL_REDRAW"], priority:"P1", rationale:"Surd building separation plus depression geometry should be redrawn clearly." },
  { qlId:"TRG-002-QL-087", actions:["PARAMETER_REALISM","ARCHETYPE_REPURPOSE"], priority:"P0", rationale:"Given building height 16 + 8√3 m is strongly generator-shaped.", target:"Natural integer building heights; surd may appear in the answer instead." },
  { qlId:"TRG-002-QL-090", actions:["SOLUTION_DEPTH","VISUAL_REDRAW"], priority:"P1", rationale:"Hard base+top two-ray problem needs explicit simultaneous algebra." },
  { qlId:"TRG-002-QL-092", actions:["PHYSICAL_CONTEXT_ANCHOR","VISUAL_REDRAW"], priority:"P0", rationale:"River observer is a floating elevated point and current visual does not depict river banks.", target:"Bridge/embankment observation with two-bank river diagram." },
  { qlId:"TRG-002-QL-093", actions:["PHYSICAL_CONTEXT_ANCHOR","PARAMETER_REALISM","VISUAL_REDRAW"], priority:"P0", rationale:"Floating observer plus surd height in river-width problem." },
  { qlId:"TRG-002-QL-094", actions:["PHYSICAL_CONTEXT_ANCHOR","VISUAL_REDRAW"], priority:"P0", rationale:"River observer needs a physical support and scenario-aware diagram." },
  { qlId:"TRG-002-QL-096", actions:["SOLUTION_DEPTH","VISUAL_REDRAW"], priority:"P1", rationale:"Composite building+mast hard solution should show subtraction/elimination explicitly." },
] as const;

export function trg002V4RedesignFor(qlId: string) {
  return TRG_002_V4_REDESIGN_REGISTRY.find((entry) => entry.qlId === qlId) ?? null;
}

export function summarizeTrg002V4RedesignRegistry() {
  const actionCounts = new Map<Trg002V4RedesignAction, number>();
  const priorityCounts = new Map<string, number>();
  for (const entry of TRG_002_V4_REDESIGN_REGISTRY) {
    priorityCounts.set(entry.priority, (priorityCounts.get(entry.priority) ?? 0) + 1);
    for (const action of entry.actions) actionCounts.set(action, (actionCounts.get(action) ?? 0) + 1);
  }
  return {
    qlsFlagged: TRG_002_V4_REDESIGN_REGISTRY.length,
    priorities: Object.fromEntries(priorityCounts),
    actions: Object.fromEntries(actionCounts),
  } as const;
}
