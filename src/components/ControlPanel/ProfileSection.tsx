"use client";

import { Shield, LogIn, LayoutDashboard, LogOut, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProfileSection = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const hasAdminCookie = document.cookie
        .split(";")
        .map((c) => c.trim())
        .some((c) => c.startsWith("admin_auth=") && c.includes("1"));

      setIsAdmin(hasAdminCookie);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false); // Default to false on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center backdrop-blur-sm">

          {/* Avatar */}
          <div className="relative mb-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-2xl border-4 border-slate-900 ${isAdmin
                ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
                : "bg-gradient-to-br from-slate-700 to-slate-600 text-slate-300"
              }`}>
              {isAdmin ? "A" : "G"}
            </div>
            {isAdmin && (
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-4 border-slate-900 shadow-sm" title="Verified Admin">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* User Info */}
          <h3 className="text-lg font-bold text-white mb-1">
            {isAdmin ? "Administrator" : "Pengunjung Tamu"}
          </h3>
          <p className="text-xs text-slate-400 mb-4 px-4 leading-relaxed">
            {isAdmin
              ? "Akses penuh untuk mengelola data lokasi, kategori, dan pengaturan sistem."
              : "Anda sedang mengakses mode lihat-saja. Silakan masuk untuk akses fitur admin."}
          </p>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium border ${isAdmin
              ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
              : "bg-slate-700/30 border-slate-600/30 text-slate-400"
            }`}>
            {isAdmin ? (
              <>
                <Shield className="w-3 h-3" />
                <span>Super Administrator</span>
              </>
            ) : (
              <>
                <User className="w-3 h-3" />
                <span>Public Access</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {isAdmin ? (
          <>
            <Link
              href="/admin"
              className="group relative w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-purple-900/20 border border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <LayoutDashboard className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Dashboard Admin</span>
            </Link>

            {/* Manage Sub-actions (Visual only for now) */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/categories" className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all group">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-300">Kategori</span>
              </Link>
              <Link href="/admin" className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all group">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-300">Keamanan</span>
              </Link>
            </div>

            <a
              href="/api/logout"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-medium rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Sesi</span>
            </a>
          </>
        ) : (
          <Link
            href="/login"
            className="group relative w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all border border-white/10 overflow-hidden shadow-lg shadow-black/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <LogIn className="w-4 h-4 relative z-10 text-purple-400 group-hover:text-white transition-colors" />
            <span className="relative z-10">Masuk sebagai Admin</span>
          </Link>
        )}
      </div>

      {/* Footer / Version */}
      <div className="pt-4 border-t border-white/5 text-center">
        <p className="text-[10px] text-slate-600">
          Sistem Informasi Geografis v1.0.0
          <br />
          &copy; 2024 Desa Mulyoharjo
        </p>
      </div>
    </div>
  );
};
