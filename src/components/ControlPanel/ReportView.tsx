"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Location } from "@/types";
import { Send, Image as ImageIcon, Loader2 } from "lucide-react";

interface ReportViewProps {
    locations: Location[];
}

export const ReportView = ({ locations }: ReportViewProps) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        location_id: "",
        full_name: "",
        phone: "",
        address: "",
        condition: "Baik",
        description: "",
        image_url: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // If "Other" or empty location_id, we might want to handle it. 
            // Current schema expects UUID for location_id or null? 
            // Let's treat empty string as null.
            const payload = {
                ...formData,
                location_id: formData.location_id || null,
                status: "pending", // Default status
            };

            const { error } = await supabase.from("location_reports").insert([payload]);

            if (error) throw error;

            setSuccess(true);
            setFormData({
                location_id: "",
                full_name: "",
                phone: "",
                address: "",
                condition: "Baik",
                description: "",
                image_url: "",
            });

            // Auto reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Gagal mengirim laporan. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in zoom-in">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                    <Send className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Laporan Terkirim!</h3>
                <p className="text-slate-400 text-sm">
                    Terima kasih atas partisipasi Anda. Laporan akan ditinjau oleh admin.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                    Kirim Laporan Lain
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pb-20">
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">
                    Lokasi (Opsional)
                </label>
                <select
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm appearance-none"
                >
                    <option value="">-- Pilih Lokasi (Jika ada) --</option>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-200">
                            {loc.name}
                        </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-500 ml-1">
                    Kosongkan jika lokasi baru atau tidak terdaftar.
                </p>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">
                    Nama Pelapor <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">
                        No. HP <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="08..."
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">
                        Kondisi
                    </label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm"
                    >
                        <option value="Baik" className="bg-slate-900">Baik</option>
                        <option value="Rusak Ringan" className="bg-slate-900">Rusak Ringan</option>
                        <option value="Rusak Berat" className="bg-slate-900">Rusak Berat</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">
                    Alamat / Dusun <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Alamat Anda atau Lokasi"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">
                    Keterangan Lengkap
                </label>
                <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Jelaskan detail kondisi infrastruktur..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm resize-none"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1 flex items-center gap-2">
                    Bukti Foto (URL)
                    <ImageIcon className="w-3 h-3 text-slate-500" />
                </label>
                <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all text-sm"
                />
                <p className="text-[10px] text-slate-500 ml-1">
                    Masukkan link gambar jika ada.
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mengirim...
                    </>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        Kirim Laporan
                    </>
                )}
            </button>
        </form>
    );
};
