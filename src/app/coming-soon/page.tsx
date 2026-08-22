import Image from "next/image";
import { Header } from "@/components/Header";
import { brandUrl } from "@/lib/brandAssets";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Coming Soon | PT Emeta Teknologi Indonesia" },
  robots: { index: false },
};

export default async function ComingSoonPage() {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <Header brandName={settings.brandName} variant="dark" productsEnabled={settings.productsEnabled} />
      <main className="flex-1">
        {/* ===== COMING SOON (Design 41:2661, 1440x1024) ===== */}
        <section className="relative h-[1024px] overflow-hidden bg-[#fafafa]">
          {/* Decorative layer — clipped to the section box */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-y-0" style={{ left: "-13.2%", width: "126.4%" }}>
              <Image src={brandUrl("heroBg")} alt="" fill priority className="object-cover" sizes="100vw" />
            </div>
            {/* Blurred white icon (41:2663 at x330 → 22.9%, y6743 → -442) */}
            <div className="absolute" style={{ left: "22.92%", top: -442, width: "98.33%", aspectRatio: "1 / 1" }}>
              <Image src={brandUrl("iconWhite")} alt="" fill className="object-contain opacity-50 blur-[40px]" sizes="1416px" />
            </div>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[1128px] px-6 md:px-0">
            {/* title block at y694 within the section */}
            <div className="pt-[694px]">
              <h1 className="max-w-[533px] text-[54px] font-extrabold leading-none text-paper">
                {settings.comingSoonTitle}
              </h1>
              <p className="mt-[37px] min-h-[56px] max-w-[533px] font-inter text-[18px] leading-[28px] text-white/88">
                {settings.comingSoonQuote}
              </p>
              <div className="mt-[27px]">
                <a href="/" className="inline-flex h-[47px] w-[120px] items-center justify-center rounded-[8px] bg-brand-light font-inter text-[16px] font-semibold text-white">
                  Go Back
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
