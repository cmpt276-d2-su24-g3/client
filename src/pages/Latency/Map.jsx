import { useRef, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken =
  'pk.eyJ1IjoiYmhhdmppdGNoYXVoYW4iLCJhIjoiY2x5MG95ejEzMGhuMDJtb2tvb3RpZHMyMiJ9.fJafGFJkITooEewonltjGw'

export function Map({ regions }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [geolocated, setGeolocated] = useState(false)
  const [addedMap, setAddedMap] = useState(false)
  const [addedMarkers, setAddedMarkers] = useState(false)
  const [addedLines, setAddedLines] = useState(false)
  const [longitude, setLongitude] = useState(0)
  const [latitude, setLatitude] = useState(90)
  const [zoom, setZoom] = useState(3)

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
      zoom: zoom,
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

    addRegionMarkers(regions, map.current)
    setAddedMarkers(true)
  }, [addedMarkers, regions])

  useEffect(() => {
    if (addedLines) return
    if (!geolocated) return
    if (!regions.length) return

    addRegionLines(regions, { longitude, latitude }, map.current)
    setAddedLines(true)
  }, [addedLines, geolocated, regions, longitude, latitude])

  return <div ref={mapContainer} className="h-full map-container" />
}
Map.propTypes = {
  regions: PropTypes.array.isRequired,
}

function addRegionMarkers(regions, map) {
  return regions.map((region) => {
    const { name, longitude, latitude } = region

    return new mapboxgl.Marker({
      color: '#9747ff',
    })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup().setHTML(name))
      .addTo(map)
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
        'line-width': 0.5,
        'line-dasharray': [4, 4],
      },
    })
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
