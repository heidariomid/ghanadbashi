import { Container } from '@/components/layout/Container'
import { MobileNav } from '@/components/layout/MobileNav'
import { content } from '@/data/content'
import { cleanContactValue, whatsappHref } from '@/lib/contact'
import { getSiteSettings } from '@/lib/site-settings'

export async function Header() {
  const { brand, nav, primaryCta, whatsapp: whatsappCopy } = content
  const settings = await getSiteSettings()
  const brandName = settings.brand?.brandName?.trim() || brand.name
  const whatsappValue = cleanContactValue(settings.contact?.whatsapp)
  const href = whatsappValue ? whatsappHref(whatsappValue) : null
  const whatsapp = href ? { label: whatsappCopy.label, href } : undefined

  return (
    <header className="sticky top-0 z-40 border-b border-border">
      {/* The blur lives on this layer, not on the header: backdrop-filter would
          make the header a containing block and trap the drawer's fixed layer. */}
      <div className="absolute inset-0 -z-10 bg-background/87 backdrop-blur-md" />

      <Container className="flex h-nav items-center justify-between gap-6">
        <a
          href="#top"
          className="group flex min-h-11 flex-col justify-center leading-none"
        >
          <span className="text-brand font-black text-card-foreground transition-colors duration-200 group-hover:text-primary">
            {brandName}
          </span>
          <span className="mt-1.5 text-brand-sub text-muted-foreground">
            {brand.latinName}
          </span>
        </a>

        <nav className="hidden min-w-0 flex-wrap items-center justify-center gap-x-8 gap-y-2 text-small text-muted-foreground md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition-colors duration-200 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4.5">
          {whatsapp ? (
            <a
              href={whatsapp.href}
              dir="ltr"
              className="hidden text-small text-muted-foreground transition-colors duration-200 hover:text-primary lg:inline"
            >
              {whatsapp.label}
            </a>
          ) : null}
          <a
            href={primaryCta.href}
            className="hidden min-h-11 items-center rounded-full bg-primary px-7 text-small font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary md:inline-flex"
          >
            {primaryCta.label}
          </a>
          <MobileNav
            items={nav}
            primaryCta={primaryCta}
            whatsapp={whatsapp}
            brandName={brandName}
          />
        </div>
      </Container>
    </header>
  )
}
