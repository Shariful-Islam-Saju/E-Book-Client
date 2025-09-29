"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { Checkbox } from "../ui/checkbox";

interface LeadLoadingProps {
  rows?: number;
}

const LeadLoading: React.FC<LeadLoadingProps> = ({ rows = 6 }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-blue-200 bg-white shadow-md">
      <Table>
        <TableHeader className="bg-blue-50/80">
          <TableRow>
            <TableHead className="w-12 text-center">
              <Checkbox disabled />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-32" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-28" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="text-right">
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {[...Array(rows)].map((_, idx) => (
            <TableRow
              key={idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
            >
              <TableCell className="text-center">
                <Checkbox disabled />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-6 w-16 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadLoading;
