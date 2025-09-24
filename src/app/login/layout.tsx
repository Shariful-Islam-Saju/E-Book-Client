"use client";

import EBooksLoadingPage from "@/components/Loading";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token === undefined) {
      // Still checking Redux store
      setLoading(true);
    } else if (token) {
      // Already logged in -> redirect
      router.push("/");
    } else {
      // No token -> allow login page
      setLoading(false);
    }
  }, [token, router]);

  if (loading) {
    return (
     <EBooksLoadingPage />
    );
  }

  return <>{children}</>;
}
