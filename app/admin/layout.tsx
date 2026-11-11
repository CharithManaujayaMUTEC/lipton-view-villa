"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck, ExternalLink, Image as ImageIcon, LayoutDashboard, LogOut, Mail, Menu, MessageSquare, BedDouble, Settings, Tag, X, RotateCcw,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/SiteChrome";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/admin/media", label: "Photos & Videos", icon: ImageIcon },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/content", label: "Site Content", icon: Settings, adminOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, logout, data, resetDemo } = useStore();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!session) router.replace("/login");
    else if (session.role === "guest") router.replace("/account");
    else if (session.role === "manager" && path.startsWith("/admin/content")) router.replace("/admin");
  }, [session, path, router]);

  if (!session || session.role === "guest") return null;

  const unread = data.messages.filter((m) => !m.read).length;
  const pending = data.bookings.filter((b) => b.status === "pending").length;
  const items = NAV.filter((n) => !n.adminOnly || session.role === "admin");

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-900 p-4 text-white">
      <div className="mb-6 px-2 pt-1"><Logo light /></div>
      <nav className="flex-1 space-y-1">
        {items.map((n) => {
          const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
          const badge = n.href === "/admin/messages" ? unread : n.href === "/admin/bookings" ? pending : 0;
          return (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-white/15" : "text-white/70 hover:bg-white/10 hover:text-white")}>
              <n.icon size={18} /> {n.label}
              {badge > 0 && <span className="ml-auto rounded-full bg-brand-400 px-2 text-xs text-brand-900">{badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 pt-3 text-sm">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-white/70 hover:bg-white/10"><ExternalLink size={16} /> View website</Link>
        {session.role === "admin" && (
          <button onClick={() => { if (confirm("Reset all demo data back to the original sample content?")) resetDemo(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-white/70 hover:bg-white/10"><RotateCcw size={16} /> Reset demo data</button>
        )}
        <button onClick={() => { logout(); router.push("/login"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-white/70 hover:bg-white/10"><LogOut size={16} /> Sign out</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-50/60">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">{sidebar}</div>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-black/5 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
          <span className="hidden text-sm text-muted lg:block">Admin panel · demo data saved in this browser</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-right leading-tight"><b className="block">{session.name}</b><span className="text-xs capitalize text-muted">{session.role}</span></span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 font-bold text-white">{session.name[0]}</span>
          </div>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
