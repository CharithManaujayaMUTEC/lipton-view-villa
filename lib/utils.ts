export const uid = () => Math.random().toString(36).slice(2, 10);

export const money = (n: number) =>
  "$" + Math.round(n).toLocaleString("en-US");

export const iso = (d: Date) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

export const todayISO = () => iso(new Date());

export const addDays = (s: string, n: number) => {
  const d = new Date(s + "T00:00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const nightsBetween = (a: string, b: string) => {
  if (!a || !b) return 0;
  const ms = new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime();
  return Math.max(0, Math.round(ms / 86400000));
};

export const fmtDate = (s: string, opts?: Intl.DateTimeFormatOptions) =>
  new Date(s.length === 10 ? s + "T00:00:00" : s).toLocaleDateString(
    "en-GB",
    opts ?? { day: "numeric", month: "short", year: "numeric" }
  );

export const fmtShort = (s: string) => fmtDate(s, { day: "numeric", month: "short" });

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Downscale an image file to a compact JPEG data-URL so it fits in localStorage. */
export function fileToDataUrl(file: File, maxW = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      if (!file.type.startsWith("image/")) return resolve(String(reader.result));
      const img = new Image();
      img.onerror = () => reject(new Error("Not a valid image"));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.78));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
