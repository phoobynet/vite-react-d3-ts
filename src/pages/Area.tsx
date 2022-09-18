import PageContainer from '@/components/PageContainer'
import PageDescription from '@/components/PageDescription'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import { Point, generateRandomPoints } from '@/libs/generateRandomPoints'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

export default function Area() {
  const svgRef = useRef<SVGSVGElement>(null)
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 300

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margins = {
      top: 30,
      right: 30,
      bottom: 30,
      left: 30,
    }

    const data: Point[] = generateRandomPoints(0, 20, 1, 0, 100)

    const scX = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.x) as [number, number])
      .range([margins.left, SVG_WIDTH - margins.right])

    const scY = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.y) as [number, number])
      .range([SVG_HEIGHT - margins.bottom, margins.top])

    // when creating the area generator, we need to specify the x, but also the y0 and y1
    // we are creating two lines along the y axis, one at the bottom of the chart, and one at the top.
    // NOTE: even though the "bottom" of the chart represents the lowest value, we must apply the appropriate scaling to it.
    const area = d3
      .area<Point>()
      .x((d) => scX(d.x))
      .y1((d) => scY(d.y))
      .y0(() => scY(d3.min(data, (d) => d.y) as number))

    svg
      .append('g')
      .append('path')
      .attr('d', area(data))
      .attr('fill', 'rgb(96,129,224)')

    const leftAxis = d3.axisLeft(scY).ticks(5)

    const axis = svg
      .append('g')
      .attr('transform', `translate(25, 0)`)
      .call(leftAxis)

    axis
      .selectAll('*')
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 0.5)
  }, [])

  return (
    <PageContainer>
      <PageHeading>Area</PageHeading>
      <PageDescription>
        This demonstrates using a <code>d3.area</code> to <i>generate</i> a{' '}
        <code>path</code>.
        <br />
        You can find an example in{' '}
        <a
          href="https://d3-graph-gallery.com/area"
          target="_blank"
          rel="noreferrer"
          className="link link-primary link-hover"
        >
          D3 Graph Gallery
        </a>
      </PageDescription>
      <PageMain>
        <svg
          ref={svgRef}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="bg-slate-200"
        ></svg>
      </PageMain>
    </PageContainer>
  )
}
