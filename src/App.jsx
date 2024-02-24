import { useLayoutEffect, useState } from "react"
import rough from 'roughjs/bundled/rough.esm'
import RectagleIcon from "./assets/reactIcon"
import LineIcon from "./assets/lineIcon"
import CircleIcon from "./assets/circleIcon"
import CursorIcon from "./assets/cursoricon"


const generator = rough.generator()
function createElement(id, x1, y1, x2, y2, type) {
  let roughElement;
  if (type === 'line') {
    roughElement = generator.line(x1, y1, x2, y2)
  } else if (type === 'rectangle') {
    roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
  } else if (type === 'circle') {
    const d = (x2 - x1) + (y2 - y1)
    roughElement = generator.circle(x1, y1, d)
  }
  return { id, x1, y1, x2, y2, type, roughElement }
}

function isWithInElement(x, y, element) {

  const { type, x1, y1, x2, y2 } = element


  if (type === 'rectangle') {
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)
    return x >= minX && x <= maxX && y >= minY && y <= maxY
  } {
    const a = { x: x1, y: y1 }
    const b = { x: x2, y: y2 }
    const c = { x, y }
    const offset = distance(a, b) - (distance(a, c) + distance(b, c))
    return Math.abs(offset) < 1

  }


}
const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
function getElementPosition(x1, y1, elements) {
  return elements.find((element) => isWithInElement(x1, y1, element))

}


const App = () => {

  const [elements, setElement] = useState([]);
  const [Tool, setTool] = useState("rectangle");

  const [SelectedELement, setSelectedELement] = useState({});

  const [action, setAction] = useState("none");


  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const roughCanvas = rough.canvas(canvas)
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement))
  }, [elements])



  const handleOnMouseDown = (e) => {

    const { clientX, clientY } = e;
    if (Tool === 'selection') {
      const element = getElementPosition(clientX, clientY, elements)
      if (element) {
        setSelectedELement(element)
        setAction('moving')
      }
    } else {
      if (action !== 'drawing') {
        console.count("creating");
        setAction("drawing")
        const id = elements.length
        const element = createElement(id, clientX, clientY, clientX, clientY, Tool)
        setElement((prev) => [...prev, element])
      }

    }
  }

  const handleUpdateElement = (id, x1, y1, x2, y2, Tool) => {

    const UpdatedElement = createElement(id, x1, y1, x2, y2, Tool)

    const elementCopy = [...elements]

    elementCopy[id] = UpdatedElement

    setElement(elementCopy)
  }
  const handleOnMouseUp = () => {
    setAction("none")

  }
  const handleOnMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (action === 'drawing') {
      const index = elements.length - 1
      const { x1, y1, id } = elements[index]

      handleUpdateElement(id, x1, y1, clientX, clientY, Tool)
    } else if (action === 'moving') {
      const { id, x1, y1, y2, x2, type } = SelectedELement
      const width = x2 - x1;
      const height = y2 - y1
      handleUpdateElement(id, clientX, clientY, clientX + width, clientY + height, type)

    }
  }



  return (
    <>

      <div className="fixed flex gap-x-4  left-1/2 transform -translate-x-1/2 top-6 bg-gray-100 border-2 p-2 rounded-lg  ">
        <div
          onClick={() => setTool("selection")}
          className={`  flex cursor-pointer gap-2 ${Tool === 'selection' ? "bg-gray-200" : 'bg-gray-100'}  p-2 rounded-lg   items-end`} >
          <CursorIcon />
          <span className="text-xs">V</span>
        </div>
        <div
          onClick={() => setTool("rectangle")}
          className={`  flex cursor-pointer gap-2 ${Tool === 'rectangle' ? "bg-gray-200" : 'bg-gray-100'}  p-2 rounded-lg   items-end`} >
          <RectagleIcon />
          <span className="text-xs">R</span>
        </div>
        <div
          onClick={() => setTool("line")}
          className={`flex ${Tool === 'line' ? "bg-gray-200" : 'bg-gray-100'}  cursor-pointer  gap-2 p-2 rounded-lg items-end `}>
          <LineIcon />
          <span className="text-xs">L</span>
        </div>
        <div
          onClick={() => setTool("circle")}
          className={`flex ${Tool === 'circle' ? "bg-gray-200" : 'bg-gray-100'}  cursor-pointer  gap-2 p-2 rounded-lg items-end `}>
          <CircleIcon />
          <span className="text-xs">C</span>
        </div>
      </div >

      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleOnMouseDown}
        onMouseMove={handleOnMouseMove}
        onMouseUp={handleOnMouseUp}
      ></canvas>
    </>
  )
}

export default App
