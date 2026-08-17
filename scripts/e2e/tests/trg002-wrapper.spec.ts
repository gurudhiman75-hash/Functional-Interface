import { Buffer } from "node:buffer";
import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";
const TEST_ID = "trg-002-wrapper-e2e";
const SESSION_ID = "trg002-wrapper-session";

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

const ql015DiagramPayload = {
  version: 1,
  qlId: "TRG-002-QL-015",
  diagram: {
    strategy: "SINGLE_DEPRESSION",
    width: 1000,
    height: 600,
    padding: 60,
    points: [
      { id: "observer-base", x: 420, y: 540, role: "OBJECT_BASE", label: "A" },
      { id: "observer-top", x: 420, y: 60, role: "OBSERVER_EYE", label: "E" },
      { id: "target-base", x: 580, y: 540, role: "OBJECT_BASE", label: "B" },
      { id: "target-top", x: 580, y: 220, role: "OBJECT_TOP", label: "T" },
      { id: "eye-level-obs-1", x: 580, y: 60, role: "AUXILIARY" },
      { id: "target-level-obs-1", x: 420, y: 220, role: "AUXILIARY" },
    ],
    segments: [
      { id: "ground-line", fromPointId: "observer-base", toPointId: "target-base", kind: "GROUND" },
      { id: "object-observer-building", fromPointId: "observer-base", toPointId: "observer-top", kind: "VERTICAL_OBJECT" },
      { id: "object-target-object", fromPointId: "target-base", toPointId: "target-top", kind: "VERTICAL_OBJECT" },
      { id: "sight-obs-1", fromPointId: "observer-top", toPointId: "target-top", kind: "SIGHT_LINE" },
      { id: "eye-level-segment-obs-1", fromPointId: "observer-top", toPointId: "eye-level-obs-1", kind: "EYE_LEVEL" },
      { id: "depression-drop-obs-1", fromPointId: "eye-level-obs-1", toPointId: "target-top", kind: "AUXILIARY" },
    ],
    angles: [
      {
        id: "angle-obs-1",
        vertexPointId: "observer-top",
        rayPointId: "target-top",
        referenceDirection: "RIGHT",
        classification: "DEPRESSION",
        label: "45°",
        arcLane: 0,
      },
    ],
    rightAngles: [
      { id: "right-angle-observer-building", vertexPointId: "observer-base", verticalRayPointId: "observer-top", horizontalDirection: "RIGHT" },
      { id: "right-angle-target-object", vertexPointId: "target-base", verticalRayPointId: "target-top", horizontalDirection: "LEFT" },
    ],
    measurementArrows: [
      {
        id: "height-arrow-observer-lower-obs-1",
        fromPointId: "observer-base",
        toPointId: "target-level-obs-1",
        label: "20 m",
        side: "LEFT",
        lane: 0,
        kind: "HEIGHT_PART",
      },
      {
        id: "height-arrow-observer-upper-obs-1",
        fromPointId: "target-level-obs-1",
        toPointId: "observer-top",
        label: "10 m",
        side: "LEFT",
        lane: 0,
        kind: "HEIGHT_DIFFERENCE",
      },
    ],
    labels: [
      { id: "label-observer-base", pointId: "observer-base", text: "A" },
      { id: "label-observer-top", pointId: "observer-top", text: "E" },
      { id: "label-target-base", pointId: "target-base", text: "B" },
      { id: "label-target-top", pointId: "target-top", text: "T" },
    ],
  },
  annotations: [
    {
      id: "given-observer-height",
      role: "GIVEN",
      fromPointId: "observer-base",
      toPointId: "observer-top",
      source: { kind: "OBJECT_HEIGHT", objectId: "observer-building" },
      placement: "RIGHT",
      label: "30 m",
    },
    {
      id: "given-horizontal",
      role: "GIVEN",
      fromPointId: "observer-base",
      toPointId: "target-base",
      source: { kind: "HORIZONTAL_DISTANCE", fromPointId: "observer-base", toPointId: "target-base" },
      placement: "BELOW",
      label: "10 m",
    },
    {
      id: "target-pole-height",
      role: "TARGET_SOLVED",
      fromPointId: "target-base",
      toPointId: "target-top",
      source: { kind: "ANSWER" },
      placement: "LEFT",
      symbol: "h",
      label: "h = 20 m",
    },
  ],
};

