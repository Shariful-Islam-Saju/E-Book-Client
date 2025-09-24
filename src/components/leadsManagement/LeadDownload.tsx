"use client";

import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { TLead } from "@/types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const LeadDownload = ({ leads }: { leads: TLead[] }) => {
  const handleDownload = async () => {
    if (!leads || leads.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Leads Report");

    // Date range for file naming (based on updatedAt)
    const startDate = new Date(
      Math.min(...leads.map((l) => new Date(l.updatedAt).getTime()))
    ).toLocaleDateString("en-GB");

    const endDate = new Date(
      Math.max(...leads.map((l) => new Date(l.updatedAt).getTime()))
    ).toLocaleDateString("en-GB");

    // Title Row
    worksheet.mergeCells("A1:D1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `Leads Report (${startDate} - ${endDate})`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: "center" };

    // Header Row
    const headerRow = worksheet.addRow(["Name", "Mobile", "Address", "Date"]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" }, // blue background
      };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Rows with striped style
    leads.forEach((lead, index) => {
      const row = worksheet.addRow([
        lead.name,
        lead.mobile,
        lead.address || "-",
        new Date(lead.updatedAt).toLocaleString(),
      ]);

      row.eachCell((cell) => {
        cell.alignment = { wrapText: true, vertical: "middle" }; // enable wrapping
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Striped rows
      if (index % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F2F2F2" }, // light gray for even rows
          };
        });
      }
    });

    // Compute column widths dynamically (optional, keep width fixed)
    worksheet.columns.forEach((column, colIndex) => {
      if (!column) return;

      let maxLength = column.header ? column.header.toString().length : 10;
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        const cell = row.getCell(colIndex + 1);
        const cellValue = cell.value ? cell.value.toString() : "";
        if (cellValue.length > maxLength) maxLength = cellValue.length;
      });
      column.width = Math.min(maxLength + 2, 30); // keep max width 30
    });

    // File name
    const fileName = `Leads_Report_${startDate}_to_${endDate}.xlsx`;

    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="gap-2 border-blue-200"
    >
      <Download className="w-4 h-4" />
      Export
    </Button>
  );
};

export default LeadDownload;
