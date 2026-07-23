"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Briefcase, Loader2, GripVertical, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ExperienceRole } from "@/data/experience";
import { useToast } from "@/components/Toast";

interface CompanyItem {
  id: string;
  company: string;
  location: string;
  sort_order: number;
  roles: ExperienceRole[];
}

export default function AdminExperiencePage() {
  const [items, setItems] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  // Company form state
  const [editingCompany, setEditingCompany] = useState<CompanyItem | null>(null);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({ company: "", location: "" });

  // Role form state
  const [editingRole, setEditingRole] = useState<ExperienceRole | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState<string | null>(null); // company id
  const emptyRole: Omit<ExperienceRole, "id" | "experience_id" | "sort_order"> = {
    title: "", start_date: "", end_date: "", description: "", bullets: [], is_current: false,
  };
  const [roleForm, setRoleForm] = useState(emptyRole);

  // Expanded companies
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

  // Company drag-and-drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  // Role drag-and-drop state
  const [roleDragIndex, setRoleDragIndex] = useState<number | null>(null);
  const [roleDragOverIndex, setRoleDragOverIndex] = useState<number | null>(null);
  const [roleDragCompanyId, setRoleDragCompanyId] = useState<string | null>(null);
  const roleDragNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: companies }, { data: roles }] = await Promise.all([
      supabase.from("experience").select("*").order("sort_order", { ascending: true }),
      supabase.from("experience_roles").select("*").order("sort_order", { ascending: true }),
    ]);

    const grouped: CompanyItem[] = (companies || []).map((c: any) => ({
      id: c.id,
      company: c.company,
      location: c.location || "",
      sort_order: c.sort_order,
      roles: (roles || [])
        .filter((r: any) => r.experience_id === c.id)
        .map((r: any): ExperienceRole => ({
          id: r.id,
          experience_id: r.experience_id,
          title: r.title,
          start_date: r.start_date,
          end_date: r.end_date,
          description: r.description,
          bullets: r.bullets || [],
          is_current: r.is_current,
          sort_order: r.sort_order,
        })),
    }));

    setItems(grouped);
    setLoading(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedCompanies(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ═══════════════════════════════════════════
  // Company CRUD
  // ═══════════════════════════════════════════

  const handleCreateCompany = () => {
    setIsCreatingCompany(true);
    setEditingCompany(null);
    setCompanyForm({ company: "", location: "" });
    cancelRoleForm();
  };

  const handleEditCompany = (item: CompanyItem) => {
    setEditingCompany(item);
    setIsCreatingCompany(false);
    setCompanyForm({ company: item.company, location: item.location });
    cancelRoleForm();
  };

  const cancelCompanyForm = () => {
    setEditingCompany(null);
    setIsCreatingCompany(false);
    setCompanyForm({ company: "", location: "" });
  };

  const handleSaveCompany = async () => {
    setIsSaving(true);
    if (isCreatingCompany) {
      await supabase.from("experience").insert([{
        company: companyForm.company,
        location: companyForm.location,
        role: "",
        year: "",
        bullets: [],
        active: false,
        sort_order: items.length,
      }]);
      showToast("Company created");
    } else if (editingCompany) {
      await supabase.from("experience").update({
        company: companyForm.company,
        location: companyForm.location,
      }).eq("id", editingCompany.id);
      showToast("Company updated");
    }
    cancelCompanyForm();
    setIsSaving(false);
    fetchData();
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Delete this company and all its roles?")) return;
    await supabase.from("experience").delete().eq("id", id);
    showToast("Company deleted", "delete");
    fetchData();
  };

  // ═══════════════════════════════════════════
  // Company Drag & Drop
  // ═══════════════════════════════════════════

  const handleDragStart = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    setDragIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    requestAnimationFrame(() => {
      if (dragNodeRef.current) dragNodeRef.current.style.opacity = "0.4";
    });
  };

  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIndex === null || dragIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = async () => {
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = "1";
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const reordered = [...items];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dragOverIndex, 0, moved);
      setItems(reordered);
      for (let i = 0; i < reordered.length; i++) {
        await supabase.from("experience").update({ sort_order: i }).eq("id", reordered[i].id);
      }
      showToast("Order updated");
    }
    setDragIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  // ═══════════════════════════════════════════
  // Role CRUD
  // ═══════════════════════════════════════════

  const handleCreateRole = (companyId: string) => {
    setIsCreatingRole(companyId);
    setEditingRole(null);
    setRoleForm({ ...emptyRole });
    cancelCompanyForm();
    setExpandedCompanies(prev => new Set(prev).add(companyId));
  };

  const handleEditRole = (role: ExperienceRole) => {
    setEditingRole(role);
    setIsCreatingRole(null);
    setRoleForm({
      title: role.title,
      start_date: role.start_date,
      end_date: role.end_date,
      description: role.description,
      bullets: role.bullets,
      is_current: role.is_current,
    });
    cancelCompanyForm();
  };

  const cancelRoleForm = () => {
    setEditingRole(null);
    setIsCreatingRole(null);
    setRoleForm({ ...emptyRole });
  };

  const handleSaveRole = async (companyId: string) => {
    setIsSaving(true);
    const company = items.find(c => c.id === companyId);
    if (isCreatingRole) {
      await supabase.from("experience_roles").insert([{
        experience_id: companyId,
        title: roleForm.title,
        start_date: roleForm.start_date,
        end_date: roleForm.end_date,
        description: roleForm.description,
        bullets: roleForm.bullets.filter(b => b.trim() !== ""),
        is_current: roleForm.is_current,
        sort_order: company ? company.roles.length : 0,
      }]);
      showToast("Role created");
    } else if (editingRole) {
      await supabase.from("experience_roles").update({
        title: roleForm.title,
        start_date: roleForm.start_date,
        end_date: roleForm.end_date,
        description: roleForm.description,
        bullets: roleForm.bullets.filter(b => b.trim() !== ""),
        is_current: roleForm.is_current,
      }).eq("id", editingRole.id);
      showToast("Role updated");
    }

    // Update the parent experience's active flag based on roles
    const { data: allRoles } = await supabase
      .from("experience_roles")
      .select("is_current")
      .eq("experience_id", companyId);
    const hasActiveCurrent = (allRoles || []).some((r: any) => r.is_current) || roleForm.is_current;
    await supabase.from("experience").update({ active: hasActiveCurrent }).eq("id", companyId);

    cancelRoleForm();
    setIsSaving(false);
    fetchData();
  };

  const handleDeleteRole = async (roleId: string, companyId: string) => {
    if (!confirm("Delete this role?")) return;
    await supabase.from("experience_roles").delete().eq("id", roleId);
    showToast("Role deleted", "delete");
    fetchData();
  };

  // ═══════════════════════════════════════════
  // Role Drag & Drop
  // ═══════════════════════════════════════════

  const handleRoleDragStart = (companyId: string, index: number, e: React.DragEvent<HTMLDivElement>) => {
    setRoleDragCompanyId(companyId);
    setRoleDragIndex(index);
    roleDragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
    requestAnimationFrame(() => {
      if (roleDragNodeRef.current) roleDragNodeRef.current.style.opacity = "0.4";
    });
  };

  const handleRoleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (roleDragIndex === null || roleDragIndex === index) return;
    setRoleDragOverIndex(index);
  };

  const handleRoleDragEnd = async () => {
    if (roleDragNodeRef.current) roleDragNodeRef.current.style.opacity = "1";
    if (roleDragIndex !== null && roleDragOverIndex !== null && roleDragIndex !== roleDragOverIndex && roleDragCompanyId) {
      const company = items.find(c => c.id === roleDragCompanyId);
      if (company) {
        const reordered = [...company.roles];
        const [moved] = reordered.splice(roleDragIndex, 1);
        reordered.splice(roleDragOverIndex, 0, moved);
        setItems(prev => prev.map(c =>
          c.id === roleDragCompanyId ? { ...c, roles: reordered } : c
        ));
        for (let i = 0; i < reordered.length; i++) {
          await supabase.from("experience_roles").update({ sort_order: i }).eq("id", reordered[i].id);
        }
        showToast("Role order updated");
      }
    }
    setRoleDragIndex(null);
    setRoleDragOverIndex(null);
    setRoleDragCompanyId(null);
    roleDragNodeRef.current = null;
  };


  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white mb-2">Experience</h1><p className="text-white/50">Manage companies and roles.</p></div>
        <button onClick={handleCreateCompany} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Plus className="w-5 h-5" /> Add Company
        </button>
      </motion.div>

      {/* Company Form */}
      <AnimatePresence>
        {(isCreatingCompany || editingCompany) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{isCreatingCompany ? "Add Company" : "Edit Company"}</h2>
              <button onClick={cancelCompanyForm} className="text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input placeholder="Company / Organization Name" value={companyForm.company} onChange={(e) => setCompanyForm({ ...companyForm, company: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
              <input placeholder="Location (optional)" value={companyForm.location} onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
            </div>
            <button onClick={handleSaveCompany} disabled={isSaving} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isCreatingCompany ? "Create" : "Save"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Company List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-white/20" /></div>
        ) : items.length > 0 ? (
          <>
            <p className="text-xs text-white/30 font-medium tracking-widest uppercase mb-2 flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5" />
              Drag to reorder companies
            </p>
            {items.map((item, i) => {
              const isExpanded = expandedCompanies.has(item.id);
              const activeRoles = item.roles.filter(r => r.is_current).length;

              return (
                <div key={item.id} className="space-y-0">
                  {/* Company Card */}
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(i, e)}
                    onDragOver={(e) => handleDragOver(i, e)}
                    onDragEnd={handleDragEnd}
                    onDragLeave={() => setDragOverIndex(null)}
                    className={`bg-white/5 border rounded-2xl p-4 sm:p-6 transition-all duration-300 select-none ${
                      dragOverIndex === i && dragIndex !== i
                        ? "border-neon-blue/50 bg-neon-blue/5 scale-[1.01]"
                        : "border-white/10 hover:bg-white/[0.07]"
                    } ${isExpanded ? "rounded-b-none border-b-0" : ""}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="cursor-grab active:cursor-grabbing shrink-0 p-1 -ml-1 text-white/20 hover:text-white/50 transition-colors">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-neon-purple" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <p className="text-white font-bold text-lg">{item.company}</p>
                            {activeRoles > 0 && <span className="px-2 py-0.5 rounded-full text-xs bg-neon-purple/20 text-neon-purple font-bold">{activeRoles} Active</span>}
                          </div>
                          {item.location && (
                            <p className="text-white/40 text-sm mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</p>
                          )}
                          <p className="text-white/30 text-sm mt-0.5">{item.roles.length} role{item.roles.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleCreateRole(item.id)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-green-400 hover:bg-green-400/10 transition-all duration-300" title="Add Role"><Plus className="w-4 h-4" /></button>
                        <button onClick={() => handleEditCompany(item)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteCompany(item.id)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"><Trash2 className="w-4 h-4" /></button>
                        <button onClick={() => toggleExpand(item.id)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Roles */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-white/[0.02] border border-white/10 border-t-0 rounded-b-2xl"
                      >
                        <div className="p-4 sm:p-6 space-y-3">
                          {item.roles.length > 0 ? (
                            <>
                              {item.roles.length > 1 && (
                                <p className="text-[10px] text-white/25 font-medium tracking-widest uppercase flex items-center gap-1.5">
                                  <GripVertical className="w-3 h-3" /> Drag to reorder roles
                                </p>
                              )}
                              {item.roles.map((role, ri) => (
                                <div
                                  key={role.id}
                                  draggable={item.roles.length > 1}
                                  onDragStart={(e) => handleRoleDragStart(item.id, ri, e)}
                                  onDragOver={(e) => handleRoleDragOver(ri, e)}
                                  onDragEnd={handleRoleDragEnd}
                                  onDragLeave={() => setRoleDragOverIndex(null)}
                                  className={`bg-white/5 border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 select-none ${
                                    roleDragOverIndex === ri && roleDragIndex !== ri && roleDragCompanyId === item.id
                                      ? "border-neon-purple/50 bg-neon-purple/5 scale-[1.01]"
                                      : "border-white/10 hover:bg-white/[0.05]"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {item.roles.length > 1 && (
                                      <div className="cursor-grab active:cursor-grabbing shrink-0 text-white/15 hover:text-white/40 transition-colors">
                                        <GripVertical className="w-4 h-4" />
                                      </div>
                                    )}
                                    <div className="w-2 h-2 rounded-full bg-neon-purple/40 shrink-0" />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-white font-semibold text-sm">{role.title}</p>
                                        {role.is_current && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-neon-purple/20 text-neon-purple font-bold">Current</span>}
                                      </div>
                                      <p className="text-white/35 text-xs mt-0.5">{role.start_date}{role.end_date ? ` – ${role.end_date}` : ""}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditRole(role)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"><Pencil className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleDeleteRole(role.id, item.id)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="text-center py-8 text-white/15">
                              <p className="text-sm font-medium">No roles yet</p>
                              <p className="text-xs mt-1">Click the <Plus className="w-3 h-3 inline" /> button above to add one.</p>
                            </div>
                          )}

                          {/* Role Form (inline) */}
                          <AnimatePresence>
                            {(isCreatingRole === item.id || (editingRole && item.roles.some(r => r.id === editingRole.id))) && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mt-3">
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-base font-bold text-white">{isCreatingRole ? "Add Role" : "Edit Role"}</h3>
                                  <button onClick={cancelRoleForm} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <input placeholder="Role Title" value={roleForm.title} onChange={(e) => setRoleForm({ ...roleForm, title: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-neon-blue focus:outline-none" />
                                  <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm">
                                    <input type="checkbox" checked={roleForm.is_current} onChange={(e) => setRoleForm({ ...roleForm, is_current: e.target.checked })} className="w-4 h-4 accent-blue-500" /> Current Role
                                  </label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <input placeholder="Start Date (e.g. Jan 2025)" value={roleForm.start_date} onChange={(e) => setRoleForm({ ...roleForm, start_date: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-neon-blue focus:outline-none" />
                                  <input placeholder="End Date (e.g. Present)" value={roleForm.end_date} onChange={(e) => setRoleForm({ ...roleForm, end_date: e.target.value })} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-neon-blue focus:outline-none" />
                                </div>
                                <textarea placeholder="Bullet points (one per line)" rows={3} value={roleForm.bullets.join("\n")} onChange={(e) => setRoleForm({ ...roleForm, bullets: e.target.value.split("\n") })} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm mb-4 focus:border-neon-blue focus:outline-none resize-none" />
                                <button onClick={() => handleSaveRole(item.id)} disabled={isSaving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm">
                                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isCreatingRole ? "Create Role" : "Save Role"}
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center py-24 text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No experience entries yet</p>
            <p className="text-sm">Add your first company above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
