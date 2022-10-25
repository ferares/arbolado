import * as L from 'leaflet'
import 'leaflet.markercluster'

const mapboxToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
const searchRadius = 1000

const options: L.MapOptions = {
  center: L.latLng(-34.618, -58.44), // BsAs
  layers: [
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        accessToken: mapboxToken,
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
        id: 'mapbox/streets-v11',
        maxZoom: 21,
        tileSize: 512,
        zoomOffset: -1,
      },
    ),
  ],
  maxZoom: 21,
  minZoom: 5,
  zoom: 12,
}

let treeMarkers: L.MarkerClusterGroup = L.markerClusterGroup()
let marker: L.Marker
let circle: L.Circle

const mapFitToBoundsOptions: L.FitBoundsOptions = { maxZoom: 15, padding: [15, 15] } // To zoom into search results
const icons = {
  default: new L.Icon({
    iconAnchor: [15, 31],
    iconSize: [30, 34],
    iconUrl: `assets/imgs/markers/marker-icon.png`,
  }),
}

const map = L.map('map', options)
map.addLayer(treeMarkers)
map.on('click', (event: any) => {
  setMarker(event.latlng)
})

// const marker = this.route.snapshot.queryParamMap.get('user_latlng')
// const radius = this.route.snapshot.queryParamMap.get('radio')

// if (marker) {
//   const markerLatLng = marker.split(' ')
//   const latlng = new L.LatLng(Number(markerLatLng[0]), Number(markerLatLng[1]))
//   setMarker(latlng, Number(radius))
// }

/**
 * Sets a marker on the map based on coordinates
 * @param latlng - Latitude and longitude coordinates
 */
function setMarker(latlng: L.LatLng, radius: number = searchRadius): void {
  // Get the map object
  if (map) {
    // If there's no marker on the map...
    if (!marker) {
      L.Icon.Default.imagePath = 'assets/imgs/markers/'
      // Create a new marker
      marker = new L.Marker([latlng.lat, latlng.lng], {
        draggable: true,
        riseOnHover: true,
      })
      map.addLayer(marker)

      // Create a circle around it to show the search radius
      circle = new L.Circle(
        [latlng.lat, latlng.lng],
        {
          radius,
          color: '#000',
          fillColor: '#ddd',
          fillOpacity: 0.3,
        },
      )
      map.addLayer(circle)

      // When the marker is dragged move the circle to it
      marker.on('dragend', (dragEvent) => {
        const newLatlng = dragEvent.target.getLatLng()
        circle.setLatLng(newLatlng)
        // Update the selected coordinates
        latlngUpdated(map, newLatlng)
      })
    } else {
      // If a marker already exists, move it and its circle
      marker.setLatLng([latlng.lat, latlng.lng])
      circle.setLatLng([latlng.lat, latlng.lng])
    }

    if (!map.hasLayer(marker)) {
      map.addLayer(marker)
      map.addLayer(circle)
    }

    // Update the selected coordinates
    latlngUpdated(map, latlng)
  }
}

/**
 * Removes the search marker and it's "search radius" circle from the map
 */
function removeMarker(): void {
  map.removeLayer(marker)
  map.removeLayer(circle)
}

/**
 * Emits an event with the id of a tree
 * @param id - ID to emit
 */
function selectTree(id: number): void {
  // Emit the selected tree's ID
  // TODO: emit(id)
}

/**
 * Emits an event with the passed latlng value and re-centers the map around those coordinates
 * @param map - The map object
 * @param latlng - The latlng coordinates
 */
function latlngUpdated(map: L.Map, latlng: L.LatLng): void {
  // Emit the new marker coordinates
  // TODO: emit(latlng)
  // Re-center the map around the marker
  map.panTo(latlng)
}

/**
 * Displays the given trees on the map (discarding previous values)
 * @param trees - Array with the trees to display info
 */
function displayTrees(trees: any[]): void {
  treeMarkers.clearLayers() // Remove all previous trees
  for (const tree of trees) {
    // Select the tree's icon or use the default if none
    let icon = icons.default
    if (tree.icono) {
      if (!icons[tree.icono]) {
        icons[tree.icono] = new L.Icon({
          iconAnchor: [15, 31],
          iconSize: [30, 34],
          iconUrl: `assets/imgs/markers/${tree.icono}`,
        })
      }
      icon = icons[tree.icono]
    }
    // Add a tree marker for the tree to the treeMarkers
    treeMarkers.addLayer(
      new L.Marker([tree.lat, tree.lng], { icon }).on('click', () => {
        selectTree(tree.id) // When the marker is clicked => select it
      })
    )
  }

  // Center the map on the results
  if ((map) && (treeMarkers.getLayers().length)) {
    map.fitBounds(treeMarkers.getBounds(), mapFitToBoundsOptions)
  }
}

/**
 * Returns the current bounds of the map
 */
 function getMapBounds(): L.LatLngBounds {
  return map?.getBounds()
}