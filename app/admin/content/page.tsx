"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Settings } from "@/lib/types";
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
        <div className="card space-y-4 p-5">
          <h3 className="font-bold">Homepage hero</h3>
          {t("heroTitle", "Heading")}{t("heroHighlight", "Highlighted words")}{t("heroText", "Intro text", true)}
          <ImageField label="Hero image" value={s.heroImage} onChange={(v) => setS({ ...s, heroImage: v })} />
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
