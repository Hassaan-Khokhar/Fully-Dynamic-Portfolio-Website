"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, MapPin, Mail, Phone, CheckCircle, Loader2, Image as ImageIcon, FileText, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ 
    location: "", 
    email: "", 
    phone: "", 
    linkedin: "", 
    github: "",
    hero_taglines: "",
    hero_bio: "",
    hero_image: "",
    resume_url: "",
    about_text: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contact_info").select("*").single();
    if (error) console.error(error);
    else if (data) {
      setForm({ 
        location: data.location || "", 
        email: data.email || "", 
        phone: data.phone || "",
        linkedin: data.linkedin || "",
        github: data.github || "",
        hero_taglines: data.hero_taglines || "",
        hero_bio: data.hero_bio || "",
        hero_image: data.hero_image || "",
        resume_url: data.resume_url || "",
        about_text: data.about_text || ""
      });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "hero_image" | "resume_url") => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(field);
    
    // 1. Delete old file if it exists in Supabase
    const oldUrl = form[field];
    if (oldUrl && oldUrl.includes("/storage/v1/object/public/assets/")) {
      const oldPath = oldUrl.split("/assets/").pop();
      if (oldPath) {
        await supabase.storage.from("assets").remove([oldPath]);
      }
    }

    // 2. Upload new file
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${field}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("assets")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
    } else {
      const { data: urlData } = supabase.storage
        .from("assets")
        .getPublicUrl(filePath);
      
      setForm({ ...form, [field]: urlData.publicUrl });
    }
    setUploading(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { data: existing } = await supabase.from("contact_info").select("id").single();
    
    if (existing) {
      await supabase.from("contact_info").update(form).eq("id", existing.id);
    } else {
      await supabase.from("contact_info").insert([form]);
    }

    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="w-12 h-12 animate-spin text-white/20" /></div>;
  }

  return (
    <div className="pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/50">Manage your portfolio configuration.</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Contact Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Contact & Socials</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-neon-blue" /></div>
              <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-neon-purple" /></div>
              <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-neon-blue" /></div>
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0"><LinkedinIcon className="w-5 h-5 text-sky-400" /></div>
              <input placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><GithubIcon className="w-5 h-5 text-white" /></div>
              <input placeholder="GitHub URL" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" />
            </div>
          </div>
        </motion.div>

        {/* Hero Section Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">Taglines (comma separated)</label>
              <input 
                placeholder="Full Stack Developer, Flutter Engineer, System Designer" 
                value={form.hero_taglines} 
                onChange={(e) => setForm({ ...form, hero_taglines: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2">Bio Paragraph</label>
              <textarea 
                rows={4}
                placeholder="Short biography for the hero section..." 
                value={form.hero_bio} 
                onChange={(e) => setForm({ ...form, hero_bio: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none resize-none" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Profile Image</label>
                <label className="relative flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all overflow-hidden group">
                  {form.hero_image ? (
                    <img src={form.hero_image} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity" />
                  ) : null}
                  {uploading === "hero_image" ? (
                    <Loader2 className="w-6 h-6 text-neon-blue animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-white/30 mb-2" />
                      <span className="text-xs text-white/30">Upload Photo</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "hero_image")} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">Resume (PDF)</label>
                <label className="relative flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-white/10 bg-white/5 cursor-pointer hover:bg-white/10 transition-all group">
                  {uploading === "resume_url" ? (
                    <Loader2 className="w-6 h-6 text-neon-blue animate-spin" />
                  ) : (
                    <>
                      <FileText className={`w-6 h-6 ${form.resume_url ? "text-green-400" : "text-white/30"} mb-2`} />
                      <span className="text-xs text-white/30">{form.resume_url ? "Resume Linked" : "Upload PDF"}</span>
                    </>
                  )}
                  <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleFileUpload(e, "resume_url")} />
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Me Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 xl:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6">About Me Section</h2>
          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">About Text</label>
            <textarea 
              rows={6}
              placeholder="Write your About Me paragraph here..." 
              value={form.about_text} 
              onChange={(e) => setForm({ ...form, about_text: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-neon-blue focus:outline-none resize-none" 
            />
          </div>
        </motion.div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save All Settings
        </button>
        {saved && (
          <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-1 text-green-400 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> All changes saved successfully!
          </motion.span>
        )}
      </div>
    </div>
  );
}
