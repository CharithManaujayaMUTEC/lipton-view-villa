"use client";

import Link from "next/link";
import { CalendarCheck, DollarSign, Hourglass, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { addDays, fmtDate, fmtShort, money, nightsBetween, todayISO } from "@/lib/utils";
import { PageHead } from "@/components/admin";
import { StatusBadge } from "@/components/ui";

export default function Dashboard() {
  const { data } = useStore();
  const t = todayISO();
  const active = data.bookings.filter((b) => b.status !== "cancelled");
  const revenue = active.filter((b) => b.payment !== "unpaid" || b.status === "completed").reduce((s, b) => s + b.total, 0);
  const pending = data.bookings.filter((b) => b.status === "pending").length;

  // occupancy for next 30 days
  const totalUnits = data.rooms.filter((r) => r.active).reduce((s, r) => s + r.units, 0);
  let bookedNights = 0;
  for (let i = 0; i < 30; i++) {
    const d = addDays(t, i);
    bookedNights += active.filter((b) => b.checkIn <= d && b.checkOut > d).length;
  }
  const occupancy = totalUnits ? Math.min(100, Math.round((bookedNights / (totalUnits * 30)) * 100)) : 0;

  // revenue per month, last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i), 1);
    const key = d.toISOString().slice(0, 7);
    return {
      label: d.toLocaleString("en-GB", { month: "short" }),
      value: active.filter((b) => b.checkIn.slice(0, 7) === key).reduce((s, b) => s + b.total, 0),
    };
  });
  const max = Math.max(1, ...months.map((m) => m.value));

  const upcoming = active.filter((b) => b.checkIn >= t).sort((a, b) => a.checkIn.localeCompare(b.checkIn)).slice(0, 5);
  const recent = [...data.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const roomName = (id: string) => data.rooms.find((r) => r.id === id)?.name ?? "-";

  const stats = [
    { l: "Revenue (paid)", v: money(revenue), i: DollarSign },
    { l: "Total bookings", v: String(active.length), i: CalendarCheck },
    { l: "Pending approval", v: String(pending), i: Hourglass },
    { l: "Occupancy (30 days)", v: occupancy + "%", i: TrendingUp },
  ];

  return (
    <>
      <PageHead title="Dashboard" sub="Overview of bookings and revenue" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="card flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-700"><s.i size={22} /></span>
            <div><p className="text-2xl font-extrabold">{s.v}</p><p className="text-xs text-muted">{s.l}</p></div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="card p-5">
          <h3 className="font-bold">Revenue by arrival month</h3>
          <div className="mt-6 flex h-52 items-end gap-3">
            {months.map((m) => (
              <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[11px] font-semibold text-muted">{m.value ? money(m.value) : ""}</span>
                <div className="w-full rounded-t-lg bg-brand-600" style={{ height: `${(m.value / max) * 80}%`, minHeight: m.value ? 4 : 0 }} />
                <span className="text-xs text-muted">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold">Upcoming arrivals</h3>
          <ul className="mt-3 divide-y divide-black/5">
            {upcoming.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-3 text-sm">
                <div><p className="font-semibold">{b.guestName}</p><p className="text-xs text-muted">{roomName(b.roomId)} · {nightsBetween(b.checkIn, b.checkOut)}n</p></div>
                <div className="text-right"><p className="font-semibold">{fmtShort(b.checkIn)}</p><StatusBadge status={b.status} /></div>
              </li>
            ))}
            {upcoming.length === 0 && <li className="py-6 text-center text-sm text-muted">No upcoming arrivals</li>}
          </ul>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold">Recent bookings</h3>
          <Link href="/admin/bookings" className="text-sm font-semibold text-brand-700">Manage all →</Link>
        </div>
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs text-muted"><tr><th className="pb-2">Ref</th><th>Guest</th><th>Room</th><th>Dates</th><th>Status</th><th className="text-right">Total</th></tr></thead>
          <tbody className="divide-y divide-black/5">
            {recent.map((b) => (
              <tr key={b.id}>
                <td className="py-2.5 font-mono text-xs">{b.ref}</td><td className="font-semibold">{b.guestName}</td><td>{roomName(b.roomId)}</td>
                <td>{fmtDate(b.checkIn, { day: "numeric", month: "short" })} - {fmtShort(b.checkOut)}</td>
                <td><StatusBadge status={b.status} /></td><td className="text-right font-semibold">{money(b.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
