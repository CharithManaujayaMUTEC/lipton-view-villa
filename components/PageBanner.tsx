"use client";

import { useStore } from "@/lib/store";
import { Img } from "./ui";

export function PageBanner({ title, sub, index = 0 }: { title: string; sub?: string; index?: number }) {
  const { data } = useStore();
  const imgs = data.media.filter((m) => m.type === "image");
  const src = imgs.length ? imgs[index % imgs.length].url : "";
  return (
    <div className="relative h-44 w-full overflow-hidden bg-brand-900 sm:h-56">
      <Img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/30" />
      <div className="container-x absolute inset-x-0 bottom-6 text-white">
        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow sm:text-4xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-white/85">{sub}</p>}
      </div>
    </div>
  );
}
