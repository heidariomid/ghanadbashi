export function ChocolateCake({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="60" cy="42" rx="33" ry="7.5" />
      <path d="M27 42v34" />
      <path d="M93 42v34" />
      <path d="M27 76a33 7.5 0 0 0 66 0" />
      <path d="M27 51a33 7.5 0 0 0 66 0" opacity="0.55" />
      <circle cx="53" cy="35" r="3.4" />
      <circle cx="65" cy="32.5" r="3.4" />
    </svg>
  )
}
