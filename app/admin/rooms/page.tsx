"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Room } from "@/lib/types";
import { money, uid } from "@/lib/utils";
import { ImageField, PageHead } from "@/components/admin";
import { Field, Img, Modal } from "@/components/ui";

const blank = (): Room => ({
  id: "r" + uid(), name: "", type: "Double Room", description: "", pricePerNight: 80, maxGuests: 2, beds: "1 Double bed", size: 25, units: 1,
  amenities: ["Free Wi-Fi"], images: [""], badge: "", rating: 9, featured: false, active: true,
});

export default function Rooms() {
  const { data, upsert, remove, toast } = useStore();
  const [edit, setEdit] = useState<Room | null>(null);
  const set = <K extends keyof Room>(k: K, v: Room[K]) => setEdit((e) => (e ? { ...e, [k]: v } : e));

  return (
    <>
      <PageHead title="Rooms" sub="Manage room types, prices and photos" action={<button className="btn-primary" onClick={() => setEdit(blank())}><Plus size={16} /> Add room</button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.rooms.map((r) => (
          <div key={r.id} className="card overflow-hidden">
            <Img src={r.images[0]} alt={r.name} className="aspect-[16/9] w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div><h3 className="font-bold">{r.name}</h3><p className="text-xs text-muted">{r.type} · {r.units} unit{r.units > 1 ? "s" : ""} · {r.maxGuests} guests</p></div>
                <span className={`badge ${r.active ? "bg-brand-100 text-brand-800" : "bg-gray-100 text-gray-600"}`}>{r.active ? "Active" : "Hidden"}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <b className="text-brand-800">{money(r.pricePerNight)}<span className="text-xs font-normal text-muted"> /night</span></b>
                <div className="flex gap-1">
                  <button className="btn-soft !px-3 !py-1.5" onClick={() => setEdit(r)}><Pencil size={14} /> Edit</button>
                  <button className="btn-ghost !px-2 !py-1.5 text-red-600" aria-label="Delete" onClick={() => { if (confirm(`Delete ${r.name}?`)) { remove("rooms", r.id); toast("Room deleted"); } }}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit && data.rooms.some((r) => r.id === edit.id) ? "Edit room" : "Add room"} wide>
        {edit && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input className="input" value={edit.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Type"><input className="input" value={edit.type} onChange={(e) => set("type", e.target.value)} /></Field>
            <Field label="Price / night ($)"><input type="number" className="input" value={edit.pricePerNight} onChange={(e) => set("pricePerNight", +e.target.value)} /></Field>
            <Field label="Units available"><input type="number" min={1} className="input" value={edit.units} onChange={(e) => set("units", +e.target.value)} /></Field>
            <Field label="Max guests"><input type="number" min={1} className="input" value={edit.maxGuests} onChange={(e) => set("maxGuests", +e.target.value)} /></Field>
            <Field label="Beds"><input className="input" value={edit.beds} onChange={(e) => set("beds", e.target.value)} /></Field>
            <Field label="Size (m²)"><input type="number" className="input" value={edit.size} onChange={(e) => set("size", +e.target.value)} /></Field>
            <Field label="Badge (e.g. Popular)"><input className="input" value={edit.badge} onChange={(e) => set("badge", e.target.value)} /></Field>
            <div className="sm:col-span-2"><Field label="Description"><textarea rows={3} className="input" value={edit.description} onChange={(e) => set("description", e.target.value)} /></Field></div>
            <div className="sm:col-span-2"><Field label="Amenities (comma separated)"><input className="input" value={edit.amenities.join(", ")} onChange={(e) => set("amenities", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></Field></div>
            <div className="space-y-3 sm:col-span-2">
              {edit.images.map((img, i) => (
                <div key={i} className="relative">
                  <ImageField label={`Photo ${i + 1}`} value={img} onChange={(v) => set("images", edit.images.map((x, j) => (j === i ? v : x)))} />
                  {edit.images.length > 1 && <button type="button" className="absolute right-0 top-0 text-muted hover:text-red-600" onClick={() => set("images", edit.images.filter((_, j) => j !== i))} aria-label="Remove photo"><X size={16} /></button>}
                </div>
              ))}
              <button type="button" className="btn-soft" onClick={() => set("images", [...edit.images, ""])}><Plus size={14} /> Add photo</button>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={edit.featured} onChange={(e) => set("featured", e.target.checked)} /> Show on homepage</label>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={edit.active} onChange={(e) => set("active", e.target.checked)} /> Active (bookable)</label>
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button className="btn-ghost" onClick={() => setEdit(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => {
                if (!edit.name.trim()) return toast("Room name is required");
                upsert("rooms", { ...edit, images: edit.images.filter(Boolean) });
                setEdit(null); toast("Room saved");
              }}>Save room</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
