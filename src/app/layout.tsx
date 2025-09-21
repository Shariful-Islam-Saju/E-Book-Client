import type { Metadata } from "next";
import { Roboto, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import AllProviders from "@/redux/AllProviders";
import { TrackingProvider } from "@/components/TrackingProvider";
import { Toaster } from "sonner";

// English font: Roboto
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // optional weights
});

// Bangla font: Hind Siliguri
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "DS EBooks", // fallback / root title
    template: "%s | DS EBooks", // %s will be replaced by page-specific title
  },
  description:
    "DS Ebook is your go-to platform for managing, reading, and exploring digital ebooks efficiently in both English and Bangla.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${hindSiliguri.variable} antialiased`}
      >
        <TrackingProvider>
          <AllProviders>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                duration: 4000,
              }}
            />
          </AllProviders>
        </TrackingProvider>
      </body>
    </html>
  );
}
