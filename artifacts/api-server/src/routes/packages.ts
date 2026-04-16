import { Router, type IRouter } from "express";
import Razorpay from "razorpay";
import { randomUUID } from "crypto";
import { eq, and, inArray } from "drizzle-orm";
import { db } from "../lib/db";
import { packages, packageTests, tests, userPackages, userTestEntitlements, users } from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { paymentRateLimit } from "../middlewares/rateLimit";
import { getRazorpayCurrency, verifyPaymentSignature } from "../lib/razorpay-billing";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// GET /api/packages - Get all available packages
router.get("/", async (req, res) => {
  try {
    const allPackages = await db
      .select()
      .from(packages)
      .orderBy(packages.order);

    // For each package, get the tests
    const packagesWithTests = await Promise.all(
      allPackages.map(async (pkg) => {
        const pkgTests = await db
          .select({
            testId: packageTests.testId,
            isFree: packageTests.isFree,
            testName: tests.name,
            access: tests.access,
          })
          .from(packageTests)
          .leftJoin(tests, eq(packageTests.testId, tests.id))
          .where(eq(packageTests.packageId, pkg.id));

        return {
          ...pkg,
          tests: pkgTests,
        };
      })
    );

    return res.json(packagesWithTests);
  } catch (error) {
    logger.error({ error }, "Failed to fetch packages");
    return res.status(500).json({ error: "Failed to fetch packages" });
  }
});

// GET /api/packages/user/my-packages - Get user's purchased packages
router.get("/user/my-packages", authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;

    const userPkgs = await db
      .select()
      .from(userPackages)
      .where(eq(userPackages.userId, userId));

    // Get package details and tests for each purchased package
    const userPackagesWithDetails = await Promise.all(
      userPkgs.map(async (up) => {
        const pkg = await db
          .select()
          .from(packages)
          .where(eq(packages.id, up.packageId))
          .limit(1);

        if (pkg.length === 0) return null;

        const pkgTests = await db
          .select({
            testId: packageTests.testId,
            isFree: packageTests.isFree,
            testName: tests.name,
            access: tests.access,
          })
          .from(packageTests)
          .leftJoin(tests, eq(packageTests.testId, tests.id))
          .where(eq(packageTests.packageId, up.packageId));

        return {
          ...pkg[0],
          purchasedAt: up.purchasedAt,
          tests: pkgTests,
        };
      })
    );

    const result = userPackagesWithDetails.filter((p) => p !== null);

    logger.info({
      userId,
      packageCount: result.length,
      action: "my_packages_fetched",
    });

    return res.json(result);
  } catch (error) {
    logger.error({ error }, "Failed to fetch user packages");
    return res.status(500).json({ error: "Failed to fetch your packages" });
  }
});

// GET /api/packages/by-test/:testId - Find packages containing a specific test (public)
router.get("/by-test/:testId", async (req, res) => {
  try {
    const testId = req.params.testId;

    const rows = await db
      .select({
        id: packages.id,
        name: packages.name,
        description: packages.description,
        finalPriceCents: packages.finalPriceCents,
        originalPriceCents: packages.originalPriceCents,
        discountPercent: packages.discountPercent,
        isPopular: packages.isPopular,
      })
      .from(packages)
      .innerJoin(packageTests, eq(packageTests.packageId, packages.id))
      .where(eq(packageTests.testId, testId))
      .orderBy(packages.order);

    return res.json(rows);
  } catch (error) {
    logger.error({ error }, "Failed to fetch packages by test");
    return res.status(500).json({ error: "Failed to fetch packages for this test" });
  }
});

// GET /api/packages/by-exam/:examId - Get packages containing tests from a given exam/subcategory
router.get("/by-exam/:examId", async (req, res) => {
  try {
    const { examId } = req.params;

    // examId is either "general-{categoryId}" or a subcategoryId
    const isGeneral = examId.startsWith("general-");
    const categoryId = isGeneral ? examId.slice("general-".length) : null;

    // Find test IDs belonging to this exam
    const examTests = await db
      .select({ id: tests.id })
      .from(tests)
      .where(
        isGeneral
          ? and(eq(tests.categoryId, categoryId!), eq(tests.subcategoryId, ""))
          : eq(tests.subcategoryId, examId)
      );

    if (examTests.length === 0) return res.json([]);

    const examTestIds = examTests.map((t) => t.id);

    // Find packages that contain any of these tests
    const rows = await db
      .select({
        id: packages.id,
        name: packages.name,
        finalPriceCents: packages.finalPriceCents,
        originalPriceCents: packages.originalPriceCents,
        discountPercent: packages.discountPercent,
        order: packages.order,
      })
      .from(packages)
      .innerJoin(packageTests, eq(packageTests.packageId, packages.id))
      .where(inArray(packageTests.testId, examTestIds))
      .groupBy(packages.id)
      .orderBy(packages.order);

    // Attach testIds for each returned package (only those belonging to this exam)
    const result = await Promise.all(
      rows.map(async (pkg) => {
        const pkgTestIds = await db
          .select({ testId: packageTests.testId })
          .from(packageTests)
          .where(and(eq(packageTests.packageId, pkg.id), inArray(packageTests.testId, examTestIds)));
        return { ...pkg, testIds: pkgTestIds.map((r) => r.testId) };
      })
    );

    return res.json(result);
  } catch (error) {
    logger.error({ error }, "Failed to fetch packages by exam");
    return res.status(500).json({ error: "Failed to fetch packages for this exam" });
  }
});

