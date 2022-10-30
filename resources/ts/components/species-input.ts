import { go, highlight, prepare } from 'fuzzysort'

import Species from '../models/species'

import { getSpeciesLabel, latinize } from '../utils/index'

type fitleredSpeciesType = {
  id: number,
  value: string,
  target: string | null,
}

class SpeciesInput extends HTMLElement {
  options: Array<Species>
  _internals: ElementInternals
  _value: string | null = null
  species: any
  speciesSearch: Array<Fuzzysort.Prepared>
  fitleredSpecies: Array<fitleredSpeciesType> = []
  inputElement!: HTMLInputElement
  dropdownMenu!: HTMLUListElement
  _open: boolean = false
  focusingOut?: number
  
  constructor() {
    super()
    if (!this.dataset['options']) throw new Error('Please provide an array of species using the "data-options" attribute')
    this.options = JSON.parse(this.dataset['options'])
    this._internals = this.attachInternals()
    this.species = this.options.reduce((result: any, species: any) => {
      const speciesLabel = getSpeciesLabel(species)
      return {
        ...result,
        [latinize(speciesLabel)]: { label: speciesLabel, id: species.id },
      }
    }, {})
    this.speciesSearch = Object.keys(this.species).map(prepare)
    this.appendTemplate()
    this.filter()
    this.open = false
    this.addEventListener('keydown', this.handleKeyDown)
    this.addEventListener('focusout', this.handleFocusOut)
    this.addEventListener('focusin', this.handleFocusIn)
    this.value = this.getAttribute('value') || ''
    this.checkValidity()
  }

  static onchange() { dispatchEvent(new CustomEvent('change', {})) }
  static get formAssociated() { return true }

  get form() { return this._internals.form }
  get name() { return this.getAttribute('name') }
  get type() { return this.localName }
  get validity() {return this._internals.validity }
  get validationMessage() {return this._internals.validationMessage }
  get willValidate() {return this._internals.willValidate }

  checkValidity() {
    const valid = !!this._value
    this._internals.setValidity({})
    if (!valid) this._internals.setValidity({ customError: true }, 'Value cannot be empty.')
    return valid
  }
  reportValidity() {return this._internals.reportValidity() }

  get value() { return this._value }
  set value(value) {
    this._value = value
    this._internals.setFormValue(this._value)
    const species = this.options.find((species) => species.id === Number(value))
    this.inputElement.value = species ? getSpeciesLabel(species) : this.inputElement.value
    this.onchange?.({} as Event)
    this.checkValidity()
  }

  get open() { return this._open }
  set open(value) {
    this._open = value
    this.toggleDropdownMenu()
  }

  appendTemplate() {
    const template = document.querySelector('[js-template="species-input"]') as HTMLTemplateElement
    const templateClone = template.content.cloneNode(true)
    this.append(templateClone)
    this.inputElement = this.querySelector('[js-input]') as HTMLInputElement
    this.dropdownMenu = this.querySelector('[js-dropdown-menu]') as HTMLUListElement
    this.inputElement.placeholder = this.getAttribute('placeholder') || ''
    this.inputElement.addEventListener('input', this.handleInput.bind(this))
    this.inputElement.addEventListener('click', this.handleInput.bind(this))
    this.querySelector('[js-clean]')?.addEventListener('click', () => {
      this.value = ''
      this.inputElement.value = ''
      this.inputElement.focus()
      this.inputElement.click()
    })
  }
  
  createDropdownMenuItems() {
    this.dropdownMenu.innerHTML = ''
    for (let index = 0; index < this.fitleredSpecies.length; index++) {
      const species = this.fitleredSpecies[index]
      const itemTemplate = document.querySelector('[js-template="species-input-option"]') as HTMLTemplateElement
      const itemTemplateClone = itemTemplate.content.cloneNode(true) as HTMLElement
      const button = itemTemplateClone.querySelector('[js-button]') as HTMLButtonElement
      button.innerHTML = species.target || ''
      button.dataset['index'] = index.toString()
      button.addEventListener('click', () => this.setSpecies(Number(button.dataset['index'])))
      this.dropdownMenu.append(itemTemplateClone)
    }
    this.toggleDropdownMenu()
  }

  toggleDropdownMenu() {
    if (this.dropdownMenu) {
      if (this.open) this.dropdownMenu.classList.add('show')
      else this.dropdownMenu.classList.remove('show')
    }
  }

  getFocusedSpecies() {
    const activeElement = document.activeElement as HTMLElement | null
    const index = activeElement?.dataset['index']
    return index !== undefined ? Number(index) : -1
  }

  setFocusedSpecies(index: number) {
    const focusTarget = this.querySelector(`[js-button][data-index="${index}"]`) as HTMLElement | null
    if (focusTarget) focusTarget.focus()
  }

  setSpecies(index: number) {
    this.value = this.fitleredSpecies[index].id.toString()
    this.open = false
  }

  filter(text: string = '') {
    this.fitleredSpecies = go(
      latinize(text), // Remove tildes from search
      this.speciesSearch,
      { limit: 100, threshold: -100 },
    ).map(result => {
      const value = this.species[result.target]
      return {
        id: value.id,
        value: value.label,
        target: highlight({
          ...result,
          target: value.label,
        }),
      }
    })

    if (!text) {
      this.fitleredSpecies = this.speciesSearch.map(species => {
        const value = this.species[species.target]
        return {
          id: value.id,
          value: value.label,
          target: value.label,
        }
      })
    }
    this.createDropdownMenuItems()
    if (!this.fitleredSpecies.length) this.open = false
  }

  handleInput() {
    this.open = true
    this.value = ''
    const inputValue = this.inputElement.value
    this.filter(inputValue)
    const foundLocataion = this.fitleredSpecies.find((species) => species.value === inputValue)
    if (foundLocataion) {
      const index = this.fitleredSpecies.indexOf(foundLocataion)
      this.setSpecies(index)
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if ((event.key === 'Enter') || (event.key === 'NumpadEnter')) {
      if (this.open) {
        const focusedIndex = this.getFocusedSpecies()
        if (focusedIndex === -1) {
          event.preventDefault()
          this.setSpecies(0)
        }
      }
    } else if ((event.key === 'ArrowUp') || (event.key === 'ArrowDown')) {
      event.preventDefault()
      const focusedIndex = this.getFocusedSpecies()
      const speciesBtns = this.querySelectorAll('button')
      if (focusedIndex > -1) {
        let next = focusedIndex + (event.key === 'ArrowUp' ? -1 : 1)
        if (next < 0) next = speciesBtns.length - 1
        if (next >= speciesBtns.length) next = 0
        this.setFocusedSpecies(next)
      } else {
        this.setFocusedSpecies(0)
      }
    } else if (event.key === 'Escape') {
      this.open = false
    }
  }

  handleFocusOut() {
    // Set timeout to wait and see if a focusin will happen
    this.focusingOut = setTimeout(() => { this.open = false }, 0)
  }

  handleFocusIn() {
    // Clear the timeout from focusout that would close the dropdown
    clearTimeout(this.focusingOut)
  }
}

customElements.define('arbolado-species-input', SpeciesInput)

export default SpeciesInput