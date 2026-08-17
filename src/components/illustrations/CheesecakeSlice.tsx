export function CheesecakeSlice({ className }: { className?: string }) {
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
      <path d="M28 82h58V32z" />
      <path d="M45 68h41" opacity="0.6" />
      <path d="M63 52h23" opacity="0.6" />
      <circle cx="72" cy="45" r="3.2" />
    </svg>
  )
}
