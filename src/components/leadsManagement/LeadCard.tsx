"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Smartphone,
  MapPin,
  User,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";
import { TLead } from "@/types";

interface LeadCardProps {
  lead: TLead;
  row?: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, row = false }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card
      className={`border-blue-200 hover:shadow-md transition-all duration-300 relative ${
        row
          ? "flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-4 hover:border-blue-300"
          : "h-full p-5 hover:border-blue-300"
      }`}
    >
      {/* Left: Avatar + Info */}
      <div
        className={`flex-1 flex ${
          row
            ? "flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            : "flex-col"
        }`}
      >
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>

        <div className="flex-1 flex flex-col justify-center gap-1">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
              {lead.name || "Unknown Lead"}
            </CardTitle>
            {row && (
              <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm">
                New
              </Badge>
            )}
          </div>

          <CardDescription className="flex items-center text-xs sm:text-sm text-gray-500 gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {formatDate(lead.createdAt)}
          </CardDescription>

          <div className="flex items-center text-xs sm:text-sm text-gray-600 gap-3 mt-1 flex-wrap">
            <div className="flex items-center gap-1">
              <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              {lead.mobile || "Not provided"}
            </div>
            <div className="flex items-center gap-1 max-w-[180px] sm:max-w-xs truncate">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              {lead.address || "Address not provided"}
            </div>
          </div>

          {lead.ebook?.title && (
            <div className="text-xs sm:text-sm text-gray-700 bg-blue-50 px-2 py-1 rounded-md mt-1 truncate max-w-full inline-block">
              Interested:{" "}
              <span className="font-medium">{lead.ebook.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0 flex-shrink-0">
        <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:mr-2">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{formatDate(lead.updatedAt)}</span>
        </div>

        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" className="gap-1">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Badge for Grid view */}
      {!row && (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 absolute top-3 right-3 text-xs"
        >
          New
        </Badge>
      )}
    </Card>
  );
};

export default LeadCard;
