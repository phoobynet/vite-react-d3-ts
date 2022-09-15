import { Selection, pointer } from 'd3'
import { drag } from 'd3-drag'
import { select } from 'd3-selection'
import { useEffect, useRef } from 'react'

interface Circle {
  x: number
  y: number
  fill: string
}

export default function DragAndDrop() {
  const svgRef = useRef<SVGSVGElement>(null)
  const svgWidth = 600
  const svgHeight = 300
  const circleRadius = 30
  const y = svgHeight / 2
  const circleData = useRef<Circle[]>([
    {
      x: 100,
      y,
      fill: 'red',
    },
    {
      x: 300,
      y,
      fill: 'green',
    },
    {
      x: 500,
      y,
      fill: 'blue',
    },
  ])

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    let widgetBeingDragged: Selection<any, any, any, any> | undefined
    let widgetOriginalColor: string

    // initialize the circles
    svg
      .selectAll('circle')
      .data(circleData.current)
      .enter()
      .append('circle')
      .attr('r', circleRadius)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('fill', (d) => d.fill)

    // implement how "whatever" you wish to drag should behave
    const dragSelection = drag()
      .on('start', function () {
        widgetOriginalColor = select(this).attr('fill')
        widgetBeingDragged = select(this).attr('fill', 'lime')
      })
      .on('drag', function (event) {
        const [x, y] = pointer(event, this)
        select(this).style('cursor', 'grabbing')
        widgetBeingDragged?.attr('cx', x).attr('cy', y)
      })
      .on('end', function () {
        widgetBeingDragged?.attr('fill', widgetOriginalColor)
        select(this).style('cursor', 'default')
        widgetBeingDragged = undefined
      })

    // bind drag behavior to the circles
    // You could use call, but TypeScript kicked off with some indecipherable error
    dragSelection(svg.selectAll('circle'))
  }, [])

  return (
    <div className="container mx-auto max-w-3xl">
      <header className="py-4">
        <h1 className="text-3xl font-bold tracking-wider">Drag and Drop</h1>
      </header>
      <svg
        ref={svgRef}
        width={svgWidth}
        height={svgHeight}
        className="bg-slate-100"
      ></svg>
    </div>
  )
}
