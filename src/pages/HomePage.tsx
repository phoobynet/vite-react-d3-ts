import PageContainer from '@/components/PageContainer'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import { select } from 'd3-selection'
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const svgRef = useRef<SVGSVGElement>(null)
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 300

  useEffect(() => {
    const svg = select(svgRef.current)

    // React 18 will render this component twice in development due to strict mode.
    // So will be need to clear the contents of the SVG first
    svg.selectAll('*').remove()

    const svgBbox = svgRef.current?.getBoundingClientRect()

    if (svgBbox) {
      svg
        .append('text')
        .attr('stroke', 'red')
        .attr('font-size', 30)
        .attr('text-anchor', 'middle')
        .attr('x', svgBbox.width / 2)
        .attr('y', svgBbox.height / 2)
        .text('Hello World')
    }
  }, [])

  return (
    <PageContainer>
      <PageHeading>Home</PageHeading>
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
