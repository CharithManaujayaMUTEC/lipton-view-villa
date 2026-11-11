"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { fileToDataUrl } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Img } from "./ui";

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-900">{title}</h1>
        {sub && <p className="text-sm text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/** URL input + file upload (images are downscaled; videos should use URLs). */
export function ImageField({ value, onChange, label = "Image" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const { toast } = useStore();
  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex gap-3">
        <Img src={value} alt="" className="h-16 w-24 shrink-0 rounded-lg border border-black/10 object-cover" />
        <div className="flex-1 space-y-2">
          <input className="input" placeholder="https://... image URL" value={value.startsWith("data:") ? "(uploaded image)" : value} onChange={(e) => onChange(e.target.value)} readOnly={value.startsWith("data:")} />
          <div className="flex gap-2">
            <button type="button" className="btn-soft !py-1.5" onClick={() => ref.current?.click()}><Upload size={14} /> Upload</button>
            {value && <button type="button" className="btn-ghost !py-1.5" onClick={() => onChange("")}>Clear</button>}
          </div>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try { onChange(await fileToDataUrl(f)); } catch (err) { toast((err as Error).message); }
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}
