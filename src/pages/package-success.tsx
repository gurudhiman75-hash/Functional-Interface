import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { getPackage, Package } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessParams {
  id: string;
}

export default function PackageSuccess() {
  const params = useParams<SuccessParams>();
  const [, setLocation] = useLocation();
  const packageId = params.id || "";

  const [pkg, setPkg] = useState<Package | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      if (packageId) {
        try {
          const data = await getPackage(packageId);
          setPkg(data);
        } catch (err) {
          console.error("Failed to fetch package:", err);
        }
      }
    };

    fetchPackage();
  }, [packageId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Purchase Successful! 🎉</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-700 mb-2">You have successfully purchased</p>
            <p className="text-xl font-bold text-gray-900">
              {pkg?.name || "the package"}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">What You Got</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Access to all included tests
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Unlimited test attempts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Detailed performance analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                Access to answer keys
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setLocation("/my-packages")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              View My Packages
            </Button>

            <Button
              onClick={() => setLocation("/tests")}
              variant="outline"
              className="w-full"
            >
              Browse All Tests
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            A confirmation email has been sent to your registered email address
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
