import { useEffect, useRef, useState } from 'react'
import { render } from 'react-dom'
import {
  createMap,
  addRasterLayer,
  hideRasterLayer,
  showRasterLayer,
} from 'lib/mapboxFunctions'
import { addWatchesWarnings, PopupTemplate } from 'lib/alertFunctions'
import { parseFrameDate, getFrameUrl } from 'lib/dateFunctions'
import mapboxgl, { GeoJSONSource, LngLatLike, Popup } from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCheck, faSquare } from '@fortawesome/free-regular-svg-icons'

let mapConfig = {
  shsrVisible: true,
  shsrOpacity: 0.85,
  animationDuration: 0,
  currentFrame: 0,
  watchesWarningsURL:
    'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/1/query?where=objectid+%3E+1&outFields=prod_type%2C+cap_id&f=geojson',
  warningsURL:
    'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/0/query?where=objectid+%3E+1&outFields=prod_type%2C+cap_id&f=geojson',
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
  const [hidden, setHidden] = useState(true)
  const [animated, setAnimated] = useState(true)

  const minDate = parseFrameDate(dateStrings[0]).toTimeString()
  const maxDate = parseFrameDate(
    dateStrings[dateStrings.length - 1]
  ).toTimeString()
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
    const animated = queryParams.get('animated') === 'true' ?? false
    setAnimated(animated)

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
  const popUpRef = useRef(new Popup({ offset: 15 }))

  function handleAnimation() {
    setAnimated(!animated)
  }
  useEffect(() => {
    if (map && mapLoaded) {
      map.on('click', 'watches-warnings-layer', (e) => {
        const features = e?.features
        if (features) {
          let product = features[0]?.properties?.prod_type
          const url =
            'https://api.weather.gov/alerts/' + features[0]?.properties?.cap_id
          if (
            features[0]?.geometry?.type === 'Polygon' ||
            features[0]?.geometry?.type === 'MultiPolygon'
          ) {
            const coordinates = features[0]?.geometry
              ?.coordinates[0][0] as LngLatLike
            const popupNode = document.createElement('div')
            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                render(
                  <PopupTemplate
                    headline={data.properties.headline}
                    description={data.properties.description}
                    product={product}
                  />,
                  popupNode
                )
                popUpRef.current
                  .setLngLat(coordinates)
                  .setDOMContent(popupNode)
                  .addTo(map)
              })
          }
        }
      })
      map.on('click', 'warnings-fill-layer', (e) => {
        const features = e?.features
        if (features) {
          let product = features[0]?.properties?.prod_type
          const url =
            'https://api.weather.gov/alerts/' + features[0]?.properties?.cap_id
          if (
            features[0]?.geometry?.type === 'Polygon' ||
            features[0]?.geometry?.type === 'MultiPolygon'
          ) {
            const coordinates = features[0]?.geometry
              ?.coordinates[0][0] as LngLatLike
            const popupNode = document.createElement('div')
            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                render(
                  <PopupTemplate
                    headline={data.properties.headline}
                    description={data.properties.description}
                    product={product}
                  />,
                  popupNode
                )
                popUpRef.current
                  .setLngLat(coordinates)
                  .setDOMContent(popupNode)
                  .addTo(map)
              })
          }
        }
      })
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
      if (animated) {
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
      } else {
        if (mapFrames.length > 0) {
          let currentFrameDateStr = mapFrames[mapFrames.length - 1]
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
        }
      }
      setMapFrames(dateStrings)
      const watchesWarningsLayer = map.getLayer('watches-warnings-layer')
      const warningsLayer = map.getLayer('warnings-layer')

      if (typeof watchesWarningsLayer === 'undefined') {
        addWatchesWarnings(map, mapConfig.watchesWarningsURL)
      } else {
        const response = fetch(mapConfig.watchesWarningsURL)
          .then((response) => response.json())
          .then((data) => {
            // refresh watches-warnings source data every 2 minutes
            const source = map.getSource('watches-warnings') as GeoJSONSource
            source.setData(data)
          })
      }
      if (typeof warningsLayer === 'undefined') {
        map.addSource('warnings', {
          type: 'geojson',
          data: mapConfig.warningsURL,
        })

        map.addLayer({
          id: 'warnings-layer',
          type: 'line',
          source: 'warnings',
          paint: {
            'line-color': [
              'match',
              ['string', ['get', 'prod_type']],
              'Tornado Warning',
              'rgba(255, 0, 0, 255)',
              'Severe Thunderstorm Warning',
              'rgba(255, 255, 0, 255)',
              'Special Marine Warning',
              'rgba(230, 152, 0, 255)',
              'Flash Flood Warning',
              'rgba(57, 121, 57, 255)',
              '#AAAAAA',
            ],
            'line-width': 2,
          },
        })
        map.addLayer({
          id: 'warnings-fill-layer',
          type: 'fill',
          source: 'warnings',
          paint: {
            'fill-color': 'rgba(0, 0, 0, 0)',
          },
        })
      } else {
        const response = fetch(mapConfig.warningsURL)
          .then((response) => response.json())
          .then((data) => {
            // refresh warnings source data every 2 minutes
            const source = map.getSource('warnings') as GeoJSONSource
            source.setData(data)
          })
      }
    }
  }, [dateStrings, map, mapFrames, mapLoaded, animated])

  return (
    <div>
      <button onClick={handleAnimation}>
        <FontAwesomeIcon
          size='2x'
          icon={animated ? faSquareCheck : faSquare}
        ></FontAwesomeIcon>
        {`${animated ? ' Stop Animating' : ' Animate'} Radar`}
      </button>
      <button className={'hide-button'} onClick={() => setHidden((s) => !s)}>
        <FontAwesomeIcon
          size='2x'
          icon={hidden ? faSquare : faSquareCheck}
        ></FontAwesomeIcon>
        {`${hidden ? ' Show' : ' Hide'} Radar Time`}
      </button>
      {!hidden ? (
        <div className={'show-datetime'}>
          {animated && (
            <div>
              <div>Oldest Time: {minDate}</div>
              <div>Latest Time: {maxDate}</div>
            </div>
          )}
          <p>Current Radar Time: {selectedDate.toString()}</p>
        </div>
      ) : null}
      <div id={containerId} className={`${className} relative`}>
        {children}
      </div>
    </div>
  )
}
