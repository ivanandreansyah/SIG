"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LocationReport } from "@/types";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Phone,
  RotateCcw,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/Admin";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<LocationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("location_reports")
        .select("*, locations(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports((data || []) as LocationReport[]);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "rejected":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
  };

  const getStatusLabel = (status: LocationReport["status"]) => {
    switch (status) {
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      default:
        return "Menunggu";
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: LocationReport["status"]
  ) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("location_reports")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Gagal memperbarui status laporan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return;

    try {
      const { error } = await supabase
        .from("location_reports")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Gagal menghapus laporan.");
    }
  };

  return (
    <div>
      <PageHeader
        title="Laporan Masuk"
        description="Daftar laporan pembaruan dari pengunjung"
        backHref="/admin"
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Memuat laporan...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <AlertCircle className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white">
            Belum ada laporan
          </h3>
          <p className="text-slate-400 mt-1 text-sm max-w-sm mx-auto">
            Belum ada pengunjung yang mengirimkan laporan pembaruan untuk saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 group"
            >
              <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium capitalize tracking-wide ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {getStatusLabel(report.status)}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(report.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>

                <h3 className="font-bold text-white mb-1 line-clamp-1 text-lg">
                  {/* @ts-ignore - Supabase join returns object */}
                  {report.locations?.name || "Lokasi Baru / Tidak Diketahui"}
                </h3>
                <div className="text-sm text-slate-400 mb-5 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${report.condition === 'Baik' ? 'bg-emerald-500' : report.condition === 'Rusak Ringan' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  Kondisi:{" "}
                  <span className="font-medium text-slate-200">{report.condition}</span>
                </div>

                <div className="space-y-3 border-t border-white/5 pt-4 mb-4">
                  <div className="flex items-start gap-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">
                        {report.full_name}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {report.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs tracking-wide">{report.phone}</span>
                  </div>
                </div>

                {report.description && (
                  <div className="mb-4 p-3 bg-slate-800/50 rounded-xl text-sm text-slate-400 italic border border-white/5">
                    "{report.description}"
                  </div>
                )}

                {report.image_url && (
                  <div className="mb-4">
                    <a
                      href={report.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Lihat Foto Bukti
                    </a>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-2">
                  {report.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(report.id, "approved")}
                      disabled={updatingId === report.id}
                      className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-50 cursor-pointer transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Setujui
                    </button>
                  )}

                  {report.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(report.id, "rejected")}
                      disabled={updatingId === report.id}
                      className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 disabled:opacity-50 cursor-pointer transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                  )}

                  {(report.status === 'approved' || report.status === 'rejected') && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(report.id, "pending")}
                      disabled={updatingId === report.id}
                      className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700 disabled:opacity-50 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(report.id)}
                    className="inline-flex items-center justify-center p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 cursor-pointer transition-all"
                    title="Hapus Laporan"
                  >
                    {/* Trash icon implies delete more cleanly than text sometimes in tight spaces, but sticking to text if space permits. Or icon only for secondary action. */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
