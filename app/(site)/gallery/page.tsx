"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Img } from "@/components/ui";
import { VideoPlayer } from "@/components/VideoPlayer";
import type { MediaItem } from "@/lib/types";

export default function Gallery() {
  const { data } = useStore();
  const cats = ["All", ...Array.from(new Set(data.media.map((m) => m.category)))];
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<MediaItem | null>(null);
  const items = data.media.filter((m) => cat === "All" || m.category === cat);

  return (
    <div className="container-x py-10">
      <h1 className="h-section">Portfolio & Gallery</h1>
      <p className="mt-1 text-sm text-muted">A look at the villa, the views and life on the estate.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("rounded-full px-4 py-1.5 text-sm font-semibold transition", cat === c ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-800 hover:bg-brand-100")}>{c}</button>
        ))}
      </div>
      <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((m, i) => (
          <button key={m.id} onClick={() => setOpen(m)} className="group relative block w-full overflow-hidden rounded-2xl text-left">
            <Img src={m.url} alt={m.title} className={cn("w-full object-cover transition duration-500 group-hover:scale-105", i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]")} />
            {m.type === "video" && (
              <span className="absolute inset-0 grid place-items-center bg-black/30"><Play size={40} className="fill-white text-white" /></span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">{m.title}</span>
          </button>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4" onClick={() => setOpen(null)}>
          <button className="absolute right-5 top-5 text-white" aria-label="Close"><X /></button>
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {open.type === "video" ? <VideoPlayer url={open.url} /> : <Img src={open.url} alt={open.title} className="max-h-[80vh] w-full rounded-xl object-contain" />}
            <p className="mt-3 text-center text-sm font-semibold text-white">{open.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
