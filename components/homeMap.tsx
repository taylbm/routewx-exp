import { useEffect, useRef, useState } from 'react'
import { render } from 'react-dom'
import {
  createMap,
  addRasterLayer,
  hideRasterLayer,
  showRasterLayer,
} from 'lib/mapboxFunctions'
import { parseFrameDate, getFrameUrl } from 'lib/dateFunctions'
import { GeoJSONSource, LngLatLike, Popup } from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSun,
  faSnowflake,
  faCommentDots,
} from '@fortawesome/free-regular-svg-icons'

import {
  faTemperatureArrowDown,
  faPlugCircleXmark,
  faSmog,
  faCloudShowersWater,
  faCloud,
  faVolcano,
  faHillAvalanche,
  faUmbrellaBeach,
  faSnowplow,
  faWind,
  faChild,
  faPersonMilitaryToPerson,
  faHouseTsunami,
  faHouseChimneyCrack,
  faPersonWalkingArrowRight,
  faFire,
  faHouseFloodWater,
  faIcicles,
  faRadiation,
  faWater,
  faMessage,
  faSubscript,
  faHurricane,
  faBuildingShield,
  faCloudBolt,
  faPeopleRoof,
  faSailboat,
  faHouse,
  faTornado,
} from '@fortawesome/free-solid-svg-icons'

