export const MEN_CP_013_MERGE_SPLIT_V2_AUTHORITY =
  'MEN-CP013-MERGE-SPLIT-V2' as const;

export type MenCp013CanonicalClusterId =
  | 'COMPOSITE_VOLUME_DIRECT'
  | 'COMPOSITE_VOLUME_DERIVED_DIMENSION'
  | 'COMPOSITE_SURFACE_EXPOSED'
  | 'REMOVED_MATERIAL_VOLUME'
  | 'INSCRIBED_AXIS_ALIGNED_CONTAINMENT'
  | 'INSCRIBED_DIAGONAL_CONTAINMENT'
  | 'VACANT_SPACE_CONTAINMENT'
  | 'TANK_CAPACITY_DIRECT'
  | 'DISPLACEMENT_LEVEL_CHANGE_DIRECT'
  | 'DISPLACEMENT_INVERSE_COUNT'
  | 'DISPLACEMENT_INVERSE_DIMENSION'
  | 'DISPLACEMENT_INVERSE_BASE_AREA'
  | 'PARTIAL_FILL_FINAL_LEVEL'
  | 'OVERFLOW_FROM_HEADROOM'
  | 'CONTAINMENT_SECONDARY_MEASURE';

export type MenCp013AnswerSemantic =
  | 'VOLUME'
  | 'SURFACE_AREA'
  | 'LENGTH'
  | 'AREA'
  | 'COUNT'
  | 'CAPACITY'
  | 'RATIO';

export interface MenCp013CanonicalCluster {
  readonly authority: typeof MEN_CP_013_MERGE_SPLIT_V2_AUTHORITY;
  readonly clusterId: MenCp013CanonicalClusterId;
  readonly title: string;
  readonly governingInference: string;
  readonly answerSemantic: MenCp013AnswerSemantic;
  readonly sourceIds: readonly string[];
  readonly mergeRationale: string;
}

const C=(
  clusterId:MenCp013CanonicalClusterId,
  title:string,
  governingInference:string,
  answerSemantic:MenCp013AnswerSemantic,
  sourceIds:readonly string[],
  mergeRationale:string,
):MenCp013CanonicalCluster=>({
  authority:MEN_CP_013_MERGE_SPLIT_V2_AUTHORITY,
  clusterId,title,governingInference,answerSemantic,sourceIds,mergeRationale,
});

