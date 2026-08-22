'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';
import { WorkflowContext } from '@/context/WorkflowContext';
import { Node, Edge } from '@xyflow/react';

function Provider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>(null);

  // Workflow Context States (Canvas Nodes, Edges & Active Selection)
  const [addedNodes, setAddedNodes] = useState<Node[]>([
    {
      id: 'start',
      position: { x: 0, y: 0 },
      data: { label: 'start' },
      type: 'StartNode',
    },
  ]);
  const [nodeEdges, setNodeEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const createNewUser = useMutation(api.user.CreateNewUser);

  // Sync authenticated Clerk user with Convex userTable
  useEffect(() => {
    if (user) {
      createAndGetUser();
    }
  }, [user]);

  const createAndGetUser = async () => {
    if (!user) return;

    try {
      const result = await createNewUser({
        name: user.fullName || user.username || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
      });

      setUserDetail(result);
    } catch (error) {
      console.error('Error creating or fetching user:', error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <WorkflowContext.Provider
        value={{
          addedNodes,
          setAddedNodes,
          nodeEdges,
          setNodeEdges,
          selectedNode,
          setSelectedNode,
        }}
      >
        {children}
      </WorkflowContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default Provider;
