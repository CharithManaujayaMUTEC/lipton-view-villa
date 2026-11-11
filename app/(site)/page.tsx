"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Building2, Coffee, Headphones, Mountain, MapPin, Play, Search, Smile, Sparkles, Star, Tag, Users, Waves, Wifi, Utensils, Flame,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { addDays, fmtDate, todayISO } from "@/lib/utils";
import { Img, Modal } from "@/components/ui";
import { RoomCard } from "@/components/RoomCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { U } from "@/lib/seed";

const AMENITIES = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: Coffee, label: "Breakfast" },
  { icon: Mountain, label: "Views" },
  { icon: Flame, label: "Bonfire" },
];

const PLACES = [
  { name: "Lipton's Seat", img: U("photo-1464822759023-fed622ff2c3b", 300) },
  { name: "Dambatenne", img: U("photo-1470071459604-3b5ec3a7fe05", 300) },
  { name: "Haputale", img: U("photo-1500382017468-9049fed747ef", 300) },
  { name: "Diyaluma", img: U("photo-1441974231531-c6227db76b6e", 300) },
];

const EXPERIENCES = [
  { icon: Mountain, t: "Sunrise at Lipton's Seat", d: "Guided early-morning hike" },
  { icon: Coffee, t: "Tea Estate Tour", d: "Pluck, roll and taste" },
  { icon: Utensils, t: "Sri Lankan Dining", d: "Home-cooked by our chef" },
  { icon: Sparkles, t: "Wellness Corner", d: "Massage and mountain air" },
];

