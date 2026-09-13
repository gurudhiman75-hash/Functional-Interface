import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { getPackage, createPackageOrder, verifyPackagePayment, Package } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, Check, Lock, Loader2, ShieldCheck, Star, Trophy, Zap } from "lucide-react";

const COMPARISON_ROWS = [
  { label: "Mock tests", free: "2–3 per category", paid: "Full series" },
  { label: "Section analytics", free: "Basic", paid: "Deep insights" },
  { label: "Weak area detection", free: "✗", paid: "✓" },
  { label: "Progress tracking", free: "Limited", paid: "Full history" },
  { label: "Leaderboard", free: "✓", paid: "✓" },
];
import { useToast } from "@/hooks/use-toast";
import { getFirebaseAuth } from "@/lib/firebase";

interface PaymentParams {
  id: string;
}

export default function PackageCheckout() {
  const params = useParams<PaymentParams>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const packageId = params.id || "";

  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const razorpayScriptPromiseRef = useRef<Promise<void> | null>(null);

  const loadRazorpayScript = (): Promise<void> => {
    if (!razorpayScriptPromiseRef.current) {
      razorpayScriptPromiseRef.current = new Promise((resolve, reject) => {
        const existingScript = document.getElementById("razorpay-sdk") as HTMLScriptElement | null;
        if (existingScript) {
          if ((existingScript as HTMLScriptElement).dataset.loaded === "true") {
            resolve();
            return;
          }

          existingScript.onload = () => {
            existingScript.dataset.loaded = "true";
            resolve();
          };
          existingScript.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
          return;
        }

        const script = document.createElement("script");
        script.id = "razorpay-sdk";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          script.dataset.loaded = "true";
          resolve();
        };
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.body.appendChild(script);
      });
    }

    return razorpayScriptPromiseRef.current;
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        if (packageId) {
          const data = await getPackage(packageId);
          setPkg(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load package");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);

      const auth = getFirebaseAuth();
      if (!auth?.currentUser) {
        toast({ title: "Please login to continue", variant: "destructive" });
        setProcessingPayment(false);
        setLocation("/login");
        return;
      }

      if (!pkg) {
        toast({ title: "Package not found", variant: "destructive" });
        setProcessingPayment(false);
        return;
      }

      const orderData = await createPackageOrder(packageId);
      await loadRazorpayScript();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ExamTree",
        description: `Purchase ${pkg.name}`,
        order_id: orderData.orderId,
        prefill: {
          email: auth.currentUser?.email || "",
          name: auth.currentUser?.displayName || "",
        },
        handler: async (response: any) => {
          try {
            const verifyResult = await verifyPackagePayment({
              packageId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResult.ok) {
              setProcessingPayment(false);
              setLocation(`/packages/success/${packageId}`);
            } else {
              setProcessingPayment(false);
              toast({
                title: "Payment verification failed",
                description: verifyResult.message,
                variant: "destructive",
              });
            }
          } catch (err) {
            setProcessingPayment(false);
            toast({
              title: "Payment verification failed",
              description: err instanceof Error ? err.message : "Unknown error",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
            toast({ title: "Payment cancelled" });
          },
        },
      };

      const rzp = (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      setProcessingPayment(false);
      toast({
        title: "Failed to initiate payment",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading package...</div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => setLocation("/packages")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mt-4">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-red-700">{error || "Package not found"}</span>
          </div>
        </div>
      </div>
    );
  }

  const savingsAmount = pkg.originalPriceCents - pkg.finalPriceCents;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => setLocation("/packages")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Packages
        </Button>

        {/* Main Card */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                {Boolean(pkg.isPopular) && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardTitle className="text-3xl">{pkg.name}</CardTitle>
                <p className="text-muted-foreground mt-2">{pkg.description}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">

            {/* Value statement */}
            {(() => {
              const testCount = pkg.tests?.length ?? pkg.testCount ?? 0;
              const perTestPrice = testCount > 0
                ? (pkg.finalPriceCents / testCount / 100).toFixed(0)
                : null;
              return testCount > 0 ? (
                <div className="rounded-xl bg-primary/5 border border-primary/15 px-5 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    <p className="font-bold text-primary text-lg">
                      {testCount} test{testCount !== 1 ? "s" : ""} for ₹{(pkg.finalPriceCents / 100).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {perTestPrice && (
                    <p className="text-sm text-muted-foreground">
                      Just ₹{perTestPrice} per test — less than a coffee
                    </p>
                  )}
                </div>
              ) : null;
            })()}

            {/* Free vs Package mini comparison */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                What you unlock
              </h3>
              <div className="rounded-xl border border-border/70 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/60">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Feature</th>
                      <th className="px-4 py-2.5 text-center font-medium text-muted-foreground">
                        <span className="flex items-center justify-center gap-1"><Lock className="w-3 h-3" />Free</span>
                      </th>
                      <th className="px-4 py-2.5 text-center font-semibold text-primary">
                        <span className="flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" />This package</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr key={row.label} className={`border-b border-border/40 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                        <td className="px-4 py-2.5 font-medium text-foreground">{row.label}</td>
                        <td className="px-4 py-2.5 text-center text-muted-foreground">{row.free}</td>
                        <td className="px-4 py-2.5 text-center font-semibold text-emerald-600 dark:text-emerald-400">{row.paid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Package Details */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Included Tests ({pkg.tests?.length ?? 0})</h3>
              <ul className="space-y-2">
                {pkg.tests && pkg.tests.length > 0 ? (
                  pkg.tests.map((test) => (
                    <li
                      key={test.testId}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{test.testName}</p>
                        {test.isFree === 1 && (
                          <Badge variant="outline" className="mt-1">
                            Free with Package
                          </Badge>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No tests included</p>
                )}
              </ul>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Original Price</span>
                <span className={`font-medium text-gray-900 ${pkg.discountPercent > 0 ? "line-through" : ""}`}>
                  ₹{(pkg.originalPriceCents / 100).toFixed(0)}
                </span>
              </div>

              {pkg.discountPercent > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Discount ({pkg.discountPercent}%)</span>
                    <span className="font-medium text-green-600">
                      -₹{(savingsAmount / 100).toFixed(0)}
                    </span>
                  </div>
                </>
              )}

              <div className="border-t pt-3 flex items-center justify-between">
                <span className="font-semibold text-gray-900">You Pay</span>
                <span className="text-3xl font-bold text-blue-600">
                  ₹{(pkg.finalPriceCents / 100).toFixed(0)}
                </span>
              </div>
            </div>

            {/* Features List */}
            {pkg.features && pkg.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Includes</h3>
                <ul className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Payment Button */}
            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                disabled={processingPayment}
                className="w-full py-6 text-lg gap-2 shadow-md"
                size="lg"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Unlock all tests — ₹{(pkg.finalPriceCents / 100).toLocaleString("en-IN")}
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" />Secure payment</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary" />Instant access</span>
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-500" />All tests included</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