// GET /api/packages/:id - Get single package with tests
router.get("/:id", async (req, res) => {
  try {
    const packageId = req.params.id;

    const pkgs = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);

    if (pkgs.length === 0) {
      return res.status(404).json({ error: "Package not found" });
    }

    const pkg = pkgs[0];

    const pkgTests = await db
      .select({
        testId: packageTests.testId,
        isFree: packageTests.isFree,
        testName: tests.name,
        access: tests.access,
      })
      .from(packageTests)
      .leftJoin(tests, eq(packageTests.testId, tests.id))
      .where(eq(packageTests.packageId, packageId));

    return res.json({
      ...pkg,
      tests: pkgTests,
    });
  } catch (error) {
    logger.error({ error }, "Failed to fetch package");
    return res.status(500).json({ error: "Failed to fetch package" });
  }
});

// POST /api/packages/create-order - Create Razorpay order for package
router.post("/create-order", authenticate, paymentRateLimit, async (req, res) => {
  const rz = getRazorpay();
  if (!rz) {
    return res.status(503).json({
      error: "Razorpay is not configured",
      code: "RAZORPAY_NOT_CONFIGURED",
    });
  }

  const userId = req.user!.id;
  const packageId = typeof req.body?.packageId === "string" ? req.body.packageId : "";

  if (!packageId) {
    return res.status(400).json({ error: "packageId is required" });
  }

  try {
    // Get package
    const pkgs = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);

    if (pkgs.length === 0) {
      return res.status(404).json({ error: "Package not found" });
    }

    const pkg = pkgs[0];

    // Check if user already owns this package
    const existing = await db
      .select()
      .from(userPackages)
      .where(
        and(
          eq(userPackages.userId, userId),
          eq(userPackages.packageId, packageId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return res.status(400).json({ error: "You already own this package" });
    }

    const amount = pkg.finalPriceCents;
    const currency = getRazorpayCurrency();

    const order = await rz.orders.create({
      amount,
      currency,
      receipt: `p_${packageId}_${userId}`.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 40),
      notes: {
        userId,
        packageId,
        type: "package",
      },
    });

    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      return res.status(500).json({ error: "RAZORPAY_KEY_ID missing" });
    }

    logger.info({
      userId,
      packageId,
      orderId: order.id,
      amount,
      action: "package_order_created",
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      packageName: pkg.name,
      packageId,
    });
  } catch (err) {
    logger.error({ userId, packageId, error: err }, "Failed to create package order");
    return res.status(500).json({ error: "Could not create payment order" });
  }
});

