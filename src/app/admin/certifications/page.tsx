"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, ShieldCheck, Upload, FileText, Loader2, Image as ImageIcon, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Certification } from "@/data/certifications";
import { useToast } from "@/components/Toast";

interface CertFormData {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verifyUrl: string;
  fileUrl: string;
  fileType: "image" | "pdf";
}

const emptyForm: CertFormData = {
  title: "",
  issuer: "",
  date: "",
  credentialId: "",
  verifyUrl: "",
  fileUrl: "",
  fileType: "image",
};

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<CertFormData>(emptyForm);
  const [pendingFile, setPendingFile] = useState<{ file: File; preview: string } | null>(null);
  const [pendingDeletion, setPendingDeletion] = useState<string>("");
  const { showToast } = useToast();

  // Drag-and-drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching certifications:", error);
    } else {
      const mapped: Certification[] = (data || []).map((c) => ({
        id: c.id,
        title: c.title,
        issuer: c.issuer,
        date: c.date,
        credentialId: c.credential_id,
        verifyUrl: c.verify_url,
        fileUrl: c.file_url,
        fileType: c.file_type as "image" | "pdf",
        gradient: c.gradient,
        sortOrder: c.sort_order,
      }));
      setCertifications(mapped);
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
    // Make the drag ghost semi-transparent
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
      const reordered = [...certifications];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dragOverIndex, 0, moved);

      // Optimistically update the UI
      setCertifications(reordered);

      // Batch-update sort_order in Supabase
      const updates = reordered.map((cert, i) => ({
        id: cert.id,
        sort_order: i,
      }));

      for (const update of updates) {
        await supabase
          .from("certifications")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }

      showToast("Order updated successfully");
    }

    setDragIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  // ═══════════════════════════════════════════
  // CRUD Handlers
  // ═══════════════════════════════════════════

  const handleCreate = () => {
    setIsCreating(true);
    setEditing(null);
    setForm(emptyForm);
    setPendingFile(null);
    setPendingDeletion("");
  };

  const handleEdit = (cert: Certification) => {
    setEditing(cert);
    setIsCreating(false);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      credentialId: cert.credentialId,
      verifyUrl: cert.verifyUrl,
      fileUrl: cert.fileUrl,
      fileType: cert.fileType,
    });
    setPendingFile(null);
    setPendingDeletion("");
  };

  const handleCancel = () => {
    setEditing(null);
    setIsCreating(false);
    setForm(emptyForm);
    if (pendingFile) {
      URL.revokeObjectURL(pendingFile.preview);
    }
    setPendingFile(null);
    setPendingDeletion("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    
    if (!isPdf && !isImage) {
      showToast("Only images and PDF files are allowed", "error");
      return;
    }

    if (pendingFile) {
      URL.revokeObjectURL(pendingFile.preview);
    }

    setPendingFile({
      file,
      preview: URL.createObjectURL(file),
    });
    
    setForm({ ...form, fileType: isPdf ? "pdf" : "image" });
  };

  const removeExistingFile = () => {
    if (form.fileUrl) {
      setPendingDeletion(form.fileUrl);
    }
    setForm({ ...form, fileUrl: "" });
  };

  const removePendingFile = () => {
    if (pendingFile) {
      URL.revokeObjectURL(pendingFile.preview);
      setPendingFile(null);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.issuer.trim() || !form.date.trim()) {
      showToast("Title, Issuer, and Date are required", "error");
      return;
    }

    setIsSaving(true);

    let finalFileUrl = form.fileUrl;
    let finalFileType = form.fileType;

    if (pendingFile) {
      const fileExt = pendingFile.file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("certifications")
        .upload(fileName, pendingFile.file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        showToast("Failed to upload file", "error");
        setIsSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("certifications")
        .getPublicUrl(fileName);

      finalFileUrl = urlData.publicUrl;
      finalFileType = pendingFile.file.type === "application/pdf" ? "pdf" : "image";
    }

    if (pendingDeletion) {
      const oldFileName = pendingDeletion.split("/").pop();
      if (oldFileName) {
        await supabase.storage.from("certifications").remove([oldFileName]);
      }
    }

    const dbData = {
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      date: form.date.trim(),
      credential_id: form.credentialId.trim(),
      verify_url: form.verifyUrl.trim(),
      file_url: finalFileUrl,
      file_type: finalFileType,
      sort_order: isCreating ? certifications.length : undefined,
    };

    if (isCreating) {
      const { error } = await supabase.from("certifications").insert([dbData]);
      if (error) {
        console.error("Create error:", error);
        showToast("Failed to create certification", "error");
      } else {
        showToast("Certification created successfully");
      }
    } else if (editing) {
      const { error } = await supabase.from("certifications").update(dbData).eq("id", editing.id);
      if (error) {
        console.error("Update error:", error);
        showToast("Failed to update certification", "error");
      } else {
        showToast("Certification updated successfully");
      }
    }

    handleCancel();
    setIsSaving(false);
    fetchCertifications();
  };

  const handleDelete = async (cert: Certification) => {
    if (!confirm(`Delete "${cert.title}"? This action cannot be undone.`)) return;

    if (cert.fileUrl) {
      const fileName = cert.fileUrl.split("/").pop();
      if (fileName) {
        await supabase.storage.from("certifications").remove([fileName]);
      }
    }

    const { error } = await supabase.from("certifications").delete().eq("id", cert.id);
    if (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete certification", "error");
    } else {
      showToast("Certification deleted", "delete");
      fetchCertifications();
    }
  };

  const showForm = isCreating || editing;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Certifications</h1>
          <p className="text-white/50">Manage your verified credentials and certificates.</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Certificate
        </button>
      </motion.div>

      {/* Form Panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {isCreating ? "Add Certificate" : "Edit Certificate"}
              </h2>
              <button onClick={handleCancel} className="text-white/40 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Row 1: Title & Issuer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Certificate Title *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300"
              />
              <input
                placeholder="Issuer (e.g. Google, Coursera) *"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Row 2: Date, Credential ID, Verify URL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                placeholder="Issue Date (e.g. Aug 2024) *"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300"
              />
              <input
                placeholder="Credential ID (optional)"
                value={form.credentialId}
                onChange={(e) => setForm({ ...form, credentialId: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300"
              />
              <input
                placeholder="Verification URL (optional)"
                value={form.verifyUrl}
                onChange={(e) => setForm({ ...form, verifyUrl: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300"
              />
            </div>

            {/* File Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-white/70 mb-4">
                Certificate File (Image or PDF)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Existing uploaded file */}
                {form.fileUrl && !pendingDeletion && (
                  <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    {form.fileType === "pdf" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/5">
                        <FileText className="w-12 h-12 text-red-400 mb-2" />
                        <span className="text-xs text-white/50 font-mono">PDF Document</span>
                      </div>
                    ) : (
                      <img src={form.fileUrl} alt="Certificate" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={removeExistingFile}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Pending upload */}
                {pendingFile && (
                  <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border-2 border-neon-blue/50 bg-white/5">
                    {pendingFile.file.type === "application/pdf" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-neon-blue/5">
                        <FileText className="w-12 h-12 text-neon-blue mb-2" />
                        <span className="text-xs text-white/50 font-mono truncate max-w-[90%]">{pendingFile.file.name}</span>
                      </div>
                    ) : (
                      <img src={pendingFile.preview} alt="Preview" className="w-full h-full object-cover opacity-70" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-bold text-white bg-black/60 px-2 py-1 rounded">Pending Save</span>
                    </div>
                    <button
                      onClick={removePendingFile}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Upload button */}
                <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-neon-blue/30 transition-all duration-300">
                  <Upload className="w-6 h-6 text-white/30 mb-2" />
                  <span className="text-xs text-white/30 font-medium text-center px-2">Upload Image or PDF</span>
                  <input
                    type="file"
                    accept="image/*,.pdf,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isCreating ? "Create Certificate" : "Save Changes"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certifications List — Drag & Drop Enabled */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/20">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="font-medium tracking-widest uppercase text-xs">Fetching certifications...</p>
          </div>
        ) : certifications.length > 0 ? (
          <>
            <p className="text-xs text-white/30 font-medium tracking-widest uppercase mb-2 flex items-center gap-2">
              <GripVertical className="w-3.5 h-3.5" />
              Drag to reorder
            </p>
            {certifications.map((cert, i) => (
              <div
                key={cert.id}
                draggable
                onDragStart={(e) => handleDragStart(i, e)}
                onDragOver={(e) => handleDragOver(i, e)}
                onDragEnd={handleDragEnd}
                onDragLeave={() => setDragOverIndex(null)}
                className={`bg-white/5 border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 group select-none ${
                  dragOverIndex === i && dragIndex !== i
                    ? "border-neon-blue/50 bg-neon-blue/5 scale-[1.01]"
                    : "border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing shrink-0 p-1 -ml-1 text-white/20 hover:text-white/50 transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center shrink-0">
                    {cert.fileType === "pdf" ? (
                      <FileText className="w-6 h-6 text-red-400" />
                    ) : cert.fileUrl ? (
                      <ImageIcon className="w-6 h-6 text-neon-blue" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-neon-blue" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-bold text-lg truncate">{cert.title}</p>
                    <p className="text-neon-purple text-sm mt-1">{cert.issuer}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white/50">
                        {cert.date}
                      </span>
                      {cert.fileUrl && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${cert.fileType === "pdf" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-neon-blue/10 border-neon-blue/20 text-neon-blue"}`}>
                          {cert.fileType === "pdf" ? "PDF" : "Image"}
                        </span>
                      )}
                      {cert.credentialId && (
                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/40">
                          {cert.credentialId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert)}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-24 text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No certifications yet</p>
            <p className="text-sm">Add your first verified credential above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
