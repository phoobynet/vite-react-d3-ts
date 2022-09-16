import { PropsWithChildren } from 'react'

export default function PageDescription({ children }: PropsWithChildren) {
  return (
    <div className="py-2">
      <p>{children}</p>
    </div>
  )
}
