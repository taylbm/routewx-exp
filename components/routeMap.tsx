import { useEffect, useState } from 'react'
import { createMap } from 'lib/mapboxFunctions'
import { getTimezoneName } from 'lib/dateFunctions'
import { fetchRoute } from 'lib/backendFunctions'
import Spinner from 'components/icons/spinner'

import ReactDOMServer from 'react-dom/server'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

const originGeocoder = new MapboxGeocoder({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string,
  mapboxgl: mapboxgl as any,
  countries: 'US',
})

const destinationGeocoder = new MapboxGeocoder({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string,
  mapboxgl: mapboxgl as any,
  countries: 'US',
})

function popupForSegment(segment: any) {
  const d = new Date(0) // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(segment.dt)
  console.log(d)
  const time = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d
    .getDate()
    .toString()
    .padStart(2, '0')}/${d.getFullYear()} ${d
    .getHours()
    .toString()
    .padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')} ${getTimezoneName()}`

  return ReactDOMServer.renderToStaticMarkup(
    <div>
      <div className='font-lg'>
        Big Scary Weather Level: {segment.hazardLevel}
      </div>
      <div>Forecast valid at 🕰️: {time}</div>

      <div>Temperature 🌡️: {segment.temp}°F</div>
      <div>1 Hr. Precipitation ☔: {segment.precip} in.</div>
      <div>1 Hr. Frozen Precipitation 🌨️: {segment.frozenPrecip} in.</div>
      <div>Wind 🌬️: {segment.gust} mph</div>
    </div>
  )
}

function removeOldRoute(map: mapboxgl.Map, id = 'curRoute') {
  const curLayer = map?.getLayer(id)

  if (curLayer) {
    map?.removeLayer(id)
    map?.removeSource(id)
  }
}

export default function RouteMap({
  className = '',
  children,
  containerId,
}: {
  className: string
  children?: JSX.Element | string
  containerId: string
}) {
  const [map, setMap] = useState<mapboxgl.Map | null>()

  const [origin, setOrigin] = useState<[number, number] | null>(null)
  const [destination, setDestination] = useState<[number, number] | null>(null)
  const [curRouteData, setCurRouteData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const map = createMap(containerId)

    originGeocoder.on('result', ({ result }) => {
      console.log('changed')
      console.log({ result })
      console.log(result.center)
      setOrigin(result.center)
      removeOldRoute(map)
    })

    originGeocoder.on('clear', () => {
      setOrigin(null)
      removeOldRoute(map)
    })

    destinationGeocoder.on('result', ({ result }) => {
      console.log('changed')
      console.log({ result })
      console.log(result.center)
      setDestination(result.center)
      removeOldRoute(map)
    })

    destinationGeocoder.on('clear', () => {
      setDestination(null)
      removeOldRoute(map)
    })

    map.addControl(originGeocoder, 'top-left')
    map.addControl(destinationGeocoder, 'top-right')

    // document.getElementById('originGeocoder').appendChild(originGeocoder.onAdd(map))
    // document.getElementById('geocoder2').appendChild(geocoder2.onAdd(map))
    // console.log({ geocoder1 })
    // geocoder1.on('change', () => {

    //   console.log('chamged!!!')
    //   console.log({ geocoder1 })
    // })

    setMap(map)
  }, [containerId])

  const getRoute = async () => {
    setLoading(true)
    const result = await fetchRoute(
      origin as [number, number],
      destination as [number, number]
    )
    setLoading(false)

    removeOldRoute(map as mapboxgl.Map)

    setCurRouteData(result)

    console.log({ curRouteData })

    const mapBoundAdjustmentFactor = 0.05
    map?.fitBounds([
      [
        result.bounds.southwest.lng +
          result.bounds.southwest.lng * mapBoundAdjustmentFactor,
        result.bounds.southwest.lat -
          result.bounds.southwest.lat * mapBoundAdjustmentFactor,
      ],
      [
        result.bounds.northeast.lng -
          result.bounds.northeast.lng * mapBoundAdjustmentFactor,
        result.bounds.northeast.lat +
          result.bounds.northeast.lat * mapBoundAdjustmentFactor,
      ],
    ])

    console.log({ curRouteData })

    const features = result.polylines.map((line: any) => {
      return {
        type: 'Feature',
        properties: {
          color: line.hazard_level,
          hazardLevel: line.hazard_level,
          precip: line.precip,
          frozenPrecip: line.frozen_precip,
          gust: line.gust,
          dt: line.prog_date_epoch,
          temp: line.temp,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [line.coords[0].lng, line.coords[0].lat],
            [line.coords[1].lng, line.coords[1].lat],
          ],
        },
      }
    })

    map?.addSource('curRoute', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    })

    map?.addLayer({
      id: 'curRoute',
      type: 'line',
      source: 'curRoute',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 8,
      },
    })

    map?.on('mouseenter', 'curRoute', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map?.on('mouseleave', 'curRoute', () => {
      map.getCanvas().style.cursor = ''
    })

    map?.on('click', 'curRoute', (e) => {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          popupForSegment(e.features ? (e.features[0].properties as any) : '')
        )
        .addTo(map)
    })
  }

  return (
    <div id={containerId} className={`${className} relative`}>
      {children}
      {/* <div className='absolute top-32 left-4 z-50 flex'>
        <span id='originGeocoder' className='' />
        <span id='geocoder2' className='ml-4' />
      </div> */}

      {loading && (
        <div className='absolute inset-0 z-50 flex cursor-not-allowed items-center justify-center'>
          <div className='absolute inset-0 cursor-not-allowed bg-gray-500 opacity-50' />
          <Spinner />
        </div>
      )}

      <div className='absolute bottom-6 right-6 z-40'>
        <button
          className='inline-flex cursor-pointer items-center rounded-md border border-transparent bg-indigo-100 px-6 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-100 disabled:text-gray-400'
          disabled={origin === null || destination === null}
          onClick={getRoute}
        >
          Get Route
        </button>
      </div>
    </div>
  )
}
