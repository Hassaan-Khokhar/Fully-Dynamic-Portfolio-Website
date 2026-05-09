"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        window.location.assign("/admin");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Did you restart the dev server after adding .env.local?");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tighter text-white mb-2">
            ADMIN<span className="text-neon-blue">.</span>
          </h1>
          <p className="text-white/40 uppercase tracking-widest text-xs font-bold">
            Secure Dashboard Access
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-neon-blue focus:outline-none transition-all duration-300"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-neon-blue focus:outline-none transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-white/20 text-sm">
          Protected by Supabase Auth
        </p>
        <a
          href="/"
          className="flex items-center justify-center gap-2 mt-4 text-white/30 hover:text-neon-blue text-sm font-medium transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </a>
      </motion.div>
    </div>
  );
}
