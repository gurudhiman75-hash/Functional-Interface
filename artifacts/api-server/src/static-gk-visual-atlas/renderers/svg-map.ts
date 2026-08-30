import type {
  GeoJsonAreaGeometry,
  GeoJsonLineString,
  IndiaAdminFeatureCollection,
  Position,
} from "../geometry/geojson";
import type {
  StaticGkMapPathSceneRecipe,
  StaticGkMeridianSceneRecipe,
  StaticGkSceneCue,
  StaticGkSceneQuiz,
  StaticGkSceneViewport,
} from "../scenes/types";

interface ProjectedPoint {
  x: number;
  y: number;
}

interface Projector {
  project(position: Position): ProjectedPoint;
}

const MERCATOR_MAX_LATITUDE = 85.05112878;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function mercatorRaw([longitude, latitude]: Position): ProjectedPoint {
  const lambda = (longitude * Math.PI) / 180;
  const clampedLatitude = Math.max(-MERCATOR_MAX_LATITUDE, Math.min(MERCATOR_MAX_LATITUDE, latitude));
  const phi = (clampedLatitude * Math.PI) / 180;
  return { x: lambda, y: Math.log(Math.tan(Math.PI / 4 + phi / 2)) };
}

function forEachPosition(geometry: GeoJsonAreaGeometry, visit: (position: Position) => void): void {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const position of ring) visit(position);
    }
  }
}

