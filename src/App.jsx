import { useLayoutEffect, useState } from "react"
import rough from 'roughjs/bundled/rough.esm'
import RectagleIcon from "./assets/reactIcon"
import LineIcon from "./assets/lineIcon"
import CircleIcon from "./assets/circleIcon"


const generator = rough.generator()
function createElement(x1, y1, x2, y2, ElementType) {
  let roughElement;
  if (ElementType === 'line') {
    roughElement = generator.line(x1, y1, x2, y2)
  } else if (ElementType === 'rectangle') {
    roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
  } else if (ElementType === 'circle') {
    const d = (x2 - x1) + (y2 - y1)
    roughElement = generator.circle(x1, y1, d)
  }


  return { x1, y1, x2, y2, roughElement }
}
const App = () => {

  const [elements, setElement] = useState([]);
  const [ElementType, setElementType] = useState("rectangle");

  const [drawing, setDrawing] = useState(false);


  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)



    const roughCanvas = rough.canvas(canvas)
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement))
  }, [elements])



  const handleOnMouseDown = (e) => {
    setDrawing(true)
    const { clientX, clientY } = e;
    const element = createElement(clientX, clientY, clientX, clientY, ElementType)
    setElement((prev) => [...prev, element])
  }
  const handleOnMouseUp = () => {
    setDrawing(false)

  }
  const handleOnMouseMove = (e) => {
    if (!drawing) return

    const { clientX, clientY } = e;

    const index = elements.length - 1
    const { x1, y1 } = elements[index]

    const UpdatedElement = createElement(x1, y1, clientX, clientY, ElementType)

    const elementCopy = [...elements]

    elementCopy[index] = UpdatedElement

    setElement(elementCopy)
  }



  return (
    <>

      <div className="fixed flex gap-x-4  left-1/2 transform -translate-x-1/2 top-6 bg-gray-100 border-2 p-2 rounded-lg  ">
        <div
          onClick={() => setElementType("rectangle")}
          className={`  flex cursor-pointer gap-2 ${ElementType === 'rectangle' ? "bg-gray-200" : 'bg-gray-100'}  p-2 rounded-lg   items-end`} >
          <RectagleIcon />
          <span className="text-xs">R</span>
        </div>
        <div
          onClick={() => setElementType("line")}
          className={`flex ${ElementType === 'line' ? "bg-gray-200" : 'bg-gray-100'}  cursor-pointer  gap-2 p-2 rounded-lg items-end `}>
          <LineIcon />
          <span className="text-xs">L</span>
        </div>
        <div
          onClick={() => setElementType("circle")}
          className={`flex ${ElementType === 'circle' ? "bg-gray-200" : 'bg-gray-100'}  cursor-pointer  gap-2 p-2 rounded-lg items-end `}>
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
