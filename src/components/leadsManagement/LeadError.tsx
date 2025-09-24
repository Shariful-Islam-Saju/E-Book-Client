import React from "react";
import { Card, CardContent } from "../ui/card";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface LeadErrorProps {
  onRetry: () => void;
  errorMessage?: string;
}

const LeadError: React.FC<LeadErrorProps> = ({ onRetry, errorMessage }) => {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-lg">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="mb-5">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Error Loading Leads
          </h3>
          <p className="text-gray-600 mb-2">
            {errorMessage || "Failed to load leads data. Please try again."}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            If the problem persists, contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reload Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadError;
