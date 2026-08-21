import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Repeat } from 'lucide-react'
import { Input } from '@/components/ui/input'

function WhileNode({ data }: { data?: any }) {
  return (
    <div className="bg-white border rounded-2xl p-3 shadow-sm min-w-45">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <div
          className="p-2 rounded-lg h-8 w-8 flex items-center justify-center"
          style={{ backgroundColor: data?.bgColor || '#f3e8ff' }}
        >
          <Repeat className="h-4 w-4 text-purple-700" />
        </div>
        <h2 className="font-semibold text-sm">While</h2>
      </div>

      <div className="relative max-w-35">
        <Input
          placeholder="While condition"
          disabled
          className="text-xs h-7 bg-gray-50"
          value={data?.settings?.whileCondition || ''}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{ top: '50%', right: '-18px' }}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
      </div>
    </div>
  )
}

export default WhileNode