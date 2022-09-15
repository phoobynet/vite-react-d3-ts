import PageContainer from '@/components/PageContainer'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import { max, scaleLinear, select } from 'd3'
import { useEffect, useRef } from 'react'

export default function TransitionsPage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const scY = useRef(scaleLinear())
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 300

  // generate a fix number of items
  const randomDataGenerator = (n = 10, min = 0, max = 100) => {
    return Array.from(
      { length: n },
      () => Math.floor(Math.random() * max) + min,
    )
  }

  const render = (data: number[] = randomDataGenerator()) => {
    const svg = select(svgRef.current)

    const n = data.length
    const mx = max(data) as number

    // x scale will use the index of our data
    const scX = scaleLinear().domain([0, n]).range([50, 540])
    scY.current = scaleLinear().domain([0, mx]).range([250, 25])

    svg
      .selectAll('line')
      .data(data)
      .enter()
      .append('line')
      .attr('stroke', 'red')
      .attr('stroke-width', 20)
      .attr('x1', (d, i) => scX(i))
      .attr('y1', scY.current(0))
      .attr('x2', (d, i) => scX(i))
      .attr('y2', (d) => scY.current(d))
  }

  const onClick = () => {
    const svg = select(svgRef.current)

    // transitions require elements to already be created.  See useEffect and render for the initial creation.
    svg
      .selectAll('line')
      // supply new random data
      .data(randomDataGenerator())
      .transition()
      // apply the transition with a duration of 1 second
      .duration(1000)
      // and a random delay applied to each element
      .delay((d, i) => 200 * i)
      // eventually apply the y2 or "height" of the line using the new data an scaling
      .attr('y2', (d) => scY.current(d))
  }

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    render()
  }, [])

  return (
    <PageContainer>
      <PageHeading>Transitions</PageHeading>
      <PageMain>
        <svg
          ref={svgRef}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          className="bg-slate-100"
        ></svg>
        <button
          onClick={onClick}
          className="btn btn-primary btn-lg btn-outline mt-4 shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-500"
        >
          Refresh the data
        </button>
      </PageMain>
    </PageContainer>
  )
}
