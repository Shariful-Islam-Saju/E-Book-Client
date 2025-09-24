import React from "react";
import { useGetAllLeadQuery } from "@/redux/features/lead/leadApi";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Smartphone,
  Globe,
  MapPin,
  BookOpen,
  RefreshCw,
  User,
  Clock,
} from "lucide-react";

const LeadsPage = () => {
  const {
    data: leadsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllLeadQuery('');

  const leads = leadsResponse?.data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">
              <Globe className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Leads
            </h3>
            <p className="text-gray-600 mb-4">
              Failed to load leads data. Please try again.
            </p>
            <Button
              onClick={refetch}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Leads Management
          </h1>
          <p className="text-lg text-gray-600">
            Track and manage all your leads in one place
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {leads.length}
                    </p>
                    <p className="text-gray-600">Total Leads</p>
                  </div>
                </div>
                <Button
                  onClick={refetch}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leads Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-emerald-200">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {leads.length === 0 ? (
              <motion.div variants={itemVariants} className="col-span-full">
                <Card className="text-center border-emerald-200">
                  <CardContent className="p-12">
                    <BookOpen className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Leads Found
                    </h3>
                    <p className="text-gray-600">
                      Start collecting leads to see them appear here.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              leads.map((lead) => (
                <motion.div
                  key={lead.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="border-emerald-200 hover:shadow-lg transition-shadow duration-300 h-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {lead.name}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-800"
                        >
                          Lead
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(lead.createdAt)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {/* Contact Info */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Smartphone className="w-4 h-4 mr-2 text-emerald-600" />
                        <span>{lead.mobile}</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                        <span className="line-clamp-1">
                          {lead.address || "Address not provided"}
                        </span>
                      </div>

                      {/* Ebook Info */}
                      {lead.ebook && (
                        <div className="pt-2 border-t border-emerald-100">
                          <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                            <BookOpen className="w-4 h-4 mr-2 text-emerald-600" />
                            Downloaded Ebook
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {lead.ebook.title}
                          </p>
                        </div>
                      )}

                      {/* Technical Info */}
                      <div className="pt-2 border-t border-emerald-100">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <div className="flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            <span>IP: {lead.ip}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Updated: {formatDate(lead.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
