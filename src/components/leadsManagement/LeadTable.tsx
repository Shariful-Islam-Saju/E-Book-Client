"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {  Trash2 } from "lucide-react";
import { TLead } from "@/types";
import { motion } from "framer-motion";
import ConfirmationModal from "../ConfirmationModal";
import { useDeleteLeadMutation } from "@/redux/features/lead/leadApi";
import { toast } from "sonner";

interface LeadTableProps {
  leads: TLead[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  formatDate: (date: string) => string;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  selected,
  setSelected,
  formatDate,
}) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLead] = useDeleteLeadMutation();

  const toggleSelectAll = () => {
    if (selected.length === leads.length) setSelected([]);
    else setSelected(leads.map((l) => l.id));
  };

  const toggleSelectOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteLead(deleteId).unwrap();
      toast.success("Lead deleted successfully!");
      setSelected((prev) => prev.filter((id) => id !== deleteId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lead.");
    } finally {
      setDeleteId(null); // close modal
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="overflow-x-auto rounded-lg border border-blue-200 bg-white shadow-md"
      >
        <Table>
          <TableHeader className="bg-blue-50/80">
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={
                    selected.length > 0 && selected.length === leads.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Interested</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead, idx) => (
              <TableRow
                key={lead.id}
                className={`${
                  selected.includes(lead.id)
                    ? "bg-blue-50/70"
                    : idx % 2 === 0
                    ? "bg-white"
                    : "bg-slate-50/40"
                } hover:bg-blue-100/50 transition`}
              >
                <TableCell className="text-center">
                  <Checkbox
                    checked={selected.includes(lead.id)}
                    onCheckedChange={() => toggleSelectOne(lead.id)}
                  />
                </TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.mobile}</TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {lead.address}
                </TableCell>
                <TableCell>
                  {lead.ebook?.[0]?.title ? (
                    <Badge variant="secondary">{lead.ebook[0]?.title}</Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
                <TableCell>{formatDate(lead.updatedAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  {/* TODO: Add edit later */}
                  {/* <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-blue-600 border-blue-200"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Button> */}
                  <Button
                    onClick={() => confirmDelete(lead.id)}
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        title="Delete Lead?"
        description="Are you sure you want to delete this lead? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default LeadTable;
