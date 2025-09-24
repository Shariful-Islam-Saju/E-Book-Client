"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "@/components/Loading";

export default function RootLayout({
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
    } else if (!token) {
      // No token -> redirect
      router.push("/login");
    } else {
      // Token exists -> authenticated
      setLoading(false);
    }
  }, [token, router]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      {/* Top Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-950 p-6 pt-20 lg:ml-64">
          {children}
        </main>
      </div>
    </>
  );
}
