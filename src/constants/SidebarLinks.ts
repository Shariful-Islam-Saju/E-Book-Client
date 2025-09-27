import { FileText, Star, Users } from "lucide-react";

export const sidebarLinks = [
  {
    title: "Leads Management",
    href: "/dashboard/leads-management",
    icon: Users, // Represents people/leads
  },
  {
    title: "EBook Library",
    href: "/dashboard/ebook-library",
    icon: FileText, // Represents PDF files
  },
  {
    title: "Review Management",
    href: "/dashboard/review-management",
    icon: Star, // Represents reviews/ratings
  },
];
