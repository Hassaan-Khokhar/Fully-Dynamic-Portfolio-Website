"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Briefcase, Loader2, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ExperienceItem } from "@/data/experience";
import { useToast } from "@/components/Toast";

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const empty: ExperienceItem = { id: "", year: "", role: "", company: "", bullets: [], active: false };
  const { showToast } = useToast();
  const [form, setForm] = useState<ExperienceItem>(empty);

  // Drag-and-drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("experience").select("*").order("sort_order", { ascending: true });
    if (error) console.error(error);
    else {
      setItems(data || []);
    }
    setLoading(false);
  };

  // ═══════════════════════════════════════════
  // Drag & Drop Handlers
  // ═══════════════════════════════════════════

  const handleDragStart = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    requestAnimationFrame(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = "0.4";
      }
    });
  };

  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = async () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = "1";
    }

    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const reordered = [...items];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dragOverIndex, 0, moved);

      setItems(reordered);

      const updates = reordered.map((item, i) => ({
        id: item.id,
        sort_order: i,
      }));

      for (const update of updates) {
        await supabase
          .from("experience")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }

      showToast("Order updated successfully");
    }

    setDragIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleEdit = (item: ExperienceItem) => { setEditing(item); setForm(item); setIsCreating(false); };
  const handleCreate = () => { setIsCreating(true); setEditing(null); setForm(empty); };
  const handleCancel = () => { setEditing(null); setIsCreating(false); setForm(empty); };

  const handleSave = async () => {
    setIsSaving(true);
    const dbData = {
      year: form.year,
      role: form.role,
      company: form.company,
      bullets: form.bullets,
      active: form.active,
      sort_order: isCreating ? items.length : undefined,
    };

    if (isCreating) {
      await supabase.from("experience").insert([dbData]);
    } else if (editing) {
      await supabase.from("experience").update(dbData).eq("id", editing.id);
    }

    handleCancel();
    setIsSaving(false);
    showToast(isCreating ? "Experience role created" : "Experience role updated");
    fetchExperience();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this role?")) return;
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) showToast("Failed to delete role", "error");
    else {
      showToast("Experience role deleted", "delete");
      fetchExperience();
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white mb-2">Experience</h1><p className="text-white/50">Manage career roles in Supabase.</p></div>
        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Plus className="w-5 h-5" /> Add Role
        </button>
      </motion.div>

      <AnimatePresence>
        {(isCreating || editing) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{isCreating ? "Add Experience" : "Edit Experience"}</h2>
              <button onClick={handleCancel} className="text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
              <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Duration" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-blue-500" /> Active
              </label>
            </div>
            <textarea placeholder="Bullet points (one per line)" rows={4} value={form.bullets.join("\n")} onChange={(e) => setForm({ ...form, bullets: e.target.value.split("\n").filter(Boolean) })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white mb-6 focus:border-neon-blue focus:outline-none resize-none" />
            <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isCreating ? "Create" : "Save"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-white/20" /></div>
        ) : items.length > 0 ? (
          <>
            <p className="text-xs text-white/30 font-medium tracking-widest uppercase mb-2 flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5" />
              Drag to reorder
            </p>
            {items.map((item, i) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(i, e)}
                onDragOver={(e) => handleDragOver(i, e)}
                onDragEnd={handleDragEnd}
                onDragLeave={() => setDragOverIndex(null)}
                className={`bg-white/5 border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all duration-300 select-none ${
                  dragOverIndex === i && dragIndex !== i
                    ? "border-neon-blue/50 bg-neon-blue/5 scale-[1.01]"
                    : "border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing shrink-0 p-1 -ml-1 text-white/20 hover:text-white/50 transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center"><Briefcase className="w-6 h-6 text-neon-purple" /></div>
                  <div>
                    <div className="flex items-center gap-3"><p className="text-white font-bold text-lg">{item.role}</p>{item.active && <span className="px-2 py-0.5 rounded-full text-xs bg-neon-purple/20 text-neon-purple font-bold">Active</span>}</div>
                    <p className="text-neon-blue text-sm mt-1">{item.company}</p>
                    <p className="text-white/40 text-sm">{item.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleEdit(item)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-24 text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No experience roles yet</p>
            <p className="text-sm">Add your first role above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
