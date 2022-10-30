import Drawer from './components/drawer'
import ArboladoMap from './map'

export default class ArboladoTreeData {
  map: ArboladoMap
  drawer: Drawer
  
  constructor(map: ArboladoMap) {
    this.map = map
    this.drawer = document.querySelector('[js-tree-data]') as Drawer
    
    this.map.addEventListener('selectTree', this.displayTree.bind(this))
  }

  private async displayTree(id: number): Promise<void> {
    try {
      const treeData = await window.Arbolado.fetchText(`/tree/${id}`, 'get')
      if (!treeData) return
      this.drawer.setContent(treeData)
      this.drawer.open()
    } catch (error) {
      console.error(error)
    }
  }
}