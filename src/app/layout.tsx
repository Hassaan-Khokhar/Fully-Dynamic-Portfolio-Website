import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Hassaan Ali (Hassaan Khokhar) | Full Stack Architect & Flutter Specialist",
  description: "Official Portfolio of Hassaan Ali (Hassaan Khokhar), a Full Stack Developer and Flutter Engineer. Specialized in architecting robust database-driven backends and fluid mobile ecosystems.",
  keywords: ["Hassaan Ali", "Hassaan Khokhar", "Full Stack Developer", "Flutter Engineer", "Portfolio", "Software Engineer", "COMSATS University", "Web Developer", "App Developer"],
  authors: [{ name: "Hassaan Ali" }],
  openGraph: {
    title: "Hassaan Ali | Full Stack Architect & Flutter Specialist",
    description: "Architecting robust backends and fluid mobile ecosystems.",
    url: "https://hassaanali.com", // User should update this with their actual domain
    siteName: "Hassaan Ali Portfolio",
    images: [
      {
        url: "/og-image.png", // User should add an OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hassaan Ali | Full Stack Architect",
    description: "Full Stack Developer & Flutter Specialist",
    creator: "@hassaanali", // User should update
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable}`}>
      <body suppressHydrationWarning className="antialiased bg-background text-foreground min-h-screen selection:bg-neon-blue/30 selection:text-white">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <CookieBanner />
      </body>
    </html>
  );
}
