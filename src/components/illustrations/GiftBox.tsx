export function GiftBox({ className }: { className?: string }) {
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
      <rect x="11" y="22" width="26" height="15" rx="2.5" />
      <path d="M11 27h26" opacity="0.6" />
      <path d="M24 22v15" opacity="0.6" />
      <path d="M24 22c-3.5-4-9-4.5-9-1.5S20.5 23 24 22Z" />
      <path d="M24 22c3.5-4 9-4.5 9-1.5S27.5 23 24 22Z" />
    </svg>
  )
}
