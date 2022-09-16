import PageContainer from '@/components/PageContainer'
import PageDescription from '@/components/PageDescription'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { select } from 'd3-selection'
import { symbol, symbolStar, symbols } from 'd3-shape'
import { useEffect, useRef } from 'react'

interface DataItem {
  x: number
  y: number
  val: string
}

export default function Symbols() {
  const svgRef = useRef<SVGSVGElement>(null)
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 150

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    const data: DataItem[] = [
      {
        x: 40,
        y: 0,
        val: 'A',
      },
      {
        x: 80,
        y: 30,
        val: 'A',
      },
      {
        x: 120,
        y: -10,
        val: 'B',
      },
      {
        x: 160,
        y: 15,
        val: 'A',
      },
      {
        x: 200,
        y: 0,
        val: 'C',
      },
      {
        x: 240,
        y: 10,
        val: 'B',
      },
    ]

    const symbolMaker = symbol().size(81).type(symbolStar)
    const scY = scaleLinear().domain([-10, 30]).range([80, 40])

    svg
      .append('g')
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('d', symbolMaker)
      .attr('fill', 'red')
      .attr('transform', (d) => `translate(${d.x}, ${scY(d.y)})`)

    const scT = scaleOrdinal(symbols).domain(['A', 'B', 'C'])

    const scR = scaleLinear().domain([40, 240]).range([0, 360])

    svg
      .append('g')
      .attr('transform', 'translate(300, 0)')
      .selectAll('path')
      .data(data)
      .enter()
      .append('path')
      .attr('d', (d) => symbolMaker.type(scT(d.val))())
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      /* Remember that scaling doesn't just transform the size of a shape, it will scale the entire shape including the coordinates.
       * The transform sets the position as the first argument, which will be the last transform applied (read transforms right-to-left).
       *
       * To avoid shifting coordinates, do the following steps:
       *
       * 1. Create objects only at the origin
       * 2. Apply the desired scaling and rotations while the object is still at the origin
       * 3. Only then move (translate) the object to its intended location
       * 4. Group multiple elements together and apply the same transform to the group
       */
      .attr(
        'transform',
        (d) => `translate(${d.x}, ${scY(d.y)}) scale(2) rotate(${scR(d.x)})`,
      )
  }, [])

  return (
    <PageContainer>
      <PageHeading>Pre-defined Symbols</PageHeading>
      <PageDescription>
        D3 provides a number of pre-defined symbols. However, it&apos;s not as
        simple as simple adding a symbol at a position withing the container.
        What D3 does is provide a symbol generator that can be used along with a
        path generator to create a path element that can be added to the
        container.
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
