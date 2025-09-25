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
