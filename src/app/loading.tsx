import { Spinner } from '@/components/ui/spinner'
import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className='size-9' />        
      </div>
    </div>
  )
}
