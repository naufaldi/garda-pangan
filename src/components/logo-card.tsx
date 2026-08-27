import type * as React from 'react'

import { Card, CardContent } from '#/components/ui/card'
import { cn } from '#/lib/utils'

type LogoCardProps = React.ComponentPropsWithoutRef<typeof Card> & {
  className?: string
  compact?: boolean
}

export function LogoCard({
  children,
  className,
  compact = false,
  ...props
}: LogoCardProps) {
  return (
    <Card
      className={cn(
        'rounded-[0.75rem] border-transparent bg-[#f8f8f8] py-0 shadow-none',
        className,
      )}
      {...props}
    >
      <CardContent
        className={cn(
          'flex items-center justify-center',
          compact ? 'min-h-0 px-2 py-0' : 'min-h-[10.5rem] px-3 py-10',
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}
