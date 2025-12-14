"use client";

import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Edit, Trash2, Layers, Search, LayoutGrid, List as ListIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import {
  LoadingState,
  LinkButton,
  ConfirmIconButton,
} from "@/components/Admin";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

interface Category {
  id: string;
  name: string;
  icon: string | null;
  subcategories: { count: number }[];
}

// Helper to render dynamic icons safely
const DynamicIcon = ({ name, className }: { name: string | null; className?: string }) => {
  if (!name) return <Layers className={className} />;

  // 1. Try direct match
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Icon = (LucideIcons as any)[name];

  // 2. Try PascalCase (e.g. "school" -> "School", "map-pin" -> "MapPin")
  if (!Icon) {
    const pascalName = name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Icon = (LucideIcons as any)[pascalName];
  }

  // 3. Fallback: Case-insensitive search
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

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*, subcategories(count)")
      .order("name");

    if (error) throw error;
    return data || [];
  }, []);

  const {
    data: categoriesData,
    loading,
    refetch,
  } = useSupabaseQuery<Category[]>(fetchCategories);
  const categories = categoriesData || [];

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Gagal menghapus kategori.");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
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
            <h1 className="text-3xl font-bold text-white tracking-tight">Kelola Kategori</h1>
            <p className="text-slate-400 mt-1">Atur kategori dan ikon untuk peta.</p>
          </div>
        </div>
        <LinkButton href="/admin/categories/create" className="shadow-purple-500/20">
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </LinkButton>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-lg">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
          />
        </div>
        <div className="flex bg-slate-950/50 rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-all ${viewMode === "grid"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
              }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-all ${viewMode === "list"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
              }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-white/10 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 ring-1 ring-white/10">
            <Layers className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white">Tidak ada kategori ditemukan</h3>
          <p className="text-slate-400 text-sm mt-1">Coba kata kunci lain atau tambahkan kategori baru.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-slate-800/60 hover:border-purple-500/30 transition-all group flex flex-col justify-between h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <Link href={`/admin/categories/${category.id}`}>
                  <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors bg-slate-900/80 backdrop-blur-sm">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <ConfirmIconButton
                  variant="danger"
                  confirmMessage="Hapus kategori ini beserta subkategorinya?"
                  onConfirm={() => handleDelete(category.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors bg-slate-900/80 backdrop-blur-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </ConfirmIconButton>
              </div>

              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                  <DynamicIcon name={category.icon} className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-400 font-mono text-xs opacity-60">
                  {category.icon || "No Icon"}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500/50"></span>
                  {category.subcategories[0]?.count || 0} Subkategori
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Icon ID</th>
                <th className="px-6 py-4 font-semibold">Subkategori</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-white/10">
                        <DynamicIcon name={category.icon} className="w-4 h-4 text-slate-300" />
                      </div>
                      <span className="font-medium text-slate-200">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                    {category.icon || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/10">
                      {category.subcategories[0]?.count || 0} items
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/categories/${category.id}`}>
                        <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <ConfirmIconButton
                        variant="danger"
                        confirmMessage="Hapus kategori ini?"
                        onConfirm={() => handleDelete(category.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </ConfirmIconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
