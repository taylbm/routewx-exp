import { useEffect, useState } from 'react'
import { createMap } from 'lib/mapboxFunctions'
import { getTimezoneName } from 'lib/dateFunctions'
import 'mapbox-gl/dist/mapbox-gl.css'

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import mapboxgl from 'mapbox-gl'
import { getRoute } from 'lib/backendFunctions'

import ReactDOMServer from 'react-dom/server'

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

export default function RouteMap({
  className = '',
  // children,
  containerId,
}: {
  className: string
  // children?: JSX.Element | string
  containerId: string
}) {
  const [map, setMap] = useState<mapboxgl.Map | null>()

  const [origin, setOrigin] = useState<[number, number] | null>(null)
  const [destination, setDestination] = useState<[number, number] | null>(null)
  const [curRouteData, setCurRouteData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const map = createMap(containerId)

    const removeOldRoute = () => {
      const curLayer = map?.getLayer('curRoute')
      console.log('considering removing')
      console.log(curLayer)
      if (curLayer) {
        map?.removeLayer('curRoute')
        map?.removeSource('curRoute')
        console.log('tried to remove')
      }

      console.log('wow')
    }

    originGeocoder.on('result', ({ result }) => {
      console.log('changed')
      console.log({ result })
      console.log(result.center)
      setOrigin(result.center)
      removeOldRoute()
    })

    destinationGeocoder.on('result', ({ result }) => {
      console.log('changed')
      console.log({ result })
      console.log(result.center)
      setDestination(result.center)
      removeOldRoute()
    })

    map.addControl(originGeocoder, 'top-left')
    map.addControl(destinationGeocoder, 'top-right')

    map.addControl(new mapboxgl.GeolocateControl())
    // document.getElementById('originGeocoder').appendChild(originGeocoder.onAdd(map))
    // document.getElementById('geocoder2').appendChild(geocoder2.onAdd(map))
    // console.log({ geocoder1 })
    // geocoder1.on('change', () => {

    //   console.log('chamged!!!')
    //   console.log({ geocoder1 })
    // })

    setMap(map)
  }, [containerId])

  const removeOldRoute = () => {
    const curLayer = map?.getLayer('curRoute')
    console.log('considering removing')
    console.log(curLayer)
    if (curLayer) {
      map?.removeLayer('curRoute')
      map?.removeSource('curRoute')
      console.log('tried to remove')
    }

    console.log('wow')
  }

  const go = async () => {
    setLoading(true)
    const result = await getRoute(
      origin as [number, number],
      destination as [number, number]
    )
    setLoading(false)
    console.log({ result })

    removeOldRoute()

    setCurRouteData(result)

    console.log({ curRouteData })

    const mapBoundAdjustmentFactor = 0.5
    map?.fitBounds([
      [
        result.bounds.southwest.lng + mapBoundAdjustmentFactor,
        result.bounds.southwest.lat - mapBoundAdjustmentFactor,
      ],
      [
        result.bounds.northeast.lng - mapBoundAdjustmentFactor,
        result.bounds.northeast.lat + mapBoundAdjustmentFactor,
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
          // e.features[0].properties.temp
          // "<div class='font-bold'>howdy there</div>"
        )
        .addTo(map)
    })
  }

  return (
    <div id={containerId} className={`${className} relative`}>
      {/* {children} */}
      {/* <div className='absolute top-32 left-4 z-50 flex'>
        <span id='originGeocoder' className='' />
        <span id='geocoder2' className='ml-4' />
      </div> */}

      {loading && (
        <div className='absolute inset-0 z-50 flex cursor-not-allowed items-center justify-center'>
          <div className='absolute inset-0 cursor-not-allowed bg-gray-500 opacity-50' />
          <svg
            role='status'
            className='flex h-16 w-16 animate-spin fill-blue-600 text-gray-200'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='currentFill'
            />
          </svg>
        </div>
      )}

      <div className='absolute bottom-4 right-4 z-40 rounded-md bg-gray-300 px-4 py-2 opacity-70'>
        {origin && <span>Origin {origin.toString()}</span>}
        <br />
        {destination && <span>Destination {destination.toString()}</span>}
        <br />
        <button onClick={go}>go</button>
      </div>
    </div>
  )
}
