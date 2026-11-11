"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const INTERVAL = 6000;

export function HeroSlider() {
  const { data } = useStore();
  const slides = data.settings.heroSlides.filter((s) => s.url);
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), INTERVAL);
    return () => clearTimeout(t);
  }, [i, n]);

  if (!n) return null;
  const idx = i % n;

  return (
    <section
      className="relative h-[78vh] min-h-[480px] w-full overflow-hidden bg-brand-900"
    >
      {slides.map((s, k) => (
        <div key={s.id} className={cn("absolute inset-0 transition-opacity duration-[1400ms]", k === idx ? "opacity-100" : "opacity-0")}>
          {s.type === "video" ? (
            <video src={s.url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.url} alt={s.line1} className={cn("h-full w-full object-cover", k === idx && "kenburns")} />
          )}
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60 via-transparent to-transparent" />

      {/* Two-line text, re-mounted per slide so the animation replays */}
      <div className="container-x absolute inset-x-0 top-1/2 -translate-y-[62%]">
        <div key={slides[idx].id} className="max-w-3xl text-white">
          <span className="rise-1 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
            <MapPin size={14} /> {data.settings.siteName} - {data.settings.location}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight drop-shadow-lg sm:text-6xl lg:text-7xl">
            <span className="rise-2 block">{slides[idx].line1}</span>
            <span className="rise-3 block bg-gradient-to-r from-brand-200 to-white bg-clip-text text-transparent">{slides[idx].line2}</span>
          </h1>
        </div>
      </div>

      {n > 1 && (
        <>
          <div className="absolute bottom-32 right-4 flex gap-2 sm:right-8 lg:bottom-36">
            <button aria-label="Previous" onClick={() => setI((idx - 1 + n) % n)} className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/35"><ChevronLeft size={20} /></button>
            <button aria-label="Next" onClick={() => setI((idx + 1) % n)} className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/35"><ChevronRight size={20} /></button>
          </div>
          <div className="container-x absolute inset-x-0 bottom-32 flex gap-2 lg:bottom-36">
            {slides.map((s, k) => (
              <button key={s.id} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="h-1 w-12 overflow-hidden rounded bg-white/30 sm:w-16">
                {k === idx && <span key={i} className="progress block h-full w-full bg-white" />}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
