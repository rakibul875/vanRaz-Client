import Link from "next/link";

/**
 * Left-hand brand panel shared by /login and /register.
 * Signature element: a thin, slowly-drawing "growth line" with three
 * markers that light up in sequence — a quiet nod to deal / value flow
 * without leaning on a dashboard cliché.
 */
export default function BrandPanel({
  eyebrow,
  headline,
  body,
}: {
  eyebrow: string;
  headline: string;
  body: string;
}) {
  return (
    <div className="relative hidden lg:flex lg:w-[44%] flex-col justify-between overflow-hidden bg-[#0E1B1B] px-12 py-12 text-[#FBFAF7]">
      {/* fine grain texture, kept very quiet */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <Link
        href="/"
        className="relative font-serif text-[1.75rem] font-medium tracking-tight"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        Ven<span className="text-[#C08A3E]">Raz</span>
      </Link>

      <div className="relative">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#8FB3A9]">
          {eyebrow}
        </p>
        <h2
          className="mb-4 max-w-sm text-3xl font-medium leading-[1.15] tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {headline}
        </h2>
        <p className="max-w-xs text-[15px] leading-relaxed text-[#B9CCC5]">
          {body}
        </p>

        {/* Signature growth-line graphic */}
        <div className="mt-10 w-full max-w-sm">
          <svg
            viewBox="0 0 360 120"
            fill="none"
            className="w-full text-[#C08A3E]"
            aria-hidden
          >
            <path
              d="M4 96 C 60 96, 70 60, 110 62 C 150 64, 150 30, 200 32 C 250 34, 240 78, 290 50 C 320 32, 330 20, 356 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="venraz-growth-path"
            />
            {[
              { cx: 110, cy: 62, delay: "0.6s" },
              { cx: 200, cy: 32, delay: "1.3s" },
              { cx: 356, cy: 10, delay: "2s" },
            ].map((m, i) => (
              <circle
                key={i}
                cx={m.cx}
                cy={m.cy}
                r="4"
                fill="#FBFAF7"
                stroke="#C08A3E"
                strokeWidth="2"
                className="venraz-growth-marker"
                style={{ animationDelay: m.delay }}
              />
            ))}
          </svg>
        </div>
      </div>

      <p className="relative text-xs text-[#6E8880]">
        © {new Date().getFullYear()} VenRaz, Inc.
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        .venraz-growth-path {
          stroke-dasharray: 480;
          stroke-dashoffset: 480;
          animation: venraz-draw 2.2s ease-out forwards;
        }
        .venraz-growth-marker {
          opacity: 0;
          animation: venraz-pop 0.5s ease-out forwards;
        }
        @keyframes venraz-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes venraz-pop {
          from { opacity: 0; transform: scale(0.4); }
          to { opacity: 1; transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .venraz-growth-path { stroke-dashoffset: 0; animation: none; }
          .venraz-growth-marker { opacity: 1; animation: none; }
        }
      `}</style>
    </div>
  );
}