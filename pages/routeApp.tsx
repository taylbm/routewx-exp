import RouteMap from 'components/routeMap'
import Head from 'next/head'
import Navbar from 'components/navbar'

export default function Home() {
  return (
    <>
      <Head>
        <title>RouteWX</title>
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