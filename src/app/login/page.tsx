"use client";

import { Lock, User, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = use(searchParams);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
        >
          <div className="p-1 rounded-lg bg-slate-800/50 border border-white/10 group-hover:border-white/20 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Kembali ke Peta</span>
        </Link>

        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10 p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Login Admin</h1>
            <p className="text-slate-400 mt-2 text-sm max-w-[260px]">
              Masuk untuk mengelola data spasial, kategori, dan laporan masyarakat.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Username atau password salah.
            </div>
          )}

          <form method="POST" action="/api/login" className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 ml-1">
                Username
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 ml-1">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
            >
              Masuk Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Sistem Informasi Geografis Desa Mulyoharjo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
