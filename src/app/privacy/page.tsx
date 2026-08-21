import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kebijakan Privasi | PT Emeta Teknologi Indonesia",
  description: "Kebijakan privasi penggunaan data pada situs PT Emeta Teknologi Indonesia.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header brandName={settings.brandName} variant="light" />
      <main className="flex-1">
        <section className="pt-32 pb-20">
          <div className="container-emeta max-w-3xl">
            <h1 className="section-heading">Kebijakan Privasi</h1>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-soft">
              <p>
                {settings.brandName} menghargai privasi Anda. Situs ini tidak mengumpulkan
                data pribadi tanpa sepengetahuan Anda.
              </p>
              <p>
                Informasi yang Anda berikan melalui formulir kontak hanya digunakan untuk
                merespons pertanyaan dan memberikan layanan yang Anda minta. Data tidak
                dibagikan kepada pihak ketiga di luar keperluan layanan.
              </p>
              <p>
                Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, hubungi kami
                di {settings.emailSupport}.
              </p>
              <p>
                <Link href="/" className="link-arrow text-sm">← Kembali ke Beranda</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}