import PageContainer from '@/components/PageContainer'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import { Selection, pointer } from 'd3'
import { drag } from 'd3-drag'
import { select } from 'd3-selection'
import { useEffect, useRef } from 'react'

interface Circle {
  x: number
  y: number
  fill: string
}

export default function DragAndDropPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 300
  const circleRadius = 30
  const y = SVG_HEIGHT / 2
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
    <PageContainer>
      <PageHeading>Drag and Drop</PageHeading>
      <PageMain>
        <svg
          ref={svgRef}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="bg-slate-100"
        ></svg>
      </PageMain>
    </PageContainer>
  )
}
