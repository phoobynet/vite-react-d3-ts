import PageContainer from '@/components/PageContainer'
import PageDescription from '@/components/PageDescription'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'
import { useDebounce } from '@/hooks/useDebounce'
import * as d3 from 'd3'
import { select } from 'd3-selection'
import { useEffect, useRef, useState } from 'react'

interface DataItem {
  name: string
  votes: number
}

export default function PieChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const SVG_WIDTH = 600
  const SVG_HEIGHT = 375

  const [innerRadius, setInnerRadius] = useState<number>(50)
  const innerRadiusDebounced = useDebounce(innerRadius, 200)
  const [outerRadius, setOuterRadius] = useState<number>(150)
  const outerRadiusDebounced = useDebounce(outerRadius, 200)
  const [cornerRadius, setCornerRadius] = useState<number>(10)
  const cornerRadiusDebounced = useDebounce(cornerRadius, 200)

  const [textInnerRadius, setTextInnerRadius] = useState<number>(85)
  const textInnerRadiusDebounced = useDebounce(textInnerRadius, 200)

  const [textOuterRadius, setTextOuterRadius] = useState<number>(85)
  const textOuterRadiusDebounced = useDebounce(textOuterRadius, 200)

  const [textRadiusSynced, setTextRadiusSynced] = useState<boolean>(true)

  //<editor-fold desc="Data">
  const data = useRef<DataItem[]>([
    {
      name: 'Jim',
      votes: 12,
    },
    {
      name: 'Sue',
      votes: 5,
    },
    {
      name: 'Bob',
      votes: 21,
    },
    {
      name: 'Ann',
      votes: 17,
    },
    {
      name: 'Dan',
      votes: 3,
    },
  ])
  //</editor-fold>

  const render = (renderData: DataItem[]) => {
    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    // Create a layout based on the provided data
    // this will be used to generate a PieArcDatum that doesn't render
    // anything itself, but can be used to create a pie chart using a path element.
    const pie = d3
      .pie<DataItem>()
      .value((d) => d.votes)
      .padAngle(0.025)(renderData)

    const arcMaker = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(cornerRadius)

    const scC = d3
      .scaleOrdinal(d3.schemePastel2)
      .domain(pie.map((d) => d.index.toString()))

    const g = svg.append('g').attr('transform', 'translate(300, 175)')

    // build the chart using the pie layout data which includes the correct angles to use for
    // each segment
    g.selectAll('path')
      .data(pie)
      .enter()
      .append('path')
      .attr('d', arcMaker)
      .attr('fill', (d) => scC(d.index.toString()))
      .attr('stroke', 'gray')
      .attr('stroke-width', 2)

    g.selectAll('text')
      .data(pie)
      .enter()
      .append('text')
      .text((d) => d.data.name)
      .attr('x', (d) => arcMaker.innerRadius(textInnerRadius).centroid(d)[0])
      .attr('y', (d) => arcMaker.innerRadius(textOuterRadius).centroid(d)[1])
      .attr('font-family', 'sans-serif')
      .attr('font-size', 14)
      .attr('text-anchor', 'middle')
  }

  useEffect(() => {
    render(data.current)
  }, [
    innerRadiusDebounced,
    outerRadiusDebounced,
    cornerRadiusDebounced,
    textInnerRadiusDebounced,
    textOuterRadiusDebounced,
  ])

  return (
    <PageContainer>
      <PageHeading>Pie Chart</PageHeading>
      <PageDescription>
        First, <strong>do not use pie charts.</strong> See{' '}
        <a
          href="https://www.data-to-viz.com/caveat/pie.html"
          className="link link-primary link-hover"
        >
          this article
        </a>{' '}
        for why they are bad.
        <br />
        Anyway, here is an example of combining layout, generators and scales to
        create a pie chart.
      </PageDescription>
      <PageMain>
        <div className="flex w-full">
          <svg
            ref={svgRef}
            width={SVG_WIDTH}
            height={SVG_HEIGHT}
            className="bg-slate-200 w-2/3"
          ></svg>
          <div className="w-1/3">
            <div className="ml-1 border-2 h-full flex flex-col px-2">
              <div className="form-control">
                <label
                  htmlFor="innerRadius"
                  className="label"
                >
                  <span className="label-text">
                    Inner Radius ({innerRadius})
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={innerRadius}
                  onChange={(e) => setInnerRadius(+e.target.value)}
                  className="range range-primary range-sm"
                />
              </div>
              <div className="form-control">
                <label
                  htmlFor="outerRadius"
                  className="label"
                >
                  <span className="label-text">
                    Outer Radius ({outerRadius})
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={outerRadius}
                  onChange={(e) => setOuterRadius(+e.target.value)}
                  className="range range-primary  range-sm"
                />
              </div>
              <div className="form-control">
                <label
                  htmlFor="cornerRadius"
                  className="label"
                >
                  <span className="label-text">
                    Corner Radius ({cornerRadius})
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(+e.target.value)}
                  className="range range-primary  range-sm"
                />
              </div>

              <div className="form-control">
                <label
                  htmlFor="textInnerRadius"
                  className="label"
                >
                  <span className="label-text">
                    Text Inner Radius ({textInnerRadius})
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={textInnerRadius}
                  onChange={(e) => {
                    if (textRadiusSynced) {
                      setTextOuterRadius(+e.target.value)
                    }
                    setTextInnerRadius(+e.target.value)
                  }}
                  className="range range-primary  range-sm"
                />
              </div>
              <div className="form-control">
                <label
                  htmlFor="textOuterRadius"
                  className="label"
                >
                  <span className="label-text">
                    Text Outer Radius ({textOuterRadius})
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={textOuterRadius}
                  onChange={(e) => {
                    if (textRadiusSynced) {
                      setTextInnerRadius(+e.target.value)
                    }
                    setTextOuterRadius(+e.target.value)
                  }}
                  className="range range-primary range-sm"
                />
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Sync Text Radius</span>
                  <input
                    type="checkbox"
                    checked={textRadiusSynced}
                    onChange={(e) => setTextRadiusSynced(e.target.checked)}
                    className="checkbox checkbox-primary  checkbox-sm"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </PageMain>
    </PageContainer>
  )
}
