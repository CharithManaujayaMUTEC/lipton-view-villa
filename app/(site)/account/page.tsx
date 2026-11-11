"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { fmtDate, money } from "@/lib/utils";
import { StatusBadge } from "@/components/ui";

export default function Account() {
  const { session, data, upsert, toast } = useStore();
  const router = useRouter();
  useEffect(() => { if (!session) router.replace("/login"); }, [session, router]);
  if (!session) return null;

  const mine = data.bookings.filter((b) => b.email.toLowerCase() === session.email.toLowerCase());
  return (
    <div className="container-x py-10">
      <h1 className="h-section">Welcome, {session.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-muted">Your trips with Lipton View Villa.</p>
      <div className="mt-6 space-y-3">
        {mine.map((b) => {
          const room = data.rooms.find((r) => r.id === b.roomId);
          return (
            <div key={b.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-bold">{room?.name ?? "Room"} <span className="ml-2 text-xs font-normal text-muted">{b.ref}</span></p>
                <p className="text-sm text-muted">{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {b.guests} guests</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                <b>{money(b.total)}</b>
                {(b.status === "pending" || b.status === "confirmed") && (
                  <button className="btn-soft" onClick={() => { upsert("bookings", { ...b, status: "cancelled" }); toast("Booking cancelled"); }}>Cancel</button>
                )}
              </div>
            </div>
          );
        })}
        {mine.length === 0 && (
          <div className="card p-8 text-center text-sm text-muted">
            No trips yet. <Link href="/rooms" className="font-semibold text-brand-700">Find a room</Link>
          </div>
        )}
      </div>
    </div>
  );
}
