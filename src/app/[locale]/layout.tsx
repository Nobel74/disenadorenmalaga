import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "../globals.css";
import CustomCursor from "@/components/CustomCursor";

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
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
