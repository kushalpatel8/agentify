import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyAgents from './MyAgents'

function AiAgentsTab() {
  return (
    <div className='px-10 md:px-24 lg:px-32 mt-14'>
        <Tabs defaultValue="myagents" className="w-full">
            <TabsList>
                <TabsTrigger value="myagents">My Agents</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            <TabsContent value="myagents"><MyAgents /></TabsContent>
            <TabsContent value="templates">Change your password here.</TabsContent>
        </Tabs>
    </div>
  )
}

export default AiAgentsTab