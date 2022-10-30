class Drawer extends HTMLElement {
  show: boolean = false
  closeBtn: HTMLButtonElement
  content: HTMLElement
  body: HTMLElement
  wrapper: HTMLElement
  
  constructor() {
    super()

    this.close = this.close.bind(this)
    this.closeOnEsc = this.closeOnEsc.bind(this)
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this)
    
    const template = document.querySelector('[js-template="drawer"]') as HTMLTemplateElement
    const templateClone = template.content.cloneNode(true)
    this.append(templateClone)
    
    this.closeBtn = this.querySelector('[js-drawer-close]') as HTMLButtonElement
    this.body = this.querySelector('[js-drawer-body]') as HTMLElement
    this.wrapper = this.querySelector('[js-drawer-wrapper]') as HTMLElement
    this.content = this.querySelector('[js-drawer-content]') as HTMLElement
    
    this.closeBtn.addEventListener('click', this.close)
    this.wrapper.addEventListener('click', this.closeOnOutsideClick)
  }
  
  open(): void {
    this.show = true
    this.wrapper.classList.add('show')
    document.addEventListener('keydown', this.closeOnEsc)
  }
  
  close(): void {
    this.show = false
    this.wrapper.classList.remove('show')
    document.removeEventListener('keydown', this.closeOnEsc)
  }

  toggle(): void {
    if (this.show) this.close()
    else this.open()
  }

  closeOnEsc(event: KeyboardEvent): void {
    if (event.code === 'Escape') this.close()
  }

  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.content.contains(event.target as Node)) this.close()
  }

  setContent(content: string): void {
    this.body.innerHTML = content
  }
}

customElements.define('arbolado-drawer', Drawer)

export default Drawer