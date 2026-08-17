export function Arches({ className }: { className?: string }) {
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
      <path d="M16 244h208" />
      <path d="M26 244V148a44 44 0 0 1 88 0v96" />
      <path d="M114 244v-64a34 34 0 0 1 68 0v64" opacity="0.7" />
      <circle cx="200" cy="112" r="12" opacity="0.5" />
    </svg>
  )
}
