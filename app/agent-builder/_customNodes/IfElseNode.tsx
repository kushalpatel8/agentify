import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { GitBranch } from 'lucide-react'
import { Input } from '@/components/ui/input'

function IfElseNode({ data }: { data?: any }) {
  return (
    <div className="bg-white border rounded-2xl p-3 shadow-sm min-w-45">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-orange-500 border-2 border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <div
          className="p-2 rounded-lg h-8 w-8 flex items-center justify-center"
          style={{ backgroundColor: data?.bgColor || '#ffedd5' }}
        >
          <GitBranch className="h-4 w-4 text-orange-700" />
        </div>
        <h2 className="font-semibold text-sm">If/Else</h2>
      </div>

      <div className="flex flex-col gap-2 max-w-35 relative">
        <div className="relative">
          <Input
            placeholder="If condition"
            disabled
            className="text-xs h-7 bg-gray-50"
            value={data?.settings?.ifCondition || ''}
          />
          <Handle
            id="if"
            type="source"
            position={Position.Right}
            style={{ top: '50%', right: '-18px' }}
            className="w-3 h-3 bg-green-500 border-2 border-white"
          />
        </div>

        <div className="relative">
          <Input
            placeholder="Else"
            disabled
            className="text-xs h-7 bg-gray-50"
            value="Else"
          />
          <Handle
            id="else"
            type="source"
            position={Position.Right}
            style={{ top: '50%', right: '-18px' }}
            className="w-3 h-3 bg-red-500 border-2 border-white"
          />
        </div>
      </div>
    </div>
  )
}

export default IfElseNode