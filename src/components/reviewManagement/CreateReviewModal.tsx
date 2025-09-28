"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { useGetAllFilesQuery } from "@/redux/features/file/fileApi";
import Image from "next/image";

interface FormValues {
  title: string;
  description: string;
  rating: number;
  reviewBy: string;
  mobile?: string;
  profileImg?: FileList;
  ebookId?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateReviewModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const [createReview] = useCreateReviewMutation();
  const {
    data: files,
    isLoading: filesLoading,
    isError,
  } = useGetAllFilesQuery();

  const { register, handleSubmit, setValue, watch, reset } =
    useForm<FormValues>({
      defaultValues: { rating: 0 },
    });

  const rating = watch("rating");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreviewImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (data.profileImg?.[0]) {
        formData.append("profileImg", data.profileImg[0]);
      }

      formData.append(
        "data",
        JSON.stringify({
          title: data.title,
          description: data.description,
          rating: data.rating,
          reviewBy: data.reviewBy,
          mobile: data.mobile,
          ebookId: data.ebookId,
        })
      );

      await createReview(formData).unwrap();
      toast.success("Review created successfully!");
      onClose();
      onSuccess();
      reset();
      setPreviewImg(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="p-6 w-md"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add New Review
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                {/* Title */}
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input {...register("title", { required: true })} />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    {...register("description", { required: true })}
                    className="min-h-[120px] max-h-[200px] overflow-y-auto resize-none"
                  />
                </div>

                {/* Reviewer Name */}
                <div className="space-y-1">
                  <Label>Reviewer Name</Label>
                  <Input {...register("reviewBy", { required: true })} />
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                  <Label>Mobile</Label>
                  <Input {...register("mobile")} />
                </div>

                {/* Rating */}
                <div className="space-y-1">
                  <Label>Rating</Label>
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

                {/* Select Book */}
                <div className="space-y-1">
                  <Label>Select Book</Label>
                  <Select onValueChange={(val) => setValue("ebookId", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {filesLoading && (
                        <p className="p-2 text-sm">Loading...</p>
                      )}
                      {isError && (
                        <p className="p-2 text-sm text-red-500">
                          Failed to load files
                        </p>
                      )}
                      {files?.data?.map((file: { id: string; title: string }) => (
                        <SelectItem key={file.id} value={file.id}>
                          {file.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Profile Image */}
                <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    {...register("profileImg")}
                    onChange={handleImageChange}
                  />
                  {previewImg && (
                    <Image
                      src={previewImg}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded mt-2"
                      width={200}
                      height={200}
                    />
                  )}
                </div>

                {/* Submit */}
                <DialogFooter className="flex justify-end gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Create Review"
                    )}
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

export default CreateReviewModal;
