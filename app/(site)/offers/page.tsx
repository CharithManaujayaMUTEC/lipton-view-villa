"use client";

import { PageBanner } from "@/components/PageBanner";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fmtDate, todayISO } from "@/lib/utils";
import { Img } from "@/components/ui";

export default function Offers() {
  const { data, toast } = useStore();
  const offers = data.offers.filter((o) => o.active && o.validUntil >= todayISO());
  return (
    <>
    <PageBanner title="Special Offers" index={7} />
    <div className="container-x py-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => (
          <div key={o.id} className="card overflow-hidden">
            <div className="relative">
              <Img src={o.image} alt={o.title} className="aspect-[16/9] w-full object-cover" />
              <span className="absolute right-3 top-3 rounded-xl bg-white px-3 py-1.5 text-lg font-extrabold text-brand-700 shadow">{o.discount}% OFF</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold">{o.title}</h3>
              <p className="mt-1 text-sm text-muted">{o.description}</p>
              <p className="mt-2 text-xs text-muted">Valid until {fmtDate(o.validUntil)}</p>
              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => { navigator.clipboard?.writeText(o.code); toast(`Code ${o.code} copied`); }} className="btn-soft flex-1 font-mono">{o.code}</button>
                <Link href="/rooms" className="btn-primary">Book</Link>
              </div>
            </div>
          </div>
        ))}
        {offers.length === 0 && <p className="text-sm text-muted">No active offers right now.</p>}
      </div>
    </div>
    </>
  );
}
