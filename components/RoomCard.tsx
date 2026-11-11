"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import { useState } from "react";
import type { Room } from "@/lib/types";
import { money } from "@/lib/utils";
import { Img, Rating } from "./ui";
import { useStore } from "@/lib/store";

export function RoomCard({ room, query = "", total, nights }: { room: Room; query?: string; total?: number; nights?: number }) {
  const [fav, setFav] = useState(false);
  const { data } = useStore();
  return (
    <Link href={`/rooms/${room.id}${query}`} className="card group block overflow-hidden transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Img src={room.images[0]} alt={room.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {room.badge && (
          <span className="badge absolute left-3 top-3 bg-brand-700 text-white">{room.badge}</span>
        )}
        <button
          aria-label="Favourite"
          onClick={(e) => {
            e.preventDefault();
            setFav(!fav);
          }}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white shadow"
        >
          <Heart size={15} className={fav ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-tight">{room.name}</h3>
          <Rating value={room.rating / 2} />
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
          <MapPin size={12} /> {data.settings.location} · up to {room.maxGuests} guests
        </p>
        <p className="mt-3 text-lg font-extrabold text-brand-800">
          {money(room.pricePerNight)} <span className="text-xs font-medium text-muted">/ night</span>
        </p>
        {total !== undefined && nights ? (
          <p className="text-xs text-muted">
            {money(total)} total for {nights} night{nights > 1 ? "s" : ""}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
