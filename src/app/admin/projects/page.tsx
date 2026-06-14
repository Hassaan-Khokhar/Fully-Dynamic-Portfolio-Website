"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, FolderKanban, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Project } from "@/data/projects";
import { useToast } from "@/components/Toast";

export default function AdminProjectsPage() {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<{file: File, preview: string}[]>([]);
  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);
  const { showToast } = useToast();

  const emptyProject: Project = {
    id: "",
    title: "",
    description: "",
    longDescription: "",
    tags: [],
    tagColors: [],
    hoverColor: "group-hover:text-sky-400",
    features: [],
    techStack: [],
    images: [],
    action: "[VIEW PROJECT]",
  };

  const [formData, setFormData] = useState<Project>(emptyProject);
  const [tagsRaw, setTagsRaw] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      const mappedProjects: Project[] = (data || []).map((p): Project => ({
        id: p.id,
        title: p.title,
        description: p.description,
        longDescription: p.long_description,
        tags: p.tags,
        tagColors: p.tag_colors,
        hoverColor: p.hover_color,
        features: p.features,
        techStack: p.tech_stack,
        images: p.images,
        liveUrl: p.live_url,
        githubUrl: p.github_url,
        action: p.action,
        reverse: p.reverse,
      }));
      setProjectsList(mappedProjects);
    }
    setLoading(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setTagsRaw(project.tags.join(", "));
    setIsCreating(false);
    setPendingUploads([]);
    setPendingDeletions([]);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingProject(null);
    setFormData(emptyProject);
    setTagsRaw("");
    setPendingUploads([]);
    setPendingDeletions([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const newUploads = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPendingUploads([...pendingUploads, ...newUploads]);
  };

  const removeImage = (index: number) => {
    const urlToRemove = formData.images[index];
    setPendingDeletions([...pendingDeletions, urlToRemove]);
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const removePendingUpload = (index: number) => {
    const newUploads = [...pendingUploads];
    URL.revokeObjectURL(newUploads[index].preview);
    newUploads.splice(index, 1);
    setPendingUploads(newUploads);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    let finalImageUrls = [...formData.images];

    // Upload pending files
    for (const { file } of pendingUploads) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
      } else {
        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(filePath);
        finalImageUrls.push(urlData.publicUrl);
      }
    }

    // Delete removed images from storage
    const filesToDelete = pendingDeletions.map(url => url.split('/').pop()!).filter(Boolean);
    if (filesToDelete.length > 0) {
      const { error } = await supabase.storage.from("project-images").remove(filesToDelete);
      if (error) console.error("Error deleting old images:", error);
    }
    
    const parsedTags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    const dbData = {
      title: formData.title,
      description: formData.description,
      long_description: formData.longDescription,
      tags: parsedTags,
      tag_colors: parsedTags.map(() => "bg-sky-500/20 text-sky-400"),
      hover_color: formData.hoverColor,
      features: formData.features,
      tech_stack: formData.techStack,
      images: finalImageUrls,
      live_url: formData.liveUrl,
      github_url: formData.githubUrl,
      action: formData.action,
      reverse: formData.reverse,
      slug: formData.title.toLowerCase().replace(/\s+/g, "-"),
    };

    if (isCreating) {
      const { error } = await supabase.from("projects").insert([dbData]);
      if (error) console.error("Error creating project:", error);
    } else if (editingProject) {
      const { error } = await supabase
        .from("projects")
        .update(dbData)
        .eq("id", editingProject.id);
      if (error) console.error("Error updating project:", error);
    }

    setEditingProject(null);
    setIsCreating(false);
    setFormData(emptyProject);
    setPendingUploads([]);
    setPendingDeletions([]);
    setIsSaving(false);
    showToast(isCreating ? "Project created successfully" : "Project updated successfully");
    fetchProjects();
  };

  const handleDelete = async (project: Project) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    // Delete images from storage first
    const filesToDelete = project.images.map(url => url.split('/').pop()!).filter(Boolean);
    if (filesToDelete.length > 0) {
      await supabase.storage.from("project-images").remove(filesToDelete);
    }

    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) {
      console.error("Error deleting project:", error);
      showToast("Failed to delete project", "error");
    } else {
      showToast("Project deleted successfully", "delete");
      fetchProjects();
    }
  };

  const handleCancel = () => {
    setEditingProject(null);
    setIsCreating(false);
    setFormData(emptyProject);
    setTagsRaw("");
    setPendingUploads([]);
    setPendingDeletions([]);
  };

  const showForm = isCreating || editingProject;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-white/50">Manage your portfolio projects in Supabase.</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </motion.div>

      {/* Form Modal */}
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
                {isCreating ? "Create New Project" : "Edit Project"}
              </h2>
              <button onClick={handleCancel} className="text-white/40 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Project Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300"
              />
              <input
                placeholder="Tags (comma separated)"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300"
              />
            </div>
            
            <textarea
              placeholder="Short Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300 mb-4 resize-none"
            />
            
            <textarea
              placeholder="Detailed Description"
              rows={4}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300 resize-none mb-4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <textarea
                placeholder="Features (one per line)"
                rows={3}
                value={formData.features.join("\n")}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value.split("\n").filter(Boolean) })
                }
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300 resize-none"
              />
              <textarea
                placeholder="Tech Stack (one per line)"
                rows={3}
                value={formData.techStack.join("\n")}
                onChange={(e) =>
                  setFormData({ ...formData, techStack: e.target.value.split("\n").filter(Boolean) })
                }
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none transition-all duration-300 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                placeholder="Live URL (optional)"
                value={formData.liveUrl || ""}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none"
              />
              <input
                placeholder="GitHub URL (optional)"
                value={formData.githubUrl || ""}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-neon-blue focus:outline-none"
              />
            </div>

            {/* Image Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-white/70 mb-4">
                Project Screenshots
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Existing Images */}
                {formData.images.map((img, i) => (
                  <div key={`existing-${i}`} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Pending Uploads */}
                {pendingUploads.map((upload, i) => (
                  <div key={`pending-${i}`} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-neon-blue/50 bg-white/5">
                    <img src={upload.preview} alt="Preview Upload" className="w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-bold text-white bg-black/60 px-2 py-1 rounded">Pending Save</span>
                    </div>
                    <button
                      onClick={() => removePendingUpload(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {/* Upload Button */}
                <label className="aspect-video rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-neon-blue/30 transition-all duration-300">
                  <Upload className="w-6 h-6 text-white/30 mb-2" />
                  <span className="text-xs text-white/30 font-medium">Select Photos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

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
              {isCreating ? "Create Project" : "Save Changes"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/20">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="font-medium tracking-widest uppercase text-xs">Fetching projects...</p>
          </div>
        ) : projectsList.length > 0 ? (
          projectsList.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.07] transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-6 h-6 text-neon-blue" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-bold text-lg truncate">{project.title}</p>
                  <p className="text-white/40 text-sm mt-1 truncate">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-neon-blue hover:bg-neon-blue/10 transition-all duration-300"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-24 text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No projects found</p>
            <p className="text-sm">Connect to Supabase and add your first project.</p>
          </div>
        )}
      </div>
    </div>
  );
}
