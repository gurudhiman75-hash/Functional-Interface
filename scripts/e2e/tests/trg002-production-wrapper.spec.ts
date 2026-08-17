import { Buffer } from "node:buffer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { expect, test, type Page, type Route } from "@playwright/test";

const FIREBASE_API_KEY = "examtree-e2e-api-key";
const FIREBASE_TOKEN = "examtree-e2e-access-token";

const reviewPath = resolve(
  process.cwd(),
  "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/production-expansion-48/TRG-002-PHASE8-48-EDITORIAL-REVIEW.json",
);

const visualEvidenceDir = resolve(process.cwd(), "test-results/trg002-production-visual");
mkdirSync(visualEvidenceDir, { recursive: true });

const reviewRows = JSON.parse(readFileSync(reviewPath, "utf8")) as Array<any>;
const rowById = new Map(reviewRows.map((row) => [row.qlId, row]));

const REPRESENTATIVE_QL_IDS = [
  "TRG-002-QL-003",
  "TRG-002-QL-016",
  "TRG-002-QL-026",
  "TRG-002-QL-039",
  "TRG-002-QL-042",
  "TRG-002-QL-046",
  "TRG-002-QL-050",
  "TRG-002-QL-057",
  "TRG-002-QL-062",
  "TRG-002-QL-070",
  "TRG-002-QL-074",
  "TRG-002-QL-080",
  "TRG-002-QL-089",
  "TRG-002-QL-093",
] as const;

const representatives = REPRESENTATIVE_QL_IDS.map((qlId) => {
  const row = rowById.get(qlId);
  if (!row) throw new Error(`Missing Phase-8 editorial review row for ${qlId}.`);
  return row;
});

if (new Set(representatives.map((row) => row.solutionDiagramStrategy)).size < 12) {
  throw new Error("TRG-002 Phase-8 browser representatives must cover at least 12 distinct solution-diagram strategies.");
}

const student = {
  id: "e2e-student",
  email: "student.e2e@examtree.local",
  name: "E2E Student",
  role: "student" as const,
};