function encodeBase64Url(value: unknown) {
  return Buffer.from(JSON.stringify(value), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

const solutionDirective = `[[EXAMTREE_TRIG_HEIGHTS_SVG_V1:${encodeBase64Url(ql015DiagramPayload)}]]`;

const testDetail = {
  id: TEST_ID,
  name: "TRG-002 Wrapper Gate",
  category: "SSC",
  categoryName: "SSC",
  categoryId: "ssc",
  subcategoryId: "ssc-cgl",
  subcategoryName: "SSC CGL",
  access: "free",
  priceCents: null,
  kind: "topic-wise",
  duration: 10,
  totalQuestions: 1,
  attempts: 0,
  avgScore: 0,
  difficulty: "Medium",
  sectionTimingMode: "none",
  sectionTimings: [],
  sectionSettings: [],
  sections: [
    {
      id: "quant",
      name: "Quantitative Aptitude",
      questions: [
        {
          id: 15015,
          text: "From the top of a 30 m high building, the angle of depression of the top of a vertical pole is 45°. If the horizontal distance between the building and the pole is 10 m, what is the height of the pole?",
          options: ["10 m", "20 m", "30 m", "40 m"],
          correct: 1,
          section: "Quantitative Aptitude",
          explanation: `Core rule: At 45°, the vertical drop equals the horizontal distance.\n\n${solutionDirective}`,
        },
      ],
    },
  ],
  languages: ["en"],
  marksPerQuestion: 1,
  negativeMarks: 0,
  unattemptedMarks: 0,
};

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

async function installApiFixtures(page: Page) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === `/tests/${TEST_ID}` && method === "GET") return fulfillJson(route, testDetail);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/categories" || path === "/subcategories") return fulfillJson(route, []);
    if (path === "/users/me" && method === "GET") return fulfillJson(route, student);
    if (path === "/users" && method === "POST") return fulfillJson(route, student, 201);
    if (path === "/users/me/entitlements") return fulfillJson(route, { testIds: [] });
    if (path === "/billing/check-purchase") {
      return fulfillJson(route, { purchased: true, testId: TEST_ID, access: "free", priceCents: null });
    }
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);
    if (path === "/attempts" && method === "GET") return fulfillJson(route, []);

    if (path === "/attempt-sessions" && method === "POST") {
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision: 1,
        seriesId: null,
        updatedAt: "2026-08-16T11:40:00.000Z",
        state: null,
      }, 201);
    }
    if (path === `/attempt-sessions/${SESSION_ID}` && method === "PATCH") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      return fulfillJson(route, {
        id: SESSION_ID,
        testId: TEST_ID,
        revision: Number(payload.expectedRevision ?? 1) + 1,
        seriesId: null,
        updatedAt: "2026-08-16T11:41:00.000Z",
        state: payload.state ?? null,
      });
    }

    return fulfillJson(route, { error: `Unhandled TRG-002 E2E API route: ${method} ${path}` }, 404);
  });
}

async function seedStudentSession(page: Page) {
  await page.goto("/login/student");
  await page.evaluate(async ({ apiKey, token, profile }) => {
    localStorage.setItem("user", JSON.stringify(profile));

    const now = Date.now();
    const firebaseUser = {
      uid: profile.id,
      email: profile.email,
      emailVerified: true,
      displayName: profile.name,
      isAnonymous: false,
      providerData: [
        {
          providerId: "password",
          uid: profile.email,
          displayName: profile.name,
          email: profile.email,
          phoneNumber: null,
          photoURL: null,
        },
      ],
      stsTokenManager: {
        refreshToken: "examtree-e2e-refresh-token",
        accessToken: token,
        expirationTime: now + 60 * 60 * 1000,
      },
      createdAt: String(now - 60_000),
      lastLoginAt: String(now),
      apiKey,
      appName: "[DEFAULT]",
    };

    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("firebaseLocalStorageDb", 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains("firebaseLocalStorage")) {
          database.createObjectStore("firebaseLocalStorage", { keyPath: "fbase_key" });
        }
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const database = request.result;
        const transaction = database.transaction("firebaseLocalStorage", "readwrite");
        transaction.objectStore("firebaseLocalStorage").put({
          fbase_key: `firebase:authUser:${apiKey}:[DEFAULT]`,
          value: firebaseUser,
        });
        transaction.onerror = () => reject(transaction.error);
        transaction.oncomplete = () => {
          database.close();
          resolve();
        };
      };
    });
  }, { apiKey: FIREBASE_API_KEY, token: FIREBASE_TOKEN, profile: student });
}

