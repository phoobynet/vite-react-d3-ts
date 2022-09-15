import { PropsWithChildren } from 'react'

export default function PageContainer({ children }: PropsWithChildren) {
  return <div className="container mx-auto max-w-5xl">{children}</div>
}
