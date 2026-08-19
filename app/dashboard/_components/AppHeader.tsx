import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader() {
  return (
    <div className='flex justify-between items-center w-full p-4 shadow bg-sidebar'>
        <SidebarTrigger/>
        <UserButton />
    </div>
  )
}

export default AppHeader