function encodeBase64Url(value: unknown) {
  return Buffer.from(JSON.stringify(value), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function solutionDirective(record: any) {
  const payload = {
    version: 1,
    qlId: record.qlId,
    diagram: record.solutionDiagram,
    annotations: record.solutionAnnotations ?? [],
  };
  return `[[EXAMTREE_TRIG_HEIGHTS_SVG_V1:${encodeBase64Url(payload)}]]`;
}

function testDetailFor(record: any) {
  const correctIndex = record.options.findIndex((option: any) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${record.qlId}: correct option missing from browser fixture.`);
  return {
    id: `trg-002-production-${record.qlId.toLowerCase()}`,
    name: `TRG-002 Production Wrapper ${record.qlId}`,
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
    difficulty: record.difficulty,
    sectionTimingMode: "none",
    sectionTimings: [],
    sectionSettings: [],
    sections: [
      {
        id: "quant",
        name: "Quantitative Aptitude",
        questions: [
          {
            id: 200000 + Number(record.qlId.slice(-3)),
            text: record.stem,
            options: record.options.map((option: any) => option.display),
            correct: correctIndex,
            section: "Quantitative Aptitude",
            explanation: `${record.explanation.keyRule}\n\n${solutionDirective(record)}`,
          },
        ],
      },
    ],
    languages: ["en"],
    marksPerQuestion: 1,
    negativeMarks: 0,
    unattemptedMarks: 0,
  };
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function installApiFixtures(page: Page, record: any) {
  const detail = testDetailFor(record);
  const testId = detail.id;
  const sessionId = `trg002-production-session-${record.qlId.toLowerCase()}`;

  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = request.method();

    if (path === `/tests/${testId}` && method === "GET") return fulfillJson(route, detail);
    if (path === "/tests" && method === "GET") return fulfillJson(route, []);
    if (path === "/categories" || path === "/subcategories") return fulfillJson(route, []);
    if (path === "/users/me" && method === "GET") return fulfillJson(route, student);
    if (path === "/users" && method === "POST") return fulfillJson(route, student, 201);
    if (path === "/users/me/entitlements") return fulfillJson(route, { testIds: [] });
    if (path === "/billing/check-purchase") return fulfillJson(route, { purchased: true, testId, access: "free", priceCents: null });
    if (path.includes("packages") || path.includes("bundles")) return fulfillJson(route, []);
    if (path === "/attempts" && method === "GET") return fulfillJson(route, []);

    if (path === "/attempt-sessions" && method === "POST") {
      return fulfillJson(route, {
        id: sessionId,
        testId,
        revision: 1,
        seriesId: null,
        updatedAt: "2026-08-17T03:00:00.000Z",
        state: null,
      }, 201);
    }
    if (path === `/attempt-sessions/${sessionId}` && method === "PATCH") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      return fulfillJson(route, {
        id: sessionId,
        testId,
        revision: Number(payload.expectedRevision ?? 1) + 1,
        seriesId: null,
        updatedAt: "2026-08-17T03:01:00.000Z",
        state: payload.state ?? null,
      });
    }

    return fulfillJson(route, { error: `Unhandled TRG-002 production E2E API route: ${method} ${path}` }, 404);
  });

  return { detail, testId };
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
      providerData: [{
        providerId: "password",
        uid: profile.email,
        displayName: profile.name,
        email: profile.email,
        phoneNumber: null,
        photoURL: null,
      }],
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

    await new Promise<void>((resolvePromise, reject) => {
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
          resolvePromise();
        };
      };
    });
  }, { apiKey: FIREBASE_API_KEY, token: FIREBASE_TOKEN, profile: student });
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test.describe("TRG-002 Phase-8 representative real ExamTree visual gate", () => {
  for (const record of representatives) {
    test(`${record.qlId} renders ${record.solutionDiagramStrategy} after Show Solution`, async ({ page }) => {
      const { testId } = await installApiFixtures(page, record);
      await seedStudentSession(page);
      await page.goto(`/test/${testId}`);

      await page.getByRole("button", { name: "Practice" }).click();
      await page.getByRole("button", { name: "Start Test" }).click();

      const figure = page.getByTestId("trg002-solution-diagram");
      await expect(page.getByText(record.stem.slice(0, 45), { exact: false })).toBeVisible();
      await expect(figure).toHaveCount(0);

      const correctOption = record.options.find((option: any) => option.isCorrect);
      await page.getByRole("button", { name: new RegExp(escapeRegex(correctOption.display)) }).click();
      const showSolution = page.getByRole("button", { name: "Show Solution" });
      await expect(showSolution).toBeVisible();
      await expect(figure).toHaveCount(0);

      await showSolution.click();
      await expect(figure).toBeVisible();
      await expect(figure).toHaveAttribute("data-ql-id", record.qlId);
      await expect(figure).toHaveAttribute("data-strategy", record.solutionDiagramStrategy);

      const svg = figure.locator('svg[data-trg002-solution-svg="true"]');
      await expect(svg).toBeVisible();
      const desktopBox = await svg.boundingBox();
      expect(desktopBox).not.toBeNull();
      expect(desktopBox!.width).toBeGreaterThan(100);
      expect(desktopBox!.height).toBeGreaterThan(100);

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

      const screenshotPath = join(visualEvidenceDir, `${record.qlId}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      writeFileSync(
        join(visualEvidenceDir, `${record.qlId}.json`),
        JSON.stringify({
          qlId: record.qlId,
          cpId: record.cpId,
          strategy: record.solutionDiagramStrategy,
          sourceSeed: record.seed,
          viewport: { width: 390, height: 844 },
          realExamTreeRoute: `/test/${testId}`,
          disclosure: "AFTER_SHOW_SOLUTION",
          automatedBrowserRender: "PASS",
          humanVisualReview: "PENDING",
        }, null, 2),
        "utf8",
      );
    });
  }
});
