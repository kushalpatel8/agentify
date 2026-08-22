import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import AppSidebar from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'

function DashboardProvider({children}:any) {
  return (
    <div className='min-h-screen relative w-full flex bg-[#FAF7F2] text-stone-900'>
      <SidebarProvider className="z-10">
          <AppSidebar />
          <div className='w-full'>
              <AppHeader />
              {children}
          </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardProvider