"use client";

import { useParams } from "next/navigation";

const EBooksPage = () => {
  const params = useParams(); // Next.js App Router hook
  const id = params.id;

  return <div>Page ID: {id}</div>;
};

export default EBooksPage;
