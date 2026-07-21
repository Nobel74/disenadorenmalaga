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
      { url: "/favicon.png", type: "image/png" }
    ],
    apple: [
      { url: "/favicon.png", type: "image/png" }
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
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
