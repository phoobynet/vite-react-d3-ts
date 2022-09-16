import PageContainer from '@/components/PageContainer'
import PageDescription from '@/components/PageDescription'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import { range, shuffle } from 'd3-array'
import { scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import { interval } from 'd3-timer'
import { useEffect, useRef } from 'react'

interface DataItem {
  x: number
  y: number
  val: number
}

/**
 * D3 for the Impatient - Example 4.7 - Smoothing Periodic Updates with Transitions
 * @constructor
 */
export default function Voters() {
  const svgRef = useRef<SVGSVGElement>(null)
  const SVG_WIDTH = 300
  const SVG_HEIGHT = 300

  useEffect(() => {
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    // the size of each rect
    const n = 30

    // the number of rects
    const w = SVG_WIDTH / n

    // the timer interval
    const dt = 2_000

    const data: DataItem[] = range(n * n).map((d) => {
      return {
        x: d % n,
        y: (d / n) | 0,
        val: Math.random(),
      }
    })

    const sc = scaleQuantize<string>().range(['white', 'red', 'black'])

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x * w)
      .attr('y', (d) => d.y * w)
      .attr('width', w - 1)
      .attr('height', w - 1)
      .attr('fill', (d) => sc(d.val))

    function update() {
      const nbs = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]

      return shuffle(range(n * n)).map((i) => {
        const nb = nbs[(Math.random() * nbs.length) | 0]
        const x = (data[i].x + nb[0] + n) % n
        const y = (data[i].y + nb[1] + n) % n
        data[i].val = data[y * n + x].val
      })
    }

    const t = interval(() => {
      update()
      svg
        .selectAll('rect')
        .data(data)
        .transition()
        .duration(dt)
        .delay((d, i) => (i * 0.25 * dt) / (n * n))
        .attr('fill', (d) => sc(d.val))
    }, dt)

    return () => {
      t.stop()
    }
  }, [])

  return (
    <PageContainer>
      <PageHeading>Voters</PageHeading>
      <PageDescription>
        Simulates polling data at regular intervals using{' '}
        <a
          href="https://observablehq.com/@oliviafvane/d3-timer-and-d3-interval-basic-demo"
          target="_blank"
          rel="noreferrer"
          className="link link-hover link-primary"
        >
          <code>d3.interval</code>
        </a>{' '}
        and applying changes using a delayed transition.
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
