import RouteMap from 'components/routeMap'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>RouteWx</title>
      </Head>
      <div>
        <RouteMap
          containerId='map'
          className='absolute inset-0 h-screen w-screen'
        />
      </div>
    </>
  )
}
