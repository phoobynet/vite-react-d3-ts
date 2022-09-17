import Line from '@/components/Line'
import PageContainer from '@/components/PageContainer'
import PageDescription from '@/components/PageDescription'
import PageHeading from '@/components/PageHeading'
import PageMain from '@/components/PageMain'

export default function LineMaker() {
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
        <Line data={[]}></Line>
      </PageMain>
    </PageContainer>
  )
}
