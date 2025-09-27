"use client";

import React, { useState } from "react";
import { TEBook } from "@/types";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
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
import { useUpdateFileMutation } from "@/redux/features/file/fileApi";
import { toast } from "sonner";
import Image from "next/image";

interface FormValues {
  title: string;
  bookPrice: number;
  discount: number;
  description: string;
  imageFile: FileList;
  pdfFile: FileList;
}

interface EditEBookModalProps {
  ebook: TEBook;
  isOpen: boolean;
  onClose: () => void;
}

const EditEBookModal: React.FC<EditEBookModalProps> = ({
  ebook,
  isOpen,
  onClose,
}) => {
  const [updateFile, { isLoading }] = useUpdateFileMutation();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: ebook.title,
      bookPrice: ebook.bookPrice,
      discount: ebook.discount,
      description: ebook.description || "",
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewPDF, setPreviewPDF] = useState<string | null>(null);

  const submitHandler = async (data: FormValues) => {
    try {
      const formData = new FormData();
      if (data.imageFile?.[0]) formData.append("img", data.imageFile[0]);
      if (data.pdfFile?.[0]) formData.append("pdf", data.pdfFile[0]);

      formData.append(
        "data",
        JSON.stringify({
          title: data.title,
          description: data.description,
          bookPrice: Number(data.bookPrice),
          discount: Number(data.discount),
        })
      );

      await updateFile({ id: ebook.id, data: formData }).unwrap();
      toast.success("EBook updated successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to update ebook.");
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePDFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPreviewPDF(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="max-w-lg rounded-xl shadow-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25 }}
            >
              <DialogHeader>
                <DialogTitle>Edit EBook</DialogTitle>
                <DialogDescription>
                  Update ebook details and upload new PDF/image if needed.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-4 py-4"
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium">Title</label>
                  <Input {...register("title", { required: true })} />
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2 space-y-1">
                    <label className="text-sm font-medium">Price (৳)</label>
                    <Input
                      type="number"
                      {...register("bookPrice", {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="w-1/2 space-y-1">
                    <label className="text-sm font-medium">Discount (৳)</label>
                    <Input
                      type="number"
                      {...register("discount", {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea {...register("description")} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    {...register("imageFile")}
                    onChange={handleImageChange}
                  />
                  <Image
                    src={previewImage || ebook.imgUrl || ""}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded mt-2"
                    width={80}
                    height={80}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">PDF</label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    {...register("pdfFile")}
                    onChange={handlePDFChange}
                  />
                  {previewPDF ? (
                    <a
                      href={previewPDF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Preview selected PDF
                    </a>
                  ) : ebook.url ? (
                    <a
                      href={ebook.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View current PDF
                    </a>
                  ) : (
                    <p className="text-gray-400">No PDF uploaded</p>
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

export default EditEBookModal;
