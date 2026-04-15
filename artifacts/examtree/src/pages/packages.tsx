import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { getPackages, Package } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Lock, ShoppingCart } from "lucide-react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await getPackages();
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading packages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Packages</h1>
          <p className="text-gray-600">Bundle your favorite tests and save more</p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const savingsAmount = pkg.originalPriceCents && pkg.originalPriceCents > pkg.finalPriceCents ? pkg.originalPriceCents - pkg.finalPriceCents : 0;
            const savingsPercent = pkg.originalPriceCents
              ? ((savingsAmount / pkg.originalPriceCents) * 100).toFixed(0)
              : "0";

            return (
              <Card
                key={pkg.id}
                className={`${pkg.isPopular ? "ring-2 ring-blue-500 md:scale-105" : ""} flex flex-col`}
              >
                {/* Popular Badge */}
                {pkg.isPopular ? (
                  <div className="px-6 pt-4 pb-0">
                    <Badge className="bg-blue-100 text-blue-700">POPULAR</Badge>
                  </div>
                ) : null}

                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {/* Price Section */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{(pkg.finalPriceCents / 100).toFixed(0)}
                      </span>
                      {pkg.discountPercent > 0 && (
                        <>
                          <span className="text-lg text-gray-500 line-through">
                            ₹{(pkg.originalPriceCents / 100).toFixed(0)}
                          </span>
                          <Badge className="bg-green-100 text-green-700">
                            Save {savingsPercent}%
                          </Badge>
                        </>
                      )}
                    </div>
                    {pkg.discountPercent > 0 && (
                      <p className="text-sm text-green-600">
                        You save ₹{(savingsAmount / 100).toFixed(0)}
                      </p>
                    )}
                  </div>

                  {/* Tests List */}
                  <div className="mb-6 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-3">Included Tests</h3>
                    <ul className="space-y-2">
                      {pkg.tests && pkg.tests.length > 0 ? (
                        pkg.tests.map((test) => (
                          <li
                            key={test.testId}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <span>{test.testName}</span>
                              {test.isFree === 1 && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Free
                                </Badge>
                              )}
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No tests included</li>
                      )}
                    </ul>
                  </div>

                  {/* Features */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="mb-6 pb-6 border-t pt-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">Includes</h3>
                      <ul className="space-y-1">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                            <Check className="w-3 h-3 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link href={`/packages/${pkg.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Package
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No packages available at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}
