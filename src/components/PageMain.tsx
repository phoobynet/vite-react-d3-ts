import { PropsWithChildren } from 'react'

export default function PageMain({ children }: PropsWithChildren) {
  return <main className="py-4">{children}</main>
}
