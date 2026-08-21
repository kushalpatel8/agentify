import React, { useContext } from 'react'
import {
    Bot,
    Square,
    Merge,
    Repeat,
    ThumbsUp,
    Webhook,
    Brain,
} from "lucide-react";
import { WorkflowContext } from '@/context/WorkflowContext';

export const AgentTools = [
    {
        name: "Agent",
        icon: Bot,
        bgColor: "#CDF7E3", // Light mint green
        id: "agent",
        type: "AgentNode",
    },
    {
        name: "End",
        icon: Square,
        bgColor: "#FFE3E3", // Soft pastel red
        id: "end",
        type: "EndNode",
    },
    {
        name: "If/Else",
        icon: Merge,
        bgColor: "#FFF3CD", // Light pastel yellow
        id: "ifElse",
        type: "IfElseNode",
    },
    {
        name: "While",
        icon: Repeat,
        bgColor: "#E3F2FD", // Light blue
        id: "while",
        type: "WhileNode",
    },
    {
        name: "User Approval",
        icon: ThumbsUp,
        bgColor: "#EADCFF", // Light lavender
        id: "approval",
        type: "ApprovalNode",
    },
    {
        name: "API",
        icon: Webhook,
        bgColor: "#D1F0FF", // Light cyan
        id: "api",
        type: "ApiNode",
    },
];

function AgentToolsPanel() {

    const {addedNodes, setAddedNodes} = useContext(WorkflowContext);

    const onAgentToolClick = (tool:any) => {
        const newNode = {
            id: `${tool.id}-${Date.now()}`,
            position: {x:0, y:100},
            data:{label:tool.name, bgColor:tool.bgColor, id:tool.id, type:tool.type},
            type:tool.type
        }
        setAddedNodes((prev:any) =>[...prev, newNode])
    }

    return (
        <div className='bg-white p-5 rounded-2xl shadow'>
            <h2 className='flex items-center gap-2 font-semibold mb-4 text-gray-700'> <Brain /> AI Agent Tools</h2>
            <div>
                {AgentTools.map((tool, index) =>(
                    <div key={index} className='flex items-center gap-3 p-2 cursor-pointer
                     hover:bg-gray-100 rounded-xl' onClick={()=>onAgentToolClick}>
                        <tool.icon className='p-2 rounded-lg h-8 w-8'
                        style={{
                            backgroundColor: tool.bgColor
                        }}
                        />
                        <h2 className='text-sm font-medium text-gray-700'>{tool.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AgentToolsPanel