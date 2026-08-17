export function CinnamonRoll({ className }: { className?: string }) {
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
      <circle cx="60" cy="60" r="30" />
      <path
        d="M60 60a6 6 0 0 1 12 0 12 12 0 0 1-24 0 18 18 0 0 1 36 0 24 24 0 0 1-48 0"
        opacity="0.7"
      />
    </svg>
  )
}
