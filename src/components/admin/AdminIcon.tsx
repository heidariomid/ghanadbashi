/** Cake mark used in the admin header and beside the wordmark. */
export function AdminIcon() {
  return (
    <svg
      className="admin-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#fbf6ee" />
      <path d="M6 22.5h20v3a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 6 25.5v-3Z" fill="#d98e88" />
      <path d="M8 14.5c0-1.2 1-2 2.2-2h11.6c1.2 0 2.2.8 2.2 2v8H8v-8Z" fill="#f6d6cf" />
      <path
        d="M9.5 12.5c0-1.6 1.4-2.6 2.9-2.4.5-1.6 2-2.6 3.6-2.6s3.1 1 3.6 2.6c1.5-.2 2.9.8 2.9 2.4"
        fill="none"
        stroke="#5f5041"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="5.5" r="1.6" fill="#d98e88" />
    </svg>
  )
}
