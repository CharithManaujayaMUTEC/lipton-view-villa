"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/SiteChrome";
import { DEMO_USERS } from "@/lib/seed";

export default function Login() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const go = (e: string, p: string) => {
    const s = login(e, p);
    if (!s) return setErr("Invalid email or password.");
    router.push(s.role === "guest" ? "/account" : "/admin");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-100 via-brand-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <form className="card space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); go(email, password); }}>
          <h1 className="text-xl font-extrabold text-brand-900">Sign in</h1>
          <label className="block"><span className="label">Email</span><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="block"><span className="label">Password</span><input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
          <button className="btn-primary w-full">Sign in</button>
        </form>

        <div className="card mt-4 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Demo login - one click</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {DEMO_USERS.map((u) => (
              <button key={u.email} onClick={() => go(u.email, u.password)} className="btn-primary flex-col !gap-0.5 !py-3 capitalize">
                <span>{u.role}</span>
                <span className="text-[10px] font-normal normal-case opacity-80">{u.role === "guest" ? "My trips" : u.role === "admin" ? "Full access" : "Bookings"}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Or type: {DEMO_USERS.map((u) => `${u.email} / ${u.password}`).join(" - ")}</p>
        </div>
        <p className="mt-4 text-center text-sm"><Link href="/" className="text-brand-700 font-semibold">Back to website</Link></p>
      </div>
    </div>
  );
}
