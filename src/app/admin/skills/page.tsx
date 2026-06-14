"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Code2, Layers, Database, Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SkillCategory } from "@/data/skills";
import { useToast } from "@/components/Toast";

const iconOptions = [
  { value: "code" as const, label: "Code", icon: Code2 },
  { value: "layers" as const, label: "Layers", icon: Layers },
  { value: "database" as const, label: "Database", icon: Database },
  { value: "lightbulb" as const, label: "Lightbulb", icon: Lightbulb },
];

const iconMap: Record<string, React.ReactNode> = {
  code: <Code2 className="w-5 h-5 text-neon-blue" />,
  layers: <Layers className="w-5 h-5 text-neon-purple" />,
  database: <Database className="w-5 h-5 text-neon-blue" />,
  lightbulb: <Lightbulb className="w-5 h-5 text-neon-purple" />,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<SkillCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const empty: SkillCategory = { id: "", title: "", icon: "code", skills: [], className: "md:col-span-1 md:row-span-1" };
  const { showToast } = useToast();
  const [form, setForm] = useState<SkillCategory>(empty);
  const [skillsRaw, setSkillsRaw] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("skills").select("*").order("sort_order", { ascending: true });
    if (error) console.error(error);
    else {
      const mapped: SkillCategory[] = (data || []).map((s): SkillCategory => ({
        id: s.id,
        title: s.title,
        icon: s.icon as SkillCategory["icon"],
        skills: s.skills,
        className: s.class_name,
      }));
      setSkills(mapped);
    }
    setLoading(false);
  };

  const handleEdit = (cat: SkillCategory) => { setEditing(cat); setForm(cat); setSkillsRaw(cat.skills.join(", ")); setIsCreating(false); };
  const handleCreate = () => { setIsCreating(true); setEditing(null); setForm(empty); setSkillsRaw(""); };
  const handleCancel = () => { setEditing(null); setIsCreating(false); setForm(empty); setSkillsRaw(""); };

  const handleSave = async () => {
    setIsSaving(true);
    const parsedSkills = skillsRaw.split(",").map((s) => s.trim()).filter(Boolean);
    const dbData = {
      title: form.title,
      icon: form.icon,
      skills: parsedSkills,
      class_name: form.className,
    };

    if (isCreating) {
      await supabase.from("skills").insert([dbData]);
    } else if (editing) {
      await supabase.from("skills").update(dbData).eq("id", editing.id);
    }

    handleCancel();
    setIsSaving(false);
    showToast(isCreating ? "Skill category created" : "Skill category updated");
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) showToast("Failed to delete category", "error");
    else {
      showToast("Category deleted", "delete");
      fetchSkills();
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
          <p className="text-white/50">Manage technical arsenal in Supabase.</p>
        </div>
        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </motion.div>

      <AnimatePresence>
        {(isCreating || editing) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{isCreating ? "Create Category" : "Edit Category"}</h2>
              <button onClick={handleCancel} className="text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Category Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value as any })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none">
                {iconOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <input placeholder="Skills (comma separated)" value={skillsRaw} onChange={(e) => setSkillsRaw(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white mb-6 focus:border-neon-blue focus:outline-none" />
            <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isCreating ? "Create" : "Save"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-white/20" /></div>
        ) : (
          skills.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/[0.07] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">{iconMap[cat.icon]}</div>
                <div>
                  <p className="text-white font-bold text-lg">{cat.title}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cat.skills.map((s) => <span key={s} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/70">{s}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleEdit(cat)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(cat.id)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
