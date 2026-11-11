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
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Demo accounts - click to sign in</p>
          <div className="mt-3 space-y-2">
            {DEMO_USERS.map((u) => (
              <button key={u.email} onClick={() => go(u.email, u.password)} className="flex w-full items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-left transition hover:bg-brand-100">
                <span>
                  <span className="block text-sm font-bold capitalize">{u.role}</span>
                  <span className="block text-xs text-muted">{u.email} / {u.password}</span>
                </span>
                <span className="text-xs font-semibold text-brand-700">Use →</span>
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center text-sm"><Link href="/" className="text-brand-700 font-semibold">← Back to website</Link></p>
      </div>
    </div>
  );
}
