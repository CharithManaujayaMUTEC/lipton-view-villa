"use client";

import { PageBanner } from "@/components/PageBanner";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { addDays, todayISO } from "@/lib/utils";
import { RoomCard } from "@/components/RoomCard";

function Rooms() {
  const sp = useSearchParams();
  const { data, isAvailable, quote } = useStore();
  const [checkIn, setCheckIn] = useState(sp.get("checkIn") ?? "");
  const [checkOut, setCheckOut] = useState(sp.get("checkOut") ?? "");
  const [guests, setGuests] = useState(Number(sp.get("guests") ?? 0));

  const dated = !!checkIn && !!checkOut && checkOut > checkIn;
  const query = dated ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests || 2}` : "";
  const rooms = data.rooms.filter((r) => r.active && (!guests || r.maxGuests >= guests));

  return (
    <>
    <PageBanner title="Rooms & Suites" index={2} />
    <div className="container-x py-6">

      <div className="card -mt-12 relative grid gap-3 p-4 sm:grid-cols-4">
        <label><span className="label">Check-in</span>
          <input type="date" className="input" min={todayISO()} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }} /></label>
        <label><span className="label">Check-out</span>
          <input type="date" className="input" min={checkIn ? addDays(checkIn, 1) : todayISO()} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label>
        <label><span className="label">Guests</span>
          <select className="input" value={guests} onChange={(e) => setGuests(+e.target.value)}>
            <option value={0}>Any</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select></label>
        <div className="flex items-end">
          <button className="btn-soft w-full" onClick={() => { setCheckIn(""); setCheckOut(""); setGuests(0); }}>Clear</button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((r) => {
          const ok = !dated || isAvailable(r.id, checkIn, checkOut);
          const q = dated ? quote(r.id, checkIn, checkOut) : null;
          return (
            <div key={r.id} className={ok ? "" : "pointer-events-none opacity-50"}>
              <RoomCard room={r} query={query} total={q?.subtotal} nights={q?.nights} />
              {!ok && <p className="mt-2 text-center text-xs font-semibold text-red-600">Not available for these dates</p>}
            </div>
          );
        })}
        {rooms.length === 0 && <p className="text-sm text-muted">No rooms match your search.</p>}
      </div>
    </div>
    </>
  );
}

export default function Page() {
  return <Suspense><Rooms /></Suspense>;
}
