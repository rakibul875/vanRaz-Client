import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ThemeProvider from "./theme-provider";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VenRaz — Multi-Vendor E-Commerce",
  description: "VenRaz — Modern Multi-Vendor E-Commerce Platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground dark:bg-[#0b1325]">
        <SmoothScroll>
          <ThemeProvider>
            <ToastProvider>
              <CartProvider>
                <WishlistProvider>
                  {/* <Navbar /> */}
                  <main className="flex-grow">{children}</main>

                  {/* <Footer /> */}
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
