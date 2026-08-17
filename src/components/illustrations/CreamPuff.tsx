export function CreamPuff({ className }: { className?: string }) {
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
      <path d="M32 54a28 26 0 0 1 56 0" />
      <path d="M30 68a30 24 0 0 0 60 0" />
      <path d="M34 61h52" opacity="0.5" />
      <circle cx="48" cy="36" r="1.6" opacity="0.7" />
      <circle cx="60" cy="31" r="1.4" opacity="0.7" />
      <circle cx="72" cy="36" r="1.6" opacity="0.7" />
    </svg>
  )
}
