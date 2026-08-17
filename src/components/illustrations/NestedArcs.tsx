export function NestedArcs({ className }: { className?: string }) {
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
      <path d="M20 230h200" />
      <path d="M40 230a80 80 0 0 1 160 0" />
      <path d="M70 230a50 50 0 0 1 100 0" opacity="0.7" />
      <path d="M100 230a20 20 0 0 1 40 0" opacity="0.5" />
      <circle cx="120" cy="78" r="13" opacity="0.5" />
    </svg>
  )
}
