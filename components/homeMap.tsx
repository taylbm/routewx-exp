import { useEffect, useRef, useState } from 'react'
import {
  createMap,
  addRasterLayer,
  hideRasterLayer,
  showRasterLayer,
} from 'lib/mapboxFunctions'
import { parseFrameDate, getFrameUrl } from 'lib/dateFunctions'
import { LngLatLike } from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

let mapConfig = {
  shsrVisible: true,
  shsrOpacity: 0.85,
  animationDuration: 0,
  currentFrame: 0,
}

export default function HomeMap({
  className = '',
  children,
  containerId,
  dateStrings = [],
}: {
  className: string
  children?: JSX.Element | string
  containerId: string
  dateStrings: any[]
}) {
  const [selectedDate, setSelectedDate] = useState(
    parseFrameDate(dateStrings[0])
  )
  const minDate = parseFrameDate(dateStrings[0]).toString()
  const maxDate = parseFrameDate(dateStrings[dateStrings.length - 1]).toString()
  const [map, setMap] = useState<mapboxgl.Map>()
  const [mapFrames, setMapFrames] = useState([] as string[])
  const [mapLoaded, setMapLoaded] = useState(false)

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

    map.on('load', () => {
      setMapLoaded(true)
    })

    setMap(map)
  }, [containerId])

  const intervalIdRef = useRef<NodeJS.Timer>()

  useEffect(() => {
    if (map && mapLoaded) {
      for (var frame of mapFrames) {
        if (map.getLayer(frame)) {
          map.removeLayer(frame)
        }
        if (map.getSource(frame)) {
          map.removeSource(frame)
        }
      }

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
      }

      intervalIdRef.current = setInterval(() => {
        if (mapFrames.length > 0) {
          const previousFrameDateStr = mapFrames[mapConfig.currentFrame]
          let oldLayer = map.getLayer(previousFrameDateStr)

          mapConfig.currentFrame =
            (mapConfig.currentFrame + 1) % mapFrames.length

          let currentFrameDateStr = mapFrames[mapConfig.currentFrame]
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

      setMapFrames(dateStrings)
    }
  }, [dateStrings, map, mapFrames, mapLoaded])

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
