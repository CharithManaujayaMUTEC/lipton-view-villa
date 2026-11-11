/* eslint-disable react-hooks/set-state-in-effect, react-hooks/refs */
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Booking, Data, Offer, Session, Settings } from "./types";
import { DEMO_USERS, seed } from "./seed";
import { addDays, nightsBetween, todayISO, uid } from "./utils";

const KEY = "lvv-demo-data-v1";
const SKEY = "lvv-demo-session-v1";

type Collection = "rooms" | "bookings" | "media" | "offers" | "reviews" | "messages";
type Item<C extends Collection> = Data[C][number];

type Api = {
  data: Data;
  session: Session | null;
  login: (email: string, password: string) => Session | null;
  logout: () => void;
  upsert: <C extends Collection>(c: C, item: Item<C>) => void;
  remove: (c: Collection, id: string) => void;
  setSettings: (s: Partial<Settings>) => void;
  resetDemo: () => void;
  toast: (msg: string) => void;
  isAvailable: (roomId: string, checkIn: string, checkOut: string, ignoreId?: string) => boolean;
  quote: (roomId: string, checkIn: string, checkOut: string, code?: string) => Quote | null;
  createBooking: (b: Omit<Booking, "id" | "ref" | "createdAt" | "total" | "status" | "payment" | "source"> & { source?: Booking["source"] }) => Booking | null;
};

export type Quote = {
  nights: number;
  subtotal: number;
  discount: number;
  offer: Offer | null;
  tax: number;
  total: number;
};

const Ctx = createContext<Api | null>(null);

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Data | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(""), 3200);
  }, []);

  // Load on mount
  useEffect(() => {
    let d: Data | null = null;
    let s: Session | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) d = JSON.parse(raw);
      const rs = localStorage.getItem(SKEY);
      if (rs) s = JSON.parse(rs);
    } catch {}
    const base = seed();
    setData(d ? { ...d, settings: { ...base.settings, ...d.settings } } : base);
    setSession(s);
  }, []);

  // Persist
  useEffect(() => {
    if (!data) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      toast("Storage is full - use image URLs or smaller files in this demo.");
    }
  }, [data, toast]);

  const api = useMemo<Api | null>(() => {
    if (!data) return null;

    const isAvailable: Api["isAvailable"] = (roomId, checkIn, checkOut, ignoreId) => {
      const room = data.rooms.find((r) => r.id === roomId);
      if (!room || !checkIn || !checkOut || checkOut <= checkIn) return false;
      const overlapping = data.bookings.filter(
        (b) =>
          b.roomId === roomId &&
          b.id !== ignoreId &&
          b.status !== "cancelled" &&
          b.checkIn < checkOut &&
          b.checkOut > checkIn
      );
      return overlapping.length < room.units;
    };

    const quote: Api["quote"] = (roomId, checkIn, checkOut, code) => {
      const room = data.rooms.find((r) => r.id === roomId);
      const nights = nightsBetween(checkIn, checkOut);
      if (!room || nights < 1) return null;
      const subtotal = room.pricePerNight * nights;
      const offer =
        data.offers.find(
          (o) =>
            o.active &&
            o.validUntil >= todayISO() &&
            code &&
            o.code.toLowerCase() === code.trim().toLowerCase()
        ) ?? null;
      const discount = offer ? (subtotal * offer.discount) / 100 : 0;
      const tax = ((subtotal - discount) * data.settings.taxPercent) / 100;
      return { nights, subtotal, discount, offer, tax, total: subtotal - discount + tax };
    };

    return {
      data,
      session,
      isAvailable,
      quote,
      toast,
      login: (email, password) => {
        const u = DEMO_USERS.find(
          (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password
        );
        if (!u) return null;
        const s: Session = { email: u.email, name: u.name, role: u.role };
        setSession(s);
        try {
          localStorage.setItem(SKEY, JSON.stringify(s));
        } catch {}
        return s;
      },
      logout: () => {
        setSession(null);
        try {
          localStorage.removeItem(SKEY);
        } catch {}
      },
      upsert: (c, item) =>
        setData((d) => {
          if (!d) return d;
          const list = d[c] as { id: string }[];
          const exists = list.some((x) => x.id === item.id);
          const next = exists ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
          return { ...d, [c]: next } as Data;
        }),
      remove: (c, id) =>
        setData((d) => (d ? ({ ...d, [c]: (d[c] as { id: string }[]).filter((x) => x.id !== id) } as Data) : d)),
      setSettings: (s) => setData((d) => (d ? { ...d, settings: { ...d.settings, ...s } } : d)),
      resetDemo: () => {
        setData(seed());
        toast("Demo data reset");
      },
      createBooking: (b) => {
        const q = quote(b.roomId, b.checkIn, b.checkOut, b.discountCode);
        if (!q || !isAvailable(b.roomId, b.checkIn, b.checkOut)) return null;
        const n = data.bookings.length + 1;
        const booking: Booking = {
          ...b,
          id: "b" + uid(),
          ref: "LVV-" + (2400 + n + Math.floor(Math.random() * 90)),
          createdAt: new Date().toISOString(),
          total: Math.round(q.total),
          status: "pending",
          payment: "unpaid",
          source: b.source ?? "website",
        };
        setData((d) => (d ? { ...d, bookings: [booking, ...d.bookings] } : d));
        return booking;
      },
    };
  }, [data, session, toast]);

  if (!api) {
    return (
      <div className="grid min-h-screen place-items-center bg-brand-50 text-sm font-semibold text-brand-700">
        Loading Lipton View Villa...
      </div>
    );
  }

  return (
    <Ctx.Provider value={api}>
      {children}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-brand-900 px-5 py-3 text-sm font-medium text-white shadow-xl">
          {toastMsg}
        </div>
      )}
    </Ctx.Provider>
  );
}

export { addDays };

