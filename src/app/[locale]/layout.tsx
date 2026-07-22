import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "../globals.css";
import CustomCursor from "@/components/CustomCursor";

const barlow = Barlow({
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: "--font-barlow",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const descriptions = {
    es: "Senior Fullstack Product Developer en Málaga. Especialista en ecosistemas Next.js, arquitecturas sólidas en WordPress y diseño UX/UI.",
    en: "Senior Fullstack Product Developer in Malaga. Specializing in Next.js ecosystems, robust WordPress architectures, and UX/UI design. Remote work."
  };

  const titles = {
    es: "Francisco Fernández - Portfolio & CV",
    en: "Francisco Fernandez - Portfolio & CV"
  };

  return {
    title: titles[locale === 'en' ? 'en' : 'es'],
    description: descriptions[locale === 'en' ? 'en' : 'es'],
    icons: {
      icon: [
        { url: "/favicon.png", type: "image/png" }
      ],
      apple: [
        { url: "/favicon.png", type: "image/png" }
      ]
    }
  };
}

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
