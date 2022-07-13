import type { AppProps } from 'next/app'
import Head from 'next/head'

import 'tailwindcss/tailwind.css'
import './global.css'

import Layout from 'components/layout'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
        />
        {/* Twitter */}
        <meta property='twitter:card' key='twitter:card' content='summary' />
        <meta
          property='twitter:url'
          key='twitter:url'
          content='https://www.routewx.com'
        />
        <meta property='twitter:title' key='twitter:title' content='RouteWx' />
        <meta
          property='twitter:description'
          key='twitter:description'
          content='Stay ahead of the weather curve.'
        />
        <meta
          property='twitter:image'
          key='twitter:image'
          content='https://www.routewx.com/icons/manifest-icon-192.maskable.png'
        />
        <meta
          property='twitter:image:alt'
          key='twitter:image:alt'
          content='RouteWx logo'
        />
        <meta
          property='twitter:site'
          key='twitter:site'
          content='@weatherdude9'
        />
        <meta
          property='twitter:creator'
          key='twitter:creator'
          content='@weatherdude9'
        />
      </Head>
      {router.pathname === '/demo' ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  )
}

export default MyApp