// POST /api/packages/verify - Verify package payment
router.post("/verify", authenticate, paymentRateLimit, async (req, res) => {
  const userId = req.user!.id;
  const packageId = typeof req.body?.packageId === "string" ? req.body.packageId : "";
  const orderId = typeof req.body?.razorpay_order_id === "string" ? req.body.razorpay_order_id : "";
  const paymentId = typeof req.body?.razorpay_payment_id === "string" ? req.body.razorpay_payment_id : "";
  const signature = typeof req.body?.razorpay_signature === "string" ? req.body.razorpay_signature : "";

  logger.info({
    userId,
    packageId,
    orderId,
    paymentId,
    action: "package_payment_verification_started",
  });

  if (!packageId || !orderId || !paymentId || !signature) {
    return res.status(400).json({ error: "packageId, razorpay_order_id, razorpay_payment_id, and razorpay_signature are required" });
  }

  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    logger.warn({
      userId,
      packageId,
      orderId,
      error: "invalid_payment_signature",
    });
    return res.status(400).json({ error: "Invalid payment signature" });
  }

  const rz = getRazorpay();
  if (!rz) {
    return res.status(503).json({ error: "Razorpay is not configured" });
  }

  try {
    const order = await rz.orders.fetch(orderId);
    const notes = order.notes as Record<string, string> | undefined;

    // Verify order ownership
    if (!notes?.userId || !notes?.packageId) {
      return res.status(400).json({ error: "Order metadata is incomplete" });
    }

    if (notes.userId !== userId) {
      logger.warn({
        userId,
        packageId,
        orderId,
        error: "order_ownership_mismatch",
      });
      return res.status(403).json({ error: "Order does not belong to this account" });
    }

    if (notes.packageId !== packageId) {
      logger.warn({
        userId,
        packageId,
        orderId,
        error: "order_package_mismatch",
      });
      return res.status(403).json({ error: "Order does not match the requested package" });
    }

    // Verify amount
    const pkgs = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);

    if (pkgs.length === 0) {
      return res.status(404).json({ error: "Package not found" });
    }

    const pkg = pkgs[0];
    if (order.amount !== pkg.finalPriceCents) {
      logger.warn({
        userId,
        packageId,
        orderId,
        orderAmount: order.amount,
        expectedAmount: pkg.finalPriceCents,
        error: "amount_mismatch",
      });
      return res.status(400).json({ error: "Payment amount does not match package price" });
    }

    await db.transaction(async (tx) => {
      const userPkgId = randomUUID();

      await tx
        .insert(userPackages)
        .values({
          id: userPkgId,
          userId,
          packageId,
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
        })
        .onConflictDoNothing();

      const pkgTests = await tx
        .select({
          testId: packageTests.testId,
          isFree: packageTests.isFree,
        })
        .from(packageTests)
        .where(eq(packageTests.packageId, packageId));

      for (const pt of pkgTests) {
        if (pt.isFree === 0) {
          await tx
            .insert(userTestEntitlements)
            .values({
              userId,
              testId: pt.testId,
              source: "razorpay",
              razorpayOrderId: orderId,
              razorpayPaymentId: paymentId,
            })
            .onConflictDoNothing();
        }
      }
    });

    logger.info({
      userId,
      packageId,
      orderId,
      paymentId,
      action: "package_payment_verified_and_entitlements_granted",
    });

    return res.json({ ok: true, message: "Package purchased successfully" });
  } catch (error) {
    logger.error({ userId, packageId, error }, "Package payment verification failed");
    return res.status(500).json({ error: "Payment verification failed" });
  }
});

function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

async function assertAdmin(userId: string) {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (rows.length === 0 || rows[0].role !== "admin") {
    throw new Error("forbidden");
  }
}

// POST /api/packages - Admin: create a package with test mappings
router.post("/", authenticate, async (req, res) => {
  try {
    await assertAdmin(req.user!.id);
  } catch {
    return res.status(403).json({ error: "Admin access required" });
  }

  const {
    name,
    description,
    originalPriceCents,
    discountPercent,
    finalPriceCents,
    testIds,
    features,
    isPopular,
    order: displayOrder,
  } = req.body as {
    name?: string;
    description?: string;
    originalPriceCents?: number;
    discountPercent?: number;
    finalPriceCents?: number;
    testIds?: string[];
    features?: string[];
    isPopular?: number;
    order?: number;
  };

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  if (!description || typeof description !== "string") {
    return res.status(400).json({ error: "description is required" });
  }
  if (typeof originalPriceCents !== "number" || originalPriceCents < 0) {
    return res.status(400).json({ error: "originalPriceCents must be a non-negative number" });
  }
  if (typeof finalPriceCents !== "number" || finalPriceCents < 0) {
    return res.status(400).json({ error: "finalPriceCents must be a non-negative number" });
  }
  if (!Array.isArray(testIds) || testIds.length === 0) {
    return res.status(400).json({ error: "testIds must be a non-empty array" });
  }
  for (const tid of testIds) {
    if (typeof tid !== "string" || !tid.trim()) {
      return res.status(400).json({ error: "each testId must be a non-empty string" });
    }
  }

  try {
    const packageId = randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(packages).values({
        id: packageId,
        name: name.trim(),
        description: description.trim(),
        originalPriceCents,
        discountPercent: typeof discountPercent === "number" ? discountPercent : 0,
        finalPriceCents,
        testCount: testIds.length,
        features: features ?? null,
        isPopular: isPopular ?? 0,
        order: typeof displayOrder === "number" ? displayOrder : 0,
      });

      for (const testId of testIds) {
        await tx.insert(packageTests).values({
          id: randomUUID(),
          packageId,
          testId: testId.trim(),
          isFree: 0,
        }).onConflictDoNothing();
      }
    });

    logger.info({ packageId, name, testCount: testIds.length, action: "package_created" });

    const created = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);

    return res.status(201).json(created[0]);
  } catch (error) {
    logger.error({ error }, "Failed to create package");
    return res.status(500).json({ error: "Failed to create package" });
  }
});

export default router;
