'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  Panel,
  Node,
  Edge,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnSelectionChangeParams,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

import Header from '../_components/Header';
import AgentToolsPanel from '../_components/AgentToolsPanel';
import SettingPanel from '../_components/SettingPanel';

// Custom Nodes
import StartNode from '../_customNodes/StartNode';
import AgentNode from '../_customNodes/AgentNode';
import EndNode from '../_customNodes/EndNode';
import IfElseNode from '../_customNodes/IfElseNode';
import WhileNode from '../_customNodes/WhileNode';
import UserApprovalNode from '../_customNodes/UserApprovalNode';
import ApiNode from '../_customNodes/ApiNode';

import { WorkflowContext } from '@/context/WorkflowContext';
import { Agent } from '@/types/Agent';
import { Button } from '@/components/ui/button';

// Exported nodeTypes mapping so the Preview page can reuse the exact registry
export const nodeTypes = {
  startNode: StartNode,
  agentNode: AgentNode,
  endNode: EndNode,
  ifElseNode: IfElseNode,
  whileNode: WhileNode,
  userApprovalNode: UserApprovalNode,
  apiNode: ApiNode,
};

function AgentBuilder() {
  const { agentId } = useParams();
  const convex = useConvex();

  const [agentDetail, setAgentDetail] = useState<Agent>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Workflow Context
  const {
    addedNodes,
    setAddedNodes,
    nodeEdges,
    setNodeEdges,
    selectedNode,
    setSelectedNode,
  } = useContext(WorkflowContext);

  const updateAgentDetail = useMutation(api.agent.UpdateAgentDetail);

  // 1. Fetch Agent data by agentId from Convex
  useEffect(() => {
    if (agentId) {
      getAgentDetails();
    }
  }, [agentId]);

  const getAgentDetails = async () => {
    try {
      const result = await convex.query(api.agent.GetAgentById, {
        agentId: agentId as string,
      });
      setAgentDetail(result);
    } catch (error) {
      console.error('Error fetching agent:', error);
    }
  };

  // 2. Hydrate canvas nodes and edges when agent data arrives
  useEffect(() => {
    if (agentDetail) {
      if (agentDetail.nodes && agentDetail.nodes.length > 0) {
        setNodes(agentDetail.nodes);
        setAddedNodes(agentDetail.nodes);
      }
      if (agentDetail.edges && agentDetail.edges.length > 0) {
        setEdges(agentDetail.edges);
        setNodeEdges(agentDetail.edges);
      }
    }
  }, [agentDetail]);

  // 3. Sync local canvas state whenever new nodes are added via AgentToolsPanel
  useEffect(() => {
    if (addedNodes && addedNodes.length > 0) {
      setNodes(addedNodes);
    }
  }, [addedNodes]);

  // 4. Handle Node position / state changes
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((currentNodes) => {
        const updated = applyNodeChanges(changes, currentNodes);
        setAddedNodes(updated);
        return updated;
      });
    },
    [setAddedNodes]
  );

  // 5. Handle Edge changes
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((currentEdges) => {
        const updated = applyEdgeChanges(changes, currentEdges);
        setNodeEdges(updated);
        return updated;
      });
    },
    [setNodeEdges]
  );

  // 6. Handle Connecting two node handles
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) => {
        const updated = addEdge(connection, currentEdges);
        setNodeEdges(updated);
        return updated;
      });
    },
    [setNodeEdges]
  );

  // 7. Handle Node selection (opens dynamic SettingPanel for selected node)
  const onSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      if (nodes && nodes.length > 0) {
        setSelectedNode(nodes[0]);
      } else {
        setSelectedNode(null);
      }
    },
    [setSelectedNode]
  );

  // 8. Manual Save workflow (nodes & edges) to Convex
  const saveNodesAndEdges = async () => {
    if (!agentDetail?._id) return;

    try {
      await updateAgentDetail({
        id: agentDetail._id,
        nodes: nodes,
        edges: edges,
      });
      toast.success('Workflow saved successfully!');
    } catch (error) {
      toast.error('Failed to save workflow.');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Top Header */}
      <Header agentDetail={agentDetail} />

      {/* Canvas Workspace */}
      <div className="w-full h-[90vh] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

          {/* Left Panel: Available Tool Nodes Palette */}
          <Panel position="top-left">
            <AgentToolsPanel />
          </Panel>

          {/* Right Panel: Selected Node Settings */}
          {selectedNode && (
            <Panel position="top-right">
              <SettingPanel />
            </Panel>
          )}

          {/* Bottom Floating Save Button */}
          <Panel position="bottom-center">
            <Button
              onClick={saveNodesAndEdges}
              className="shadow-lg px-6 py-2 rounded-full cursor-pointer"
            >
              Save
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export default AgentBuilder;