test("TRG-002 solution diagram is disclosed only after Show Solution and preserves QL-015 geometry", async ({ page }) => {
  await installApiFixtures(page);
  await seedStudentSession(page);
  await page.goto(`/test/${TEST_ID}`);

  await page.getByRole("button", { name: "Practice" }).click();
  await page.getByRole("button", { name: "Start Test" }).click();

  const figure = page.getByTestId("trg002-solution-diagram");
  await expect(page.getByText("From the top of a 30 m high building", { exact: false })).toBeVisible();
  await expect(figure).toHaveCount(0);

  await page.getByRole("button", { name: /20 m/ }).click();
  const showSolution = page.getByRole("button", { name: "Show Solution" });
  await expect(showSolution).toBeVisible();
  await expect(figure).toHaveCount(0);

  await showSolution.click();
  await expect(figure).toBeVisible();
  await expect(figure).toHaveAttribute("data-ql-id", "TRG-002-QL-015");
  await expect(figure).toHaveAttribute("data-strategy", "SINGLE_DEPRESSION");

  const svg = figure.locator('svg[data-trg002-solution-svg="true"]');
  await expect(svg).toBeVisible();
  await expect(svg.locator('[data-segment-id^="depression-height-transfer-"]')).toHaveCount(0);
  await expect(svg.locator('[data-segment-id^="depression-drop-"]')).toHaveCount(1);
  await expect(svg.locator('[data-segment-id^="eye-level-segment-"]')).toHaveCount(1);
  await expect(svg.locator('[data-point-id="eye-level-obs-1"]')).toHaveCount(0);
  await expect(svg.locator('[data-point-id="target-level-obs-1"]')).toHaveCount(0);

  const arrows = svg.locator("line[data-measurement-arrow-id]");
  await expect(arrows).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    const arrow = arrows.nth(index);
    await expect(arrow).toHaveAttribute("marker-start", /url\(#trg002-dimension-/);
    await expect(arrow).toHaveAttribute("marker-end", /url\(#trg002-dimension-/);
  }

  const lowerSpan = svg.locator('[data-measurement-group-id="height-arrow-observer-lower-obs-1"]');
  const upperSpan = svg.locator('[data-measurement-group-id="height-arrow-observer-upper-obs-1"]');
  await expect(lowerSpan.getByText("20 m", { exact: true })).toBeVisible();
  await expect(upperSpan.getByText("10 m", { exact: true })).toBeVisible();

  const arrowXs = await arrows.evaluateAll((elements) =>
    elements.map((element) => Number(element.getAttribute("x1"))),
  );
  expect(arrowXs).toHaveLength(2);
  expect(arrowXs.every((x) => Number.isFinite(x) && x < 420)).toBeTruthy();

  const yPairs = await arrows.evaluateAll((elements) =>
    elements.map((element) => [Number(element.getAttribute("y1")), Number(element.getAttribute("y2"))]),
  );
  const sharedGap = Math.abs(yPairs[0][1] - yPairs[1][0]);
  expect(sharedGap).toBeGreaterThanOrEqual(10);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(figure).toBeVisible();
  const sizing = await figure.evaluate((element) => {
    const svgElement = element.querySelector("svg");
    if (!svgElement) return null;
    const figureRect = element.getBoundingClientRect();
    const svgRect = svgElement.getBoundingClientRect();
    return {
      figureWidth: figureRect.width,
      svgWidth: svgRect.width,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    };
  });
  expect(sizing).not.toBeNull();
  expect(sizing!.svgWidth).toBeLessThanOrEqual(sizing!.figureWidth + 1);
  expect(sizing!.scrollWidth).toBeLessThanOrEqual(sizing!.clientWidth + 1);
});
