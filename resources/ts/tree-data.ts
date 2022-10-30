import ArboladoMap from './map'

export default class ArboladoTreeData {
  map: ArboladoMap
  treeDataElement: HTMLElement
  treeCloseElement: HTMLButtonElement
  
  constructor(map: ArboladoMap) {
    this.map = map
    this.treeDataElement = document.querySelector('[js-tree-data]') as HTMLElement
    this.treeCloseElement = document.querySelector('[js-tree-close]') as HTMLButtonElement
    
    this.map.addEventListener('selectTree', this.displayTree.bind(this))
    this.treeCloseElement.addEventListener('click', this.closeTree.bind(this))
  }

  private async displayTree(id: number): Promise<void> {
    try {
      const treeData = await window.Arbolado.fetchText(`/tree/${id}`, 'get')
      if (!treeData) return
      this.treeDataElement.innerHTML = treeData
      this.openTree()
    } catch (error) {
      console.error(error)
    }
  }
  
  private closeTree(): void {
    this.toggleTree(false)
  }
  
  private openTree(): void {
    this.toggleTree(true)
  }

  private toggleTree(show: boolean): void {
    if (show) this.treeDataElement.classList.add('show')
    else this.treeDataElement.classList.remove('show')
  }
}