"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, GraduationCap, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EducationItem } from "@/data/education";

export default function AdminEducationPage() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<EducationItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const empty: EducationItem = { id: "", year: "", degree: "", institution: "", cgpa: "", description: "", active: false };
  const [form, setForm] = useState<EducationItem>(empty);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("education").select("*").order("sort_order", { ascending: true });
    if (error) console.error(error);
    else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (item: EducationItem) => { setEditing(item); setForm(item); setIsCreating(false); };
  const handleCreate = () => { setIsCreating(true); setEditing(null); setForm(empty); };
  const handleCancel = () => { setEditing(null); setIsCreating(false); setForm(empty); };

  const handleSave = async () => {
    setIsSaving(true);
    const dbData = {
      year: form.year,
      degree: form.degree,
      institution: form.institution,
      cgpa: form.cgpa,
      description: form.description,
      active: form.active,
    };

    if (isCreating) {
      await supabase.from("education").insert([dbData]);
    } else if (editing) {
      await supabase.from("education").update(dbData).eq("id", editing.id);
    }

    handleCancel();
    setIsSaving(false);
    fetchEducation();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("education").delete().eq("id", id);
    fetchEducation();
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Education</h1>
          <p className="text-white/50">Manage academic background in Supabase.</p>
        </div>
        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm">
          <Plus className="w-5 h-5" /> Add Entry
        </button>
      </motion.div>

      <AnimatePresence>
        {(isCreating || editing) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{isCreating ? "Add Education" : "Edit Education"}</h2>
              <button onClick={handleCancel} className="text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
              <input placeholder="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
              <input placeholder="CGPA" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-blue-500" /> Current
              </label>
            </div>
            <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white mb-6 focus:border-neon-blue focus:outline-none resize-none" />
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
          items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/[0.07] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-bold text-lg">{item.degree}</p>
                    {item.active && <span className="px-2 py-0.5 rounded-full text-xs bg-neon-blue/20 text-neon-blue font-bold">Current</span>}
                  </div>
                  <p className="text-neon-purple text-sm mt-1">{item.institution}</p>
                  <p className="text-white/40 text-sm">{item.year} · CGPA: {item.cgpa}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleEdit(item)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
