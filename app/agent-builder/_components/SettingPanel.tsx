import { WorkflowContext } from '@/context/WorkflowContext';
import React, { useContext } from 'react';
import AgentSettings from '../_nodeSettings/AgentSettings';
import EndSettings from '../_nodeSettings/EndSettings';
import IfElseSettings from '../_nodeSettings/IfElseSettings';
import WhileSettings from '../_nodeSettings/WhileSettings';
import UserApprovalSettings from '../_nodeSettings/UserApprovalSettings';
import ApiSettings from '../_nodeSettings/ApiSettings';

function SettingPanel() {
  const { selectedNode, setAddedNodes } = useContext(WorkflowContext);

  const onUpdateNodeData = (formData: any) => {
    if (!selectedNode) return;

    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: formData?.name || selectedNode.data?.label,
        settings: formData,
      },
    };

    setAddedNodes((prevNodes: any) =>
      prevNodes.map((node: any) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
  };

  return selectedNode && (
    <div className='p-5 bg-white rounded-2xl w-87.5 shadow max-h-[80vh] overflow-y-auto'>
      {selectedNode?.type === 'AgentNode' && (
        <AgentSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === 'EndNode' && (
        <EndSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === 'IfElseNode' && (
        <IfElseSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === 'WhileNode' && (
        <WhileSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === 'UserApprovalNode' && (
        <UserApprovalSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}

      {selectedNode?.type === 'ApiNode' && (
        <ApiSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )}
    </div>
  );
}

export default SettingPanel;