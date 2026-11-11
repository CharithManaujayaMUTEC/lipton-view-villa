"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Img } from "@/components/ui";

export default function About() {
  const { data } = useStore();
  const imgs = data.media.filter((m) => m.type === "image").slice(0, 3);
  return (
    <div className="container-x py-10">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="h-section">About {data.settings.siteName}</h1>
          <p className="mt-4 leading-relaxed text-ink/80">{data.settings.about}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/rooms" className="btn-primary">See rooms</Link>
            <Link href="/contact" className="btn-soft">Get in touch</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {imgs.map((m, i) => (
            <Img key={m.id} src={m.url} alt={m.title} className={`w-full rounded-2xl object-cover ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
