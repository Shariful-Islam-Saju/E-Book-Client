"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Search,
  BookX,
  Star,
  Calendar,
  User,
  ArrowRight,
  Download,
  Eye,
  BookText,
} from "lucide-react";
import Link from "next/link";
import { useGetAllFilesQuery } from "@/redux/features/file/fileApi";
import { TEBook } from "@/types";
import NoEBooks from "./NoEBooks";
import RandomBox from "@/components/RandomBox";

const EBooksPage = () => {
  const { data, error, isLoading, isSuccess } = useGetAllFilesQuery("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEBooks, setFilteredEBooks] = useState<TEBook[]>([]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      let filtered = data.data;

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (ebook) =>
            ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ebook.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredEBooks(filtered);
    }
  }, [data, searchQuery, isSuccess]);

  if (error) {
    return (
     <NoEBooks />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
     <RandomBox />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, -5, 0, 5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg mb-4"
          >
            <BookText size={48} className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold  mb-8 z-20 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Digital Seba Library
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Explore our vibrant collection of digital books and find your next
            great read!
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative w-full max-w-2xl">
            <motion.div
              animate={{
                boxShadow: [
                  "0 4px 14px 0 rgba(139, 92, 246, 0.1)",
                  "0 4px 14px 0 rgba(139, 92, 246, 0.2)",
                  "0 4px 14px 0 rgba(139, 92, 246, 0.1)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl blur-md opacity-30"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500"
              size={22}
            />
            <Input
              placeholder="Search E-Books"
              className="pl-12 pr-4 py-5 h-14 rounded-2xl border-0 bg-white/90 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-purple-400 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Results Count */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center"
          >
            <p className="text-purple-700 font-medium inline-flex items-center gap-1 bg-purple-100 px-4 py-2 rounded-full">
              <span className="text-lg">📚</span> Showing{" "}
              <span className="font-bold text-purple-800">
                {filteredEBooks.length}
              </span>{" "}
              E-Books
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </motion.div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl">
                  <Skeleton className="h-48 w-full rounded-t-2xl bg-gradient-to-r from-purple-200 to-blue-200" />
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-3/4 mb-2 bg-gray-300" />
                    <Skeleton className="h-4 w-full bg-gray-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16 bg-gray-200" />
                      <Skeleton className="h-4 w-16 bg-gray-200" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : filteredEBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-purple-300 shadow-lg"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 0, 10, 0],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <BookX size={80} className="text-purple-500 mb-4 mx-auto" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No e-books found
            </h3>
            <p className="text-gray-600 max-w-md text-lg mb-6">
              {searchQuery
                ? `No results found for "${searchQuery}". Try a different search term.`
                : "There are no e-books available at the moment. Please check back later."}
            </p>
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all shadow-md flex items-center gap-2"
                onClick={() => setSearchQuery("")}
              >
                <Search size={18} />
                Clear Search
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredEBooks.map((ebook, index) => (
                <motion.div
                  key={ebook.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                  whileHover={{ y: -5 }}
                  className="flex"
                >
                  <Link href={`/ebooks/${ebook.id}`} className="flex-1">
                    <Card className="h-full flex flex-col overflow-hidden border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl group">
                      <div className="overflow-hidden relative">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          src={ebook.imgUrl || "/placeholder-ebook.jpg"}
                          alt={ebook.title}
                          className="w-full h-48 object-cover group-hover:brightness-110 transition-all duration-300"
                        />
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-1 group-hover:text-purple-600 transition-colors text-lg">
                          {ebook.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4 flex-1 flex flex-col">
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                          {ebook.description}
                        </p>
                      </CardContent>
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 text-center flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{}}
                      >
                        <span>View Details</span>
                        <ArrowRight size={16} />
                      </motion.div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-gray-600"
        >
          <p>© {new Date().getFullYear()} Digital Seba. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default EBooksPage;
