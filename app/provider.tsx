'use client';

import React, { useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useSubscription } from '@clerk/nextjs/experimental';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';
import { WorkflowContext } from '@/context/WorkflowContext';
import { Node, Edge } from '@xyflow/react';

function Provider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { has, sessionClaims, isLoaded: isAuthLoaded } = useAuth();
  const { data: subscription, isLoading: isSubscriptionLoading } = useSubscription();
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

  // Check active subscription from all available Clerk sources
  const clerkSubPlan = subscription?.subscriptionItems?.find((item: any) => {
    const planName = (item.plan?.name || item.plan?.slug || item.plan?.key || '').toLowerCase();
    const isActiveStatus = item.status === 'active' || item.status === 'trialing';
    return isActiveStatus && planName !== 'free' && planName !== '';
  })?.plan?.name;

  const isUnlimitedPlan = Boolean(
    clerkSubPlan ||
    (subscription && ((subscription.status as string) === 'active' || (subscription.status as string) === 'trialing') &&
      subscription.subscriptionItems?.some((item: any) => (item.plan?.name || item.plan?.slug || '').toLowerCase() !== 'free')) ||
    (has && (
      has({ plan: 'Unlimited_plan' }) ||
      has({ plan: 'unlimited_plan' }) ||
      has({ plan: 'unlimited' }) ||
      has({ plan: 'user:Unlimited_plan' }) ||
      has({ plan: 'user:unlimited_plan' }) ||
      has({ plan: 'user:unlimited' })
    )) ||
    (typeof (sessionClaims as any)?.plans === 'string' &&
      ((sessionClaims as any).plans.toLowerCase().includes('unlimited') || (sessionClaims as any).plans.toLowerCase().includes('plan'))) ||
    (typeof (sessionClaims as any)?.pla === 'string' &&
      ((sessionClaims as any).pla.toLowerCase().includes('unlimited') || (sessionClaims as any).pla.toLowerCase().includes('plan'))) ||
    Boolean(user?.publicMetadata?.subscription || user?.unsafeMetadata?.subscription)
  );

  const activeSubscriptionName = clerkSubPlan || (isUnlimitedPlan ? 'Unlimited_plan' : undefined);

  // Sync authenticated Clerk user and subscription with Convex userTable
  useEffect(() => {
    if (user) {
      createAndGetUser();
    }
  }, [user, activeSubscriptionName]);

  const createAndGetUser = async () => {
    if (!user) return;

    try {
      const result = await createNewUser({
        name: user.fullName || user.username || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        subscription: activeSubscriptionName,
      });

      setUserDetail({
        ...result,
        subscription: activeSubscriptionName || result?.subscription,
      });
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
