import { clockTimeToHandAngles } from "./clock";
import { pointAtAngle } from "./geometry";
import {
  SPATIAL_SCENE_VERSION,
  type SpatialClockHandAngles,
  type SpatialClockTime,
  type SpatialScene,
} from "./types";

const CLOCK_CENTER = { x: 50, y: 50 } as const;

function clockPoint(angleClockwiseFromTwelve: number, radius: number) {
  return pointAtAngle(CLOCK_CENTER, radius, angleClockwiseFromTwelve - 90);
}

export function buildClockSceneFromAngles(
  angles: SpatialClockHandAngles,
  id: string,
): SpatialScene {
  return {
    version: SPATIAL_SCENE_VERSION,
    id,
    viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    nodes: [
      {
        kind: "circle",
        id: "clock-face",
        role: "clock-face",
        center: { ...CLOCK_CENTER },
        radius: 40,
        style: { stroke: "#111", strokeWidth: 2, fill: "none" },
      },
      {
        kind: "line",
        id: "twelve-marker",
        role: "clock-orientation-marker",
        start: { x: 50, y: 10 },
        end: { x: 50, y: 17 },
        style: { stroke: "#111", strokeWidth: 2.5, lineCap: "round" },
      },
      {
        kind: "line",
        id: "hour-hand",
        role: "hour-hand",
        start: { ...CLOCK_CENTER },
        end: clockPoint(angles.hourAngleDeg, 23),
        style: { stroke: "#111", strokeWidth: 3.5, lineCap: "round" },
      },
      {
        kind: "line",
        id: "minute-hand",
        role: "minute-hand",
        start: { ...CLOCK_CENTER },
        end: clockPoint(angles.minuteAngleDeg, 34),
        style: { stroke: "#111", strokeWidth: 2.2, lineCap: "round" },
      },
      {
        kind: "circle",
        id: "clock-pin",
        role: "clock-pin",
        center: { ...CLOCK_CENTER },
        radius: 2.5,
        style: { stroke: "#111", strokeWidth: 1, fill: "#111" },
      },
    ],
    metadata: { semanticRole: "ANALOG_CLOCK" },
  };
}

export function buildClockScene(time: SpatialClockTime, id: string): SpatialScene {
  const scene = buildClockSceneFromAngles(clockTimeToHandAngles(time), id);
  scene.metadata = {
    ...scene.metadata,
    sourceHour: time.hour,
    sourceMinute: time.minute,
  };
  return scene;
}

export function buildSnappedHourClockScene(
  time: SpatialClockTime,
  id: string,
): SpatialScene {
  const continuous = clockTimeToHandAngles(time);
  return buildClockSceneFromAngles(
    {
      hourAngleDeg: (time.hour % 12) * 30,
      minuteAngleDeg: continuous.minuteAngleDeg,
    },
    id,
  );
}

export const SPATIAL_CLOCK_AXIS = 50;
