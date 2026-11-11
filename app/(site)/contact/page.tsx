"use client";

import { PageBanner } from "@/components/PageBanner";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useStore } from "@/lib/store";
import { uid } from "@/lib/utils";

export default function Contact() {
  const { data, upsert, toast } = useStore();
  const s = data.settings;
  const [f, setF] = useState({ name: "", email: "", subject: "", body: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <>
    <PageBanner title="Contact us" index={3} />
    <div className="container-x py-6">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[{ i: Phone, t: s.phone }, { i: Mail, t: s.email }, { i: MapPin, t: s.address }].map((x) => (
            <div key={x.t} className="card flex items-center gap-4 p-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-brand-700"><x.i size={18} /></span>
              <span className="text-sm font-medium">{x.t}</span>
            </div>
          ))}
          <p className="text-sm text-muted">Check-in from {s.checkInTime} - Check-out by {s.checkOutTime}</p>
        </div>
        <form
          className="card space-y-4 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            upsert("messages", { id: "g" + uid(), ...f, date: new Date().toISOString(), read: false });
            setF({ name: "", email: "", subject: "", body: "" });
            toast("Message sent - it now appears in the admin inbox.");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label><span className="label">Name</span><input required className="input" value={f.name} onChange={set("name")} /></label>
            <label><span className="label">Email</span><input required type="email" className="input" value={f.email} onChange={set("email")} /></label>
          </div>
          <label className="block"><span className="label">Subject</span><input required className="input" value={f.subject} onChange={set("subject")} /></label>
          <label className="block"><span className="label">Message</span><textarea required rows={5} className="input" value={f.body} onChange={set("body")} /></label>
          <button className="btn-primary">Send message</button>
        </form>
      </div>
    </div>
    </>
  );
}
