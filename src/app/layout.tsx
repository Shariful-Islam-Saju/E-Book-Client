import type { Metadata } from "next";
import { Roboto, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import AllProviders from "@/redux/AllProviders";
import { TrackingProvider } from "@/components/TrackingProvider";
import { Toaster } from "sonner";
import Image from "next/image";

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
      <head>
        {/* Meta Pixel Code - Direct Implementation */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <Image
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
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
