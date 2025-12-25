import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/Footer";

import Loading from "./loading";
import ProvidersContainer from "@/components/providersContainer/providersContainer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-logo",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-source-sans-3",
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "Modern e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSans.className} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        
          <ProvidersContainer>
            <Navbar />
            {/* <span className="mt-22 block"></span> */}
            <div className="container">{children}</div>
            <Footer />
          </ProvidersContainer>
        
        <Toaster />
      </body>
    </html>
  );
}
