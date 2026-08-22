import Link from "next/link";

export const metadata = {
  title: { absolute: "Halaman Tidak Ditemukan | PT Emeta Teknologi Indonesia" },
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#fafafa]">
      <main className="flex flex-1 items-center justify-center">
        <div className="mx-auto w-full max-w-[1128px] px-6 text-center">
          <h1 className="text-[54px] font-extrabold leading-none text-navy-emeta">404</h1>
          <p className="mt-[24px] font-inter text-[18px] leading-[28px] text-graphite">
            Halaman yang kamu cari tidak ditemukan.
          </p>
          <div className="mt-[43px] flex justify-center">
            <Link
              href="/"
              className="inline-flex h-[47px] w-[120px] items-center justify-center rounded-[8px] bg-brand-light font-inter text-[16px] font-semibold text-white transition-colors hover:bg-[#6fa8ee]"
            >
              Go Back
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
