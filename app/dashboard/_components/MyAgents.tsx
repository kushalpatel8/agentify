'use client';
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/Agent';
import { useConvex } from 'convex/react';
import { GitBranchPlus } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import Link from 'next/link';

function MyAgents() {
    const { userDetail } = useContext(UserDetailContext);
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const convex = useConvex();

    useEffect(()=>{
        userDetail && GetUserAgents();
    },[userDetail])

    const GetUserAgents = async () => {
        const result = await convex.query(api.agent.GetUsersAgents, {
            userId:userDetail?._id
        });
        setAgentList(result);
    }

    return (
        <div className='w-full mt-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {agentList.map((agent, index)=>(
                    <Link href={'/agent-builder/'+agent.agentId} key={index} className='p-3 border rounded-2xl shadow'>
                        <GitBranchPlus  className='bg-yellow-100 p-2 h-8 w-8 rounded-sm'/>
                        <h2 className='mt-3'>{agent.name}</h2>
                        <h2 className='text-sm text-gray-400 mt-2'>{moment(agent._creationTime).fromNow()}</h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default MyAgents