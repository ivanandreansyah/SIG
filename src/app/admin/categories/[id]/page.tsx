"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Save, Plus, Trash2, ArrowLeft, Layers } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { ConfirmIconButton } from "@/components/Admin";

interface Subcategory {
  id: string;
  name: string;
}

// Helper to render dynamic icons safely
const DynamicIcon = ({ name, className }: { name: string | null; className?: string }) => {
  if (!name) return <Layers className={className} />;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Icon = (LucideIcons as any)[name];
  if (!Icon) {
    const pascalName = name.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon = (LucideIcons as any)[pascalName];
  }
  if (!Icon) {
    const lowerName = name.toLowerCase().replace(/-/g, "");
    const foundKey = Object.keys(LucideIcons).find((key) => key.toLowerCase() === lowerName);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (foundKey) Icon = (LucideIcons as any)[foundKey];
  }
  if (!Icon) return <Layers className={className} />;
  return <Icon className={className} />;
};

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [formData, setFormData] = useState({ name: "", icon: "" });
  const [newSubcategory, setNewSubcategory] = useState("");

  useEffect(() => {
    Promise.all([fetchCategory(), fetchSubcategories()]);
  }, [id]);

  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
      if (error) throw error;
      if (data) setFormData({ name: data.name, icon: data.icon || "" });
    } catch (error) {
      console.error("Error fetching category:", error);
      // alert("Gagal memuat data kategori."); // Removed alert for cleaner UX, could add toast
      router.push("/admin/categories");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data, error } = await supabase.from("subcategories").select("*").eq("category_id", id).order("created_at", { ascending: true });
      if (error) throw error;
      if (data) setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from("categories").update({ name: formData.name, icon: formData.icon || null }).eq("id", id);
      if (error) throw error;
      alert("Kategori berhasil diperbarui.");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Gagal memperbarui kategori.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcategory.trim()) return;
    try {
      const { error } = await supabase.from("subcategories").insert([{ category_id: id, name: newSubcategory }]);
      if (error) throw error;
      setNewSubcategory("");
      fetchSubcategories();
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert("Gagal menambahkan subkategori.");
    }
  };

  const handleDeleteSubcategory = async (subId: string) => {
    try {
      const { error } = await supabase.from("subcategories").delete().eq("id", subId);
      if (error) throw error;
      fetchSubcategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("Gagal menghapus subkategori.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 animate-pulse">Memuat data kategori...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/categories"
          className="p-3 bg-slate-800/50 border border-white/10 rounded-xl hover:bg-slate-700/50 hover:border-purple-500/30 transition-all shadow-lg backdrop-blur-xl group"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Kategori</h1>
          <p className="text-slate-400 mt-1">Sesuaikan informasi kategori dan sub-kategori.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Informasi Utama
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Nama Kategori</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                    placeholder="Contoh: Pariwisata"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Icon ID <span className="text-slate-500 font-normal ml-1">(Lucide React Icon Name)</span>
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all font-mono text-sm"
                    placeholder="e.g. MapPin, star, building..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Cek <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">referensi icon</a> untuk melihat daftar nama icon yang tersedia.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Subcategories Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl h-full flex flex-col">
            <div className="p-6 border-b border-white/10 bg-slate-800/20">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                Sub-kategori
              </h2>
            </div>

            <div className="p-4 bg-slate-950/30 border-b border-white/5">
              <form onSubmit={handleAddSubcategory} className="flex gap-2">
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="Tambah sub-item..."
                  className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newSubcategory.trim()}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="flex-1 p-2 overflow-y-auto max-h-[500px] space-y-1 custom-scrollbar">
              {subcategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <Layers className="w-10 h-10 text-slate-600 mb-2" />
                  <p className="text-sm text-slate-400">Belum ada sub-kategori.</p>
                </div>
              ) : (
                subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                        {sub.name}
                      </span>
                    </div>

                    <ConfirmIconButton
                      variant="danger"
                      confirmMessage="Apakah Anda yakin ingin menghapus sub-kategori ini?"
                      onConfirm={() => handleDeleteSubcategory(sub.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </ConfirmIconButton>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
