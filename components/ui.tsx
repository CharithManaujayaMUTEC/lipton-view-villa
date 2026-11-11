"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** <img> with a graceful gradient fallback if the URL fails. */
export function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false);
  if (!src || bad)
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("bg-gradient-to-br from-brand-200 via-brand-100 to-brand-300", className)}
      />
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={className} />;
}

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold">
      {value.toFixed(1)} <Star size={14} className="fill-amber-400 text-amber-400" />
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center" onClick={onClose}>
      <div
        className={cn("card my-6 w-full p-5 sm:p-6", wide ? "max-w-3xl" : "max-w-lg")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-brand-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-brand-50" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

const STATUS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  "checked-in": "bg-brand-100 text-brand-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  unpaid: "bg-red-50 text-red-700",
  deposit: "bg-amber-50 text-amber-800",
  paid: "bg-brand-100 text-brand-800",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("badge capitalize", STATUS[status])}>{status}</span>;
}
