"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateFileMutation } from "@/redux/features/file/fileApi";

interface FormValues {
  title: string;
  description: string;
  bookPrice: number;
  discount: number;
  pdf: FileList;
  img: FileList;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EBookCreateModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [createFile] = useCreateFileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    if (!data.pdf?.[0] || !data.img?.[0]) {
      toast.error("Please upload both a PDF and an image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdf", data.pdf[0]);
      formData.append("img", data.img[0]);
      formData.append(
        "data",
        JSON.stringify({
          title: data.title,
          description: data.description,
          bookPrice: Number(data.bookPrice),
          discount: Number(data.discount),
        })
      );

      await createFile(formData).unwrap();
      toast.success("EBook created successfully!");
      onClose();
      onSuccess();
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ebook.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="p-6"
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add New EBook
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                {/* Title */}
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Price & Discount */}
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-1">
                    <Label>Price (৳)</Label>
                    <Input
                      type="number"
                      {...register("bookPrice", {
                        required: "Price is required",
                        valueAsNumber: true,
                      })}
                    />
                    {errors.bookPrice && (
                      <p className="text-red-500 text-sm">
                        {errors.bookPrice.message}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2 space-y-1">
                    <Label>Discount (৳)</Label>
                    <Input
                      type="number"
                      {...register("discount", {
                        required: "Discount is required",
                        valueAsNumber: true,
                      })}
                    />
                    {errors.discount && (
                      <p className="text-red-500 text-sm">
                        {errors.discount.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* PDF Upload */}
                <div className="space-y-1">
                  <Label>Upload PDF</Label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    {...register("pdf", { required: "PDF file is required" })}
                  />
                  {errors.pdf && (
                    <p className="text-red-500 text-sm">{errors.pdf.message}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-1">
                  <Label>Upload Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    {...register("img", { required: "Image file is required" })}
                  />
                  {errors.img && (
                    <p className="text-red-500 text-sm">{errors.img.message}</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Create EBook"
                  )}
                </Button>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default EBookCreateModal;
