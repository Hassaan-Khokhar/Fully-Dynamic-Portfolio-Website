"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Force dark theme on all admin routes to prevent bleed-over
  const isAdmin = pathname?.startsWith("/admin");

  if (!mounted) {
    return <div className="invisible">{children}</div>; // Prevent flash of unstyled content during hydration
  }

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
