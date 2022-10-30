import Species from '../models/species'
import { latinMap } from './latin-map'

function getSpeciesLabel(species: Species) {
  return `${species.nombre_cientifico} ${species.nombre_comun}`
  return `
    <div class="species-name">
      <span class="species-name__scientific">
        ${species.nombre_cientifico}
      </span>
      <span class="species-name__common">
        ${species.nombre_comun}
      </span>
    </div>
  `
}

function latinize(str: string): string {
  if (!str) return ''
  return str.replace(/[^A-Za-z0-9[\] ]/g, (a: string) => latinMap.get(a) || a)
}

export { latinize, getSpeciesLabel }