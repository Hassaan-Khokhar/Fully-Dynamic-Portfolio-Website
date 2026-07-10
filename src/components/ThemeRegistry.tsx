"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Force dark theme on all admin routes to prevent bleed-over
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme={isAdmin ? "dark" : undefined}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
