import { useRef, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { clamp, range } from '@/lib/utils'

mapboxgl.accessToken =
  'pk.eyJ1IjoiYmhhdmppdGNoYXVoYW4iLCJhIjoiY2x5MG95ejEzMGhuMDJtb2tvb3RpZHMyMiJ9.fJafGFJkITooEewonltjGw'

const DEFAULT_ZOOM = 3
const LATENCY_THRESHOLD = 300

export function Map({ regions, latencies, location }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef([])
  const [geolocated, setGeolocated] = useState(false)
  const [addedMap, setAddedMap] = useState(false)
  const [addedMarkers, setAddedMarkers] = useState(false)
  const [addedLines, setAddedLines] = useState(false)
  const [longitude, setLongitude] = useState(0)
  const [latitude, setLatitude] = useState(90)

  const geolocate = useMemo(
    () =>
      new mapboxgl.GeolocateControl({
        fitBoundsOptions: {
          maxZoom: 2,
        },
      }),
    [],
  )

  geolocate.on('geolocate', (e) => {
    const { coords } = e

    setLongitude(coords.longitude)
    setLatitude(coords.latitude)
    setGeolocated(true)
  })

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/bhavjitchauhan/cly0qsii4005201oecij7b5na',
      center: [longitude, latitude],
      zoom: DEFAULT_ZOOM,
    })
    map.current.addControl(geolocate, 'bottom-left')
    map.current.on('load', () => {
      setAddedMap(true)
    })
  })

  useEffect(() => {
    geolocate.trigger()
  }, [geolocate, addedMap])

  useEffect(() => {
    if (addedMarkers) return
    if (!regions.length) return

    markers.current = addRegionMarkers(regions, map.current)
    setAddedMarkers(true)
  }, [addedMarkers, regions])

  useEffect(() => {
    if (addedLines) return
    if (!geolocated) return
    if (!regions.length) return

    addRegionLines(regions, { longitude, latitude }, map.current)
    setAddedLines(true)
  }, [addedLines, geolocated, regions, longitude, latitude])

  useEffect(() => {
    if (!addedMap) return

    if (location.latitude && location.longitude) {
      map.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: DEFAULT_ZOOM,
      })
      setLongitude(location.longitude)
      setLatitude(location.latitude)
    }
    else geolocate.trigger()

    resetRegionMarkerPopups(markers.current, regions)
  }, [addedMap, location, geolocate])

  useEffect(() => {
    if (!addedMap) return
    if (!addedMarkers) return
    if (!addedLines) return

    markers.current.forEach((marker, i) => {
      const region = regions[i]
      const color = region.selected ? '#9747ff' : '#eee'
      // TODO: Extract this to a mapbox.js utils file
      marker
        .getElement()
        .querySelectorAll('svg path[fill="' + marker._color + '"]')[0]
        ?.setAttribute('fill', color)
      marker._color = color
    })

    for (const region of regions) {
      map.current.setLayoutProperty(
        region.code,
        'visibility',
        region.selected ? 'visible' : 'none',
      )
    }
  }, [regions])

  useEffect(() => {
    clearRegionLines(regions, map.current)
    addRegionLines(regions, { longitude, latitude }, map.current)
  }, [longitude, latitude])

  useEffect(() => {
    if (!addedMap) return
    if (!addedMarkers && !addedLines) return

    for (const latency of latencies) {
      if (latency.latency === Infinity) continue

      const color = `hsl(${range(clamp(latency.latency, 0, LATENCY_THRESHOLD), 0, LATENCY_THRESHOLD, 120, 0)}, 100%, 50%)`
      const width = range(
        clamp(latency.latency, 0, LATENCY_THRESHOLD),
        0,
        LATENCY_THRESHOLD,
        3,
        0.5,
      )

      if (addedMarkers) {
        const marker = markers.current.find((m) => m.region === latency.region)

        if (marker) {
          const name = regions.find((r) => r.code === latency.region).name
          marker.setPopup(
            new mapboxgl.Popup().setHTML(
              `${name} <span class="text-gray-500">(${latency.latency.toFixed(2)}ms)</span>`,
            ),
          )
        }
      }

      if (addedLines) {
        map.current.setPaintProperty(latency.region, 'line-color', color)
        map.current.setPaintProperty(latency.region, 'line-width', width)
        map.current.setPaintProperty(latency.region, 'line-dasharray', [])
      }
    }
  }, [latencies, addedMap, addedMarkers, addedLines])

  return <div ref={mapContainer} className="h-full map-container" />
}
Map.propTypes = {
  regions: PropTypes.array.isRequired,
  latencies: PropTypes.array.isRequired,
  location: PropTypes.object,
}

function addRegionMarkers(regions, map) {
  return regions.map((region) => {
    const { name, selected, longitude, latitude } = region

    const marker = new mapboxgl.Marker({
      color: selected ? '#9747ff' : '#eee',
    })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup().setHTML(name))
      .addTo(map)

    marker.region = region.code

    return marker
  })
}

function resetRegionMarkerPopups(markers, regions) {
  markers.forEach((marker) => {
    const name = regions.find((r) => r.code === marker.region).name
    marker.setPopup(new mapboxgl.Popup().setHTML(name))
  })
}

function createRegionLinesData(regions, center) {
  return regions.map((region) => {
    let centerLongitude = center.longitude
    // https://docs.mapbox.com/mapbox-gl-js/example/line-across-180th-meridian/
    if (Math.abs(center.longitude - region.longitude) > 180)
      centerLongitude += 360

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [centerLongitude, center.latitude],
          [region.longitude, region.latitude],
        ],
      },
      properties: {
        region: region.code,
        selected: region.selected,
      },
    }
  })
}

function addRegionLines(regions, center, map) {
  for (const lineData of createRegionLinesData(regions, center)) {
    map.addSource(lineData.properties.region, {
      type: 'geojson',
      data: lineData,
    })
    map.addLayer({
      id: lineData.properties.region,
      source: lineData.properties.region,
      type: 'line',
      paint: {
        'line-color': '#888',
        'line-width': 1,
        'line-dasharray': [4, 4],
      },
      layout: {
        visibility: lineData.properties.selected ? 'visible' : 'none',
      },
    })
  }
}

function clearRegionLines(regions, map) {
  for (const region of regions) {
    try {
      map.removeLayer(region.code)
      map.removeSource(region.code)
    // eslint-disable-next-line no-empty
    } catch (err) {}
  }
}

/**
 * @typedef {Object} Region
 * @property {string} code
 * @property {string} area
 * @property {string} name
 * @property {number} longitude
 * @property {number} latitude
 */
