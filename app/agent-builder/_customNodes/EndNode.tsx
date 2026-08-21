import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Play } from 'lucide-react'

function StartNode() {
  return (
    <div className="flex items-center gap-2 bg-white border rounded-2xl px-4 py-2 shadow-sm">
      <div className="p-2 rounded-lg bg-yellow-100 h-8 w-8 flex items-center justify-center">
        <Play className="h-4 w-4 text-yellow-700 fill-yellow-700" />
      </div>
      <h2 className="font-semibold text-sm">Start</h2>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
    </div>
  )
}

export default StartNode