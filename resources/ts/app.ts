import ArboladoMap from './map'
import ArboladoForm from './form'
import ArboladoTreeData from './tree-data'
import './components/species-input'

declare global {
  interface Window {
    env: any,
    Arbolado: {
      fetch: (url: string, method: string, data?: any) => Promise<any>,
      fetchJson: (url: string, method: string, data?: any) => Promise<object | void>,
      fetchText: (url: string, method: string, data?: any) => Promise<string | void>,
      setLoading: (show: boolean) => void,
    }
  }
}

window.Arbolado = {
  async fetch(url: string, method: string, data?: any): Promise<any> {
    window.Arbolado.setLoading(true)
    try {
      return await fetch(url, { method: method || 'GET', body: data })
    } catch (error) {
      return console.error(error)
    } finally {
      window.Arbolado.setLoading(false)
    }
  },
  async fetchJson(url: string, method: string, data?: any): Promise<object | void> {
    return await (await window.Arbolado.fetch(url, method, data)).json()
  },
  async fetchText(url: string, method: string, data?: any): Promise<string | void> {
    return await (await window.Arbolado.fetch(url, method, data)).text()
  },
  setLoading(show: boolean): void {
    const loader = document.querySelector('[js-loader]')
    if (!loader) return
    if (show) return loader.classList.add('show')
    loader.classList.remove('show')
  },
}

const map = new ArboladoMap()
new ArboladoForm(map)
new ArboladoTreeData(map)

