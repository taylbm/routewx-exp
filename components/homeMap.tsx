import { useEffect, useState } from 'react'
import {
  createMap,
  addRasterLayer,
  hideRasterLayer,
  showRasterLayer,
} from 'lib/mapboxFunctions'
import { parseFrameDate, getFrameUrl } from 'lib/dateFunctions'
import mapboxgl, { LngLatLike } from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

let mapConfig = {
  shsrVisible: true,
  shsrOpacity: 0.85,
  animationDuration: 0,
  currentFrame: 0,
  frames: [] as string[],
}

export default function HomeMap({
  className = '',
  children,
  containerId,
  dateStrings = [],
  initialLoad,
}: {
  className: string
  children?: JSX.Element | string
  containerId: string
  dateStrings: any[]
  initialLoad: boolean
}) {
  const [selectedDate, setSelectedDate] = useState(
    parseFrameDate(dateStrings[0])
  )
  const minDate = parseFrameDate(dateStrings[0]).toString()
  const maxDate = parseFrameDate(dateStrings[dateStrings.length - 1]).toString()

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const centerLat = queryParams.get('centerLat') ?? '40'
    const centerLon = queryParams.get('centerLon') ?? '-100'
    const zoom = queryParams.get('zoom') ?? '4'
    const centerLatInt = parseInt(centerLat, 10)
    const centerLonInt = parseInt(centerLon, 10)
    const zoomInt = parseInt(zoom, 10)

    const map = createMap(
      containerId,
      [centerLonInt, centerLatInt] as LngLatLike,
      zoomInt
    )

    if (!initialLoad) {
      for (var frame of mapConfig.frames) {
        map.removeLayer(frame)
        map.removeSource(frame)
      }
    }
    mapConfig.frames = dateStrings

    map.on('load', () => {
      setInterval(() => {
        if (mapConfig.frames.length > 0) {
          const previousFrameDateStr = mapConfig.frames[mapConfig.currentFrame]
          let oldLayer = map.getLayer(previousFrameDateStr)

          mapConfig.currentFrame =
            (mapConfig.currentFrame + 1) % mapConfig.frames.length

          let currentFrameDateStr = mapConfig.frames[mapConfig.currentFrame]
          let currentFrameUrl = getFrameUrl(currentFrameDateStr)
          let currentFrameDate = parseFrameDate(currentFrameDateStr)
          let shsrLayer = map.getLayer(currentFrameDateStr)

          setSelectedDate(currentFrameDate)

          if (mapConfig.shsrVisible) {
            if (typeof shsrLayer === 'undefined') {
              addRasterLayer(
                map,
                currentFrameUrl,
                currentFrameDateStr,
                mapConfig.shsrOpacity
              )
            } else {
              showRasterLayer(
                map,
                mapConfig.animationDuration,
                mapConfig.shsrOpacity,
                currentFrameDateStr
              )
            }
          }
          if (oldLayer) {
            hideRasterLayer(
              map,
              mapConfig.animationDuration,
              previousFrameDateStr
            )
          }
        }
      }, 250)
    })
  }, [containerId, dateStrings])

  return (
    <div id={containerId} className={`${className} relative`}>
      {children}

      <div className='absolute top-4 right-4 z-50 rounded-md bg-gray-300 px-4 py-2 text-xl opacity-70'>
        {selectedDate.toString()}
        <br />
        Min Date: {minDate}
        <br />
        Max Date: {maxDate}
      </div>
    </div>
  )
}
