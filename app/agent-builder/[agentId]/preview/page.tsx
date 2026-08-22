'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ReactFlow, ReactFlowProvider, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

import Header from '../../_components/Header'
import ChatUI from './_components/ChatUI';
import { nodeTypes } from '../page';
import { Agent } from '@/types/Agent';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

function PreviewAgent() {
  const { agentId } = useParams();
  const convex = useConvex();

  const [agentDetail, setAgentDetail] = useState<Agent>();
  const [loading, setLoading] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string>('');

  const updateAgentToolConfig = useMutation(api.agent.UpdateAgentToolConfig);

  // 1. Fetch Agent Details on Mount
  useEffect(() => {
    if (agentId) {
      getAgentDetails();
      getConversationId();
    }
  }, [agentId]);

  const getAgentDetails = async () => {
    try {
      const result = await convex.query(api.agent.GetAgentById, {
        agentId: agentId as string,
      });
      setAgentDetail(result);
      return result;
    } catch (error) {
      console.error('Error fetching agent detail:', error);
    }
  };

  // 2. Fetch or Generate unique Conversation Session ID
  const getConversationId = async () => {
    try {
      const res = await axios.get('/api/agent-chat');
      if (res.data) {
        setConversationId(res.data);
      }
    } catch (error) {
      console.error('Error generating conversation ID:', error);
    }
  };

  // 3. Generate Flow Tool Config using LLM & Update Convex DB
  const generateAgentToolConfig = async (detail?: Agent) => {
    const agent = detail ?? agentDetail;
    if (!agent?._id) return;
    if (!agent?.nodes || agent.nodes.length === 0) {
      toast.error('No nodes found. Please add nodes to your workflow first.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/generate-agent-tool-config', {
        jsonConfig: {
          nodes: agent.nodes,
          edges: agent.edges,
        },
      });

      if (res.data) {
        await updateAgentToolConfig({
          id: agent._id,
          agentToolConfig: res.data,
        });
        toast.success('Agent rebooted with new config!');
        await getAgentDetails();
      }
    } catch (error) {
      console.error('Error rebooting agent:', error);
      toast.error('Failed to generate agent tool configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col'>
      {/* Top Header with Close Preview button */}
      <Header agentDetail={agentDetail} previewHeader={true} />

      {/* Main Split Layout: Flow View (Left) vs Chat UI (Right) */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-5 h-[90vh]'>
        {/* Left 3 Columns: Read-only Flow Preview */}
        <div className='md:col-span-3 border border-gray-200 rounded-2xl relative h-full overflow-hidden bg-gray-50'>
          <h2 className='absolute top-4 left-4 z-10 font-bold text-sm bg-white px-3 py-1 rounded-lg border shadow-sm'>
            Workflow Preview
          </h2>

          <ReactFlowProvider>
            <ReactFlow
              nodes={agentDetail?.nodes || []}
              edges={agentDetail?.edges || []}
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              fitView
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Right 1 Column: Chat UI or Reboot Trigger */}
        <div className='md:col-span-1 border border-gray-200 rounded-2xl h-full flex flex-col bg-white overflow-hidden'>
          {agentDetail?.agentToolConfig && typeof agentDetail.agentToolConfig === 'object' ? (
            <ChatUI
              agentDetail={agentDetail}
              conversationId={conversationId}
              loading={loading}
              generateToolConfig={generateAgentToolConfig}
            />
          ) : (
            <div className='flex flex-col items-center justify-center h-full p-6 text-center gap-3'>
              <h3 className='font-semibold text-gray-700'>No Config Generated</h3>
              <p className='text-xs text-gray-500'>
                {(!agentDetail?.nodes || agentDetail.nodes.length === 0)
                  ? 'Your workflow is empty. Please add nodes in the builder and save before rebooting.'
                  : 'Click "Reboot Agent" to compile your visual workflow into executable instructions and tools.'}
              </p>
              <Button
                onClick={() => generateAgentToolConfig()}
                disabled={loading || !agentDetail?.nodes || agentDetail.nodes.length === 0}
                className='cursor-pointer mt-2 flex items-center gap-2'
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Generating...' : 'Reboot Agent'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewAgent;