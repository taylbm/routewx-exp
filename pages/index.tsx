import { useEffect, useState } from 'react'
import {
  addRasterLayer,
  hideRasterLayer,
  showRasterLayer,
} from 'map/rasterLayer'
import { parseFrameDate, getFrameUrl, subtractHours, getTimes } from 'map/utils'
import { Map } from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

let mapConfig = {
  shsrVisible: true,
  shsrOpacity: 0.85,
  animationDuration: 0,
  totalFrames: 12,
  currentFrame: 0,
  frames: [],
}

export default function Home() {
  const [map, setMap] = useState<Map>()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [updatedDate, setUpdatedDate] = useState(new Date())
  const [minDate, setMinDate] = useState(subtractHours(new Date(), 1))
  const [maxDate, setMaxDate] = useState(new Date())

  useEffect(() => {
    const map = new Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE,
      container: 'map',
      center: [-100, 40],
      zoom: 4,
    })

    map.on('load', () => {
      setInterval(() => {
        if (mapConfig.frames.length > 0) {
          const previousFrameDateStr = mapConfig.frames[mapConfig.currentFrame]
          let oldLayer = map.getLayer(previousFrameDateStr)
          if (oldLayer) {
            hideRasterLayer(
              map,
              mapConfig.animationDuration,
              previousFrameDateStr
            )
          }

          mapConfig.currentFrame =
            (mapConfig.currentFrame + 1) % mapConfig.totalFrames

          let currentFrameDateStr = mapConfig.frames[mapConfig.currentFrame]
          let currentFrameUrl = getFrameUrl(currentFrameDateStr)
          let currentFrameDate = parseFrameDate(currentFrameDateStr)
          let shsrLayer = map.getLayer(currentFrameDateStr)

          setSelectedDate(currentFrameDate)

          if (typeof shsrLayer === 'undefined') {
            addRasterLayer(
              map,
              currentFrameUrl,
              currentFrameDateStr,
              mapConfig.shsrOpacity
            )
          }
          if (mapConfig.shsrVisible) {
            showRasterLayer(
              map,
              mapConfig.animationDuration,
              mapConfig.shsrOpacity,
              currentFrameDateStr
            )
          }
        }
      }, 250)
    })

    setMap(map)

    async function getAvailableFrames() {
      const times = await getTimes()
      const dateStrings = times.dateStrings.slice(-mapConfig.totalFrames)
      mapConfig.frames = dateStrings

      const min = parseFrameDate(dateStrings[0])
      const max = parseFrameDate(dateStrings[dateStrings.length - 1])

      setMinDate(min)
      setMaxDate(max)
    }
    getAvailableFrames()
  }, [])

  return (
    <div>
      <div>{selectedDate.toString()}</div>
      <div>Min Date: {minDate.toString()}</div>
      <div>Max Date: {maxDate.toString()}</div>

      <div id='map' className='relative h-screen w-full'></div>
    </div>
  )
}
