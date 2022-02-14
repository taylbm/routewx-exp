import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import { SliderRail, Handle, Track, Tick } from './components'
import {
  addRasterLayer,
  hideRasterLayer,
  showRasterLayer,
} from '../map/rasterLayer'
import {
  parseFrameDate,
  formatTick,
  getFrameUrl,
  subtractHours,
} from '../map/utils'
import { format, subHours, parse } from 'date-fns'
import { scaleTime } from 'd3-scale'
import useSWR from 'swr'
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js')

import 'mapbox-gl/dist/mapbox-gl.css'

var RTWX = {
  'shsr-visible': true,
  'shsr-opacity': 0.85,
  'animation-delay': 200,
  'animation-duration': 0,
  'total-frames': 12,
  'current-frame': 0,
  'current-frame-name': '',
  'times-endpoint': 'https://api.routewx.com/times?version=2',
  'date-slider-init': false,
  frames: [],
}
const step = 1000 * 60 * 4
const sliderStyle = {
  position: 'absolute',
  width: '90%',
  bottom: '10%',
  left: '5%',
}

export default function Home() {
  const [pageIsMounted, setPageIsMounted] = useState(false)
  const [Map, setMap] = useState()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [updatedDate, setUpdatedDate] = useState(new Date())
  const [minDate, setMinDate] = useState(subtractHours(new Date(), 1))
  const [maxDate, setMaxDate] = useState(new Date())

  useEffect(() => {
    let map = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-100, 40], // starting position [lng, lat]
      zoom: 4, // starting zoom
    })

    setMap(map)
    setPageIsMounted(true)

    // Create an scoped async function in the hook
    async function getAvailableFrames() {
      const response = await fetch(RTWX['times-endpoint']) // get list of available times
      const times = await response.json() // parse JSON
      const dateStrings = times['dateStrings']
      RTWX['frames'] = dateStrings
      const totalFrames = RTWX['total-frames']
      const min = parseFrameDate(
        dateStrings[dateStrings.length - 1 - totalFrames]
      )
      const max = parseFrameDate(dateStrings[dateStrings.length - 1])

      setMinDate(min)
      setMaxDate(max)
    }
    getAvailableFrames()
  }, [])

  useEffect(() => {
    if (pageIsMounted) {
      Map.on('load', function () {
        let intervalId = setInterval(() => {
          if (RTWX['frames'].length > 0) {
            var currentFrameMod = RTWX['current-frame'] % RTWX['total-frames']
            let currentFrameIdx =
              RTWX['frames'].length - RTWX['total-frames'] + currentFrameMod - 1
            let currentFrameDateStr = RTWX['frames'][currentFrameIdx]
            let currentFrameUrl = getFrameUrl(currentFrameDateStr)
            let currentFrameDate = parseFrameDate(currentFrameDateStr)
            var shsrLayer = Map.getLayer(currentFrameDateStr)

            setSelectedDate(currentFrameDate)

            if (RTWX['current-frame'] > 0) {
              let previousFrameIdx =
                currentFrameMod === 0
                  ? RTWX['frames'].length - 2
                  : RTWX['frames'].length -
                    RTWX['total-frames'] +
                    currentFrameMod -
                    2
              let previousFrameDateStr = RTWX['frames'][previousFrameIdx]
              hideRasterLayer(
                Map,
                RTWX['animation-duration'],
                previousFrameDateStr
              )
            }
            if (typeof shsrLayer === 'undefined') {
              addRasterLayer(
                Map,
                currentFrameUrl,
                currentFrameDateStr,
                RTWX['shsr-opacity']
              )
            }
            if (RTWX['shsr-visible']) {
              showRasterLayer(
                Map,
                RTWX['animation-duration'],
                RTWX['shsr-opacity'],
                currentFrameDateStr
              )
            }
            RTWX['current-frame'] += 1
            const datetimeDisplay = document.getElementById('datetime-display')
            if (datetimeDisplay !== null) {
              datetimeDisplay.innerHTML = currentFrameDate.toString()
            }
          }
        }, 0.25 * 1000)
      })
    }
  }, [pageIsMounted, setMap, Map])

  const onSliderChange = ([ms]: readonly number[]) => {
    setSelectedDate(new Date(ms))
  }
  const onSliderUpdate = ([ms]: readonly number[]) => {
    setUpdatedDate(new Date(ms))
  }
  const dateTicks = scaleTime()
    .domain([minDate, maxDate])
    .ticks(8)
    .map((d) => +d)

  return (
    <div>
      <div>
        <Slider
          mode={1}
          step={step}
          domain={[+minDate, +maxDate]}
          rootStyle={sliderStyle}
          onUpdate={onSliderUpdate}
          onChange={onSliderChange}
          values={[+selectedDate]}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div>
                {handles.map((handle) => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={[+minDate, +maxDate]}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false}>
            {({ tracks, getTrackProps }) => (
              <div>
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks values={dateTicks}>
            {({ ticks }) => (
              <div>
                {ticks.map((tick) => (
                  <Tick
                    key={tick.id}
                    tick={tick}
                    count={ticks.length}
                    format={formatTick}
                  />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </div>
    </div>
  )
}
