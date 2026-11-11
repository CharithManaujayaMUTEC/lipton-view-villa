"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Offer } from "@/lib/types";
import { addDays, fmtDate, todayISO, uid } from "@/lib/utils";
import { ImageField, PageHead } from "@/components/admin";
import { Field, Modal } from "@/components/ui";

export default function Offers() {
  const { data, upsert, remove, toast } = useStore();
  const [edit, setEdit] = useState<Offer | null>(null);
  const blank = (): Offer => ({ id: "o" + uid(), title: "", description: "", discount: 10, code: "", validUntil: addDays(todayISO(), 60), active: true, image: "" });
  return (
    <>
      <PageHead title="Offers & promo codes" sub="Codes entered at booking apply the percentage discount" action={<button className="btn-primary" onClick={() => setEdit(blank())}><Plus size={16} /> New offer</button>} />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-black/5 text-xs text-muted"><tr className="[&>th]:px-4 [&>th]:py-3"><th>Offer</th><th>Code</th><th>Discount</th><th>Valid until</th><th>Status</th><th /></tr></thead>
          <tbody className="divide-y divide-black/5 [&>tr>td]:px-4 [&>tr>td]:py-3">
            {data.offers.map((o) => (
              <tr key={o.id}>
                <td className="font-semibold">{o.title}</td><td className="font-mono text-xs">{o.code}</td><td>{o.discount}%</td><td>{fmtDate(o.validUntil)}</td>
                <td><button onClick={() => upsert("offers", { ...o, active: !o.active })} className={`badge ${o.active ? "bg-brand-100 text-brand-800" : "bg-gray-100 text-gray-600"}`}>{o.active ? "Active" : "Paused"}</button></td>
                <td className="text-right">
                  <button className="btn-ghost !px-2 !py-1" onClick={() => setEdit(o)} aria-label="Edit"><Pencil size={15} /></button>
                  <button className="btn-ghost !px-2 !py-1 text-red-600" aria-label="Delete" onClick={() => { remove("offers", o.id); toast("Offer deleted"); }}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Offer">
        {edit && (
          <div className="space-y-4">
            <Field label="Title"><input className="input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={2} className="input" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Code"><input className="input uppercase" value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value.toUpperCase() })} /></Field>
              <Field label="Discount %"><input type="number" min={1} max={90} className="input" value={edit.discount} onChange={(e) => setEdit({ ...edit, discount: +e.target.value })} /></Field>
              <Field label="Valid until"><input type="date" className="input" value={edit.validUntil} onChange={(e) => setEdit({ ...edit, validUntil: e.target.value })} /></Field>
            </div>
            <ImageField value={edit.image} onChange={(v) => setEdit({ ...edit, image: v })} />
            <div className="flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setEdit(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => { if (!edit.title || !edit.code) return toast("Title and code are required"); upsert("offers", edit); setEdit(null); toast("Offer saved"); }}>Save</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
