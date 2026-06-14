import { createBrowserClient } from "@supabase/ssr";
import Cookies from "js-cookie";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    getAll() {
      const allCookies = Cookies.get();
      return Object.entries(allCookies || {}).map(([name, value]) => ({ name, value }));
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        // Remove explicit expiration to make them session cookies (deleted when browser closes)
        const { expires, maxAge, ...restOptions } = options as any;
        Cookies.set(name, value, { ...restOptions });
      });
    },
  },
});
