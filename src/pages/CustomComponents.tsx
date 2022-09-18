import PageContainer from '@/components/PageContainer'
import PageDescription from '@/components/PageDescription'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

type StickSelection = d3.Selection<
  SVGGElement,
  any,
  d3.BaseType | null,
  unknown
>

function Sticker(selection: StickSelection, label = '') {
  const WIDTH = 70
  const HEIGHT = 30

  selection
    .append('rect')
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .attr('x', 0)
    .attr('y', 0)
    .attr('fill', 'none')
    .attr('stroke', 'blue')
    .classed('frame', true)

  selection
    .append('text')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 14)
    .classed('label', true)
    .text(label ? label : (d: string) => d)
}

// noinspection TypeScriptValidateTypes
export default function CustomComponents() {
  const svgRef = useRef<SVGSVGElement>(null)
  const labels = useRef<string[]>(['Hello', 'World', 'How', 'Are', 'You?'])
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 300

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const scX = d3
      .scaleLinear()
      .domain([0, labels.current.length - 1])
      .range([100, 500])
    const scY = d3
      .scaleLinear()
      .domain([0, labels.current.length - 1])
      .range([50, 150])
    svg
      .selectAll('g')
      .data(labels.current)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${scX(i)},${scY(i)})`)
      .call(Sticker)

    svg
      .append('g')
      .attr('transform', 'translate(75,150)')
      .call(Sticker, "I'm fine!")
      .selectAll('.label')
      .attr('fill', 'red')
  }, [])

  return (
    <PageContainer>
      <PageHeading>Custom Components</PageHeading>
      <PageDescription>
        Components are to the DOM tree what functions are to the code.{' '}
        <strong>
          A reusable set of actions that are always grouped together.
        </strong>
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
