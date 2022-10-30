import * as L from 'leaflet'
import 'leaflet.markercluster'

import Tree from './models/tree'

const defaultMapCenter: L.LatLng = L.latLng(-34.618, -58.44) // BsAs
const searchRadius = 1000

export default class ArboladoMap {
  map: L.Map
  treeMarkers: L.MarkerClusterGroup = L.markerClusterGroup()
  mapFitToBoundsOptions: L.FitBoundsOptions = { maxZoom: 15, padding: [15, 15] } // To zoom into search results
  icons = new Map<string, L.Icon>()
  listeners: {
    setMarker: Array<(latlang: L.LatLng) => any>,
    selectTree: Array<(id: number) => any>,
  } = { setMarker: [], selectTree: [] }
  point?: {
    marker: L.Marker,
    circle: L.Circle,
  }

  constructor() {
    // Init map
    this.map = L.map('map', {
      center: defaultMapCenter,
      layers: [
        L.tileLayer(
          'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
          {
            accessToken: window.env.mapboxToken,
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
    })
    // Add the layer for the tree markers
    this.map.addLayer(this.treeMarkers)
    // Set a pointer maker on click
    this.map.on('click', (event: any) => {
      this.setMarker(event.latlng)
    })
    // Init the icons map with the default icon
    this.icons.set('default', new L.Icon({
      iconAnchor: [15, 31],
      iconSize: [30, 34],
      iconUrl: `assets/imgs/markers/marker.png`,
    }))

    // TODO: init map marker on first load if params on URL
    // const marker = this.route.snapshot.queryParamMap.get('user_latlng')
    // const radius = this.route.snapshot.queryParamMap.get('radio')
    // if (marker) {
    //   const markerLatLng = marker.split(' ')
    //   const latlng = new L.LatLng(Number(markerLatLng[0]), Number(markerLatLng[1]))
    //   setMarker(latlng, Number(radius))
    // }
  }
  
  /**
   * Emits an event with the id of a tree
   * @param id - ID to emit
   */
  private selectTree(id: number): void {
    // Emit the selected tree's ID
    this.listeners.selectTree.map((callback) => callback(id))
  }
  
  /**
   * Emits an event with the passed latlng value and re-centers the map around those coordinates
   * @param latlng - The latlng coordinates
   */
  private latlngUpdated(latlng: L.LatLng): void {
    // Emit the new marker coordinates
    this.listeners.setMarker.map((callback) => callback(latlng))
    // Re-center the map around the marker
    this.map.panTo(latlng)
  }
  
  /**
   * Sets a marker on the map based on coordinates
   * @param latlng - Latitude and longitude coordinates
   */
  private setMarker(latlng: L.LatLng, radius: number = searchRadius): void {
    // If there's no marker on the map...
    if (!this.point) {
      L.Icon.Default.imagePath = 'assets/imgs/markers/'
      // Create a new marker & circle around it to show the search radius
      this.point = {
        marker: new L.Marker([latlng.lat, latlng.lng], {
          draggable: true,
          riseOnHover: true,
        }),
        circle: new L.Circle(
          [latlng.lat, latlng.lng],
          {
            radius,
            color: '#000',
            fillColor: '#ddd',
            fillOpacity: 0.3,
          },
        )
      }

      this.map.addLayer(this.point.marker)
      this.map.addLayer(this.point.circle)

      // When the marker is dragged move the circle to it
      this.point.marker.on('dragend', (dragEvent) => {
        const newLatlng = dragEvent.target.getLatLng()
        this.point?.circle.setLatLng(newLatlng)
        // Update the selected coordinates
        this.latlngUpdated(newLatlng)
      })
    } else {
      // If a marker already exists, move it and its circle
      this.point.marker.setLatLng([latlng.lat, latlng.lng])
      this.point.circle.setLatLng([latlng.lat, latlng.lng])
    }

    // TODO: figure out what is this check for
    if (!this.map.hasLayer(this.point.marker)) {
      this.map.addLayer(this.point.marker)
      this.map.addLayer(this.point.circle)
    }

    // Update the selected coordinates
    this.latlngUpdated(latlng)
  }
  
  /**
   * Displays the given trees on the map (discarding previous values)
   * @param trees - Array with the trees to display info
   */
  public displayTrees(trees: Tree[]): void {
    this.treeMarkers.clearLayers() // Remove all previous trees
    for (const tree of trees) {
      // Select the tree's icon or use the default if none
      let icon = this.icons.get('default')
      if (tree.icono) {
        if (!this.icons.get(tree.icono)) {
          this.icons.set(tree.icono, new L.Icon({
            iconAnchor: [15, 31],
            iconSize: [30, 34],
            iconUrl: `assets/imgs/markers/${tree.icono}`,
          }))
        }
        icon = this.icons.get(tree.icono)
      }
      // Add a tree marker for the tree to the treeMarkers
      this.treeMarkers.addLayer(
        new L.Marker([tree.lat, tree.lng], { icon }).on('click', () => {
          this.selectTree(tree.id) // When the marker is clicked => select it
        })
      )
    }
  
    // Center the map on the results
    if (this.treeMarkers.getLayers().length) {
      this.map.fitBounds(this.treeMarkers.getBounds(), this.mapFitToBoundsOptions)
    }
  }

  /**
   * Sets event listeners
   */
  public addEventListener(type: 'setMarker', callback: (latlang: L.LatLng) => any): number
  public addEventListener(type: 'selectTree', callback: (id: number) => any): number
  public addEventListener(type: unknown, callback: Function): number | undefined {
    if (type === 'setMarker') {
      return this.listeners.setMarker.push(callback as (latlang: L.LatLng) => any) - 1
    } else if (type === 'selectTree') {
      return this.listeners.selectTree.push(callback as (id: number) => any) - 1
    }
    return
  }

  /**
   * Removes event listeners
   */
  public removeEventListener(type: 'setMarker' | 'selectTree', id: number): void {
    if (type === 'setMarker') {
      this.listeners.setMarker.splice(id, 1)
    } else if (type === 'selectTree') {
      this.listeners.selectTree.splice(id, 1)
    }
  }

  /**
   * Removes the search marker and it's "search radius" circle from the map
   */
  public removeMarker(): void {
    if (this.point) {
      this.map.removeLayer(this.point.marker)
      this.map.removeLayer(this.point.circle)
    }
  }
}