import LoginPage from "@/components/login/LoginPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login ",
  description:
    "Securely log in to your DS Ebook account and access your personalized dashboard, manage your ebooks, and continue your learning journey.",
};

const Login = () => {
  return <LoginPage />
};

export default Login;
