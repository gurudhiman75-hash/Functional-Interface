import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { getPackage, createPackageOrder, verifyPackagePayment, Package } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, Check, Loader2 } from "lucide-react";
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
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">{pkg.name}</CardTitle>
                <p className="text-gray-600 mt-2">{pkg.description}</p>
              </div>
              {pkg.isPopular ? (
                <Badge className="bg-blue-100 text-blue-700">POPULAR</Badge>
              ) : null}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Package Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Package Contents</h3>
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
            <Button
              onClick={handlePayment}
              disabled={processingPayment}
              className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {processingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${(pkg.finalPriceCents / 100).toFixed(0)} Now`
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              You will be redirected to Razorpay for a secure payment
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
