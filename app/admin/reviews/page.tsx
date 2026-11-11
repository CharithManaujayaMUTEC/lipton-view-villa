"use client";

import { Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtDate } from "@/lib/utils";
import { PageHead } from "@/components/admin";

export default function Reviews() {
  const { data, upsert, remove } = useStore();
  return (
    <>
      <PageHead title="Reviews" sub="Choose which reviews appear on the homepage" />
      <div className="space-y-3">
        {data.reviews.map((r) => (
          <div key={r.id} className="card flex flex-wrap items-start justify-between gap-4 p-5">
            <div className="max-w-2xl">
              <p className="text-sm font-bold">{r.name} <span className="font-normal text-muted">- {r.country} - {fmtDate(r.date)}</span> <span className="badge ml-2 bg-brand-700 text-white">{r.rating}/10</span></p>
              <p className="mt-2 text-sm">{r.text}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={r.published} onChange={(e) => upsert("reviews", { ...r, published: e.target.checked })} /> Published</label>
              <button className="text-muted hover:text-red-600" aria-label="Delete" onClick={() => remove("reviews", r.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
