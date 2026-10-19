import Link from "next/link";
import { ReactNode } from "react";
import BrandPanel from "./brand-panel";


export default function AuthFormShell({
  eyebrow,
  headline,
  body,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-[#FBFAF7]">
      <BrandPanel eyebrow={eyebrow} headline={headline} body={body} />

      <div className="flex w-full flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          {/* Mobile-only brand mark */}
          <Link
            href="/"
            className="mb-10 block text-center text-2xl font-medium tracking-tight text-[#0E1B1B] lg:hidden"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Ven<span className="text-[#C08A3E]">Raz</span>
          </Link>

          <div className="mb-8">
            <h1
              className="text-[1.75rem] font-medium tracking-tight text-[#14181B]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {title}
            </h1>
            <p className="mt-2 text-[15px] text-[#6B7268]">{subtitle}</p>
          </div>

          {children}

          <div className="mt-8 border-t border-[#E4E1D8] pt-6 text-center">
            {footer}
          </div>
        </div>
      </div>
    </main>
  );
}