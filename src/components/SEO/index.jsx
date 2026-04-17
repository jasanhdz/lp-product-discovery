import { Helmet } from 'react-helmet-async'

const DEFAULT_TITLE = 'LP Product Discovery'
const DEFAULT_DESCRIPTION =
  'Portal de la Ciudadela - Descubre personajes, visualiza gráficas de riesgo interdimensionales y administra a tu equipo usando Supabase Auth.'
const DEFAULT_IMAGE = 'https://lp-product-discovery.vercel.app/rickyAndMortyApp.png'

export const SEO = ({ title, description, url = 'https://lp-product-discovery.vercel.app' }) => {
  const currentTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
  const currentDescription = description || DEFAULT_DESCRIPTION

  return (
    <Helmet>
      {/* Metadatos Estándar */}
      <title>{currentTitle}</title>
      <meta name="description" content={currentDescription} />

      {/* Open Graph (Facebook / LinkedIn / Slack) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:image" content={DEFAULT_IMAGE} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={currentDescription} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
    </Helmet>
  )
}

export default SEO
