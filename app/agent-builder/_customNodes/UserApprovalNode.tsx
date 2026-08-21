import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { ThumbsUp } from 'lucide-react'

function UserApprovalNode({ data }: { data?: any }) {
  return (
    <div className="bg-white border rounded-2xl p-3 shadow-sm min-w-45">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-emerald-500 border-2 border-white"
      />
      <div className="flex items-center gap-2 mb-2">
        <div
          className="p-2 rounded-lg h-8 w-8 flex items-center justify-center"
          style={{ backgroundColor: data?.bgColor || '#d1fae5' }}
        >
          <ThumbsUp className="h-4 w-4 text-emerald-700" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-medium">User Approval</span>
          <h2 className="font-semibold text-sm">{data?.label || 'Approval'}</h2>
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-35 mt-2">
        <div className="relative">
          <div className="w-full text-xs h-7 bg-gray-50 text-green-700 border border-green-200 rounded-md flex items-center justify-center opacity-70 select-none">
            Approve
          </div>
          <Handle
            id="approve"
            type="source"
            position={Position.Right}
            style={{ top: '50%', right: '-18px' }}
            className="w-3 h-3 bg-green-500 border-2 border-white"
          />
        </div>

        <div className="relative">
          <div className="w-full text-xs h-7 bg-gray-50 text-red-700 border border-red-200 rounded-md flex items-center justify-center opacity-70 select-none">
            Reject
          </div>
          <Handle
            id="reject"
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

export default UserApprovalNode