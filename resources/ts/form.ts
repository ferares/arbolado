import { LatLng } from 'leaflet'

import ArboladoMap from './map'

import Tree from './models/tree'

export default class ArboladoForm {
  map: ArboladoMap
  form: HTMLFormElement
  markerInput: HTMLInputElement
  noMarkerInput: HTMLInputElement
  latlngInput: HTMLInputElement
  
  constructor(map: ArboladoMap) {
    this.map = map
    this.form = document.querySelector('[js-map-form]') as HTMLFormElement
    this.markerInput = document.querySelector('[js-map-form-marker]') as HTMLInputElement
    this.noMarkerInput = document.querySelector('[js-map-form-no-marker]') as HTMLInputElement
    this.latlngInput = document.querySelector('[js-map-form-latlng]') as HTMLInputElement
    
    this.markerInput.addEventListener('change', this.handleMarkerInputChange.bind(this))
    this.noMarkerInput.addEventListener('change', this.handleMarkerInputChange.bind(this))
    this.form.addEventListener('submit', this.handleFormSubmit.bind(this))
    this.map.addEventListener('setMarker', this.handleSetMarker.bind(this))
  }

  private handleSetMarker(latlng: LatLng): void {
    this.markerInput.checked = true
    this.latlngInput.value = latlng.toString()
  }

  private handleMarkerInputChange(): void {
    if (!this.markerInput.checked) this.map.removeMarker()
  }

  private async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault()
    const data = new FormData(this.form)
    try {
      const trees = await window.Arbolado.fetchJson('/search', 'post', data) as Array<Tree>
      this.map.displayTrees(trees)
    } catch (error) {
      console.error(error)
    }
  }
}