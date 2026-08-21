import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Syarat & Ketentuan | PT Emeta Teknologi Indonesia",
  description: "Syarat dan Ketentuan penggunaan situs PT Emeta Teknologi Indonesia.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header brandName={settings.brandName} variant="light" />
      <main className="flex-1">
        <section className="pt-32 pb-20">
          <div className="container-emeta max-w-3xl">
            <h1 className="section-heading">Syarat &amp; Ketentuan</h1>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-soft">
              <p>
                Dengan mengakses situs {settings.brandName}, Anda menyetujui syarat dan
                ketentuan berikut ini.
              </p>
              <p>
                Seluruh konten, gambar, dan informasi pada situs ini adalah milik{" "}
                {settings.brandName} dan dilindungi hak cipta. Informasi layanan dapat
                berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.
              </p>
              <p>
                Untuk pertanyaan lebih lanjut, silakan hubungi kami melalui email{" "}
                {settings.emailSupport}.
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