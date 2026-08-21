"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { WorkflowContext } from '@/context/WorkflowContext';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React, { useEffect, useState } from 'react'
import StartNode from './agent-builder/_customNodes/StartNode';
import { ReactFlowProvider } from '@xyflow/react';

const Provider = ({ children }:Readonly<{children: React.ReactNode}>) => {

    const {user} = useUser();
    const CreateUser = useMutation(api.user.CreateNewUser);
    const [userDetail, setUserDetail] = useState<any>();
    const [selectedNode, setSelectedNode] = useState<any>();
    const [addedNodes, setAddedNodes] = useState([{
        id: 'start',
        position: {x:0, y:0},
        data:{label: 'Start'},
        type: 'StartNode'
    }]); 
    const [nodeEdges, setNodeEdges] = useState([]);

    useEffect(() => {
        user && CreateAndGetUser();
    },[user])

    const CreateAndGetUser = async () => {
        if(user) {
            const result = await CreateUser({
                name:user.fullName??'',
                email:user.primaryEmailAddress?.emailAddress??''
            });
            setUserDetail(result);
        }
    }

    return (
        <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
            <ReactFlowProvider>
                <WorkflowContext.Provider value={{addedNodes, setAddedNodes, nodeEdges, setNodeEdges, selectedNode, setSelectedNode}}>
                    <div>{children}</div>
                </WorkflowContext.Provider>
            </ReactFlowProvider>
        </UserDetailContext.Provider>
    );
}

export default Provider;