export default function Home() {
  const { data } = useStore();
  const s = data.settings;
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(addDays(todayISO(), 3));
  const [checkOut, setCheckOut] = useState(addDays(todayISO(), 6));
  const [guests, setGuests] = useState(2);
  const [video, setVideo] = useState(false);

  const featured = data.rooms.filter((r) => r.featured && r.active).slice(0, 3);
  const offer = data.offers.find((o) => o.active);
  const thumbs = data.media.filter((m) => m.type === "image").slice(0, 4);
  const reviews = data.reviews.filter((r) => r.published);

  const search = () =>
    router.push(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);

  return (
    <>
      {/* HERO */}
      <section className="container-x pt-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 via-brand-50 to-white">
          <div className="grid items-center md:grid-cols-2">
            <div className="relative z-10 p-8 sm:p-12 md:p-14">
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-900 sm:text-5xl">
                {s.heroTitle}
                <br />
                <span className="text-brand-600">{s.heroHighlight}</span>
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted sm:text-base">{s.heroText}</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold shadow">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-brand-700">
                  <MapPin size={15} />
                </span>
                {s.siteName}, {s.location.split(",")[0]}
              </span>
            </div>
            <div className="relative h-64 md:h-[420px]">
              <Img src={s.heroImage} alt={s.siteName} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-brand-50 to-transparent md:block" />
            </div>
          </div>
        </div>

        {/* SEARCH PANEL */}
        <div className="card relative z-10 -mt-12 grid gap-6 p-5 sm:mx-6 sm:p-6 lg:grid-cols-[1.1fr_1.3fr_1fr]">
          <div>
            <h3 className="text-sm font-bold">Amenities</h3>
            <div className="mt-3 flex gap-3">
              {AMENITIES.map((a) => (
                <div key={a.label} className="text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-brand-200 text-brand-600">
                    <a.icon size={20} />
                  </div>
                  <span className="mt-1.5 block text-[11px] text-muted">{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:border-x lg:border-black/5 lg:px-6">
            <h3 className="text-sm font-bold">Find Your Stay</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label>
                <span className="label">Check-in</span>
                <input type="date" className="input" min={todayISO()} value={checkIn}
                  onChange={(e) => { setCheckIn(e.target.value); if (e.target.value >= checkOut) setCheckOut(addDays(e.target.value, 1)); }} />
              </label>
              <label>
                <span className="label">Check-out</span>
                <input type="date" className="input" min={addDays(checkIn, 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </label>
            </div>
            <div className="mt-2 flex gap-2">
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-black/10 px-3 text-sm">
                <Users size={15} className="text-muted" />
                <select className="w-full bg-transparent py-2.5 outline-none" value={guests} onChange={(e) => setGuests(+e.target.value)}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
                </select>
              </label>
              <button onClick={search} className="btn-primary"><Search size={16} /> Search</button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Nearby Highlights</h3>
            <div className="mt-3 flex gap-3">
              {PLACES.map((p) => (
                <div key={p.name} className="text-center" title={p.name}>
                  <Img src={p.img} alt={p.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow" />
                  <span className="mt-1.5 block max-w-14 truncate text-[10px] text-muted">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-x mt-16">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="h-section">Featured Stays</h2>
          <Link href="/rooms" className="text-sm font-semibold text-brand-700">View all â†’</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => <RoomCard key={r.id} room={r} />)}
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="container-x mt-16 grid gap-8 lg:grid-cols-[320px_1fr]">
        <div>
          <h2 className="h-section">Villa Experiences</h2>
          <ul className="mt-5 space-y-3">
            {EXPERIENCES.map((e) => (
              <li key={e.t} className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-brand-700"><e.icon size={19} /></span>
                <div>
                  <p className="text-sm font-bold">{e.t}</p>
                  <p className="text-xs text-muted">{e.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/gallery" className="btn-soft mt-6">Explore the gallery</Link>
        </div>
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <Img src={s.tourPoster} alt="Villa tour" className="aspect-[16/10] w-full object-cover" />
          <button onClick={() => setVideo(true)} className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-black/35 text-white backdrop-blur transition hover:scale-110" aria-label="Play tour video">
            <Play size={26} className="fill-white" />
          </button>
          <div className="absolute inset-x-0 bottom-0 flex gap-3 bg-gradient-to-t from-black/50 to-transparent p-4">
            {thumbs.map((t) => <Img key={t.id} src={t.url} alt={t.title} className="h-14 w-20 rounded-lg border-2 border-white/80 object-cover" />)}
          </div>
        </div>
      </section>
      <Modal open={video} onClose={() => setVideo(false)} title="Take a tour of the villa" wide>
        <VideoPlayer url={s.tourVideoUrl} poster={s.tourPoster} />
      </Modal>

      {/* OFFER */}
      {offer && (
        <section className="container-x mt-16">
          <div className="grid items-center gap-4 overflow-hidden rounded-3xl bg-brand-100 sm:grid-cols-[220px_1fr_auto]">
            <Img src={offer.image} alt={offer.title} className="h-44 w-full object-cover sm:h-full" />
            <div className="p-6 sm:p-0">
              <h3 className="text-xl font-extrabold text-brand-900">{offer.title}</h3>
              <p className="mt-1 text-sm text-muted">{offer.description}</p>
              <p className="mt-1 text-xs text-muted">Use code <b className="text-brand-800">{offer.code}</b> Â· valid until {fmtDate(offer.validUntil)}</p>
              <Link href="/rooms" className="btn-primary mt-4">Book Now</Link>
            </div>
            <div className="m-6 flex items-center gap-3 rounded-2xl bg-white p-5 shadow sm:m-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-brand-700"><Tag size={20} /></span>
              <div>
                <p className="text-3xl font-extrabold leading-none text-brand-700">{offer.discount}%</p>
                <p className="text-sm font-bold text-brand-700">OFF</p>
                <p className="text-[10px] text-muted">Limited time only</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TRUST */}
      <section className="container-x mt-12">
        <div className="card grid grid-cols-2 gap-6 p-6 lg:grid-cols-4">
          {[
            { i: Smile, v: s.statGuests, l: "Happy Guests" },
            { i: Building2, v: s.statProperties, l: "Rooms & suites" },
            { i: Headphones, v: s.statSupport, l: "Guest support" },
            { i: Star, v: s.statRating, l: "Booking.com rating" },
          ].map((x) => (
            <div key={x.l} className="flex items-center gap-3">
              <x.i size={30} className="text-brand-700" strokeWidth={1.5} />
              <div>
                <p className="text-xl font-extrabold">{x.v}</p>
                <p className="text-xs text-muted">{x.l}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="container-x mt-16">
        <h2 className="h-section mb-5">What guests say</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <figure key={r.id} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="badge bg-brand-700 text-white">{r.rating}.0</span>
                <span className="text-xs text-muted">{fmtDate(r.date)}</span>
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed">â€œ{r.text}â€</blockquote>
              <figcaption className="mt-3 text-xs font-bold">{r.name} <span className="font-normal text-muted">Â· {r.country}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter />
    </>
  );
}

function Newsletter() {
  const { toast } = useStore();
  const [email, setEmail] = useState("");
  return (
    <section className="container-x mt-16">
      <form
        onSubmit={(e) => { e.preventDefault(); toast("Thanks for subscribing!"); setEmail(""); }}
        className="flex flex-col items-start gap-4 rounded-2xl bg-brand-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 className="font-bold"><Waves size={0} />Get exclusive travel deals & tips</h3>
          <p className="text-xs text-white/70">Subscribe to our newsletter</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="input min-w-0 sm:w-64" />
          <button className="btn bg-brand-500 text-white hover:bg-brand-400">Subscribe</button>
        </div>
      </form>
    </section>
  );
}

