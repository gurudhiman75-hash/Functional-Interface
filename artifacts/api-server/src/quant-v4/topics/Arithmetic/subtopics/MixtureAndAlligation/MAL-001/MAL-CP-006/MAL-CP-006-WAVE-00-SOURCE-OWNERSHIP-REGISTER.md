# MAL-CP-006 Wave 00 — Source and Ownership Register

Status: **OPEN DISCOVERY — NO PERMANENT QL ALLOCATION**

Checkpoint: `MAL-CP-006 — Multi-Vessel Transfer & Equalisation`

## Ownership rule

CP-006 starts only when the learner must track material moving between **distinct vessels** and a vessel-by-vessel, stage-by-stage ledger is essential.

For every vessel and stage, track total volume, component-A amount, and component-B amount. Every transferred sample uses the **source vessel's current composition at the instant of transfer**.

## Hard boundaries

- CP-001 owns a simple one-time combination when only the final weighted mean/composition matters.
- CP-003 owns repeated remove/refill operations wholly inside one vessel. The existing policy says CP-006 starts only when material moves between distinct vessels.
- CP-004 owns one-vessel dilution, strengthening, evaporation and similar conserved-solute transformations unless a distinct-vessel transfer ledger is essential.

## Legacy V2 finding

The seven legacy vessel labels are **not seven independent executable source authorities**. In Quant V2 they all route through the same `draftVessel(...)` generator, which creates a single-vessel proportional-removal problem. Therefore those family names are migration labels only, not direct proof of CP-006 learner contracts.

## Direct source-backed Wave 01 topologies

| Source fixture | Distinct-vessel topology | Initial Wave 01 use |
|---|---|---|
| CAT 2019 Slot 2 Q80 | A→B→C→A, later samples use current B/C composition | three-vessel cycle |
| CAT 2022 Slot 2 Q61 | transfer → return → transfer between two containers | round-trip chain |
| SSC CGL Tier II 26 Oct 2023 | A→B, refill A, current A→B again | accumulated destination after source modification |
| Testbook 12 L / 18 L vessels | simultaneous equal cross-exchange until concentrations match | equalisation inverse |
| Testbook two-mixture return | 25% B→A then 25% current A→B | transfer-return final ratio |
| Prepp pure-component pair | pure A→B then current B→A | cross-vessel component ratio |

Wave 01 does **not** claim source saturation.

## Initial prototype policy

Wave 01 starts with six temporary executable prototypes: transfer-return final ratio; equal exchange amount for equal concentrations; final common concentration after equalising exchange; three-vessel cyclic transfer; source refill plus retransfer into an accumulating destination; and round-trip cross-vessel component ratio.

The one-way destination-blend form is held as a CP-001/CP-006 boundary instead of being promoted merely because two vessels are named.

## Lifecycle lock

```text
permanent QLs:               0
permanent solve modes:       0
Question Studio discovery:   disabled
Question Bank writes:        disabled
test/mock eligibility:       disabled
public publication:          false
language:                    English only
```

No count in Wave 01 is a future permanent-QL commitment. Source saturation and merge/split must happen first.
