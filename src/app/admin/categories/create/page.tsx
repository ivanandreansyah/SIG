"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Save, HelpCircle, Layers, ArrowUpRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { Button, FormField, Input, LinkButton } from "@/components/Admin";

// Helper to render dynamic icons safely
const DynamicIcon = ({ name, className }: { name: string | null; className?: string }) => {
  if (!name) return <Layers className={className} />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Icon = (LucideIcons as any)[name];

  // Try PascalCase
  if (!Icon) {
    const pascalName = name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon = (LucideIcons as any)[pascalName];
  }

  // Fallback: Case-insensitive search
  if (!Icon) {
    const lowerName = name.toLowerCase().replace(/-/g, "");
    const foundKey = Object.keys(LucideIcons).find(
      (key) => key.toLowerCase() === lowerName
    );
    if (foundKey) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Icon = (LucideIcons as any)[foundKey];
    }
  }

  if (!Icon) return <Layers className={className} />;
  return <Icon className={className} />;
};

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "", // Added optional description field if needed in futureSchema, for now it's just state
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("categories").insert([
        {
          name: formData.name,
          icon: formData.icon || null,
        },
      ]);

      if (error) throw error;

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Gagal menambahkan kategori.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/categories"
          className="p-2.5 bg-slate-800/50 border border-white/10 rounded-xl hover:bg-slate-700/50 hover:border-purple-500/30 transition-all shadow-lg backdrop-blur-xl group"
        >
          <div className="text-slate-400 group-hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Tambah Kategori Baru</h1>
          <p className="text-slate-400 mt-1 text-sm">Buat kategori baru untuk pengelompokan lokasi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Informasi Kategori</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <FormField label="Nama Kategori" required>
                <Input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Pendidikan, Kesehatan, Wisata..."
                  className="mt-1.5"
                />
              </FormField>

              <div className="space-y-4">
                <FormField
                  label="Ikon Kategori"
                  hint="Masukkan nama ikon dari Lucide React (contoh: school, building, map-pin)"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        type="text"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        placeholder="Cari nama icon..."
                        className="mt-1.5"
                      />
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        <span>Lihat daftar ikon di</span>
                        <a
                          href="https://lucide.dev/icons"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-0.5"
                        >
                          lucide.dev/icons <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </FormField>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                <LinkButton href="/admin/categories" variant="secondary" className="hover:bg-white/5">
                  Batal
                </LinkButton>
                <Button type="submit" disabled={loading} className="px-6 shadow-purple-500/20">
                  <Save className="w-4 h-4" />
                  {loading ? "Menyimpan..." : "Simpan Kategori"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl sticky top-8">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5">
              <h2 className="text-lg font-semibold text-white">Preview Tampilan</h2>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="mb-6 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-24 h-24 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-2xl">
                  <div className="w-12 h-12 text-purple-400">
                    <DynamicIcon name={formData.icon || "layers"} className="w-full h-full" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                {formData.name || "Nama Kategori"}
              </h3>

              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  0 Subkategori
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Aktif
                </span>
              </div>

              <div className="w-full p-4 bg-slate-950/50 rounded-xl border border-white/5 text-left">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Detail Icon</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Input:</span>
                    <span className="font-mono text-slate-200">
                      {formData.icon || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className={formData.icon ? "text-green-400" : "text-slate-500"}>
                      {formData.icon ? "Terdeteksi" : "Menunggu input"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
