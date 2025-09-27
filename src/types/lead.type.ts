import { TEBook } from "@/types";

export interface TLead {
  id: string;
  name: string;
  mobile: string;
  ip: string;
  userAgent: string;
  address: string;
  ebookId: string;
  createdAt: string;
  updatedAt: string;
  ebook_imgurl: string | null;
  ebook: (Pick<TEBook, "title" | "url" | "slug"> | null)[];
}

export interface TGetAllLeadParams {
  search?: string;
  fromDate?: string;
  toDate?: string;
  ebookIds?: string[];
  page?: number; // Pagination
  limit?: number; // Items per page
  [key: string]: any; // Future filters
}