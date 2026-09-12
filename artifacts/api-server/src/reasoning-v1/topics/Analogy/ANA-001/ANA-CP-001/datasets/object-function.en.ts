import type { SemanticPair } from "./types";

// Keep this relation focused on a device/object and what it is primarily used
// to do. Phone→Talk and Television→View are retained because this exact
// relationship class appears in modern SSC material.
export const OBJECT_FUNCTION_PAIRS: readonly SemanticPair[] = [
  ["Knife","Cut"],
  ["Pen","Write"],
  ["Key","Unlock"],
  ["Needle","Sew"],
  ["Scissors","Trim"],
  ["Phone","Talk"],
  ["Television","View"],
  ["Umbrella","Protect from rain"],
  ["Telescope","Observe distant objects"],
  ["Microscope","Magnify small objects"],
  ["Eraser","Remove pencil marks"],
  ["Calculator","Perform calculations"],
];
