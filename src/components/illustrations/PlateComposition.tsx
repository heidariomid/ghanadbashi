export function PlateComposition({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 300"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="24" y="40" width="192" height="220" rx="2" opacity="0.35" />
      <circle cx="98" cy="118" r="52" />
      <circle cx="158" cy="172" r="34" opacity="0.8" />
      <circle cx="74" cy="198" r="18" opacity="0.6" />
    </svg>
  )
}
