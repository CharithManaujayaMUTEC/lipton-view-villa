"use client";

import { useRef, useState } from "react";
import { Play, Plus, Star, Trash2, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import type { MediaItem } from "@/lib/types";
import { cn, fileToDataUrl, uid } from "@/lib/utils";
import { ImageField, PageHead } from "@/components/admin";
import { Field, Img, Modal } from "@/components/ui";

const CATS = ["Villa", "Rooms", "Views", "Dining", "Experiences", "Videos"];

export default function Media() {
  const { data, upsert, remove, toast } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState("All");
  const [edit, setEdit] = useState<MediaItem | null>(null);
  const cats = Array.from(new Set([...CATS, ...data.media.map((m) => m.category)]));
  const items = data.media.filter((m) => filter === "All" || m.category === filter);

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      try {
        if (f.type.startsWith("video/")) {
          if (f.size > 3_000_000) { toast(`${f.name}: videos over 3MB can't be stored in this demo - paste a video URL instead.`); continue; }
        }
        const url = await fileToDataUrl(f);
        upsert("media", { id: "m" + uid(), type: f.type.startsWith("video/") ? "video" : "image", url, title: f.name.replace(/\.[^.]+$/, ""), category: f.type.startsWith("video/") ? "Videos" : "Villa", featured: false });
      } catch (e) { toast((e as Error).message); }
    }
    toast("Upload complete");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <PageHead
        title="Photos & Videos"
        sub="Everything shown in the public gallery. Add files or paste URLs (YouTube, Vimeo or .mp4 links work for videos)."
        action={
          <div className="flex gap-2">
            <button className="btn-soft" onClick={() => setEdit({ id: "m" + uid(), type: "video", url: "", title: "", category: "Videos", featured: false })}><Plus size={16} /> Add video URL</button>
            <button className="btn-primary" onClick={() => fileRef.current?.click()}><Upload size={16} /> Upload files</button>
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
          </div>
        }
      />
      <div className="mb-5 flex flex-wrap gap-2">
        {["All", ...cats].map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={cn("rounded-full px-3.5 py-1 text-sm font-semibold", filter === c ? "bg-brand-700 text-white" : "bg-white text-brand-800 hover:bg-brand-100")}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="card group overflow-hidden">
            <button className="relative block w-full" onClick={() => setEdit(m)}>
              {m.type === "video" ? (
                <div className="grid aspect-[4/3] place-items-center bg-brand-900 text-white"><Play size={34} className="fill-white" /></div>
              ) : (
                <Img src={m.url} alt={m.title} className="aspect-[4/3] w-full object-cover" />
              )}
              {m.featured && <span className="absolute left-2 top-2 rounded-full bg-white p-1 text-amber-500 shadow"><Star size={13} className="fill-amber-400" /></span>}
            </button>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0"><p className="truncate text-sm font-semibold">{m.title || "Untitled"}</p><p className="text-xs text-muted">{m.category}</p></div>
              <button aria-label="Delete" className="text-muted hover:text-red-600" onClick={() => { if (confirm("Delete this item?")) { remove("media", m.id); toast("Deleted"); } }}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit && data.media.some((m) => m.id === edit.id) ? "Edit item" : "Add item"}>
        {edit && (
          <div className="space-y-4">
            {edit.type === "image" ? (
              <ImageField value={edit.url} onChange={(v) => setEdit({ ...edit, url: v })} />
            ) : (
              <Field label="Video URL (YouTube, Vimeo or .mp4)"><input className="input" value={edit.url} onChange={(e) => setEdit({ ...edit, url: e.target.value })} placeholder="https://..." /></Field>
            )}
            <Field label="Title"><input className="input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <Field label="Category"><input list="cats" className="input" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} /></Field>
            <datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} /> Featured</label>
            <div className="flex justify-end gap-2">
              <button className="btn-ghost" onClick={() => setEdit(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => { if (!edit.url) return toast("Add an image or URL first"); upsert("media", edit); setEdit(null); toast("Saved"); }}>Save</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
