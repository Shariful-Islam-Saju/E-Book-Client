"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { loginSchema, LoginFormValues } from "@/schemas/LoginSchema";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
// Shadcn & Lucide imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Phone, Lock, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hook";
import { setuser } from "@/redux/features/auth/authSlice";

const defaultValues = {
  mobile: "01617134236",
  password: "sajukhan",
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(() => "");
    setIsLoading(true);
    try {
      const response = await login(data).unwrap();
      const user = jwtDecode(response.data.accessToken);
      dispatch(setuser({ user, token: response.data.accessToken }));
      router.push("/dashboard/leads-management");
    } catch (err: any) {
      setError(() => err?.data?.message || err.message);
      // TODO: show toast or error
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to show friendly error messages
  const getErrorMessage = (field: "mobile" | "password") => {
    if (!errors[field]) return "";
    switch (field) {
      case "mobile":
        return errors.mobile?.message === "Invalid mobile number"
          ? "Please enter a valid mobile number, e.g., 017XXXXXXXX"
          : "Mobile number is required";
      case "password":
        return errors.password?.message ===
          "Password must be at least 6 characters"
          ? "Password must be at least 6 characters"
          : "Password is required";
      default:
        return "This field is required";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 backdrop-blur-sm"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
            <User className="h-7 w-7 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-sm">Sign in to your account</p>
      </motion.div>

      {/* Mobile input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-3"
      >
        <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
          Mobile Number
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter your mobile number"
            {...register("mobile")}
            className="pl-10 pr-4 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
          />
        </div>
        {errors.mobile && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 flex items-center gap-1 mt-1"
          >
            {getErrorMessage("mobile")}
          </motion.p>
        )}
      </motion.div>

      {/* Password input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="space-y-3"
      >
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password")}
            className="pl-10 pr-12 py-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 flex items-center gap-1 mt-1"
          >
            {getErrorMessage("password")}
          </motion.p>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Submit button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="pt-4"
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </>
          )}
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center pt-4"
      >
        <p className="text-xs text-gray-500">
          By continuing, you agree to our Terms of Service
        </p>
      </motion.div>
    </form>
  );
};

export default LoginForm;
