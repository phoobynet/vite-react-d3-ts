import PageContainer from '@/components/PageContainer'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import { select } from 'd3-selection'
import { Timer, timer } from 'd3-timer'
import { useEffect, useRef } from 'react'

interface SVGLineElementOpacity extends SVGLineElement {
  bogusOpacity: number
}

export default function LissajousCurve() {
  const lTimer = useRef<Timer>()
  const svgRef = useRef<SVGSVGElement>(null)
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 300

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    if (lTimer.current) {
      lTimer.current.stop()
      lTimer.current = undefined
    }

    const a = 3.2
    const b = 5.9

    let phi,
      // eslint-disable-next-line prefer-const
      omega = (2 * Math.PI) / 10_000

    let crrX = 250
    let crrY = 150

    let prvX = crrX
    let prvY = crrY

    const title = svg
      .append('text')
      .attr('y', 25)
      .attr('x', 20)
      .attr('fill', '#b144ee')
      .attr('font-size', 20)
      .text('Lissajous Curve')

    lTimer.current = timer(function (t) {
      phi = omega * t
      crrX = 250 + 100 * Math.cos(a * phi)
      crrY = 150 + 100 * Math.sin(b * phi)

      title.text(`Lissajous Curve - ${Math.floor(t / 1_000)} sec`)

      svg
        .selectAll('line')
        .each(function () {
          const line = this as SVGLineElementOpacity
          line.bogusOpacity *= 0.99
        })
        .attr('stroke-opacity', function () {
          const line = this as SVGLineElementOpacity
          return line.bogusOpacity
        })
        .filter(function () {
          return (this as SVGLineElementOpacity).bogusOpacity < 0.05
        })
        .remove()

      svg
        .append('line')
        .each(function () {
          const line = this as SVGLineElementOpacity
          line.bogusOpacity = 1.0
        })
        .attr('x1', prvX)
        .attr('y1', prvY)
        .attr('x2', crrX)
        .attr('y2', crrY)
        .attr('stroke', 'green')
        .attr('stroke-width', 2)

      prvX = crrX
      prvY = crrY

      if (t > 120e3) {
        lTimer.current?.stop()
        lTimer.current = undefined
        console.log('stopped')
      }
    })

    return () => {
      lTimer.current?.stop()
      lTimer.current = undefined
    }
  }, [])

  return (
    <PageContainer>
      <PageHeading>Real Time Animations</PageHeading>
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
