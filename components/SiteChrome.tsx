"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogIn, LogOut, Menu, Mountain, User, X, ArrowUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/rooms", label: "Rooms" },
  { href: "/gallery", label: "Gallery" },
  { href: "/offers", label: "Offers" },
  { href: "/contact", label: "Contact" },
];

export function Logo({ light }: { light?: boolean }) {
  const { data } = useStore();
  const [a, ...rest] = data.settings.siteName.split(" ");
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-extrabold tracking-tight", light ? "text-white" : "text-brand-800")}>
      <Mountain size={22} />
      <span>
        {a}
        <span className="font-semibold">{rest.length ? " " + rest.join(" ") : ""}</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { session, logout } = useStore();
  const [open, setOpen] = useState(false);
  const home = session?.role === "guest" ? "/account" : "/admin";

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "border-b-2 py-5 text-sm font-semibold transition",
                  active ? "border-brand-600 text-brand-800" : "border-transparent text-ink/80 hover:text-brand-700"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href={home} className="btn-primary hidden sm:inline-flex">
                <User size={16} /> {session.role === "guest" ? "My trips" : "Dashboard"}
              </Link>
              <button
                className="btn-ghost hidden sm:inline-flex"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary hidden sm:inline-flex">
              Login <LogIn size={16} />
            </Link>
          )}
          <button className="btn-ghost md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <div className="container-x flex flex-col py-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-sm font-semibold">
                {l.label}
              </Link>
            ))}
            <Link href={session ? home : "/login"} onClick={() => setOpen(false)} className="btn-primary my-2">
              {session ? "Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { data } = useStore();
  const s = data.settings;
  return (
    <footer className="mt-12 bg-brand-200/70">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{s.tagline}. Unforgettable hill-country stays above the tea estates of Sri Lanka.</p>
        </div>
        <FooterCol title="Explore" links={[["Rooms", "/rooms"], ["Gallery", "/gallery"], ["Offers", "/offers"], ["About", "/about"]]} />
        <FooterCol title="Guests" links={[["Login", "/login"], ["My trips", "/account"], ["Contact", "/contact"]]} />
        <div>
          <h4 className="mb-3 text-sm font-bold">Contact</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li>{s.phone}</li>
            <li>{s.email}</li>
            <li>{s.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted">
          <span>(c) {new Date().getFullYear()} {s.siteName}. Demo website - content is sample data.</span>
          <a href="#top" className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-white" aria-label="Back to top">
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted">
        {links.map(([l, h]) => (
          <li key={h}>
            <Link href={h} className="hover:text-brand-700">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
