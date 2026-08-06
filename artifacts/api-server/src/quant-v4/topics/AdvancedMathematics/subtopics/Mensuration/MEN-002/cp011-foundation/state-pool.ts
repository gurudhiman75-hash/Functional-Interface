import type { MenCp011State } from "./types";

export const MEN_CP011_STATE_POOL_AUTHORITY = "MEN-CP011-PHASE2A-STATE-POOL-V1" as const;

export type MenCp011RadialScale = 1 | 2 | 3;
export type MenCp011HeightScale = 1 | 3 | 4;

export interface MenCp011ScaleProfile {
  id: string;
  radialScale: MenCp011RadialScale;
  heightScale: MenCp011HeightScale;
}

export interface MenCp011PhysicalStateFixture {
  id: string;
  outerRadius: bigint;
  innerRadius: bigint;
  height: bigint;
  thickness: bigint;
  outerDiameter: bigint;
  innerDiameter: bigint;
  ringCoefficient: bigint;
  baseFixtureId: string;
  profile: MenCp011ScaleProfile;
}

const BASE_FIXTURES = [
  { id: "B01", outerRadius: 5n, innerRadius: 3n, height: 14n },
  { id: "B02", outerRadius: 7n, innerRadius: 4n, height: 21n },
  { id: "B03", outerRadius: 9n, innerRadius: 5n, height: 14n },
  { id: "B04", outerRadius: 10n, innerRadius: 6n, height: 7n },
  { id: "B05", outerRadius: 12n, innerRadius: 7n, height: 14n },
  { id: "B06", outerRadius: 14n, innerRadius: 9n, height: 21n },
  { id: "B07", outerRadius: 15n, innerRadius: 8n, height: 14n },
  { id: "B08", outerRadius: 18n, innerRadius: 11n, height: 7n },
] as const;

const RADIAL_SCALES = [1, 2, 3] as const;
const HEIGHT_SCALES = [1, 3, 4] as const;

const SCALE_PROFILES: readonly MenCp011ScaleProfile[] = RADIAL_SCALES.flatMap(
  (radialScale) => HEIGHT_SCALES.map((heightScale) => ({
    id: `R${radialScale}-H${heightScale}`,
    radialScale,
    heightScale,
  })),
);

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

export function menCp011PhysicalStateKey(state: Pick<
  MenCp011State,
  "outerRadius" | "innerRadius" | "height" | "thickness"
>) {
  return [
    state.outerRadius,
    state.innerRadius,
    state.height,
    state.thickness,
  ].join("|");
}

export function getMenCp011ScaleProfiles() {
  return [...SCALE_PROFILES];
}

export function getMenCp011PhysicalStateCatalog(): MenCp011PhysicalStateFixture[] {
  return BASE_FIXTURES.flatMap((base) => SCALE_PROFILES.map((profile) => {
    const radialScale = BigInt(profile.radialScale);
    const heightScale = BigInt(profile.heightScale);
    const outerRadius = base.outerRadius * radialScale;
    const innerRadius = base.innerRadius * radialScale;
    const height = base.height * heightScale;
    const thickness = outerRadius - innerRadius;
    return {
      id: `${base.id}-${profile.id}`,
      outerRadius,
      innerRadius,
      height,
      thickness,
      outerDiameter: 2n * outerRadius,
      innerDiameter: 2n * innerRadius,
      ringCoefficient: outerRadius ** 2n - innerRadius ** 2n,
      baseFixtureId: base.id,
      profile,
    };
  }));
}

export function selectMenCp011ScaleProfile(seed: string): MenCp011ScaleProfile {
  const radialScale = RADIAL_SCALES[
    hashText(`${MEN_CP011_STATE_POOL_AUTHORITY}|RADIAL|${seed}`) % RADIAL_SCALES.length
  ]!;
  const heightScale = HEIGHT_SCALES[
    hashText(`${MEN_CP011_STATE_POOL_AUTHORITY}|HEIGHT|${seed}`) % HEIGHT_SCALES.length
  ]!;
  return {
    id: `R${radialScale}-H${heightScale}`,
    radialScale,
    heightScale,
  };
}

export function expandMenCp011State(
  baseState: MenCp011State,
  seed: string,
): {
  state: MenCp011State;
  profile: MenCp011ScaleProfile;
  volumeScale: bigint;
  answerScale: bigint;
} {
  const profile = selectMenCp011ScaleProfile(seed);
  const radialScale = BigInt(profile.radialScale);
  const heightScale = BigInt(profile.heightScale);
  const volumeScale = radialScale ** 2n * heightScale;
  const outerRadius = baseState.outerRadius * radialScale;
  const innerRadius = baseState.innerRadius * radialScale;
  const height = baseState.height * heightScale;
  const thickness = outerRadius - innerRadius;
  const ringCoefficient = outerRadius ** 2n - innerRadius ** 2n;

  return {
    state: {
      ...baseState,
      outerRadius,
      innerRadius,
      height,
      thickness,
      outerDiameter: 2n * outerRadius,
      innerDiameter: 2n * innerRadius,
      ringCoefficient,
    },
    profile,
    volumeScale,
    answerScale: baseState.target === "VOLUME" ? volumeScale : radialScale,
  };
}

export function isMenCp011CatalogState(state: MenCp011State) {
  const key = menCp011PhysicalStateKey(state);
  return getMenCp011PhysicalStateCatalog().some((fixture) =>
    [
      fixture.outerRadius,
      fixture.innerRadius,
      fixture.height,
      fixture.thickness,
    ].join("|") === key,
  );
}
