import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Webhook } from 'lucide-react'

function ApiNode({ data }: { data?: any }) {
  return (
    <div className="flex items-center gap-3 bg-white border rounded-2xl px-4 py-2 shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-amber-500 border-2 border-white"
      />
      <div
        className="p-2 rounded-lg h-8 w-8 flex items-center justify-center"
        style={{ backgroundColor: data?.bgColor || '#fef3c7' }}
      >
        <Webhook className="h-4 w-4 text-amber-700" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500 font-medium">API</span>
        <h2 className="font-semibold text-sm">{data?.label || 'API Request'}</h2>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-amber-500 border-2 border-white"
      />
    </div>
  )
}

export default ApiNode