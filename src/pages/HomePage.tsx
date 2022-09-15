import { useEffect, useRef } from 'react'
import { select } from 'd3-selection'

export default function HomePage () {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = select(svgRef.current)

    // React 18 will render this component twice in development due to strict mode.
    // So will be need to clear the contents of the SVG first
    svg.selectAll('*')
      .remove()

    const svgBbox = svgRef.current?.getBoundingClientRect()

    if (svgBbox) {
      svg.append('text')
        .attr('stroke', 'red')
        .attr('font-size', 30)
        .attr('text-anchor', 'middle')
        .attr('x', svgBbox.width / 2)
        .attr('y', svgBbox.height / 2)
        .text('Hello World')
    }

  }, [])

  return (
    <div className="container mx-auto max-w-3xl">
      <header>
        <h1 className="font-bold tracking-wider text-3xl">Home Page</h1>
      </header>
      <main className="pt-5">
        <svg
          ref={svgRef}
          width={600}
          height={300}
          className="bg-slate-100"
        ></svg>
      </main>
    </div>
  )
}
