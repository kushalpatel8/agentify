import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Square } from 'lucide-react'

function EndNode() {
  return (
    <div className="flex items-center gap-2 bg-white border rounded-2xl px-4 py-2 shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-red-500 border-2 border-white"
      />
      <div className="p-2 rounded-lg bg-red-100 h-8 w-8 flex items-center justify-center">
        <Square className="h-4 w-4 text-red-700 fill-red-700" />
      </div>
      <h2 className="font-semibold text-sm">End</h2>
    </div>
  )
}

export default EndNode