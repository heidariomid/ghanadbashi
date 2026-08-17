export function Jar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="16" y="10" width="16" height="5" rx="1.6" />
      <path d="M18.5 15v4" />
      <path d="M29.5 15v4" />
      <rect x="14" y="19" width="20" height="19" rx="4.5" />
      <path d="M20 29h8" opacity="0.55" />
    </svg>
  )
}
