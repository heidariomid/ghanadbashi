/**
 * Hero illustration — two-tier layered cake on a pedestal stand.
 * Stroke weight is tuned so that at its intended display size it renders at
 * ~1.6px, matching every other illustration in the set.
 */
export function HeroCake({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 360"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* halo — quiet geometry behind the cake, holds the composition together */}
      <circle cx="220" cy="174" r="154" opacity="0.2" />

      {/* upper tier */}
      <ellipse cx="220" cy="124" rx="50" ry="10.5" />
      <path d="M170 124v60" />
      <path d="M270 124v60" />
      <path d="M170 184a50 10.5 0 0 0 100 0" />

      {/* lower tier */}
      <ellipse cx="220" cy="196" rx="78" ry="15" />
      <path d="M142 196v68" />
      <path d="M298 196v68" />
      <path d="M142 264a78 15 0 0 0 156 0" />

      {/* three berries and a sprig on the crown */}
      <circle cx="204" cy="116" r="4.5" />
      <circle cx="221" cy="110" r="4.5" />
      <circle cx="238" cy="117" r="4.5" />
      <path d="M243 110c11-11 16-24 16-38" />
      <path d="M255 93c5-5 11-6 16-5-4 6-11 8-16 6Z" />
      <path d="M257 79c-4-7-4-14-2-19 4 6 6 13 4 19Z" />

      {/* pedestal */}
      <ellipse cx="220" cy="274" rx="104" ry="17" />
      <path d="M208 291c-3 12-5 22-10 32" />
      <path d="M232 291c3 12 5 22 10 32" />
      <path d="M190 325h60" />

      {/* two crumbs — the only asymmetry, and it is deliberate */}
      <circle cx="322" cy="320" r="2.4" />
      <circle cx="336" cy="313" r="1.6" />
    </svg>
  )
}
