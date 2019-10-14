import { getElementById } from "../utils";

let buttons: HTMLButtonElement[] = []
let activeRobot = 0
const colorControls = getElementById('colorControls')
colorControls.addEventListener('click', clickHandler)

let onColorSelectCallback: (color: number) => void


export function createButtons(count: number) {
  buttons = new Array(count).fill(null).map((_, i) => {
    const elem = document.createElement("button")
    elem.classList.add('color'+i)
    if(i===activeRobot) elem.classList.add('selected')
    elem.dataset.color = i.toString()
    elem.innerText = (i+1).toString()
    return elem
  })
  colorControls.innerHTML = ""
  buttons.forEach(button => colorControls.appendChild(button))
}

export function onColorSelect(callback: (color: number) => void) {
  onColorSelectCallback = callback
}

export function activeRobotChanged(color: number) {
  activateButton(color)
}

function activateButton(color: number) {
  activeRobot = color
  buttons.forEach((button, i) => button.classList.toggle('selected', color===i))
}

function clickHandler(e: MouseEvent) {
  const button = e.target as HTMLButtonElement
  if(!button) return
  
  const colorStr = button.dataset.color
  if(!colorStr) return
  
  activateButton(parseInt(colorStr))
  onColorSelectCallback(parseInt(colorStr))
}
