"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TReview } from "@/types";
import { useDeleteReviewMutation } from "@/redux/features/review/reviewApi";
import { toast } from "sonner";
import ConfirmationModal from "../ConfirmationModal";
import EditReviewModal from "./EditReviewModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Trash2, Edit2, User } from "lucide-react";
import Image from "next/image";

interface ReviewTableProps {
  reviews: TReview[];
}

const ReviewTable: React.FC<ReviewTableProps> = ({ reviews }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editReview, setEditReview] = useState<TReview | null>(null);
  const [deleteReview] = useDeleteReviewMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully");
      setDeleteId(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete review");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Review</TableHead>
              <TableHead className="text-center">Rating</TableHead>
              <TableHead className="text-center">Reviewer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <motion.tr
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Review Content */}
                    <TableCell className="align-top">
                      <div className="flex flex-col space-y-1 w-full">
                        {/* Stars */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Review Title */}
                        <p className="font-medium text-gray-900">
                          {review.title}
                        </p>

                        {/* Review Description */}
                        <p className="text-sm text-gray-500 break-words whitespace-pre-wrap w-full">
                          {review.description || "No description"}
                        </p>

                        {/* EBook Reference */}
                        {review.ebook && (
                          <p className="text-xs text-blue-600 break-words whitespace-pre-wrap">
                            EBook: {review.ebook.title}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Rating */}
                    <TableCell className="text-center">
                      <span className="font-semibold text-gray-900">
                        {review.rating} / 5
                      </span>
                    </TableCell>

                    {/* Reviewer Info */}
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-200 text-slate-800 font-medium text-sm overflow-hidden">
                          {review.profileImg || review.FacebookImg ? (
                            <Image
                              src={review.profileImg || review.FacebookImg}
                              alt={review.reviewBy}
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <span>
                              {review.reviewBy.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-800">
                          {review.reviewBy}
                        </p>
                        {review.mobile && (
                          <p className="text-xs text-gray-500">
                            {review.mobile}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditReview(review)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(review.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center text-gray-500"
                    >
                      <User className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No reviews found</p>
                      <p className="text-sm">
                        Add your first review to get started
                      </p>
                    </motion.div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />

      {/* Edit Review Modal */}
      {editReview && (
        <EditReviewModal
          isOpen={!!editReview}
          review={editReview}
          onClose={() => setEditReview(null)}
        />
      )}
    </>
  );
};

export default ReviewTable;
