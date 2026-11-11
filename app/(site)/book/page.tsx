"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtDate, money } from "@/lib/utils";
import { Img } from "@/components/ui";
import type { Booking } from "@/lib/types";

function Checkout() {
  const sp = useSearchParams();
  const { data, session, quote, createBooking, toast } = useStore();
  const room = data.rooms.find((r) => r.id === sp.get("room"));
  const checkIn = sp.get("checkIn") ?? "";
  const checkOut = sp.get("checkOut") ?? "";
  const guests = Number(sp.get("guests") ?? 2);
  const code = sp.get("code") ?? "";
  const [name, setName] = useState(session?.name ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState<Booking | null>(null);

  const q = room ? quote(room.id, checkIn, checkOut, code) : null;

  if (done)
    return (
      <div className="container-x py-20 text-center">
        <CheckCircle2 size={56} className="mx-auto text-brand-600" />
        <h1 className="mt-4 text-3xl font-extrabold text-brand-900">Booking request received</h1>
        <p className="mt-2 text-muted">Your reference is <b className="text-ink">{done.ref}</b>. We&apos;ve sent details to {done.email} (demo - no email is actually sent).</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-soft">Back home</Link>
          {session && <Link href="/account" className="btn-primary">View my trips</Link>}
        </div>
      </div>
    );

  if (!room || !q)
    return (
      <div className="container-x py-24 text-center">
        <p className="font-semibold">Missing booking details.</p>
        <Link href="/rooms" className="btn-primary mt-4">Choose a room</Link>
      </div>
    );

  return (
    <div className="container-x py-10">
      <h1 className="h-section">Confirm your stay</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form
          className="card space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const b = createBooking({ roomId: room.id, guestName: name, email, phone, checkIn, checkOut, guests, notes, discountCode: q.offer?.code });
            if (!b) return toast("Sorry, those dates were just taken.");
            setDone(b);
          }}
        >
          <h3 className="font-bold">Guest details</h3>
          <label className="block"><span className="label">Full name</span><input required className="input" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="label">Email</span><input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="block"><span className="label">Phone</span><input required className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          </div>
          <label className="block"><span className="label">Special requests</span><textarea rows={3} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Arrival time, meals, transfers..." /></label>
          <button className="btn-primary w-full">Request booking - {money(q.total)}</button>
          <p className="text-center text-xs text-muted">Pay at the villa. Free cancellation up to 48 hours before arrival.</p>
        </form>

        <aside className="card h-fit overflow-hidden">
          <Img src={room.images[0]} alt={room.name} className="aspect-[16/9] w-full object-cover" />
          <div className="space-y-2 p-5 text-sm">
            <h3 className="text-lg font-bold">{room.name}</h3>
            <p className="text-muted">{fmtDate(checkIn)} to {fmtDate(checkOut)} - {q.nights} night{q.nights > 1 ? "s" : ""} - {guests} guest{guests > 1 ? "s" : ""}</p>
            <div className="flex justify-between border-t border-black/5 pt-2"><span>Room</span><span>{money(q.subtotal)}</span></div>
            {q.offer && <div className="flex justify-between text-brand-700"><span>{q.offer.code}</span><span>-{money(q.discount)}</span></div>}
            <div className="flex justify-between"><span>Taxes & fees</span><span>{money(q.tax)}</span></div>
            <div className="flex justify-between border-t border-black/5 pt-2 text-base font-extrabold"><span>Total</span><span>{money(q.total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function Page() {
  return <Suspense><Checkout /></Suspense>;
}
