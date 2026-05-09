"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderKanban, MessageSquare, TrendingUp, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminOverview() {
  const [stats, setStats] = useState([
    { title: "Total Projects", value: "0", icon: FolderKanban, color: "text-neon-blue", bgColor: "bg-neon-blue/10" },
    { title: "Messages", value: "0", icon: MessageSquare, color: "text-neon-purple", bgColor: "bg-neon-purple/10" },
    { title: "Skills", value: "0", icon: TrendingUp, color: "text-green-400", bgColor: "bg-green-400/10" },
    { title: "Last Login", value: "Today", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-400/10" },
  ]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Fetch counts
    const { count: projectCount } = await supabase.from("projects").select("*", { count: "exact", head: true });
    const { count: messageCount } = await supabase.from("messages").select("*", { count: "exact", head: true });
    const { count: skillCount } = await supabase.from("skills").select("*", { count: "exact", head: true });

    setStats([
      { title: "Total Projects", value: (projectCount || 0).toString(), icon: FolderKanban, color: "text-neon-blue", bgColor: "bg-neon-blue/10" },
      { title: "Messages", value: (messageCount || 0).toString(), icon: MessageSquare, color: "text-neon-purple", bgColor: "bg-neon-purple/10" },
      { title: "Total Skills", value: (skillCount || 0).toString(), icon: TrendingUp, color: "text-green-400", bgColor: "bg-green-400/10" },
      { title: "Last Updated", value: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), icon: Clock, color: "text-orange-400", bgColor: "bg-orange-400/10" },
    ]);

    // Fetch recent projects
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);
    
    setRecentProjects(projects || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-white/20">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-medium tracking-widest uppercase text-xs">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/50 mb-8">Welcome back, Hassaan. Here&apos;s your live Supabase overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/50 font-medium">{stat.title}</span>
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Recently Added Projects</h2>
        <div className="space-y-4">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-neon-blue" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{project.title}</p>
                    <p className="text-white/40 text-sm truncate max-w-md">{project.description}</p>
                  </div>
                </div>
                <div className="hidden sm:flex gap-2">
                  {project.tags.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/20 text-center py-4 italic">No projects yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
