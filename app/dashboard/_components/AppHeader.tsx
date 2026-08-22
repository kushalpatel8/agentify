import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader() {
  return (
    <div className='flex justify-between items-center w-full p-4 border-b border-amber-100 bg-[#FAF7F2] sticky top-0 z-50 shadow-sm'>
        <SidebarTrigger/>
        <UserButton />
    </div>
  )
}

export default AppHeader