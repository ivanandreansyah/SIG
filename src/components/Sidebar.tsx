"use client";

import {
  Map as MapIcon,
  CircleUser,
  MapPinned,
  Settings,
  Table2,
  TrendingUp,
  LayoutDashboard,
  ClipboardList,
  Plus,
  LogOut,
  MessageSquarePlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { ViewType } from "@/constants";

interface SidebarProps {
  currentView?: ViewType;
  onViewChange?: (view: ViewType) => void;
  onPanelOpen?: () => void;
  isPanelOpen?: boolean;
  onPanelToggle?: (isOpen: boolean) => void;
  mode?: "map" | "admin";
}

// Map Navigation items
const MAP_NAV_ITEMS: { view: ViewType; icon: any; title: string }[] = [
  { view: "layers", icon: MapPinned, title: "Peta & Filter" },
  { view: "list", icon: Table2, title: "Daftar Lokasi" },
  { view: "statistics", icon: TrendingUp, title: "Statistik" },
  { view: "report", icon: MessageSquarePlus, title: "Lapor Pembaruan" },
  { view: "profile", icon: CircleUser, title: "Profil" },
];

// Admin Navigation items
const ADMIN_NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, title: "Dashboard" },
  { href: "/admin/locations/create", icon: Plus, title: "Tambah Lokasi" },
  { href: "/admin/reports", icon: ClipboardList, title: "Laporan" },
];

const Sidebar = ({
  currentView = "layers",
  onViewChange,
  onPanelOpen,
  isPanelOpen,
  onPanelToggle,
  mode = "map",
}: SidebarProps) => {
  const pathname = usePathname();

  const handleClick = useCallback(
    (view: ViewType) => {
      if (mode === "map") {
        if (view === currentView && isPanelOpen) {
          onPanelToggle?.(false);
        } else {
          onViewChange?.(view);
          onPanelToggle?.(true);
        }
      } else {
        onViewChange?.(view);
        onPanelOpen?.();
      }
    },
    [currentView, isPanelOpen, mode, onViewChange, onPanelToggle, onPanelOpen]
  );

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 h-16 px-6 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/20 flex items-center gap-4 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
      {/* Logo - Hidden on small screens, minimal on large */}
      <Link
        href="/"
        className="hidden md:flex items-center gap-2 group cursor-pointer mr-2"
        title="Peta Mulyoharjo"
      >
        <div className="p-2 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300">
          <MapIcon className="text-white w-4 h-4" />
        </div>
      </Link>

      {/* Divider */}
      <div className="hidden md:block w-px h-8 bg-white/10" />

      {/* Navigation */}
      <nav className="flex items-center gap-2">
        {mode === "map"
          ? // Map Mode Navigation
          MAP_NAV_ITEMS.map(({ view, icon: Icon, title }) => (
            <button
              key={view}
              onClick={() => handleClick(view)}
              className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer relative group overflow-hidden flex items-center justify-center ${currentView === view
                ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 -translate-y-1"
                : "text-slate-400 hover:bg-white/10 hover:text-white hover:-translate-y-1"
                }`}
              title={title}
            >
              {currentView === view && (
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
              )}
              <Icon
                className={`w-5 h-5 relative z-10 ${currentView === view ? "scale-105" : "group-hover:scale-110"
                  } transition-transform`}
              />
              {/* Active Dot */}
              {currentView === view && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-lg shadow-white/50 opacity-0" />
              )}
            </button>
          ))
          : // Admin Mode Navigation
          ADMIN_NAV_ITEMS.map(({ href, icon: Icon, title }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer relative group overflow-hidden flex items-center justify-center ${isActive
                  ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 -translate-y-1"
                  : "text-slate-400 hover:bg-white/10 hover:text-white hover:-translate-y-1"
                  }`}
                title={title}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 ${isActive ? "" : "group-hover:scale-110"
                    } transition-transform`}
                />
              </Link>
            );
          })}
      </nav>

      {/* Divider */}
      <div className="w-px h-8 bg-white/10 mx-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {mode === "map" ? (
          <button
            onClick={() => handleClick("settings")}
            className={`p-2.5 rounded-xl transition-all duration-300 cursor-pointer relative group overflow-hidden ${currentView === "settings"
              ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 -translate-y-1"
              : "text-slate-400 hover:bg-white/10 hover:text-white hover:-translate-y-1"
              }`}
            title="Pengaturan"
          >
            <Settings
              className={`w-5 h-5 relative z-10 ${currentView === "settings" ? "" : "group-hover:rotate-90"
                } transition-transform duration-300`}
            />
          </button>
        ) : (
          <Link
            href="/"
            className="p-2.5 rounded-xl text-red-400 hover:bg-gradient-to-br hover:from-red-600 hover:to-pink-600 hover:text-white transition-all duration-300 cursor-pointer group relative overflow-hidden hover:-translate-y-1"
            title="Keluar dari Admin"
          >
            <LogOut className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
