"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Booking, BookingStatus, PaymentStatus } from "@/lib/types";
import { addDays, fmtDate, money, nightsBetween, todayISO, uid } from "@/lib/utils";
import { PageHead } from "@/components/admin";
import { Field, Modal, StatusBadge } from "@/components/ui";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "checked-in", "completed", "cancelled"];
const PAYMENTS: PaymentStatus[] = ["unpaid", "deposit", "paid"];

const blank = (roomId: string): Booking => ({
  id: "b" + uid(), ref: "LVV-" + (2500 + Math.floor(Math.random() * 400)), roomId, guestName: "", email: "", phone: "",
  checkIn: addDays(todayISO(), 1), checkOut: addDays(todayISO(), 3), guests: 2, total: 0, status: "confirmed",
  payment: "unpaid", source: "admin", notes: "", createdAt: new Date().toISOString(),
});

export default function Bookings() {
  const { data, upsert, remove, isAvailable, quote, toast } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [edit, setEdit] = useState<Booking | null>(null);
  const [isNew, setIsNew] = useState(false);

  const roomName = (id: string) => data.rooms.find((r) => r.id === id)?.name ?? "-";
  const rows = useMemo(
    () =>
      data.bookings
        .filter((b) => (status === "all" || b.status === status) && (b.guestName + b.ref + b.email).toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => b.checkIn.localeCompare(a.checkIn)),
    [data.bookings, q, status]
  );

  const save = () => {
    if (!edit) return;
    if (!edit.guestName || !edit.email) return toast("Guest name and email are required.");
    if (edit.checkOut <= edit.checkIn) return toast("Check-out must be after check-in.");
    if (edit.status !== "cancelled" && !isAvailable(edit.roomId, edit.checkIn, edit.checkOut, edit.id))
      return toast("That room is fully booked on those dates.");
    upsert("bookings", edit);
    toast(isNew ? "Booking created" : "Booking updated");
    setEdit(null);
  };

  const set = <K extends keyof Booking>(k: K, v: Booking[K]) => setEdit((e) => (e ? { ...e, [k]: v } : e));
  const recalc = (b: Booking) => {
    const qt = quote(b.roomId, b.checkIn, b.checkOut);
    return qt ? Math.round(qt.total) : b.total;
  };

  return (
    <>
      <PageHead
        title="Bookings"
        sub={`${data.bookings.length} total reservations`}
        action={<button className="btn-primary" onClick={() => { setIsNew(true); const b = blank(data.rooms[0]?.id ?? ""); setEdit({ ...b, total: recalc(b) }); }}><Plus size={16} /> New booking</button>}
      />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-3 text-muted" />
          <input className="input pl-9" placeholder="Search guest, ref, email" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-black/5 text-xs text-muted">
            <tr className="[&>th]:px-4 [&>th]:py-3"><th>Ref</th><th>Guest</th><th>Room</th><th>Stay</th><th>Source</th><th>Status</th><th>Payment</th><th className="text-right">Total</th></tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((b) => (
              <tr key={b.id} onClick={() => { setIsNew(false); setEdit(b); }} className="cursor-pointer hover:bg-brand-50/60 [&>td]:px-4 [&>td]:py-3">
                <td className="font-mono text-xs">{b.ref}</td>
                <td><p className="font-semibold">{b.guestName}</p><p className="text-xs text-muted">{b.email}</p></td>
                <td>{roomName(b.roomId)}</td>
                <td>{fmtDate(b.checkIn, { day: "numeric", month: "short" })} to {fmtDate(b.checkOut, { day: "numeric", month: "short" })} <span className="text-xs text-muted">({nightsBetween(b.checkIn, b.checkOut)}n)</span></td>
                <td className="capitalize">{b.source}</td>
                <td><StatusBadge status={b.status} /></td>
                <td><StatusBadge status={b.payment} /></td>
                <td className="text-right font-semibold">{money(b.total)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-muted">No bookings found</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={isNew ? "New booking" : `Booking ${edit?.ref}`} wide>
        {edit && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Guest name"><input className="input" value={edit.guestName} onChange={(e) => set("guestName", e.target.value)} /></Field>
            <Field label="Email"><input className="input" type="email" value={edit.email} onChange={(e) => set("email", e.target.value)} /></Field>
            <Field label="Phone"><input className="input" value={edit.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Room">
              <select className="input" value={edit.roomId} onChange={(e) => { const b = { ...edit, roomId: e.target.value }; setEdit({ ...b, total: recalc(b) }); }}>
                {data.rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </Field>
            <Field label="Check-in"><input className="input" type="date" value={edit.checkIn} onChange={(e) => { const b = { ...edit, checkIn: e.target.value }; setEdit({ ...b, total: recalc(b) }); }} /></Field>
            <Field label="Check-out"><input className="input" type="date" value={edit.checkOut} onChange={(e) => { const b = { ...edit, checkOut: e.target.value }; setEdit({ ...b, total: recalc(b) }); }} /></Field>
            <Field label="Guests"><input className="input" type="number" min={1} value={edit.guests} onChange={(e) => set("guests", +e.target.value)} /></Field>
            <Field label="Total ($)"><input className="input" type="number" value={edit.total} onChange={(e) => set("total", +e.target.value)} /></Field>
            <Field label="Status"><select className="input capitalize" value={edit.status} onChange={(e) => set("status", e.target.value as BookingStatus)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Payment"><select className="input capitalize" value={edit.payment} onChange={(e) => set("payment", e.target.value as PaymentStatus)}>{PAYMENTS.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="Source">
              <select className="input" value={edit.source} onChange={(e) => set("source", e.target.value as Booking["source"])}>
                {["website", "booking.com", "phone", "admin"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2"><Field label="Notes"><textarea rows={2} className="input" value={edit.notes} onChange={(e) => set("notes", e.target.value)} /></Field></div>
            <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-2">
              {!isNew ? (
                <button className="btn-ghost text-red-600" onClick={() => { if (confirm("Delete this booking?")) { remove("bookings", edit.id); setEdit(null); toast("Booking deleted"); } }}><Trash2 size={16} /> Delete</button>
              ) : <span />}
              <div className="flex gap-2">
                {!isNew && edit.status === "pending" && <button className="btn-soft" onClick={() => { upsert("bookings", { ...edit, status: "confirmed" }); setEdit(null); toast("Booking confirmed"); }}>Confirm</button>}
                <button className="btn-ghost" onClick={() => setEdit(null)}>Cancel</button>
                <button className="btn-primary" onClick={save}>Save</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
