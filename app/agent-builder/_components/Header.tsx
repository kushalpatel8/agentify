'use client'
import { Button } from '@/components/ui/button'
import { Agent } from '@/types/Agent'
import { ChevronLeft, Code2, Globe, GlobeLock, Loader2, Play, X } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'
import PublishCodeDialog from './PublishCodeDialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

type Props = {
  agentDetail: Agent | undefined
  previewHeader?: boolean
}

function Header({ agentDetail, previewHeader = false }: Props) {
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const publishAgent = useMutation(api.agent.PublishAgent);

  const handlePublish = async () => {
    if (!agentDetail?._id) return;
    const next = !agentDetail.publish;
    setPublishing(true);
    try {
      await publishAgent({ id: agentDetail._id, publish: next });
      toast.success(next ? 'Agent published! 🚀' : 'Agent unpublished.');
    } catch {
      toast.error('Failed to update publish status.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className='w-full p-3 flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
            <ChevronLeft className='h-8 w-8' />
            <h2 className='text-xl'>{agentDetail?.name}</h2>
        </div>
        <div className='flex items-center gap-3'>
            <Button variant={'ghost'} onClick={() => setOpenCodeDialog(true)}> <Code2 /> Code </Button>
            {!previewHeader ? <Link href={`/agent-builder/${agentDetail?.agentId}/preview`}>
              <Button> <Play /> Preview </Button>
            </Link> :
            <Link href={`/agent-builder/${agentDetail?.agentId}`}>
              <Button variant={'outline'}> <X /> Close Preview </Button>
            </Link>}
            <Button
              onClick={handlePublish}
              disabled={publishing || !agentDetail?._id}
              variant={agentDetail?.publish ? 'outline' : 'default'}
            >
              {publishing
                ? <Loader2 className='animate-spin h-4 w-4 mr-1' />
                : agentDetail?.publish
                  ? <><GlobeLock className='h-4 w-4 mr-1' /> Unpublish</>
                  : <><Globe className='h-4 w-4 mr-1' /> Publish</>
              }
            </Button>
        </div>

        <PublishCodeDialog
          openDialog={openCodeDialog}
          setOpenDialog={setOpenCodeDialog}
          agentId={agentDetail?.agentId ?? ''}
        />
    </div>
  )
}

export default Header