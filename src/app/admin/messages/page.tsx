"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Mail, Clock, Trash2, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setMessages(data || []);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("messages").update({ read: true }).eq("id", id);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    fetchMessages();
  };

  const handleOpenMessage = (msg: any) => {
    setSelectedMessage(msg);
    if (!msg.read) markAsRead(msg.id);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-white/50 mb-8">Contact form submissions in Supabase.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Desktop Header - hidden on mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-sm font-bold text-white/50 uppercase tracking-wider">
          <div className="col-span-1">Status</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-4">Subject</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-1"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-white/20" /></div>
        ) : messages.map((msg) => (
          <div key={msg.id} onClick={() => handleOpenMessage(msg)} className="cursor-pointer border-b border-white/5 hover:bg-white/[0.03] transition-all duration-300">
            {/* Desktop Row */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-5 items-center">
              <div className="col-span-1">{msg.read ? <Mail className="w-5 h-5 text-white/30" /> : <MessageSquare className="w-5 h-5 text-neon-blue" />}</div>
              <div className="col-span-3"><span className={`font-medium ${msg.read ? "text-white/50" : "text-white"}`}>{msg.name}</span></div>
              <div className="col-span-4"><span className={`text-sm ${msg.read ? "text-white/40" : "text-white/70"}`}>{msg.subject}</span></div>
              <div className="col-span-3 text-white/30 text-sm">{new Date(msg.created_at).toLocaleDateString()}</div>
              <div className="col-span-1 flex justify-end">
                <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {/* Mobile Card */}
            <div className="md:hidden flex items-start gap-3 px-4 py-4">
              <div className="shrink-0 mt-1">{msg.read ? <Mail className="w-5 h-5 text-white/30" /> : <MessageSquare className="w-5 h-5 text-neon-blue" />}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`font-medium truncate ${msg.read ? "text-white/50" : "text-white"}`}>{msg.name}</span>
                  <span className="text-white/30 text-xs shrink-0">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                <p className={`text-sm truncate mt-1 ${msg.read ? "text-white/40" : "text-white/70"}`}>{msg.subject}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} className="p-2 rounded-lg text-white/20 hover:text-red-400 shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        {messages.length === 0 && !loading && (
          <div className="px-6 py-16 text-center text-white/30">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No messages yet</p>
          </div>
        )}
      </motion.div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-2xl glass p-8 rounded-3xl border border-white/10 relative">
              <button onClick={() => setSelectedMessage(null)} className="absolute top-6 right-6 text-white/40 hover:text-white"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-8 pb-8 border-b border-white/5">
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {selectedMessage.name} ({selectedMessage.email})</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(selectedMessage.created_at).toLocaleString()}</span>
              </div>
              <div className="text-white/70 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
