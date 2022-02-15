import { Map } from 'mapbox-gl'

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
      'Seamless Hybrid-Scan Reflectivity (https://vlab.noaa.gov/web/wdtd/-/seamless-hybrid-scan-reflectivity-shsr-) ',
  })

  map.addLayer({
    id: currentFrameDateStr,
    type: 'raster',
    source: currentFrameDateStr,
    paint: {
      'raster-opacity': opacity,
    },
  })
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