export function createIndiaMercatorProjector(
  geometry: IndiaAdminFeatureCollection,
  viewport: StaticGkSceneViewport,
): Projector {
  if (!geometry.features.length) throw new Error("Cannot project empty India geometry");

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const feature of geometry.features) {
    forEachPosition(feature.geometry, (position) => {
      const point = mercatorRaw(position);
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
  }

  if (![minX, maxX, minY, maxY].every(Number.isFinite) || maxX <= minX || maxY <= minY) {
    throw new Error("India geometry has an invalid projected extent");
  }

  const mapTop = viewport.safeArea.top + 180;
  const mapBottom = viewport.height - viewport.safeArea.bottom - 310;
  const mapLeft = viewport.safeArea.left;
  const mapRight = viewport.width - viewport.safeArea.right;
  const availableWidth = mapRight - mapLeft;
  const availableHeight = mapBottom - mapTop;
  if (availableWidth <= 0 || availableHeight <= 0) throw new Error("Invalid render safe area");

  const scale = Math.min(availableWidth / (maxX - minX), availableHeight / (maxY - minY));
  const renderedWidth = (maxX - minX) * scale;
  const renderedHeight = (maxY - minY) * scale;
  const offsetX = mapLeft + (availableWidth - renderedWidth) / 2 - minX * scale;
  const offsetY = mapTop + (availableHeight - renderedHeight) / 2 + maxY * scale;

  return {
    project(position: Position): ProjectedPoint {
      const raw = mercatorRaw(position);
      return { x: raw.x * scale + offsetX, y: offsetY - raw.y * scale };
    },
  };
}

function ringPath(ring: Position[], projector: Projector): string {
  if (!ring.length) return "";
  const points = ring.map((position) => projector.project(position));
  return `${points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(" ")} Z`;
}

function areaPath(geometry: GeoJsonAreaGeometry, projector: Projector): string {
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap((polygon) => polygon.map((ring) => ringPath(ring, projector))).join(" ");
}

function linePath(geometry: GeoJsonLineString, projector: Projector): string {
  return geometry.coordinates
    .map((position, index) => {
      const point = projector.project(position);
      return `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
    })
    .join(" ");
}

function activeCue(cues: readonly StaticGkSceneCue[], layer: StaticGkSceneCue["layer"], timeMs: number) {
  return cues.find((cue) => cue.layer === layer && cue.startMs <= timeMs && timeMs < cue.endMs);
}

function currentCueText(cues: readonly StaticGkSceneCue[], timeMs: number): string | undefined {
  return [...cues]
    .filter((cue) => cue.startMs <= timeMs && timeMs < cue.endMs && cue.text)
    .sort((a, b) => b.startMs - a.startMs)[0]?.text;
}

function quizCard(quiz: StaticGkSceneQuiz, visible: boolean): string {
  if (!visible) return "";
  return `<g><rect x="90" y="1450" width="900" height="310" rx="34" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/><text x="540" y="1535" text-anchor="middle" font-size="34" font-weight="700" fill="#0F172A">${escapeXml(quiz.question)}</text>${quiz.options
    .map(
      (option, index) =>
        `<text x="160" y="${1605 + index * 38}" font-size="27" fill="#334155">${String.fromCharCode(65 + index)}. ${escapeXml(option)}</text>`,
    )
    .join("")}</g>`;
}

function svgShell(
  viewport: StaticGkSceneViewport,
  title: string,
  subtitle: string,
  body: string,
  overlay: string,
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${viewport.width}" height="${viewport.height}" viewBox="0 0 ${viewport.width} ${viewport.height}"><rect width="100%" height="100%" fill="#FFFFFF"/><text x="540" y="130" text-anchor="middle" font-size="48" font-weight="800" fill="#0F172A">${escapeXml(title)}</text><text x="540" y="205" text-anchor="middle" font-size="30" font-weight="600" fill="#475569">${escapeXml(subtitle)}</text><g>${body}</g>${overlay}<text x="540" y="1840" text-anchor="middle" font-size="22" fill="#64748B">Examtree Visual Atlas · Survey of India geometry</text></svg>`;
}

export function renderTropicCancerSvgFrame(
  scene: StaticGkMapPathSceneRecipe,
  geometry: IndiaAdminFeatureCollection,
  timeMs: number,
): string {
  if (scene.status !== "render-ready") throw new Error("Tropic scene is not render-ready");
  if (!scene.route.resolvedSegments.length) throw new Error("Tropic scene has no resolved route segments");
  if (!Number.isFinite(timeMs) || timeMs < 0) throw new Error("Invalid frame timestamp");

  const projector = createIndiaMercatorProjector(geometry, scene.viewport);
  const stateCue = activeCue(scene.cues, "state-highlight", timeMs);
  const selectedState = stateCue?.text;
  const cueText = currentCueText(scene.cues, timeMs);
  const routeVisible = scene.cues.some((cue) => cue.layer === "latitude-line" && cue.startMs <= timeMs);
  const quizVisible = Boolean(activeCue(scene.cues, "quiz", timeMs));

  const boundaries = geometry.features
    .map((feature) => {
      const isSelected = feature.properties.stateName === selectedState;
      return `<path d="${areaPath(feature.geometry, projector)}" fill="${isSelected ? "#DCE7FF" : "#F8FAFC"}" stroke="${isSelected ? "#334155" : "#94A3B8"}" stroke-width="${isSelected ? "2.4" : "1.1"}" fill-rule="evenodd"/>`;
    })
    .join("");

  const route = routeVisible
    ? scene.route.resolvedSegments
        .map(
          (segment) =>
            `<path d="${linePath(segment.geometry, projector)}" fill="none" stroke="#B42318" stroke-width="7" stroke-linecap="round"/>`,
        )
        .join("")
    : "";
  const selectedLabel = selectedState
    ? `<text x="540" y="1540" text-anchor="middle" font-size="58" font-weight="700" fill="#0F172A">${escapeXml(selectedState)}</text>`
    : "";
  const info = !quizVisible && cueText
    ? `<text x="540" y="1630" text-anchor="middle" font-size="34" font-weight="600" fill="#334155">${escapeXml(cueText)}</text>`
    : "";

  return svgShell(
    scene.viewport,
    scene.title,
    scene.route.editorialLabel,
    `${boundaries}${route}`,
    `${selectedLabel}${info}${quizCard(scene.quiz, quizVisible)}`,
  );
}

export function renderStandardMeridianSvgFrame(
  scene: StaticGkMeridianSceneRecipe,
  geometry: IndiaAdminFeatureCollection,
  timeMs: number,
): string {
  if (scene.status !== "render-ready") throw new Error("Standard Meridian scene is not render-ready");
  if (!scene.meridian.indiaSegments.length) throw new Error("Standard Meridian scene has no India segments");
  if (!scene.districtOfInterest.meridianSegments.length) {
    throw new Error("Standard Meridian scene has no verified Mirzapur district intersection");
  }
  if (!Number.isFinite(timeMs) || timeMs < 0) throw new Error("Invalid frame timestamp");

  const projector = createIndiaMercatorProjector(geometry, scene.viewport);
  const stateVisible = Boolean(activeCue(scene.cues, "state-highlight", timeMs));
  const districtVisible = Boolean(activeCue(scene.cues, "district-highlight", timeMs));
  const meridianVisible = scene.cues.some((cue) => cue.layer === "longitude-line" && cue.startMs <= timeMs);
  const quizVisible = Boolean(activeCue(scene.cues, "quiz", timeMs));
  const cueText = currentCueText(scene.cues, timeMs);

  const boundaries = geometry.features
    .map((feature) => {
      const districtName = typeof feature.properties.districtName === "string" ? feature.properties.districtName.trim() : "";
      const isDistrict = districtVisible && feature.properties.stateName === "Uttar Pradesh" && districtName.toLocaleLowerCase("en-IN") === "mirzapur";
      const isState = stateVisible && feature.properties.stateName === "Uttar Pradesh";
      const fill = isDistrict ? "#FDE68A" : isState ? "#DCE7FF" : "#F8FAFC";
      const stroke = isDistrict ? "#92400E" : isState ? "#334155" : "#94A3B8";
      const strokeWidth = isDistrict ? "3.2" : isState ? "2.2" : "1.1";
      return `<path d="${areaPath(feature.geometry, projector)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" fill-rule="evenodd"/>`;
    })
    .join("");

  const meridian = meridianVisible
    ? scene.meridian.indiaSegments
        .map(
          (segment) =>
            `<path d="${linePath(segment, projector)}" fill="none" stroke="#B42318" stroke-width="7" stroke-linecap="round"/>`,
        )
        .join("")
    : "";
  const verifiedDistrictLine = districtVisible
    ? scene.districtOfInterest.meridianSegments
        .map(
          (segment) =>
            `<path d="${linePath(segment, projector)}" fill="none" stroke="#7C2D12" stroke-width="12" stroke-linecap="round"/>`,
        )
        .join("")
    : "";
  const districtLabel = districtVisible
    ? `<text x="540" y="1540" text-anchor="middle" font-size="54" font-weight="700" fill="#0F172A">Mirzapur district</text>`
    : "";
  const info = !quizVisible && cueText
    ? `<text x="540" y="1630" text-anchor="middle" font-size="34" font-weight="600" fill="#334155">${escapeXml(cueText)}</text>`
    : "";

  return svgShell(
    scene.viewport,
    scene.title,
    scene.meridian.editorialLabel,
    `${boundaries}${meridian}${verifiedDistrictLine}`,
    `${districtLabel}${info}${quizCard(scene.quiz, quizVisible)}`,
  );
}
