import { Card } from '@/components/ui/Card'
import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
}: {
  title: string
  description: ReactNode
}) {
  return (
    <Card className="border-dashed bg-muted/40 px-6 py-16 text-center">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </Card>
  )
}