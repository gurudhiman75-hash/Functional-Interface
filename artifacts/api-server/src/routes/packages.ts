import { Router, type IRouter } from "express";
import Razorpay from "razorpay";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { db } from "../lib/db";
import { packages, packageTests, tests, userPackages, userTestEntitlements } from "@workspace/db";
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

export default router;
