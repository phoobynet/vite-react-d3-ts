import PageContainer from '@/components/PageContainer'
import PageDescription from '@/components/PageDescription'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import * as d3 from 'd3'
import { random, range } from 'lodash'
import { useEffect, useRef } from 'react'

interface DataItem {
  x: number
  y: number
}

export default function LineMaker() {
  const svgRef = useRef<SVGSVGElement>(null)
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 300

  const randomLineData = (): DataItem[] =>
    range(1, 10).map((x) => {
      return {
        x,
        y: random(0, 200, false),
      }
    })

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // get data
    const data = randomLineData()

    // scaling
    const yExt = d3.extent(data.map((d) => d.y))
    const scX = d3.scaleLinear().domain([0, 10]).range([0, SVG_WIDTH])
    const scY = d3
      .scaleLinear()
      .domain(yExt as [number, number])
      .range([SVG_HEIGHT, 0])
      .nice()

    const scaledData: [number, number][] = data.map((d) => [scX(d.x), scY(d.y)])

    svg
      .append('g')
      .selectAll('circle')
      .data(scaledData)
      .enter()
      .append('circle')
      .attr('r', 3)
      .attr('cx', (d) => d[0])
      .attr('cy', (d) => d[1])

    // Example of bypassing a data point, and not drawing a line to it or from it.
    const lineMaker = d3
      .line()
      .defined((d, i) => i !== 3)
      .curve(d3.curveCatmullRom.alpha(0.5))

    // not necessary to supply accessor functions because the array is already in the right format
    // lineMaker.x((d) => d[0])
    // lineMaker.y((d) => d[1])
    svg
      .append('g')
      .append('path')
      .attr('d', lineMaker(scaledData))
      .attr('fill', 'none')
      .attr('stroke', 'red')
  }, [])
  return (
    <PageContainer>
      <PageHeading>Line Maker</PageHeading>
      <PageDescription>
        Draw a line using the an SVG <code>path</code> by creating a{' '}
        <code>d3.lineMaker</code>. Also, we can skip part of a line, but
        excluding a data point going to or coming from it. In addition, a curve
        factory is used to create a curve function.
      </PageDescription>
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
