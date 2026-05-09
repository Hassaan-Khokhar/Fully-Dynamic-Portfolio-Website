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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hassaan Ali (Hassaan Khokhar) | Full Stack Architect & Flutter Specialist",
    template: "%s | Hassaan Ali Portfolio",
  },
  description: "Official Portfolio of Hassaan Ali (Hassaan Khokhar), a Full Stack Developer and Flutter Engineer at COMSATS University Islamabad. Specialized in architecting robust database-driven backends, cross-platform mobile apps with Flutter, and scalable web solutions.",
  keywords: [
    "Hassaan Ali",
    "Hassaan Khokhar",
    "Hassaan Ali Portfolio",
    "Hassaan Khokhar Portfolio",
    "Full Stack Developer",
    "Flutter Engineer",
    "Flutter Developer",
    "Software Engineer",
    "Web Developer",
    "App Developer",
    "COMSATS University",
    "Portfolio",
    "Laravel Developer",
    "React Developer",
    "Next.js Developer",
    "Mobile App Developer",
    "Pakistan Developer",
  ],
  authors: [{ name: "Hassaan Ali", url: "https://hassaanali.com" }],
  creator: "Hassaan Ali",
  publisher: "Hassaan Ali",
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Hassaan Ali | Full Stack Architect & Flutter Specialist",
    description: "Full Stack Developer & Flutter Engineer. Building robust backends and fluid mobile ecosystems. Explore my projects, skills, and experience.",
    url: siteUrl,
    siteName: "Hassaan Ali Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hassaan Ali - Full Stack Architect & Flutter Specialist",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hassaan Ali | Full Stack Architect & Flutter Specialist",
    description: "Full Stack Developer & Flutter Engineer. Building robust backends and fluid mobile ecosystems.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "IvGNxNntY-H_t8oea1ZGOg6dCABBYLNxMBK9lKD0wDk",
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
