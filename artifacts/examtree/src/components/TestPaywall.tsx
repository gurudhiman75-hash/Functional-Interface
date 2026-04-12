import { useState } from "react";
import { useLocation } from "wouter";
import { CreditCard, LogIn, Lock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ApiError, getApiErrorCode } from "@/lib/api";
import { mockUnlockTest } from "@/lib/data";
import { openRazorpayCheckoutForTest } from "@/lib/razorpay-checkout";

type TestPaywallProps = {
  testId: string;
  testName: string;
  priceCents: number;
  reason: "login" | "payment";
};

export function TestPaywall({ testId, testName, priceCents, reason }: TestPaywallProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);

  const displayCurrency = import.meta.env.VITE_RAZORPAY_CURRENCY ?? "INR";
  const priceLabel = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: displayCurrency,
  }).format(priceCents / 100);

  async function onCheckout() {
    setBusy(true);
    try {
      await openRazorpayCheckoutForTest({
        testId,
        successPath: `/test/${testId}?checkout=success`,
        onPaid: async () => {
          await queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
          setLocation(`/test/${testId}?checkout=success`);
        },
        onError: (message) => console.error(message),
      });
    } catch (e) {
      if (
        import.meta.env.DEV &&
        e instanceof ApiError &&
        getApiErrorCode(e.body) === "RAZORPAY_NOT_CONFIGURED"
      ) {
        await mockUnlockTest(testId);
        await queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
        setLocation(`/test/${testId}`);
        return;
      }
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">{testName}</h1>
        {reason === "login" ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sign in to open this premium mock. Your progress and purchases stay on your account.
            </p>
            <Button className="mt-8 gap-2 rounded-xl" size="lg" onClick={() => setLocation("/login/student")}>
              <LogIn className="h-4 w-4" />
              Sign in to continue
            </Button>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              One-time unlock for this paper. After checkout you can start, resume, and retry anytime on this account.
            </p>
            <p className="mt-4 text-3xl font-bold tabular-nums text-foreground">{priceLabel}</p>
            <Button
              className="mt-8 gap-2 rounded-xl"
              size="lg"
              disabled={busy}
              onClick={() => void onCheckout()}
            >
              <CreditCard className="h-4 w-4" />
              {busy ? "Opening Razorpay…" : "Pay with Razorpay"}
            </Button>
            {import.meta.env.DEV ? (
              <Button
                type="button"
                variant="outline"
                className="mt-3 rounded-xl"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await mockUnlockTest(testId);
                    await queryClient.invalidateQueries({ queryKey: ["me", "entitlements"] });
                    setLocation(`/test/${testId}`);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Dev: unlock without Razorpay
              </Button>
            ) : null}
          </>
        )}
        <Button type="button" variant="ghost" className="mt-6 text-muted-foreground" onClick={() => setLocation("/exams")}>
          Back to exams
        </Button>
      </main>
    </div>
  );
}
