import { useDebounce } from '@/hooks/useDebounce'
import { useSizeObserver } from '@/hooks/useSizeObserver'
import * as d3 from 'd3'
import { CurveFactory } from 'd3'
import { random, range } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'

interface DataItem {
  x: number
  y: number
}

const randomLineData = (count: number): DataItem[] =>
  range(1, count + 1).map((x) => {
    return {
      x,
      y: random(0, 200, false),
    }
  })

const MIN_COUNT = 5
const MAX_COUNT = 50

const curveFactories = new Map<string, CurveFactory>([
  ['curveLinear', d3.curveLinear],
  ['curveLinearClosed', d3.curveLinearClosed],
  ['curveStep', d3.curveStep],
  ['curveStepBefore', d3.curveStepBefore],
  ['curveStepAfter', d3.curveStepAfter],
  ['curveBasis', d3.curveBasis],
  ['curveBasisOpen', d3.curveBasisOpen],
  ['curveBasisClosed', d3.curveBasisClosed],
  ['curveCardinal', d3.curveCardinal],
  ['curveCardinalOpen', d3.curveCardinalOpen],
  ['curveCardinalClosed', d3.curveCardinalClosed],
  ['curveNatural', d3.curveNatural],
  ['curveCatmullRom', d3.curveCatmullRom],
  ['curveCatmullRomOpen', d3.curveCatmullRomOpen],
  ['curveCatmullRomClosed', d3.curveCatmullRomClosed],
  ['curveMonotoneX', d3.curveMonotoneX],
  ['curveMonotoneY', d3.curveMonotoneY],
])

/**
 * http://using-d3js.com/05_04_curves.html
 * @param data
 * @constructor
 */
export default function Line({ data }: { data: Array<DataItem> }) {
  const [lineData, setLineData] = useState<DataItem[]>([...data])
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [count, setCount] = useState<number>(
    random(MIN_COUNT, MAX_COUNT + 1, false),
  )
  const debouncedCount = useDebounce(count, 500)
  const [curveKey, setCurveKey] = useState<string>('curveLinear')
  const {
    width: containerWidth,
    height: containerHeight,
    observe,
  } = useSizeObserver()

  const svgWidth = useMemo(() => {
    if (containerWidth) {
      return (containerWidth / 3) * 2
    }
    return 0
  }, [containerWidth])

  const controlsWidth = useMemo(() => {
    if (containerWidth) {
      return containerWidth / 3
    }
    return 0
  }, [containerWidth])

  function render(renderData: Array<DataItem>) {
    if (!svgRef.current) {
      return
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    }

    // scaling
    const xDomain = d3.extent(renderData.map((d) => d.x)) as number[]
    const yDomain = d3.extent(renderData.map((d) => d.y)) as number[]
    const scX = d3
      .scaleLinear()
      .domain(xDomain)
      .range([margin.left, svgWidth - margin.right])
    const scY = d3
      .scaleLinear()
      .domain(yDomain)
      .range([containerHeight - margin.bottom, margin.top])

    // circles
    svg
      .selectAll('circle')
      .data(renderData)
      .enter()
      .append('circle')
      .attr('r', 4)
      .attr('fill', 'blue')
      .attr('cx', (d) => scX(d.x))
      .attr('cy', (d) => scY(d.y))

    // line
    const curveFactory = curveFactories.get(curveKey)

    const lineMaker = d3
      .line<DataItem>()
      .x((d) => scX(d.x))
      .y((d) => scY(d.y))

    if (curveFactory) {
      lineMaker.curve(curveFactory)
    }

    // render path using line maker
    svg
      .append('g')
      .append('path')
      .attr('d', lineMaker(renderData))
      .attr('fill', 'none')
      .attr('stroke', '#ea31e9')
  }

  useEffect(() => {
    observe(containerRef.current)
  }, [])

  useEffect(() => {
    if (lineData?.length) {
      render(lineData)
    }
  }, [data, lineData, svgWidth, containerHeight, curveKey])

  useEffect(() => {
    setLineData(randomLineData(debouncedCount))
  }, [debouncedCount])

  return (
    <div
      className="w-full flex flex-row h-[300px]"
      ref={containerRef}
    >
      {containerWidth && containerHeight && (
        <>
          <svg
            ref={svgRef}
            width={svgWidth}
            height={containerHeight}
            className="bg-slate-200"
          ></svg>
          <div
            style={{ width: controlsWidth }}
            className="w-full pl-1"
          >
            <div className="flex flex-col border-2 h-full px-2">
              <div className="form-control">
                <label
                  htmlFor="count"
                  className="label"
                >
                  <span className="label-text">Data Items ({count})</span>
                </label>
                <input
                  id="count"
                  type="range"
                  min="5"
                  max="50"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="range range-secondary"
                />
              </div>

              <div className="form-control">
                <label
                  htmlFor="curve"
                  className="label"
                >
                  <span className="label-text">Curve</span>
                </label>
                <select
                  className="select select-bordered w-full max-w-xs"
                  value={curveKey}
                  onChange={(e) => setCurveKey(e.target.value)}
                >
                  {Array.from(curveFactories.keys()).map((key) => (
                    <option
                      key={key}
                      value={key}
                    >
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
