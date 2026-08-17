export function Baklava({ className }: { className?: string }) {
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
      <path d="M60 28 96 60 60 92 24 60Z" />
      <path d="M60 44 78 60 60 76 42 60Z" opacity="0.55" />
      <circle cx="60" cy="60" r="3.2" />
    </svg>
  )
}
