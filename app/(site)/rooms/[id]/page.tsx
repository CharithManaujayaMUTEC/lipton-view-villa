"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BedDouble, Check, Maximize, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { addDays, money, todayISO } from "@/lib/utils";
import { Img, Rating } from "@/components/ui";

function Detail() {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const router = useRouter();
  const { data, isAvailable, quote } = useStore();
  const room = data.rooms.find((r) => r.id === id);
  const [img, setImg] = useState(0);
  const [checkIn, setCheckIn] = useState(sp.get("checkIn") ?? addDays(todayISO(), 3));
  const [checkOut, setCheckOut] = useState(sp.get("checkOut") ?? addDays(todayISO(), 5));
  const [guests, setGuests] = useState(Number(sp.get("guests") ?? 2));
  const [code, setCode] = useState("");

  if (!room)
    return (
      <div className="container-x py-24 text-center">
        <p className="font-semibold">Room not found.</p>
        <Link href="/rooms" className="btn-primary mt-4">Back to rooms</Link>
      </div>
    );

  const valid = checkOut > checkIn;
  const available = valid && isAvailable(room.id, checkIn, checkOut);
  const q = valid ? quote(room.id, checkIn, checkOut, code) : null;
  const tooMany = guests > room.maxGuests;

  return (
    <div className="container-x py-8">
      <Link href="/rooms" className="text-sm font-semibold text-brand-700">← All rooms</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <Img src={room.images[img]} alt={room.name} className="aspect-[16/10] w-full rounded-2xl object-cover" />
          <div className="mt-3 flex gap-3">
            {room.images.map((u, i) => (
              <button key={u + i} onClick={() => setImg(i)} className={`overflow-hidden rounded-xl border-2 ${i === img ? "border-brand-600" : "border-transparent"}`}>
                <Img src={u} alt="" className="h-16 w-24 object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="badge bg-brand-100 text-brand-800">{room.type}</span>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-900">{room.name}</h1>
            </div>
            <Rating value={room.rating / 2} />
          </div>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted">
            <span className="flex items-center gap-1.5"><Users size={16} /> Up to {room.maxGuests} guests</span>
            <span className="flex items-center gap-1.5"><BedDouble size={16} /> {room.beds}</span>
            <span className="flex items-center gap-1.5"><Maximize size={16} /> {room.size} m²</span>
          </div>
          <p className="mt-5 leading-relaxed text-ink/80">{room.description}</p>
          <h3 className="mt-6 font-bold">Amenities</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2"><Check size={15} className="text-brand-600" /> {a}</li>
            ))}
          </ul>
        </div>

        <aside className="card h-fit p-5 lg:sticky lg:top-24">
          <p className="text-2xl font-extrabold text-brand-800">{money(room.pricePerNight)} <span className="text-sm font-medium text-muted">/ night</span></p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <label><span className="label">Check-in</span>
              <input type="date" className="input" min={todayISO()} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }} /></label>
            <label><span className="label">Check-out</span>
              <input type="date" className="input" min={addDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label>
          </div>
          <label className="mt-2 block"><span className="label">Guests</span>
            <input type="number" min={1} max={room.maxGuests} className="input" value={guests} onChange={(e) => setGuests(+e.target.value)} /></label>
          <label className="mt-2 block"><span className="label">Promo code (try SUMMER30)</span>
            <input className="input uppercase" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Optional" /></label>

          {q && (
            <dl className="mt-4 space-y-1.5 border-t border-black/5 pt-4 text-sm">
              <Row l={`${money(room.pricePerNight)} × ${q.nights} night${q.nights > 1 ? "s" : ""}`} v={money(q.subtotal)} />
              {q.offer && <Row l={`${q.offer.title} (-${q.offer.discount}%)`} v={"-" + money(q.discount)} green />}
              <Row l={`Taxes & fees (${data.settings.taxPercent}%)`} v={money(q.tax)} />
              <Row l="Total" v={money(q.total)} bold />
            </dl>
          )}
          {code && !q?.offer && <p className="mt-2 text-xs text-red-600">Promo code not valid.</p>}
          {valid && !available && <p className="mt-3 text-sm font-semibold text-red-600">Sorry, not available on these dates.</p>}
          {tooMany && <p className="mt-3 text-sm font-semibold text-red-600">Max {room.maxGuests} guests for this room.</p>}
          <button
            disabled={!available || tooMany}
            onClick={() => router.push(`/book?room=${room.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}${code ? `&code=${code}` : ""}`)}
            className="btn-primary mt-4 w-full"
          >
            Reserve now
          </button>
          <p className="mt-2 text-center text-xs text-muted">No payment needed today (demo).</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ l, v, bold, green }: { l: string; v: string; bold?: boolean; green?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "border-t border-black/5 pt-2 text-base font-extrabold" : ""} ${green ? "text-brand-700" : ""}`}>
      <dt>{l}</dt><dd>{v}</dd>
    </div>
  );
}

export default function Page() {
  return <Suspense><Detail /></Suspense>;
}
