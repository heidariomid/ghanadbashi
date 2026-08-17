import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type NotFoundProps = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

const NotFound = ({ params, searchParams }: NotFoundProps) =>
  NotFoundPage({
    config,
    importMap,
    params,
    searchParams,
  })

export default NotFound
