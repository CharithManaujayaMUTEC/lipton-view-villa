"use client";

import { Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn, fmtDate } from "@/lib/utils";
import { PageHead } from "@/components/admin";

export default function Messages() {
  const { data, upsert, remove } = useStore();
  const list = [...data.messages].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHead title="Messages" sub="Enquiries from the contact form" />
      <div className="space-y-3">
        {list.map((m) => (
          <div key={m.id} className={cn("card p-5", !m.read && "border-brand-400 bg-brand-50")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold">{m.subject} <span className="font-normal text-muted">- {m.name} &lt;{m.email}&gt; - {fmtDate(m.date)}</span></p>
              <div className="flex items-center gap-3 text-sm">
                <a className="font-semibold text-brand-700" href={`mailto:${m.email}?subject=Re: ${m.subject}`}>Reply</a>
                <button className="font-semibold text-brand-700" onClick={() => upsert("messages", { ...m, read: !m.read })}>{m.read ? "Mark unread" : "Mark read"}</button>
                <button className="text-muted hover:text-red-600" aria-label="Delete" onClick={() => remove("messages", m.id)}><Trash2 size={16} /></button>
              </div>
            </div>
            <p className="mt-2 text-sm">{m.body}</p>
          </div>
        ))}
        {list.length === 0 && <div className="card p-8 text-center text-sm text-muted">Inbox empty</div>}
      </div>
    </>
  );
}