let mapConfig = {
  shsrVisible: true,
  shsrOpacity: 0.85,
  animationDuration: 0,
  currentFrame: 0,
  watchesWarningsURL:
    'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/1/query?where=objectid+%3E+1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=prod_type%2C+cap_id&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson',
  warningsURL:
    'https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer/0/query?where=objectid+%3E+1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=prod_type%2C+cap_id&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson',
  icons: {
    'Excessive Heat Warning': faSun,
    'Winter Weather Advisory': faSnowflake,
    'Winter Storm Watch': faSnowflake,
    'Wind Chill Warning': faTemperatureArrowDown,
    'Wind Chill Advisory': faTemperatureArrowDown,
    '911 Telephone Outage': faPlugCircleXmark,
    'Administrative Message': faCommentDots,
    'Air Quality Alert': faSmog,
    'Air Stagnation Advisory': faSmog,
    'Arroyo And Small Stream Flood Advisory': faCloudShowersWater,
    'Ashfall Advisory': faVolcano,
    'Ashfall Warning': faVolcano,
    'Avalanche Advisory': faHillAvalanche,
    'Avalanche Warning': faHillAvalanche,
    'Avalanche Watch': faHillAvalanche,
    'Beach Hazards Statement': faUmbrellaBeach,
    'Blizzard Warning': faSnowplow,
    'Blizzard Watch': faSnowplow,
    'Blowing Dust Advisory': faWind,
    'Blowing Dust Warning': faWind,
    'Brisk Wind Advisory': faWind,
    'Child Abduction Emergency': faChild,
    'Civil Danger Warning': faPersonMilitaryToPerson,
    'Civil Emergency Message': faPersonMilitaryToPerson,
    'Coastal Flood Advisory': faHouseTsunami,
    'Coastal Flood Statement': faHouseTsunami,
    'Coastal Flood Warning': faHouseTsunami,
    'Coastal Flood Watch': faHouseTsunami,
    'Dense Fog Advisory': faSmog,
    'Dense Smoke Advisory': faSmog,
    'Dust Advisory': faWind,
    'Dust Storm Warning': faWind,
    'Earthquake Warning': faHouseChimneyCrack,
    'Evacuation - Immediate': faPersonWalkingArrowRight,
    'Excessive Heat Watch': faSun,
    'Extreme Cold Warning': faTemperatureArrowDown,
    'Extreme Cold Watch': faTemperatureArrowDown,
    'Extreme Fire Danger': faFire,
    'Extreme Wind Warning': faWind,
    'Fire Warning': faFire,
    'Fire Weather Watch': faFire,
    'Flash Flood Statement': faHouseFloodWater,
    'Flash Flood Warning': faHouseFloodWater,
    'Flash Flood Watch': faHouseFloodWater,
    'Flood Advisory': faHouseFloodWater,
    'Flood Statement': faHouseFloodWater,
    'Flood Warning': faHouseFloodWater,
    'Flood Watch': faHouseFloodWater,
    'Freeze Warning': faTemperatureArrowDown,
    'Freeze Watch': faTemperatureArrowDown,
    'Freezing Fog Advisory': faSmog,
    'Freezing Rain Advisory': faIcicles,
    'Freezing Spray Advisory': faIcicles,
    'Frost Advisory': faIcicles,
    'Gale Warning': faWind,
    'Gale Watch': faWind,
    'Hard Freeze Warning': faTemperatureArrowDown,
    'Hard Freeze Watch': faTemperatureArrowDown,
    'Hazardous Materials Warning': faRadiation,
    'Hazardous Seas Warning': faWater,
    'Hazardous Seas Watch': faWater,
    'Hazardous Weather Outlook': faMessage,
    'Heat Advisory': faSun,
    'Heavy Freezing Spray Warning': faWater,
    'Heavy Freezing Spray Watch': faWater,
    'High Surf Advisory': faWater,
    'High Surf Warning': faWater,
    'High Wind Warning': faWind,
    'High Wind Watch': faWind,
    'Hurricane Force Wind Watch': faHurricane,
    'Hurricane Local Statement': faHurricane,
    'Hurricane Warning': faHurricane,
    'Hurricane Watch': faHurricane,
    'Hydrologic Advisory': faHouseFloodWater,
    'Hydrologic Outlook': faHouseFloodWater,
    'Ice Storm Warning': faIcicles,
    'Lake Effect Snow Advisory': faSnowflake,
    'Lake Effect Snow Warning': faSnowflake,
    'Lake Effect Snow Watch': faSnowflake,
    'Lake Wind Advisory': faWind,
    'Lakeshore Flood Advisory': faHouseFloodWater,
    'Lakeshore Flood Statement': faHouseFloodWater,
    'Lakeshore Flood Warning': faHouseFloodWater,
    'Lakeshore Flood Watch': faHouseFloodWater,
    'Law Enforcement Warning': faBuildingShield,
    'Local Area Emergency': faBuildingShield,
    'Low Water Advisory': faWater,
    'Marine Weather Statement': faWater,
    'Nuclear Power Plant Warning': faRadiation,
    'Radiological Hazard Warning': faRadiation,
    'Red Flag Warning': faFire,
    'Rip Current Statement': faWater,
    'Severe Thunderstorm Warning': faCloudBolt,
    'Severe Thunderstorm Watch': faCloudBolt,
    'Severe Weather Statement': faCloudBolt,
    'Shelter In Place Warning': faPeopleRoof,
    'Short Term Forecast': faMessage,
    'Small Craft Advisory': faSailboat,
    'Small Craft Advisory For Rough Bar': faSailboat,
    'Small Craft Advisory For Hazardous Seas': faSailboat,
    'Small Craft Advisory For Winds': faSailboat,
    'Small Stream Flood Advisory': faHouseFloodWater,
    'Snow Squall Warning': faSnowflake,
    'Special Marine Warning': faSailboat,
    'Special Weather Statement': faSailboat,
    'Storm Surge Warning': faHouseTsunami,
    'Storm Surge Watch': faHouseTsunami,
    'Storm Warning': faHouseTsunami,
    'Storm Watch': faHouseTsunami,
    'Tornado Warning': faTornado,
    'Tornado Watch': faTornado,
    'Tropical Cyclone Statement': faHurricane,
    'Tropical Depression Local Statement': faHurricane,
    'Tropical Storm Local Statement': faHurricane,
    'Tropical Storm Warning': faHurricane,
    'Tropical Storm Watch': faHurricane,
    'Tsunami Advisory': faHouseTsunami,
    'Tsunami Warning': faHouseTsunami,
    'Tsunami Watch': faHouseTsunami,
    'Typhoon Local Statement': faHurricane,
    'Typhoon Warning': faHurricane,
    'Typhoon Watch': faHurricane,
    'Urban And Small Stream Flood Advisory': faHouseFloodWater,
    'Volcano Warning': faVolcano,
    'Wind Advisory': faWind,
    'Winter Storm Warning': faSnowplow,
    'Wind Chill Watch': faTemperatureArrowDown,
  },
}

