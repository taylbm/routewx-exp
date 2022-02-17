import { useEffect, useState } from 'react'
import {
  createMap,
  addRasterLayer,
  hideRasterLayer,
  showRasterLayer,
} from 'lib/mapboxFunctions'
import { parseFrameDate, getFrameUrl } from 'lib/dateFunctions'
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
}: {
  className: string
  children?: JSX.Element | string
  containerId: string
  dateStrings: any[]
}) {
  mapConfig.frames = dateStrings

  const [selectedDate, setSelectedDate] = useState(
    parseFrameDate(mapConfig.frames[0])
  )
  const minDate = useState(parseFrameDate(mapConfig.frames[0]).toString())
  const maxDate = useState(
    parseFrameDate(mapConfig.frames[mapConfig.frames.length - 1]).toString()
  )

  useEffect(() => {
    const map = createMap(containerId)

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

      <div className='absolute top-4 right-4 z-50 rounded-md bg-gray-300 px-4 py-2 opacity-70'>
        {selectedDate.toString()}
        <br />
        Min Date: {minDate}
        <br />
        Max Date: {maxDate}
      </div>
    </div>
  )
}
