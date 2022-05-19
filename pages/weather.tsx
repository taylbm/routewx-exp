import { useEffect, useState } from 'react'
import { getTimes } from 'lib/dateFunctions'

import HomeMap from 'components/homeMap'
import Head from 'next/head'

export default function Home() {
  const [dateStrings, setDateStrings] = useState<string[]>([])

  useEffect(() => {
    async function getAvailableFrames() {
      const dateStrings = await getTimes()
      setDateStrings(dateStrings.slice(-12))
    }
    getAvailableFrames()
    // update every 2 minutes
    const update = setInterval(() => {
      getAvailableFrames()
    }, 1000 * 120)
    return () => clearInterval(update)
  }, [])

  return (
    <>
      <Head>
        <title>RouteWx</title>
      </Head>
      <div>
        {dateStrings.length && (
          <HomeMap
            dateStrings={dateStrings}
            containerId='map'
            className='h-screen w-full flex-grow'
          />
        )}
      </div>
    </>
  )
}
