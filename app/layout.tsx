import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lipton View Villa | Mountain villa stay in Haputale, Sri Lanka",
  description:
    "Book a private hill-country villa with tea-estate views near Lipton's Seat, Sri Lanka. Demo website with booking engine and admin dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
