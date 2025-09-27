import Reviewmanagement from "@/components/reviewManagement/Reviewmanagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Management",
  description:
    "Easily manage, organize, and track all review in one place. Streamline your workflow, monitor progress, and boost conversions with the DS Ebook Review Management system.",
};

const Page = () => {
  return <Reviewmanagement />;
};

export default Page;