export const MEN_CP_013_CANONICAL_CLUSTERS:readonly MenCp013CanonicalCluster[]=[
  C('COMPOSITE_VOLUME_DIRECT','Composite solid volume — direct','Decompose a non-overlapping composite solid into standard component volumes and add them.', 'VOLUME',[
    'CP013-W1-CYLINDER-HEMISPHERE-VOLUME','CP013-W1-CONE-HEMISPHERE-VOLUME','CP013-W1-CAPSULE-VOLUME','CP013-W3-SSC-CYL-HEMI-TOY-VOLUME',
  ],'Cylinder/hemisphere, cone/hemisphere, capsule and SSC toy wording share the same direct additive-volume inference.'),
  C('COMPOSITE_VOLUME_DERIVED_DIMENSION','Composite volume with derived component dimension','Derive a missing component height or length from the total geometry before applying additive volume.', 'VOLUME',[
    'CP013-W2-COMPOSITE-TOTAL-HEIGHT',
  ],'This retains a separate solve mode because the component dimension must be recovered before the volume equation is evaluated.'),
  C('COMPOSITE_SURFACE_EXPOSED','Composite exposed surface area','Add only externally exposed component surfaces and omit internal joining faces.', 'SURFACE_AREA',[
    'CP013-W1-CONE-HEMISPHERE-SURFACE','CP013-W1-CAPSULE-SURFACE','CP013-W3-SSC-CONE-HEMI-SURFACE',
  ],'The object/context changes, but the decisive reasoning is exposed-surface accounting across joined solids.'),
  C('REMOVED_MATERIAL_VOLUME','Removed / drilled material volume','Start with the containing solid and subtract the exact drilled, carved or bored region.', 'VOLUME',[
    'CP013-W1-DRILLED-CYLINDER-VOLUME','CP013-W1-CUBE-MINUS-SPHERE-VOLUME','CP013-W2-BORED-CUBOID-VOLUME',
  ],'Coaxial drilling, sphere carving and cuboid boring are topology representations of one subtractive-volume contract.'),
  C('INSCRIBED_AXIS_ALIGNED_CONTAINMENT','Axis-aligned largest inscribed solid','Translate face-to-face containment into equal diameter/base/height constraints, then solve the requested dimension or ratio.', 'LENGTH',[
    'CP013-W1-LARGEST-SPHERE-IN-CUBE','CP013-W1-LARGEST-CONE-IN-CUBE','CP013-W2-CONE-IN-CYLINDER-RATIO','CP013-W3-SSC-LARGEST-SPHERE-CUBE','CP013-W3-SSC-LARGEST-CONE-CUBE',
  ],'These forms use direct face/diameter/height contact. Source wording and ratio output remain representations of the same containment geometry.'),
  C('INSCRIBED_DIAGONAL_CONTAINMENT','Diagonal containment / body-diagonal constraint','Use the enclosing solid diameter against the inscribed cube body diagonal, then recover the required side.', 'LENGTH',[
    'CP013-W2-LARGEST-CUBE-IN-SPHERE',
  ],'Body-diagonal recovery is a materially different inference from axis-aligned diameter/height matching.'),
  C('VACANT_SPACE_CONTAINMENT','Vacant space around an inscribed solid','Find containing volume and inscribed volume under the contact constraint, then subtract occupied volume.', 'VOLUME',[
    'CP013-W1-SPHERE-IN-CYLINDER-VACANT',
  ],'Vacant-space questions require containment first and subtraction second, so they remain distinct from pure containment and pure drilling.'),
  C('TANK_CAPACITY_DIRECT','Static tank capacity','Compute the vessel volume from fixed dimensions and convert cubic units to litres/millilitres only after the geometry is complete.', 'CAPACITY',[
    'CP013-W1-CUBOID-TANK-CAPACITY','CP013-W1-CYLINDER-TANK-CAPACITY',
  ],'Cuboid and cylindrical tanks differ only in base-area formula; static capacity is the same reasoning contract.'),
  C('DISPLACEMENT_LEVEL_CHANGE_DIRECT','Direct displacement / level change','Equate displaced or removed volume to tank base area × level change, summing immersed-object volumes when needed.', 'LENGTH',[
    'CP013-W1-SPHERE-CYLINDER-LEVEL-RISE','CP013-W1-CUBE-CUBOID-LEVEL-RISE','CP013-W1-MULTI-SPHERE-LEVEL-RISE','CP013-W2-DRAW-OFF-LEVEL-DROP','CP013-W3-SSC-CUBE-TANK-RISE','CP013-W3-SSC-SPHERE-CAN-RISE','CP013-W3-SSC-MULTI-STONE-RISE',
  ],'Rise, fall, one object and many objects all solve the same direct volume/base-area level-change relation.'),
  C('DISPLACEMENT_INVERSE_COUNT','Inverse displacement — object count','Recover the number of identical immersed objects from displaced volume divided by one object volume.', 'COUNT',[
    'CP013-W2-INVERSE-SPHERE-COUNT',
  ],'Count recovery is discrete and should not be merged with inverse dimension or base-area recovery.'),
  C('DISPLACEMENT_INVERSE_DIMENSION','Inverse displacement — immersed-object dimension','Recover an immersed solid linear dimension from the displaced volume, including the required root.', 'LENGTH',[
    'CP013-W2-INVERSE-CUBE-SIDE',
  ],'The unknown is inside a cubic object-volume relation and therefore has a distinct inverse solve burden.'),
  C('DISPLACEMENT_INVERSE_BASE_AREA','Inverse displacement — tank base area','Recover tank base area as displaced volume divided by observed level change.', 'AREA',[
    'CP013-W2-INVERSE-TANK-BASE-AREA',
  ],'Base-area recovery is a first-power inverse relation and is kept distinct from count and root-based dimension recovery.'),
  C('PARTIAL_FILL_FINAL_LEVEL','Partially filled tank — final level','Translate initial fill state and added/removed liquid volume into final liquid height without crossing capacity.', 'LENGTH',[
    'CP013-W1-PARTIAL-FILL-FINAL-LEVEL',
  ],'This is a state-update problem with an initial level; it is not the same as pure displacement or overflow.'),
  C('OVERFLOW_FROM_HEADROOM','Overflow from remaining headroom','Compute spare volume above the initial liquid level, compare with displaced/added volume, and return only the excess.', 'VOLUME',[
    'CP013-W2-IMMERSION-OVERFLOW','CP013-W2-PARTIAL-FILL-OVERFLOW',
  ],'Immersion and added-liquid variants share the same headroom-versus-incoming-volume comparison.'),
  C('CONTAINMENT_SECONDARY_MEASURE','Containment followed by a secondary measure','Resolve the containment dimension first, then use it in a second-stage surface/volume measure.', 'SURFACE_AREA',[
    'CP013-W3-SSC-SPHERE-IN-CUBE-TSA',
  ],'The second-stage target creates a two-hop reasoning contract distinct from direct containment.'),
] as const;

export const MEN_CP_013_CANONICAL_SOURCE_IDS = MEN_CP_013_CANONICAL_CLUSTERS.flatMap(row=>row.sourceIds);