const PopupTemplate = ({
  headline,
  description,
  product,
}: {
  headline: string
  description: string
  product: string
}) => (
  <div className='popup'>
    <FontAwesomeIcon
      icon={mapConfig.icons[product as keyof typeof mapConfig.icons]}
      size='5x'
    />
    <h2 className='font bold text-xl'>{headline}</h2>
    <div>
      <p className='popup-description'>{description}</p>
    </div>
  </div>
)

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
  const popUpRef = useRef(new Popup({ offset: 15 }))

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
            const watchesWarningsLayer = map.getLayer('watches-warnings-layer')
      const warningsLayer = map.getLayer('warnings-layer')

      if (typeof watchesWarningsLayer === 'undefined') {
        map.addSource('watches-warnings', {
          type: 'geojson',
          data: mapConfig.watchesWarningsURL,
        })

        map.addLayer({
          id: 'watches-warnings-layer',
          type: 'fill',
          source: 'watches-warnings',
          paint: {
            'fill-color': [
              'match',
              ['string', ['get', 'prod_type']],
              'Excessive Heat Warning',
              'rgba(199, 21, 133, 255)',
              'Winter Weather Advisory',
              'rgba(123, 104, 238, 255)',
              'Winter Storm Watch',
              'rgba(70, 130, 180, 255)',
              'Wind Chill Warning',
              'rgba(110, 110, 110, 255)',
              'Wind Chill Advisory',
              'rgba(175, 238, 238, 255)',
              '911 Telephone Outage',
              'rgba(192, 192, 192, 255)',
              'Administrative Message',
              'rgba(192, 192, 192, 255)',
              'Air Quality Alert',
              'rgba(128, 128, 128, 255)',
              'Air Stagnation Advisory',
              'rgba(128, 128, 128, 255)',
              'Arroyo And Small Stream Flood Advisory',
              'rgba(0, 255, 127, 255)',
              'Ashfall Advisory',
              'rgba(105, 105, 105, 255)',
              'Ashfall Warning',
              'rgba(169, 169, 169, 255)',
              'Avalanche Advisory',
              'rgba(205, 133, 63, 255)',
              'Avalanche Warning',
              'rgba(30, 144, 255, 255)',
              'Avalanche Watch',
              'rgba(244, 164, 96, 255)',
              'Beach Hazards Statement',
              'rgba(64, 224, 208, 255)',
              'Blizzard Warning',
              'rgba(255, 69, 0, 255)',
              'Blizzard Watch',
              'rgba(173, 255, 47, 255)',
              'Blowing Dust Advisory',
              'rgba(189, 183, 107, 255)',
              'Blowing Dust Warning',
              'rgba(255, 228, 196, 255)',
              'Brisk Wind Advisory',
              'rgba(216, 191, 216, 255)',
              'Child Abduction Emergency',
              'rgba(255, 215, 0, 255)',
              'Civil Danger Warning',
              'rgba(255, 182, 193, 255)',
              'Civil Emergency Message',
              'rgba(255, 182, 193, 255)',
              'Coastal Flood Advisory',
              'rgba(124, 252, 0, 255)',
              'Coastal Flood Statement',
              'rgba(107, 142, 35, 255)',
              'Coastal Flood Warning',
              'rgba(34, 139, 34, 255)',
              'Coastal Flood Watch',
              'rgba(102, 205, 170, 255)',
              'Dense Fog Advisory',
              'rgba(112, 128, 144, 255)',
              'Dense Smoke Advisory',
              'rgba(240, 230, 140, 255)',
              'Dust Advisory',
              'rgba(189, 183, 107, 255)',
              'Dust Storm Warning',
              'rgba(255, 228, 196, 255)',
              'Earthquake Warning',
              'rgba(139, 69, 19, 255)',
              'Evacuation - Immediate',
              'rgba(127, 255, 0, 255)',
              'Excessive Heat Watch',
              'rgba(128, 0, 0, 255)',
              'Extreme Cold Warning',
              'rgba(0, 0, 255, 255)',
              'Extreme Cold Watch',
              'rgba(0, 0, 255, 255)',
              'Extreme Fire Danger',
              'rgba(233, 150, 122, 255)',
              'Extreme Wind Warning',
              'rgba(255, 140, 0, 255)',
              'Fire Warning',
              'rgba(160, 82, 45, 255)',
              'Fire Weather Watch',
              'rgba(255, 222, 173, 255)',
              'Flash Flood Statement',
              'rgba(139, 0, 0, 255)',
              'Flash Flood Warning',
              'rgba(139, 0, 0, 255)',
              'Flash Flood Watch',
              'rgba(46, 139, 87, 255)',
              'Flood Advisory',
              'rgba(0, 255, 127, 255)',
              'Flood Statement',
              'rgba(0, 255, 0, 255)',
              'Flood Warning',
              'rgba(0, 255, 0, 255)',
              'Flood Watch',
              'rgba(46, 139, 87, 255)',
              'Freeze Warning',
              'rgba(72, 61, 139, 255)',
              'Freeze Watch',
              'rgba(0, 255, 255, 255)',
              'Freezing Fog Advisory',
              'rgba(0, 128, 128, 255)',
              'Freezing Rain Advisory',
              'rgba(218, 122, 214, 255)',
              'Freezing Spray Advisory',
              'rgba(0, 191, 255, 255)',
              'Frost Advisory',
              'rgba(100, 149, 237, 255)',
              'Gale Warning',
              'rgba(221, 160, 221, 255)',
              'Gale Watch',
              'rgba(255, 192, 203, 255)',
              'Hard Freeze Warning',
              'rgba(148, 0, 211, 255)',
              'Hard Freeze Watch',
              'rgba(65, 105, 225, 255)',
              'Hazardous Materials Warning',
              'rgba(75, 0, 130, 255)',
              'Hazardous Seas Warning',
              'rgba(216, 191, 216, 255)',
              'Hazardous Seas Watch',
              'rgba(72, 61, 139, 255)',
              'Hazardous Weather Outlook',
              'rgba(238, 232, 170, 255)',
              'Heat Advisory',
              'rgba(255, 127, 80, 255)',
              'Heavy Freezing Spray Warning',
              'rgba(0, 191, 255, 255)',
              'Heavy Freezing Spray Watch',
              'rgba(188, 143, 143, 255)',
              'High Surf Advisory',
              'rgba(186, 85, 211, 255)',
              'High Surf Warning',
              'rgba(34, 139, 34, 255)',
              'High Wind Warning',
              'rgba(218, 165, 32, 255)',
              'High Wind Watch',
              'rgba(184, 134, 11, 255)',
              'Hurricane Force Wind Warning',
              'rgba(205, 92, 92, 255)',
              'Hurricane Force Wind Watch',
              'rgba(153, 50, 204, 255)',
              'Hurricane Local Statement',
              'rgba(255, 228, 181, 255)',
              'Hurricane Warning',
              'rgba(220, 20, 60, 255)',
              'Hurricane Watch',
              'rgba(255, 0, 255, 255)',
              'Hydrologic Advisory',
              'rgba(0, 255, 127, 255)',
              'Hydrologic Outlook',
              'rgba(144, 238, 144, 255)',
              'Ice Storm Warning',
              'rgba(139, 0, 139, 255)',
              'Lake Effect Snow Advisory',
              'rgba(72, 209, 204, 255)',
              'Lake Effect Snow Warning',
              'rgba(0, 139, 139, 255)',
              'Lake Effect Snow Watch',
              'rgba(135, 206, 250, 255)',
              'Lake Wind Advisory',
              'rgba(210, 180, 140, 255)',
              'Lakeshore Flood Advisory',
              'rgba(124, 252, 0, 255)',
              'Lakeshore Flood Statement',
              'rgba(107, 142, 35, 255)',
              'Lakeshore Flood Warning',
              'rgba(34, 139, 34, 255)',
              'Lakeshore Flood Watch',
              'rgba(102, 205, 170, 255)',
              'Law Enforcement Warning',
              'rgba(192, 192, 192, 255)',
              'Local Area Emergency',
              'rgba(192, 192, 192, 255)',
              'Low Water Advisory',
              'rgba(165, 42, 42, 255)',
              'Marine Weather Statement',
              'rgba(255, 239, 213, 255)',
              'Nuclear Power Plant Warning',
              'rgba(75, 0, 130, 255)',
              'Radiological Hazard Warning',
              'rgba(75, 0, 130, 255)',
              'Red Flag Warning',
              'rgba(255, 20, 147, 255)',
              'Rip Current Statement',
              'rgba(64, 224, 208, 255)',
              'Severe Thunderstorm Warning',
              'rgba(255, 165, 0, 255)',
              'Severe Thunderstorm Watch',
              'rgba(219, 112, 147, 255)',
              'Severe Weather Statement',
              'rgba(0, 255, 255, 255)',
              'Shelter In Place Warning',
              'rgba(250, 128, 114, 255)',
              'Short Term Forecast',
              'rgba(152, 251, 152, 255)',
              'Small Craft Advisory',
              'rgba(216, 191, 216, 255)',
              'Small Craft Advisory For Rough Bar',
              'rgba(216, 191, 216, 255)',
              'Small Craft Advisory For Hazardous Seas',
              'rgba(216, 191, 216, 255)',
              'Small Craft Advisory For Winds',
              'rgba(216, 191, 216, 255)',
              'Small Stream Flood Advisory',
              'rgba(0, 255, 127, 255)',
              'Snow Squall Warning',
              'rgba(199, 21, 133, 255)',
              'Special Marine Warning',
              'rgba(255, 165, 0, 255)',
              'Special Weather Statement',
              'rgba(255, 228, 181, 255)',
              'Storm Surge Warning',
              'rgba(181, 36, 247, 255)',
              'Storm Surge Watch',
              'rgba(219, 127, 247, 255)',
              'Storm Warning',
              'rgba(148, 0, 211, 255)',
              'Storm Watch',
              'rgba(255, 228, 181, 255)',
              'Tornado Warning',
              'rgba(255, 0, 0, 255)',
              'Tornado Watch',
              'rgba(255, 255, 0, 255)',
              'Tropical Cyclone Statement',
              'rgba(222, 198, 166, 255)',
              'Tropical Depression Local Statement',
              'rgba(255, 228, 181, 255)',
              'Tropical Storm Local Statement',
              'rgba(255, 228, 181, 255)',
              'Tropical Storm Warning',
              'rgba(178, 34, 34, 255)',
              'Tropical Storm Watch',
              'rgba(240, 128, 128, 255)',
              'Tsunami Advisory',
              'rgba(210, 105, 30, 255)',
              'Tsunami Warning',
              'rgba(253, 99, 71, 255)',
              'Tsunami Watch',
              'rgba(255, 0, 255, 255)',
              'Typhoon Local Statement',
              'rgba(255, 228, 181, 255)',
              'Typhoon Warning',
              'rgba(220, 20, 60, 255)',
              'Typhoon Watch',
              'rgba(255, 0, 255, 255)',
              'Urban And Small Stream Flood Advisory',
              'rgba(0, 225, 127, 255)',
              'Volcano Warning',
              'rgba(47, 79, 79, 255)',
              'Wind Advisory',
              'rgba(210, 180, 140, 255)',
              'Winter Storm Warning',
              'rgba(255, 105, 180, 255)',
              'Wind Chill Watch',
              'rgba(95, 158, 160, 255)',
              '#AAAAAA',
            ],
          },
        })
        map.addLayer({
          id: 'watches-warnings-outline',
          type: 'line',
          source: 'watches-warnings',
          paint: {
            'line-color': 'grey',
            'line-width': 0.5,
          },
        })
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
