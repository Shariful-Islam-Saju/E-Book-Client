"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEBook } from "@/types";
import { useDeleteFileMutation } from "@/redux/features/file/fileApi";
import { toast } from "sonner";
import ConfirmationModal from "../ConfirmationModal";
import {
  Trash2,
  Edit2,
  Download,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import EditEBookModal from "./EditEBookModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface EBookTableProps {
  ebooks: TEBook[];
}

const EBookTable: React.FC<EBookTableProps> = ({ ebooks }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editBook, setEditBook] = useState<TEBook | null>(null);
  const [deleteFile] = useDeleteFileMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteFile(id).unwrap();
      toast.success("EBook deleted successfully");
      setDeleteId(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete ebook");
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
              <TableHead className="w-[300px]">Book</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">File</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {ebooks && ebooks.length > 0 ? (
                ebooks.map((ebook, index) => {
                  const finalPrice = ebook.bookPrice - ebook.discount;

                  return (
                    <motion.tr
                      key={ebook.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-100 overflow-hidden flex-shrink-0">
                            {ebook.imgUrl ? (
                              <Image
                                src={ebook.imgUrl}
                                alt={ebook.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-blue-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {ebook.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {ebook.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-900">
                            ৳ {finalPrice.toFixed(2)}
                          </span>
                          {ebook.discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                              ৳ {ebook.bookPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {ebook.url ? (
                          <div className="flex justify-center space-x-2">
                            <Link href={ebook.url} className="h-8">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Link>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-gray-400">
                            <FileText className="w-3 h-3 mr-1" />
                            No file
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditBook(ebook)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(ebook.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center justify-center text-gray-500"
                    >
                      <FileText className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No ebooks found</p>
                      <p className="text-sm">
                        Add your first ebook to get started
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
        title="Delete EBook"
        description="Are you sure you want to delete this ebook? This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
      />

      {/* Edit EBook Modal */}
      {editBook && (
        <EditEBookModal
          isOpen={!!editBook}
          ebook={editBook}
          onClose={() => setEditBook(null)}
        />
      )}
    </>
  );
};

export default EBookTable;
