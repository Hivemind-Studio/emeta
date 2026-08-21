import { getSettings } from "@/lib/data";
import { updateSettings } from "./actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const metadata = { title: "Pengaturan | PT Emeta Teknologi Indonesia" };

export default async function AdminSettingsPage() {
  const s = await getSettings();
  const fields: { key: keyof typeof s; label: string; full?: boolean }[] = [
    { key: "brandName", label: "Nama Brand" },
    { key: "phoneDisplay", label: "Telepon (tampilan)" },
    { key: "emailSupport", label: "Email Support", full: true },
    { key: "officeAddress", label: "Alamat Kantor", full: true },
    { key: "linkedinUrl", label: "LinkedIn URL", full: true },
    { key: "facebookUrl", label: "Facebook URL", full: true },
    { key: "twitterUrl", label: "Twitter URL", full: true },
    { key: "youtubeUrl", label: "YouTube URL", full: true },
    { key: "foundedYear", label: "Tahun Berdiri" },
    { key: "heroTitle", label: "Hero Judul", full: true },
    { key: "heroBody", label: "Hero Deskripsi", full: true },
    { key: "aboutTitle", label: "About Judul" },
    { key: "aboutBody", label: "About Deskripsi", full: true },
    { key: "copyright", label: "Copyright", full: true },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="font-sans text-2xl font-bold text-ink-soft">Pengaturan</h1>
      <p className="mt-1 text-sm text-graphite">Konfigurasi branding &amp; kontak PT Emeta.</p>

      <form action={updateSettings} className="mt-8 space-y-6 rounded-xl border border-line-soft bg-white p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key as string} className={f.full ? "sm:col-span-2" : ""}>
              <label htmlFor={f.key as string} className="mb-2 block text-sm font-semibold text-ink-soft">
                {f.label}
              </label>
              <input
                id={f.key as string}
                name={f.key as string}
                defaultValue={String((s as Record<string, unknown>)[f.key] ?? "")}
                className="w-full rounded-lg border border-line bg-white px-4 py-3 outline-none focus:border-brand"
              />
            </div>
          ))}
        </div>

        <div className="border-t border-line-soft pt-6">
          <h3 className="mb-4 font-sans text-lg font-bold text-ink-soft">Aset CDN (key)</h3>
          <div className="space-y-4">
            <ImageUploader name="heroImageUrl" label="Hero Background" defaultValue={s.heroImageUrl} />
            <ImageUploader name="logoWhiteUrl" label="Logo Putih (hero nav)" defaultValue={s.logoWhiteUrl} />
            <ImageUploader name="logoBlueUrl" label="Logo Biru (inner nav)" defaultValue={s.logoBlueUrl} />
            <ImageUploader name="contactMapUrl" label="Peta Kontak" defaultValue={s.contactMapUrl} />
          </div>
        </div>

        <button className="btn-brand px-6 py-3 text-sm">Simpan Pengaturan</button>
      </form>
    </div>
  );
}