import { Button } from '@/components/ui/button'
import { ChevronLeft, Code2, Play } from 'lucide-react'
import React from 'react'

function Header() {
  return (
    <div className='w-full p-3 flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
            <ChevronLeft className='h-8 w-8'  />
            <h2 className='text-xl'>Agent Name</h2>
        </div>
        <div className='flex items-center gap-3'>
            <Button variant={'ghost'}> <Code2 /> Code </Button>
            <Button> <Play /> Preview </Button>
            <Button>Publish</Button>
        </div>
    </div>
  )
}

export default Header