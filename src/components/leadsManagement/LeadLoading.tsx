import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface LeadLoadingProps {
  viewMode: "grid" | "row";
}

const LeadLoading: React.FC<LeadLoadingProps> = ({ viewMode }) => {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex flex-col gap-4"
      }
    >
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="border-blue-200 shadow-sm">
          <CardHeader className={viewMode === "row" ? "pb-3" : ""}>
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent
            className={viewMode === "row" ? "space-y-2" : "space-y-3"}
          >
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-3 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeadLoading;
