'use client';
import React, { useContext } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Database, Gem, Headphones, LayoutDashboard, User, User2Icon, WalletCards } from 'lucide-react'
import { UserAvatar } from '@clerk/nextjs'
import Link from 'next/link'
import { UserDetailContext } from '@/context/UserDetailContext';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const MenuOptions = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard
    },
    {
        title: 'AI Agents',
        url: '/dashboard/my-agents',
        icon: Headphones
    },
    {
        title: 'Pricing',
        url: '/dashboard/pricing',
        icon: WalletCards
    },
    {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: User2Icon
    },
]

function AppSidebar() {
    const {open} = useSidebar();
    const {userDetail, setUserDetails} = useContext(UserDetailContext);
    const path = usePathname();
  return (
    <Sidebar collapsible='icon' className="border-r-stone-800">
      <SidebarHeader>
        <div className='flex gap-2 items-center'>
            <Image src = {'/logo.svg'} alt = 'logo' width = {35} height = {35}/>
            {open && <h2 className='font-bold text-lg'>Agentify</h2>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel className="text-stone-400 uppercase tracking-wider"></SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {MenuOptions.map((menu, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton size={open ?'lg' : 'default'} isActive={path == menu.url} className="text-amber-500 hover:bg-stone-800 hover:text-amber-400 data-[active=true]:bg-stone-800/50 data-[active=true]:text-amber-400">
                                <Link href={menu.url} className="flex items-center gap-2 w-full">
                                    <menu.icon />
                                    <span>{menu.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter className='mb-10'>
        <div className='flex gap-2 items-center'>
            <Gem className={userDetail?.subscription ? 'text-yellow-400' : ''} />
            {open && (
              <h2>
                {userDetail?.subscription ? (
                  <span className='font-bold text-yellow-400'>Unlimited</span>
                ) : (
                  <>Remaining Credits : <span className='font-bold'>{userDetail?.token ?? 0}</span></>
                )}
              </h2>
            )}
        </div>
        {open && !userDetail?.subscription && (
          <Link href='/dashboard/pricing'><Button className='w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium border-0'>Upgrade to Unlimited</Button></Link>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar