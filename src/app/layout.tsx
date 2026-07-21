import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: "--font-barlow",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Francisco Fernández - Portfolio & CV",
  description: "Portfolio online y Currículum Vitae de Francisco Fernández, Diseñador Web y Programador.",
  icons: {
    icon: [
      { url: "https://disenadorenmalaga.es/wp-content/uploads/2026/07/cropped-favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "https://disenadorenmalaga.es/wp-content/uploads/2026/07/cropped-favicon-192x192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [
      { url: "https://disenadorenmalaga.es/wp-content/uploads/2026/07/cropped-favicon-180x180.png", sizes: "180x180", type: "image/png" }
    ]
  }
};

import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${barlow.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
