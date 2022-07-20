import { Map, LngLatLike } from 'mapbox-gl'

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
const style = process.env.NEXT_PUBLIC_MAPBOX_STYLE

export function createMap(container: string, center: LngLatLike, zoom: number) {
  return new Map({
    accessToken,
    style,
    container,
    center,
    zoom,
  })
}

export function addRasterLayer(
  map: Map,
  currentFrameUrl: string,
  currentFrameDateStr: string,
  opacity: number
) {
  map.addSource(currentFrameDateStr, {
    type: 'raster',
    scheme: 'xyz',
    tiles: [currentFrameUrl + '/tiles/{z}/{x}/{y}.png'],
    tileSize: 256,
    attribution:
      '<a href="https://vlab.noaa.gov/web/wdtd/-/seamless-hybrid-scan-reflectivity-shsr-">Seamless Hybrid-Scan Reflectivity</a>',
  })

  map.addLayer(
    {
      id: currentFrameDateStr,
      type: 'raster',
      source: currentFrameDateStr,
      paint: {
        'raster-opacity': opacity,
      },
    },
    'warnings-layer'
  )
}

export function showRasterLayer(
  map: Map,
  duration: number,
  opacity: number,
  frameName: string
) {
  map.setPaintProperty(frameName, 'raster-opacity-transition', {
    duration: duration,
    delay: duration,
  })
  map.setPaintProperty(frameName, 'raster-opacity', opacity)
}

export function hideRasterLayer(map: Map, duration: number, frameName: string) {
  map.setPaintProperty(frameName, 'raster-opacity-transition', {
    duration: duration,
    delay: duration,
  })
  map.setPaintProperty(frameName, 'raster-opacity', 0)
}
