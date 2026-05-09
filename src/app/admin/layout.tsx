"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageSquare, FolderKanban, ArrowLeft, Code2, GraduationCap, Briefcase, Settings, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Code2 },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return (
      <div className="admin-root">
        <style>{`
          .admin-root, .admin-root * {
            cursor: default !important;
          }
          .admin-root a, .admin-root button, .admin-root input, .admin-root textarea, .admin-root select {
            cursor: pointer !important;
          }
          .admin-root input, .admin-root textarea {
            cursor: text !important;
          }
        `}</style>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white flex" style={{ cursor: "default" }}>
      {/* Global cursor override for admin */}
      <style>{`
        .admin-root, .admin-root * {
          cursor: default !important;
        }
        .admin-root a, .admin-root button, .admin-root input, .admin-root textarea, .admin-root select {
          cursor: pointer !important;
        }
        .admin-root input, .admin-root textarea {
          cursor: text !important;
        }
        select option {
          background-color: #0a0a0f;
          color: #ffffff;
        }
      `}</style>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-root w-64 border-r border-white/5 bg-[#030305]/95 backdrop-blur-xl flex flex-col fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-white inline-block">
              HASSAAN<span className="text-neon-blue">.</span>
            </Link>
            <p className="text-xs text-white/40 mt-1 tracking-widest uppercase">Admin Dashboard</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-root flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 min-w-0">
        {/* Mobile Top Bar */}
        <div className="flex items-center gap-4 mb-6 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-lg font-bold tracking-tighter text-white">
            HASSAAN<span className="text-neon-blue">.</span>
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
