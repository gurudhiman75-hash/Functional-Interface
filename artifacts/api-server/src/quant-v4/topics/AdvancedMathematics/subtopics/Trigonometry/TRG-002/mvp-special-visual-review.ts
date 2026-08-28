import type { Trg002Mvp48Id } from "./mvp-48-registry";

export const TRG_002_MVP_SPECIAL_VISUAL_REVIEW: ReadonlyArray<{
  qlId: Trg002Mvp48Id;
  seed: string;
  focus: string;
  mustShow: readonly string[];
  mustAvoid: readonly string[];
}> = [
  {
    qlId: "TRG-002-QL-035",
    seed: "mvp-special-changed-shadow",
    focus: "changed-shadow two-state geometry",
    mustShow: ["old shadow tip", "new shadow tip", "45° old ray", "30° new ray"],
    mustAvoid: ["single-shadow-only geometry", "old and new tips merged"],
  },
  {
    qlId: "TRG-002-QL-038",
    seed: "mvp-special-ladder",
    focus: "ladder angle and solved foot distance",
    mustShow: ["wall", "ladder", "60° ground angle", "solved horizontal distance"],
    mustAvoid: ["missing angle marker", "ladder disconnected from wall"],
  },
  {
    qlId: "TRG-002-QL-041",
    seed: "mvp-special-broken-object",
    focus: "broken-object stump/fallen-part geometry",
    mustShow: ["stump", "break point", "ground touch point", "fallen part"],
    mustAvoid: ["full intact object", "touch point above ground"],
  },
  {
    qlId: "TRG-002-QL-095",
    seed: "mvp-special-composite",
    focus: "stacked vertical-object geometry",
    mustShow: ["building base", "roof junction", "upper mast", "45° roof ray", "60° top ray"],
    mustAvoid: ["two separate side-by-side buildings", "upper mast detached from roof"],
  },
] as const;
