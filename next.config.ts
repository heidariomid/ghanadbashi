import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  images: {
    // Uploads are served relative from /api/media locally, but from Blob's own
    // domain once BLOB_READ_WRITE_TOKEN is set in production.
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
}

export default withPayload(nextConfig)
