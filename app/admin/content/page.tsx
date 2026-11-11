"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";
import type { HeroSlide, Settings } from "@/lib/types";
import { uid } from "@/lib/utils";
import { ImageField, PageHead } from "@/components/admin";
import { Field } from "@/components/ui";

export default function Content() {
  const { data, setSettings, toast } = useStore();
  const [s, setS] = useState<Settings>(data.settings);
  const t = (k: keyof Settings, label: string, area = false) => (
    <Field label={label}>
      {area ? (
        <textarea rows={4} className="input" value={String(s[k])} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
      ) : (
        <input className="input" value={String(s[k])} onChange={(e) => setS({ ...s, [k]: typeof s[k] === "number" ? +e.target.value : e.target.value })} />
      )}
    </Field>
  );
  return (
    <>
      <PageHead title="Site content" sub="Edit text, hero and tour video shown on the website" action={<button className="btn-primary" onClick={() => { setSettings(s); toast("Site content saved"); }}>Save changes</button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-5 p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Homepage hero slider (images or looping videos, 2 lines of text each)</h3>
            <button className="btn-soft" onClick={() => setS({ ...s, heroSlides: [...s.heroSlides, { id: "h" + uid(), type: "image", url: "", line1: "", line2: "" }] })}><Plus size={14} /> Add slide</button>
          </div>
          {s.heroSlides.map((h, i) => {
            const up = (patch: Partial<HeroSlide>) => setS({ ...s, heroSlides: s.heroSlides.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
            return (
              <div key={h.id} className="grid gap-3 rounded-xl border border-black/10 p-4 md:grid-cols-[1.3fr_1fr]">
                <div className="space-y-3">
                  <Field label="Type"><select className="input" value={h.type} onChange={(e) => up({ type: e.target.value as HeroSlide["type"] })}><option value="image">Image</option><option value="video">Video (.mp4 URL, muted loop)</option></select></Field>
                  {h.type === "image" ? <ImageField label="Slide image" value={h.url} onChange={(v) => up({ url: v })} /> : <Field label="Video URL (.mp4)"><input className="input" value={h.url} onChange={(e) => up({ url: e.target.value })} placeholder="https://.../clip.mp4" /></Field>}
                </div>
                <div className="space-y-3">
                  <Field label="Text line 1"><input className="input" value={h.line1} onChange={(e) => up({ line1: e.target.value })} /></Field>
                  <Field label="Text line 2"><input className="input" value={h.line2} onChange={(e) => up({ line2: e.target.value })} /></Field>
                  <button className="btn-ghost text-red-600" onClick={() => setS({ ...s, heroSlides: s.heroSlides.filter((_, j) => j !== i) })}><Trash2 size={15} /> Remove slide</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card space-y-4 p-5">
          <h3 className="font-bold">Tour video</h3>
          {t("tourVideoUrl", "Video URL (YouTube, Vimeo or .mp4)")}
          <ImageField label="Video cover image" value={s.tourPoster} onChange={(v) => setS({ ...s, tourPoster: v })} />
        </div>
        <div className="card space-y-4 p-5">
          <h3 className="font-bold">Brand & about</h3>
          {t("siteName", "Villa name")}{t("tagline", "Tagline")}{t("about", "About text", true)}
        </div>
        <div className="card space-y-4 p-5">
          <h3 className="font-bold">Contact & policies</h3>
          {t("phone", "Phone")}{t("email", "Email")}{t("address", "Address")}{t("location", "Location (city, country)")}
          <div className="grid grid-cols-3 gap-3">{t("checkInTime", "Check-in")}{t("checkOutTime", "Check-out")}{t("taxPercent", "Tax %")}</div>
        </div>
        <div className="card space-y-4 p-5 lg:col-span-2">
          <h3 className="font-bold">Homepage numbers</h3>
          <div className="grid gap-3 sm:grid-cols-4">{t("statGuests", "Happy guests")}{t("statProperties", "Rooms")}{t("statSupport", "Support")}{t("statRating", "Rating")}</div>
        </div>
      </div>
    </>
  );
}
