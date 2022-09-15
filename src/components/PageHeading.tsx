import { PropsWithChildren } from 'react'

export default function PageHeading({ children }: PropsWithChildren) {
  return (
    <header className="py-4">
      <h1 className="font-bold tracking-wider text-3xl">{children}</h1>
    </header>
  )
}
