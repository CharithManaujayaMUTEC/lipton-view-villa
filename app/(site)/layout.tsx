import { Footer, Navbar } from "@/components/SiteChrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="top">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
