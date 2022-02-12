export function addRasterLayer(
  map,
  currentFrameUrl,
  currentFrameDateStr,
  opacity
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

export function showRasterLayer(map, duration, opacity, frameName) {
  map.setPaintProperty(frameName, 'raster-opacity-transition', {
    duration: duration,
    delay: duration,
  })
  map.setPaintProperty(frameName, 'raster-opacity', opacity)
}

export function hideRasterLayer(map, duration, frameName) {
  map.setPaintProperty(frameName, 'raster-opacity-transition', {
    duration: duration,
    delay: duration,
  })
  map.setPaintProperty(frameName, 'raster-opacity', 0)
}
