"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { useUpdateReviewMutation } from "@/redux/features/review/reviewApi";
import { toast } from "sonner";
import { TReview } from "@/types";

interface FormValues {
  title: string;
  description: string;
  rating: number;
  reviewBy: string;
  mobile?: string;
  profileImg?: FileList;
}

interface EditReviewModalProps {
  review: TReview;
  isOpen: boolean;
  onClose: () => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  const [updateReview, { isLoading }] = useUpdateReviewMutation();
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: review.title,
      description: review.description,
      rating: review.rating,
      reviewBy: review.reviewBy,
      mobile: review.mobile,
    },
  });

  const [previewImg, setPreviewImg] = useState<string | null>(
    review.profileImg || review.FacebookImg || null
  );
  const rating = watch("rating");

  const submitHandler = async (data: FormValues) => {
    try {
      const formData = new FormData();
      if (data.profileImg?.[0])
        formData.append("profileImg", data.profileImg[0]);

      formData.append(
        "data",
        JSON.stringify({
          title: data.title,
          description: data.description,
          rating: data.rating,
          reviewBy: data.reviewBy,
          mobile: data.mobile,
        })
      );
      await updateReview({ id: review.id, data: formData }).unwrap();
      toast.success("Review updated successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to update review.");
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreviewImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="  rounded-xl shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25 }}
              className="w-md"
            >
              <DialogHeader>
                <DialogTitle>Edit Review</DialogTitle>
                <DialogDescription>
                  Update reviewer info, rating, and upload new profile image if
                  needed.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-4 py-4"
              >
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Title</label>
                  <Input {...register("title", { required: true })} />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-sm font-medium ">Description</label>
                  <Textarea
                    {...register("description")}
                    className="min-h-[120px] max-h-[200px] overflow-y-auto resize-none"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 cursor-pointer ${
                          i < rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        onClick={() => setValue("rating", i + 1)}
                      />
                    ))}
                  </div>
                </div>

                {/* Reviewer Info */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Reviewer Name</label>
                  <Input {...register("reviewBy", { required: true })} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Mobile</label>
                  <Input {...register("mobile")} />
                </div>

                {/* Profile Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    {...register("profileImg")}
                    onChange={handleImageChange}
                  />
                  {previewImg ? (
                    <Image
                      src={previewImg}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded mt-2"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded bg-slate-200 flex items-center justify-center mt-2 font-medium text-lg">
                      {review.reviewBy.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <DialogFooter className="flex justify-end gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default EditReviewModal;
