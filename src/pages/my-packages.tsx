import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { getUserPackages, UserPackage } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BookOpen, Check, Lock } from "lucide-react";

export default function MyPackagesPage() {
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPackages = async () => {
      try {
        setLoading(true);
        const data = await getUserPackages();
        setUserPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPackages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading your packages...</div>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Packages</h1>
          <p className="text-gray-600">Access your purchased test packages</p>
        </div>

        {userPackages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't purchased any packages yet</p>
              <Link href="/packages">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse Packages
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {userPackages.map((pkg) => (
              <Card key={pkg.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                      <p className="text-sm text-gray-600">
                        Purchased on{" "}
                        {new Date(pkg.purchasedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      ✓ Purchased
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Description */}
                  <p className="text-gray-700">{pkg.description}</p>

                  {/* Tests Grid */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Included Tests ({pkg.tests?.length || 0})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pkg.tests && pkg.tests.length > 0 ? (
                        pkg.tests.map((test) => (
                          <Link
                            key={test.testId}
                            href={`/test/${test.testId}`}
                            className="group"
                          >
                            <div className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                                    {test.testName}
                                  </h4>
                                  {test.isFree === 1 && (
                                    <Badge variant="outline" className="mt-2">
                                      Free
                                    </Badge>
                                  )}
                                </div>
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-2">No tests in this package</p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Package Benefits</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {pkg.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  {pkg.tests?.[0]?.testId ? (
                    <Link href={`/test/${pkg.tests[0].testId}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Start First Test
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-sm text-gray-500">No tests in this package</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
